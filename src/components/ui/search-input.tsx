import type { ComponentProps } from 'react'
import { Search, X } from 'lucide-react'
import { cn } from '@/lib/cn'
import { controlBase, controlState } from '@/components/ui/control-styles'

export interface SearchInputProps
  extends Omit<ComponentProps<'input'>, 'value' | 'onChange' | 'type'> {
  value: string
  onValueChange: (value: string) => void
  /** Keyboard hint shown while empty, e.g. "⌘K". Decorative only. */
  shortcut?: string
}

export function SearchInput({
  value,
  onValueChange,
  shortcut,
  className,
  placeholder = 'Search…',
  'aria-label': ariaLabel = 'Search',
  ...props
}: SearchInputProps) {
  return (
    <div className={cn('relative w-full', className)}>
      <Search
        aria-hidden
        className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted"
      />
      <input
        type="search"
        value={value}
        placeholder={placeholder}
        aria-label={ariaLabel}
        onChange={(e) => onValueChange(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Escape' && value) {
            e.preventDefault()
            onValueChange('')
          }
        }}
        className={cn(
          controlBase,
          controlState(),
          'pl-9 pr-9 [&::-webkit-search-cancel-button]:appearance-none',
        )}
        {...props}
      />
      {value ? (
        <button
          type="button"
          aria-label="Clear search"
          onClick={() => onValueChange('')}
          className="absolute right-1.5 top-1/2 grid size-7 -translate-y-1/2 place-items-center rounded-md text-muted transition-colors duration-150 hover:bg-subtle hover:text-foreground"
        >
          <X className="size-4" aria-hidden />
        </button>
      ) : shortcut ? (
        <kbd
          aria-hidden
          className="pointer-events-none absolute right-2.5 top-1/2 hidden -translate-y-1/2 rounded-md border border-border bg-subtle px-1.5 py-0.5 font-mono text-caption text-muted sm:block"
        >
          {shortcut}
        </kbd>
      ) : null}
    </div>
  )
}
