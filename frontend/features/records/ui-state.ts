"use client"

import { create } from "zustand"

const KEY = "littleroyals-erp-ui"
const SIDEBAR_KEY = "littleroyals-sidebar"

type UiState = {
  ready: boolean
  collapsed: boolean
  workspaceId: string
  yearId: string
  termId: string
  pinned: string[]
  recent: string[]
  hydrate: () => void
  toggleCollapsed: () => void
  setCollapsed: (collapsed: boolean) => void
  setWorkspace: (id: string) => void
  setTerm: (yearId: string, termId: string) => void
  togglePin: (routeId: string) => void
  remember: (routeId: string) => void
}

type Saved = Pick<UiState, "collapsed" | "workspaceId" | "yearId" | "termId" | "pinned" | "recent">

function write(state: Saved) {
  try {
    localStorage.setItem(KEY, JSON.stringify(state))
    localStorage.setItem(SIDEBAR_KEY, state.collapsed ? "1" : "0")
  } catch {
    /* storage can be blocked */
  }
}

export const useUi = create<UiState>((set, get) => ({
  ready: false,
  collapsed: false,
  workspaceId: "command",
  yearId: "ay-2026",
  termId: "t3-2026",
  pinned: [],
  recent: [],
  hydrate: () => {
    if (get().ready) return
    let next: Partial<Saved> = {}
    try {
      const raw = localStorage.getItem(KEY)
      if (raw) next = JSON.parse(raw) as Saved
      if (localStorage.getItem(SIDEBAR_KEY) === "1") next.collapsed = true
    } catch {
      /* storage can be blocked */
    }
    set({ ...next, ready: true })
  },
  toggleCollapsed: () => {
    const collapsed = !get().collapsed
    set({ collapsed })
    write(pick(get(), collapsed))
  },
  setCollapsed: (collapsed) => {
    set({ collapsed })
    write(pick(get(), collapsed))
  },
  setWorkspace: (workspaceId) => {
    set({ workspaceId })
    write(pick({ ...get(), workspaceId }))
  },
  setTerm: (yearId, termId) => {
    set({ yearId, termId })
    write(pick({ ...get(), yearId, termId }))
  },
  togglePin: (routeId) => {
    const pinned = get().pinned.includes(routeId) ? get().pinned.filter((id) => id !== routeId) : [...get().pinned, routeId].slice(0, 6)
    set({ pinned })
    write(pick({ ...get(), pinned }))
  },
  remember: (routeId) => {
    const recent = [routeId, ...get().recent.filter((id) => id !== routeId)].slice(0, 5)
    set({ recent })
    write(pick({ ...get(), recent }))
  },
}))

function pick(state: UiState | (Saved & { collapsed: boolean }), collapsed = state.collapsed): Saved {
  return {
    collapsed,
    workspaceId: state.workspaceId,
    yearId: state.yearId,
    termId: state.termId,
    pinned: state.pinned,
    recent: state.recent,
  }
}
