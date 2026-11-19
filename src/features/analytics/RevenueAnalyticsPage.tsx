import { CalendarRange, Repeat, TrendingUp, User } from 'lucide-react'
import { ChartCard } from '@/components/charts/ChartCard'
import { StackedBarChart } from '@/components/charts/StackedBarChart'
import { Progress, Skeleton, StatCard, StatCardSkeleton } from '@/components/ui'
import { RANGE_OPTIONS } from '@/data/overview'
import { RevenueChart } from '@/features/overview/components/RevenueChart'
import { useAnalyticsContext } from '@/features/analytics/AnalyticsLayout'
import { formatCurrency } from '@/lib/format'

const MRR_SERIES = [
  { key: 'new', name: 'New', color: 'var(--chart-1)' },
  { key: 'expansion', name: 'Expansion', color: 'var(--chart-3)' },
  { key: 'churn', name: 'Churn', color: 'var(--chart-4)' },
]

export function RevenueAnalyticsPage() {
  const { data, range, setRange } = useAnalyticsContext()
  const comparison = RANGE_OPTIONS.find((o) => o.value === range)?.comparison ?? ''
  const summary = data?.mrrSummary

  return (
    <div className="space-y-5">
      <section aria-label="Recurring revenue" className="grid gap-4 sm:grid-cols-2 sm:gap-5 xl:grid-cols-4">
        {summary ? (
          <>
            <StatCard label="MRR" value={formatCurrency(summary.mrr)} delta={6.2} comparison={comparison} icon={Repeat} featured />
            <StatCard label="ARR" value={formatCurrency(summary.arr)} delta={6.2} comparison={comparison} icon={CalendarRange} />
            <StatCard label="ARPU" value={formatCurrency(summary.arpu, { precise: true })} delta={2.4} comparison={comparison} icon={User} />
            <StatCard label="Net new MRR" value={formatCurrency(summary.netNew)} delta={11.8} comparison={comparison} icon={TrendingUp} />
          </>
        ) : (
          Array.from({ length: 4 }, (_, i) => <StatCardSkeleton key={i} />)
        )}
      </section>

      <RevenueChart data={data?.overview} range={range} onRangeChange={setRange} />

      <div className="grid gap-5 xl:grid-cols-12">
        <ChartCard
          className="min-w-0 xl:col-span-8"
          title="MRR movement"
          description="New, expansion and churned revenue per period"
        >
          {data ? (
            <>
              <ul className="mb-4 flex flex-wrap gap-x-5 gap-y-1 text-caption text-muted" aria-label="Chart legend">
                {MRR_SERIES.map((s) => (
                  <li key={s.key} className="flex items-center gap-2">
                    <span aria-hidden className="size-2.5 rounded-sm" style={{ backgroundColor: s.color }} />
                    {s.name}
                  </li>
                ))}
              </ul>
              <StackedBarChart
                data={data.mrr}
                series={MRR_SERIES}
                formatValue={(v) => formatCurrency(v)}
                formatAxis={(v) => formatCurrency(v, { compact: true })}
                summary={`Net new MRR was ${formatCurrency(data.mrrSummary.netNew)} in this period.`}
              />
            </>
          ) : (
            <Skeleton className="h-72 w-full" />
          )}
        </ChartCard>

        <ChartCard className="min-w-0 xl:col-span-4" title="Revenue by plan" description="Share of revenue in this period">
          {data ? (
            <ul className="space-y-4">
              {data.overview.plans.map((plan) => (
                <li key={plan.id}>
                  <div className="mb-1.5 flex items-baseline justify-between gap-3 text-body">
                    <span>{plan.name}</span>
                    <span className="tabular text-muted">
                      {formatCurrency(plan.amount, { compact: true })} ·{' '}
                      <span className="font-medium text-foreground">{plan.share}%</span>
                    </span>
                  </div>
                  <Progress value={plan.share} label={`${plan.name} share of revenue`} />
                </li>
              ))}
            </ul>
          ) : (
            <div className="space-y-5">
              {Array.from({ length: 4 }, (_, i) => (
                <Skeleton key={i} className="h-8 w-full" />
              ))}
            </div>
          )}
        </ChartCard>
      </div>
    </div>
  )
}
