import { useEffect } from 'react'
import { useUiStore } from '@/stores/ui-store'

/** ⌘K / Ctrl+K toggles the command palette from anywhere in the app. */
export function useCommandShortcut(): void {
  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault()
        const { commandOpen, setCommandOpen } = useUiStore.getState()
        setCommandOpen(!commandOpen)
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [])
}
