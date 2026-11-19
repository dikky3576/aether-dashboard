import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { PLAN_MRR, buildCustomers, type Customer, type CustomerPlan } from '@/data/customers'

export interface CustomerInput {
  name: string
  email: string
  company: string
  plan: CustomerPlan
  country: string
  status: Customer['status']
}

interface CustomersState {
  customers: Customer[]
  add: (input: CustomerInput) => Customer
  update: (id: string, input: CustomerInput) => void
  remove: (id: string) => void
  reset: () => void
}

/**
 * Mock "database" for customers. Persisted to localStorage so create / edit / delete survive
 * navigation and reloads. Swap these actions for API calls in a real product.
 */
export const useCustomersStore = create<CustomersState>()(
  persist(
    (set) => ({
      customers: buildCustomers(),
      add: (input) => {
        const customer: Customer = {
          ...input,
          id: `cus_${Date.now().toString(36)}`,
          mrr: input.status === 'inactive' ? 0 : PLAN_MRR[input.plan],
          ltv: 0,
          joined: new Date().toISOString(),
          lastActive: Date.now(),
        }
        set((s) => ({ customers: [customer, ...s.customers] }))
        return customer
      },
      update: (id, input) =>
        set((s) => ({
          customers: s.customers.map((c) =>
            c.id === id ? { ...c, ...input, mrr: input.status === 'inactive' ? 0 : PLAN_MRR[input.plan] } : c,
          ),
        })),
      remove: (id) => set((s) => ({ customers: s.customers.filter((c) => c.id !== id) })),
      reset: () => set({ customers: buildCustomers() }),
    }),
    { name: 'aether-data-customers', version: 1, partialize: (s) => ({ customers: s.customers }) },
  ),
)

export const selectCustomerById = (id: string) => (s: CustomersState) => s.customers.find((c) => c.id === id)
