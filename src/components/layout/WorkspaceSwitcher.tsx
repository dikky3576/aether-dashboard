import { toast } from 'sonner'
import { Check, ChevronsUpDown, Plus } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { workspaces } from '@/data/user'
import { cn } from '@/lib/cn'
import { useUiStore } from '@/stores/ui-store'

function WorkspaceMark({ name }: { name: string }) {
  return (
    <span
      aria-hidden
      className="grid size-8 shrink-0 place-items-center rounded-lg bg-[image:var(--gradient-brand-soft)] text-caption font-semibold text-accent-fg"
    >
      {name.charAt(0).toUpperCase()}
    </span>
  )
}

export function WorkspaceSwitcher({ collapsed }: { collapsed: boolean }) {
  const workspaceId = useUiStore((s) => s.workspaceId)
  const setWorkspaceId = useUiStore((s) => s.setWorkspaceId)
  const active = workspaces.find((w) => w.id === workspaceId) ?? workspaces[0]

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          aria-label={`Workspace: ${active.name}. Switch workspace`}
          className={cn(
            'flex w-full items-center gap-3 rounded-control border border-border bg-background text-left transition-colors duration-150 hover:border-border-strong',
            collapsed ? 'justify-center p-1.5' : 'p-2',
          )}
        >
          <WorkspaceMark name={active.name} />
          {!collapsed && (
            <>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-body font-medium leading-tight">{active.name}</span>
                <span className="block truncate text-caption text-muted">{active.plan}</span>
              </span>
              <ChevronsUpDown className="size-4 shrink-0 text-muted" aria-hidden />
            </>
          )}
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent side={collapsed ? 'right' : 'bottom'} align="start" className="w-64">
        <DropdownMenuLabel>Workspaces</DropdownMenuLabel>
        {workspaces.map((w) => (
          <DropdownMenuItem
            key={w.id}
            className="h-11 gap-3"
            onSelect={() => {
              setWorkspaceId(w.id)
              toast.success(`Switched to ${w.name}`)
            }}
          >
            <WorkspaceMark name={w.name} />
            <span className="min-w-0 flex-1">
              <span className="block truncate font-medium leading-tight">{w.name}</span>
              <span className="block truncate text-caption text-muted">{w.plan}</span>
            </span>
            {w.id === active.id && <Check aria-label="Current workspace" />}
          </DropdownMenuItem>
        ))}
        <DropdownMenuSeparator />
        <DropdownMenuItem onSelect={() => toast.info('Demo mode — creating workspaces needs a backend.')}>
          <Plus aria-hidden /> Create workspace
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
