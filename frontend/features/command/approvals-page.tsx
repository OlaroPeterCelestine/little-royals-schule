"use client"

import Link from "next/link"
import { school } from "@/config/school"
import { PageHeader } from "@/components/shared/page-header"
import { EmptyState } from "@/components/shared/empty-state"
import { StatusBadge } from "@/components/shared/status-badge"
import { Button } from "@/components/ui/button"
import { useCan } from "@/components/shared/access"
import { flash } from "@/components/shared/flash"
import { studentName } from "@/features/records/selectors"
import { useSession } from "@/features/records/session"
import { useRegister } from "@/features/records/store"

export function ApprovalsPage() {
  const user = useSession((state) => state.user)
  const register = useRegister()
  const advanceMark = useRegister((state) => state.advanceMark)
  const issueInvoice = useRegister((state) => state.issueInvoice)
  const decide = useCan("admissions.decide")
  const moderate = useCan("exams.moderate")
  const issue = useCan("billing.issue")
  if (!user) return null

  const applications = decide ? register.applications.filter((item) => item.status === "under_review" || item.status === "interview") : []
  const marks = moderate ? register.marks.filter((item) => item.status === "submitted") : []
  const drafts = issue ? register.invoices.filter((item) => item.status === "draft") : []
  const empty = applications.length + marks.length + drafts.length === 0

  return (
    <div className="grid gap-4">
      <PageHeader title="Approval Inbox" description="Decisions use the same rules as the record pages. Rejecting an application still requires a reason on the application itself." />
      {empty ? <EmptyState title="Inbox is clear" body="Nothing is waiting for your approval." /> : null}
      {applications.length > 0 ? (
        <section className="grid gap-2">
          <h2 className="text-sm font-semibold">Applications</h2>
          {applications.map((item) => (
            <article key={item.id} className="flex flex-wrap items-center justify-between gap-2 rounded-xl border bg-white px-4 py-3">
              <div>
                <p className="text-sm font-medium">{item.firstName} {item.lastName}</p>
                <p className="text-xs text-slate-500">{item.number}</p>
              </div>
              <StatusBadge status={item.status} />
              <Button render={<Link href={`/app/admissions/applications/${item.id}`} />}>Open decision</Button>
            </article>
          ))}
        </section>
      ) : null}
      {marks.length > 0 ? (
        <section className="grid gap-2">
          <h2 className="text-sm font-semibold">Submitted scores</h2>
          {marks.map((mark) => {
            const pupil = register.students.find((item) => item.id === mark.studentId)
            const assessment = register.assessments.find((item) => item.id === mark.assessmentId)
            return (
              <article key={mark.id} className="flex flex-wrap items-center justify-between gap-2 rounded-xl border bg-white px-4 py-3">
                <div>
                  <p className="text-sm font-medium">{pupil ? studentName(pupil) : "Pupil"} · {assessment?.name}</p>
                  <p className="text-xs text-slate-500">{mark.score} / {assessment?.maxScore}</p>
                </div>
                <Button
                  type="button"
                  onClick={() => {
                    const result = advanceMark(user, mark.id)
                    flash(result, "Score moved to moderation.")
                  }}
                >
                  Moderate
                </Button>
              </article>
            )
          })}
        </section>
      ) : null}
      {drafts.length > 0 ? (
        <section className="grid gap-2">
          <h2 className="text-sm font-semibold">Draft invoices</h2>
          {drafts.map((invoice) => (
            <article key={invoice.id} className="flex flex-wrap items-center justify-between gap-2 rounded-xl border bg-white px-4 py-3">
              <div>
                <p className="text-sm font-medium">{invoice.number}</p>
                <p className="text-xs text-slate-500">Due {invoice.dueDate}. Register date {school.asOf}.</p>
              </div>
              <Button
                type="button"
                onClick={() => {
                  const result = issueInvoice(user, invoice.id)
                  flash(result, `${invoice.number} issued.`)
                }}
              >
                Issue
              </Button>
            </article>
          ))}
        </section>
      ) : null}
    </div>
  )
}
