import { Lightbulb } from 'lucide-react'
import { ChartCard } from '@/components/charts/ChartCard'
import { TrendChart } from '@/components/charts/TrendChart'
import { Badge, Card, DataTable, Progress, Skeleton, type BadgeVariant, type DataTableColumn } from '@/components/ui'
import type { Goal } from '@/data/analytics'
import { useAnalyticsContext } from '@/features/analytics/AnalyticsLayout'
import { formatCurrency, formatNumber } from '@/lib/format'

type GoalState = 'on-track' | 'at-risk' | 'behind'

function attainment(goal: Goal): number {
  const ratio = goal.invert ? goal.target / goal.current : goal.current / goal.target
  return Math.min(ratio * 100, 100)
}

function stateOf(goal: Goal): GoalState {
  const pct = attainment(goal)
  return pct >= 95 ? 'on-track' : pct >= 80 ? 'at-risk' : 'behind'
}

const STATE_META: Record<GoalState, { label: string; variant: BadgeVariant; tone: 'success' | 'warning' | 'danger' }> = {
  'on-track': { label: 'On track', variant: 'success', tone: 'success' },
  'at-risk': { label: 'At risk', variant: 'warning', tone: 'warning' },
  behind: { label: 'Behind', variant: 'danger', tone: 'danger' },
}

function formatGoal(goal: Goal, value: number): string {
  if (goal.unit === 'currency') return formatCurrency(value)
  if (goal.unit === 'percent') return `${value}%`
  return formatNumber(value)
}

const COLUMNS: DataTableColumn<Goal>[] = [
  { id: 'goal', header: 'Goal', sortValue: (r) => r.label, cell: (r) => <span className="font-medium">{r.label}</span> },
  { id: 'current', header: 'Current', align: 'right', cell: (r) => <span className="tabular">{formatGoal(r, r.current)}</span> },
  { id: 'target', header: 'Target', align: 'right', hideBelow: 'sm', cell: (r) => <span className="tabular text-muted">{formatGoal(r, r.target)}</span> },
  {
    id: 'progress',
    header: 'Progress',
    hideBelow: 'md',
    sortValue: attainment,
    className: 'min-w-40',
    cell: (r) => <Progress value={attainment(r)} tone={STATE_META[stateOf(r)].tone} label={`${r.label} progress`} />,
  },
  {
    id: 'status',
    header: 'Status',
    sortValue: (r) => attainment(r),
    cell: (r) => {
      const meta = STATE_META[stateOf(r)]
      return <Badge variant={meta.variant} dot>{meta.label}</Badge>
    },
  },
]

export function PerformanceReportsPage() {
  const { data } = useAnalyticsContext()

  const insights = data
    ? (() => {
        const sorted = [...data.goals].sort((a, b) => attainment(b) - attainment(a))
        const best = sorted[0]
        const worst = sorted[sorted.length - 1]
        const behind = data.goals.filter((g) => stateOf(g) !== 'on-track').length
        return [
          best && `${best.label} is closest to target at ${Math.round(attainment(best))}%.`,
          worst && `${worst.label} needs attention — only ${Math.round(attainment(worst))}% of the way there.`,
          `${behind} of ${data.goals.length} goals are not yet on track this period.`,
        ].filter((line): line is string => Boolean(line))
      })()
    : []

  return (
    <div className="space-y-5">
      <div className="grid gap-5 xl:grid-cols-12">
        <Card padding="none" className="min-w-0 xl:col-span-8">
          <div className="px-5 pt-5 sm:px-6 sm:pt-6">
            <h3 className="text-card font-medium">Goals</h3>
            <p className="mt-0.5 text-caption text-muted">Progress against this period’s targets</p>
          </div>
          <DataTable
            className="mt-4"
            caption="Goals and targets"
            columns={COLUMNS}
            data={data?.goals ?? []}
            getRowId={(r) => r.id}
            loading={!data}
            pageSize={6}
          />
        </Card>

        <ChartCard className="min-w-0 xl:col-span-4" title="Insights" description="What stands out">
          {data ? (
            <ul className="space-y-3">
              {insights.map((line) => (
                <li key={line} className="flex gap-3 rounded-control bg-accent-soft p-3.5">
                  <Lightbulb className="mt-0.5 size-4 shrink-0 text-accent-text" strokeWidth={1.75} aria-hidden />
                  <p className="text-caption text-foreground">{line}</p>
                </li>
              ))}
            </ul>
          ) : (
            <div className="space-y-3">
              {Array.from({ length: 3 }, (_, i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          )}
        </ChartCard>
      </div>

      <ChartCard title="Visitor → sign-up rate" description="Conversion rate per period (%)">
        {data ? (
          <TrendChart
            data={data.traffic}
            series={[{ key: 'conversion', name: 'Conversion rate', color: 'var(--chart-2)' }]}
            formatValue={(v) => `${v.toFixed(1)}%`}
            summary="Conversion rate from visitor to sign-up over the selected period."
          />
        ) : (
          <Skeleton className="h-72 w-full" />
        )}
      </ChartCard>
    </div>
  )
}
