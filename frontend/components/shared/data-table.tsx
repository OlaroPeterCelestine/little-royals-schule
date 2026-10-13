"use client"

import { useState } from "react"
import { flexRender } from "@tanstack/react-table"
import { getCoreRowModel, useLegacyTable, type LegacyColumnDef } from "@tanstack/react-table/legacy"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { EmptyState } from "@/components/shared/empty-state"
import { Skeleton } from "@/components/ui/skeleton"

export type AppColumn<T extends object> = LegacyColumnDef<T & Record<string, any>>

export function DataTable<T extends object>({
  columns,
  rows,
  total,
  page,
  pageSize,
  onPage,
  isLoading = false,
  emptyTitle,
  emptyBody,
  onRow,
}: {
  columns: AppColumn<T>[]
  rows: T[]
  total: number
  page: number
  pageSize: number
  onPage: (page: number) => void
  isLoading?: boolean
  emptyTitle: string
  emptyBody: string
  onRow?: (row: T) => void
}) {
  const [visibility, setVisibility] = useState<Record<string, boolean>>({})
  const table = useLegacyTable({
    data: rows as (T & Record<string, any>)[],
    columns: columns as LegacyColumnDef<T & Record<string, any>>[],
    state: { columnVisibility: visibility },
    onColumnVisibilityChange: setVisibility,
    manualPagination: true,
    pageCount: Math.max(1, Math.ceil(total / pageSize)),
    getCoreRowModel: getCoreRowModel(),
  })
  const pages = Math.max(1, Math.ceil(total / pageSize))

  if (isLoading) {
    return (
      <div className="grid gap-2" aria-busy="true" aria-live="polite">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
      </div>
    )
  }

  if (total === 0) return <EmptyState title={emptyTitle} body={emptyBody} />

  const from = total === 0 ? 0 : (page - 1) * pageSize + 1
  const to = Math.min(page * pageSize, total)

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200/80 bg-white shadow-[var(--shadow-card)]">
      <details className="border-b border-slate-100 px-3 py-2 text-[11px] text-slate-500">
        <summary className="cursor-pointer font-semibold tracking-wide uppercase">Columns</summary>
        <div className="mt-2 flex flex-wrap gap-3">
          {table.getAllLeafColumns().map((column) => (
            <label key={column.id} className="inline-flex items-center gap-1.5">
              <input
                type="checkbox"
                checked={column.getIsVisible()}
                onChange={(event) => column.toggleVisibility(event.target.checked)}
              />
              {column.columnDef.header as string}
            </label>
          ))}
        </div>
      </details>
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((group) => (
            <TableRow key={group.id} className="hover:bg-transparent">
              {group.headers.map((header) => (
                <TableHead key={header.id} className="text-[10px] font-semibold tracking-wide text-slate-400 uppercase">
                  {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows.map((row) => (
            <TableRow
              key={row.id}
              className={onRow ? "cursor-pointer text-xs hover:bg-slate-50/70" : "text-xs"}
              onClick={onRow ? () => onRow(row.original as T) : undefined}
              tabIndex={onRow ? 0 : undefined}
              onKeyDown={
                onRow
                  ? (event) => {
                      if (event.key === "Enter" || event.key === " ") {
                        event.preventDefault()
                        onRow(row.original as T)
                      }
                    }
                  : undefined
              }
            >
              {row.getVisibleCells().map((cell) => (
                <TableCell key={cell.id} className="text-xs text-slate-700">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className="flex items-center justify-between gap-3 border-t border-slate-100 px-3 py-2 text-xs text-slate-400">
        <p>
          Showing {from}-{to} of {total}
        </p>
        <div className="flex items-center gap-1">
          <Button type="button" variant="ghost" size="sm" disabled={page <= 1} onClick={() => onPage(page - 1)}>
            Previous
          </Button>
          <Button type="button" variant="ghost" size="sm" className="font-semibold text-slate-700" disabled={page >= pages} onClick={() => onPage(page + 1)}>
            Next
          </Button>
        </div>
      </div>
    </div>
  )
}
