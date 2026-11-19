import type { ComponentProps } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/cn'

const cardVariants = cva('group/card rounded-card', {
  variants: {
    variant: {
      default: 'border border-border bg-surface shadow-card',
      elevated: 'border border-border bg-elevated shadow-overlay',
      /** Use sparingly — one featured card per view. */
      featured: 'bg-[image:var(--gradient-brand)] text-accent-fg shadow-card',
    },
    padding: {
      none: '',
      sm: 'p-4',
      md: 'p-5 sm:p-6',
    },
  },
  defaultVariants: { variant: 'default', padding: 'md' },
})

export interface CardProps extends ComponentProps<'div'>, VariantProps<typeof cardVariants> {}

export function Card({ className, variant, padding, ...props }: CardProps) {
  return (
    <div
      data-variant={variant ?? 'default'}
      className={cn(cardVariants({ variant, padding }), className)}
      {...props}
    />
  )
}

export function CardHeader({ className, ...props }: ComponentProps<'div'>) {
  return <div className={cn('flex items-start justify-between gap-4', className)} {...props} />
}

export function CardTitle({ className, ...props }: ComponentProps<'h3'>) {
  return <h3 className={cn('text-card font-medium', className)} {...props} />
}

export function CardDescription({ className, ...props }: ComponentProps<'p'>) {
  return (
    <p
      className={cn('mt-0.5 text-caption text-muted group-data-[variant=featured]/card:text-white/80', className)}
      {...props}
    />
  )
}
