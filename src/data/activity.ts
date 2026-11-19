export interface ActivityItem {
  id: string
  user: string
  verb: string
  target: string
  /** Epoch ms. */
  createdAt: number
}

const minutesAgo = (n: number) => Date.now() - n * 60_000

export const RECENT_ACTIVITY: ActivityItem[] = [
  { id: 'a1', user: 'Priya Nair', verb: 'completed', target: 'API rate limiting', createdAt: minutesAgo(12) },
  { id: 'a2', user: 'Jonas Weber', verb: 'upgraded', target: 'Northwind Labs to Scale', createdAt: minutesAgo(47) },
  { id: 'a3', user: 'Sofia Reyes', verb: 'commented on', target: 'Q4 Launch checklist', createdAt: minutesAgo(60 * 3) },
  { id: 'a4', user: 'Kenji Mori', verb: 'invited', target: '3 new teammates', createdAt: minutesAgo(60 * 6) },
  { id: 'a5', user: 'Alex Morgan', verb: 'exported', target: 'October revenue report', createdAt: minutesAgo(60 * 27) },
  { id: 'a6', user: 'Priya Nair', verb: 'created', target: 'Mobile onboarding project', createdAt: minutesAgo(60 * 50) },
]
