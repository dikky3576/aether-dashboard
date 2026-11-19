import { toast } from 'sonner'
import { Calendar, Download, FileText } from 'lucide-react'
import { PageHeader } from '@/components/layout/PageHeader'
import { Button, Card, Skeleton } from '@/components/ui'
import { buildCustomers } from '@/data/customers'
import { buildInvoices } from '@/data/finance'
import { buildTransactions } from '@/data/overview'
import { buildMembers } from '@/data/team'
import { buildReports, type SavedReport } from '@/data/workspace'
import { useMockQuery } from '@/hooks/use-mock-query'
import { downloadCsv } from '@/lib/export'
import { formatRelativeTime } from '@/lib/format'

function rowsFor(report: SavedReport): (string | number)[][] {
  switch (report.id) {
    case 'rep-customers':
      return [['ID', 'Name', 'Plan', 'Status', 'MRR'], ...buildCustomers().map((c) => [c.id, c.name, c.plan, c.status, c.mrr])]
    case 'rep-transactions':
      return [['ID', 'Customer', 'Date', 'Amount', 'Status'], ...buildTransactions(48).map((t) => [t.id, t.customer.name, t.date, t.amount, t.status])]
    case 'rep-invoices':
      return [['Invoice', 'Customer', 'Due', 'Amount', 'Status'], ...buildInvoices(32).map((i) => [i.id, i.customer.name, i.due, i.amount, i.status])]
    case 'rep-team':
      return [['Name', 'Email', 'Role', 'Status'], ...buildMembers().map((m) => [m.name, m.email, m.role, m.status])]
    default:
      return [['Plan', 'Customers', 'MRR'], ...['starter', 'growth', 'scale', 'enterprise'].map((plan) => {
        const group = buildCustomers().filter((c) => c.plan === plan)
        return [plan, group.length, group.reduce((sum, c) => sum + c.mrr, 0)]
      })]
  }
}

export function ReportsPage() {
  const { data } = useMockQuery(buildReports, [], 400)

  function run(report: SavedReport) {
    downloadCsv(`aether-${report.id}.csv`, rowsFor(report))
    toast.success(`${report.name} downloaded`)
  }

  return (
    <>
      <PageHeader title="Reports" description="Scheduled and on-demand exports of your data." />
      <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {!data
          ? Array.from({ length: 6 }, (_, i) => <Skeleton key={i} className="h-44 w-full rounded-card" />)
          : data.map((report) => (
              <Card key={report.id} className="flex flex-col">
                <span className="grid size-10 place-items-center rounded-lg bg-accent-soft text-accent-text">
                  <FileText className="size-5" strokeWidth={1.75} aria-hidden />
                </span>
                <h2 className="mt-4 text-card font-medium">{report.name}</h2>
                <p className="mt-1 flex-1 text-body text-muted">{report.description}</p>
                <p className="mt-4 flex items-center gap-1.5 text-caption text-muted">
                  <Calendar className="size-3.5" aria-hidden /> {report.schedule} · last run {formatRelativeTime(report.lastRun)}
                </p>
                <Button className="mt-4" onClick={() => run(report)}>
                  <Download aria-hidden /> Run &amp; download
                </Button>
              </Card>
            ))}
      </div>
    </>
  )
}
