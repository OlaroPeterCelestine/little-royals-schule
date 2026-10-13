"use client"

import { roleLabels } from "@/config/permissions"
import { PageHeader } from "@/components/shared/page-header"
import { StatusBadge } from "@/components/shared/status-badge"
import { useRegister } from "@/features/records/store"

export function UsersPage() {
  const accounts = useRegister((state) => state.accounts)

  return (
    <div className="grid gap-4">
      <PageHeader
        title="Users & Roles"
        description="These are development accounts. Inviting a user, MFA and password reset are not connected to an identity provider."
      />
      <ul className="grid gap-2">
        {accounts.map((account) => (
          <li key={account.id} className="flex flex-wrap items-center justify-between gap-2 rounded-xl border bg-white px-4 py-3 text-sm">
            <div>
              <p className="font-medium">{account.name}</p>
              <p className="text-slate-600">{account.email}</p>
              <p className="text-slate-500">{roleLabels[account.role]}{account.staffNumber ? ` · ${account.staffNumber}` : ""}</p>
            </div>
            <StatusBadge status={account.status} />
          </li>
        ))}
      </ul>
    </div>
  )
}
