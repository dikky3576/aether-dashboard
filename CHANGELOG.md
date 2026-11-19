# Changelog

## 1.0.0

First release.

- Design system: tokens, light and dark themes, 28 accessible UI components, data table with sorting and pagination.
- Application shell: collapsible sidebar, mobile drawer, header, command palette, breadcrumbs, notifications.
- Pages: Overview, Analytics (3), Projects (list, detail, board), Customers (list, detail), Finance (transactions, invoices, billing),
  Team (members, roles), Settings (5), Reports, Integrations, Notifications.
- Auth and utility pages: Login, Register, Forgot password, Reset password, 403, 404, 500, route error boundary.
- Interactions: search, filters kept in the URL, sorting, pagination, validated forms (React Hook Form + Zod),
  create / edit / delete with confirmation, CSV export, toasts.
- Mock data stores persisted to `localStorage`, with a one-click reset.
- Production build splits heavy vendors into separate chunks; routes are lazy-loaded.
