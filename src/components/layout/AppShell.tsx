import { useEffect } from 'react'
import { Outlet, useLocation, useNavigation } from 'react-router'
import { AppHeader } from '@/components/layout/AppHeader'
import { AppSidebar } from '@/components/layout/AppSidebar'
import { CommandPalette } from '@/components/layout/CommandPalette'
import { MobileNav } from '@/components/layout/MobileNav'
import { siteConfig } from '@/config/site'
import { useCommandShortcut } from '@/hooks/use-command-shortcut'
import { useRouteMeta } from '@/hooks/use-route-meta'
import { cn } from '@/lib/cn'
import { useUiStore } from '@/stores/ui-store'

/**
 * Application frame: fixed sidebar (≥1024px) or drawer (<1024px), sticky header,
 * and a content column capped at 1600px with consistent gutters.
 */
export function AppShell() {
  const collapsed = useUiStore((s) => s.sidebarCollapsed)
  const setMobileNavOpen = useUiStore((s) => s.setMobileNavOpen)
  const { pathname } = useLocation()
  const navigating = useNavigation().state !== 'idle'
  const { title } = useRouteMeta()

  useCommandShortcut()

  useEffect(() => {
    document.title = `${title} · ${siteConfig.name}`
  }, [title])

  // Resizing up to desktop while the drawer is open would leave an orphaned overlay.
  useEffect(() => {
    const media = window.matchMedia('(min-width: 1024px)')
    const onChange = (event: MediaQueryListEvent) => {
      if (event.matches) setMobileNavOpen(false)
    }
    media.addEventListener('change', onChange)
    return () => media.removeEventListener('change', onChange)
  }, [setMobileNavOpen])

  return (
    <div className="min-h-dvh">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-control focus:bg-surface focus:px-4 focus:py-2 focus:text-body focus:font-medium focus:shadow-overlay"
      >
        Skip to content
      </a>

      {/* Slim progress line while a lazy page is loading. */}
      {navigating && (
        <div role="progressbar" aria-label="Loading page" className="fixed inset-x-0 top-0 z-[70] h-0.5 animate-pulse bg-accent" />
      )}

      <AppSidebar />
      <MobileNav />

      <div
        className={cn(
          'flex min-h-dvh min-w-0 flex-col transition-[padding-left] duration-200 ease-out',
          collapsed ? 'lg:pl-(--sidebar-width-collapsed)' : 'lg:pl-(--sidebar-width)',
        )}
      >
        <AppHeader />
        <main id="main" tabIndex={-1} className="min-w-0 flex-1 outline-none">
          <div
            key={pathname}
            className="mx-auto w-full max-w-(--content-max) animate-fade-in px-4 py-6 sm:px-6 sm:py-8 lg:px-8"
          >
            <Outlet />
          </div>
        </main>
      </div>

      <CommandPalette />
    </div>
  )
}
