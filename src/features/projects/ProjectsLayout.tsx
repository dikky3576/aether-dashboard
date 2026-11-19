import { useState } from 'react'
import { Outlet, useOutletContext, useParams } from 'react-router'
import { Plus } from 'lucide-react'
import { PageHeader } from '@/components/layout/PageHeader'
import { SubNav } from '@/components/layout/SubNav'
import { Button } from '@/components/ui'
import { ROUTES } from '@/config/routes'
import type { Project } from '@/data/projects'
import { CreateProjectModal } from '@/features/overview/components/CreateProjectModal'
import { useMockQuery } from '@/hooks/use-mock-query'
import { useProjectsStore } from '@/stores/projects-store'

export interface ProjectsContext {
  /** `undefined` while the (simulated) first load is in flight. */
  projects?: Project[]
  openCreate: () => void
}

export function useProjectsContext(): ProjectsContext {
  return useOutletContext<ProjectsContext>()
}

const TABS = [
  { label: 'All projects', to: ROUTES.projects },
  { label: 'Board', to: ROUTES.projectsBoard },
]

export function ProjectsLayout() {
  const { projectId } = useParams()
  const projects = useProjectsStore((s) => s.projects)
  const addProject = useProjectsStore((s) => s.addProject)
  const { isLoading } = useMockQuery(() => true, [], 450)
  const [createOpen, setCreateOpen] = useState(false)

  const context: ProjectsContext = {
    projects: isLoading ? undefined : projects,
    openCreate: () => setCreateOpen(true),
  }

  return (
    <>
      {!projectId && (
        <>
          <PageHeader
            title="Projects"
            description="Track progress, budget and deadlines across your work."
            actions={
              <Button variant="primary" onClick={() => setCreateOpen(true)}>
                <Plus aria-hidden /> New project
              </Button>
            }
          />
          <SubNav className="mt-6" label="Project views" items={TABS} />
        </>
      )}
      <div className={projectId ? undefined : 'mt-6'}>
        <Outlet context={context} />
      </div>
      <CreateProjectModal
        open={createOpen}
        onOpenChange={setCreateOpen}
        onCreate={({ name, description }) => addProject({ name, description })}
      />
    </>
  )
}
