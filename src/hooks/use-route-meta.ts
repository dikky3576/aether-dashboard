import { useLocation } from 'react-router'
import type { BreadcrumbItem } from '@/components/ui/breadcrumb'
import { NAV_GROUPS, type NavItem } from '@/config/navigation'
import { ROUTES } from '@/config/routes'

export interface RouteMeta {
  title: string
  item?: NavItem
  breadcrumbs: BreadcrumbItem[]
}

/** Labels for sub-pages. Any other path under a module (e.g. /projects/:id) is labelled "Details". */
const SUB_LABELS: Record<string, string> = {
  [ROUTES.analyticsRevenue]: 'Revenue',
  [ROUTES.analyticsPerformance]: 'Performance reports',
  [ROUTES.projectsBoard]: 'Board',
  [ROUTES.invoices]: 'Invoices',
  [ROUTES.teamRoles]: 'Roles & permissions',
  [ROUTES.settingsProfile]: 'Profile',
  [ROUTES.settingsSecurity]: 'Security',
  [ROUTES.settingsAppearance]: 'Appearance',
  [ROUTES.settingsNotifications]: 'Notification settings',
}

/** Resolves the current URL to its navigation entry: title and breadcrumb trail. */
export function useRouteMeta(): RouteMeta {
  const { pathname } = useLocation()

  for (const group of NAV_GROUPS) {
    for (const item of group.items) {
      if (pathname === item.to || pathname.startsWith(`${item.to}/`)) {
        const sub = pathname === item.to ? undefined : (SUB_LABELS[pathname] ?? 'Details')
        return {
          title: sub ?? item.label,
          item,
          breadcrumbs: sub
            ? [{ label: group.label }, { label: item.label, to: item.to }, { label: sub }]
            : [{ label: group.label }, { label: item.label }],
        }
      }
    }
  }
  return { title: 'Aether', breadcrumbs: [{ label: 'Aether' }] }
}
