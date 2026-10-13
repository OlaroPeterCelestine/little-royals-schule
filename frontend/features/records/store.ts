"use client"

import { create } from "zustand"
import { can } from "@/config/permissions"
import { school } from "@/config/school"
import { dataSource, liveUnavailableMessage } from "@/lib/api-client"
import { createSeed } from "@/features/records/seed"
import type {
  ApplicationDocuments,
  ApplicationStatus,
  AttendanceStatus,
  AuditEvent,
  CalendarItem,
  InvoiceLine,
  PaymentMethod,
  RegisterData,
  RegisterMark,
  Result,
  SessionName,
  SessionUser,
} from "@/features/records/types"
import {
  applicationNeedsReason,
  canTransitionApplication,
  canTransitionMark,
  enrollmentBlock,
  findDuplicateStudent,
  invoiceCharged,
  invoiceGross,
  nextNumber,
  normalizeName,
  registerKey,
  reversalBlock,
  validatePayment,
  validateScore,
  wholeShillings,
} from "@/features/records/workflows"

const STORAGE_KEY = "littleroyals-erp-register"
const VERSION = 1

export type RegisterState = RegisterData & {
  revision: number
  hydrated: boolean
  unavailable: string | null
  hydrate: () => void
  reset: () => void
  createApplication: (actor: SessionUser, input: ApplicationInput) => Result<string>
  transitionApplication: (actor: SessionUser, id: string, to: ApplicationStatus, extra: TransitionExtra) => Result
  extendOffer: (actor: SessionUser, id: string, date: string) => Result
  enrollApplication: (actor: SessionUser, id: string) => Result<string>
  withdrawStudent: (actor: SessionUser, id: string, reason: string) => Result
  saveRegister: (actor: SessionUser, input: RegisterInput) => Result
  submitRegister: (actor: SessionUser, id: string) => Result
  correctAttendance: (actor: SessionUser, id: string, studentId: string, status: AttendanceStatus, reason: string) => Result
  saveMark: (actor: SessionUser, id: string, score: number, remarks: string) => Result
  advanceMark: (actor: SessionUser, id: string) => Result
  reopenMark: (actor: SessionUser, id: string, reason: string) => Result
  updateDraftInvoice: (actor: SessionUser, id: string, discount: number) => Result
  issueInvoice: (actor: SessionUser, id: string) => Result
  recordPayment: (actor: SessionUser, input: PaymentInput) => Result
  reversePayment: (actor: SessionUser, id: string, reason: string) => Result
  addCalendarItem: (actor: SessionUser, title: string, date: string, termId: string) => Result
  removeCalendarItem: (actor: SessionUser, id: string) => Result
  markNoticeRead: (id: string) => void
  markVisibleNoticesRead: (audience: "staff" | "parent") => void
  logExport: (actor: SessionUser, summary: string) => void
}

export type ApplicationInput = {
  intakeId: string
  applyingClassId: string
  firstName: string
  middleName: string
  lastName: string
  dateOfBirth: string
  gender: string
  priorSchool: string
  address: string
  guardianId: string
  newGuardian?: { name: string; phone: string; email: string; address: string }
  documents: ApplicationDocuments
}

export type TransitionExtra = {
  reason?: string
  interviewOn?: string
  offerExpiresOn?: string
}

export type RegisterInput = {
  classId: string
  date: string
  session: SessionName
  termId: string
  marks: RegisterMark[]
}

export type PaymentInput = {
  invoiceId: string
  receiptAmount: number
  allocateAmount: number
  method: PaymentMethod
  receivedOn: string
  note: string
}

function blank(): RegisterData {
  return {
    accounts: [],
    years: [],
    terms: [],
    intakes: [],
    classes: [],
    guardians: [],
    links: [],
    students: [],
    enrollments: [],
    applications: [],
    registers: [],
    assessments: [],
    marks: [],
    invoices: [],
    payments: [],
    notices: [],
    calendar: [],
    audits: [],
  }
}

function snapshot(state: RegisterState): RegisterData {
  return {
    accounts: state.accounts,
    years: state.years,
    terms: state.terms,
    intakes: state.intakes,
    classes: state.classes,
    guardians: state.guardians,
    links: state.links,
    students: state.students,
    enrollments: state.enrollments,
    applications: state.applications,
    registers: state.registers,
    assessments: state.assessments,
    marks: state.marks,
    invoices: state.invoices,
    payments: state.payments,
    notices: state.notices,
    calendar: state.calendar,
    audits: state.audits,
  }
}

function persist(data: RegisterData) {
  if (typeof window === "undefined" || dataSource() !== "mock") return
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify({ version: VERSION, data }))
}

function readSaved(): RegisterData | null {
  if (typeof window === "undefined") return null
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as { version?: number; data?: RegisterData }
    if (parsed.version !== VERSION || !parsed.data?.students || !parsed.data.applications) return null
    return parsed.data
  } catch {
    return null
  }
}

function deny(actor: SessionUser, permission: Parameters<typeof can>[1]): string | null {
  if (!can(actor.role, permission)) return "Your role cannot do that."
  return null
}

function nowIso(): string {
  return new Date().toISOString()
}

function audit(actor: SessionUser, action: string, entityType: string, entityId: string, summary: string): AuditEvent {
  return {
    id: `audit-${crypto.randomUUID()}`,
    at: nowIso(),
    actorId: actor.id,
    actorName: actor.name,
    action,
    entityType,
    entityId,
    summary,
  }
}

function fail(error: string): Result<never> {
  return { ok: false, error }
}

export const useRegister = create<RegisterState>((set, get) => {
  const initial = dataSource() === "mock" ? createSeed() : blank()

  function commit(partial: Partial<RegisterData>, event?: AuditEvent): void {
    const current = get()
    const audits = event ? [event, ...current.audits].slice(0, 300) : current.audits
    const next = { ...snapshot(current), ...partial, audits }
    set({ ...next, revision: current.revision + 1 })
    persist(next)
  }

  return {
    ...initial,
    revision: 0,
    hydrated: false,
    unavailable: null,
    hydrate: () => {
      if (get().hydrated) return
      if (dataSource() === "live") {
        const empty = blank()
        set({ ...empty, hydrated: true, unavailable: liveUnavailableMessage(), revision: 0 })
        return
      }
      const saved = readSaved()
      if (saved) set({ ...saved, hydrated: true, unavailable: null })
      else set({ hydrated: true, unavailable: null })
    },
    reset: () => {
      if (typeof window !== "undefined") sessionStorage.removeItem(STORAGE_KEY)
      const fresh = createSeed()
      set({ ...fresh, revision: get().revision + 1, hydrated: true, unavailable: null })
    },
    createApplication: (actor, input) => {
      const blocked = deny(actor, "admissions.create")
      if (blocked) return fail(blocked)
      if (!input.firstName.trim() || !input.lastName.trim()) return fail("Enter the applicant's name.")
      if (!/^\d{4}-\d{2}-\d{2}$/.test(input.dateOfBirth) || input.dateOfBirth > school.asOf) {
        return fail("Enter a real date of birth.")
      }
      const state = get()
      const duplicate = findDuplicateStudent(state.students, input)
      if (duplicate) {
        return fail(`A student record already exists (${duplicate.studentNumber}). Open that profile instead of a second record.`)
      }
      const open = state.applications.find(
        (item) =>
          item.status !== "rejected" &&
          item.status !== "enrolled" &&
          normalizeName(item.firstName) === normalizeName(input.firstName) &&
          normalizeName(item.lastName) === normalizeName(input.lastName) &&
          item.dateOfBirth === input.dateOfBirth,
      )
      if (open) return fail(`An open application already exists (${open.number}).`)
      let guardianId = input.guardianId
      let guardians = state.guardians
      if (input.guardianId === "new") {
        const draft = input.newGuardian
        if (!draft?.name.trim() || !draft.phone.trim()) return fail("Enter the guardian's name and phone.")
        const existing = guardians.find((item) => draft.email && item.email.toLowerCase() === draft.email.toLowerCase())
        if (existing) guardianId = existing.id
        else {
          guardianId = `guardian-${crypto.randomUUID()}`
          guardians = [...guardians, { id: guardianId, name: draft.name.trim(), phone: draft.phone.trim(), email: draft.email.trim(), address: draft.address.trim() || input.address }]
        }
      } else if (!guardians.some((item) => item.id === guardianId)) {
        return fail("Choose a guardian.")
      }
      const id = `application-${crypto.randomUUID()}`
      const number = nextNumber(state.applications.map((item) => item.number), "APP-2026")
      const createdAt = nowIso()
      const application = {
        id,
        number,
        intakeId: input.intakeId,
        applyingClassId: input.applyingClassId,
        firstName: input.firstName.trim(),
        middleName: input.middleName.trim(),
        lastName: input.lastName.trim(),
        dateOfBirth: input.dateOfBirth,
        gender: input.gender,
        priorSchool: input.priorSchool.trim(),
        guardianId,
        address: input.address.trim(),
        status: "draft" as const,
        decisionReason: "",
        offerExpiresOn: null,
        interviewOn: null,
        assessmentNote: "",
        documents: input.documents,
        studentId: null,
        createdAt,
        updatedAt: createdAt,
      }
      commit(
        { applications: [application, ...state.applications], guardians },
        audit(actor, "create-application", "application", id, `Created ${number} for ${application.firstName} ${application.lastName}.`),
      )
      return { ok: true, data: id }
    },
    transitionApplication: (actor, id, to, extra) => {
      const permission = to === "submitted" || to === "under_review" ? "admissions.edit" : "admissions.decide"
      const blocked = deny(actor, permission)
      if (blocked) return fail(blocked)
      const state = get()
      const current = state.applications.find((item) => item.id === id)
      if (!current) return fail("Application not found.")
      if (!canTransitionApplication(current.status, to) || to === "enrolled") {
        return fail("That status change is not allowed.")
      }
      const reason = extra.reason?.trim() ?? ""
      if (applicationNeedsReason(to) && reason.length < 3) return fail("Enter a reason.")
      let interviewOn = current.interviewOn
      let offerExpiresOn = current.offerExpiresOn
      if (to === "interview") {
        if (!extra.interviewOn) return fail("Enter the interview date.")
        interviewOn = extra.interviewOn
      }
      if (to === "offered") {
        if (!extra.offerExpiresOn || extra.offerExpiresOn < school.asOf) return fail("Enter an offer expiry on or after the register date.")
        offerExpiresOn = extra.offerExpiresOn
      }
      const applications = state.applications.map((item) =>
        item.id === id
          ? { ...item, status: to, decisionReason: reason || item.decisionReason, interviewOn, offerExpiresOn, updatedAt: nowIso() }
          : item,
      )
      commit(
        { applications },
        audit(actor, "transition-application", "application", id, `${current.number} moved from ${current.status} to ${to}.`),
      )
      return { ok: true, data: undefined }
    },
    extendOffer: (actor, id, date) => {
      const blocked = deny(actor, "admissions.decide")
      if (blocked) return fail(blocked)
      const current = get().applications.find((item) => item.id === id)
      if (!current) return fail("Application not found.")
      if (current.status !== "offered" && current.status !== "accepted") return fail("Only an open offer can be extended.")
      if (date < school.asOf) return fail("Choose an expiry on or after the register date.")
      commit(
        { applications: get().applications.map((item) => (item.id === id ? { ...item, offerExpiresOn: date, updatedAt: nowIso() } : item)) },
        audit(actor, "extend-offer", "application", id, `${current.number} offer now expires ${date}.`),
      )
      return { ok: true, data: undefined }
    },
    enrollApplication: (actor, id) => {
      const blocked = deny(actor, "admissions.enroll")
      if (blocked) return fail(blocked)
      const state = get()
      const application = state.applications.find((item) => item.id === id)
      if (!application) return fail("Application not found.")
      const problem = enrollmentBlock(application, school.asOf)
      if (problem) return fail(problem)
      const duplicate = findDuplicateStudent(state.students, application)
      if (duplicate) return fail(`A student record already exists (${duplicate.studentNumber}).`)
      const studentId = `student-${crypto.randomUUID()}`
      const studentNumber = nextNumber(state.students.map((item) => item.studentNumber), "ST")
      const yearId = state.intakes.find((item) => item.id === application.intakeId)?.yearId ?? state.years[0]?.id ?? ""
      const student = {
        id: studentId,
        studentNumber,
        firstName: application.firstName,
        middleName: application.middleName,
        lastName: application.lastName,
        preferredName: application.firstName,
        dateOfBirth: application.dateOfBirth,
        gender: application.gender,
        status: "active" as const,
        address: application.address,
        nationality: "Ugandan",
        enrolledOn: school.asOf,
        withdrawalReason: "",
      }
      const alreadyLinked = state.links.some((link) => link.studentId === studentId && link.guardianId === application.guardianId)
      const links = alreadyLinked
        ? state.links
        : [...state.links, { id: `link-${crypto.randomUUID()}`, studentId, guardianId: application.guardianId, relationship: "Guardian", billing: true, pickup: true, emergency: true }]
      commit(
        {
          students: [...state.students, student],
          enrollments: [...state.enrollments, { id: `enrollment-${crypto.randomUUID()}`, studentId, classId: application.applyingClassId, academicYearId: yearId, start: school.asOf, end: null }],
          links,
          applications: state.applications.map((item) => (item.id === id ? { ...item, status: "enrolled" as const, studentId, updatedAt: nowIso() } : item)),
        },
        audit(actor, "enroll", "student", studentId, `${application.number} became ${studentNumber}.`),
      )
      return { ok: true, data: studentId }
    },
    withdrawStudent: (actor, id, reason) => {
      const blocked = deny(actor, "students.edit")
      if (blocked) return fail(blocked)
      if (reason.trim().length < 3) return fail("Enter a reason. The student record stays on file.")
      const state = get()
      const pupil = state.students.find((item) => item.id === id)
      if (!pupil) return fail("Student not found.")
      if (pupil.status === "withdrawn") return fail("This student is already withdrawn.")
      commit(
        {
          students: state.students.map((item) => (item.id === id ? { ...item, status: "withdrawn" as const, withdrawalReason: reason.trim() } : item)),
          enrollments: state.enrollments.map((item) => (item.studentId === id && item.end === null ? { ...item, end: school.asOf } : item)),
        },
        audit(actor, "withdraw", "student", id, `${pupil.studentNumber} withdrawn. ${reason.trim()}`),
      )
      return { ok: true, data: undefined }
    },
    saveRegister: (actor, input) => {
      const blocked = deny(actor, "attendance.mark")
      if (blocked) return fail(blocked)
      if (actor.role === "teacher" && !actor.classIds.includes(input.classId)) return fail("You can only mark your own classes.")
      const state = get()
      const id = registerKey(input.classId, input.date, input.session)
      const existing = state.registers.find((item) => item.id === id)
      if (existing?.status === "submitted") return fail("This register is submitted. Use an authorized correction.")
      const yearId = state.terms.find((item) => item.id === input.termId)?.yearId
      const expected = state.enrollments.filter((item) => item.classId === input.classId && item.academicYearId === yearId && item.end === null).map((item) => item.studentId)
      if (expected.length === 0) return fail("This class has no current enrollment.")
      const marked = new Set(input.marks.map((item) => item.studentId))
      if (expected.some((studentId) => !marked.has(studentId)) || input.marks.length !== expected.length) {
        return fail("Mark every pupil on the class list once.")
      }
      const register = {
        id,
        classId: input.classId,
        date: input.date,
        session: input.session,
        termId: input.termId,
        status: "open" as const,
        marks: input.marks,
        markedBy: actor.id,
        submittedAt: null,
        corrections: existing?.corrections ?? [],
      }
      const registers = existing ? state.registers.map((item) => (item.id === id ? register : item)) : [...state.registers, register]
      commit({ registers }, audit(actor, "save-register", "register", id, `Saved ${id}.`))
      return { ok: true, data: undefined }
    },
    submitRegister: (actor, id) => {
      const blocked = deny(actor, "attendance.mark")
      if (blocked) return fail(blocked)
      const state = get()
      const register = state.registers.find((item) => item.id === id)
      if (!register) return fail("Save the register before submitting it.")
      if (actor.role === "teacher" && !actor.classIds.includes(register.classId)) return fail("You can only submit your own classes.")
      if (register.status === "submitted") return fail("This register is already submitted.")
      for (const mark of register.marks) {
        if ((mark.status === "absent" || mark.status === "excused") && mark.reason.trim().length < 3) {
          return fail("Absent and excused marks need a reason.")
        }
      }
      const registers = state.registers.map((item) => (item.id === id ? { ...item, status: "submitted" as const, submittedAt: nowIso() } : item))
      commit({ registers }, audit(actor, "submit-register", "register", id, `Submitted ${id}.`))
      return { ok: true, data: undefined }
    },
    correctAttendance: (actor, id, studentId, status, reason) => {
      const blocked = deny(actor, "attendance.correct")
      if (blocked) return fail(blocked)
      if (reason.trim().length < 3) return fail("Enter the reason for the correction.")
      const state = get()
      const register = state.registers.find((item) => item.id === id)
      if (!register || register.status !== "submitted") return fail("Corrections apply to a submitted register.")
      const mark = register.marks.find((item) => item.studentId === studentId)
      if (!mark) return fail("That pupil is not on this register.")
      if (mark.status === status) return fail("Choose a different status.")
      const registers = state.registers.map((item) => {
        if (item.id !== id) return item
        return {
          ...item,
          marks: item.marks.map((entry) => (entry.studentId === studentId ? { ...entry, status, reason: reason.trim() } : entry)),
          corrections: [...item.corrections, { id: `correction-${crypto.randomUUID()}`, at: nowIso(), actorId: actor.id, studentId, from: mark.status, to: status, reason: reason.trim() }],
        }
      })
      commit({ registers }, audit(actor, "correct-attendance", "register", id, `Corrected ${studentId} from ${mark.status} to ${status}.`))
      return { ok: true, data: undefined }
    },
    saveMark: (actor, id, score, remarks) => {
      const blocked = deny(actor, "exams.enter")
      if (blocked) return fail(blocked)
      const state = get()
      const mark = state.marks.find((item) => item.id === id)
      if (!mark) return fail("Score not found.")
      if (mark.status !== "draft") return fail("Only a draft score can be edited.")
      const assessment = state.assessments.find((item) => item.id === mark.assessmentId)
      if (!assessment) return fail("Assessment not found.")
      if (actor.role === "teacher" && !actor.classIds.includes(assessment.classId)) return fail("You can only enter marks for your classes.")
      const problem = validateScore(score, assessment.maxScore)
      if (problem) return fail(problem)
      const marks = state.marks.map((item) => (item.id === id ? { ...item, score, remarks, graderId: actor.id, updatedAt: nowIso() } : item))
      commit({ marks }, audit(actor, "save-mark", "mark", id, `Saved a draft score of ${score}.`))
      return { ok: true, data: undefined }
    },
    advanceMark: (actor, id) => {
      const state = get()
      const mark = state.marks.find((item) => item.id === id)
      if (!mark) return fail("Score not found.")
      const nextStatus: Partial<Record<typeof mark.status, typeof mark.status>> = {
        draft: "submitted",
        submitted: "moderated",
        moderated: "approved",
        approved: "published",
      }
      const next = nextStatus[mark.status]
      if (!next || !canTransitionMark(mark.status, next)) return fail("This score cannot move forward.")
      const permission = next === "submitted" ? "exams.enter" : next === "published" ? "exams.publish" : "exams.moderate"
      const blocked = deny(actor, permission)
      if (blocked) return fail(blocked)
      if (mark.score === null) return fail("Enter a score before submitting.")
      const assessment = state.assessments.find((item) => item.id === mark.assessmentId)
      if (assessment && actor.role === "teacher" && next === "submitted" && !actor.classIds.includes(assessment.classId)) {
        return fail("You can only submit marks for your classes.")
      }
      const marks = state.marks.map((item) => (item.id === id ? { ...item, status: next, updatedAt: nowIso() } : item))
      commit({ marks }, audit(actor, "advance-mark", "mark", id, `Score moved from ${mark.status} to ${next}.`))
      return { ok: true, data: undefined }
    },
    reopenMark: (actor, id, reason) => {
      const blocked = deny(actor, "exams.publish")
      if (blocked) return fail(blocked)
      if (reason.trim().length < 3) return fail("Enter the reason for reopening a published score.")
      const mark = get().marks.find((item) => item.id === id)
      if (!mark || mark.status !== "published") return fail("Only a published score can be reopened.")
      const marks = get().marks.map((item) => (item.id === id ? { ...item, status: "draft" as const, updatedAt: nowIso() } : item))
      commit({ marks }, audit(actor, "reopen-mark", "mark", id, `Reopened a published score. ${reason.trim()}`))
      return { ok: true, data: undefined }
    },
    updateDraftInvoice: (actor, id, discount) => {
      const blocked = deny(actor, "billing.issue")
      if (blocked) return fail(blocked)
      const invoice = get().invoices.find((item) => item.id === id)
      if (!invoice) return fail("Invoice not found.")
      if (invoice.status !== "draft") return fail("Issued invoices are posted. Use a reversal or a credit note.")
      if (!wholeShillings(discount)) return fail("Discount must be a whole number of shillings.")
      if (discount > invoiceGross(invoice)) return fail("Discount cannot exceed the line total.")
      const invoices = get().invoices.map((item) => (item.id === id ? { ...item, discount } : item))
      commit({ invoices }, audit(actor, "edit-draft-invoice", "invoice", id, `Updated the draft discount on ${invoice.number}.`))
      return { ok: true, data: undefined }
    },
    issueInvoice: (actor, id) => {
      const blocked = deny(actor, "billing.issue")
      if (blocked) return fail(blocked)
      const invoice = get().invoices.find((item) => item.id === id)
      if (!invoice) return fail("Invoice not found.")
      if (invoice.status !== "draft") return fail("This invoice is already issued.")
      if (invoiceCharged(invoice) <= 0) return fail("An issued invoice needs a charge above zero.")
      const invoices = get().invoices.map((item) => (item.id === id ? { ...item, status: "issued" as const, issuedAt: nowIso() } : item))
      commit({ invoices }, audit(actor, "issue-invoice", "invoice", id, `Issued ${invoice.number}.`))
      return { ok: true, data: undefined }
    },
    recordPayment: (actor, input) => {
      const blocked = deny(actor, "payments.record")
      if (blocked) return fail(blocked)
      const state = get()
      const invoice = state.invoices.find((item) => item.id === input.invoiceId)
      if (!invoice) return fail("Invoice not found.")
      const check = validatePayment({ invoice, payments: state.payments, receiptAmount: input.receiptAmount, allocateAmount: input.allocateAmount })
      if (!check.ok) return check
      const id = `payment-${crypto.randomUUID()}`
      const number = nextNumber(state.payments.map((item) => item.number), "RCT-2026")
      const payment = {
        id,
        number,
        studentId: invoice.studentId,
        amount: input.receiptAmount,
        method: input.method,
        receivedOn: input.receivedOn,
        allocations: [{ invoiceId: invoice.id, amount: input.allocateAmount }],
        note: input.note.trim(),
        reversesId: null,
        reversedById: null,
        createdAt: nowIso(),
      }
      commit({ payments: [payment, ...state.payments] }, audit(actor, "record-payment", "payment", id, `Recorded ${number} for ${input.receiptAmount} UGX.`))
      return { ok: true, data: undefined }
    },
    reversePayment: (actor, id, reason) => {
      const blocked = deny(actor, "payments.reverse")
      if (blocked) return fail(blocked)
      if (reason.trim().length < 3) return fail("Enter the reason for the reversal.")
      const state = get()
      const payment = state.payments.find((item) => item.id === id)
      if (!payment) return fail("Receipt not found.")
      const problem = reversalBlock(payment)
      if (problem) return fail(problem)
      const reversalId = `payment-${crypto.randomUUID()}`
      const number = nextNumber(state.payments.map((item) => item.number), "RCT-2026")
      const reversal = {
        id: reversalId,
        number,
        studentId: payment.studentId,
        amount: -payment.amount,
        method: payment.method,
        receivedOn: school.asOf,
        allocations: payment.allocations.map((item) => ({ invoiceId: item.invoiceId, amount: -item.amount })),
        note: reason.trim(),
        reversesId: payment.id,
        reversedById: null,
        createdAt: nowIso(),
      }
      const payments = state.payments.map((item) => (item.id === id ? { ...item, reversedById: reversalId } : item))
      commit({ payments: [reversal, ...payments] }, audit(actor, "reverse-payment", "payment", reversalId, `Reversed ${payment.number}. ${reason.trim()}`))
      return { ok: true, data: undefined }
    },
    addCalendarItem: (actor, title, date, termId) => {
      const blocked = deny(actor, "calendar.edit")
      if (blocked) return fail(blocked)
      if (title.trim().length < 3) return fail("Enter an event name.")
      if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return fail("Enter a date.")
      const item: CalendarItem = { id: `event-${crypto.randomUUID()}`, title: title.trim(), date, kind: "event", termId, locked: false }
      commit({ calendar: [...get().calendar, item].sort((a, b) => a.date.localeCompare(b.date)) }, audit(actor, "add-event", "calendar", item.id, `Added ${item.title}.`))
      return { ok: true, data: undefined }
    },
    removeCalendarItem: (actor, id) => {
      const blocked = deny(actor, "calendar.edit")
      if (blocked) return fail(blocked)
      const item = get().calendar.find((entry) => entry.id === id)
      if (!item) return fail("Event not found.")
      if (item.locked) return fail("Term dates and published exams stay on the calendar.")
      commit({ calendar: get().calendar.filter((entry) => entry.id !== id) }, audit(actor, "remove-event", "calendar", id, `Removed ${item.title}.`))
      return { ok: true, data: undefined }
    },
    markNoticeRead: (id) => {
      const notices = get().notices.map((item) => (item.id === id ? { ...item, read: true } : item))
      commit({ notices })
    },
    markVisibleNoticesRead: (audience) => {
      const notices = get().notices.map((item) => (item.audience === audience || item.audience === "all" ? { ...item, read: true } : item))
      commit({ notices })
    },
    logExport: (actor, summary) => {
      commit({}, audit(actor, "export", "export", actor.id, summary))
    },
  }
})

export function useRegisterSlice<T>(selector: (state: RegisterState) => T): T {
  return useRegister(selector)
}
