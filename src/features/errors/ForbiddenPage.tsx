import { Link } from 'react-router'
import { ShieldAlert } from 'lucide-react'
import { Button } from '@/components/ui'
import { ROUTES } from '@/config/routes'
import { ErrorPage } from '@/features/errors/ErrorPage'

export function ForbiddenPage() {
  return (
    <ErrorPage
      code="403"
      icon={ShieldAlert}
      title="You don’t have access"
      description="Your role doesn’t include permission to view this page. Ask a workspace admin if you need access."
      actions={
        <>
          <Button asChild variant="primary" size="lg">
            <Link to={ROUTES.overview}>Back to overview</Link>
          </Button>
          <Button asChild size="lg">
            <Link to={ROUTES.team}>View team roles</Link>
          </Button>
        </>
      }
    />
  )
}
