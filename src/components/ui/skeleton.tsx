import type { ComponentProps } from 'react'
import { cn } from '@/lib/cn'

/** Loading placeholder. Size it with className (h-4 w-32, size-10 rounded-full …). */
export function Skeleton({ className, ...props }: ComponentProps<'div'>) {
  return <div aria-hidden className={cn('animate-pulse rounded-md bg-border/70', className)} {...props} />
}
