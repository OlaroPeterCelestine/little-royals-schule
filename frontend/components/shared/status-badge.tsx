const tones: Record<string, string> = {
  draft: "bg-slate-100 text-slate-700 border-slate-200",
  submitted: "bg-sky-50 text-sky-800 border-sky-200/60",
  under_review: "bg-sky-50 text-sky-800 border-sky-200/60",
  interview: "bg-amber-50 text-amber-700 border-amber-200/60",
  offered: "bg-indigo-50 text-indigo-800 border-indigo-200/60",
  waitlisted: "bg-amber-50 text-amber-700 border-amber-200/60",
  rejected: "bg-rose-50 text-rose-700 border-rose-200/60",
  accepted: "bg-emerald-50 text-emerald-700 border-emerald-200/60",
  enrolled: "bg-emerald-50 text-emerald-700 border-emerald-200/60",
  active: "bg-emerald-50 text-emerald-700 border-emerald-200/60",
  watch: "bg-amber-50 text-amber-700 border-amber-200/60",
  withdrawn: "bg-slate-100 text-slate-700 border-slate-200",
  graduated: "bg-slate-100 text-slate-700 border-slate-200",
  present: "bg-emerald-50 text-emerald-700 border-emerald-200/60",
  absent: "bg-rose-50 text-rose-700 border-rose-200/60",
  late: "bg-amber-50 text-amber-700 border-amber-200/60",
  excused: "bg-sky-50 text-sky-800 border-sky-200/60",
  open: "bg-amber-50 text-amber-700 border-amber-200/60",
  moderated: "bg-indigo-50 text-indigo-800 border-indigo-200/60",
  approved: "bg-indigo-50 text-indigo-800 border-indigo-200/60",
  published: "bg-emerald-50 text-emerald-700 border-emerald-200/60",
  issued: "bg-sky-50 text-sky-800 border-sky-200/60",
  partial: "bg-amber-50 text-amber-700 border-amber-200/60",
  paid: "bg-emerald-50 text-emerald-700 border-emerald-200/60",
  overdue: "bg-rose-50 text-rose-700 border-rose-200/60",
  invited: "bg-amber-50 text-amber-700 border-amber-200/60",
}

const labels: Record<string, string> = {
  under_review: "Under review",
  partial: "Part paid",
}

export function StatusBadge({ status }: { status: string }) {
  const tone = tones[status] ?? "bg-slate-100 text-slate-700 border-slate-200"
  const label = labels[status] ?? status.replaceAll("_", " ")
  return (
    <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-semibold capitalize ${tone}`}>
      {label}
    </span>
  )
}
