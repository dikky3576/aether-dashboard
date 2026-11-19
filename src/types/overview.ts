import type { Status } from '@/components/ui/status-badge'

export type RangeKey = '7d' | '30d' | '90d' | '12m'

export interface RangeOption {
  value: RangeKey
  label: string
  /** Short label for compact controls. */
  short: string
  comparison: string
}

export type KpiId = 'revenue' | 'users' | 'projects' | 'conversion'

export interface Kpi {
  id: KpiId
  label: string
  value: number
  format: 'currency' | 'number' | 'percent'
  /** Percentage change vs the previous period. */
  delta: number
  trend: number[]
}

export interface RevenuePoint {
  label: string
  fullLabel: string
  previousLabel: string
  current: number
  previous: number
}

export interface PlanSlice {
  id: string
  name: string
  amount: number
  /** Percent of total, sums to 100 across slices. */
  share: number
}

export interface PerformanceMetric {
  id: string
  label: string
  value: string
  delta: number
  /** True when a lower number is better (e.g. churn). */
  invert?: boolean
}

export interface Transaction {
  id: string
  customer: { name: string; email: string }
  /** ISO timestamp. */
  date: string
  amount: number
  status: Status
}

export interface ActivityItem {
  id: string
  user: string
  action: string
  target: string
  /** Epoch ms. */
  createdAt: number
}

export interface OverviewData {
  range: RangeKey
  kpis: Kpi[]
  revenue: RevenuePoint[]
  revenueTotals: { current: number; previous: number; delta: number }
  plans: PlanSlice[]
  metrics: PerformanceMetric[]
  insight: string
  transactions: Transaction[]
  activity: ActivityItem[]
}
