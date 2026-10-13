"use client"

import { useState } from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { school } from "@/config/school"
import { PageHeader } from "@/components/shared/page-header"
import { StatusBadge } from "@/components/shared/status-badge"
import { EmptyState } from "@/components/shared/empty-state"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Field } from "@/components/shared/field"
import { ConfirmDialog } from "@/components/shared/confirm-dialog"
import { Textarea } from "@/components/ui/textarea"
import { useCan } from "@/components/shared/access"
import { flash } from "@/components/shared/flash"
import { formatDate, formatWhen } from "@/lib/format"
import { useRecordTitle } from "@/components/shell/breadcrumbs"
import { applicationNeedsReason, applicationTransitions, enrollmentBlock } from "@/features/records/workflows"
import { useSession } from "@/features/records/session"
import { useRegister } from "@/features/records/store"
import type { ApplicationStatus } from "@/features/records/types"

const labels: Record<ApplicationStatus, string> = {
  draft: "Submit",
  submitted: "Start review",
  under_review: "Under review",
  interview: "Book interview",
  offered: "Offer a place",
  waitlisted: "Waitlist",
  rejected: "Reject",
  accepted: "Mark accepted",
  enrolled: "Enroll",
}

export function ApplicationDetail() {
  const params = useParams<{ id: string }>()
  const user = useSession((state) => state.user)
  const application = useRegister((state) => state.applications.find((item) => item.id === params.id))
  const classes = useRegister((state) => state.classes)
  const guardians = useRegister((state) => state.guardians)
  const intakes = useRegister((state) => state.intakes)
  const audits = useRegister((state) => state.audits).filter((item) => item.entityId === params.id)
  const transition = useRegister((state) => state.transitionApplication)
  const enroll = useRegister((state) => state.enrollApplication)
  const extend = useRegister((state) => state.extendOffer)
  const canEdit = useCan("admissions.edit")
  const canDecide = useCan("admissions.decide")
  const canEnroll = useCan("admissions.enroll")
  const [target, setTarget] = useState<ApplicationStatus | null>(null)
  const [reason, setReason] = useState("")
  const [interviewOn, setInterviewOn] = useState<string>(school.asOf)
  const [offerExpiresOn, setOfferExpiresOn] = useState("2026-11-30")
  const [enrollOpen, setEnrollOpen] = useState(false)
  const [extendDate, setExtendDate] = useState("2026-11-30")
  useRecordTitle(application ? `${application.firstName} ${application.lastName}` : "Application")

  if (!user) return null
  if (!application) return <EmptyState title="Application not found" body="It is not in the development register." />

  const guardian = guardians.find((item) => item.id === application.guardianId)
  const schoolClass = classes.find((item) => item.id === application.applyingClassId)
  const intake = intakes.find((item) => item.id === application.intakeId)
  const next = applicationTransitions[application.status].filter((status) => status !== "enrolled")
  const block = enrollmentBlock(application, school.asOf)

  function allowed(status: ApplicationStatus) {
    if (status === "submitted" || status === "under_review") return canEdit
    return canDecide
  }

  return (
    <div className="grid gap-4">
      <PageHeader
        title={`${application.firstName} ${application.lastName}`}
        description={`${application.number} · ${intake?.name ?? "Intake"} · ${schoolClass?.name ?? "Class"}`}
        actions={<StatusBadge status={application.status} />}
      />
      <dl className="grid gap-3 rounded-xl border bg-white p-4 sm:grid-cols-2 lg:grid-cols-3">
        <Item label="Date of birth" value={formatDate(application.dateOfBirth)} />
        <Item label="Gender" value={application.gender || "—"} />
        <Item label="Prior school" value={application.priorSchool || "—"} />
        <Item label="Address" value={application.address} />
        <Item label="Guardian" value={guardian ? `${guardian.name} · ${guardian.phone}` : "—"} />
        <Item label="Interview" value={application.interviewOn ? formatDate(application.interviewOn) : "Not booked"} />
        <Item label="Offer expires" value={application.offerExpiresOn ? formatDate(application.offerExpiresOn) : "—"} />
        <Item label="Birth certificate" value={application.documents.birthCertificate ? "On file" : "Missing"} />
        <Item label="Decision note" value={application.decisionReason || "—"} />
      </dl>
      {application.studentId ? (
        <p className="text-sm">
          Student record: <Link className="text-[#1e4b9b] underline" href={`/app/students/${application.studentId}`}>{application.studentId}</Link>
        </p>
      ) : null}
      <section className="grid gap-3 rounded-xl border bg-white p-4">
        <h2 className="text-sm font-semibold">Move this application</h2>
        <div className="flex flex-wrap gap-2">
          {next.map((status) => (
            <Button key={status} type="button" variant="outline" disabled={!allowed(status)} onClick={() => setTarget(status)}>
              {labels[status]}
            </Button>
          ))}
          {application.status === "accepted" ? (
            <Button type="button" disabled={!canEnroll || Boolean(block)} onClick={() => setEnrollOpen(true)}>
              Enroll as a new student
            </Button>
          ) : null}
        </div>
        {block && application.status === "accepted" ? <p className="text-sm text-amber-800">{block}</p> : null}
        {application.status === "offered" || application.status === "accepted" ? (
          <form
            className="flex flex-wrap items-end gap-2"
            onSubmit={(event) => {
              event.preventDefault()
              const result = extend(user, application.id, extendDate)
              flash(result, "Offer expiry updated.")
            }}
          >
            <Field label="Extend offer to">
              <Input type="date" value={extendDate} onChange={(event) => setExtendDate(event.target.value)} />
            </Field>
            <Button type="submit" variant="outline" disabled={!canDecide}>Update expiry</Button>
          </form>
        ) : null}
      </section>
      <section className="rounded-xl border bg-white p-4">
        <h2 className="text-sm font-semibold">Activity</h2>
        {audits.length === 0 ? <p className="mt-2 text-sm text-slate-600">No changes yet in this session.</p> : null}
        <ul className="mt-2 grid gap-2">
          {audits.map((item) => (
            <li key={item.id} className="text-sm">
              <span className="font-medium">{item.actorName}</span> {item.summary}
              <span className="ml-2 text-xs text-slate-500">{formatWhen(item.at)}</span>
            </li>
          ))}
        </ul>
      </section>
      {target ? (
        <form
          className="grid gap-3 rounded-xl border bg-white p-4"
          onSubmit={(event) => {
            event.preventDefault()
            const note = (event.currentTarget.elements.namedItem("reason") as HTMLTextAreaElement | null)?.value ?? ""
            const result = transition(user, application.id, target, {
              reason: note,
              interviewOn: target === "interview" ? interviewOn : undefined,
              offerExpiresOn: target === "offered" ? offerExpiresOn : undefined,
            })
            if (flash(result, "Application updated.")) {
              setTarget(null)
              setReason("")
            }
          }}
        >
          <h2 className="text-sm font-semibold">{labels[target]}</h2>
          {target === "interview" ? (
            <Field label="Interview date" required>
              <Input type="date" value={interviewOn} onChange={(event) => setInterviewOn(event.target.value)} />
            </Field>
          ) : null}
          {target === "offered" ? (
            <Field label="Offer expiry" required>
              <Input type="date" value={offerExpiresOn} onChange={(event) => setOfferExpiresOn(event.target.value)} />
            </Field>
          ) : null}
          <Field label={applicationNeedsReason(target) ? "Reason" : "Note"} required={applicationNeedsReason(target)}>
            <Textarea name="reason" value={reason} onChange={(event) => setReason(event.target.value)} />
          </Field>
          <div className="flex gap-2">
            <Button type="submit">{labels[target]}</Button>
            <Button type="button" variant="outline" onClick={() => setTarget(null)}>
              Cancel
            </Button>
          </div>
        </form>
      ) : null}
      <ConfirmDialog
        open={enrollOpen}
        onOpenChange={setEnrollOpen}
        title="Create the student record?"
        description="This adds one student, one class enrollment and a guardian link. It will not run if the same name and date of birth already exist."
        confirmLabel="Enroll"
        onConfirm={() => {
          const result = enroll(user, application.id)
          if (result.ok) {
            flash(result, "Student record created.")
            setEnrollOpen(false)
          } else flash(result, "")
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
