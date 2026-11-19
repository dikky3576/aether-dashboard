import { Lightbulb } from 'lucide-react'
import { useReducedMotion } from 'motion/react'
import { Pie, PieChart, ResponsiveContainer } from 'recharts'
import { ChartCard } from '@/components/charts/ChartCard'
import { MetricCard } from '@/components/ui/metric-card'
import { Skeleton } from '@/components/ui/skeleton'
import { chartTokens } from '@/lib/design-tokens'
import { formatCurrency } from '@/lib/format'
import type { OverviewData } from '@/types/overview'

interface PerformanceOverviewProps {
  data?: OverviewData
  className?: string
}

export function PerformanceOverview({ data, className }: PerformanceOverviewProps) {
  const reduceMotion = useReducedMotion()
  const colors = chartTokens.series
  const slices = data?.plans.map((plan, index) => ({ ...plan, fill: colors[index] ?? colors[0] }))
  const total = data?.revenueTotals.current ?? 0

  return (
    <ChartCard className={className} title="Performance overview" description="Revenue by plan">
      {data && slices ? (
        <>
          <div className="relative mx-auto size-44" aria-hidden>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={slices}
                  dataKey="amount"
                  nameKey="name"
                  innerRadius="68%"
                  outerRadius="100%"
                  paddingAngle={2}
                  cornerRadius={4}
                  stroke="none"
                  startAngle={90}
                  endAngle={-270}
                  isAnimationActive={!reduceMotion}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="pointer-events-none absolute inset-0 grid place-items-center text-center">
              <div>
                <p className="text-caption text-muted">Total</p>
                <p className="tabular text-section font-semibold">{formatCurrency(total, { compact: true })}</p>
              </div>
            </div>
          </div>

          <ul className="mt-5 space-y-2.5">
            {slices.map((slice) => (
              <li key={slice.id} className="flex items-center gap-3 text-body">
                <span aria-hidden className="size-2.5 shrink-0 rounded-sm" style={{ backgroundColor: slice.fill }} />
                <span className="flex-1 truncate">{slice.name}</span>
                <span className="tabular text-muted">{formatCurrency(slice.amount, { compact: true })}</span>
                <span className="tabular w-10 text-right font-medium">{slice.share}%</span>
              </li>
            ))}
          </ul>

          <div className="mt-5 grid grid-cols-2 gap-3">
            {data.metrics.map((metric) => (
              <MetricCard
                key={metric.id}
                label={metric.label}
                value={metric.value}
                delta={metric.delta}
                invertDelta={metric.invert}
              />
            ))}
          </div>

          <div className="mt-4 flex gap-3 rounded-control bg-accent-soft p-3.5">
            <Lightbulb className="mt-0.5 size-4 shrink-0 text-accent-text" strokeWidth={1.75} aria-hidden />
            <div>
              <p className="text-caption font-medium text-accent-text">Insight</p>
              <p className="mt-0.5 text-caption text-foreground">{data.insight}</p>
            </div>
          </div>
        </>
      ) : (
        <div className="space-y-5">
          <Skeleton className="mx-auto size-44 rounded-full" />
          <div className="space-y-3">
            {Array.from({ length: 4 }, (_, i) => (
              <Skeleton key={i} className="h-4 w-full" />
            ))}
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Skeleton className="h-[76px]" />
            <Skeleton className="h-[76px]" />
          </div>
        </div>
      )}
    </ChartCard>
  )
}
