import { Check, ChevronDown, ListFilter } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

export interface FilterOption {
  value: string
  label: string
}

interface FilterDropdownProps {
  label: string
  value: string
  onValueChange: (value: string) => void
  options: FilterOption[]
  /** The option meaning "no filter". Defaults to "all". */
  allValue?: string
}

/** Single-choice filter. Shows the active choice on the trigger so filtered state is always visible. */
export function FilterDropdown({ label, value, onValueChange, options, allValue = 'all' }: FilterDropdownProps) {
  const active = options.find((option) => option.value === value)
  const isFiltered = value !== allValue

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="secondary" className={isFiltered ? 'border-accent/50 bg-accent-soft text-accent-text' : undefined}>
          <ListFilter aria-hidden />
          {label}
          {isFiltered && active && <span className="font-semibold">: {active.label}</span>}
          <ChevronDown className="-mr-1 opacity-60" aria-hidden />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="min-w-44">
        <DropdownMenuLabel>{label}</DropdownMenuLabel>
        {options.map((option) => (
          <DropdownMenuItem key={option.value} onSelect={() => onValueChange(option.value)}>
            {option.label}
            {option.value === value && <Check className="ml-auto" aria-label="Selected" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
