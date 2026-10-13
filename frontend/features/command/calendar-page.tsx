"use client"

import { useState } from "react"
import { school } from "@/config/school"
import { PageHeader } from "@/components/shared/page-header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Field } from "@/components/shared/field"
import { ConfirmDialog } from "@/components/shared/confirm-dialog"
import { useCan } from "@/components/shared/access"
import { flash } from "@/components/shared/flash"
import { formatDate } from "@/lib/format"
import { useSession } from "@/features/records/session"
import { useRegister } from "@/features/records/store"
import { useUi } from "@/features/records/ui-state"

export function CalendarPage() {
  const user = useSession((state) => state.user)
  const items = useRegister((state) => state.calendar)
  const add = useRegister((state) => state.addCalendarItem)
  const remove = useRegister((state) => state.removeCalendarItem)
  const termId = useUi((state) => state.termId)
  const canEdit = useCan("calendar.edit")
  const [title, setTitle] = useState("")
  const [date, setDate] = useState<string>(school.asOf)
  const [removeId, setRemoveId] = useState<string | null>(null)
  if (!user) return null
  const visible = items.filter((item) => item.termId === termId).sort((a, b) => a.date.localeCompare(b.date))

  return (
    <div className="grid gap-4">
      <PageHeader title="School Calendar" description="Term dates and exams are locked. Other events can be added by the registrar or head teacher." />
      <ul className="grid gap-2">
        {visible.map((item) => (
          <li key={item.id} className="flex flex-wrap items-center justify-between gap-2 rounded-xl border bg-white px-4 py-3">
            <div>
              <p className="text-sm font-medium">{item.title}</p>
              <p className="text-xs text-slate-500 capitalize">{item.kind} · {formatDate(item.date)}</p>
            </div>
            {canEdit && !item.locked ? (
              <Button type="button" variant="outline" size="sm" onClick={() => setRemoveId(item.id)}>
                Remove
              </Button>
            ) : null}
          </li>
        ))}
      </ul>
      {canEdit ? (
        <form
          className="grid gap-3 rounded-xl border bg-white p-4 sm:grid-cols-[1fr_10rem_auto] sm:items-end"
          onSubmit={(event) => {
            event.preventDefault()
            const result = add(user, title, date, termId)
            if (flash(result, "Event added.")) setTitle("")
          }}
        >
          <Field label="Event" required>
            <Input value={title} onChange={(event) => setTitle(event.target.value)} />
          </Field>
          <Field label="Date" required>
            <Input type="date" value={date} onChange={(event) => setDate(event.target.value)} />
          </Field>
          <Button type="submit">Add event</Button>
        </form>
      ) : (
        <p className="text-sm text-slate-600">You can read the calendar. Adding events needs the registrar or head teacher role.</p>
      )}
      <ConfirmDialog
        open={Boolean(removeId)}
        onOpenChange={(open) => !open && setRemoveId(null)}
        title="Remove this event?"
        description="Locked term dates and exams stay on the calendar."
        confirmLabel="Remove"
        destructive
        onConfirm={() => {
          if (!removeId) return
          const result = remove(user, removeId)
          flash(result, "Event removed.")
          setRemoveId(null)
        }}
      />
    </div>
  )
}
