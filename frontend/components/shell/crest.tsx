import { cn } from "@/lib/utils"

export function Crest({ className, alt = "" }: { className?: string; alt?: string }) {
  return <img src="/logo.png" alt={alt} className={cn("shrink-0 object-contain", className)} />
}
