import { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router'
import { toast } from 'sonner'
import { ArrowRight, Copy, MoreHorizontal, SearchX, Undo2, User } from 'lucide-react'
import {
  Avatar,
  Button,
  Card,
  CardDescription,
  CardTitle,
  ConfirmDialog,
  DataTable,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  EmptyState,
  FilterDropdown,
  SearchInput,
  StatusBadge,
  type DataTableColumn,
} from '@/components/ui'
import { ROUTES } from '@/config/routes'
import { formatCurrency, formatDateTime } from '@/lib/format'
import type { Transaction } from '@/types/overview'

const STATUS_OPTIONS = [
  { value: 'all', label: 'All statuses' },
  { value: 'completed', label: 'Completed' },
  { value: 'pending', label: 'Pending' },
  { value: 'failed', label: 'Failed' },
  { value: 'refunded', label: 'Refunded' },
]

function RowActions({ transaction, onRefund }: { transaction: Transaction; onRefund: (t: Transaction) => void }) {
  const navigate = useNavigate()
  const refundable = transaction.status === 'completed' || transaction.status === 'paid'

  function copyId() {
    navigator.clipboard
      .writeText(transaction.id)
      .then(() => toast.success('Transaction ID copied'))
      .catch(() => toast.error('Couldn’t copy — your browser blocked clipboard access'))
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon-sm" aria-label={`Actions for ${transaction.id}`}>
          <MoreHorizontal aria-hidden />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem onSelect={copyId}>
          <Copy aria-hidden /> Copy transaction ID
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={() => navigate(ROUTES.customers)}>
          <User aria-hidden /> View customer
        </DropdownMenuItem>
        {refundable && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem destructive onSelect={() => onRefund(transaction)}>
              <Undo2 aria-hidden /> Issue refund
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

interface RecentTransactionsProps {
  transactions?: Transaction[]
  className?: string
  title?: string
  description?: string
  pageSize?: number
  /** Hide the "View all" link (when this table already is the full list). */
  hideViewAll?: boolean
}

export function RecentTransactions({
  transactions,
  className,
  title = 'Recent transactions',
  description = 'Latest payments across your workspace',
  pageSize = 7,
  hideViewAll = false,
}: RecentTransactionsProps) {
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState('all')
  const [refundedIds, setRefundedIds] = useState<ReadonlySet<string>>(new Set())
  const [refundTarget, setRefundTarget] = useState<Transaction | null>(null)
  const [refundOpen, setRefundOpen] = useState(false)

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase()
    return (transactions ?? [])
      .map((t): Transaction => (refundedIds.has(t.id) ? { ...t, status: 'refunded' } : t))
      .filter((t) => status === 'all' || t.status === status)
      .filter(
        (t) =>
          !q ||
          t.customer.name.toLowerCase().includes(q) ||
          t.customer.email.toLowerCase().includes(q) ||
          t.id.toLowerCase().includes(q),
      )
  }, [transactions, refundedIds, query, status])

  const columns = useMemo<DataTableColumn<Transaction>[]>(
    () => [
      {
        id: 'customer',
        header: 'Customer',
        sortValue: (r) => r.customer.name,
        cell: (r) => (
          <div className="flex items-center gap-3">
            <Avatar name={r.customer.name} size="sm" />
            <div className="min-w-0">
              <p className="truncate font-medium leading-tight">{r.customer.name}</p>
              <p className="hidden truncate text-caption text-muted sm:block">{r.customer.email}</p>
            </div>
          </div>
        ),
      },
      {
        id: 'id',
        header: 'Transaction ID',
        hideBelow: 'lg',
        sortValue: (r) => r.id,
        cell: (r) => <span className="font-mono text-caption text-muted">{r.id}</span>,
      },
      {
        id: 'date',
        header: 'Date',
        hideBelow: 'md',
        sortValue: (r) => new Date(r.date).getTime(),
        cell: (r) => (
          <time dateTime={r.date} className="tabular whitespace-nowrap text-muted">
            {formatDateTime(r.date)}
          </time>
        ),
      },
      {
        id: 'amount',
        header: 'Amount',
        align: 'right',
        sortValue: (r) => r.amount,
        cell: (r) => <span className="tabular font-medium">{formatCurrency(r.amount, { precise: true })}</span>,
      },
      {
        id: 'status',
        header: 'Status',
        sortValue: (r) => r.status,
        cell: (r) => <StatusBadge status={r.status} />,
      },
      {
        id: 'actions',
        header: 'Actions',
        align: 'right',
        srOnlyHeader: true,
        cell: (r) => (
          <RowActions
            transaction={r}
            onRefund={(t) => {
              setRefundTarget(t)
              setRefundOpen(true)
            }}
          />
        ),
      },
    ],
    [],
  )

  const hasFilters = query !== '' || status !== 'all'

  return (
    <Card padding="none" className={className}>
      <div className="flex flex-wrap items-start justify-between gap-3 px-5 pt-5 sm:px-6 sm:pt-6">
        <div>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </div>
        {!hideViewAll && (
          <Button variant="ghost" size="sm" asChild>
            <Link to={ROUTES.transactions}>
              View all <ArrowRight aria-hidden />
            </Link>
          </Button>
        )}
      </div>

      <div className="flex flex-col gap-2 px-5 py-4 sm:flex-row sm:items-center sm:px-6">
        <SearchInput
          className="sm:max-w-xs"
          value={query}
          onValueChange={setQuery}
          placeholder="Search customer or ID…"
          aria-label="Search transactions"
        />
        <FilterDropdown label="Status" value={status} onValueChange={setStatus} options={STATUS_OPTIONS} />
      </div>

      <DataTable
        caption={title}
        columns={columns}
        data={rows}
        getRowId={(r) => r.id}
        pageSize={pageSize}
        loading={!transactions}
        initialSort={{ columnId: 'date', direction: 'desc' }}
        empty={
          <EmptyState
            icon={SearchX}
            title="No transactions found"
            description={
              hasFilters ? 'Nothing matches your search or filter. Try something broader.' : 'New payments will appear here.'
            }
            action={
              hasFilters ? (
                <Button
                  onClick={() => {
                    setQuery('')
                    setStatus('all')
                  }}
                >
                  Clear filters
                </Button>
              ) : undefined
            }
          />
        }
      />

      <ConfirmDialog
        open={refundOpen}
        onOpenChange={setRefundOpen}
        tone="danger"
        title="Issue a refund?"
        description={
          refundTarget
            ? `${formatCurrency(refundTarget.amount, { precise: true })} will be returned to ${refundTarget.customer.name} (${refundTarget.id}). This is a demo — no payment is processed.`
            : ''
        }
        confirmLabel="Issue refund"
        onConfirm={async () => {
          await new Promise((resolve) => window.setTimeout(resolve, 700))
          if (refundTarget) {
            setRefundedIds((prev) => new Set(prev).add(refundTarget.id))
            toast.success(`${refundTarget.id} marked as refunded`)
          }
        }}
      />
    </Card>
  )
}
