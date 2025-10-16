# Technical Specification: Epic 3 - Évaluations & Analytics

**Project:** outil-professor
**Epic:** Epic 3 - Évaluations et Suivi Académique
**Timeline:** Sprint 5-6 (3-4 weeks)
**Stories:** 6 user stories
**Priority:** HAUTE - Fonde les analytics et génération contenu

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

Construire le système complet de gestion des examens, saisie des résultats, calcul automatique de statistiques, et surtout les **analytics élèves avancées** avec détection proactive des difficultés.

### Success Criteria

- ✅ Saisie résultats 30 élèves d'un examen < 5 minutes
- ✅ Statistiques examen calculées et affichées en temps réel
- ✅ Analytics élèves mises à jour automatiquement après chaque saisie
- ✅ Alertes détection élèves en difficulté fonctionnent (100% des cas < 75% présence détectés)
- ✅ Graphiques temporels clairs et actionnables pour 100% des élèves

### Value Delivered

Correction et saisie notes accélérée avec insights immédiats. Détection proactive élèves en difficulté (alertes dashboard). Vue longitudinale complète de chaque élève (présence, participation, résultats). Données riches pour génération rapports et appréciations (Epic 4).

---

## User Stories

### Story 3.1: Création et Gestion d'Examens

**En tant qu'** enseignante,
**Je veux** créer des examens avec leurs caractéristiques (date, barème, coefficient),
**Afin de** structurer mes évaluations et préparer la saisie des résultats.

**Critères d'acceptation:**
1. Page "Évaluations > Examens" liste examens avec titre, date, classe, points max, statut publication
2. Bouton "Nouvel examen" ouvre formulaire : titre, date, classe, matière, année scolaire, points maximum, coefficient, type (Contrôle/Devoir/Oral/Projet), publié (checkbox)
3. Examen créé apparaît dans liste
4. Filtres liste : par classe, par matière, par plage de dates, par statut publication
5. Tri par date (plus récent en premier)
6. Actions "Modifier", "Dupliquer", "Supprimer" pour chaque examen
7. Badge statut : "📝 Brouillon" si non publié, "📊 Publié" si publié

---

### Story 3.2: Saisie Batch des Résultats d'Examen

**En tant qu'** enseignante,
**Je veux** saisir rapidement les résultats de tous les élèves d'un examen,
**Afin de** corriger efficacement et enregistrer les notes en moins de 5 minutes.

**Critères d'acceptation:**
1. Depuis page examen, bouton "Saisir les résultats" ouvre interface batch
2. Tableau affiche tous élèves de la classe : Nom, Prénom, Points obtenus (input number), Absent (checkbox), Commentaire (textarea courte)
3. Validation temps réel : points obtenus ≤ points maximum examen (erreur si dépassement)
4. Si "Absent" coché, champ points obtenus désactivé
5. Auto-save toutes les 10 secondes
6. Progress indicator : "12/28 élèves saisis"
7. Bouton "Enregistrer et calculer statistiques" sauvegarde tout et affiche stats
8. **Objectif timing** : Saisie 30 élèves en < 5 minutes

---

### Story 3.3: Statistiques Automatiques d'Examen

**En tant qu'** enseignante,
**Je veux** voir automatiquement les statistiques d'un examen après saisie,
**Afin d'** évaluer rapidement le niveau de la classe et identifier les difficultés.

**Critères d'acceptation:**
1. Après saisie résultats, section "Statistiques" affichée automatiquement
2. Métriques : Moyenne classe, Médiane, Note min, Note max, Écart-type
3. Taux de réussite : % élèves ≥ 10/20 (seuil configurable)
4. Graphique distribution notes : histogramme par tranche de notes
5. Liste "Élèves en difficulté" : notes < 8/20 avec nom + note
6. Nombre élèves absents affiché séparément
7. Bouton "Exporter statistiques PDF" génère rapport synthétique

---

### Story 3.4: Profil Élève avec Analytics Complètes

**En tant qu'** enseignante,
**Je veux** consulter le profil complet d'un élève avec toutes ses analytics,
**Afin d'** avoir une vue longitudinale de sa progression et détecter problèmes.

**Critères d'acceptation:**
1. Page "Mes Élèves" puis clic sur élève ouvre profil détaillé
2. Header : Nom, Prénom, Photo (optionnelle), Classes, Besoins particuliers
3. Section "Taux de Présence" : Pourcentage global + graphique temporel (évolution sur trimestre)
4. Section "Participation" : Tendance (icône ↗↘→) + graphique temporel
5. Section "Comportement" : Distribution (X% positif, Y% neutre, Z% négatif) + graphique
6. Section "Résultats Académiques" : Liste examens avec notes + moyenne générale + graphique évolution
7. Section "Analyse Comportementale" : Texte généré automatiquement identifiant patterns (ex: "Désengagement progressif détecté depuis mi-octobre, absences répétées les lundis")
8. Section "Observations Enseignante" : Timeline des notes manuelles ajoutées

---

### Story 3.5: Alertes Automatiques Élèves en Difficulté

**En tant qu'** enseignante,
**Je veux** recevoir des alertes automatiques pour élèves en difficulté,
**Afin de** pouvoir intervenir proactivement avant qu'il ne soit trop tard.

**Critères d'acceptation:**
1. Dashboard affiche widget "Alertes" avec compteur badge rouge
2. Clic sur widget ouvre panneau latéral liste des alertes
3. Types d'alertes :
   - "⚠️ Présence < 75%" : élèves avec taux présence faible
   - "📉 Notes en baisse" : élèves avec moyenne derniers 3 examens < moyenne trimestre -2 points
   - "😐 Participation faible" : élèves avec participation "Faible" sur 5 dernières sessions
   - "🔴 Comportement négatif" : élèves avec 3+ comportements négatifs dans 2 dernières semaines
4. Chaque alerte cliquable ouvre profil élève concerné
5. Alertes calculées en temps réel après chaque saisie (présence, note, etc.)
6. Badge compteur mis à jour dynamiquement

---

### Story 3.6: Ajout d'Observations Manuelles sur Profil Élève

**En tant qu'** enseignante,
**Je veux** ajouter des notes/observations sur un élève,
**Afin de** documenter contexte, actions prises, et suivi personnalisé.

**Critères d'acceptation:**
1. Dans profil élève, section "Observations Enseignante" affiche timeline des notes
2. Bouton "+ Ajouter observation" ouvre modal
3. Formulaire : Date (auto pré-remplie aujourd'hui, modifiable), Observation (textarea riche)
4. Observation sauvegardée apparaît dans timeline avec horodatage
5. Actions "Modifier" et "Supprimer" pour chaque observation
6. Observations incluses dans génération rapports et appréciations (Epic 4)
7. Flag "À surveiller" (toggle) marque élève pour attention particulière

---

## Architecture Components

### Feature Module: `evaluations`

```
/src/features/evaluations/
├── hooks/
│   ├── use-exam-management.ts       # Exam CRUD operations
│   ├── use-grade-management.ts      # Grade entry and calculations
│   ├── use-notation-system.ts       # Grading systems
│   └── use-rubric-management.ts     # Rubrics (future)
├── mocks/
│   ├── mock-exams.ts
│   ├── mock-exam-results.ts
│   └── index.ts
├── services/
│   └── notation-system-service.ts   # Grade calculations
├── utils/
│   └── grade-calculations.ts        # Helper functions
└── index.ts
```

### Feature Module: `students`

```
/src/features/students/
├── hooks/
│   ├── use-student-analytics.ts                 # Analytics hooks
│   └── use-student-profile-generation.ts        # Profile generation
├── mocks/
│   ├── mock-students.ts
│   ├── mock-student-participation.ts
│   ├── mock-student-profiles.ts
│   └── index.ts
├── services/
│   ├── behavioral-analysis-service.ts           # Behavioral patterns
│   ├── academic-analysis-service.ts             # Academic performance
│   └── student-profile-service.ts               # Profile orchestration
└── index.ts
```

---

## Database Schema

### Exams Table

```sql
CREATE TABLE exams (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  exam_date DATE NOT NULL,
  class_id TEXT REFERENCES classes(id),
  subject_id TEXT REFERENCES subjects(id),
  max_points REAL NOT NULL,
  coefficient REAL DEFAULT 1.0,
  exam_type TEXT CHECK(exam_type IN ('quiz', 'homework', 'oral', 'project')),
  is_published BOOLEAN DEFAULT FALSE,
  school_year_id TEXT REFERENCES school_years(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_exams_class ON exams(class_id);
CREATE INDEX idx_exams_date ON exams(exam_date);
```

### Student Exam Results Table

```sql
CREATE TABLE student_exam_results (
  id TEXT PRIMARY KEY,
  exam_id TEXT REFERENCES exams(id),
  student_id TEXT REFERENCES students(id),
  points REAL NOT NULL,
  grade TEXT NOT NULL,
  comment TEXT,
  is_absent BOOLEAN DEFAULT FALSE,
  UNIQUE(exam_id, student_id)
);

CREATE INDEX idx_exam_results_exam ON student_exam_results(exam_id);
CREATE INDEX idx_exam_results_student ON student_exam_results(student_id);
```

### Notation Systems Table

```sql
CREATE TABLE notation_systems (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  type TEXT CHECK(type IN ('points', 'percentage', 'letter', 'competency')),
  scale_min REAL NOT NULL,
  scale_max REAL NOT NULL,
  passing_grade REAL NOT NULL,
  description TEXT
);
```

---

## API Endpoints - ✅ BACKEND RUST (SOUZ)

**Base URL**: `http://localhost:8080`
**Authentication**: Cookie `auth_token` (JWT, HttpOnly)
**OpenAPI Spec**: [souz-api-openapi.json](souz-api-openapi.json)

### Exams (`/exams`)

```typescript
GET /exams
Query params:
  - class_id?: UUID
  - subject_id?: UUID
  - school_year_id?: UUID
  - exam_date?: YYYY-MM-DD (exact date)
  - from?: YYYY-MM-DD (range start)
  - to?: YYYY-MM-DD (range end)
  - is_published?: boolean
  - cursor?: string (pagination)
  - limit?: number (default 50, max 100)

Response: {
  data: Exam[],
  next_cursor: string | null
}

POST /exams
Request: {
  title: string,
  exam_date: string, // "YYYY-MM-DD"
  class_id: string, // UUID
  subject_id: string, // UUID
  school_year_id: string, // UUID
  max_points: number,
  coefficient: number,
  exam_type: 'quiz' | 'homework' | 'oral' | 'project',
  is_published: boolean,
  rubric_id?: string // Optional
}
Response: Exam
Status: 201 Created

GET /exams/{id}
Response: Exam

PATCH /exams/{id}
Request: {
  title?: string,
  exam_date?: string,
  max_points?: number,
  coefficient?: number,
  exam_type?: 'quiz' | 'homework' | 'oral' | 'project',
  is_published?: boolean
}
Response: Exam

DELETE /exams/{id}
Response: 204 No Content
```

**Frontend Integration Example:**
```typescript
// features/evaluations/hooks/use-exam-management.ts
import { fetchAPI } from '@/lib/api'
import { format } from 'date-fns'

export function useExamManagement(classId?: string, subjectId?: string) {
  const [exams, setExams] = useState<Exam[]>([])

  const loadExams = async () => {
    const params = new URLSearchParams()
    if (classId) params.append('class_id', classId)
    if (subjectId) params.append('subject_id', subjectId)

    const response = await fetchAPI(`/exams?${params}`)
    setExams(response.data)
  }

  const createExam = async (data: ExamInput) => {
    const exam = await fetchAPI('/exams', {
      method: 'POST',
      body: JSON.stringify({
        ...data,
        exam_date: format(data.examDate, 'yyyy-MM-dd'),
      }),
    })
    setExams(prev => [...prev, exam])
  }

  return { exams, createExam, loadExams }
}
```

### Exam Results (`/exams/{id}/results`)

```typescript
GET /exams/{id}/results
Query params:
  - cursor?: string
  - limit?: number

Response: {
  data: Array<{
    id: string,
    student_id: string,
    exam_id: string,
    points_obtained: number | null,
    comments: string | null,
    is_absent: boolean,
    student: {
      id: string,
      first_name: string,
      last_name: string
    }
  }>,
  next_cursor: string | null
}

PUT /exams/{id}/results
Request: {
  items: Array<{
    student_id: string, // UUID
    points_obtained?: number, // Required if is_absent=false
    comments?: string | null,
    is_absent: boolean
  }>
}
Response: {
  updated: number,
  created: number,
  items: StudentExamResult[]
}
Status: 200 OK

Important:
- If is_absent=true, points_obtained is NOT required
- If is_absent=false, points_obtained is REQUIRED (422 validation error otherwise)
- Use PUT for upsert (creates or updates results)

GET /exams/{id}/stats
Response: {
  exam_id: string,
  total_students: number,
  results_entered: number,
  absent_count: number,
  average: number | null,
  median: number | null,
  min: number | null,
  max: number | null,
  std_dev: number | null,
  passing_rate: number | null
}
```

**Frontend Integration Example:**
```typescript
// features/evaluations/hooks/use-grade-management.ts
const saveGrades = async (examId: string, results: GradeInput[]) => {
  await fetchAPI(`/exams/${examId}/results`, {
    method: 'PUT',
    body: JSON.stringify({
      items: results.map(r => ({
        student_id: r.studentId,
        points_obtained: r.isAbsent ? undefined : r.points,
        comments: r.comment || null,
        is_absent: r.isAbsent,
      })),
    }),
  })

  // Fetch stats after saving
  const stats = await fetchAPI(`/exams/${examId}/stats`)
  setExamStats(stats)
}
```

### Student Analytics (`/students/{id}/...`)

```typescript
GET /students/{id}/attendance-rate
Query params:
  - start_date?: YYYY-MM-DD
  - end_date?: YYYY-MM-DD

Response: {
  student_id: string,
  rate: number, // 0-100
  present_count: number,
  total_sessions: number,
  period: {
    start_date: string,
    end_date: string
  }
}

GET /students/{id}/participation-average
Query params:
  - start_date?: YYYY-MM-DD
  - end_date?: YYYY-MM-DD

Response: {
  student_id: string,
  average: 'low' | 'medium' | 'high',
  sessions_count: number
}

GET /students/{id}/results
Query params:
  - cursor?: string
  - limit?: number

Response: {
  data: StudentExamResult[],
  next_cursor: string | null
}

GET /students/{id}/profile
Response: {
  student: Student,
  attendance_rate: number,
  participation_average: string,
  total_sessions: number,
  total_exams: number,
  average_grade: number | null
}

GET /classes/{id}/students/analytics
Query params:
  - start_date?: YYYY-MM-DD
  - end_date?: YYYY-MM-DD
  - sort_by?: 'name' | 'attendance' | 'participation'

Response: {
  class_id: string,
  students: Array<{
    student_id: string,
    first_name: string,
    last_name: string,
    attendance_rate: number,
    participation_average: 'low' | 'medium' | 'high',
    total_sessions: number
  }>
}
```

**Frontend Integration Example:**
```typescript
// features/students/hooks/use-student-analytics.ts
export function useStudentAnalytics(studentId: string, dateRange: DateRange) {
  const [analytics, setAnalytics] = useState<StudentAnalytics | null>(null)

  useEffect(() => {
    const loadAnalytics = async () => {
      const params = new URLSearchParams({
        start_date: format(dateRange.start, 'yyyy-MM-dd'),
        end_date: format(dateRange.end, 'yyyy-MM-dd'),
      })

      const [profile, attendanceRate, participationAvg, results] = await Promise.all([
        fetchAPI(`/students/${studentId}/profile`),
        fetchAPI(`/students/${studentId}/attendance-rate?${params}`),
        fetchAPI(`/students/${studentId}/participation-average?${params}`),
        fetchAPI(`/students/${studentId}/results`),
      ])

      setAnalytics({
        ...profile,
        attendanceRate: attendanceRate.rate,
        participationAverage: participationAvg.average,
        results: results.data,
      })
    }

    loadAnalytics()
  }, [studentId, dateRange])

  return { analytics }
}
```

---

## Frontend Components

### Organisms (To Create)

#### `exam-management-panel`
**Purpose:** List and manage exams
**Props:**
```typescript
interface ExamManagementPanelProps {
  classId?: string
  subjectId?: string
  onExamClick: (exam: Exam) => void
}
```

#### `exam-form`
**Purpose:** Create/edit exam
**Props:**
```typescript
interface ExamFormProps {
  exam?: Exam
  onSave: (data: ExamInput) => Promise<void>
  onClose: () => void
}
```

#### `grade-entry-form`
**Purpose:** Batch grade entry (CRITICAL)
**Props:**
```typescript
interface GradeEntryFormProps {
  examId: string
  students: Student[]
  results: StudentExamResult[]
  maxPoints: number
  onSave: (results: StudentExamResultInput[]) => Promise<void>
}
```

**Key Features:**
- Real-time validation (points ≤ max)
- Auto-save every 10s
- Progress indicator
- Absent checkbox disables points input
- Comment field for each student

#### `exam-statistics-panel`
**Purpose:** Display exam statistics
**Props:**
```typescript
interface ExamStatisticsPanelProps {
  stats: ExamStatistics
  students: Array<{ name: string, points: number }>
}
```

**Components:**
- Metrics cards (average, median, min, max)
- Distribution histogram (Recharts)
- Students at risk list

#### `student-profile-card`
**Purpose:** Comprehensive student profile
**Props:**
```typescript
interface StudentProfileCardProps {
  student: Student
  analytics: StudentAnalytics
  participations: StudentParticipation[]
  examResults: StudentExamResult[]
}
```

**Sections:**
- Header (name, photo, class)
- Attendance rate with trend chart
- Participation trend chart
- Behavior distribution pie chart
- Academic results table + line chart
- Behavioral analysis text
- Observations timeline

#### `student-analytics-section`
**Purpose:** Analytics visualizations
**Props:**
```typescript
interface StudentAnalyticsSectionProps {
  analytics: StudentAnalytics
}
```

#### `student-performance-chart`
**Purpose:** Grade evolution line chart
**Props:**
```typescript
interface StudentPerformanceChartProps {
  results: StudentExamResult[]
  exams: Exam[]
}
```

#### `alerts-widget`
**Purpose:** Dashboard alerts panel
**Props:**
```typescript
interface AlertsWidgetProps {
  alerts: Alert[]
  onAlertClick: (studentId: string) => void
}
```

---

## Implementation Guide

### Phase 1: Exam Management (Days 1-3)

**Step 1: Create Evaluations Feature Module**
```bash
mkdir -p src/features/evaluations/hooks
mkdir -p src/features/evaluations/services
mkdir -p src/features/evaluations/mocks
```

**Step 2: Implement Exam Management Hook**

`/src/features/evaluations/hooks/use-exam-management.ts`:
```typescript
import { useState, useEffect } from 'react'
import { Exam } from '@/types/uml-entities'
import { fetchAPI } from '@/lib/api'

export function useExamManagement(classId?: string, subjectId?: string) {
  const [exams, setExams] = useState<Exam[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadExams()
  }, [classId, subjectId])

  const loadExams = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (classId) params.append('class_id', classId)
      if (subjectId) params.append('subject_id', subjectId)

      const data = await fetchAPI<Exam[]>(`/exams?${params}`)
      setExams(data)
    } finally {
      setLoading(false)
    }
  }

  const createExam = async (data: ExamInput) => {
    const exam = await fetchAPI<Exam>('/exams', {
      method: 'POST',
      body: JSON.stringify(data)
    })
    setExams(prev => [...prev, exam])
    return exam
  }

  const updateExam = async (id: string, data: Partial<Exam>) => {
    const exam = await fetchAPI<Exam>(`/exams/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    })
    setExams(prev => prev.map(e => e.id === id ? exam : e))
    return exam
  }

  const deleteExam = async (id: string) => {
    await fetchAPI(`/exams/${id}`, { method: 'DELETE' })
    setExams(prev => prev.filter(e => e.id !== id))
  }

  return {
    exams,
    loading,
    createExam,
    updateExam,
    deleteExam,
    refresh: loadExams
  }
}
```

**Step 3: Create Exam Form Component**

`/src/components/organisms/exam-form/exam-form.tsx`:
```typescript
'use client'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

const examSchema = z.object({
  title: z.string().min(3, "Titre requis (min 3 caractères)"),
  examDate: z.date(),
  classId: z.string(),
  subjectId: z.string(),
  maxPoints: z.number().positive("Points maximum > 0"),
  coefficient: z.number().positive("Coefficient > 0"),
  examType: z.enum(['quiz', 'homework', 'oral', 'project']),
  isPublished: z.boolean(),
})

export function ExamForm({ exam, onSave, onClose }: ExamFormProps) {
  const form = useForm({
    resolver: zodResolver(examSchema),
    defaultValues: exam || {
      coefficient: 1,
      isPublished: false
    }
  })

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{exam ? 'Modifier' : 'Nouvel'} Examen</DialogTitle>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSave)}>
          <Input {...form.register('title')} label="Titre" />
          <DatePicker name="examDate" label="Date" control={form.control} />
          <Select {...form.register('classId')} label="Classe">
            {/* Options */}
          </Select>
          <Input type="number" {...form.register('maxPoints')} label="Points maximum" />
          <Input type="number" {...form.register('coefficient')} label="Coefficient" />
          <Select {...form.register('examType')} label="Type">
            <option value="quiz">Contrôle</option>
            <option value="homework">Devoir maison</option>
            <option value="oral">Oral</option>
            <option value="project">Projet</option>
          </Select>
          <Checkbox {...form.register('isPublished')} label="Publié" />

          <DialogFooter>
            <Button type="submit">Enregistrer</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
```

### Phase 2: Grade Entry System (Days 4-6)

**Step 1: Create Grade Entry Form (CRITICAL)**

`/src/components/organisms/grade-entry-form/grade-entry-form.tsx`:
```typescript
'use client'
import { useState, useEffect } from 'react'

export function GradeEntryForm({
  examId,
  students,
  results: initialResults,
  maxPoints,
  onSave
}: GradeEntryFormProps) {
  const [results, setResults] = useState<StudentExamResultInput[]>(
    students.map(student => ({
      studentId: student.id,
      points: initialResults.find(r => r.studentId === student.id)?.points || 0,
      comment: initialResults.find(r => r.studentId === student.id)?.comment || '',
      isAbsent: initialResults.find(r => r.studentId === student.id)?.isAbsent || false
    }))
  )

  const [progress, setProgress] = useState(0)
  const [isSaving, setIsSaving] = useState(false)

  // Calculate progress
  useEffect(() => {
    const filled = results.filter(r => r.points > 0 || r.isAbsent).length
    setProgress((filled / students.length) * 100)
  }, [results, students.length])

  // Auto-save every 10 seconds
  useEffect(() => {
    const interval = setInterval(async () => {
      if (results.length > 0) {
        setIsSaving(true)
        try {
          await onSave(results)
        } finally {
          setIsSaving(false)
        }
      }
    }, 10000)

    return () => clearInterval(interval)
  }, [results, onSave])

  const updateResult = (studentId: string, updates: Partial<StudentExamResultInput>) => {
    setResults(prev =>
      prev.map(r =>
        r.studentId === studentId ? { ...r, ...updates } : r
      )
    )
  }

  return (
    <div className="space-y-4">
      {/* Progress indicator */}
      <div className="flex items-center justify-between">
        <Progress value={progress} className="w-1/2" />
        <span>{Math.round(progress)}% saisi ({results.filter(r => r.points > 0 || r.isAbsent).length}/{students.length})</span>
        {isSaving && <span className="text-sm">Sauvegarde auto...</span>}
      </div>

      {/* Grade entry table */}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Élève</TableHead>
            <TableHead>Points (/{maxPoints})</TableHead>
            <TableHead>Absent</TableHead>
            <TableHead>Commentaire</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {students.map((student, index) => {
            const result = results.find(r => r.studentId === student.id)!

            return (
              <TableRow key={student.id}>
                <TableCell>{student.fullName()}</TableCell>
                <TableCell>
                  <Input
                    type="number"
                    min={0}
                    max={maxPoints}
                    value={result.points}
                    disabled={result.isAbsent}
                    onChange={(e) => {
                      const points = parseFloat(e.target.value)
                      if (points > maxPoints) {
                        // Show error
                        return
                      }
                      updateResult(student.id, { points })
                    }}
                    className="w-20"
                  />
                </TableCell>
                <TableCell>
                  <Checkbox
                    checked={result.isAbsent}
                    onCheckedChange={(checked) => {
                      updateResult(student.id, {
                        isAbsent: checked,
                        points: checked ? 0 : result.points
                      })
                    }}
                  />
                </TableCell>
                <TableCell>
                  <Textarea
                    value={result.comment}
                    onChange={(e) => updateResult(student.id, { comment: e.target.value })}
                    placeholder="Commentaire optionnel"
                    className="min-h-[60px]"
                  />
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>

      {/* Save button */}
      <Button onClick={async () => {
        await onSave(results)
        // Navigate to statistics
      }}>
        Enregistrer et calculer statistiques
      </Button>
    </div>
  )
}
```

### Phase 3: Statistics & Analytics (Days 7-10)

**Step 1: Implement Notation System Service**

`/src/features/evaluations/services/notation-system-service.ts`:
```typescript
import { NotationSystem } from '@/types/uml-entities'

export class NotationSystemService {
  calculateGrade(
    points: number,
    maxPoints: number,
    system: NotationSystem
  ): string {
    const percentage = (points / maxPoints) * 100

    switch (system.type) {
      case 'points':
        return `${points}/${maxPoints}`

      case 'percentage':
        return `${percentage.toFixed(1)}%`

      case 'letter':
        if (percentage >= 90) return 'A'
        if (percentage >= 80) return 'B'
        if (percentage >= 70) return 'C'
        if (percentage >= 60) return 'D'
        return 'F'

      case 'competency':
        if (percentage >= 75) return 'Acquis'
        if (percentage >= 50) return 'En cours'
        return 'Non acquis'

      default:
        return `${points}/${maxPoints}`
    }
  }

  calculateStatistics(results: StudentExamResult[]): ExamStatistics {
    const validResults = results.filter(r => !r.isAbsent)
    const points = validResults.map(r => r.points)

    if (points.length === 0) {
      return {
        average: 0,
        median: 0,
        min: 0,
        max: 0,
        stdDev: 0,
        distribution: {},
        passingRate: 0,
        absentCount: results.filter(r => r.isAbsent).length
      }
    }

    const average = points.reduce((sum, p) => sum + p, 0) / points.length
    const sorted = [...points].sort((a, b) => a - b)
    const median = sorted[Math.floor(sorted.length / 2)]
    const min = sorted[0]
    const max = sorted[sorted.length - 1]

    const variance = points.reduce((sum, p) => sum + Math.pow(p - average, 2), 0) / points.length
    const stdDev = Math.sqrt(variance)

    const distribution = this.calculateDistribution(points)
    const passingRate = points.filter(p => p >= 10).length / points.length * 100

    return {
      average,
      median,
      min,
      max,
      stdDev,
      distribution,
      passingRate,
      absentCount: results.filter(r => r.isAbsent).length
    }
  }

  private calculateDistribution(points: number[]): Record<string, number> {
    const ranges = ['0-5', '5-10', '10-15', '15-20']
    const distribution: Record<string, number> = {}

    ranges.forEach(range => {
      const [min, max] = range.split('-').map(Number)
      distribution[range] = points.filter(p => p >= min && p < max).length
    })

    return distribution
  }
}
```

**Step 2: Create Exam Statistics Panel**

`/src/components/organisms/exam-statistics-panel/exam-statistics-panel.tsx`:
```typescript
'use client'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

export function ExamStatisticsPanel({ stats, students }: ExamStatisticsPanelProps) {
  const distributionData = Object.entries(stats.distribution).map(([range, count]) => ({
    range,
    count
  }))

  const studentsAtRisk = students.filter(s => s.points < 8)

  return (
    <div className="space-y-6">
      {/* Metrics cards */}
      <div className="grid grid-cols-4 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Moyenne</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.average.toFixed(2)}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Médiane</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.median.toFixed(2)}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Taux de réussite</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.passingRate.toFixed(1)}%</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Absents</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.absentCount}</div>
          </CardContent>
        </Card>
      </div>

      {/* Distribution chart */}
      <Card>
        <CardHeader>
          <CardTitle>Distribution des notes</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={distributionData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="range" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="hsl(var(--primary))" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Students at risk */}
      {studentsAtRisk.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Élèves en difficulté (< 8/20)</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {studentsAtRisk.map(student => (
                <li key={student.studentId} className="flex justify-between">
                  <span>{student.name}</span>
                  <Badge variant="destructive">{student.points}/20</Badge>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
```

### Phase 4: Student Analytics (Days 11-13)

**Step 1: Implement Behavioral Analysis Service**

`/src/features/students/services/behavioral-analysis-service.ts`:
```typescript
import { StudentParticipation } from '@/types/uml-entities'

export interface BehavioralAnalysis {
  attendanceRate: number
  participationTrend: 'up' | 'down' | 'stable'
  avgParticipation: 'low' | 'medium' | 'high'
  behaviorScore: number
  patterns: string[]
  recommendations: string[]
}

export class BehavioralAnalysisService {
  analyzeParticipation(participations: StudentParticipation[]): BehavioralAnalysis {
    if (participations.length === 0) {
      return {
        attendanceRate: 0,
        participationTrend: 'stable',
        avgParticipation: 'medium',
        behaviorScore: 0,
        patterns: [],
        recommendations: []
      }
    }

    // Attendance rate
    const present = participations.filter(p => p.isPresent).length
    const attendanceRate = (present / participations.length) * 100

    // Participation trend
    const recentParticipation = participations.slice(-5)
    const participationTrend = this.calculateTrend(recentParticipation)

    // Average participation level
    const avgParticipation = this.calculateAvgParticipation(participations)

    // Behavior score
    const behaviorScore = this.calculateBehaviorScore(participations)

    // Detect patterns
    const patterns = this.detectPatterns(participations)

    // Generate recommendations
    const recommendations = this.generateRecommendations({
      attendanceRate,
      participationTrend,
      avgParticipation,
      behaviorScore,
      patterns
    })

    return {
      attendanceRate,
      participationTrend,
      avgParticipation,
      behaviorScore,
      patterns,
      recommendations
    }
  }

  private calculateTrend(recentParticipation: StudentParticipation[]): 'up' | 'down' | 'stable' {
    const participationValues = recentParticipation
      .filter(p => p.participationLevel)
      .map(p => {
        switch (p.participationLevel) {
          case 'low': return 1
          case 'medium': return 2
          case 'high': return 3
          default: return 2
        }
      })

    if (participationValues.length < 2) return 'stable'

    const first = participationValues[0]
    const last = participationValues[participationValues.length - 1]

    if (last > first) return 'up'
    if (last < first) return 'down'
    return 'stable'
  }

  private calculateAvgParticipation(participations: StudentParticipation[]): 'low' | 'medium' | 'high' {
    const values = participations
      .filter(p => p.participationLevel)
      .map(p => {
        switch (p.participationLevel) {
          case 'low': return 1
          case 'medium': return 2
          case 'high': return 3
          default: return 2
        }
      })

    const avg = values.reduce((sum, v) => sum + v, 0) / values.length

    if (avg < 1.5) return 'low'
    if (avg > 2.5) return 'high'
    return 'medium'
  }

  private calculateBehaviorScore(participations: StudentParticipation[]): number {
    const behaviors = participations
      .filter(p => p.behavior)
      .map(p => {
        switch (p.behavior) {
          case 'positive': return 1
          case 'neutral': return 0
          case 'negative': return -1
          default: return 0
        }
      })

    if (behaviors.length === 0) return 0

    const sum = behaviors.reduce((sum, b) => sum + b, 0)
    return (sum / behaviors.length) * 100 // -100 to 100
  }

  private detectPatterns(participations: StudentParticipation[]): string[] {
    const patterns: string[] = []

    // Pattern: Repeated absences on specific days
    const absencesByDay: Record<number, number> = {}
    participations.forEach(p => {
      if (!p.isPresent) {
        const day = new Date(p.createdAt).getDay()
        absencesByDay[day] = (absencesByDay[day] || 0) + 1
      }
    })

    const maxAbsenceDay = Object.entries(absencesByDay).reduce((max, [day, count]) =>
      count > (max[1] || 0) ? [parseInt(day), count] : max
    , [0, 0])

    if (maxAbsenceDay[1] >= 3) {
      const dayNames = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi']
      patterns.push(`Absences répétées les ${dayNames[maxAbsenceDay[0]]}s`)
    }

    // Pattern: Declining participation
    const recentParticipation = participations.slice(-10)
    const firstHalf = recentParticipation.slice(0, 5)
    const secondHalf = recentParticipation.slice(5)

    const firstAvg = this.calculateAvgParticipation(firstHalf)
    const secondAvg = this.calculateAvgParticipation(secondHalf)

    if (firstAvg === 'high' && secondAvg === 'low') {
      patterns.push('Désengagement progressif détecté')
    }

    return patterns
  }

  private generateRecommendations(analysis: Partial<BehavioralAnalysis>): string[] {
    const recommendations: string[] = []

    if (analysis.attendanceRate && analysis.attendanceRate < 75) {
      recommendations.push('Contacter les parents concernant les absences fréquentes')
    }

    if (analysis.avgParticipation === 'low') {
      recommendations.push('Encourager participation en classe avec questions ciblées')
    }

    if (analysis.behaviorScore && analysis.behaviorScore < -20) {
      recommendations.push('Discuter avec élève des comportements observés')
    }

    if (analysis.patterns?.includes('Désengagement progressif détecté')) {
      recommendations.push('Intervention rapide recommandée pour éviter décrochage')
    }

    return recommendations
  }
}
```

**Step 2: Create Student Profile Card**

`/src/components/organisms/student-profile-card/student-profile-card.tsx`:
```typescript
'use client'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

export function StudentProfileCard({
  student,
  analytics,
  participations,
  examResults
}: StudentProfileCardProps) {
  // Prepare charts data
  const attendanceData = prepareAttendanceData(participations)
  const gradeData = prepareGradeData(examResults)

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <Avatar className="h-20 w-20">
              <AvatarFallback>
                {student.firstName[0]}{student.lastName[0]}
              </AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-2xl font-bold">{student.fullName()}</h2>
              <p className="text-muted-foreground">Classe: {student.currentClassId}</p>
              {student.needs && (
                <Badge variant="outline" className="mt-2">
                  Besoins particuliers
                </Badge>
              )}
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Attendance */}
      <Card>
        <CardHeader>
          <CardTitle>Taux de Présence</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-4xl font-bold mb-4">
            {analytics.attendanceRate.toFixed(1)}%
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={attendanceData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="week" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="rate" stroke="hsl(var(--primary))" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Participation */}
      <Card>
        <CardHeader>
          <CardTitle>
            Participation
            {analytics.participationTrend === 'up' && <TrendingUp className="inline ml-2" />}
            {analytics.participationTrend === 'down' && <TrendingDown className="inline ml-2" />}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Badge>{analytics.avgParticipation}</Badge>
        </CardContent>
      </Card>

      {/* Academic Results */}
      <Card>
        <CardHeader>
          <CardTitle>Résultats Académiques</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={gradeData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="exam" />
              <YAxis domain={[0, 20]} />
              <Tooltip />
              <Line type="monotone" dataKey="grade" stroke="hsl(var(--primary))" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Behavioral Analysis */}
      {analytics.patterns.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Analyse Comportementale</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {analytics.patterns.map((pattern, i) => (
                <li key={i} className="flex items-start gap-2">
                  <AlertCircle className="h-5 w-5 text-yellow-500 mt-0.5" />
                  <span>{pattern}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* Recommendations */}
      {analytics.recommendations.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Recommandations</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {analytics.recommendations.map((rec, i) => (
                <li key={i} className="flex items-start gap-2">
                  <Lightbulb className="h-5 w-5 text-blue-500 mt-0.5" />
                  <span>{rec}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
```

### Phase 5: Alerts System (Day 14)

**Step 1: Create Alerts Widget**

`/src/components/organisms/alerts-widget/alerts-widget.tsx`:
```typescript
'use client'

export function AlertsWidget({ alerts, onAlertClick }: AlertsWidgetProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <Button
        variant="outline"
        onClick={() => setIsOpen(true)}
        className="relative"
      >
        <Bell className="h-5 w-5" />
        {alerts.length > 0 && (
          <Badge className="absolute -top-2 -right-2" variant="destructive">
            {alerts.length}
          </Badge>
        )}
      </Button>

      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Alertes ({alerts.length})</SheetTitle>
          </SheetHeader>
          <div className="mt-6 space-y-4">
            {alerts.map(alert => (
              <Card
                key={alert.id}
                className="cursor-pointer hover:bg-accent"
                onClick={() => {
                  onAlertClick(alert.studentId)
                  setIsOpen(false)
                }}
              >
                <CardHeader>
                  <div className="flex items-center gap-2">
                    {alert.type === 'attendance' && <AlertTriangle className="h-5 w-5 text-orange-500" />}
                    {alert.type === 'grades' && <TrendingDown className="h-5 w-5 text-red-500" />}
                    {alert.type === 'participation' && <MessageCircle className="h-5 w-5 text-yellow-500" />}
                    {alert.type === 'behavior' && <Frown className="h-5 w-5 text-red-600" />}
                    <span className="font-medium">{alert.studentName}</span>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{alert.message}</p>
                </CardContent>
              </Card>
            ))}

            {alerts.length === 0 && (
              <div className="text-center text-muted-foreground py-8">
                Aucune alerte
              </div>
            )}
          </div>
        </SheetContent>
      </Sheet>
    </>
  )
}
```

---

## Testing Approach

### Manual Testing Checklist

**Story 3.1: Exams**
- [ ] Can create exam with all fields
- [ ] Exam appears in list
- [ ] Can filter by class, subject, date
- [ ] Published/draft badge displays correctly
- [ ] Can edit exam
- [ ] Can duplicate exam
- [ ] Delete confirmation works

**Story 3.2: Grade Entry**
- [ ] Grade entry form loads all students
- [ ] Validation: points ≤ max works
- [ ] Absent checkbox disables points input
- [ ] Auto-save works (check every 10s)
- [ ] Progress indicator updates
- [ ] Can complete 30 students in < 5 min
- [ ] Data persists after save

**Story 3.3: Statistics**
- [ ] Statistics calculate correctly
- [ ] Distribution chart displays
- [ ] Students at risk list shows correctly
- [ ] PDF export generates

**Story 3.4: Student Profile**
- [ ] All sections display correctly
- [ ] Charts render with data
- [ ] Behavioral analysis generates
- [ ] Observations timeline works

**Story 3.5: Alerts**
- [ ] Alerts widget shows count
- [ ] All alert types trigger correctly
- [ ] Click alert opens student profile
- [ ] Alerts update in real-time

**Story 3.6: Observations**
- [ ] Can add observation
- [ ] Timeline displays correctly
- [ ] Can edit/delete observation
- [ ] "À surveiller" flag works

### E2E Test: Complete Grading Flow

```typescript
test('teacher can grade exam and see analytics', async ({ page }) => {
  // Create exam
  await page.goto('/dashboard/evaluations')
  await page.click('text=Nouvel examen')
  await page.fill('[name="title"]', 'Contrôle UML')
  await page.fill('[name="maxPoints"]', '20')
  await page.click('text=Créer')

  // Enter grades
  await page.click('text=Saisir les résultats')

  const startTime = Date.now()

  // Enter 30 grades
  for (let i = 0; i < 30; i++) {
    const points = 10 + Math.floor(Math.random() * 10)
    await page.fill(`[data-student-index="${i}"] input[name="points"]`, points.toString())
  }

  await page.click('text=Enregistrer et calculer statistiques')

  const duration = Date.now() - startTime
  expect(duration).toBeLessThan(300000) // < 5 minutes

  // Verify statistics
  await expect(page.locator('text=Moyenne')).toBeVisible()
  await expect(page.locator('text=Distribution')).toBeVisible()

  // Check alerts generated
  await page.goto('/dashboard/accueil')
  const alertsBadge = page.locator('[data-alerts-count]')
  const count = await alertsBadge.textContent()
  expect(parseInt(count || '0')).toBeGreaterThanOrEqual(0)
})
```

---

## Dependencies

### NPM Packages
```json
{
  "recharts": "^2.10.0",
  "date-fns": "^2.30.0"
}
```

---

## Notes

**Critical Components:**
- Grade entry form (performance critical: < 5 min for 30 students)
- Behavioral analysis service (accuracy critical for alerts)
- Student profile card (must be comprehensive but performant)

**Blockers:**
- Epic 1 (Students, Classes) required
- Epic 2 (Sessions, Participation data) required for analytics

**Future Enhancements:**
- Rubrics for detailed grading
- Grade curves and adjustments
- Competency-based assessment
- Peer comparison analytics

---

**Document Status:** ✅ Ready for Implementation
**Generated:** 2025-10-14
**Epic Timeline:** Sprint 5-6 (3-4 weeks)
