import { useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router'
import { toast } from 'sonner'
import { ArrowLeft, Globe, Mail, Pencil, Repeat, Trash2, Wallet } from 'lucide-react'
import { PageHeader } from '@/components/layout/PageHeader'
import {
  Avatar,
  Badge,
  Button,
  Card,
  ConfirmDialog,
  DataTable,
  EmptyState,
  Skeleton,
  StatCard,
  StatusBadge,
  type DataTableColumn,
} from '@/components/ui'
import { ROUTES } from '@/config/routes'
import { PLAN_LABELS } from '@/data/customers'
import { buildInvoices, type Invoice } from '@/data/finance'
import { CustomerFormModal } from '@/features/customers/CustomerFormModal'
import { useMockQuery } from '@/hooks/use-mock-query'
import { formatCurrency, formatDateTime, formatRelativeTime } from '@/lib/format'
import { selectCustomerById, useCustomersStore } from '@/stores/customers-store'

const COLUMNS: DataTableColumn<Invoice>[] = [
  { id: 'id', header: 'Invoice', sortValue: (r) => r.id, cell: (r) => <span className="font-mono text-caption">{r.id}</span> },
  { id: 'issued', header: 'Issued', hideBelow: 'sm', sortValue: (r) => new Date(r.issued).getTime(), cell: (r) => <span className="text-muted">{formatDateTime(r.issued)}</span> },
  { id: 'amount', header: 'Amount', align: 'right', sortValue: (r) => r.amount, cell: (r) => <span className="tabular font-medium">{formatCurrency(r.amount, { precise: true })}</span> },
  { id: 'status', header: 'Status', sortValue: (r) => r.status, cell: (r) => <StatusBadge status={r.status} /> },
]

export function CustomerDetailsPage() {
  const { customerId = '' } = useParams()
  const navigate = useNavigate()
  const customer = useCustomersStore(selectCustomerById(customerId))
  const remove = useCustomersStore((s) => s.remove)
  const { isLoading } = useMockQuery(() => true, [customerId], 350)

  const [editOpen, setEditOpen] = useState(false)
  const [removeOpen, setRemoveOpen] = useState(false)

  const invoices = useMemo(
    () => (customer ? buildInvoices(60).filter((inv) => inv.customer.email === customer.email) : []),
    [customer],
  )

  if (isLoading) {
    return (
      <div className="space-y-5">
        <Skeleton className="h-10 w-72" />
        <div className="grid gap-5 sm:grid-cols-3">
          {Array.from({ length: 3 }, (_, i) => (
            <Skeleton key={i} className="h-40 w-full rounded-card" />
          ))}
        </div>
      </div>
    )
  }

  if (!customer) {
    return (
      <Card>
        <EmptyState
          title="Customer not found"
          description="This customer may have been removed, or the link is incorrect."
          action={
            <Button asChild variant="primary">
              <Link to={ROUTES.customers}>Back to customers</Link>
            </Button>
          }
        />
      </Card>
    )
  }

  return (
    <div className="space-y-5">
      <Link
        to={ROUTES.customers}
        className="inline-flex items-center gap-1.5 text-body text-muted transition-colors duration-150 hover:text-foreground"
      >
        <ArrowLeft className="size-4" aria-hidden /> All customers
      </Link>

      <PageHeader
        title={customer.name}
        description={`${customer.company} · Customer since ${new Date(customer.joined).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}`}
        actions={
          <>
            <StatusBadge status={customer.status} />
            <Button asChild>
              <a href={`mailto:${customer.email}`}>
                <Mail aria-hidden /> Email
              </a>
            </Button>
            <Button onClick={() => setEditOpen(true)}>
              <Pencil aria-hidden /> Edit
            </Button>
            <Button variant="danger" onClick={() => setRemoveOpen(true)}>
              <Trash2 aria-hidden /> Remove
            </Button>
          </>
        }
      />

      <section aria-label="Customer summary" className="grid gap-4 sm:grid-cols-2 sm:gap-5 xl:grid-cols-3">
        <StatCard label="Monthly revenue" value={formatCurrency(customer.mrr)} delta={customer.mrr > 0 ? 3.2 : -100} comparison="vs. last month" icon={Repeat} featured />
        <StatCard label="Lifetime value" value={formatCurrency(customer.ltv)} delta={8.4} comparison="since joining" icon={Wallet} />
        <Card>
          <h3 className="text-body font-medium text-muted">Account</h3>
          <div className="mt-4 flex items-center gap-3">
            <Avatar name={customer.name} size="lg" />
            <div className="min-w-0">
              <p className="truncate font-medium">{customer.name}</p>
              <p className="truncate text-caption text-muted">{customer.email}</p>
            </div>
          </div>
          <dl className="mt-4 space-y-2 text-body">
            <div className="flex items-center justify-between">
              <dt className="text-muted">Plan</dt>
              <dd>
                <Badge variant="accent">{PLAN_LABELS[customer.plan]}</Badge>
              </dd>
            </div>
            <div className="flex items-center justify-between">
              <dt className="flex items-center gap-1.5 text-muted">
                <Globe className="size-3.5" aria-hidden /> Country
              </dt>
              <dd>{customer.country}</dd>
            </div>
            <div className="flex items-center justify-between">
              <dt className="text-muted">Last active</dt>
              <dd>{formatRelativeTime(customer.lastActive)}</dd>
            </div>
          </dl>
        </Card>
      </section>

      <Card padding="none">
        <div className="px-5 pt-5 sm:px-6 sm:pt-6">
          <h3 className="text-card font-medium">Invoices</h3>
          <p className="mt-0.5 text-caption text-muted">Billing history for this customer</p>
        </div>
        <DataTable
          className="mt-4"
          caption={`${customer.name} invoices`}
          columns={COLUMNS}
          data={invoices}
          getRowId={(r) => r.id}
          pageSize={5}
          initialSort={{ columnId: 'issued', direction: 'desc' }}
          empty={<EmptyState title="No invoices yet" description="Invoices will appear here once this customer is billed." />}
        />
      </Card>

      <CustomerFormModal open={editOpen} onOpenChange={setEditOpen} customer={customer} />

      <ConfirmDialog
        open={removeOpen}
        onOpenChange={setRemoveOpen}
        tone="danger"
        title="Remove customer?"
        description={`${customer.name} will be removed from your demo data.`}
        confirmLabel="Remove"
        onConfirm={async () => {
          await new Promise((resolve) => window.setTimeout(resolve, 500))
          remove(customer.id)
          toast.success(`${customer.name} removed`)
          navigate(ROUTES.customers)
        }}
      />
    </div>
  )
}
