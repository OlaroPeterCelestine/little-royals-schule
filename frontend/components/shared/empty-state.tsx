import type { ReactNode } from "react"

export function EmptyState({ title, body, action }: { title: string; body: string; action?: ReactNode }) {
  return (
    <div className="flex flex-col items-start gap-2 rounded-xl border border-dashed bg-white px-4 py-8">
      <h2 className="text-sm font-semibold text-slate-900">{title}</h2>
      <p className="max-w-lg text-sm text-slate-600">{body}</p>
      {action}
    </div>
  )
}
