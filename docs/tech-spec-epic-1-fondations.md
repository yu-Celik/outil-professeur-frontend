# Technical Specification: Epic 1 - Fondations

**Project:** outil-professor
**Epic:** Epic 1 - Fondations et Gestion Administrative de Base
**Timeline:** Sprint 1-2 (3-4 weeks)
**Stories:** 6 user stories
**Priority:** CRITIQUE - Bloquant pour tous les autres epics

---

## Table of Contents

1. [Epic Overview](#epic-overview)
2. [User Stories](#user-stories)
3. [Architecture Components](#architecture-components)
4. [Database Schema](#database-schema)
5. [API Endpoints](#api-endpoints)
6. [Frontend Components](#frontend-components)
7. [Implementation Guide](#implementation-guide)
8. [Testing Approach](#testing-approach)

---

## Epic Overview

### Objective

Établir les fondations du système : authentification, gestion des entités de base (années scolaires, classes, matières, élèves, créneaux horaires) et configuration initiale de l'environnement pédagogique.

### Success Criteria

- ✅ Création de 3 classes avec 60 élèves répartis fonctionnelle
- ✅ Définition année scolaire 2024-2025 avec 3 trimestres
- ✅ Configuration créneaux horaires récurrents (8h-18h, pauses incluses)
- ✅ 0 bug bloquant sur gestion élèves/classes
- ✅ Temps moyen création classe + inscription 20 élèves < 10 minutes

### Value Delivered

L'enseignante peut créer et organiser ses classes, inscrire ses élèves, définir ses matières. Structure de données prête pour capture des données pédagogiques. Base technique solide pour epics suivants.

---

## User Stories

### Story 1.1: Authentification Enseignant

**En tant qu'** enseignante,
**Je veux** créer un compte et me connecter de manière sécurisée,
**Afin de** protéger les données de mes élèves et accéder à mon environnement personnel.

**Critères d'acceptation:**
1. Formulaire d'inscription avec email, mot de passe, confirmation mot de passe, langue préférée (français par défaut)
2. Validation email unique (erreur si déjà existant)
3. Mot de passe fort requis (min 8 caractères, majuscule, chiffre, caractère spécial)
4. Après inscription, redirection vers login
5. Formulaire de login avec email + mot de passe
6. Cookie HttpOnly créé après login réussi, valide 30 jours
7. Erreur claire si identifiants invalides : "Email ou mot de passe incorrect"
8. Bouton "Déconnexion" visible dans header, supprime cookie et redirige vers login

**Technical Notes:**
- **Backend API (Rust - DÉJÀ IMPLÉMENTÉ ✅)** : POST /auth/register, POST /auth/login, POST /auth/refresh, POST /auth/logout, GET /auth/me
- Deux cookies HttpOnly gérés côté Rust :
  - `auth_token` (JWT d'accès ~90 min) — SameSite=None; Secure en prod
  - `refresh_token` (opaque 7 jours) — rotation à chaque refresh/logout
- Frontend n'expose jamais les tokens : seules les métadonnées d'expiration sont conservées en localStorage pour planifier l'auto-refresh
- Intercepteurs axios déclenchent `/auth/refresh` 2 min avant expiration ou sur 401, en s'appuyant uniquement sur les cookies
- `/auth/logout` est toujours appelé en POST JSON `{}` ; la réponse expire les deux cookies même en cas d'erreur
- `credentials: 'include'` obligatoire sur toutes les requêtes vers Souz API
- Variable `NEXT_PUBLIC_ENABLE_CSRF_HEADER` (désactivée par défaut) permet d'ajouter `X-CSRF-Token` si le backend ouvre le CORS
- Pas de "mot de passe oublié" dans le MVP (enseignante unique)

---

### Story 1.2: Gestion des Années Scolaires et Périodes Académiques

**En tant qu'** enseignante,
**Je veux** définir l'année scolaire en cours et ses périodes académiques (trimestres),
**Afin de** contextualiser toutes mes données de suivi dans le bon cadre temporel.

**Critères d'acceptation:**
1. Page "Paramètres > Années Scolaires" accessible depuis menu
2. Bouton "Nouvelle année scolaire" ouvre formulaire : nom (ex: "2024-2025"), date début, date fin
3. Création année scolaire réussie affiche l'année dans la liste
4. Pour une année scolaire, bouton "Gérer les périodes" ouvre interface périodes
5. Bouton "Nouvelle période" : nom (ex: "Trimestre 1"), date début, date fin, checkbox "Actif"
6. Validation : périodes ne doivent pas se chevaucher
7. Une seule période peut être marquée "active" à la fois (auto-désactive les autres)
8. Période active est utilisée comme filtre par défaut dans le système

**Technical Notes:**
- Backend API: CRUD /school-years, CRUD /academic-periods
- Validation business logic : pas de chevauchement dates périodes
- Période active stockée en session utilisateur pour filtrages

---

### Story 1.3: Gestion des Classes

**En tant qu'** enseignante,
**Je veux** créer et gérer mes classes avec leurs caractéristiques,
**Afin d'** organiser mes élèves par groupes d'enseignement.

**Critères d'acceptation:**
1. Page "Gestion > Classes" liste toutes les classes avec code, libellé, année scolaire
2. Bouton "Nouvelle classe" ouvre formulaire : code unique (ex: "5A"), libellé (ex: "5ème A"), année scolaire (dropdown)
3. Validation : code unique par enseignant
4. Classe créée apparaît dans liste immédiatement
5. Clic sur une classe ouvre page détail avec infos + actions "Modifier" et "Supprimer"
6. Modification classe met à jour en temps réel (optimistic UI)
7. Suppression classe demande confirmation : "Supprimer la classe 5ème A ? Cette action est irréversible."
8. Suppression réussie retire classe de la liste (soft delete backend)

**Technical Notes:**
- Backend API: CRUD /classes avec ETag pour concurrence optimiste
- Soft delete: classe marquée deleted_at mais pas supprimée physiquement
- Filtrage par année scolaire dans liste classes

---

### Story 1.4: Gestion des Matières

**En tant qu'** enseignante,
**Je veux** définir les matières que j'enseigne,
**Afin de** les associer à mes classes et mes sessions de cours.

**Critères d'acceptation:**
1. Page "Gestion > Matières" liste toutes les matières avec nom, code, description
2. Bouton "Nouvelle matière" ouvre formulaire : nom (ex: "Anglais"), code (ex: "ANG"), description (optionnelle)
3. Matière créée apparaît dans liste
4. Actions "Modifier" et "Supprimer" disponibles pour chaque matière
5. Suppression matière demande confirmation
6. Matière utilisée dans des sessions ne peut pas être supprimée (erreur explicite)

**Technical Notes:**
- Backend API: CRUD /subjects
- Validation dépendances avant suppression (check si utilisée dans teaching assignments ou sessions)

---

### Story 1.5: Gestion des Élèves

**En tant qu'** enseignante,
**Je veux** créer des profils élèves et les inscrire dans des classes,
**Afin de** suivre individuellement chaque élève.

**Critères d'acceptation:**
1. Page "Gestion > Élèves" liste tous les élèves avec nom, prénom, classes
2. Bouton "Nouvel élève" ouvre formulaire : nom, prénom, besoins particuliers (textarea optionnelle), observations générales (textarea optionnelle), forces identifiées (textarea optionnelle)
3. Élève créé apparaît dans liste
4. Clic sur élève ouvre profil détaillé
5. Dans profil élève, section "Classes" liste les classes où l'élève est inscrit
6. Bouton "Inscrire dans une classe" : dropdown classes disponibles, bouton "Inscrire"
7. Inscription réussie affiche la classe dans la liste
8. Bouton "Désinscrire" retire élève de la classe (confirmation demandée)

**Technical Notes:**
- Backend API: CRUD /students, POST /classes/{id}/students (enroll), DELETE /classes/{id}/students/{student_id} (unenroll)
- Recherche élèves par nom avec pagination
- Multi-classe: un élève peut être inscrit dans plusieurs classes

---

### Story 1.6: Gestion des Créneaux Horaires

**En tant qu'** enseignante,
**Je veux** définir les créneaux horaires de ma journée d'enseignement,
**Afin de** planifier mes sessions de cours sur ces créneaux.

**Critères d'acceptation:**
1. Page "Paramètres > Créneaux Horaires" liste tous les créneaux : heure début, heure fin, durée, jour, ordre, type (normal/pause)
2. Bouton "Nouveau créneau" ouvre formulaire : heure début (select), heure fin (select), jour de la semaine (select), ordre d'affichage (number), checkbox "Pause"
3. Durée calculée automatiquement (fin - début)
4. Créneaux "Pause" visuellement différenciés (badge gris)
5. Créneaux triés par jour puis ordre d'affichage
6. Actions "Modifier" et "Supprimer" disponibles
7. Créneau utilisé dans sessions ne peut pas être supprimé (erreur explicite)

**Technical Notes:**
- Backend API: CRUD /time-slots
- Validation: heure fin > heure début
- Créneaux "Pause" bloquent la planification de sessions

---

## Architecture Components

### Feature Module: `gestion`

```
/src/features/gestion/
├── hooks/
│   ├── use-teaching-assignments.ts    # Teaching assignment management
│   └── index.ts
├── api/
│   ├── teaching-assignments-client.ts # Calls /teaching-assignments & related endpoints
│   ├── subjects-client.ts             # Calls /subjects endpoints
│   └── index.ts
└── index.ts
```

### Feature Module: `auth`

```
/src/features/auth/
├── hooks/
│   └── use-auth.ts                    # Authentication hooks
├── api/
│   └── auth-client.ts                 # Calls /auth/login, /auth/register, /auth/logout, /auth/me
└── index.ts
```

### Shared Infrastructure

- **API Client**: `/src/lib/api.ts` (fetch wrapper to Rust backend with cookie handling)
- **Auth Context**: `/src/contexts/auth-context.tsx` (React context for user state)
- **Middleware**: `/src/middleware.ts` (Next.js middleware for route protection)

---

## Database Schema

### Teachers Table

```sql
CREATE TABLE teachers (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  language TEXT DEFAULT 'fr',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Students Table

```sql
CREATE TABLE students (
  id TEXT PRIMARY KEY,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  current_class_id TEXT REFERENCES classes(id),
  needs TEXT,
  observations TEXT,
  strengths TEXT, -- JSON array
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_students_class ON students(current_class_id);
```

### Classes Table

```sql
CREATE TABLE classes (
  id TEXT PRIMARY KEY,
  class_code TEXT NOT NULL,
  grade_label TEXT NOT NULL,
  school_year_id TEXT REFERENCES school_years(id),
  version INTEGER DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Subjects Table

```sql
CREATE TABLE subjects (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  code TEXT NOT NULL UNIQUE,
  description TEXT
);
```

### School Years & Academic Periods

```sql
CREATE TABLE school_years (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE academic_periods (
  id TEXT PRIMARY KEY,
  school_year_id TEXT REFERENCES school_years(id),
  name TEXT NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  is_active BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Time Slots Table

```sql
CREATE TABLE time_slots (
  id TEXT PRIMARY KEY,
  start_time TEXT NOT NULL,
  end_time TEXT NOT NULL,
  duration INTEGER NOT NULL,
  display_order INTEGER NOT NULL,
  is_pause BOOLEAN DEFAULT FALSE,
  day_of_week INTEGER CHECK(day_of_week BETWEEN 1 AND 7)
);
```

### Teaching Assignments Table

```sql
CREATE TABLE teaching_assignments (
  id TEXT PRIMARY KEY,
  teacher_id TEXT REFERENCES teachers(id),
  class_id TEXT REFERENCES classes(id),
  subject_id TEXT REFERENCES subjects(id),
  school_year_id TEXT REFERENCES school_years(id),
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(teacher_id, class_id, subject_id, school_year_id)
);
```

---

## API Endpoints

### Authentication (`/auth`) - ✅ BACKEND RUST DÉJÀ IMPLÉMENTÉ

**Base URL**: `http://localhost:8080` (Rust API Souz)

```typescript
POST /auth/register
Request: { email: string, password: string, display_name: string }
Response: {
  message: "User registered successfully",
  user: { id: string, email: string, display_name: string }
}

POST /auth/login
Request: { email: string, password: string }
Response: {
  message: "Login successful",
  user: { id: string, email: string, display_name: string }
}
Set-Cookie:
  - auth_token=<JWT> (HttpOnly, SameSite=None, Secure, ~90 min)
  - refresh_token=<opaque> (HttpOnly, SameSite=None, Secure, 7 jours)

POST /auth/refresh
Request body: {}
Response: {
  message: "Tokens rotated successfully",
  user: { id: string, email: string, display_name: string },
  session: {
    access_token_expires_at: string,
    refresh_token_issued_at: string,
    refresh_token_expires_at: string,
    refresh_token_last_used_at?: string | null
  }
}
Set-Cookie: nouveaux auth_token + refresh_token avec durées mises à jour

GET /auth/me
Response: { id: string, email: string, display_name: string }
Requires: Cookies auth_token + refresh_token (envoyés automatiquement via credentials)

POST /auth/logout
Request body: {}
Response: { message: "Logout successful" }
Set-Cookie: `auth_token=; Max-Age=0` et `refresh_token=; Max-Age=0`
```

**Frontend doit utiliser `credentials: 'include'` (ou `axios.withCredentials = true`)** pour que les cookies HttpOnly soient systématiquement envoyés et mis à jour.

### Students (`/students`)

```typescript
GET /students
Query: ?class_id=string&search=string&page=1&limit=50
Response: { data: Student[], total: number, page: number }

POST /students
Request: { firstName: string, lastName: string, currentClassId?: string, needs?: string }
Response: Student

GET /students/:id
Response: Student

PUT /students/:id
Request: Partial<Student>
Response: Student

DELETE /students/:id
Response: 204 No Content
```

### Classes (`/classes`)

```typescript
GET /classes
Query: ?school_year_id=string
Response: Class[]

POST /classes
Request: { classCode: string, gradeLabel: string, schoolYearId: string }
Response: Class

GET /classes/:id
Response: Class

PUT /classes/:id
Request: Partial<Class>
Headers: If-Match: "etag" (optimistic locking)
Response: Class

DELETE /classes/:id (soft delete)
Response: 204 No Content

POST /classes/:id/students/:student_id (enroll)
Response: 201 Created

DELETE /classes/:id/students/:student_id (unenroll)
Response: 204 No Content
```

### Subjects (`/subjects`)

```typescript
GET /subjects
Response: Subject[]

POST /subjects
Request: { name: string, code: string, description?: string }
Response: Subject

PUT /subjects/:id
Request: Partial<Subject>
Response: Subject

DELETE /subjects/:id
Response: 204 No Content
```

### School Years (`/school-years`)

```typescript
GET /school-years
Response: SchoolYear[]

POST /school-years
Request: { name: string, startDate: Date, endDate: Date }
Response: SchoolYear

PUT /school-years/:id
Request: Partial<SchoolYear>
Response: SchoolYear

DELETE /school-years/:id
Response: 204 No Content
```

### Academic Periods (`/academic-periods`)

```typescript
GET /academic-periods
Query: ?school_year_id=string
Response: AcademicPeriod[]

POST /academic-periods
Request: { schoolYearId: string, name: string, startDate: Date, endDate: Date, isActive: boolean }
Response: AcademicPeriod

PUT /academic-periods/:id
Request: Partial<AcademicPeriod>
Response: AcademicPeriod

DELETE /academic-periods/:id
Response: 204 No Content
```

### Time Slots (`/time-slots`)

```typescript
GET /time-slots
Response: TimeSlot[]

POST /time-slots
Request: { startTime: string, endTime: string, dayOfWeek: number, displayOrder: number, isPause: boolean }
Response: TimeSlot

PUT /time-slots/:id
Request: Partial<TimeSlot>
Response: TimeSlot

DELETE /time-slots/:id
Response: 204 No Content
```

---

## Frontend Components

### Atoms (Existing)
- `button` - Primary/secondary actions
- `input` - Text inputs
- `select` - Dropdowns
- `label` - Form labels
- `badge` - Status indicators
- `checkbox` - Boolean selections
- `textarea` - Multi-line text
- `dialog` - Modals

### Molecules (Existing)
- `card` - Container for content blocks
- `form` - Form wrapper with validation
- `dropdown-menu` - Action menus
- `table` - Data tables

### Organisms (To Create)

#### `login-form`
- Email input
- Password input
- Submit button
- Error display

#### `register-form`
- Email input
- Password input
- Confirm password input
- Language selector
- Submit button

#### `class-list`
- Data table with columns: Code, Label, Year, Actions
- New class button
- Delete confirmation dialog

#### `class-form`
- Class code input
- Grade label input
- School year selector
- Submit button

#### `student-list`
- Data table with columns: Name, Classes, Actions
- Search input
- New student button
- Pagination

#### `student-form`
- First name, last name inputs
- Needs textarea
- Observations textarea
- Strengths textarea
- Submit button

#### `student-enrollment-manager`
- Available classes dropdown
- Enroll button
- Current classes list with unenroll buttons

#### `subject-list`
- Data table with columns: Name, Code, Description, Actions
- New subject button

#### `time-slot-list`
- Data table with columns: Day, Start, End, Duration, Type, Order, Actions
- New time slot button
- Pause badge styling

---

## Implementation Guide

### Phase 1: Authentication Frontend (Days 1-2)

**Contexte**: Le backend Rust (Souz) gère déjà l'authentification avec JWT + HttpOnly cookies. Frontend Next.js doit uniquement créer les pages de login/register et gérer la protection des routes.

**Step 1: Create API Client**

`/src/lib/api.ts`:
```typescript
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'

export async function fetchAPI(endpoint: string, options: RequestInit = {}) {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    credentials: 'include', // CRITIQUE: Envoie les cookies auth_token / refresh_token
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Network error' }))
    throw new Error(error.message || 'API Error')
  }

  return response.json()
}
```

**Step 2: Create Auth Context**

`/src/contexts/auth-context.tsx`:
```typescript
'use client'

import { createContext, useContext, useState, useEffect } from 'react'
import { fetchAPI } from '@/lib/api'

interface User {
  id: string
  email: string
  display_name: string
}

interface AuthContextType {
  user: User | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  refetch: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchUser = async () => {
    try {
      const data = await fetchAPI('/auth/me')
      setUser(data)
    } catch {
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUser()
  }, [])

  const login = async (email: string, password: string) => {
    const data = await fetchAPI('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    })
    setUser(data.user)
  }

  const logout = async () => {
    await fetchAPI('/auth/logout', {
      method: 'POST',
      body: JSON.stringify({}),
    })
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, refetch: fetchUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within AuthProvider')
  return context
}
```

**Step 3: Create Auth Pages**

`/src/app/auth/login/page.tsx`:
```typescript
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/auth-context'
import { Button } from '@/components/atoms/button'
import { Input } from '@/components/atoms/input'
import { Label } from '@/components/atoms/label'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const { login } = useAuth()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    try {
      await login(email, password)
      router.push('/dashboard')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Email ou mot de passe incorrect')
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center">
      <form onSubmit={handleSubmit} className="w-full max-w-md space-y-4">
        <h1 className="text-2xl font-bold">Connexion</h1>

        {error && <div className="text-red-500">{error}</div>}

        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div>
          <Label htmlFor="password">Mot de passe</Label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <Button type="submit" className="w-full">
          Se connecter
        </Button>
      </form>
    </div>
  )
}
```

**Step 4: Protect Dashboard with Middleware**

`/src/middleware.ts`:
```typescript
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const authToken = request.cookies.get('auth_token')

  // Si pas de cookie, rediriger vers login
  if (!authToken) {
    return NextResponse.redirect(new URL('/auth/login', request.url))
  }

  // Vérifier la validité du token auprès du backend
  try {
    const response = await fetch('http://localhost:8080/auth/me', {
      headers: {
        cookie: `auth_token=${authToken.value}`,
      },
    })

    if (!response.ok) {
      return NextResponse.redirect(new URL('/auth/login', request.url))
    }

    return NextResponse.next()
  } catch {
    return NextResponse.redirect(new URL('/auth/login', request.url))
  }
}

export const config = {
  matcher: '/dashboard/:path*',
}
```

### Phase 2: Backend Verification (Day 3)

**Contexte**: Le backend Rust gère déjà PostgreSQL avec RLS et migrations. Frontend n'a PAS besoin de base de données locale.

**Step 1: Vérifier que le backend Rust tourne**
```bash
cd ../souz-backend
cargo run --release
# Backend démarre sur http://localhost:8080
```

**Step 2: Tester les endpoints auth existants**
```bash
# Register
curl -X POST http://localhost:8080/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"teacher@test.com","password":"SecurePass123!","display_name":"Teacher Test"}'

# Login
curl -X POST http://localhost:8080/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"teacher@test.com","password":"SecurePass123!"}' \
  -c cookies.txt

# Get profile
curl -X GET http://localhost:8080/auth/me \
  -b cookies.txt
```

**Step 3: Vérifier les CORS**
Si le frontend Next.js (localhost:3000) ne peut pas communiquer avec le backend (localhost:8080), ajouter CORS dans le backend Rust :
```rust
// Dans souz-backend/crates/souz-api/src/main.rs
use tower_http::cors::{CorsLayer, Any};

let cors = CorsLayer::new()
    .allow_origin("http://localhost:3000".parse::<HeaderValue>().unwrap())
    .allow_methods([Method::GET, Method::POST, Method::PUT, Method::DELETE])
    .allow_headers(Any)
    .allow_credentials(true);

let app = Router::new()
    .merge(routes)
    .layer(cors);
```

### Phase 3: CRUD Implementations (Days 4-10)

**Pattern Frontend-only**: Le backend Rust a déjà les endpoints, créer uniquement les pages et hooks React.

1. **School Years & Periods** (Day 4-5)
   - ✅ Backend: Endpoints CRUD existants (vérifier dans souz-backend)
   - ⏳ Frontend: Page `/dashboard/gestion/school-years`
   - ⏳ Hook: `use-school-years.ts` utilisant `fetchAPI()`

2. **Subjects** (Day 6)
   - ✅ Backend: Endpoints CRUD existants
   - ⏳ Frontend: Page `/dashboard/gestion/subjects`
   - ⏳ Hook: `use-subjects.ts`

3. **Classes** (Day 7)
   - ✅ Backend: CRUD avec ETag (vérifier implémentation)
   - ⏳ Frontend: Page `/dashboard/gestion/classes`
   - ⏳ Hook: `use-classes.ts`
   - ⏳ Optimistic UI avec React Query ou SWR

4. **Students** (Days 8-9)
   - ✅ Backend: CRUD + enrollment endpoints existants
   - ⏳ Frontend: Page `/dashboard/gestion/students`
   - ⏳ Hook: `use-students.ts`
   - ⏳ Search input + pagination

5. **Time Slots** (Day 10)
   - ✅ Backend: Endpoints CRUD existants
   - ⏳ Frontend: Page `/dashboard/gestion/time-slots`
   - ⏳ Hook: `use-time-slots.ts`

### Phase 4: Integration & Polish (Days 11-14)

**Day 11-12: Navigation & Layout**
- Add menu items to sidebar
- Create breadcrumb navigation
- Implement page transitions

**Day 13: Data Seeding**
- Créer un script de seed initial basé sur les endpoints Souz (import CSV → POST API)
- Test with realistic dataset (3 classes, 60 students)

**Day 14: Testing & Bug Fixes**
- Manual testing checklist
- Fix validation errors
- Optimize performance

---

## Testing Approach

### Manual Testing Checklist

**Story 1.1: Authentication**
- [ ] Register with valid credentials succeeds
- [ ] Register with duplicate email shows error
- [ ] Register with weak password shows validation error
- [ ] Login with valid credentials succeeds and redirects
- [ ] Login with invalid credentials shows error
- [ ] Session persists after page refresh
- [ ] Logout clears session and redirects

**Story 1.2: School Years & Periods**
- [ ] Can create school year with valid dates
- [ ] School year appears in list immediately
- [ ] Can create academic period within year
- [ ] Overlapping periods show validation error
- [ ] Only one period can be active at a time
- [ ] Active period auto-deactivates others

**Story 1.3: Classes**
- [ ] Can create class with unique code
- [ ] Duplicate code shows error
- [ ] Class appears in list immediately
- [ ] Can edit class (optimistic UI)
- [ ] Delete confirmation dialog appears
- [ ] Soft delete removes from list

**Story 1.4: Subjects**
- [ ] Can create subject with name and code
- [ ] Subject appears in list
- [ ] Can edit subject
- [ ] Cannot delete subject in use (validation)

**Story 1.5: Students**
- [ ] Can create student with name
- [ ] Student appears in list
- [ ] Search filters students correctly
- [ ] Can enroll student in class
- [ ] Can unenroll student (with confirmation)
- [ ] Multi-class enrollment works

**Story 1.6: Time Slots**
- [ ] Can create time slot with start/end times
- [ ] Duration calculated automatically
- [ ] Pause slots visually differentiated
- [ ] Cannot delete time slot in use

### E2E Test Scenarios (Playwright)

**Critical Path: Teacher Onboarding**
```typescript
test('teacher can complete full setup', async ({ page }) => {
  // 1. Register
  await page.goto('/register')
  await page.fill('[name="email"]', 'teacher@test.com')
  await page.fill('[name="password"]', 'SecurePass123!')
  await page.click('button[type="submit"]')

  // 2. Create school year
  await page.goto('/dashboard/gestion/school-years')
  await page.click('text=Nouvelle année scolaire')
  await page.fill('[name="name"]', '2024-2025')
  await page.fill('[name="startDate"]', '2024-09-01')
  await page.fill('[name="endDate"]', '2025-06-30')
  await page.click('text=Créer')

  // 3. Create class
  await page.goto('/dashboard/gestion/classes')
  await page.click('text=Nouvelle classe')
  await page.fill('[name="classCode"]', '5A')
  await page.fill('[name="gradeLabel"]', '5ème A')
  await page.click('text=Créer')

  // 4. Create student
  await page.goto('/dashboard/gestion/students')
  await page.click('text=Nouvel élève')
  await page.fill('[name="firstName"]', 'Lucas')
  await page.fill('[name="lastName"]', 'Martin')
  await page.click('text=Créer')

  // 5. Enroll student
  await page.click('text=Lucas Martin')
  await page.click('text=Inscrire dans une classe')
  await page.selectOption('[name="classId"]', { label: '5ème A' })
  await page.click('text=Inscrire')

  // Assert: Student enrolled in class
  await expect(page.locator('text=5ème A')).toBeVisible()
})
```

### Performance Testing

**Objective: Création classe + inscription 20 élèves < 10 minutes**

Manual test:
1. Create new class
2. Create 20 students
3. Enroll all 20 students
4. Measure total time

**Target: < 10 minutes**

---

## Dependencies

### NPM Packages (Frontend)
```json
{
  "zod": "^3.22.0",
  "react-hook-form": "^7.49.0",
  "@hookform/resolvers": "^3.3.0"
}
```

**Note**: Pas de dépendances auth (Better Auth, NextAuth, etc.). Le backend Rust gère l'authentification.

### Backend (Rust API Souz)
- ✅ Authentification JWT déjà implémentée
- ✅ Endpoints CRUD pour toutes les entités déjà opérationnels
- ✅ PostgreSQL avec Row-Level Security (RLS)
- ⚠️ Vérifier CORS pour permettre frontend Next.js (localhost:3000)

---

## Notes

**Critical Path:**
Frontend Auth (Login page) → Backend verification (CORS) → School Years → Classes → Students → Enrollment

**Simplifications vs. Plan Initial:**
- ❌ **Pas de Better Auth** : Backend Rust gère déjà l'auth avec JWT + cookies
- ❌ **Pas de SQLite frontend** : Backend Rust utilise PostgreSQL
- ✅ **Frontend uniquement** : Pages React + hooks utilisant `fetchAPI()` vers backend
- ✅ **Gain de temps** : ~2-3 jours économisés (pas de setup auth/db)

**Blockers:**
- Backend Rust doit tourner sur localhost:8080
- CORS doit être configuré (allow origin: localhost:3000)
- Classes doivent exister avant inscription d'élèves

**Optimization Opportunities:**
- Bulk student import (CSV) - Post-MVP
- Class templates - Post-MVP
- Student photo upload - Post-MVP

---

**Document Status:** ✅ Ready for Implementation
**Generated:** 2025-10-14
**Epic Timeline:** Sprint 1-2 (3-4 weeks)
