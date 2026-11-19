import { useMemo } from 'react'
import { Download, Plus } from 'lucide-react'
import { PageHeader } from '@/components/layout/PageHeader'
import { Button } from '@/components/ui/button'
import { DateRangePicker } from '@/components/ui/date-range-picker'
import { currentUser } from '@/data/user'
import { RANGE_OPTIONS } from '@/data/overview'
import { formatLongDate, getGreeting } from '@/lib/format'
import type { RangeKey } from '@/types/overview'

const PICKER_OPTIONS = RANGE_OPTIONS.map(({ value, label }) => ({ value, label }))

interface WelcomeHeaderProps {
  range: RangeKey
  onRangeChange: (range: RangeKey) => void
  onExport: () => void
  onNewProject: () => void
}

export function WelcomeHeader({ range, onRangeChange, onExport, onNewProject }: WelcomeHeaderProps) {
  const { greeting, date } = useMemo(() => ({ greeting: getGreeting(), date: formatLongDate() }), [])

  return (
    <PageHeader
      eyebrow={date}
      title={`${greeting}, ${currentUser.firstName}`}
      description="Here’s what’s happening with your workspace today."
      actions={
        <>
          <DateRangePicker
            className="w-full sm:w-48"
            value={range}
            onValueChange={onRangeChange}
            options={PICKER_OPTIONS}
          />
          <Button onClick={onExport}>
            <Download aria-hidden /> Export report
          </Button>
          <Button variant="primary" onClick={onNewProject}>
            <Plus aria-hidden /> New project
          </Button>
        </>
      }
    />
  )
}
