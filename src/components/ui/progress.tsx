import { cn } from '@/lib/cn'

const TONES = {
  accent: 'bg-[image:var(--gradient-brand-soft)]',
  success: 'bg-success',
  warning: 'bg-warning',
  danger: 'bg-danger',
} as const

interface ProgressProps {
  value: number
  max?: number
  /** Accessible name, e.g. "Project progress". */
  label: string
  tone?: keyof typeof TONES
  className?: string
}

export function Progress({ value, max = 100, label, tone = 'accent', className }: ProgressProps) {
  const percent = Math.max(0, Math.min(100, (value / max) * 100))
  return (
    <div
      role="progressbar"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={max}
      aria-valuenow={Math.round(value)}
      className={cn('h-2 w-full overflow-hidden rounded-full bg-subtle ring-1 ring-inset ring-border', className)}
    >
      <div
        className={cn('h-full rounded-full transition-[width] duration-300 ease-out', TONES[tone])}
        style={{ width: `${percent}%` }}
      />
    </div>
  )
}
