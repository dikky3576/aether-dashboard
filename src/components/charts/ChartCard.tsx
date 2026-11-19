import type { ReactNode } from 'react'
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/cn'

interface ChartCardProps {
  title: string
  description?: string
  /** Controls aligned to the top-right (range tabs, menus…). */
  actions?: ReactNode
  children: ReactNode
  className?: string
}

/** Standard frame for every analytics panel: title, subtitle, controls, content. */
export function ChartCard({ title, description, actions, children, className }: ChartCardProps) {
  return (
    <Card className={cn('flex flex-col', className)}>
      <CardHeader className="flex-wrap">
        <div className="min-w-0">
          <CardTitle>{title}</CardTitle>
          {description && <CardDescription>{description}</CardDescription>}
        </div>
        {actions}
      </CardHeader>
      <div className="mt-5 flex-1">{children}</div>
    </Card>
  )
}
