import { toast } from "sonner"
import type { Result } from "@/features/records/types"

export function flash(result: Result<unknown>, success: string): boolean {
  if (result.ok) toast.success(success)
  else toast.error(result.error)
  return result.ok
}
