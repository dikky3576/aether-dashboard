import { useEffect } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { z } from 'zod'
import { Button, Field, Input, Modal, Select } from '@/components/ui'
import type { Project } from '@/data/projects'
import { useProjectsStore } from '@/stores/projects-store'

const schema = z.object({
  title: z.string().trim().min(2, 'Use at least 2 characters.').max(80, 'Keep it under 80 characters.'),
  priority: z.enum(['low', 'medium', 'high']),
  assignee: z.string().min(1, 'Choose an assignee.'),
  due: z.string().min(1, 'Choose a due date.'),
})
type FormValues = z.infer<typeof schema>

const PRIORITY_OPTIONS = [
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
]

const inDays = (n: number) => new Date(Date.now() + n * 86_400_000).toISOString().slice(0, 10)

interface TaskFormModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  project: Project
}

export function TaskFormModal({ open, onOpenChange, project }: TaskFormModalProps) {
  const addTask = useProjectsStore((s) => s.addTask)
  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) })

  useEffect(() => {
    if (open) reset({ title: '', priority: 'medium', assignee: project.owner, due: inDays(7) })
  }, [open, project.owner, reset])

  const onSubmit = handleSubmit(async (values) => {
    await new Promise((resolve) => window.setTimeout(resolve, 400))
    addTask(project.id, {
      title: values.title,
      priority: values.priority,
      assignee: values.assignee,
      due: new Date(`${values.due}T12:00:00`).toISOString(),
    })
    toast.success('Task added')
    onOpenChange(false)
  })

  return (
    <Modal
      open={open}
      onOpenChange={(next) => !isSubmitting && onOpenChange(next)}
      title="Add task"
      description={`New task in ${project.name}.`}
      footer={
        <>
          <Button onClick={() => onOpenChange(false)} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button type="submit" form="task-form" variant="primary" loading={isSubmitting}>
            Add task
          </Button>
        </>
      }
    >
      <form id="task-form" onSubmit={onSubmit} noValidate className="space-y-4">
        <Field label="Title" required error={errors.title?.message}>
          {(c) => <Input autoComplete="off" autoFocus {...c} {...register('title')} />}
        </Field>
        <div className="grid gap-4 sm:grid-cols-2">
          <Controller
            control={control}
            name="priority"
            render={({ field }) => (
              <Field label="Priority">
                {(c) => <Select id={c.id} options={PRIORITY_OPTIONS} value={field.value} onValueChange={field.onChange} />}
              </Field>
            )}
          />
          <Controller
            control={control}
            name="assignee"
            render={({ field }) => (
              <Field label="Assignee" error={errors.assignee?.message}>
                {(c) => (
                  <Select
                    id={c.id}
                    options={project.members.map((m) => ({ value: m, label: m }))}
                    value={field.value}
                    onValueChange={field.onChange}
                  />
                )}
              </Field>
            )}
          />
        </div>
        <Field label="Due date" required error={errors.due?.message}>
          {(c) => <Input type="date" {...c} {...register('due')} />}
        </Field>
      </form>
    </Modal>
  )
}
