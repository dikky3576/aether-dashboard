import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { workspaces } from '@/data/user'

interface UiState {
  /** Desktop sidebar is icon-only. Persisted. */
  sidebarCollapsed: boolean
  /** Mobile / tablet drawer. Not persisted. */
  mobileNavOpen: boolean
  commandOpen: boolean
  workspaceId: string
  toggleSidebar: () => void
  setMobileNavOpen: (open: boolean) => void
  setCommandOpen: (open: boolean) => void
  setWorkspaceId: (id: string) => void
}

export const useUiStore = create<UiState>()(
  persist(
    (set) => ({
      sidebarCollapsed: false,
      mobileNavOpen: false,
      commandOpen: false,
      workspaceId: workspaces[0].id,
      toggleSidebar: () => set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),
      setMobileNavOpen: (mobileNavOpen) => set({ mobileNavOpen }),
      setCommandOpen: (commandOpen) => set({ commandOpen }),
      setWorkspaceId: (workspaceId) => set({ workspaceId }),
    }),
    {
      name: 'aether-ui',
      partialize: (s) => ({ sidebarCollapsed: s.sidebarCollapsed, workspaceId: s.workspaceId }),
    },
  ),
)
