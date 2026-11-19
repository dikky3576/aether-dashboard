/** Product name and copy used across the app. Set VITE_APP_NAME in `.env` to re-brand the text. */
export const siteConfig = {
  name: (import.meta.env.VITE_APP_NAME as string | undefined)?.trim() || 'Aether',
  tagline: 'Universal SaaS dashboard template',
  version: '1.0.0',
} as const
