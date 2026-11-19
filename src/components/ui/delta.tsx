import { ArrowDownRight, ArrowUpRight } from 'lucide-react'
import { cn } from '@/lib/cn'

interface DeltaProps {
  /** Percentage change. Positive = up. */
  value: number
  /** True when a lower number is better (churn, errors…). */
  invert?: boolean
  /** Render for use on the brand gradient. */
  onGradient?: boolean
  suffix?: string
  className?: string
}

/** Direction + magnitude chip. Never relies on colour alone: arrow icon and "Up/Down" for screen readers. */
export function Delta({ value, invert = false, onGradient = false, suffix = '%', className }: DeltaProps) {
  const up = value >= 0
  const good = invert ? !up : up
  const Icon = up ? ArrowUpRight : ArrowDownRight

  return (
    <span
      className={cn(
        'tabular inline-flex h-6 shrink-0 items-center gap-0.5 rounded-full pl-1.5 pr-2 text-caption font-medium',
        onGradient ? 'bg-white/20 text-white' : good ? 'bg-success-soft text-success' : 'bg-danger-soft text-danger',
        className,
      )}
    >
      <Icon className="size-3.5" strokeWidth={2} aria-hidden />
      <span className="sr-only">{up ? 'Up' : 'Down'} </span>
      {Math.abs(value).toFixed(1)}
      {suffix}
    </span>
  )
}
