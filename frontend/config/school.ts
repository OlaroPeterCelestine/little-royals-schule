/**
 * Demonstration school profile. Business rules that vary by school
 * (currency, timezone, what counts as present) live here, not in pages.
 */
export const school = {
  id: "little-royals",
  name: "Little Royals",
  legalName: "Little Royals Kindergarten & Primary School",
  tagline: "Kindergarten & Primary School",
  version: "3.0.0",
  address: "Plot 18, Kololo Hill Drive, Kampala",
  phone: "+256 414 000 218",
  email: "office@littleroyals.school",
  timeZone: "Africa/Kampala",
  currency: "UGX",
  locale: "en-UG",
  /**
   * Fixed register date so overdue fees, attendance and tests stay stable.
   * This is not a live clock.
   */
  asOf: "2026-10-13",
  /** Statuses that count toward the attendance rate. */
  presentStatuses: ["present", "late"] as const,
} as const

export type PresentStatus = (typeof school.presentStatuses)[number]
