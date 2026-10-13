"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Field } from "@/components/shared/field"
import { PageHeader } from "@/components/shared/page-header"
import { ConfirmDialog } from "@/components/shared/confirm-dialog"
import { flash } from "@/components/shared/flash"
import { applicationSchema, type ApplicationFormValues } from "@/features/admissions/schema"
import { useSession } from "@/features/records/session"
import { useRegister } from "@/features/records/store"

export function ApplicationForm() {
  const router = useRouter()
  const user = useSession((state) => state.user)
  const intakes = useRegister((state) => state.intakes)
  const classes = useRegister((state) => state.classes)
  const guardians = useRegister((state) => state.guardians)
  const create = useRegister((state) => state.createApplication)
  const [discard, setDiscard] = useState(false)
  const form = useForm<ApplicationFormValues>({
    resolver: zodResolver(applicationSchema),
    defaultValues: {
      intakeId: intakes[0]?.id ?? "",
      applyingClassId: "",
      firstName: "",
      middleName: "",
      lastName: "",
      dateOfBirth: "",
      gender: "",
      priorSchool: "",
      address: "",
      guardianId: "",
      guardianName: "",
      guardianPhone: "",
      guardianEmail: "",
      birthCertificate: false,
      priorReport: false,
      photo: false,
    },
  })
  const guardianId = form.watch("guardianId")
  const errors = form.formState.errors

  if (!user) return null

  return (
    <form
      className="grid gap-4"
      onSubmit={form.handleSubmit((values) => {
        const result = create(user, {
          intakeId: values.intakeId,
          applyingClassId: values.applyingClassId,
          firstName: values.firstName.trim(),
          middleName: values.middleName.trim(),
          lastName: values.lastName.trim(),
          dateOfBirth: values.dateOfBirth,
          gender: values.gender,
          priorSchool: values.priorSchool.trim(),
          address: values.address.trim(),
          guardianId: values.guardianId,
          newGuardian:
            values.guardianId === "new"
              ? {
                  name: values.guardianName,
                  phone: values.guardianPhone,
                  email: values.guardianEmail,
                  address: values.address,
                }
              : undefined,
          documents: {
            birthCertificate: values.birthCertificate,
            priorReport: values.priorReport,
            photo: values.photo,
          },
        })
        if (!result.ok) {
          flash(result, "")
          return
        }
        flash(result, "Draft application saved.")
        router.push(`/app/admissions/applications/${result.data}`)
      })}
    >
      <PageHeader
        title="New application"
        description="This saves a draft. It does not create a student."
        actions={
          <>
            <Button type="button" variant="outline" onClick={() => (form.formState.isDirty ? setDiscard(true) : router.push("/app/admissions/applications"))}>
              Cancel
            </Button>
            <Button type="submit">Save draft</Button>
          </>
        }
      />
      {Object.keys(errors).length > 0 ? (
        <div role="alert" className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-900">
          Check the fields marked below before saving.
        </div>
      ) : null}
      <div className="grid gap-4 rounded-xl border bg-white p-4 md:grid-cols-2">
        <Field label="Intake" required error={errors.intakeId?.message}>
          <select className="h-8 rounded-lg border px-2 text-sm" {...form.register("intakeId")}>
            {intakes.map((item) => (
              <option key={item.id} value={item.id}>{item.name}</option>
            ))}
          </select>
        </Field>
        <Field label="Applying class" required error={errors.applyingClassId?.message}>
          <select className="h-8 rounded-lg border px-2 text-sm" {...form.register("applyingClassId")}>
            <option value="">Choose</option>
            {classes.map((item) => (
              <option key={item.id} value={item.id}>{item.name}</option>
            ))}
          </select>
        </Field>
        <Field label="First name" required error={errors.firstName?.message}>
          <Input {...form.register("firstName")} aria-invalid={Boolean(errors.firstName)} />
        </Field>
        <Field label="Middle name" error={errors.middleName?.message}>
          <Input {...form.register("middleName")} />
        </Field>
        <Field label="Last name" required error={errors.lastName?.message}>
          <Input {...form.register("lastName")} aria-invalid={Boolean(errors.lastName)} />
        </Field>
        <Field label="Date of birth" required error={errors.dateOfBirth?.message}>
          <Input type="date" {...form.register("dateOfBirth")} aria-invalid={Boolean(errors.dateOfBirth)} />
        </Field>
        <Field label="Gender" required error={errors.gender?.message}>
          <select className="h-8 rounded-lg border px-2 text-sm" {...form.register("gender")}>
            <option value="">Choose</option>
            <option value="Girl">Girl</option>
            <option value="Boy">Boy</option>
          </select>
        </Field>
        <Field label="Prior school">
          <Input {...form.register("priorSchool")} />
        </Field>
        <Field label="Address" required error={errors.address?.message}>
          <Input {...form.register("address")} aria-invalid={Boolean(errors.address)} />
        </Field>
        <Field label="Guardian" required error={errors.guardianId?.message}>
          <select className="h-8 rounded-lg border px-2 text-sm" {...form.register("guardianId")}>
            <option value="">Choose</option>
            <option value="new">New guardian</option>
            {guardians.map((item) => (
              <option key={item.id} value={item.id}>{item.name}</option>
            ))}
          </select>
        </Field>
        {guardianId === "new" ? (
          <>
            <Field label="Guardian name" required error={errors.guardianName?.message}>
              <Input {...form.register("guardianName")} />
            </Field>
            <Field label="Guardian phone" required error={errors.guardianPhone?.message}>
              <Input {...form.register("guardianPhone")} />
            </Field>
            <Field label="Guardian email" hint="If this email already exists, that guardian is reused.">
              <Input type="email" {...form.register("guardianEmail")} />
            </Field>
          </>
        ) : null}
        <fieldset className="grid gap-2 md:col-span-2">
          <legend className="text-sm font-medium">Documents on file</legend>
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" {...form.register("birthCertificate")} /> Birth certificate</label>
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" {...form.register("priorReport")} /> Prior school report</label>
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" {...form.register("photo")} /> Photograph</label>
          <p className="text-xs text-slate-500">File upload is unavailable until storage is connected. Tick a document only when the office has seen it.</p>
        </fieldset>
      </div>
      <ConfirmDialog
        open={discard}
        onOpenChange={setDiscard}
        title="Discard this draft?"
        description="The form has unsaved changes."
        confirmLabel="Discard"
        destructive
        onConfirm={() => {
          toast.info("Draft discarded.")
          router.push("/app/admissions/applications")
        }}
      />
    </form>
  )
}
