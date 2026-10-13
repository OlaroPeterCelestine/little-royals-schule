"use client"

import Link from "next/link"
import { PageHeader } from "@/components/shared/page-header"
import { useSession } from "@/features/records/session"
import { useRegister } from "@/features/records/store"
import { useUi } from "@/features/records/ui-state"
import { accountName, visibleClassIds } from "@/features/records/selectors"

export function ClassList() {
  const user = useSession((state) => state.user)
  const register = useRegister()
  const yearId = useUi((state) => state.yearId)
  if (!user) return null
  const allowed = new Set(visibleClassIds(user, register))
  const rows = register.classes.filter((item) => allowed.has(item.id))

  return (
    <div className="grid gap-4">
      <PageHeader title="Classes & Streams" description="Enrollment counts come from current class placements for the selected year." />
      <ul className="grid gap-2">
        {rows.map((item) => {
          const enrolled = register.enrollments.filter((enrollment) => enrollment.classId === item.id && enrollment.academicYearId === yearId && enrollment.end === null).length
          return (
            <li key={item.id} className="rounded-xl border bg-white px-4 py-3 text-sm">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <p className="font-medium">{item.name}</p>
                <p className="text-slate-600">{enrolled} / {item.capacity}</p>
              </div>
              <p className="text-slate-600">{item.level} · {item.room} · {accountName(register, item.teacherId)}</p>
              <Link href="/app/academics/attendance" className="text-[#1e4b9b] underline">
                Open attendance
              </Link>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
