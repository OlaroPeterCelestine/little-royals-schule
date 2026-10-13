"use client"

import { useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { type AppColumn } from "@/components/shared/data-table"
import { PageHeader } from "@/components/shared/page-header"
import { DataTable } from "@/components/shared/data-table"
import { StatusBadge } from "@/components/shared/status-badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useDebounced } from "@/components/shared/use-debounced"
import { useCan } from "@/components/shared/access"
import { useRegisterQuery } from "@/features/records/queries"
import { useRegister } from "@/features/records/store"
import { paginate } from "@/features/records/workflows"
import { formatDate } from "@/lib/format"
import type { Application } from "@/features/records/types"
import Link from "next/link"

export function ApplicationList() {
  const router = useRouter()
  const canCreate = useCan("admissions.create")
  const [search, setSearch] = useState("")
  const [status, setStatus] = useState("all")
  const [page, setPage] = useState(1)
  const debounced = useDebounced(search)
  const classes = useRegister((state) => state.classes)
  const query = useRegisterQuery(["applications", debounced, status, page], () => {
    const rows = useRegister.getState().applications.filter((item) => {
      const haystack = `${item.number} ${item.firstName} ${item.lastName}`.toLowerCase()
      if (debounced && !haystack.includes(debounced.toLowerCase())) return false
      if (status !== "all" && item.status !== status) return false
      return true
    })
    return paginate(rows, page, 6)
  })

  const columns = useMemo<AppColumn<Application>[]>(
    () => [
      { accessorKey: "number", header: "Number" },
      {
        id: "name",
        header: "Applicant",
        cell: ({ row }) => `${row.original.firstName} ${row.original.lastName}`,
      },
      {
        id: "class",
        header: "Class",
        cell: ({ row }) => classes.find((item) => item.id === row.original.applyingClassId)?.name ?? "—",
      },
      {
        id: "status",
        header: "Status",
        cell: ({ row }) => <StatusBadge status={row.original.status} />,
      },
      {
        id: "updated",
        header: "Updated",
        cell: ({ row }) => formatDate(row.original.updatedAt.slice(0, 10)),
      },
    ],
    [classes],
  )

  return (
    <div className="grid gap-4">
      <PageHeader
        title="Applications"
        description="An application is not a student. Enrollment creates one student record after the offer is accepted."
        actions={canCreate ? <Button render={<Link href="/app/admissions/applications/new" />}>New application</Button> : null}
      />
      <div className="flex flex-col gap-2 sm:flex-row">
        <Input
          value={search}
          onChange={(event) => {
            setSearch(event.target.value)
            setPage(1)
          }}
          placeholder="Search name or number"
          aria-label="Search applications"
        />
        <select
          className="h-8 rounded-lg border bg-white px-2 text-sm"
          value={status}
          aria-label="Filter by status"
          onChange={(event) => {
            setStatus(event.target.value)
            setPage(1)
          }}
        >
          <option value="all">All statuses</option>
          {["draft", "submitted", "under_review", "interview", "offered", "waitlisted", "rejected", "accepted", "enrolled"].map((item) => (
            <option key={item} value={item}>
              {item.replaceAll("_", " ")}
            </option>
          ))}
        </select>
      </div>
      <DataTable
        columns={columns}
        rows={query.data?.rows ?? []}
        total={query.data?.total ?? 0}
        page={page}
        pageSize={6}
        onPage={setPage}
        isLoading={query.isLoading}
        emptyTitle="No applications"
        emptyBody="No application matches this search."
        onRow={(row) => router.push(`/app/admissions/applications/${row.id}`)}
      />
    </div>
  )
}
