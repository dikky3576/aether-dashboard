import { useMemo } from 'react'
import { Link } from 'react-router'
import { FolderSearch, Plus } from 'lucide-react'
import { Avatar, Button, Card, EmptyState, FilterDropdown, Progress, SearchInput, Skeleton } from '@/components/ui'
import { projectPath } from '@/config/routes'
import { PROJECT_STATUS_LABEL, type Project } from '@/data/projects'
import { useProjectsContext } from '@/features/projects/ProjectsLayout'
import { ProjectStatusBadge, formatShortDate } from '@/features/projects/project-ui'
import { useQueryState } from '@/hooks/use-query-state'
import { useProjectsStore } from '@/stores/projects-store'
import { formatCurrency } from '@/lib/format'

const STATUS_OPTIONS = [
  { value: 'all', label: 'All statuses' },
  ...Object.entries(PROJECT_STATUS_LABEL).map(([value, label]) => ({ value, label })),
]

function budgetUsed(project: Project): number {
  if (project.status === 'completed') return 100
  return Math.min(100, Math.round((project.spent / Math.max(project.budget, 1)) * 100))
}

function ProjectCard({ project }: { project: Project }) {
  const progress = budgetUsed(project)
  const taskCount = useProjectsStore((s) => s.tasks.filter((t) => t.projectId === project.id).length)
  return (
    <Card padding="none" className="transition-shadow duration-200 hover:shadow-overlay">
      <Link
        to={projectPath(project.id)}
        className="flex h-full flex-col rounded-card p-5 outline-offset-0 sm:p-6"
        aria-label={`${project.name} — ${PROJECT_STATUS_LABEL[project.status]}`}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="truncate text-card font-medium">{project.name}</h3>
            <p className="mt-0.5 truncate text-caption text-muted">{project.client}</p>
          </div>
          <ProjectStatusBadge status={project.status} />
        </div>

        <p className="mt-3 line-clamp-2 text-body text-muted">{project.description}</p>

        <div className="mt-5">
          <div className="mb-1.5 flex justify-between text-caption text-muted">
            <span>Budget used</span>
            <span className="tabular font-medium text-foreground">{progress}%</span>
          </div>
          <Progress
            value={progress}
            tone={project.status === 'at-risk' ? 'warning' : project.status === 'completed' ? 'success' : 'accent'}
            label={`${project.name} budget used`}
          />
          <p className="tabular mt-1.5 text-caption text-muted">
            {formatCurrency(project.spent, { compact: true })} of {formatCurrency(project.budget, { compact: true })}
          </p>
        </div>

        <div className="mt-5 flex items-center justify-between border-t border-border pt-4">
          <div className="flex -space-x-2" aria-label={`${project.members.length} members`}>
            {project.members.slice(0, 4).map((name) => (
              <Avatar key={name} name={name} size="xs" className="ring-2 ring-surface" />
            ))}
          </div>
          <span className="text-caption text-muted">
            {taskCount} {taskCount === 1 ? 'task' : 'tasks'} · Due {formatShortDate(project.due)}
          </span>
        </div>
      </Link>
    </Card>
  )
}

export function ProjectsListPage() {
  const { projects, openCreate } = useProjectsContext()
  const [query, setQuery] = useQueryState('q')
  const [status, setStatus] = useQueryState('status', 'all')

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return (projects ?? []).filter(
      (p) =>
        (status === 'all' || p.status === status) &&
        (!q || p.name.toLowerCase().includes(q) || p.client.toLowerCase().includes(q)),
    )
  }, [projects, query, status])

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row">
        <SearchInput
          className="sm:max-w-xs"
          value={query}
          onValueChange={setQuery}
          placeholder="Search projects…"
          aria-label="Search projects"
        />
        <FilterDropdown label="Status" value={status} onValueChange={setStatus} options={STATUS_OPTIONS} />
      </div>

      {!projects ? (
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }, (_, i) => (
            <Skeleton key={i} className="h-60 w-full rounded-card" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <Card>
          <EmptyState
            icon={FolderSearch}
            title="No projects found"
            description="Try a different search or clear the status filter."
            action={
              <Button variant="primary" onClick={openCreate}>
                <Plus aria-hidden /> New project
              </Button>
            }
          />
        </Card>
      ) : (
        <>
          <p className="sr-only" role="status">
            {filtered.length} projects shown
          </p>
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {filtered.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        </>
      )}
    </div>
  )
}
