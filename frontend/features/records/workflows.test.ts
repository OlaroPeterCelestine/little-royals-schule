import { describe, expect, it } from "vitest"
import { can, permissions } from "@/config/permissions"
import { createSeed } from "@/features/records/seed"
import {
  allocatedTo,
  attendanceRate,
  canTransitionApplication,
  enrollmentBlock,
  findDuplicateStudent,
  invoiceCharged,
  invoiceView,
  outstanding,
  reversalBlock,
  validatePayment,
  validateScore,
} from "@/features/records/workflows"

const seed = createSeed()
const today = "2026-10-13"

describe("permissions", () => {
  it("gives the head teacher every permission and keeps finance away from teachers", () => {
    for (const permission of permissions) {
      expect(can("headteacher", permission)).toBe(true)
    }
    expect(can("teacher", "payments.record")).toBe(false)
    expect(can("teacher", "attendance.mark")).toBe(true)
    expect(can("parent", "admissions.view")).toBe(false)
    expect(can("bursar", "payments.reverse")).toBe(true)
    expect(can("teacher", "clinic.view")).toBe(false)
    expect(can("teacher", "safeguarding.view")).toBe(false)
  })
})

describe("applications", () => {
  it("follows the admission sequence and blocks enrollment shortcuts", () => {
    expect(canTransitionApplication("draft", "submitted")).toBe(true)
    expect(canTransitionApplication("draft", "enrolled")).toBe(false)
    expect(canTransitionApplication("accepted", "enrolled")).toBe(true)
    const accepted = seed.applications.find((item) => item.id === "priya")
    expect(accepted).toBeDefined()
    expect(enrollmentBlock(accepted!, today)).toBeNull()
    const offered = seed.applications.find((item) => item.id === "amina")
    expect(enrollmentBlock(offered!, today)).toMatch(/accepted/)
  })

  it("detects an existing student before a second record is created", () => {
    const duplicate = findDuplicateStudent(seed.students, {
      firstName: " liam ",
      lastName: "CHEN",
      dateOfBirth: "2021-03-12",
    })
    expect(duplicate?.studentNumber).toBe("ST-1042")
  })
})

describe("fees", () => {
  it("derives outstanding from lines and allocations", () => {
    const ava = seed.invoices.find((item) => item.id === "inv-ava-t3")!
    expect(invoiceCharged(ava)).toBe(450_000)
    expect(allocatedTo(ava.id, seed.payments)).toBe(300_000)
    expect(outstanding(ava, seed.payments)).toBe(150_000)
    expect(invoiceView(ava, seed.payments, today)).toBe("overdue")
    const zuri = seed.invoices.find((item) => item.id === "inv-zuri-t3")!
    expect(invoiceCharged(zuri)).toBe(530_000)
    expect(outstanding(zuri, seed.payments)).toBe(0)
    expect(invoiceView(zuri, seed.payments, today)).toBe("paid")
    const hannah = seed.invoices.find((item) => item.id === "inv-hannah-t3")!
    expect(outstanding(hannah, seed.payments)).toBe(0)
    expect(invoiceView(hannah, seed.payments, today)).toBe("draft")
  })

  it("rejects an allocation above the balance and a second reversal", () => {
    const owen = seed.invoices.find((item) => item.id === "inv-owen-t3")!
    const tooMuch = validatePayment({ invoice: owen, payments: seed.payments, receiptAmount: 500_000, allocateAmount: 500_000 })
    expect(tooMuch.ok).toBe(false)
    const fit = validatePayment({ invoice: owen, payments: seed.payments, receiptAmount: 450_000, allocateAmount: 450_000 })
    expect(fit.ok).toBe(true)
    const receipt = seed.payments[0]!
    expect(reversalBlock(receipt)).toBeNull()
    expect(reversalBlock({ ...receipt, reversedById: "later" })).toMatch(/already/)
  })
})

describe("academic records", () => {
  it("keeps scores inside the maximum and ignores open registers", () => {
    expect(validateScore(101, 100)).toMatch(/between/)
    expect(validateScore(18, 20)).toBeNull()
    const rate = attendanceRate(seed.registers.filter((item) => item.termId === "t3-2026"), null)
    expect(rate).toBe(1)
  })
})
