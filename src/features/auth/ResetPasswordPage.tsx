import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link, useNavigate } from 'react-router'
import { toast } from 'sonner'
import { z } from 'zod'
import { Button, Field } from '@/components/ui'
import { ROUTES } from '@/config/routes'
import { PasswordInput, PasswordStrength, passwordScore } from '@/features/auth/PasswordInput'
import { useDocumentTitle } from '@/hooks/use-document-title'

const schema = z
  .object({
    password: z
      .string()
      .min(8, 'Use at least 8 characters.')
      .refine((v) => passwordScore(v) >= 2, 'Add numbers, capitals or a symbol to strengthen it.'),
    confirm: z.string().min(1, 'Confirm your new password.'),
  })
  .refine((v) => v.password === v.confirm, { path: ['confirm'], message: 'Passwords don’t match.' })
type FormValues = z.infer<typeof schema>

export function ResetPasswordPage() {
  useDocumentTitle('Reset password')
  const navigate = useNavigate()
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema), defaultValues: { password: '', confirm: '' } })

  const onSubmit = handleSubmit(async () => {
    // Replace with your "set new password" call (the reset token would come from the URL).
    await new Promise((resolve) => window.setTimeout(resolve, 800))
    toast.success('Password updated (demo). Please sign in.')
    navigate(ROUTES.login)
  })

  return (
    <>
      <h1 className="text-title font-semibold">Set a new password</h1>
      <p className="mt-1.5 text-body text-muted">Choose something you haven’t used before.</p>

      <form onSubmit={onSubmit} noValidate className="mt-8 space-y-4">
        <Field label="New password" required error={errors.password?.message}>
          {(c) => (
            <>
              <PasswordInput autoComplete="new-password" autoFocus {...c} {...register('password')} />
              <PasswordStrength value={watch('password')} />
            </>
          )}
        </Field>
        <Field label="Confirm new password" required error={errors.confirm?.message}>
          {(c) => <PasswordInput autoComplete="new-password" {...c} {...register('confirm')} />}
        </Field>
        <Button type="submit" variant="primary" size="lg" className="w-full" loading={isSubmitting}>
          Update password
        </Button>
      </form>

      <p className="mt-6 text-center text-body text-muted">
        <Link to={ROUTES.login} className="font-medium text-accent-text hover:underline">
          Back to sign in
        </Link>
      </p>
    </>
  )
}
