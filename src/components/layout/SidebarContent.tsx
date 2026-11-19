import { ChevronsUpDown } from 'lucide-react'
import { BrandLogo } from '@/components/brand/BrandLogo'
import { Avatar } from '@/components/ui/avatar'
import { SidebarNav } from '@/components/layout/SidebarNav'
import { UserMenu } from '@/components/layout/UserMenu'
import { WorkspaceSwitcher } from '@/components/layout/WorkspaceSwitcher'
import { currentUser } from '@/data/user'
import { cn } from '@/lib/cn'

interface SidebarContentProps {
  collapsed: boolean
  /** Called after a navigation click (the mobile drawer uses it to close itself). */
  onNavigate?: () => void
}

/** Shared by the desktop sidebar and the mobile drawer so they can never drift apart. */
export function SidebarContent({ collapsed, onNavigate }: SidebarContentProps) {
  return (
    <div className="flex h-full flex-col">
      {/* Logo row lines up with the header bar and its bottom border. */}
      <div
        className={cn(
          'flex h-(--header-height) shrink-0 items-center border-b border-border',
          collapsed ? 'justify-center' : 'px-5',
        )}
      >
        <BrandLogo collapsed={collapsed} onClick={onNavigate} />
      </div>

      <div className="shrink-0 px-3 pt-4">
        <WorkspaceSwitcher collapsed={collapsed} />
      </div>

      <SidebarNav collapsed={collapsed} onNavigate={onNavigate} />

      <div className="shrink-0 border-t border-border p-3">
        <UserMenu side={collapsed ? 'right' : 'top'} align={collapsed ? 'end' : 'start'}>
          <button
            type="button"
            aria-label="Account menu"
            className={cn(
              'flex w-full items-center gap-3 rounded-control p-2 text-left transition-colors duration-150 hover:bg-subtle',
              collapsed && 'justify-center',
            )}
          >
            <Avatar name={currentUser.name} size="sm" />
            {!collapsed && (
              <>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-body font-medium leading-tight">{currentUser.name}</span>
                  <span className="block truncate text-caption text-muted">{currentUser.role}</span>
                </span>
                <ChevronsUpDown className="size-4 shrink-0 text-muted" aria-hidden />
              </>
            )}
          </button>
        </UserMenu>
      </div>
    </div>
  )
}
