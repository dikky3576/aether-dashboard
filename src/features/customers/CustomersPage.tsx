import { useMemo, useState } from 'react'
import { Link } from 'react-router'
import { toast } from 'sonner'
import { Download, MoreHorizontal, Pencil, Trash2, UserPlus, UserSearch } from 'lucide-react'
import { PageHeader } from '@/components/layout/PageHeader'
import {
  Avatar,
  Badge,
  Button,
  Card,
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
import { customerPath } from '@/config/routes'
import { PLAN_LABELS, type Customer } from '@/data/customers'
import { CustomerFormModal } from '@/features/customers/CustomerFormModal'
import { useMockQuery } from '@/hooks/use-mock-query'
import { useQueryState } from '@/hooks/use-query-state'
import { downloadCsv } from '@/lib/export'
import { formatCurrency, formatRelativeTime } from '@/lib/format'
import { useCustomersStore } from '@/stores/customers-store'

const STATUS_OPTIONS = [
  { value: 'all', label: 'All statuses' },
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' },
  { value: 'overdue', label: 'Overdue' },
]

const PLAN_OPTIONS = [
  { value: 'all', label: 'All plans' },
  ...Object.entries(PLAN_LABELS).map(([value, label]) => ({ value, label })),
]

export function CustomersPage() {
  const customers = useCustomersStore((s) => s.customers)
  const remove = useCustomersStore((s) => s.remove)
  // Simulated first load so the skeleton state is visible; the data itself lives in the store.
  const { isLoading } = useMockQuery(() => true, [], 450)

  const [query, setQuery] = useQueryState('q')
  const [status, setStatus] = useQueryState('status', 'all')
  const [plan, setPlan] = useQueryState('plan', 'all')

  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState<Customer | undefined>()
  const [toRemove, setToRemove] = useState<Customer | null>(null)

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return customers.filter(
      (c) =>
        (status === 'all' || c.status === status) &&
        (plan === 'all' || c.plan === plan) &&
        (!q || c.name.toLowerCase().includes(q) || c.email.toLowerCase().includes(q) || c.company.toLowerCase().includes(q)),
    )
  }, [customers, query, status, plan])

  const hasFilters = query !== '' || status !== 'all' || plan !== 'all'

  function openCreate() {
    setEditing(undefined)
    setFormOpen(true)
  }

  function openEdit(customer: Customer) {
    setEditing(customer)
    setFormOpen(true)
  }

  function exportCsv() {
    downloadCsv('aether-customers.csv', [
      ['ID', 'Name', 'Email', 'Company', 'Plan', 'Status', 'MRR', 'LTV', 'Country'],
      ...filtered.map((c) => [c.id, c.name, c.email, c.company, PLAN_LABELS[c.plan], c.status, c.mrr, c.ltv, c.country]),
    ])
    toast.success(`Exported ${filtered.length} ${filtered.length === 1 ? 'customer' : 'customers'}${hasFilters ? ' (filtered)' : ''}`)
  }

  function clearFilters() {
    setQuery('')
    setStatus('all')
    setPlan('all')
  }

  const columns: DataTableColumn<Customer>[] = [
    {
      id: 'name',
      header: 'Customer',
      sortValue: (r) => r.name,
      cell: (r) => (
        <Link to={customerPath(r.id)} className="flex min-w-0 items-center gap-3 rounded-md hover:text-accent-text">
          <Avatar name={r.name} size="sm" />
          <span className="min-w-0">
            <span className="block truncate font-medium">{r.name}</span>
            <span className="block truncate text-caption text-muted">{r.email}</span>
          </span>
        </Link>
      ),
    },
    { id: 'plan', header: 'Plan', hideBelow: 'sm', sortValue: (r) => r.plan, cell: (r) => <Badge variant="accent">{PLAN_LABELS[r.plan]}</Badge> },
    { id: 'status', header: 'Status', sortValue: (r) => r.status, cell: (r) => <StatusBadge status={r.status} /> },
    { id: 'mrr', header: 'MRR', align: 'right', hideBelow: 'md', sortValue: (r) => r.mrr, cell: (r) => <span className="tabular font-medium">{formatCurrency(r.mrr)}</span> },
    { id: 'active', header: 'Last active', hideBelow: 'lg', sortValue: (r) => r.lastActive, cell: (r) => <span className="text-muted">{formatRelativeTime(r.lastActive)}</span> },
    {
      id: 'actions',
      header: 'Actions',
      srOnlyHeader: true,
      align: 'right',
      cell: (r) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon-sm" aria-label={`Actions for ${r.name}`}>
              <MoreHorizontal aria-hidden />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem asChild>
              <Link to={customerPath(r.id)}>View profile</Link>
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={() => openEdit(r)}>
              <Pencil aria-hidden /> Edit
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem destructive onSelect={() => setToRemove(r)}>
              <Trash2 aria-hidden /> Remove customer
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ]

  return (
    <>
      <PageHeader
        title="Customers"
        description="Everyone who pays, trials or has paid you."
        actions={
          <>
            <Button onClick={exportCsv} disabled={isLoading || filtered.length === 0}>
              <Download aria-hidden /> Export
            </Button>
            <Button variant="primary" onClick={openCreate}>
              <UserPlus aria-hidden /> Add customer
            </Button>
          </>
        }
      />

      <Card padding="none" className="mt-6">
        <div className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:p-5">
          <SearchInput
            className="sm:max-w-xs"
            value={query}
            onValueChange={setQuery}
            placeholder="Search by name, email or company…"
            aria-label="Search customers"
          />
          <div className="flex flex-wrap gap-2">
            <FilterDropdown label="Status" value={status} onValueChange={setStatus} options={STATUS_OPTIONS} />
            <FilterDropdown label="Plan" value={plan} onValueChange={setPlan} options={PLAN_OPTIONS} />
          </div>
          <p className="text-caption text-muted sm:ml-auto" role="status">
            {isLoading ? '' : `${filtered.length} of ${customers.length} customers`}
          </p>
        </div>
        <DataTable
          caption="Customers"
          columns={columns}
          data={filtered}
          getRowId={(r) => r.id}
          loading={isLoading}
          pageSize={8}
          initialSort={{ columnId: 'name', direction: 'asc' }}
          empty={
            <EmptyState
              icon={UserSearch}
              title={hasFilters ? 'No customers match' : 'No customers yet'}
              description={hasFilters ? 'Adjust your search or filters to see more results.' : 'Add your first customer to get started.'}
              action={
                hasFilters ? (
                  <Button onClick={clearFilters}>Clear filters</Button>
                ) : (
                  <Button variant="primary" onClick={openCreate}>
                    Add customer
                  </Button>
                )
              }
            />
          }
        />
      </Card>

      <CustomerFormModal open={formOpen} onOpenChange={setFormOpen} customer={editing} />

      <ConfirmDialog
        open={toRemove !== null}
        onOpenChange={(open) => !open && setToRemove(null)}
        tone="danger"
        title="Remove customer?"
        description={`${toRemove?.name ?? 'This customer'} will be removed from your demo data. In a real app this would also cancel their subscription.`}
        confirmLabel="Remove"
        onConfirm={async () => {
          await new Promise((resolve) => window.setTimeout(resolve, 500))
          if (toRemove) {
            remove(toRemove.id)
            toast.success(`${toRemove.name} removed`)
          }
        }}
      />
    </>
  )
}
