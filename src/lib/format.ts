const relative = new Intl.RelativeTimeFormat('en', { numeric: 'auto' })
const usd = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })
const usdPrecise = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2 })
const usdCompact = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  notation: 'compact',
  maximumFractionDigits: 1,
})
const integer = new Intl.NumberFormat('en-US')
const dateTime = new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })
const longDate = new Intl.DateTimeFormat('en-US', { weekday: 'long', month: 'long', day: 'numeric' })

/** "6 minutes ago", "yesterday". Accepts a Date or epoch ms. */
export function formatRelativeTime(value: Date | number, now: number = Date.now()): string {
  const diffSeconds = Math.round((new Date(value).getTime() - now) / 1000)
  const abs = Math.abs(diffSeconds)

  if (abs < 60) return 'Just now'
  if (abs < 3_600) return relative.format(Math.round(diffSeconds / 60), 'minute')
  if (abs < 86_400) return relative.format(Math.round(diffSeconds / 3_600), 'hour')
  return relative.format(Math.round(diffSeconds / 86_400), 'day')
}

/** $128,430 — or $128,430.50 with `precise`, or $128.4K with `compact`. */
export function formatCurrency(value: number, options: { precise?: boolean; compact?: boolean } = {}): string {
  if (options.compact) return usdCompact.format(value)
  return (options.precise ? usdPrecise : usd).format(value)
}

export function formatNumber(value: number): string {
  return integer.format(value)
}

export function formatPercent(value: number, decimals = 1): string {
  return `${value.toFixed(decimals)}%`
}

export function formatDateTime(value: string | number | Date): string {
  return dateTime.format(new Date(value))
}

/** "Friday, November 13" */
export function formatLongDate(value: Date = new Date()): string {
  return longDate.format(value)
}

export function getGreeting(date: Date = new Date()): string {
  const hour = date.getHours()
  if (hour < 12) return 'Good morning'
  if (hour < 18) return 'Good afternoon'
  return 'Good evening'
}
