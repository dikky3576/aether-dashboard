import { Menu, PanelLeftClose, PanelLeftOpen, Search } from 'lucide-react'
import { Avatar } from '@/components/ui/avatar'
import { Breadcrumb } from '@/components/ui/breadcrumb'
import { Button } from '@/components/ui/button'
import { Tooltip } from '@/components/ui/tooltip'
import { NotificationsMenu } from '@/components/layout/NotificationsMenu'
import { ThemeToggle } from '@/components/layout/ThemeToggle'
import { UserMenu } from '@/components/layout/UserMenu'
import { currentUser } from '@/data/user'
import { useRouteMeta } from '@/hooks/use-route-meta'
import { useUiStore } from '@/stores/ui-store'

const isMac = typeof navigator !== 'undefined' && /Mac|iPhone|iPad/.test(navigator.platform)
const SHORTCUT_LABEL = isMac ? '⌘K' : 'Ctrl K'

export function AppHeader() {
  const { title, breadcrumbs } = useRouteMeta()
  const collapsed = useUiStore((s) => s.sidebarCollapsed)
  const toggleSidebar = useUiStore((s) => s.toggleSidebar)
  const setMobileNavOpen = useUiStore((s) => s.setMobileNavOpen)
  const setCommandOpen = useUiStore((s) => s.setCommandOpen)

  const sidebarLabel = collapsed ? 'Expand sidebar' : 'Collapse sidebar'

  return (
    <header className="sticky top-0 z-30 flex h-(--header-height) shrink-0 items-center gap-2 border-b border-border bg-background px-3 sm:px-6 lg:px-8">
      <Button
        variant="ghost"
        size="icon"
        className="lg:hidden"
        aria-label="Open navigation"
        onClick={() => setMobileNavOpen(true)}
      >
        <Menu aria-hidden />
      </Button>

      <Tooltip content={sidebarLabel}>
        <Button
          variant="ghost"
          size="icon"
          className="-ml-2 hidden lg:inline-flex"
          aria-label={sidebarLabel}
          onClick={toggleSidebar}
        >
          {collapsed ? <PanelLeftOpen aria-hidden /> : <PanelLeftClose aria-hidden />}
        </Button>
      </Tooltip>

      <div className="min-w-0 flex-1">
        <Breadcrumb items={breadcrumbs} className="hidden md:block" />
        <p className="truncate text-card font-semibold md:hidden">{title}</p>
      </div>

      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={() => setCommandOpen(true)}
          aria-label="Search or run a command"
          aria-keyshortcuts="Control+K Meta+K"
          className="mr-1 hidden h-10 w-56 items-center gap-2 rounded-control border border-border bg-surface px-3 text-body text-muted shadow-xs transition-colors duration-150 hover:border-border-strong md:flex lg:w-72"
        >
          <Search className="size-4" aria-hidden />
          <span className="flex-1 text-left">Search…</span>
          <kbd className="rounded-md border border-border bg-subtle px-1.5 py-0.5 font-mono text-caption">
            {SHORTCUT_LABEL}
          </kbd>
        </button>
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          aria-label="Search or run a command"
          onClick={() => setCommandOpen(true)}
        >
          <Search aria-hidden />
        </Button>

        <NotificationsMenu />
        <ThemeToggle />

        <UserMenu>
          <button
            type="button"
            aria-label="Account menu"
            className="ml-1 grid size-10 place-items-center rounded-full"
          >
            <Avatar name={currentUser.name} size="sm" />
          </button>
        </UserMenu>
      </div>
    </header>
  )
}
