import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { z } from 'zod'
import { Button, Field, Input, Modal, Textarea } from '@/components/ui'

const schema = z.object({
  name: z.string().trim().min(2, 'Use at least 2 characters.').max(60, 'Keep it under 60 characters.'),
  description: z.string().max(200, 'Keep it under 200 characters.'),
})

type FormValues = z.infer<typeof schema>

interface CreateProjectModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  /** Called with the validated values after the (simulated) save. */
  onCreate?: (values: FormValues) => void
}

/** Demo form: validates with Zod, "saves" after a short delay. Wire `onSubmit` to your API. */
export function CreateProjectModal({ open, onOpenChange, onCreate }: CreateProjectModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { name: '', description: '' },
  })

  useEffect(() => {
    if (!open) reset()
  }, [open, reset])

  const onSubmit = handleSubmit(async (values) => {
    await new Promise((resolve) => window.setTimeout(resolve, 700))
    onCreate?.(values)
    toast.success(`“${values.name}” created`)
    onOpenChange(false)
  })

  return (
    <Modal
      open={open}
      onOpenChange={(next) => !isSubmitting && onOpenChange(next)}
      title="Create project"
      description="Give it a name — you can change everything later."
      footer={
        <>
          <Button onClick={() => onOpenChange(false)} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button type="submit" form="create-project-form" variant="primary" loading={isSubmitting}>
            Create project
          </Button>
        </>
      }
    >
      <form id="create-project-form" onSubmit={onSubmit} noValidate className="space-y-4">
        <Field label="Project name" required error={errors.name?.message}>
          {(control) => <Input placeholder="Q4 Launch" autoComplete="off" autoFocus {...control} {...register('name')} />}
        </Field>
        <Field label="Description" hint="Optional." error={errors.description?.message}>
          {(control) => <Textarea rows={3} placeholder="What is this project about?" {...control} {...register('description')} />}
        </Field>
      </form>
    </Modal>
  )
}
