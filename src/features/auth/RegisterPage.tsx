import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link, useNavigate } from 'react-router'
import { toast } from 'sonner'
import { z } from 'zod'
import { Button, Checkbox, Field, Input } from '@/components/ui'
import { ROUTES } from '@/config/routes'
import { PasswordInput, PasswordStrength, passwordScore } from '@/features/auth/PasswordInput'
import { useDocumentTitle } from '@/hooks/use-document-title'

const schema = z.object({
  name: z.string().trim().min(2, 'Use at least 2 characters.'),
  email: z.string().trim().min(1, 'Enter your email address.').email('Enter a valid email address.'),
  password: z
    .string()
    .min(8, 'Use at least 8 characters.')
    .refine((v) => passwordScore(v) >= 2, 'Add numbers, capitals or a symbol to strengthen it.'),
  terms: z.boolean().refine((v) => v, 'Accept the terms to continue.'),
})
type FormValues = z.infer<typeof schema>

export function RegisterPage() {
  useDocumentTitle('Create account')
  const navigate = useNavigate()
  const {
    register,
    control,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema), defaultValues: { name: '', email: '', password: '', terms: false } })

  const onSubmit = handleSubmit(async () => {
    // Replace with your sign-up call.
    await new Promise((resolve) => window.setTimeout(resolve, 900))
    toast.success('Account created (demo)')
    navigate(ROUTES.overview)
  })

  return (
    <>
      <h1 className="text-title font-semibold">Create your account</h1>
      <p className="mt-1.5 text-body text-muted">Start your workspace in a minute.</p>

      <form onSubmit={onSubmit} noValidate className="mt-8 space-y-4">
        <Field label="Full name" required error={errors.name?.message}>
          {(c) => <Input autoComplete="name" autoFocus {...c} {...register('name')} />}
        </Field>
        <Field label="Work email" required error={errors.email?.message}>
          {(c) => <Input type="email" autoComplete="email" placeholder="name@company.com" {...c} {...register('email')} />}
        </Field>
        <Field label="Password" required error={errors.password?.message}>
          {(c) => (
            <>
              <PasswordInput autoComplete="new-password" {...c} {...register('password')} />
              <PasswordStrength value={watch('password')} />
            </>
          )}
        </Field>

        <Controller
          control={control}
          name="terms"
          render={({ field }) => (
            <div>
              <label className="flex cursor-pointer items-start gap-2.5 text-body">
                <Checkbox
                  className="mt-0.5"
                  checked={field.value}
                  onCheckedChange={(v) => field.onChange(v === true)}
                  aria-invalid={Boolean(errors.terms) || undefined}
                />
                <span>I agree to the Terms of Service and Privacy Policy.</span>
              </label>
              {errors.terms && (
                <p role="alert" className="mt-1.5 text-caption text-danger">
                  {errors.terms.message}
                </p>
              )}
            </div>
          )}
        />

        <Button type="submit" variant="primary" size="lg" className="w-full" loading={isSubmitting}>
          Create account
        </Button>
      </form>

      <p className="mt-6 text-center text-body text-muted">
        Already have an account?{' '}
        <Link to={ROUTES.login} className="font-medium text-accent-text hover:underline">
          Sign in
        </Link>
      </p>
    </>
  )
}
