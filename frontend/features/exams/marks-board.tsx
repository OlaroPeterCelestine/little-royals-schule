"use client"

import { useState } from "react"
import { PageHeader } from "@/components/shared/page-header"
import { StatusBadge } from "@/components/shared/status-badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ReasonDialog } from "@/components/shared/reason-dialog"
import { useCan } from "@/components/shared/access"
import { flash } from "@/components/shared/flash"
import { studentName, visibleClassIds, visibleStudents } from "@/features/records/selectors"
import { useSession } from "@/features/records/session"
import { useRegister } from "@/features/records/store"
import { useUi } from "@/features/records/ui-state"

export function MarksBoard() {
  const user = useSession((state) => state.user)
  const register = useRegister()
  const termId = useUi((state) => state.termId)
  const yearId = useUi((state) => state.yearId)
  const canEnter = useCan("exams.enter")
  const canModerate = useCan("exams.moderate")
  const canPublish = useCan("exams.publish")
  const save = useRegister((state) => state.saveMark)
  const advance = useRegister((state) => state.advanceMark)
  const reopen = useRegister((state) => state.reopenMark)
  const classIds = user ? visibleClassIds(user, register) : []
  const assessments = register.assessments.filter((item) => item.termId === termId && (canEnter || canModerate || canPublish ? classIds.includes(item.classId) : true))
  const [assessmentId, setAssessmentId] = useState(assessments[0]?.id ?? "")
  const [reopenId, setReopenId] = useState<string | null>(null)
  if (!user) return null

  if (!canEnter && !canModerate && !canPublish) {
    const pupils = visibleStudents(user, register, yearId)
    const published = register.marks.filter((mark) => mark.status === "published" && pupils.some((pupil) => pupil.id === mark.studentId))
    return (
      <div className="grid gap-4">
        <PageHeader title="Marks" description="Only published scores are visible. Drafts stay with the teacher." />
        <ul className="grid gap-2">
          {published.map((mark) => {
            const assessment = register.assessments.find((item) => item.id === mark.assessmentId)
            return (
              <li key={mark.id} className="rounded-xl border bg-white px-4 py-3 text-sm">
                {assessment?.name}: {mark.score} / {assessment?.maxScore}
              </li>
            )
          })}
        </ul>
      </div>
    )
  }

  const assessment = register.assessments.find((item) => item.id === assessmentId)
  const marks = register.marks.filter((mark) => mark.assessmentId === assessmentId)

  return (
    <div className="grid gap-4">
      <PageHeader title="Marks Entry" description="A published score cannot be edited. Reopening it needs a reason and is written to the audit log." />
      <select className="h-8 max-w-md rounded-lg border bg-white px-2 text-sm" aria-label="Assessment" value={assessmentId} onChange={(event) => setAssessmentId(event.target.value)}>
        {assessments.map((item) => (
          <option key={item.id} value={item.id}>{item.name}</option>
        ))}
      </select>
      <ul className="grid gap-2">
        {marks.map((mark) => {
          const pupil = register.students.find((item) => item.id === mark.studentId)
          return (
            <MarkRow
              key={`${mark.id}-${mark.updatedAt}`}
              name={pupil ? studentName(pupil) : "Pupil"}
              score={mark.score}
              max={assessment?.maxScore ?? 0}
              status={mark.status}
              canEnter={canEnter && mark.status === "draft"}
              canModerate={canModerate && (mark.status === "submitted" || mark.status === "moderated")}
              canPublish={canPublish && mark.status === "approved"}
              canReopen={canPublish && mark.status === "published"}
              onSave={(score) => flash(save(user, mark.id, score, mark.remarks), "Draft saved.")}
              onAdvance={() => flash(advance(user, mark.id), "Score moved forward.")}
              onReopen={() => setReopenId(mark.id)}
            />
          )
        })}
      </ul>
      <ReasonDialog
        open={Boolean(reopenId)}
        onOpenChange={(open) => !open && setReopenId(null)}
        title="Reopen this published score?"
        description="Families may already have seen it. The change is kept in the audit log."
        confirmLabel="Reopen"
        onConfirm={(reason) => {
          if (!reopenId) return
          const result = reopen(user, reopenId, reason)
          if (flash(result, "Score reopened as a draft.")) setReopenId(null)
        }}
      />
    </div>
  )
}

function MarkRow({
  name,
  score,
  max,
  status,
  canEnter,
  canModerate,
  canPublish,
  canReopen,
  onSave,
  onAdvance,
  onReopen,
}: {
  name: string
  score: number | null
  max: number
  status: string
  canEnter: boolean
  canModerate: boolean
  canPublish: boolean
  canReopen: boolean
  onSave: (score: number) => void
  onAdvance: () => void
  onReopen: () => void
}) {
  const [value, setValue] = useState(score === null ? "" : String(score))
  return (
    <li className="grid items-center gap-2 rounded-xl border bg-white p-3 sm:grid-cols-[1fr_8rem_auto_auto]">
      <span className="text-sm font-medium">{name}</span>
      <Input
        aria-label={`Score for ${name}`}
        inputMode="decimal"
        disabled={!canEnter}
        value={value}
        onChange={(event) => setValue(event.target.value)}
      />
      <StatusBadge status={status} />
      <div className="flex flex-wrap gap-2">
        <span className="sr-only">out of {max}</span>
        {canEnter ? (
          <Button type="button" variant="outline" onClick={() => onSave(Number(value))}>
            Save draft
          </Button>
        ) : null}
        {canEnter || canModerate || canPublish ? (
          <Button type="button" onClick={onAdvance}>
            {status === "draft" ? "Submit" : status === "submitted" ? "Moderate" : status === "moderated" ? "Approve" : "Publish"}
          </Button>
        ) : null}
        {canReopen ? (
          <Button type="button" variant="outline" onClick={onReopen}>
            Reopen
          </Button>
        ) : null}
      </div>
    </li>
  )
}
