import type { ReactNode } from "react"

export function KpiCard({ label, value, detail, href }: { label: string; value: string; detail: string; href?: string }) {
  const body = (
    <article className="rounded-xl border border-slate-200/80 bg-white p-4 shadow-[var(--shadow-card)] transition-shadow hover:shadow-[var(--shadow-card-hover)]">
      <p className="text-xs font-medium text-slate-600">{label}</p>
      <p className="mt-2 text-2xl font-bold tracking-tight text-slate-900 tabular-nums">{value}</p>
      <p className="mt-3 border-t border-slate-100 pt-3 text-xs text-slate-500">{detail}</p>
    </article>
  )
  if (!href) return body
  return (
    <a href={href} className="block rounded-xl focus-visible:ring-3 focus-visible:ring-sky-500/40 focus-visible:outline-none">
      {body}
    </a>
  )
}

export function KpiGrid({ children }: { children: ReactNode }) {
  return <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{children}</div>
}
