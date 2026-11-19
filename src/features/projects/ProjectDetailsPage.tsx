import { useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router'
import { toast } from 'sonner'
import { ArrowLeft, CalendarClock, CircleDollarSign, ListChecks, ListPlus, Pencil, Trash2, Users } from 'lucide-react'
import { PageHeader } from '@/components/layout/PageHeader'
import {
  Avatar,
  Badge,
  Button,
  Card,
  ConfirmDialog,
  DataTable,
  EmptyState,
  Progress,
  Skeleton,
  StatCard,
  type BadgeVariant,
  type DataTableColumn,
} from '@/components/ui'
import { ROUTES } from '@/config/routes'
import { TASK_COLUMNS, progressOf, type Task } from '@/data/projects'
import { ProjectFormModal } from '@/features/projects/ProjectFormModal'
import { useProjectsContext } from '@/features/projects/ProjectsLayout'
import { PriorityBadge, ProjectStatusBadge, formatFullDate, formatShortDate } from '@/features/projects/project-ui'
import { TaskFormModal } from '@/features/projects/TaskFormModal'
import { formatCurrency } from '@/lib/format'
import { useProjectsStore } from '@/stores/projects-store'

const TASK_VARIANT: Record<Task['status'], BadgeVariant> = {
  todo: 'neutral',
  'in-progress': 'accent',
  review: 'warning',
  done: 'success',
}

const PRIORITY_RANK = { high: 3, medium: 2, low: 1 } as const

export function ProjectDetailsPage() {
  const { projectId } = useParams()
  const navigate = useNavigate()
  const { projects } = useProjectsContext()
  const allTasks = useProjectsStore((s) => s.tasks)
  const removeTask = useProjectsStore((s) => s.removeTask)
  const removeProject = useProjectsStore((s) => s.removeProject)

  const [editOpen, setEditOpen] = useState(false)
  const [taskOpen, setTaskOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)

  const project = projects?.find((p) => p.id === projectId)
  const tasks = useMemo(() => allTasks.filter((t) => t.projectId === projectId), [allTasks, projectId])

  const columns: DataTableColumn<Task>[] = [
    { id: 'title', header: 'Task', sortValue: (r) => r.title, cell: (r) => <span className="font-medium">{r.title}</span> },
    {
      id: 'status',
      header: 'Status',
      sortValue: (r) => r.status,
      cell: (r) => (
        <Badge variant={TASK_VARIANT[r.status]} dot>
          {TASK_COLUMNS.find((c) => c.id === r.status)?.label}
        </Badge>
      ),
    },
    { id: 'priority', header: 'Priority', hideBelow: 'sm', sortValue: (r) => PRIORITY_RANK[r.priority], cell: (r) => <PriorityBadge priority={r.priority} /> },
    {
      id: 'assignee',
      header: 'Assignee',
      hideBelow: 'md',
      sortValue: (r) => r.assignee,
      cell: (r) => (
        <span className="flex items-center gap-2">
          <Avatar name={r.assignee} size="xs" /> {r.assignee}
        </span>
      ),
    },
    { id: 'due', header: 'Due', align: 'right', hideBelow: 'sm', sortValue: (r) => new Date(r.due).getTime(), cell: (r) => <span className="tabular text-muted">{formatShortDate(r.due)}</span> },
    {
      id: 'actions',
      header: 'Actions',
      srOnlyHeader: true,
      align: 'right',
      cell: (r) => (
        <Button
          variant="ghost"
          size="icon-sm"
          aria-label={`Delete “${r.title}”`}
          onClick={() => {
            removeTask(r.id)
            toast.success('Task deleted')
          }}
        >
          <Trash2 aria-hidden />
        </Button>
      ),
    },
  ]

  if (!projects) {
    return (
      <div className="space-y-5">
        <Skeleton className="h-10 w-64" />
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }, (_, i) => (
            <Skeleton key={i} className="h-40 w-full rounded-card" />
          ))}
        </div>
      </div>
    )
  }

  if (!project) {
    return (
      <Card>
        <EmptyState
          title="Project not found"
          description="It may have been removed, or the link is incorrect."
          action={
            <Button asChild variant="primary">
              <Link to={ROUTES.projects}>Back to projects</Link>
            </Button>
          }
        />
      </Card>
    )
  }

  const progress = project.status === 'completed' ? 100 : progressOf(tasks)
  const remaining = project.budget - project.spent
  const done = tasks.filter((t) => t.status === 'done').length

  return (
    <div className="space-y-5">
      <Link
        to={ROUTES.projects}
        className="inline-flex items-center gap-1.5 text-body text-muted transition-colors duration-150 hover:text-foreground"
      >
        <ArrowLeft className="size-4" aria-hidden /> All projects
      </Link>

      <PageHeader
        title={project.name}
        description={`${project.client} · ${project.description}`}
        actions={
          <>
            <ProjectStatusBadge status={project.status} />
            <Button onClick={() => setEditOpen(true)}>
              <Pencil aria-hidden /> Edit
            </Button>
            <Button variant="danger" onClick={() => setDeleteOpen(true)}>
              <Trash2 aria-hidden /> Delete
            </Button>
          </>
        }
      />

      <section aria-label="Project summary" className="grid gap-4 sm:grid-cols-2 sm:gap-5 xl:grid-cols-4">
        <StatCard label="Progress" value={`${progress}%`} delta={progress >= 50 ? 4.2 : -1.8} comparison="vs. last week" icon={ListChecks} featured />
        <StatCard label="Budget remaining" value={formatCurrency(remaining)} delta={remaining >= 0 ? 2.1 : -6.4} comparison="of the total budget" icon={CircleDollarSign} />
        <StatCard label="Team" value={`${project.members.length} ${project.members.length === 1 ? 'person' : 'people'}`} delta={0} comparison="no change" icon={Users} />
        <StatCard label="Due date" value={formatShortDate(project.due)} delta={0} comparison={`Started ${formatShortDate(project.start)}`} icon={CalendarClock} />
      </section>

      <div className="grid gap-5 xl:grid-cols-12">
        <Card padding="none" className="min-w-0 xl:col-span-8">
          <div className="flex flex-wrap items-start justify-between gap-3 px-5 pt-5 sm:px-6 sm:pt-6">
            <div>
              <h3 className="text-card font-medium">Tasks</h3>
              <p className="mt-0.5 text-caption text-muted">
                {done} of {tasks.length} complete
              </p>
            </div>
            <Button size="sm" onClick={() => setTaskOpen(true)}>
              <ListPlus aria-hidden /> Add task
            </Button>
          </div>
          <DataTable
            className="mt-4"
            caption={`${project.name} tasks`}
            columns={columns}
            data={tasks}
            getRowId={(r) => r.id}
            pageSize={6}
            empty={
              <EmptyState
                title="No tasks yet"
                description="Break the project into tasks to track progress."
                action={
                  <Button variant="primary" onClick={() => setTaskOpen(true)}>
                    Add task
                  </Button>
                }
              />
            }
          />
        </Card>

        <div className="space-y-5 xl:col-span-4">
          <Card>
            <h3 className="text-card font-medium">Budget</h3>
            <p className="tabular mt-3 text-section font-semibold">{formatCurrency(project.spent)}</p>
            <p className="text-caption text-muted">spent of {formatCurrency(project.budget)}</p>
            <Progress
              className="mt-3"
              value={Math.min(100, (project.spent / Math.max(project.budget, 1)) * 100)}
              tone={project.spent / Math.max(project.budget, 1) > 0.9 ? 'warning' : 'accent'}
              label="Budget used"
            />
          </Card>

          <Card>
            <h3 className="text-card font-medium">Team</h3>
            <ul className="mt-4 space-y-3">
              {project.members.map((name) => (
                <li key={name} className="flex items-center gap-3">
                  <Avatar name={name} size="sm" />
                  <span className="flex-1 text-body">{name}</span>
                  {name === project.owner && <Badge variant="accent">Owner</Badge>}
                </li>
              ))}
            </ul>
            <p className="mt-4 border-t border-border pt-3 text-caption text-muted">
              {formatFullDate(project.start)} → {formatFullDate(project.due)}
            </p>
          </Card>
        </div>
      </div>

      <ProjectFormModal open={editOpen} onOpenChange={setEditOpen} project={project} />
      <TaskFormModal open={taskOpen} onOpenChange={setTaskOpen} project={project} />

      <ConfirmDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        tone="danger"
        title="Delete this project?"
        description={`“${project.name}” and its ${tasks.length} ${tasks.length === 1 ? 'task' : 'tasks'} will be removed from your demo data.`}
        confirmLabel="Delete project"
        onConfirm={async () => {
          await new Promise((resolve) => window.setTimeout(resolve, 500))
          removeProject(project.id)
          toast.success(`${project.name} deleted`)
          navigate(ROUTES.projects)
        }}
      />
    </div>
  )
}
