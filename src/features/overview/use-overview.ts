import { useCallback, useEffect, useState } from 'react'
import { fetchOverview } from '@/features/overview/api'
import type { OverviewData, RangeKey } from '@/types/overview'

interface OverviewState {
  data?: OverviewData
  error?: Error
}

export function useOverview(range: RangeKey) {
  const [state, setState] = useState<OverviewState>({})
  const [attempt, setAttempt] = useState(0)

  useEffect(() => {
    const controller = new AbortController()
    fetchOverview(range, controller.signal)
      .then((data) => setState({ data }))
      .catch((error: unknown) => {
        if (controller.signal.aborted) return
        setState((prev) => ({ ...prev, error: error instanceof Error ? error : new Error('Request failed') }))
      })
    return () => controller.abort()
  }, [range, attempt])

  const retry = useCallback(() => {
    setState((prev) => ({ data: prev.data }))
    setAttempt((n) => n + 1)
  }, [])

  return {
    data: state.data,
    error: state.error,
    /** First load: nothing to show yet. */
    isLoading: !state.data && !state.error,
    /** Range changed: previous data stays visible (dimmed) until the new data arrives. */
    isFetching: state.data !== undefined && state.data.range !== range,
    retry,
  }
}
