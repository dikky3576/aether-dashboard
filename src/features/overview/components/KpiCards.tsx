import { DollarSign, FolderKanban, Target, Users, type LucideIcon } from 'lucide-react'
import { StatCard, StatCardSkeleton } from '@/components/ui/stat-card'
import { formatCurrency, formatNumber, formatPercent } from '@/lib/format'
import type { Kpi, KpiId } from '@/types/overview'

const ICONS: Record<KpiId, LucideIcon> = {
  revenue: DollarSign,
  users: Users,
  projects: FolderKanban,
  conversion: Target,
}

function formatKpi(kpi: Kpi): string {
  switch (kpi.format) {
    case 'currency':
      return formatCurrency(kpi.value)
    case 'percent':
      return formatPercent(kpi.value, 2)
    default:
      return formatNumber(kpi.value)
  }
}

interface KpiCardsProps {
  kpis?: Kpi[]
  comparison: string
}

export function KpiCards({ kpis, comparison }: KpiCardsProps) {
  return (
    <section aria-label="Key metrics" className="grid gap-4 sm:grid-cols-2 sm:gap-5 xl:grid-cols-4">
      {kpis
        ? kpis.map((kpi) => (
            <StatCard
              key={kpi.id}
              label={kpi.label}
              value={formatKpi(kpi)}
              delta={kpi.delta}
              comparison={comparison}
              icon={ICONS[kpi.id]}
              trend={kpi.trend}
              featured={kpi.id === 'revenue'}
            />
          ))
        : Array.from({ length: 4 }, (_, i) => <StatCardSkeleton key={i} />)}
    </section>
  )
}
