import { useMemo, useState } from 'react'
import { toast } from 'sonner'
import { ListPlus, Trash2 } from 'lucide-react'
import { Avatar, Button, Card, EmptyState, Select, Skeleton } from '@/components/ui'
import { TASK_COLUMNS, type Task, type TaskStatus } from '@/data/projects'
import { useProjectsContext } from '@/features/projects/ProjectsLayout'
import { PriorityBadge, formatShortDate } from '@/features/projects/project-ui'
import { TaskFormModal } from '@/features/projects/TaskFormModal'
import { useQueryState } from '@/hooks/use-query-state'
import { useProjectsStore } from '@/stores/projects-store'

const MOVE_OPTIONS = TASK_COLUMNS.map((c) => ({ value: c.id, label: c.label }))

function TaskCard({ task }: { task: Task }) {
  const moveTask = useProjectsStore((s) => s.moveTask)
  const removeTask = useProjectsStore((s) => s.removeTask)

  return (
    <li className="rounded-control border border-border bg-surface p-3.5 shadow-xs">
      <div className="flex items-start justify-between gap-2">
        <p className="text-body font-medium">{task.title}</p>
        <Button
          variant="ghost"
          size="icon-sm"
          className="-mr-1.5 -mt-1 shrink-0"
          aria-label={`Delete “${task.title}”`}
          onClick={() => {
            removeTask(task.id)
            toast.success('Task deleted')
          }}
        >
          <Trash2 aria-hidden />
        </Button>
      </div>
      <div className="mt-2.5 flex items-center justify-between gap-2">
        <PriorityBadge priority={task.priority} />
        <span className="text-caption text-muted">{formatShortDate(task.due)}</span>
      </div>
      <div className="mt-3 flex items-center gap-2">
        <Avatar name={task.assignee} size="xs" />
        <span className="truncate text-caption text-muted">{task.assignee}</span>
      </div>
      {/* Keyboard- and touch-friendly alternative to drag and drop. */}
      <Select
        size="sm"
        className="mt-3"
        aria-label={`Move “${task.title}” to another column`}
        options={MOVE_OPTIONS}
        value={task.status}
        onValueChange={(value) => moveTask(task.id, value as TaskStatus)}
      />
    </li>
  )
}

export function ProjectBoardPage() {
  const { projects } = useProjectsContext()
  const allTasks = useProjectsStore((s) => s.tasks)
  const [selectedId, setSelectedId] = useQueryState('project')
  const [taskOpen, setTaskOpen] = useState(false)

  const project = useMemo(
    () => projects?.find((p) => p.id === selectedId) ?? projects?.[0],
    [projects, selectedId],
  )
  const tasks = useMemo(() => allTasks.filter((t) => t.projectId === project?.id), [allTasks, project?.id])

  if (!projects) {
    return (
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }, (_, i) => (
          <Skeleton key={i} className="h-96 w-full rounded-card" />
        ))}
      </div>
    )
  }

  if (!project) {
    return (
      <Card>
        <EmptyState title="No projects yet" description="Create a project to start planning tasks on a board." />
      </Card>
    )
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="sm:w-72">
          <Select
            aria-label="Project"
            value={project.id}
            onValueChange={setSelectedId}
            options={projects.map((p) => ({ value: p.id, label: p.name }))}
          />
        </div>
        <Button variant="primary" onClick={() => setTaskOpen(true)}>
          <ListPlus aria-hidden /> Add task
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {TASK_COLUMNS.map((column) => {
          const items = tasks.filter((t) => t.status === column.id)
          return (
            <Card key={column.id} padding="sm" className="bg-subtle/50">
              <section aria-labelledby={`col-${column.id}`}>
                <h3 id={`col-${column.id}`} className="mb-3 flex items-center justify-between px-1 text-body font-medium">
                  {column.label}
                  <span className="tabular rounded-full bg-surface px-2 py-0.5 text-caption text-muted ring-1 ring-inset ring-border">
                    {items.length}
                  </span>
                </h3>
                {items.length === 0 ? (
                  <p className="rounded-control border border-dashed border-border px-3 py-6 text-center text-caption text-muted">
                    Nothing here
                  </p>
                ) : (
                  <ul className="space-y-3">
                    {items.map((task) => (
                      <TaskCard key={task.id} task={task} />
                    ))}
                  </ul>
                )}
              </section>
            </Card>
          )
        })}
      </div>

      <TaskFormModal open={taskOpen} onOpenChange={setTaskOpen} project={project} />
    </div>
  )
}
