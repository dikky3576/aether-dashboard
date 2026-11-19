# Customization guide

## 1. Rename the product

- Set `VITE_APP_NAME` in `.env` (used in the sidebar, auth pages, error pages and tab titles).
- Edit `tagline` in `src/config/site.ts`.
- Update `<title>` and the meta tags in `index.html`.
- Replace `public/favicon.svg` and the logo mark in `src/components/brand/BrandLogo.tsx` (`BrandMark`).

## 2. Change the colours

Open `src/styles/tokens.css`.

- **Brand:** `--brand-violet`, `--brand-purple`, `--brand-blue`, `--brand-cyan` and the two gradients (`--gradient-brand`, `--gradient-brand-soft`).
- **UI accent:** `--accent`, `--accent-hover`, `--accent-soft`, `--accent-text`, `--ring` — defined once for light (`:root`) and once for dark (`.dark`).
- **Surfaces and text:** `--background`, `--surface`, `--foreground`, `--muted`, `--border` …
- **Charts:** `--chart-1` … `--chart-4`, `--chart-grid`, `--chart-axis`.

After changing the accent, check text contrast: `--accent-text` is used for brand-coloured text on surfaces and should keep at least 4.5:1 contrast.

Radii (`--r-control`, `--r-card`), the sidebar width and the header height are in the same file.

## 3. Change fonts

Geist is installed through `@fontsource-variable/geist`. To switch fonts, install another fontsource package,
import it in `src/styles/index.css`, and update `--font-sans` in the `@theme inline` block.

## 4. Add a page

1. Add a path to `src/config/routes.ts`.
2. Create the page under `src/features/<module>/`.
3. Register it in `src/app/router.tsx`, using the lazy pattern already used there:
   `{ path: ROUTES.reports, lazy: async () => ({ Component: (await import('@/features/...')).MyPage }) }`.
4. To show it in the sidebar, command palette and breadcrumbs, add an entry to `src/config/navigation.ts`.
   Sub-page labels for breadcrumbs live in `SUB_LABELS` in `src/hooks/use-route-meta.ts`.

Put static routes before dynamic ones (`/projects/board` before `/projects/:projectId`).

## 5. Remove a module

Delete its `src/features/<module>` folder, its route entries in `router.tsx`, its item in `navigation.ts`, and (if it has one)
its store in `src/stores/`. Run `npm run typecheck` to find leftover references.

## 6. Use the components

Everything in `src/components/ui` is exported from `@/components/ui`. Open `/design-system` in the running app to see each
component with its variants and states. Typical form field:

```tsx
<Field label="Email" required error={errors.email?.message}>
  {(control) => <Input type="email" {...control} {...register('email')} />}
</Field>
```

`Field` wires the label, hint, error message and `aria-describedby` for you.

## 7. Charts

`TrendChart` (line/area) and `StackedBarChart` take `data`, `series`, a value formatter and a text `summary` for screen readers.
Series colours should reference the chart tokens, e.g. `color: 'var(--chart-1)'`.
