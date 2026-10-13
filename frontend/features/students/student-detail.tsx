"use client"

import { useState } from "react"
import { useParams } from "next/navigation"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PageHeader } from "@/components/shared/page-header"
import { StatusBadge } from "@/components/shared/status-badge"
import { EmptyState } from "@/components/shared/empty-state"
import { Button } from "@/components/ui/button"
import { ReasonDialog } from "@/components/shared/reason-dialog"
import { useCan } from "@/components/shared/access"
import { flash } from "@/components/shared/flash"
import { useRecordTitle } from "@/components/shell/breadcrumbs"
import { formatDate, formatWhen } from "@/lib/format"
import { canSeeStudent, className, currentEnrollment, studentName } from "@/features/records/selectors"
import { useSession } from "@/features/records/session"
import { useRegister } from "@/features/records/store"
import { useUi } from "@/features/records/ui-state"

export function StudentDetail() {
  const params = useParams<{ id: string }>()
  const user = useSession((state) => state.user)
  const register = useRegister()
  const yearId = useUi((state) => state.yearId)
  const withdraw = useRegister((state) => state.withdrawStudent)
  const canEdit = useCan("students.edit")
  const [open, setOpen] = useState(false)
  const student = register.students.find((item) => item.id === params.id)
  const allowed = user && student ? canSeeStudent(user, register, student.id, yearId) : false
  useRecordTitle(student && allowed ? studentName(student) : "Student")

  if (!user) return null
  if (!student || !allowed) return <EmptyState title="Student not available" body="This record is outside your access, or it does not exist." />

  const enrollment = currentEnrollment(register.enrollments, student.id, yearId)
  const history = register.enrollments.filter((item) => item.studentId === student.id)
  const links = register.links.filter((item) => item.studentId === student.id)
  const audits = register.audits.filter((item) => item.entityId === student.id || item.summary.includes(student.studentNumber))

  return (
    <div className="grid gap-4">
      <PageHeader
        title={studentName(student)}
        description={`${student.studentNumber} · ${className(register, enrollment?.classId ?? "")} · preferred name ${student.preferredName}`}
        actions={
          <>
            <StatusBadge status={student.status} />
            {canEdit && student.status !== "withdrawn" ? (
              <Button type="button" variant="outline" onClick={() => setOpen(true)}>
                Withdraw
              </Button>
            ) : null}
          </>
        }
      />
      <Tabs defaultValue="profile">
        <TabsList>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="guardians">Guardians</TabsTrigger>
          <TabsTrigger value="enrollment">Enrollment</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
        </TabsList>
        <TabsContent value="profile" className="rounded-xl border bg-white p-4">
          <dl className="grid gap-3 sm:grid-cols-2">
            <Item label="Legal name" value={studentName(student)} />
            <Item label="Date of birth" value={formatDate(student.dateOfBirth)} />
            <Item label="Gender" value={student.gender} />
            <Item label="Nationality" value={student.nationality} />
            <Item label="Address" value={student.address} />
            <Item label="Enrolled" value={formatDate(student.enrolledOn)} />
            {student.withdrawalReason ? <Item label="Withdrawal reason" value={student.withdrawalReason} /> : null}
          </dl>
          <p className="mt-4 text-xs text-slate-500">Medical and safeguarding notes are not shown here.</p>
        </TabsContent>
        <TabsContent value="guardians" className="rounded-xl border bg-white p-4">
          <ul className="grid gap-3">
            {links.map((link) => {
              const guardian = register.guardians.find((item) => item.id === link.guardianId)
              if (!guardian) return null
              return (
                <li key={link.id} className="text-sm">
                  <p className="font-medium">{guardian.name} · {link.relationship}</p>
                  <p className="text-slate-600">{guardian.phone} · {guardian.email}</p>
                  <p className="text-xs text-slate-500">
                    {link.billing ? "Billing contact" : "Not billed"} · {link.pickup ? "May pick up" : "No pickup"} · {link.emergency ? "Emergency contact" : "Not emergency"}
                  </p>
                </li>
              )
            })}
          </ul>
        </TabsContent>
        <TabsContent value="enrollment" className="rounded-xl border bg-white p-4">
          <ul className="grid gap-2 text-sm">
            {history.map((item) => (
              <li key={item.id}>
                {className(register, item.classId)} from {formatDate(item.start)}
                {item.end ? ` to ${formatDate(item.end)}` : " · current"}
              </li>
            ))}
          </ul>
        </TabsContent>
        <TabsContent value="documents" className="rounded-xl border bg-white p-4 text-sm text-slate-600">
          Admission documents are tracked on the application. Uploading files is unavailable until storage is connected.
        </TabsContent>
        <TabsContent value="activity" className="rounded-xl border bg-white p-4">
          {audits.length === 0 ? <p className="text-sm text-slate-600">No activity in this register yet.</p> : null}
          <ul className="grid gap-2 text-sm">
            {audits.map((item) => (
              <li key={item.id}>
                <span className="font-medium">{item.actorName}</span> {item.summary}
                <span className="ml-2 text-xs text-slate-500">{formatWhen(item.at)}</span>
              </li>
            ))}
          </ul>
        </TabsContent>
      </Tabs>
      <ReasonDialog
        open={open}
        onOpenChange={setOpen}
        title={`Withdraw ${studentName(student)}?`}
        description="The student, invoices and results stay on file. The class enrollment ends on the register date."
        confirmLabel="Withdraw"
        onConfirm={(reason) => {
          const result = withdraw(user, student.id, reason)
          if (flash(result, "Withdrawal recorded.")) setOpen(false)
        }}
      />
    </div>
  )
}

function Item({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs text-slate-500">{label}</dt>
      <dd className="text-sm">{value}</dd>
    </div>
  )
}
