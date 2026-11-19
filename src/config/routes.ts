/**
 * Central route map. Paths live here so navigation, breadcrumbs and links
 * never hardcode strings.
 */
export const ROUTES = {
  home: '/',
  designSystem: '/design-system',
  overview: '/overview',
  analytics: '/analytics',
  analyticsRevenue: '/analytics/revenue',
  analyticsPerformance: '/analytics/performance',
  projects: '/projects',
  projectsBoard: '/projects/board',
  customers: '/customers',
  transactions: '/transactions',
  invoices: '/transactions/invoices',
  reports: '/reports',
  team: '/team',
  teamRoles: '/team/roles',
  billing: '/billing',
  integrations: '/integrations',
  notifications: '/notifications',
  settings: '/settings',
  settingsProfile: '/settings/profile',
  settingsSecurity: '/settings/security',
  settingsAppearance: '/settings/appearance',
  settingsNotifications: '/settings/notifications',
  login: '/login',
  register: '/register',
  forgotPassword: '/forgot-password',
  resetPassword: '/reset-password',
  forbidden: '/403',
  serverError: '/500',
} as const

export type RoutePath = (typeof ROUTES)[keyof typeof ROUTES]

export const projectPath = (id: string) => `/projects/${id}`
export const customerPath = (id: string) => `/customers/${id}`
