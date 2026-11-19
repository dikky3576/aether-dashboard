import { Skeleton } from '@/components/ui'

/** Placeholder with the same rhythm as a module page (header, stat row, content card). */
export function PageLoading() {
  return (
    <div role="status" aria-live="polite" aria-busy="true" className="space-y-6">
      <span className="sr-only">Loading…</span>
      <div className="space-y-2">
        <Skeleton className="h-8 w-56" />
        <Skeleton className="h-4 w-80 max-w-full" />
      </div>
      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }, (_, i) => (
          <Skeleton key={i} className="h-36 w-full rounded-card" />
        ))}
      </div>
      <Skeleton className="h-80 w-full rounded-card" />
    </div>
  )
}

/** Full-viewport variant used while the very first route loads. */
export function AppLoading() {
  return (
    <div className="grid min-h-dvh place-items-center px-6">
      <div className="w-full max-w-5xl">
        <PageLoading />
      </div>
    </div>
  )
}
