import { Outlet } from 'react-router'
import { PageHeader } from '@/components/layout/PageHeader'
import { SubNav } from '@/components/layout/SubNav'
import { ROUTES } from '@/config/routes'

const TABS = [
  { label: 'General', to: ROUTES.settings },
  { label: 'Profile', to: ROUTES.settingsProfile },
  { label: 'Security', to: ROUTES.settingsSecurity },
  { label: 'Appearance', to: ROUTES.settingsAppearance },
  { label: 'Notifications', to: ROUTES.settingsNotifications },
]

export function SettingsLayout() {
  return (
    <>
      <PageHeader title="Settings" description="Manage your workspace, account and preferences." />
      <SubNav className="mt-6" label="Settings sections" items={TABS} />
      <div className="mt-6 max-w-3xl space-y-5">
        <Outlet />
      </div>
    </>
  )
}
