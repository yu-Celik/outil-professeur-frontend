# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Next.js 15 application built with TypeScript, featuring a dashboard interface with data visualization and table management. The project uses Turbopack for building and follows Atomic Design principles for component organization.

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
```

## Environment Configuration

The project requires environment variables for authentication:

```bash
# Copy the example environment file
cp .env.example .env.local

# Edit .env.local with your actual values
# BETTER_AUTH_SECRET is required for authentication to work
```

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

## Class Color System

Complete color coding system integrated with UML UserPreferences entity:

### UML Integration
- **UserPreferences Entity**: New UML entity added to `/src/types/uml-entities.ts` for managing user settings
- **Teacher Relationship**: One-to-one relationship between Teacher and UserPreferences
- **Structured Data**: Colors stored in `preferences.classColors` field with complete metadata
- **School Year Scope**: Preferences can be scoped per school year for multi-year teaching

### Color Management
- **UML Compliant**: All color data managed through proper UML entity relationships
- **Hook Integration**: `useClassColors(teacherId, schoolYearId)` hook with UML entity access
- **Default Palette**: 12 color-blind friendly colors auto-assigned to new classes
- **Accessibility**: Automatic contrast calculation for readable text
- **Persistence**: Full UML entity lifecycle (create, update, delete, export, import)

### Features
- **Per-Class Colors**: Each class has a unique color stored in UserPreferences.preferences.classColors
- **Auto-Assignment**: New classes automatically get next available color from user's palette
- **Visual Integration**: Colors appear in calendar events, dashboard cards, and session lists
- **Color Picker UI**: Complete interface for customizing class colors via toolbar "Couleurs" button
- **Contrast-Safe**: Text colors automatically calculated for accessibility (black/white based on background)
- **Calendar Defaults**: User's preferred calendar view (week/month) stored in UserPreferences
- **Settings Export/Import**: Full preferences backup and restore via UML entity methods

### Implementation
- **Calendar Events**: Border-left color coding with subtle background tints
- **Dashboard Cards**: Class icons and backgrounds with color themes  
- **Session Widgets**: Color-coded session cards and calendar integration
- **Database Ready**: Complete UML entity structure ready for production database integration
- **Multi-User Support**: Isolated preferences per teacher with proper foreign key relationships

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

The project uses path aliases defined in both `tsconfig.json` and `components.json`:

```typescript
"@/*": ["./src/*"]
```

Component aliases in `components.json`:
- `@/components/atoms/*` - Basic UI elements
- `@/components/molecules/*` - Composed components  
- `@/components/organisms/*` - Complex sections
- `@/components/templates/*` - Layout components

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

## Component Patterns

- Use `"use client"` directive for interactive components
- Implement proper TypeScript interfaces for component props
- Follow shadcn/ui patterns with `data-slot` attributes for styling
- Use React.forwardRef for components that need ref forwarding
- Prefer controlled components with proper state management

## Icon Usage

- **IMPORTANT**: All icons must use Lucide React icons exclusively
- Import icons from `lucide-react` package: `import { IconName } from "lucide-react"`
- Never use @tabler/icons-react or other icon libraries
- Maintain consistent icon sizing with Tailwind classes (h-4 w-4, h-5 w-5, etc.)
- Use semantic icon names that match component functionality

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

### UML Implementation Rules
- **TypeScript Interfaces**: Complete type definitions in `/src/types/uml-entities.ts` - **DO NOT MODIFY**
- **Custom Hooks**: UML-compliant data management hooks (use-uml-evaluation, use-teaching-assignments, use-calendar)
- **Entity Relationships**: Proper foreign key relationships and data integrity as defined in UML
- **Authorization Model**: TeachingAssignment-based access control throughout the application
- **Flexible Scheduling**: CourseSession uses sessionDate + timeSlotId for maximum school schedule flexibility

### Scheduling Flexibility
The UML model supports **any school schedule** through:
- **Dynamic TimeSlots**: Schools can define custom time slots (7h45-8h35, 1h30 periods, etc.)
- **Calculated DateTime**: startAt/endAt computed from sessionDate + timeSlot.startTime/endTime
- **No Hardcoded Hours**: UI components read from TimeSlot entities, not fixed arrays
- **Multi-School Support**: Different institutions can have completely different schedules

## Dashboard Implementation

The project includes a comprehensive dashboard system (`/dashboard/accueil`) implementing:

- **Onboarding flow**: Multi-step progression banner with skip/confirm actions
- **Class management**: Interactive cards showing class names and student counts
- **Student management**: Cards with sorting capabilities and add functionality
- **AI Chat interface**: Complete chat system with message threads and conversation history
- **Calendar integration**: Teacher-specific calendar with **dynamically generated sessions**
- **French localization**: All UI text and messaging in French

### Dashboard Architecture

- Main page: `/src/app/dashboard/accueil/page.tsx` - Clean template using organisms and hooks
- Custom hook: `/src/hooks/use-dashboard-data.ts` - Centralized data management for classes and students
- **NEW**: `/src/hooks/use-dashboard-sessions.ts` - Sessions générées depuis templates hebdomadaires
- Organisms: All dashboard components properly placed in `/src/components/organisms/`:
  - `onboarding-banner.tsx` - Step progression and actions
  - `classes-card.tsx` - Class display and management
  - `students-card.tsx` - Student listing with sorting
  - `chat-ai.tsx` - AI chat interface with threads
  - `calendar-widget.tsx` - Teacher-specific upcoming sessions (**generated from weekly templates**)

## Calendar System

Complete calendar implementation with UML entity compliance:

### Calendar Features
- **Teacher-Specific View**: Calendar dedicated to the connected teacher only
- **Session Management**: Create, view, and manage CourseSession entities
- **TimeSlot Integration**: Proper time scheduling with conflict detection
- **TeachingAssignment Authorization**: Only show authorized subjects and classes
- **Monthly View**: Full calendar interface with event visualization
- **Session Form**: Create new sessions with validation and authorization checks

### Calendar Architecture
- **NEW SYSTEM**: **Weekly Templates + Session Generator Architecture**
- **Weekly Templates**: `/src/data/mock-weekly-templates.ts` - Recurring weekly schedule patterns
- **Session Generator**: `/src/services/session-generator.ts` - Generate CourseSession from templates
- **Session Exceptions**: `/src/data/mock-session-exceptions.ts` - Cancellations, moves, additions
- **Hooks**: 
  - `/src/hooks/use-weekly-sessions.ts` - Weekly session generation and exception management
  - `/src/hooks/use-calendar.ts` - Calendar interface and navigation (uses generated sessions)
  - `/src/hooks/use-dashboard-sessions.ts` - Dashboard integration with generated sessions
- **Components**: Atomic Design calendar components (month/week views)
- **Calendar Page**: `/src/app/dashboard/calendrier/page.tsx` - **Observer interface** (not schedule manager)

## Student Evaluation System

UML-compliant evaluation pages implementing the complete assessment model:

### Evaluation Features
- **Multi-Entity Integration**: CourseSession + StudentParticipation + StudentEvaluation
- **Flexible Notation**: NotationSystem with configurable scales (0-20, A-F, competencies)
- **Real-Time Updates**: Dynamic grade calculations and student progress tracking
- **Authorization**: TeachingAssignment-based access control for evaluations

### Evaluation Pages
- **Session Evaluation**: `/src/app/dashboard/sessions/[id]/page.tsx` - Grade entire session
- **Student Detail**: `/src/app/dashboard/students/[id]/page.tsx` - Individual student progress
- **Student Profile**: `/src/app/dashboard/mes-eleves/[id]/page.tsx` - Comprehensive student view

## Project Structure

```
src/
├── app/
│   └── dashboard/
│       ├── accueil/                # Main dashboard
│       │   └── page.tsx
│       ├── calendrier/             # Calendar view
│       │   └── page.tsx
│       ├── sessions/               # Session management (replaces mes-cours)
│       │   └── page.tsx
│       ├── mes-eleves/             # Student profiles
│       │   └── [id]/
│       │       └── page.tsx
│       ├── sessions/               # Session evaluation
│       │   └── [id]/
│       │       └── page.tsx
│       └── students/               # Student details
│           └── [id]/
│               └── page.tsx
├── components/
│   ├── atoms/                      # Basic UI elements
│   │   ├── button.tsx
│   │   ├── badge.tsx
│   │   ├── grade-display.tsx
│   │   ├── slider.tsx
│   │   └── textarea.tsx
│   ├── molecules/                  # Composed components
│   │   ├── card.tsx
│   │   ├── dropdown-menu.tsx
│   │   ├── modal.tsx
│   │   ├── table.tsx
│   │   ├── authorization-guard.tsx
│   │   └── session-form.tsx
│   ├── organisms/                  # Complex sections
│   │   ├── sidebar.tsx
│   │   ├── data-table.tsx
│   │   ├── classes-students-card.tsx
│   │   ├── onboarding-banner.tsx
│   │   ├── classes-card.tsx
│   │   ├── students-card.tsx
│   │   ├── chat-ai.tsx
│   │   ├── calendar.tsx
│   │   └── calendar-widget.tsx
│   └── templates/                  # Layout components
│       ├── app-sidebar.tsx
│       └── site-header.tsx
├── hooks/                          # Custom React hooks
│   ├── use-dashboard-data.ts       # Dashboard state management
│   ├── use-calendar.ts             # Calendar functionality
│   ├── use-notation-system.ts      # Grading system
│   ├── use-student-evaluation.ts   # Student assessments
│   ├── use-teaching-assignments.ts # Authorization
│   └── use-uml-evaluation.ts       # UML entity management
├── types/
│   └── uml-entities.ts             # Complete UML type definitions - SOURCE OF TRUTH (DO NOT MODIFY)
└── data/                           # Mock data for development
    ├── index.ts
    ├── mock-academic-periods.ts       # Academic periods within school years
    ├── mock-classes.ts                # Class entities with UML compliance
    ├── mock-notation-systems.ts       # Flexible grading systems
    ├── mock-school-years.ts           # Annual academic periods
    ├── mock-students.ts               # Student entities with UML compliance
    ├── mock-subjects.ts               # Academic subjects
    ├── mock-teachers.ts               # Teacher entities
    ├── mock-teaching-assignments.ts   # Teacher-class-subject authorization
    ├── mock-time-slots.ts             # Flexible time slots (any school schedule)
    ├── mock-weekly-templates.ts       # 🆕 Recurring weekly schedule patterns
    ├── mock-session-exceptions.ts     # 🆕 Punctual adjustments (cancel/move/add)
    ├── mock-user-preferences.ts       # 🆕 UML UserPreferences entities with class colors
    └── user-class-colors.ts           # Legacy color utilities (being phased out)
```