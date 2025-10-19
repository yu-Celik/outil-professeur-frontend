# Refresh Token System - Usage Examples

## Quick Start

Le système de refresh token est **automatiquement activé** dès qu'un utilisateur se connecte. Aucune configuration manuelle n'est nécessaire dans la plupart des cas.

## Basic Usage

### 1. Login (Auto-Refresh Enabled)

```tsx
import { useAuth } from '@/features/auth'

function LoginPage() {
  const { login, loading, error } = useAuth()

  const handleLogin = async (email: string, password: string) => {
    try {
      await login(email, password)
      // ✅ Token refresh automatically started
      // ✅ User redirected to /dashboard
    } catch (err) {
      console.error('Login failed:', err)
    }
  }

  return (
    <form onSubmit={(e) => {
      e.preventDefault()
      handleLogin(email, password)
    }}>
      {/* Form fields */}
    </form>
  )
}
```

**What happens automatically:**
1. Login request sent to backend
2. Backend returns `session` metadata (expires_at, issued_at)
3. `TokenManager` starts monitoring expiration
4. Auto-refresh scheduled for 2 minutes before expiration
5. BroadcastChannel notifies other tabs of login

### 2. Accessing Session Metadata

```tsx
import { useAuth } from '@/features/auth'

function SessionInfo() {
  const { sessionMetadata, isRefreshing } = useAuth()

  if (!sessionMetadata) {
    return <div>Not authenticated</div>
  }

  const expiresAt = new Date(sessionMetadata.expires_at)
  const issuedAt = new Date(sessionMetadata.issued_at)

  return (
    <div>
      <h3>Session Info</h3>
      <p>Issued: {issuedAt.toLocaleString()}</p>
      <p>Expires: {expiresAt.toLocaleString()}</p>
      {isRefreshing && <p>Refreshing session...</p>}
    </div>
  )
}
```

### 3. Manual Token Refresh (Optional)

```tsx
import { tokenManager } from '@/lib/auth'

async function forceRefresh() {
  try {
    const newMetadata = await tokenManager.forceRefresh()
    console.log('Token refreshed successfully:', newMetadata)
  } catch (error) {
    console.error('Refresh failed:', error)
    // User will be logged out automatically
  }
}

// Trigger manual refresh
<button onClick={forceRefresh}>Refresh Session</button>
```

### 4. Logout (Auto-Cleanup)

```tsx
import { useLogout } from '@/features/auth'

function LogoutButton() {
  const { handleLogout } = useLogout()

  return (
    <button onClick={handleLogout}>
      Logout
    </button>
  )
}
```

**What happens automatically:**
1. Logout request sent to backend (revokes refresh token)
2. `TokenManager` stops monitoring
3. Session metadata cleared from localStorage
4. User state cleared in React
5. BroadcastChannel notifies other tabs to logout
6. Redirect to /login

## Advanced Usage

### 1. Check Token Expiration Status

```tsx
import { isTokenExpiringSoon, getTimeUntilExpiration } from '@/lib/auth'

function TokenStatus() {
  const msRemaining = getTimeUntilExpiration()
  const willExpireSoon = isTokenExpiringSoon()

  if (willExpireSoon) {
    return <div>⚠️ Session expires in {Math.floor(msRemaining / 1000)}s</div>
  }

  const minutesRemaining = Math.floor(msRemaining / 60000)
  return <div>✅ Session valid for {minutesRemaining} minutes</div>
}
```

### 2. Custom Refresh Callback

```tsx
import { useTokenRefresh } from '@/features/auth'
import { useState } from 'react'

function MyComponent() {
  const [lastRefresh, setLastRefresh] = useState<Date | null>(null)

  useTokenRefresh({
    enabled: true,
    onRefreshSuccess: (metadata) => {
      setLastRefresh(new Date())
      console.log('Token refreshed!', metadata)
    },
    onRefreshError: (error) => {
      console.error('Refresh failed:', error)
    },
    onLogoutRequired: () => {
      alert('Session expired. Please login again.')
    }
  })

  return (
    <div>
      {lastRefresh && <p>Last refresh: {lastRefresh.toLocaleString()}</p>}
    </div>
  )
}
```

### 3. Multi-Tab Sync Custom Handlers

```tsx
import { useEffect } from 'react'
import { authBroadcast } from '@/lib/auth'

function MyComponent() {
  useEffect(() => {
    authBroadcast.initialize({
      onLogout: () => {
        console.log('Another tab logged out')
        // Custom cleanup
      },
      onTokenRefreshed: (metadata) => {
        console.log('Another tab refreshed token', metadata)
        // Custom sync logic
      },
      onLogin: (metadata) => {
        console.log('Another tab logged in', metadata)
        // Custom sync logic
      }
    })

    return () => {
      authBroadcast.close()
    }
  }, [])

  return <div>Multi-tab sync enabled</div>
}
```

**⚠️ Note**: L'`AuthContext` gère déjà le BroadcastChannel automatiquement. Utilisez cette approche uniquement si vous avez besoin de logique personnalisée.

### 4. Debugging Token Refresh

```tsx
import { tokenManager } from '@/lib/auth'

// Check TokenManager state
function DebugPanel() {
  const state = tokenManager.getState()

  return (
    <div>
      <h3>TokenManager State</h3>
      <p>Is Refreshing: {state.isRefreshing ? 'Yes' : 'No'}</p>
      <p>Has Timer: {state.hasTimer ? 'Yes' : 'No'}</p>
    </div>
  )
}
```

### 5. Custom API Calls with Auto-Refresh

```tsx
import { api } from '@/lib/api'

async function fetchProtectedData() {
  try {
    // ✅ Axios interceptors handle auto-refresh automatically
    const response = await api.students.list()
    return response.data
  } catch (error) {
    // If refresh fails, user is logged out automatically
    console.error('API call failed:', error)
    throw error
  }
}
```

**How it works:**
1. **Request Interceptor** checks if token expires soon → triggers refresh if needed
2. Request sent with refreshed token
3. If **401 response** → refresh triggered → request retried
4. If refresh fails → user logged out automatically

## React Hook Patterns

### 1. Display Session Countdown

```tsx
import { useEffect, useState } from 'react'
import { getTimeUntilExpiration } from '@/lib/auth'

function SessionCountdown() {
  const [timeLeft, setTimeLeft] = useState(getTimeUntilExpiration())

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(getTimeUntilExpiration())
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  const minutes = Math.floor(timeLeft / 60000)
  const seconds = Math.floor((timeLeft % 60000) / 1000)

  return (
    <div>
      Session expires in: {minutes}:{seconds.toString().padStart(2, '0')}
    </div>
  )
}
```

### 2. Session Expiration Warning

```tsx
import { useEffect, useState } from 'react'
import { isTokenExpiringSoon, getTimeUntilExpiration } from '@/lib/auth'

function SessionWarning() {
  const [showWarning, setShowWarning] = useState(false)

  useEffect(() => {
    const checkExpiration = () => {
      const expiringSoon = isTokenExpiringSoon(300000) // 5 minutes
      setShowWarning(expiringSoon)
    }

    const interval = setInterval(checkExpiration, 10000) // Check every 10s
    checkExpiration()

    return () => clearInterval(interval)
  }, [])

  if (!showWarning) return null

  return (
    <div className="warning-banner">
      ⚠️ Your session will expire soon. Activity will extend it automatically.
    </div>
  )
}
```

### 3. Protected Route with Session Check

```tsx
import { useEffect } from 'react'
import { useAuth } from '@/features/auth'
import { useRouter } from 'next/navigation'
import { isTokenExpired } from '@/lib/auth'

function ProtectedPage() {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && (!user || isTokenExpired())) {
      router.push('/login')
    }
  }, [user, loading, router])

  if (loading) {
    return <div>Loading...</div>
  }

  if (!user) {
    return null // Redirecting...
  }

  return <div>Protected Content</div>
}
```

## Error Handling

### 1. Catch Refresh Errors

```tsx
import { useAuth } from '@/features/auth'
import { useEffect } from 'react'

function MyComponent() {
  const { error, user } = useAuth()

  useEffect(() => {
    if (error) {
      // Handle auth errors
      if (error.includes('TOKEN_REFRESH_FAILED')) {
        console.error('Session could not be refreshed')
        // Show notification to user
      }
    }
  }, [error])

  return <div>{/* Component content */}</div>
}
```

### 2. Handle Network Errors

```tsx
import { api, ApiError } from '@/lib/api'

async function makeApiCall() {
  try {
    return await api.students.list()
  } catch (error) {
    if (error instanceof ApiError) {
      if (error.code === 'NETWORK_ERROR') {
        console.error('Backend is unreachable')
        // Show offline notification
      } else if (error.status === 401) {
        console.error('Authentication failed')
        // User will be logged out automatically
      }
    }
    throw error
  }
}
```

## Testing Scenarios

### 1. Test Auto-Refresh in Development

```tsx
import { tokenManager, storeSessionMetadata } from '@/lib/auth'

// Manually set a short expiration time for testing
function TestAutoRefresh() {
  const testShortExpiration = () => {
    const metadata = {
      expires_at: new Date(Date.now() + 3 * 60 * 1000).toISOString(), // 3 minutes
      issued_at: new Date().toISOString(),
      expires_in: 180
    }

    storeSessionMetadata(metadata)
    tokenManager.start(metadata)

    console.log('Auto-refresh will trigger in ~1 minute (3min - 2min threshold)')
  }

  return <button onClick={testShortExpiration}>Test Auto-Refresh</button>
}
```

### 2. Test Multi-Tab Sync

```tsx
// Open this component in multiple tabs
function MultiTabTest() {
  const { user, sessionMetadata } = useAuth()
  const { handleLogout } = useLogout()

  return (
    <div>
      <h3>Multi-Tab Sync Test</h3>
      <p>User: {user?.email}</p>
      <p>Expires: {sessionMetadata?.expires_at}</p>
      <button onClick={handleLogout}>
        Logout (will sync to other tabs)
      </button>
    </div>
  )
}
```

### 3. Simulate Token Expiration

```tsx
import { clearSessionMetadata, storeSessionMetadata } from '@/lib/auth'

function SimulateExpiration() {
  const expireToken = () => {
    // Set expiration to past
    const expiredMetadata = {
      expires_at: new Date(Date.now() - 1000).toISOString(),
      issued_at: new Date(Date.now() - 2000).toISOString()
    }
    storeSessionMetadata(expiredMetadata)

    // Next API call will trigger refresh
    console.log('Token marked as expired. Next API call will trigger refresh.')
  }

  return <button onClick={expireToken}>Simulate Expiration</button>
}
```

## Console Commands

Useful commands for debugging in browser console:

```javascript
// Import utilities
import { tokenManager, getSessionMetadata, isTokenExpiringSoon } from '@/lib/auth'

// Check current session metadata
const metadata = getSessionMetadata()
console.log(metadata)

// Check if token is expiring soon
const expiringSoon = isTokenExpiringSoon()
console.log('Expiring soon:', expiringSoon)

// Force manual refresh
await tokenManager.forceRefresh()

// Check TokenManager state
const state = tokenManager.getState()
console.log('TokenManager state:', state)

// Stop auto-refresh (for testing)
tokenManager.stop()

// Restart auto-refresh with current metadata
const currentMetadata = getSessionMetadata()
if (currentMetadata) {
  tokenManager.start(currentMetadata)
}
```

## Common Patterns

### 1. Conditional Rendering Based on Session

```tsx
import { useAuth } from '@/features/auth'
import { isTokenExpiringSoon } from '@/lib/auth'

function ConditionalComponent() {
  const { user, sessionMetadata } = useAuth()

  if (!user || !sessionMetadata) {
    return <LoginPrompt />
  }

  if (isTokenExpiringSoon(60000)) { // 1 minute
    return <SessionExpiringWarning />
  }

  return <ProtectedContent />
}
```

### 2. Loading States with Refresh

```tsx
import { useAuth } from '@/features/auth'

function DataFetcher() {
  const { isRefreshing } = useAuth()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      try {
        const result = await api.students.list()
        setData(result.data)
      } finally {
        setLoading(false)
      }
    }

    if (!isRefreshing) {
      fetchData()
    }
  }, [isRefreshing])

  if (loading || isRefreshing) {
    return <Spinner />
  }

  return <DataDisplay data={data} />
}
```

### 3. User Activity Extension

```tsx
import { useEffect } from 'react'
import { tokenManager } from '@/lib/auth'

function ActivityMonitor() {
  useEffect(() => {
    const handleActivity = () => {
      // Optional: Force refresh on user activity
      // (Not necessary with auto-refresh, but can extend session actively)
      const state = tokenManager.getState()
      if (!state.isRefreshing) {
        // Check if we're close to expiration
        // and trigger refresh if needed
      }
    }

    // Listen to user activity
    window.addEventListener('click', handleActivity)
    window.addEventListener('keypress', handleActivity)

    return () => {
      window.removeEventListener('click', handleActivity)
      window.removeEventListener('keypress', handleActivity)
    }
  }, [])

  return null // Invisible component
}
```

## Summary

Le système de refresh token est **entièrement automatisé** et nécessite très peu d'intervention manuelle :

✅ **Automatique** : Refresh 2 min avant expiration
✅ **Transparent** : Aucune interruption pour l'utilisateur
✅ **Multi-tabs** : Synchronisation automatique entre onglets
✅ **Sécurisé** : Gestion erreurs robuste avec logout automatique
✅ **Extensible** : API claire pour personnalisations si nécessaire

**Pour la plupart des cas d'usage, il suffit d'utiliser `useAuth()` !** 🎉
