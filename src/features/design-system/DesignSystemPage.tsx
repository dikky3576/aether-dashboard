import { useState, type ReactNode } from 'react'
import { toast } from 'sonner'
import {
  ArrowUpRight,
  Download,
  FolderPlus,
  MoreHorizontal,
  Pencil,
  Plus,
  Trash2,
  UserPlus,
} from 'lucide-react'
import {
  Avatar,
  Badge,
  Breadcrumb,
  Button,
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
  Checkbox,
  ConfirmDialog,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  EmptyState,
  Field,
  Input,
  Modal,
  Pagination,
  Radio,
  RadioGroup,
  SearchInput,
  Select,
  Skeleton,
  StatusBadge,
  Switch,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Textarea,
  Tooltip,
  type Status,
} from '@/components/ui'
import { ROUTES } from '@/config/routes'
import { ThemeToggle } from '@/components/layout/ThemeToggle'

const STATUSES: Status[] = ['completed', 'paid', 'active', 'pending', 'draft', 'refunded', 'failed', 'overdue', 'inactive']

const PEOPLE = ['Alex Morgan', 'Priya Nair', 'Jonas Weber', 'Sofia Reyes', 'Kenji Mori']

const PLANS = [
  { value: 'starter', label: 'Starter — $19 / mo' },
  { value: 'growth', label: 'Growth — $49 / mo' },
  { value: 'scale', label: 'Scale — $129 / mo' },
  { value: 'enterprise', label: 'Enterprise', disabled: true },
]

function Section({
  id,
  title,
  description,
  children,
}: {
  id: string
  title: string
  description: string
  children: ReactNode
}) {
  return (
    <section aria-labelledby={id} className="mt-14">
      <h2 id={id} className="text-section font-semibold">
        {title}
      </h2>
      <p className="mt-1 text-body text-muted">{description}</p>
      <div className="mt-5">{children}</div>
    </section>
  )
}

/** Phase 2 verification page. Every primitive is exercised here, in both themes. */
export function DesignSystemPage() {
  const [query, setQuery] = useState('')
  const [page, setPage] = useState(3)
  const [modalOpen, setModalOpen] = useState(false)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [emailError, setEmailError] = useState(true)
  const [plan, setPlan] = useState('growth')
  const [loading, setLoading] = useState(false)

  function simulateSave() {
    setLoading(true)
    window.setTimeout(() => {
      setLoading(false)
      toast.success('Changes saved')
    }, 1200)
  }

  return (
    <main className="mx-auto w-full max-w-5xl px-5 py-10 sm:px-8 sm:py-14">
      <Breadcrumb
        items={[
          { label: 'Aether', to: ROUTES.home },
          { label: 'Design system' },
        ]}
      />
      <header className="mt-5 flex flex-wrap items-end justify-between gap-6">
        <div>
          <h1 className="text-title font-semibold">Design system</h1>
          <p className="mt-1.5 max-w-prose text-muted">
            Every shared primitive, in one place. Toggle the theme and tab through each control to check
            contrast and focus states.
          </p>
        </div>
        <ThemeToggle />
      </header>

      <Section id="buttons" title="Buttons" description="Four variants, five sizes. Primary is the only gradient button.">
        <div className="flex flex-wrap items-center gap-3">
          <Button variant="primary">
            <Plus aria-hidden /> New project
          </Button>
          <Button>Secondary</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="danger">
            <Trash2 aria-hidden /> Delete
          </Button>
          <Button variant="primary" loading={loading} onClick={simulateSave}>
            {loading ? 'Saving…' : 'Save changes'}
          </Button>
          <Button disabled>Disabled</Button>
        </div>
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <Button size="sm">Small</Button>
          <Button size="md">Medium</Button>
          <Button size="lg">Large</Button>
          <Tooltip content="Download report">
            <Button size="icon" aria-label="Download report">
              <Download aria-hidden />
            </Button>
          </Tooltip>
          <Tooltip content="Open in new view">
            <Button size="icon-sm" variant="ghost" aria-label="Open in new view">
              <ArrowUpRight aria-hidden />
            </Button>
          </Tooltip>
        </div>
      </Section>

      <Section id="forms" title="Form controls" description="One shared control style: border, focus ring and error state are defined once.">
        <Card>
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Full name" required>
              {(c) => <Input placeholder="Alex Morgan" {...c} />}
            </Field>
            <Field
              label="Work email"
              hint="We’ll send invoices here."
              error={emailError ? 'Enter a valid email address.' : undefined}
            >
              {(c) => (
                <Input
                  type="email"
                  defaultValue="alex@"
                  onChange={(e) => setEmailError(!/^\S+@\S+\.\S+$/.test(e.target.value))}
                  {...c}
                />
              )}
            </Field>
            <Field label="Plan">
              {(c) => (
                <Select
                  id={c.id}
                  aria-describedby={c['aria-describedby']}
                  options={PLANS}
                  value={plan}
                  onValueChange={setPlan}
                />
              )}
            </Field>
            <Field label="Search people">
              {(c) => (
                <SearchInput
                  id={c.id}
                  value={query}
                  onValueChange={setQuery}
                  placeholder="Search people…"
                  shortcut="⌘K"
                />
              )}
            </Field>
            <Field label="Notes" className="sm:col-span-2">
              {(c) => <Textarea placeholder="Anything the team should know…" {...c} />}
            </Field>
          </div>

          <div className="mt-6 grid gap-6 border-t border-border pt-6 sm:grid-cols-3">
            <fieldset className="space-y-2.5">
              <legend className="mb-2.5 text-body font-medium">Checkboxes</legend>
              <label className="flex items-center gap-2.5 text-body">
                <Checkbox defaultChecked /> Weekly summary
              </label>
              <label className="flex items-center gap-2.5 text-body">
                <Checkbox checked="indeterminate" /> Some alerts
              </label>
              <label className="flex items-center gap-2.5 text-body">
                <Checkbox disabled /> Unavailable
              </label>
            </fieldset>

            <fieldset>
              <legend className="mb-2.5 text-body font-medium">Radio group</legend>
              <RadioGroup defaultValue="monthly">
                <label className="flex items-center gap-2.5 text-body">
                  <Radio value="monthly" /> Monthly
                </label>
                <label className="flex items-center gap-2.5 text-body">
                  <Radio value="yearly" /> Yearly
                </label>
              </RadioGroup>
            </fieldset>

            <fieldset className="space-y-2.5">
              <legend className="mb-2.5 text-body font-medium">Switches</legend>
              <label className="flex items-center justify-between gap-3 text-body">
                Email alerts <Switch defaultChecked />
              </label>
              <label className="flex items-center justify-between gap-3 text-body">
                Beta features <Switch />
              </label>
            </fieldset>
          </div>
        </Card>
      </Section>

      <Section id="badges" title="Badges & status" description="Semantic colour is reserved for status. Dot + label, never colour alone.">
        <div className="flex flex-wrap gap-2">
          {STATUSES.map((s) => (
            <StatusBadge key={s} status={s} />
          ))}
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          <Badge variant="accent">Pro</Badge>
          <Badge>Neutral</Badge>
          <Badge variant="info">New</Badge>
        </div>
      </Section>

      <Section id="cards" title="Cards" description="Default for most content. One featured card per view at most.">
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader>
              <div>
                <CardTitle>Total revenue</CardTitle>
                <CardDescription>vs. previous 30 days</CardDescription>
              </div>
              <Badge variant="success">+12.4%</Badge>
            </CardHeader>
            <p className="tabular mt-5 text-kpi font-semibold">$128,430</p>
          </Card>
          <Card variant="featured">
            <CardHeader>
              <div>
                <CardTitle>Active users</CardTitle>
                <CardDescription>vs. previous 30 days</CardDescription>
              </div>
              <span className="rounded-full bg-white/20 px-2.5 py-1 text-caption font-medium">+8.1%</span>
            </CardHeader>
            <p className="tabular mt-5 text-kpi font-semibold">24,812</p>
          </Card>
          <Card variant="elevated">
            <CardHeader>
              <div>
                <CardTitle>Team</CardTitle>
                <CardDescription>5 members online</CardDescription>
              </div>
            </CardHeader>
            <div className="mt-5 flex -space-x-2">
              {PEOPLE.map((p) => (
                <Avatar key={p} name={p} size="sm" className="ring-2 ring-elevated" />
              ))}
            </div>
          </Card>
        </div>
      </Section>

      <Section id="navigation" title="Tabs & pagination" description="Roving-focus tabs; pagination collapses to prev / next on phones.">
        <Card>
          <Tabs defaultValue="all">
            <TabsList>
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="paid">Paid</TabsTrigger>
              <TabsTrigger value="pending">Pending</TabsTrigger>
            </TabsList>
            <TabsContent value="all" className="text-body text-muted">
              Showing every transaction in the selected range.
            </TabsContent>
            <TabsContent value="paid" className="text-body text-muted">
              Only settled payments.
            </TabsContent>
            <TabsContent value="pending" className="text-body text-muted">
              Awaiting confirmation.
            </TabsContent>
          </Tabs>
          <Pagination
            className="mt-6 border-t border-border pt-4"
            page={page}
            pageCount={24}
            onPageChange={setPage}
            totalItems={238}
            pageSize={10}
          />
        </Card>
      </Section>

      <Section id="overlays" title="Menus & dialogs" description="Focus is trapped in dialogs and returned on close. Esc dismisses everything.">
        <div className="flex flex-wrap items-center gap-3">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="secondary">
                <MoreHorizontal aria-hidden /> Actions
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>Project</DropdownMenuLabel>
              <DropdownMenuItem onSelect={() => toast('Opening editor…')}>
                <Pencil aria-hidden /> Edit
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => toast('Invite sent')}>
                <UserPlus aria-hidden /> Invite member
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem destructive onSelect={() => setConfirmOpen(true)}>
                <Trash2 aria-hidden /> Delete project
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button variant="primary" onClick={() => setModalOpen(true)}>
            <FolderPlus aria-hidden /> Create project
          </Button>
          <Button variant="danger" onClick={() => setConfirmOpen(true)}>
            Delete…
          </Button>
          <Button onClick={() => toast.error('Payment could not be processed')}>Error toast</Button>
        </div>
      </Section>

      <Section id="feedback" title="Loading & empty states" description="Skeletons mirror the final layout so nothing jumps when data arrives.">
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <div className="flex items-center gap-3">
              <Skeleton className="size-10 rounded-full" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-3 w-1/3" />
              </div>
            </div>
            <Skeleton className="mt-5 h-8 w-2/5" />
            <Skeleton className="mt-4 h-24 w-full" />
          </Card>
          <Card padding="none">
            <EmptyState
              icon={FolderPlus}
              title="No projects yet"
              description="Create your first project to start tracking work with your team."
              action={
                <Button variant="primary" onClick={() => setModalOpen(true)}>
                  <Plus aria-hidden /> New project
                </Button>
              }
            />
          </Card>
        </div>
      </Section>

      <Modal
        open={modalOpen}
        onOpenChange={setModalOpen}
        title="Create project"
        description="Give it a name — you can change everything later."
        footer={
          <>
            <Button onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button
              variant="primary"
              onClick={() => {
                setModalOpen(false)
                toast.success('Project created')
              }}
            >
              Create project
            </Button>
          </>
        }
      >
        <Field label="Project name" required>
          {(c) => <Input placeholder="Q4 Launch" autoFocus {...c} />}
        </Field>
      </Modal>

      <ConfirmDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        tone="danger"
        title="Delete this project?"
        description="All tasks and files in it will be removed. This can’t be undone."
        confirmLabel="Delete project"
        onConfirm={async () => {
          await new Promise((resolve) => window.setTimeout(resolve, 900))
          toast.success('Project deleted')
        }}
      />
    </main>
  )
}
