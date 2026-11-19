import type { ReactNode } from 'react'
import { Card } from '@/components/ui'
import { cn } from '@/lib/cn'

interface SettingsSectionProps {
  title: string
  description?: string
  children: ReactNode
  /** Right-aligned buttons, e.g. Save. */
  footer?: ReactNode
  className?: string
}

/** One titled card in a settings page: heading, content and an optional action footer. */
export function SettingsSection({ title, description, children, footer, className }: SettingsSectionProps) {
  return (
    <Card padding="none" className={className}>
      <div className="px-5 pt-5 sm:px-6 sm:pt-6">
        <h2 className="text-card font-medium">{title}</h2>
        {description && <p className="mt-0.5 text-caption text-muted">{description}</p>}
      </div>
      <div className="px-5 py-5 sm:px-6">{children}</div>
      {footer && (
        <div className="flex flex-wrap justify-end gap-2 border-t border-border px-5 py-4 sm:px-6">{footer}</div>
      )}
    </Card>
  )
}

interface SettingRowProps {
  label: string
  description?: string
  htmlFor?: string
  children: ReactNode
  className?: string
}

/** A label/description on the left and a control on the right. */
export function SettingRow({ label, description, htmlFor, children, className }: SettingRowProps) {
  return (
    <div className={cn('flex items-center justify-between gap-6 py-3.5 first:pt-0 last:pb-0', className)}>
      <div className="min-w-0">
        <label htmlFor={htmlFor} className="text-body font-medium">
          {label}
        </label>
        {description && <p className="mt-0.5 text-caption text-muted">{description}</p>}
      </div>
      <div className="shrink-0">{children}</div>
    </div>
  )
}
