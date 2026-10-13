/**
 * Go API boundary.
 * The Go API lives in ../backend and serves /v1.
 * The desk still reads the local development register.
 * TODO: switch this client to that API when live mode should replace the local register.
 */
export type DataSource = "mock" | "live"

export function dataSource(): DataSource {
  return process.env.NEXT_PUBLIC_DATA_SOURCE === "live" ? "live" : "mock"
}

export function apiBaseUrl(): string | null {
  const value = process.env.NEXT_PUBLIC_API_URL
  return value && value.length > 0 ? value : null
}

export function liveUnavailableMessage(): string {
  const base = apiBaseUrl()
  if (!base) {
    return "Live mode is on, and NEXT_PUBLIC_API_URL is not set. No sample records are loaded."
  }
  return `Live mode is on (${base}). The desk still uses the local register; the Go API in backend/ is used by the mobile app.`
}
