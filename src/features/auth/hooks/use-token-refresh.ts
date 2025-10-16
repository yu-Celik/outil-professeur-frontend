/**
 * useTokenRefresh Hook
 * React integration for automatic token refresh system
 * Epic 7: Refresh Token System
 */

import { useEffect, useRef } from 'react'
import { api } from '@/lib/api'
import { tokenManager } from '@/lib/auth/token-manager'
import type { SessionTokenMetadata } from '@/types/auth'

interface UseTokenRefreshOptions {
  /** Enable automatic token refresh monitoring */
  enabled: boolean
  /** Callback when refresh succeeds with new metadata */
  onRefreshSuccess?: (metadata: SessionTokenMetadata) => void
  /** Callback when refresh fails */
  onRefreshError?: (error: Error) => void
  /** Callback when logout is required due to refresh failure */
  onLogoutRequired?: () => void
}

/**
 * Hook to integrate token refresh system with React components
 * Automatically monitors token expiration and triggers refresh
 *
 * @example
 * ```tsx
 * useTokenRefresh({
 *   enabled: !!user,
 *   onRefreshSuccess: (metadata) => updateSessionMetadata(metadata),
 *   onRefreshError: (error) => console.error('Refresh failed:', error),
 *   onLogoutRequired: () => logout()
 * })
 * ```
 */
export function useTokenRefresh({
  enabled,
  onRefreshSuccess,
  onRefreshError,
  onLogoutRequired,
}: UseTokenRefreshOptions) {
  const isInitialized = useRef(false)

  useEffect(() => {
    // Initialize token manager once
    if (!isInitialized.current && enabled) {
      tokenManager.initialize({
        onRefresh: async () => {
          // Execute refresh API call
          const response = await api.auth.refresh()
          return response.session
        },
        onRefreshSuccess: (metadata) => {
          onRefreshSuccess?.(metadata)
        },
        onRefreshError: (error) => {
          onRefreshError?.(error)
        },
        onLogoutRequired: () => {
          onLogoutRequired?.()
        },
      })
      isInitialized.current = true
    }
  }, [enabled, onRefreshSuccess, onRefreshError, onLogoutRequired])

  useEffect(() => {
    // Cleanup on unmount
    return () => {
      if (!enabled) {
        tokenManager.stop()
      }
    }
  }, [enabled])
}
