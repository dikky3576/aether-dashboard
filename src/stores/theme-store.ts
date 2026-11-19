import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import {
  THEME_STORAGE_KEY,
  applyTheme,
  resolveTheme,
  type ThemePreference,
} from '@/lib/theme'

interface ThemeState {
  theme: ThemePreference
  setTheme: (theme: ThemePreference) => void
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      theme: 'system',
      setTheme: (theme) => {
        applyTheme(resolveTheme(theme), true)
        set({ theme })
      },
    }),
    {
      name: THEME_STORAGE_KEY,
      partialize: (state) => ({ theme: state.theme }),
    },
  ),
)
