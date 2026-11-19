import {
  ArrowLeftRight,
  BarChart3,
  Bell,
  CreditCard,
  FileText,
  FolderKanban,
  LayoutDashboard,
  Plug,
  Settings,
  Users,
  UsersRound,
  type LucideIcon,
} from 'lucide-react'
import { ROUTES, type RoutePath } from '@/config/routes'

export interface NavItem {
  label: string
  to: RoutePath
  icon: LucideIcon
  description: string
  /** Extra words the command palette also matches. */
  keywords?: string
  /** Build phase in which this page's real content lands. */
  phase: 4 | 5
}

export interface NavGroup {
  label: string
  items: NavItem[]
}

/** Single source of truth for the sidebar, mobile drawer, breadcrumbs and command palette. */
export const NAV_GROUPS: NavGroup[] = [
  {
    label: 'Workspace',
    items: [
      { label: 'Overview', to: ROUTES.overview, icon: LayoutDashboard, description: 'Your workspace at a glance.', keywords: 'dashboard home kpi', phase: 4 },
      { label: 'Analytics', to: ROUTES.analytics, icon: BarChart3, description: 'Revenue, traffic and performance in depth.', keywords: 'charts metrics', phase: 5 },
      { label: 'Projects', to: ROUTES.projects, icon: FolderKanban, description: 'Track work across your team.', keywords: 'tasks board', phase: 5 },
      { label: 'Customers', to: ROUTES.customers, icon: Users, description: 'Everyone you sell to, in one place.', keywords: 'crm accounts', phase: 5 },
      { label: 'Transactions', to: ROUTES.transactions, icon: ArrowLeftRight, description: 'Payments, refunds and payouts.', keywords: 'payments invoices', phase: 5 },
      { label: 'Reports', to: ROUTES.reports, icon: FileText, description: 'Scheduled and on-demand reports.', keywords: 'export', phase: 5 },
    ],
  },
  {
    label: 'Management',
    items: [
      { label: 'Team Management', to: ROUTES.team, icon: UsersRound, description: 'Members, roles and permissions.', keywords: 'people roles invite', phase: 5 },
      { label: 'Subscription & Billing', to: ROUTES.billing, icon: CreditCard, description: 'Plans, invoices and payment methods.', keywords: 'plan pricing invoice', phase: 5 },
      { label: 'Integrations', to: ROUTES.integrations, icon: Plug, description: 'Connect the tools your team already uses.', keywords: 'apps api connect', phase: 5 },
    ],
  },
  {
    label: 'Preferences',
    items: [
      { label: 'Notifications', to: ROUTES.notifications, icon: Bell, description: 'Alerts and activity from your workspace.', keywords: 'alerts inbox', phase: 5 },
      { label: 'Settings', to: ROUTES.settings, icon: Settings, description: 'Profile, security and appearance.', keywords: 'profile account theme', phase: 5 },
    ],
  },
]

export const NAV_ITEMS: NavItem[] = NAV_GROUPS.flatMap((group) => group.items)
