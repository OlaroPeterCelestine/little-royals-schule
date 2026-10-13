"use client"

import { PageHeader } from "@/components/shared/page-header"
import { useSession } from "@/features/records/session"
import { useRegister } from "@/features/records/store"
import { useUi } from "@/features/records/ui-state"
import { studentName, visibleStudents } from "@/features/records/selectors"

export function GuardianList() {
  const user = useSession((state) => state.user)
  const register = useRegister()
  const yearId = useUi((state) => state.yearId)
  if (!user) return null
  const visible = new Set(visibleStudents(user, register, yearId).map((student) => student.id))
  const rows = register.guardians
    .map((guardian) => ({
      guardian,
      links: register.links.filter((link) => link.guardianId === guardian.id && visible.has(link.studentId)),
    }))
    .filter((row) => row.links.length > 0)

  return (
    <div className="grid gap-4">
      <PageHeader title="Guardians & Households" description="Guardians are shared records. A family with two children is not entered twice." />
      <ul className="grid gap-2">
        {rows.map(({ guardian, links }) => (
          <li key={guardian.id} className="rounded-xl border bg-white px-4 py-3 text-sm">
            <p className="font-medium">{guardian.name}</p>
            <p className="text-slate-600">{guardian.phone} · {guardian.email}</p>
            <p className="text-slate-600">{guardian.address}</p>
            <ul className="mt-2 text-slate-700">
              {links.map((link) => {
                const student = register.students.find((item) => item.id === link.studentId)
                return (
                  <li key={link.id}>
                    {student ? studentName(student) : "Pupil"} · {link.relationship}
                    {link.billing ? " · billing" : ""}
                    {link.pickup ? " · pickup" : ""}
                  </li>
                )
              })}
            </ul>
          </li>
        ))}
      </ul>
    </div>
  )
}
