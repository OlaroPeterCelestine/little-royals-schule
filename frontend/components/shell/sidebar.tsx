"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { school } from "@/config/school"
import { useUi } from "@/features/records/ui-state"
import { Crest } from "@/components/shell/crest"
import { cn } from "@/lib/utils"

const icons = {
  "squares-2x2": "M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25A2.25 2.25 0 0 1 13.5 18v-2.25Z",
  inbox: "M2.25 13.5h3.86a2.25 2.25 0 0 1 2.012 1.244l.256.512a2.25 2.25 0 0 0 2.013 1.244h3.218a2.25 2.25 0 0 0 2.013-1.244l.256-.512a2.25 2.25 0 0 1 2.013-1.244h3.859m-19.5.338V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18v-4.162c0-.224-.034-.447-.1-.661L19.24 5.338a2.25 2.25 0 0 0-2.15-1.588H6.911a2.25 2.25 0 0 0-2.15 1.588L2.35 13.177a2.25 2.25 0 0 0-.1.661Z",
  users: "M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z",
  "chart-bar": "M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z",
  heart: "M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z",
  "squares-plus": "M13.5 16.875h3.375m0 0h3.375m-3.375 0V13.5m0 3.375v3.375M6 10.5h2.25a2.25 2.25 0 0 0 2.25-2.25V6a2.25 2.25 0 0 0-2.25-2.25H6A2.25 2.25 0 0 0 3.75 6v2.25A2.25 2.25 0 0 0 6 10.5Zm0 9.75h2.25A2.25 2.25 0 0 0 10.5 18v-2.25a2.25 2.25 0 0 0-2.25-2.25H6a2.25 2.25 0 0 0-2.25 2.25V18A2.25 2.25 0 0 0 6 20.25Zm9.75-9.75H18a2.25 2.25 0 0 0 2.25-2.25V6A2.25 2.25 0 0 0 18 3.75h-2.25A2.25 2.25 0 0 0 13.5 6v2.25a2.25 2.25 0 0 0 2.25 2.25Z",
  "book-open": "M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25",
  "academic-cap": "M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342M6.75 15a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm0 0v-3.675A55.378 55.378 0 0 1 12 8.443m-7.007 11.55A5.981 5.981 0 0 0 6.75 15.75v-1.5",
  "user-circle": "M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z",
  "building-office-2": "M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3.75h.008v.008h-.008v-.008Zm0 3h.008v.008h-.008v-.008Zm0 3h.008v.008h-.008v-.008Z",
  banknotes: "M2.25 18.75a60.07 60.07 0 0 1 15.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 0 1 3 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 0 0-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 0 1-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 0 0 3 15h-.75M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm3 0h.008v.008H18V10.5Zm-12 0h.008v.008H6V10.5Z",
  "chat-bubble-left-right": "M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 0 1-.825-.242m9.345-8.334a2.126 2.126 0 0 0-.476-.095 48.64 48.64 0 0 0-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0 0 11.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155",
  lifebuoy: "M16.712 4.33a9.027 9.027 0 0 1 1.652 1.306c.51.51.944 1.064 1.306 1.652M16.712 4.33l-3.448 4.138m3.448-4.138a9.014 9.014 0 0 0-9.424 0M19.67 7.288l-4.138 3.448m4.138-3.448a9.014 9.014 0 0 1 0 9.424m-4.138-5.976a3.736 3.736 0 0 0-.88-1.388 3.737 3.737 0 0 0-1.388-.88m2.268 2.268a3.765 3.765 0 0 1 0 2.528m-2.268-4.796a3.765 3.765 0 0 0-2.528 0m4.796 4.796c-.181.506-.475.982-.88 1.388a3.736 3.736 0 0 1-1.388.88m2.268-2.268 4.138 3.448m0 0a9.027 9.027 0 0 1-1.306 1.652c-.51.51-1.064.944-1.652 1.306m0 0-3.448-4.138m3.448 4.138a9.014 9.014 0 0 1-9.424 0m5.976-4.138a3.765 3.765 0 0 1-2.528 0m0 0a3.736 3.736 0 0 1-1.388-.88 3.737 3.737 0 0 1-.88-1.388m2.268 2.268L7.288 19.67m0 0a9.024 9.024 0 0 1-1.652-1.306 9.027 9.027 0 0 1-1.306-1.652m0 0 4.138-3.448M4.33 16.712a9.014 9.014 0 0 1 0-9.424m4.138 5.976a3.765 3.765 0 0 1 0-2.528m0 0c.181-.506.475-.982.88-1.388a3.736 3.736 0 0 1 1.388-.88m-2.268 2.268L4.33 7.288m6.406 1.18L7.288 4.33m0 0a9.024 9.024 0 0 0-1.652 1.306A9.025 9.025 0 0 0 4.33 7.288",
  "document-text": "M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z",
  truck: "M8.25 18.75a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 0 1-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 0 0-3.213-9.193 2.056 2.056 0 0 0-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 0 0-10.026 0 1.106 1.106 0 0 0-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12",
  "user-group": "M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z",
  "lock-closed": "M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z",
  "chevron-down": "m19.5 8.25-7.5 7.5-7.5-7.5",
  "chevron-double-left": "m18.75 4.5-7.5 7.5 7.5 7.5m-6-15L5.25 12l7.5 7.5",
  "rectangle-stack": "M6 6.878V6a2.25 2.25 0 0 1 2.25-2.25h7.5A2.25 2.25 0 0 1 18 6v.878m-12 0c.235-.083.487-.128.75-.128h10.5c.263 0 .515.045.75.128m-12 0A2.25 2.25 0 0 0 4.5 9v.878m13.5-3A2.25 2.25 0 0 1 19.5 9v.878m0 0a2.246 2.246 0 0 0-.75-.128H5.25c-.263 0-.515.045-.75.128m15 0A2.25 2.25 0 0 1 21 12v6a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 18v-6c0-.98.626-1.813 1.5-2.122",
} as const

type IconName = keyof typeof icons

type Leaf = { label: string; href: string; match: string[] }
type Group = { label: string; icon: IconName; href?: string; match?: string[]; children?: Leaf[] }

const groups: Group[] = [
  { label: "Dashboard", icon: "squares-2x2", href: "/#dashboard", match: ["/app/dashboard", "/app/tasks", "/app/approvals"] },
  { label: "Enrolment", icon: "inbox", href: "/#pupils-admissions-enquiries", match: ["/app/admissions"] },
  { label: "Pupils", icon: "users", href: "/#pupils-students-all-students", match: ["/app/students"] },
  { label: "Attendance", icon: "chart-bar", href: "/#pupils-attendance-daily", match: ["/app/academics/attendance"] },
  {
    label: "Pastoral",
    icon: "heart",
    children: [
      { label: "Care", href: "/#pupils-care-behavior", match: [] },
      { label: "Clinic", href: "/#pupils-clinic-clinic", match: [] },
    ],
  },
  { label: "Classes", icon: "squares-plus", href: "/#classroom-classes-classes-and-streams", match: ["/app/academics/classes"] },
  { label: "Timetable", icon: "squares-2x2", href: "/#classroom-timetable-class", match: [] },
  { label: "Teaching", icon: "book-open", href: "/#classroom-teaching-curriculum", match: [] },
  { label: "Assessment", icon: "academic-cap", href: "/#classroom-assessment-exams", match: ["/app/exams"] },
  { label: "Learning", icon: "academic-cap", href: "/#classroom-learning-courses", match: [] },
  {
    label: "Staff",
    icon: "user-circle",
    children: [
      { label: "People", href: "/#staff-people-teachers", match: [] },
      { label: "Time", href: "/#staff-time-today", match: [] },
      { label: "Pay", href: "/#staff-pay-pay-runs", match: [] },
    ],
  },
  { label: "School", icon: "building-office-2", href: "/#office-school-calendar", match: ["/app/calendar"] },
  { label: "Fees", icon: "banknotes", href: "/#office-fees-structures", match: ["/app/finance"] },
  { label: "Messages", icon: "chat-bubble-left-right", href: "/#office-messages-announcements", match: ["/app/notifications"] },
  { label: "Front desk", icon: "lifebuoy", href: "/#office-front-visitors", match: [] },
  { label: "Documents", icon: "document-text", href: "/#office-documents-school", match: [] },
  { label: "Library", icon: "book-open", href: "/#campus-library-catalog", match: [] },
  { label: "Transport", icon: "truck", href: "/#campus-transport-vehicles", match: [] },
  { label: "Store", icon: "squares-plus", href: "/#campus-store-stock", match: [] },
  { label: "Events", icon: "user-group", href: "/#campus-events-clubs", match: [] },
  { label: "Settings", icon: "lock-closed", href: "/#settings-main-general", match: ["/app/system"] },
]

function matches(pathname: string, prefixes: string[] | undefined) {
  return !!prefixes?.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`))
}

export function Sidebar({ collapsed, onNavigate }: { collapsed: boolean; onNavigate?: () => void }) {
  const pathname = usePathname()
  const setCollapsed = useUi((state) => state.setCollapsed)
  const [open, setOpen] = useState<Record<string, boolean>>({})

  return (
    <div className="flex h-full min-h-0 flex-1 flex-col overflow-hidden bg-white select-none">
      <div className="flex h-full min-h-0 flex-col overflow-y-auto p-4 [scrollbar-width:none]">
        <div className={cn("mb-6 flex items-center justify-between px-2", collapsed && "flex-col gap-3 px-0")}>
          <div className={cn("flex min-w-0 items-center gap-2.5", collapsed && "justify-center")}>
            <Crest className={collapsed ? "h-9 w-9" : "h-14 w-14"} alt={collapsed ? school.name : "School crest"} />
            {collapsed ? null : (
              <span className="flex min-w-0 flex-col">
                <span className="truncate text-sm leading-tight font-semibold tracking-tight text-slate-900">{school.name}</span>
                <span className="mt-0.5 text-[10px] leading-snug font-semibold tracking-wide text-sky-700">Nursery & Primary</span>
              </span>
            )}
          </div>
          <button
            type="button"
            className="rounded-md p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            aria-expanded={!collapsed}
            onClick={() => setCollapsed(!collapsed)}
          >
            <Hero name="chevron-double-left" className={cn("size-4 transition-transform", collapsed && "rotate-180")} />
          </button>
        </div>

        <nav aria-label="Sidebar" className="flex min-h-0 flex-1 flex-col gap-[0.15rem] pb-2 text-xs font-medium">
          {groups.map((group) => {
            const childOn = group.children?.some((child) => matches(pathname, child.match))
            const expanded = !collapsed && (open[group.label] || !!childOn)
            if (group.children) {
              return (
                <section key={group.label}>
                  <button
                    type="button"
                    className="flex w-full items-center gap-[0.55rem] rounded-lg px-[0.55rem] py-[0.4rem] text-left text-[0.68rem] font-bold tracking-[0.04em] text-[#64748b] uppercase hover:bg-[#f8fafc] hover:text-[#0f172a]"
                    aria-expanded={expanded}
                    aria-label={group.label}
                    title={group.label}
                    onClick={() => {
                      if (collapsed) {
                        setCollapsed(false)
                        setOpen((current) => ({ ...current, [group.label]: true }))
                        return
                      }
                      setOpen((current) => ({ ...current, [group.label]: !expanded }))
                    }}
                  >
                    <Hero name={group.icon} className={cn("size-4 shrink-0 text-[#94a3b8]", collapsed && "mx-auto")} />
                    {collapsed ? null : (
                      <>
                        <span className="truncate">{group.label}</span>
                        <Hero name="chevron-down" className={cn("ml-auto size-3.5 shrink-0 text-[#94a3b8] transition-transform", expanded && "rotate-180")} />
                      </>
                    )}
                  </button>
                  {expanded ? (
                    <div className="mt-[0.15rem] mb-[0.35rem] ml-[1.15rem] flex flex-col gap-[0.1rem] border-l border-[#e2e8f0] pl-[0.55rem]">
                      {group.children.map((child) => {
                        const active = matches(pathname, child.match)
                        return (
                          <Link
                            key={child.label}
                            href={child.href}
                            aria-current={active ? "page" : undefined}
                            onClick={onNavigate}
                            className={cn(
                              "rounded-md px-2 py-1.5 leading-snug text-slate-600 hover:bg-slate-50 hover:text-slate-900",
                              active && "bg-[#1e4b9b] font-semibold text-white shadow-sm hover:bg-[#1e4b9b] hover:text-white",
                            )}
                          >
                            {child.label}
                          </Link>
                        )
                      })}
                    </div>
                  ) : null}
                </section>
              )
            }
            const dashboard = group.label === "Dashboard"
            const on = matches(pathname, group.match)
            return (
              <Link
                key={group.label}
                href={group.href!}
                title={group.label}
                aria-label={group.label}
                aria-current={on ? "page" : undefined}
                onClick={onNavigate}
                className={cn(
                  "flex items-center gap-[0.55rem] rounded-lg transition-colors",
                  dashboard ? "gap-2.5 px-2.5 py-2" : "px-[0.55rem] py-[0.4rem] text-[0.68rem] font-bold tracking-[0.04em] uppercase",
                  on ? "bg-[#1e4b9b] font-semibold text-white shadow-sm hover:bg-[#1e4b9b] hover:text-white" : "text-[#64748b] hover:bg-[#f8fafc] hover:text-[#0f172a]",
                  collapsed && "justify-center px-2",
                )}
              >
                <Hero name={group.icon} className={cn("size-4 shrink-0", on ? "text-white" : "text-[#94a3b8]")} />
                {collapsed ? null : <span className="truncate leading-snug">{group.label}</span>}
              </Link>
            )
          })}
        </nav>

        {collapsed ? null : (
          <div className="mt-4 shrink-0 border-t border-slate-100 pt-4">
            <div className="rounded-xl border border-slate-200/60 bg-slate-50/80 p-3">
              <div className="mb-2 flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <Hero name="rectangle-stack" className="size-3.5 text-indigo-600" />
                  <span className="text-xs font-semibold text-slate-700">School roll</span>
                </div>
                <span className="rounded bg-indigo-50 px-1.5 py-0.5 text-[10px] font-semibold text-indigo-600">84%</span>
              </div>
              <div className="mb-2 h-1.5 overflow-hidden rounded-full bg-slate-200">
                <div className="h-1.5 rounded-full bg-indigo-600" style={{ width: "84%" }} />
              </div>
              <div className="flex items-center justify-between text-[11px] font-medium text-slate-500 tabular-nums">
                <span>
                  Capacity: <strong className="text-slate-800">1,690</strong>
                </span>
                <span>
                  Enrolled: <strong className="text-slate-800">1,420</strong>
                </span>
              </div>
              <div className="mt-2 flex items-center justify-between text-[11px] text-slate-500">
                <span>
                  Version <strong className="text-slate-800">{school.version}</strong>
                </span>
                <Link href="/#admin-system-release-notes" onClick={onNavigate} className="font-semibold text-sky-700 hover:text-sky-900">
                  History
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function Hero({ name, className }: { name: IconName; className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d={icons[name]} />
    </svg>
  )
}
