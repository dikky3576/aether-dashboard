import type { ReactNode } from 'react'
import { Link } from 'react-router'
import { ArrowLeft, type LucideIcon } from 'lucide-react'
import { BrandMark } from '@/components/brand/BrandLogo'
import { ThemeToggle } from '@/components/layout/ThemeToggle'
import { Button } from '@/components/ui'
import { ROUTES } from '@/config/routes'
import { siteConfig } from '@/config/site'
import { useDocumentTitle } from '@/hooks/use-document-title'

interface ErrorPageProps {
  /** e.g. "404". */
  code: string
  title: string
  description: string
  icon: LucideIcon
  /** Replaces the default "Back to overview" action. */
  actions?: ReactNode
  /** Extra technical detail (kept small, e.g. an error message). */
  detail?: string
}

/** Standalone status page used for 403, 404, 500 and unexpected route errors. */
export function ErrorPage({ code, title, description, icon: Icon, actions, detail }: ErrorPageProps) {
  useDocumentTitle(title)

  return (
    <div className="flex min-h-dvh flex-col">
      <header className="flex items-center justify-between px-4 py-4 sm:px-6">
        <Link to={ROUTES.overview} className="flex items-center gap-2.5 rounded-lg" aria-label={`${siteConfig.name} — go to overview`}>
          <BrandMark />
          <span className="text-[1.0625rem] font-semibold tracking-tight">{siteConfig.name}</span>
        </Link>
        <ThemeToggle />
      </header>

      <main id="main" tabIndex={-1} className="grid flex-1 place-items-center px-6 pb-16 outline-none">
        <div className="max-w-md animate-fade-in text-center">
          <span className="mx-auto grid size-14 place-items-center rounded-2xl bg-accent-soft text-accent-text">
            <Icon className="size-7" strokeWidth={1.75} aria-hidden />
          </span>
          <p className="tabular mt-6 text-caption font-semibold tracking-[0.2em] text-accent-text">{code}</p>
          <h1 className="mt-2 text-title font-semibold">{title}</h1>
          <p className="mt-2 text-body text-muted">{description}</p>
          {detail && (
            <p className="mt-4 break-words rounded-control bg-subtle px-3 py-2 font-mono text-caption text-muted">{detail}</p>
          )}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            {actions ?? (
              <Button asChild variant="primary" size="lg">
                <Link to={ROUTES.overview}>
                  <ArrowLeft aria-hidden /> Back to overview
                </Link>
              </Button>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
