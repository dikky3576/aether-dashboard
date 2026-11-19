import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link, useNavigate } from 'react-router'
import { toast } from 'sonner'
import { z } from 'zod'
import { Button, Checkbox, Field, Input } from '@/components/ui'
import { ROUTES } from '@/config/routes'
import { PasswordInput } from '@/features/auth/PasswordInput'
import { useDocumentTitle } from '@/hooks/use-document-title'

const schema = z.object({
  email: z.string().trim().min(1, 'Enter your email address.').email('Enter a valid email address.'),
  password: z.string().min(1, 'Enter your password.'),
  remember: z.boolean(),
})
type FormValues = z.infer<typeof schema>

export function LoginPage() {
  useDocumentTitle('Sign in')
  const navigate = useNavigate()
  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema), defaultValues: { email: '', password: '', remember: true } })

  const onSubmit = handleSubmit(async () => {
    // Replace with your authentication call. This demo accepts any valid-looking input.
    await new Promise((resolve) => window.setTimeout(resolve, 800))
    toast.success('Signed in (demo)')
    navigate(ROUTES.overview)
  })

  return (
    <>
      <h1 className="text-title font-semibold">Welcome back</h1>
      <p className="mt-1.5 text-body text-muted">Sign in to continue to your workspace.</p>

      <form onSubmit={onSubmit} noValidate className="mt-8 space-y-4">
        <Field label="Email" required error={errors.email?.message}>
          {(c) => <Input type="email" autoComplete="email" placeholder="name@company.com" autoFocus {...c} {...register('email')} />}
        </Field>
        <Field label="Password" required error={errors.password?.message}>
          {(c) => <PasswordInput autoComplete="current-password" {...c} {...register('password')} />}
        </Field>

        <div className="flex items-center justify-between gap-3">
          <Controller
            control={control}
            name="remember"
            render={({ field }) => (
              <label className="flex cursor-pointer items-center gap-2.5 text-body">
                <Checkbox checked={field.value} onCheckedChange={(v) => field.onChange(v === true)} />
                Keep me signed in
              </label>
            )}
          />
          <Link to={ROUTES.forgotPassword} className="text-body font-medium text-accent-text hover:underline">
            Forgot password?
          </Link>
        </div>

        <Button type="submit" variant="primary" size="lg" className="w-full" loading={isSubmitting}>
          Sign in
        </Button>
      </form>

      <p className="mt-6 text-center text-body text-muted">
        New to Aether?{' '}
        <Link to={ROUTES.register} className="font-medium text-accent-text hover:underline">
          Create an account
        </Link>
      </p>
    </>
  )
}
