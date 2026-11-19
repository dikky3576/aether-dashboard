import type { Status } from '@/components/ui/status-badge'

export type TransactionStatus = Extract<Status, 'completed' | 'pending' | 'failed' | 'refunded'>

export interface Transaction {
  id: string
  customer: { name: string; email: string }
  /** Epoch ms. */
  date: number
  amount: number
  status: TransactionStatus
}

const CUSTOMERS = [
  { name: 'Northwind Labs', email: 'billing@northwind.io' },
  { name: 'Priya Nair', email: 'priya@lumenhq.com' },
  { name: 'Halcyon Studio', email: 'accounts@halcyon.studio' },
  { name: 'Jonas Weber', email: 'jonas@weberdigital.de' },
  { name: 'Orbit Analytics', email: 'finance@orbitanalytics.co' },
  { name: 'Sofia Reyes', email: 'sofia@brightpath.mx' },
  { name: 'Kenji Mori', email: 'kenji@moriworks.jp' },
  { name: 'Fernhill Co.', email: 'ap@fernhill.co' },
  { name: 'Amara Okafor', email: 'amara@kitepay.ng' },
  { name: 'Delta Freight', email: 'ops@deltafreight.com' },
  { name: 'Lena Fischer', email: 'lena@fischer-tech.at' },
  { name: 'Quill & Co', email: 'hello@quillandco.com' },
]

const AMOUNTS = [49, 129, 2400, 49, 349, 129, 899, 49, 1290, 129, 4800, 349, 49, 129, 599, 2400]
const STATUSES: TransactionStatus[] = [
  'completed', 'completed', 'completed', 'pending', 'completed', 'completed', 'failed', 'completed',
  'completed', 'refunded', 'completed', 'pending', 'completed', 'completed', 'completed', 'failed',
]

export const INITIAL_TRANSACTIONS: Transaction[] = Array.from({ length: 36 }, (_, i) => {
  const customer = CUSTOMERS[(i * 5 + 3) % CUSTOMERS.length] ?? CUSTOMERS[0]!
  return {
    id: `TXN-${10492 - i * 7}`,
    customer,
    date: Date.now() - (i * 7.3 + 1) * 3_600_000 * 2,
    amount: AMOUNTS[(i * 3 + 1) % AMOUNTS.length] ?? 49,
    status: STATUSES[(i * 5 + 2) % STATUSES.length] ?? 'completed',
  }
})
