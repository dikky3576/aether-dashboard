import { useState } from 'react'
import { toast } from 'sonner'
import { Lock } from 'lucide-react'
import { Button, Card, Checkbox } from '@/components/ui'
import { PERMISSIONS, ROLES, type RoleId } from '@/data/team'
import { useTeamStore } from '@/stores/team-store'

export function RolesPage() {
  const saved = useTeamStore((s) => s.permissions)
  const setPermissions = useTeamStore((s) => s.setPermissions)
  const resetPermissions = useTeamStore((s) => s.resetPermissions)
  // Edits are staged locally until the user saves them.
  const [draft, setDraft] = useState<Record<RoleId, string[]> | null>(null)
  const matrix = draft ?? saved
  const dirty = draft !== null

  function toggle(role: RoleId, permission: string, checked: boolean) {
    setDraft((prev) => {
      const base = prev ?? saved
      return {
        ...base,
        [role]: checked ? [...base[role], permission] : base[role].filter((id) => id !== permission),
      }
    })
  }

  function reset() {
    setDraft(null)
  }

  function save() {
    if (draft) setPermissions(draft)
    setDraft(null)
    toast.success('Permissions saved')
  }

  function restoreDefaults() {
    resetPermissions()
    setDraft(null)
    toast.success('Default permissions restored')
  }

  const groups = [...new Set(PERMISSIONS.map((p) => p.group))]

  return (
    <div className="space-y-5">
      <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {ROLES.map((role) => (
          <li key={role.id}>
            <Card className="h-full">
              <h3 className="text-card font-medium">{role.label}</h3>
              <p className="mt-1 text-body text-muted">{role.description}</p>
            </Card>
          </li>
        ))}
      </ul>

      <Card padding="none">
        <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-4 sm:px-6">
          <div>
            <h3 className="text-card font-medium">Permission matrix</h3>
            <p className="mt-0.5 flex items-center gap-1.5 text-caption text-muted">
              <Lock className="size-3" aria-hidden /> The Owner role always has every permission.
            </p>
          </div>
          <div className="flex gap-2">
            <Button onClick={dirty ? reset : restoreDefaults}>{dirty ? 'Discard' : 'Restore defaults'}</Button>
            <Button variant="primary" onClick={save} disabled={!dirty}>
              Save changes
            </Button>
          </div>
        </div>

        <div role="region" aria-label="Permission matrix" tabIndex={0} className="overflow-x-auto">
          <table className="w-full min-w-[34rem] border-collapse text-left text-body">
            <caption className="sr-only">Which roles have which permissions</caption>
            <thead>
              <tr className="border-y border-border bg-subtle/60">
                <th scope="col" className="h-10 px-5 text-caption font-medium text-muted sm:px-6">
                  Permission
                </th>
                {ROLES.map((role) => (
                  <th key={role.id} scope="col" className="h-10 px-4 text-center text-caption font-medium text-muted">
                    {role.label}
                  </th>
                ))}
              </tr>
            </thead>
            {groups.map((group) => (
              <tbody key={group}>
                <tr>
                  <th colSpan={ROLES.length + 1} scope="colgroup" className="bg-subtle/30 px-5 py-2 text-left text-caption font-semibold sm:px-6">
                    {group}
                  </th>
                </tr>
                {PERMISSIONS.filter((p) => p.group === group).map((permission) => (
                  <tr key={permission.id} className="border-b border-border last:border-0">
                    <th scope="row" className="h-12 px-5 text-left font-normal sm:px-6">
                      {permission.label}
                    </th>
                    {ROLES.map((role) => (
                      <td key={role.id} className="px-4 text-center">
                        <Checkbox
                          aria-label={`${role.label} can ${permission.label.toLowerCase()}`}
                          checked={matrix[role.id].includes(permission.id)}
                          disabled={role.id === 'owner'}
                          onCheckedChange={(value) => toggle(role.id, permission.id, value === true)}
                        />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            ))}
          </table>
        </div>
      </Card>
    </div>
  )
}
