import { Badge, type BadgeVariant } from '@/components/ui/badge'

export type Status =
  | 'completed'
  | 'paid'
  | 'active'
  | 'pending'
  | 'draft'
  | 'refunded'
  | 'failed'
  | 'overdue'
  | 'inactive'

const STATUS_MAP: Record<Status, { label: string; variant: BadgeVariant }> = {
  completed: { label: 'Completed', variant: 'success' },
  paid: { label: 'Paid', variant: 'success' },
  active: { label: 'Active', variant: 'success' },
  pending: { label: 'Pending', variant: 'warning' },
  draft: { label: 'Draft', variant: 'neutral' },
  refunded: { label: 'Refunded', variant: 'info' },
  failed: { label: 'Failed', variant: 'danger' },
  overdue: { label: 'Overdue', variant: 'danger' },
  inactive: { label: 'Inactive', variant: 'neutral' },
}

/** One source of truth for how a status looks across tables, cards and detail pages. */
export function StatusBadge({ status, className }: { status: Status; className?: string }) {
  const { label, variant } = STATUS_MAP[status]
  return (
    <Badge variant={variant} dot className={className}>
      {label}
    </Badge>
  )
}
