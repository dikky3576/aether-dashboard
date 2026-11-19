import { CalendarDays } from 'lucide-react'
import { Select } from '@/components/ui/select'
import { cn } from '@/lib/cn'

interface DateRangePickerProps<T extends string> {
  value: T
  onValueChange: (value: T) => void
  options: { value: T; label: string }[]
  className?: string
  'aria-label'?: string
}

/** Preset date ranges ("Last 30 days"). A custom calendar range can plug in here later without changing callers. */
export function DateRangePicker<T extends string>({
  value,
  onValueChange,
  options,
  className,
  'aria-label': ariaLabel = 'Date range',
}: DateRangePickerProps<T>) {
  return (
    <div className={cn('relative', className)}>
      <CalendarDays
        aria-hidden
        className="pointer-events-none absolute left-3 top-1/2 z-10 size-4 -translate-y-1/2 text-muted"
      />
      <Select
        aria-label={ariaLabel}
        value={value}
        options={options}
        className="pl-9"
        onValueChange={(next) => {
          const match = options.find((option) => option.value === next)
          if (match) onValueChange(match.value)
        }}
      />
    </div>
  )
}
