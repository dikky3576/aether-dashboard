import { useEffect } from 'react'
import { useThemeStore } from '@/stores/theme-store'
import { applyTheme, resolveTheme, subscribeToSystemTheme, type ResolvedTheme } from '@/lib/theme'

/**
 * Mount once (see ThemeProvider). Keeps <html> in sync with the stored preference
 * and follows OS changes while the preference is "system".
 */
export function useThemeSync(): void {
  const theme = useThemeStore((s) => s.theme)

  useEffect(() => {
    applyTheme(resolveTheme(theme))
    if (theme !== 'system') return
    return subscribeToSystemTheme(() => applyTheme(resolveTheme('system'), true))
  }, [theme])
}

/** Public hook for components: preference, resolved value, and setter. */
export function useTheme() {
  const theme = useThemeStore((s) => s.theme)
  const setTheme = useThemeStore((s) => s.setTheme)
  const resolved: ResolvedTheme = resolveTheme(theme)
  return { theme, resolved, setTheme }
}
