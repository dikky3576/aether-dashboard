import { Avatar, Card, CardDescription, CardTitle, Skeleton } from '@/components/ui'
import { cn } from '@/lib/cn'
import { formatRelativeTime } from '@/lib/format'
import type { ActivityItem } from '@/types/overview'

interface RecentActivityProps {
  activity?: ActivityItem[]
  className?: string
}

export function RecentActivity({ activity, className }: RecentActivityProps) {
  return (
    <Card className={className}>
      <CardTitle>Recent activity</CardTitle>
      <CardDescription>What your team has been up to</CardDescription>

      <ol className="mt-5" aria-label="Recent activity">
        {activity
          ? activity.map((item, index) => {
              const isLast = index === activity.length - 1
              return (
                <li
                  key={item.id}
                  className={cn(
                    'relative pl-11',
                    !isLast &&
                      'pb-5 before:absolute before:bottom-0 before:left-4 before:top-9 before:w-px before:bg-border',
                  )}
                >
                  <Avatar name={item.user} size="sm" className="absolute left-0 top-0" />
                  <p className="text-body leading-snug">
                    <span className="font-medium">{item.user}</span>{' '}
                    <span className="text-muted">{item.action}</span>{' '}
                    <span className="font-medium">{item.target}</span>
                  </p>
                  <time dateTime={new Date(item.createdAt).toISOString()} className="mt-0.5 block text-caption text-muted">
                    {formatRelativeTime(item.createdAt)}
                  </time>
                </li>
              )
            })
          : Array.from({ length: 5 }, (_, i) => (
              <li key={i} className="relative pb-5 pl-11">
                <Skeleton className="absolute left-0 top-0 size-8 rounded-full" />
                <Skeleton className="h-4 w-4/5" />
                <Skeleton className="mt-2 h-3 w-16" />
              </li>
            ))}
      </ol>
    </Card>
  )
}
