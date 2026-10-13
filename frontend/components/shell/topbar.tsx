"use client"

import { useState, type ReactNode } from "react"
import { useRouter } from "next/navigation"
import { Bell, Calendar, ChevronDown, Inbox, LogOut, Menu, Search, UserCircle } from "lucide-react"
import { roleLabels } from "@/config/permissions"
import { school } from "@/config/school"
import { approvalCount, unreadCount } from "@/features/records/selectors"
import { useSession } from "@/features/records/session"
import { useRegister } from "@/features/records/store"
import { useUi } from "@/features/records/ui-state"
import { dataSource } from "@/lib/api-client"
import { Crest } from "@/components/shell/crest"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"

export function Topbar({ onSearch, onMenu }: { onSearch: () => void; onMenu: () => void }) {
  const router = useRouter()
  const user = useSession((state) => state.user)
  const signOut = useSession((state) => state.signOut)
  const register = useRegister()
  const yearId = useUi((state) => state.yearId)
  const termId = useUi((state) => state.termId)
  const setTerm = useUi((state) => state.setTerm)
  const [help, setHelp] = useState(false)
  if (!user) return null
  const approvals = approvalCount(user, register)
  const unread = unreadCount(user, register)
  const live = dataSource() === "live"
  const term = register.terms.find((item) => item.id === termId)
  const year = register.years.find((item) => item.id === yearId)

  return (
    <header className="relative z-20 flex h-16 min-w-0 shrink-0 items-center justify-between gap-3 border-b border-slate-200/80 bg-white px-4 md:px-6">
      <button
        type="button"
        aria-label="Open menu"
        className="rounded-lg border border-slate-200 bg-white p-1.5 text-slate-600 shadow-sm hover:bg-slate-50 md:hidden"
        onClick={onMenu}
      >
        <Menu className="size-4" />
      </button>
      <button
        type="button"
        onClick={onSearch}
        className="relative flex h-8 min-w-0 w-full max-w-md items-center rounded-lg border border-slate-200/90 bg-slate-50 pr-8 pl-9 text-left text-xs text-slate-400 shadow-sm transition-all hover:bg-white"
      >
        <Search className="absolute left-3 size-4" aria-hidden="true" />
        <span className="truncate">Search pages, students, ID...</span>
        <kbd className="absolute right-2 hidden rounded border border-slate-200 bg-white px-1.5 py-0.5 text-[10px] font-medium text-slate-400 sm:inline">⌘K</kbd>
      </button>

      <div className="ml-auto flex shrink-0 items-center gap-2">
        <span
          className={`hidden items-center gap-2 rounded-lg border px-3 py-1.5 text-xs font-semibold shadow-sm sm:inline-flex ${live ? "border-emerald-200 bg-emerald-50 text-emerald-800" : "border-amber-200 bg-amber-50 text-amber-800"}`}
          title={live ? "Live mode is selected" : "Development register. Figures are not a live school feed."}
        >
          <span className={`size-2 rounded-full ${live ? "bg-emerald-500" : "bg-amber-500"}`} />
          {live ? "Live" : "Sample"}
        </span>
        <span className="hidden items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 shadow-sm lg:inline-flex">
          <Crest className="h-4 w-4" />
          <span className="font-semibold text-slate-900">{school.name}</span>
          <span className="text-[10px] font-semibold text-slate-400">v{school.version}</span>
        </span>
        <label className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 shadow-sm">
          <Calendar className="size-3.5 text-slate-400" aria-hidden="true" />
          <span className="hidden sm:inline">Term:</span>
          <span className="sr-only">Academic term</span>
          <select
            className="max-w-[9rem] appearance-none bg-transparent font-semibold text-slate-900 outline-none"
            value={`${yearId}|${termId}`}
            onChange={(event) => {
              const [nextYear, nextTerm] = event.target.value.split("|")
              if (nextYear && nextTerm) setTerm(nextYear, nextTerm)
            }}
          >
            {register.terms.map((item) => {
              const itemYear = register.years.find((yearItem) => yearItem.id === item.yearId)
              return (
                <option key={item.id} value={`${item.yearId}|${item.id}`}>
                  {item.name}, {itemYear?.name}
                </option>
              )
            })}
          </select>
          <ChevronDown className="size-3.5 text-slate-400" aria-hidden="true" />
          <span className="sr-only">
            Current term {term?.name} {year?.name}
          </span>
        </label>
        <IconButton label={approvals > 0 ? `${approvals} approvals waiting` : "Approvals"} onClick={() => router.push("/app/approvals")}>
          <Inbox className="size-4" />
          {approvals > 0 ? <Count value={approvals} /> : null}
        </IconButton>
        <IconButton label={unread > 0 ? `${unread} unread notifications` : "Notifications"} onClick={() => router.push("/app/notifications")}>
          <Bell className="size-4" />
          {unread > 0 ? <Count value={unread} /> : null}
        </IconButton>
        <DropdownMenu>
          <DropdownMenuTrigger
            className="inline-flex size-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 shadow-sm hover:bg-slate-50 hover:text-slate-900"
            aria-label={`Profile, ${user.name}`}
          >
            <UserCircle className="size-4" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>
              {user.name}
              <span className="mt-0.5 block text-xs font-normal text-slate-500">
                {user.email} · {roleLabels[user.role]}
              </span>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => setHelp(true)}>Help</DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                signOut()
                router.replace("/login")
              }}
            >
              <LogOut />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <Dialog open={help} onOpenChange={setHelp}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Using {school.name}</DialogTitle>
            <DialogDescription>Shortcuts that work in this build. Support chat is not connected.</DialogDescription>
          </DialogHeader>
          <ul className="grid gap-2 text-sm text-slate-700">
            <li>Press Ctrl or Command K to search pages and records.</li>
            <li>The sidebar lists released pages. Items under “Not released” have no screen yet.</li>
            <li>Fee balances come from invoice lines and receipt allocations.</li>
            <li>Health and safeguarding records are not stored in this frontend.</li>
          </ul>
        </DialogContent>
      </Dialog>
    </header>
  )
}

function IconButton({ label, onClick, children }: { label: string; onClick: () => void; children: ReactNode }) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={onClick}
      className="relative inline-flex size-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 shadow-sm transition-colors hover:bg-slate-50 hover:text-slate-900"
    >
      {children}
    </button>
  )
}

function Count({ value }: { value: number }) {
  return (
    <span className="absolute -top-1 -right-1 min-w-4 rounded-full bg-rose-500 px-1 text-center text-[9px] leading-4 font-bold text-white">
      {value}
    </span>
  )
}
