export type RoleId = 'owner' | 'admin' | 'developer' | 'viewer'

export interface Role {
  id: RoleId
  label: string
  description: string
}

export const ROLES: readonly Role[] = [
  { id: 'owner', label: 'Owner', description: 'Full control, including billing and deleting the workspace.' },
  { id: 'admin', label: 'Admin', description: 'Manages people, projects and settings.' },
  { id: 'developer', label: 'Developer', description: 'Creates and edits projects and customer data.' },
  { id: 'viewer', label: 'Viewer', description: 'Read-only access to dashboards and reports.' },
]

export interface Member {
  id: string
  name: string
  email: string
  role: RoleId
  status: 'active' | 'pending'
  /** Epoch ms, or null for pending invitations. */
  lastActive: number | null
}

export interface Permission {
  id: string
  label: string
  group: string
}

export const PERMISSIONS: readonly Permission[] = [
  { id: 'projects.view', label: 'View projects', group: 'Projects' },
  { id: 'projects.edit', label: 'Create and edit projects', group: 'Projects' },
  { id: 'projects.delete', label: 'Delete projects', group: 'Projects' },
  { id: 'customers.view', label: 'View customers', group: 'Customers' },
  { id: 'customers.manage', label: 'Manage customers', group: 'Customers' },
  { id: 'data.export', label: 'Export data', group: 'Customers' },
  { id: 'billing.view', label: 'View billing', group: 'Billing' },
  { id: 'billing.manage', label: 'Manage billing and plans', group: 'Billing' },
  { id: 'team.invite', label: 'Invite members', group: 'Team' },
  { id: 'team.roles', label: 'Change roles', group: 'Team' },
  { id: 'settings.edit', label: 'Edit workspace settings', group: 'Settings' },
]

const ALL = PERMISSIONS.map((p) => p.id)

export const DEFAULT_PERMISSIONS: Record<RoleId, string[]> = {
  owner: ALL,
  admin: ALL.filter((id) => id !== 'billing.manage'),
  developer: ['projects.view', 'projects.edit', 'customers.view', 'data.export', 'billing.view'],
  viewer: ['projects.view', 'customers.view', 'billing.view'],
}

export function buildMembers(): Member[] {
  const ago = (minutes: number) => Date.now() - minutes * 60_000
  return [
    { id: 'm1', name: 'Alex Morgan', email: 'alex@aether.app', role: 'owner', status: 'active', lastActive: ago(2) },
    { id: 'm2', name: 'Priya Nair', email: 'priya@aether.app', role: 'admin', status: 'active', lastActive: ago(18) },
    { id: 'm3', name: 'Jonas Weber', email: 'jonas@aether.app', role: 'developer', status: 'active', lastActive: ago(95) },
    { id: 'm4', name: 'Sofia Reyes', email: 'sofia@aether.app', role: 'developer', status: 'active', lastActive: ago(60 * 5) },
    { id: 'm5', name: 'Kenji Mori', email: 'kenji@aether.app', role: 'developer', status: 'active', lastActive: ago(60 * 26) },
    { id: 'm6', name: 'Amara Okafor', email: 'amara@aether.app', role: 'viewer', status: 'active', lastActive: ago(60 * 24 * 4) },
    { id: 'm7', name: 'Marcus Webb', email: 'marcus@webbworks.com', role: 'viewer', status: 'pending', lastActive: null },
  ]
}
