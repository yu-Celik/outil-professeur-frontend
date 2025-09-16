# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Next.js 15 application built with TypeScript, featuring a comprehensive educational management dashboard. The project implements a complete teacher interface for student management, evaluations, and calendar scheduling. Built with Turbopack and follows Atomic Design principles for component organization.

### Recent Major Updates
- **✅ Feature-based Architecture Enhancement**: Complete refactoring with self-contained feature modules for students, evaluations, sessions
- **✅ Student Analytics Services**: Behavioral and academic analysis services with automated profile generation
- **✅ Mock Data Architecture**: Comprehensive test data generation with 300+ participation records and realistic exam results
- **✅ Cross-Feature Integration**: Unified data flow between students, sessions, and evaluations features
- **✅ Service Layer Implementation**: Business logic services for complex calculations and data processing

## Development Commands

```bash
# Start development server with Turbopack
npm run dev

# Build for production with Turbopack
npm run build

# Start production server
npm run start

# Run linting and formatting with Biome
npm run lint
npm run format

**Required Environment Variables:**
- `BETTER_AUTH_SECRET`: Secret key for Better Auth (required)
- `DATABASE_URL`: Database connection string (optional, uses mock data by default)

## Lint Error Management

```bash
# Check for lint errors only (no warnings)
npm run lint 2>&1 | grep -E "(✖)" | wc -l

# Show first 10 lint errors with context
npm run lint 2>&1 | grep -E "(✖|⚠|FIXABLE.*━)" | head -10

# Save full lint output to file for detailed analysis
npm run lint > lint-errors.log 2>&1

# Count total errors vs warnings
npm run lint 2>&1 | grep "Found .* errors"
npm run lint 2>&1 | grep "Found .* warnings"
```

**Error Priority**: Always fix **errors** (✖) first, then **warnings** (⚠) as needed. Use `grep -E "(✖)"` to filter only critical errors that block builds.

## Component Architecture

The project follows **Atomic Design** methodology with components organized into:

- **Atoms** (`src/components/atoms/`): Basic UI elements (button, input, badge, etc.)
- **Molecules** (`src/components/molecules/`): Composed components (card, dropdown-menu, table, etc.)
- **Organisms** (`src/components/organisms/`): Complex sections (sidebar, data-table, charts)
- **Templates** (`src/components/templates/`): Layout and navigation components (app-sidebar, nav-*, site-header)

## Feature-Based Architecture

The project implements a hybrid **Atomic Design + Feature-Based** architecture for optimal scalability and maintainability:

### Feature Organization

Each feature follows a **self-contained architecture** with standardized internal structure:

#### **Structure Standard**
```
features/[feature-name]/
├── hooks/                          # Business logic hooks
│   ├── use-[feature]-management.ts # Main CRUD operations
│   ├── use-[feature]-data.ts       # Data fetching and state
│   └── index.ts                    # Hook exports
├── mocks/                          # Feature-specific test data
│   ├── mock-[entities].ts          # Entity mock data
│   └── index.ts                    # Mock exports
├── services/                       # Business logic (when needed)
│   └── [feature]-service.ts        # Complex business operations
├── utils/                          # Feature utilities (when needed)
│   └── [feature]-utils.ts          # Helper functions
└── index.ts                        # Public API exports
```

#### **Exemples Concrets**

**Feature `evaluations/` (complète):**
```typescript
// hooks/use-exam-management.ts - Gestion CRUD des examens
export const useExamManagement = (teacherId: string) => {
  const { exams, createExam, updateExam, deleteExam } = useCRUDOperations()
  // Logic métier spécifique aux examens
}

// services/notation-system-service.ts - Calculs de notation
export class NotationSystemService {
  calculateGrade(points: number, maxPoints: number, system: NotationSystem) {
    // Logique complexe de calcul de notes
  }
}

// mocks/mock-exams.ts - Données de test
export const MOCK_EXAMS: Exam[] = [
  { id: "exam-1", title: "Contrôle UML", points: 20, ... }
]

// index.ts - API publique clean
export { useExamManagement, useGradeManagement } from './hooks'
export { NotationSystemService } from './services'
```

**Feature `calendar/` (hooks + mocks):**
```typescript
// hooks/use-calendar.ts - Navigation et affichage calendrier
// hooks/use-timeslots.ts - Gestion des créneaux horaires
// mocks/mock-sessions.ts - Sessions de test
```

#### **Principes d'Organisation**

1. **Autonomie** : Chaque feature peut fonctionner indépendamment
2. **API Clean** : `index.ts` expose uniquement ce qui est nécessaire à l'extérieur
3. **Responsabilité Unique** : Chaque fichier a un rôle précis et délimité
4. **Réutilisabilité** : Hooks et services peuvent être importés par d'autres features

#### **Conventions de Nommage**
- **Hooks** : `use[Feature][Action]` (ex: `useExamManagement`, `useCalendarData`)
- **Services** : `[Feature]Service` ou `[feature]-service.ts`
- **Mocks** : `MOCK_[ENTITIES]` en SCREAMING_SNAKE_CASE
- **Utils** : `[feature]Utils` ou fonctions spécifiques

### Available Features
- **accueil** - Dashboard and home functionality
- **appreciations** - AI-powered content generation system with style guides and phrase banks
- **auth** - Authentication and user management
- **calendar** - Calendar and scheduling features with time slot management
- **evaluations** - Assessment and grading system with notation systems and rubrics
- **gestion** - Administrative management with teaching assignments
- **sessions** - Session and course management with completed session tracking
- **settings** - User preferences and configuration
- **students** - Student management with automated analytics and profile generation

### Cross-Feature Dependencies
Shared functionality available through:
- `@/shared/hooks` - Common hooks (useModal, useCRUDOperations, etc.)
- `@/services` - Global business logic services
- `@/types/uml-entities` - Shared type definitions

## Shared Module Architecture

The `/src/shared/` directory provides cross-feature utilities and common functionality:

### Shared Hooks (`/src/shared/hooks/`)
- **useAsyncOperation** - Async operation state management with loading, error, and success states
- **useBaseManagement** - Entity CRUD base functionality with standardized patterns
- **useCRUDOperations** - Generic CRUD operations for any entity type
- **useModal** - Modal state management with open/close/toggle functionality
- **usePageTitle** - Centralized page title management for the application
- **useSmartFiltering** - Advanced filtering logic with multiple criteria support
- **useValidation** - Form validation utilities with error handling
- **useEntityState** - Generic entity state management patterns
- **useMobile** - Responsive design and mobile detection utilities

### Usage Pattern
```typescript
// Import shared hooks in any feature
import { useModal, useBaseManagement } from '@/shared/hooks'
import { useAsyncOperation } from '@/shared/hooks'

// Use in feature components
const { isOpen, open, close } = useModal()
const { data, loading, error, execute } = useAsyncOperation()
```

### Services Architecture

Business logic services organized by scope:

#### Global Services (`/src/services/`)
- **session-generator.ts** - Automated session generation from weekly templates
- **period-calculator.ts** - Academic period and timeline calculations
- **session-makeup.ts** - Session rescheduling and makeup logic

#### Feature Services (`/src/features/[feature]/services/`)
- **notation-system-service.ts** - Grading system management (evaluations feature)
- **appreciation-generator.ts** - AI content generation logic (appreciations feature)
- **behavioral-analysis-service.ts** - Student behavioral pattern analysis (students feature)
- **academic-analysis-service.ts** - Academic performance analysis (students feature)
- **student-profile-service.ts** - Automated profile generation orchestration (students feature)

## Key Technologies

- **Next.js 15** with App Router and React 19
- **Tailwind CSS v4** with custom CSS properties and dark mode support
- **shadcn/ui** components (restructured into atomic design)
- **Radix UI** primitives for accessibility
- **Lucide React** for all icons (consistent icon system)
- **Recharts** for data visualization
- **@dnd-kit** for drag and drop functionality
- **@tanstack/react-table** for advanced table features
- **Biome** for linting and formatting (replaces ESLint/Prettier)

## Import Aliases

The project uses path aliases defined in both `tsconfig.json` and `components.json` to support both atomic design and feature-based architecture:

```typescript
// tsconfig.json path aliases
"@/*": ["./src/*"]
"@/features/*": ["./src/features/*"]
"@/shared/*": ["./src/shared/*"]
```

### Component Aliases (shadcn/ui compatible)
- `@/components/atoms/*` - Basic UI elements
- `@/components/molecules/*` - Composed components
- `@/components/organisms/*` - Complex sections
- `@/components/templates/*` - Layout components

### Feature Imports
```typescript
// Feature-specific imports
import { useDashboardData } from '@/features/accueil/hooks'
import { useExamManagement } from '@/features/evaluations/hooks'
import { useCalendar } from '@/features/calendar/hooks'

// Shared utilities
import { useModal, useBaseManagement } from '@/shared/hooks'
```

## Styling System

- Uses Tailwind CSS v4 with `@import "tailwindcss"`
- Custom CSS properties for theming with OKLCH color space
- Dark mode support via `.dark` class variant
- Design tokens defined in `globals.css`

## Code Quality

- **Biome** configuration with Next.js and React domains enabled
- Automatic import organization on save
- TypeScript strict mode enabled
- 2-space indentation standard


## Available MCP Servers

This project has access to specialized MCP (Model Context Protocol) servers for enhanced development:

- **Context7 MCP** (`upstash-context-7-mcp`): Provides up-to-date documentation and code examples for any library. Use this to get current documentation for dependencies and frameworks.
- **shadcn/ui Component Reference** (`ymadd-shadcn-ui-mcp-server`): Direct access to shadcn/ui component documentation, examples, and implementation details. Essential for understanding component APIs and usage patterns.

- Use `"use client"` directive for interactive components
- Implement proper TypeScript interfaces for component props
- Follow shadcn/ui patterns with `data-slot` attributes for styling
- Use React.forwardRef for components that need ref forwarding
- Prefer controlled components with proper state management


**Workflow for components:**
1. **Search** - Use MCP server to find appropriate existing shadcn/ui component
2. **Research** - Get component details, props, and usage examples via MCP
3. **Implement** - Use the existing shadcn/ui component with proper imports
4. **Integrate** - Place in appropriate atomic design category (atoms/molecules/organisms)

**DO NOT:**
- Reinvent existing shadcn/ui functionality
- Build UI elements that already exist in shadcn/ui

## Icon Usage

- **IMPORTANT**: All icons use Lucide React icons exclusively
- Import icons from `lucide-react` package: `import { IconName } from "lucide-react"`
- **Guidelines**:
  - Maintain consistent icon sizing with Tailwind classes (h-4 w-4, h-5 w-5, etc.)
  - Use semantic icon names that match component functionality
  - All 94+ icon instances in the codebase use Lucide React
- **Status**: 100% Lucide React - migration complete

## UML Entity Model - SOURCE OF TRUTH

**⚠️ CRITICAL**: The file `/src/types/uml-entities.ts` is the **SINGLE SOURCE OF TRUTH** for all entity definitions. **NEVER MODIFY THIS FILE** without explicit user permission.

This project implements a complete UML-based educational system with the following core entities:

### Core Entities (defined in `/src/types/uml-entities.ts`)
- **Teacher**: Professional educator entity with email, language, and timestamps
- **Student**: Academic-specific properties with names, class assignment, needs, observations, strengths
- **Class**: Academic class groupings with class codes, grade labels, and student management
- **Subject**: Academic disciplines with names, codes, and descriptions
- **CourseSession**: Individual teaching sessions with scheduling (sessionDate + timeSlotId)
- **TimeSlot**: Temporal scheduling framework with startTime, endTime, duration, and display order
- **TeachingAssignment**: Authorization system for teacher-class-subject relationships
- **StudentParticipation**: Student engagement and attendance tracking per session
- **Exam**: Assessment entities with dates, types, points, and coefficients
- **StudentExamResult**: Individual student exam results with grades and comments
- **NotationSystem**: Flexible grading and scoring framework with scale types
- **AcademicPeriod**: Time periods within school years
- **SchoolYear**: Annual academic periods with start/end dates
- **AppreciationContent**: AI-generated student appreciations and comments
- **StyleGuide**: Content generation style and tone configuration
- **PhraseBank**: Contextual phrase collections for content generation

## Project Structure

```
src/
├── app/
│   └── dashboard/
│       ├── accueil/                # Main dashboard
│       │   └── page.tsx
│       ├── appreciations/          # AI content generation
│       │   └── page.tsx
│       ├── calendrier/             # Calendar view
│       │   └── page.tsx
│       ├── sessions/               # Session management
│       │   └── page.tsx
│       ├── mes-eleves/             # Student profiles
│       │   └── [id]/
│       │       └── page.tsx
│       ├── evaluations/            # Evaluation management
│       │   └── page.tsx
│       └── students/               # Student details
│           └── [id]/
│               └── page.tsx
├── features/                       # 🆕 Feature-based architecture
│   ├── accueil/                   # Dashboard feature
│   │   ├── hooks/
│   │   │   └── use-dashboard-data.ts
│   │   └── mocks/
│   ├── appreciations/             # AI content generation
│   │   ├── hooks/
│   │   │   ├── use-style-guides.ts
│   │   │   ├── use-phrase-bank.ts
│   │   │   └── use-appreciation-generation.ts
│   │   ├── mocks/
│   │   ├── services/
│   │   └── index.ts
│   ├── evaluations/               # Evaluation management
│   │   ├── hooks/
│   │   │   ├── use-exam-management.ts
│   │   │   ├── use-grade-management.ts
│   │   │   ├── use-notation-system.ts
│   │   │   └── use-rubric-management.ts
│   │   ├── mocks/
│   │   ├── services/
│   │   └── utils/
│   ├── calendar/                  # Calendar feature
│   │   ├── hooks/
│   │   │   ├── use-calendar.ts
│   │   │   └── use-timeslots.ts
│   │   └── mocks/
│   ├── gestion/                   # Administrative management
│   │   ├── hooks/
│   │   │   └── use-teaching-assignments.ts
│   │   └── mocks/
│   ├── sessions/                  # Session management
│   │   ├── hooks/
│   │   │   └── use-dashboard-sessions.ts
│   │   └── mocks/
│   ├── students/                  # Student management
│   │   ├── hooks/
│   │   │   ├── use-student-analytics.ts
│   │   │   └── use-student-profile-generation.ts
│   │   ├── mocks/
│   │   │   ├── mock-students.ts
│   │   │   ├── mock-student-participation.ts
│   │   │   └── mock-student-profiles.ts
│   │   ├── services/
│   │   │   ├── behavioral-analysis-service.ts
│   │   │   ├── academic-analysis-service.ts
│   │   │   └── student-profile-service.ts
│   │   └── index.ts
│   ├── settings/                  # User preferences
│   │   ├── hooks/
│   │   └── mocks/
│   └── auth/                      # Authentication
│       ├── hooks/
│       └── mocks/
├── shared/                        # 🆕 Shared utilities
│   └── hooks/                     # Common hooks across features
│       ├── use-async-operation.ts
│       ├── use-base-management.ts
│       ├── use-crud-operations.ts
│       ├── use-entity-state.ts
│       ├── use-mobile.ts
│       ├── use-modal.ts
│       ├── use-page-title.tsx
│       ├── use-set-page-title.ts
│       ├── use-smart-filtering.ts
│       ├── use-validation.ts
│       └── index.ts
├── components/
│   ├── atoms/                     # Basic UI elements (34 components)
│   ├── molecules/                 # Composed components (42 components)
│   ├── organisms/                 # Complex sections (46 components)
│   └── templates/                 # Layout components (7 components)
├── contexts/                      # React contexts
│   └── class-selection-context.tsx
├── docs/                          # Technical documentation
│   ├── layout-height-management.md
│   └── modal-patterns.md
├── lib/                           # Core utilities and configuration
│   ├── auth-client.ts             # Better Auth client configuration
│   ├── auth.ts                    # Authentication setup
│   └── utils.ts                   # Utility functions (cn, etc.)
├── services/                      # Global business logic
│   ├── session-generator.ts       # Session generation from templates
│   ├── period-calculator.ts       # Academic period calculations
│   └── session-makeup.ts          # Session rescheduling logic
├── types/
│   └── uml-entities.ts            # Complete UML type definitions - SOURCE OF TRUTH (DO NOT MODIFY)
└── utils/                         # Domain-specific utilities
    ├── date-utils.ts              # Date manipulation and formatting
    ├── entity-lookups.ts          # Entity search and lookup functions
    ├── session-resolver.ts        # Session resolution logic
    └── teaching-assignment-filters.ts # Assignment filtering utilities
```