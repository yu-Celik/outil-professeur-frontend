'use client'

import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'
import { api, ApiError } from '@/lib/api'
import type { SessionTokenMetadata } from '@/types/auth'
import { tokenManager } from '@/lib/auth/token-manager'
import {
  storeSessionMetadata,
  clearSessionMetadata,
  storeRefreshToken,
  clearRefreshToken,
  clearCsrfToken,
} from '@/lib/auth/token-storage'
import { authBroadcast } from '@/lib/auth/broadcast-channel'
import { useTokenRefresh } from '../hooks/use-token-refresh'

interface User {
  id: string
  email: string
  display_name: string
}

interface AuthContextType {
  user: User | null
  loading: boolean
  error: string | null
  sessionMetadata: SessionTokenMetadata | null
  isRefreshing: boolean
  login: (email: string, password: string) => Promise<void>
  register: (email: string, password: string, displayName: string) => Promise<void>
  logout: () => Promise<void>
  refetch: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [sessionMetadata, setSessionMetadata] = useState<SessionTokenMetadata | null>(null)
  const [isRefreshing, setIsRefreshing] = useState(false)

  const fetchUser = async () => {
    try {
      setError(null)
      const userData = await api.auth.me()
      setUser(userData)
    } catch (err) {
      // 401 = not authenticated, not an error
      if (err instanceof ApiError && err.status === 401) {
        setUser(null)
      } else {
        console.error('Failed to fetch user:', err)
        setError(err instanceof Error ? err.message : 'Failed to fetch user')
        setUser(null)
      }
    } finally {
      setLoading(false)
    }
  }

  // Initialize BroadcastChannel for multi-tab sync
  useEffect(() => {
    authBroadcast.initialize({
      onLogout: () => {
        // Another tab logged out - sync state
        setUser(null)
        setSessionMetadata(null)
        clearSessionMetadata()
        clearRefreshToken()
        clearCsrfToken()
        tokenManager.stop()
      },
      onTokenRefreshed: (metadata) => {
        // Another tab refreshed token - update metadata and refresh token
        setSessionMetadata(metadata)
        storeSessionMetadata(metadata)
        storeRefreshToken(metadata.refresh_token)
      },
      onLogin: (metadata) => {
        // Another tab logged in - refetch user and store tokens
        setSessionMetadata(metadata)
        storeSessionMetadata(metadata)
        storeRefreshToken(metadata.refresh_token)
        fetchUser()
      },
    })

    return () => {
      authBroadcast.close()
    }
  }, [])

  // Initialize token refresh system
  useTokenRefresh({
    enabled: !!user,
    onRefreshSuccess: (metadata) => {
      setSessionMetadata(metadata)
      setIsRefreshing(false)
      // Broadcast to other tabs
      authBroadcast.broadcastTokenRefreshed(metadata)
    },
    onRefreshError: (error) => {
      console.error('Token refresh failed:', error)
      setIsRefreshing(false)
    },
    onLogoutRequired: () => {
      // Refresh failed - force logout
      logout()
    },
  })

  useEffect(() => {
    fetchUser()
  }, [])

  const login = async (email: string, password: string) => {
    try {
      setError(null)
      setLoading(true)
      const response = await api.auth.login(email, password)
      setUser(response.user)

      // Store session metadata and refresh token
      setSessionMetadata(response.session)
      storeSessionMetadata(response.session)
      storeRefreshToken(response.session.refresh_token)

      // Start token refresh system
      tokenManager.start(response.session)

      // Broadcast login to other tabs
      authBroadcast.broadcastLogin(response.session)
    } catch (err) {
      const errorMessage =
        err instanceof ApiError
          ? err.message
          : err instanceof Error
            ? err.message
            : 'Login failed'
      setError(errorMessage)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const register = async (email: string, password: string, displayName: string) => {
    try {
      setError(null)
      setLoading(true)
      const response = await api.auth.register(email, password, displayName)
      setUser(response.user)

      // Store session metadata and refresh token
      setSessionMetadata(response.session)
      storeSessionMetadata(response.session)
      storeRefreshToken(response.session.refresh_token)

      // Start token refresh system
      tokenManager.start(response.session)

      // Broadcast login to other tabs
      authBroadcast.broadcastLogin(response.session)
    } catch (err) {
      const errorMessage =
        err instanceof ApiError
          ? err.message
          : err instanceof Error
            ? err.message
            : 'Registration failed'
      setError(errorMessage)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const logout = async () => {
    try {
      await api.auth.logout()
    } catch (error) {
      console.error('Logout API call failed:', error)
      // Continue with local cleanup even if API fails
    }

    // Stop token refresh
    tokenManager.stop()

    // Clear all tokens and session data
    setSessionMetadata(null)
    clearSessionMetadata()
    clearRefreshToken()
    clearCsrfToken()

    // Clear user state
    setUser(null)
    setError(null)

    // Broadcast logout to other tabs
    authBroadcast.broadcastLogout()
  }

  const refetch = async () => {
    setLoading(true)
    await fetchUser()
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        sessionMetadata,
        isRefreshing,
        login,
        register,
        logout,
        refetch,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
