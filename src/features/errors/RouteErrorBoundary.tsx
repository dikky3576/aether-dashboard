import { Link, isRouteErrorResponse, useRouteError } from 'react-router'
import { Compass, ServerCrash, ShieldAlert } from 'lucide-react'
import { Button } from '@/components/ui'
import { ROUTES } from '@/config/routes'
import { ErrorPage } from '@/features/errors/ErrorPage'

/**
 * Router-level `errorElement`: catches render errors, failed lazy imports and thrown responses
 * so a broken page never leaves a blank screen.
 */
export function RouteErrorBoundary() {
  const error = useRouteError()

  if (isRouteErrorResponse(error)) {
    if (error.status === 404) {
      return (
        <ErrorPage
          code="404"
          icon={Compass}
          title="Page not found"
          description="That address doesn’t exist in this workspace."
        />
      )
    }
    if (error.status === 403) {
      return (
        <ErrorPage
          code="403"
          icon={ShieldAlert}
          title="You don’t have access"
          description="Your role doesn’t include permission to view this page."
        />
      )
    }
  }

  const detail = error instanceof Error ? error.message : undefined

  return (
    <ErrorPage
      code="500"
      icon={ServerCrash}
      title="Something went wrong"
      description="This page couldn’t be displayed. Reload to try again, or head back to the overview."
      detail={import.meta.env.DEV ? detail : undefined}
      actions={
        <>
          <Button variant="primary" size="lg" onClick={() => window.location.reload()}>
            Reload page
          </Button>
          <Button asChild size="lg">
            <Link to={ROUTES.overview}>Back to overview</Link>
          </Button>
        </>
      }
    />
  )
}
