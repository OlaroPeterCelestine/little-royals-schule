"use client"

import { useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { can } from "@/config/permissions"
import { routes, workspaces } from "@/config/navigation"
import { Command, CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { useSession } from "@/features/records/session"
import { useRegister } from "@/features/records/store"
import { useUi } from "@/features/records/ui-state"
import { searchRecords } from "@/features/records/selectors"

export function CommandSearch({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const router = useRouter()
  const user = useSession((state) => state.user)
  const register = useRegister()
  const yearId = useUi((state) => state.yearId)
  const [query, setQuery] = useState("")

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault()
        onOpenChange(true)
      }
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [onOpenChange])

  const released = useMemo(() => {
    if (!user) return []
    return routes.filter((route) => route.release === "released" && route.href && route.sidebar && can(user.role, route.permission))
  }, [user])

  const planned = useMemo(() => {
    if (!user) return []
    return routes.filter((route) => route.release === "planned" && route.sidebar && can(user.role, route.permission))
  }, [user])

  const records = user ? searchRecords(user, register, yearId, query) : []

  function go(href: string) {
    onOpenChange(false)
    setQuery("")
    router.push(href)
  }

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange} title="Search the school OS" description="Pages, planned modules and records">
      <Command>
        <CommandInput placeholder="Search pages and records" value={query} onValueChange={setQuery} />
        <CommandList>
          <CommandEmpty>Nothing matches that search.</CommandEmpty>
          <CommandGroup heading="Pages">
            {released.map((route) => (
              <CommandItem key={route.id} value={`${route.title} ${workspaces.find((item) => item.id === route.workspaceId)?.label ?? ""}`} onSelect={() => route.href && go(route.href)}>
                <span>{route.title}</span>
                <span className="ml-auto text-xs text-slate-500">{workspaces.find((item) => item.id === route.workspaceId)?.label}</span>
              </CommandItem>
            ))}
          </CommandGroup>
          {records.length > 0 ? (
            <CommandGroup heading="Records">
              {records.map((hit) => (
                <CommandItem key={hit.href} value={`${hit.label} ${hit.hint}`} onSelect={() => go(hit.href)}>
                  <span>{hit.label}</span>
                  <span className="ml-auto text-xs text-slate-500">{hit.hint}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          ) : null}
          <CommandGroup heading="Not released">
            {planned.map((route) => (
              <CommandItem
                key={route.id}
                value={`later ${route.title}`}
                onSelect={() => {
                  toast.info(`${route.title} is not released. ${route.description}`)
                }}
              >
                <span>{route.title}</span>
                <span className="ml-auto text-xs text-slate-500">Later</span>
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </Command>
    </CommandDialog>
  )
}
