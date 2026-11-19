import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { z } from 'zod'
import { Button, ConfirmDialog, Field, Input, Select } from '@/components/ui'
import { SettingsSection } from '@/features/settings/SettingsSection'
import { resetDemoData } from '@/stores/demo-data'

const schema = z.object({
  name: z.string().trim().min(2, 'Use at least 2 characters.').max(50, 'Keep it under 50 characters.'),
  url: z
    .string()
    .trim()
    .min(3, 'Choose a workspace URL.')
    .regex(/^[a-z0-9-]+$/, 'Use lowercase letters, numbers and hyphens only.'),
  timezone: z.string().min(1),
  currency: z.string().min(1),
})
type FormValues = z.infer<typeof schema>

const TIMEZONES = [
  { value: 'UTC', label: 'UTC' },
  { value: 'Asia/Jakarta', label: 'Jakarta (UTC+7)' },
  { value: 'Europe/Berlin', label: 'Berlin (UTC+1)' },
  { value: 'America/New_York', label: 'New York (UTC−5)' },
]
const CURRENCIES = [
  { value: 'USD', label: 'US dollar (USD)' },
  { value: 'EUR', label: 'Euro (EUR)' },
  { value: 'IDR', label: 'Indonesian rupiah (IDR)' },
]

export function GeneralSettingsPage() {
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [resetOpen, setResetOpen] = useState(false)
  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { name: 'Aether Inc.', url: 'aether', timezone: 'UTC', currency: 'USD' },
  })
  const timezone = watch('timezone')
  const currency = watch('currency')

  const onSubmit = handleSubmit(async (data) => {
    await new Promise((resolve) => window.setTimeout(resolve, 600))
    reset(data)
    toast.success('Workspace settings saved')
  })

  return (
    <>
      <form onSubmit={onSubmit} noValidate>
        <SettingsSection
          title="Workspace"
          description="How your workspace appears to your team."
          footer={
            <>
              <Button type="button" onClick={() => reset()} disabled={!isDirty || isSubmitting}>
                Discard
              </Button>
              <Button type="submit" variant="primary" loading={isSubmitting} disabled={!isDirty}>
                Save changes
              </Button>
            </>
          }
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Workspace name" required error={errors.name?.message}>
              {(c) => <Input {...c} {...register('name')} />}
            </Field>
            <Field label="Workspace URL" required error={errors.url?.message} hint="aether.app/your-url">
              {(c) => <Input {...c} {...register('url')} />}
            </Field>
            <Field label="Time zone">
              {(c) => (
                <Select
                  id={c.id}
                  options={TIMEZONES}
                  value={timezone}
                  onValueChange={(v) => setValue('timezone', v, { shouldDirty: true })}
                />
              )}
            </Field>
            <Field label="Currency">
              {(c) => (
                <Select
                  id={c.id}
                  options={CURRENCIES}
                  value={currency}
                  onValueChange={(v) => setValue('currency', v, { shouldDirty: true })}
                />
              )}
            </Field>
          </div>
        </SettingsSection>
      </form>

      <SettingsSection
        title="Demo data"
        description="Customers, projects and team changes are saved in this browser only."
      >
        <div className="flex flex-wrap items-center justify-between gap-4">
          <p className="max-w-md text-body text-muted">Restore the original sample customers, projects, tasks and members.</p>
          <Button onClick={() => setResetOpen(true)}>Reset demo data</Button>
        </div>
      </SettingsSection>

      <SettingsSection title="Danger zone" description="Irreversible actions for this workspace.">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <p className="max-w-md text-body text-muted">
            Deleting the workspace removes all projects, customers and data. This is a demo — nothing is actually deleted.
          </p>
          <Button variant="danger" onClick={() => setDeleteOpen(true)}>
            Delete workspace
          </Button>
        </div>
      </SettingsSection>

      <ConfirmDialog
        open={resetOpen}
        onOpenChange={setResetOpen}
        title="Reset demo data?"
        description="Everything you added, edited or deleted in customers, projects and team will return to the original samples."
        confirmLabel="Reset"
        onConfirm={async () => {
          await new Promise((resolve) => window.setTimeout(resolve, 400))
          resetDemoData()
          toast.success('Demo data restored')
        }}
      />

      <ConfirmDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        tone="danger"
        title="Delete this workspace?"
        description="This cannot be undone. In a real app you would be asked to type the workspace name to confirm."
        confirmLabel="Delete workspace"
        onConfirm={async () => {
          await new Promise((resolve) => window.setTimeout(resolve, 600))
          toast.info('Demo only — your workspace was not deleted.')
        }}
      />
    </>
  )
}
