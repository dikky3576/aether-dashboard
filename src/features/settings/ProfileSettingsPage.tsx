import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { z } from 'zod'
import { Avatar, Button, Field, Input, Textarea } from '@/components/ui'
import { SettingsSection } from '@/features/settings/SettingsSection'

const schema = z.object({
  name: z.string().trim().min(2, 'Use at least 2 characters.'),
  email: z.string().trim().min(1, 'Enter an email address.').email('Enter a valid email address.'),
  title: z.string().max(60, 'Keep it under 60 characters.'),
  bio: z.string().max(240, 'Keep it under 240 characters.'),
})
type FormValues = z.infer<typeof schema>

export function ProfileSettingsPage() {
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { name: 'Alex Morgan', email: 'alex@aether.app', title: 'Founder', bio: '' },
  })
  const name = watch('name')

  const onSubmit = handleSubmit(async (values) => {
    await new Promise((resolve) => window.setTimeout(resolve, 600))
    reset(values)
    toast.success('Profile updated')
  })

  return (
    <form onSubmit={onSubmit} noValidate>
      <SettingsSection
        title="Profile"
        description="This is how teammates see you."
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
        <div className="mb-6 flex items-center gap-4">
          <Avatar name={name || 'You'} size="lg" />
          <div>
            <Button type="button" size="sm" onClick={() => toast.info('Connect file storage to enable photo uploads.')}>
              Change photo
            </Button>
            <p className="mt-1.5 text-caption text-muted">Initials are used until you add a photo.</p>
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Full name" required error={errors.name?.message}>
            {(c) => <Input autoComplete="name" {...c} {...register('name')} />}
          </Field>
          <Field label="Email" required error={errors.email?.message}>
            {(c) => <Input type="email" autoComplete="email" {...c} {...register('email')} />}
          </Field>
          <Field label="Job title" error={errors.title?.message} className="sm:col-span-2">
            {(c) => <Input {...c} {...register('title')} />}
          </Field>
          <Field label="Bio" error={errors.bio?.message} className="sm:col-span-2">
            {(c) => <Textarea {...c} {...register('bio')} />}
          </Field>
        </div>
      </SettingsSection>
    </form>
  )
}
