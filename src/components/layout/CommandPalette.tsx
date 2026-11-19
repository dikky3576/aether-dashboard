import { useEffect, useMemo, useState, type KeyboardEvent } from 'react'
import { useNavigate } from 'react-router'
import * as Dialog from '@radix-ui/react-dialog'
import { FolderKanban, Monitor, Moon, PanelLeft, Search, Sun, Users, UsersRound, type LucideIcon } from 'lucide-react'
import { NAV_ITEMS } from '@/config/navigation'
import { ROUTES, customerPath, projectPath } from '@/config/routes'
import { useTheme } from '@/hooks/use-theme'
import { cn } from '@/lib/cn'
import { useCustomersStore } from '@/stores/customers-store'
import { useProjectsStore } from '@/stores/projects-store'
import { useTeamStore } from '@/stores/team-store'
import { useUiStore } from '@/stores/ui-store'

/** Records are only searched once the user types, and each group is capped so the list stays scannable. */
const MAX_PER_DATA_GROUP = 5

interface PaletteCommand {
  id: string
  label: string
  group: string
  icon: LucideIcon
  keywords?: string
  /** Secondary text shown at the end of the row (e.g. an email address). */
  hint?: string
  run: () => void
}

function matches(command: PaletteCommand, query: string): boolean {
  const haystack = `${command.label} ${command.keywords ?? ''} ${command.hint ?? ''} ${command.group}`.toLowerCase()
  // Every word must match, in any order: "lena fischer" or "fischer lena" both find Lena Fischer.
  return query.split(/\s+/).every((word) => haystack.includes(word))
}

function PaletteBody({ close }: { close: () => void }) {
  const navigate = useNavigate()
  const { setTheme } = useTheme()
  const toggleSidebar = useUiStore((s) => s.toggleSidebar)
  const customers = useCustomersStore((s) => s.customers)
  const projects = useProjectsStore((s) => s.projects)
  const members = useTeamStore((s) => s.members)
  const [query, setQuery] = useState('')
  const [active, setActive] = useState(0)

  const commands = useMemo<PaletteCommand[]>(
    () => [
      ...NAV_ITEMS.map((item) => ({
        id: `page-${item.to}`,
        label: item.label,
        group: 'Pages',
        icon: item.icon,
        keywords: item.keywords,
        run: () => navigate(item.to),
      })),
      { id: 'toggle-sidebar', label: 'Toggle sidebar', group: 'Actions', icon: PanelLeft, keywords: 'collapse expand', run: toggleSidebar },
      { id: 'theme-light', label: 'Switch to light theme', group: 'Theme', icon: Sun, run: () => setTheme('light') },
      { id: 'theme-dark', label: 'Switch to dark theme', group: 'Theme', icon: Moon, run: () => setTheme('dark') },
      { id: 'theme-system', label: 'Use system theme', group: 'Theme', icon: Monitor, run: () => setTheme('system') },
    ],
    [navigate, setTheme, toggleSidebar],
  )

  const dataCommands = useMemo<PaletteCommand[]>(
    () => [
      ...customers.map((c) => ({
        id: `customer-${c.id}`,
        label: c.name,
        group: 'Customers',
        icon: Users,
        keywords: `${c.company} ${c.country}`,
        hint: c.email,
        run: () => navigate(customerPath(c.id)),
      })),
      ...projects.map((p) => ({
        id: `project-${p.id}`,
        label: p.name,
        group: 'Projects',
        icon: FolderKanban,
        keywords: `${p.client} ${p.owner}`,
        hint: p.client,
        run: () => navigate(projectPath(p.id)),
      })),
      ...members.map((m) => ({
        id: `member-${m.id}`,
        label: m.name,
        group: 'Team',
        icon: UsersRound,
        keywords: m.role,
        hint: m.email,
        run: () => navigate(`${ROUTES.team}?q=${encodeURIComponent(m.name)}`),
      })),
    ],
    [customers, projects, members, navigate],
  )

  const results = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return commands
    const fromCommands = commands.filter((c) => matches(c, q))
    const counts = new Map<string, number>()
    const fromData = dataCommands.filter((c) => {
      if (!matches(c, q)) return false
      const count = (counts.get(c.group) ?? 0) + 1
      counts.set(c.group, count)
      return count <= MAX_PER_DATA_GROUP
    })
    return [...fromCommands, ...fromData]
  }, [commands, dataCommands, query])

  const groups = useMemo(() => {
    const map = new Map<string, { command: PaletteCommand; index: number }[]>()
    results.forEach((command, index) => {
      const list = map.get(command.group) ?? []
      list.push({ command, index })
      map.set(command.group, list)
    })
    return [...map.entries()]
  }, [results])

  const activeIndex = Math.min(active, Math.max(results.length - 1, 0))

  useEffect(() => {
    document.getElementById(`palette-opt-${activeIndex}`)?.scrollIntoView({ block: 'nearest' })
  }, [activeIndex])

  function run(command: PaletteCommand) {
    close()
    command.run()
  }

  function onKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (results.length === 0) return
    if (event.key === 'ArrowDown') {
      event.preventDefault()
      setActive((activeIndex + 1) % results.length)
    } else if (event.key === 'ArrowUp') {
      event.preventDefault()
      setActive((activeIndex - 1 + results.length) % results.length)
    } else if (event.key === 'Enter') {
      const command = results[activeIndex]
      if (command) {
        event.preventDefault()
        run(command)
      }
    }
  }

  return (
    <div>
      <div className="flex items-center gap-3 border-b border-border px-4">
        <Search className="size-4 shrink-0 text-muted" aria-hidden />
        <input
          autoFocus
          role="combobox"
          aria-expanded="true"
          aria-controls="palette-list"
          aria-activedescendant={results.length > 0 ? `palette-opt-${activeIndex}` : undefined}
          aria-label="Search pages, customers, projects and people"
          placeholder="Search pages, customers, projects…"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value)
            setActive(0)
          }}
          onKeyDown={onKeyDown}
          className="h-14 min-w-0 flex-1 bg-transparent text-body outline-none placeholder:text-muted"
        />
        <kbd className="hidden rounded-md border border-border bg-subtle px-1.5 py-0.5 font-mono text-caption text-muted sm:block">
          Esc
        </kbd>
      </div>

      <ul id="palette-list" role="listbox" aria-label="Results" className="max-h-80 overflow-y-auto p-2">
        {results.length === 0 && (
          <li role="presentation" className="px-3 py-10 text-center text-body text-muted">
            No results for “{query}”
          </li>
        )}
        {groups.map(([group, entries]) => (
          <li key={group} role="presentation">
            <p className="px-2.5 pb-1 pt-2 text-caption font-medium text-muted">{group}</p>
            <ul role="presentation">
              {entries.map(({ command, index }) => {
                const Icon = command.icon
                return (
                  <li
                    key={command.id}
                    id={`palette-opt-${index}`}
                    role="option"
                    aria-selected={index === activeIndex}
                    onMouseMove={() => setActive(index)}
                    onClick={() => run(command)}
                    className={cn(
                      'flex h-10 cursor-default items-center gap-3 rounded-lg px-2.5 text-body',
                      index === activeIndex && 'bg-subtle',
                    )}
                  >
                    <Icon className="size-4 shrink-0 text-muted" strokeWidth={1.75} aria-hidden />
                    <span className="truncate">{command.label}</span>
                    {command.hint && (
                      <span className="ml-auto hidden max-w-[45%] truncate text-caption text-muted sm:block">{command.hint}</span>
                    )}
                  </li>
                )
              })}
            </ul>
          </li>
        ))}
      </ul>

      <div className="hidden items-center gap-4 border-t border-border px-4 py-2.5 text-caption text-muted sm:flex">
        <span>
          <kbd className="font-mono">↑↓</kbd> navigate
        </span>
        <span>
          <kbd className="font-mono">↵</kbd> select
        </span>
      </div>
    </div>
  )
}

/** ⌘K command palette: jump to any page or run a quick action without leaving the keyboard. */
export function CommandPalette() {
  const open = useUiStore((s) => s.commandOpen)
  const setOpen = useUiStore((s) => s.setCommandOpen)

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/50 data-[state=open]:animate-fade-in data-[state=closed]:animate-fade-out" />
        <Dialog.Content
          aria-describedby={undefined}
          className="fixed left-1/2 top-[12dvh] z-50 w-[calc(100%-2rem)] max-w-xl -translate-x-1/2 overflow-hidden rounded-card border border-border bg-elevated shadow-overlay outline-none data-[state=open]:animate-dialog-in data-[state=closed]:animate-dialog-out"
        >
          <Dialog.Title className="sr-only">Command palette</Dialog.Title>
          <PaletteBody close={() => setOpen(false)} />
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
