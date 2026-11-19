import { useState } from 'react'
import { BellOff, CheckCheck, CreditCard, FolderKanban, ShieldCheck, UserPlus, type LucideIcon } from 'lucide-react'
import { PageHeader } from '@/components/layout/PageHeader'
import { Button, Card, EmptyState, Tabs, TabsList, TabsTrigger } from '@/components/ui'
import type { NotificationKind } from '@/data/notifications'
import { cn } from '@/lib/cn'
import { formatRelativeTime } from '@/lib/format'
import { selectUnreadCount, useNotificationsStore } from '@/stores/notifications-store'

const KIND_STYLE: Record<NotificationKind, { icon: LucideIcon; tint: string }> = {
  payment: { icon: CreditCard, tint: 'bg-success-soft text-success' },
  team: { icon: UserPlus, tint: 'bg-info-soft text-info' },
  project: { icon: FolderKanban, tint: 'bg-accent-soft text-accent-text' },
  system: { icon: ShieldCheck, tint: 'bg-warning-soft text-warning' },
}

export function NotificationsPage() {
  const items = useNotificationsStore((s) => s.items)
  const unread = useNotificationsStore(selectUnreadCount)
  const markRead = useNotificationsStore((s) => s.markRead)
  const markAllRead = useNotificationsStore((s) => s.markAllRead)
  const [filter, setFilter] = useState<'all' | 'unread'>('all')

  const visible = filter === 'unread' ? items.filter((n) => !n.read) : items

  return (
    <>
      <PageHeader
        title="Notifications"
        description="Alerts and activity from your workspace."
        actions={
          <Button onClick={markAllRead} disabled={unread === 0}>
            <CheckCheck aria-hidden /> Mark all read
          </Button>
        }
      />

      <Tabs className="mt-6" value={filter} onValueChange={(v) => setFilter(v as 'all' | 'unread')}>
        <TabsList aria-label="Filter notifications">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="unread">Unread ({unread})</TabsTrigger>
        </TabsList>
      </Tabs>

      <Card padding="none" className="mt-4">
        {visible.length === 0 ? (
          <EmptyState icon={BellOff} title="You’re all caught up" description="New alerts will show up here." />
        ) : (
          <ul className="divide-y divide-border">
            {visible.map((n) => {
              const { icon: Icon, tint } = KIND_STYLE[n.kind]
              return (
                <li key={n.id}>
                  <button
                    type="button"
                    onClick={() => markRead(n.id)}
                    className="flex w-full gap-4 px-5 py-4 text-left transition-colors duration-150 hover:bg-subtle/60 sm:px-6"
                  >
                    <span className={cn('grid size-10 shrink-0 place-items-center rounded-lg', tint)}>
                      <Icon className="size-5" strokeWidth={1.75} aria-hidden />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="flex items-center gap-2">
                        <span className={cn('text-body', !n.read && 'font-semibold')}>{n.title}</span>
                        {!n.read && <span className="size-2 rounded-full bg-accent" aria-label="Unread" />}
                      </span>
                      <span className="mt-0.5 block text-body text-muted">{n.body}</span>
                      <span className="mt-1 block text-caption text-muted">{formatRelativeTime(n.createdAt)}</span>
                    </span>
                  </button>
                </li>
              )
            })}
          </ul>
        )}
      </Card>
    </>
  )
}
