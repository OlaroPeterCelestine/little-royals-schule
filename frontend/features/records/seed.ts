import type { RegisterData } from "@/features/records/types"

const docs = { birthCertificate: true, priorReport: true, photo: true }
const missingPhoto = { birthCertificate: true, priorReport: false, photo: false }

/**
 * Development register for Little Royals.
 * TODO: load this shape from the Go API. Do not treat these rows as live school data.
 * Students, guardians, invoices and marks share IDs. Nothing is copied into a second record.
 */
export function createSeed(): RegisterData {
  return {
    accounts: [
      { id: "grace", name: "Grace Achieng", email: "grace.achieng@littleroyals.school", role: "headteacher", status: "active", classIds: [], studentIds: [], staffNumber: "STF-001" },
      { id: "alvarez", name: "Elena Alvarez", email: "alvarez@littleroyals.school", role: "teacher", status: "active", classIds: ["kg-a", "g4"], studentIds: [], staffNumber: "TR-014" },
      { id: "shah", name: "Amir Shah", email: "shah@littleroyals.school", role: "teacher", status: "active", classIds: ["g2"], studentIds: [], staffNumber: "TR-021" },
      { id: "nguyen", name: "Dr. Nguyen", email: "nguyen@littleroyals.school", role: "teacher", status: "active", classIds: ["g6"], studentIds: [], staffNumber: "TR-030" },
      { id: "office", name: "Front office", email: "office@littleroyals.school", role: "registrar", status: "active", classIds: [], studentIds: [], staffNumber: "STF-004" },
      { id: "wanjiru", name: "Amina Wanjiru", email: "wanjiru@littleroyals.school", role: "bursar", status: "active", classIds: [], studentIds: [], staffNumber: "STF-006" },
      { id: "mei", name: "Mei Chen", email: "mei.chen@gmail.com", role: "parent", status: "active", classIds: [], studentIds: ["liam"], staffNumber: "" },
    ],
    years: [{ id: "ay-2026", name: "2026" }],
    terms: [
      { id: "t2-2026", yearId: "ay-2026", name: "Term 2", start: "2026-05-04", end: "2026-08-07" },
      { id: "t3-2026", yearId: "ay-2026", name: "Term 3", start: "2026-09-07", end: "2026-12-04" },
    ],
    intakes: [{ id: "intake-2027", name: "January 2027", yearId: "ay-2026" }],
    classes: [
      { id: "kg-a", name: "KG A", level: "Kindergarten", teacherId: "alvarez", capacity: 20, room: "Room 4" },
      { id: "g2", name: "Grade 2", level: "Primary", teacherId: "shah", capacity: 30, room: "Lab" },
      { id: "g4", name: "Grade 4", level: "Primary", teacherId: "alvarez", capacity: 28, room: "Room 12" },
      { id: "g6", name: "Grade 6", level: "Primary", teacherId: "nguyen", capacity: 28, room: "Room 6" },
    ],
    guardians: [
      { id: "wei", name: "Wei Chen", phone: "0772 100 441", email: "wei.chen@gmail.com", address: "Kololo, Kampala" },
      { id: "mei-g", name: "Mei Chen", phone: "0773 100 442", email: "mei.chen@gmail.com", address: "Kololo, Kampala" },
      { id: "rohan", name: "Rohan Patel", phone: "0701 220 908", email: "patel.home@gmail.com", address: "Naguru, Kampala" },
      { id: "anita", name: "Anita Patel", phone: "0700 220 909", email: "anita.patel@gmail.com", address: "Naguru, Kampala" },
      { id: "chidi", name: "Chidi Okonkwo", phone: "0752 441 330", email: "okonkwo.m@gmail.com", address: "Bugolobi, Kampala" },
      { id: "helen", name: "Helen Brooks", phone: "0784 880 112", email: "brooks.family@icloud.com", address: "Muyenga, Kampala" },
      { id: "laura", name: "Laura Clarke", phone: "0758 555 014", email: "clarke.owen@outlook.com", address: "Ntinda, Kampala" },
      { id: "hannah-g", name: "Soo Kim", phone: "0771 300 221", email: "kim.hannah@gmail.com", address: "Kololo, Kampala" },
      { id: "zuri-g", name: "Achen Nakato", phone: "0702 118 640", email: "nakato.family@gmail.com", address: "Ntinda, Kampala" },
      { id: "sophia-g", name: "Maria Martinez", phone: "0774 220 100", email: "m.martinez@outlook.com", address: "Kololo, Kampala" },
      { id: "noah-g", name: "Tariq Al-Mansoor", phone: "0753 440 210", email: "t.mansoor@al-edu.org", address: "Nakasero, Kampala" },
      { id: "lucas-g", name: "Paulo Ferreira", phone: "0782 100 330", email: "l.ferreira@edu.org", address: "Bugolobi, Kampala" },
      { id: "amina-g", name: "Fatuma Nalwoga", phone: "0704 555 018", email: "nalwoga.family@gmail.com", address: "Ntinda, Kampala" },
      { id: "josh-g", name: "Peter Okello", phone: "0776 200 441", email: "okello.p@gmail.com", address: "Kira, Wakiso" },
      { id: "priya-g", name: "Anita Shah", phone: "0751 300 772", email: "priya.family@gmail.com", address: "Naguru, Kampala" },
    ],
    links: [
      { id: "l1", studentId: "liam", guardianId: "wei", relationship: "Father", billing: true, pickup: true, emergency: true },
      { id: "l2", studentId: "liam", guardianId: "mei-g", relationship: "Mother", billing: false, pickup: true, emergency: true },
      { id: "l3", studentId: "ava", guardianId: "rohan", relationship: "Father", billing: true, pickup: true, emergency: false },
      { id: "l4", studentId: "ava", guardianId: "anita", relationship: "Mother", billing: false, pickup: true, emergency: true },
      { id: "l5", studentId: "mia", guardianId: "chidi", relationship: "Father", billing: true, pickup: true, emergency: true },
      { id: "l6", studentId: "ethan", guardianId: "helen", relationship: "Mother", billing: true, pickup: true, emergency: true },
      { id: "l7", studentId: "owen", guardianId: "laura", relationship: "Mother", billing: true, pickup: true, emergency: true },
      { id: "l8", studentId: "hannah", guardianId: "hannah-g", relationship: "Mother", billing: true, pickup: true, emergency: true },
      { id: "l9", studentId: "zuri", guardianId: "zuri-g", relationship: "Mother", billing: true, pickup: true, emergency: true },
    ],
    students: [
      student("liam", "ST-1042", "Liam", "", "Chen", "Liam", "2021-03-12", "Boy", "active", "Kololo, Kampala", "2026-01-12"),
      student("ava", "ST-1214", "Ava", "", "Patel", "Ava", "2021-06-04", "Girl", "watch", "Naguru, Kampala", "2026-01-12"),
      student("mia", "ST-1108", "Mia", "", "Okonkwo", "Mia", "2018-09-19", "Girl", "active", "Bugolobi, Kampala", "2024-09-02"),
      student("ethan", "ST-0988", "Ethan", "", "Brooks", "Ethan", "2015-02-02", "Boy", "active", "Muyenga, Kampala", "2022-09-05"),
      student("owen", "ST-1302", "Owen", "", "Clarke", "Owen", "2020-11-28", "Boy", "watch", "Ntinda, Kampala", "2026-05-04"),
      student("hannah", "ST-0871", "Hannah", "", "Kim", "Hannah", "2016-04-18", "Girl", "active", "Kololo, Kampala", "2023-09-04"),
      student("zuri", "ST-1410", "Zuri", "", "Nakato", "Zuri", "2016-08-09", "Girl", "active", "Ntinda, Kampala", "2024-01-08"),
    ],
    enrollments: [
      enroll("e1", "liam", "kg-a"),
      enroll("e2", "ava", "kg-a"),
      enroll("e3", "owen", "kg-a"),
      enroll("e4", "mia", "g2"),
      enroll("e5", "hannah", "g4"),
      enroll("e6", "zuri", "g4"),
      enroll("e7", "ethan", "g6"),
    ],
    applications: [
      application("sophia", "APP-2026-0001", "g4", "Sophia", "Martinez", "2016-01-16", "Girl", "Kampala Junior", "sophia-g", "interview", "2026-10-16", null, "Waiting for the class teacher panel.", docs, "2026-09-20"),
      application("noah", "APP-2026-0002", "g2", "Noah", "Al-Mansoor", "2018-11-02", "Boy", "City Primary", "noah-g", "under_review", null, null, "Prior report still missing.", missingPhoto, "2026-09-28"),
      application("lucas", "APP-2026-0003", "g4", "Lucas", "Ferreira", "2016-05-22", "Boy", "Greenfield", "lucas-g", "draft", null, null, "", missingPhoto, "2026-10-10"),
      application("amina", "APP-2026-0004", "kg-a", "Amina", "Nalwoga", "2021-02-02", "Girl", "Home", "amina-g", "offered", null, "2026-10-31", "Offer sent to the family.", docs, "2026-10-01"),
      application("josh", "APP-2026-0005", "g6", "Joshua", "Okello", "2014-07-11", "Boy", "Lakeside", "josh-g", "rejected", null, null, "No place in Grade 6 this intake.", docs, "2026-09-12"),
      application("priya", "APP-2026-0006", "g2", "Priya", "Shah", "2018-03-30", "Girl", "Hillside", "priya-g", "accepted", null, "2026-11-15", "Family accepted the offer.", docs, "2026-10-08"),
    ],
    registers: [
      {
        id: "kg-a:2026-10-13:morning",
        classId: "kg-a",
        date: "2026-10-13",
        session: "morning",
        termId: "t3-2026",
        status: "open",
        markedBy: "alvarez",
        submittedAt: null,
        corrections: [],
        marks: [
          { studentId: "liam", status: "present", reason: "" },
          { studentId: "ava", status: "late", reason: "Arrived during assembly" },
          { studentId: "owen", status: "absent", reason: "" },
        ],
      },
      {
        id: "g2:2026-10-13:morning",
        classId: "g2",
        date: "2026-10-13",
        session: "morning",
        termId: "t3-2026",
        status: "submitted",
        markedBy: "shah",
        submittedAt: "2026-10-13T06:40:00.000Z",
        corrections: [],
        marks: [{ studentId: "mia", status: "present", reason: "" }],
      },
      {
        id: "kg-a:2026-06-02:morning",
        classId: "kg-a",
        date: "2026-06-02",
        session: "morning",
        termId: "t2-2026",
        status: "submitted",
        markedBy: "alvarez",
        submittedAt: "2026-06-02T07:00:00.000Z",
        corrections: [],
        marks: [
          { studentId: "liam", status: "present", reason: "" },
          { studentId: "ava", status: "absent", reason: "Clinic visit" },
        ],
      },
    ],
    assessments: [
      { id: "math-g4", name: "Term 3 mathematics midterm", classId: "g4", subject: "Mathematics", termId: "t3-2026", maxScore: 100, heldOn: "2026-10-18" },
      { id: "read-kg", name: "Reading check", classId: "kg-a", subject: "Reading", termId: "t3-2026", maxScore: 20, heldOn: "2026-10-09" },
    ],
    marks: [
      { id: "m1", assessmentId: "math-g4", studentId: "hannah", score: 78, remarks: "", graderId: "alvarez", status: "submitted", updatedAt: "2026-10-12T09:00:00.000Z" },
      { id: "m2", assessmentId: "math-g4", studentId: "zuri", score: 64, remarks: "Still drafting", graderId: "alvarez", status: "draft", updatedAt: "2026-10-12T09:10:00.000Z" },
      { id: "m3", assessmentId: "read-kg", studentId: "liam", score: 18, remarks: "", graderId: "alvarez", status: "published", updatedAt: "2026-10-10T08:00:00.000Z" },
      { id: "m4", assessmentId: "read-kg", studentId: "ava", score: 12, remarks: "", graderId: "alvarez", status: "draft", updatedAt: "2026-10-10T08:05:00.000Z" },
      { id: "m5", assessmentId: "read-kg", studentId: "owen", score: 9, remarks: "", graderId: "alvarez", status: "submitted", updatedAt: "2026-10-11T08:00:00.000Z" },
    ],
    invoices: [
      invoice("inv-liam-t3", "INV-2026-0001", "liam", "wei", "t3-2026", 450_000, "2026-10-01", "issued", "2026-09-08T08:00:00.000Z"),
      invoice("inv-ava-t3", "INV-2026-0002", "ava", "rohan", "t3-2026", 450_000, "2026-10-01", "issued", "2026-09-08T08:00:00.000Z"),
      invoice("inv-owen-t3", "INV-2026-0003", "owen", "laura", "t3-2026", 450_000, "2026-09-30", "issued", "2026-09-08T08:00:00.000Z"),
      invoice("inv-mia-t3", "INV-2026-0004", "mia", "chidi", "t3-2026", 520_000, "2026-10-20", "issued", "2026-09-08T08:00:00.000Z"),
      invoice("inv-ethan-t3", "INV-2026-0005", "ethan", "helen", "t3-2026", 640_000, "2026-11-01", "issued", "2026-09-08T08:00:00.000Z"),
      invoice("inv-hannah-t3", "INV-2026-0006", "hannah", "hannah-g", "t3-2026", 580_000, "2026-10-20", "draft", null),
      invoice("inv-zuri-t3", "INV-2026-0007", "zuri", "zuri-g", "t3-2026", 580_000, "2026-10-20", "issued", "2026-09-08T08:00:00.000Z", 50_000),
      invoice("inv-liam-t2", "INV-2026-0008", "liam", "wei", "t2-2026", 420_000, "2026-06-01", "issued", "2026-05-05T08:00:00.000Z"),
    ],
    payments: [
      receipt("pay-1", "RCT-2026-0001", "liam", 450_000, "mobile_money", "2026-09-20", "inv-liam-t3"),
      receipt("pay-2", "RCT-2026-0002", "ava", 300_000, "bank", "2026-09-25", "inv-ava-t3"),
      receipt("pay-3", "RCT-2026-0003", "mia", 520_000, "cash", "2026-09-18", "inv-mia-t3"),
      receipt("pay-4", "RCT-2026-0004", "ethan", 400_000, "mobile_money", "2026-10-02", "inv-ethan-t3"),
      receipt("pay-5", "RCT-2026-0005", "zuri", 530_000, "bank", "2026-09-22", "inv-zuri-t3"),
      receipt("pay-6", "RCT-2026-0006", "liam", 420_000, "mobile_money", "2026-05-20", "inv-liam-t2"),
    ],
    notices: [
      { id: "n1", title: "Term 3 dates published", body: "Term 3 runs from 7 Sep 2026 to 4 Dec 2026.", at: "2026-09-01T07:00:00.000Z", read: true, audience: "all" },
      { id: "n2", title: "KG A register saved", body: "Elena Alvarez saved the morning register for 13 Oct 2026. It is not submitted yet.", at: "2026-10-13T05:30:00.000Z", read: false, audience: "staff" },
      { id: "n3", title: "Receipt for Mia Okonkwo", body: "A cash receipt was recorded against Mia Okonkwo's Term 3 invoice.", at: "2026-09-18T10:00:00.000Z", read: false, audience: "staff" },
      { id: "n4", title: "Reading result published", body: "Liam Chen's reading check is published.", at: "2026-10-10T08:05:00.000Z", read: false, audience: "parent" },
    ],
    calendar: [
      { id: "c1", title: "Term 3 opens", date: "2026-09-07", kind: "term", termId: "t3-2026", locked: true },
      { id: "c2", title: "Independence Day", date: "2026-10-09", kind: "holiday", termId: "t3-2026", locked: true },
      { id: "c3", title: "Grade 4 mathematics midterm", date: "2026-10-18", kind: "exam", termId: "t3-2026", locked: true },
      { id: "c4", title: "Term 3 closes", date: "2026-12-04", kind: "term", termId: "t3-2026", locked: true },
      { id: "c5", title: "Term 2 opens", date: "2026-05-04", kind: "term", termId: "t2-2026", locked: true },
      { id: "c6", title: "Term 2 closes", date: "2026-08-07", kind: "term", termId: "t2-2026", locked: true },
    ],
    audits: [
      { id: "a1", at: "2026-10-13T04:55:00.000Z", actorId: "grace", actorName: "Grace Achieng", action: "sign-in", entityType: "session", entityId: "grace", summary: "Signed in to the school OS." },
      { id: "a2", at: "2026-10-12T09:00:00.000Z", actorId: "alvarez", actorName: "Elena Alvarez", action: "submit-mark", entityType: "mark", entityId: "m1", summary: "Submitted Hannah Kim's mathematics score." },
      { id: "a3", at: "2026-09-25T08:00:00.000Z", actorId: "wanjiru", actorName: "Amina Wanjiru", action: "record-payment", entityType: "payment", entityId: "pay-2", summary: "Recorded UGX 300,000 for Ava Patel." },
    ],
  }
}

function student(
  id: string,
  studentNumber: string,
  firstName: string,
  middleName: string,
  lastName: string,
  preferredName: string,
  dateOfBirth: string,
  gender: string,
  status: RegisterData["students"][number]["status"],
  address: string,
  enrolledOn: string,
): RegisterData["students"][number] {
  return {
    id,
    studentNumber,
    firstName,
    middleName,
    lastName,
    preferredName,
    dateOfBirth,
    gender,
    status,
    address,
    nationality: "Ugandan",
    enrolledOn,
    withdrawalReason: "",
  }
}

function enroll(id: string, studentId: string, classId: string): RegisterData["enrollments"][number] {
  return { id, studentId, classId, academicYearId: "ay-2026", start: "2026-01-12", end: null }
}

function application(
  id: string,
  number: string,
  applyingClassId: string,
  firstName: string,
  lastName: string,
  dateOfBirth: string,
  gender: string,
  priorSchool: string,
  guardianId: string,
  status: RegisterData["applications"][number]["status"],
  interviewOn: string | null,
  offerExpiresOn: string | null,
  decisionReason: string,
  documents: RegisterData["applications"][number]["documents"],
  createdOn: string,
): RegisterData["applications"][number] {
  return {
    id,
    number,
    intakeId: "intake-2027",
    applyingClassId,
    firstName,
    middleName: "",
    lastName,
    dateOfBirth,
    gender,
    priorSchool,
    guardianId,
    address: "Kampala",
    status,
    decisionReason,
    offerExpiresOn,
    interviewOn,
    assessmentNote: "",
    documents,
    studentId: null,
    createdAt: `${createdOn}T08:00:00.000Z`,
    updatedAt: `${createdOn}T08:00:00.000Z`,
  }
}

function invoice(
  id: string,
  number: string,
  studentId: string,
  billingGuardianId: string,
  termId: string,
  tuition: number,
  dueDate: string,
  status: "draft" | "issued",
  issuedAt: string | null,
  discount = 0,
): RegisterData["invoices"][number] {
  return {
    id,
    number,
    studentId,
    billingGuardianId,
    academicYearId: "ay-2026",
    termId,
    lines: [{ id: `${id}-tuition`, description: "Tuition", quantity: 1, unitPrice: tuition }],
    discount,
    dueDate,
    status,
    issuedAt,
  }
}

function receipt(
  id: string,
  number: string,
  studentId: string,
  amount: number,
  method: RegisterData["payments"][number]["method"],
  receivedOn: string,
  invoiceId: string,
): RegisterData["payments"][number] {
  return {
    id,
    number,
    studentId,
    amount,
    method,
    receivedOn,
    allocations: [{ invoiceId, amount }],
    note: "",
    reversesId: null,
    reversedById: null,
    createdAt: `${receivedOn}T09:00:00.000Z`,
  }
}
