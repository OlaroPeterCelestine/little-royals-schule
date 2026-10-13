"use client"

import { can, type Permission } from "@/config/permissions"
import { useSession } from "@/features/records/session"

export function useCan(permission: Permission): boolean {
  const role = useSession((state) => state.user?.role)
  return role ? can(role, permission) : false
}

export function AccessDenied() {
  return (
    <div role="alert" className="rounded-xl border bg-white p-6">
      <h1 className="text-lg font-semibold">You do not have access to this page</h1>
      <p className="mt-1 text-sm text-slate-600">Your role does not include this workspace. Access is also checked on the server when the API is connected.</p>
    </div>
  )
}
