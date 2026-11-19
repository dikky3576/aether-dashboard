import { useState } from 'react'
import { toast } from 'sonner'
import { RefreshCw, TriangleAlert } from 'lucide-react'
import { Button, Card, EmptyState } from '@/components/ui'
import { RANGE_OPTIONS } from '@/data/overview'
import { CreateProjectModal } from '@/features/overview/components/CreateProjectModal'
import { InviteTeammateModal } from '@/features/overview/components/InviteTeammateModal'
import { KpiCards } from '@/features/overview/components/KpiCards'
import { PerformanceOverview } from '@/features/overview/components/PerformanceOverview'
import { QuickActions } from '@/features/overview/components/QuickActions'
import { RecentActivity } from '@/features/overview/components/RecentActivity'
import { RecentTransactions } from '@/features/overview/components/RecentTransactions'
import { RevenueChart } from '@/features/overview/components/RevenueChart'
import { WelcomeHeader } from '@/features/overview/components/WelcomeHeader'
import { useOverview } from '@/features/overview/use-overview'
import { cn } from '@/lib/cn'
import { downloadCsv } from '@/lib/export'
import { formatCurrency } from '@/lib/format'
import { useProjectsStore } from '@/stores/projects-store'
import { useTeamStore } from '@/stores/team-store'
import type { RangeKey } from '@/types/overview'

export function OverviewPage() {
  const [range, setRange] = useState<RangeKey>('30d')
  const [projectOpen, setProjectOpen] = useState(false)
  const [inviteOpen, setInviteOpen] = useState(false)
  const { data, error, isFetching, retry } = useOverview(range)
  const addProject = useProjectsStore((s) => s.addProject)
  const invite = useTeamStore((s) => s.invite)

  const option = RANGE_OPTIONS.find((o) => o.value === range) ?? RANGE_OPTIONS[0]

  function exportReport() {
    if (!data) {
      toast.info('Data is still loading — try again in a moment.')
      return
    }
    downloadCsv(`aether-overview-${range}.csv`, [
      ['Aether overview report'],
      ['Range', option.label],
      ['Generated', new Date().toISOString()],
      [],
      ['Metric', 'Value', `Change % (${option.comparison})`],
      ...data.kpis.map((kpi) => [kpi.label, kpi.value, kpi.delta]),
      [],
      ['Period', 'Revenue (USD)', 'Previous period (USD)'],
      ...data.revenue.map((p) => [p.fullLabel, p.current, p.previous]),
      [],
      ['Plan', 'Revenue (USD)', 'Share %'],
      ...data.plans.map((p) => [p.name, p.amount, p.share]),
      [],
      ['Total revenue', formatCurrency(data.revenueTotals.current)],
    ])
    toast.success('Report exported as CSV')
  }

  return (
    <>
      <WelcomeHeader
        range={range}
        onRangeChange={setRange}
        onExport={exportReport}
        onNewProject={() => setProjectOpen(true)}
      />

      {error && !data ? (
        <Card padding="none" className="mt-8">
          <EmptyState
            icon={TriangleAlert}
            title="We couldn’t load your overview"
            description="Check your connection and try again."
            action={
              <Button onClick={retry}>
                <RefreshCw aria-hidden /> Try again
              </Button>
            }
          />
        </Card>
      ) : (
        <div
          aria-busy={isFetching}
          className={cn('mt-8 space-y-5 transition-opacity duration-200', isFetching && 'opacity-60')}
        >
          <KpiCards kpis={data?.kpis} comparison={option.comparison} />

          <div className="grid gap-5 xl:grid-cols-12">
            <RevenueChart className="min-w-0 xl:col-span-8" data={data} range={range} onRangeChange={setRange} />
            <PerformanceOverview className="min-w-0 xl:col-span-4" data={data} />
          </div>

          <div className="grid gap-5 xl:grid-cols-12">
            <RecentTransactions className="min-w-0 xl:col-span-8" transactions={data?.transactions} />
            <div className="flex min-w-0 flex-col gap-5 xl:col-span-4">
              <QuickActions
                onNewProject={() => setProjectOpen(true)}
                onInvite={() => setInviteOpen(true)}
                onExport={exportReport}
              />
              <RecentActivity activity={data?.activity} />
            </div>
          </div>
        </div>
      )}

      <CreateProjectModal
        open={projectOpen}
        onOpenChange={setProjectOpen}
        onCreate={({ name, description }) => addProject({ name, description })}
      />
      <InviteTeammateModal open={inviteOpen} onOpenChange={setInviteOpen} onInvite={({ email, role }) => invite(email, role)} />
    </>
  )
}
