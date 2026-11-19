import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import {
  buildProjects,
  buildTasks,
  type Project,
  type ProjectStatus,
  type Task,
  type TaskPriority,
  type TaskStatus,
} from '@/data/projects'

export interface ProjectInput {
  name: string
  description: string
  client: string
  status: ProjectStatus
  budget: number
  /** ISO timestamp. */
  due: string
}

export interface TaskInput {
  title: string
  priority: TaskPriority
  assignee: string
  /** ISO timestamp. */
  due: string
}

interface ProjectsState {
  projects: Project[]
  tasks: Task[]
  addProject: (input: Partial<ProjectInput> & Pick<ProjectInput, 'name'>) => Project
  updateProject: (id: string, input: ProjectInput) => void
  removeProject: (id: string) => void
  addTask: (projectId: string, input: TaskInput) => void
  moveTask: (id: string, status: TaskStatus) => void
  removeTask: (id: string) => void
  reset: () => void
}

function seed() {
  const projects = buildProjects()
  return { projects, tasks: projects.flatMap(buildTasks) }
}

function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

/** Mock "database" for projects and their tasks. Persisted so changes survive navigation and reloads. */
export const useProjectsStore = create<ProjectsState>()(
  persist(
    (set) => ({
      ...seed(),
      addProject: (input) => {
        const project: Project = {
          id: `${slugify(input.name) || 'project'}-${Date.now().toString(36)}`,
          name: input.name,
          client: input.client || 'Internal',
          description: input.description || 'No description yet.',
          status: input.status ?? 'planning',
          owner: 'Alex Morgan',
          members: ['Alex Morgan'],
          budget: input.budget ?? 10000,
          spent: 0,
          start: new Date().toISOString(),
          due: input.due ?? new Date(Date.now() + 60 * 86_400_000).toISOString(),
        }
        set((s) => ({ projects: [project, ...s.projects] }))
        return project
      },
      updateProject: (id, input) =>
        set((s) => ({ projects: s.projects.map((p) => (p.id === id ? { ...p, ...input } : p)) })),
      removeProject: (id) =>
        set((s) => ({
          projects: s.projects.filter((p) => p.id !== id),
          tasks: s.tasks.filter((t) => t.projectId !== id),
        })),
      addTask: (projectId, input) =>
        set((s) => ({
          tasks: [...s.tasks, { ...input, id: `${projectId}-t${Date.now().toString(36)}`, projectId, status: 'todo' }],
        })),
      moveTask: (id, status) => set((s) => ({ tasks: s.tasks.map((t) => (t.id === id ? { ...t, status } : t)) })),
      removeTask: (id) => set((s) => ({ tasks: s.tasks.filter((t) => t.id !== id) })),
      reset: () => set(seed()),
    }),
    {
      name: 'aether-data-projects',
      version: 1,
      partialize: (s) => ({ projects: s.projects, tasks: s.tasks }),
    },
  ),
)
