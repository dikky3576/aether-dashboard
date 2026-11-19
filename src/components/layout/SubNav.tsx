import { NavLink } from 'react-router'
import { cn } from '@/lib/cn'

export interface SubNavItem {
  label: string
  to: string
}

/** Page-level tabs that are real routes (shareable URLs, back button works). */
export function SubNav({ items, label, className }: { items: SubNavItem[]; label: string; className?: string }) {
  return (
    <nav aria-label={label} className={cn('overflow-x-auto', className)}>
      <ul className="flex min-w-max gap-1 border-b border-border">
        {items.map((item) => (
          <li key={item.to}>
            <NavLink
              to={item.to}
              end
              className={({ isActive }) =>
                cn(
                  'relative inline-flex h-10 items-center px-3 text-body font-medium transition-colors duration-150',
                  isActive
                    ? 'text-accent-text after:absolute after:inset-x-3 after:-bottom-px after:h-0.5 after:rounded-full after:bg-accent'
                    : 'text-muted hover:text-foreground',
                )
              }
            >
              {item.label}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  )
}
