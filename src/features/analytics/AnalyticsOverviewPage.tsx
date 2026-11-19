import { Activity, Clock, Target, UserPlus, type LucideIcon } from 'lucide-react'
import { ChartCard } from '@/components/charts/ChartCard'
import { TrendChart } from '@/components/charts/TrendChart'
import { Card, DataTable, Progress, Skeleton, StatCard, StatCardSkeleton, type DataTableColumn } from '@/components/ui'
import { useAnalyticsContext } from '@/features/analytics/AnalyticsLayout'
import { RANGE_OPTIONS } from '@/data/overview'
import type { AnalyticsKpi, PageStat } from '@/data/analytics'
import { formatNumber } from '@/lib/format'

const ICONS: Record<AnalyticsKpi['id'], LucideIcon> = {
  sessions: Activity,
  signups: UserPlus,
  conversion: Target,
  duration: Clock,
}

const PAGE_COLUMNS: DataTableColumn<PageStat>[] = [
  {
    id: 'path',
    header: 'Page',
    sortValue: (r) => r.path,
    cell: (r) => <span className="font-mono text-caption">{r.path}</span>,
  },
  {
    id: 'views',
    header: 'Views',
    align: 'right',
    sortValue: (r) => r.views,
    cell: (r) => <span className="tabular font-medium">{formatNumber(r.views)}</span>,
  },
  {
    id: 'bounce',
    header: 'Bounce rate',
    align: 'right',
    hideBelow: 'sm',
    sortValue: (r) => r.bounce,
    cell: (r) => <span className="tabular text-muted">{r.bounce}%</span>,
  },
  {
    id: 'time',
    header: 'Avg. time',
    align: 'right',
    hideBelow: 'md',
    sortValue: (r) => r.avgTime,
    cell: (r) => <span className="tabular text-muted">{r.avgTime}</span>,
  },
]

export function AnalyticsOverviewPage() {
  const { data, range } = useAnalyticsContext()
  const comparison = RANGE_OPTIONS.find((o) => o.value === range)?.comparison ?? ''
  const top = data?.funnel[0]?.value ?? 1

  return (
    <div className="space-y-5">
      <section aria-label="Key metrics" className="grid gap-4 sm:grid-cols-2 sm:gap-5 xl:grid-cols-4">
        {data
          ? data.kpis.map((kpi) => (
              <StatCard
                key={kpi.id}
                label={kpi.label}
                value={kpi.value}
                delta={kpi.delta}
                comparison={comparison}
                icon={ICONS[kpi.id]}
                trend={kpi.trend}
              />
            ))
          : Array.from({ length: 4 }, (_, i) => <StatCardSkeleton key={i} />)}
      </section>

      <div className="grid gap-5 xl:grid-cols-12">
        <ChartCard className="min-w-0 xl:col-span-8" title="Traffic" description="Visitors over the selected period">
          {data ? (
            <TrendChart
              data={data.traffic}
              series={[{ key: 'visitors', name: 'Visitors', color: 'var(--chart-1)' }]}
              formatValue={formatNumber}
              summary={`Visitors over time: ${data.kpis[0]?.value ?? ''} sessions in total.`}
            />
          ) : (
            <Skeleton className="h-72 w-full" />
          )}
        </ChartCard>

        <ChartCard className="min-w-0 xl:col-span-4" title="Acquisition channels" description="Where visitors come from">
          {data ? (
            <ul className="space-y-4">
              {data.channels.map((channel) => (
                <li key={channel.id}>
                  <div className="mb-1.5 flex items-center justify-between gap-3 text-body">
                    <span>{channel.name}</span>
                    <span className="tabular text-muted">
                      {formatNumber(channel.visitors)} · <span className="font-medium text-foreground">{channel.share}%</span>
                    </span>
                  </div>
                  <Progress value={channel.share} label={`${channel.name} share of visitors`} />
                </li>
              ))}
            </ul>
          ) : (
            <div className="space-y-5">
              {Array.from({ length: 5 }, (_, i) => (
                <Skeleton key={i} className="h-8 w-full" />
              ))}
            </div>
          )}
        </ChartCard>
      </div>

      <div className="grid gap-5 xl:grid-cols-12">
        <ChartCard className="min-w-0 xl:col-span-5" title="Conversion funnel" description="From first visit to paying customer">
          {data ? (
            <ol className="space-y-4">
              {data.funnel.map((step, index) => {
                const previous = data.funnel[index - 1]
                const stepRate = previous ? (step.value / previous.value) * 100 : null
                return (
                  <li key={step.id}>
                    <div className="mb-1.5 flex items-baseline justify-between gap-3 text-body">
                      <span className="font-medium">{step.label}</span>
                      <span className="tabular text-muted">
                        {formatNumber(step.value)}
                        {stepRate !== null && <span className="ml-2 text-caption">{stepRate.toFixed(1)}% of previous</span>}
                      </span>
                    </div>
                    <Progress value={(step.value / top) * 100} label={`${step.label} as a share of visitors`} />
                  </li>
                )
              })}
            </ol>
          ) : (
            <div className="space-y-5">
              {Array.from({ length: 4 }, (_, i) => (
                <Skeleton key={i} className="h-9 w-full" />
              ))}
            </div>
          )}
        </ChartCard>

        <Card padding="none" className="min-w-0 xl:col-span-7">
          <div className="px-5 pt-5 sm:px-6 sm:pt-6">
            <h3 className="text-card font-medium">Top pages</h3>
            <p className="mt-0.5 text-caption text-muted">Most viewed pages in this period</p>
          </div>
          <DataTable
            className="mt-4"
            caption="Top pages"
            columns={PAGE_COLUMNS}
            data={data?.pages ?? []}
            getRowId={(r) => r.path}
            loading={!data}
            pageSize={8}
            initialSort={{ columnId: 'views', direction: 'desc' }}
          />
        </Card>
      </div>
    </div>
  )
}
