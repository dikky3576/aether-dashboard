import { useState } from 'react'
import { toast } from 'sonner'
import { Button, Switch } from '@/components/ui'
import { SettingsSection } from '@/features/settings/SettingsSection'

interface Pref {
  id: string
  label: string
  description: string
  email: boolean
  push: boolean
}

const INITIAL: Pref[] = [
  { id: 'payments', label: 'Payments', description: 'New payments, refunds and failed charges.', email: true, push: true },
  { id: 'team', label: 'Team', description: 'Invitations accepted and role changes.', email: true, push: false },
  { id: 'projects', label: 'Projects', description: 'Milestones, deadlines and status changes.', email: false, push: true },
  { id: 'security', label: 'Security', description: 'New sign-ins and password changes.', email: true, push: true },
]

export function NotificationSettingsPage() {
  const [prefs, setPrefs] = useState(INITIAL)
  const [dirty, setDirty] = useState(false)

  function update(id: string, channel: 'email' | 'push', value: boolean) {
    setPrefs((prev) => prev.map((p) => (p.id === id ? { ...p, [channel]: value } : p)))
    setDirty(true)
  }

  return (
    <SettingsSection
      title="Notification preferences"
      description="Choose how you hear about activity."
      footer={
        <Button
          variant="primary"
          disabled={!dirty}
          onClick={() => {
            setDirty(false)
            toast.success('Preferences saved')
          }}
        >
          Save preferences
        </Button>
      }
    >
      <div className="mb-2 flex justify-end gap-8 pr-1 text-caption font-medium text-muted" aria-hidden>
        <span className="w-9 text-center">Email</span>
        <span className="w-9 text-center">Push</span>
      </div>
      <div className="divide-y divide-border">
        {prefs.map((pref) => (
          <div key={pref.id} className="flex items-center justify-between gap-6 py-3.5 first:pt-0 last:pb-0">
            <div className="min-w-0">
              <p className="text-body font-medium">{pref.label}</p>
              <p className="mt-0.5 text-caption text-muted">{pref.description}</p>
            </div>
            <div className="flex shrink-0 gap-8">
              <Switch
                aria-label={`${pref.label} by email`}
                checked={pref.email}
                onCheckedChange={(v) => update(pref.id, 'email', v)}
              />
              <Switch
                aria-label={`${pref.label} by push`}
                checked={pref.push}
                onCheckedChange={(v) => update(pref.id, 'push', v)}
              />
            </div>
          </div>
        ))}
      </div>
    </SettingsSection>
  )
}
