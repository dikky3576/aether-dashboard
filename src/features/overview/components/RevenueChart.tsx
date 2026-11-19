import { useId } from 'react'
import { useReducedMotion } from 'motion/react'
import { Area, CartesianGrid, ComposedChart, Line, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { ChartCard } from '@/components/charts/ChartCard'
import { ChartTooltipRow, ChartTooltipShell } from '@/components/charts/ChartTooltip'
import { Delta } from '@/components/ui/delta'
import { Skeleton } from '@/components/ui/skeleton'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { RANGE_OPTIONS, isRangeKey } from '@/data/overview'
import { cn } from '@/lib/cn'
import { formatCurrency } from '@/lib/format'
import type { OverviewData, RangeKey, RevenuePoint } from '@/types/overview'

const AXIS_TICK = { fill: 'var(--chart-axis)', fontSize: 12 }

interface RevenueTooltipProps {
  active?: boolean
  payload?: ReadonlyArray<{ payload?: RevenuePoint }>
}

function RevenueTooltip({ active, payload }: RevenueTooltipProps) {
  const point = payload?.[0]?.payload
  if (!active || !point) return null
  const delta = (point.current / point.previous - 1) * 100

  return (
    <ChartTooltipShell title={point.fullLabel}>
      <ChartTooltipRow
        label="This period"
        value={formatCurrency(point.current)}
        swatch={<span aria-hidden className="size-2 rounded-full bg-chart-1" />}
      />
      <ChartTooltipRow
        label={point.previousLabel}
        value={formatCurrency(point.previous)}
        swatch={<span aria-hidden className="h-0 w-2 border-t-2 border-dashed border-muted" />}
      />
      <div className="flex items-center justify-between gap-4 border-t border-border pt-2">
        <span className="text-muted">Change</span>
        <Delta value={delta} />
      </div>
    </ChartTooltipShell>
  )
}

interface RevenueChartProps {
  data?: OverviewData
  range: RangeKey
  onRangeChange: (range: RangeKey) => void
  className?: string
}

export function RevenueChart({ data, range, onRangeChange, className }: RevenueChartProps) {
  const gradientId = useId().replace(/[^a-zA-Z0-9_-]/g, '')
  const reduceMotion = useReducedMotion()
  const totals = data?.revenueTotals

  return (
    <ChartCard
      className={className}
      title="Revenue analytics"
      description="Revenue compared with the previous period"
      actions={
        <Tabs
          value={range}
          onValueChange={(next) => {
            if (isRangeKey(next)) onRangeChange(next)
          }}
        >
          <TabsList aria-label="Time range">
            {RANGE_OPTIONS.map((option) => (
              <TabsTrigger key={option.value} value={option.value} aria-label={option.label}>
                {option.short}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      }
    >
      <div className="flex flex-wrap items-end justify-between gap-x-8 gap-y-3">
        {totals ? (
          <div>
            <p className="text-caption text-muted">Total revenue</p>
            <div className="mt-1 flex items-center gap-2.5">
              <p className="tabular text-kpi font-semibold">{formatCurrency(totals.current)}</p>
              <Delta value={totals.delta} />
            </div>
            <p className="tabular mt-1 text-caption text-muted">
              {formatCurrency(totals.previous)} in the previous period
            </p>
          </div>
        ) : (
          <div>
            <Skeleton className="h-4 w-24" />
            <Skeleton className="mt-2 h-9 w-48" />
            <Skeleton className="mt-2 h-3 w-40" />
          </div>
        )}

        <ul className="flex items-center gap-4 text-caption text-muted" aria-label="Chart legend">
          <li className="flex items-center gap-2">
            <span aria-hidden className="h-0.5 w-4 rounded-full bg-chart-1" /> This period
          </li>
          <li className="flex items-center gap-2">
            <span aria-hidden className="h-0 w-4 border-t-2 border-dashed border-muted" /> Previous period
          </li>
        </ul>
      </div>

      <figure className={cn('mt-6 h-60 w-full sm:h-72 lg:h-80')}>
        {data && totals ? (
          <>
            <figcaption className="sr-only">
              Revenue was {formatCurrency(totals.current)}, {totals.delta >= 0 ? 'up' : 'down'}{' '}
              {Math.abs(totals.delta).toFixed(1)}% from the previous period. Hover or focus the chart for daily values.
            </figcaption>
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={data.revenue} margin={{ top: 8, right: 4, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0" style={{ stopColor: 'var(--chart-1)', stopOpacity: 0.28 }} />
                    <stop offset="1" style={{ stopColor: 'var(--chart-1)', stopOpacity: 0 }} />
                  </linearGradient>
                </defs>
                <CartesianGrid vertical={false} stroke="var(--chart-grid)" strokeDasharray="3 4" />
                <XAxis
                  dataKey="label"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={10}
                  minTickGap={28}
                  interval="preserveStartEnd"
                  tick={AXIS_TICK}
                />
                <YAxis
                  width={52}
                  tickLine={false}
                  axisLine={false}
                  tickCount={5}
                  domain={[0, 'auto']}
                  tickFormatter={(value: number) => formatCurrency(value, { compact: true })}
                  tick={AXIS_TICK}
                />
                <Tooltip
                  content={<RevenueTooltip />}
                  cursor={{ stroke: 'var(--border-strong)', strokeDasharray: '3 3' }}
                />
                <Line
                  type="monotone"
                  dataKey="previous"
                  stroke="var(--chart-axis)"
                  strokeWidth={1.5}
                  strokeDasharray="5 5"
                  dot={false}
                  activeDot={false}
                  isAnimationActive={!reduceMotion}
                />
                <Area
                  type="monotone"
                  dataKey="current"
                  stroke="var(--chart-1)"
                  strokeWidth={2}
                  fill={`url(#${gradientId})`}
                  activeDot={{ r: 5, fill: 'var(--chart-1)', stroke: 'var(--surface-elevated)', strokeWidth: 2 }}
                  isAnimationActive={!reduceMotion}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </>
        ) : (
          <Skeleton className="h-full w-full" />
        )}
      </figure>
    </ChartCard>
  )
}
