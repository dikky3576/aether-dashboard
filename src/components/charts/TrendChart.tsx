import { useId } from 'react'
import { useReducedMotion } from 'motion/react'
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { SeriesTooltip, type ChartPoint, type ChartSeries } from '@/components/charts/SeriesTooltip'
import { cn } from '@/lib/cn'

const AXIS_TICK = { fill: 'var(--chart-axis)', fontSize: 12 }

interface TrendChartProps {
  data: ChartPoint[]
  series: ChartSeries[]
  formatValue: (value: number) => string
  formatAxis?: (value: number) => string
  /** Screen-reader summary of what the chart shows. */
  summary: string
  className?: string
}

/** Smooth area chart for one or more series on a shared scale. */
export function TrendChart({ data, series, formatValue, formatAxis, summary, className }: TrendChartProps) {
  const baseId = useId().replace(/[^a-zA-Z0-9_-]/g, '')
  const reduceMotion = useReducedMotion()

  return (
    <figure className={cn('h-64 w-full sm:h-72', className)}>
      <figcaption className="sr-only">{summary}</figcaption>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 8, right: 4, left: 0, bottom: 0 }}>
          <defs>
            {series.map((s, i) => (
              <linearGradient key={s.key} id={`${baseId}-${i}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" style={{ stopColor: s.color, stopOpacity: 0.26 }} />
                <stop offset="1" style={{ stopColor: s.color, stopOpacity: 0 }} />
              </linearGradient>
            ))}
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
            width={48}
            tickLine={false}
            axisLine={false}
            tickCount={5}
            domain={[0, 'auto']}
            tickFormatter={(value: number) => (formatAxis ?? formatValue)(value)}
            tick={AXIS_TICK}
          />
          <Tooltip
            content={<SeriesTooltip series={series} formatValue={formatValue} />}
            cursor={{ stroke: 'var(--border-strong)', strokeDasharray: '3 3' }}
          />
          {series.map((s, i) => (
            <Area
              key={s.key}
              type="monotone"
              dataKey={s.key}
              stroke={s.color}
              strokeWidth={2}
              fill={`url(#${baseId}-${i})`}
              activeDot={{ r: 5, fill: s.color, stroke: 'var(--surface-elevated)', strokeWidth: 2 }}
              isAnimationActive={!reduceMotion}
            />
          ))}
        </AreaChart>
      </ResponsiveContainer>
    </figure>
  )
}
