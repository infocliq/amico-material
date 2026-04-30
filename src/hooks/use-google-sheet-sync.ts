import { useCallback, useEffect, useRef, useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { syncSheetToFirestore, type SyncResult } from '@/lib/google-sheets-sync'

export type SyncStatus = 'idle' | 'syncing' | 'success' | 'error'

export interface UseGoogleSheetSyncReturn {
  status: SyncStatus
  lastResult: SyncResult | null
  lastError: string | null
  /** Trigger a manual sync immediately */
  syncNow: () => void
}

const SYNC_INTERVAL_MS = 24 * 60 * 1000   // 10 minutes
const SUCCESS_RESET_MS = 8_000             // revert badge back to "idle" after 8 s

/**
 * Runs a Google Sheets → Firestore sync on mount and then every 10 minutes.
 * Exposes status, last result, and a manual trigger.
 */
export function useGoogleSheetSync(): UseGoogleSheetSyncReturn {
  const queryClient = useQueryClient()
  const [status, setStatus] = useState<SyncStatus>('idle')
  const [lastResult, setLastResult] = useState<SyncResult | null>(null)
  const [lastError, setLastError] = useState<string | null>(null)
  const isSyncing = useRef(false)
  const resetTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const runSync = useCallback(async () => {
    if (isSyncing.current) return
    isSyncing.current = true
    setStatus('syncing')
    setLastError(null)

    // Clear any pending "reset to idle" timer
    if (resetTimer.current) {
      clearTimeout(resetTimer.current)
      resetTimer.current = null
    }

    try {
      const result = await syncSheetToFirestore()
      setLastResult(result)
      setStatus('success')

      // Refresh the projects list in the UI only if something changed
      if (result.created > 0 || result.updated > 0) {
        queryClient.invalidateQueries({ queryKey: ['projects'] })
      }

      // Auto-reset to "idle" after a short period so the badge doesn't stay green forever
      resetTimer.current = setTimeout(() => setStatus('idle'), SUCCESS_RESET_MS)
    } catch (err: any) {
      console.error('[Sheet Sync]', err)
      setLastError(err?.message ?? 'Unknown sync error')
      setStatus('error')
    } finally {
      isSyncing.current = false
    }
  }, [queryClient])

  // Run immediately on mount, then repeat every 10 min
  useEffect(() => {
    runSync()

    const interval = setInterval(runSync, SYNC_INTERVAL_MS)

    return () => {
      clearInterval(interval)
      if (resetTimer.current) clearTimeout(resetTimer.current)
    }
  }, [runSync])

  return { status, lastResult, lastError, syncNow: runSync }
}
