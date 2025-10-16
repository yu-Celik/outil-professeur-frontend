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
7. [Implementation Guide](#implementation-guide)
8. [Testing Approach](#testing-approach)

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
├── mocks/
│   ├── mock-time-slots.ts
│   ├── mock-weekly-templates.ts
│   └── index.ts
└── index.ts
```

### Feature Module: `sessions`

```
/src/features/sessions/
├── hooks/
│   ├── use-dashboard-sessions.ts     # Session management hooks
│   └── index.ts
├── mocks/
│   ├── mock-sessions.ts
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

### Organisms (To Create)

#### `calendar-grid`
**Purpose:** Monthly/weekly calendar view with sessions
**Props:**
```typescript
interface CalendarGridProps {
  sessions: CourseSession[]
  view: 'month' | 'week'
  currentDate: Date
  onDateChange: (date: Date) => void
  onSessionClick: (session: CourseSession) => void
  onDayClick: (date: Date) => void
}
```

#### `calendar-header`
**Purpose:** Navigation controls and view toggle
**Props:**
```typescript
interface CalendarHeaderProps {
  currentDate: Date
  view: 'month' | 'week'
  onViewChange: (view: 'month' | 'week') => void
  onNavigate: (direction: 'prev' | 'next') => void
}
```

#### `session-card`
**Purpose:** Session display in calendar cell
**Props:**
```typescript
interface SessionCardProps {
  session: CourseSession
  onClick: () => void
  compact?: boolean
}
```

#### `session-modal`
**Purpose:** Create/edit session dialog
**Props:**
```typescript
interface SessionModalProps {
  session?: CourseSession
  initialDate?: Date
  onSave: (data: CourseSessionInput) => Promise<void>
  onClose: () => void
}
```

#### `participation-tracker`
**Purpose:** Batch attendance entry table (CRITICAL COMPONENT)
**Props:**
```typescript
interface ParticipationTrackerProps {
  sessionId: string
  students: Student[]
  participations: StudentParticipation[]
  onSave: (participations: StudentParticipation[]) => Promise<void>
  autoSaveInterval?: number // default 10s
}
```

**Key Features:**
- Keyboard navigation (Tab, Enter)
- "Mark all present" bulk action
- Auto-save indicator
- Inline editing
- Optimistic UI updates

#### `weekly-template-form`
**Purpose:** Create recurring session template
**Props:**
```typescript
interface WeeklyTemplateFormProps {
  onSave: (template: WeeklyTemplateInput) => Promise<void>
  onGenerate: (templateId: string, startDate: Date, endDate: Date) => Promise<void>
}
```

---

## Implementation Guide

### Phase 1: Calendar Infrastructure (Days 1-3)

**Step 1: Create Calendar Feature Module**
```bash
mkdir -p src/features/calendar/hooks
mkdir -p src/features/calendar/mocks
```

**Step 2: Implement Calendar Hook**

`/src/features/calendar/hooks/use-calendar.ts`:
```typescript
import { useState, useMemo } from 'react'
import { CourseSession } from '@/types/uml-entities'

export function useCalendar(sessions: CourseSession[]) {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [view, setView] = useState<'month' | 'week'>('month')

  const displayedSessions = useMemo(() => {
    // Filter sessions for current view
    const startOfView = getStartOfView(currentDate, view)
    const endOfView = getEndOfView(currentDate, view)

    return sessions.filter(session =>
      session.sessionDate >= startOfView &&
      session.sessionDate <= endOfView
    )
  }, [sessions, currentDate, view])

  const navigate = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate)
    if (view === 'month') {
      newDate.setMonth(newDate.getMonth() + (direction === 'next' ? 1 : -1))
    } else {
      newDate.setDate(newDate.getDate() + (direction === 'next' ? 7 : -7))
    }
    setCurrentDate(newDate)
  }

  return {
    currentDate,
    view,
    displayedSessions,
    setView,
    navigate
  }
}
```

**Step 3: Create CalendarGrid Component**

`/src/components/organisms/calendar-grid/calendar-grid.tsx`:
```typescript
'use client'

export function CalendarGrid({
  sessions,
  view,
  currentDate,
  onDateChange,
  onSessionClick,
  onDayClick
}: CalendarGridProps) {
  const days = generateCalendarDays(currentDate, view)

  return (
    <div className="grid grid-cols-7 gap-2">
      {/* Header row */}
      {['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'].map(day => (
        <div key={day} className="text-center font-medium">
          {day}
        </div>
      ))}

      {/* Calendar cells */}
      {days.map(day => (
        <CalendarDay
          key={day.toISOString()}
          date={day}
          sessions={sessions.filter(s => isSameDay(s.sessionDate, day))}
          onDayClick={onDayClick}
          onSessionClick={onSessionClick}
        />
      ))}
    </div>
  )
}
```

### Phase 2: Session Management (Days 4-6)

**Step 1: Create Session Modal**

`/src/components/organisms/session-modal/session-modal.tsx`:
```typescript
'use client'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

const sessionSchema = z.object({
  sessionDate: z.date(),
  timeSlotId: z.string(),
  teachingAssignmentId: z.string(),
})

export function SessionModal({ session, initialDate, onSave, onClose }: SessionModalProps) {
  const form = useForm({
    resolver: zodResolver(sessionSchema),
    defaultValues: {
      sessionDate: initialDate || new Date(),
      timeSlotId: session?.timeSlotId || '',
      teachingAssignmentId: session?.teachingAssignmentId || '',
    }
  })

  const handleSubmit = async (data: z.infer<typeof sessionSchema>) => {
    try {
      await onSave(data)
      onClose()
    } catch (error) {
      // Handle conflict errors
    }
  }

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent>
        <form onSubmit={form.handleSubmit(handleSubmit)}>
          {/* Form fields */}
        </form>
      </DialogContent>
    </Dialog>
  )
}
```

**Step 2: Implement Conflict Detection**

`/src/services/session-makeup.ts`:
```typescript
export class SessionMakeupService {
  async detectConflicts(
    date: Date,
    timeSlotId: string,
    teachingAssignmentId: string,
    existingSessions: CourseSession[]
  ): Promise<CourseSession | null> {
    return existingSessions.find(session =>
      isSameDay(session.sessionDate, date) &&
      session.timeSlotId === timeSlotId
    ) || null
  }

  async findAvailableSlots(
    date: Date,
    teachingAssignmentId: string,
    timeSlots: TimeSlot[],
    existingSessions: CourseSession[]
  ): Promise<TimeSlot[]> {
    return timeSlots.filter(slot =>
      !slot.isPause &&
      !this.detectConflicts(date, slot.id, teachingAssignmentId, existingSessions)
    )
  }
}
```

### Phase 3: Weekly Templates & Generation (Days 7-9)

**Step 1: Implement Session Generator**

`/src/services/session-generator.ts`:
```typescript
export class SessionGenerator {
  generateFromWeeklyTemplate(
    template: WeeklyTemplate,
    startDate: Date,
    endDate: Date
  ): CourseSession[] {
    const sessions: CourseSession[] = []
    let currentDate = new Date(startDate)

    // Find first occurrence of the template's day of week
    while (currentDate.getDay() !== template.dayOfWeek) {
      currentDate.setDate(currentDate.getDate() + 1)
    }

    // Generate sessions weekly until end date
    while (currentDate <= endDate) {
      sessions.push({
        id: generateId(),
        sessionDate: new Date(currentDate),
        timeSlotId: template.timeSlotId,
        teachingAssignmentId: template.teachingAssignmentId,
        status: 'planned',
        notes: null,
        createdAt: new Date(),
        updatedAt: new Date()
      })

      currentDate.setDate(currentDate.getDate() + 7) // Next week
    }

    return sessions
  }
}
```

**Step 2: Create Template Form**

`/src/components/organisms/weekly-template-form/weekly-template-form.tsx`:
```typescript
export function WeeklyTemplateForm({ onSave, onGenerate }: WeeklyTemplateFormProps) {
  const [showGenerator, setShowGenerator] = useState(false)

  return (
    <div>
      {/* Template creation form */}
      <Form onSubmit={handleCreateTemplate}>
        {/* Fields: name, class, subject, day, time slot */}
      </Form>

      {showGenerator && (
        <Card className="mt-4">
          <CardHeader>Générer sessions depuis ce template</CardHeader>
          <CardContent>
            <Form onSubmit={handleGenerate}>
              <DatePicker label="Date début" name="startDate" />
              <DatePicker label="Date fin" name="endDate" />
              <Button type="submit">Générer</Button>
            </Form>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
```

### Phase 4: Participation Tracker (CRITICAL - Days 10-12)

**Step 1: Create Participation Tracker Component**

`/src/components/organisms/participation-tracker/participation-tracker.tsx`:
```typescript
'use client'
import { useState, useEffect, useCallback } from 'react'

export function ParticipationTracker({
  sessionId,
  students,
  participations: initialParticipations,
  onSave,
  autoSaveInterval = 10000
}: ParticipationTrackerProps) {
  const [participations, setParticipations] = useState(initialParticipations)
  const [isSaving, setIsSaving] = useState(false)
  const [lastSaved, setLastSaved] = useState<Date>()

  // Bulk action: Mark all present
  const markAllPresent = useCallback(() => {
    setParticipations(prev =>
      prev.map(p => ({ ...p, isPresent: true }))
    )
  }, [])

  // Auto-save every 10 seconds
  useEffect(() => {
    const interval = setInterval(async () => {
      if (participations.length > 0) {
        setIsSaving(true)
        try {
          await onSave(participations)
          setLastSaved(new Date())
        } finally {
          setIsSaving(false)
        }
      }
    }, autoSaveInterval)

    return () => clearInterval(interval)
  }, [participations, onSave, autoSaveInterval])

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === 'Enter') {
      // Focus next row
      const nextInput = document.querySelector(
        `[data-row="${index + 1}"] input`
      ) as HTMLInputElement
      nextInput?.focus()
    }
  }

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex items-center justify-between">
        <Button onClick={markAllPresent}>
          Marquer tous présents
        </Button>
        {isSaving && <span>Sauvegarde automatique...</span>}
        {lastSaved && (
          <span className="text-sm text-muted-foreground">
            Dernière sauvegarde : {formatDistanceToNow(lastSaved)}
          </span>
        )}
      </div>

      {/* Participation table */}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Élève</TableHead>
            <TableHead>Présent</TableHead>
            <TableHead>Participation</TableHead>
            <TableHead>Comportement</TableHead>
            <TableHead>Caméra</TableHead>
            <TableHead>Notes</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {students.map((student, index) => {
            const participation = participations.find(
              p => p.studentId === student.id
            )

            return (
              <TableRow key={student.id} data-row={index}>
                <TableCell>{student.fullName()}</TableCell>
                <TableCell>
                  <Checkbox
                    checked={participation?.isPresent}
                    onCheckedChange={(checked) => {
                      updateParticipation(student.id, { isPresent: checked })
                    }}
                  />
                </TableCell>
                <TableCell>
                  <Select
                    value={participation?.participationLevel || 'medium'}
                    onValueChange={(value) => {
                      updateParticipation(student.id, { participationLevel: value })
                    }}
                  >
                    <SelectOption value="low">Faible</SelectOption>
                    <SelectOption value="medium">Moyenne</SelectOption>
                    <SelectOption value="high">Élevée</SelectOption>
                  </Select>
                </TableCell>
                {/* Behavior, Camera, Notes columns */}
              </TableRow>
            )
          })}
        </TableBody>
      </Table>

      {/* Save button */}
      <Button onClick={async () => {
        await onSave(participations)
        // Navigate back
      }}>
        Enregistrer et fermer
      </Button>
    </div>
  )
}
```

**Step 2: Optimize for 2-Minute Target**

Performance optimizations:
- Debounce input updates
- Optimistic UI (immediate visual feedback)
- Keyboard shortcuts (Tab, Enter)
- Bulk actions (mark all present)
- Auto-save to prevent data loss

### Phase 5: Integration & Testing (Days 13-14)

**Day 13: Calendar Page Integration**
```typescript
// /src/app/dashboard/calendrier/page.tsx
export default function CalendrierPage() {
  const { sessions, createSession, updateSession } = useSessions()
  const { currentDate, view, displayedSessions, setView, navigate } = useCalendar(sessions)

  return (
    <div>
      <CalendarHeader
        currentDate={currentDate}
        view={view}
        onViewChange={setView}
        onNavigate={navigate}
      />
      <CalendarGrid
        sessions={displayedSessions}
        view={view}
        currentDate={currentDate}
        onSessionClick={handleSessionClick}
        onDayClick={handleDayClick}
      />
    </div>
  )
}
```

**Day 14: Performance Testing**
- Measure time to enter 30 students' attendance
- Target: ≤ 2 minutes
- Optimize if needed (reduce animations, optimize re-renders)

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
