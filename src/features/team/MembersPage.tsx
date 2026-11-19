import { useMemo, useState } from 'react'
import { toast } from 'sonner'
import { Trash2, UserSearch } from 'lucide-react'
import {
  Avatar,
  Badge,
  Button,
  Card,
  ConfirmDialog,
  DataTable,
  EmptyState,
  FilterDropdown,
  Select,
  SearchInput,
  type DataTableColumn,
} from '@/components/ui'
import { ROLES, type Member, type RoleId } from '@/data/team'
import { useTeamContext } from '@/features/team/TeamLayout'
import { useQueryState } from '@/hooks/use-query-state'
import { formatRelativeTime } from '@/lib/format'

const ROLE_FILTER = [{ value: 'all', label: 'All roles' }, ...ROLES.map((r) => ({ value: r.id, label: r.label }))]

export function MembersPage() {
  const { members, setRole, remove, openInvite } = useTeamContext()
  const [query, setQuery] = useQueryState('q')
  const [role, setRoleFilter] = useQueryState('role', 'all')
  const [toRemove, setToRemove] = useState<Member | null>(null)

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase()
    return (members ?? []).filter(
      (m) => (role === 'all' || m.role === role) && (!q || m.name.toLowerCase().includes(q) || m.email.toLowerCase().includes(q)),
    )
  }, [members, query, role])

  const columns: DataTableColumn<Member>[] = [
    {
      id: 'name',
      header: 'Member',
      sortValue: (r) => r.name,
      cell: (r) => (
        <span className="flex min-w-0 items-center gap-3">
          <Avatar name={r.name} size="sm" />
          <span className="min-w-0">
            <span className="block truncate font-medium">{r.name}</span>
            <span className="block truncate text-caption text-muted">{r.email}</span>
          </span>
        </span>
      ),
    },
    {
      id: 'role',
      header: 'Role',
      sortValue: (r) => r.role,
      className: 'w-44',
      cell: (r) =>
        r.role === 'owner' ? (
          <Badge variant="accent">Owner</Badge>
        ) : (
          <Select
            size="sm"
            aria-label={`Role for ${r.name}`}
            value={r.role}
            options={ROLES.filter((x) => x.id !== 'owner').map((x) => ({ value: x.id, label: x.label }))}
            onValueChange={(value) => {
              setRole(r.id, value as RoleId)
              toast.success(`${r.name} is now ${ROLES.find((x) => x.id === value)?.label}`)
            }}
          />
        ),
    },
    {
      id: 'status',
      header: 'Status',
      hideBelow: 'sm',
      sortValue: (r) => r.status,
      cell: (r) => (
        <Badge variant={r.status === 'active' ? 'success' : 'warning'} dot>
          {r.status === 'active' ? 'Active' : 'Invited'}
        </Badge>
      ),
    },
    {
      id: 'active',
      header: 'Last active',
      hideBelow: 'md',
      sortValue: (r) => r.lastActive ?? 0,
      cell: (r) => <span className="text-muted">{r.lastActive ? formatRelativeTime(r.lastActive) : '—'}</span>,
    },
    {
      id: 'actions',
      header: 'Actions',
      srOnlyHeader: true,
      align: 'right',
      cell: (r) =>
        r.role === 'owner' ? null : (
          <Button variant="ghost" size="icon-sm" aria-label={`Remove ${r.name}`} onClick={() => setToRemove(r)}>
            <Trash2 aria-hidden />
          </Button>
        ),
    },
  ]

  return (
    <Card padding="none">
      <div className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:p-5">
        <SearchInput className="sm:max-w-xs" value={query} onValueChange={setQuery} placeholder="Search members…" aria-label="Search members" />
        <FilterDropdown label="Role" value={role} onValueChange={setRoleFilter} options={ROLE_FILTER} />
      </div>
      <DataTable
        caption="Team members"
        columns={columns}
        data={rows}
        getRowId={(r) => r.id}
        loading={!members}
        pageSize={8}
        initialSort={{ columnId: 'name', direction: 'asc' }}
        empty={
          <EmptyState
            icon={UserSearch}
            title="No members found"
            description="Try another search, or invite someone new."
            action={<Button variant="primary" onClick={openInvite}>Invite member</Button>}
          />
        }
      />
      <ConfirmDialog
        open={toRemove !== null}
        onOpenChange={(open) => !open && setToRemove(null)}
        tone="danger"
        title="Remove member?"
        description={`${toRemove?.name ?? 'This member'} will lose access to the workspace immediately.`}
        confirmLabel="Remove"
        onConfirm={async () => {
          await new Promise((resolve) => window.setTimeout(resolve, 500))
          if (toRemove) {
            remove(toRemove.id)
            toast.success(`${toRemove.name} removed`)
          }
        }}
      />
    </Card>
  )
}
