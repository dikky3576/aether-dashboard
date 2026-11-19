import { useEffect } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { z } from 'zod'
import { Button, Field, Input, Modal, Select, Textarea } from '@/components/ui'
import { PROJECT_STATUS_LABEL, type Project } from '@/data/projects'
import { useProjectsStore } from '@/stores/projects-store'

const schema = z.object({
  name: z.string().trim().min(2, 'Use at least 2 characters.').max(60, 'Keep it under 60 characters.'),
  client: z.string().trim().min(1, 'Enter a client or “Internal”.').max(60),
  description: z.string().max(200, 'Keep it under 200 characters.'),
  status: z.enum(['planning', 'on-track', 'at-risk', 'completed']),
  budget: z
    .string()
    .trim()
    .regex(/^\d+(\.\d{1,2})?$/, 'Enter an amount like 12000 or 12000.50.')
    .refine((v) => Number(v) > 0, 'Budget must be more than zero.'),
  due: z.string().min(1, 'Choose a due date.'),
})
type FormValues = z.infer<typeof schema>

const STATUS_OPTIONS = Object.entries(PROJECT_STATUS_LABEL).map(([value, label]) => ({ value, label }))

const toDateInput = (iso: string) => iso.slice(0, 10)

interface ProjectFormModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  project: Project
}

/** Edit an existing project. (Creating one uses the simpler CreateProjectModal.) */
export function ProjectFormModal({ open, onOpenChange, project }: ProjectFormModalProps) {
  const updateProject = useProjectsStore((s) => s.updateProject)
  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) })

  useEffect(() => {
    if (open) {
      reset({
        name: project.name,
        client: project.client,
        description: project.description,
        status: project.status,
        budget: String(project.budget),
        due: toDateInput(project.due),
      })
    }
  }, [open, project, reset])

  const onSubmit = handleSubmit(async (values) => {
    await new Promise((resolve) => window.setTimeout(resolve, 600))
    updateProject(project.id, {
      name: values.name,
      client: values.client,
      description: values.description,
      status: values.status,
      budget: Number(values.budget),
      due: new Date(`${values.due}T12:00:00`).toISOString(),
    })
    toast.success(`${values.name} updated`)
    onOpenChange(false)
  })

  return (
    <Modal
      open={open}
      onOpenChange={(next) => !isSubmitting && onOpenChange(next)}
      title="Edit project"
      size="lg"
      footer={
        <>
          <Button onClick={() => onOpenChange(false)} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button type="submit" form="project-form" variant="primary" loading={isSubmitting}>
            Save changes
          </Button>
        </>
      }
    >
      <form id="project-form" onSubmit={onSubmit} noValidate className="grid gap-4 sm:grid-cols-2">
        <Field label="Project name" required error={errors.name?.message} className="sm:col-span-2">
          {(c) => <Input autoComplete="off" autoFocus {...c} {...register('name')} />}
        </Field>
        <Field label="Client" required error={errors.client?.message}>
          {(c) => <Input autoComplete="off" {...c} {...register('client')} />}
        </Field>
        <Controller
          control={control}
          name="status"
          render={({ field }) => (
            <Field label="Status">
              {(c) => <Select id={c.id} options={STATUS_OPTIONS} value={field.value} onValueChange={field.onChange} />}
            </Field>
          )}
        />
        <Field label="Budget (USD)" required error={errors.budget?.message}>
          {(c) => <Input inputMode="decimal" {...c} {...register('budget')} />}
        </Field>
        <Field label="Due date" required error={errors.due?.message}>
          {(c) => <Input type="date" {...c} {...register('due')} />}
        </Field>
        <Field label="Description" error={errors.description?.message} className="sm:col-span-2">
          {(c) => <Textarea rows={3} {...c} {...register('description')} />}
        </Field>
      </form>
    </Modal>
  )
}
