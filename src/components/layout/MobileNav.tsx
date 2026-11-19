import { useEffect } from 'react'
import { useLocation } from 'react-router'
import * as Dialog from '@radix-ui/react-dialog'
import { X } from 'lucide-react'
import { SidebarContent } from '@/components/layout/SidebarContent'
import { useUiStore } from '@/stores/ui-store'

/** Slide-over navigation for screens below 1024px. Focus is trapped; Esc and outside tap close it. */
export function MobileNav() {
  const open = useUiStore((s) => s.mobileNavOpen)
  const setOpen = useUiStore((s) => s.setMobileNavOpen)
  const { pathname } = useLocation()

  // Any navigation (links, command palette, browser back) closes the drawer.
  useEffect(() => {
    setOpen(false)
  }, [pathname, setOpen])

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/50 data-[state=open]:animate-fade-in data-[state=closed]:animate-fade-out lg:hidden" />
        <Dialog.Content
          aria-describedby={undefined}
          className="fixed inset-y-0 left-0 z-50 w-[min(20rem,88vw)] border-r border-border bg-surface shadow-overlay outline-none data-[state=open]:animate-drawer-in data-[state=closed]:animate-drawer-out lg:hidden"
        >
          <Dialog.Title className="sr-only">Navigation</Dialog.Title>
          <SidebarContent collapsed={false} onNavigate={() => setOpen(false)} />
          <Dialog.Close
            aria-label="Close navigation"
            className="absolute right-3 top-[1.125rem] grid size-8 place-items-center rounded-lg text-muted transition-colors duration-150 hover:bg-subtle hover:text-foreground"
          >
            <X className="size-4" aria-hidden />
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
