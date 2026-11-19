import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { z } from 'zod'
import { Laptop, Smartphone } from 'lucide-react'
import { Badge, Button, Field, Input, Switch } from '@/components/ui'
import { SettingRow, SettingsSection } from '@/features/settings/SettingsSection'

const schema = z
  .object({
    current: z.string().min(1, 'Enter your current password.'),
    next: z.string().min(8, 'Use at least 8 characters.'),
    confirm: z.string().min(1, 'Confirm your new password.'),
  })
  .refine((v) => v.next === v.confirm, { path: ['confirm'], message: 'Passwords don’t match.' })
type FormValues = z.infer<typeof schema>

const SESSIONS = [
  { id: 's1', device: 'Chrome on Windows', place: 'Jakarta, ID', current: true, icon: Laptop },
  { id: 's2', device: 'Safari on iPhone', place: 'Jakarta, ID', current: false, icon: Smartphone },
]

export function SecuritySettingsPage() {
  const [twoFactor, setTwoFactor] = useState(false)
  const [sessions, setSessions] = useState(SESSIONS)
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema), defaultValues: { current: '', next: '', confirm: '' } })

  const onSubmit = handleSubmit(async () => {
    await new Promise((resolve) => window.setTimeout(resolve, 700))
    reset()
    toast.success('Password updated (demo — nothing was stored)')
  })

  return (
    <>
      <form onSubmit={onSubmit} noValidate>
        <SettingsSection
          title="Password"
          description="Demo form — connect it to your authentication backend."
          footer={
            <Button type="submit" variant="primary" loading={isSubmitting}>
              Update password
            </Button>
          }
        >
          <div className="grid gap-4 sm:max-w-sm">
            <Field label="Current password" required error={errors.current?.message}>
              {(c) => <Input type="password" autoComplete="current-password" {...c} {...register('current')} />}
            </Field>
            <Field label="New password" required error={errors.next?.message} hint="At least 8 characters.">
              {(c) => <Input type="password" autoComplete="new-password" {...c} {...register('next')} />}
            </Field>
            <Field label="Confirm new password" required error={errors.confirm?.message}>
              {(c) => <Input type="password" autoComplete="new-password" {...c} {...register('confirm')} />}
            </Field>
          </div>
        </SettingsSection>
      </form>

      <SettingsSection title="Two-factor authentication" description="Add a second step when you sign in.">
        <SettingRow label="Authenticator app" description="Use an app to generate one-time codes." htmlFor="two-factor">
          <Switch
            id="two-factor"
            checked={twoFactor}
            onCheckedChange={(value) => {
              setTwoFactor(value)
              toast.success(value ? 'Two-factor enabled (demo)' : 'Two-factor disabled')
            }}
          />
        </SettingRow>
      </SettingsSection>

      <SettingsSection title="Active sessions" description="Devices currently signed in to your account.">
        <ul className="divide-y divide-border">
          {sessions.map((session) => (
            <li key={session.id} className="flex items-center gap-3 py-3.5 first:pt-0 last:pb-0">
              <span className="grid size-10 place-items-center rounded-lg bg-subtle text-muted">
                <session.icon className="size-5" aria-hidden />
              </span>
              <div className="min-w-0 flex-1">
                <p className="font-medium">{session.device}</p>
                <p className="text-caption text-muted">{session.place}</p>
              </div>
              {session.current ? (
                <Badge variant="success" dot>
                  This device
                </Badge>
              ) : (
                <Button
                  size="sm"
                  onClick={() => {
                    setSessions((prev) => prev.filter((s) => s.id !== session.id))
                    toast.success('Session signed out')
                  }}
                >
                  Sign out
                </Button>
              )}
            </li>
          ))}
        </ul>
      </SettingsSection>
    </>
  )
}
