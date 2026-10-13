"use client"

import { useState } from "react"
import { school } from "@/config/school"
import { PageHeader } from "@/components/shared/page-header"
import { StatusBadge } from "@/components/shared/status-badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useCan } from "@/components/shared/access"
import { flash } from "@/components/shared/flash"
import { formatDate } from "@/lib/format"
import { className, studentName, visibleClassIds, visibleStudents } from "@/features/records/selectors"
import { registerKey } from "@/features/records/workflows"
import { useSession } from "@/features/records/session"
import { useRegister } from "@/features/records/store"
import { useUi } from "@/features/records/ui-state"
import type { AttendanceStatus, RegisterMark, SessionName } from "@/features/records/types"

const statuses: AttendanceStatus[] = ["present", "absent", "late", "excused"]

export function AttendanceBoard() {
  const user = useSession((state) => state.user)
  const register = useRegister()
  const termId = useUi((state) => state.termId)
  const yearId = useUi((state) => state.yearId)
  const canMark = useCan("attendance.mark")
  const classIds = user ? visibleClassIds(user, register) : []
  const [classId, setClassId] = useState(classIds[0] ?? "")
  const [date, setDate] = useState<string>(school.asOf)
  const [session, setSession] = useState<SessionName>("morning")
  if (!user) return null

  if (!canMark) {
    const pupils = visibleStudents(user, register, yearId)
    const marks = register.registers
      .filter((item) => item.termId === termId && item.status === "submitted")
      .flatMap((item) => item.marks.filter((mark) => pupils.some((pupil) => pupil.id === mark.studentId)).map((mark) => ({ ...mark, date: item.date, session: item.session, classId: item.classId })))
    return (
      <div className="grid gap-4">
        <PageHeader title="Attendance" description="You see only your own children, and only submitted registers." />
        {marks.length === 0 ? <p className="text-sm text-slate-600">No submitted register includes your children for this term.</p> : null}
        <ul className="grid gap-2">
          {marks.map((mark) => (
            <li key={`${mark.date}-${mark.session}-${mark.studentId}`} className="flex items-center justify-between rounded-xl border bg-white px-4 py-3 text-sm">
              <span>{formatDate(mark.date)} · {mark.session} · {className(register, mark.classId)}</span>
              <StatusBadge status={mark.status} />
            </li>
          ))}
        </ul>
      </div>
    )
  }

  return (
    <div className="grid gap-4">
      <PageHeader title="Attendance" description="One register per class, date and session. A submitted register changes only through a correction." />
      <div className="flex flex-col gap-2 sm:flex-row">
        <select className="h-8 rounded-lg border bg-white px-2 text-sm" aria-label="Class" value={classId} onChange={(event) => setClassId(event.target.value)}>
          {classIds.map((id) => (
            <option key={id} value={id}>{className(register, id)}</option>
          ))}
        </select>
        <Input type="date" aria-label="Date" value={date} onChange={(event) => setDate(event.target.value)} />
        <select className="h-8 rounded-lg border bg-white px-2 text-sm" aria-label="Session" value={session} onChange={(event) => setSession(event.target.value as SessionName)}>
          <option value="morning">Morning</option>
          <option value="afternoon">Afternoon</option>
        </select>
      </div>
      {classId ? (
        <RegisterForm key={`${classId}:${date}:${session}:${termId}`} classId={classId} date={date} session={session} termId={termId} yearId={yearId} />
      ) : null}
    </div>
  )
}

function RegisterForm({ classId, date, session, termId, yearId }: { classId: string; date: string; session: SessionName; termId: string; yearId: string }) {
  const user = useSession((state) => state.user)
  const register = useRegister()
  const save = useRegister((state) => state.saveRegister)
  const submit = useRegister((state) => state.submitRegister)
  const correct = useRegister((state) => state.correctAttendance)
  const canCorrect = useCan("attendance.correct")
  const existing = register.registers.find((item) => item.id === registerKey(classId, date, session))
  const pupils = register.enrollments
    .filter((item) => item.classId === classId && item.academicYearId === yearId && item.end === null)
    .map((item) => register.students.find((student) => student.id === item.studentId))
    .filter((student) => student !== undefined)
  const [marks, setMarks] = useState<RegisterMark[]>(
    pupils.map((pupil) => existing?.marks.find((mark) => mark.studentId === pupil.id) ?? { studentId: pupil.id, status: "present", reason: "" }),
  )
  const [correction, setCorrection] = useState<{ studentId: string; status: AttendanceStatus; reason: string } | null>(null)
  if (!user) return null
  const locked = existing?.status === "submitted"

  return (
    <div className="grid gap-3">
      <p className="text-sm text-slate-600">{locked ? "Submitted" : existing ? "Open" : "Not started"}</p>
      <ul className="grid gap-2">
        {pupils.map((pupil) => {
          const mark = marks.find((item) => item.studentId === pupil.id)
          return (
            <li key={pupil.id} className="grid gap-2 rounded-xl border bg-white p-3 sm:grid-cols-[1fr_10rem_1fr] sm:items-center">
              <span className="text-sm font-medium">{studentName(pupil)}</span>
              <select
                className="h-8 rounded-lg border px-2 text-sm"
                aria-label={`Status for ${studentName(pupil)}`}
                disabled={locked}
                value={mark?.status ?? "present"}
                onChange={(event) => setMarks((current) => current.map((item) => item.studentId === pupil.id ? { ...item, status: event.target.value as AttendanceStatus } : item))}
              >
                {statuses.map((status) => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
              <Input
                aria-label={`Reason for ${studentName(pupil)}`}
                placeholder="Reason if absent or excused"
                disabled={locked}
                value={mark?.reason ?? ""}
                onChange={(event) => setMarks((current) => current.map((item) => item.studentId === pupil.id ? { ...item, reason: event.target.value } : item))}
              />
            </li>
          )
        })}
      </ul>
      {locked ? null : (
        <div className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => flash(save(user, { classId, date, session, termId, marks }), "Register saved.")}
          >
            Save
          </Button>
          <Button
            type="button"
            onClick={() => {
              const saved = save(user, { classId, date, session, termId, marks })
              if (!saved.ok) {
                flash(saved, "")
                return
              }
              flash(submit(user, registerKey(classId, date, session)), "Register submitted.")
            }}
          >
            Submit
          </Button>
        </div>
      )}
      {locked && canCorrect ? (
        <form
          className="grid gap-2 rounded-xl border bg-white p-4 sm:grid-cols-4"
          onSubmit={(event) => {
            event.preventDefault()
            if (!correction) return
            const result = correct(user, existing.id, correction.studentId, correction.status, correction.reason)
            if (flash(result, "Correction recorded.")) setCorrection(null)
          }}
        >
          <select className="h-8 rounded-lg border px-2 text-sm" aria-label="Pupil to correct" value={correction?.studentId ?? ""} onChange={(event) => setCorrection({ studentId: event.target.value, status: "present", reason: "" })}>
            <option value="">Choose a pupil</option>
            {pupils.map((pupil) => (
              <option key={pupil.id} value={pupil.id}>{studentName(pupil)}</option>
            ))}
          </select>
          <select className="h-8 rounded-lg border px-2 text-sm" aria-label="Corrected status" value={correction?.status ?? "present"} onChange={(event) => setCorrection((current) => current ? { ...current, status: event.target.value as AttendanceStatus } : current)}>
            {statuses.map((status) => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>
          <Input aria-label="Correction reason" placeholder="Reason" value={correction?.reason ?? ""} onChange={(event) => setCorrection((current) => current ? { ...current, reason: event.target.value } : current)} />
          <Button type="submit">Correct</Button>
        </form>
      ) : null}
      {existing && existing.corrections.length > 0 ? (
        <ul className="text-sm text-slate-600">
          {existing.corrections.map((item) => (
            <li key={item.id}>{item.from} → {item.to}: {item.reason}</li>
          ))}
        </ul>
      ) : null}
    </div>
  )
}
