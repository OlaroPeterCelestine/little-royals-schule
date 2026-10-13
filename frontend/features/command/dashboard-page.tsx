"use client"

import Link from "next/link"
import { CircleCheck, TriangleAlert, UserPlus, Users, Zap } from "lucide-react"
import { can } from "@/config/permissions"
import { school } from "@/config/school"
import { StatusBadge } from "@/components/shared/status-badge"
import { useSession } from "@/features/records/session"
import { useRegister } from "@/features/records/store"
import { useUi } from "@/features/records/ui-state"
import { buildDashboard, studentName, visibleStudents, type DeskBar, type DeskCard, type DeskSlice } from "@/features/records/selectors"
import { formatDate } from "@/lib/format"

const cardIcons = {
  enrolled: Users,
  children: Users,
  pupils: Users,
  attendance: CircleCheck,
  outstanding: TriangleAlert,
  fees: TriangleAlert,
  pipeline: UserPlus,
  issued: TriangleAlert,
  collected: CircleCheck,
  credit: CircleCheck,
  drafts: TriangleAlert,
  results: CircleCheck,
  tasks: CircleCheck,
  approvals: TriangleAlert,
} as const

export function DashboardPage() {
  const user = useSession((state) => state.user)
  const register = useRegister()
  const yearId = useUi((state) => state.yearId)
  const termId = useUi((state) => state.termId)
  if (!user) return null
  const desk = buildDashboard(user, register, yearId, termId)
  const term = register.terms.find((item) => item.id === termId)

  return (
    <div className="space-y-5">
      <section>
        <div className="flex flex-col gap-3 rounded-xl border border-sky-100 bg-gradient-to-r from-sky-50 via-sky-50/70 to-indigo-50/40 px-4 py-2.5 shadow-sm sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-2.5 text-xs">
            <span className="flex size-5 shrink-0 items-center justify-center rounded-md bg-sky-500/10 text-sky-600">
              <Zap className="size-3.5" />
            </span>
            <p className="text-slate-700">
              <span className="font-semibold text-slate-900">Today · {term?.name ?? "This term"}: </span>
              {desk.insight}
            </p>
          </div>
          <Link href={desk.insightHref} className="shrink-0 text-xs font-semibold text-sky-600 hover:text-sky-700">
            Open the record
          </Link>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        {desk.cards.map((item) => (
          <MetricCard key={item.id} card={item} />
        ))}
      </section>

      <section className="grid grid-cols-1 gap-5 lg:grid-cols-12">
        <article className="flex flex-col justify-between rounded-xl border border-slate-200/80 bg-white p-5 shadow-[var(--shadow-card)] lg:col-span-4">
          <div>
            <h2 className="text-sm font-semibold text-slate-900">Pupils by class</h2>
            <Donut slices={desk.slices} total={desk.enrolled} />
            <ul className="mt-4 space-y-2">
              {desk.slices.map((slice) => (
                <li key={slice.label} className="flex items-center justify-between text-xs">
                  <span className="flex items-center gap-2">
                    <span className="size-2.5 rounded-full" style={{ background: slice.color }} />
                    <span className="font-medium text-slate-600">{slice.label}</span>
                  </span>
                  <span className="font-semibold text-slate-800 tabular-nums">
                    {slice.count}{" "}
                    <span className="font-normal text-slate-400">({desk.enrolled ? Math.round((slice.count / desk.enrolled) * 100) : 0}%)</span>
                  </span>
                </li>
              ))}
            </ul>
            {desk.slices.length === 0 ? <p className="mt-4 text-xs text-slate-500">No enrolled pupils in your scope.</p> : null}
          </div>
          {can(user.role, "classes.view") ? (
            <Link href="/app/academics/classes" className="mt-5 flex items-center justify-center rounded-lg bg-slate-900 px-3 py-2.5 text-xs font-semibold text-white hover:bg-slate-800">
              Open classes and capacity
            </Link>
          ) : (
            <Link href="/app/students" className="mt-5 flex items-center justify-center rounded-lg bg-slate-900 px-3 py-2.5 text-xs font-semibold text-white hover:bg-slate-800">
              Open the pupil list
            </Link>
          )}
        </article>

        <article className="rounded-xl border border-slate-200/80 bg-white p-5 shadow-[var(--shadow-card)] lg:col-span-8">
          <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
            <div>
              <h2 className="text-sm font-semibold text-slate-900">Morning attendance</h2>
              <p className="mt-1 text-xs text-slate-500">{formatDate(school.asOf)} · present includes late arrivals</p>
            </div>
            {desk.openRegisters > 0 ? (
              <span className="rounded-md border border-amber-200/60 bg-amber-50 px-1.5 py-0.5 text-[11px] font-semibold text-amber-700">
                {desk.openRegisters} still open
              </span>
            ) : (
              <span className="text-xs text-slate-400">Submitted and open registers for this date</span>
            )}
          </div>
          {desk.bars.length === 0 ? (
            <p className="text-sm text-slate-600">No morning register exists for {formatDate(school.asOf)} in your classes.</p>
          ) : (
            <AttendanceBars bars={desk.bars} />
          )}
        </article>
      </section>

      <section className="grid grid-cols-1 gap-5 lg:grid-cols-12">
        <article className="rounded-xl border border-slate-200/80 bg-white p-5 shadow-[var(--shadow-card)] lg:col-span-4">
          <h2 className="text-sm font-semibold text-slate-900">Open work</h2>
          {desk.tasks.length === 0 ? <p className="mt-3 text-xs leading-relaxed text-slate-500">Nothing is waiting on your role for this term.</p> : null}
          <ul className="mt-3 grid gap-2">
            {desk.tasks.map((task) => (
              <li key={task.id}>
                <Link href={task.href} className="block rounded-lg px-2 py-1.5 hover:bg-slate-50">
                  <span className="block text-xs font-semibold text-slate-900">{task.title}</span>
                  <span className="text-[11px] text-slate-500">{task.detail}</span>
                </Link>
              </li>
            ))}
          </ul>
          <div className="mt-4 border-t border-slate-100 pt-4">
            <h3 className="text-xs font-semibold text-slate-900">Coming up</h3>
            <ul className="mt-2 grid gap-2">
              {desk.upcoming.map((item) => (
                <li key={item.id} className="flex items-baseline justify-between gap-3 text-xs">
                  <span className="text-slate-700">{item.title}</span>
                  <span className="text-slate-400 tabular-nums">{formatDate(item.date)}</span>
                </li>
              ))}
            </ul>
          </div>
        </article>

        <article className="rounded-xl border border-slate-200/80 bg-white p-5 shadow-[var(--shadow-card)] lg:col-span-8">
          <div className="mb-3 flex items-center justify-between gap-3">
            <h2 className="text-sm font-semibold text-slate-900">{desk.applicants ? "Recent applications" : "Linked pupils"}</h2>
            <Link href={desk.applicants ? "/app/admissions/applications" : "/app/students"} className="text-xs font-semibold text-sky-700 hover:text-sky-900">
              View all
            </Link>
          </div>
          {desk.applicants ? <ApplicantTable rows={desk.applicants} /> : <PupilTable />}
        </article>
      </section>
    </div>
  )
}

function MetricCard({ card }: { card: DeskCard }) {
  const Icon = cardIcons[card.id as keyof typeof cardIcons] ?? Users
  return (
    <Link href={card.href} className="block rounded-xl focus-visible:ring-3 focus-visible:ring-sky-500/40 focus-visible:outline-none">
      <article className="flex h-full flex-col justify-between rounded-xl border border-slate-200/80 bg-white p-4 shadow-[var(--shadow-card)] transition-shadow hover:shadow-[var(--shadow-card-hover)]">
        <div>
          <div className="mb-2 flex items-center gap-2 text-slate-500">
            <Icon className="size-4 text-slate-400" aria-hidden="true" />
            <h2 className="text-xs font-medium text-slate-600">{card.label}</h2>
          </div>
          <p className="mb-4 text-2xl font-bold tracking-tight text-slate-900 tabular-nums">{card.value}</p>
        </div>
        <div className="flex flex-col gap-1 border-t border-slate-100 pt-3 text-xs text-slate-500">
          {card.rows.map((row) => (
            <div key={row.label} className="flex justify-between gap-3">
              <span>{row.label}</span>
              <span className={`font-semibold tabular-nums ${row.tone === "rose" ? "text-rose-600" : row.tone === "amber" ? "text-amber-600" : "text-slate-800"}`}>
                {row.value}
              </span>
            </div>
          ))}
        </div>
      </article>
    </Link>
  )
}

function Donut({ slices, total }: { slices: DeskSlice[]; total: number }) {
  const gradient =
    total === 0
      ? "conic-gradient(#e2e8f0 0deg 360deg)"
      : `conic-gradient(${slices
          .reduce<{ angle: number; stops: string[] }>(
            (state, slice) => {
              const next = state.angle + (slice.count / total) * 360
              state.stops.push(`${slice.color} ${state.angle}deg ${next}deg`)
              state.angle = next
              return state
            },
            { angle: 0, stops: [] },
          )
          .stops.join(", ")})`

  return (
    <div className="my-4 flex justify-center">
      <div className="flex size-40 items-center justify-center rounded-full p-3.5 shadow-inner" style={{ background: gradient }}>
        <div className="flex h-full w-full flex-col items-center justify-center rounded-full bg-white">
          <span className="text-2xl font-bold tracking-tight text-slate-900 tabular-nums">{total}</span>
          <span className="text-[11px] font-medium text-slate-400">In your scope</span>
        </div>
      </div>
    </div>
  )
}

function AttendanceBars({ bars }: { bars: DeskBar[] }) {
  return (
    <div>
      <div className="flex h-56 items-end gap-2 border-b border-slate-100 pt-8 pb-3">
        {bars.map((bar) => {
          const total = bar.present + bar.other
          const present = total === 0 ? 0 : Math.round((bar.present / total) * 100)
          const other = total === 0 ? 0 : 100 - present
          return (
            <div key={bar.label} className="flex flex-1 flex-col items-center gap-1.5">
              <div className="flex h-44 items-end gap-1.5">
                <div className="w-5 rounded-t bg-slate-200" style={{ height: `${Math.max(other, 4)}%` }} title={`${other}% not present`} />
                <div className="w-5 rounded-t bg-sky-500" style={{ height: `${Math.max(present, 4)}%` }} title={`${present}% present or late`} />
              </div>
              <span className="text-xs font-medium text-slate-500">{bar.label}</span>
              <span className="text-[11px] text-slate-400 tabular-nums">{present}%</span>
            </div>
          )
        })}
      </div>
      <div className="flex items-center gap-6 pt-3 text-xs text-slate-500">
        <span className="flex items-center gap-2">
          <span className="size-3 rounded-sm bg-sky-500" />
          Present and late
        </span>
        <span className="flex items-center gap-2">
          <span className="size-3 rounded-sm bg-slate-200" />
          Absent or excused
        </span>
      </div>
    </div>
  )
}

function ApplicantTable({ rows }: { rows: { id: string; name: string; email: string; className: string; status: string; createdAt: string }[] }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-xs">
        <thead className="text-[10px] font-semibold tracking-wide text-slate-400 uppercase">
          <tr>
            <th className="px-3 py-2 font-semibold">Applicant</th>
            <th className="px-3 py-2 font-semibold">Guardian</th>
            <th className="px-3 py-2 font-semibold">Class</th>
            <th className="px-3 py-2 font-semibold">Status</th>
            <th className="px-3 py-2 font-semibold">Opened</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id} className="border-t border-slate-100 hover:bg-slate-50/70">
              <td className="px-3 py-2.5 font-semibold text-slate-900">
                <Link href={`/app/admissions/applications/${row.id}`} className="hover:underline">
                  {row.name}
                </Link>
              </td>
              <td className="px-3 py-2.5 text-slate-500">{row.email}</td>
              <td className="px-3 py-2.5 text-slate-700">{row.className}</td>
              <td className="px-3 py-2.5">
                <StatusBadge status={row.status} />
              </td>
              <td className="px-3 py-2.5 text-slate-500 tabular-nums">{formatDate(row.createdAt)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function PupilTable() {
  const user = useSession((state) => state.user)
  const register = useRegister()
  const yearId = useUi((state) => state.yearId)
  if (!user) return null
  const rows = visibleStudents(user, register, yearId).slice(0, 5)

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-xs">
        <thead className="text-[10px] font-semibold tracking-wide text-slate-400 uppercase">
          <tr>
            <th className="px-3 py-2 font-semibold">Pupil</th>
            <th className="px-3 py-2 font-semibold">Student ID</th>
            <th className="px-3 py-2 font-semibold">Status</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id} className="border-t border-slate-100 hover:bg-slate-50/70">
              <td className="px-3 py-2.5 font-semibold text-slate-900">
                <Link href={`/app/students/${row.id}`} className="hover:underline">
                  {studentName(row)}
                </Link>
              </td>
              <td className="px-3 py-2.5 text-slate-500">{row.studentNumber}</td>
              <td className="px-3 py-2.5">
                <StatusBadge status={row.status} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
