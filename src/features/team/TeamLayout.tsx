import { useState } from 'react'
import { Outlet, useOutletContext } from 'react-router'
import { UserPlus } from 'lucide-react'
import { PageHeader } from '@/components/layout/PageHeader'
import { SubNav } from '@/components/layout/SubNav'
import { Button } from '@/components/ui'
import { ROUTES } from '@/config/routes'
import type { Member, RoleId } from '@/data/team'
import { InviteTeammateModal } from '@/features/overview/components/InviteTeammateModal'
import { useMockQuery } from '@/hooks/use-mock-query'
import { useTeamStore } from '@/stores/team-store'

export interface TeamContext {
  /** `undefined` while the (simulated) first load is in flight. */
  members?: Member[]
  setRole: (id: string, role: RoleId) => void
  remove: (id: string) => void
  openInvite: () => void
}

export function useTeamContext(): TeamContext {
  return useOutletContext<TeamContext>()
}

const TABS = [
  { label: 'Members', to: ROUTES.team },
  { label: 'Roles & permissions', to: ROUTES.teamRoles },
]

export function TeamLayout() {
  const members = useTeamStore((s) => s.members)
  const setRole = useTeamStore((s) => s.setRole)
  const remove = useTeamStore((s) => s.remove)
  const invite = useTeamStore((s) => s.invite)
  const { isLoading } = useMockQuery(() => true, [], 450)
  const [inviteOpen, setInviteOpen] = useState(false)

  const context: TeamContext = {
    members: isLoading ? undefined : members,
    setRole,
    remove,
    openInvite: () => setInviteOpen(true),
  }

  return (
    <>
      <PageHeader
        title="Team Management"
        description="Control who can access your workspace and what they can do."
        actions={
          <Button variant="primary" onClick={() => setInviteOpen(true)}>
            <UserPlus aria-hidden /> Invite member
          </Button>
        }
      />
      <SubNav className="mt-6" label="Team sections" items={TABS} />
      <div className="mt-6">
        <Outlet context={context} />
      </div>
      <InviteTeammateModal open={inviteOpen} onOpenChange={setInviteOpen} onInvite={({ email, role }) => invite(email, role)} />
    </>
  )
}
