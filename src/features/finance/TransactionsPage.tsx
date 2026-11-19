import { toast } from 'sonner'
import { Download } from 'lucide-react'
import { Button } from '@/components/ui'
import { buildTransactions } from '@/data/overview'
import { RecentTransactions } from '@/features/overview/components/RecentTransactions'
import { useMockQuery } from '@/hooks/use-mock-query'
import { downloadCsv } from '@/lib/export'

export function TransactionsPage() {
  const { data } = useMockQuery(() => buildTransactions(48), [], 500)

  function exportCsv() {
    if (!data) return
    downloadCsv('aether-transactions.csv', [
      ['ID', 'Customer', 'Email', 'Date', 'Amount', 'Status'],
      ...data.map((t) => [t.id, t.customer.name, t.customer.email, t.date, t.amount, t.status]),
    ])
    toast.success(`Exported ${data.length} transactions`)
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button onClick={exportCsv} disabled={!data}>
          <Download aria-hidden /> Export CSV
        </Button>
      </div>
      <RecentTransactions
        transactions={data}
        title="All transactions"
        description="Search, filter and refund payments"
        pageSize={10}
        hideViewAll
      />
    </div>
  )
}
