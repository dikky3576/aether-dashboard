import { Outlet } from 'react-router'
import { PageHeader } from '@/components/layout/PageHeader'
import { SubNav } from '@/components/layout/SubNav'
import { ROUTES } from '@/config/routes'

const TABS = [
  { label: 'Transactions', to: ROUTES.transactions },
  { label: 'Invoices', to: ROUTES.invoices },
]

export function TransactionsLayout() {
  return (
    <>
      <PageHeader title="Transactions" description="Payments, refunds and invoices in one place." />
      <SubNav className="mt-6" label="Transaction sections" items={TABS} />
      <div className="mt-6">
        <Outlet />
      </div>
    </>
  )
}
