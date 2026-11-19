# Connecting a real backend

Aether ships with mock data so it runs anywhere. Every mock sits behind a small boundary so you can replace it without
rewriting the UI. **Authentication, payments and persistence in this template are demonstrations only.**

## Where the mocks live

| Data | Where | Used by |
| --- | --- | --- |
| Customers, projects, tasks, team members, role permissions | `src/stores/customers-store.ts`, `projects-store.ts`, `team-store.ts` (persisted to `localStorage`) | Customers, Projects, Team, Overview |
| Overview, analytics, transactions, invoices, reports, integrations | `src/data/*.ts` builders | Overview, Analytics, Finance, Workspace |
| Notifications | `src/stores/notifications-store.ts` | Header bell, Notifications page |
| Simulated loading | `src/hooks/use-mock-query.ts` | Most list pages |

## Recommended approach

1. **Pick a data-fetching library** (TanStack Query, SWR, RTK Query …) and add its provider in `src/app/providers.tsx`.
2. **Replace `useMockQuery`** call sites with real queries. The hook returns `{ data, isLoading }`, so the page code barely changes.
3. **Replace store actions** (`add`, `update`, `remove` …) with mutations. The forms already show a pending state and toasts, so
   keep those and call your API inside the submit handlers (look for the `await new Promise(... setTimeout ...)` lines — each is
   a placeholder for a request).
4. **Map your API shapes** to the types in `src/data/*.ts` (`Customer`, `Project`, `Task`, `Member`, `Invoice` …) or update those types.
5. Set `VITE_API_BASE_URL` in `.env` and read it with `import.meta.env.VITE_API_BASE_URL`.

## Authentication

- The pages in `src/features/auth` validate input and then navigate to the dashboard; they do not create sessions.
- Replace the submit handlers in `LoginPage`, `RegisterPage`, `ForgotPasswordPage` and `ResetPasswordPage` with calls to your auth provider.
- **Protect the dashboard:** wrap the `AppShell` route in `src/app/router.tsx` with a loader or guard that redirects to
  `ROUTES.login` when there is no session, and return a 403 for routes the user's role may not open (`ForbiddenPage` is ready).
- The "Sign out" item in `src/components/layout/UserMenu.tsx` currently just navigates to the login page.
- The current user shown in the header comes from `src/data/user.ts`.

## Payments

`BillingPage` lets you switch plans locally and never contacts a payment provider. Connect your provider's hosted checkout
or customer-portal links in `src/features/finance/BillingPage.tsx`, and keep card handling on the provider's side.

## Roles and permissions

The permission matrix (`RolesPage`) is stored in `team-store.ts` but is not enforced anywhere in the UI. Enforce permissions
on your **server** first; use the same data in the UI only to hide or disable actions.

## Error handling

`RouteErrorBoundary` catches render errors and failed route imports. For API errors, show a toast (`sonner`) or an inline
`EmptyState` with a retry button, as `OverviewPage` does.
