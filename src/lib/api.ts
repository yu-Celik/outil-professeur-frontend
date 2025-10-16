/**
 * API Client for Rust Backend (Souz)
 * Base URL: http://localhost:8080
 * Authentication: JWT stored in HttpOnly cookie (auth_token)
 * Refresh Token: Automatic rotation with Epic 7 system
 */

import axios, { type AxiosError, type AxiosInstance, type InternalAxiosRequestConfig } from 'axios'
import type { LoginResponse, RegisterResponse, RefreshResponse, LogoutResponse } from '@/types/auth'
import { tokenManager } from '@/lib/auth/token-manager'
import { isTokenExpiringSoon, getRefreshToken, getCsrfToken } from '@/lib/auth/token-storage'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'

export class ApiError extends Error {
  constructor(
    message: string,
    public status?: number,
    public code?: string
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

/**
 * Get user-friendly HTTP error messages (SaaS-style)
 */
function getHttpErrorMessage(status: number): string {
  switch (status) {
    case 400:
      return 'Requête invalide. Veuillez vérifier les informations saisies.'
    case 401:
      return 'Session expirée. Veuillez vous reconnecter.'
    case 403:
      return 'Accès refusé. Vous n\'avez pas les permissions nécessaires.'
    case 404:
      return 'Ressource introuvable.'
    case 409:
      return 'Conflit détecté. Cette opération ne peut pas être effectuée.'
    case 422:
      return 'Données invalides. Veuillez vérifier votre saisie.'
    case 429:
      return 'Trop de requêtes. Veuillez patienter quelques instants.'
    case 500:
      return 'Erreur serveur. Nos équipes ont été notifiées.'
    case 502:
    case 503:
    case 504:
      return 'Le service est temporairement indisponible. Veuillez réessayer dans quelques instants.'
    default:
      return `Erreur ${status}. Veuillez réessayer ou contacter le support.`
  }
}

// Create axios instance
const axiosInstance: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // 30 seconds
  withCredentials: true, // CRITICAL: Send auth_token cookie
  headers: {
    'Content-Type': 'application/json',
  },
})

// ============================================================================
// Request Interceptor - CSRF token + Auto-refresh before expiration
// ============================================================================
axiosInstance.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    // Add CSRF token header for defense-in-depth (alongside SameSite cookies)
    const csrfToken = getCsrfToken()
    if (csrfToken && config.headers) {
      config.headers['X-CSRF-Token'] = csrfToken
    }

    // Skip token check for auth endpoints
    const isAuthEndpoint = config.url?.startsWith('/auth/')
    if (isAuthEndpoint) {
      return config
    }

    // Check if token is expiring soon (within 2 minutes)
    if (isTokenExpiringSoon()) {
      try {
        // Trigger refresh (will queue other requests)
        await tokenManager.checkAndRefresh()
      } catch (error) {
        console.error('Pre-request token refresh failed:', error)
        // Continue with request, let response interceptor handle 401
      }
    }

    return config
  },
  (error) => Promise.reject(error)
)

// ============================================================================
// Response Interceptor - Handle 401 and errors
// ============================================================================
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean }

    // Handle 401 Unauthorized - token expired
    if (error.response?.status === 401 && !originalRequest._retry) {
      // Skip retry for auth endpoints (avoid infinite loop)
      const isAuthEndpoint = originalRequest.url?.startsWith('/auth/')
      if (isAuthEndpoint) {
        const data = error.response.data as any
        const errorMessage = data?.message || data?.error || getHttpErrorMessage(error.response.status)
        throw new ApiError(errorMessage, error.response.status, data?.code)
      }

      // Mark request as retried
      originalRequest._retry = true

      try {
        // Attempt token refresh
        await tokenManager.forceRefresh()

        // Retry original request with new token
        return axiosInstance(originalRequest)
      } catch (refreshError) {
        // Refresh failed - logout required
        console.error('Token refresh failed on 401:', refreshError)
        throw new ApiError(
          'Session expirée. Veuillez vous reconnecter.',
          401,
          'TOKEN_REFRESH_FAILED'
        )
      }
    }

    // Handle other errors
    if (error.response) {
      // Server responded with error status
      const data = error.response.data as any
      const errorMessage = data?.message || data?.error || getHttpErrorMessage(error.response.status)
      throw new ApiError(errorMessage, error.response.status, data?.code)
    } else if (error.request) {
      // Network error - no response received
      throw new ApiError(
        'Le service est temporairement indisponible. Veuillez vérifier que le serveur backend est démarré.',
        undefined,
        'NETWORK_ERROR'
      )
    } else {
      // Something else happened
      throw new ApiError(
        error.message || 'Une erreur inattendue s\'est produite',
        undefined,
        'UNKNOWN_ERROR'
      )
    }
  }
)

// Typed API helpers
export const api = {
  auth: {
    /**
     * Login with email and password
     * Returns user data and session metadata for token refresh
     */
    login: async (email: string, password: string) => {
      const response = await axiosInstance.post<LoginResponse>('/auth/login', {
        email,
        password,
      })
      return response.data
    },

    /**
     * Register new user
     * Returns user data and session metadata for token refresh
     */
    register: async (email: string, password: string, displayName: string) => {
      const response = await axiosInstance.post<RegisterResponse>('/auth/register', {
        email,
        password,
        display_name: displayName,
      })
      return response.data
    },

    /**
     * Get current authenticated user
     */
    me: async () => {
      const response = await axiosInstance.get<{ id: string; email: string; display_name: string }>('/auth/me')
      return response.data
    },

    /**
     * Refresh access token using refresh token from localStorage
     * Returns new session metadata with updated expiration
     * Epic 7: Token rotation system
     */
    refresh: async () => {
      const refreshToken = getRefreshToken()
      if (!refreshToken) {
        throw new ApiError('No refresh token available', 401, 'NO_REFRESH_TOKEN')
      }

      const response = await axiosInstance.post<RefreshResponse>('/auth/refresh', {
        refresh_token: refreshToken,
      })
      return response.data
    },

    /**
     * Logout user and revoke refresh token
     * Sends refresh token in request body for revocation
     */
    logout: async () => {
      const refreshToken = getRefreshToken()
      if (!refreshToken) {
        // If no refresh token, just return success (already logged out locally)
        return { message: 'Already logged out' }
      }

      const response = await axiosInstance.post<LogoutResponse>('/auth/logout', {
        refresh_token: refreshToken,
      })
      return response.data
    },
  },

  // Students endpoints
  students: {
    list: async (params?: { cursor?: string; limit?: number; q?: string }) => {
      const response = await axiosInstance.get<{ data: any[]; next_cursor: string | null }>('/students', {
        params,
      })
      return response.data
    },

    getById: async (id: string) => {
      const response = await axiosInstance.get<any>(`/students/${id}`)
      return response.data
    },

    create: async (data: any) => {
      const response = await axiosInstance.post<any>('/students', data)
      return response.data
    },

    update: async (id: string, data: any) => {
      const response = await axiosInstance.patch<any>(`/students/${id}`, data)
      return response.data
    },

    delete: async (id: string) => {
      await axiosInstance.delete(`/students/${id}`)
    },
  },

  // Classes endpoints
  classes: {
    list: async (params?: { cursor?: string; limit?: number; school_year_id?: string }) => {
      const response = await axiosInstance.get<{ data: any[]; next_cursor: string | null }>('/classes', {
        params,
      })
      return response.data
    },

    getById: async (id: string) => {
      const response = await axiosInstance.get<any>(`/classes/${id}`)
      return response.data
    },

    create: async (data: any, idempotencyKey: string) => {
      const response = await axiosInstance.post<any>('/classes', data, {
        headers: {
          'Idempotency-Key': idempotencyKey,
        },
      })
      return response.data
    },

    update: async (id: string, data: any, etag?: string) => {
      const response = await axiosInstance.patch<any>(`/classes/${id}`, data, {
        headers: etag ? { 'If-Match': etag } : {},
      })
      return response.data
    },

    delete: async (id: string) => {
      await axiosInstance.delete(`/classes/${id}`)
    },
  },

  // School Years endpoints
  schoolYears: {
    list: async (params?: { cursor?: string; limit?: number; is_active?: boolean }) => {
      const response = await axiosInstance.get<{ data: any[]; next_cursor: string | null }>('/school-years', {
        params,
      })
      return response.data
    },

    getById: async (id: string) => {
      const response = await axiosInstance.get<any>(`/school-years/${id}`)
      return response.data
    },

    create: async (data: any) => {
      const response = await axiosInstance.post<any>('/school-years', data)
      return response.data
    },

    update: async (id: string, data: any) => {
      const response = await axiosInstance.patch<any>(`/school-years/${id}`, data)
      return response.data
    },

    delete: async (id: string) => {
      await axiosInstance.delete(`/school-years/${id}`)
    },
  },
}

// Export axios instance for direct use if needed
export { axiosInstance }
