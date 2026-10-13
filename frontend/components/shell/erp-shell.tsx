"use client"

import { useEffect, useState, type ReactNode } from "react"
import { usePathname, useRouter } from "next/navigation"
import { QueryClientProvider } from "@tanstack/react-query"
import { makeQueryClient } from "@/lib/query-client"
import { resolveRoute } from "@/config/navigation"
import { can } from "@/config/permissions"
import { useSession } from "@/features/records/session"
import { useRegister } from "@/features/records/store"
import { useUi } from "@/features/records/ui-state"
import { Sidebar } from "@/components/shell/sidebar"
import { Topbar } from "@/components/shell/topbar"
import { Breadcrumbs, RecordTitleProvider } from "@/components/shell/breadcrumbs"
import { CommandSearch } from "@/components/shell/command-search"
import { AccessDenied } from "@/components/shared/access"
import { EmptyState } from "@/components/shared/empty-state"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Spinner } from "@/components/ui/spinner"

export function ErpShell({ children }: { children: ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const [client] = useState(() => makeQueryClient())
  const [search, setSearch] = useState(false)
  const [mobile, setMobile] = useState(false)
  const user = useSession((state) => state.user)
  const sessionReady = useSession((state) => state.ready)
  const hydrateSession = useSession((state) => state.hydrate)
  const hydrated = useRegister((state) => state.hydrated)
  const unavailable = useRegister((state) => state.unavailable)
  const hydrateRegister = useRegister((state) => state.hydrate)
  const collapsed = useUi((state) => state.collapsed)
  const uiReady = useUi((state) => state.ready)
  const hydrateUi = useUi((state) => state.hydrate)
  const setWorkspace = useUi((state) => state.setWorkspace)
  const remember = useUi((state) => state.remember)

  useEffect(() => {
    hydrateSession()
    hydrateRegister()
    hydrateUi()
  }, [hydrateSession, hydrateRegister, hydrateUi])

  useEffect(() => {
    if (sessionReady && !user) router.replace(`/login?next=${encodeURIComponent(pathname)}`)
  }, [sessionReady, user, router, pathname])

  useEffect(() => {
    const current = resolveRoute(pathname)
    if (!current) return
    setWorkspace(current.workspaceId)
    const remembered = current.parentId ?? (current.href ? current.id : null)
    if (remembered && current.sidebar) remember(remembered)
    else if (current.parentId) remember(current.parentId)
  }, [pathname, remember, setWorkspace])

  const ready = sessionReady && hydrated && uiReady
  const current = resolveRoute(pathname)
  const allowed = user && current ? can(user.role, current.permission) : true

  return (
    <QueryClientProvider client={client}>
      <RecordTitleProvider>
        <div className="flex h-dvh overflow-hidden bg-[#F8FAFC] text-slate-800">
          <a href="#workspace" className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:bg-white focus:p-2">
            Skip to workspace
          </a>
          <aside className={`hidden h-full min-h-0 shrink-0 flex-col overflow-hidden border-r border-slate-200/80 md:flex ${collapsed ? "w-[4.75rem]" : "w-[19rem]"}`}>
            <Sidebar collapsed={collapsed} />
          </aside>
          <Sheet open={mobile} onOpenChange={setMobile}>
            <SheetContent side="left" className="w-[19rem] overflow-hidden p-0 sm:max-w-none" showCloseButton>
              <SheetHeader className="sr-only">
                <SheetTitle>Navigation</SheetTitle>
                <SheetDescription>School workspaces</SheetDescription>
              </SheetHeader>
              <Sidebar collapsed={false} onNavigate={() => setMobile(false)} />
            </SheetContent>
          </Sheet>
          <div className="flex min-w-0 flex-1 flex-col">
            <Topbar onSearch={() => setSearch(true)} onMenu={() => setMobile(true)} />
            <main id="workspace" className="min-h-0 flex-1 overflow-auto">
              <div className="mx-auto grid w-full max-w-[1600px] gap-4 px-4 py-5 md:px-6">
                {ready && user ? <Breadcrumbs /> : null}
                {!ready || !user ? (
                  <div className="flex items-center gap-2 text-sm text-slate-600" role="status">
                    <Spinner />
                    Opening the school OS
                  </div>
                ) : unavailable ? (
                  <EmptyState title="School data is not connected" body={unavailable} />
                ) : allowed ? (
                  children
                ) : (
                  <AccessDenied />
                )}
              </div>
            </main>
          </div>
        </div>
        <CommandSearch open={search} onOpenChange={setSearch} />
      </RecordTitleProvider>
    </QueryClientProvider>
  )
}
