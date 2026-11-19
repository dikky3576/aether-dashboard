import type { ReactNode } from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import { X } from 'lucide-react'
import { cn } from '@/lib/cn'

const SIZES = {
  sm: 'sm:max-w-sm',
  md: 'sm:max-w-md',
  lg: 'sm:max-w-xl',
} as const

export interface ModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description?: string
  children?: ReactNode
  footer?: ReactNode
  size?: keyof typeof SIZES
}

/**
 * Accessible dialog. Focus is trapped, Esc and outside-click close it.
 * On phones it docks to the bottom as a sheet; from `sm` up it is centered.
 */
export function Modal({ open, onOpenChange, title, description, children, footer, size = 'md' }: ModalProps) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/50 data-[state=open]:animate-fade-in data-[state=closed]:animate-fade-out" />
        <Dialog.Content
          {...(description ? {} : { 'aria-describedby': undefined })}
          className={cn(
            'fixed z-50 flex max-h-[88dvh] flex-col border border-border bg-elevated shadow-overlay outline-none',
            'inset-x-0 bottom-0 rounded-t-2xl',
            'sm:inset-x-auto sm:bottom-auto sm:left-1/2 sm:top-1/2 sm:w-[calc(100%-2rem)] sm:-translate-x-1/2 sm:-translate-y-1/2 sm:rounded-card',
            'data-[state=open]:animate-dialog-in data-[state=closed]:animate-dialog-out',
            SIZES[size],
          )}
        >
          <header className="flex items-start justify-between gap-4 px-5 pt-5 sm:px-6 sm:pt-6">
            <div className="min-w-0">
              <Dialog.Title className="text-section font-semibold">{title}</Dialog.Title>
              {description && (
                <Dialog.Description className="mt-1 text-body text-muted">{description}</Dialog.Description>
              )}
            </div>
            <Dialog.Close
              aria-label="Close"
              className="-mr-1.5 -mt-1 grid size-8 shrink-0 place-items-center rounded-lg text-muted transition-colors duration-150 hover:bg-subtle hover:text-foreground"
            >
              <X className="size-4" aria-hidden />
            </Dialog.Close>
          </header>

          {children && <div className="overflow-y-auto px-5 py-4 sm:px-6">{children}</div>}

          {footer && (
            <footer className="flex flex-col-reverse gap-2 border-t border-border px-5 py-4 sm:flex-row sm:justify-end sm:px-6">
              {footer}
            </footer>
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
