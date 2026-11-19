/** Demo identity. Replace with your auth/session layer. */
export const currentUser = {
  id: 'usr_01',
  name: 'Alex Morgan',
  firstName: 'Alex',
  email: 'alex@aether.app',
  role: 'Workspace owner',
} as const

export interface Workspace {
  id: string
  name: string
  plan: string
}

export const workspaces: readonly [Workspace, ...Workspace[]] = [
  { id: 'aether-hq', name: 'Aether HQ', plan: 'Pro plan' },
  { id: 'northwind', name: 'Northwind Labs', plan: 'Team plan' },
  { id: 'personal', name: 'Personal', plan: 'Free plan' },
]
