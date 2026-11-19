import { Outlet } from 'react-router'
import { BarChart3, ShieldCheck, Users } from 'lucide-react'
import { BrandMark } from '@/components/brand/BrandLogo'
import { ThemeToggle } from '@/components/layout/ThemeToggle'
import { siteConfig } from '@/config/site'

const POINTS = [
  { icon: BarChart3, text: 'Revenue, traffic and growth in one calm view.' },
  { icon: Users, text: 'Projects, customers and team in a single workspace.' },
  { icon: ShieldCheck, text: 'Roles and permissions built in from the start.' },
]

/** Shared frame for Login / Register / Forgot / Reset: brand panel on desktop, form column everywhere. */
export function AuthLayout() {
  return (
    <div className="grid min-h-dvh lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
      <aside className="relative hidden overflow-hidden bg-[image:var(--gradient-brand)] p-12 text-accent-fg lg:flex lg:flex-col lg:justify-between">
        <div className="flex items-center gap-2.5">
          <BrandMark className="size-9 shadow-xs" />
          <span className="text-section font-semibold tracking-tight">{siteConfig.name}</span>
        </div>

        <div className="max-w-md">
          <h2 className="text-title font-semibold">Run your product from one dashboard.</h2>
          <ul className="mt-8 space-y-4">
            {POINTS.map(({ icon: Icon, text }) => (
              <li key={text} className="flex items-start gap-3 text-body text-white/90">
                <span aria-hidden className="grid size-8 shrink-0 place-items-center rounded-lg bg-white/15">
                  <Icon className="size-4" strokeWidth={1.75} />
                </span>
                <span className="pt-1">{text}</span>
              </li>
            ))}
          </ul>
        </div>

        <p className="text-caption text-white/75">{siteConfig.tagline}</p>
      </aside>

      <div className="flex min-w-0 flex-col">
        <header className="flex items-center justify-between px-4 py-4 sm:px-6 lg:justify-end">
          <div className="flex items-center gap-2.5 lg:hidden">
            <BrandMark />
            <span className="text-[1.0625rem] font-semibold tracking-tight">{siteConfig.name}</span>
          </div>
          <ThemeToggle />
        </header>

        <main id="main" tabIndex={-1} className="flex flex-1 items-center justify-center px-4 pb-12 pt-4 outline-none sm:px-6">
          <div className="w-full max-w-sm animate-fade-in">
            <Outlet />
            <p className="mt-8 rounded-control border border-dashed border-border-strong px-3.5 py-2.5 text-caption text-muted">
              Demo template: no real sign-in happens and nothing is stored. Connect your own authentication backend.
            </p>
          </div>
        </main>
      </div>
    </div>
  )
}
