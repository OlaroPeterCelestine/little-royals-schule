"use client"

import { PageHeader } from "@/components/shared/page-header"
import { Button } from "@/components/ui/button"
import { EmptyState } from "@/components/shared/empty-state"
import { formatWhen } from "@/lib/format"
import { noticeVisible } from "@/features/records/selectors"
import { useSession } from "@/features/records/session"
import { useRegister } from "@/features/records/store"

export function NotificationsPage() {
  const user = useSession((state) => state.user)
  const notices = useRegister((state) => state.notices)
  const markOne = useRegister((state) => state.markNoticeRead)
  const markAll = useRegister((state) => state.markVisibleNoticesRead)
  if (!user) return null
  const audience = user.role === "parent" || user.role === "student" ? "parent" : "staff"
  const visible = notices.filter((notice) => noticeVisible(user, notice.audience))

  return (
    <div className="grid gap-4">
      <PageHeader
        title="Notifications & Alerts"
        description="Delivery preferences for SMS and email are not connected."
        actions={
          <Button type="button" variant="outline" onClick={() => markAll(audience)}>
            Mark visible as read
          </Button>
        }
      />
      {visible.length === 0 ? <EmptyState title="No notifications" body="Nothing has been sent to this account." /> : null}
      <ul className="grid gap-2">
        {visible.map((notice) => (
          <li key={notice.id} className="rounded-xl border bg-white px-4 py-3">
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div>
                <p className="text-sm font-medium">{notice.title}</p>
                <p className="text-sm text-slate-600">{notice.body}</p>
                <p className="mt-1 text-xs text-slate-500">{formatWhen(notice.at)} · {notice.read ? "Read" : "Unread"}</p>
              </div>
              {notice.read ? null : (
                <Button type="button" variant="outline" size="sm" onClick={() => markOne(notice.id)}>
                  Mark read
                </Button>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
