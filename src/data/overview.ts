/**
 * Mock data for the Overview page. Everything is deterministic (seeded), so numbers
 * stay stable between loads. Replace `buildOverview` with your API response mapper.
 */
import type {
  ActivityItem,
  Kpi,
  OverviewData,
  PerformanceMetric,
  PlanSlice,
  RangeKey,
  RangeOption,
  RevenuePoint,
  Transaction,
} from '@/types/overview'
import type { Status } from '@/components/ui/status-badge'
import { formatCurrency } from '@/lib/format'

export const RANGE_OPTIONS: readonly [RangeOption, ...RangeOption[]] = [
  { value: '7d', label: 'Last 7 days', short: '7D', comparison: 'vs previous 7 days' },
  { value: '30d', label: 'Last 30 days', short: '30D', comparison: 'vs previous 30 days' },
  { value: '90d', label: 'Last 90 days', short: '90D', comparison: 'vs previous 90 days' },
  { value: '12m', label: 'Last 12 months', short: '12M', comparison: 'vs previous 12 months' },
]

export function isRangeKey(value: string): value is RangeKey {
  return RANGE_OPTIONS.some((option) => option.value === value)
}

/* ── helpers ──────────────────────────────────────────── */

export function mulberry32(seed: number): () => number {
  let a = seed
  return () => {
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function pick<T>(items: readonly [T, ...T[]], index: number): T {
  return items[index % items.length] ?? items[0]
}

type Unit = 'day' | 'week' | 'month'

function shift(base: Date, unit: Unit, amount: number): Date {
  const next = new Date(base)
  if (unit === 'month') next.setMonth(next.getMonth() + amount)
  else next.setDate(next.getDate() + amount * (unit === 'week' ? 7 : 1))
  return next
}

const shortDay = new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' })
const weekday = new Intl.DateTimeFormat('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
const shortMonth = new Intl.DateTimeFormat('en-US', { month: 'short' })
const longMonth = new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric' })

function describe(date: Date, unit: Unit): { label: string; full: string } {
  if (unit === 'month') return { label: shortMonth.format(date), full: longMonth.format(date) }
  if (unit === 'week') return { label: shortDay.format(date), full: `Week ending ${shortDay.format(date)}` }
  return { label: shortDay.format(date), full: weekday.format(date) }
}

/* ── revenue ──────────────────────────────────────────── */

interface RangeConfig {
  points: number
  unit: Unit
  /** Days covered by one point. */
  days: number
  seed: number
  baseDaily: number
  growth: number
}

const CONFIG: Record<RangeKey, RangeConfig> = {
  '7d': { points: 7, unit: 'day', days: 1, seed: 7, baseDaily: 4300, growth: 0.1 },
  '30d': { points: 30, unit: 'day', days: 1, seed: 30, baseDaily: 4200, growth: 0.14 },
  '90d': { points: 13, unit: 'week', days: 7, seed: 90, baseDaily: 4400, growth: 0.12 },
  '12m': { points: 12, unit: 'month', days: 30, seed: 12, baseDaily: 4300, growth: 0.32 },
}

function buildRevenue(range: RangeKey): RevenuePoint[] {
  const cfg = CONFIG[range]
  const rand = mulberry32(cfg.seed)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const last = cfg.points - 1
  const wave = (i: number) => 1 + 0.13 * Math.sin(i * (cfg.unit === 'day' ? 0.9 : 0.6))

  return Array.from({ length: cfg.points }, (_, i) => {
    const offset = -(last - i)
    const now = describe(shift(today, cfg.unit, offset), cfg.unit)
    const before = describe(shift(today, cfg.unit, offset - cfg.points), cfg.unit)
    const volume = cfg.baseDaily * cfg.days

    return {
      label: now.label,
      fullLabel: now.full,
      previousLabel: before.full,
      current: Math.round(volume * wave(i) * (1 + cfg.growth * (i / last)) * (0.95 + rand() * 0.1)),
      previous: Math.round(volume * 0.92 * wave(i + 2) * (1 + cfg.growth * 0.5 * (i / last)) * (0.95 + rand() * 0.1)),
    }
  })
}

function sum(values: number[]): number {
  return values.reduce((total, value) => total + value, 0)
}

function percentChange(current: number, previous: number): number {
  return Math.round((current / previous - 1) * 1000) / 10
}

/* ── KPIs ─────────────────────────────────────────────── */

function trendSeries(seed: number, direction: number, length = 14): number[] {
  const rand = mulberry32(seed)
  return Array.from({ length }, (_, i) => 50 + direction * i * 2.2 + (rand() - 0.5) * 14)
}

const KPI_SOURCE: Record<RangeKey, { users: [number, number]; projects: [number, number]; conversion: [number, number] }> = {
  '7d': { users: [18420, 5.2], projects: [128, 2.4], conversion: [3.64, 2.1] },
  '30d': { users: [24812, 8.1], projects: [128, 6.7], conversion: [3.82, 4.3] },
  '90d': { users: [31206, 12.4], projects: [128, 14.3], conversion: [3.71, -1.2] },
  '12m': { users: [48930, 21.7], projects: [128, 38.9], conversion: [3.48, 9.6] },
}

function buildKpis(range: RangeKey, revenue: RevenuePoint[], revenueDelta: number): Kpi[] {
  const source = KPI_SOURCE[range]
  const [users, usersDelta] = source.users
  const [projects, projectsDelta] = source.projects
  const [conversion, conversionDelta] = source.conversion
  const direction = (delta: number) => (delta >= 0 ? 1 : -1)

  return [
    {
      id: 'revenue',
      label: 'Total revenue',
      value: sum(revenue.map((p) => p.current)),
      format: 'currency',
      delta: revenueDelta,
      trend: revenue.map((p) => p.current),
    },
    { id: 'users', label: 'Active users', value: users, format: 'number', delta: usersDelta, trend: trendSeries(11, direction(usersDelta)) },
    { id: 'projects', label: 'Total projects', value: projects, format: 'number', delta: projectsDelta, trend: trendSeries(23, direction(projectsDelta)) },
    { id: 'conversion', label: 'Conversion rate', value: conversion, format: 'percent', delta: conversionDelta, trend: trendSeries(37, direction(conversionDelta)) },
  ]
}

/* ── performance ──────────────────────────────────────── */

const PLAN_SHARES: Record<RangeKey, [number, number, number, number]> = {
  '7d': [20, 43, 28, 9],
  '30d': [18, 44, 29, 9],
  '90d': [17, 42, 31, 10],
  '12m': [15, 40, 33, 12],
}

const PLAN_NAMES = ['Starter', 'Growth', 'Scale', 'Enterprise'] as const

function buildPlans(range: RangeKey, total: number): PlanSlice[] {
  return PLAN_SHARES[range].map((share, index) => ({
    id: String(PLAN_NAMES[index]).toLowerCase(),
    name: PLAN_NAMES[index] ?? 'Plan',
    amount: Math.round((total * share) / 100),
    share,
  }))
}

const METRICS: PerformanceMetric[] = [
  { id: 'nrr', label: 'Net revenue retention', value: '108.4%', delta: 2.1 },
  { id: 'churn', label: 'Churn rate', value: '1.9%', delta: -0.3, invert: true },
]

function buildInsight(plans: PlanSlice[]): string {
  const top = plans.reduce((best, plan) => (plan.share > best.share ? plan : best), plans[0] ?? { id: '', name: 'Growth', amount: 0, share: 0 })
  const enterprise = plans.find((plan) => plan.id === 'enterprise')
  return `${top.name} drives ${top.share}% of revenue (${formatCurrency(top.amount, { compact: true })}). Enterprise contributes ${enterprise?.share ?? 0}% from the fewest accounts — the strongest upsell opportunity.`
}

/* ── transactions & activity ──────────────────────────── */

const CUSTOMERS: readonly [{ name: string; email: string }, ...{ name: string; email: string }[]] = [
  { name: 'Northwind Labs', email: 'billing@northwind.io' },
  { name: 'Priya Nair', email: 'priya@lumen.studio' },
  { name: 'Jonas Weber', email: 'jonas@weberco.de' },
  { name: 'Sofia Reyes', email: 'sofia@brightpath.com' },
  { name: 'Kenji Mori', email: 'kenji@orbital.jp' },
  { name: 'Amara Okafor', email: 'amara@kindred.africa' },
  { name: 'Lena Fischer', email: 'lena@fischer-design.com' },
  { name: 'Marcus Webb', email: 'marcus@webbworks.com' },
  { name: 'Hana Kim', email: 'hana@pixelforge.kr' },
  { name: 'Tomás Silva', email: 'tomas@verdeapp.com.br' },
  { name: 'Chloe Martin', email: 'chloe@atelier-m.fr' },
  { name: 'Ravi Patel', email: 'ravi@stackwise.in' },
  { name: 'Elena Petrova', email: 'elena@nordlicht.eu' },
  { name: 'Omar Haddad', email: 'omar@cedarlabs.ae' },
]

const AMOUNTS: readonly [number, ...number[]] = [2400, 149, 890, 49, 1290, 349, 5200, 129, 749, 19, 1890, 289, 3150, 99]

const STATUS_CYCLE: readonly [Status, ...Status[]] = [
  'completed',
  'completed',
  'completed',
  'pending',
  'completed',
  'failed',
  'completed',
  'refunded',
  'completed',
  'pending',
]

export function buildTransactions(count = 48): Transaction[] {
  const now = Date.now()
  return Array.from({ length: count }, (_, i) => ({
    id: `TXN-${48201 - i}`,
    customer: pick(CUSTOMERS, i),
    date: new Date(now - (i * 131 + (i % 5) * 13) * 60_000).toISOString(),
    amount: pick(AMOUNTS, i * 7 + 3),
    status: pick(STATUS_CYCLE, i),
  }))
}

function buildActivity(): ActivityItem[] {
  const minutesAgo = (n: number) => Date.now() - n * 60_000
  return [
    { id: 'a1', user: 'Priya Nair', action: 'created project', target: 'Q4 Launch', createdAt: minutesAgo(8) },
    { id: 'a2', user: 'Jonas Weber', action: 'upgraded to', target: 'Scale plan', createdAt: minutesAgo(34) },
    { id: 'a3', user: 'Sofia Reyes', action: 'invited', target: 'kenji@orbital.jp', createdAt: minutesAgo(96) },
    { id: 'a4', user: 'Alex Morgan', action: 'exported', target: 'October revenue report', createdAt: minutesAgo(60 * 4) },
    { id: 'a5', user: 'Kenji Mori', action: 'completed 5 tasks in', target: 'Mobile redesign', createdAt: minutesAgo(60 * 7) },
    { id: 'a6', user: 'Amara Okafor', action: 'connected integration', target: 'Slack', createdAt: minutesAgo(60 * 22) },
  ]
}

/* ── public builder ───────────────────────────────────── */

export function buildOverview(range: RangeKey): OverviewData {
  const revenue = buildRevenue(range)
  const current = sum(revenue.map((p) => p.current))
  const previous = sum(revenue.map((p) => p.previous))
  const delta = percentChange(current, previous)
  const plans = buildPlans(range, current)

  return {
    range,
    kpis: buildKpis(range, revenue, delta),
    revenue,
    revenueTotals: { current, previous, delta },
    plans,
    metrics: METRICS,
    insight: buildInsight(plans),
    transactions: buildTransactions(),
    activity: buildActivity(),
  }
}
