# Aether Dashboard

A premium, universal SaaS dashboard template built with React 19, TypeScript, Vite and Tailwind CSS v4.
Light and dark themes, a complete design system, 25+ ready pages, and a clean mock-data layer you can replace with your own API.

> **Demo template.** Sign-in, payments and data storage are demonstrations. Nothing is sent to a server.
> See [docs/BACKEND-INTEGRATION.md](docs/BACKEND-INTEGRATION.md) to connect your backend.

---

## Table of contents

1. [Installation](#installation)
2. [Run, build and preview](#run-build-and-preview)
3. [Configuration](#configuration)
4. [Deploying](#deploying)
5. [Troubleshooting](#troubleshooting)
6. [What's included](#whats-included)
7. [Project structure](#project-structure)
8. [Customization](#customization)
9. [Accessibility](#accessibility)
10. [Credits and license](#credits-and-license)

---

## Installation

### 1. Requirements

| Tool | Version | Check with |
| --- | --- | --- |
| Node.js | **20.19 or newer** (22 LTS recommended) | `node -v` |
| npm | 10 or newer (comes with Node.js) | `npm -v` |

Download Node.js from [nodejs.org](https://nodejs.org) if you don't have it. Any code editor works; VS Code is recommended.
You do **not** need a database, a PHP server (such as Laragon or XAMPP) or any API key to run the template.

### 2. Get the files

Unzip the package you downloaded into a folder of your choice, for example:

- Windows: `C:\projects\aether-dashboard`
- macOS / Linux: `~/projects/aether-dashboard`

The folder should contain `package.json`, `index.html` and a `src` folder directly inside it.
If you see a second folder with the same name inside, open that one instead.

### 3. Install dependencies

Open a terminal **inside the project folder**.

- **Windows:** open the folder in File Explorer, click the address bar, type `powershell`, and press Enter. Or in VS Code use *Terminal → New Terminal*.
- **macOS / Linux:** `cd ~/projects/aether-dashboard`

Then run:

```bash
npm install
```

This downloads everything the template needs into `node_modules/`. It takes about a minute and needs an internet connection.
Warnings about "deprecated" packages are normal. If it ends with an **error**, see [Troubleshooting](#troubleshooting).

### 4. (Optional) Set the product name

Copy `.env.example` to `.env` and edit it:

```bash
# Windows (PowerShell)
Copy-Item .env.example .env

# macOS / Linux
cp .env.example .env
```

```ini
VITE_APP_NAME=Your Product Name
VITE_API_BASE_URL=
```

### 5. Start the development server

```bash
npm run dev
```

Open **http://localhost:5173** in your browser. You'll land on the Overview page. Changes you make to the code appear instantly.
Stop the server with `Ctrl + C`.

You're done. To see everything the template offers, press `Ctrl + K` (or `⌘ K` on a Mac) for the command palette,
or open `/design-system` for every component.

---

## Run, build and preview

| Command | What it does |
| --- | --- |
| `npm run dev` | Starts the development server at http://localhost:5173 |
| `npm run build` | Type-checks the code and creates the production site in `dist/` |
| `npm run preview` | Serves the `dist/` build locally so you can test it (http://localhost:4173) |
| `npm run typecheck` | Type-checks only, without building |

Always run `npm run build` once before deploying. It must finish without errors.

---

## Configuration

| Setting | Where | Notes |
| --- | --- | --- |
| Product name | `VITE_APP_NAME` in `.env` | Sidebar, auth pages, error pages, tab titles |
| Tagline, version | `src/config/site.ts` | |
| Page title and meta tags | `index.html` | |
| Colours, radii, shadows, motion | `src/styles/tokens.css` | Edit this one file to re-brand |
| Sidebar menu | `src/config/navigation.ts` | |
| Route paths | `src/config/routes.ts` | |
| API address (when you add one) | `VITE_API_BASE_URL` in `.env` | Read with `import.meta.env.VITE_API_BASE_URL` |

Restart `npm run dev` after editing `.env`. Variables must start with `VITE_` to be available in the browser, and
**must never contain secrets**, because they are visible to anyone who opens the site.

---

## Deploying

`npm run build` produces a static site in the `dist/` folder. Upload the **contents** of `dist/` to any static host.

Because the app uses client-side routing, your host must **serve `index.html` for unknown paths**, otherwise reloading a page such as
`/customers` returns a 404. Examples:

**Netlify** — create `public/_redirects` containing:

```
/*    /index.html   200
```

**Vercel** — create `vercel.json`:

```json
{ "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }] }
```

**Nginx:**

```nginx
location / {
  try_files $uri /index.html;
}
```

**Apache (`.htaccess` next to `index.html`):**

```apache
RewriteEngine On
RewriteBase /
RewriteRule ^index\.html$ - [L]
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule . /index.html [L]
```

**Hosting in a sub-folder** (for example `https://example.com/app/`): set `base: '/app/'` in `vite.config.ts` and
pass `{ basename: '/app' }` as the second argument to `createBrowserRouter` in `src/app/router.tsx`.

---

## Troubleshooting

| Problem | Fix |
| --- | --- |
| `'npm' is not recognized` / `command not found` | Node.js isn't installed or the terminal was opened before installing it. Install Node.js, then open a **new** terminal. |
| `Unsupported engine` or Vite refuses to start | Your Node.js is too old. Check with `node -v` and upgrade to 20.19 or newer. |
| `npm install` fails with `EACCES` / permission errors | Don't use `sudo`. Fix npm's permissions, or install Node with a version manager (nvm, fnm). |
| `npm install` fails with network errors (`ETIMEDOUT`, `ECONNRESET`) | Check your connection, proxy or VPN, then run it again. |
| Errors mentioning missing modules such as `@radix-ui/...` or `class-variance-authority` | Dependencies weren't installed. Run `npm install` again in the project folder. |
| `Port 5173 is already in use` | Another dev server is running. Close it, or run `npm run dev -- --port 3000`. |
| Page is blank after deploying | The host isn't set up for single-page routing, or the site is in a sub-folder. See [Deploying](#deploying). |
| Weird behaviour after changing `.env` | Stop the dev server (`Ctrl + C`) and start it again. |
| Strange old data in tables | Data is saved in your browser. Use **Settings → General → Reset demo data**, or clear the site's storage. |
| Need a clean reinstall | Delete the `node_modules` folder and `package-lock.json`, then run `npm install`. |

---

## What's included

| Area | Pages |
| --- | --- |
| Overview | KPI cards, revenue chart, plan performance, recent transactions, activity, quick actions |
| Analytics | Overview, Revenue (MRR / ARR), Performance reports |
| Projects | Project list, detail page, task board |
| Customers | Searchable table, detail page, create / edit / delete |
| Finance | Transactions, Invoices, Subscription & Billing |
| Team | Members, Roles & permissions matrix |
| Settings | General, Profile, Security, Appearance, Notifications |
| Workspace | Reports (CSV export), Integrations, Notifications inbox |
| Auth | Login, Register, Forgot password, Reset password |
| Utility | 403, 404, 500, route error boundary, loading states |
| Design system | `/design-system` — every component and token in one place |

Also: command palette that searches pages, customers, projects and people; collapsible sidebar; mobile drawer; toasts; CSV export;
filters and search kept in the URL.

---

## Project structure

```
src/
  app/          App entry, providers, router (lazy-loaded routes)
  config/       routes.ts, navigation.ts, site.ts
  components/
    ui/         Design-system primitives (Button, Input, DataTable, Modal …)
    layout/     AppShell, sidebar, header, command palette, page header
    charts/     Recharts wrappers (TrendChart, StackedBarChart, Sparkline …)
    brand/      Logo mark
  features/     One folder per module (analytics, projects, customers, finance, team, settings …)
  data/         Mock data builders — replace with API calls
  stores/       Zustand stores: theme, UI, notifications, and the mock "database" (customers, projects, team)
  hooks/        Shared hooks
  lib/          Pure utilities (cn, format, export, theme)
  styles/       tokens.css (source of truth), index.css (Tailwind bridge), animations.css
docs/           Customization and backend-integration guides
```

---

## Customization

- **Re-brand, add or remove pages, use components:** [docs/CUSTOMIZATION.md](docs/CUSTOMIZATION.md)
- **Replace mock data, add real sign-in, connect payments:** [docs/BACKEND-INTEGRATION.md](docs/BACKEND-INTEGRATION.md)

Customers, projects, tasks and team members are stored in your browser (`localStorage`) so create, edit and delete survive reloads.
Transactions, invoices and analytics are generated by `src/data/*.ts`.

---

## Accessibility

- Keyboard-navigable throughout, with a visible focus ring and a "Skip to content" link.
- Dialogs, menus, selects, tabs, switches and checkboxes are built on Radix UI primitives.
- Forms have visible labels, inline errors announced to screen readers, and `aria-invalid` states.
- Charts include a text summary, and colour is never the only signal.
- All motion respects `prefers-reduced-motion`.
- Colours are chosen to target WCAG AA contrast in both themes. Re-check contrast whenever you change the brand tokens.

Supported browsers: current versions of Chrome, Edge, Firefox and Safari.

---

## Credits and license

- Geist and Geist Mono fonts (SIL Open Font License), Lucide icons (ISC License).
- No third-party logos or brand assets are used. Integration cards use generic names.
- Open-source dependencies keep their own licenses; see `node_modules/<package>/LICENSE`.

Use of this template is governed by [LICENSE.md](LICENSE.md). Version history: [CHANGELOG.md](CHANGELOG.md).
