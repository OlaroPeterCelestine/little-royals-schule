"use client"

import { useState } from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { school } from "@/config/school"
import { PageHeader } from "@/components/shared/page-header"
import { StatusBadge } from "@/components/shared/status-badge"
import { EmptyState } from "@/components/shared/empty-state"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Field } from "@/components/shared/field"
import { useCan } from "@/components/shared/access"
import { flash } from "@/components/shared/flash"
import { useRecordTitle } from "@/components/shell/breadcrumbs"
import { formatDate, formatMoney, formatWhen } from "@/lib/format"
import { canSeeStudent, studentName } from "@/features/records/selectors"
import { invoiceCharged, invoiceGross, invoiceView, outstanding, unallocatedCredit } from "@/features/records/workflows"
import { useSession } from "@/features/records/session"
import { useRegister } from "@/features/records/store"
import { useUi } from "@/features/records/ui-state"
import type { PaymentMethod } from "@/features/records/types"

export function InvoiceDetail() {
  const params = useParams<{ id: string }>()
  const user = useSession((state) => state.user)
  const register = useRegister()
  const yearId = useUi((state) => state.yearId)
  const updateDraft = useRegister((state) => state.updateDraftInvoice)
  const issue = useRegister((state) => state.issueInvoice)
  const record = useRegister((state) => state.recordPayment)
  const canIssue = useCan("billing.issue")
  const canPay = useCan("payments.record")
  const invoice = register.invoices.find((item) => item.id === params.id)
  const allowed = user && invoice ? canSeeStudent(user, register, invoice.studentId, yearId) : false
  const pupil = invoice ? register.students.find((item) => item.id === invoice.studentId) : undefined
  useRecordTitle(invoice ? invoice.number : "Invoice")
  const [discount, setDiscount] = useState(invoice?.discount ?? 0)
  const [receipt, setReceipt] = useState("")
  const [allocate, setAllocate] = useState("")
  const [method, setMethod] = useState<PaymentMethod>("mobile_money")
  const [note, setNote] = useState("")

  if (!user) return null
  if (!invoice || !allowed || !pupil) return <EmptyState title="Invoice not available" body="It is outside your access, or it does not exist." />

  const view = invoiceView(invoice, register.payments, school.asOf)
  const balance = outstanding(invoice, register.payments)
  const payments = register.payments.filter((payment) => payment.allocations.some((item) => item.invoiceId === invoice.id))
  const guardian = register.guardians.find((item) => item.id === invoice.billingGuardianId)

  return (
    <div className="grid gap-4">
      <PageHeader
        title={invoice.number}
        description={`${studentName(pupil)} · billed to ${guardian?.name ?? "guardian"} · due ${formatDate(invoice.dueDate)}`}
        actions={<StatusBadge status={view} />}
      />
      <div className="overflow-x-auto rounded-xl border bg-white">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b text-left">
              <th className="p-3 font-medium">Description</th>
              <th className="p-3 font-medium">Qty</th>
              <th className="p-3 font-medium">Unit price</th>
              <th className="p-3 font-medium">Amount</th>
            </tr>
          </thead>
          <tbody>
            {invoice.lines.map((line) => (
              <tr key={line.id} className="border-b">
                <td className="p-3">{line.description}</td>
                <td className="p-3">{line.quantity}</td>
                <td className="p-3">{formatMoney(line.unitPrice)}</td>
                <td className="p-3">{formatMoney(line.quantity * line.unitPrice)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <dl className="grid gap-1 p-3 text-sm">
          <div className="flex justify-between"><dt>Lines</dt><dd>{formatMoney(invoiceGross(invoice))}</dd></div>
          <div className="flex justify-between"><dt>Discount</dt><dd>{formatMoney(invoice.discount)}</dd></div>
          <div className="flex justify-between font-medium"><dt>Charge</dt><dd>{formatMoney(invoiceCharged(invoice))}</dd></div>
          <div className="flex justify-between font-medium"><dt>Outstanding</dt><dd>{formatMoney(balance)}</dd></div>
        </dl>
      </div>
      {invoice.status === "draft" && canIssue ? (
        <form
          className="flex flex-wrap items-end gap-2 rounded-xl border bg-white p-4"
          onSubmit={(event) => {
            event.preventDefault()
            const updated = updateDraft(user, invoice.id, discount)
            if (!updated.ok) {
              flash(updated, "")
              return
            }
            flash(issue(user, invoice.id), `${invoice.number} issued.`)
          }}
        >
          <Field label="Discount (UGX)" hint="Only a draft can change. Issued invoices stay posted.">
            <Input inputMode="numeric" value={String(discount)} onChange={(event) => setDiscount(Number(event.target.value || 0))} />
          </Field>
          <Button type="submit">Issue invoice</Button>
        </form>
      ) : null}
      {invoice.status === "issued" && canPay && balance > 0 ? (
        <form
          className="grid gap-3 rounded-xl border bg-white p-4 md:grid-cols-2"
          onSubmit={(event) => {
            event.preventDefault()
            const result = record(user, {
              invoiceId: invoice.id,
              receiptAmount: Number(receipt),
              allocateAmount: Number(allocate),
              method,
              receivedOn: school.asOf,
              note,
            })
            if (flash(result, "Receipt recorded.")) {
              setReceipt("")
              setAllocate("")
              setNote("")
            }
          }}
        >
          <Field label="Receipt amount (UGX)" required hint="Any amount above the allocation stays as unallocated credit.">
            <Input inputMode="numeric" value={receipt} onChange={(event) => setReceipt(event.target.value)} />
          </Field>
          <Field label="Allocate to this invoice" required>
            <Input inputMode="numeric" value={allocate} onChange={(event) => setAllocate(event.target.value)} />
          </Field>
          <Field label="Method">
            <select className="h-8 rounded-lg border px-2 text-sm" value={method} onChange={(event) => setMethod(event.target.value as PaymentMethod)}>
              <option value="mobile_money">Mobile money</option>
              <option value="bank">Bank</option>
              <option value="cash">Cash</option>
            </select>
          </Field>
          <Field label="Note">
            <Input value={note} onChange={(event) => setNote(event.target.value)} />
          </Field>
          <Button type="submit">Record receipt</Button>
        </form>
      ) : null}
      {invoice.status === "issued" ? (
        <p className="text-sm text-slate-600">
          Credit notes are not released. To undo a receipt, reverse it from <Link className="text-[#1e4b9b] underline" href="/app/finance/payments">Payments</Link>.
        </p>
      ) : null}
      <section className="rounded-xl border bg-white p-4">
        <h2 className="text-sm font-semibold">Allocations</h2>
        <ul className="mt-2 grid gap-2 text-sm">
          {payments.map((payment) => {
            const share = payment.allocations.find((item) => item.invoiceId === invoice.id)
            return (
              <li key={payment.id}>
                {payment.number} · {formatMoney(share?.amount ?? 0)} · credit left {formatMoney(unallocatedCredit(payment))} · {formatWhen(payment.createdAt)}
                {payment.reversesId ? " · reversal" : ""}
              </li>
            )
          })}
        </ul>
      </section>
    </div>
  )
}
