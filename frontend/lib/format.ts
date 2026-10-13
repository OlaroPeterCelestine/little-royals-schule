import { school } from "@/config/school"

export function formatMoney(amount: number, currency = school.currency): string {
  return new Intl.NumberFormat(school.locale, {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(amount)
}

/** Format a YYYY-MM-DD date without shifting the calendar day. */
export function formatDate(iso: string): string {
  const [year, month, day] = iso.slice(0, 10).split("-").map(Number)
  if (!year || !month || !day) return iso
  return new Intl.DateTimeFormat(school.locale, {
    dateStyle: "medium",
    timeZone: "UTC",
  }).format(new Date(Date.UTC(year, month - 1, day)))
}

export function formatWhen(iso: string): string {
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return iso
  return new Intl.DateTimeFormat(school.locale, {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: school.timeZone,
  }).format(date)
}

export function fullName(parts: {
  firstName: string
  middleName?: string
  lastName: string
}): string {
  return [parts.firstName, parts.middleName, parts.lastName].filter(Boolean).join(" ")
}

export function percent(rate: number | null): string {
  if (rate === null) return "No submitted registers"
  return `${Math.round(rate * 1000) / 10}%`
}
