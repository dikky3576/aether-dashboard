const usd = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })
const usdCents = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2 })
const usdCompact = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  notation: 'compact',
  maximumFractionDigits: 1,
})
const integer = new Intl.NumberFormat('en-US')

export type ValueFormat = 'currency' | 'number' | 'percent'

export function formatCurrency(value: number, options: { compact?: boolean; cents?: boolean } = {}): string {
  if (options.compact) return usdCompact.format(value)
  return (options.cents ? usdCents : usd).format(value)
}

export function formatNumber(value: number): string {
  return integer.format(value)
}

export function formatPercent(value: number, digits = 1): string {
  return `${value.toFixed(digits)}%`
}

/** "+12.4%" / "−3.1%" (true minus sign). */
export function formatSignedPercent(value: number, digits = 1): string {
  return `${value < 0 ? '−' : '+'}${Math.abs(value).toFixed(digits)}%`
}

export function formatValue(value: number, format: ValueFormat): string {
  if (format === 'currency') return formatCurrency(value)
  if (format === 'percent') return formatPercent(value, 2)
  return formatNumber(value)
}

const shortDate = new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
const longDate = new Intl.DateTimeFormat('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })

export const formatShortDate = (value: Date | number): string => shortDate.format(value)
export const formatLongDate = (value: Date | number): string => longDate.format(value)
