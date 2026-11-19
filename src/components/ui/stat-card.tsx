import type { LucideIcon } from 'lucide-react'
import { Sparkline } from '@/components/charts/Sparkline'
import { Card } from '@/components/ui/card'
import { Delta } from '@/components/ui/delta'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/cn'

interface StatCardProps {
  label: string
  /** Pre-formatted value, e.g. "$128,430". */
  value: string
  delta: number
  comparison: string
  icon: LucideIcon
  trend?: number[]
  /** Brand-gradient treatment. Use for one card per view. */
  featured?: boolean
  className?: string
}

export function StatCard({ label, value, delta, comparison, icon: Icon, trend, featured = false, className }: StatCardProps) {
  return (
    <Card variant={featured ? 'featured' : 'default'} className={cn('flex flex-col', className)}>
      <div className="flex items-center justify-between gap-3">
        <h3 className={cn('text-body font-medium', featured ? 'text-white/85' : 'text-muted')}>{label}</h3>
        <span
          aria-hidden
          className={cn(
            'grid size-9 shrink-0 place-items-center rounded-lg',
            featured ? 'bg-white/15 text-white' : 'bg-accent-soft text-accent-text',
          )}
        >
          <Icon className="size-[18px]" strokeWidth={1.75} />
        </span>
      </div>

      <p className="tabular mt-4 text-kpi font-semibold">{value}</p>

      <div className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1">
        <Delta value={delta} onGradient={featured} />
        <span className={cn('text-caption', featured ? 'text-white/80' : 'text-muted')}>{comparison}</span>
      </div>

      {trend && (
        <Sparkline
          values={trend}
          className={cn('mt-4', featured ? 'text-white/90' : 'text-accent')}
        />
      )}
    </Card>
  )
}

/** Same footprint as <StatCard /> so the grid doesn't shift when data arrives. */
export function StatCardSkeleton() {
  return (
    <Card className="flex flex-col">
      <div className="flex items-center justify-between">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="size-9 rounded-lg" />
      </div>
      <Skeleton className="mt-4 h-9 w-36" />
      <Skeleton className="mt-3 h-6 w-40" />
      <Skeleton className="mt-4 h-9 w-full" />
    </Card>
  )
}
