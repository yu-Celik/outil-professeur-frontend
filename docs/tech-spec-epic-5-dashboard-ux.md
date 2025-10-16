# Technical Specification: Epic 5 - Dashboard & UX

**Project:** outil-professor
**Epic:** Epic 5 - Dashboard, Expérience Utilisateur et Fiabilité
**Timeline:** Transversal Sprint 1-9 + Sprint 10 polish (1-2 semaines finales)
**Stories:** 6 user stories
**Priority:** MOYENNE initialement, CRITIQUE en fin de projet

---

## Table of Contents

1. [Epic Overview](#epic-overview)
2. [User Stories](#user-stories)
3. [Architecture Components](#architecture-components)
4. [Frontend Components](#frontend-components)
5. [Implementation Guide](#implementation-guide)
6. [Performance Optimization](#performance-optimization)
7. [Testing Approach](#testing-approach)

---

## Epic Overview

### Objective

Construire l'interface unifiée (dashboard), garantir une expérience utilisateur fluide et cohérente à travers toute l'application, et implémenter les mécanismes de fiabilité mission-critical (auto-save, backup, récupération).

### Success Criteria

- ✅ Dashboard charge en < 2 secondes avec toutes statistiques
- ✅ Navigation entre pages < 300ms (perception instantanée)
- ✅ Sélection contexte fonctionne, filtrage automatique à travers app
- ✅ 0 perte de données pendant tout trimestre MVP (RPO=0 validé)
- ✅ Export backup hebdomadaire automatique fonctionne, récupération testée
- ✅ NPS utilisatrice ≥ 40 après premier trimestre complet d'utilisation

### Value Delivered

Point d'entrée unique et intuitif pour toute l'application. Expérience fluide et efficace alignée sur les 10 UX principles. Confiance absolue dans la persistance et sécurité des données. Adoption facilitée par design centré utilisateur non-technique.

---

## User Stories

### Story 5.1: Tableau de Bord Enseignant

**En tant qu'** enseignante,
**Je veux** accéder à un tableau de bord central avec vue d'ensemble,
**Afin de** démarrer ma journée et accéder rapidement aux actions importantes.

**Critères d'acceptation:**
1. Après login, redirection automatique vers Dashboard
2. Header dashboard : Message personnalisé "Bonjour Marie, bienvenue sur outil-professor"
3. Widget "Sessions Aujourd'hui" : Liste sessions du jour avec heure, classe, matière, statut
4. Widget "Sessions À Venir Cette Semaine" : Prochaines 5 sessions avec dates
5. Widget "Alertes" : Badge compteur + liste élèves nécessitant attention
6. Widget "Statistiques Rapides" : Taux présence moyen semaine, nombre examens à corriger, rapports en attente
7. Widget "Accès Rapides" : Boutons vers actions fréquentes (Saisir présences, Créer session, Voir calendrier, Générer rapports)
8. Chargement dashboard complet en < 2 secondes (NFR)

---

### Story 5.2: Sélection Contexte Classe/Matière Globale

**En tant qu'** enseignante,
**Je veux** sélectionner un contexte classe/matière actif qui filtre toute l'application,
**Afin de** me concentrer sur un groupe spécifique sans naviguer constamment.

**Critères d'acceptation:**
1. Header application affiche ClassSelectorDropdown toujours visible
2. Dropdown double : Classe (dropdown 1) + Matière (dropdown 2 filtré selon classe)
3. Sélection persiste entre sessions (localStorage)
4. Changement contexte recharge données filtrées dans page actuelle
5. Pages concernées auto-filtrées : Sessions, Présences, Examens, Élèves de la classe
6. Indicateur visuel contexte actif : badge dans header "5ème A - Anglais"
7. Option "Toutes classes" désactive filtre (vue globale)

---

### Story 5.3: Navigation Fluide et Breadcrumb

**En tant qu'** enseignante,
**Je veux** naviguer facilement entre pages et savoir où je suis,
**Afin de** ne jamais me perdre dans l'application.

**Critères d'acceptation:**
1. Sidebar gauche toujours visible avec sections : Accueil, Calendrier, Sessions, Mes Élèves, Évaluations, Appréciations, Gestion, Paramètres
2. Item menu actif visuellement distinct (couleur primaire, fond)
3. Breadcrumb en haut de page : Dashboard > Sessions > Session du 15/11 > Présences
4. Breadcrumb cliquable pour navigation rapide niveau supérieur
5. Navigation page ≤ 300ms (perception instantanée - NFR)
6. Transition fade subtile entre pages pour fluidité
7. Raccourcis clavier : Alt+1 Dashboard, Alt+2 Calendrier, Alt+3 Sessions, etc.

---

### Story 5.4: Export et Sauvegarde Manuelle Données

**En tant qu'** enseignante,
**Je veux** exporter et sauvegarder manuellement toutes mes données,
**Afin de** créer des backups de sécurité et éviter perte de données.

**Critères d'acceptation:**
1. Page "Paramètres > Sauvegarde et Export"
2. Section "Export Complet" : Bouton "Exporter toutes les données (JSON)" télécharge archive complète
3. Archive contient : classes, élèves, sessions, présences, examens, résultats, appréciations en JSON structuré
4. Nom fichier : `outil-professor-backup-2024-11-15.zip`
5. Section "Export Sélectif" : Checkboxes par type données, bouton "Exporter sélection"
6. Section "Historique Exports" : Liste 10 derniers exports avec date, taille, bouton re-télécharger
7. Confirmation post-export : "Backup créé avec succès : 245 KB, 1500 enregistrements"

---

### Story 5.5: Sauvegarde Automatique et Récupération (Mission-Critical)

**En tant qu'** enseignante,
**Je veux** que mes données soient sauvegardées automatiquement sans action de ma part,
**Afin de** ne jamais perdre mon travail même en cas de crash.

**Critères d'acceptation:**
1. Auto-save toutes les 15 minutes en arrière-plan (silencieux)
2. Indicateur header : "Dernière sauvegarde : il y a 3 minutes" (mise à jour dynamique)
3. Lors saisie formulaires (présences, notes), auto-save toutes les 10 secondes
4. En cas échec auto-save, notification alerte : "⚠️ Échec sauvegarde, vérifiez connexion" + retry automatique
5. Backup hebdomadaire automatique (dimanche 2h du matin si app ouverte, ou au prochain démarrage)
6. Page "Paramètres > Sauvegardes Auto" : Liste backups auto avec dates, bouton restaurer
7. **RPO = 0** : Aucune donnée perdue validée (auto-save immédiat après action critique)
8. **RTO < 5 minutes** : Récupération depuis backup testée et fonctionnelle en < 5min

---

### Story 5.6: Performance et Optimisation

**En tant qu'** enseignante,
**Je veux** que l'application soit rapide et fluide à tout moment,
**Afin de** ne pas perdre de temps à attendre les chargements.

**Critères d'acceptation:**
1. Temps chargement initial application ≤ 2 secondes (NFR)
2. Navigation entre pages ≤ 300ms (NFR)
3. Saisie présences 30 élèves complétée en ≤ 2 minutes (objectif UX - NFR)
4. Génération rapport bihebdomadaire ≤ 10 secondes par élève (NFR)
5. Génération appréciation trimestrielle ≤ 15 secondes par élève (NFR)
6. Skeleton loading pour opérations longues (génération rapports)
7. Optimistic UI : actions apparaissent instantanées (confirmation backend async)
8. Bundle frontend initial ≤ 500KB gzipped (NFR)

---

## Architecture Components

### Feature Module: `accueil`

```
/src/features/accueil/
├── hooks/
│   └── use-dashboard-data.ts        # Dashboard data aggregation
├── mocks/
│   └── mock-dashboard-data.ts
└── index.ts
```

### Global Services

```
/src/services/
├── backup-service.ts                # Manual and auto backup
└── performance-monitor.ts           # Performance tracking
```

### Shared Infrastructure

```
/src/contexts/
└── class-selection-context.tsx      # Global class/subject context

/src/shared/hooks/
├── use-page-title.tsx              # Centralized page titles
├── use-mobile.ts                   # Responsive utilities
└── use-async-operation.ts          # Async state management
```

---

## Frontend Components

### Templates (Existing)
- `app-sidebar` - Main navigation sidebar
- `site-header` - Top header with context selector
- `nav-main` - Primary navigation
- `nav-user` - User menu
- `class-selector-dropdown` - Class/subject selector

### Organisms (To Create)

#### `dashboard-stats`
**Purpose:** Statistics cards for dashboard
**Props:**
```typescript
interface DashboardStatsProps {
  stats: {
    todaySessions: CourseSession[]
    upcomingSessions: CourseSession[]
    alertCount: number
    avgAttendanceRate: number
    pendingExams: number
    pendingReports: number
  }
}
```

#### `dashboard-widgets`
**Purpose:** Modular dashboard widgets
**Widgets:**
- `today-sessions-widget`
- `upcoming-sessions-widget`
- `alerts-widget` (already created in Epic 3)
- `quick-actions-widget`
- `statistics-summary-widget`

#### `backup-manager`
**Purpose:** Backup and export management
**Props:**
```typescript
interface BackupManagerProps {
  onExport: (options: ExportOptions) => Promise<void>
  onRestore: (backupId: string) => Promise<void>
  backupHistory: Backup[]
}
```

#### `auto-save-indicator`
**Purpose:** Display auto-save status in header
**Props:**
```typescript
interface AutoSaveIndicatorProps {
  lastSaved?: Date
  isSaving: boolean
  error?: string
}
```

---

## Implementation Guide

### Phase 1: Dashboard Foundation (Days 1-3)

**Step 1: Create Dashboard Data Hook**

`/src/features/accueil/hooks/use-dashboard-data.ts`:
```typescript
import { useState, useEffect } from 'react'
import { CourseSession, Student, Exam } from '@/types/uml-entities'
import { fetchAPI } from '@/lib/api'

export interface DashboardData {
  todaySessions: CourseSession[]
  upcomingSessions: CourseSession[]
  alertCount: number
  avgAttendanceRate: number
  pendingExams: number
  pendingReports: number
  recentActivity: Activity[]
}

export function useDashboardData() {
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    setLoading(true)
    try {
      // Fetch all data in parallel
      const [
        sessions,
        exams,
        students,
        analytics
      ] = await Promise.all([
        fetchAPI<CourseSession[]>('/course-sessions'),
        fetchAPI<Exam[]>('/exams'),
        fetchAPI<Student[]>('/students'),
        fetchAPI('/analytics/summary')
      ])

      // Filter today's sessions
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      const todaySessions = sessions.filter(s => {
        const sessionDate = new Date(s.sessionDate)
        sessionDate.setHours(0, 0, 0, 0)
        return sessionDate.getTime() === today.getTime()
      })

      // Get upcoming sessions (next 7 days)
      const nextWeek = new Date()
      nextWeek.setDate(nextWeek.getDate() + 7)
      const upcomingSessions = sessions
        .filter(s => new Date(s.sessionDate) > today && new Date(s.sessionDate) <= nextWeek)
        .slice(0, 5)

      // Calculate alerts
      const alertCount = calculateAlerts(students, analytics)

      // Pending exams (not all results entered)
      const pendingExams = exams.filter(e => !e.isPublished).length

      setData({
        todaySessions,
        upcomingSessions,
        alertCount,
        avgAttendanceRate: analytics.avgAttendanceRate,
        pendingExams,
        pendingReports: 0, // Calculate based on last report date
        recentActivity: []
      })
    } catch (err) {
      setError(err as Error)
    } finally {
      setLoading(false)
    }
  }

  return {
    data,
    loading,
    error,
    refresh: loadDashboardData
  }
}

function calculateAlerts(students: Student[], analytics: any): number {
  let count = 0

  // Count students with low attendance
  count += students.filter(s => analytics[s.id]?.attendanceRate < 75).length

  // Count students with declining grades
  count += students.filter(s => analytics[s.id]?.gradeTrend === 'down').length

  return count
}
```

**Step 2: Create Dashboard Page**

`/src/app/dashboard/accueil/page.tsx`:
```typescript
import { DashboardStats } from '@/components/organisms/dashboard-stats'
import { TodaySessionsWidget } from '@/components/organisms/today-sessions-widget'
import { AlertsWidget } from '@/components/organisms/alerts-widget'
import { QuickActionsWidget } from '@/components/organisms/quick-actions-widget'
import { useDashboardData } from '@/features/accueil/hooks'

export default function DashboardPage() {
  const { data, loading, error } = useDashboardData()

  if (loading) {
    return <DashboardSkeleton />
  }

  if (error) {
    return <ErrorState error={error} />
  }

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-bold">Bonjour Marie 👋</h1>
        <p className="text-muted-foreground">Bienvenue sur outil-professor</p>
      </header>

      {/* Statistics cards */}
      <DashboardStats stats={data!} />

      {/* Widgets grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <TodaySessionsWidget sessions={data!.todaySessions} />
        <AlertsWidget alertCount={data!.alertCount} />
        <QuickActionsWidget />
      </div>
    </div>
  )
}
```

**Step 3: Create Dashboard Widgets**

`/src/components/organisms/today-sessions-widget/today-sessions-widget.tsx`:
```typescript
'use client'

export function TodaySessionsWidget({ sessions }: { sessions: CourseSession[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Sessions aujourd'hui</CardTitle>
      </CardHeader>
      <CardContent>
        {sessions.length === 0 ? (
          <p className="text-muted-foreground">Aucune session aujourd'hui</p>
        ) : (
          <ul className="space-y-3">
            {sessions.map(session => (
              <li key={session.id} className="flex items-center justify-between p-3 border rounded-md">
                <div>
                  <p className="font-medium">{session.className} - {session.subjectName}</p>
                  <p className="text-sm text-muted-foreground">{session.timeSlot}</p>
                </div>
                <Badge variant={session.status === 'completed' ? 'success' : 'default'}>
                  {session.status === 'completed' ? 'Complétée ✓' : 'À venir'}
                </Badge>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
      <CardFooter>
        <Button variant="link" asChild>
          <Link href="/dashboard/calendrier">Voir le calendrier complet</Link>
        </Button>
      </CardFooter>
    </Card>
  )
}
```

### Phase 2: Class Selection Context (Days 4-5)

**Step 1: Enhance Class Selection Context**

`/src/contexts/class-selection-context.tsx`:
```typescript
'use client'
import { createContext, useContext, useState, useEffect } from 'react'
import { Class, Subject } from '@/types/uml-entities'

interface ClassSelectionContextType {
  selectedClassId: string | undefined
  selectedSubjectId: string | undefined
  setSelectedClass: (id: string) => void
  setSelectedSubject: (id: string) => void
  clearSelection: () => void
  classes: Class[]
  subjects: Subject[]
  isLoading: boolean
}

const ClassSelectionContext = createContext<ClassSelectionContextType | undefined>(undefined)

export function ClassSelectionProvider({ children }: { children: React.ReactNode }) {
  const [selectedClassId, setSelectedClassId] = useState<string>()
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>()
  const [classes, setClasses] = useState<Class[]>([])
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Load from localStorage on mount
  useEffect(() => {
    const savedClass = localStorage.getItem('selectedClassId')
    const savedSubject = localStorage.getItem('selectedSubjectId')

    if (savedClass) setSelectedClassId(savedClass)
    if (savedSubject) setSelectedSubjectId(savedSubject)

    loadClassesAndSubjects()
  }, [])

  // Save to localStorage on change
  useEffect(() => {
    if (selectedClassId) {
      localStorage.setItem('selectedClassId', selectedClassId)
    }
  }, [selectedClassId])

  useEffect(() => {
    if (selectedSubjectId) {
      localStorage.setItem('selectedSubjectId', selectedSubjectId)
    }
  }, [selectedSubjectId])

  const loadClassesAndSubjects = async () => {
    try {
      const [classesData, subjectsData] = await Promise.all([
        fetchAPI<Class[]>('/classes'),
        fetchAPI<Subject[]>('/subjects')
      ])
      setClasses(classesData)
      setSubjects(subjectsData)
    } finally {
      setIsLoading(false)
    }
  }

  const setSelectedClass = (id: string) => {
    setSelectedClassId(id)
    // Trigger re-fetch of filtered data in consuming components
  }

  const setSelectedSubject = (id: string) => {
    setSelectedSubjectId(id)
  }

  const clearSelection = () => {
    setSelectedClassId(undefined)
    setSelectedSubjectId(undefined)
    localStorage.removeItem('selectedClassId')
    localStorage.removeItem('selectedSubjectId')
  }

  return (
    <ClassSelectionContext.Provider
      value={{
        selectedClassId,
        selectedSubjectId,
        setSelectedClass,
        setSelectedSubject,
        clearSelection,
        classes,
        subjects,
        isLoading
      }}
    >
      {children}
    </ClassSelectionContext.Provider>
  )
}

export function useClassSelection() {
  const context = useContext(ClassSelectionContext)
  if (!context) {
    throw new Error('useClassSelection must be used within ClassSelectionProvider')
  }
  return context
}
```

**Step 2: Update Class Selector Dropdown**

Already exists at `/src/components/templates/class-selector-dropdown/` - enhance with visual indicator.

### Phase 3: Backup System (Days 6-8)

**Step 1: Implement Backup Service**

`/src/services/backup-service.ts`:
```typescript
import JSZip from 'jszip'

export interface Backup {
  id: string
  timestamp: Date
  size: number
  recordCount: number
  type: 'manual' | 'auto'
}

export class BackupService {
  async exportAllData(): Promise<Blob> {
    const data = {
      version: '1.0',
      exportDate: new Date().toISOString(),
      teachers: await fetchAPI('/teachers'),
      students: await fetchAPI('/students'),
      classes: await fetchAPI('/classes'),
      subjects: await fetchAPI('/subjects'),
      schoolYears: await fetchAPI('/school-years'),
      academicPeriods: await fetchAPI('/academic-periods'),
      timeSlots: await fetchAPI('/time-slots'),
      teachingAssignments: await fetchAPI('/teaching-assignments'),
      courseSessions: await fetchAPI('/course-sessions'),
      studentParticipation: await fetchAPI('/student-participation'),
      exams: await fetchAPI('/exams'),
      examResults: await fetchAPI('/exam-results'),
      appreciations: JSON.parse(localStorage.getItem('appreciations') || '[]'),
      styleGuides: JSON.parse(localStorage.getItem('styleGuides') || '[]'),
      phraseBank: JSON.parse(localStorage.getItem('phraseBank') || '[]')
    }

    const jsonContent = JSON.stringify(data, null, 2)
    const blob = new Blob([jsonContent], { type: 'application/json' })

    // Create ZIP
    const zip = new JSZip()
    zip.file('backup.json', blob)

    return await zip.generateAsync({ type: 'blob' })
  }

  async exportSelective(options: {
    includeStudents: boolean
    includeClasses: boolean
    includeSessions: boolean
    includeExams: boolean
    includeAppreciations: boolean
  }): Promise<Blob> {
    const data: any = {
      version: '1.0',
      exportDate: new Date().toISOString()
    }

    if (options.includeStudents) {
      data.students = await fetchAPI('/students')
    }

    if (options.includeClasses) {
      data.classes = await fetchAPI('/classes')
    }

    if (options.includeSessions) {
      data.courseSessions = await fetchAPI('/course-sessions')
      data.studentParticipation = await fetchAPI('/student-participation')
    }

    if (options.includeExams) {
      data.exams = await fetchAPI('/exams')
      data.examResults = await fetchAPI('/exam-results')
    }

    if (options.includeAppreciations) {
      data.appreciations = JSON.parse(localStorage.getItem('appreciations') || '[]')
    }

    const jsonContent = JSON.stringify(data, null, 2)
    return new Blob([jsonContent], { type: 'application/json' })
  }

  async importData(file: File): Promise<void> {
    const text = await file.text()
    const data = JSON.parse(text)

    // Validate version
    if (data.version !== '1.0') {
      throw new Error('Incompatible backup version')
    }

    // Import entities in order (respecting foreign keys)
    if (data.teachers) {
      await this.importTeachers(data.teachers)
    }

    if (data.schoolYears) {
      await this.importSchoolYears(data.schoolYears)
    }

    if (data.classes) {
      await this.importClasses(data.classes)
    }

    if (data.students) {
      await this.importStudents(data.students)
    }

    // ... continue for all entities
  }

  async createAutoBackup(): Promise<Backup> {
    const blob = await this.exportAllData()

    const backup: Backup = {
      id: generateId(),
      timestamp: new Date(),
      size: blob.size,
      recordCount: await this.countRecords(),
      type: 'auto'
    }

    // Store backup metadata
    const backups = this.getBackupHistory()
    backups.push(backup)
    localStorage.setItem('backupHistory', JSON.stringify(backups))

    // Store backup blob (or upload to cloud)
    await this.storeBackupBlob(backup.id, blob)

    return backup
  }

  getBackupHistory(): Backup[] {
    const saved = localStorage.getItem('backupHistory')
    return saved ? JSON.parse(saved) : []
  }

  private async countRecords(): Promise<number> {
    // Count all records across all entities
    let count = 0
    const students = await fetchAPI<any[]>('/students')
    count += students.length
    // ... count all entities
    return count
  }

  private async storeBackupBlob(id: string, blob: Blob): Promise<void> {
    // For MVP: Store in IndexedDB or localStorage
    // For production: Upload to S3 or similar
    const reader = new FileReader()
    reader.onload = () => {
      const base64 = reader.result as string
      localStorage.setItem(`backup-${id}`, base64)
    }
    reader.readAsDataURL(blob)
  }
}
```

**Step 2: Implement Auto-Save**

`/src/shared/hooks/use-auto-save.ts`:
```typescript
import { useEffect, useRef, useState } from 'react'

export function useAutoSave<T>(
  data: T,
  onSave: (data: T) => Promise<void>,
  interval: number = 10000 // 10 seconds
) {
  const [isSaving, setIsSaving] = useState(false)
  const [lastSaved, setLastSaved] = useState<Date>()
  const [error, setError] = useState<Error | null>(null)
  const savedDataRef = useRef<T>(data)

  useEffect(() => {
    // Skip if data hasn't changed
    if (JSON.stringify(data) === JSON.stringify(savedDataRef.current)) {
      return
    }

    const timer = setTimeout(async () => {
      setIsSaving(true)
      setError(null)

      try {
        await onSave(data)
        savedDataRef.current = data
        setLastSaved(new Date())
      } catch (err) {
        setError(err as Error)
        // Retry after 5 seconds
        setTimeout(() => {
          onSave(data).catch(console.error)
        }, 5000)
      } finally {
        setIsSaving(false)
      }
    }, interval)

    return () => clearTimeout(timer)
  }, [data, onSave, interval])

  return {
    isSaving,
    lastSaved,
    error
  }
}
```

**Step 3: Create Auto-Save Indicator**

`/src/components/organisms/auto-save-indicator/auto-save-indicator.tsx`:
```typescript
'use client'
import { formatDistanceToNow } from 'date-fns'
import { fr } from 'date-fns/locale'

export function AutoSaveIndicator({
  lastSaved,
  isSaving,
  error
}: AutoSaveIndicatorProps) {
  return (
    <div className="flex items-center gap-2 text-sm text-muted-foreground">
      {isSaving && (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          <span>Sauvegarde...</span>
        </>
      )}

      {!isSaving && lastSaved && !error && (
        <>
          <CheckCircle className="h-4 w-4 text-green-500" />
          <span>
            Sauvegardé {formatDistanceToNow(lastSaved, { locale: fr, addSuffix: true })}
          </span>
        </>
      )}

      {error && (
        <>
          <AlertCircle className="h-4 w-4 text-destructive" />
          <span>Échec sauvegarde - Nouvelle tentative...</span>
        </>
      )}
    </div>
  )
}
```

### Phase 4: Performance Optimization (Days 9-10)

**Step 1: Code Splitting**

```typescript
// Lazy load heavy components
const AppreciationGenerator = lazy(() =>
  import('@/components/organisms/appreciation-generator')
)

// Use in component
<Suspense fallback={<Skeleton className="h-96" />}>
  <AppreciationGenerator />
</Suspense>
```

**Step 2: Memoization**

```typescript
// Expensive calculations
const sortedStudents = useMemo(
  () => students.sort((a, b) => a.lastName.localeCompare(b.lastName)),
  [students]
)

// Callbacks
const handleDelete = useCallback(
  (id: string) => {
    deleteStudent(id)
  },
  [deleteStudent]
)

// Components
export const StudentCard = React.memo(({ student }: { student: Student }) => {
  return (
    <Card>
      {/* Expensive render */}
    </Card>
  )
})
```

**Step 3: Bundle Analysis**

```bash
# Analyze bundle size
npm run build

# Check bundle analyzer
npx @next/bundle-analyzer
```

**Optimization targets:**
- Initial bundle < 500KB gzipped
- Largest chunks < 100KB each
- Use dynamic imports for routes
- Tree-shake unused libraries

---

## Performance Optimization

### Critical Performance Targets

| Metric | Target | Measurement |
|--------|--------|-------------|
| Initial Load | < 2s | Time to Interactive (TTI) |
| Page Navigation | < 300ms | Route transition time |
| Dashboard Load | < 2s | All widgets loaded |
| Attendance Entry | < 2min for 30 students | Manual timing |
| Report Generation | < 10s/student | Backend timing |

### Optimization Strategies

**1. Server-Side Rendering (SSR)**
- Use Server Components for static content
- Fetch data on server when possible
- Reduce client-side JavaScript

**2. Code Splitting**
- Lazy load routes
- Lazy load heavy components (charts, editors)
- Use dynamic imports

**3. Image Optimization**
- Use next/image for automatic optimization
- Serve WebP format
- Lazy load images below fold

**4. Caching**
- Cache API responses (5 min stale-while-revalidate)
- Cache static assets (1 year)
- Use React Query for server state caching

**5. Bundle Optimization**
- Tree-shake unused code
- Minimize dependencies
- Use Turbopack for faster builds

---

## Testing Approach

### Manual Testing Checklist

**Story 5.1: Dashboard**
- [ ] Dashboard loads in < 2s
- [ ] All widgets display correctly
- [ ] Today's sessions accurate
- [ ] Alerts count correct
- [ ] Quick actions work

**Story 5.2: Context Selection**
- [ ] Can select class
- [ ] Can select subject
- [ ] Selection persists after refresh
- [ ] Pages filter correctly
- [ ] Indicator shows selected context

**Story 5.3: Navigation**
- [ ] All menu items work
- [ ] Active item highlighted
- [ ] Breadcrumb displays correctly
- [ ] Navigation < 300ms
- [ ] Keyboard shortcuts work

**Story 5.4: Manual Backup**
- [ ] Full export downloads
- [ ] Selective export works
- [ ] ZIP contains correct data
- [ ] History shows exports

**Story 5.5: Auto-Save**
- [ ] Auto-save triggers every 10s
- [ ] Indicator shows status
- [ ] Error retry works
- [ ] Weekly backup creates

**Story 5.6: Performance**
- [ ] Initial load < 2s
- [ ] Navigation < 300ms
- [ ] No janky animations
- [ ] Smooth scrolling

### Performance Testing

**Lighthouse Audit Targets:**
- Performance: ≥ 90
- Accessibility: ≥ 95
- Best Practices: ≥ 95
- SEO: ≥ 90

**Core Web Vitals:**
- LCP (Largest Contentful Paint): < 2.5s
- FID (First Input Delay): < 100ms
- CLS (Cumulative Layout Shift): < 0.1

---

## Dependencies

### NPM Packages
```json
{
  "date-fns": "^2.30.0",
  "jszip": "^3.10.1"
}
```

---

## Notes

**Critical Path:**
Dashboard → Context Selection → Navigation → Auto-Save → Performance

**Transversal Work:**
This epic spans all sprints - implement incrementally:
- Sprint 1-2: Navigation and context
- Sprint 3-4: Dashboard basics
- Sprint 5-6: Auto-save
- Sprint 7-9: Advanced dashboard widgets
- Sprint 10: Performance polish

**Performance Critical:**
- Dashboard must load fast (first impression)
- Navigation must feel instant
- Auto-save must be reliable (zero data loss)

---

**Document Status:** ✅ Ready for Implementation
**Generated:** 2025-10-14
**Epic Timeline:** Transversal + Sprint 10 (1-2 weeks polish)
