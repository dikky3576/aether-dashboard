import { useMemo } from 'react'
import { toast } from 'sonner'
import { Download, FileSearch, MoreHorizontal, Send } from 'lucide-react'
import {
  Avatar,
  Button,
  Card,
  DataTable,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  EmptyState,
  FilterDropdown,
  SearchInput,
  StatusBadge,
  type DataTableColumn,
} from '@/components/ui'
import { buildInvoices, type Invoice } from '@/data/finance'
import { useMockQuery } from '@/hooks/use-mock-query'
import { useQueryState } from '@/hooks/use-query-state'
import { downloadCsv } from '@/lib/export'
import { formatCurrency, formatDateTime } from '@/lib/format'

const STATUS_OPTIONS = [
  { value: 'all', label: 'All statuses' },
  { value: 'paid', label: 'Paid' },
  { value: 'pending', label: 'Pending' },
  { value: 'overdue', label: 'Overdue' },
  { value: 'draft', label: 'Draft' },
]

export function InvoicesPage() {
  const { data } = useMockQuery(() => buildInvoices(32), [], 500)
  const [query, setQuery] = useQueryState('q')
  const [status, setStatus] = useQueryState('status', 'all')

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase()
    return (data ?? []).filter(
      (i) =>
        (status === 'all' || i.status === status) &&
        (!q || i.id.toLowerCase().includes(q) || i.customer.name.toLowerCase().includes(q)),
    )
  }, [data, query, status])

  const columns: DataTableColumn<Invoice>[] = [
    { id: 'id', header: 'Invoice', sortValue: (r) => r.id, cell: (r) => <span className="font-mono text-caption">{r.id}</span> },
    {
      id: 'customer',
      header: 'Customer',
      sortValue: (r) => r.customer.name,
      cell: (r) => (
        <span className="flex items-center gap-3">
          <Avatar name={r.customer.name} size="sm" />
          <span className="truncate font-medium">{r.customer.name}</span>
        </span>
      ),
    },
    { id: 'issued', header: 'Issued', hideBelow: 'md', sortValue: (r) => new Date(r.issued).getTime(), cell: (r) => <span className="text-muted">{formatDateTime(r.issued)}</span> },
    { id: 'due', header: 'Due', hideBelow: 'lg', sortValue: (r) => new Date(r.due).getTime(), cell: (r) => <span className="text-muted">{formatDateTime(r.due)}</span> },
    { id: 'amount', header: 'Amount', align: 'right', sortValue: (r) => r.amount, cell: (r) => <span className="tabular font-medium">{formatCurrency(r.amount, { precise: true })}</span> },
    { id: 'status', header: 'Status', sortValue: (r) => r.status, cell: (r) => <StatusBadge status={r.status} /> },
    {
      id: 'actions',
      header: 'Actions',
      srOnlyHeader: true,
      align: 'right',
      cell: (r) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon-sm" aria-label={`Actions for ${r.id}`}>
              <MoreHorizontal aria-hidden />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onSelect={() => toast.success(`${r.id} downloaded (demo)`)}>
              <Download aria-hidden /> Download PDF
            </DropdownMenuItem>
            {(r.status === 'pending' || r.status === 'overdue') && (
              <DropdownMenuItem onSelect={() => toast.success(`Reminder sent to ${r.customer.name}`)}>
                <Send aria-hidden /> Send reminder
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ]

  function exportCsv() {
    downloadCsv('aether-invoices.csv', [
      ['Invoice', 'Customer', 'Issued', 'Due', 'Amount', 'Status'],
      ...rows.map((i) => [i.id, i.customer.name, i.issued, i.due, i.amount, i.status]),
    ])
    toast.success(`Exported ${rows.length} invoices`)
  }

  return (
    <Card padding="none">
      <div className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:p-5">
        <SearchInput className="sm:max-w-xs" value={query} onValueChange={setQuery} placeholder="Search invoice or customer…" aria-label="Search invoices" />
        <FilterDropdown label="Status" value={status} onValueChange={setStatus} options={STATUS_OPTIONS} />
        <Button className="sm:ml-auto" onClick={exportCsv} disabled={!data}>
          <Download aria-hidden /> Export CSV
        </Button>
      </div>
      <DataTable
        caption="Invoices"
        columns={columns}
        data={rows}
        getRowId={(r) => r.id}
        loading={!data}
        pageSize={10}
        initialSort={{ columnId: 'issued', direction: 'desc' }}
        empty={<EmptyState icon={FileSearch} title="No invoices found" description="Try a different search or status." />}
      />
    </Card>
  )
}
