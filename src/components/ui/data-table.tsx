import { useEffect, useMemo, useState, type ReactNode } from 'react'
import { ArrowDown, ArrowUp, ChevronsUpDown } from 'lucide-react'
import { Pagination } from '@/components/ui/pagination'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/cn'

type SortDirection = 'asc' | 'desc'

export interface DataTableColumn<T> {
  id: string
  header: string
  cell: (row: T) => ReactNode
  /** Makes the column sortable. */
  sortValue?: (row: T) => string | number
  align?: 'left' | 'right'
  /** Hide this column below a breakpoint (tables stay readable on phones). */
  hideBelow?: 'sm' | 'md' | 'lg'
  /** Visually hide the header text (e.g. for an actions column). */
  srOnlyHeader?: boolean
  className?: string
}

const HIDE_BELOW = {
  sm: 'hidden sm:table-cell',
  md: 'hidden md:table-cell',
  lg: 'hidden lg:table-cell',
} as const

interface DataTableProps<T> {
  /** Accessible name for the table. */
  caption: string
  columns: DataTableColumn<T>[]
  data: T[]
  getRowId: (row: T) => string
  pageSize?: number
  initialSort?: { columnId: string; direction: SortDirection }
  /** Rendered instead of the table when `data` is empty. */
  empty?: ReactNode
  loading?: boolean
  className?: string
}

function compare(a: string | number, b: string | number): number {
  return typeof a === 'number' && typeof b === 'number' ? a - b : String(a).localeCompare(String(b))
}

export function DataTable<T>({
  caption,
  columns,
  data,
  getRowId,
  pageSize = 8,
  initialSort,
  empty,
  loading = false,
  className,
}: DataTableProps<T>) {
  const [sort, setSort] = useState<{ columnId: string; direction: SortDirection } | null>(initialSort ?? null)
  const [page, setPage] = useState(1)

  // New data (a filter or search changed) always starts on page one.
  useEffect(() => setPage(1), [data])

  const sorted = useMemo(() => {
    const column = sort ? columns.find((c) => c.id === sort.columnId) : undefined
    const getValue = column?.sortValue
    if (!sort || !getValue) return data
    const factor = sort.direction === 'asc' ? 1 : -1
    return [...data].sort((a, b) => factor * compare(getValue(a), getValue(b)))
  }, [data, columns, sort])

  const pageCount = Math.max(1, Math.ceil(sorted.length / pageSize))
  const currentPage = Math.min(page, pageCount)
  const rows = sorted.slice((currentPage - 1) * pageSize, currentPage * pageSize)

  function toggleSort(columnId: string) {
    setPage(1)
    setSort((prev) =>
      prev?.columnId === columnId
        ? { columnId, direction: prev.direction === 'asc' ? 'desc' : 'asc' }
        : { columnId, direction: 'asc' },
    )
  }

  if (!loading && data.length === 0 && empty) return <div className={className}>{empty}</div>

  return (
    <div className={className}>
      <div role="region" aria-label={caption} tabIndex={0} className="overflow-x-auto">
        <table className="w-full min-w-full border-collapse text-left text-body">
          <caption className="sr-only">{caption}</caption>
          <thead>
            <tr className="border-y border-border bg-subtle/60">
              {columns.map((column) => {
                const active = sort?.columnId === column.id
                const ariaSort = active ? (sort?.direction === 'asc' ? 'ascending' : 'descending') : undefined
                const SortIcon = active ? (sort?.direction === 'asc' ? ArrowUp : ArrowDown) : ChevronsUpDown

                return (
                  <th
                    key={column.id}
                    scope="col"
                    aria-sort={column.sortValue ? (ariaSort ?? 'none') : undefined}
                    className={cn(
                      'h-10 whitespace-nowrap px-4 text-caption font-medium text-muted first:pl-5 last:pr-5',
                      column.align === 'right' && 'text-right',
                      column.hideBelow && HIDE_BELOW[column.hideBelow],
                    )}
                  >
                    {column.sortValue ? (
                      <button
                        type="button"
                        onClick={() => toggleSort(column.id)}
                        className={cn(
                          '-mx-1.5 inline-flex h-7 items-center gap-1 rounded-md px-1.5 transition-colors duration-150 hover:text-foreground',
                          active && 'text-foreground',
                          column.align === 'right' && 'flex-row-reverse',
                        )}
                      >
                        {column.header}
                        <SortIcon className={cn('size-3.5', !active && 'opacity-50')} aria-hidden />
                      </button>
                    ) : (
                      <span className={cn(column.srOnlyHeader && 'sr-only')}>{column.header}</span>
                    )}
                  </th>
                )
              })}
            </tr>
          </thead>

          <tbody>
            {loading
              ? Array.from({ length: pageSize }, (_, i) => (
                  <tr key={i} className="border-b border-border last:border-0">
                    {columns.map((column) => (
                      <td
                        key={column.id}
                        className={cn(
                          'h-[60px] px-4 first:pl-5 last:pr-5',
                          column.hideBelow && HIDE_BELOW[column.hideBelow],
                        )}
                      >
                        <Skeleton className={cn('h-4 w-3/4', column.align === 'right' && 'ml-auto w-1/2')} />
                      </td>
                    ))}
                  </tr>
                ))
              : rows.map((row) => (
                  <tr
                    key={getRowId(row)}
                    className="border-b border-border transition-colors duration-150 last:border-0 hover:bg-subtle/60"
                  >
                    {columns.map((column) => (
                      <td
                        key={column.id}
                        className={cn(
                          'h-[60px] px-4 first:pl-5 last:pr-5',
                          column.align === 'right' && 'text-right',
                          column.hideBelow && HIDE_BELOW[column.hideBelow],
                          column.className,
                        )}
                      >
                        {column.cell(row)}
                      </td>
                    ))}
                  </tr>
                ))}
          </tbody>
        </table>
      </div>

      {!loading && sorted.length > 0 && (
        <Pagination
          className="border-t border-border px-5 py-3"
          page={currentPage}
          pageCount={pageCount}
          onPageChange={setPage}
          totalItems={sorted.length}
          pageSize={pageSize}
        />
      )}
    </div>
  )
}
