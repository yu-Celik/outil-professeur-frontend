/**
 * Token Storage Abstraction Layer
 * Manages session metadata storage in localStorage with SSR safety
 * Epic 7: Refresh Token System
 */

import type { SessionTokenMetadata } from '@/types/auth'

const SESSION_METADATA_KEY = 'session_metadata'
const REFRESH_TOKEN_KEY = 'refresh_token'
const CSRF_TOKEN_KEY = 'csrf_token'

/**
 * Check if we're in a browser environment (not SSR)
 */
function isBrowser(): boolean {
  return typeof window !== 'undefined' && typeof localStorage !== 'undefined'
}

/**
 * Generate a cryptographically secure random CSRF token
 * Used for additional CSRF protection alongside SameSite cookies
 */
function generateCsrfToken(): string {
  if (!isBrowser()) return ''

  const array = new Uint8Array(32)
  window.crypto.getRandomValues(array)
  return Array.from(array, (byte) => byte.toString(16).padStart(2, '0')).join('')
}

/**
 * Store session metadata in localStorage
 * @param metadata Session token metadata from backend
 */
export function storeSessionMetadata(metadata: SessionTokenMetadata): void {
  if (!isBrowser()) return

  try {
    localStorage.setItem(SESSION_METADATA_KEY, JSON.stringify(metadata))
  } catch (error) {
    console.error('Failed to store session metadata:', error)
  }
}

/**
 * Retrieve session metadata from localStorage
 * @returns Session metadata or null if not found/invalid
 */
export function getSessionMetadata(): SessionTokenMetadata | null {
  if (!isBrowser()) return null

  try {
    const stored = localStorage.getItem(SESSION_METADATA_KEY)
    if (!stored) return null

    const metadata = JSON.parse(stored) as SessionTokenMetadata

    // Validate required fields (backend Epic 7 schema)
    if (!metadata.access_token_expires_at || !metadata.refresh_token_issued_at || !metadata.refresh_token_expires_at) {
      console.warn('Invalid session metadata format')
      clearSessionMetadata()
      return null
    }

    return metadata
  } catch (error) {
    console.error('Failed to retrieve session metadata:', error)
    clearSessionMetadata()
    return null
  }
}

/**
 * Clear session metadata from localStorage
 */
export function clearSessionMetadata(): void {
  if (!isBrowser()) return

  try {
    localStorage.removeItem(SESSION_METADATA_KEY)
  } catch (error) {
    console.error('Failed to clear session metadata:', error)
  }
}

/**
 * Check if access token is expired or will expire soon
 * @param thresholdMs Time in milliseconds before expiration to consider token as "expiring soon"
 * @returns true if token is expired or will expire within threshold
 */
export function isTokenExpiringSoon(thresholdMs: number = 120000): boolean {
  const metadata = getSessionMetadata()
  if (!metadata) return true

  const expiresAt = new Date(metadata.access_token_expires_at).getTime()
  const now = Date.now()

  return expiresAt - now <= thresholdMs
}

/**
 * Get time remaining until token expiration in milliseconds
 * @returns Time in ms until expiration, or 0 if expired/invalid
 */
export function getTimeUntilExpiration(): number {
  const metadata = getSessionMetadata()
  if (!metadata) return 0

  const expiresAt = new Date(metadata.access_token_expires_at).getTime()
  const now = Date.now()
  const remaining = expiresAt - now

  return Math.max(0, remaining)
}

/**
 * Check if token is currently expired
 * @returns true if token is expired or invalid
 */
export function isTokenExpired(): boolean {
  const metadata = getSessionMetadata()
  if (!metadata) return true

  const expiresAt = new Date(metadata.access_token_expires_at).getTime()
  const now = Date.now()

  return now >= expiresAt
}

// ============================================================================
// Refresh Token Storage (localStorage - required for request body)
// ============================================================================

/**
 * Store refresh token in localStorage
 * Required because backend expects refresh_token in request body for logout/refresh
 * @param token Refresh token value
 */
export function storeRefreshToken(token: string): void {
  if (!isBrowser()) return

  try {
    localStorage.setItem(REFRESH_TOKEN_KEY, token)
  } catch (error) {
    console.error('Failed to store refresh token:', error)
  }
}

/**
 * Retrieve refresh token from localStorage
 * @returns Refresh token or null if not found
 */
export function getRefreshToken(): string | null {
  if (!isBrowser()) return null

  try {
    return localStorage.getItem(REFRESH_TOKEN_KEY)
  } catch (error) {
    console.error('Failed to retrieve refresh token:', error)
    return null
  }
}

/**
 * Clear refresh token from localStorage
 */
export function clearRefreshToken(): void {
  if (!isBrowser()) return

  try {
    localStorage.removeItem(REFRESH_TOKEN_KEY)
  } catch (error) {
    console.error('Failed to clear refresh token:', error)
  }
}

// ============================================================================
// CSRF Token Storage (localStorage - defense in depth)
// ============================================================================

/**
 * Get or generate CSRF token
 * This provides defense-in-depth alongside SameSite cookies
 * @returns CSRF token string
 */
export function getCsrfToken(): string {
  if (!isBrowser()) return ''

  try {
    let token = localStorage.getItem(CSRF_TOKEN_KEY)
    if (!token) {
      token = generateCsrfToken()
      localStorage.setItem(CSRF_TOKEN_KEY, token)
    }
    return token
  } catch (error) {
    console.error('Failed to get CSRF token:', error)
    return ''
  }
}

/**
 * Clear CSRF token from localStorage
 */
export function clearCsrfToken(): void {
  if (!isBrowser()) return

  try {
    localStorage.removeItem(CSRF_TOKEN_KEY)
  } catch (error) {
    console.error('Failed to clear CSRF token:', error)
  }
}
