import type { Status } from '@/components/ui/status-badge'

export type CustomerPlan = 'starter' | 'growth' | 'scale' | 'enterprise'

export interface Customer {
  id: string
  name: string
  email: string
  company: string
  plan: CustomerPlan
  status: Extract<Status, 'active' | 'inactive' | 'overdue'>
  mrr: number
  ltv: number
  country: string
  /** ISO timestamp. */
  joined: string
  /** Epoch ms. */
  lastActive: number
}

export const PLAN_LABELS: Record<CustomerPlan, string> = {
  starter: 'Starter',
  growth: 'Growth',
  scale: 'Scale',
  enterprise: 'Enterprise',
}

export const PLAN_MRR: Record<CustomerPlan, number> = { starter: 19, growth: 49, scale: 129, enterprise: 499 }

const PEOPLE: readonly [[string, string], ...[string, string][]] = [
  ['Northwind Labs', 'billing@northwind.io'],
  ['Priya Nair', 'priya@lumen.studio'],
  ['Jonas Weber', 'jonas@weberco.de'],
  ['Sofia Reyes', 'sofia@brightpath.com'],
  ['Kenji Mori', 'kenji@orbital.jp'],
  ['Amara Okafor', 'amara@kindred.africa'],
  ['Lena Fischer', 'lena@fischer-design.com'],
  ['Marcus Webb', 'marcus@webbworks.com'],
  ['Hana Kim', 'hana@pixelforge.kr'],
  ['Tomás Silva', 'tomas@verdeapp.com.br'],
  ['Chloe Martin', 'chloe@atelier-m.fr'],
  ['Ravi Patel', 'ravi@stackwise.in'],
  ['Elena Petrova', 'elena@nordlicht.eu'],
  ['Omar Haddad', 'omar@cedarlabs.ae'],
  ['Isabel Costa', 'isabel@coastline.pt'],
  ['Dmitri Volkov', 'dmitri@volkov.dev'],
  ['Mei Lin', 'mei@lanternhq.cn'],
  ['Gabriel Santos', 'gabriel@santos.co'],
  ['Fatima Zahra', 'fatima@atlasworks.ma'],
  ['Noah Bennett', 'noah@bennett.io'],
  ['Yuki Tanaka', 'yuki@tanakalabs.jp'],
  ['Lucas Moreau', 'lucas@moreau.fr'],
  ['Zainab Yusuf', 'zainab@yusuf.ng'],
  ['Ethan Clarke', 'ethan@clarkeco.uk'],
]

const PLANS: readonly [CustomerPlan, ...CustomerPlan[]] = [
  'growth', 'starter', 'scale', 'growth', 'enterprise', 'starter', 'growth', 'scale', 'starter', 'growth', 'scale', 'starter',
]
export const COUNTRIES: readonly [string, ...string[]] = ['United States', 'Germany', 'Japan', 'Brazil', 'France', 'India', 'United Kingdom', 'Nigeria', 'Portugal', 'Canada']

function pick<T>(items: readonly [T, ...T[]], index: number): T {
  return items[index % items.length] ?? items[0]
}

function companyFromEmail(email: string): string {
  const domain = email.split('@')[1]?.split('.')[0] ?? 'Independent'
  return domain.charAt(0).toUpperCase() + domain.slice(1)
}

export function buildCustomers(): Customer[] {
  const now = Date.now()
  return PEOPLE.map(([name, email], i) => {
    const plan = pick(PLANS, i * 5 + 1)
    const joinedDaysAgo = 25 + ((i * 53) % 640)
    const mrr = PLAN_MRR[plan]
    const status: Customer['status'] = i % 7 === 3 ? 'inactive' : i % 9 === 5 ? 'overdue' : 'active'
    return {
      id: `cus_${1001 + i}`,
      name,
      email,
      company: companyFromEmail(email),
      plan,
      status,
      mrr: status === 'inactive' ? 0 : mrr,
      ltv: Math.round(mrr * (joinedDaysAgo / 30)),
      country: pick(COUNTRIES, i * 3),
      joined: new Date(now - joinedDaysAgo * 86_400_000).toISOString(),
      lastActive: now - ((i * 173) % 9000) * 60_000,
    }
  })
}

export function getCustomer(id: string): Customer | undefined {
  return buildCustomers().find((c) => c.id === id)
}
