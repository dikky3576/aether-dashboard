import type { ReactNode } from 'react'

/** Visual shell shared by every chart tooltip, so they match the menu and popover surfaces. */
export function ChartTooltipShell({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="min-w-44 rounded-control border border-border bg-elevated p-3 text-caption shadow-overlay">
      <p className="mb-2 font-medium text-foreground">{title}</p>
      <div className="space-y-1.5">{children}</div>
    </div>
  )
}

export function ChartTooltipRow({
  label,
  value,
  swatch,
}: {
  label: string
  value: string
  swatch: ReactNode
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="flex items-center gap-2 text-muted">
        {swatch}
        {label}
      </span>
      <span className="tabular font-medium text-foreground">{value}</span>
    </div>
  )
}
