"use client"

import Link from "next/link"
import { PageHeader } from "@/components/shared/page-header"
import { EmptyState } from "@/components/shared/empty-state"
import { useSession } from "@/features/records/session"
import { useRegister } from "@/features/records/store"
import { useUi } from "@/features/records/ui-state"
import { buildTasks } from "@/features/records/selectors"

export function TasksPage() {
  const user = useSession((state) => state.user)
  const register = useRegister()
  const termId = useUi((state) => state.termId)
  if (!user) return null
  const tasks = buildTasks(user, register, termId)

  return (
    <div className="grid gap-4">
      <PageHeader title="My Tasks" description="These come from open registers, draft applications, unpublished marks and draft invoices. Completing the record clears the task." />
      {tasks.length === 0 ? <EmptyState title="No open tasks" body="Nothing in the selected term is waiting on your role." /> : null}
      <ul className="grid gap-2">
        {tasks.map((task) => (
          <li key={task.id} className="rounded-xl border bg-white px-4 py-3">
            <Link href={task.href} className="text-sm font-medium text-[#1e4b9b] hover:underline">
              {task.title}
            </Link>
            <p className="text-sm text-slate-600">{task.detail}</p>
          </li>
        ))}
      </ul>
    </div>
  )
}
