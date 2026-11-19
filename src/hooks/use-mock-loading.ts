import { useEffect, useState } from 'react'

/** Demo helper: true for `ms` after mount so skeletons are visible. Replace with your data-fetching state. */
export function useMockLoading(ms = 600): boolean {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const id = window.setTimeout(() => setLoading(false), ms)
    return () => window.clearTimeout(id)
  }, [ms])

  return loading
}
