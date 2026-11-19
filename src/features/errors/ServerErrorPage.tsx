import { Link } from 'react-router'
import { ServerCrash } from 'lucide-react'
import { Button } from '@/components/ui'
import { ROUTES } from '@/config/routes'
import { ErrorPage } from '@/features/errors/ErrorPage'

export function ServerErrorPage() {
  return (
    <ErrorPage
      code="500"
      icon={ServerCrash}
      title="Something went wrong"
      description="An unexpected error happened on our side. Try again in a moment — your data is safe."
      actions={
        <>
          <Button variant="primary" size="lg" onClick={() => window.location.reload()}>
            Try again
          </Button>
          <Button asChild size="lg">
            <Link to={ROUTES.overview}>Back to overview</Link>
          </Button>
        </>
      }
    />
  )
}
