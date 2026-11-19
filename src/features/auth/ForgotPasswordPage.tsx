import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link } from 'react-router'
import { ArrowLeft, MailCheck } from 'lucide-react'
import { z } from 'zod'
import { Button, Field, Input } from '@/components/ui'
import { ROUTES } from '@/config/routes'
import { useDocumentTitle } from '@/hooks/use-document-title'

const schema = z.object({
  email: z.string().trim().min(1, 'Enter your email address.').email('Enter a valid email address.'),
})
type FormValues = z.infer<typeof schema>

export function ForgotPasswordPage() {
  useDocumentTitle('Forgot password')
  const [sentTo, setSentTo] = useState<string | null>(null)
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema), defaultValues: { email: '' } })

  const onSubmit = handleSubmit(async (values) => {
    // Replace with your "send reset email" call.
    await new Promise((resolve) => window.setTimeout(resolve, 800))
    setSentTo(values.email)
  })

  if (sentTo) {
    return (
      <div role="status">
        <span className="mb-5 grid size-12 place-items-center rounded-xl bg-success-soft text-success">
          <MailCheck className="size-6" strokeWidth={1.75} aria-hidden />
        </span>
        <h1 className="text-title font-semibold">Check your email</h1>
        <p className="mt-1.5 text-body text-muted">
          If an account exists for <span className="font-medium text-foreground">{sentTo}</span>, a reset link is on its way.
        </p>
        <div className="mt-8 space-y-3">
          <Button asChild variant="primary" size="lg" className="w-full">
            <Link to={ROUTES.resetPassword}>Open demo reset page</Link>
          </Button>
          <Button size="lg" className="w-full" onClick={() => setSentTo(null)}>
            Use a different email
          </Button>
        </div>
      </div>
    )
  }

  return (
    <>
      <h1 className="text-title font-semibold">Forgot your password?</h1>
      <p className="mt-1.5 text-body text-muted">Enter your email and we’ll send you a reset link.</p>

      <form onSubmit={onSubmit} noValidate className="mt-8 space-y-4">
        <Field label="Email" required error={errors.email?.message}>
          {(c) => <Input type="email" autoComplete="email" placeholder="name@company.com" autoFocus {...c} {...register('email')} />}
        </Field>
        <Button type="submit" variant="primary" size="lg" className="w-full" loading={isSubmitting}>
          Send reset link
        </Button>
      </form>

      <Link
        to={ROUTES.login}
        className="mt-6 inline-flex items-center gap-1.5 text-body font-medium text-accent-text hover:underline"
      >
        <ArrowLeft className="size-4" aria-hidden /> Back to sign in
      </Link>
    </>
  )
}
