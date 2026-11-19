import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/cn'
import { Button } from '@/components/ui/button'

type PageItem = number | 'ellipsis-start' | 'ellipsis-end'

function range(from: number, to: number): number[] {
  return Array.from({ length: to - from + 1 }, (_, i) => from + i)
}

/** Windowed page list: always shows first/last page and the neighbours of the current page. */
export function getPageItems(page: number, pageCount: number): PageItem[] {
  if (pageCount <= 7) return range(1, pageCount)
  if (page <= 4) return [...range(1, 5), 'ellipsis-end', pageCount]
  if (page >= pageCount - 3) return [1, 'ellipsis-start', ...range(pageCount - 4, pageCount)]
  return [1, 'ellipsis-start', page - 1, page, page + 1, 'ellipsis-end', pageCount]
}

interface PaginationProps {
  page: number
  pageCount: number
  onPageChange: (page: number) => void
  totalItems?: number
  pageSize?: number
  className?: string
}

export function Pagination({ page, pageCount, onPageChange, totalItems, pageSize, className }: PaginationProps) {
  if (pageCount < 1) return null
  const first = totalItems && pageSize ? (page - 1) * pageSize + 1 : null
  const last = totalItems && pageSize ? Math.min(page * pageSize, totalItems) : null

  return (
    <nav
      aria-label="Pagination"
      className={cn('flex flex-wrap items-center justify-between gap-3', className)}
    >
      <p className="tabular text-caption text-muted" aria-live="polite">
        {first !== null && last !== null ? (
          <>
            Showing <span className="font-medium text-foreground">{first}–{last}</span> of{' '}
            <span className="font-medium text-foreground">{totalItems}</span>
          </>
        ) : (
          <>
            Page <span className="font-medium text-foreground">{page}</span> of {pageCount}
          </>
        )}
      </p>

      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="icon-sm"
          aria-label="Previous page"
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
        >
          <ChevronLeft aria-hidden />
        </Button>

        <ul className="hidden items-center gap-1 sm:flex">
          {getPageItems(page, pageCount).map((item) =>
            typeof item === 'number' ? (
              <li key={item}>
                <button
                  type="button"
                  aria-label={`Page ${item}`}
                  aria-current={item === page ? 'page' : undefined}
                  onClick={() => onPageChange(item)}
                  className={cn(
                    'tabular grid h-8 min-w-8 place-items-center rounded-lg px-2 text-body font-medium transition-colors duration-150',
                    item === page
                      ? 'bg-accent-soft text-accent-text'
                      : 'text-muted hover:bg-subtle hover:text-foreground',
                  )}
                >
                  {item}
                </button>
              </li>
            ) : (
              <li key={item} aria-hidden className="px-1 text-muted">
                …
              </li>
            ),
          )}
        </ul>

        <Button
          variant="ghost"
          size="icon-sm"
          aria-label="Next page"
          disabled={page >= pageCount}
          onClick={() => onPageChange(page + 1)}
        >
          <ChevronRight aria-hidden />
        </Button>
      </div>
    </nav>
  )
}
