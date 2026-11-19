import { useNavigate } from 'react-router'
import { Download, FileText, FolderPlus, UserPlus, type LucideIcon } from 'lucide-react'
import { Card, CardDescription, CardTitle } from '@/components/ui'
import { ROUTES } from '@/config/routes'

interface QuickActionsProps {
  onNewProject: () => void
  onInvite: () => void
  onExport: () => void
  className?: string
}

interface ActionTile {
  id: string
  label: string
  hint: string
  icon: LucideIcon
  run: () => void
}

export function QuickActions({ onNewProject, onInvite, onExport, className }: QuickActionsProps) {
  const navigate = useNavigate()

  const actions: ActionTile[] = [
    { id: 'project', label: 'New project', hint: 'Start tracking work', icon: FolderPlus, run: onNewProject },
    { id: 'invite', label: 'Invite teammate', hint: 'Add people to your team', icon: UserPlus, run: onInvite },
    { id: 'invoice', label: 'Create invoice', hint: 'Bill a customer', icon: FileText, run: () => navigate(ROUTES.transactions) },
    { id: 'export', label: 'Export report', hint: 'Download as CSV', icon: Download, run: onExport },
  ]

  return (
    <Card className={className}>
      <CardTitle>Quick actions</CardTitle>
      <CardDescription>Shortcuts for common tasks</CardDescription>

      <div className="mt-5 grid grid-cols-2 gap-3">
        {actions.map(({ id, label, hint, icon: Icon, run }) => (
          <button
            key={id}
            type="button"
            onClick={run}
            className="flex flex-col items-start gap-3 rounded-control border border-border bg-background p-3.5 text-left transition-colors duration-150 hover:border-border-strong hover:bg-subtle"
          >
            <span aria-hidden className="grid size-8 place-items-center rounded-lg bg-accent-soft text-accent-text">
              <Icon className="size-4" strokeWidth={1.75} />
            </span>
            <span>
              <span className="block text-body font-medium leading-tight">{label}</span>
              <span className="mt-0.5 block text-caption text-muted">{hint}</span>
            </span>
          </button>
        ))}
      </div>
    </Card>
  )
}
