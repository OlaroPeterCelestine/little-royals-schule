"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { breadcrumbTrail } from "@/config/navigation"
import { createContext, useContext, useEffect, useState, type ReactNode } from "react"

const RecordTitleContext = createContext<(title: string | null) => void>(() => {})

export function RecordTitleProvider({ children }: { children: ReactNode }) {
  const [title, setTitle] = useState<string | null>(null)
  return (
    <RecordTitleContext.Provider value={setTitle}>
      <RecordTitleState.Provider value={title}>{children}</RecordTitleState.Provider>
    </RecordTitleContext.Provider>
  )
}

const RecordTitleState = createContext<string | null>(null)

export function useRecordTitle(title: string | null) {
  const setTitle = useContext(RecordTitleContext)
  useEffect(() => {
    setTitle(title)
    return () => setTitle(null)
  }, [setTitle, title])
}

export function Breadcrumbs() {
  const pathname = usePathname()
  const recordTitle = useContext(RecordTitleState)
  const trail = breadcrumbTrail(pathname, recordTitle)
  return (
    <nav aria-label="Breadcrumb" className="text-xs text-slate-400">
      <ol className="flex flex-wrap items-center gap-1">
        {trail.map((crumb, index) => {
          const last = index === trail.length - 1
          return (
            <li key={`${crumb.title}-${index}`} className="flex items-center gap-1">
              {index > 0 ? <span aria-hidden="true">/</span> : null}
              {crumb.href && !last ? (
                <Link href={crumb.href} className="hover:text-slate-900">
                  {crumb.title}
                </Link>
              ) : (
                <span className={last ? "font-medium text-slate-700" : undefined} aria-current={last ? "page" : undefined}>
                  {crumb.title}
                </span>
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
