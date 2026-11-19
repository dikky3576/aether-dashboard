import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { DEFAULT_PERMISSIONS, buildMembers, type Member, type RoleId } from '@/data/team'

interface TeamState {
  members: Member[]
  permissions: Record<RoleId, string[]>
  invite: (email: string, role: RoleId) => void
  setRole: (id: string, role: RoleId) => void
  remove: (id: string) => void
  setPermissions: (permissions: Record<RoleId, string[]>) => void
  resetPermissions: () => void
  reset: () => void
}

/** Mock "database" for members and the role/permission matrix. Persisted to localStorage. */
export const useTeamStore = create<TeamState>()(
  persist(
    (set) => ({
      members: buildMembers(),
      permissions: structuredClone(DEFAULT_PERMISSIONS),
      invite: (email, role) =>
        set((s) => ({
          members: [
            {
              id: `invite-${Date.now().toString(36)}`,
              name: email.split('@')[0] ?? email,
              email,
              role,
              status: 'pending',
              lastActive: null,
            },
            ...s.members,
          ],
        })),
      setRole: (id, role) => set((s) => ({ members: s.members.map((m) => (m.id === id ? { ...m, role } : m)) })),
      remove: (id) => set((s) => ({ members: s.members.filter((m) => m.id !== id) })),
      setPermissions: (permissions) => set({ permissions }),
      resetPermissions: () => set({ permissions: structuredClone(DEFAULT_PERMISSIONS) }),
      reset: () => set({ members: buildMembers(), permissions: structuredClone(DEFAULT_PERMISSIONS) }),
    }),
    {
      name: 'aether-data-team',
      version: 1,
      partialize: (s) => ({ members: s.members, permissions: s.permissions }),
    },
  ),
)
