import { CalendarDays, CreditCard, Database, GitBranch, LifeBuoy, Mail, MessageSquare, Webhook, type LucideIcon } from 'lucide-react'

export interface Integration {
  id: string
  name: string
  description: string
  category: 'Communication' | 'Developer' | 'Finance' | 'Data' | 'Support'
  icon: LucideIcon
  connected: boolean
}

/** Generic names on purpose — swap in the real services your product supports. */
export const INTEGRATIONS: Integration[] = [
  { id: 'chat', name: 'Team chat', description: 'Post alerts and weekly summaries to a channel.', category: 'Communication', icon: MessageSquare, connected: true },
  { id: 'code', name: 'Code hosting', description: 'Link commits and pull requests to projects.', category: 'Developer', icon: GitBranch, connected: true },
  { id: 'payments', name: 'Card payments', description: 'Sync charges, refunds and payouts.', category: 'Finance', icon: CreditCard, connected: true },
  { id: 'email', name: 'Transactional email', description: 'Send invoices and notifications from your domain.', category: 'Communication', icon: Mail, connected: false },
  { id: 'calendar', name: 'Calendar sync', description: 'Show deadlines and milestones in your calendar.', category: 'Communication', icon: CalendarDays, connected: false },
  { id: 'warehouse', name: 'Data warehouse', description: 'Stream events and revenue data for deeper analysis.', category: 'Data', icon: Database, connected: false },
  { id: 'helpdesk', name: 'Help desk', description: 'See customer tickets next to their account.', category: 'Support', icon: LifeBuoy, connected: false },
  { id: 'webhooks', name: 'Webhooks', description: 'Send real-time events to your own endpoints.', category: 'Developer', icon: Webhook, connected: true },
]

export interface SavedReport {
  id: string
  name: string
  description: string
  schedule: string
  /** Epoch ms. */
  lastRun: number
}

export function buildReports(): SavedReport[] {
  const ago = (hours: number) => Date.now() - hours * 3_600_000
  return [
    { id: 'rep-revenue', name: 'Revenue summary', description: 'Revenue, growth and plan mix for the selected period.', schedule: 'Weekly · Mondays', lastRun: ago(30) },
    { id: 'rep-customers', name: 'Customer health', description: 'Active, inactive and overdue accounts with MRR.', schedule: 'Monthly · 1st', lastRun: ago(24 * 12) },
    { id: 'rep-transactions', name: 'Transactions export', description: 'Every payment with status and amount.', schedule: 'On demand', lastRun: ago(5) },
    { id: 'rep-invoices', name: 'Invoice ageing', description: 'Outstanding and overdue invoices by customer.', schedule: 'Weekly · Fridays', lastRun: ago(60) },
    { id: 'rep-team', name: 'Team activity', description: 'Logins and project activity per member.', schedule: 'Monthly · 1st', lastRun: ago(24 * 12) },
  ]
}
