import { school } from "@/config/school"
import type {
  Application,
  ApplicationStatus,
  AttendanceStatus,
  Invoice,
  Mark,
  MarkStatus,
  Payment,
  Register,
  Result,
  Student,
} from "@/features/records/types"

export const applicationTransitions: Record<ApplicationStatus, ApplicationStatus[]> = {
  draft: ["submitted"],
  submitted: ["under_review"],
  under_review: ["interview", "offered", "waitlisted", "rejected"],
  interview: ["offered", "waitlisted", "rejected"],
  offered: ["accepted", "rejected"],
  waitlisted: ["offered", "rejected"],
  rejected: [],
  accepted: ["enrolled"],
  enrolled: [],
}

export function applicationNeedsReason(status: ApplicationStatus): boolean {
  return status === "rejected" || status === "waitlisted"
}

export function canTransitionApplication(from: ApplicationStatus, to: ApplicationStatus): boolean {
  return applicationTransitions[from].includes(to)
}

export function normalizeName(value: string): string {
  return value.trim().toLowerCase().replace(/\s+/g, " ")
}

export function findDuplicateStudent(
  students: Student[],
  input: { firstName: string; lastName: string; dateOfBirth: string },
): Student | undefined {
  const first = normalizeName(input.firstName)
  const last = normalizeName(input.lastName)
  return students.find(
    (student) =>
      student.status !== "withdrawn" &&
      normalizeName(student.firstName) === first &&
      normalizeName(student.lastName) === last &&
      student.dateOfBirth === input.dateOfBirth,
  )
}

export function enrollmentBlock(application: Application, today: string): string | null {
  if (application.status !== "accepted") return "Only an accepted offer can be enrolled."
  if (application.studentId) return "This application is already linked to a student."
  if (!application.documents.birthCertificate) {
    return "Mark the birth certificate on file before creating the student record."
  }
  if (application.offerExpiresOn && application.offerExpiresOn < today) {
    return "This offer has expired. Extend the expiry date before enrollment."
  }
  return null
}

export function lineAmount(line: { quantity: number; unitPrice: number }): number {
  return line.quantity * line.unitPrice
}

export function invoiceGross(invoice: Invoice): number {
  return invoice.lines.reduce((sum, line) => sum + lineAmount(line), 0)
}

export function invoiceCharged(invoice: Invoice): number {
  return Math.max(0, invoiceGross(invoice) - invoice.discount)
}

export function allocatedTo(invoiceId: string, payments: Payment[]): number {
  return payments.reduce((sum, payment) => {
    const share = payment.allocations.find((item) => item.invoiceId === invoiceId)
    return sum + (share?.amount ?? 0)
  }, 0)
}

/** Outstanding balance comes from posted lines minus allocations, never a stored total. */
export function outstanding(invoice: Invoice, payments: Payment[]): number {
  if (invoice.status !== "issued") return 0
  return invoiceCharged(invoice) - allocatedTo(invoice.id, payments)
}

export type InvoiceViewStatus = "draft" | "issued" | "partial" | "paid" | "overdue"

export function invoiceView(invoice: Invoice, payments: Payment[], today: string): InvoiceViewStatus {
  if (invoice.status === "draft") return "draft"
  const balance = outstanding(invoice, payments)
  const charged = invoiceCharged(invoice)
  if (balance <= 0) return "paid"
  if (invoice.dueDate < today) return "overdue"
  if (balance < charged) return "partial"
  return "issued"
}

export function unallocatedCredit(payment: Payment): number {
  const allocated = payment.allocations.reduce((sum, item) => sum + item.amount, 0)
  return payment.amount - allocated
}

export function validatePayment(input: {
  invoice: Invoice
  payments: Payment[]
  receiptAmount: number
  allocateAmount: number
}): Result {
  if (!Number.isInteger(input.receiptAmount) || input.receiptAmount <= 0) {
    return { ok: false, error: "Enter the receipt in whole shillings." }
  }
  if (!Number.isInteger(input.allocateAmount) || input.allocateAmount <= 0) {
    return { ok: false, error: "Allocate a whole number of shillings to the invoice." }
  }
  if (input.allocateAmount > input.receiptAmount) {
    return { ok: false, error: "You cannot allocate more than the receipt." }
  }
  if (input.invoice.status !== "issued") {
    return { ok: false, error: "Issue the invoice before recording a payment." }
  }
  const balance = outstanding(input.invoice, input.payments)
  if (balance <= 0) return { ok: false, error: "This invoice has no outstanding balance." }
  if (input.allocateAmount > balance) {
    return { ok: false, error: "Allocation is higher than the outstanding balance." }
  }
  return { ok: true, data: undefined }
}

export function reversalBlock(payment: Payment): string | null {
  if (payment.reversesId) return "A reversal stays on the record. Post a new receipt if the money was received."
  if (payment.reversedById) return "This receipt has already been reversed."
  if (payment.amount <= 0) return "This entry cannot be reversed."
  return null
}

export function registerKey(classId: string, date: string, session: string): string {
  return `${classId}:${date}:${session}`
}

export function validateScore(score: number, maxScore: number): string | null {
  if (!Number.isFinite(score)) return "Enter a score."
  if (score < 0 || score > maxScore) return `Score must be between 0 and ${maxScore}.`
  return null
}

export const markTransitions: Record<MarkStatus, MarkStatus[]> = {
  draft: ["submitted"],
  submitted: ["moderated"],
  moderated: ["approved"],
  approved: ["published"],
  published: [],
}

export function canTransitionMark(from: MarkStatus, to: MarkStatus): boolean {
  return markTransitions[from].includes(to)
}

export function markLocked(status: MarkStatus): boolean {
  return status === "published"
}

export function attendanceRate(
  registers: Register[],
  studentIds: string[] | null,
): number | null {
  let counted = 0
  let present = 0
  for (const register of registers) {
    if (register.status !== "submitted") continue
    for (const mark of register.marks) {
      if (studentIds && !studentIds.includes(mark.studentId)) continue
      counted += 1
      if ((school.presentStatuses as readonly string[]).includes(mark.status)) present += 1
    }
  }
  if (counted === 0) return null
  return present / counted
}

export function countsAsPresent(status: AttendanceStatus): boolean {
  return (school.presentStatuses as readonly string[]).includes(status)
}

export function nextNumber(existing: string[], prefix: string): string {
  const values = existing.map((value) => {
    const tail = value.split("-").pop() ?? ""
    return Number(tail)
  })
  const next = Math.max(0, ...values.filter((value) => Number.isFinite(value))) + 1
  return `${prefix}-${String(next).padStart(4, "0")}`
}

export function paginate<T>(rows: T[], page: number, pageSize: number) {
  const safePage = Math.max(1, page)
  const start = (safePage - 1) * pageSize
  return {
    rows: rows.slice(start, start + pageSize),
    total: rows.length,
    page: safePage,
    pageSize,
  }
}

export function dateInTerm(date: string, term: { start: string; end: string }): boolean {
  return date >= term.start && date <= term.end
}

export function wholeShillings(value: number): boolean {
  return Number.isInteger(value) && value >= 0
}
