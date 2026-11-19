import { useEffect, useRef, useState, type DependencyList } from 'react'

/**
 * Simulates an async request so pages exercise their loading states.
 * Replace the call site with your data-fetching library (TanStack Query, SWR, …).
 * Previous data stays available while a re-fetch is in flight.
 */
export function useMockQuery<T>(factory: () => T, deps: DependencyList, delayMs = 450) {
  const [data, setData] = useState<T>()
  const factoryRef = useRef(factory)
  factoryRef.current = factory

  useEffect(() => {
    const timer = window.setTimeout(() => setData(factoryRef.current()), delayMs)
    return () => window.clearTimeout(timer)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)

  return { data, isLoading: data === undefined }
}
