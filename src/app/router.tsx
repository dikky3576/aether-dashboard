import { Navigate, createBrowserRouter } from 'react-router'
import { AppShell } from '@/components/layout/AppShell'
import { ROUTES } from '@/config/routes'
import { DesignSystemPage } from '@/features/design-system/DesignSystemPage'
import { AppLoading } from '@/components/layout/PageLoading'
import { AuthLayout } from '@/features/auth/AuthLayout'
import { ForgotPasswordPage } from '@/features/auth/ForgotPasswordPage'
import { LoginPage } from '@/features/auth/LoginPage'
import { RegisterPage } from '@/features/auth/RegisterPage'
import { ResetPasswordPage } from '@/features/auth/ResetPasswordPage'
import { ForbiddenPage } from '@/features/errors/ForbiddenPage'
import { NotFoundPage } from '@/features/errors/NotFoundPage'
import { RouteErrorBoundary } from '@/features/errors/RouteErrorBoundary'
import { ServerErrorPage } from '@/features/errors/ServerErrorPage'
import { OverviewPage } from '@/features/overview/OverviewPage'

/**
 * Every sidebar destination renders inside <AppShell />. Module pages are
 * lazy-loaded per feature so the first load stays small.
 * Static paths are listed before dynamic ones (/projects/board before /projects/:projectId).
 * Auth and error pages (Phase 6) live outside the shell.
 */
export const router = createBrowserRouter([
  {
    element: <AppShell />,
    errorElement: <RouteErrorBoundary />,
    hydrateFallbackElement: <AppLoading />,
    children: [
      { path: ROUTES.home, element: <Navigate to={ROUTES.overview} replace /> },
      { path: ROUTES.overview, element: <OverviewPage /> },

      {
        path: ROUTES.analytics,
        lazy: async () => ({ Component: (await import('@/features/analytics/AnalyticsLayout')).AnalyticsLayout }),
        children: [
          { index: true, lazy: async () => ({ Component: (await import('@/features/analytics/AnalyticsOverviewPage')).AnalyticsOverviewPage }) },
          { path: 'revenue', lazy: async () => ({ Component: (await import('@/features/analytics/RevenueAnalyticsPage')).RevenueAnalyticsPage }) },
          { path: 'performance', lazy: async () => ({ Component: (await import('@/features/analytics/PerformanceReportsPage')).PerformanceReportsPage }) },
        ],
      },

      {
        path: ROUTES.projects,
        lazy: async () => ({ Component: (await import('@/features/projects/ProjectsLayout')).ProjectsLayout }),
        children: [
          { index: true, lazy: async () => ({ Component: (await import('@/features/projects/ProjectsListPage')).ProjectsListPage }) },
          { path: 'board', lazy: async () => ({ Component: (await import('@/features/projects/ProjectBoardPage')).ProjectBoardPage }) },
          { path: ':projectId', lazy: async () => ({ Component: (await import('@/features/projects/ProjectDetailsPage')).ProjectDetailsPage }) },
        ],
      },

      { path: ROUTES.customers, lazy: async () => ({ Component: (await import('@/features/customers/CustomersPage')).CustomersPage }) },
      { path: `${ROUTES.customers}/:customerId`, lazy: async () => ({ Component: (await import('@/features/customers/CustomerDetailsPage')).CustomerDetailsPage }) },

      {
        path: ROUTES.transactions,
        lazy: async () => ({ Component: (await import('@/features/finance/TransactionsLayout')).TransactionsLayout }),
        children: [
          { index: true, lazy: async () => ({ Component: (await import('@/features/finance/TransactionsPage')).TransactionsPage }) },
          { path: 'invoices', lazy: async () => ({ Component: (await import('@/features/finance/InvoicesPage')).InvoicesPage }) },
        ],
      },
      { path: ROUTES.billing, lazy: async () => ({ Component: (await import('@/features/finance/BillingPage')).BillingPage }) },

      {
        path: ROUTES.team,
        lazy: async () => ({ Component: (await import('@/features/team/TeamLayout')).TeamLayout }),
        children: [
          { index: true, lazy: async () => ({ Component: (await import('@/features/team/MembersPage')).MembersPage }) },
          { path: 'roles', lazy: async () => ({ Component: (await import('@/features/team/RolesPage')).RolesPage }) },
        ],
      },

      {
        path: ROUTES.settings,
        lazy: async () => ({ Component: (await import('@/features/settings/SettingsLayout')).SettingsLayout }),
        children: [
          { index: true, lazy: async () => ({ Component: (await import('@/features/settings/GeneralSettingsPage')).GeneralSettingsPage }) },
          { path: 'profile', lazy: async () => ({ Component: (await import('@/features/settings/ProfileSettingsPage')).ProfileSettingsPage }) },
          { path: 'security', lazy: async () => ({ Component: (await import('@/features/settings/SecuritySettingsPage')).SecuritySettingsPage }) },
          { path: 'appearance', lazy: async () => ({ Component: (await import('@/features/settings/AppearanceSettingsPage')).AppearanceSettingsPage }) },
          { path: 'notifications', lazy: async () => ({ Component: (await import('@/features/settings/NotificationSettingsPage')).NotificationSettingsPage }) },
        ],
      },

      { path: ROUTES.reports, lazy: async () => ({ Component: (await import('@/features/workspace/ReportsPage')).ReportsPage }) },
      { path: ROUTES.integrations, lazy: async () => ({ Component: (await import('@/features/workspace/IntegrationsPage')).IntegrationsPage }) },
      { path: ROUTES.notifications, lazy: async () => ({ Component: (await import('@/features/workspace/NotificationsPage')).NotificationsPage }) },
    ],
  },
  {
    element: <AuthLayout />,
    errorElement: <RouteErrorBoundary />,
    children: [
      { path: ROUTES.login, element: <LoginPage /> },
      { path: ROUTES.register, element: <RegisterPage /> },
      { path: ROUTES.forgotPassword, element: <ForgotPasswordPage /> },
      { path: ROUTES.resetPassword, element: <ResetPasswordPage /> },
    ],
  },
  { path: ROUTES.forbidden, element: <ForbiddenPage /> },
  { path: ROUTES.serverError, element: <ServerErrorPage /> },
  { path: ROUTES.designSystem, element: <DesignSystemPage />, errorElement: <RouteErrorBoundary /> },
  { path: '*', element: <NotFoundPage /> },
])