# UX/UI Specification Document
## outil-professor Educational Management Dashboard

**Author:** Yusuf
**Date:** 2025-10-14
**Version:** 1.0
**Project Level:** 3 (Full Product)
**Document Type:** UX Specification (Brownfield Analysis)

---

## Table of Contents

1. [Executive Summary](#executive-summary)
2. [User Personas](#user-personas)
3. [Design Philosophy & Principles](#design-philosophy--principles)
4. [Information Architecture](#information-architecture)
5. [Design System](#design-system)
6. [Screen Specifications](#screen-specifications)
7. [User Flows](#user-flows)
8. [Responsive Design](#responsive-design)
9. [Accessibility](#accessibility)
10. [Interaction Patterns](#interaction-patterns)
11. [Implementation References](#implementation-references)

---

## Executive Summary

### Application Overview

**outil-professor** est une application web de gestion pédagogique conçue pour les enseignants en ligne. L'application transforme le suivi manuel des élèves en un système automatisé et intelligent qui permet aux enseignants de se concentrer sur la pédagogie plutôt que sur l'administratif.

### Key UX Characteristics

- **Interface Professionnelle Teacher-First**: Design optimisé pour la productivité avec support du mode sombre
- **Layouts Information-Dense**: Vues multi-panneaux avec adaptabilité responsive
- **Navigation Context-Aware**: Navigation par sidebar avec breadcrumbs et persistence d'état
- **Progressive Disclosure**: Modals, panneaux collapsibles et interfaces à onglets pour workflows complexes
- **Real-Time Feedback**: Notifications toast, états de chargement et validation en temps réel
- **Accessibility-First**: Composants conformes ARIA de Radix UI avec navigation clavier

### Technology Stack

- **Framework**: Next.js 15 avec App Router, React 19, Turbopack
- **Styling**: Tailwind CSS v4 avec espace colorimétrique OKLCH
- **Components**: shadcn/ui (primitives Radix UI)
- **Icons**: Lucide React (100% coverage)
- **Charts**: Recharts pour visualisation de données
- **Interactions**: @dnd-kit pour drag-and-drop, @tanstack/react-table pour tables
- **Forms**: React Hook Form + Zod pour validation

### Design Architecture

**Atomic Design + Feature-Based Architecture**

- **Atoms** (34 composants): Éléments UI de base
- **Molecules** (42 composants): Composants composés
- **Organisms** (46 composants): Sections complexes
- **Templates** (7 composants): Layouts et navigation

Total: **129 composants organisés**

---

## User Personas

### Primary Persona: Marie - Enseignante d'Anglais en Ligne

**Démographie:**
- Âge: 35-45 ans
- Expérience: 10+ années d'enseignement
- Tech literacy: Intermédiaire
- Enseignement: 15 heures/semaine, 3 classes, 60 élèves total

**Objectifs:**
- Réduire le temps administratif de 50%
- Améliorer la qualité des retours aux parents
- Suivre efficacement les progrès de chaque élève
- Générer des appréciations professionnelles rapidement

**Pain Points:**
- 5 heures/semaine en tâches administratives répétitives
- Difficulté à maintenir la cohérence dans les commentaires
- Outils fragmentés (Excel, Word, dossiers désorganisés)
- Stress pendant les périodes d'évaluation trimestrielles

**Comportements:**
- Utilise principalement desktop mais consulte sur tablette
- Préfère les interfaces en français
- A besoin de guidance mais pas de courbe d'apprentissage longue
- Valorise la fiabilité et la sauvegarde automatique

### Secondary Persona: Admin Scolaire (Future)

**Contexte:** Potentiel futur utilisateur pour gestion multi-enseignants (hors MVP)

---

## Design Philosophy & Principles

### Core Design Philosophy

**"Efficacité sans Compromis sur la Qualité"**

L'interface doit permettre une saisie rapide tout en maintenant la qualité et la profondeur des données pédagogiques. Chaque élément UI doit justifier sa présence par une contribution directe aux objectifs de l'enseignant.

### 10 UX Design Principles

#### UXP1 - Efficacité Avant Tout ("Speed is a Feature")

- Toute action fréquente optimisée pour la vitesse : saisie présences ≤ 2min, génération rapports ≤ 15min
- Raccourcis clavier pour actions courantes (Tab navigation, Enter valider, Esc annuler)
- Saisie en lot privilégiée : batch update présences, résultats examens, validation rapports
- Retours visuels immédiats : confirmations instantanées, pas d'attente inutile

**Rationale:** L'objectif principal est réduction 50% temps administratif, rapidité critique pour adoption

#### UXP2 - Clarté et Simplicité ("Don't Make Me Think")

- Interface en français clair : vocabulaire pédagogique familier (classe, élève, session, présence)
- Hiérarchie visuelle forte : titres, sous-titres, espacements généreux, typographie lisible (16px min)
- Max 2 niveaux de navigation : Dashboard → Feature page → Detail view
- Actions principales toujours visibles : boutons primaires en haut à droite, couleur distinctive
- Messages d'erreur actionnables : "Le créneau 14h est occupé. Choisir 15h ?" vs "Erreur conflit"

#### UXP3 - Contexte Persistant et Cohérent

- Sélection Classe/Matière visible en permanence dans header
- Toutes vues filtrées automatiquement selon contexte sélectionné
- Breadcrumb navigation : Dashboard > Sessions > Session du 15/11 > Présences
- Indicateurs d'état visuels partout : session "✅ Complétée", rapport "🟡 Brouillon"
- Cohérence terminologique absolue

#### UXP4 - Prévention et Récupération d'Erreurs

- Validation temps réel avec feedback immédiat
- Confirmations pour actions destructives
- Détection conflits proactive : calendrier montre conflit AVANT création session
- Auto-save avec indicateur visible
- RPO = 0, zéro perte de données tolérée

#### UXP5 - Feedback et Affordance Riches

- États de boutons explicites : Enabled, Hover, Loading (spinner), Disabled (avec tooltip)
- Animations subtiles et purposeful : fade-in alertes, slide-in panneaux latéraux
- Toast notifications pour confirmations : "20 présences enregistrées ✅" (3sec)
- Progress indicators pour opérations longues : "Génération rapports : 12/20 élèves (60%)"
- Empty states constructifs : "Aucun examen ce trimestre. Créer le premier ?"

#### UXP6 - Optimisation pour Tâches Récurrentes

- Templates et defaults intelligents basés sur historique
- Actions bulk : "Marquer tous présents puis ajuster absents"
- Duplication et réutilisation : "Dupliquer session pour semaine prochaine"
- Keyboard-first pour power users : Tab, Enter, Esc, Ctrl+S
- Mémorisation préférences : tri, filtres, dernière classe

#### UXP7 - Transparence et Confiance dans l'Automatisation

- Commentaires générés IA toujours visibles AVANT validation
- Données sources affichées à côté contenu généré
- Explications calculs : "Taux présence : 16/20 = 80%"
- Option modification manuelle TOUJOURS disponible
- Historique modifications : "Généré auto 15/11, édité 16/11"

#### UXP8 - Design Responsive et Adaptatif

- Layout prioritaire : Desktop (primaire), Tablette (secondaire), Mobile (consultation)
- Adaptation intelligente : Dashboard 3 cols (desktop) → 2 (tablette) → 1 (mobile)
- Touch-friendly tablette : boutons ≥44px, espacement généreux
- Breakpoints : Desktop ≥1024px, Tablette 768-1023px, Mobile <768px
- Mode consultation mobile : lecture rapports, consultation profils (pas saisie complexe)

#### UXP9 - Accessibilité et Inclusivité

- Contraste couleurs ≥4.5:1 (WCAG AA)
- Navigation clavier complète : focus visible, ordre logique
- Labels explicites et ARIA : screen reader friendly
- Pas de dépendance couleur seule : icônes + couleur + texte
- Tailles police ajustables : respect préférences navigateur, zoom 200%

#### UXP10 - Découvrabilité Progressive et Onboarding

- First-time user experience (FTUE) : tour guidé optionnel
- Tooltips contextuels : hover icône "?" pour features avancées
- Empty states éducatifs : "Créez première classe" avec guide
- Documentation intégrée : liens "En savoir plus"
- Progressive disclosure : features avancées derrière "Options avancées"

---

## Information Architecture

### Site Map

```
/dashboard
├── /accueil              # Dashboard - Vue d'ensemble statistiques et actions rapides
├── /appreciations        # Génération IA - Appréciations avec panneau contexte
├── /calendrier           # Vue Calendrier - Planning hebdomadaire créneaux horaires
├── /sessions             # Gestion Sessions - Sessions terminées avec suivi présences
├── /mes-eleves           # Liste Élèves - Profils avec recherche et filtres
│   └── /[id]            # Détail Élève - Profil individuel analytics et historique
├── /evaluations          # Gestion Évaluations - Examens, notes, systèmes notation
├── /gestion              # Gestion Administrative - Affectations enseignement
└── /reglages             # Paramètres - Préférences utilisateur
```

### Navigation Structure

#### Primary Navigation (Sidebar)

**Items Principaux:**
1. 🏠 **Accueil** → `/dashboard/accueil`
2. ✨ **Appréciations IA** → `/dashboard/appreciations`
3. 📅 **Calendrier** → `/dashboard/calendrier`
4. ✓ **Sessions** → `/dashboard/sessions`
5. 👥 **Mes élèves** → `/dashboard/mes-eleves`
6. 📊 **Évaluations** → `/dashboard/evaluations`
7. ⚙️ **Gestion** → `/dashboard/gestion`

**Items Secondaires:**
- ⚙️ **Paramètres** → `/dashboard/reglages`
- ❓ **Aide** → `/dashboard/aide`

#### Navigation Patterns

**Sidebar Behavior:**
- **Desktop (lg+)**: Sidebar persistante visible (280px), collapsible vers icônes uniquement
- **Tablet/Mobile (<lg)**: Sidebar devient drawer overlay, ouverture par hamburger menu

**Breadcrumb Navigation:**
- Affiche chemin actuel : Dashboard > Mes élèves > Jean Dupont > Analytics
- Cliquable pour navigation rapide vers niveau supérieur
- Toujours visible dans header

**State Persistence:**
- État collapsed/expanded sidebar sauvegardé dans localStorage
- Dernière classe sélectionnée persistée
- Filtres actifs préservés dans URL params

---

## Design System

### Color System (OKLCH Color Space)

**Espace Colorimétrique:** OKLCH pour uniformité perceptuelle améliorée vs HSL

#### Primary Colors (Brand)

```css
--color-primary: oklch(58% 0.182 267);           /* Purple-blue brand */
--color-primary-foreground: oklch(98% 0 0);      /* White on primary */
```

#### Neutral Colors (UI Base)

```css
/* Light Mode */
--color-background: oklch(100% 0 0);             /* White background */
--color-foreground: oklch(9% 0 0);               /* Near-black text */
--color-card: oklch(100% 0 0);                   /* Card background */
--color-popover: oklch(100% 0 0);                /* Overlay background */
--color-muted: oklch(96% 0 0);                   /* Muted backgrounds */
--color-accent: oklch(96% 0 0);                  /* Accent highlights */
--color-border: oklch(90% 0 0);                  /* Light gray borders */

/* Dark Mode */
.dark {
  --color-background: oklch(13% 0 0);            /* Dark background */
  --color-foreground: oklch(98% 0 0);            /* Light text */
  --color-card: oklch(13% 0 0);                  /* Dark card */
  --color-border: oklch(25% 0 0);                /* Darker borders */
}
```

#### Semantic Colors

```css
--color-destructive: oklch(58% 0.182 20);        /* Red for errors/delete */
--color-success: oklch(65% 0.15 145);            /* Green for success */
--color-warning: oklch(75% 0.15 85);             /* Orange for warnings */
--color-info: oklch(60% 0.15 240);               /* Blue for information */
```

#### Interactive States

```css
--color-ring: oklch(58% 0.182 267);              /* Focus ring (primary) */
--color-input: oklch(90% 0 0);                   /* Input borders */
```

### Typography System

#### Font Family

```css
font-family: var(--font-geist-sans); /* System font stack */
```

#### Type Scale (Tailwind Classes)

**Headings:**
- `h1`: `text-4xl font-bold tracking-tight` (36px)
- `h2`: `text-3xl font-semibold tracking-tight` (30px)
- `h3`: `text-2xl font-semibold tracking-tight` (24px)
- `h4`: `text-xl font-semibold tracking-tight` (20px)
- `h5`: `text-lg font-medium` (18px)
- `h6`: `text-base font-medium` (16px)

**Body Text:**
- `p`: `text-base leading-7` (16px, line-height 1.75)
- `lead`: `text-xl text-muted-foreground` (20px, intro text)
- `large`: `text-lg font-semibold` (18px, emphasized)
- `small`: `text-sm font-medium leading-none` (14px)
- `muted`: `text-sm text-muted-foreground` (14px, secondary)

**Specialized:**
- `blockquote`: Border-left, italic, muted
- `code`: Monospace, `bg-muted`, rounded
- `list`: Unordered/ordered avec bullets/numbers

#### Responsive Typography

```tsx
<h1 className="text-2xl md:text-3xl lg:text-4xl">
  // 24px mobile, 30px tablet, 36px desktop
</h1>
```

### Spacing System

**Base Unit:** 4px (0.25rem)

**Tailwind Scale:**
```
0   = 0px
1   = 4px
2   = 8px
3   = 12px
4   = 16px    ← Standard gap
6   = 24px    ← Card padding
8   = 32px
12  = 48px
16  = 64px
20  = 80px
```

**Common Patterns:**
- Card padding: `p-6` (24px)
- Section gaps: `space-y-4` (16px vertical)
- Grid gaps: `gap-4` (16px entre colonnes/rangées)
- Button padding: `px-4 py-2` (16px horizontal, 8px vertical)

### Layout Grid

```tsx
// Responsive 12-column grid
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  // 1 col mobile, 2 cols tablet, 3 cols desktop, 24px gap
</div>

// Flexbox layouts
<div className="flex justify-between items-center gap-4">
  // Horizontal avec space-between, 16px gap
</div>
```

**Container Widths:**
- Full width: `w-full`
- Max content: `max-w-7xl mx-auto` (1280px centré)
- Sidebar: `w-[280px]` (280px fixe)
- Context panel: `w-[33%]` (33% du parent - Appreciations)

### Icons System (Lucide React)

**Import Pattern:**
```tsx
import { Home, Users, Calendar } from "lucide-react"
```

#### Icon Sizing Standards

```tsx
<Icon className="h-4 w-4" />   // 16px - UI elements
<Icon className="h-5 w-5" />   // 20px - Buttons, labels (default)
<Icon className="h-6 w-6" />   // 24px - Headers
<Icon className="h-8 w-8" />   // 32px - Empty states
```

#### Icon Categories

**Navigation:**
- Home, Sparkles, Calendar, CalendarCheck, Users, FileText, Settings

**Actions:**
- Plus, Pencil, Trash2, Save, X, Check, Copy, Download

**Status:**
- CheckCircle, XCircle, AlertCircle, Info, Clock

**Data:**
- TrendingUp, TrendingDown, BarChart, LineChart, Activity

**UI:**
- ChevronDown, ChevronRight, Menu, Search, Filter, MoreVertical

**Color Patterns:**
```tsx
<Icon className="text-foreground" />          // Default
<Icon className="text-muted-foreground" />    // Muted
<Icon className="text-primary" />             // Primary brand
<Icon className="text-destructive" />         // Red
<Icon className="text-green-600" />           // Success
```

### Component Library

#### Atoms (34 composants)

**Form Controls:**
- button (6 variants: default, destructive, outline, secondary, ghost, link)
- input, textarea, checkbox, radio-group, switch
- label, form

**Display:**
- badge (5 variants: default, secondary, destructive, outline, success)
- avatar (photo + fallback initiales)
- skeleton (loading placeholder)
- separator (divider horizontal/vertical)

**Feedback:**
- alert (4 variants: default, info, success, warning, destructive)
- toast (via sonner)
- progress (barre de progression)

#### Molecules (42 composants)

**Containers:**
- card (header, title, description, content, footer)
- accordion (sections collapsibles)
- collapsible (contenu expandable)
- tabs (organisation multi-vues)

**Overlays:**
- dialog/modal (fenêtres overlay)
- sheet/drawer (panneau latéral)
- popover (conteneur flottant)
- tooltip (aide contextuelle)
- dropdown-menu (menus contextuels)

**Data Display:**
- table (lignes et colonnes)
- data-table (avec @tanstack/react-table)
- calendar (sélecteur date)

**Navigation:**
- breadcrumb (chemin navigation)
- pagination (navigation pages)
- command (palette commandes)

#### Organisms (46 composants)

**Dashboard:**
- dashboard-stats (cartes KPI)
- dashboard-sessions-table (prochaines sessions)
- upcoming-sessions-card (widget résumé)

**Students:**
- student-list (table/carte élèves)
- student-profile-card (header profil)
- student-analytics-section (analyse comportementale/académique)
- student-performance-chart (graphique notes)
- student-participation-history (timeline présences)

**Calendar & Sessions:**
- calendar-grid (vue hebdomadaire créneaux)
- calendar-header (navigation contrôles)
- session-card (affichage session individuelle)
- session-modal (détail/édition session)
- participation-tracker (interface marquage présences)

**Evaluations:**
- exam-management-panel (interface CRUD examens)
- student-results-table (saisie/affichage notes)
- grade-entry-form (saisie note individuelle)
- notation-system-selector (config échelle notation)

**AI Appreciations:**
- appreciation-generator (interface génération principale)
- appreciation-context-panel (sidebar données élève 33%)
- style-guide-editor (config ton et style)
- phrase-bank-editor (gestion phrases contextuelles)

#### Templates (7 composants)

**Layout:**
- app-sidebar (navigation principale collapsible 280px)
- site-header (header top avec breadcrumbs et menu user)
- nav-main (menu navigation primaire)
- nav-user (dropdown profil user)
- nav-secondary (liens navigation secondaire)
- team-switcher (sélecteur contexte/organisation)

---

## Screen Specifications

### 1. Dashboard (Accueil)

**Route:** `/dashboard/accueil`
**Page Title:** "Tableau de bord"
**File:** `/src/app/dashboard/accueil/page.tsx`

#### Purpose

Page d'accueil principale fournissant vue d'ensemble des activités enseignement, statistiques rapides et raccourcis vers actions clés.

#### Layout Structure

```
┌─────────────────────────────────────────────────┐
│  Page Header                                     │
│  Tableau de bord                    [+ Actions]  │
├─────────────────────────────────────────────────┤
│  Statistics Cards (4 columns responsive)        │
│  ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐          │
│  │Total │ │Proch.│ │Examens│ │Moy.  │          │
│  │Élèves│ │Sess. │ │Récents│ │Classe│          │
│  │  87  │ │  12  │ │   8   │ │12.5  │          │
│  └──────┘ └──────┘ └──────┘ └──────┘          │
├─────────────────────────────────────────────────┤
│  Main Content (2 columns desktop, stacked mobile)│
│  ┌────────────────────┬─────────────────────┐  │
│  │ Prochaines         │ Actions Rapides      │  │
│  │ Sessions           │ Widget Calendrier    │  │
│  │ (Table)            │ Liens Rapides        │  │
│  └────────────────────┴─────────────────────┘  │
└─────────────────────────────────────────────────┘
```

#### Components Used

1. **DashboardStats** - 4 KPI cards
   - Total Students (icon: Users)
   - Upcoming Sessions (icon: CalendarCheck)
   - Recent Exams (icon: FileText)
   - Average Grade (icon: TrendingUp)

2. **DashboardSessionsTable** - Next 5 sessions
   - Columns: Date, Time, Class, Subject, Status, Actions
   - Click row → open session detail modal

3. **Quick Actions Panel**
   - Calendar widget (current week)
   - Action buttons:
     - "Nouvelle Session"
     - "Ajouter Élève"
     - "Créer Examen"

#### Responsive Behavior

- **Desktop (lg+)**: 4 KPI cards horizontal, 2-column main content
- **Tablet (md)**: 2 KPI cards per row, 2-column main content
- **Mobile (<md)**: 1 KPI card per row, stacked main content

#### Empty States

**No Sessions:**
```
┌────────────────────────────────┐
│  📅 Aucune session programmée  │
│                                │
│  Créez votre première session  │
│  pour commencer.               │
│                                │
│  [+ Créer une session]         │
└────────────────────────────────┘
```

#### File References

- Page: `/src/app/dashboard/accueil/page.tsx`
- Stats: `/src/components/organisms/dashboard-stats/dashboard-stats.tsx`
- Sessions table: `/src/components/organisms/dashboard-sessions-table/dashboard-sessions-table.tsx`

---

### 2. Appreciations IA

**Route:** `/dashboard/appreciations`
**Page Title:** "Appréciations IA"
**File:** `/src/app/dashboard/appreciations/page.tsx`

#### Purpose

Génération d'appréciations/commentaires élèves assistée par IA avec panneau contexte riche affichant toutes données pertinentes élève pour écriture informée.

#### Layout Structure - INNOVATION CLÉ

**Two-Column Layout avec Context Panel Fixe (33%)**

```
┌────────────────────────────────┬──────────────────┐
│  Main Content (67% width)      │  Context Panel   │
│                                │  (33% width)     │
│  [Class Selector: 6ème A ▼]   │                  │
│                                │  Student Profile │
│  [Student Selector]            │  ──────────────  │
│  • Dupont Jean                 │  [Photo]         │
│  • Martin Sophie               │  Jean Dupont     │
│                                │  6ème A          │
│  [Style Guide]                 │  Besoins: DYS    │
│  ○ Formal                      │  Avg: 12.5/20    │
│  ○ Friendly                    │                  │
│  ○ Constructive                │  [Analytics] ▼   │
│                                │  Participation:  │
│  [Phrase Bank]                 │  85% ████████░░  │
│  "Shows strong..."             │                  │
│  "Demonstrates..."             │  [Recent Exams]▼ │
│                                │  Oct 14: 15/20   │
│  [Generated Content]           │  Oct 10: 13/20   │
│  ┌──────────────────────────┐ │                  │
│  │ Jean est un élève        │ │  [Attendance] ▼  │
│  │ engagé qui montre...     │ │  ✓✓✓✓✗ 80%      │
│  └──────────────────────────┘ │                  │
│  [Copy] [Save] [Regenerate]   │  [Strengths] ▼   │
└────────────────────────────────┴──────────────────┘
```

#### Key Innovation: 33% Context Panel

**Sections (Collapsibles):**

1. **Student Profile**
   - Photo avatar
   - Nom complet
   - Classe
   - Besoins spéciaux (badges)
   - Stats rapides (moyenne, participation)

2. **Behavioral Analytics**
   - Participation rate (progress bar)
   - Engagement level (badge + bar)
   - Behavioral pattern (texte généré)

3. **Academic Performance**
   - Overall average (avec trend icon)
   - Performance par matière (liste)
   - Chart tendances

4. **Recent Exam Results**
   - 5 derniers examens
   - Date, matière, note
   - Badge qualité (Excellent/Good/Needs Improvement)

5. **Attendance History**
   - Taux présence global
   - Visualisation 10 dernières sessions (✓✗)
   - Count présent/absent

6. **Strengths & Observations**
   - Liste forces identifiées
   - Observations enseignant

#### Components Used

**Main Content (Left 67%):**
- ClassSelectorDropdown
- AppreciationGenerator
- StyleGuideEditor
- PhraseBankEditor

**Context Panel (Right 33%):**
- AppreciationContextPanel (organism complet)
- StudentProfileCard
- Collapsible sections (6 sections)

#### User Interactions

1. Select class → loads students
2. Select student → context panel populates
3. Configure style guide (formal/friendly/constructive)
4. Browse phrase bank → click to insert
5. Click "Générer avec IA"
6. AI generates text based on context
7. Review/edit generated content
8. Copy to clipboard or Save

#### AI Generation Logic

**Inputs:**
- Student profile data
- Behavioral analytics
- Academic performance
- Recent exams
- Attendance history
- Selected style guide
- Selected phrases

**Output:**
- Personalized appreciation paragraph (80-120 words)
- Tone adapted to style guide
- Data-driven content

#### Responsive Behavior

- **Desktop (lg+)**: Side-by-side 67/33 split
- **Tablet/Mobile (<lg)**: Stacked (context panel above generator)

#### File References

- Page: `/src/app/dashboard/appreciations/page.tsx`
- Generator: `/src/components/organisms/appreciation-generator/appreciation-generator.tsx`
- Context panel: `/src/components/organisms/appreciation-context-panel/appreciation-context-panel.tsx`
- Services: `/src/features/appreciations/services/appreciation-generator.ts`

---

### 3. Calendrier (Calendar View)

**Route:** `/dashboard/calendrier`
**Page Title:** "Calendrier"
**File:** `/src/app/dashboard/calendrier/page.tsx`

#### Purpose

Vue calendrier hebdomadaire pour visualiser et gérer sessions enseignement avec système créneaux horaires.

#### Layout Structure

```
┌─────────────────────────────────────────────────┐
│  Calendar Header                                 │
│  [<] Semaine 42 : 14-20 Oct 2024 [>] [Auj.]    │
├───────┬───────┬───────┬───────┬───────┬───────┤
│  LUN  │  MAR  │  MER  │  JEU  │  VEN  │  SAM  │
│  14   │  15   │  16   │  17   │  18   │  19   │
├───────┼───────┼───────┼───────┼───────┼───────┤
│ 08:00-09:30                                     │
│ Math  │       │  CS   │       │ Phys  │       │
│ 6A    │       │  5B   │       │ 6B    │       │
│ 24/26 │       │ 18/20 │       │ 22/25 │       │
├───────┼───────┼───────┼───────┼───────┼───────┤
│ 10:00-11:30                                     │
│       │ Math  │       │ Math  │       │       │
│       │ 6B    │       │ 6A    │       │       │
│       │ 25/25 │       │ 24/26 │       │       │
└───────┴───────┴───────┴───────┴───────┴───────┘
```

#### Session Card in Grid Cell

```tsx
┌─────────────────────┐
│ Mathématiques       │ ← Subject (font-semibold)
│ 6ème A              │ ← Class (text-muted)
│ Salle 204           │ ← Room (text-muted)
│ 👥 24/26            │ ← Participation count
└─────────────────────┘
```

**Color Coding:**
- Default: Primary color (blue/purple)
- Completed: Green background + ✓
- Cancelled: Red background + ✗
- Current: Border animation

#### Components Used

1. **CalendarHeader**
   - Week navigation (←/→)
   - Week number + date range
   - "Aujourd'hui" button

2. **CalendarGrid**
   - 7 columns (days)
   - Rows = time slots
   - Session cards in cells

3. **SessionCard**
   - Subject, class, room
   - Participation count
   - Status indicator

4. **SessionModal** (on click)
   - Full session details
   - Edit capabilities
   - Mark attendance button

#### User Interactions

1. **Navigate Weeks:**
   - Click ← (previous week)
   - Click → (next week)
   - Click "Aujourd'hui" (jump to today)
   - URL updates with week param

2. **View Session:**
   - Click session card → modal opens
   - Shows details, notes, participation

3. **Create Session:**
   - Click empty time slot
   - Modal opens with time pre-filled
   - Select class, subject
   - Save → appears in calendar

4. **Quick Actions:**
   - Hover empty slot: shows "+" icon
   - Hover session: preview notes

#### Time Slot System

**Defined Slots:**
```typescript
[
  { id: "ts-1", startTime: "08:00", endTime: "09:30", duration: 90 },
  { id: "ts-2", startTime: "10:00", endTime: "11:30", duration: 90 },
  { id: "ts-3", startTime: "14:00", endTime: "15:30", duration: 90 },
  { id: "ts-4", startTime: "16:00", endTime: "17:30", duration: 90 },
]
```

#### Responsive Behavior

- **Desktop (lg+)**: 7 columns (full week)
- **Tablet (md)**: 5 columns (weekdays)
- **Mobile (<md)**: 1 column (daily view) + day selector + swipe left/right

#### File References

- Page: `/src/app/dashboard/calendrier/page.tsx`
- Grid: `/src/components/organisms/calendar/calendar-grid.tsx`
- Header: `/src/components/organisms/calendar/calendar-header.tsx`
- Session card: `/src/components/organisms/session-card/session-card.tsx`
- Modal: `/src/components/organisms/session-modal/session-modal.tsx`

---

### 4. Sessions Management

**Route:** `/dashboard/sessions`
**Page Title:** "Gestion des participations"
**File:** `/src/app/dashboard/sessions/page.tsx`

#### Purpose

Gestion sessions enseignement terminées avec suivi présences et enregistrement participation.

#### Layout Structure

```
┌──────────────────────────────────────────────────┐
│  Page Header                                      │
│  Sessions                      [Filters] [Export] │
├──────────────────────────────────────────────────┤
│  Filters Bar                                      │
│  [🔍 Search] [Class: All ▼] [Status: All ▼]     │
├──────────────────────────────────────────────────┤
│  Sessions Table                                   │
│  Date      Class  Subject    Duration  Présents  │
│  ──────────────────────────────────────────────  │
│  14 Oct    6A     Math       1h30      24/26 ✓  │
│  13 Oct    6B     Physics    1h30      22/25 ✓  │
│  12 Oct    5B     CS         1h30      18/20 ✓  │
│  ...                                    [Actions]│
└──────────────────────────────────────────────────┘
```

#### Table Columns

1. **Date & Time** - "Lun. 14 Oct. 2024, 08:00"
2. **Class** - Badge colored "6ème A"
3. **Subject** - "Mathématiques"
4. **Duration** - "1h30"
5. **Participation** - "24/26" avec barre progression
6. **Status** - Badge (Completed/Cancelled/Rescheduled)
7. **Actions** - Dropdown menu

#### Participation Tracking Modal

**Opened via:** Click participation count or "Mark Attendance" action

```
┌─────────────────────────────────────┐
│  Marquer les présences              │
│  Math - 6ème A - 14 Oct. 2024       │
├─────────────────────────────────────┤
│  Quick Actions:                     │
│  [Tous présents] [Tous absents]     │
├─────────────────────────────────────┤
│  Student List (26 students)         │
│  ┌───┬─────────────────┬──────┐    │
│  │ ☑ │ Dupont Jean     │ [📝] │    │
│  │ ☑ │ Martin Sophie   │ [📝] │    │
│  │ ☐ │ Durand Paul     │ [📝] │    │ ← Absent
│  │ ☑ │ Bernard Marie   │ [📝] │    │
│  └───┴─────────────────┴──────┘    │
├─────────────────────────────────────┤
│  Notes générales:                   │
│  [Text area for session notes]     │
├─────────────────────────────────────┤
│  [Annuler]          [Enregistrer]   │
└─────────────────────────────────────┘
```

**Features:**
- Checkbox per student (☑ = present, ☐ = absent)
- Individual notes icon (📝) → inline textarea
- Quick actions: mark all present/absent
- Session notes (general)
- Save → creates StudentParticipation records

#### Filtering System

**Search Bar:** Real-time search (class, subject, notes)

**Filters:**
- Class (dropdown multi-select)
- Status (All/Completed/Cancelled/Rescheduled)
- Date range (presets: Last 7/30 days, This month, Custom)

#### File References

- Page: `/src/app/dashboard/sessions/page.tsx`
- Sessions table: `/src/components/organisms/dashboard-sessions-table/dashboard-sessions-table.tsx`
- Participation tracker: `/src/components/organisms/participation-tracker/participation-tracker.tsx`

---

### 5. Mes élèves (Student List)

**Route:** `/dashboard/mes-eleves`
**Page Title:** "Mes élèves"
**File:** `/src/app/dashboard/mes-eleves/page.tsx`

#### Purpose

Liste searchable et filtrable de tous élèves avec accès rapide aux profils.

#### Layout Structure

```
┌──────────────────────────────────────────────────┐
│  Page Header                                      │
│  Mes élèves (87)              [+ Add] [Export]    │
├──────────────────────────────────────────────────┤
│  Filters & Search                                 │
│  [🔍 Search] [Class ▼] [Needs ▼] [Sort ▼]       │
├──────────────────────────────────────────────────┤
│  Student List (Table or Card View)               │
│  Photo  Name           Class  Needs    Performance│
│  ────────────────────────────────────────────────│
│  [JD]   Dupont Jean    6A     DYS      ↑ 12.5    │
│  [SM]   Martin Sophie  6B     -        ↑ 14.2    │
│  [DP]   Durand Paul    5B     TDAH     ↓ 9.8     │
│  ...                                    [Actions] │
└──────────────────────────────────────────────────┘
```

#### Table Columns

1. **Avatar** - Photo ou initiales colorées
2. **Name** - "Nom Prénom" (cliquable → profil)
3. **Class** - Badge "6ème A"
4. **Special Needs** - Badges (DYS, TDAH, etc.)
5. **Recent Performance** - Trend (↑↓→) + grade
6. **Participation Rate** - Percentage + mini bar
7. **Last Session** - "2 days ago"
8. **Actions** - Dropdown menu

#### Filtering & Search

**Search:** Real-time (name, class, notes)

**Filters:**
- Class: Multi-select dropdown
- Special Needs: Checkboxes (Any/None/specific)
- Sort: Name, Class, Performance, Participation, Last session

**View Toggle:**
- Table view (desktop default)
- Card view (mobile, optional desktop)

#### Navigation to Detail

Click student row → navigates to `/dashboard/mes-eleves/[id]`

#### File References

- Page: `/src/app/dashboard/mes-eleves/page.tsx`
- Student list: `/src/components/organisms/student-list/student-list.tsx`

---

### 6. Student Detail (Profile)

**Route:** `/dashboard/mes-eleves/[id]`
**Page Title:** "[Student Name] - Profil"
**File:** `/src/app/dashboard/mes-eleves/[id]/page.tsx`

#### Purpose

Profil individuel élève complet avec analytics, historique et insights automatisés.

#### Layout Structure (4 Tabs)

```
┌───────────────────────────────────────────────┐
│  Profile Header                                │
│  [Photo] Jean Dupont                           │
│  6ème A | Besoins: DYS | Perf: ↑ 12.5/20      │
│  [Edit Profile]              [Generate IA]     │
├───────────────────────────────────────────────┤
│  [Profil] [Analytics] [Évaluations] [Présence]│
├───────────────────────────────────────────────┤
│                                                │
│  Tab Content Area                              │
│                                                │
└───────────────────────────────────────────────┘
```

#### Tab 1: Profil (Basic Information)

**Sections:**
1. Personal Information (nom, date naissance, ID)
2. Contact Information (parents, emergency)
3. Special Education Needs (liste, accommodations)
4. Strengths (bullet list)
5. Observations (teacher notes, timestamped)

#### Tab 2: Analytics (Automated Insights)

**Sections:**

**Behavioral Analysis:**
```
Participation Rate: 85%
[████████████░░░] Very Active

Engagement Level: Engaged
[████████████░░░]

Behavioral Pattern:
"Jean is an active participant who
consistently contributes to class
discussions..."
```

**Academic Performance:**
```
Overall Average: 12.5/20
Trend: ↑ Improving (+1.2)

Performance by Subject:
Mathématiques: 13.5/20 ↑
Physique: 12.0/20 →
Informatique: 11.8/20 ↑

[Bar Chart]
```

**AI-Generated Profile Summary:**
```
"Jean is a motivated student with strong
participation and improving academic
performance. While he shows particular
strength in mathematics..."

Recommendations:
• Encourage written assignments
• Provide additional challenges
• Maintain current support
```

**Data Sources:**
- `StudentParticipation` records (300+)
- `StudentExamResult` records (120+)
- Session attendance
- Teacher observations

**Services:**
- `/src/features/students/services/behavioral-analysis-service.ts`
- `/src/features/students/services/academic-analysis-service.ts`
- `/src/features/students/services/student-profile-service.ts`

#### Tab 3: Évaluations (Exam Results)

**Sections:**
1. Performance Chart (line graph grades over time)
2. Exam Results Table (date, subject, grade, coefficient)
3. Grade Distribution (bar chart)
4. Statistics Panel (average, highest, lowest, trend)
5. Export button (PDF report)

#### Tab 4: Présence (Attendance)

**Sections:**
1. Attendance Summary (present/absent count + percentage)
2. Attendance Calendar (visual grid with color coding)
3. Participation History (list all sessions with status)
4. Notes (absence reasons)

#### File References

- Page: `/src/app/dashboard/mes-eleves/[id]/page.tsx`
- Profile card: `/src/components/organisms/student-profile-card/student-profile-card.tsx`
- Analytics: `/src/components/organisms/student-analytics-section/student-analytics-section.tsx`
- Performance chart: `/src/components/organisms/student-performance-chart/student-performance-chart.tsx`

---

### 7. Evaluations Management

**Route:** `/dashboard/evaluations`
**Page Title:** "Évaluations"
**File:** `/src/app/dashboard/evaluations/page.tsx`

#### Purpose

Création et gestion examens, saisie notes, configuration systèmes notation.

#### Layout Structure (Split View)

```
┌────────────────┬──────────────────────────────────┐
│  Exam List     │  Student Results                 │
│  (30% width)   │  (70% width)                     │
│                │                                  │
│ [+ New Exam]   │  [Class: 6ème A] [Actions]      │
│                │                                  │
│ ○ Math Test    │  Student       Grade    Comment │
│   20 pts       │  ────────────────────────────── │
│   Oct 14       │  Dupont J.     [15/20]  [...]  │
│   6ème A       │  Martin S.     [14/20]  [...]  │
│   ━━━━━━━ 80%  │  Durand P.     [ /20]   [...]  │
│                │  ...                            │
│ ○ Physics Quiz │                                  │
│   10 pts       │  [Save All Grades]              │
│   Oct 18       │                                  │
│   6ème A       │  Statistics:                     │
│   ━━━ 40%      │  Average: 13.2/20                │
│                │  Completed: 24/26                │
│ ○ CS Project   │  Pending: 2                      │
│   100 pts      │  [Bar Chart Distribution]       │
│   Oct 25       │                                  │
│   5ème B       │                                  │
│   ━━━━━━━ 75%  │                                  │
└────────────────┴──────────────────────────────────┘
```

#### Left Panel: Exam List

**Exam Card:**
```
┌─────────────────────────┐
│ Contrôle UML        20pts│
│ 6ème A • Mathématiques   │
│ 📅 14 Oct. 2024          │
│ ━━━━━━━━━━━━━ 80%       │ ← Progress
│ 24/26 notes saisies      │
└─────────────────────────┘
```

**Color Coding:**
- Green: All grades entered (100%)
- Yellow: Partial (1-99%)
- Gray: No grades (0%)

**Create Exam Modal Form Fields:**
1. Exam Title (text)
2. Class (dropdown from teaching assignments)
3. Date (date picker)
4. Notation System (dropdown: points/percentage/letter/competency)
5. Max Points (number)
6. Coefficient (number, default 1.0)
7. Description (textarea)

#### Right Panel: Grade Entry

**Table Structure:**

| Student | Grade | Comment | Status |
|---------|-------|---------|--------|
| [Avatar] Jean D. | [15/20] | [...] | ✓ Graded |
| [Avatar] Sophie M. | [14/20] | [...] | ✓ Graded |
| [Avatar] Paul D. | [ /20] | [...] | ⏳ Pending |

**Grade Input:**
```tsx
<Input
  type="number"
  max={maxPoints}
  placeholder={`/${maxPoints}`}
  className={isValid ? "border-green-500" : "border-red-500"}
/>
```

**Validation:**
- Grade must be numeric
- Cannot exceed max points
- Cannot be negative
- Empty allowed (pending)

**Batch Actions:**
- Save All Grades
- Import CSV
- Export Results
- Clear All

**Statistics Panel:**
```
Average: 13.2/20
Highest: 15/20
Lowest: 9/20
Completed: 24/26

[Bar Chart: Grade Distribution]
```

#### Notation Systems Supported

1. **Points** - 15/20
2. **Percentage** - 75%
3. **Letter Grade** - B+ (A-F with +/-)
4. **Competency** - Level 3 (1-4 scale)

**Service:** `/src/features/evaluations/services/notation-system-service.ts`

#### File References

- Page: `/src/app/dashboard/evaluations/page.tsx`
- Exam panel: `/src/components/organisms/exam-management-panel/exam-management-panel.tsx`
- Results table: `/src/components/organisms/student-results-table/student-results-table.tsx`
- Grade form: `/src/components/organisms/grade-entry-form/grade-entry-form.tsx`

---

## User Flows

### Flow 1: Creating Appreciation with AI Assistance

**Goal:** Teacher writes personalized student appreciation with AI help

**Steps:**

1. **Entry:** Click "Appréciations IA" in sidebar
2. **Context Selection:**
   - Select class from dropdown (e.g., "6ème A")
   - Students list loads
3. **Student Selection:**
   - Click student name (e.g., "Jean Dupont")
   - Context panel populates with:
     - Profile photo + info
     - Academic performance summary
     - Behavioral analytics
     - Recent exam results
     - Attendance history
     - Strengths + observations
4. **Style Configuration:**
   - Select tone: Formal/Friendly/Constructive
   - System adjusts phrase bank suggestions
5. **Content Generation:**
   - Browse suggested phrases
   - Click phrases to insert
   - Click "Générer avec IA"
   - System generates text based on:
     - Style guide
     - Student data
     - Behavioral patterns
     - Recent activities
   - Generated text appears in editor
6. **Review & Edit:**
   - Review AI content
   - Edit as needed
   - Reference context panel for accuracy
   - Check tone matches style
7. **Save/Export:**
   - Click "Copier" (copy to clipboard)
   - OR "Enregistrer" (save to database)
   - Toast confirms action
   - Generate for next student

**Key Patterns:**
- Split-screen keeps context always visible
- Progressive disclosure in context panel
- Real-time preview
- Auto-save drafts (localStorage)

**File:** `/src/app/dashboard/appreciations/page.tsx`

---

### Flow 2: Calendar Session Management

**Goal:** Schedule, view, manage teaching sessions in weekly calendar

**Steps:**

1. **Entry:** Click "Calendrier" in sidebar
2. **Calendar Navigation:**
   - Current week loads with sessions
   - Week number + date range in header
3. **Week Traversal:**
   - Click "←" (previous week) or "→" (next week)
   - Calendar reloads
   - Click "Aujourd'hui" (jump to current week)
4. **View Session Detail:**
   - Click session card in grid
   - Modal opens showing:
     - Date, time, class, subject
     - Duration, location
     - Participation count
     - Notes
   - Can edit details
   - Can mark completed/cancelled
5. **Create New Session:**
   - Click empty time slot
   - Modal opens with time pre-filled
   - Select class (dropdown)
   - Select subject (dropdown)
   - Select date (date picker)
   - Optional: add notes
   - Click "Créer"
   - New session appears in calendar
6. **Mark Attendance:**
   - From session modal, click "Marquer les présences"
   - Participation tracker opens
   - Student list with checkboxes
   - Mark present/absent per student
   - Quick actions: "Tous présents"/"Tous absents"
   - Add optional notes per student
   - Click "Enregistrer"
   - Participation count updates

**Key Patterns:**
- Grid-based familiar interface
- Click-to-detail
- Modal overlays for focused tasks
- Quick actions for batch operations
- Visual status indicators

**File:** `/src/app/dashboard/calendrier/page.tsx`

---

### Flow 3: Student Profile Exploration

**Goal:** Explore individual student's complete academic profile

**Steps:**

1. **Entry:** Navigate to "Mes élèves"
2. **Search Student:**
   - Enter name in search field
   - Real-time filtering
   - Click student row
3. **Profile Overview:**
   - Profile loads with header:
     - Photo, name, class
     - Special needs badges
     - Quick stats (avg grade, participation)
4. **Tab Navigation:**
   - 4 tabs available:
     - **Profil** (basic info)
     - **Analytics** (automated insights)
     - **Évaluations** (exam results)
     - **Présence** (attendance)
5. **Explore Analytics (Tab 2):**
   - Behavioral analysis:
     - Participation rate graph
     - Engagement level
     - Behavioral patterns text
   - Academic performance:
     - Average by subject (bar chart)
     - Trend line graph
     - Areas of strength
   - AI profile summary
6. **Review Exam Results (Tab 3):**
   - Table all exams (date, subject, grade)
   - Performance chart (trend over time)
   - Grade distribution histogram
   - Filter by subject/date
   - Click "Download Report" → PDF export
7. **Check Attendance (Tab 4):**
   - Attendance calendar (visual grid)
   - Participation history list
   - Absence reasons
   - Attendance rate percentage

**Key Patterns:**
- Tabbed interface for IA
- Automated analytics reduce manual work
- Visual data representation
- Drill-down from summary to detail
- Export functionality

**File:** `/src/app/dashboard/mes-eleves/[id]/page.tsx`

---

### Flow 4: Exam Creation & Grade Entry

**Goal:** Create exam, enter grades, calculate results

**Steps:**

1. **Entry:** Navigate to "Évaluations"
2. **Create Exam:**
   - Click "+ Nouvel examen"
   - Modal opens with form:
     - Title, subject, class
     - Date (date picker)
     - Notation system (dropdown)
     - Max points, coefficient
   - Click "Créer"
   - Exam appears in left panel list
3. **Select Exam:**
   - Click exam from list
   - Right panel updates with student results table
   - Student list loads with empty grade fields
4. **Enter Grades (Individual):**
   - Enter grade for first student
   - Validation occurs (cannot exceed max)
   - Tab/Enter to next student
   - Repeat for all students
5. **Add Comments:**
   - Click comment icon next to grade
   - Textarea expands inline
   - Type personalized comment
   - Auto-saves on blur
6. **Save & Calculate:**
   - Click "Enregistrer toutes les notes"
   - System validates entries
   - Calculates:
     - Individual grades (with coefficient)
     - Class average
     - Grade distribution
   - Toast: "Notes enregistrées"
   - Statistics panel updates
7. **View Statistics:**
   - Class average
   - Highest/lowest grades
   - Grade distribution histogram
   - Students above/below average
   - Filter by class/subject

**Key Patterns:**
- Split-panel (exam list + grade entry)
- Inline editing for speed
- Batch operations
- Real-time validation
- Automatic calculations
- Visual feedback (toasts, loading)

**File:** `/src/app/dashboard/evaluations/page.tsx`

---

## Responsive Design

### Breakpoint System

**Tailwind CSS Breakpoints (Mobile-First):**

```css
/* Default (mobile): 0px - 639px */
/* sm: 640px - 767px */
/* md: 768px - 1023px */
/* lg: 1024px - 1279px  ← Primary desktop breakpoint */
/* xl: 1280px - 1535px */
/* 2xl: 1536px+ */
```

**Usage Pattern:**
```tsx
<div className="w-full md:w-1/2 lg:w-1/3">
  {/* Full mobile, half tablet, third desktop */}
</div>
```

### Navigation Patterns

**Sidebar:**
- **Desktop (lg+)**: Fixed sidebar always visible (280px), collapsible to icons
- **Mobile (<lg)**: Drawer overlay
  - Hamburger menu icon (top-left) opens
  - Swipe-to-dismiss gesture
  - Closes on navigation click

**File:** `/src/components/templates/app-sidebar/app-sidebar.tsx`

### Adaptive Layouts

#### Dashboard Stats Cards

```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
  {/* 1 col mobile, 2 tablet, 4 desktop */}
</div>
```

#### Appreciations Page

```tsx
<div className="flex flex-col lg:flex-row">
  {/* Stacked mobile, side-by-side desktop */}
  <div className="w-full lg:w-[33%]">
    <AppreciationContextPanel />
  </div>
  <div className="w-full lg:w-[67%]">
    <AppreciationGenerator />
  </div>
</div>
```

#### Data Tables

```tsx
{/* Mobile: Card view */}
<div className="block md:hidden">
  {students.map(s => <StudentCard key={s.id} student={s} />)}
</div>

{/* Desktop: Table view */}
<div className="hidden md:block">
  <DataTable columns={columns} data={students} />
</div>
```

#### Calendar Grid

```tsx
<div className="grid grid-cols-1 md:grid-cols-7">
  {/* Mobile: daily view (1 col) */}
  {/* Tablet+: full week (7 cols) */}
</div>
```

### Touch-Friendly Design

**Button Sizing:**
```tsx
<Button className="h-11 px-8"> {/* 44px min height */}
  Click me
</Button>
```

**Spacing:**
```tsx
<div className="space-y-2 md:space-y-4">
  {/* 8px mobile, 16px desktop */}
</div>
```

**Gestures:**
- Drawer swipe-to-dismiss
- Calendar swipe left/right (future)
- Table row swipe actions (future)

### Mobile Detection Hook

**File:** `/src/shared/hooks/use-mobile.ts`

```typescript
export function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 1024)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  return isMobile
}
```

**Usage:**
```tsx
const isMobile = useIsMobile()
return isMobile ? <MobileView /> : <DesktopView />
```

### Responsive Typography

```tsx
<h1 className="text-2xl md:text-3xl lg:text-4xl">
  {/* 24px mobile, 30px tablet, 36px desktop */}
</h1>
```

---

## Accessibility

### WCAG 2.1 AA Compliance

**Target Compliance Level:** WCAG 2.1 Level AA

### Color Contrast

**Requirements Met:**
- Normal text (16px): ≥4.5:1 contrast ratio
- Large text (18px+): ≥3:1 contrast ratio
- UI components: ≥3:1 contrast ratio

**Implementation:**
- All text colors tested against backgrounds
- `text-foreground` on `bg-background`: 18:1 ratio (excellent)
- `text-muted-foreground` on `bg-background`: 7:1 ratio (AAA)
- Primary buttons: sufficient contrast maintained

### Keyboard Navigation

**Full Keyboard Support:**
- Tab: Move focus forward
- Shift+Tab: Move focus backward
- Enter/Space: Activate buttons/links
- Escape: Close modals/dialogs
- Arrow keys: Navigate menus/lists

**Focus Management:**
- Visible focus indicators (ring-2 ring-primary)
- Logical tab order (follows visual flow)
- Focus trapping in modals
- Focus restoration after modal close

**Implementation:**
```tsx
<Button className="focus-visible:ring-2 focus-visible:ring-primary">
  Click me
</Button>
```

### ARIA Labels & Semantics

**Radix UI Primitives:** All components use proper ARIA attributes out-of-the-box

**Examples:**
```tsx
<Dialog>  {/* role="dialog" aria-modal="true" */}
<Tabs>    {/* role="tablist", role="tab", role="tabpanel" */}
<Checkbox> {/* role="checkbox" aria-checked */}
```

**Custom Additions:**
```tsx
<button aria-label="Close modal">
  <X className="h-4 w-4" />
</button>

<div role="alert" aria-live="polite">
  {/* Toast notification */}
</div>
```

### Screen Reader Support

**Semantic HTML:**
- `<main>` for main content
- `<nav>` for navigation
- `<header>` for page headers
- `<section>` for content sections
- `<article>` for independent content

**Labels:**
- All form inputs have associated `<label>`
- Icon-only buttons have `aria-label`
- Complex widgets have `aria-describedby`

**Live Regions:**
- Toast notifications: `aria-live="polite"`
- Error messages: `aria-live="assertive"`
- Loading states: `aria-busy="true"`

### Visual Considerations

**Text Sizing:**
- Minimum 16px body text
- Respects user font-size preferences
- Zoom up to 200% without loss of functionality

**Color Independence:**
- Not relying on color alone for information
- Icons + color + text for status indicators
- Example: ✓ "Present" (green) vs ✗ "Absent" (red)

**Motion Sensitivity:**
- Subtle animations only
- Respects `prefers-reduced-motion`:
```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## Interaction Patterns

### Form Validation Pattern

**Standard Flow:**

1. **Initialization:**
   - React Hook Form + Zod schema
   - Default values populate

2. **Real-Time Validation:**
   - On blur: field validates
   - Error message appears below field
   - Border color: red (error) / green (valid)

3. **Submit Attempt:**
   - Validates all fields
   - If errors: focus first invalid
   - Error summary at form top
   - Submit button disabled during processing

4. **Async Operation:**
   - Loading spinner on button
   - Button text: "Créer" → "Création..."
   - Form fields disabled
   - Cannot navigate away (confirmation)

5. **Success Handling:**
   - Toast: "✓ Opération réussie"
   - Form resets (if configured)
   - Modal closes (if in modal)
   - Parent refreshes data

6. **Error Handling:**
   - Toast: "✗ Erreur : [message]"
   - Form remains open
   - Error at form top
   - Fields remain filled for correction

**Example Implementation:**
```tsx
<Form {...form}>
  <form onSubmit={form.handleSubmit(onSubmit)}>
    <FormField
      control={form.control}
      name="title"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Title</FormLabel>
          <FormControl>
            <Input placeholder="Enter title..." {...field} />
          </FormControl>
          <FormMessage /> {/* Error message */}
        </FormItem>
      )}
    />
    <Button type="submit" disabled={isLoading}>
      {isLoading ? "Saving..." : "Save"}
    </Button>
  </form>
</Form>
```

**Files:**
- Hook: `/src/shared/hooks/use-validation.ts`
- Wrapper: `/src/components/molecules/form/form.tsx`
- Async: `/src/shared/hooks/use-async-operation.ts`

### Modal/Dialog Pattern

**Usage Guidelines:**

**Use Modals For:**
- Create/edit forms (focused task)
- Confirmation dialogs (destructive actions)
- Detail views (quick reference without navigation)
- Multi-step wizards (guided workflow)

**Modal Structure:**
```tsx
<Dialog open={isOpen} onOpenChange={setIsOpen}>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Create New Exam</DialogTitle>
      <DialogDescription>
        Fill in the exam details below.
      </DialogDescription>
    </DialogHeader>

    {/* Form content */}

    <DialogFooter>
      <Button variant="outline" onClick={() => setIsOpen(false)}>
        Cancel
      </Button>
      <Button type="submit">
        Create
      </Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
```

**Behavior:**
- Focus traps inside modal
- Escape key closes
- Click outside closes (optional)
- Scroll lock on body
- Focus restoration on close

**File:** `/src/components/molecules/dialog/dialog.tsx`

### Toast Notification Pattern

**Usage Guidelines:**

**Use Toasts For:**
- Success confirmations (data saved)
- Error messages (operation failed)
- Info notifications (background process complete)
- Warning alerts (approaching limit)

**Implementation (Sonner):**
```tsx
import { toast } from "sonner"

// Success
toast.success("Notes enregistrées", {
  description: "24 students updated successfully",
})

// Error
toast.error("Erreur de sauvegarde", {
  description: "Please try again",
})

// Loading
const toastId = toast.loading("Saving grades...")
// Later: toast.success("Saved!", { id: toastId })

// Promise-based
toast.promise(saveGrades(), {
  loading: "Saving...",
  success: "Grades saved!",
  error: "Failed to save",
})
```

**Toast Position:** Top-right (desktop), Top-center (mobile)

**Duration:** 3 seconds (dismissible)

**File:** `/src/components/molecules/sonner/sonner.tsx`

### Loading State Pattern

**Skeleton Screens:**

Used during initial data fetch to prevent layout shift.

```tsx
{isLoading ? (
  <div className="space-y-2">
    <Skeleton className="h-12 w-full" />
    <Skeleton className="h-12 w-full" />
    <Skeleton className="h-12 w-full" />
  </div>
) : (
  <StudentList students={students} />
)}
```

**Loading Spinner:**

Used for short operations (<2 seconds).

```tsx
<Button disabled={isLoading}>
  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
  {isLoading ? "Saving..." : "Save"}
</Button>
```

**Progress Indicators:**

Used for longer operations with progress tracking.

```tsx
<div className="space-y-2">
  <div className="flex justify-between text-sm">
    <span>Generating appreciations...</span>
    <span>{current}/{total}</span>
  </div>
  <Progress value={(current / total) * 100} />
</div>
```

**File:** `/src/components/atoms/skeleton/skeleton.tsx`

### Empty State Pattern

**Guidelines:**

**Effective Empty States Include:**
- Helpful message (what's missing)
- Illustration or icon (visual interest)
- Call-to-action (what to do next)
- Optional: Onboarding context

**Example:**
```tsx
<div className="flex flex-col items-center justify-center py-12 text-center">
  <CalendarIcon className="h-12 w-12 text-muted-foreground mb-4" />
  <h3 className="text-lg font-semibold mb-2">
    Aucune session programmée
  </h3>
  <p className="text-sm text-muted-foreground mb-4">
    Créez votre première session pour commencer le suivi.
  </p>
  <Button onClick={handleCreate}>
    <Plus className="mr-2 h-4 w-4" />
    Créer une session
  </Button>
</div>
```

### Data Table Pattern

**Features:**
- Sortable columns (click header)
- Filterable (search + filters)
- Pagination (10/25/50/100 per page)
- Row selection (checkbox)
- Bulk actions (on selected rows)
- Row actions (dropdown menu)
- Responsive (card view on mobile)

**Implementation (@tanstack/react-table):**

```tsx
const columns = [
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => <div>{row.getValue("name")}</div>,
  },
  {
    id: "actions",
    cell: ({ row }) => (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon">
            <MoreVertical className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => handleEdit(row.original)}>
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleDelete(row.original)}>
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  },
]

<DataTable columns={columns} data={data} />
```

**File:** `/src/components/organisms/data-table/data-table.tsx`

---

## Implementation References

### Key File Locations

#### Pages
- Dashboard: `/src/app/dashboard/accueil/page.tsx`
- Appreciations: `/src/app/dashboard/appreciations/page.tsx`
- Calendar: `/src/app/dashboard/calendrier/page.tsx`
- Sessions: `/src/app/dashboard/sessions/page.tsx`
- Students List: `/src/app/dashboard/mes-eleves/page.tsx`
- Student Detail: `/src/app/dashboard/mes-eleves/[id]/page.tsx`
- Evaluations: `/src/app/dashboard/evaluations/page.tsx`

#### Layouts
- Dashboard Layout: `/src/app/dashboard/layout.tsx`
- Sidebar: `/src/components/templates/app-sidebar/app-sidebar.tsx`
- Header: `/src/components/templates/site-header/site-header.tsx`

#### Design System
- Global Styles: `/src/app/globals.css`
- Tailwind Config: `tailwind.config.ts`
- Typography: `/src/components/atoms/typography/typography.tsx`
- Color System: Variables in `globals.css`

#### Shared Hooks
- useIsMobile: `/src/shared/hooks/use-mobile.ts`
- useModal: `/src/shared/hooks/use-modal.ts`
- useAsyncOperation: `/src/shared/hooks/use-async-operation.ts`
- useValidation: `/src/shared/hooks/use-validation.ts`
- usePageTitle: `/src/shared/hooks/use-page-title.tsx`

#### Feature Hooks
- Appreciations: `/src/features/appreciations/hooks/`
- Calendar: `/src/features/calendar/hooks/`
- Evaluations: `/src/features/evaluations/hooks/`
- Students: `/src/features/students/hooks/`
- Sessions: `/src/features/sessions/hooks/`

#### Services
- Behavioral Analysis: `/src/features/students/services/behavioral-analysis-service.ts`
- Academic Analysis: `/src/features/students/services/academic-analysis-service.ts`
- Student Profile: `/src/features/students/services/student-profile-service.ts`
- Notation System: `/src/features/evaluations/services/notation-system-service.ts`
- Appreciation Generator: `/src/features/appreciations/services/appreciation-generator.ts`

#### Components by Atomic Level
- Atoms: `/src/components/atoms/` (34 composants)
- Molecules: `/src/components/molecules/` (42 composants)
- Organisms: `/src/components/organisms/` (46 composants)
- Templates: `/src/components/templates/` (7 composants)

### Component Organization Pattern

**Atomic Design Structure:**

```
/src/components/
├── atoms/           # Basic UI elements (buttons, inputs, badges)
├── molecules/       # Composed components (cards, forms, dialogs)
├── organisms/       # Complex sections (tables, charts, panels)
└── templates/       # Layout components (sidebar, header, nav)
```

**Feature-Based Structure:**

```
/src/features/
├── [feature-name]/
│   ├── hooks/       # Business logic hooks (use-*-management.ts)
│   ├── mocks/       # Test data (MOCK_* constants)
│   ├── services/    # Business logic (when complex)
│   ├── utils/       # Helper functions (when needed)
│   └── index.ts     # Public API exports
```

### Import Patterns

**Component Imports:**
```tsx
import { Button } from "@/components/atoms/button"
import { Card } from "@/components/molecules/card"
import { DataTable } from "@/components/organisms/data-table"
import { AppSidebar } from "@/components/templates/app-sidebar"
```

**Feature Imports:**
```tsx
import { useExamManagement } from "@/features/evaluations/hooks"
import { useCalendar } from "@/features/calendar/hooks"
import { MOCK_STUDENTS } from "@/features/students/mocks"
```

**Shared Utilities:**
```tsx
import { useModal, useAsyncOperation } from "@/shared/hooks"
import { cn } from "@/lib/utils"
```

### Styling Conventions

**Tailwind CSS Classes:**
```tsx
// Composition with cn() utility
<div className={cn(
  "flex items-center gap-2",
  isActive && "bg-primary text-primary-foreground",
  className
)}>
```

**Custom CSS (when needed):**
```css
/* globals.css */
.custom-scrollbar {
  scrollbar-width: thin;
  scrollbar-color: oklch(var(--color-primary)) transparent;
}
```

**CSS Variables:**
```tsx
<div style={{
  "--sidebar-width": "280px",
  "--header-height": "48px",
} as React.CSSProperties}>
```

---

## Next Steps

### For Architecture Phase

This UX Specification provides foundation for:

1. **Frontend Architecture:**
   - Component library structure (documented)
   - State management patterns (hooks + context)
   - Routing structure (App Router)
   - Data fetching strategies

2. **API Design:**
   - Screen data requirements inform endpoints
   - User flows inform API call sequences
   - Real-time needs inform WebSocket requirements

3. **State Management:**
   - Global state: Class selection context
   - Local state: Form data, UI state
   - Server state: React Query/SWR for caching

4. **Performance Optimization:**
   - Code splitting by route
   - Lazy loading components
   - Image optimization
   - Bundle size optimization

### For Implementation

1. **Component Development:**
   - All components documented with locations
   - Atomic design hierarchy established
   - shadcn/ui integration complete

2. **Feature Development:**
   - User flows documented
   - Interaction patterns defined
   - Success criteria clear

3. **Testing Strategy:**
   - Visual regression testing (Chromatic)
   - Component testing (Storybook)
   - E2E testing (Playwright) for user flows
   - Accessibility testing (axe-core)

4. **Documentation:**
   - Component usage examples
   - Pattern library (Storybook)
   - Onboarding guides

---

## Document Metadata

**Status:** ✅ Complete - Based on comprehensive codebase analysis

**Coverage:**
- 7 main pages documented
- 129 components catalogued
- 4 complete user flows
- Design system fully specified
- Accessibility guidelines included
- Responsive patterns documented

**Generated From:**
- Codebase analysis: `/src/` directory
- PRD reference: `/docs/PRD.md`
- Epic breakdown: `/docs/epics.md`
- Project analysis: `/docs/project-workflow-analysis.md`

**Validation:**
- All file references verified
- Component locations confirmed
- Implementation patterns extracted from actual code
- No assumptions - all based on existing implementation

---

*Document généré le 14 octobre 2025 par analyse brownfield du projet outil-professor*
