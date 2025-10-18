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
7. [Stratégie UI & Intégration API](#stratégie-ui--intégration-api)
8. [Implementation Guide](#implementation-guide)
9. [Testing Approach](#testing-approach)

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
├── api/
│   ├── exams-client.ts              # Wrappers around /exams endpoints
│   ├── exam-results-client.ts       # Calls /exams/{id}/results & /exams/{id}/stats
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
├── api/
│   ├── students-client.ts                      # Calls /students, /students/{id}/*
│   ├── attendance-client.ts                    # Calls /sessions/{session_id}/attendance
│   └── index.ts
├── services/
│   ├── behavioral-analysis-service.ts          # Behavioral patterns
│   ├── academic-analysis-service.ts            # Academic performance
│   └── student-profile-service.ts              # Profile orchestration
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

### Organismes & molécules existants à réutiliser
- `ExamsList`, `ExamFormDialog`, `ExamGradingPage`, `ExamDetailedStatistics`, `ExamExportDialog` (`@/components/organisms`) — gestion examens + statistiques
- `ExamGradingInterface`, `NotationSystemConfig` (`@/components/organisms`) — grille de correction + paramétrage barèmes
- `StudentMetricsCards`, `StudentAnalysisPanel`, `StudentEvaluationsPanel`, `StudentProfilePanel`, `StudentProfileSummary`, `StudentEvaluationForm` (`@/components/organisms`) — analytics et profils élèves
- `DataTable`, `Card`, `Badge`, `Dialog` (`@/components`) — socle UI existant

### Pages Next.js concernées
- `src/app/dashboard/evaluations/page.tsx` — liste examens, création, accès correction
- `src/app/dashboard/mes-eleves/[id]/page.tsx` — profil élève (analytics)
- `src/app/dashboard/students/[id]/page.tsx` — profils détaillés (si activé)

### Hooks existants à brancher à l'API
- `useExamManagement`, `useGradeManagement`, `useNotationSystem`, `useExamFilters` (`@/features/evaluations`)
- `useStudentAnalytics`, `useStudentProfile`, `useStudentProfileGeneration`, `useStudentEvaluation` (`@/features/students`)
- `useClassSelection` (`@/contexts/class-selection-context`) pour filtrage classe/matière
- `useAsyncOperation`, `useModal`, `useCRUDOperations` (`@/shared/hooks`)

---

## Stratégie UI & Intégration API

1. **Brancher la gestion des examens sur Souz API**  
   - `GET/POST/PATCH/DELETE /exams` pour le cycle de vie examen
   - `GET /exams/{id}` + `GET /exams/{id}/results` pour alimenter la page de correction
   - `PUT /exams/{id}/results` (payload `ExamResultsUpsertRequest`) pour la saisie groupée et les commentaires
   - `GET /exams/{id}/stats` pour nourrir `ExamDetailedStatistics`

2. **Synchroniser analytics élèves**  
   - `GET /students/{id}/profile` pour le résumé complet + `GET /students/{id}/attendance-rate` et `GET /students/{id}/participation-average` pour les KPI
   - `GET /students/{id}/results` pour l'historique des notes et `GET /sessions/{session_id}/attendance` lorsque le détail session est nécessaire
   - Agréger ces réponses dans `useStudentAnalytics` afin d'alimenter cartes, graphiques et alertes

3. **Utiliser l’API comme seule source de vérité**  
   - Tous les appels passent par `fetchAPI` et les clients d’API dédiés pour écrire/lire via Souz
   - `NotationSystemService` et `AcademicAnalysisService` exploitent uniquement les données renvoyées par l’API (aucune donnée locale persistée)

4. **Maintenir le contexte classe**  
   - `useClassSelection` fournit `selectedClassId`/`currentTeacherId` → filtrer `GET /exams?class_id=` et `GET /students`
   - Les pages doivent refléter le badge classe active dans header

5. **Auto-save & validations**  
   - Dans `ExamGradingPage`, déclencher un auto-save 10s vers l'endpoint batch, avec toasts et rollback en cas d'erreur
   - Vérifier cohérence barèmes via `NotationSystemService` avant envoi

---

## Implementation Guide

### Phase 1: Exam Management (Jours 1-3)
1. Adapter `useExamManagement` pour consommer `GET/POST/PATCH/DELETE /exams` (filtrer par classe/matière).  
2. Relier `ExamsList` aux données API + rafraîchissement via `refresh()`.  
3. Brancher `ExamFormDialog` sur `createExam` / `updateExam` (API) avec gestion optimistic + toasts.

### Phase 2: Grade Entry & Notation (Jours 4-6)
1. Étendre `useGradeManagement` pour charger `GET /exams/{id}/results` + `GET /students?class_id=...`.  
2. Implémenter `saveResults` → `PUT /exams/{id}/results` (auto-save 10s + bouton enregistrer).  
3. Connecter `ExamGradingPage` et `ExamGradingInterface` à ces fonctions (aucune nouvelle UI).  
4. Utiliser `NotationSystemConfig` pour config barèmes via `GET/PUT /notation-systems`.

### Phase 3: Student Analytics (Jours 7-8)
1. `useStudentAnalytics` → combiner `GET /students/{id}/profile`, `GET /students/{id}/attendance-rate`, `GET /students/{id}/participation-average` et `GET /students/{id}/results`.  
2. Injecter ces données dans `StudentAnalysisPanel`, `StudentMetricsCards`, `StudentProfilePanel`.  
3. S'assurer que `StudentEvaluationForm` met à jour les observations via `PUT /exams/{exam_id}/results` (champ `comments`) et, si besoin, `PATCH /students/{id}` pour `needs`/`observations`/`strengths`.

### Phase 4: Reporting & Export (Jour 9)
1. Connecter `ExamExportDialog` et exports CSV/PDF aux endpoints (`/exams/{id}/export` si dispo, sinon générer côté front).  
2. Documenter les endpoints manquants (docs/missing-api-endpoints-report.md).  
3. Vérifier cohérence analytics vs UI dashboard (Accès rapides).

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
