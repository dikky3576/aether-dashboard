import { Compass } from 'lucide-react'
import { ErrorPage } from '@/features/errors/ErrorPage'

export function NotFoundPage() {
  return (
    <ErrorPage
      code="404"
      icon={Compass}
      title="Page not found"
      description="That address doesn’t exist in this workspace. It may have moved, or the link is incorrect."
    />
  )
}
