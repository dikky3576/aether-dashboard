import { useCallback } from 'react'
import { useSearchParams } from 'react-router'

/**
 * A string value kept in the URL (`?q=acme`) so searches and filters survive reloads
 * and can be shared. Empty or default values are removed from the URL.
 */
export function useQueryState(key: string, fallback = ''): [string, (value: string) => void] {
  const [params, setParams] = useSearchParams()
  const value = params.get(key) ?? fallback

  const setValue = useCallback(
    (next: string) => {
      setParams(
        (prev) => {
          const copy = new URLSearchParams(prev)
          if (next === '' || next === fallback) copy.delete(key)
          else copy.set(key, next)
          return copy
        },
        { replace: true },
      )
    },
    [key, fallback, setParams],
  )

  return [value, setValue]
}
