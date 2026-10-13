"use client"

import { useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { DataTable, type AppColumn } from "@/components/shared/data-table"
import { PageHeader } from "@/components/shared/page-header"
import { StatusBadge } from "@/components/shared/status-badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useDebounced } from "@/components/shared/use-debounced"
import { useCan } from "@/components/shared/access"
import { flash } from "@/components/shared/flash"
import { downloadCsv } from "@/lib/csv"
import { useRegisterQuery } from "@/features/records/queries"
import { useSession } from "@/features/records/session"
import { useRegister } from "@/features/records/store"
import { useUi } from "@/features/records/ui-state"
import { className, currentEnrollment, studentName, visibleStudents } from "@/features/records/selectors"
import { paginate } from "@/features/records/workflows"
import type { Student } from "@/features/records/types"

export function StudentList() {
  const router = useRouter()
  const user = useSession((state) => state.user)
  const canExport = useCan("students.export")
  const logExport = useRegister((state) => state.logExport)
  const yearId = useUi((state) => state.yearId)
  const [search, setSearch] = useState("")
  const [status, setStatus] = useState("all")
  const [page, setPage] = useState(1)
  const debounced = useDebounced(search)
  const query = useRegisterQuery(["students", debounced, status, page, yearId, user?.id], () => {
    const state = useRegister.getState()
    if (!user) return paginate([], page, 8)
    const rows = visibleStudents(user, state, yearId).filter((student) => {
      const enrollment = currentEnrollment(state.enrollments, student.id, yearId)
      const label = `${studentName(student)} ${student.studentNumber} ${className(state, enrollment?.classId ?? "")}`.toLowerCase()
      if (debounced && !label.includes(debounced.toLowerCase())) return false
      if (status !== "all" && student.status !== status) return false
      return true
    })
    return paginate(rows, page, 8)
  })

  const columns = useMemo<AppColumn<Student>[]>(
    () => [
      { accessorKey: "studentNumber", header: "Student ID" },
      { id: "name", header: "Name", cell: ({ row }) => studentName(row.original) },
      {
        id: "class",
        header: "Class",
        cell: ({ row }) => {
          const state = useRegister.getState()
          const enrollment = currentEnrollment(state.enrollments, row.original.id, yearId)
          return className(state, enrollment?.classId ?? "")
        },
      },
      { id: "status", header: "Status", cell: ({ row }) => <StatusBadge status={row.original.status} /> },
      { accessorKey: "enrolledOn", header: "Enrolled" },
    ],
    [yearId],
  )

  if (!user) return null

  return (
    <div className="grid gap-4">
      <PageHeader
        title="Student Directory"
        description="Each pupil has one record. Families only see the children linked to them."
        actions={
          canExport ? (
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                const rows = query.data?.rows ?? []
                downloadCsv("students.csv", [
                  ["Student ID", "Name", "Status"],
                  ...rows.map((student) => [student.studentNumber, studentName(student), student.status]),
                ])
                logExport(user, `Exported ${rows.length} student rows from the current page.`)
                flash({ ok: true, data: undefined }, "Export saved. The audit log has a record of it.")
              }}
            >
              Export this page
            </Button>
          ) : null
        }
      />
      <div className="flex flex-col gap-2 sm:flex-row">
        <Input
          value={search}
          onChange={(event) => {
            setSearch(event.target.value)
            setPage(1)
          }}
          placeholder="Search name or student ID"
          aria-label="Search students"
        />
        <select
          className="h-8 rounded-lg border bg-white px-2 text-sm"
          aria-label="Filter by status"
          value={status}
          onChange={(event) => {
            setStatus(event.target.value)
            setPage(1)
          }}
        >
          <option value="all">All statuses</option>
          <option value="active">Active</option>
          <option value="watch">Watch</option>
          <option value="withdrawn">Withdrawn</option>
        </select>
      </div>
      <DataTable
        columns={columns}
        rows={query.data?.rows ?? []}
        total={query.data?.total ?? 0}
        page={page}
        pageSize={8}
        onPage={setPage}
        isLoading={query.isLoading}
        emptyTitle="No pupils"
        emptyBody="No student matches this search in your scope."
        onRow={(row) => router.push(`/app/students/${row.id}`)}
      />
    </div>
  )
}
