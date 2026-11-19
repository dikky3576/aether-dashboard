import { useEffect } from 'react'
import { siteConfig } from '@/config/site'

/** Sets the browser tab title for pages that live outside the app shell. */
export function useDocumentTitle(title: string): void {
  useEffect(() => {
    document.title = `${title} · ${siteConfig.name}`
  }, [title])
}
