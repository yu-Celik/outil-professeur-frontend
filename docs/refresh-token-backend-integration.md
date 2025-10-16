# Backend Integration - Refresh Token System

## ✅ Status: READY TO TEST

Le système frontend a été **adapté** pour correspondre exactement au backend Epic 7 Rust existant.

---

## 🔄 Différences Backend vs Plan Initial

### SessionTokenMetadata - Champs Backend

Le backend utilise des noms de champs plus explicites :

```typescript
// ✅ Backend Epic 7 (Rust) - IMPLÉMENTÉ
interface SessionTokenMetadata {
  access_token_expires_at: string        // ISO 8601
  refresh_token_issued_at: string        // ISO 8601
  refresh_token_expires_at: string       // ISO 8601
  refresh_token_last_used_at?: string    // ISO 8601 (optional)
}
```

```typescript
// ❌ Plan Initial (simplifié) - NON UTILISÉ
interface SessionTokenMetadata {
  expires_at: string      // Trop ambigu
  issued_at: string       // Trop ambigu
  expires_in?: number
}
```

**✅ Frontend adapté** pour utiliser les champs backend !

### RefreshResponse - Champ User Ajouté

Le backend retourne aussi `user` dans `RefreshResponse` (pas seulement dans `LoginResponse`) :

```typescript
// ✅ Backend Epic 7
interface RefreshResponse {
  message: string
  user: {
    id: string
    email: string
    display_name: string
  }
  session: SessionTokenMetadata
}
```

```typescript
// ❌ Plan Initial
interface RefreshResponse {
  message: string
  session: SessionTokenMetadata  // user manquant
}
```

**✅ Frontend adapté** avec champ `user` !

---

## 📋 Endpoints Backend Confirmés

### ✅ POST /auth/login

**Request:**
```json
{
  "email": "teacher@example.com",
  "password": "password123"
}
```

**Response 200:**
```json
{
  "message": "Login successful",
  "user": {
    "id": "uuid",
    "email": "teacher@example.com",
    "display_name": "John Doe"
  },
  "session": {
    "access_token_expires_at": "2025-10-16T14:30:00Z",
    "refresh_token_issued_at": "2025-10-16T13:00:00Z",
    "refresh_token_expires_at": "2025-10-23T13:00:00Z"
  }
}
```

**Cookies Set:**
- `auth_token` (access token, HttpOnly)
- `refresh_token` (refresh token, HttpOnly)

---

### ✅ POST /auth/refresh

**Request:** Cookies automatiquement envoyés

**Response 200:**
```json
{
  "message": "Tokens rotated successfully",
  "user": {
    "id": "uuid",
    "email": "teacher@example.com",
    "display_name": "John Doe"
  },
  "session": {
    "access_token_expires_at": "2025-10-16T15:00:00Z",
    "refresh_token_issued_at": "2025-10-16T13:30:00Z",
    "refresh_token_expires_at": "2025-10-23T13:30:00Z",
    "refresh_token_last_used_at": "2025-10-16T13:30:00Z"
  }
}
```

**Cookies Set:** Nouveaux `auth_token` + `refresh_token`

**Errors (RFC 7807 ProblemDetails):**
```json
{
  "status": 401,
  "title": "Unauthorized",
  "detail": "Refresh token expired",
  "code": "REFRESH_TOKEN_EXPIRED"
}
```

---

### ✅ POST /auth/logout

**Request:**
```json
{
  "refresh_token": "token_value"  // Optional: peut être dans cookie
}
```

**Response 200:**
```json
{
  "message": "Logout successful"
}
```

**Action:**
- Révoque refresh token dans DB
- Clear cookies (`auth_token`, `refresh_token`)

---

### ✅ POST /auth/register

**Request:**
```json
{
  "email": "newteacher@example.com",
  "password": "securepassword",
  "display_name": "Jane Doe"
}
```

**Response 200:**
```json
{
  "message": "User registered successfully",
  "user": {
    "id": "uuid",
    "email": "newteacher@example.com",
    "display_name": "Jane Doe"
  },
  "session": {
    "access_token_expires_at": "2025-10-16T14:30:00Z",
    "refresh_token_issued_at": "2025-10-16T13:00:00Z",
    "refresh_token_expires_at": "2025-10-23T13:00:00Z"
  }
}
```

---

## 🔧 Fichiers Frontend Adaptés

### 1. `src/types/auth.ts`
✅ Types mis à jour pour correspondre au backend :
- `SessionTokenMetadata` avec `access_token_expires_at`
- `RefreshResponse` avec champ `user`

### 2. `src/lib/auth/token-storage.ts`
✅ Fonctions mises à jour :
- `getSessionMetadata()` valide `access_token_expires_at`
- `isTokenExpiringSoon()` utilise `access_token_expires_at`
- `getTimeUntilExpiration()` utilise `access_token_expires_at`
- `isTokenExpired()` utilise `access_token_expires_at`

### 3. Autres fichiers (pas de changement nécessaire)
- `src/lib/api.ts` - Utilise types génériques (OK)
- `src/lib/auth/token-manager.ts` - Utilise `SessionTokenMetadata` (OK)
- `src/lib/auth/broadcast-channel.ts` - Utilise `SessionTokenMetadata` (OK)
- `src/features/auth/contexts/auth-context.tsx` - Utilise types (OK)

---

## 🧪 Tests d'Intégration

### Test 1 : Login Complet

```bash
# Terminal 1: Start backend (si pas déjà lancé)
cd ~/Codebases/souz-backend
cargo run --bin souz-api

# Terminal 2: Start frontend
cd ~/Codebases/outil-professor
npm run dev
```

**Actions:**
1. Ouvrir `http://localhost:3000/login`
2. Login avec credentials valides
3. Vérifier DevTools:
   - Application > Cookies → `auth_token`, `refresh_token` HttpOnly
   - Application > Local Storage → `session_metadata` avec `access_token_expires_at`
   - Console → Aucune erreur

### Test 2 : Auto-Refresh

**Simuler expiration rapide (pour test):**

```typescript
// Console browser (après login)
const metadata = {
  access_token_expires_at: new Date(Date.now() + 3 * 60 * 1000).toISOString(), // 3 min
  refresh_token_issued_at: new Date().toISOString(),
  refresh_token_expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() // 7 jours
}
localStorage.setItem('session_metadata', JSON.stringify(metadata))

// Forcer refresh
import { tokenManager } from '@/lib/auth'
tokenManager.forceRefresh()
```

**Vérifier:**
- Network tab → `POST /auth/refresh` appelé
- Nouveaux cookies `Set-Cookie`
- localStorage mis à jour avec nouveau `access_token_expires_at`
- Aucune erreur console

### Test 3 : Multi-Tab Logout

1. Ouvrir app dans 2 onglets
2. Login dans les deux
3. Logout dans onglet 1
4. Vérifier onglet 2 :
   - User automatiquement déconnecté
   - Redirect vers `/login`

### Test 4 : 401 Handling

1. Login
2. Attendre expiration access token (ou forcer expiration)
3. Faire requête API (ex: GET `/students`)
4. Vérifier Network tab :
   - Requête échoue 401
   - `POST /auth/refresh` automatique
   - Requête originale retryée avec succès

---

## 🐛 Debugging

### Vérifier session metadata

```javascript
// Console browser
const metadata = JSON.parse(localStorage.getItem('session_metadata'))
console.log(metadata)

// Expected:
{
  access_token_expires_at: "2025-10-16T14:30:00Z",
  refresh_token_issued_at: "2025-10-16T13:00:00Z",
  refresh_token_expires_at: "2025-10-23T13:00:00Z"
}
```

### Vérifier cookies

```javascript
// Console browser
document.cookie.split(';').filter(c => c.includes('auth_token') || c.includes('refresh_token'))
```

**Expected:** Aucun résultat (HttpOnly cookies invisibles à JavaScript) ✅

### Vérifier TokenManager state

```javascript
// Console browser
import { tokenManager } from '@/lib/auth'
console.log(tokenManager.getState())

// Expected:
{
  isRefreshing: false,
  hasTimer: true  // Si connecté
}
```

---

## 📊 Diagramme de Séquence - Login Complet

```
User                Frontend              Backend (Rust)         Database
 │                     │                        │                    │
 │  Submit Login Form  │                        │                    │
 ├────────────────────>│                        │                    │
 │                     │   POST /auth/login     │                    │
 │                     ├───────────────────────>│                    │
 │                     │                        │  Validate Creds    │
 │                     │                        ├───────────────────>│
 │                     │                        │                    │
 │                     │                        │  Create Tokens     │
 │                     │                        │<───────────────────┤
 │                     │                        │                    │
 │                     │   Set-Cookie:          │                    │
 │                     │   auth_token (HttpOnly)│                    │
 │                     │   refresh_token        │                    │
 │                     │                        │                    │
 │                     │   Response: {          │                    │
 │                     │     user, session      │                    │
 │                     │   }                    │                    │
 │                     │<───────────────────────┤                    │
 │                     │                        │                    │
 │                     │  Store session metadata│                    │
 │                     │  in localStorage       │                    │
 │                     │                        │                    │
 │                     │  TokenManager.start()  │                    │
 │                     │  Schedule refresh      │                    │
 │                     │  (expires_at - 2min)   │                    │
 │                     │                        │                    │
 │   Redirect /dashboard                        │                    │
 │<────────────────────┤                        │                    │
 │                     │                        │                    │
 │                     │  ... 88 minutes later ...                   │
 │                     │                        │                    │
 │                     │  Timer triggers        │                    │
 │                     │  auto-refresh          │                    │
 │                     │                        │                    │
 │                     │   POST /auth/refresh   │                    │
 │                     │   (cookies sent auto)  │                    │
 │                     ├───────────────────────>│                    │
 │                     │                        │  Validate refresh  │
 │                     │                        │  token             │
 │                     │                        ├───────────────────>│
 │                     │                        │                    │
 │                     │                        │  Rotate tokens     │
 │                     │                        │<───────────────────┤
 │                     │                        │                    │
 │                     │   Set-Cookie: new      │                    │
 │                     │   auth_token +         │                    │
 │                     │   refresh_token        │                    │
 │                     │                        │                    │
 │                     │   Response: {          │                    │
 │                     │     user, session      │                    │
 │                     │   }                    │                    │
 │                     │<───────────────────────┤                    │
 │                     │                        │                    │
 │                     │  Update localStorage   │                    │
 │                     │  Schedule next refresh │                    │
 │                     │                        │                    │
 │  (No interruption)  │                        │                    │
```

---

## ✅ Checklist Finale

- [x] Types `SessionTokenMetadata` correspondent au backend
- [x] `RefreshResponse` inclut champ `user`
- [x] `token-storage.ts` utilise `access_token_expires_at`
- [x] Tous les endpoints backend confirmés disponibles
- [x] Format d'erreur RFC 7807 `ProblemDetails` supporté
- [ ] Tests manuels avec backend local (À FAIRE)
- [ ] Validation en environnement de dev

---

## 🚀 Prochaines Étapes

1. **Démarrer backend Rust** : `cargo run --bin souz-api`
2. **Démarrer frontend Next.js** : `npm run dev`
3. **Tester login** → Vérifier cookies + localStorage
4. **Tester auto-refresh** → Attendre ou forcer refresh
5. **Tester multi-tabs** → Logout dans un onglet
6. **Tester 401** → Expirer token et faire requête API

---

**Status: ✅ PRÊT POUR TESTS D'INTÉGRATION !**
