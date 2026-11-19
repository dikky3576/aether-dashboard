import { Monitor, Moon, Sun, type LucideIcon } from 'lucide-react'
import { Radio, RadioGroup } from '@/components/ui'
import { SettingsSection } from '@/features/settings/SettingsSection'
import { useTheme } from '@/hooks/use-theme'
import { cn } from '@/lib/cn'
import type { ThemePreference } from '@/lib/theme'

const OPTIONS: { value: ThemePreference; label: string; description: string; icon: LucideIcon }[] = [
  { value: 'light', label: 'Light', description: 'Bright surfaces, best in daylight.', icon: Sun },
  { value: 'dark', label: 'Dark', description: 'Low-glare surfaces for dim rooms.', icon: Moon },
  { value: 'system', label: 'System', description: 'Follow your device setting.', icon: Monitor },
]

export function AppearanceSettingsPage() {
  const { theme, setTheme } = useTheme()

  return (
    <SettingsSection title="Theme" description="Your choice is saved on this device.">
      <RadioGroup
        aria-label="Theme"
        value={theme}
        onValueChange={(value) => setTheme(value as ThemePreference)}
        className="sm:grid-cols-3"
      >
        {OPTIONS.map((option) => {
          const id = `theme-${option.value}`
          return (
            <label
              key={option.value}
              htmlFor={id}
              className={cn(
                'flex cursor-pointer flex-col gap-3 rounded-card border bg-surface p-4 transition-colors duration-150',
                theme === option.value ? 'border-accent bg-accent-soft' : 'border-border hover:border-border-strong',
              )}
            >
              <span className="flex items-center justify-between">
                <option.icon className="size-5 text-accent-text" strokeWidth={1.75} aria-hidden />
                <Radio id={id} value={option.value} />
              </span>
              <span>
                <span className="block font-medium">{option.label}</span>
                <span className="mt-0.5 block text-caption text-muted">{option.description}</span>
              </span>
            </label>
          )
        })}
      </RadioGroup>
    </SettingsSection>
  )
}
