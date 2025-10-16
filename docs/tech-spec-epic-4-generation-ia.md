# Technical Specification: Epic 4 - Génération IA

**Project:** outil-professor
**Epic:** Epic 4 - Génération Automatisée de Contenu Pédagogique
**Timeline:** Sprint 7-9 (4-5 semaines)
**Stories:** 6 user stories
**Priority:** TRÈS HAUTE - Valeur différenciante majeure

---

## Table of Contents

1. [Epic Overview](#epic-overview)
2. [User Stories](#user-stories)
3. [Architecture Components](#architecture-components)
4. [Data Models](#data-models)
5. [Frontend Components](#frontend-components)
6. [Implementation Guide](#implementation-guide)
7. [AI Generation Strategy](#ai-generation-strategy)
8. [Testing Approach](#testing-approach)

---

## Epic Overview

### Objective

Implémenter le cœur de la proposition de valeur : génération IA de rapports bihebdomadaires pour parents et d'appréciations trimestrielles pour bulletins, avec système de phrases templates et guides de style garantissant qualité et bienveillance.

### Success Criteria

- ✅ Génération 20 rapports bihebdomadaires en < 15 minutes (machine + révision)
- ✅ Génération 60 appréciations trimestrielles en < 2 heures (machine + révision)
- ✅ 90% des commentaires nécessitent < 5% modification manuelle
- ✅ Ton bienveillant garanti dans 100% des cas (validation manuelle enseignante satisfaite ≥ 8/10)
- ✅ Export PDF fonctionnel pour 100% des rapports/appréciations

### Value Delivered

**Gain de temps massif :**
- Rapports parents : 15min vs 2-3h manuellement (✅ -50% temps)
- Appréciations bulletins : 2h vs 6-8h manuellement (✅ -70% temps)

**Qualité garantie :**
- Vocabulaire bienveillant standardisé
- Cohérence entre tous les documents
- Personnalisation basée sur analytics réelles

**Réduction stress :**
- Périodes d'évaluation moins anxiogènes
- Pas de nuits blanches avant deadlines bulletins

---

## User Stories

### Story 4.1: Banque de Phrases Templates

**En tant qu'** enseignante,
**Je veux** créer et organiser une bibliothèque de phrases types,
**Afin de** construire mes rapports et appréciations avec vocabulaire cohérent et bienveillant.

**Critères d'acceptation:**
1. Page "Appréciations > Banque de Phrases" liste phrases organisées par catégories
2. Catégories : Présence, Participation, Comportement, Progrès, Difficultés, Encouragements
3. Bouton "Nouvelle phrase" ouvre formulaire : catégorie (select), phrase (textarea), tags/contexte (ex: "bonne_présence", "progrès_notable")
4. Phrases affichées avec prévisualisation et tags
5. Actions "Modifier" et "Supprimer" pour chaque phrase
6. Recherche phrases par catégorie ou tag
7. Import/Export CSV pour partage phrases entre enseignants (future)

---

### Story 4.2: Guides de Style Configurables

**En tant qu'** enseignante,
**Je veux** définir des guides de style pour différents types de documents,
**Afin d'** adapter le ton (formel/informel) et la longueur selon le contexte (parents/bulletin).

**Critères d'acceptation:**
1. Page "Appréciations > Guides de Style" liste guides existants
2. Bouton "Nouveau guide" ouvre formulaire : nom (ex: "Formel - Bulletin"), ton (select: Formel/Semi-formel/Informel), longueur cible (select: Court 50-80 mots / Standard 80-120 / Long 120-150), niveau langage (select: Simple/Soutenu)
3. Guide créé utilisable lors génération rapports/appréciations
4. Guide par défaut sélectionnable pour chaque type document
5. Actions "Modifier", "Dupliquer", "Supprimer"

---

### Story 4.3: Génération Automatique Rapports Bihebdomadaires

**En tant qu'** enseignante,
**Je veux** générer automatiquement des rapports bihebdomadaires pour tous les élèves d'une classe,
**Afin de** communiquer rapidement aux parents en 15min vs 2-3h manuellement.

**Critères d'acceptation:**
1. Dashboard affiche alerte : "Rapports bihebdomadaires à générer (15 jours écoulés)"
2. Clic alerte ou depuis page "Appréciations", bouton "Générer rapports bihebdomadaires"
3. Modal configuration : Classe (dropdown), Guide de style (dropdown défaut "Informel - Parents"), Période (dernières 2 semaines auto-sélectionnée)
4. Bouton "Générer pour tous les élèves" lance génération
5. Progress bar : "Génération : 12/20 élèves (60%)" avec estimation temps restant
6. **Logique génération** (≤ 10sec/élève)
7. Écran révision : Liste 20 rapports avec aperçu, possibilité édition inline avant validation
8. **Objectif global** : 15 minutes machine + révision pour 20 élèves

---

### Story 4.4: Révision et Édition Manuelle Rapports Bihebdomadaires

**En tant qu'** enseignante,
**Je veux** pouvoir éditer manuellement chaque rapport généré avant export,
**Afin de** personnaliser et ajuster le contenu selon ma connaissance de l'élève.

**Critères d'acceptation:**
1. Écran révision batch affiche liste élèves gauche, rapport centre, stats droite (3 colonnes)
2. Sélection élève dans liste affiche son rapport au centre
3. Éditeur richtext (bold, italic, listes) permet modification libre
4. Indicateur "✏️ Modifié" si rapport édité vs original
5. Bouton "Réinitialiser" restaure version générée automatiquement
6. Compteur caractères/mots pour respecter longueur cible guide de style
7. Sauvegarde auto toutes les 10 secondes
8. Navigation élève suivant/précédent (flèches clavier)
9. Validation rapport individuelle : marque rapport "Validé ✅"
10. Seuls rapports validés exportables en PDF

---

### Story 4.5: Génération Automatique Appréciations Trimestrielles

**En tant qu'** enseignante,
**Je veux** générer automatiquement les appréciations de bulletins trimestriels pour tous mes élèves,
**Afin de** préparer les bulletins en 2h vs 6-8h manuellement pour 60 élèves.

**Critères d'acceptation:**
1. Page "Appréciations", bouton "Générer appréciations trimestrielles"
2. Modal configuration : Période académique (dropdown trimestre), Classes (multi-select), Guide de style (dropdown défaut "Formel - Bulletin"), Longueur (dropdown défaut "Standard 80-120 mots")
3. Bouton "Générer pour toutes les classes sélectionnées" (ex: 3 classes, 60 élèves)
4. Progress bar globale : "15/60 élèves (25%)"
5. **Logique génération** (≤ 15sec/élève) : Analyse complète trimestre
6. Écran révision : Interface 3 colonnes similaire rapports bihebdomadaires
7. Possibilité révision par classe (toggle filtre classe)
8. **Objectif global** : ~2h pour génération + révision 60 élèves (vs 6-8h manuellement)

---

### Story 4.6: Export Multi-Format (PDF et CSV)

**En tant qu'** enseignante,
**Je veux** exporter mes rapports/appréciations validés en PDF et CSV,
**Afin de** les envoyer aux parents (PDF) et les importer dans le logiciel bulletins de l'école (CSV).

**Critères d'acceptation:**
1. Écran révision, bouton "Exporter" ouvre modal options export
2. Options :
   - Format PDF : génère fichiers individuels (1 par élève) en ZIP
   - Format CSV : génère fichier structuré (colonnes: nom, prénom, classe, appréciation)
   - Format PDF batch : génère PDF multi-pages avec tous élèves (pour impression)
3. Pour PDF, template professionnel : header avec logo/nom école, mise en forme claire, footer avec date génération
4. Export CSV structure : `nom,prénom,classe,appréciation` (compatible import logiciels bulletins standard)
5. Téléchargement déclenché automatiquement après génération
6. Confirmation : "Export réussi : 20 fichiers PDF (archive.zip) téléchargé"
7. Option "Archiver dans système" : sauvegarde copie exports pour référence future

---

## Architecture Components

### Feature Module: `appreciations`

```
/src/features/appreciations/
├── hooks/
│   ├── use-appreciation-generation.ts   # Main generation orchestration
│   ├── use-style-guides.ts              # Style guide management
│   └── use-phrase-bank.ts               # Phrase bank management
├── mocks/
│   ├── mock-appreciations.ts
│   ├── mock-style-guides.ts
│   ├── mock-phrase-banks.ts
│   └── index.ts
├── services/
│   └── appreciation-generator.ts        # AI generation engine
└── index.ts
```

### Global Services

```
/src/services/
├── pdf-service.ts                       # PDF generation (jsPDF)
└── ai-service.ts                        # Future: External AI API integration
```

---

## Data Storage Strategy - ⚠️ LOCAL STORAGE (MVP)

**Important**: Epic 4 utilise **localStorage** pour toutes les données (phrase bank, style guides, appréciations générées).

**Rationale MVP:**
- Pas d'endpoints API backend pour appréciations (voir rapport endpoints manquants)
- Données locales = simplicité + rapidité développement
- Export PDF/CSV suffit pour partage
- Future migration backend possible sans impact UX

**Stored in localStorage:**
- `styleGuides`: Array<StyleGuide>
- `phraseBank`: Array<PhraseBank>
- `appreciations`: Array<AppreciationContent>
- `backupHistory`: Array<Backup> (auto-save)

**Data fetched from API (Epic 3):**
- Student analytics: `/students/{id}/profile`, `/students/{id}/attendance-rate`, `/students/{id}/participation-average`
- Class data: `/classes/{id}/students/analytics`
- Session data: `/course-sessions`
- Exam results: `/exams/{id}/results`

---

## Data Models

### AppreciationContent

```typescript
interface AppreciationContent {
  id: string
  studentId: string
  type: 'biweekly_report' | 'trimester_appreciation'
  periodStart: Date
  periodEnd: Date
  content: string
  styleGuideId: string
  generatedAt: Date
  editedAt?: Date
  isEdited: boolean
  isValidated: boolean
  metadata: {
    attendanceRate: number
    avgParticipation: string
    avgGrade: number
    wordCount: number
  }
}
```

### StyleGuide

```typescript
interface StyleGuide {
  id: string
  name: string
  tone: 'formal' | 'semi-formal' | 'informal'
  targetLength: {
    min: number
    max: number
  }
  languageLevel: 'simple' | 'standard' | 'sophisticated'
  isDefault: boolean
  createdAt: Date
}
```

### PhraseBank

```typescript
interface PhraseBank {
  id: string
  category: 'attendance' | 'participation' | 'behavior' | 'progress' | 'difficulties' | 'encouragement'
  phrase: string
  tags: string[]
  context: {
    attendanceRange?: [number, number] // e.g., [75, 100] for good attendance
    participationLevel?: 'low' | 'medium' | 'high'
    behaviorScore?: [number, number]
    gradeRange?: [number, number]
  }
  createdAt: Date
}
```

---

## Frontend Components

### Organisms (To Create)

#### `appreciation-generator`
**Purpose:** Main generation interface
**Props:**
```typescript
interface AppreciationGeneratorProps {
  type: 'biweekly' | 'trimester'
  onGenerate: (config: GenerationConfig) => Promise<void>
}

interface GenerationConfig {
  classIds: string[]
  styleGuideId: string
  periodStart: Date
  periodEnd: Date
}
```

#### `appreciation-context-panel`
**Purpose:** Right sidebar showing student context during review
**Props:**
```typescript
interface AppreciationContextPanelProps {
  student: Student
  analytics: StudentAnalytics
  recentSessions: CourseSession[]
  recentGrades: StudentExamResult[]
}
```

**Layout:** Innovative 67%/33% split
```
┌────────────────────────────────┬──────────────────┐
│  Main Content (67%)            │  Context Panel   │
│                                │  (33%)           │
│  - Class/Student Selector      │  - Student Info  │
│  - Generated Content Editor    │  - Analytics     │
│  - Navigation Controls         │  - Recent Data   │
│                                │  - Strengths     │
└────────────────────────────────┴──────────────────┘
```

#### `content-review-panel`
**Purpose:** 3-column review interface
**Layout:**
```
┌──────────┬────────────────────────┬──────────────┐
│ Students │  Generated Content     │ Student Data │
│ List     │  (Editable)            │ (Read-only)  │
│ (20%)    │  (50%)                 │ (30%)        │
└──────────┴────────────────────────┴──────────────┘
```

**Props:**
```typescript
interface ContentReviewPanelProps {
  appreciations: AppreciationContent[]
  students: Student[]
  analytics: Record<string, StudentAnalytics>
  onEdit: (id: string, content: string) => void
  onValidate: (id: string) => void
  onExport: (format: 'pdf' | 'csv') => Promise<void>
}
```

#### `style-guide-editor`
**Purpose:** Create/edit style guides
**Props:**
```typescript
interface StyleGuideEditorProps {
  styleGuide?: StyleGuide
  onSave: (data: StyleGuideInput) => Promise<void>
  onClose: () => void
}
```

#### `phrase-bank-editor`
**Purpose:** Manage phrase templates
**Props:**
```typescript
interface PhraseBankEditorProps {
  phrases: PhraseBank[]
  onAdd: (phrase: PhraseBankInput) => Promise<void>
  onEdit: (id: string, phrase: PhraseBankInput) => Promise<void>
  onDelete: (id: string) => Promise<void>
}
```

---

## Implementation Guide

### Phase 1: Foundation - Phrase Bank & Style Guides (Days 1-3)

**Step 1: Create Appreciations Feature Module**
```bash
mkdir -p src/features/appreciations/hooks
mkdir -p src/features/appreciations/services
mkdir -p src/features/appreciations/mocks
```

**Step 2: Implement Style Guides Hook**

`/src/features/appreciations/hooks/use-style-guides.ts`:
```typescript
import { useState, useEffect } from 'react'
import { StyleGuide } from '@/types/uml-entities'

export function useStyleGuides() {
  const [styleGuides, setStyleGuides] = useState<StyleGuide[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadStyleGuides()
  }, [])

  const loadStyleGuides = async () => {
    // For MVP: Load from localStorage or mocks
    const saved = localStorage.getItem('styleGuides')
    if (saved) {
      setStyleGuides(JSON.parse(saved))
    } else {
      // Initialize with default style guides
      const defaults = createDefaultStyleGuides()
      setStyleGuides(defaults)
      localStorage.setItem('styleGuides', JSON.stringify(defaults))
    }
    setLoading(false)
  }

  const createStyleGuide = (data: StyleGuideInput) => {
    const newGuide: StyleGuide = {
      id: generateId(),
      ...data,
      createdAt: new Date()
    }
    const updated = [...styleGuides, newGuide]
    setStyleGuides(updated)
    localStorage.setItem('styleGuides', JSON.stringify(updated))
    return newGuide
  }

  const updateStyleGuide = (id: string, data: Partial<StyleGuide>) => {
    const updated = styleGuides.map(g => g.id === id ? { ...g, ...data } : g)
    setStyleGuides(updated)
    localStorage.setItem('styleGuides', JSON.stringify(updated))
  }

  const deleteStyleGuide = (id: string) => {
    const updated = styleGuides.filter(g => g.id !== id)
    setStyleGuides(updated)
    localStorage.setItem('styleGuides', JSON.stringify(updated))
  }

  return {
    styleGuides,
    loading,
    createStyleGuide,
    updateStyleGuide,
    deleteStyleGuide
  }
}

function createDefaultStyleGuides(): StyleGuide[] {
  return [
    {
      id: 'style-informal-parents',
      name: 'Informel - Parents',
      tone: 'informal',
      targetLength: { min: 80, max: 120 },
      languageLevel: 'simple',
      isDefault: true,
      createdAt: new Date()
    },
    {
      id: 'style-formal-bulletin',
      name: 'Formel - Bulletin',
      tone: 'formal',
      targetLength: { min: 100, max: 150 },
      languageLevel: 'sophisticated',
      isDefault: false,
      createdAt: new Date()
    }
  ]
}
```

**Step 3: Implement Phrase Bank Hook**

`/src/features/appreciations/hooks/use-phrase-bank.ts`:
```typescript
import { useState, useEffect } from 'react'
import { PhraseBank } from '@/types/uml-entities'

export function usePhraseBank() {
  const [phrases, setPhrases] = useState<PhraseBank[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadPhrases()
  }, [])

  const loadPhrases = async () => {
    const saved = localStorage.getItem('phraseBank')
    if (saved) {
      setPhrases(JSON.parse(saved))
    } else {
      const defaults = createDefaultPhraseBank()
      setPhrases(defaults)
      localStorage.setItem('phraseBank', JSON.stringify(defaults))
    }
    setLoading(false)
  }

  const addPhrase = (data: PhraseBankInput) => {
    const newPhrase: PhraseBank = {
      id: generateId(),
      ...data,
      createdAt: new Date()
    }
    const updated = [...phrases, newPhrase]
    setPhrases(updated)
    localStorage.setItem('phraseBank', JSON.stringify(updated))
    return newPhrase
  }

  const updatePhrase = (id: string, data: Partial<PhraseBank>) => {
    const updated = phrases.map(p => p.id === id ? { ...p, ...data } : p)
    setPhrases(updated)
    localStorage.setItem('phraseBank', JSON.stringify(updated))
  }

  const deletePhrase = (id: string) => {
    const updated = phrases.filter(p => p.id !== id)
    setPhrases(updated)
    localStorage.setItem('phraseBank', JSON.stringify(updated))
  }

  const findRelevantPhrases = (
    category: PhraseBank['category'],
    context: {
      attendanceRate?: number
      participationLevel?: string
      behaviorScore?: number
      avgGrade?: number
    }
  ): PhraseBank[] => {
    return phrases.filter(phrase => {
      if (phrase.category !== category) return false

      // Match context
      if (phrase.context.attendanceRange && context.attendanceRate) {
        const [min, max] = phrase.context.attendanceRange
        if (context.attendanceRate < min || context.attendanceRate > max) {
          return false
        }
      }

      if (phrase.context.participationLevel && context.participationLevel) {
        if (phrase.context.participationLevel !== context.participationLevel) {
          return false
        }
      }

      // Add more context matching...

      return true
    })
  }

  return {
    phrases,
    loading,
    addPhrase,
    updatePhrase,
    deletePhrase,
    findRelevantPhrases
  }
}
```

**Step 4: Seed Default Phrase Bank**

`/src/features/appreciations/mocks/mock-phrase-banks.ts`:
```typescript
export const MOCK_PHRASE_BANK: PhraseBank[] = [
  // Attendance - Good
  {
    id: 'phrase-attendance-good-1',
    category: 'attendance',
    phrase: '{firstName} fait preuve d\'une excellente assiduité avec un taux de présence de {attendanceRate}%.',
    tags: ['assiduité', 'présence', 'excellent'],
    context: {
      attendanceRange: [90, 100]
    },
    createdAt: new Date()
  },
  {
    id: 'phrase-attendance-good-2',
    category: 'attendance',
    phrase: 'La régularité de {firstName} est remarquable et témoigne de son engagement.',
    tags: ['régularité', 'engagement'],
    context: {
      attendanceRange: [85, 100]
    },
    createdAt: new Date()
  },

  // Attendance - Moderate
  {
    id: 'phrase-attendance-moderate-1',
    category: 'attendance',
    phrase: '{firstName} présente une assiduité convenable avec {attendanceRate}% de présence.',
    tags: ['assiduité', 'convenable'],
    context: {
      attendanceRange: [70, 85]
    },
    createdAt: new Date()
  },

  // Attendance - Low
  {
    id: 'phrase-attendance-low-1',
    category: 'attendance',
    phrase: 'Les absences répétées de {firstName} ({attendanceRate}% de présence) limitent sa progression. Une meilleure assiduité serait bénéfique.',
    tags: ['absences', 'préoccupant', 'amélioration'],
    context: {
      attendanceRange: [0, 70]
    },
    createdAt: new Date()
  },

  // Participation - High
  {
    id: 'phrase-participation-high-1',
    category: 'participation',
    phrase: '{firstName} participe activement en classe et s\'investit pleinement dans les activités proposées.',
    tags: ['participation', 'actif', 'investissement'],
    context: {
      participationLevel: 'high'
    },
    createdAt: new Date()
  },
  {
    id: 'phrase-participation-high-2',
    category: 'participation',
    phrase: 'L\'enthousiasme et la participation de {firstName} enrichissent les échanges en classe.',
    tags: ['enthousiasme', 'échanges'],
    context: {
      participationLevel: 'high'
    },
    createdAt: new Date()
  },

  // Participation - Medium
  {
    id: 'phrase-participation-medium-1',
    category: 'participation',
    phrase: '{firstName} participe de manière satisfaisante aux activités de classe.',
    tags: ['participation', 'satisfaisant'],
    context: {
      participationLevel: 'medium'
    },
    createdAt: new Date()
  },

  // Participation - Low
  {
    id: 'phrase-participation-low-1',
    category: 'participation',
    phrase: '{firstName} gagnerait à participer davantage pour progresser plus rapidement.',
    tags: ['participation', 'timide', 'encouragement'],
    context: {
      participationLevel: 'low'
    },
    createdAt: new Date()
  },

  // Behavior - Positive
  {
    id: 'phrase-behavior-positive-1',
    category: 'behavior',
    phrase: 'Le comportement de {firstName} est exemplaire et contribue à une ambiance de classe positive.',
    tags: ['comportement', 'exemplaire'],
    context: {
      behaviorScore: [50, 100]
    },
    createdAt: new Date()
  },

  // Progress
  {
    id: 'phrase-progress-1',
    category: 'progress',
    phrase: '{firstName} montre des progrès constants et une belle évolution ce trimestre.',
    tags: ['progrès', 'évolution', 'positif'],
    context: {},
    createdAt: new Date()
  },

  // Encouragement
  {
    id: 'phrase-encouragement-1',
    category: 'encouragement',
    phrase: 'Continuez ainsi, vous êtes sur la bonne voie !',
    tags: ['encouragement', 'positif'],
    context: {},
    createdAt: new Date()
  },
  {
    id: 'phrase-encouragement-2',
    category: 'encouragement',
    phrase: 'Je vous encourage à maintenir vos efforts pour le prochain trimestre.',
    tags: ['encouragement', 'efforts'],
    context: {},
    createdAt: new Date()
  }
]
```

### Phase 2: AI Generation Engine (Days 4-8)

**Step 1: Implement Appreciation Generator Service**

`/src/features/appreciations/services/appreciation-generator.ts`:
```typescript
import { Student, StudentProfile, StyleGuide, PhraseBank } from '@/types/uml-entities'
import { BehavioralAnalysisService } from '@/features/students/services/behavioral-analysis-service'
import { AcademicAnalysisService } from '@/features/students/services/academic-analysis-service'

export class AppreciationGeneratorService {
  private behavioralAnalysis: BehavioralAnalysisService
  private academicAnalysis: AcademicAnalysisService

  constructor() {
    this.behavioralAnalysis = new BehavioralAnalysisService()
    this.academicAnalysis = new AcademicAnalysisService()
  }

  async generateAppreciation(
    student: Student,
    profile: StudentProfile,
    styleGuide: StyleGuide,
    phraseBank: PhraseBank[],
    type: 'biweekly' | 'trimester'
  ): Promise<string> {
    // 1. Build context
    const context = this.buildContext(student, profile)

    // 2. Select relevant phrases
    const selectedPhrases = this.selectContextualPhrases(context, phraseBank)

    // 3. Build structure based on type
    const structure = this.buildStructure(type, styleGuide)

    // 4. Generate content
    const content = this.generate(context, selectedPhrases, structure, styleGuide)

    // 5. Apply style guide formatting
    const formatted = this.applyStyleGuide(content, styleGuide)

    return formatted
  }

  private buildContext(student: Student, profile: StudentProfile) {
    return {
      firstName: student.firstName,
      lastName: student.lastName,
      attendanceRate: profile.analytics.attendanceRate,
      participationLevel: profile.analytics.avgParticipation,
      behaviorScore: profile.analytics.behaviorScore,
      avgGrade: profile.avgGrade,
      recentGrades: profile.recentGrades,
      strengths: student.strengths || [],
      needs: student.needs,
      patterns: profile.analytics.patterns,
      recommendations: profile.analytics.recommendations
    }
  }

  private selectContextualPhrases(
    context: any,
    phraseBank: PhraseBank[]
  ): Record<string, PhraseBank[]> {
    const selected: Record<string, PhraseBank[]> = {
      attendance: [],
      participation: [],
      behavior: [],
      progress: [],
      encouragement: []
    }

    // Select attendance phrases
    selected.attendance = phraseBank.filter(p => {
      if (p.category !== 'attendance') return false
      if (!p.context.attendanceRange) return false
      const [min, max] = p.context.attendanceRange
      return context.attendanceRate >= min && context.attendanceRate <= max
    })

    // Select participation phrases
    selected.participation = phraseBank.filter(p => {
      if (p.category !== 'participation') return false
      return p.context.participationLevel === context.participationLevel
    })

    // Select behavior phrases
    selected.behavior = phraseBank.filter(p => {
      if (p.category !== 'behavior') return false
      if (!p.context.behaviorScore) return false
      const [min, max] = p.context.behaviorScore
      return context.behaviorScore >= min && context.behaviorScore <= max
    })

    // Select progress phrases
    selected.progress = phraseBank.filter(p => p.category === 'progress')

    // Select encouragement phrases
    selected.encouragement = phraseBank.filter(p => p.category === 'encouragement')

    return selected
  }

  private buildStructure(type: 'biweekly' | 'trimester', styleGuide: StyleGuide) {
    if (type === 'biweekly') {
      return {
        sections: ['opening', 'attendance', 'participation', 'recent_work', 'encouragement'],
        paragraphs: 2,
        targetLength: styleGuide.targetLength
      }
    } else {
      return {
        sections: ['opening', 'attendance', 'participation', 'behavior', 'academic_results', 'progress', 'areas_for_improvement', 'encouragement'],
        paragraphs: 3,
        targetLength: styleGuide.targetLength
      }
    }
  }

  private generate(
    context: any,
    selectedPhrases: Record<string, PhraseBank[]>,
    structure: any,
    styleGuide: StyleGuide
  ): string {
    const paragraphs: string[] = []

    // Opening
    if (structure.sections.includes('opening')) {
      paragraphs.push(this.generateOpening(context, styleGuide))
    }

    // Body paragraphs
    const bodySections = structure.sections.filter(s => s !== 'opening' && s !== 'encouragement')
    const bodyContent: string[] = []

    bodySections.forEach(section => {
      const phrase = this.selectPhrase(selectedPhrases[section] || [])
      if (phrase) {
        const interpolated = this.interpolateVariables(phrase.phrase, context)
        bodyContent.push(interpolated)
      }
    })

    // Combine body content into paragraphs
    if (structure.paragraphs === 2) {
      paragraphs.push(bodyContent.slice(0, Math.ceil(bodyContent.length / 2)).join(' '))
      paragraphs.push(bodyContent.slice(Math.ceil(bodyContent.length / 2)).join(' '))
    } else {
      bodyContent.forEach(content => paragraphs.push(content))
    }

    // Closing
    if (structure.sections.includes('encouragement')) {
      const encouragement = this.selectPhrase(selectedPhrases.encouragement)
      if (encouragement) {
        paragraphs.push(this.interpolateVariables(encouragement.phrase, context))
      }
    }

    return paragraphs.join('\n\n')
  }

  private generateOpening(context: any, styleGuide: StyleGuide): string {
    if (styleGuide.tone === 'formal') {
      return `Appréciation concernant ${context.firstName} ${context.lastName} pour la période évaluée.`
    } else {
      return `Voici le bilan de ${context.firstName} pour les dernières semaines.`
    }
  }

  private selectPhrase(phrases: PhraseBank[]): PhraseBank | null {
    if (phrases.length === 0) return null
    // Random selection for variety
    return phrases[Math.floor(Math.random() * phrases.length)]
  }

  private interpolateVariables(phrase: string, context: any): string {
    let result = phrase

    // Replace {firstName}, {attendanceRate}, etc.
    const variables = phrase.match(/\{([^}]+)\}/g)
    if (variables) {
      variables.forEach(variable => {
        const key = variable.slice(1, -1) // Remove { and }
        const value = context[key]
        if (value !== undefined) {
          result = result.replace(variable, value.toString())
        }
      })
    }

    return result
  }

  private applyStyleGuide(content: string, styleGuide: StyleGuide): string {
    // Apply tone adjustments
    if (styleGuide.tone === 'formal') {
      // Ensure formal language
      content = content.replace(/vous/gi, 'vous')
    } else if (styleGuide.tone === 'informal') {
      // More casual phrasing (already in templates)
    }

    // Check length and trim if needed
    const wordCount = content.split(/\s+/).length
    if (wordCount > styleGuide.targetLength.max) {
      // Trim to target length
      const words = content.split(/\s+/)
      content = words.slice(0, styleGuide.targetLength.max).join(' ') + '...'
    }

    return content
  }

  async generateBatch(
    students: Student[],
    profiles: StudentProfile[],
    styleGuide: StyleGuide,
    phraseBank: PhraseBank[],
    type: 'biweekly' | 'trimester',
    onProgress?: (current: number, total: number) => void
  ): Promise<AppreciationContent[]> {
    const appreciations: AppreciationContent[] = []

    for (let i = 0; i < students.length; i++) {
      const student = students[i]
      const profile = profiles[i]

      const content = await this.generateAppreciation(
        student,
        profile,
        styleGuide,
        phraseBank,
        type
      )

      appreciations.push({
        id: generateId(),
        studentId: student.id,
        type: type === 'biweekly' ? 'biweekly_report' : 'trimester_appreciation',
        periodStart: profile.periodStart,
        periodEnd: profile.periodEnd,
        content,
        styleGuideId: styleGuide.id,
        generatedAt: new Date(),
        isEdited: false,
        isValidated: false,
        metadata: {
          attendanceRate: profile.analytics.attendanceRate,
          avgParticipation: profile.analytics.avgParticipation,
          avgGrade: profile.avgGrade,
          wordCount: content.split(/\s+/).length
        }
      })

      if (onProgress) {
        onProgress(i + 1, students.length)
      }

      // Simulate generation delay (remove in production)
      await new Promise(resolve => setTimeout(resolve, 100))
    }

    return appreciations
  }
}
```

### Phase 3: Review Interface (Days 9-11)

**Step 1: Create Content Review Panel**

`/src/components/organisms/content-review-panel/content-review-panel.tsx`:
```typescript
'use client'
import { useState } from 'react'
import { Editor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'

export function ContentReviewPanel({
  appreciations: initialAppreciations,
  students,
  analytics,
  onEdit,
  onValidate,
  onExport
}: ContentReviewPanelProps) {
  const [appreciations, setAppreciations] = useState(initialAppreciations)
  const [selectedId, setSelectedId] = useState<string>(appreciations[0]?.id)
  const [exporting, setExporting] = useState(false)

  const selected = appreciations.find(a => a.id === selectedId)
  const student = students.find(s => s.id === selected?.studentId)
  const studentAnalytics = selected ? analytics[selected.studentId] : null

  const handleContentChange = (id: string, newContent: string) => {
    setAppreciations(prev =>
      prev.map(a =>
        a.id === id
          ? { ...a, content: newContent, isEdited: true, editedAt: new Date() }
          : a
      )
    )
    onEdit(id, newContent)
  }

  const handleValidate = (id: string) => {
    setAppreciations(prev =>
      prev.map(a =>
        a.id === id ? { ...a, isValidated: true } : a
      )
    )
    onValidate(id)

    // Move to next unvalidated
    const nextUnvalidated = appreciations.find(a => a.id !== id && !a.isValidated)
    if (nextUnvalidated) {
      setSelectedId(nextUnvalidated.id)
    }
  }

  const handleExport = async (format: 'pdf' | 'csv') => {
    setExporting(true)
    try {
      await onExport(format)
    } finally {
      setExporting(false)
    }
  }

  const validatedCount = appreciations.filter(a => a.isValidated).length

  return (
    <div className="flex h-full">
      {/* Left: Students list */}
      <div className="w-1/5 border-r overflow-y-auto">
        <div className="p-4 border-b">
          <h3 className="font-semibold">Élèves ({validatedCount}/{appreciations.length})</h3>
        </div>
        <div className="space-y-1 p-2">
          {students.map(student => {
            const appreciation = appreciations.find(a => a.studentId === student.id)
            const isSelected = appreciation?.id === selectedId

            return (
              <button
                key={student.id}
                onClick={() => setSelectedId(appreciation?.id)}
                className={cn(
                  'w-full text-left p-3 rounded-md transition-colors',
                  isSelected && 'bg-accent',
                  appreciation?.isValidated && 'text-muted-foreground'
                )}
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium">{student.fullName()}</span>
                  <div className="flex items-center gap-1">
                    {appreciation?.isEdited && <Pencil className="h-4 w-4 text-blue-500" />}
                    {appreciation?.isValidated && <CheckCircle className="h-4 w-4 text-green-500" />}
                  </div>
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {/* Center: Content editor */}
      <div className="flex-1 flex flex-col">
        <div className="p-4 border-b flex items-center justify-between">
          <div>
            <h3 className="font-semibold">{student?.fullName()}</h3>
            <p className="text-sm text-muted-foreground">
              {selected?.metadata.wordCount} mots
              {selected?.isEdited && ' • Modifié'}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={() => {
                if (selected) {
                  const original = initialAppreciations.find(a => a.id === selected.id)
                  if (original) {
                    handleContentChange(selected.id, original.content)
                  }
                }
              }}
            >
              Réinitialiser
            </Button>
            <Button
              onClick={() => selected && handleValidate(selected.id)}
              disabled={selected?.isValidated}
            >
              {selected?.isValidated ? 'Validé ✓' : 'Valider'}
            </Button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {selected && (
            <RichTextEditor
              content={selected.content}
              onChange={(content) => handleContentChange(selected.id, content)}
            />
          )}
        </div>

        {/* Export toolbar */}
        <div className="p-4 border-t flex items-center justify-between">
          <span className="text-sm text-muted-foreground">
            {validatedCount} sur {appreciations.length} validé(s)
          </span>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => handleExport('csv')}
              disabled={exporting || validatedCount === 0}
            >
              Exporter CSV
            </Button>
            <Button
              onClick={() => handleExport('pdf')}
              disabled={exporting || validatedCount === 0}
            >
              {exporting ? 'Export en cours...' : 'Exporter PDF'}
            </Button>
          </div>
        </div>
      </div>

      {/* Right: Student context */}
      <div className="w-[30%] border-l overflow-y-auto p-4 space-y-4">
        {studentAnalytics && (
          <>
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Statistiques</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between">
                  <span>Présence</span>
                  <Badge>{studentAnalytics.attendanceRate.toFixed(1)}%</Badge>
                </div>
                <div className="flex justify-between">
                  <span>Participation</span>
                  <Badge>{studentAnalytics.avgParticipation}</Badge>
                </div>
                {studentAnalytics.avgGrade && (
                  <div className="flex justify-between">
                    <span>Moyenne</span>
                    <Badge>{studentAnalytics.avgGrade.toFixed(1)}/20</Badge>
                  </div>
                )}
              </CardContent>
            </Card>

            {student?.strengths && student.strengths.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Forces</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-1 text-sm">
                    {student.strengths.map((strength, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <Star className="h-4 w-4 text-yellow-500 mt-0.5" />
                        <span>{strength}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}

            {studentAnalytics.patterns.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Patterns détectés</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-1 text-sm">
                    {studentAnalytics.patterns.map((pattern, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <AlertCircle className="h-4 w-4 text-orange-500 mt-0.5" />
                        <span>{pattern}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}
          </>
        )}
      </div>
    </div>
  )
}
```

### Phase 4: PDF Export (Days 12-14)

**Step 1: Implement PDF Service**

`/src/services/pdf-service.ts`:
```typescript
import jsPDF from 'jspdf'
import JSZip from 'jszip'

export class PDFService {
  generateAppreciationPDF(
    student: Student,
    appreciation: AppreciationContent,
    metadata: {
      className: string
      period: string
      teacherName: string
    }
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
    const lines = doc.splitTextToSize(appreciation.content, 170)
    doc.text(lines, 20, 80)

    // Footer
    doc.setFontSize(8)
    doc.text(`Généré le ${new Date().toLocaleDateString('fr-FR')}`, 20, 280)
    doc.text(`Enseignant: ${metadata.teacherName}`, 20, 285)

    return doc.output('blob')
  }

  async generateBatchPDFs(
    appreciations: AppreciationContent[],
    students: Student[],
    metadata: {
      className: string
      period: string
      teacherName: string
    }
  ): Promise<Blob> {
    const zip = new JSZip()

    for (const appreciation of appreciations) {
      const student = students.find(s => s.id === appreciation.studentId)
      if (!student) continue

      const pdfBlob = this.generateAppreciationPDF(student, appreciation, metadata)
      const filename = `${student.lastName}_${student.firstName}_${metadata.period}.pdf`
      zip.file(filename, pdfBlob)
    }

    return await zip.generateAsync({ type: 'blob' })
  }

  generateCSV(
    appreciations: AppreciationContent[],
    students: Student[]
  ): Blob {
    const rows = [
      ['Nom', 'Prénom', 'Classe', 'Appréciation']
    ]

    appreciations.forEach(appreciation => {
      const student = students.find(s => s.id === appreciation.studentId)
      if (student) {
        rows.push([
          student.lastName,
          student.firstName,
          student.currentClassId || '',
          appreciation.content.replace(/\n/g, ' ')
        ])
      }
    })

    const csvContent = rows.map(row =>
      row.map(cell => `"${cell}"`).join(',')
    ).join('\n')

    return new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  }
}
```

---

## AI Generation Strategy

### MVP Approach: Template-Based Generation

**Rationale:**
- No external AI API costs
- Full control over content quality
- Fast generation (< 1s per appreciation)
- Privacy-preserving (no data sent externally)

**Algorithm:**
1. Analyze student data (attendance, participation, grades, behavior)
2. Select contextually appropriate phrases from phrase bank
3. Interpolate variables (name, percentages, etc.)
4. Combine phrases into coherent paragraphs
5. Apply style guide (tone, length, formality)

**Quality assurance:**
- Diverse phrase bank (20-30 phrases per category)
- Context matching (attendance ranges, participation levels)
- Style guide application
- Manual review and editing before export

### Future Enhancement: LLM Integration

**When to implement:** Post-MVP if template quality insufficient

**Options:**
- OpenAI GPT-4
- Anthropic Claude
- Local LLM (Ollama)

**Integration:**
```typescript
class OpenAIProvider implements AIProvider {
  async generateText(prompt: string): Promise<string> {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [
          { role: 'system', content: 'Vous êtes un assistant pédagogique...' },
          { role: 'user', content: prompt }
        ]
      })
    })
    const data = await response.json()
    return data.choices[0].message.content
  }
}
```

---

## Testing Approach

### Manual Testing Checklist

**Story 4.1: Phrase Bank**
- [ ] Can create phrase with category
- [ ] Phrases display with tags
- [ ] Can edit/delete phrase
- [ ] Search by category works
- [ ] Context matching works correctly

**Story 4.2: Style Guides**
- [ ] Can create style guide
- [ ] All parameters saved correctly
- [ ] Can set default guide
- [ ] Can duplicate guide

**Story 4.3: Biweekly Reports**
- [ ] Generation triggers from alert
- [ ] Progress bar updates correctly
- [ ] 20 reports generated in < 5 min
- [ ] Content quality acceptable

**Story 4.4: Review Interface**
- [ ] Can navigate between students
- [ ] Editor allows modifications
- [ ] Auto-save works
- [ ] Validation marks report complete
- [ ] Modified indicator shows

**Story 4.5: Trimester Appreciations**
- [ ] Can generate for multiple classes
- [ ] Progress shows correctly
- [ ] Content appropriate for formal context
- [ ] 60 appreciations generated in < 30 min

**Story 4.6: Export**
- [ ] PDF export generates all files
- [ ] ZIP download works
- [ ] CSV format correct
- [ ] Files contain correct data

### Performance Testing

**Target: 20 biweekly reports in < 15 minutes**
- Generation: ~5 minutes (10sec/student)
- Review: ~10 minutes (30sec/student)

**Target: 60 trimester appreciations in < 2 hours**
- Generation: ~15 minutes (15sec/student)
- Review: ~90 minutes (90sec/student)

### E2E Test

```typescript
test('complete appreciation workflow', async ({ page }) => {
  // Generate reports
  await page.goto('/dashboard/appreciations')
  await page.click('text=Générer rapports bihebdomadaires')
  await page.selectOption('[name="classId"]', 'class-5a')
  await page.click('text=Générer pour tous les élèves')

  // Wait for generation
  await page.waitForSelector('text=20/20 élèves')

  // Review and validate
  await page.click('[data-student-index="0"]')
  await page.click('text=Valider')

  // Export
  await page.click('text=Exporter PDF')
  const download = await page.waitForEvent('download')
  expect(download.suggestedFilename()).toContain('.zip')
})
```

---

## Dependencies

### NPM Packages
```json
{
  "jspdf": "^2.5.1",
  "jszip": "^3.10.1",
  "@tiptap/react": "^2.1.13",
  "@tiptap/starter-kit": "^2.1.13"
}
```

---

## Notes

**Critical Success Factors:**
- Phrase bank quality (diverse, contextual, bienveillant)
- Template generation algorithm accuracy
- Review interface UX (must be fast and intuitive)
- Export reliability (PDF quality, ZIP packaging)

**Blockers:**
- Epic 3 (Student analytics) required for quality generation

**Future Enhancements:**
- LLM integration for more natural language
- Multi-language support
- Custom templates per teacher
- Analytics on most-used phrases

---

**Document Status:** ✅ Ready for Implementation
**Generated:** 2025-10-14
**Epic Timeline:** Sprint 7-9 (4-5 weeks)
