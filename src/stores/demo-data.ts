import { useCustomersStore } from '@/stores/customers-store'
import { useProjectsStore } from '@/stores/projects-store'
import { useTeamStore } from '@/stores/team-store'

/** Restores every mock collection to its original seed data. */
export function resetDemoData(): void {
  useCustomersStore.getState().reset()
  useProjectsStore.getState().reset()
  useTeamStore.getState().reset()
}
