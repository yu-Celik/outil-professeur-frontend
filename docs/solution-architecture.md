# Solution Architecture Document
## outil-professor Educational Management Platform

**Author:** Yusuf
**Date:** 2025-10-14
**Version:** 1.0
**Project Level:** 3 (Full Product)
**Architecture Type:** Modular Monolith with Separated API Backend

---

## Table of Contents

1. [Executive Summary](#executive-summary)
2. [Technology Stack and Decisions](#technology-stack-and-decisions)
3. [System Architecture](#system-architecture)
4. [Repository and Module Architecture](#repository-and-module-architecture)
5. [Data Architecture](#data-architecture)
6. [API and Interface Design](#api-and-interface-design)
7. [Frontend Architecture](#frontend-architecture)
8. [Backend Architecture](#backend-architecture)
9. [Cross-Cutting Concerns](#cross-cutting-concerns)
10. [Component and Integration Overview](#component-and-integration-overview)
11. [Architecture Decision Records](#architecture-decision-records)
12. [Implementation Guidance](#implementation-guidance)
13. [Proposed Source Tree](#proposed-source-tree)

---

## Executive Summary

### Project Context

**outil-professor** is a local-first educational management platform built for online teachers. The system transforms manual student tracking into an automated, AI-assisted workflow that reduces administrative time by 50% while improving report quality and consistency.

### Architecture Overview

**Pattern:** Modular Monolith with Separated API Backend
**Repository:** Monorepo
**Frontend:** Next.js 15 (App Router) with Hybrid SSR/CSR
**Backend:** Rust API (60+ REST endpoints)
**Database:** SQLite (local-first) → PostgreSQL (cloud migration path)

### Key Architectural Characteristics

- **Local-First:** Offline-capable with background sync
- **Feature-Based Modules:** 8 self-contained features (auth, gestion, calendar, sessions, students, evaluations, appreciations, accueil)
- **Atomic Design:** 129 UI components (34 atoms, 42 molecules, 46 organisms, 7 templates)
- **Type-Safe:** End-to-end TypeScript with Zod validation
- **Accessibility-First:** WCAG 2.1 AA compliant (Radix UI primitives)
- **AI-Powered:** Automated content generation for student appreciations

### Technology Highlights

| Category | Technology | Version | Justification |
|----------|-----------|---------|---------------|
| Frontend Framework | Next.js | 15.x | SSR/CSR hybrid, App Router, React Server Components |
| React Version | React | 19.x | Latest features, Server Components support |
| Build Tool | Turbopack | Built-in | 10x faster than Webpack, dev/prod builds |
| Language | TypeScript | 5.x | Type safety, better DX, catches errors early |
| Styling | Tailwind CSS | 4.x | Utility-first, OKLCH colors, dark mode, CSS variables |
| UI Components | shadcn/ui | Latest | Accessible (Radix UI), customizable, no vendor lock-in |
| Icons | Lucide React | Latest | Consistent, tree-shakeable, 100% coverage |
| State Management | React Context + Hooks | Built-in | Sufficient for app complexity, no Redux needed |
| Forms | React Hook Form + Zod | 7.x + 3.x | Type-safe validation, excellent DX, performance |
| Data Viz | Recharts | 2.x | React-native, composable charts, good defaults |
| Tables | @tanstack/react-table | 8.x | Headless, flexible, feature-rich |
| Drag & Drop | @dnd-kit | 6.x | Accessible, modular, touch support |
| Backend API | Rust (Souz API) | 1.0.0 | Type-safe, fast, 60+ endpoints |
| Database | PostgreSQL | Latest | Multi-user, RLS, advanced features (Rust backend) |
| Auth | Backend Rust (JWT) | 1.0.0 | JWT + HttpOnly cookies, RLS, audit logging (already implemented) |
| Linting | Biome | Latest | Fast, all-in-one (replaces ESLint + Prettier) |
| Testing | Playwright (E2E) | Latest | Reliable, cross-browser, developer-friendly |

---

## Technology Stack and Decisions

### Frontend Stack

#### Core Framework: Next.js 15

**Decision:** Next.js 15 with App Router

**Rationale:**
- **App Router:** React Server Components, streaming SSR, built-in layouts
- **Hybrid Rendering:** SSR for initial load + SEO, CSR for interactivity
- **API Routes:** Built-in API capabilities (if needed alongside Rust API)
- **Image Optimization:** Automatic optimization for student photos
- **Turbopack:** 10x faster dev builds vs Webpack

**Usage Pattern:**
```typescript
// Server Component (default in app/)
export default async function StudentPage({ params }: { params: { id: string } }) {
  const student = await getStudent(params.id) // Server-side fetch
  return <StudentProfile student={student} />
}

// Client Component (interactive)
'use client'
export function AppreciationGenerator() {
  const [content, setContent] = useState('')
  // Interactive logic
}
```

#### Language: TypeScript 5.x

**Decision:** TypeScript strict mode enabled

**Rationale:**
- Type safety catches bugs at compile-time
- Better IDE autocomplete and refactoring
- Self-documenting code
- Required for React 19 + Next.js 15 optimal experience

**Configuration:**
```json
{
  "compilerOptions": {
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "noImplicitAny": true
  }
}
```

#### Styling: Tailwind CSS v4

**Decision:** Tailwind CSS v4 with OKLCH color space

**Rationale:**
- **Utility-First:** Rapid prototyping, no CSS files to manage
- **OKLCH Colors:** Perceptually uniform, better than HSL
- **Dark Mode:** Built-in with CSS variables
- **Design Tokens:** Centralized in globals.css
- **Tree-Shaking:** Unused styles eliminated in production

**Color System:**
```css
/* globals.css */
@import "tailwindcss";

:root {
  --color-primary: oklch(58% 0.182 267);
  --color-foreground: oklch(9% 0 0);
  --color-background: oklch(100% 0 0);
}

.dark {
  --color-foreground: oklch(98% 0 0);
  --color-background: oklch(13% 0 0);
}
```

#### UI Components: shadcn/ui

**Decision:** shadcn/ui (Radix UI primitives + Tailwind)

**Rationale:**
- **Copy-Paste, Not NPM:** Full ownership, no black box
- **Accessible by Default:** WCAG 2.1 AA via Radix UI
- **Customizable:** Tailwind styling, easy to adapt
- **No Lock-In:** Components live in your codebase
- **Active Community:** Regular updates, good docs

**Component Inventory:**
- 34 Atoms (button, input, badge, etc.)
- 42 Molecules (card, dialog, dropdown, etc.)
- 46 Organisms (data-table, charts, complex forms)
- 7 Templates (layouts, navigation)

#### State Management: React Context + Custom Hooks

**Decision:** No Redux/Zustand, use built-in Context API + custom hooks

**Rationale:**
- **Sufficient Complexity:** App state not complex enough for Redux
- **Feature-Based Hooks:** Each feature has its own hooks (use-exam-management, use-calendar, etc.)
- **Shared Contexts:** Class selection context (global)
- **Server State:** React Server Components handle data fetching
- **Local State:** useState/useReducer for UI state

**Pattern:**
```typescript
// Global context
const ClassSelectionContext = createContext<ClassSelectionContextType>(...)

// Feature hook
export function useExamManagement() {
  const [exams, setExams] = useState<Exam[]>([])
  const createExam = async (data: ExamInput) => { /* ... */ }
  return { exams, createExam, updateExam, deleteExam }
}
```

#### Forms: React Hook Form + Zod

**Decision:** React Hook Form for forms, Zod for validation

**Rationale:**
- **Type-Safe Validation:** Zod schemas infer TypeScript types
- **Performance:** Uncontrolled components, minimal re-renders
- **DX:** Great error handling, field-level validation
- **Integration:** Works seamlessly with shadcn/ui form components

**Example:**
```typescript
const examSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  maxPoints: z.number().positive(),
  examDate: z.date(),
})

type ExamFormData = z.infer<typeof examSchema>

const form = useForm<ExamFormData>({
  resolver: zodResolver(examSchema),
})
```

#### Icons: Lucide React

**Decision:** Lucide React for all icons (100% coverage)

**Rationale:**
- **Consistent Design:** All icons same visual style
- **Tree-Shakeable:** Import only what you use
- **Accessible:** Proper SVG attributes
- **Size Flexibility:** Easy to size with className

**Usage:**
```tsx
import { Home, Users, Calendar } from "lucide-react"

<Button>
  <Plus className="mr-2 h-4 w-4" />
  Add Student
</Button>
```

#### Data Tables: @tanstack/react-table

**Decision:** TanStack Table (headless table library)

**Rationale:**
- **Headless:** Full styling control with Tailwind
- **Feature-Rich:** Sorting, filtering, pagination, row selection
- **Type-Safe:** TypeScript-first API
- **Performance:** Virtual scrolling support for large datasets

**Key Features Used:**
- Column sorting
- Global and column filtering
- Pagination
- Row selection (checkboxes)
- Inline editing

#### Charts: Recharts

**Decision:** Recharts for data visualization

**Rationale:**
- **React-Native:** Declarative API, React components
- **Responsive:** Auto-adapts to container size
- **Composable:** Build complex charts from primitives
- **Good Defaults:** Works well out-of-box

**Charts Used:**
- Line charts (performance trends)
- Bar charts (grade distribution)
- Progress bars (attendance rate)

#### Drag & Drop: @dnd-kit (Future)

**Decision:** @dnd-kit for calendar drag-and-drop (future enhancement)

**Rationale:**
- **Accessible:** Keyboard navigation, screen reader support
- **Modular:** Use only needed features
- **Touch Support:** Mobile-friendly
- **Performant:** No re-renders on drag

**Use Case:** Drag sessions to reschedule in calendar view

---

### Backend Stack

#### API Framework: Rust (Souz Backend API v1.0.0)

**Decision:** Existing Rust API with 60+ REST endpoints

**Rationale (Brownfield):**
- **Already Built:** 60+ endpoints operational
- **Type-Safe:** Rust's type system prevents runtime errors
- **Fast:** Low latency, high throughput
- **Memory-Safe:** No null pointers, buffer overflows
- **Concurrent:** Built-in async/await

**API Organization (12 Domains):**
- `/auth` - Authentication (3 endpoints)
- `/students` - Student CRUD (10 endpoints)
- `/classes` - Class management (10 endpoints)
- `/subjects` - Subject management (6 endpoints)
- `/course-sessions` - Session scheduling (6 endpoints)
- `/time-slots` - Time slot config (5 endpoints)
- `/weekly-templates` - Recurring sessions (4 endpoints)
- `/exams` - Exam management (5 endpoints)
- `/exam-results` - Grade entry (3 endpoints)
- `/attendance` - Participation tracking (4 endpoints)
- `/academic-periods` - Trimester config (4 endpoints)
- `/school-years` - Year management (6 endpoints)

**Authentication:**
- Cookie-based sessions (HttpOnly, SameSite=Strict)
- No JWT (security best practice for web apps)

**Error Handling:**
- Structured error responses
- HTTP status codes (400, 401, 404, 500)
- Validation errors with field-level details

**Concurrency:**
- ETag support for optimistic locking
- Prevents concurrent edit conflicts

#### Database: SQLite → PostgreSQL

**Decision Phase 1 (MVP):** SQLite

**Rationale:**
- **Local-First:** Single file, no server required
- **Serverless:** No database daemon
- **Cross-Platform:** Works on Windows, macOS, Linux
- **Fast:** In-process, no network latency
- **Migrations:** Easy schema evolution

**Decision Phase 2 (Production):** PostgreSQL

**Rationale:**
- **Concurrent Writes:** Better multi-user support
- **Advanced Features:** JSON columns, full-text search, triggers
- **Hosted Options:** Railway, Supabase, Neon
- **Backup/Replication:** Built-in tools

**Migration Path:**
```typescript
// Database abstraction layer
interface DatabaseAdapter {
  query<T>(sql: string, params: any[]): Promise<T[]>
  execute(sql: string, params: any[]): Promise<void>
}

class SQLiteAdapter implements DatabaseAdapter { /* ... */ }
class PostgresAdapter implements DatabaseAdapter { /* ... */ }

// Switch via environment variable
const db = process.env.DB_TYPE === 'postgres'
  ? new PostgresAdapter()
  : new SQLiteAdapter()
```

---

### Development Tools

#### Linting & Formatting: Biome

**Decision:** Biome (replaces ESLint + Prettier)

**Rationale:**
- **Fast:** 100x faster than ESLint
- **All-in-One:** Linting + formatting in one tool
- **Zero Config:** Works out-of-box for Next.js
- **Auto-Fix:** Most issues fixable with `biome check --apply`

**Configuration:**
```json
{
  "linter": {
    "enabled": true,
    "rules": { "recommended": true }
  },
  "formatter": {
    "indentStyle": "space",
    "indentWidth": 2
  }
}
```

#### Testing: Playwright (E2E)

**Decision:** Playwright for end-to-end testing

**Rationale:**
- **Multi-Browser:** Chromium, Firefox, WebKit
- **Auto-Wait:** No flaky tests from race conditions
- **Debugging:** Time-travel debugging, trace viewer
- **Codegen:** Generate tests by recording actions

**Strategy:**
- E2E tests for critical user flows (appreciation generation, exam grading)
- Component tests via Storybook (visual regression)
- No unit tests (per user preference)

---

## System Architecture

### High-Level Architecture Diagram

```
┌─────────────────────────────────────────────────────┐
│                    User (Teacher)                    │
│              Desktop / Tablet / Mobile               │
└─────────────────────────┬───────────────────────────┘
                          │ HTTPS
                          ▼
┌─────────────────────────────────────────────────────┐
│           Next.js 15 Frontend (Port 3000)            │
│  ┌────────────────────────────────────────────────┐ │
│  │         App Router (SSR/CSR Hybrid)            │ │
│  │  ┌──────────────┬──────────────┬────────────┐ │ │
│  │  │ Server Comp. │ Client Comp. │ API Routes │ │ │
│  │  └──────────────┴──────────────┴────────────┘ │ │
│  └────────────────────────────────────────────────┘ │
│  ┌────────────────────────────────────────────────┐ │
│  │     Feature Modules (8 features)               │ │
│  │  accueil | calendar | sessions | students      │ │
│  │  evaluations | appreciations | gestion | auth  │ │
│  └────────────────────────────────────────────────┘ │
│  ┌────────────────────────────────────────────────┐ │
│  │     Shared Infrastructure                      │ │
│  │  Components (129) | Hooks | Contexts           │ │
│  └────────────────────────────────────────────────┘ │
└────────────────────┬────────────────────────────────┘
                     │ HTTP REST
                     ▼
┌─────────────────────────────────────────────────────┐
│        Rust Backend API (Souz v1.0.0)               │
│  ┌────────────────────────────────────────────────┐ │
│  │     REST API (60+ endpoints)                   │ │
│  │  /auth | /students | /classes | /sessions      │ │
│  │  /exams | /attendance | /subjects | etc.       │ │
│  └────────────────────────────────────────────────┘ │
│  ┌────────────────────────────────────────────────┐ │
│  │     Business Logic Services                    │ │
│  │  Authentication | Validation | Domain Logic    │ │
│  └────────────────────────────────────────────────┘ │
└────────────────────┬────────────────────────────────┘
                     │ SQL
                     ▼
┌─────────────────────────────────────────────────────┐
│              Database (SQLite/PostgreSQL)            │
│  ┌────────────────────────────────────────────────┐ │
│  │  UML Entity Model (11 core entities)           │ │
│  │  Teacher | Student | Class | Subject           │ │
│  │  CourseSession | Exam | Participation          │ │
│  │  NotationSystem | StyleGuide | etc.            │ │
│  └────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────┘

External Services (Future):
┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│  AI/LLM API  │  │  PDF Service │  │  Email SMTP  │
└──────────────┘  └──────────────┘  └──────────────┘
```

### Deployment Architecture

#### Phase 1: MVP (Local Development)

```
Developer Machine:
├── Next.js Dev Server (localhost:3000)
├── Rust API (localhost:8080)
└── SQLite Database (./data/outil-professor.db)
```

#### Phase 2: Production (VPS or PaaS)

```
Cloud Hosting:
├── Frontend: Vercel / Netlify / Fly.io
│   └── Next.js SSR (CDN edge caching)
├── Backend: Fly.io / Railway / Render
│   └── Rust API (Docker container)
└── Database: Railway / Supabase
    └── PostgreSQL (managed instance)
```

---

## Repository and Module Architecture

### Monorepo Structure

```
/outil-professor (root)
├── /src                    # Next.js frontend
│   ├── /app                # App Router pages
│   ├── /components         # Atomic design components
│   ├── /features           # Feature modules (8 features)
│   ├── /shared             # Shared utilities
│   ├── /contexts           # Global contexts
│   ├── /services           # Global business logic
│   ├── /types              # TypeScript types (UML entities)
│   └── /lib                # Libraries (auth, utils)
├── /public                 # Static assets
├── /docs                   # Documentation (PRD, architecture, etc.)
├── /backend (optional)     # Rust API (if in same repo)
├── package.json            # NPM dependencies
├── tsconfig.json           # TypeScript config
├── tailwind.config.ts      # Tailwind config
├── biome.json              # Biome config
└── README.md               # Project overview
```

### Feature Module Pattern

**Self-Contained Features (8 modules):**

```
/src/features/[feature-name]/
├── hooks/                  # Business logic hooks
│   ├── use-[feature]-management.ts
│   ├── use-[feature]-data.ts
│   └── index.ts
├── mocks/                  # Test data
│   ├── mock-[entities].ts
│   └── index.ts
├── services/               # Complex business logic (optional)
│   └── [feature]-service.ts
├── utils/                  # Helper functions (optional)
│   └── [feature]-utils.ts
└── index.ts                # Public API exports
```

**Feature List:**

1. **auth** - Authentication and user management
2. **gestion** - Administrative management (teaching assignments)
3. **calendar** - Calendar and scheduling features
4. **sessions** - Session and attendance management
5. **students** - Student management with analytics
6. **evaluations** - Assessment and grading system
7. **appreciations** - AI-powered content generation
8. **accueil** - Dashboard and home functionality

**Principles:**
- **Autonomy:** Each feature can function independently
- **Clean API:** `index.ts` exposes only necessary exports
- **Single Responsibility:** Each file has precise role
- **Reusability:** Hooks/services importable by other features

### Atomic Design Component Structure

```
/src/components/
├── atoms/                  # 34 basic UI elements
│   ├── button/
│   ├── input/
│   ├── badge/
│   └── ...
├── molecules/              # 42 composed components
│   ├── card/
│   ├── dialog/
│   ├── form/
│   └── ...
├── organisms/              # 46 complex sections
│   ├── data-table/
│   ├── calendar-grid/
│   ├── appreciation-context-panel/
│   └── ...
└── templates/              # 7 layout components
    ├── app-sidebar/
    ├── site-header/
    └── ...
```

**Import Aliases:**
```typescript
import { Button } from "@/components/atoms/button"
import { Card } from "@/components/molecules/card"
import { DataTable } from "@/components/organisms/data-table"
import { AppSidebar } from "@/components/templates/app-sidebar"
```

---

## Data Architecture

### UML Entity Model (Source of Truth)

**File:** `/src/types/uml-entities.ts`

**⚠️ CRITICAL:** This file is the single source of truth. Never modify without explicit permission.

#### Core Entities (11 entities)

```typescript
// 1. Teacher
interface Teacher {
  id: string
  email: string
  language: string
  createdAt: Date
  updatedAt: Date
}

// 2. Student
interface Student {
  id: string
  firstName: string
  lastName: string
  currentClassId: string | null
  needs: string | null
  observations: string | null
  strengths: string[] | null
  createdAt: Date
  updatedAt: Date
  fullName(): string
}

// 3. Class
interface Class {
  id: string
  classCode: string
  gradeLabel: string
  schoolYearId: string
  createdAt: Date
  updatedAt: Date
  version: number
}

// 4. Subject
interface Subject {
  id: string
  name: string
  code: string
  description: string | null
}

// 5. CourseSession
interface CourseSession {
  id: string
  sessionDate: Date
  timeSlotId: string
  teachingAssignmentId: string
  status: "planned" | "completed" | "cancelled"
  notes: string | null
  createdAt: Date
  updatedAt: Date
}

// 6. TimeSlot
interface TimeSlot {
  id: string
  startTime: string // "08:00"
  endTime: string   // "09:30"
  duration: number  // minutes
  displayOrder: number
  isPause: boolean
  dayOfWeek: number // 1-7
}

// 7. TeachingAssignment
interface TeachingAssignment {
  id: string
  teacherId: string
  classId: string
  subjectId: string
  schoolYearId: string
  isActive: boolean
  createdAt: Date
}

// 8. StudentParticipation
interface StudentParticipation {
  id: string
  courseSessionId: string
  studentId: string
  isPresent: boolean
  participationLevel: "low" | "medium" | "high" | null
  behavior: "positive" | "neutral" | "negative" | null
  cameraStatus: "on" | "off" | "technical_issue" | null
  notes: string | null
  technicalIssue: boolean
}

// 9. Exam
interface Exam {
  id: string
  title: string
  examDate: Date
  classId: string
  subjectId: string
  maxPoints: number
  coefficient: number
  examType: "quiz" | "homework" | "oral" | "project"
  isPublished: boolean
  schoolYearId: string
  createdAt: Date
}

// 10. StudentExamResult
interface StudentExamResult {
  id: string
  examId: string
  studentId: string
  points: number
  grade: string
  comment: string | null
  isAbsent: boolean
}

// 11. NotationSystem
interface NotationSystem {
  id: string
  name: string
  type: "points" | "percentage" | "letter" | "competency"
  scaleMin: number
  scaleMax: number
  passingGrade: number
  description: string | null
}

// Additional entities for AI features
interface AppreciationContent { /* ... */ }
interface StyleGuide { /* ... */ }
interface PhraseBank { /* ... */ }
```

### Database Schema

**Normalized Relational Model:**

```sql
-- Core entities
CREATE TABLE teachers (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  language TEXT DEFAULT 'fr',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

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

CREATE TABLE classes (
  id TEXT PRIMARY KEY,
  class_code TEXT NOT NULL,
  grade_label TEXT NOT NULL,
  school_year_id TEXT REFERENCES school_years(id),
  version INTEGER DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE subjects (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  code TEXT NOT NULL UNIQUE,
  description TEXT
);

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

CREATE TABLE time_slots (
  id TEXT PRIMARY KEY,
  start_time TEXT NOT NULL,
  end_time TEXT NOT NULL,
  duration INTEGER NOT NULL,
  display_order INTEGER NOT NULL,
  is_pause BOOLEAN DEFAULT FALSE,
  day_of_week INTEGER CHECK(day_of_week BETWEEN 1 AND 7)
);

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

-- Indexes for performance
CREATE INDEX idx_students_class ON students(current_class_id);
CREATE INDEX idx_sessions_date ON course_sessions(session_date);
CREATE INDEX idx_sessions_assignment ON course_sessions(teaching_assignment_id);
CREATE INDEX idx_participation_session ON student_participation(course_session_id);
CREATE INDEX idx_participation_student ON student_participation(student_id);
CREATE INDEX idx_exam_results_exam ON student_exam_results(exam_id);
CREATE INDEX idx_exam_results_student ON student_exam_results(student_id);
```

### Data Migration Strategy

**Phase 1: Mock Data → SQLite**

Current state: Mocks in `/src/features/*/mocks/`

Migration steps:
1. Create SQLite database with schema
2. Write seed script to populate from mocks
3. Update hooks to query database instead of mocks
4. Test CRUD operations

**Phase 2: SQLite → PostgreSQL**

When scaling to multiple users:
1. Export SQLite data to SQL dump
2. Create PostgreSQL schema (same structure)
3. Import data
4. Update connection string
5. Test thoroughly

**Database Abstraction Layer:**
```typescript
// /src/lib/db.ts
interface Database {
  query<T>(sql: string, params: any[]): Promise<T[]>
  execute(sql: string, params: any[]): Promise<void>
}

// Switch implementation based on env
export const db: Database = process.env.DB_TYPE === 'postgres'
  ? new PostgresDatabase()
  : new SQLiteDatabase()
```

---

## API and Interface Design

### REST API Design (Existing Rust Backend)

**Base URL:** `http://localhost:8080/api` (dev) or `https://api.outil-professor.com` (prod)

**Authentication:** Cookie-based sessions (HttpOnly, SameSite=Strict)

**Content Type:** `application/json`

### API Endpoints by Domain

#### Authentication (`/auth`)

```typescript
POST /auth/register
Request: { email: string, password: string, language?: string }
Response: { id: string, email: string }

POST /auth/login
Request: { email: string, password: string }
Response: { id: string, email: string }
Set-Cookie: session_token (HttpOnly)

GET /auth/me
Response: { id: string, email: string, language: string }
Requires: Valid session cookie

POST /auth/logout
Response: 204 No Content
```

#### Students (`/students`)

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

GET /students/:id/attendance-rate
Query: ?start_date=2024-01-01&end_date=2024-12-31
Response: { rate: number, present: number, total: number }
```

#### Classes (`/classes`)

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

GET /classes/:id/students/analytics
Query: ?start_date=2024-01-01&end_date=2024-12-31&sort_by=name
Response: { studentId: string, name: string, attendanceRate: number, avgGrade: number }[]
```

#### Course Sessions (`/course-sessions`)

```typescript
GET /course-sessions
Query: ?class_id=string&start_date=2024-01-01&end_date=2024-12-31
Response: CourseSession[]

POST /course-sessions
Request: { sessionDate: Date, timeSlotId: string, teachingAssignmentId: string }
Response: CourseSession
Validation: No conflicts, not on pause slot

GET /course-sessions/:id
Response: CourseSession (enriched with class, subject, time slot, participation count)

PUT /course-sessions/:id
Request: Partial<CourseSession>
Response: CourseSession

DELETE /course-sessions/:id
Response: 204 No Content

GET /sessions/:id/attendance
Response: { sessionId: string, students: { studentId, name, participation: StudentParticipation }[] }

PUT /sessions/:id/attendance
Request: { participations: StudentParticipation[] }
Response: 200 OK
```

#### Exams (`/exams`)

```typescript
GET /exams
Query: ?class_id=string&subject_id=string&start_date=2024-01-01
Response: Exam[]

POST /exams
Request: { title, examDate, classId, subjectId, maxPoints, coefficient, examType, schoolYearId }
Response: Exam

GET /exams/:id
Response: Exam

PUT /exams/:id
Request: Partial<Exam>
Response: Exam

DELETE /exams/:id
Response: 204 No Content

GET /exams/:id/results
Response: { examId, students: { studentId, name, result: StudentExamResult }[] }

PUT /exams/:id/results (upsert batch)
Request: { results: { studentId: string, points: number, comment?: string, isAbsent: boolean }[] }
Response: 200 OK

GET /exams/:id/stats
Response: { average: number, median: number, min: number, max: number, distribution: Record<string, number> }
```

### Error Handling

**Standard Error Response:**
```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input data",
    "details": {
      "field": "maxPoints",
      "issue": "Must be a positive number"
    }
  }
}
```

**HTTP Status Codes:**
- `200` OK - Success
- `201` Created - Resource created
- `204` No Content - Success with no body
- `400` Bad Request - Validation error
- `401` Unauthorized - Not authenticated
- `403` Forbidden - Not authorized
- `404` Not Found - Resource doesn't exist
- `409` Conflict - ETag mismatch, concurrent edit
- `500` Internal Server Error - Server error

### Frontend Data Fetching Patterns

**Server Components (SSR):**
```typescript
// Fetch on server, no loading state needed
export default async function StudentPage({ params }: { params: { id: string } }) {
  const student = await fetch(`/api/students/${params.id}`).then(r => r.json())
  return <StudentProfile student={student} />
}
```

**Client Components (CSR):**
```typescript
'use client'
export function StudentList() {
  const [students, setStudents] = useState<Student[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/students')
      .then(r => r.json())
      .then(data => setStudents(data.data))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <Skeleton />
  return <DataTable data={students} />
}
```

**With Custom Hook (Recommended):**
```typescript
export function useStudents(classId?: string) {
  const [students, setStudents] = useState<Student[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const url = classId ? `/api/students?class_id=${classId}` : '/api/students'
    fetch(url)
      .then(r => r.json())
      .then(data => setStudents(data.data))
      .catch(setError)
      .finally(() => setLoading(false))
  }, [classId])

  return { students, loading, error }
}
```

---

## Frontend Architecture

### Rendering Strategy

**Hybrid SSR + CSR:**

| Page Type | Rendering | Rationale |
|-----------|-----------|-----------|
| Student Detail | SSR | SEO, fast initial load, static content |
| Dashboard | SSR + CSR | SSR for initial stats, CSR for real-time updates |
| Calendar | CSR | Highly interactive, drag-drop (future) |
| Appreciations | CSR | Interactive form, AI generation |
| Sessions List | SSR + CSR | SSR for table data, CSR for filters |
| Evaluations | CSR | Inline editing, real-time validation |

**Implementation:**
```typescript
// app/students/[id]/page.tsx (Server Component)
export default async function StudentPage({ params }) {
  const student = await getStudent(params.id) // Server fetch
  return <StudentProfile student={student} />
}

// components/organisms/appreciation-generator.tsx (Client Component)
'use client'
export function AppreciationGenerator() {
  const [content, setContent] = useState('')
  // Interactive logic
}
```

### State Management Architecture

**Three-Layer State Strategy:**

1. **Server State (Data from API):**
   - Fetched by Server Components or client hooks
   - Cached by React (RSC) or custom caching
   - Examples: Students list, exam results

2. **Global Client State (Cross-Feature):**
   - React Context API
   - Examples: Selected class/subject, user session
   - File: `/src/contexts/class-selection-context.tsx`

3. **Local Component State:**
   - useState, useReducer
   - Examples: Form inputs, modal open/close, filters
   - Scoped to component tree

**Context Example:**
```typescript
// contexts/class-selection-context.tsx
interface ClassSelectionContextType {
  selectedClassId: string | undefined
  selectedSubjectId: string | undefined
  setSelectedClass: (id: string) => void
  setSelectedSubject: (id: string) => void
  classes: Class[]
  subjects: Subject[]
}

export const ClassSelectionContext = createContext<ClassSelectionContextType>(...)

export function ClassSelectionProvider({ children }) {
  const [selectedClassId, setSelectedClassId] = useState<string>()
  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('selectedClassId')
    if (saved) setSelectedClassId(saved)
  }, [])

  // Save to localStorage on change
  useEffect(() => {
    if (selectedClassId) {
      localStorage.setItem('selectedClassId', selectedClassId)
    }
  }, [selectedClassId])

  return (
    <ClassSelectionContext.Provider value={{ selectedClassId, ... }}>
      {children}
    </ClassSelectionContext.Provider>
  )
}

// Usage in components
export function StudentList() {
  const { selectedClassId } = useClassSelection()
  const { students } = useStudents(selectedClassId)
  return <DataTable data={students} />
}
```

### Routing Structure

**App Router File-Based Routing:**

```
/src/app/
├── layout.tsx                  # Root layout (global providers)
├── page.tsx                    # Home page (redirects to /dashboard)
├── login/
│   └── page.tsx                # Login page
└── dashboard/
    ├── layout.tsx              # Dashboard layout (sidebar, header)
    ├── page.tsx                # Redirects to /dashboard/accueil
    ├── accueil/
    │   └── page.tsx            # Dashboard home
    ├── appreciations/
    │   └── page.tsx            # AI content generation
    ├── calendrier/
    │   └── page.tsx            # Calendar view
    ├── sessions/
    │   └── page.tsx            # Session management
    ├── mes-eleves/
    │   ├── page.tsx            # Student list
    │   └── [id]/
    │       └── page.tsx        # Student detail
    ├── evaluations/
    │   └── page.tsx            # Exam & grade management
    ├── gestion/
    │   └── page.tsx            # Administrative settings
    └── reglages/
        └── page.tsx            # User settings
```

**Navigation Pattern:**
```typescript
import { useRouter } from 'next/navigation'

function StudentList() {
  const router = useRouter()

  const handleRowClick = (studentId: string) => {
    router.push(`/dashboard/mes-eleves/${studentId}`)
  }

  return <DataTable onRowClick={handleRowClick} />
}
```

### Component Communication Patterns

**Parent → Child (Props):**
```typescript
<StudentList
  students={students}
  onEdit={handleEdit}
  onDelete={handleDelete}
/>
```

**Child → Parent (Callbacks):**
```typescript
// Child
<Button onClick={() => onSave(data)}>Save</Button>

// Parent
const handleSave = (data: Student) => {
  // Update state
}
```

**Sibling → Sibling (Lift State Up):**
```typescript
function ParentComponent() {
  const [selected, setSelected] = useState<string>()

  return (
    <>
      <StudentList onSelect={setSelected} />
      <StudentDetail studentId={selected} />
    </>
  )
}
```

**Cross-Feature (Context):**
```typescript
// Feature A sets class
const { setSelectedClass } = useClassSelection()
setSelectedClass('class-123')

// Feature B reads class
const { selectedClassId } = useClassSelection()
```

### Performance Optimizations

**Code Splitting:**
```typescript
// Lazy load heavy components
const AppreciationGenerator = lazy(() => import('@/components/organisms/appreciation-generator'))

<Suspense fallback={<Skeleton />}>
  <AppreciationGenerator />
</Suspense>
```

**Memoization:**
```typescript
// Expensive calculations
const sortedStudents = useMemo(
  () => students.sort((a, b) => a.name.localeCompare(b.name)),
  [students]
)

// Callbacks
const handleDelete = useCallback(
  (id: string) => { /* ... */ },
  [dependencies]
)
```

**Virtual Scrolling (Future):**
```typescript
// For large student lists (>1000 rows)
import { useVirtualizer } from '@tanstack/react-virtual'
```

---

## Backend Architecture

### API Layer Structure (Rust)

**Existing Architecture (Brownfield):**

```
/backend
├── src/
│   ├── main.rs                 # Server entry point
│   ├── routes/                 # API route handlers
│   │   ├── auth.rs
│   │   ├── students.rs
│   │   ├── classes.rs
│   │   ├── sessions.rs
│   │   └── ...
│   ├── models/                 # Data models
│   │   ├── teacher.rs
│   │   ├── student.rs
│   │   └── ...
│   ├── services/               # Business logic
│   │   ├── auth_service.rs
│   │   ├── student_service.rs
│   │   └── ...
│   ├── db/                     # Database layer
│   │   ├── mod.rs
│   │   ├── connection.rs
│   │   └── queries.rs
│   └── utils/                  # Utilities
│       ├── error.rs
│       └── validation.rs
├── Cargo.toml                  # Dependencies
└── Cargo.lock
```

**Key Dependencies (Inferred):**
- Web framework: Actix-web or Axum
- Database: SQLx or Diesel
- Serialization: Serde
- Validation: Validator
- Error handling: Anyhow or Thiserror

### Business Logic Services (Frontend)

**Global Services** (`/src/services/`):

```typescript
// session-generator.ts
export class SessionGenerator {
  generateFromWeeklyTemplate(
    template: WeeklyTemplate,
    startDate: Date,
    endDate: Date
  ): CourseSession[] {
    // Generate recurring sessions
  }
}

// period-calculator.ts
export class PeriodCalculator {
  getCurrentAcademicPeriod(date: Date): AcademicPeriod | null {
    // Determine current trimester
  }

  getSessionsInPeriod(
    periodId: string,
    sessions: CourseSession[]
  ): CourseSession[] {
    // Filter sessions by period
  }
}

// session-makeup.ts
export class SessionMakeupService {
  findAvailableSlots(
    teachingAssignmentId: string,
    date: Date
  ): TimeSlot[] {
    // Find free time slots for rescheduling
  }
}
```

**Feature Services** (`/src/features/[feature]/services/`):

```typescript
// features/evaluations/services/notation-system-service.ts
export class NotationSystemService {
  calculateGrade(
    points: number,
    maxPoints: number,
    system: NotationSystem
  ): string {
    // Convert points to grade based on system type
  }

  convertGrade(
    grade: string,
    fromSystem: NotationSystem,
    toSystem: NotationSystem
  ): string {
    // Convert between grading systems
  }
}

// features/students/services/behavioral-analysis-service.ts
export class BehavioralAnalysisService {
  analyzeParticipation(
    participations: StudentParticipation[]
  ): BehavioralAnalysis {
    // Analyze participation patterns
    const rate = participations.filter(p => p.isPresent).length / participations.length
    const avgParticipation = // Calculate average
    const pattern = // Detect patterns
    return { rate, avgParticipation, pattern, recommendations }
  }
}

// features/students/services/academic-analysis-service.ts
export class AcademicAnalysisService {
  analyzePerformance(
    results: StudentExamResult[]
  ): AcademicAnalysis {
    // Calculate averages, trends, identify strengths/weaknesses
  }
}

// features/students/services/student-profile-service.ts
export class StudentProfileService {
  generateProfile(
    student: Student,
    participations: StudentParticipation[],
    results: StudentExamResult[]
  ): StudentProfile {
    // Orchestrate behavioral + academic analysis
    const behavioral = behavioralAnalysisService.analyze(participations)
    const academic = academicAnalysisService.analyze(results)
    return { student, behavioral, academic, summary: generateSummary() }
  }
}

// features/appreciations/services/appreciation-generator.ts
export class AppreciationGeneratorService {
  generateAppreciation(
    student: Student,
    profile: StudentProfile,
    styleGuide: StyleGuide,
    phraseBank: PhraseBank[]
  ): string {
    // AI-powered content generation
    const context = this.buildContext(student, profile)
    const phrases = this.selectContextualPhrases(context, phraseBank)
    const structure = this.buildStructure(styleGuide)
    return this.generate(context, phrases, structure)
  }
}
```

---

## Cross-Cutting Concerns

### Authentication & Authorization

**Strategy:** Backend Rust API with JWT + HttpOnly cookies (already implemented)

**Backend Implementation (Existing):**
- **POST /auth/register**: Teacher registration with email + password
- **POST /auth/login**: Login with JWT generation, sets `auth_token` HttpOnly cookie (24h, SameSite=Lax)
- **GET /auth/me**: Get user profile (requires valid JWT cookie)
- **Row-Level Security (RLS)**: PostgreSQL enforces data isolation per user_id
- **Audit Logging**: All auth events logged to database

**Frontend Implementation:**
```typescript
// lib/api.ts - API client with cookie support
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'

export async function fetchAPI(endpoint: string, options: RequestInit = {}) {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    credentials: 'include', // CRITICAL: Send auth_token cookie
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

// contexts/auth-context.tsx - React context for user state
'use client'

import { createContext, useContext, useState, useEffect } from 'react'
import { fetchAPI } from '@/lib/api'

interface User {
  id: string
  email: string
  display_name: string
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Fetch current user on mount
    fetchAPI('/auth/me')
      .then(setUser)
      .catch(() => setUser(null))
      .finally(() => setLoading(false))
  }, [])

  const login = async (email: string, password: string) => {
    const data = await fetchAPI('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    })
    setUser(data.user)
  }

  const logout = async () => {
    // Clear cookie client-side
    document.cookie = 'auth_token=; Max-Age=0; path=/'
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
```

**Protected Routes (Middleware):**
```typescript
// middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const authToken = request.cookies.get('auth_token')

  if (!authToken) {
    return NextResponse.redirect(new URL('/auth/login', request.url))
  }

  // Verify token with backend
  try {
    const response = await fetch('http://localhost:8080/auth/me', {
      headers: { cookie: `auth_token=${authToken.value}` },
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

**Authorization (Future):**
```typescript
// Multi-teacher support (future)
interface Permission {
  resource: 'student' | 'class' | 'exam'
  action: 'read' | 'create' | 'update' | 'delete'
}

function hasPermission(user: User, permission: Permission): boolean {
  // Check if user can perform action on resource
}
```

### Error Handling

**Global Error Boundary:**
```typescript
// app/error.tsx
'use client'
export default function Error({
  error,
  reset,
}: {
  error: Error
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h2 className="text-2xl font-bold mb-4">Une erreur est survenue</h2>
      <p className="text-muted-foreground mb-4">{error.message}</p>
      <Button onClick={reset}>Réessayer</Button>
    </div>
  )
}
```

**API Error Handling:**
```typescript
// lib/api.ts
export class ApiError extends Error {
  constructor(
    public statusCode: number,
    public code: string,
    message: string,
    public details?: any
  ) {
    super(message)
  }
}

export async function fetchAPI<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const response = await fetch(`/api${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  })

  if (!response.ok) {
    const error = await response.json()
    throw new ApiError(
      response.status,
      error.error.code,
      error.error.message,
      error.error.details
    )
  }

  return response.json()
}

// Usage
try {
  const students = await fetchAPI<Student[]>('/students')
} catch (error) {
  if (error instanceof ApiError) {
    if (error.statusCode === 401) {
      router.push('/login')
    } else {
      toast.error(error.message)
    }
  }
}
```

### Logging & Monitoring

**Console Logging (Development):**
```typescript
// lib/logger.ts
export const logger = {
  info: (message: string, data?: any) => {
    console.log(`[INFO] ${message}`, data)
  },
  warn: (message: string, data?: any) => {
    console.warn(`[WARN] ${message}`, data)
  },
  error: (message: string, error?: Error) => {
    console.error(`[ERROR] ${message}`, error)
  },
}
```

**Structured Logging (Production - Future):**
```typescript
// Use Pino or Winston for structured JSON logs
import pino from 'pino'

export const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
  transport: process.env.NODE_ENV === 'development'
    ? { target: 'pino-pretty' }
    : undefined,
})
```

**Error Tracking (Future):**
- Sentry for frontend error tracking
- Backend logs to CloudWatch/Grafana

### Caching Strategy

**Browser Caching:**
- Static assets: Cache-Control max-age=31536000 (1 year)
- API responses: no-cache (always revalidate)

**Application Caching (Future):**
```typescript
// React Query for server state caching
import { useQuery } from '@tanstack/react-query'

export function useStudents(classId?: string) {
  return useQuery({
    queryKey: ['students', classId],
    queryFn: () => fetchAPI<Student[]>(`/students?class_id=${classId}`),
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}
```

### Data Backup & Recovery

**Backup Strategy:**

1. **Automatic Backups:**
   - Database: Daily automated backups
   - Retention: 30 days

2. **Manual Export:**
   - User-triggered export (JSON/CSV)
   - File: `outil-professor-backup-2024-10-14.json`

3. **Recovery:**
   - Import from backup file
   - Restore database from snapshot

**Implementation:**
```typescript
// services/backup-service.ts
export class BackupService {
  async exportAllData(): Promise<Blob> {
    const data = {
      version: '1.0',
      exportDate: new Date().toISOString(),
      teachers: await fetchAPI('/teachers'),
      students: await fetchAPI('/students'),
      classes: await fetchAPI('/classes'),
      sessions: await fetchAPI('/sessions'),
      exams: await fetchAPI('/exams'),
      // ... all entities
    }

    return new Blob([JSON.stringify(data, null, 2)], {
      type: 'application/json'
    })
  }

  async importData(file: File): Promise<void> {
    const text = await file.text()
    const data = JSON.parse(text)

    // Validate version
    if (data.version !== '1.0') {
      throw new Error('Incompatible backup version')
    }

    // Import entities in order (respecting foreign keys)
    await this.importTeachers(data.teachers)
    await this.importClasses(data.classes)
    await this.importStudents(data.students)
    // ... etc
  }
}
```

### Internationalization (i18n) - Future

**Current:** French-only interface

**Future Enhancement:**
```typescript
// Using next-intl
import { useTranslations } from 'next-intl'

export function StudentList() {
  const t = useTranslations('students')

  return (
    <h1>{t('title')}</h1> // "Mes élèves" in French, "My Students" in English
  )
}
```

**Supported Languages (Roadmap):**
- French (default)
- English
- Spanish

---

## Component and Integration Overview

### Epic-to-Component Mapping

| Epic | Features | Frontend Components | Backend APIs | Services |
|------|----------|-------------------|--------------|----------|
| **Epic 1: Fondations** | Auth, Classes, Students, Subjects, Teaching Assignments | LoginForm, ClassList, StudentList, SubjectSelector | /auth, /classes, /students, /subjects, /teaching-assignments | User management, CRUD operations |
| **Epic 2: Sessions & Présences** | Calendar, Session planning, Attendance tracking | CalendarGrid, SessionCard, SessionModal, ParticipationTracker | /course-sessions, /time-slots, /weekly-templates, /attendance | SessionGenerator, TimeSlotManager |
| **Epic 3: Évaluations & Analytics** | Exams, Grading, Student analytics, Profiles | ExamPanel, ResultsTable, GradeInput, StudentProfileCard, AnalyticsSection | /exams, /exam-results, /students/analytics | NotationSystem, BehavioralAnalysis, AcademicAnalysis |
| **Epic 4: Génération IA** | Appreciation generation, Style guides, Phrase banks | AppreciationGenerator, ContextPanel, StyleGuideEditor, PhraseBankEditor | Future: /appreciations, /style-guides, /phrase-banks | AppreciationGenerator, ContentEngine |
| **Epic 5: Dashboard & UX** | Dashboard, Stats, Navigation | DashboardStats, SessionsTable, Sidebar, Header | Aggregation from all endpoints | DashboardAggregation |

### External Service Integrations

#### AI/LLM API (Future)

**Purpose:** Generate student appreciations

**Options:**
- OpenAI GPT-4
- Anthropic Claude
- Local LLM (Ollama)

**Integration:**
```typescript
// services/ai-service.ts
interface AIProvider {
  generateText(prompt: string, context: any): Promise<string>
}

class OpenAIProvider implements AIProvider {
  async generateText(prompt: string, context: any): Promise<string> {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [
          { role: 'system', content: 'You are a helpful teacher assistant.' },
          { role: 'user', content: prompt },
        ],
      }),
    })

    const data = await response.json()
    return data.choices[0].message.content
  }
}

// Usage in appreciation generator
const aiProvider = new OpenAIProvider()
const prompt = buildPrompt(student, profile, styleGuide)
const content = await aiProvider.generateText(prompt, context)
```

#### PDF Generation

**Purpose:** Export reports and appreciations

**Library:** jsPDF or Puppeteer

**Implementation:**
```typescript
// services/pdf-service.ts
import jsPDF from 'jspdf'

export class PDFService {
  generateAppreciationPDF(
    student: Student,
    appreciation: string,
    metadata: any
  ): Blob {
    const doc = new jsPDF()

    // Header
    doc.setFontSize(16)
    doc.text('Appréciation Trimestrielle', 20, 20)

    // Student info
    doc.setFontSize(12)
    doc.text(`Élève: ${student.fullName()}`, 20, 40)
    doc.text(`Classe: ${metadata.className}`, 20, 50)
    doc.text(`Période: ${metadata.period}`, 20, 60)

    // Appreciation content
    doc.setFontSize(10)
    const lines = doc.splitTextToSize(appreciation, 170)
    doc.text(lines, 20, 80)

    // Footer
    doc.text(`Généré le ${new Date().toLocaleDateString('fr-FR')}`, 20, 280)

    return doc.output('blob')
  }
}

// Usage
const pdfService = new PDFService()
const blob = pdfService.generateAppreciationPDF(student, appreciation, metadata)
const url = URL.createObjectURL(blob)
window.open(url, '_blank')
```

#### Email Notifications (Future)

**Purpose:** Send reports to parents

**Service:** SendGrid, Resend, or Nodemailer

**Implementation:**
```typescript
// services/email-service.ts
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export class EmailService {
  async sendAppreciation(
    parentEmail: string,
    student: Student,
    appreciation: string,
    attachmentBlob: Blob
  ): Promise<void> {
    await resend.emails.send({
      from: 'teacher@outil-professor.com',
      to: parentEmail,
      subject: `Appréciation de ${student.firstName} - ${new Date().toLocaleDateString('fr-FR')}`,
      html: `
        <p>Bonjour,</p>
        <p>Veuillez trouver ci-joint l'appréciation de ${student.fullName()}.</p>
        <p>Cordialement,</p>
      `,
      attachments: [
        {
          filename: `appreciation-${student.lastName}.pdf`,
          content: await attachmentBlob.arrayBuffer(),
        },
      ],
    })
  }
}
```

---

## Architecture Decision Records

### ADR-001: Modular Monolith vs Microservices

**Status:** Accepted

**Context:**
Project is solo-developed with 60-100 students, 3-5 classes. Need rapid development with simple deployment.

**Decision:**
Use Modular Monolith architecture with separated frontend (Next.js) and backend (Rust API).

**Rationale:**
- **Simplicity:** Single deployable unit, easier debugging
- **Performance:** No network overhead between modules
- **Team Size:** Solo/small team doesn't benefit from microservices isolation
- **Modularity:** Feature-based modules provide sufficient separation
- **Migration Path:** Can extract modules to microservices if needed later

**Consequences:**
- (+) Faster development, simpler deployment
- (+) No distributed system complexity
- (+) Lower infrastructure costs
- (-) Harder to scale individual modules
- (-) Risk of tight coupling without discipline

---

### ADR-002: SQLite vs PostgreSQL

**Status:** Accepted (Phase 1: SQLite, Phase 2: PostgreSQL)

**Context:**
Need local-first database for MVP, with cloud sync for future multi-user support.

**Decision:**
Start with SQLite for MVP, migrate to PostgreSQL for production.

**Rationale:**
- **SQLite Pros:** Serverless, single file, perfect for local-first, fast
- **SQLite Cons:** Limited concurrent writes, no network access
- **PostgreSQL Pros:** Multi-user, advanced features, cloud-ready
- **Migration Path:** Database abstraction layer makes switch seamless

**Consequences:**
- (+) MVP: Zero infrastructure costs, offline-first works perfectly
- (+) Production: Can scale to multiple teachers, cloud sync
- (-) Migration effort (estimated 2-4 days)
- (-) Need to maintain abstraction layer

---

### ADR-003: shadcn/ui vs Other Component Libraries

**Status:** Accepted

**Context:**
Need accessible, customizable UI components for complex dashboard interface.

**Decision:**
Use shadcn/ui (Radix UI primitives + Tailwind) over Material-UI, Ant Design, or Chakra UI.

**Rationale:**
- **Copy-Paste Ownership:** Full control, no black box, no version lock-in
- **Accessibility:** Radix UI provides WCAG 2.1 AA compliance out-of-box
- **Customization:** Tailwind styling allows infinite flexibility
- **Bundle Size:** Only include components you use, no bloat
- **DX:** Excellent TypeScript support, great documentation

**Consequences:**
- (+) Full ownership of components
- (+) Accessibility guarantees
- (+) Tailwind integration
- (-) Manual updates (not NPM package)
- (-) Need to copy new components manually

---

### ADR-004: React Hook Form + Zod vs Formik

**Status:** Accepted

**Context:**
Multiple complex forms (exam creation, grade entry, student profiles) requiring validation.

**Decision:**
Use React Hook Form + Zod for all form handling.

**Rationale:**
- **Performance:** Uncontrolled components, minimal re-renders
- **Type Safety:** Zod schemas infer TypeScript types automatically
- **DX:** Better error handling than Formik, cleaner API
- **Bundle Size:** Smaller than Formik (9KB vs 13KB)
- **Integration:** Works seamlessly with shadcn/ui form components

**Consequences:**
- (+) Fast forms with minimal re-renders
- (+) Type-safe validation
- (+) Great DX
- (-) Learning curve for Zod schema syntax

---

### ADR-005: Server Components vs Client Components

**Status:** Accepted (Hybrid Approach)

**Context:**
Next.js 15 App Router supports both Server Components (SSR) and Client Components (CSR).

**Decision:**
Use hybrid approach: Server Components for static content, Client Components for interactivity.

**Rationale:**
- **Server Components:** Fast initial load, SEO-friendly, reduce bundle size
- **Client Components:** Interactivity, real-time updates, local state
- **Hybrid Benefits:** Best of both worlds, optimize per-page needs

**Usage Guidelines:**
- Server Components: Student profiles, reports, static dashboards
- Client Components: Forms, calendar, appreciations, real-time updates

**Consequences:**
- (+) Optimal performance
- (+) Reduced JavaScript bundle
- (-) Need to understand Server vs Client component boundaries
- (-) Cannot use hooks in Server Components

---

### ADR-006: Backend Rust Auth vs Frontend Auth Libraries

**Status:** Accepted (REVISED 2025-10-14)

**Context:**
Need authentication system for teacher login with cookie-based sessions. **Existing Rust backend (Souz) already implements complete JWT-based authentication.**

**Decision:**
Use existing Rust backend authentication instead of Better Auth, NextAuth, or other frontend auth libraries.

**Rationale:**
- **Already Implemented:** Rust backend has POST /auth/register, POST /auth/login, GET /auth/me fully operational
- **JWT + HttpOnly Cookies:** Backend sets `auth_token` cookie with JWT (24h expiration, SameSite=Lax)
- **Row-Level Security (RLS):** PostgreSQL RLS enforces data isolation per user
- **Audit Logging:** All auth events logged (registration, login attempts, profile access)
- **Type-Safe:** Rust type system prevents auth bugs
- **Frontend Simplicity:** Next.js only needs login forms + `fetchAPI()` with `credentials: 'include'`
- **No Duplication:** No need for Better Auth / NextAuth when backend handles everything

**Frontend Implementation:**
```typescript
// lib/api.ts - API client with cookie support
export async function fetchAPI(endpoint: string, options: RequestInit = {}) {
  return fetch(`http://localhost:8080${endpoint}`, {
    ...options,
    credentials: 'include', // CRITICAL: Send auth_token cookie
  })
}

// contexts/auth-context.tsx - React context for user state
export const useAuth = () => {
  const [user, setUser] = useState(null)
  useEffect(() => {
    fetchAPI('/auth/me').then(setUser)
  }, [])
  return { user, login, logout }
}

// middleware.ts - Protect dashboard routes
export async function middleware(request: NextRequest) {
  const authToken = request.cookies.get('auth_token')
  if (!authToken) {
    return NextResponse.redirect(new URL('/auth/login', request.url))
  }
}
```

**Consequences:**
- (+) **Simplification:** ~2-3 days saved by not setting up Better Auth
- (+) **Consistency:** Single source of auth truth (backend)
- (+) **Security:** Rust type system + RLS + audit logging
- (+) **No Duplication:** Frontend doesn't replicate auth logic
- (-) **CORS Required:** Backend must allow `http://localhost:3000` origin
- (-) **Cookie Handling:** Frontend must use `credentials: 'include'` everywhere

---

### ADR-007: Biome vs ESLint + Prettier

**Status:** Accepted

**Context:**
Need linting and formatting for code quality.

**Decision:**
Use Biome (replaces ESLint + Prettier).

**Rationale:**
- **Speed:** 100x faster than ESLint
- **All-in-One:** Linting + formatting in single tool
- **Zero Config:** Works out-of-box for Next.js
- **Written in Rust:** Fast, reliable

**Consequences:**
- (+) Extremely fast linting/formatting
- (+) Single tool to maintain
- (+) Auto-fix most issues
- (-) Fewer rules than ESLint (but covers essentials)
- (-) Smaller ecosystem

---

### ADR-008: No Unit Tests (Per User Preference)

**Status:** Accepted

**Context:**
User explicitly requested no test coverage requirements.

**Decision:**
Skip unit/integration tests for frontend. Use E2E tests (Playwright) for critical flows only.

**Rationale:**
- **User Preference:** Explicit requirement to avoid test overhead
- **Solo Development:** Slower iteration with test writing
- **E2E Coverage:** Critical user flows tested end-to-end
- **Type Safety:** TypeScript catches many bugs at compile-time

**Consequences:**
- (+) Faster development velocity
- (+) No test maintenance overhead
- (-) Higher risk of regressions
- (-) Manual testing required
- (-) Harder to refactor with confidence

**Mitigation:**
- Use TypeScript strict mode
- E2E tests for critical flows (appreciation generation, exam grading)
- Manual testing checklist before releases

---

### ADR-009: Local-First Architecture

**Status:** Accepted

**Context:**
Teacher needs offline capability, zero data loss tolerance, fast response times.

**Decision:**
Implement local-first architecture with background sync.

**Rationale:**
- **Offline Support:** Works without internet connection
- **Performance:** No network latency for reads/writes
- **Data Safety:** Local SQLite as source of truth
- **Background Sync:** Sync to cloud when online (future)

**Implementation:**
```typescript
// Write to local SQLite immediately
await db.execute('INSERT INTO students ...')

// Queue for background sync (future)
syncQueue.add({ operation: 'create', entity: 'student', data })
```

**Consequences:**
- (+) Zero latency for operations
- (+) Offline-first guarantees
- (+) No network failures during use
- (-) Sync complexity (future)
- (-) Conflict resolution needed (future)

---

## Implementation Guidance

### Development Workflow

**1. Environment Setup:**
```bash
# Clone repository
git clone https://github.com/user/outil-professor.git
cd outil-professor

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env: Add BETTER_AUTH_SECRET, DATABASE_URL

# Start development server
npm run dev
# Opens http://localhost:3000
```

**2. Feature Development Pattern:**

```bash
# Create feature branch
git checkout -b feature/epic-3-student-analytics

# Develop in feature module
/src/features/students/
├── hooks/
│   └── use-student-analytics.ts  # Create new hook
├── services/
│   └── analytics-service.ts      # Create new service
└── mocks/
    └── mock-analytics-data.ts    # Create mock data

# Create UI components
/src/components/organisms/
└── student-analytics-section/
    ├── student-analytics-section.tsx
    └── index.ts

# Integrate in page
/src/app/dashboard/mes-eleves/[id]/page.tsx
```

**3. Testing Checklist (Manual):**
- [ ] Page loads without errors
- [ ] All interactive elements respond
- [ ] Forms validate correctly
- [ ] Error states display properly
- [ ] Loading states appear
- [ ] Responsive on mobile/tablet
- [ ] Dark mode works
- [ ] Accessibility (keyboard nav, screen reader)

**4. Commit Convention:**
```bash
# Format: <type>: <description>
git commit -m "feat: add student analytics section"
git commit -m "fix: correct grade calculation in notation system"
git commit -m "docs: update architecture decision records"
git commit -m "refactor: simplify appreciation generation logic"
```

**5. Code Review Checklist:**
- [ ] TypeScript strict mode passes
- [ ] Biome linting passes (`npm run lint`)
- [ ] No console errors in browser
- [ ] Components use Tailwind (no inline styles)
- [ ] Accessible (ARIA labels, keyboard nav)
- [ ] Responsive breakpoints handled
- [ ] Error boundaries in place

### Epic Implementation Order

**Recommended Sequence:**

**Phase 1: Foundation (Weeks 1-2)**
- Epic 1: Fondations
  - Set up auth with Better Auth
  - Create CRUD for Classes, Students, Subjects
  - Implement Teaching Assignments
  - Migrate mocks to SQLite

**Phase 2: Core Features (Weeks 3-6)**
- Epic 2: Sessions & Présences
  - Build calendar UI
  - Implement session planning
  - Create attendance tracking
- Epic 3: Évaluations & Analytics (Part 1)
  - Exam management
  - Grade entry system
  - Notation systems

**Phase 3: Advanced Features (Weeks 7-10)**
- Epic 3: Évaluations & Analytics (Part 2)
  - Student analytics (behavioral + academic)
  - Automated profile generation
- Epic 4: Génération IA
  - Appreciation generator
  - Style guides and phrase banks
  - Context panel UI

**Phase 4: Polish (Weeks 11-12)**
- Epic 5: Dashboard & UX
  - Dashboard widgets
  - Performance optimization
  - Accessibility audit
  - E2E tests for critical flows

### Database Migration Path

**Step 1: Create SQLite Schema**
```sql
-- Execute schema creation script
sqlite3 ./data/outil-professor.db < schema.sql
```

**Step 2: Seed Initial Data**
```typescript
// scripts/seed-database.ts
import { db } from '@/lib/db'
import { MOCK_STUDENTS, MOCK_CLASSES } from '@/features/*/mocks'

async function seed() {
  // Insert teachers
  await db.execute('INSERT INTO teachers ...')

  // Insert classes
  for (const cls of MOCK_CLASSES) {
    await db.execute('INSERT INTO classes ...')
  }

  // Insert students
  for (const student of MOCK_STUDENTS) {
    await db.execute('INSERT INTO students ...')
  }
}

seed()
```

**Step 3: Update Hooks to Query Database**
```typescript
// Before (mocks)
const students = MOCK_STUDENTS

// After (database)
const students = await db.query<Student>('SELECT * FROM students')
```

**Step 4: Test CRUD Operations**
```typescript
// Create
const newStudent = await db.execute(
  'INSERT INTO students (id, first_name, last_name) VALUES (?, ?, ?)',
  [id, firstName, lastName]
)

// Read
const student = await db.query<Student>(
  'SELECT * FROM students WHERE id = ?',
  [id]
)

// Update
await db.execute(
  'UPDATE students SET first_name = ? WHERE id = ?',
  [firstName, id]
)

// Delete
await db.execute('DELETE FROM students WHERE id = ?', [id])
```

### Deployment Strategy

**Development:**
```bash
npm run dev  # http://localhost:3000
```

**Production (Vercel):**
```bash
# Push to GitHub
git push origin main

# Vercel auto-deploys on push
# Or manual deploy:
vercel --prod
```

**Environment Variables (Production):**
```env
BETTER_AUTH_SECRET=<generate with openssl rand -hex 32>
DATABASE_URL=<PostgreSQL connection string>
NODE_ENV=production
```

---

## Proposed Source Tree

```
/outil-professor
├── .next/                          # Next.js build output (gitignored)
├── .claude/                        # Claude Code configuration
├── node_modules/                   # Dependencies (gitignored)
├── public/                         # Static assets
│   ├── avatars/                    # Student/teacher photos
│   ├── icons/                      # App icons
│   └── images/                     # Static images
├── src/
│   ├── app/                        # Next.js App Router
│   │   ├── layout.tsx              # Root layout (providers)
│   │   ├── page.tsx                # Home (redirect to /dashboard)
│   │   ├── globals.css             # Global styles (Tailwind + tokens)
│   │   ├── login/
│   │   │   └── page.tsx            # Login page
│   │   └── dashboard/
│   │       ├── layout.tsx          # Dashboard layout (sidebar, header)
│   │       ├── page.tsx            # Dashboard redirect
│   │       ├── accueil/
│   │       │   └── page.tsx        # Dashboard home
│   │       ├── appreciations/
│   │       │   └── page.tsx        # AI content generation
│   │       ├── calendrier/
│   │       │   └── page.tsx        # Calendar view
│   │       ├── sessions/
│   │       │   └── page.tsx        # Session management
│   │       ├── mes-eleves/
│   │       │   ├── page.tsx        # Student list
│   │       │   └── [id]/
│   │       │       └── page.tsx    # Student detail
│   │       ├── evaluations/
│   │       │   └── page.tsx        # Exam & grading
│   │       ├── gestion/
│   │       │   └── page.tsx        # Admin settings
│   │       └── reglages/
│   │           └── page.tsx        # User settings
│   ├── components/                 # Atomic Design components
│   │   ├── atoms/                  # 34 basic UI elements
│   │   │   ├── button/
│   │   │   │   ├── button.tsx
│   │   │   │   └── index.ts
│   │   │   ├── input/
│   │   │   ├── badge/
│   │   │   ├── avatar/
│   │   │   ├── checkbox/
│   │   │   ├── label/
│   │   │   ├── skeleton/
│   │   │   └── ... (31 more)
│   │   ├── molecules/              # 42 composed components
│   │   │   ├── card/
│   │   │   ├── dialog/
│   │   │   ├── form/
│   │   │   ├── table/
│   │   │   ├── tabs/
│   │   │   ├── dropdown-menu/
│   │   │   ├── select/
│   │   │   ├── sonner/             # Toast notifications
│   │   │   └── ... (35 more)
│   │   ├── organisms/              # 46 complex sections
│   │   │   ├── data-table/
│   │   │   ├── dashboard-stats/
│   │   │   ├── calendar-grid/
│   │   │   ├── calendar-header/
│   │   │   ├── session-card/
│   │   │   ├── session-modal/
│   │   │   ├── participation-tracker/
│   │   │   ├── student-list/
│   │   │   ├── student-profile-card/
│   │   │   ├── student-analytics-section/
│   │   │   ├── student-performance-chart/
│   │   │   ├── exam-management-panel/
│   │   │   ├── student-results-table/
│   │   │   ├── grade-entry-form/
│   │   │   ├── appreciation-generator/
│   │   │   ├── appreciation-context-panel/
│   │   │   ├── style-guide-editor/
│   │   │   ├── phrase-bank-editor/
│   │   │   └── ... (28 more)
│   │   └── templates/              # 7 layout components
│   │       ├── app-sidebar/
│   │       ├── site-header/
│   │       ├── nav-main/
│   │       ├── nav-user/
│   │       ├── nav-secondary/
│   │       ├── class-selector-dropdown/
│   │       └── team-switcher/
│   ├── features/                   # Feature-based modules
│   │   ├── auth/
│   │   │   ├── hooks/
│   │   │   │   └── use-auth.ts
│   │   │   ├── mocks/
│   │   │   │   └── mock-users.ts
│   │   │   └── index.ts
│   │   ├── gestion/
│   │   │   ├── hooks/
│   │   │   │   └── use-teaching-assignments.ts
│   │   │   ├── mocks/
│   │   │   │   ├── mock-teaching-assignments.ts
│   │   │   │   ├── mock-subjects.ts
│   │   │   │   └── index.ts
│   │   │   └── index.ts
│   │   ├── calendar/
│   │   │   ├── hooks/
│   │   │   │   ├── use-calendar.ts
│   │   │   │   └── use-timeslots.ts
│   │   │   ├── mocks/
│   │   │   │   ├── mock-time-slots.ts
│   │   │   │   ├── mock-weekly-templates.ts
│   │   │   │   └── index.ts
│   │   │   └── index.ts
│   │   ├── sessions/
│   │   │   ├── hooks/
│   │   │   │   └── use-dashboard-sessions.ts
│   │   │   ├── mocks/
│   │   │   │   ├── mock-sessions.ts
│   │   │   │   └── index.ts
│   │   │   └── index.ts
│   │   ├── students/
│   │   │   ├── hooks/
│   │   │   │   ├── use-student-analytics.ts
│   │   │   │   └── use-student-profile-generation.ts
│   │   │   ├── mocks/
│   │   │   │   ├── mock-students.ts
│   │   │   │   ├── mock-student-participation.ts
│   │   │   │   ├── mock-student-profiles.ts
│   │   │   │   └── index.ts
│   │   │   ├── services/
│   │   │   │   ├── behavioral-analysis-service.ts
│   │   │   │   ├── academic-analysis-service.ts
│   │   │   │   └── student-profile-service.ts
│   │   │   └── index.ts
│   │   ├── evaluations/
│   │   │   ├── hooks/
│   │   │   │   ├── use-exam-management.ts
│   │   │   │   ├── use-grade-management.ts
│   │   │   │   ├── use-notation-system.ts
│   │   │   │   └── use-rubric-management.ts
│   │   │   ├── mocks/
│   │   │   │   ├── mock-exams.ts
│   │   │   │   ├── mock-exam-results.ts
│   │   │   │   └── index.ts
│   │   │   ├── services/
│   │   │   │   └── notation-system-service.ts
│   │   │   ├── utils/
│   │   │   │   └── grade-calculations.ts
│   │   │   └── index.ts
│   │   ├── appreciations/
│   │   │   ├── hooks/
│   │   │   │   ├── use-appreciation-generation.ts
│   │   │   │   ├── use-style-guides.ts
│   │   │   │   └── use-phrase-bank.ts
│   │   │   ├── mocks/
│   │   │   │   ├── mock-appreciations.ts
│   │   │   │   ├── mock-style-guides.ts
│   │   │   │   ├── mock-phrase-banks.ts
│   │   │   │   └── index.ts
│   │   │   ├── services/
│   │   │   │   └── appreciation-generator.ts
│   │   │   └── index.ts
│   │   ├── accueil/
│   │   │   ├── hooks/
│   │   │   │   └── use-dashboard-data.ts
│   │   │   ├── mocks/
│   │   │   │   └── mock-dashboard-data.ts
│   │   │   └── index.ts
│   │   └── settings/
│   │       ├── hooks/
│   │       │   └── use-user-session.ts
│   │       ├── mocks/
│   │       │   └── mock-settings.ts
│   │       └── index.ts
│   ├── shared/                     # Shared utilities
│   │   └── hooks/                  # Cross-feature hooks
│   │       ├── use-async-operation.ts
│   │       ├── use-base-management.ts
│   │       ├── use-crud-operations.ts
│   │       ├── use-entity-state.ts
│   │       ├── use-mobile.ts
│   │       ├── use-modal.ts
│   │       ├── use-page-title.tsx
│   │       ├── use-set-page-title.ts
│   │       ├── use-smart-filtering.ts
│   │       ├── use-validation.ts
│   │       └── index.ts
│   ├── contexts/                   # Global contexts
│   │   └── class-selection-context.tsx
│   ├── services/                   # Global business logic
│   │   ├── session-generator.ts
│   │   ├── period-calculator.ts
│   │   ├── session-makeup.ts
│   │   ├── backup-service.ts       # Future
│   │   ├── pdf-service.ts          # Future
│   │   ├── email-service.ts        # Future
│   │   └── ai-service.ts           # Future
│   ├── types/                      # TypeScript types
│   │   └── uml-entities.ts         # ⚠️ SOURCE OF TRUTH
│   ├── lib/                        # Libraries
│   │   ├── auth.ts                 # Better Auth server config
│   │   ├── auth-client.ts          # Better Auth client
│   │   ├── db.ts                   # Database abstraction
│   │   ├── api.ts                  # API client utilities
│   │   ├── logger.ts               # Logging utilities
│   │   └── utils.ts                # General utilities (cn, etc.)
│   └── utils/                      # Domain utilities
│       ├── date-utils.ts
│       ├── entity-lookups.ts
│       ├── session-resolver.ts
│       └── teaching-assignment-filters.ts
├── docs/                           # Documentation
│   ├── PRD.md                      # Product Requirements
│   ├── epics.md                    # Epic breakdown
│   ├── ux-specification.md         # UX/UI specification
│   ├── solution-architecture.md    # This document
│   ├── product-brief-*.md          # Product brief
│   ├── project-workflow-analysis.md # Project analysis
│   ├── database-schema.md          # Database documentation
│   ├── uml-diagram.md              # UML diagrams
│   └── technical-decisions-template.md
├── scripts/                        # Utility scripts
│   ├── seed-database.ts            # Database seeding
│   └── migrate-to-postgres.ts      # Migration script (future)
├── data/                           # Local data (gitignored)
│   ├── outil-professor.db          # SQLite database
│   └── backups/                    # Database backups
├── .env.example                    # Environment template
├── .env                            # Environment variables (gitignored)
├── .gitignore                      # Git ignore rules
├── biome.json                      # Biome configuration
├── components.json                 # shadcn/ui configuration
├── next.config.ts                  # Next.js configuration
├── package.json                    # NPM dependencies
├── tailwind.config.ts              # Tailwind configuration
├── tsconfig.json                   # TypeScript configuration
├── README.md                       # Project overview
└── CLAUDE.md                       # Project instructions for Claude
```

**Total Structure:**
- **8 Feature Modules** with self-contained hooks, mocks, services
- **129 UI Components** organized in Atomic Design
- **7 Page Routes** in App Router
- **11 UML Entities** (source of truth)
- **15+ Shared Hooks** for cross-feature functionality
- **6 Global Services** for business logic
- **Complete Documentation** (5 major docs)

---

## Summary

This architecture document provides a complete blueprint for the **outil-professor** educational management platform. The system combines modern web technologies (Next.js 15, React 19, TypeScript, Tailwind CSS, Rust API) with thoughtful architectural decisions optimized for a solo-developed, local-first application.

**Key Architectural Highlights:**

1. **Modular Monolith** with feature-based organization
2. **Atomic Design** for 129 reusable UI components
3. **Hybrid SSR/CSR** rendering for optimal performance
4. **Local-First** architecture with SQLite → PostgreSQL migration path
5. **Type-Safe** end-to-end with TypeScript + Zod validation
6. **Accessible** by default (WCAG 2.1 AA via Radix UI)
7. **AI-Powered** content generation for student appreciations

**Next Steps:**
1. Review and validate this architecture document
2. Create tech-specs per epic (Step 9 in workflow)
3. Begin implementation starting with Epic 1 (Fondations)

---

**Document Status:** ✅ Complete - Ready for Epic Tech Spec Generation

**Generated:** 2025-10-14
**Based On:**
- PRD: `/docs/PRD.md`
- UX Spec: `/docs/ux-specification.md`
- Project Analysis: `/docs/project-workflow-analysis.md`
- Codebase Analysis: Comprehensive brownfield analysis

