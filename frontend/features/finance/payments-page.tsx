"use client"

import { useState } from "react"
import { school } from "@/config/school"
import { PageHeader } from "@/components/shared/page-header"
import { Button } from "@/components/ui/button"
import { ReasonDialog } from "@/components/shared/reason-dialog"
import { useCan } from "@/components/shared/access"
import { flash } from "@/components/shared/flash"
import { formatMoney } from "@/lib/format"
import { canSeeStudent, studentName } from "@/features/records/selectors"
import { unallocatedCredit } from "@/features/records/workflows"
import { useSession } from "@/features/records/session"
import { useRegister } from "@/features/records/store"
import { useUi } from "@/features/records/ui-state"

export function PaymentsPage() {
  const user = useSession((state) => state.user)
  const register = useRegister()
  const yearId = useUi((state) => state.yearId)
  const reverse = useRegister((state) => state.reversePayment)
  const canReverse = useCan("payments.reverse")
  const [target, setTarget] = useState<string | null>(null)
  if (!user) return null
  const rows = register.payments.filter((payment) => canSeeStudent(user, register, payment.studentId, yearId))

  return (
    <div className="grid gap-4">
      <PageHeader title="Payments & Receipts" description="A reversal posts an opposite entry. The original receipt stays in the list." />
      <ul className="grid gap-2">
        {rows.map((payment) => {
          const pupil = register.students.find((item) => item.id === payment.studentId)
          return (
            <li key={payment.id} className="flex flex-wrap items-center justify-between gap-2 rounded-xl border bg-white px-4 py-3 text-sm">
              <div>
                <p className="font-medium">{payment.number} · {pupil ? studentName(pupil) : "Pupil"}</p>
                <p className="text-slate-600">
                  {formatMoney(payment.amount)} · {payment.method.replaceAll("_", " ")} · {payment.receivedOn}
                  {unallocatedCredit(payment) !== 0 ? ` · unallocated ${formatMoney(unallocatedCredit(payment))}` : ""}
                  {payment.reversedById ? " · reversed" : ""}
                  {payment.reversesId ? " · reversal entry" : ""}
                </p>
                {payment.note ? <p className="text-slate-500">{payment.note}</p> : null}
              </div>
              {canReverse && !payment.reversedById && !payment.reversesId && payment.amount > 0 ? (
                <Button type="button" variant="outline" onClick={() => setTarget(payment.id)}>
                  Reverse
                </Button>
              ) : null}
            </li>
          )
        })}
      </ul>
      <p className="text-xs text-slate-500">Register date for new reversals: {school.asOf}.</p>
      <ReasonDialog
        open={Boolean(target)}
        onOpenChange={(open) => !open && setTarget(null)}
        title="Reverse this receipt?"
        description="This posts a contra entry. It does not delete the original."
        confirmLabel="Reverse"
        onConfirm={(reason) => {
          if (!target) return
          const result = reverse(user, target, reason)
          if (flash(result, "Reversal posted.")) setTarget(null)
        }}
      />
    </div>
  )
}
