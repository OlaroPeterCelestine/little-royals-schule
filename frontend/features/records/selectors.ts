import { can, type Permission } from "@/config/permissions"
import { school } from "@/config/school"
import { formatMoney, fullName, percent } from "@/lib/format"
import {
  attendanceRate,
  invoiceCharged,
  invoiceView,
  outstanding,
  unallocatedCredit,
} from "@/features/records/workflows"
import type {
  Enrollment,
  Kpi,
  RegisterData,
  SessionUser,
  Student,
  TaskItem,
} from "@/features/records/types"

export function studentName(student: Pick<Student, "firstName" | "middleName" | "lastName">): string {
  return fullName(student)
}

export function currentEnrollment(
  enrollments: Enrollment[],
  studentId: string,
  yearId: string,
): Enrollment | undefined {
  return enrollments.find(
    (item) => item.studentId === studentId && item.academicYearId === yearId && item.end === null,
  )
}

export function className(data: RegisterData, classId: string): string {
  return data.classes.find((item) => item.id === classId)?.name ?? "Unassigned"
}

export function accountName(data: RegisterData, id: string): string {
  return data.accounts.find((item) => item.id === id)?.name ?? "Unknown"
}

export function canSeeStudent(user: SessionUser, data: RegisterData, studentId: string, yearId: string): boolean {
  if (!can(user.role, "students.view")) return false
  if (user.role === "parent" || user.role === "student") return user.studentIds.includes(studentId)
  if (user.role === "teacher") {
    const enrollment = currentEnrollment(data.enrollments, studentId, yearId)
    return Boolean(enrollment && user.classIds.includes(enrollment.classId))
  }
  return true
}

export function visibleStudents(user: SessionUser, data: RegisterData, yearId: string): Student[] {
  return data.students.filter((student) => canSeeStudent(user, data, student.id, yearId))
}

export function visibleClassIds(user: SessionUser, data: RegisterData): string[] {
  if (user.role === "teacher") return user.classIds
  if (user.role === "parent" || user.role === "student") {
    const yearId = data.years[0]?.id ?? ""
    const ids = new Set<string>()
    for (const studentId of user.studentIds) {
      const enrollment = currentEnrollment(data.enrollments, studentId, yearId)
      if (enrollment) ids.add(enrollment.classId)
    }
    return [...ids]
  }
  return data.classes.map((item) => item.id)
}

export function buildTasks(user: SessionUser, data: RegisterData, termId: string): TaskItem[] {
  const term = data.terms.find((item) => item.id === termId)
  const tasks: TaskItem[] = []
  if (!term) return tasks
  const today = school.asOf
  if (can(user.role, "attendance.mark") && today >= term.start && today <= term.end) {
    for (const classId of visibleClassIds(user, data)) {
      const schoolClass = data.classes.find((item) => item.id === classId)
      if (!schoolClass) continue
      const register = data.registers.find(
        (item) => item.classId === classId && item.date === today && item.session === "morning" && item.termId === termId,
      )
      if (!register) {
        tasks.push({
          id: `register-missing-${classId}`,
          title: `Open the ${schoolClass.name} morning register`,
          detail: `No register for ${today}.`,
          href: "/app/academics/attendance",
          permission: "attendance.mark",
        })
      } else if (register.status === "open") {
        tasks.push({
          id: `register-open-${classId}`,
          title: `Submit the ${schoolClass.name} morning register`,
          detail: "Marks are saved and still open.",
          href: "/app/academics/attendance",
          permission: "attendance.mark",
        })
      }
    }
  }
  if (can(user.role, "admissions.edit")) {
    for (const application of data.applications.filter((item) => item.status === "draft")) {
      tasks.push({
        id: `draft-${application.id}`,
        title: `Submit ${application.firstName} ${application.lastName}'s application`,
        detail: application.number,
        href: `/app/admissions/applications/${application.id}`,
        permission: "admissions.edit",
      })
    }
  }
  if (can(user.role, "admissions.enroll")) {
    for (const application of data.applications.filter((item) => item.status === "accepted")) {
      tasks.push({
        id: `enroll-${application.id}`,
        title: `Enroll ${application.firstName} ${application.lastName}`,
        detail: "Accepted offer is not yet a student record.",
        href: `/app/admissions/applications/${application.id}`,
        permission: "admissions.enroll",
      })
    }
  }
  if (can(user.role, "exams.enter")) {
    for (const mark of data.marks.filter((item) => item.status === "draft")) {
      const assessment = data.assessments.find((item) => item.id === mark.assessmentId)
      if (!assessment || assessment.termId !== termId) continue
      if (user.role === "teacher" && !user.classIds.includes(assessment.classId)) continue
      const pupil = data.students.find((item) => item.id === mark.studentId)
      if (!pupil) continue
      tasks.push({
        id: `mark-${mark.id}`,
        title: `Finish ${studentName(pupil)}'s ${assessment.subject} score`,
        detail: "Still a draft.",
        href: "/app/exams/marks",
        permission: "exams.enter",
      })
    }
  }
  if (can(user.role, "billing.issue")) {
    for (const invoice of data.invoices.filter((item) => item.status === "draft" && item.termId === termId)) {
      const pupil = data.students.find((item) => item.id === invoice.studentId)
      tasks.push({
        id: `issue-${invoice.id}`,
        title: `Issue ${invoice.number}`,
        detail: pupil ? studentName(pupil) : invoice.number,
        href: `/app/finance/billing/${invoice.id}`,
        permission: "billing.issue",
      })
    }
  }
  return tasks.filter((task) => can(user.role, task.permission))
}

export function approvalCount(user: SessionUser, data: RegisterData): number {
  if (!can(user.role, "approvals.view")) return 0
  let count = 0
  if (can(user.role, "admissions.decide")) {
    count += data.applications.filter((item) => item.status === "under_review" || item.status === "interview").length
  }
  if (can(user.role, "exams.moderate")) {
    count += data.marks.filter((item) => item.status === "submitted").length
  }
  if (can(user.role, "billing.issue")) {
    count += data.invoices.filter((item) => item.status === "draft").length
  }
  return count
}

export function unreadCount(user: SessionUser, data: RegisterData): number {
  return data.notices.filter((notice) => !notice.read && noticeVisible(user, notice.audience)).length
}

export function noticeVisible(user: SessionUser, audience: "staff" | "parent" | "all"): boolean {
  if (audience === "all") return true
  if (user.role === "parent" || user.role === "student") return audience === "parent"
  return audience === "staff"
}

export function buildKpis(user: SessionUser, data: RegisterData, yearId: string, termId: string): Kpi[] {
  const pupils = visibleStudents(user, data, yearId).filter((student) => student.status === "active" || student.status === "watch")
  const termInvoices = data.invoices.filter((invoice) => {
    if (invoice.termId !== termId) return false
    return canSeeStudent(user, data, invoice.studentId, yearId)
  })
  const collected = data.payments
    .filter((payment) => payment.allocations.some((item) => termInvoices.some((invoice) => invoice.id === item.invoiceId)))
    .reduce((sum, payment) => {
      const share = payment.allocations
        .filter((item) => termInvoices.some((invoice) => invoice.id === item.invoiceId))
        .reduce((inner, item) => inner + item.amount, 0)
      return sum + share
    }, 0)
  const openInvoices = termInvoices.filter((invoice) => invoice.status === "issued")
  const outstandingTotal = openInvoices.reduce((sum, invoice) => sum + outstanding(invoice, data.payments), 0)
  const overdueTotal = openInvoices
    .filter((invoice) => invoiceView(invoice, data.payments, school.asOf) === "overdue")
    .reduce((sum, invoice) => sum + outstanding(invoice, data.payments), 0)
  const classIds = visibleClassIds(user, data)
  const registers = data.registers.filter((item) => item.termId === termId && classIds.includes(item.classId))
  const studentIds = user.role === "parent" || user.role === "student" || user.role === "teacher" ? pupils.map((item) => item.id) : null
  const rate = attendanceRate(registers, studentIds)

  if (user.role === "parent" || user.role === "student") {
    const published = data.marks.filter(
      (mark) => mark.status === "published" && pupils.some((pupil) => pupil.id === mark.studentId),
    )
    return [
      { id: "children", label: "Linked pupils", value: String(pupils.length), detail: "Only your household", href: "/app/students" },
      { id: "attendance", label: "Attendance", value: percent(rate), detail: "Submitted registers this term", href: "/app/academics/attendance" },
      { id: "fees", label: "Outstanding fees", value: formatMoney(outstandingTotal), detail: overdueTotal > 0 ? `${formatMoney(overdueTotal)} overdue` : "Nothing overdue", href: "/app/finance/billing" },
      { id: "results", label: "Published results", value: String(published.length), detail: "Draft scores stay with the teacher", href: "/app/exams/marks" },
    ]
  }

  if (user.role === "teacher") {
    const drafts = data.marks.filter((mark) => {
      const assessment = data.assessments.find((item) => item.id === mark.assessmentId)
      return mark.status === "draft" && assessment && user.classIds.includes(assessment.classId)
    })
    return [
      { id: "pupils", label: "My pupils", value: String(pupils.length), detail: "Classes on your timetable", href: "/app/students" },
      { id: "attendance", label: "Attendance", value: percent(rate), detail: "Submitted registers this term", href: "/app/academics/attendance" },
      { id: "drafts", label: "Draft scores", value: String(drafts.length), detail: "Not visible to families", href: "/app/exams/marks" },
      { id: "tasks", label: "Open tasks", value: String(buildTasks(user, data, termId).length), detail: "From registers and marks", href: "/app/tasks" },
    ]
  }

  if (user.role === "bursar") {
    const credit = data.payments.reduce((sum, payment) => sum + Math.max(0, unallocatedCredit(payment)), 0)
    return [
      { id: "issued", label: "Issued this term", value: formatMoney(openInvoices.reduce((sum, invoice) => sum + invoiceCharged(invoice), 0)), detail: `${openInvoices.length} posted invoices`, href: "/app/finance/billing" },
      { id: "collected", label: "Collected", value: formatMoney(collected), detail: "Allocations to this term", href: "/app/finance/payments" },
      { id: "outstanding", label: "Outstanding", value: formatMoney(outstandingTotal), detail: `${formatMoney(overdueTotal)} overdue`, href: "/app/finance/billing" },
      { id: "credit", label: "Unallocated credit", value: formatMoney(credit), detail: "Receipts not fully applied", href: "/app/finance/payments" },
    ]
  }

  const staff = data.accounts.filter((account) => account.status === "active" && account.role !== "parent" && account.role !== "student")
  const kpis: Kpi[] = [
    { id: "enrolled", label: "Enrolled", value: String(pupils.length), detail: "Active and watch", href: "/app/students" },
    { id: "attendance", label: "Attendance", value: percent(rate), detail: "Submitted registers this term", href: "/app/academics/attendance" },
  ]
  if (can(user.role, "billing.view")) {
    kpis.push(
      { id: "collected", label: "Collected", value: formatMoney(collected), detail: "Allocations to this term", href: "/app/finance/payments" },
      { id: "outstanding", label: "Outstanding", value: formatMoney(outstandingTotal), detail: `${formatMoney(overdueTotal)} overdue`, href: "/app/finance/billing" },
    )
  }
  if (can(user.role, "approvals.view")) {
    kpis.push({
      id: "approvals",
      label: "Approvals",
      value: String(approvalCount(user, data)),
      detail: "Waiting on a decision",
      href: "/app/approvals",
    })
  }
  if (can(user.role, "users.view")) {
    kpis.push({ id: "staff", label: "Staff accounts", value: String(staff.length), detail: "Active in this register", href: "/app/system/users" })
  }
  return kpis
}

export function searchRecords(
  user: SessionUser,
  data: RegisterData,
  yearId: string,
  query: string,
): { label: string; href: string; hint: string }[] {
  const needle = query.trim().toLowerCase()
  if (needle.length < 2) return []
  const hits: { label: string; href: string; hint: string }[] = []
  for (const student of visibleStudents(user, data, yearId)) {
    const name = studentName(student)
    if (`${name} ${student.studentNumber}`.toLowerCase().includes(needle)) {
      hits.push({ label: name, href: `/app/students/${student.id}`, hint: student.studentNumber })
    }
  }
  if (can(user.role, "admissions.view")) {
    for (const application of data.applications) {
      const name = `${application.firstName} ${application.lastName}`
      if (`${name} ${application.number}`.toLowerCase().includes(needle)) {
        hits.push({ label: name, href: `/app/admissions/applications/${application.id}`, hint: application.number })
      }
    }
  }
  return hits.slice(0, 8)
}

const SLICE_COLORS = ["#0EA5E9", "#6366F1", "#F59E0B", "#10B981", "#F43F5E", "#8B5CF6"]

export type DeskRow = { label: string; value: string; tone?: "rose" | "amber" }
export type DeskCard = { id: string; label: string; value: string; href: string; rows: DeskRow[] }
export type DeskSlice = { label: string; count: number; color: string }
export type DeskBar = { label: string; present: number; other: number }
export type DeskApplicant = {
  id: string
  name: string
  email: string
  className: string
  status: string
  createdAt: string
}

export type DeskSnapshot = {
  insight: string
  insightHref: string
  cards: DeskCard[]
  slices: DeskSlice[]
  enrolled: number
  bars: DeskBar[]
  openRegisters: number
  tasks: TaskItem[]
  applicants: DeskApplicant[] | null
  upcoming: { id: string; title: string; date: string }[]
}

export function schoolRoll(data: RegisterData): { capacity: number; enrolled: number; percent: number } {
  const capacity = data.classes.reduce((sum, item) => sum + item.capacity, 0)
  const enrolled = data.students.filter((student) => student.status === "active" || student.status === "watch").length
  const percent = capacity === 0 ? 0 : Math.round((enrolled / capacity) * 100)
  return { capacity, enrolled, percent }
}

function card(id: string, label: string, value: string, href: string, rows: DeskRow[]): DeskCard {
  return { id, label, value, href, rows }
}

export function buildDashboard(user: SessionUser, data: RegisterData, yearId: string, termId: string): DeskSnapshot {
  const pupils = visibleStudents(user, data, yearId).filter((student) => student.status === "active" || student.status === "watch")
  const watch = pupils.filter((student) => student.status === "watch").length
  const classIds = visibleClassIds(user, data)
  const todayRegisters = data.registers.filter(
    (item) => item.termId === termId && item.date === school.asOf && item.session === "morning" && classIds.includes(item.classId),
  )
  const openRegisters = todayRegisters.filter((item) => item.status === "open").length
  const scopedIds = user.role === "parent" || user.role === "student" || user.role === "teacher" ? pupils.map((item) => item.id) : null
  const rate = attendanceRate(
    data.registers.filter((item) => item.termId === termId && classIds.includes(item.classId)),
    scopedIds,
  )
  const drafts = data.marks.filter((mark) => {
    if (mark.status !== "draft") return false
    const assessment = data.assessments.find((item) => item.id === mark.assessmentId)
    if (!assessment || assessment.termId !== termId) return false
    if (user.role === "teacher" && !user.classIds.includes(assessment.classId)) return false
    if (scopedIds && !scopedIds.includes(mark.studentId)) return false
    return true
  }).length

  const groups = new Map<string, number>()
  for (const pupil of pupils) {
    const enrollment = currentEnrollment(data.enrollments, pupil.id, yearId)
    const label = className(data, enrollment?.classId ?? "")
    groups.set(label, (groups.get(label) ?? 0) + 1)
  }
  const slices: DeskSlice[] = [...groups.entries()].map(([label, count], index) => ({
    label,
    count,
    color: SLICE_COLORS[index % SLICE_COLORS.length] ?? "#0EA5E9",
  }))

  const bars: DeskBar[] = todayRegisters.map((register) => {
    const marks = scopedIds ? register.marks.filter((mark) => scopedIds.includes(mark.studentId)) : register.marks
    const present = marks.filter((mark) => (school.presentStatuses as readonly string[]).includes(mark.status)).length
    return { label: className(data, register.classId), present, other: Math.max(0, marks.length - present) }
  })

  const notes: string[] = []
  if (watch > 0) notes.push(`${watch} ${watch === 1 ? "pupil is" : "pupils are"} on watch`)
  if (openRegisters > 0) notes.push(`${openRegisters} morning ${openRegisters === 1 ? "register is" : "registers are"} still open`)
  if (drafts > 0 && can(user.role, "exams.enter")) notes.push(`${drafts} ${drafts === 1 ? "score is" : "scores are"} still a draft`)
  const insight = notes.length > 0 ? `${notes.join(". ")}.` : "Nothing is waiting on a register, a watch list, or a draft score."
  const insightHref = openRegisters > 0 ? "/app/academics/attendance" : drafts > 0 ? "/app/exams/marks" : "/app/students"

  const termInvoices = data.invoices.filter((invoice) => invoice.termId === termId && canSeeStudent(user, data, invoice.studentId, yearId))
  const collected = data.payments.reduce((sum, payment) => {
    const share = payment.allocations
      .filter((item) => termInvoices.some((invoice) => invoice.id === item.invoiceId))
      .reduce((inner, item) => inner + item.amount, 0)
    return sum + share
  }, 0)
  const openInvoices = termInvoices.filter((invoice) => invoice.status === "issued")
  const outstandingTotal = openInvoices.reduce((sum, invoice) => sum + outstanding(invoice, data.payments), 0)
  const overdueTotal = openInvoices
    .filter((invoice) => invoiceView(invoice, data.payments, school.asOf) === "overdue")
    .reduce((sum, invoice) => sum + outstanding(invoice, data.payments), 0)

  let cards: DeskCard[]
  if (user.role === "parent" || user.role === "student") {
    const published = data.marks.filter((mark) => mark.status === "published" && pupils.some((pupil) => pupil.id === mark.studentId))
    cards = [
      card("children", "Linked pupils", String(pupils.length), "/app/students", [
        { label: "On watch", value: String(watch), tone: watch > 0 ? "amber" : undefined },
        { label: "Scope", value: "Your household" },
      ]),
      card("attendance", "Attendance", percent(rate), "/app/academics/attendance", [
        { label: "Open registers today", value: String(openRegisters), tone: openRegisters > 0 ? "amber" : undefined },
        { label: "Source", value: "Submitted registers" },
      ]),
    ]
    if (can(user.role, "billing.view")) {
      cards.push(
        card("fees", "Outstanding fees", formatMoney(outstandingTotal), "/app/finance/billing", [
          { label: "Overdue", value: formatMoney(overdueTotal), tone: overdueTotal > 0 ? "rose" : undefined },
          { label: "Collected", value: formatMoney(collected) },
        ]),
      )
    }
    cards.push(
      card("results", "Published results", String(published.length), "/app/exams/marks", [
        { label: "Draft scores", value: "Hidden" },
        { label: "Visible", value: "Published only" },
      ]),
    )
  } else if (user.role === "teacher") {
    cards = [
      card("pupils", "My pupils", String(pupils.length), "/app/students", [
        { label: "On watch", value: String(watch), tone: watch > 0 ? "amber" : undefined },
        { label: "Classes", value: String(user.classIds.length) },
      ]),
      card("attendance", "Attendance", percent(rate), "/app/academics/attendance", [
        { label: "Open registers today", value: String(openRegisters), tone: openRegisters > 0 ? "amber" : undefined },
        { label: "Source", value: "Submitted registers" },
      ]),
      card("drafts", "Draft scores", String(drafts), "/app/exams/marks", [
        { label: "Families", value: "Cannot see drafts" },
        { label: "Term", value: data.terms.find((item) => item.id === termId)?.name ?? "This term" },
      ]),
      card("tasks", "Open tasks", String(buildTasks(user, data, termId).length), "/app/tasks", [
        { label: "From", value: "Registers and marks" },
        { label: "Waiting", value: String(buildTasks(user, data, termId).length) },
      ]),
    ]
  } else if (user.role === "bursar") {
    const credit = data.payments.reduce((sum, payment) => sum + Math.max(0, unallocatedCredit(payment)), 0)
    cards = [
      card("issued", "Issued this term", formatMoney(openInvoices.reduce((sum, invoice) => sum + invoiceCharged(invoice), 0)), "/app/finance/billing", [
        { label: "Posted invoices", value: String(openInvoices.length) },
        { label: "Draft invoices", value: String(termInvoices.filter((invoice) => invoice.status === "draft").length) },
      ]),
      card("collected", "Collected", formatMoney(collected), "/app/finance/payments", [
        { label: "Applied to", value: "This term" },
        { label: "Unallocated", value: formatMoney(credit) },
      ]),
      card("outstanding", "Outstanding", formatMoney(outstandingTotal), "/app/finance/billing", [
        { label: "Overdue", value: formatMoney(overdueTotal), tone: overdueTotal > 0 ? "rose" : undefined },
        { label: "Basis", value: "Posted balances" },
      ]),
      card("credit", "Unallocated credit", formatMoney(credit), "/app/finance/payments", [
        { label: "Receipts", value: "Not fully applied" },
        { label: "Pupils", value: String(pupils.length) },
      ]),
    ]
  } else {
    const pipeline = data.applications.filter((item) => item.status !== "enrolled" && item.status !== "rejected")
    const reviewing = data.applications.filter((item) => item.status === "under_review" || item.status === "submitted").length
    const interviews = data.applications.filter((item) => item.status === "interview").length
    cards = [
      card("enrolled", "Total enrollment", String(pupils.length), "/app/students", [
        { label: "Active", value: String(pupils.length - watch) },
        { label: "On watch", value: String(watch), tone: watch > 0 ? "amber" : undefined },
      ]),
      card("attendance", "Attendance", percent(rate), "/app/academics/attendance", [
        { label: "Open registers today", value: String(openRegisters), tone: openRegisters > 0 ? "amber" : undefined },
        { label: "Counted", value: "Submitted marks" },
      ]),
    ]
    if (can(user.role, "billing.view")) {
      cards.push(
        card("outstanding", "Outstanding", formatMoney(outstandingTotal), "/app/finance/billing", [
          { label: "Collected", value: formatMoney(collected) },
          { label: "Overdue", value: formatMoney(overdueTotal), tone: overdueTotal > 0 ? "rose" : undefined },
        ]),
      )
    }
    if (can(user.role, "admissions.view")) {
      cards.push(
        card("pipeline", "Admissions pipeline", String(pipeline.length), "/app/admissions/applications", [
          { label: "In review", value: String(reviewing) },
          { label: "Interviews", value: String(interviews) },
        ]),
      )
    }
    if (cards.length < 4 && can(user.role, "approvals.view")) {
      cards.push(
        card("approvals", "Approvals", String(approvalCount(user, data)), "/app/approvals", [
          { label: "Waiting", value: "Your role" },
          { label: "Draft scores", value: String(drafts) },
        ]),
      )
    }
  }

  const applicants = can(user.role, "admissions.view")
    ? [...data.applications]
        .sort((left, right) => right.createdAt.localeCompare(left.createdAt))
        .slice(0, 5)
        .map((application) => ({
          id: application.id,
          name: `${application.firstName} ${application.lastName}`,
          email: data.guardians.find((item) => item.id === application.guardianId)?.email ?? "No guardian email",
          className: className(data, application.applyingClassId),
          status: application.status,
          createdAt: application.createdAt,
        }))
    : null

  return {
    insight,
    insightHref,
    cards: cards.slice(0, 4),
    slices,
    enrolled: pupils.length,
    bars,
    openRegisters,
    tasks: buildTasks(user, data, termId).slice(0, 4),
    applicants,
    upcoming: data.calendar.filter((item) => item.termId === termId && item.date >= school.asOf).slice(0, 4),
  }
}
