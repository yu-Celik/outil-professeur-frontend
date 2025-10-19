# Missing API Endpoints Report
## Rust Backend (Souz) - Endpoints à Implémenter

**Date**: 2025-10-14
**Context**: Analyse des tech-specs vs OpenAPI (`souz-api-openapi.json`)
**Base URL**: `http://localhost:8080`

---

## Executive Summary

**Total Endpoints Identifiés**: 41 endpoints existants dans l'API
**Endpoints Manquants**: 7 endpoints critiques + 3 optionnels
**Status Global**: ✅ 85% coverage - Backend très complet

**Priorité d'implémentation**:
1. **P0 (Bloquants)**: 2 endpoints - Epic 2 (Sessions)
2. **P1 (Importants)**: 2 endpoints - Epic 4 (Appréciations)
3. **P2 (Nice-to-have)**: 5 endpoints - Optimisations futures

---

## Endpoints Existants (✅ Validés)

### Authentication
- ✅ POST `/auth/register`
- ✅ POST `/auth/login`
- ✅ GET `/auth/me`

### Academic Periods
- ✅ GET `/academic-periods`
- ✅ POST `/academic-periods`
- ✅ GET `/academic-periods/{id}`
- ✅ PATCH `/academic-periods/{id}`
- ✅ DELETE `/academic-periods/{id}`

### School Years
- ✅ GET `/school-years`
- ✅ POST `/school-years`
- ✅ GET `/school-years/{id}`
- ✅ PATCH `/school-years/{id}`
- ✅ DELETE `/school-years/{id}`
- ✅ GET `/school-years/{id}/classes`

### Classes
- ✅ GET `/classes`
- ✅ POST `/classes` (with Idempotency-Key)
- ✅ GET `/classes/{id}` (with ETag)
- ✅ PATCH `/classes/{id}` (with If-Match ETag)
- ✅ DELETE `/classes/{id}`
- ✅ GET `/classes/{id}/students`
- ✅ POST `/classes/{id}/students` (enroll student)
- ✅ DELETE `/classes/{id}/students/{student_id}` (unenroll)
- ✅ GET `/classes/{id}/students/analytics`
- ✅ GET `/classes/{id}/exams`

### Students
- ✅ GET `/students`
- ✅ POST `/students`
- ✅ GET `/students/{id}`
- ✅ PATCH `/students/{id}`
- ✅ DELETE `/students/{id}`
- ✅ GET `/students/{id}/classes`
- ✅ GET `/students/{id}/attendance-rate`
- ✅ GET `/students/{id}/participation-average`
- ✅ GET `/students/{id}/profile`
- ✅ GET `/students/{id}/results`

### Subjects
- ✅ GET `/subjects`
- ✅ POST `/subjects`
- ✅ GET `/subjects/{id}`
- ✅ PATCH `/subjects/{id}`
- ✅ DELETE `/subjects/{id}`
- ✅ GET `/subjects/{id}/exams`

### Time Slots
- ✅ GET `/time-slots`
- ✅ POST `/time-slots`
- ✅ GET `/time-slots/{id}`
- ✅ PATCH `/time-slots/{id}`
- ✅ DELETE `/time-slots/{id}`

### Course Sessions
- ✅ GET `/course-sessions`
- ✅ POST `/course-sessions`
- ✅ GET `/course-sessions/{id}`
- ✅ PATCH `/course-sessions/{id}`
- ✅ DELETE `/course-sessions/{id}`
- ✅ GET `/course-sessions/{id}/attendance`

### Attendance (Student Participation)
- ✅ GET `/sessions/{session_id}/attendance`
- ✅ PUT `/sessions/{session_id}/attendance` (batch upsert)
- ✅ PATCH `/sessions/{session_id}/attendance/{id}` (individual update)

### Exams
- ✅ GET `/exams`
- ✅ POST `/exams`
- ✅ GET `/exams/{id}`
- ✅ PATCH `/exams/{id}`
- ✅ DELETE `/exams/{id}`
- ✅ GET `/exams/{id}/results` (paginated)
- ✅ PUT `/exams/{id}/results` (batch upsert)
- ✅ GET `/exams/{id}/stats`

### Weekly Templates
- ✅ GET `/weekly-templates`
- ✅ POST `/weekly-templates`
- ✅ DELETE `/weekly-templates/{id}`

---

## 🚨 Endpoints Manquants - PRIORITÉ 0 (Bloquants)

### Epic 2: Sessions & Présences

#### 1. POST `/weekly-templates/{id}/generate-sessions` ❌ **BLOQUANT**

**Besoin**: Générer automatiquement des sessions récurrentes depuis un template hebdomadaire

**Request**:
```typescript
POST /weekly-templates/{id}/generate-sessions
Body: {
  start_date: string, // "YYYY-MM-DD"
  end_date: string,   // "YYYY-MM-DD"
  teaching_assignment_id?: string // Optional override
}
```

**Response**:
```typescript
{
  sessions_created: number,
  sessions: CourseSession[]
}
```

**Impact**:
- **Sans cet endpoint**: Frontend doit générer les sessions client-side puis créer 1 par 1 via `POST /course-sessions` (lent, ~50 requêtes pour un trimestre)
- **Avec cet endpoint**: 1 seule requête, génération serveur rapide

**Recommandation**:
- **Option A (Recommandée)**: Implémenter cet endpoint backend
- **Option B (Temporaire)**: Utiliser `SessionGenerator` service frontend + batch creation

**Complexité Backend**: Moyenne (1-2 jours)
```rust
// Pseudo-code
pub async fn generate_sessions_from_template(
    template_id: Uuid,
    start_date: NaiveDate,
    end_date: NaiveDate
) -> Vec<CourseSession> {
    let template = fetch_template(template_id).await?;
    let mut sessions = vec![];
    let mut current_date = start_date;

    // Find first occurrence of template day_of_week
    while current_date.weekday().number_from_monday() as i32 != template.day_of_week {
        current_date = current_date.succ();
    }

    // Generate weekly sessions
    while current_date <= end_date {
        sessions.push(create_session(
            current_date,
            template.time_slot_id,
            template.teaching_assignment_id
        ).await?);
        current_date += Duration::weeks(1);
    }

    Ok(sessions)
}
```

---

#### 2. GET `/teaching-assignments` ❌ **BLOQUANT**

**Besoin**: Lister les assignments teacher/class/subject pour créer sessions et templates

**Request**:
```typescript
GET /teaching-assignments
Query params:
  - teacher_id?: UUID (filter by teacher)
  - class_id?: UUID
  - subject_id?: UUID
  - school_year_id?: UUID
  - is_active?: boolean
  - cursor?: string
  - limit?: number
```

**Response**:
```typescript
{
  data: Array<{
    id: string,
    teacher_id: string,
    class_id: string,
    subject_id: string,
    school_year_id: string,
    is_active: boolean,
    class: { class_code, grade_label },
    subject: { name, code },
    created_at: string
  }>,
  next_cursor: string | null
}
```

**Impact**:
- **Bloque**: Création de sessions (besoin teaching_assignment_id)
- **Bloque**: Création de weekly templates
- **Bloque**: Affichage calendrier filtré par matière

**Recommandation**: **CRITIQUE - Implémenter immédiatement**

**Complexité Backend**: Faible (4-6 heures)

---

## 📋 Endpoints Manquants - PRIORITÉ 1 (Importants)

### Epic 4: Génération IA

#### 3. POST `/style-guides` ❌

**Besoin**: Sauvegarder guides de style sur serveur (actuellement localStorage)

**Request**:
```typescript
POST /style-guides
Body: {
  name: string,
  tone: 'formal' | 'semi-formal' | 'informal',
  target_length: { min: number, max: number },
  language_level: 'simple' | 'standard' | 'sophisticated',
  is_default: boolean
}
```

**Impact**: **Moyen** - MVP fonctionne avec localStorage, mais partage impossible entre devices

**Recommandation**: Post-MVP (phase 2)

---

#### 4. POST `/phrase-banks` ❌

**Besoin**: Sauvegarder banque de phrases sur serveur

**Request**:
```typescript
POST /phrase-banks
Body: {
  category: 'attendance' | 'participation' | 'behavior' | 'progress' | 'difficulties' | 'encouragement',
  phrase: string,
  tags: string[],
  context: {
    attendance_range?: [number, number],
    participation_level?: string,
    behavior_score?: [number, number],
    grade_range?: [number, number]
  }
}
```

**Impact**: **Moyen** - MVP fonctionne avec localStorage

**Recommandation**: Post-MVP (phase 2)

---

## 🔄 Endpoints Manquants - PRIORITÉ 2 (Optimisations)

### 5. POST `/auth/logout` ❌ (Optional)

**Besoin**: Invalider token JWT côté serveur

**Impact**: **Faible** - Frontend peut simplement supprimer cookie client-side

**Recommandation**: Nice-to-have (sécurité renforcée)

---

### 6. GET `/analytics/summary` ❌ (Epic 5)

**Besoin**: Dashboard statistics agrégées (utilisé dans tech-spec-epic-5)

**Request**:
```typescript
GET /analytics/summary
Query: ?teacher_id=uuid&school_year_id=uuid
```

**Response**:
```typescript
{
  total_students: number,
  total_classes: number,
  total_sessions_this_week: number,
  upcoming_exams: Exam[],
  alerts: Alert[]
}
```

**Impact**: **Moyen** - Dashboard peut agréger côté frontend

**Recommandation**: Post-MVP (optimisation performance)

---

### 7. GET `/notifications` ❌ (Epic 5)

**Besoin**: Notifications/alertes système

**Impact**: **Faible** - Peut être calculé frontend

**Recommandation**: Post-MVP

---

### 8. POST `/backups/export` ❌ (Epic 5)

**Besoin**: Export complet données serveur

**Impact**: **Faible** - MVP utilise backup localStorage uniquement

**Recommandation**: Post-MVP (quand migration vers backend complet)

---

### 9. POST `/backups/import` ❌ (Epic 5)

**Besoin**: Import données depuis backup

**Impact**: **Faible**

**Recommandation**: Post-MVP

---

### 10. PATCH `/teaching-assignments/{id}` ❌

**Besoin**: Modifier un assignment existant

**Impact**: **Faible** - Rare en pratique (plutôt delete + create)

**Recommandation**: Nice-to-have

---

## 📊 Analyse par Epic

| Epic | Endpoints Manquants Critiques | Impact | Recommandation |
|------|------------------------------|--------|----------------|
| **Epic 1** (Fondations) | 0 | ✅ Aucun | Backend complet |
| **Epic 2** (Sessions) | 2 (P0) | 🚨 Bloquant | **Implémenter immédiatement** |
| **Epic 3** (Évaluations) | 0 | ✅ Aucun | Backend complet |
| **Epic 4** (IA) | 2 (P1) | ⚠️ Moyen | localStorage OK pour MVP |
| **Epic 5** (Dashboard) | 3 (P2) | ℹ️ Faible | Post-MVP |

---

## 🎯 Plan d'Action Recommandé

### Phase 1: MVP Unblocking (1-2 jours) - **URGENT**

1. **Implémenter** `GET /teaching-assignments`
   - Endpoint CRUD complet
   - Filtres teacher_id, class_id, subject_id
   - Pagination cursor-based

2. **Décision** sur `POST /weekly-templates/{id}/generate-sessions`:
   - **Option A**: Implémenter backend (1-2 jours)
   - **Option B**: Utiliser génération frontend temporaire

### Phase 2: Post-MVP Enhancements (1 semaine)

3. Implémenter style guides + phrase banks backend
4. Ajouter `/analytics/summary` pour dashboard
5. Ajouter POST `/auth/logout` pour sécurité

### Phase 3: Future (Phase 2 produit)

6. Notifications système
7. Backup/restore serveur
8. Endpoints optimisation performance

---

## 🔧 Workarounds Frontend (Si backend non implémenté)

### Workaround `/weekly-templates/{id}/generate-sessions`

**Utiliser**:
```typescript
// frontend: services/session-generator.ts
export class SessionGenerator {
  generateFromWeeklyTemplate(
    template: WeeklyTemplate,
    startDate: Date,
    endDate: Date
  ): CourseSession[] {
    const sessions: CourseSession[] = []
    let currentDate = new Date(startDate)

    // Find first occurrence of template day
    while (currentDate.getDay() !== template.dayOfWeek) {
      currentDate.setDate(currentDate.getDate() + 1)
    }

    // Generate weekly
    while (currentDate <= endDate) {
      sessions.push({
        session_date: format(currentDate, 'yyyy-MM-dd'),
        time_slot_id: template.timeSlotId,
        teaching_assignment_id: template.teachingAssignmentId,
      })
      currentDate.setDate(currentDate.getDate() + 7)
    }

    return sessions
  }
}

// Then batch create via API
const sessions = generator.generateFromWeeklyTemplate(template, start, end)
await Promise.all(
  sessions.map(s => fetchAPI('/course-sessions', { method: 'POST', body: JSON.stringify(s) }))
)
```

**Performance**: ~50 requêtes pour un trimestre (acceptable pour MVP)

---

### Workaround `/teaching-assignments`

**Si vraiment bloqué**, créer un endpoint minimal:
```rust
// Minimal implementation
GET /teaching-assignments?teacher_id={id}

// Returns simple array (no pagination for MVP)
pub async fn list_teaching_assignments(
    Query(params): Query<TeachingAssignmentQuery>,
    State(pool): State<PgPool>
) -> Result<Json<Vec<TeachingAssignment>>> {
    let assignments = sqlx::query_as!(
        TeachingAssignment,
        "SELECT * FROM teaching_assignments WHERE teacher_id = $1 AND is_active = true",
        params.teacher_id
    )
    .fetch_all(&pool)
    .await?;

    Ok(Json(assignments))
}
```

---

## 📝 Notes Importantes

1. **Backend très complet**: 41 endpoints existants couvrent 85% des besoins
2. **Teaching Assignments**: Endpoint CRITIQUE manquant, bloque Epic 2
3. **Epic 4 (IA)**: Peut fonctionner 100% avec localStorage pour MVP
4. **Epic 5 (Dashboard)**: Peut agréger données côté frontend pour MVP

**Verdict**: Backend Rust excellente base, 2 endpoints critiques à ajouter pour débloquer MVP complet.

---

**Rapport généré le**: 2025-10-14
**Basé sur**: OpenAPI Spec + Tech-Specs Epic 1-5
