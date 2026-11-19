/**
 * Token names for places that cannot use Tailwind classes (Recharts props, inline SVG).
 * Values are CSS variable references, so they follow the active theme automatically —
 * the real values live only in styles/tokens.css.
 */
export const chartTokens = {
  series: ['var(--chart-1)', 'var(--chart-2)', 'var(--chart-3)', 'var(--chart-4)'],
  grid: 'var(--chart-grid)',
  axis: 'var(--chart-axis)',
  surface: 'var(--surface-elevated)',
  border: 'var(--border)',
  foreground: 'var(--foreground)',
  muted: 'var(--muted)',
} as const

/** Motion constants (ms / seconds) shared with Motion for React. */
export const motionTokens = {
  fast: 0.15,
  base: 0.2,
  slow: 0.25,
  ease: [0.22, 1, 0.36, 1] as const,
} as const
