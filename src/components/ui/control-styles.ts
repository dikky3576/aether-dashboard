/**
 * Shared look for every text-entry control (Input, Textarea, Select trigger, SearchInput).
 * One definition keeps borders, focus rings and error states identical everywhere.
 */
export const controlBase =
  'h-10 w-full rounded-control border bg-surface px-3 text-body text-foreground shadow-xs ' +
  'transition-[border-color,box-shadow] duration-150 placeholder:text-muted ' +
  'focus-visible:border-accent focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-accent-soft ' +
  'disabled:cursor-not-allowed disabled:opacity-50'

export function controlState(invalid?: boolean): string {
  return invalid
    ? 'border-danger focus-visible:border-danger focus-visible:ring-danger-soft'
    : 'border-border hover:border-border-strong'
}

/** Menu / popover surface shared by DropdownMenu and Select. */
export const popoverSurface =
  'z-50 rounded-control border border-border bg-elevated p-1 text-foreground shadow-overlay ' +
  'data-[state=open]:animate-pop-in data-[state=closed]:animate-pop-out'

/** Row inside a menu / listbox. */
export const menuItemBase =
  'relative flex h-9 cursor-default select-none items-center gap-2 rounded-md px-2.5 text-body outline-none ' +
  'data-[disabled]:pointer-events-none data-[disabled]:opacity-50 data-[highlighted]:bg-subtle ' +
  '[&_svg]:size-4 [&_svg]:shrink-0 [&_svg]:opacity-70'
