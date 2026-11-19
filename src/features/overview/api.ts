import { buildOverview } from '@/data/overview'
import type { OverviewData, RangeKey } from '@/types/overview'

function delay(ms: number, signal?: AbortSignal): Promise<void> {
  return new Promise((resolve, reject) => {
    const timer = window.setTimeout(resolve, ms)
    signal?.addEventListener('abort', () => {
      window.clearTimeout(timer)
      reject(new DOMException('Aborted', 'AbortError'))
    })
  })
}

/**
 * Data boundary for the Overview page. Swap the body for a real request
 * (`fetch('/api/overview?range=' + range, { signal })`) — the UI does not change.
 */
export async function fetchOverview(range: RangeKey, signal?: AbortSignal): Promise<OverviewData> {
  await delay(550, signal)
  return buildOverview(range)
}
