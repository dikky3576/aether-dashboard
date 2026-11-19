import { NavLink } from 'react-router'
import { Tooltip } from '@/components/ui/tooltip'
import { NAV_GROUPS, type NavItem } from '@/config/navigation'
import { cn } from '@/lib/cn'

interface SidebarNavProps {
  collapsed: boolean
  onNavigate?: () => void
}

function SidebarLink({ item, collapsed, onNavigate }: { item: NavItem; collapsed: boolean; onNavigate?: () => void }) {
  const Icon = item.icon

  const link = (
    <NavLink
      to={item.to}
      onClick={onNavigate}
      className={({ isActive }) =>
        cn(
          'relative flex h-9 items-center gap-3 rounded-lg px-2.5 text-body font-medium transition-colors duration-150',
          collapsed && 'justify-center px-0',
          isActive
            ? 'bg-accent-soft text-accent-text before:absolute before:-left-3 before:bottom-2 before:top-2 before:w-[3px] before:rounded-r-full before:bg-accent'
            : 'text-muted hover:bg-subtle hover:text-foreground',
        )
      }
    >
      <Icon className="size-[18px] shrink-0" strokeWidth={1.75} aria-hidden />
      <span className={cn('truncate', collapsed && 'sr-only')}>{item.label}</span>
    </NavLink>
  )

  return collapsed ? (
    <Tooltip content={item.label} side="right">
      {link}
    </Tooltip>
  ) : (
    link
  )
}

export function SidebarNav({ collapsed, onNavigate }: SidebarNavProps) {
  return (
    <nav aria-label="Primary" className="min-h-0 flex-1 overflow-y-auto px-3 py-4">
      {NAV_GROUPS.map((group, index) => (
        <div key={group.label} className={cn(index > 0 && (collapsed ? 'mt-3' : 'mt-6'))}>
          {collapsed ? (
            index > 0 && <div aria-hidden className="mx-2 mb-3 border-t border-border" />
          ) : (
            <h2 className="mb-1.5 px-2.5 text-caption font-medium uppercase tracking-[0.08em] text-muted">
              {group.label}
            </h2>
          )}
          <ul className="space-y-0.5">
            {group.items.map((item) => (
              <li key={item.to}>
                <SidebarLink item={item} collapsed={collapsed} onNavigate={onNavigate} />
              </li>
            ))}
          </ul>
        </div>
      ))}
    </nav>
  )
}
