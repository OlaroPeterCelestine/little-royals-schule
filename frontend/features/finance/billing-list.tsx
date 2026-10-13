"use client"

import { useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { DataTable, type AppColumn } from "@/components/shared/data-table"
import { school } from "@/config/school"
import { PageHeader } from "@/components/shared/page-header"
import { StatusBadge } from "@/components/shared/status-badge"
import { Input } from "@/components/ui/input"
import { useDebounced } from "@/components/shared/use-debounced"
import { formatMoney } from "@/lib/format"
import { useRegisterQuery } from "@/features/records/queries"
import { useSession } from "@/features/records/session"
import { useRegister } from "@/features/records/store"
import { useUi } from "@/features/records/ui-state"
import { canSeeStudent, studentName } from "@/features/records/selectors"
import { invoiceCharged, invoiceView, outstanding, paginate } from "@/features/records/workflows"
import type { Invoice } from "@/features/records/types"

export function BillingList() {
  const router = useRouter()
  const user = useSession((state) => state.user)
  const yearId = useUi((state) => state.yearId)
  const termId = useUi((state) => state.termId)
  const [search, setSearch] = useState("")
  const [page, setPage] = useState(1)
  const debounced = useDebounced(search)
  const query = useRegisterQuery(["invoices", debounced, page, termId, user?.id], () => {
    const state = useRegister.getState()
    if (!user) return paginate([], page, 8)
    const rows = state.invoices.filter((invoice) => {
      if (invoice.termId !== termId) return false
      if (!canSeeStudent(user, state, invoice.studentId, yearId)) return false
      const pupil = state.students.find((item) => item.id === invoice.studentId)
      const haystack = `${invoice.number} ${pupil ? studentName(pupil) : ""}`.toLowerCase()
      return !debounced || haystack.includes(debounced.toLowerCase())
    })
    return paginate(rows, page, 8)
  })

  const columns = useMemo<AppColumn<Invoice>[]>(
    () => [
      { accessorKey: "number", header: "Invoice" },
      {
        id: "student",
        header: "Student",
        cell: ({ row }) => {
          const pupil = useRegister.getState().students.find((item) => item.id === row.original.studentId)
          return pupil ? studentName(pupil) : "—"
        },
      },
      {
        id: "charge",
        header: "Charge",
        cell: ({ row }) => formatMoney(invoiceCharged(row.original)),
      },
      {
        id: "outstanding",
        header: "Outstanding",
        cell: ({ row }) => formatMoney(outstanding(row.original, useRegister.getState().payments)),
      },
      {
        id: "status",
        header: "Status",
        cell: ({ row }) => <StatusBadge status={invoiceView(row.original, useRegister.getState().payments, school.asOf)} />,
      },
    ],
    [],
  )

  return (
    <div className="grid gap-4">
      <PageHeader title="Student Billing" description="Outstanding amounts are the posted charge minus receipt allocations. Draft invoices are not part of the balance." />
      <Input
        value={search}
        onChange={(event) => {
          setSearch(event.target.value)
          setPage(1)
        }}
        placeholder="Search invoice or student"
        aria-label="Search invoices"
      />
      <DataTable
        columns={columns}
        rows={query.data?.rows ?? []}
        total={query.data?.total ?? 0}
        page={page}
        pageSize={8}
        onPage={setPage}
        isLoading={query.isLoading}
        emptyTitle="No invoices"
        emptyBody="Nothing in this term matches your search."
        onRow={(row) => router.push(`/app/finance/billing/${row.id}`)}
      />
    </div>
  )
}
