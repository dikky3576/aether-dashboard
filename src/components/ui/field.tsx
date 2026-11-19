import { useId, type ReactNode } from 'react'
import { cn } from '@/lib/cn'

/** Props to spread onto the control rendered inside <Field>. */
export interface FieldControlProps {
  id: string
  'aria-describedby'?: string
  invalid?: boolean
}

interface FieldProps {
  label: string
  hint?: string
  error?: string
  required?: boolean
  className?: string
  children: (control: FieldControlProps) => ReactNode
}

/**
 * Label + control + hint/error, wired for screen readers.
 *   <Field label="Email" error={errors.email}>{(c) => <Input type="email" {...c} />}</Field>
 */
export function Field({ label, hint, error, required, className, children }: FieldProps) {
  const id = useId()
  const hintId = `${id}-hint`
  const errorId = `${id}-error`
  const describedBy = error ? errorId : hint ? hintId : undefined

  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      <label htmlFor={id} className="text-body font-medium text-foreground">
        {label}
        {required && (
          <span aria-hidden className="ml-0.5 text-danger">
            *
          </span>
        )}
      </label>
      {children({ id, 'aria-describedby': describedBy, invalid: Boolean(error) })}
      {error ? (
        <p id={errorId} role="alert" className="text-caption text-danger">
          {error}
        </p>
      ) : hint ? (
        <p id={hintId} className="text-caption text-muted">
          {hint}
        </p>
      ) : null}
    </div>
  )
}
