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

## Component Architecture

The project follows **Atomic Design** methodology with components organized into:

- **Atoms** (`src/components/atoms/`): Basic UI elements (button, input, badge, etc.)
- **Molecules** (`src/components/molecules/`): Composed components (card, dropdown-menu, table, etc.)
- **Organisms** (`src/components/organisms/`): Complex sections (sidebar, data-table, charts)
- **Templates** (`src/components/templates/`): Layout and navigation components (app-sidebar, nav-*, site-header)

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

## Dashboard Implementation

The project includes a comprehensive dashboard system (`/dashboard/accueil`) implementing:

- **Onboarding flow**: Multi-step progression banner with skip/confirm actions
- **Class management**: Interactive cards showing class names and student counts
- **Student management**: Cards with sorting capabilities and add functionality
- **AI Chat interface**: Complete chat system with message threads and conversation history
- **Course scheduling**: Upcoming courses widget with calendar integration
- **French localization**: All UI text and messaging in French

### Dashboard Architecture

- Main page: `/src/app/dashboard/accueil/page.tsx` - Clean template using organisms and hooks
- Custom hook: `/src/hooks/use-dashboard-data.ts` - Centralized data management for classes, students, and courses
- Organisms: All dashboard components properly placed in `/src/components/organisms/`:
  - `onboarding-banner.tsx` - Step progression and actions
  - `classes-card.tsx` - Class display and management
  - `students-card.tsx` - Student listing with sorting
  - `chat-ai.tsx` - AI chat interface with threads
  - `upcoming-courses-widget.tsx` - Course scheduling display