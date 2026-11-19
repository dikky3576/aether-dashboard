import type { ComponentProps } from 'react'
import { cn } from '@/lib/cn'
import { controlBase, controlState } from '@/components/ui/control-styles'

export interface InputProps extends ComponentProps<'input'> {
  invalid?: boolean
}

export function Input({ className, invalid, ...props }: InputProps) {
  return (
    <input
      aria-invalid={invalid || undefined}
      className={cn(controlBase, controlState(invalid), className)}
      {...props}
    />
  )
}

export interface TextareaProps extends ComponentProps<'textarea'> {
  invalid?: boolean
}

export function Textarea({ className, invalid, rows = 4, ...props }: TextareaProps) {
  return (
    <textarea
      rows={rows}
      aria-invalid={invalid || undefined}
      className={cn(controlBase, controlState(invalid), 'h-auto min-h-24 resize-y py-2.5', className)}
      {...props}
    />
  )
}
