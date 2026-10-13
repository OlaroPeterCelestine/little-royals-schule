import type { ReactNode } from "react"
import { Label } from "@/components/ui/label"

export function Field({
  label,
  hint,
  error,
  required,
  children,
}: {
  label: string
  hint?: string
  error?: string
  required?: boolean
  children: ReactNode
}) {
  return (
    <div className="grid gap-1.5">
      <Label>
        {label}
        {required ? <span className="text-destructive"> *</span> : null}
      </Label>
      {children}
      {error ? <p className="text-destructive text-xs">{error}</p> : null}
      {!error && hint ? <p className="text-muted-foreground text-xs">{hint}</p> : null}
    </div>
  )
}
