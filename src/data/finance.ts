import { buildCustomers, type CustomerPlan } from '@/data/customers'
import type { Status } from '@/components/ui/status-badge'

export interface Invoice {
  id: string
  customer: { name: string; email: string }
  /** ISO timestamps. */
  issued: string
  due: string
  amount: number
  status: Extract<Status, 'paid' | 'pending' | 'overdue' | 'draft'>
}

export function buildInvoices(count = 32): Invoice[] {
  const customers = buildCustomers()
  const now = Date.now()
  const day = 86_400_000

  return Array.from({ length: count }, (_, i) => {
    const customer = customers[(i * 5) % customers.length] ?? customers[0]
    const issuedAgo = i * 3 + 1
    const status: Invoice['status'] =
      i % 11 === 0 ? 'draft' : i < 4 ? 'pending' : i % 6 === 2 ? 'overdue' : 'paid'
    const base = customer?.mrr || 49

    return {
      id: `INV-${2060 - i}`,
      customer: { name: customer?.name ?? 'Customer', email: customer?.email ?? '' },
      issued: new Date(now - issuedAgo * day).toISOString(),
      due: new Date(now - (issuedAgo - 14) * day).toISOString(),
      amount: base * (i % 3 === 0 ? 3 : 1),
      status,
    }
  })
}

export interface PricingPlan {
  id: CustomerPlan
  name: string
  monthly: number
  /** Price per month when billed yearly. */
  yearly: number
  description: string
  features: string[]
}

export const PRICING_PLANS: PricingPlan[] = [
  { id: 'starter', name: 'Starter', monthly: 19, yearly: 15, description: 'For individuals getting started.', features: ['3 team members', '25 projects', '10 GB storage', 'Email support'] },
  { id: 'growth', name: 'Growth', monthly: 49, yearly: 39, description: 'For growing teams that need more.', features: ['25 team members', 'Unlimited projects', '100 GB storage', 'Priority support', 'Advanced analytics'] },
  { id: 'scale', name: 'Scale', monthly: 129, yearly: 103, description: 'For companies with complex workflows.', features: ['100 team members', 'Unlimited projects', '1 TB storage', 'Roles & permissions', 'Audit log', 'Dedicated success manager'] },
  { id: 'enterprise', name: 'Enterprise', monthly: 499, yearly: 399, description: 'Security and control at scale.', features: ['Unlimited members', 'SSO & SCIM', 'Custom contracts', '99.99% uptime SLA', '24/7 phone support'] },
]

export const CURRENT_PLAN_ID: CustomerPlan = 'growth'

export const USAGE = [
  { id: 'seats', label: 'Team members', used: 14, limit: 25, unit: '' },
  { id: 'projects', label: 'Projects', used: 128, limit: 250, unit: '' },
  { id: 'storage', label: 'Storage', used: 38, limit: 100, unit: ' GB' },
] as const
