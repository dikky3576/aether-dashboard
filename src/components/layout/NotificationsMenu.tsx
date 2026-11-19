import { Link } from 'react-router'
import { Bell, CheckCheck, CreditCard, FolderKanban, ShieldCheck, UserPlus, type LucideIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { ROUTES } from '@/config/routes'
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

export function NotificationsMenu() {
  const items = useNotificationsStore((s) => s.items)
  const unread = useNotificationsStore(selectUnreadCount)
  const markRead = useNotificationsStore((s) => s.markRead)
  const markAllRead = useNotificationsStore((s) => s.markAllRead)

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative"
          aria-label={unread > 0 ? `Notifications, ${unread} unread` : 'Notifications'}
        >
          <Bell aria-hidden />
          {unread > 0 && (
            <span
              aria-hidden
              className="absolute right-2.5 top-2.5 size-2 rounded-full bg-accent ring-2 ring-background"
            />
          )}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-[min(24rem,calc(100vw-2rem))] p-0">
        <div className="flex items-center justify-between gap-2 px-3.5 pb-1 pt-3">
          <p className="text-card font-medium">Notifications</p>
          <DropdownMenuItem
            disabled={unread === 0}
            className="h-8 px-2 text-caption font-medium text-accent-text"
            onSelect={(event) => {
              event.preventDefault()
              markAllRead()
            }}
          >
            <CheckCheck aria-hidden /> Mark all read
          </DropdownMenuItem>
        </div>

        <div className="max-h-[22rem] overflow-y-auto p-1">
          {items.map((n) => {
            const { icon: Icon, tint } = KIND_STYLE[n.kind]
            return (
              <DropdownMenuItem
                key={n.id}
                className="h-auto items-start gap-3 py-2.5"
                onSelect={(event) => {
                  event.preventDefault()
                  markRead(n.id)
                }}
              >
                <span className={cn('mt-0.5 grid size-8 shrink-0 place-items-center rounded-lg', tint)}>
                  <Icon aria-hidden />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="flex items-center gap-2">
                    <span className="truncate font-medium">{n.title}</span>
                    {!n.read && (
                      <>
                        <span aria-hidden className="size-1.5 shrink-0 rounded-full bg-accent" />
                        <span className="sr-only">Unread</span>
                      </>
                    )}
                  </span>
                  <span className="mt-0.5 line-clamp-2 block text-caption text-muted">{n.body}</span>
                  <span className="mt-1 block text-caption text-muted">{formatRelativeTime(n.createdAt)}</span>
                </span>
              </DropdownMenuItem>
            )
          })}
        </div>

        <DropdownMenuSeparator className="mx-0 my-0" />
        <div className="p-1">
          <DropdownMenuItem asChild className="justify-center font-medium text-accent-text">
            <Link to={ROUTES.notifications}>View all notifications</Link>
          </DropdownMenuItem>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
