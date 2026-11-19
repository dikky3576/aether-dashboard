import { useState } from 'react'
import { Outlet, useOutletContext } from 'react-router'
import { toast } from 'sonner'
import { Download } from 'lucide-react'
import { PageHeader } from '@/components/layout/PageHeader'
import { SubNav } from '@/components/layout/SubNav'
import { Button, DateRangePicker } from '@/components/ui'
import { ROUTES } from '@/config/routes'
import { buildAnalytics, type AnalyticsData } from '@/data/analytics'
import { RANGE_OPTIONS } from '@/data/overview'
import { useMockQuery } from '@/hooks/use-mock-query'
import { cn } from '@/lib/cn'
import { downloadCsv } from '@/lib/export'
import type { RangeKey } from '@/types/overview'

export interface AnalyticsContext {
  range: RangeKey
  setRange: (range: RangeKey) => void
  data?: AnalyticsData
}

export function useAnalyticsContext(): AnalyticsContext {
  return useOutletContext<AnalyticsContext>()
}

const PICKER_OPTIONS = RANGE_OPTIONS.map(({ value, label }) => ({ value, label }))

const TABS = [
  { label: 'Overview', to: ROUTES.analytics },
  { label: 'Revenue', to: ROUTES.analyticsRevenue },
  { label: 'Performance reports', to: ROUTES.analyticsPerformance },
]

export function AnalyticsLayout() {
  const [range, setRange] = useState<RangeKey>('30d')
  const { data } = useMockQuery(() => buildAnalytics(range), [range], 500)
  const isFetching = data !== undefined && data.range !== range

  function exportTraffic() {
    if (!data) {
      toast.info('Data is still loading — try again in a moment.')
      return
    }
    downloadCsv(`aether-analytics-${range}.csv`, [
      ['Period', 'Visitors', 'Sign-ups', 'Conversion %'],
      ...data.traffic.map((t) => [t.fullLabel, t.visitors, t.signups, t.conversion]),
    ])
    toast.success('Analytics exported as CSV')
  }

  const context: AnalyticsContext = { range, setRange, data }

  return (
    <>
      <PageHeader
        title="Analytics"
        description="Understand how visitors become customers."
        actions={
          <>
            <DateRangePicker className="w-full sm:w-48" value={range} onValueChange={setRange} options={PICKER_OPTIONS} />
            <Button onClick={exportTraffic}>
              <Download aria-hidden /> Export
            </Button>
          </>
        }
      />
      <SubNav className="mt-6" label="Analytics sections" items={TABS} />
      <div
        aria-busy={isFetching}
        className={cn('mt-6 transition-opacity duration-200', isFetching && 'opacity-60')}
      >
        <Outlet context={context} />
      </div>
    </>
  )
}
