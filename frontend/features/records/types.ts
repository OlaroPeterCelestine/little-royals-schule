import type { Permission } from "@/config/permissions"
import type { RoleId } from "@/config/permissions"

export type ApplicationStatus =
  | "draft"
  | "submitted"
  | "under_review"
  | "interview"
  | "offered"
  | "waitlisted"
  | "rejected"
  | "accepted"
  | "enrolled"

export type StudentStatus = "active" | "watch" | "withdrawn" | "graduated"

export type AttendanceStatus = "present" | "absent" | "late" | "excused"

export type RegisterStatus = "open" | "submitted"

export type SessionName = "morning" | "afternoon"

export type MarkStatus = "draft" | "submitted" | "moderated" | "approved" | "published"

export type InvoicePosting = "draft" | "issued"

export type PaymentMethod = "cash" | "bank" | "mobile_money"

export type Account = {
  id: string
  name: string
  email: string
  role: RoleId
  status: "active" | "invited"
  classIds: string[]
  studentIds: string[]
  staffNumber: string
}

export type AcademicYear = { id: string; name: string }
export type Term = { id: string; yearId: string; name: string; start: string; end: string }
export type Intake = { id: string; name: string; yearId: string }

export type SchoolClass = {
  id: string
  name: string
  level: string
  teacherId: string
  capacity: number
  room: string
}

export type Guardian = {
  id: string
  name: string
  phone: string
  email: string
  address: string
}

export type GuardianLink = {
  id: string
  studentId: string
  guardianId: string
  relationship: string
  billing: boolean
  pickup: boolean
  emergency: boolean
}

export type Student = {
  id: string
  studentNumber: string
  firstName: string
  middleName: string
  lastName: string
  preferredName: string
  dateOfBirth: string
  gender: string
  status: StudentStatus
  address: string
  nationality: string
  enrolledOn: string
  withdrawalReason: string
}

export type Enrollment = {
  id: string
  studentId: string
  classId: string
  academicYearId: string
  start: string
  end: string | null
}

export type ApplicationDocuments = {
  birthCertificate: boolean
  priorReport: boolean
  photo: boolean
}

export type Application = {
  id: string
  number: string
  intakeId: string
  applyingClassId: string
  firstName: string
  middleName: string
  lastName: string
  dateOfBirth: string
  gender: string
  priorSchool: string
  guardianId: string
  address: string
  status: ApplicationStatus
  decisionReason: string
  offerExpiresOn: string | null
  interviewOn: string | null
  assessmentNote: string
  documents: ApplicationDocuments
  studentId: string | null
  createdAt: string
  updatedAt: string
}

export type RegisterMark = {
  studentId: string
  status: AttendanceStatus
  reason: string
}

export type AttendanceCorrection = {
  id: string
  at: string
  actorId: string
  studentId: string
  from: AttendanceStatus
  to: AttendanceStatus
  reason: string
}

export type Register = {
  id: string
  classId: string
  date: string
  session: SessionName
  termId: string
  status: RegisterStatus
  marks: RegisterMark[]
  markedBy: string
  submittedAt: string | null
  corrections: AttendanceCorrection[]
}

export type Assessment = {
  id: string
  name: string
  classId: string
  subject: string
  termId: string
  maxScore: number
  heldOn: string
}

export type Mark = {
  id: string
  assessmentId: string
  studentId: string
  score: number | null
  remarks: string
  graderId: string
  status: MarkStatus
  updatedAt: string
}

export type InvoiceLine = {
  id: string
  description: string
  quantity: number
  unitPrice: number
}

export type Invoice = {
  id: string
  number: string
  studentId: string
  billingGuardianId: string
  academicYearId: string
  termId: string
  lines: InvoiceLine[]
  discount: number
  dueDate: string
  status: InvoicePosting
  issuedAt: string | null
}

export type Allocation = { invoiceId: string; amount: number }

export type Payment = {
  id: string
  number: string
  studentId: string
  amount: number
  method: PaymentMethod
  receivedOn: string
  allocations: Allocation[]
  note: string
  reversesId: string | null
  reversedById: string | null
  createdAt: string
}

export type Notice = {
  id: string
  title: string
  body: string
  at: string
  read: boolean
  audience: "staff" | "parent" | "all"
}

export type CalendarItem = {
  id: string
  title: string
  date: string
  kind: "term" | "holiday" | "exam" | "event"
  termId: string
  locked: boolean
}

export type AuditEvent = {
  id: string
  at: string
  actorId: string
  actorName: string
  action: string
  entityType: string
  entityId: string
  summary: string
}

export type RegisterData = {
  accounts: Account[]
  years: AcademicYear[]
  terms: Term[]
  intakes: Intake[]
  classes: SchoolClass[]
  guardians: Guardian[]
  links: GuardianLink[]
  students: Student[]
  enrollments: Enrollment[]
  applications: Application[]
  registers: Register[]
  assessments: Assessment[]
  marks: Mark[]
  invoices: Invoice[]
  payments: Payment[]
  notices: Notice[]
  calendar: CalendarItem[]
  audits: AuditEvent[]
}

export type Page<T> = {
  rows: T[]
  total: number
  page: number
  pageSize: number
}

export type Result<T = undefined> =
  | { ok: true; data: T }
  | { ok: false; error: string }

export type SessionUser = {
  id: string
  name: string
  email: string
  role: RoleId
  classIds: string[]
  studentIds: string[]
}

export type TaskItem = {
  id: string
  title: string
  detail: string
  href: string
  permission: Permission
}

export type Kpi = {
  id: string
  label: string
  value: string
  detail: string
  href: string
}
