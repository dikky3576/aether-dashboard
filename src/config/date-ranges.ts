export type RangeKey = '7d' | '30d' | '90d' | '12m'

export interface DateRangeConfig {
  key: RangeKey
  label: string
  /** Compact label for segmented controls. */
  short: string
  /** Used in "vs previous 30 days". */
  comparison: string
  /** Number of data points in a series for this range. */
  points: number
  unit: 'day' | 'week' | 'month'
  /** Average revenue per data point (mock data baseline). */
  basePerPoint: number
}

export const DATE_RANGES: Record<RangeKey, DateRangeConfig> = {
  '7d': { key: '7d', label: 'Last 7 days', short: '7D', comparison: 'previous 7 days', points: 7, unit: 'day', basePerPoint: 4300 },
  '30d': { key: '30d', label: 'Last 30 days', short: '30D', comparison: 'previous 30 days', points: 30, unit: 'day', basePerPoint: 4200 },
  '90d': { key: '90d', label: 'Last 90 days', short: '90D', comparison: 'previous 90 days', points: 13, unit: 'week', basePerPoint: 29500 },
  '12m': { key: '12m', label: 'Last 12 months', short: '12M', comparison: 'previous 12 months', points: 12, unit: 'month', basePerPoint: 124000 },
}

export const RANGE_KEYS: RangeKey[] = ['7d', '30d', '90d', '12m']

export function isRangeKey(value: string): value is RangeKey {
  return (RANGE_KEYS as string[]).includes(value)
}
