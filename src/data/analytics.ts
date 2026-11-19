import { buildOverview, mulberry32 } from '@/data/overview'
import type { OverviewData, RangeKey } from '@/types/overview'

export interface AnalyticsKpi {
  id: 'sessions' | 'signups' | 'conversion' | 'duration'
  label: string
  value: string
  delta: number
  trend: number[]
}

export interface TrafficPoint {
  label: string
  fullLabel: string
  [key: string]: string | number
  visitors: number
  signups: number
  conversion: number
}

export interface Channel {
  id: string
  name: string
  visitors: number
  share: number
}

export interface PageStat {
  path: string
  views: number
  bounce: number
  avgTime: string
}

export interface FunnelStep {
  id: string
  label: string
  value: number
}

export interface MrrPoint {
  label: string
  fullLabel: string
  [key: string]: string | number
  new: number
  expansion: number
  churn: number
}

export interface Goal {
  id: string
  label: string
  current: number
  target: number
  unit: 'currency' | 'number' | 'percent'
  /** True when lower is better (e.g. churn). */
  invert?: boolean
}

export interface AnalyticsData {
  range: RangeKey
  overview: OverviewData
  kpis: AnalyticsKpi[]
  traffic: TrafficPoint[]
  channels: Channel[]
  pages: PageStat[]
  funnel: FunnelStep[]
  mrr: MrrPoint[]
  mrrSummary: { mrr: number; arr: number; arpu: number; netNew: number }
  goals: Goal[]
}

const DAYS_PER_POINT: Record<RangeKey, number> = { '7d': 1, '30d': 1, '90d': 7, '12m': 30 }
const SEED: Record<RangeKey, number> = { '7d': 101, '30d': 202, '90d': 303, '12m': 404 }
const KPI_DELTAS: Record<RangeKey, [number, number, number, number]> = {
  '7d': [4.1, 6.3, 2.1, 1.4],
  '30d': [9.6, 12.2, 4.3, 3.1],
  '90d': [15.8, 18.4, -1.2, 5.6],
  '12m': [34.2, 41.7, 9.6, 8.2],
}
const DURATION: Record<RangeKey, string> = { '7d': '3m 38s', '30d': '3m 42s', '90d': '3m 51s', '12m': '4m 05s' }

const CHANNELS = [
  ['organic', 'Organic search', 38],
  ['direct', 'Direct', 24],
  ['referral', 'Referral', 17],
  ['social', 'Social', 13],
  ['email', 'Email', 8],
] as const

const PAGES = [
  ['/', 0.31, 41, '1m 52s'],
  ['/pricing', 0.19, 33, '2m 14s'],
  ['/features', 0.14, 38, '2m 01s'],
  ['/blog/launch-notes', 0.1, 52, '3m 20s'],
  ['/signup', 0.09, 24, '1m 05s'],
  ['/docs/getting-started', 0.08, 29, '4m 12s'],
  ['/customers', 0.05, 44, '1m 37s'],
  ['/contact', 0.04, 47, '0m 58s'],
] as const

function sum(values: number[]): number {
  return values.reduce((a, b) => a + b, 0)
}

export function buildAnalytics(range: RangeKey): AnalyticsData {
  const overview = buildOverview(range)
  const rand = mulberry32(SEED[range])
  const days = DAYS_PER_POINT[range]

  const traffic: TrafficPoint[] = overview.revenue.map((point, i, all) => {
    const visitors = Math.round(820 * days * (0.9 + (i / all.length) * 0.22) * (0.92 + rand() * 0.16))
    const signups = Math.round(visitors * (0.032 + rand() * 0.01))
    return {
      label: point.label,
      fullLabel: point.fullLabel,
      visitors,
      signups,
      conversion: Math.round((signups / visitors) * 1000) / 10,
    }
  })

  const totalVisitors = sum(traffic.map((t) => t.visitors))
  const totalSignups = sum(traffic.map((t) => t.signups))
  const conversion = (totalSignups / totalVisitors) * 100
  const [dSessions, dSignups, dConversion, dDuration] = KPI_DELTAS[range]

  const trend = (values: number[]) => values
  const kpis: AnalyticsKpi[] = [
    { id: 'sessions', label: 'Sessions', value: totalVisitors.toLocaleString('en-US'), delta: dSessions, trend: trend(traffic.map((t) => t.visitors)) },
    { id: 'signups', label: 'Sign-ups', value: totalSignups.toLocaleString('en-US'), delta: dSignups, trend: trend(traffic.map((t) => t.signups)) },
    { id: 'conversion', label: 'Visitor → sign-up', value: `${conversion.toFixed(2)}%`, delta: dConversion, trend: trend(traffic.map((t) => t.conversion)) },
    { id: 'duration', label: 'Avg. session', value: DURATION[range], delta: dDuration, trend: trend(traffic.map((_, i) => 200 + i * 2 + rand() * 10)) },
  ]

  const channels: Channel[] = CHANNELS.map(([id, name, share]) => ({
    id,
    name,
    share,
    visitors: Math.round((totalVisitors * share) / 100),
  }))

  const pages: PageStat[] = PAGES.map(([path, factor, bounce, avgTime]) => ({
    path,
    views: Math.round(totalVisitors * 1.6 * factor),
    bounce,
    avgTime,
  }))

  const trials = Math.round(totalSignups * 0.58)
  const funnel: FunnelStep[] = [
    { id: 'visitors', label: 'Visitors', value: totalVisitors },
    { id: 'signups', label: 'Sign-ups', value: totalSignups },
    { id: 'trials', label: 'Started trial', value: trials },
    { id: 'paid', label: 'Became paying', value: Math.round(trials * 0.31) },
  ]

  const mrr: MrrPoint[] = overview.revenue.map((point) => ({
    label: point.label,
    fullLabel: point.fullLabel,
    new: Math.round(point.current * (0.13 + rand() * 0.03)),
    expansion: Math.round(point.current * (0.05 + rand() * 0.02)),
    churn: -Math.round(point.current * (0.035 + rand() * 0.02)),
  }))
  const netNew = sum(mrr.map((m) => m.new + m.expansion + m.churn))

  return {
    range,
    overview,
    kpis,
    traffic,
    channels,
    pages,
    funnel,
    mrr,
    mrrSummary: { mrr: 84200, arr: 84200 * 12, arpu: 58.4, netNew },
    goals: [
      { id: 'mrr', label: 'Monthly recurring revenue', current: 84200, target: 100000, unit: 'currency' },
      { id: 'customers', label: 'New customers', current: 312, target: 400, unit: 'number' },
      { id: 'conversion', label: 'Visitor → sign-up rate', current: 3.82, target: 4.5, unit: 'percent' },
      { id: 'trial', label: 'Trial → paid conversion', current: 31, target: 35, unit: 'percent' },
      { id: 'nrr', label: 'Net revenue retention', current: 108.4, target: 110, unit: 'percent' },
      { id: 'churn', label: 'Monthly churn', current: 1.9, target: 1.5, unit: 'percent', invert: true },
    ],
  }
}
