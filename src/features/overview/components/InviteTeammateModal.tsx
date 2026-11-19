import { useEffect } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { z } from 'zod'
import { Button, Field, Input, Modal, Select } from '@/components/ui'

const ROLES = [
  { value: 'admin', label: 'Admin — full access' },
  { value: 'developer', label: 'Developer — manage projects' },
  { value: 'viewer', label: 'Viewer — read only' },
]

const schema = z.object({
  email: z.string().trim().min(1, 'Enter an email address.').email('Enter a valid email address.'),
  role: z.enum(['admin', 'developer', 'viewer']),
})

type FormValues = z.infer<typeof schema>

interface InviteTeammateModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  /** Called with the validated values after the (simulated) request. */
  onInvite?: (values: FormValues) => void
}

/** Demo form. Replace the simulated delay with your invitation endpoint. */
export function InviteTeammateModal({ open, onOpenChange, onInvite }: InviteTeammateModalProps) {
  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { email: '', role: 'developer' },
  })

  useEffect(() => {
    if (!open) reset()
  }, [open, reset])

  const onSubmit = handleSubmit(async (values) => {
    await new Promise((resolve) => window.setTimeout(resolve, 700))
    onInvite?.(values)
    toast.success(`Invitation sent to ${values.email}`)
    onOpenChange(false)
  })

  return (
    <Modal
      open={open}
      onOpenChange={(next) => !isSubmitting && onOpenChange(next)}
      title="Invite teammate"
      description="They’ll get an email with a link to join your workspace."
      footer={
        <>
          <Button onClick={() => onOpenChange(false)} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button type="submit" form="invite-teammate-form" variant="primary" loading={isSubmitting}>
            Send invitation
          </Button>
        </>
      }
    >
      <form id="invite-teammate-form" onSubmit={onSubmit} noValidate className="space-y-4">
        <Field label="Email address" required error={errors.email?.message}>
          {(c) => (
            <Input type="email" placeholder="name@company.com" autoComplete="off" autoFocus {...c} {...register('email')} />
          )}
        </Field>
        <Controller
          control={control}
          name="role"
          render={({ field }) => (
            <Field label="Role">
              {(c) => (
                <Select
                  id={c.id}
                  aria-describedby={c['aria-describedby']}
                  options={ROLES}
                  value={field.value}
                  onValueChange={field.onChange}
                />
              )}
            </Field>
          )}
        />
      </form>
    </Modal>
  )
}
