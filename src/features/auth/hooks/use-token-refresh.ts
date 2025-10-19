/**
 * useTokenRefresh Hook
 * React integration for automatic token refresh system
 * Epic 7: Refresh Token System
 */

import { useEffect, useRef } from "react";
import { api } from "@/lib/api";
import { tokenManager } from "@/lib/auth/token-manager";
import type { SessionTokenMetadata } from "@/types/auth";

interface UseTokenRefreshOptions {
  /** Enable automatic token refresh monitoring */
  enabled: boolean;
  /** Callback when refresh succeeds with new metadata */
  onRefreshSuccess?: (metadata: SessionTokenMetadata) => void;
  /** Callback when refresh fails */
  onRefreshError?: (error: Error) => void;
  /** Callback when logout is required due to refresh failure */
  onLogoutRequired?: () => void;
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
  const callbacksRef = useRef<{
    onRefreshSuccess?: (metadata: SessionTokenMetadata) => void;
    onRefreshError?: (error: Error) => void;
    onLogoutRequired?: () => void;
  }>({});

  // Keep latest callbacks in ref to avoid stale closures
  useEffect(() => {
    callbacksRef.current.onRefreshSuccess = onRefreshSuccess;
    callbacksRef.current.onRefreshError = onRefreshError;
    callbacksRef.current.onLogoutRequired = onLogoutRequired;
  }, [onRefreshSuccess, onRefreshError, onLogoutRequired]);

  useEffect(() => {
    tokenManager.initialize({
      onRefresh: async () => {
        const response = await api.auth.refresh();
        return response.session;
      },
      onRefreshSuccess: (metadata) => {
        callbacksRef.current.onRefreshSuccess?.(metadata);
      },
      onRefreshError: (error) => {
        callbacksRef.current.onRefreshError?.(error);
      },
      onLogoutRequired: () => {
        callbacksRef.current.onLogoutRequired?.();
      },
    });

    return () => {
      tokenManager.stop();
    };
  }, []);

  useEffect(() => {
    if (!enabled) {
      tokenManager.stop();
    }
  }, [enabled]);
}
