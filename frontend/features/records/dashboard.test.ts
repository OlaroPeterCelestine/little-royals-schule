import { describe, expect, it } from "vitest"
import { createSeed } from "@/features/records/seed"
import { buildDashboard, schoolRoll } from "@/features/records/selectors"
import type { SessionUser } from "@/features/records/types"

const data = createSeed()
const grace: SessionUser = {
  id: "grace",
  name: "Grace Achieng",
  email: "grace.achieng@littleroyals.school",
  role: "headteacher",
  classIds: [],
  studentIds: [],
}
const mei: SessionUser = {
  id: "mei",
  name: "Mei Chen",
  email: "mei.chen@gmail.com",
  role: "parent",
  classIds: [],
  studentIds: ["liam"],
}

describe("desk snapshot", () => {
  it("counts the school roll from class capacity and enrolled pupils", () => {
    expect(schoolRoll(data)).toEqual({ capacity: 106, enrolled: 7, percent: 7 })
  })

  it("builds leadership cards from the register, not from display copy", () => {
    const desk = buildDashboard(grace, data, "ay-2026", "t3-2026")
    expect(desk.cards).toHaveLength(4)
    expect(desk.enrolled).toBe(7)
    expect(desk.slices.reduce((sum, slice) => sum + slice.count, 0)).toBe(7)
    expect(desk.applicants?.some((row) => row.name === "Sophia Martinez")).toBe(true)
    expect(desk.insight).toContain("on watch")
    expect(desk.insight).not.toMatch(/1,420|94\.6%|88%/)
  })

  it("keeps a parent inside their household", () => {
    const desk = buildDashboard(mei, data, "ay-2026", "t3-2026")
    expect(desk.enrolled).toBe(1)
    expect(desk.applicants).toBeNull()
    expect(desk.cards[0]?.value).toBe("1")
  })
})