import { z } from "zod"
import { school } from "@/config/school"

export const applicationSchema = z
  .object({
    intakeId: z.string().min(1, "Choose an intake"),
    applyingClassId: z.string().min(1, "Choose a class"),
    firstName: z.string().min(1, "Enter a first name"),
    middleName: z.string(),
    lastName: z.string().min(1, "Enter a last name"),
    dateOfBirth: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Enter a date of birth"),
    gender: z.string().min(1, "Choose a gender"),
    priorSchool: z.string(),
    address: z.string().min(3, "Enter an address"),
    guardianId: z.string().min(1, "Choose a guardian"),
    guardianName: z.string(),
    guardianPhone: z.string(),
    guardianEmail: z.string(),
    birthCertificate: z.boolean(),
    priorReport: z.boolean(),
    photo: z.boolean(),
  })
  .superRefine((value, ctx) => {
    if (value.dateOfBirth > school.asOf) {
      ctx.addIssue({ code: "custom", path: ["dateOfBirth"], message: "Date of birth cannot be after the register date." })
    }
    if (value.guardianId === "new") {
      if (value.guardianName.trim().length < 2) {
        ctx.addIssue({ code: "custom", path: ["guardianName"], message: "Enter the guardian's name." })
      }
      if (value.guardianPhone.trim().length < 6) {
        ctx.addIssue({ code: "custom", path: ["guardianPhone"], message: "Enter a phone number." })
      }
    }
  })

export type ApplicationFormValues = z.infer<typeof applicationSchema>
