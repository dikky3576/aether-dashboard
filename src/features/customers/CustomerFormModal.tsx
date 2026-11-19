import { useEffect } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { z } from 'zod'
import { Button, Field, Input, Modal, Select } from '@/components/ui'
import { COUNTRIES, PLAN_LABELS, type Customer } from '@/data/customers'
import { useCustomersStore } from '@/stores/customers-store'

const schema = z.object({
  name: z.string().trim().min(2, 'Use at least 2 characters.').max(60, 'Keep it under 60 characters.'),
  email: z.string().trim().min(1, 'Enter an email address.').email('Enter a valid email address.'),
  company: z.string().trim().min(1, 'Enter a company name.').max(60, 'Keep it under 60 characters.'),
  plan: z.enum(['starter', 'growth', 'scale', 'enterprise']),
  country: z.string().min(1),
  status: z.enum(['active', 'inactive', 'overdue']),
})
type FormValues = z.infer<typeof schema>

const PLAN_OPTIONS = Object.entries(PLAN_LABELS).map(([value, label]) => ({ value, label }))
const COUNTRY_OPTIONS = COUNTRIES.map((c) => ({ value: c, label: c }))
const STATUS_OPTIONS = [
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' },
  { value: 'overdue', label: 'Overdue' },
]

const EMPTY: FormValues = { name: '', email: '', company: '', plan: 'starter', country: COUNTRIES[0], status: 'active' }

interface CustomerFormModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  /** Pass a customer to edit it; omit to create a new one. */
  customer?: Customer
}

/** Create / edit customer. Writes to the mock customers store after a short simulated request. */
export function CustomerFormModal({ open, onOpenChange, customer }: CustomerFormModalProps) {
  const add = useCustomersStore((s) => s.add)
  const update = useCustomersStore((s) => s.update)
  const customers = useCustomersStore((s) => s.customers)
  const isEdit = customer !== undefined

  const {
    register,
    control,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema), defaultValues: EMPTY })

  useEffect(() => {
    if (open) {
      reset(
        customer
          ? {
              name: customer.name,
              email: customer.email,
              company: customer.company,
              plan: customer.plan,
              country: customer.country,
              status: customer.status,
            }
          : EMPTY,
      )
    }
  }, [open, customer, reset])

  const onSubmit = handleSubmit(async (values) => {
    const taken = customers.some((c) => c.email.toLowerCase() === values.email.toLowerCase() && c.id !== customer?.id)
    if (taken) {
      setError('email', { message: 'A customer with this email already exists.' })
      return
    }
    await new Promise((resolve) => window.setTimeout(resolve, 600))
    if (customer) {
      update(customer.id, values)
      toast.success(`${values.name} updated`)
    } else {
      add(values)
      toast.success(`${values.name} added`)
    }
    onOpenChange(false)
  })

  const formId = 'customer-form'

  return (
    <Modal
      open={open}
      onOpenChange={(next) => !isSubmitting && onOpenChange(next)}
      title={isEdit ? 'Edit customer' : 'Add customer'}
      description={isEdit ? 'Update this customer’s details.' : 'Create a customer record by hand.'}
      footer={
        <>
          <Button onClick={() => onOpenChange(false)} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button type="submit" form={formId} variant="primary" loading={isSubmitting}>
            {isEdit ? 'Save changes' : 'Add customer'}
          </Button>
        </>
      }
    >
      <form id={formId} onSubmit={onSubmit} noValidate className="grid gap-4 sm:grid-cols-2">
        <Field label="Full name" required error={errors.name?.message} className="sm:col-span-2">
          {(c) => <Input autoComplete="off" autoFocus {...c} {...register('name')} />}
        </Field>
        <Field label="Email" required error={errors.email?.message}>
          {(c) => <Input type="email" autoComplete="off" {...c} {...register('email')} />}
        </Field>
        <Field label="Company" required error={errors.company?.message}>
          {(c) => <Input autoComplete="off" {...c} {...register('company')} />}
        </Field>
        <Controller
          control={control}
          name="plan"
          render={({ field }) => (
            <Field label="Plan">
              {(c) => <Select id={c.id} options={PLAN_OPTIONS} value={field.value} onValueChange={field.onChange} />}
            </Field>
          )}
        />
        <Controller
          control={control}
          name="country"
          render={({ field }) => (
            <Field label="Country">
              {(c) => <Select id={c.id} options={COUNTRY_OPTIONS} value={field.value} onValueChange={field.onChange} />}
            </Field>
          )}
        />
        {isEdit && (
          <Controller
            control={control}
            name="status"
            render={({ field }) => (
              <Field label="Status">
                {(c) => <Select id={c.id} options={STATUS_OPTIONS} value={field.value} onValueChange={field.onChange} />}
              </Field>
            )}
          />
        )}
      </form>
    </Modal>
  )
}
