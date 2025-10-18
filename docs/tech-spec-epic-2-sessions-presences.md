# Technical Specification: Epic 2 - Sessions & Présences

**Project:** outil-professor
**Epic:** Epic 2 - Planning et Suivi des Sessions de Cours
**Timeline:** Sprint 3-4 (3-4 weeks)
**Stories:** 6 user stories
**Priority:** CRITIQUE - Cœur du workflow quotidien

---

## Table of Contents

1. [Epic Overview](#epic-overview)
2. [User Stories](#user-stories)
3. [Architecture Components](#architecture-components)
4. [Database Schema](#database-schema)
5. [API Endpoints](#api-endpoints)
6. [Frontend Components](#frontend-components)
7. [Stratégie UI & Intégration API](#stratégie-ui--intégration-api)
8. [Implementation Guide](#implementation-guide)
9. [Testing Approach](#testing-approach)

---

## Epic Overview

### Objective

Implémenter le système complet de planification des sessions (avec templates hebdomadaires), calendrier visuel, saisie ultra-rapide des présences et capture des données comportementales post-session.

### Success Criteria

- ✅ Création template hebdomadaire 12 sessions récurrentes < 5 minutes
- ✅ Saisie présences 30 élèves en ≤ 2 minutes (objectif clé)
- ✅ 0 conflit de planning non détecté (validation 100% fiable)
- ✅ Taux adoption saisie quotidienne ≥ 90% après 2 semaines

### Value Delivered

L'enseignante peut planifier ses cours récurrents en quelques clics. Saisie post-session ultra-rapide devient routine quotidienne. Historique complet de présences et participation pour chaque élève. Fondation data pour analytics et génération rapports.

---

## User Stories

### Story 2.1: Calendrier Visuel des Sessions

**En tant qu'** enseignante,
**Je veux** voir un calendrier visuel de mes sessions planifiées,
**Afin d'** avoir une vue d'ensemble de ma semaine/mois d'enseignement.

**Critères d'acceptation:**
1. Page "Calendrier" affiche vue mensuelle par défaut
2. Navigation mois précédent/suivant avec flèches
3. Toggle vue "Mois" / "Semaine"
4. Sessions affichées dans les cases jour avec : heure, classe, matière, statut (icône)
5. Code couleur par matière pour distinction visuelle rapide
6. Clic sur session ouvre modal détails : classe, matière, créneau, date, statut, actions
7. Sessions statut "Complétée" affichent badge vert ✅
8. Sessions futures affichent badge bleu "Planifiée"

---

### Story 2.2: Templates Hebdomadaires de Sessions

**En tant qu'** enseignante,
**Je veux** créer un template de ma semaine type de cours,
**Afin de** générer automatiquement toutes mes sessions récurrentes.

**Critères d'acceptation:**
1. Page "Paramètres > Templates Hebdomadaires" liste templates existants
2. Bouton "Nouveau template" ouvre formulaire : nom template, classe, matière, jour de la semaine, créneau horaire
3. Template créé apparaît dans liste
4. Bouton "Générer sessions depuis ce template" : date début (date picker), date fin (date picker)
5. Génération crée toutes les sessions entre début et fin selon récurrence template
6. Confirmation affichée : "24 sessions créées avec succès"
7. Sessions générées visibles dans calendrier immédiatement

---

### Story 2.3: Planification Manuelle de Session

**En tant qu'** enseignante,
**Je veux** créer une session de cours ponctuelle manuellement,
**Afin de** planifier un cours exceptionnel ou modifier mon planning.

**Critères d'acceptation:**
1. Depuis calendrier, clic sur jour vide ouvre modal "Nouvelle session"
2. Formulaire : classe (dropdown), matière (dropdown), date (date picker pré-remplie), créneau horaire (dropdown)
3. Validation temps réel : si conflit détecté, erreur "Créneau déjà occupé par session Classe 5A - Anglais"
4. Validation : créneau type "Pause" ne peut pas être sélectionné (désactivé dans dropdown)
5. Bouton "Créer" crée session et ferme modal
6. Session apparaît immédiatement dans calendrier
7. Si création échoue (conflit backend), message erreur clair affiché

---

### Story 2.4: Reprogrammation de Session

**En tant qu'** enseignante,
**Je veux** reprogrammer une session à un autre jour/créneau,
**Afin de** gérer les imprévus (férié, absence, problème technique).

**Critères d'acceptation:**
1. Depuis modal détails session, bouton "Reprogrammer"
2. Formulaire affiche date actuelle et créneau, permet modification
3. Validation temps réel : détection conflit nouvelle date/créneau
4. Option statut : "Reportée" ou "Annulée" (dropdown)
5. Si "Reportée" : nouvelle date obligatoire
6. Si "Annulée" : nouvelle date non requise, session marquée annulée
7. Bouton "Confirmer" met à jour session
8. Notification succès : "Session reprogrammée au Jeudi 16/11 à 14h"

---

### Story 2.5: Saisie Rapide des Présences Post-Session (CRITIQUE)

**En tant qu'** enseignante,
**Je veux** enregistrer rapidement les présences et données de session juste après mon cours,
**Afin de** capturer les informations pendant qu'elles sont fraîches, en moins de 2 minutes.

**Critères d'acceptation:**
1. Après session terminée, depuis calendrier ou dashboard, clic "Saisir présences" ouvre interface batch
2. Interface affiche tableau : colonnes Élève, Présent (checkbox), Participation (select: Faible/Moyenne/Élevée), Comportement (select: Positif/Neutre/Négatif), Caméra (select: Activée/Désactivée/Problème), Notes (textarea courte)
3. **Action bulk** : Bouton "Marquer tous présents" coche toutes les cases présence en un clic
4. Ensuite ajuster uniquement les 2-3 absents et cas particuliers
5. Auto-save toutes les 10 secondes (indicateur "Sauvegarde automatique...")
6. Raccourcis clavier : Tab navigation, Enter valide ligne suivante
7. Bouton "Enregistrer et fermer" sauvegarde définitivement et retourne au dashboard
8. **Objectif timing** : Saisie complète 30 élèves en ≤ 2 minutes (mesure UX critique)

---

### Story 2.6: Consultation Détaillée Session et Historique Présences

**En tant qu'** enseignante,
**Je veux** consulter les détails d'une session passée avec toutes les données de présence,
**Afin de** vérifier l'historique et préparer mes rapports.

**Critères d'acceptation:**
1. Clic sur session complétée dans calendrier ouvre page détail session
2. Header affiche : Classe, Matière, Date, Créneau horaire, Statut
3. Section "Présences" : tableau élèves avec toutes données capturées (présent, participation, comportement, caméra, notes)
4. Indicateurs visuels : ✅ Présent (vert), ❌ Absent (rouge), 🔴 Caméra désactivée
5. Statistiques session en header : Taux de présence (18/20 = 90%), Participation moyenne
6. Bouton "Modifier les présences" permet édition rétroactive
7. Historique horodaté des modifications (qui, quand, quoi changé)

---

## Architecture Components

### Feature Module: `calendar`

```
/src/features/calendar/
├── hooks/
│   ├── use-calendar.ts              # Calendar navigation & display
│   ├── use-timeslots.ts             # Time slot management
│   └── index.ts
├── api/
│   ├── calendar-client.ts           # Wrappers around /course-sessions & /weekly-templates
│   └── index.ts
└── index.ts
```

### Feature Module: `sessions`

```
/src/features/sessions/
├── hooks/
│   ├── use-dashboard-sessions.ts     # Session management hooks
│   └── index.ts
├── api/
│   ├── sessions-client.ts            # Calls /course-sessions & /sessions/{session_id}/attendance
│   └── index.ts
└── index.ts
```

### Global Services

```
/src/services/
├── session-generator.ts              # Generate recurring sessions from templates
├── period-calculator.ts              # Academic period calculations
└── session-makeup.ts                 # Rescheduling logic with conflict detection
```

---

## Database Schema

### Course Sessions Table

```sql
CREATE TABLE course_sessions (
  id TEXT PRIMARY KEY,
  session_date DATE NOT NULL,
  time_slot_id TEXT REFERENCES time_slots(id),
  teaching_assignment_id TEXT REFERENCES teaching_assignments(id),
  status TEXT CHECK(status IN ('planned', 'completed', 'cancelled')),
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_sessions_date ON course_sessions(session_date);
CREATE INDEX idx_sessions_assignment ON course_sessions(teaching_assignment_id);
```

### Weekly Templates Table

```sql
CREATE TABLE weekly_templates (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  teaching_assignment_id TEXT REFERENCES teaching_assignments(id),
  day_of_week INTEGER CHECK(day_of_week BETWEEN 1 AND 7),
  time_slot_id TEXT REFERENCES time_slots(id),
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Student Participation Table

```sql
CREATE TABLE student_participation (
  id TEXT PRIMARY KEY,
  course_session_id TEXT REFERENCES course_sessions(id),
  student_id TEXT REFERENCES students(id),
  is_present BOOLEAN NOT NULL,
  participation_level TEXT CHECK(participation_level IN ('low', 'medium', 'high')),
  behavior TEXT CHECK(behavior IN ('positive', 'neutral', 'negative')),
  camera_status TEXT CHECK(camera_status IN ('on', 'off', 'technical_issue')),
  notes TEXT,
  technical_issue BOOLEAN DEFAULT FALSE,
  UNIQUE(course_session_id, student_id)
);

CREATE INDEX idx_participation_session ON student_participation(course_session_id);
CREATE INDEX idx_participation_student ON student_participation(student_id);
```

---

## API Endpoints - ✅ BACKEND RUST (SOUZ)

**Base URL**: `http://localhost:8080`
**Authentication**: Cookie `auth_token` (JWT, HttpOnly)
**OpenAPI Spec**: [souz-api-openapi.json](souz-api-openapi.json)

### Course Sessions (`/course-sessions`)

```typescript
GET /course-sessions
Query params:
  - class_id?: UUID
  - subject_id?: UUID
  - date?: YYYY-MM-DD (exact date)
  - from?: YYYY-MM-DD (range start)
  - to?: YYYY-MM-DD (range end)
  - status?: 'scheduled' | 'completed' | 'cancelled'
  - cursor?: string (pagination)
  - limit?: number (default 50, max 100)

Response: {
  data: CourseSession[],
  next_cursor: string | null
}

POST /course-sessions
Request: {
  session_date: string, // "YYYY-MM-DD"
  time_slot_id: string, // UUID
  teaching_assignment_id: string // UUID
}
Response: CourseSession
Status: 201 Created
Errors:
  - 409: Conflict (session already exists for this class/date/time)
  - 422: Validation error (scheduling on break time slot)

GET /course-sessions/{id}
Response: EnrichedCourseSession {
  id: string,
  session_date: string,
  time_slot_id: string,
  teaching_assignment_id: string,
  status: 'scheduled' | 'completed' | 'cancelled',
  notes: string | null,
  class: { id, class_code, grade_label },
  subject: { id, name, code },
  time_slot: { start_time, end_time, duration },
  participation_count: number,
  created_at: string,
  updated_at: string
}

PATCH /course-sessions/{id}
Request: {
  session_date?: string,
  time_slot_id?: string,
  status?: 'scheduled' | 'completed' | 'cancelled',
  notes?: string
}
Response: CourseSession
Errors:
  - 409: Conflict (reschedule would conflict with another session)
  - 422: Validation error (reschedule to break time slot)

DELETE /course-sessions/{id}
Response: 204 No Content
```

**Frontend Integration Example:**
```typescript
// features/sessions/hooks/use-sessions.ts
import { fetchAPI } from '@/lib/api'

export function useSessions(classId: string, startDate: Date, endDate: Date) {
  const [sessions, setSessions] = useState<CourseSession[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const from = format(startDate, 'yyyy-MM-dd')
    const to = format(endDate, 'yyyy-MM-dd')

    fetchAPI(`/course-sessions?class_id=${classId}&from=${from}&to=${to}`)
      .then(data => setSessions(data.data))
      .finally(() => setLoading(false))
  }, [classId, startDate, endDate])

  const createSession = async (data: CourseSessionInput) => {
    const newSession = await fetchAPI('/course-sessions', {
      method: 'POST',
      body: JSON.stringify({
        session_date: format(data.sessionDate, 'yyyy-MM-dd'),
        time_slot_id: data.timeSlotId,
        teaching_assignment_id: data.teachingAssignmentId,
      }),
    })
    setSessions(prev => [...prev, newSession])
  }

  return { sessions, loading, createSession }
}
```

### Attendance (`/course-sessions/{id}/attendance`)

```typescript
GET /course-sessions/{id}/attendance
Response: {
  session_id: string,
  class: { id, class_code, grade_label },
  students: Array<{
    student_id: string,
    first_name: string,
    last_name: string,
    participation: {
      id: string,
      is_present: boolean,
      participation_level: 'low' | 'medium' | 'high' | null,
      behavior: 'positive' | 'neutral' | 'negative' | null,
      camera_status: 'on' | 'off' | 'technical_issue' | null,
      notes: string | null,
      technical_issue: boolean
    } | null
  }>
}

// Note: Il existe aussi /sessions/{session_id}/attendance (2 endpoints similaires dans l'API)
```

**Batch Update Attendance:**
```typescript
PUT /sessions/{session_id}/attendance
Request: {
  items: Array<{
    id: string, // participation_id (si modification)
    student_id: string,
    is_present: boolean,
    participation_level?: 'low' | 'medium' | 'high',
    behavior?: 'positive' | 'neutral' | 'negative',
    camera_status?: 'on' | 'off' | 'technical_issue',
    notes?: string,
    technical_issue?: boolean
  }>
}
Response: {
  updated: number,
  created: number
}
```

**Frontend Integration Example:**
```typescript
// components/organisms/participation-tracker/participation-tracker.tsx
const handleSave = async (participations: StudentParticipation[]) => {
  await fetchAPI(`/sessions/${sessionId}/attendance`, {
    method: 'PUT',
    body: JSON.stringify({
      items: participations.map(p => ({
        student_id: p.studentId,
        is_present: p.isPresent,
        participation_level: p.participationLevel,
        behavior: p.behavior,
        camera_status: p.cameraStatus,
        notes: p.notes,
      })),
    }),
  })
}
```

### Weekly Templates (`/weekly-templates`)

```typescript
GET /weekly-templates
Query params:
  - cursor?: string
  - limit?: number
Response: {
  data: WeeklyTemplate[],
  next_cursor: string | null
}

POST /weekly-templates
Request: {
  name: string,
  teaching_assignment_id: string, // UUID
  day_of_week: number, // 1=Monday, 7=Sunday
  time_slot_id: string // UUID
}
Response: WeeklyTemplate
Status: 201 Created

DELETE /weekly-templates/{id}
Response: 204 No Content
```

**⚠️ Note:** L'endpoint `POST /weekly-templates/{id}/generate-sessions` ne semble PAS exister dans l'OpenAPI actuelle. Il faudra soit :
1. **Option A**: Générer les sessions côté frontend avec `SessionGenerator` service
2. **Option B**: Demander l'ajout de cet endpoint au backend Rust

**Frontend Integration Example (Option A):**
```typescript
// features/calendar/hooks/use-weekly-templates.ts
import { SessionGenerator } from '@/services/session-generator'

export function useWeeklyTemplates() {
  const generateSessions = async (
    templateId: string,
    startDate: Date,
    endDate: Date
  ) => {
    // 1. Fetch template
    const template = await fetchAPI(`/weekly-templates/${templateId}`)

    // 2. Generate sessions client-side
    const generator = new SessionGenerator()
    const sessions = generator.generateFromWeeklyTemplate(template, startDate, endDate)

    // 3. Create all sessions via API (bulk)
    const created = await Promise.all(
      sessions.map(session =>
        fetchAPI('/course-sessions', {
          method: 'POST',
          body: JSON.stringify(session),
        })
      )
    )

    return { sessionsCreated: created.length, sessions: created }
  }

  return { generateSessions }
}
```
---

## Frontend Components

### Organismes & molécules existantes à privilégier
- `CalendarWeekView`, `CalendarToolbar`, `CalendarWidget`, `UpcomingCoursesWidget` (`@/components/organisms`) — vues calendrier (hebdo + dashboard)
- `SessionForm`, `SessionCancelDialog`, `SessionMoveDialog` (`@/components/molecules`) — modales de création/annulation/déplacement
- `SessionsTimeline`, `SessionsList`, `SessionCardWithMove` (`@/components/organisms`) — timeline chronologique et détail de séance
- `StudentParticipationAccordion` (`@/components/molecules`) — saisie participations/comportement/caméra
- `ClassColorPicker` (`@/components/molecules`) — personnalisation des couleurs de classes

### Pages Next.js concernées
- `src/app/dashboard/calendrier/page.tsx` — orchestration calendrier + modales
- `src/app/dashboard/sessions/page.tsx` — timeline + saisie participations
- `src/app/dashboard/accueil/page.tsx` — widgets sessions du jour et calendrier compact

### Hooks existants à brancher à l'API
- `useCalendar`, `useSessionMoves`, `useClassColors` (`@/features/calendar`)
- `useSessionManagement` (`@/features/sessions`)
- `useClassSelection` (`@/contexts/class-selection-context`)
- `useModal`, `useSimpleModal`, `useAsyncOperation`, `useCRUDOperations` (`@/shared/hooks`)

---

## Stratégie UI & Intégration API

1. **Consommer directement les endpoints Souz**  
   - `GET/POST/PATCH/DELETE /course-sessions` pour le CRUD (filtrer par `class_id`, `subject_id`, `date`)  
   - `PATCH /course-sessions/{id}` pour replanifier, mettre à jour le statut ou le créneau ; `DELETE /course-sessions/{id}` pour annuler  
   - `GET /course-sessions/{id}/attendance` + `PUT /sessions/{session_id}/attendance` pour la consultation et la sauvegarde batch des participations  
   - `GET/POST /weekly-templates`, `DELETE /weekly-templates/{id}` pour la gestion des templates récurrents  
   - Tous les appels via `fetchAPI` avec `credentials: 'include'` + gestion d'erreur centralisée

2. **Composer avec les organismes existants**  
   - `CalendarWeekView` reste la vue principale (hebdo) : ne pas recréer de grille personnalisée.  
   - `SessionsTimeline` + `SessionsList` gèrent navigation et saisie ; brancher les données de `useSessionManagement`.  
   - `StudentParticipationAccordion` devient le point d'entrée unique pour la saisie ; utiliser ses callbacks pour persister.

3. **Maintenir le contexte classe global**  
   - `useClassSelection` fournit `selectedClassId` + `currentTeacherId` → passer ces IDs à chaque requête.  
   - État vide cohérent si aucune classe sélectionnée (comportement déjà présent).

4. **Auto-save & Optimistic UI**  
   - `useSessionManagement` déclenche un auto-save toutes les 10s (setInterval) → `PUT /sessions/{session_id}/attendance`.  
   - Utiliser `useAsyncOperation` pour spinner + toast "Sauvegarde automatique" existant.  
   - Optimistic update dans le hook puis rollback sur erreur.

5. **Instrumentation UX**  
   - Conserver skeletons `Suspense` existants.  
   - Loguer `performance.now()` au démarrage/fin de la saisie pour vérifier l'objectif ≤ 2 min.

---

## Implementation Guide

### Phase 1: Calendrier connecté (Jours 1-3)
1. Étendre `useCalendar` pour charger les sessions via `fetchAPI('/course-sessions?class_id=...')`, exposer `refresh`, `createSession`, `updateSession` (PATCH), `deleteSession`.  
2. Dans `src/app/dashboard/calendrier/page.tsx`, brancher les callbacks (création, reprogrammation, annulation, couleurs) sur ces méthodes.  
3. Relier `SessionForm`, `SessionCancelDialog`, `SessionMoveDialog` à `POST /course-sessions`, `PATCH /course-sessions/{id}` et `DELETE /course-sessions/{id}`.  
4. Mettre à jour `CalendarWeekView` pour consommer `calendarEvents` filtrés par `selectedClassId`.

### Phase 2: Timeline & participations (Jours 4-6)
1. Adapter `useSessionManagement` pour récupérer `GET /course-sessions/{id}` + `GET /sessions/{session_id}/attendance` (ou équivalent si les participations sont injectées dans la réponse).  
2. Fournir ces données à `SessionsTimeline`/`SessionsList` via props existantes.  
3. Gérer une file de mutations optimistes côté hook (mise à jour locale + `PUT /sessions/{session_id}/attendance`), déclenchée par `StudentParticipationAccordion`.  
4. Ajouter un auto-save 10s (+ toast succès/erreur via `useAsyncOperation`).

### Phase 3: Templates & génération (Jours 7-8)
1. Implémenter `useWeeklyTemplates` connecté à `GET/POST/DELETE /weekly-templates`.  
2. Réutiliser un formulaire existant (`SessionForm` en mode template ou composant dédié) alimenté par classes, matières, timeSlots API.  
3. Générer les sessions via endpoint dédié ou `SessionGenerator` + `POST /course-sessions` en batch.

### Phase 4: Finitions & livrables (Jour 9)
1. Propager les statistiques (taux présence, sessions à venir) vers `CalendarWidget` / `UpcomingCoursesWidget`.  
2. Consigner endpoints manquants dans `docs/missing-api-endpoints-report.md`.  
3. Vérifier accessibilité (navigation clavier, focus, toasts).

---


## Testing Approach

### Manual Testing Checklist

**Story 2.1: Calendar**
- [ ] Month view displays correctly
- [ ] Week view displays correctly
- [ ] Navigation prev/next works
- [ ] Sessions show in correct date cells
- [ ] Color coding by subject works
- [ ] Click session opens modal
- [ ] Session status badges display correctly

**Story 2.2: Templates**
- [ ] Can create weekly template
- [ ] Template appears in list
- [ ] Generate sessions creates correct count
- [ ] Generated sessions visible in calendar
- [ ] No duplicate sessions created

**Story 2.3: Manual Planning**
- [ ] Can create session from calendar day click
- [ ] Conflict detection works (real-time)
- [ ] Pause slots disabled in dropdown
- [ ] Session appears in calendar immediately
- [ ] Error shown for conflicts

**Story 2.4: Rescheduling**
- [ ] Can reschedule session to new date/time
- [ ] Conflict detection works
- [ ] Can mark session as cancelled
- [ ] Success notification displays
- [ ] Calendar updates immediately

**Story 2.5: Attendance (CRITICAL)**
- [ ] Participation tracker loads all students
- [ ] "Mark all present" bulk action works
- [ ] Auto-save indicator shows
- [ ] Keyboard navigation (Tab/Enter) works
- [ ] Can complete 30 students in ≤ 2 minutes
- [ ] Data persists after save

**Story 2.6: Session History**
- [ ] Can view completed session details
- [ ] All participation data visible
- [ ] Statistics calculated correctly
- [ ] Can edit participation retroactively
- [ ] Modification history visible

### E2E Test Scenarios

**Critical Path: Weekly Planning & Attendance**
```typescript
test('teacher can plan week and enter attendance', async ({ page }) => {
  // 1. Create weekly template
  await page.goto('/dashboard/gestion/templates')
  await page.click('text=Nouveau template')
  await page.fill('[name="name"]', 'Anglais 5A')
  await page.selectOption('[name="dayOfWeek"]', '1') // Monday
  await page.selectOption('[name="timeSlot"]', 'slot-9h')
  await page.click('text=Créer')

  // 2. Generate sessions for month
  await page.click('text=Générer sessions')
  await page.fill('[name="startDate"]', '2024-11-01')
  await page.fill('[name="endDate"]', '2024-11-30')
  await page.click('text=Générer')
  await expect(page.locator('text=4 sessions créées')).toBeVisible()

  // 3. Navigate to calendar
  await page.goto('/dashboard/calendrier')
  await expect(page.locator('[data-session-date="2024-11-04"]')).toBeVisible()

  // 4. Click on first session
  await page.click('[data-session-date="2024-11-04"]')
  await page.click('text=Saisir présences')

  // 5. Enter attendance (performance test)
  const startTime = Date.now()

  await page.click('text=Marquer tous présents')
  // Adjust 2 absents
  await page.uncheck('[data-student="student-1"] [name="isPresent"]')
  await page.uncheck('[data-student="student-2"] [name="isPresent"]')

  await page.click('text=Enregistrer et fermer')

  const duration = Date.now() - startTime
  expect(duration).toBeLessThan(120000) // < 2 minutes

  // Assert: Data saved
  await page.goto('/dashboard/sessions')
  await expect(page.locator('text=18/20 présents')).toBeVisible()
})
```

### Performance Testing

**Objective: Saisie 30 élèves ≤ 2 minutes**

Test protocol:
1. Start timer when participation tracker loads
2. Click "Mark all present"
3. Adjust 2-3 absences
4. Change participation levels for 5 students
5. Add notes for 2 students
6. Click "Save and close"
7. Stop timer

**Target: 120 seconds maximum**

Optimization strategies if target not met:
- Reduce animations
- Optimize re-renders (React.memo)
- Debounce auto-save
- Virtual scrolling for >50 students

---

## Dependencies

### NPM Packages
```json
{
  "date-fns": "^2.30.0",
  "react-hook-form": "^7.49.0",
  "zod": "^3.22.0"
}
```

### Backend APIs
- Existing `/course-sessions` endpoints
- Existing `/time-slots` endpoints
- Existing `/weekly-templates` endpoints
- Existing `/attendance` endpoints

---

## Notes

**Critical Path:**
Calendar UI → Templates → Session Planning → Attendance Entry

**Performance Critical:**
- Attendance entry must be ≤ 2 minutes for 30 students
- Auto-save must be reliable (no data loss)
- Keyboard navigation essential for speed

**Blockers:**
- Epic 1 (Classes, Students, Teaching Assignments) must complete first
- Time slots must be configured before planning sessions

**Future Enhancements:**
- Drag-and-drop rescheduling in calendar
- Attendance patterns (copy from previous session)
- Bulk session operations (cancel multiple sessions)

---

**Document Status:** ✅ Ready for Implementation
**Generated:** 2025-10-14
**Epic Timeline:** Sprint 3-4 (3-4 weeks)
