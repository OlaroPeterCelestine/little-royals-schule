"use client"

import { create } from "zustand"
import { dataSource, liveUnavailableMessage } from "@/lib/api-client"
import { useRegister } from "@/features/records/store"
import type { Result, SessionUser } from "@/features/records/types"

const KEY = "littleroyals-erp-session"

type SessionState = {
  user: SessionUser | null
  ready: boolean
  hydrate: () => void
  signIn: (email: string, password: string) => Result
  signOut: () => void
}

export const useSession = create<SessionState>((set, get) => ({
  user: null,
  ready: false,
  hydrate: () => {
    if (get().ready) return
    try {
      const raw = localStorage.getItem(KEY)
      if (raw) {
        const user = JSON.parse(raw) as SessionUser
        if (user?.id && user.role) {
          set({ user, ready: true })
          return
        }
      }
    } catch {
      /* storage can be blocked */
    }
    set({ ready: true })
  },
  signIn: (email, password) => {
    if (dataSource() === "live") return { ok: false, error: liveUnavailableMessage() }
    if (!password.trim()) return { ok: false, error: "Enter your password." }
    const account = useRegister.getState().accounts.find((item) => item.email.toLowerCase() === email.trim().toLowerCase())
    if (!account) return { ok: false, error: "No school account uses that email." }
    if (account.status !== "active") return { ok: false, error: "This account is not active." }
    const user: SessionUser = {
      id: account.id,
      name: account.name,
      email: account.email,
      role: account.role,
      classIds: account.classIds,
      studentIds: account.studentIds,
    }
    try {
      localStorage.setItem(KEY, JSON.stringify(user))
    } catch {
      /* storage can be blocked */
    }
    set({ user, ready: true })
    return { ok: true, data: undefined }
  },
  signOut: () => {
    try {
      localStorage.removeItem(KEY)
    } catch {
      /* storage can be blocked */
    }
    set({ user: null, ready: true })
  },
}))
