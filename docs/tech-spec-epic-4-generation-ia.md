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
6. [Stratégie UI & Intégration API](#stratégie-ui--intégration-api)
7. [Implementation Guide](#implementation-guide)
8. [AI Generation Strategy](#ai-generation-strategy)
9. [Testing Approach](#testing-approach)

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
├── api/
│   ├── appreciations-client.ts          # Calls /appreciations endpoints
│   ├── style-guides-client.ts           # Calls /style-guides endpoints
│   ├── phrase-banks-client.ts           # Calls /phrase-banks endpoints
│   └── index.ts
├── services/
│   └── appreciation-generator.ts        # AI generation engine
└── index.ts
```

### Global Services

```
/src/services/
├── pdf-service.ts                       # PDF generation (jsPDF)
├── ai-service.ts                        # External AI provider client
└── appreciation-prompt-builder.ts       # Compose prompts from analytics/style guides
```

---

## Data Storage Strategy - API FIRST

- Toutes les données d’appréciations, de guides de style et de banques de phrases sont persistées via Souz API.
- Aucune écriture locale (localStorage) n’est autorisée en production ; seules des caches mémoire éphémères sont tolérées pour l’UX.
- Les analytics nécessaires proviennent des endpoints déjà disponibles : `/students/{id}/profile`, `/students/{id}/attendance-rate`, `/students/{id}/participation-average`, `/students/{id}/results`, `/course-sessions`, `/sessions/{session_id}/attendance`.

## API Endpoints – Souz (à exposer/consommer)

Les endpoints suivants doivent être disponibles côté backend (Rust) pour permettre une intégration 100 % API :

### Appreciations (`/appreciations`)
- `GET /appreciations?class_id&student_id&type&status&cursor&limit`
- `POST /appreciations` – crée une appréciation (corps : student_id, type, period_start, period_end, content, style_guide_id, metadata)
- `POST /appreciations/generate` – génère une ou plusieurs appréciations à partir d’une configuration (classe, période, style, options). Retourne les contenus persistés.
- `PATCH /appreciations/{id}` – met à jour contenu, statut, métadonnées, favoris
- `DELETE /appreciations/{id}` – supprime une appréciation
- `POST /appreciations/{id}/validate` – marque comme validée (RPO=0)

### Style Guides (`/style-guides`)
- `GET /style-guides`
- `POST /style-guides`
- `PATCH /style-guides/{id}`
- `DELETE /style-guides/{id}`

### Phrase Banks (`/phrase-banks`)
- `GET /phrase-banks?scope&subject_id`
- `POST /phrase-banks`
- `PATCH /phrase-banks/{id}`
- `DELETE /phrase-banks/{id}`

### Exports
- `POST /appreciations/export` – génère un ZIP/PDF ; le endpoint renvoie un lien signé ou le fichier en streaming.

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

### Organismes & molécules existants à prioriser
- `AppreciationGenerationBar`, `AppreciationPreviewStack`, `AppreciationHistoryPanel`, `AppreciationContextPanel` (`@/components/organisms`) — interface principale de génération/relecture
- `PhraseBankManagement`, `StyleGuideManagement` (`@/components/organisms`) — gestion banques de phrases & guides de style
- `AppreciationGenerationInterface`, `ChatAI` (`@/components/organisms`) — pilotage de la génération et interactions IA
- `Card`, `Dialog`, `Badge`, `Tabs`, `DataTable` (`@/components`) — socle UI existant pour les panels secondaires

### Pages Next.js concernées
- `src/app/dashboard/appreciations/page.tsx` — hub IA complet
- `src/app/dashboard/mes-eleves/[id]/page.tsx` — intégration des appréciations validées par élève

### Hooks existants à brancher
- `useAppreciationGeneration`, `useStyleGuides`, `usePhraseBank` (`@/features/appreciations`)
- `useClassSelection`, `useStudentAnalytics`, `useStudentProfile` (context + analytics)
- `useAsyncOperation`, `useModal`, `useCRUDOperations`, `useEntityState` (`@/shared/hooks`)

---

## Stratégie UI & Intégration API

1. **Reposer intégralement sur Souz API**  
   - `useAppreciationGeneration` consomme directement `GET/POST/PATCH/DELETE /appreciations` ainsi que `POST /appreciations/generate`.  
   - `services/appreciation-generator.ts` agit comme client de l’API (aucun fallback local).

2. **Consommer les analytics transverses**  
   - Requêter les endpoints existants (Epics 2 & 3) : `GET /students/{id}/profile`, `GET /students/{id}/attendance-rate`, `GET /students/{id}/participation-average`, `GET /students/{id}/results` et `GET /sessions/{session_id}/attendance` pour enrichir les prompts.

3. **Pipeline de génération**  
   - `AppreciationGenerationBar` construit la configuration (style guide + phrase bank + analytics) puis appelle `services/appreciation-generator` qui délègue à `POST /appreciations/generate`.  
   - Les appréciations retournées sont persistées via l’API et réinjectées dans l’état client.

4. **Validation & export**  
   - `AppreciationPreviewStack` et `AppreciationHistoryPanel` doivent appeler `updateAppreciationContent` / `validateAppreciation` qui persisteront via API (PATCH) lorsque disponible.

5. **Gestion collaborative future**  
   - Préparer les hooks pour accepter un mode multi-utilisateur (état `lockedBy`, `version`) via les champs exposés par l’API.  
   - Documenter dans `docs/missing-api-endpoints-report.md` toute évolution de contrat nécessaire.

---

## Implementation Guide

### Phase 1: Préparer les données (Jours 1-2)
1. Brancher `useAppreciationGeneration` sur `useClassSelection` + analytics (`GET /students/{id}/profile`, `GET /students/{id}/attendance-rate`, `GET /students/{id}/participation-average`, `GET /students/{id}/results`, `GET /course-sessions?class_id=...`).  
2. Encapsuler la lecture/écriture des style guides et phrase banks via `useStyleGuides` / `usePhraseBank` en consommant `GET/POST/PATCH/DELETE /style-guides` et `/phrase-banks`.  
3. Vérifier que `AppreciationContextPanel` reçoit bien les données consolidées (participations, examens, notes).

### Phase 2: Flux de génération (Jours 3-5)
1. `AppreciationGenerationBar` compose le prompt → appelle `services/appreciation-generator.generate({...})` qui délègue à `POST /appreciations/generate`.  
2. Gestion des retours : remplir `AppreciationPreviewStack` avec les appréciations renvoyées par l’API (contenu + métadonnées).  
3. Mettre à jour `AppreciationHistoryPanel` pour afficher les versions grâce aux données persistées (ordre inverse de `GET /appreciations`).

### Phase 3: Validation & édition (Jours 6-7)
1. `updateAppreciationContent`, `validateAppreciation`, `toggleFavorite` → utiliser `PATCH /appreciations/{id}` et `POST /appreciations/{id}/validate`.  
2. Activer le mode bulk (multi-sélection) via `AppreciationGenerationBar` avec `useAsyncOperation` pour la progression.  
3. Synchroniser les validations avec `mes-eleves/[id]` pour que les appréciations validées apparaissent dans le profil.

### Phase 4: Export & sauvegarde (Jours 8-9)
1. Connecter `AppreciationHistoryPanel` / actions export à `pdf-service.ts` en orchestrant `POST /appreciations/export` (réception d’un lien ou d’un flux) puis téléchargement via le navigateur.  
2. Persister l’historique des exports côté backend (même endpoint renvoie un enregistrement) et l’exposer dans `Réglages > Sauvegarde` via `GET /appreciations?status=exported`.  
3. Ajouter télémétrie (durée génération, taux validation) pour suivi produit.

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
