"use client"

import { useMemo, useState } from "react"
import { DataTable, type AppColumn } from "@/components/shared/data-table"
import { PageHeader } from "@/components/shared/page-header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useDebounced } from "@/components/shared/use-debounced"
import { downloadCsv } from "@/lib/csv"
import { formatWhen } from "@/lib/format"
import { flash } from "@/components/shared/flash"
import { useRegisterQuery } from "@/features/records/queries"
import { useSession } from "@/features/records/session"
import { useRegister } from "@/features/records/store"
import { paginate } from "@/features/records/workflows"
import type { AuditEvent } from "@/features/records/types"

export function AuditPage() {
  const user = useSession((state) => state.user)
  const logExport = useRegister((state) => state.logExport)
  const [search, setSearch] = useState("")
  const [page, setPage] = useState(1)
  const debounced = useDebounced(search)
  const query = useRegisterQuery(["audit", debounced, page], () => {
    const rows = useRegister.getState().audits.filter((item) => {
      const haystack = `${item.actorName} ${item.action} ${item.summary}`.toLowerCase()
      return !debounced || haystack.includes(debounced.toLowerCase())
    })
    return paginate(rows, page, 8)
  })
  const columns = useMemo<AppColumn<AuditEvent>[]>(
    () => [
      { id: "when", header: "When", cell: ({ row }) => formatWhen(row.original.at) },
      { accessorKey: "actorName", header: "Actor" },
      { accessorKey: "action", header: "Action" },
      { accessorKey: "summary", header: "Summary" },
    ],
    [],
  )

  if (!user) return null

  return (
    <div className="grid gap-4">
      <PageHeader
        title="Audit Logs"
        description="Changes in this browser session are appended here. Nothing is deleted from the log."
        actions={
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              const rows = query.data?.rows ?? []
              downloadCsv("audit.csv", [["When", "Actor", "Action", "Summary"], ...rows.map((item) => [item.at, item.actorName, item.action, item.summary])])
              logExport(user, `Exported ${rows.length} audit rows from the current page.`)
              flash({ ok: true, data: undefined }, "Export saved.")
            }}
          >
            Export this page
          </Button>
        }
      />
      <Input
        value={search}
        onChange={(event) => {
          setSearch(event.target.value)
          setPage(1)
        }}
        placeholder="Search actor or action"
        aria-label="Search audit log"
      />
      <DataTable
        columns={columns}
        rows={query.data?.rows ?? []}
        total={query.data?.total ?? 0}
        page={page}
        pageSize={8}
        onPage={setPage}
        isLoading={query.isLoading}
        emptyTitle="No audit events"
        emptyBody="Nothing matches this search."
      />
    </div>
  )
}
