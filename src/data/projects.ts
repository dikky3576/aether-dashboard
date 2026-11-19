export type ProjectStatus = 'planning' | 'on-track' | 'at-risk' | 'completed'
export type TaskStatus = 'todo' | 'in-progress' | 'review' | 'done'
export type TaskPriority = 'low' | 'medium' | 'high'

export interface Project {
  id: string
  name: string
  client: string
  description: string
  status: ProjectStatus
  owner: string
  members: string[]
  budget: number
  spent: number
  /** ISO timestamps. */
  start: string
  due: string
}

export interface Task {
  id: string
  projectId: string
  title: string
  status: TaskStatus
  priority: TaskPriority
  assignee: string
  due: string
}

export const TASK_COLUMNS: { id: TaskStatus; label: string }[] = [
  { id: 'todo', label: 'To do' },
  { id: 'in-progress', label: 'In progress' },
  { id: 'review', label: 'In review' },
  { id: 'done', label: 'Done' },
]

export const PROJECT_STATUS_LABEL: Record<ProjectStatus, string> = {
  planning: 'Planning',
  'on-track': 'On track',
  'at-risk': 'At risk',
  completed: 'Completed',
}

const TEAM: readonly [string, ...string[]] = ['Alex Morgan', 'Priya Nair', 'Jonas Weber', 'Sofia Reyes', 'Kenji Mori', 'Amara Okafor']

function pick<T>(items: readonly [T, ...T[]], index: number): T {
  return items[index % items.length] ?? items[0]
}

const inDays = (n: number) => new Date(Date.now() + n * 86_400_000).toISOString()

export function buildProjects(): Project[] {
  return [
    { id: 'q4-launch', name: 'Q4 Launch', client: 'Internal', description: 'Coordinate the product, marketing and support launch for the Q4 release.', status: 'on-track', owner: 'Priya Nair', members: ['Priya Nair', 'Jonas Weber', 'Sofia Reyes', 'Alex Morgan'], budget: 48000, spent: 31200, start: inDays(-60), due: inDays(21) },
    { id: 'mobile-redesign', name: 'Mobile redesign', client: 'Northwind Labs', description: 'A fresh mobile experience with a new navigation model and onboarding.', status: 'at-risk', owner: 'Kenji Mori', members: ['Kenji Mori', 'Amara Okafor', 'Jonas Weber'], budget: 72000, spent: 66800, start: inDays(-95), due: inDays(9) },
    { id: 'billing-migration', name: 'Billing migration', client: 'Internal', description: 'Move subscriptions to the new billing provider without interrupting customers.', status: 'on-track', owner: 'Jonas Weber', members: ['Jonas Weber', 'Alex Morgan'], budget: 36000, spent: 14100, start: inDays(-30), due: inDays(45) },
    { id: 'customer-portal', name: 'Customer portal', client: 'Lumen Studio', description: 'Self-serve portal for invoices, usage and team management.', status: 'planning', owner: 'Sofia Reyes', members: ['Sofia Reyes', 'Priya Nair', 'Kenji Mori'], budget: 54000, spent: 3200, start: inDays(-5), due: inDays(90) },
    { id: 'analytics-v2', name: 'Analytics v2', client: 'Internal', description: 'Rebuild the analytics pipeline for faster dashboards and exports.', status: 'on-track', owner: 'Alex Morgan', members: ['Alex Morgan', 'Jonas Weber', 'Amara Okafor', 'Kenji Mori'], budget: 64000, spent: 40500, start: inDays(-70), due: inDays(34) },
    { id: 'onboarding-revamp', name: 'Onboarding revamp', client: 'Internal', description: 'Shorten time-to-value with guided setup and better empty states.', status: 'completed', owner: 'Amara Okafor', members: ['Amara Okafor', 'Sofia Reyes'], budget: 22000, spent: 20400, start: inDays(-120), due: inDays(-14) },
    { id: 'data-warehouse', name: 'Data warehouse', client: 'Orbital', description: 'Centralise product and billing data for reporting and forecasting.', status: 'at-risk', owner: 'Jonas Weber', members: ['Jonas Weber', 'Kenji Mori'], budget: 88000, spent: 69900, start: inDays(-110), due: inDays(12) },
    { id: 'brand-refresh', name: 'Brand refresh', client: 'Kindred', description: 'Update the visual identity, website and sales collateral.', status: 'planning', owner: 'Sofia Reyes', members: ['Sofia Reyes', 'Amara Okafor'], budget: 30000, spent: 1800, start: inDays(-2), due: inDays(75) },
  ]
}

const TASK_TITLES: readonly [string, ...string[]] = [
  'Define scope and success metrics',
  'Audit current user flows',
  'Design key screens',
  'Build API integration',
  'Write acceptance tests',
  'Review security checklist',
  'Prepare rollout plan',
  'Draft release notes',
  'Run usability sessions',
  'Fix accessibility issues',
  'Set up monitoring',
  'Train the support team',
]

const ACTIVE_PATTERN: readonly [TaskStatus, ...TaskStatus[]] = [
  'done', 'done', 'done', 'in-progress', 'review', 'todo', 'done', 'in-progress', 'todo', 'review', 'done', 'todo',
]
const PLANNING_PATTERN: readonly [TaskStatus, ...TaskStatus[]] = [
  'todo', 'todo', 'in-progress', 'todo', 'todo', 'todo', 'in-progress', 'todo', 'todo', 'todo', 'todo', 'todo',
]
const PRIORITIES: readonly [TaskPriority, ...TaskPriority[]] = ['high', 'medium', 'low', 'medium', 'high', 'low']

export function buildTasks(project: Project): Task[] {
  const offset = project.id.length
  return TASK_TITLES.map((title, i) => {
    const status: TaskStatus =
      project.status === 'completed'
        ? 'done'
        : project.status === 'planning'
          ? pick(PLANNING_PATTERN, i)
          : pick(ACTIVE_PATTERN, i + offset)
    return {
      id: `${project.id}-t${i + 1}`,
      projectId: project.id,
      title,
      status,
      priority: pick(PRIORITIES, i + offset),
      assignee: pick(project.members.length ? ([project.members[0] ?? 'Alex Morgan', ...project.members] as [string, ...string[]]) : TEAM, i),
      due: inDays(((i * 3) % 18) - 3 + (offset % 5)),
    }
  })
}

export function getProject(id: string): Project | undefined {
  return buildProjects().find((p) => p.id === id)
}

export function progressOf(tasks: Task[]): number {
  if (tasks.length === 0) return 0
  return Math.round((tasks.filter((t) => t.status === 'done').length / tasks.length) * 100)
}
