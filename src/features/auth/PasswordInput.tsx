import { useState, type ComponentProps } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import { Input } from '@/components/ui'
import { cn } from '@/lib/cn'

type PasswordInputProps = Omit<ComponentProps<typeof Input>, 'type'>

/** Password field with a show/hide toggle. Works with react-hook-form's `register`. */
export function PasswordInput({ className, ...props }: PasswordInputProps) {
  const [visible, setVisible] = useState(false)

  return (
    <div className="relative">
      <Input type={visible ? 'text' : 'password'} className={cn('pr-11', className)} {...props} />
      <button
        type="button"
        onClick={() => setVisible((v) => !v)}
        aria-label={visible ? 'Hide password' : 'Show password'}
        aria-pressed={visible}
        className="absolute right-1.5 top-1/2 grid size-8 -translate-y-1/2 place-items-center rounded-md text-muted transition-colors duration-150 hover:bg-subtle hover:text-foreground"
      >
        {visible ? <EyeOff className="size-4" aria-hidden /> : <Eye className="size-4" aria-hidden />}
      </button>
    </div>
  )
}

/** 0–4 score from simple, explainable rules (length, case mix, digit, symbol). */
export function passwordScore(value: string): number {
  let score = 0
  if (value.length >= 8) score++
  if (/[a-z]/.test(value) && /[A-Z]/.test(value)) score++
  if (/\d/.test(value)) score++
  if (/[^A-Za-z0-9]/.test(value) || value.length >= 14) score++
  return score
}

const LABELS = ['Too weak', 'Weak', 'Fair', 'Good', 'Strong'] as const
const BARS = ['bg-danger', 'bg-danger', 'bg-warning', 'bg-success', 'bg-success'] as const

export function PasswordStrength({ value }: { value: string }) {
  if (!value) return null
  const score = passwordScore(value)
  return (
    <div className="mt-2" aria-live="polite">
      <div className="flex gap-1" aria-hidden>
        {[1, 2, 3, 4].map((step) => (
          <span key={step} className={cn('h-1 flex-1 rounded-full bg-border', score >= step && BARS[score])} />
        ))}
      </div>
      <p className="mt-1.5 text-caption text-muted">Password strength: {LABELS[score]}</p>
    </div>
  )
}
