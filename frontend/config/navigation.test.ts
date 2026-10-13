import { describe, expect, it } from "vitest"
import { breadcrumbTrail, resolveRoute, routes } from "@/config/navigation"

describe("navigation registry", () => {
  it("keeps one id per route and refuses planned pages a path", () => {
    const ids = routes.map((route) => route.id)
    expect(new Set(ids).size).toBe(ids.length)
    for (const route of routes) {
      if (route.release === "planned") expect(route.href).toBeNull()
      if (route.href) expect(route.href.startsWith("/app/")).toBe(true)
    }
  })

  it("resolves record pages without treating new as an id", () => {
    expect(resolveRoute("/app/admissions/applications/new")?.id).toBe("admissions.application.new")
    expect(resolveRoute("/app/admissions/applications/priya")?.id).toBe("admissions.application")
    expect(resolveRoute("/app/students/guardians")?.id).toBe("students.guardians")
    expect(resolveRoute("/app/students/liam")?.id).toBe("students.profile")
    const trail = breadcrumbTrail("/app/students/liam", "Liam Chen")
    expect(trail.map((item) => item.title)).toEqual(["Student Lifecycle", "Student Directory", "Liam Chen"])
  })
})
