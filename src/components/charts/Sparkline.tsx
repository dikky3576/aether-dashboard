import { useId } from 'react'
import { cn } from '@/lib/cn'

interface SparklineProps {
  values: number[]
  className?: string
}

const W = 120
const H = 36
const PAD = 3

/** Tiny decorative trend line. Takes its colour from `currentColor`. */
export function Sparkline({ values, className }: SparklineProps) {
  const gradientId = useId().replace(/[^a-zA-Z0-9_-]/g, '')
  if (values.length < 2) return null

  const min = Math.min(...values)
  const max = Math.max(...values)
  const span = max - min || 1
  const step = (W - PAD * 2) / (values.length - 1)
  const points = values.map((v, i) => ({
    x: PAD + i * step,
    y: PAD + (1 - (v - min) / span) * (H - PAD * 2),
  }))

  // Smooth the line with quadratic curves through segment midpoints.
  let d = `M ${points[0]?.x ?? 0} ${points[0]?.y ?? 0}`
  for (let i = 1; i < points.length - 1; i++) {
    const p = points[i]
    const n = points[i + 1]
    if (!p || !n) continue
    d += ` Q ${p.x} ${p.y} ${(p.x + n.x) / 2} ${(p.y + n.y) / 2}`
  }
  const end = points[points.length - 1]
  if (end) d += ` L ${end.x} ${end.y}`
  const area = `${d} L ${end?.x ?? W} ${H} L ${PAD} ${H} Z`

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      preserveAspectRatio="none"
      aria-hidden
      className={cn('h-9 w-full overflow-visible', className)}
    >
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" style={{ stopColor: 'currentColor', stopOpacity: 0.22 }} />
          <stop offset="1" style={{ stopColor: 'currentColor', stopOpacity: 0 }} />
        </linearGradient>
      </defs>
      <path d={area} fill={`url(#${gradientId})`} />
      <path
        d={d}
        fill="none"
        stroke="currentColor"
        strokeWidth={1.75}
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  )
}
