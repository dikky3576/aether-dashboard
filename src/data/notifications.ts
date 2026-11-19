export type NotificationKind = 'payment' | 'team' | 'project' | 'system'

export interface AppNotification {
  id: string
  kind: NotificationKind
  title: string
  body: string
  /** Epoch ms. */
  createdAt: number
  read: boolean
}

const minutesAgo = (n: number) => Date.now() - n * 60_000

export const initialNotifications: AppNotification[] = [
  {
    id: 'n1',
    kind: 'payment',
    title: 'Payment received',
    body: 'Northwind Labs paid invoice INV-2048 ($2,400.00).',
    createdAt: minutesAgo(6),
    read: false,
  },
  {
    id: 'n2',
    kind: 'team',
    title: 'Priya Nair joined the workspace',
    body: 'She was invited as a Developer and accepted.',
    createdAt: minutesAgo(48),
    read: false,
  },
  {
    id: 'n3',
    kind: 'project',
    title: 'Q4 Launch is 80% complete',
    body: '12 of 15 tasks are done. 3 are due this week.',
    createdAt: minutesAgo(60 * 5),
    read: false,
  },
  {
    id: 'n4',
    kind: 'system',
    title: 'New sign-in from Chrome on Windows',
    body: 'If this wasn’t you, review your security settings.',
    createdAt: minutesAgo(60 * 26),
    read: true,
  },
]
