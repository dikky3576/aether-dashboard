import { SidebarContent } from '@/components/layout/SidebarContent'
import { cn } from '@/lib/cn'
import { useUiStore } from '@/stores/ui-store'

/** Desktop sidebar (≥1024px). Below that, <MobileNav /> renders the same content as a drawer. */
export function AppSidebar() {
  const collapsed = useUiStore((s) => s.sidebarCollapsed)

  return (
    <aside
      aria-label="Sidebar"
      className={cn(
        'fixed inset-y-0 left-0 z-40 hidden border-r border-border bg-surface',
        'transition-[width] duration-200 ease-out lg:block',
        collapsed ? 'w-(--sidebar-width-collapsed)' : 'w-(--sidebar-width)',
      )}
    >
      <SidebarContent collapsed={collapsed} />
    </aside>
  )
}
