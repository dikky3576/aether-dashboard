import { ChartTooltipRow, ChartTooltipShell } from '@/components/charts/ChartTooltip'

export interface ChartSeries {
  key: string
  name: string
  /** CSS colour or var(), e.g. "var(--chart-1)". */
  color: string
}

export interface ChartPoint {
  label: string
  fullLabel: string
  [key: string]: string | number
}

interface SeriesTooltipProps {
  active?: boolean
  payload?: ReadonlyArray<{ payload?: ChartPoint }>
  series: ChartSeries[]
  formatValue: (value: number) => string
}

/** Tooltip for any multi-series chart. Pass as `content={<SeriesTooltip series={…} formatValue={…} />}`. */
export function SeriesTooltip({ active, payload, series, formatValue }: SeriesTooltipProps) {
  const point = payload?.[0]?.payload
  if (!active || !point) return null

  return (
    <ChartTooltipShell title={point.fullLabel}>
      {series.map((s) => (
        <ChartTooltipRow
          key={s.key}
          label={s.name}
          value={formatValue(Number(point[s.key] ?? 0))}
          swatch={<span aria-hidden className="size-2 rounded-full" style={{ backgroundColor: s.color }} />}
        />
      ))}
    </ChartTooltipShell>
  )
}
