import { useReducedMotion } from 'motion/react'
import { Bar, BarChart, CartesianGrid, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { SeriesTooltip, type ChartPoint, type ChartSeries } from '@/components/charts/SeriesTooltip'
import { cn } from '@/lib/cn'

const AXIS_TICK = { fill: 'var(--chart-axis)', fontSize: 12 }

interface StackedBarChartProps {
  data: ChartPoint[]
  series: ChartSeries[]
  formatValue: (value: number) => string
  formatAxis?: (value: number) => string
  summary: string
  className?: string
}

/** Stacked columns; negative values stack below the zero line (e.g. churn). */
export function StackedBarChart({ data, series, formatValue, formatAxis, summary, className }: StackedBarChartProps) {
  const reduceMotion = useReducedMotion()

  return (
    <figure className={cn('h-64 w-full sm:h-72', className)}>
      <figcaption className="sr-only">{summary}</figcaption>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 8, right: 4, left: 0, bottom: 0 }} stackOffset="sign">
          <CartesianGrid vertical={false} stroke="var(--chart-grid)" strokeDasharray="3 4" />
          <XAxis
            dataKey="label"
            tickLine={false}
            axisLine={false}
            tickMargin={10}
            minTickGap={20}
            interval="preserveStartEnd"
            tick={AXIS_TICK}
          />
          <YAxis
            width={52}
            tickLine={false}
            axisLine={false}
            tickCount={5}
            tickFormatter={(value: number) => (formatAxis ?? formatValue)(value)}
            tick={AXIS_TICK}
          />
          <ReferenceLine y={0} stroke="var(--border-strong)" />
          <Tooltip
            content={<SeriesTooltip series={series} formatValue={formatValue} />}
            cursor={{ fill: 'var(--subtle)' }}
          />
          {series.map((s) => (
            <Bar key={s.key} dataKey={s.key} stackId="stack" fill={s.color} maxBarSize={28} isAnimationActive={!reduceMotion} />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </figure>
  )
}
