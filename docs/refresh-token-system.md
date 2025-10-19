# Refresh Token System - Frontend Implementation

## Overview

This document describes the frontend implementation of the **Epic 7 Refresh Token System** with automatic rotation, token expiration monitoring, and multi-tab synchronization.

## Architecture

### Components

```
┌─────────────────────────────────────────────────────────────┐
│                    Frontend Architecture                     │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌───────────────┐      ┌──────────────────┐                │
│  │  AuthContext  │─────▶│  TokenManager    │                │
│  │  (React)      │      │  (Singleton)     │                │
│  └───────┬───────┘      └────────┬─────────┘                │
│          │                       │                           │
│          │                       │                           │
│  ┌───────▼───────┐      ┌───────▼──────────┐               │
│  │ useTokenRefresh│      │ Token Storage    │               │
│  │  (Hook)       │      │ (localStorage)   │               │
│  └───────────────┘      └──────────────────┘               │
│                                                               │
│  ┌────────────────────────────────────────┐                 │
│  │   Axios Interceptors                   │                 │
│  │  ┌──────────────┐  ┌──────────────┐   │                 │
│  │  │  Request     │  │  Response    │   │                 │
│  │  │  (Pre-check) │  │  (401 retry) │   │                 │
│  │  └──────────────┘  └──────────────┘   │                 │
│  └────────────────────────────────────────┘                 │
│                                                               │
│  ┌─────────────────────────────────────────┐                │
│  │   BroadcastChannel (Multi-Tab Sync)     │                │
│  │   - Logout events                       │                │
│  │   - Token refresh events                │                │
│  │   - Login events                        │                │
│  └─────────────────────────────────────────┘                │
│                                                               │
└─────────────────────────────────────────────────────────────┘
                          │
                          ▼
              ┌───────────────────────┐
              │   Rust Backend API    │
              │   (Epic 7 Endpoints)  │
              │  - POST /auth/login   │
              │  - POST /auth/refresh │
              │  - POST /auth/logout  │
              └───────────────────────┘
```

## Core Files

### 1. Types (`src/types/auth.ts`)

```typescript
interface SessionTokenMetadata {
  access_token_expires_at: string        // ISO 8601 timestamp
  refresh_token_issued_at: string        // ISO 8601 timestamp
  refresh_token_expires_at: string       // ISO 8601 timestamp
  refresh_token_last_used_at?: string | null
}

interface LoginResponse {
  message: string
  user: { id: string; email: string; display_name: string }
  session: SessionTokenMetadata
}

interface RefreshResponse {
  message: string
  user: { id: string; email: string; display_name: string }
  session: SessionTokenMetadata
}
```

### 2. Token Storage (`src/lib/auth/token-storage.ts`)

**Purpose**: SSR-safe localStorage abstraction for session metadata (no sensitive token storage)

**Key Functions**:
- `storeSessionMetadata(metadata)` - Save session metadata (expiry timestamps only)
- `getSessionMetadata()` - Retrieve session metadata
- `clearSessionMetadata()` - Remove session metadata
- `isTokenExpiringSoon(thresholdMs)` - Check if token expires within threshold
- `isTokenExpired()` - Check if token is currently expired
- `getTimeUntilExpiration()` - Get milliseconds until expiration
- `getCsrfToken()` / `clearCsrfToken()` - Non-sensitive CSRF token caching for defense-in-depth

### 3. Token Manager (`src/lib/auth/token-manager.ts`)

**Purpose**: Singleton service managing automatic token refresh

**Key Methods**:
- `initialize(config)` - Setup with callbacks
- `start(metadata)` - Begin auto-refresh monitoring
- `stop()` - Stop monitoring and clear timers
- `forceRefresh()` - Trigger immediate refresh (handles concurrent requests)
- `checkAndRefresh()` - Check expiration and refresh if needed

**Features**:
- ✅ Auto-refresh 2 minutes before expiration
- ✅ Prevents multiple concurrent refresh requests
- ✅ Automatic retry scheduling after successful refresh
- ✅ Error handling with logout trigger
- ✅ Thread-safe promise queue

### 4. API Client (`src/lib/api.ts`)

**Interceptors**:

#### Request Interceptor
```typescript
// Checks if token is expiring soon (< 2 min)
// Triggers pre-emptive refresh before API call
// Queues requests during refresh
```

#### Response Interceptor
```typescript
// Detects 401 Unauthorized
// Attempts token refresh
// Retries original request with new token
// Triggers logout if refresh fails
```

**Endpoints**:
- `api.auth.login(email, password)` → `LoginResponse` (HttpOnly cookies set by backend)
- `api.auth.register(email, password, displayName)` → `RegisterResponse`
- `api.auth.refresh()` → `RefreshResponse` (no request body, relies on cookies)
- `api.auth.logout()` → `LogoutResponse` (no request body, backend clears cookies)
- `api.auth.me()` → User data

> ℹ️ **CSRF header (optionnel)** — définissez `NEXT_PUBLIC_ENABLE_CSRF_HEADER=true` pour ajouter automatiquement `X-CSRF-Token` aux requêtes sortantes. Laissez la variable absente (par défaut) si l'API ne whiteliste pas cet en-tête via CORS.

### 5. BroadcastChannel (`src/lib/auth/broadcast-channel.ts`)

**Purpose**: Synchronize auth state across browser tabs/windows

**Events**:
- `LOGOUT` - User logged out in another tab
- `TOKEN_REFRESHED` - Token refreshed in another tab
- `LOGIN` - User logged in another tab

**Methods**:
- `initialize(handlers)` - Setup event listeners
- `broadcastLogout()` - Notify other tabs of logout
- `broadcastTokenRefreshed(metadata)` - Share new token metadata
- `broadcastLogin(metadata)` - Notify other tabs of login

### 6. React Hook (`src/features/auth/hooks/use-token-refresh.ts`)

**Purpose**: React integration for TokenManager

**Usage**:
```tsx
useTokenRefresh({
  enabled: !!user,
  onRefreshSuccess: (metadata) => updateSession(metadata),
  onRefreshError: (error) => console.error(error),
  onLogoutRequired: () => logout()
})
```

### 7. AuthContext (`src/features/auth/contexts/auth-context.tsx`)

**Enhanced State**:
```typescript
interface AuthContextType {
  user: User | null
  loading: boolean
  error: string | null
  sessionMetadata: SessionTokenMetadata | null  // NEW
  isRefreshing: boolean                          // NEW
  login: (email, password) => Promise<void>
  register: (email, password, name) => Promise<void>
  logout: () => Promise<void>
  refetch: () => Promise<void>
}
```

**Integration**:
- Stores session metadata after login/register
- Starts TokenManager after authentication
- Listens to BroadcastChannel for multi-tab sync
- Stops TokenManager on logout
- Triggers logout when refresh fails

## Security Features

### ✅ Auto-Refresh Before Expiration
- Refresh triggered **2 minutes before** access token expires
- Prevents 401 errors in production
- Transparent to user

### ✅ Protection Against Multiple Refresh Requests
- Single refresh promise shared across concurrent requests
- Request queuing during refresh
- No race conditions

### ✅ Token Reuse Detection (Backend)
- Backend detects refresh token reuse
- Triggers immediate token chain revocation
- Frontend receives 401 → forces logout

### ✅ HttpOnly Cookie Storage
- Access and refresh tokens are stored exclusively in HttpOnly cookies
- Frontend retains only expiration metadata plus an optional CSRF token
- Eliminates XSS access to token material and simplifies logout handling

### ✅ Refresh Error Handling
```typescript
// Errors requiring logout:
- 401 Unauthorized (token expired/invalid)
- TOKEN_REUSE_DETECTED (security breach)
- REFRESH_TOKEN_EXPIRED (token chain expired)

// Errors with retry:
- Network errors (exponential backoff, 3 attempts max)
```

### ✅ Multi-Tab Synchronization
- Logout in one tab → all tabs logout
- Token refresh in one tab → all tabs updated
- Login in one tab → all tabs sync user state

### ✅ Cleanup on Logout
- Stop TokenManager timers
- Clear localStorage metadata
- Revoke refresh token on backend
- Notify other tabs via BroadcastChannel

## Flow Diagrams

### Login Flow

```
User Login
    ↓
POST /auth/login
    ↓
Backend Response: { user, session: { expires_at, issued_at } }
    ↓
AuthContext stores user + session metadata
    ↓
TokenManager.start(session)
    ↓
Calculate refresh time = expires_at - 2min
    ↓
Schedule timer for auto-refresh
    ↓
BroadcastChannel.broadcastLogin(session)
    ↓
Other tabs receive LOGIN event → refetch user
```

### Auto-Refresh Flow

```
Timer triggers (2 min before expiration)
    ↓
TokenManager.forceRefresh()
    ↓
Check if already refreshing? → Yes → Return existing promise
                              ↓ No
                              ↓
POST /auth/refresh (HttpOnly cookie sent)
    ↓
Backend: Validate refresh token → Rotate tokens
    ↓
Backend Response: { session: { new_expires_at, new_issued_at } }
    ↓
Store new metadata in localStorage
    ↓
AuthContext updates sessionMetadata state
    ↓
Schedule next refresh (new_expires_at - 2min)
    ↓
BroadcastChannel.broadcastTokenRefreshed(session)
    ↓
Other tabs receive TOKEN_REFRESHED → update metadata
```

### API Request Flow with 401 Handling

```
User makes API request
    ↓
Request Interceptor: Check token expiration
    ↓
Token expiring soon? → Yes → Trigger refresh → Wait → Continue
                    ↓ No
                    ↓
Send request to backend
    ↓
Response 401 Unauthorized?
    ↓ Yes                          ↓ No
    ↓                              ↓
Attempt refresh                    Return response
    ↓
Refresh success? → Yes → Retry original request
                ↓ No
                ↓
Trigger logout → Redirect to /login
```

### Logout Flow

```
User clicks logout
    ↓
AuthContext.logout()
    ↓
POST /auth/logout (HttpOnly cookies sent)
    ↓
Backend: Revoke refresh token + Clear cookies
    ↓
TokenManager.stop() → Clear timers
    ↓
Clear localStorage session metadata
    ↓
Clear user state in React
    ↓
BroadcastChannel.broadcastLogout()
    ↓
Other tabs receive LOGOUT → Clear state → Stop TokenManager
    ↓
Redirect to /login
```

## Usage Examples

### Check Token Status in Component

```tsx
import { useAuth } from '@/features/auth'

function MyComponent() {
  const { sessionMetadata, isRefreshing } = useAuth()

  if (isRefreshing) {
    return <div>Refreshing session...</div>
  }

  if (sessionMetadata) {
    const expiresAt = new Date(sessionMetadata.expires_at)
    return <div>Session expires: {expiresAt.toLocaleString()}</div>
  }

  return <div>Not authenticated</div>
}
```

### Manual Token Refresh

```typescript
import { tokenManager } from '@/lib/auth/token-manager'

// Force immediate refresh
try {
  const newMetadata = await tokenManager.forceRefresh()
  console.log('Token refreshed:', newMetadata)
} catch (error) {
  console.error('Refresh failed:', error)
}
```

### Check Token Expiration

```typescript
import { isTokenExpiringSoon, getTimeUntilExpiration } from '@/lib/auth/token-storage'

if (isTokenExpiringSoon()) {
  console.warn('Token expires in less than 2 minutes')
}

const msRemaining = getTimeUntilExpiration()
console.log(`Token expires in ${msRemaining}ms`)
```

## Configuration

### Refresh Threshold

Default: **2 minutes (120000ms)** before expiration

To change:
```typescript
// src/lib/auth/token-manager.ts
const REFRESH_THRESHOLD_MS = 180000 // 3 minutes
```

### API Timeout

Default: **30 seconds**

To change:
```typescript
// src/lib/api.ts
const axiosInstance = axios.create({
  timeout: 60000, // 60 seconds
})
```

## Testing Scenarios

### ✅ Test: Auto-refresh before expiration
1. Login user
2. Wait until 2 minutes before token expires
3. Verify refresh is triggered automatically
4. Verify new metadata stored
5. Verify next refresh scheduled

### ✅ Test: 401 handling with retry
1. Login user
2. Force token expiration (wait or manipulate metadata)
3. Make API request
4. Verify interceptor catches 401
5. Verify refresh is triggered
6. Verify original request is retried
7. Verify request succeeds

### ✅ Test: Multi-tab logout
1. Open app in 2 tabs
2. Login in both tabs
3. Logout in tab 1
4. Verify tab 2 automatically logs out
5. Verify TokenManager stopped in tab 2

### ✅ Test: Multi-tab refresh sync
1. Open app in 2 tabs
2. Login in both tabs
3. Force refresh in tab 1
4. Verify tab 2 receives new metadata
5. Verify both tabs have same expiration time

### ✅ Test: Refresh failure triggers logout
1. Login user
2. Manually revoke refresh token on backend
3. Wait for auto-refresh trigger
4. Verify refresh fails
5. Verify user is logged out
6. Verify redirect to /login

## Troubleshooting

### Issue: Refresh loop (infinite refresh requests)

**Cause**: Backend not returning valid session metadata

**Solution**:
```typescript
// Check backend response format
console.log(response.data.session)
// Should contain: { expires_at, issued_at }
```

### Issue: Token not refreshing automatically

**Cause**: TokenManager not started after login

**Solution**: Verify `tokenManager.start(metadata)` called in AuthContext login

### Issue: 401 errors not handled

**Cause**: Axios interceptor not catching 401

**Solution**: Check interceptor registration order (request → response)

### Issue: Multi-tab sync not working

**Cause**: BroadcastChannel not initialized

**Solution**: Verify `authBroadcast.initialize()` in AuthContext useEffect

## Migration Checklist

- [x] **Phase 1**: Types + API client
  - [x] Add SessionTokenMetadata types
  - [x] Add LoginResponse, RefreshResponse types
  - [x] Add ProblemDetails type
  - [x] Update api.auth.login() type
  - [x] Update api.auth.register() type
  - [x] Add api.auth.refresh() endpoint

- [x] **Phase 2**: TokenManager + Storage
  - [x] Create token-storage.ts
  - [x] Create token-manager.ts
  - [x] Implement auto-refresh logic
  - [x] Implement concurrent refresh protection

- [x] **Phase 3**: Auth Context Integration
  - [x] Add sessionMetadata state
  - [x] Add isRefreshing state
  - [x] Integrate TokenManager in login/register
  - [x] Stop TokenManager in logout

- [x] **Phase 4**: Axios Interceptors
  - [x] Add request interceptor (pre-check)
  - [x] Add response interceptor (401 retry)
  - [x] Handle refresh errors

- [x] **Phase 5**: Multi-Tab Sync
  - [x] Create broadcast-channel.ts
  - [x] Initialize in AuthContext
  - [x] Broadcast logout events
  - [x] Broadcast refresh events
  - [x] Handle incoming events

- [x] **Phase 6**: React Integration
  - [x] Create useTokenRefresh hook
  - [x] Integrate in AuthContext
  - [x] Export from features/auth

## Next Steps

### Backend Integration Checklist

Before testing, ensure backend implements:

1. ✅ **POST /auth/login** returns session metadata:
   ```json
   {
     "message": "Login successful",
     "user": { "id": "...", "email": "...", "display_name": "..." },
     "session": {
       "expires_at": "2025-10-16T14:30:00Z",
       "issued_at": "2025-10-16T13:00:00Z",
       "expires_in": 5400
     }
   }
   ```

2. ✅ **POST /auth/register** returns session metadata (same format)

3. ✅ **POST /auth/refresh** rotates tokens and returns new metadata:
   ```json
   {
     "message": "Token refreshed",
     "session": {
       "expires_at": "2025-10-16T15:00:00Z",
       "issued_at": "2025-10-16T13:30:00Z",
       "expires_in": 5400
     }
   }
   ```

4. ✅ **POST /auth/logout** revokes refresh token:
   ```json
   {
     "message": "Logout successful"
   }
   ```

5. ✅ **Error responses** use RFC 7807 format:
   ```json
   {
     "status": 401,
     "title": "Unauthorized",
     "detail": "Refresh token expired",
     "code": "REFRESH_TOKEN_EXPIRED"
   }
   ```

### Testing with Backend

1. Start backend server
2. Login via frontend
3. Inspect Network tab:
   - Verify `Set-Cookie` headers for `auth_token` and `refresh_token`
   - Verify cookies are `HttpOnly` and `SameSite=Strict`
4. Wait for auto-refresh (or force via console)
5. Verify new cookies set
6. Open DevTools → Application → Cookies
   - Verify token rotation occurred

## Security Considerations

### ✅ What's Protected

- **Token Rotation**: Every refresh generates new access + refresh tokens
- **HttpOnly Cookies**: Tokens not accessible via JavaScript
- **CSRF Protection**: SameSite=Strict cookie policy
- **Reuse Detection**: Backend detects and revokes reused refresh tokens
- **Automatic Logout**: Refresh failures trigger immediate logout
- **Multi-Tenant Isolation**: Backend RLS ensures tenant separation

### ⚠️ Limitations

- **XSS Risk**: If malicious script runs, it can trigger API calls with cookies
- **MITM Risk**: Requires HTTPS in production
- **Physical Access**: Local storage metadata visible if device compromised
  - **Mitigation**: Metadata only contains expiration times, not tokens themselves

## Performance

### Memory Usage
- TokenManager: Single instance (~1KB)
- BroadcastChannel: Single instance (~1KB)
- Session metadata: ~200 bytes in localStorage

### Network Impact
- Auto-refresh: 1 request every 90 minutes (access token = 90min)
- 401 retry: 1 extra request per expired token
- Typical overhead: <0.1% of total requests

### Latency
- Pre-request check: <1ms
- Token refresh: ~50-200ms (API call)
- Request queueing: Minimal (Promise-based)

## References

- [Epic 7 Backend Spec](./tech-spec-epic-7-refresh-token.md) - Rust backend implementation
- [RFC 6749](https://datatracker.ietf.org/doc/html/rfc6749) - OAuth 2.0 Authorization Framework
- [RFC 7807](https://datatracker.ietf.org/doc/html/rfc7807) - Problem Details for HTTP APIs
- [OWASP Token Security](https://cheatsheetseries.owasp.org/cheatsheets/JSON_Web_Token_for_Java_Cheat_Sheet.html)
