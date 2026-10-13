"use client"

import { useQuery } from "@tanstack/react-query"
import { useRegister } from "@/features/records/store"

export function useRegisterQuery<T>(key: readonly unknown[], read: () => T) {
  const revision = useRegister((state) => state.revision)
  const hydrated = useRegister((state) => state.hydrated)
  const snapshot = hydrated ? read() : undefined
  return useQuery({
    queryKey: [...key, revision],
    queryFn: read,
    initialData: snapshot,
    enabled: hydrated,
  })
}
