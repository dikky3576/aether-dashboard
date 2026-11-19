import { Badge, type BadgeVariant } from '@/components/ui'
import { PROJECT_STATUS_LABEL, type ProjectStatus, type TaskPriority } from '@/data/projects'

const STATUS_VARIANT: Record<ProjectStatus, BadgeVariant> = {
  planning: 'neutral',
  'on-track': 'success',
  'at-risk': 'warning',
  completed: 'info',
}

export function ProjectStatusBadge({ status }: { status: ProjectStatus }) {
  return (
    <Badge variant={STATUS_VARIANT[status]} dot>
      {PROJECT_STATUS_LABEL[status]}
    </Badge>
  )
}

const PRIORITY: Record<TaskPriority, { label: string; variant: BadgeVariant }> = {
  high: { label: 'High', variant: 'danger' },
  medium: { label: 'Medium', variant: 'warning' },
  low: { label: 'Low', variant: 'neutral' },
}

export function PriorityBadge({ priority }: { priority: TaskPriority }) {
  const { label, variant } = PRIORITY[priority]
  return <Badge variant={variant}>{label}</Badge>
}

const shortDate = new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' })
const fullDate = new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' })

export const formatShortDate = (value: string) => shortDate.format(new Date(value))
export const formatFullDate = (value: string) => fullDate.format(new Date(value))
