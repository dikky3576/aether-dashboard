import { useMemo, useState } from 'react'
import { toast } from 'sonner'
import { PageHeader } from '@/components/layout/PageHeader'
import { Badge, Button, Card, ConfirmDialog, SearchInput } from '@/components/ui'
import { INTEGRATIONS, type Integration } from '@/data/workspace'

export function IntegrationsPage() {
  const [connected, setConnected] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(INTEGRATIONS.map((i) => [i.id, i.connected])),
  )
  const [query, setQuery] = useState('')
  const [toDisconnect, setToDisconnect] = useState<Integration | null>(null)

  const items = useMemo(() => {
    const q = query.trim().toLowerCase()
    return INTEGRATIONS.filter((i) => !q || i.name.toLowerCase().includes(q) || i.category.toLowerCase().includes(q))
  }, [query])

  function connect(item: Integration) {
    setConnected((prev) => ({ ...prev, [item.id]: true }))
    toast.success(`${item.name} connected (demo)`)
  }

  return (
    <>
      <PageHeader title="Integrations" description="Connect the tools your team already uses." />
      <SearchInput
        className="mt-6 sm:max-w-xs"
        value={query}
        onValueChange={setQuery}
        placeholder="Search integrations…"
        aria-label="Search integrations"
      />
      {items.length === 0 ? (
        <p className="mt-8 text-body text-muted">No integrations match “{query}”.</p>
      ) : (
        <div className="mt-5 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {items.map((item) => {
            const isOn = connected[item.id]
            return (
              <Card key={item.id} className="flex flex-col">
                <div className="flex items-start justify-between gap-3">
                  <span className="grid size-10 place-items-center rounded-lg bg-accent-soft text-accent-text">
                    <item.icon className="size-5" strokeWidth={1.75} aria-hidden />
                  </span>
                  {isOn && (
                    <Badge variant="success" dot>
                      Connected
                    </Badge>
                  )}
                </div>
                <h2 className="mt-4 text-card font-medium">{item.name}</h2>
                <p className="text-caption text-muted">{item.category}</p>
                <p className="mt-2 flex-1 text-body text-muted">{item.description}</p>
                {isOn ? (
                  <Button className="mt-4" onClick={() => setToDisconnect(item)}>
                    Disconnect
                  </Button>
                ) : (
                  <Button className="mt-4" variant="primary" onClick={() => connect(item)}>
                    Connect
                  </Button>
                )}
              </Card>
            )
          })}
        </div>
      )}

      <ConfirmDialog
        open={toDisconnect !== null}
        onOpenChange={(open) => !open && setToDisconnect(null)}
        tone="danger"
        title={`Disconnect ${toDisconnect?.name ?? ''}?`}
        description="Data will stop syncing until you connect it again."
        confirmLabel="Disconnect"
        onConfirm={async () => {
          await new Promise((resolve) => window.setTimeout(resolve, 400))
          if (toDisconnect) {
            setConnected((prev) => ({ ...prev, [toDisconnect.id]: false }))
            toast.success(`${toDisconnect.name} disconnected`)
          }
        }}
      />
    </>
  )
}
