import type { ReactNode } from 'react'
import { MotionConfig } from 'motion/react'
import { Toaster } from 'sonner'
import { useTheme, useThemeSync } from '@/hooks/use-theme'

function ThemedToaster() {
  const { resolved } = useTheme()
  return (
    <Toaster
      theme={resolved}
      position="bottom-right"
      toastOptions={{
        style: {
          background: 'var(--surface-elevated)',
          border: '1px solid var(--border)',
          color: 'var(--foreground)',
          borderRadius: 'var(--r-card)',
          boxShadow: 'var(--elevation-overlay)',
          fontSize: '0.875rem',
        },
      }}
    />
  )
}

/** Global providers. Add data-fetching or i18n providers here later. */
export function AppProviders({ children }: { children: ReactNode }) {
  useThemeSync()
  return (
    // "user" makes every Motion animation respect prefers-reduced-motion.
    <MotionConfig reducedMotion="user">
      {children}
      <ThemedToaster />
    </MotionConfig>
  )
}
