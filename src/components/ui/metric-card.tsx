import { Delta } from '@/components/ui/delta'
import { cn } from '@/lib/cn'

interface MetricCardProps {
  label: string
  value: string
  delta?: number
  invertDelta?: boolean
  className?: string
}

/** Compact secondary metric. Flat on purpose — it sits inside a card, so no extra shadow or nesting weight. */
export function MetricCard({ label, value, delta, invertDelta, className }: MetricCardProps) {
  return (
    <div className={cn('rounded-control border border-border bg-background p-3.5', className)}>
      <p className="text-caption text-muted">{label}</p>
      <div className="mt-1.5 flex items-center justify-between gap-2">
        <p className="tabular text-section font-semibold">{value}</p>
        {delta !== undefined && <Delta value={delta} invert={invertDelta} />}
      </div>
    </div>
  )
}
