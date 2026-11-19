import { useState } from 'react'
import { toast } from 'sonner'
import { Check, CreditCard } from 'lucide-react'
import { PageHeader } from '@/components/layout/PageHeader'
import { Badge, Button, Card, ConfirmDialog, Progress, Switch } from '@/components/ui'
import { CURRENT_PLAN_ID, PRICING_PLANS, USAGE, type PricingPlan } from '@/data/finance'
import { cn } from '@/lib/cn'
import { formatCurrency } from '@/lib/format'

export function BillingPage() {
  const [yearly, setYearly] = useState(false)
  const [currentId, setCurrentId] = useState(CURRENT_PLAN_ID)
  const [target, setTarget] = useState<PricingPlan | null>(null)

  const current = PRICING_PLANS.find((p) => p.id === currentId) ?? PRICING_PLANS[0]
  const currentIndex = PRICING_PLANS.findIndex((p) => p.id === currentId)

  return (
    <>
      <PageHeader
        title="Subscription & Billing"
        description="Manage your plan, usage and payment method."
      />

      <div className="mt-6 grid gap-5 xl:grid-cols-12">
        <Card className="xl:col-span-7">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-caption font-medium text-muted">Current plan</p>
              <h2 className="mt-1 text-section font-semibold">{current?.name}</h2>
              <p className="mt-0.5 text-body text-muted">
                {current ? formatCurrency(yearly ? current.yearly : current.monthly) : ''} per month ·{' '}
                {yearly ? 'billed yearly' : 'billed monthly'}
              </p>
            </div>
            <Badge variant="success" dot>
              Active
            </Badge>
          </div>
          <ul className="mt-6 space-y-5">
            {USAGE.map((item) => (
              <li key={item.id}>
                <div className="mb-1.5 flex justify-between text-body">
                  <span>{item.label}</span>
                  <span className="tabular text-muted">
                    {item.used}
                    {item.unit} of {item.limit}
                    {item.unit}
                  </span>
                </div>
                <Progress
                  value={item.used}
                  max={item.limit}
                  tone={item.used / item.limit > 0.85 ? 'warning' : 'accent'}
                  label={`${item.label} usage`}
                />
              </li>
            ))}
          </ul>
        </Card>

        <Card className="xl:col-span-5">
          <h3 className="text-card font-medium">Payment method</h3>
          <div className="mt-4 flex items-center gap-3 rounded-control border border-border p-4">
            <span className="grid size-10 place-items-center rounded-lg bg-accent-soft text-accent-text">
              <CreditCard className="size-5" aria-hidden />
            </span>
            <div className="min-w-0 flex-1">
              <p className="font-medium">Card ending in 4242</p>
              <p className="text-caption text-muted">Expires 08/28 · demo data</p>
            </div>
            <Button size="sm" onClick={() => toast.info('Connect your payment provider to manage cards.')}>
              Update
            </Button>
          </div>
          <p className="mt-4 text-caption text-muted">
            No payments are processed in this template. Connect your own billing provider to go live.
          </p>
        </Card>
      </div>

      <div className="mt-8 flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-section font-semibold">Plans</h2>
        <label className="flex items-center gap-3 text-body">
          <span className={cn(!yearly && 'font-medium')}>Monthly</span>
          <Switch checked={yearly} onCheckedChange={setYearly} aria-label="Bill yearly" />
          <span className={cn(yearly && 'font-medium')}>
            Yearly <Badge variant="success">Save 20%</Badge>
          </span>
        </label>
      </div>

      <div className="mt-4 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {PRICING_PLANS.map((plan, index) => {
          const isCurrent = plan.id === currentId
          return (
            <Card key={plan.id} className={cn('flex flex-col', isCurrent && 'border-accent ring-1 ring-accent')}>
              <div className="flex items-center justify-between">
                <h3 className="text-card font-medium">{plan.name}</h3>
                {isCurrent && <Badge variant="accent">Current</Badge>}
              </div>
              <p className="mt-1 text-caption text-muted">{plan.description}</p>
              <p className="tabular mt-4 text-kpi font-semibold">
                {formatCurrency(yearly ? plan.yearly : plan.monthly)}
                <span className="text-body font-normal text-muted"> /mo</span>
              </p>
              <ul className="mt-5 flex-1 space-y-2">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex gap-2 text-body">
                    <Check className="mt-0.5 size-4 shrink-0 text-success" aria-hidden /> {feature}
                  </li>
                ))}
              </ul>
              <Button
                className="mt-6 w-full"
                variant={isCurrent ? 'secondary' : 'primary'}
                disabled={isCurrent}
                onClick={() => setTarget(plan)}
              >
                {isCurrent ? 'Your plan' : index > currentIndex ? 'Upgrade' : 'Downgrade'}
              </Button>
            </Card>
          )
        })}
      </div>

      <ConfirmDialog
        open={target !== null}
        onOpenChange={(open) => !open && setTarget(null)}
        title={`Switch to ${target?.name ?? ''}?`}
        description="This is a demo — no charge is made. In a real app this would call your billing provider."
        confirmLabel="Switch plan"
        onConfirm={async () => {
          await new Promise((resolve) => window.setTimeout(resolve, 600))
          if (target) {
            setCurrentId(target.id)
            toast.success(`You’re now on ${target.name}`)
          }
        }}
      />
    </>
  )
}
