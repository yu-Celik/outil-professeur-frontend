<!-- story_header:start -->
# Story 4.2: Guides de style configurables

Status: Approved
<!-- story_header:end -->

<!-- story_body:start -->
## Story

As a teacher,
I want to define reusable style guides that control tone, length, and wording,
so that generated reports and appreciations consistently match the desired communication style for parents or bulletins. [Source: docs/tech-spec-epic-4-generation-ia.md:73-86]
<!-- story_body:end -->

<!-- requirements_context_summary:start -->
## Contexte et exigences

### Synthèse des exigences
- La page `Appréciations > Guides de Style` doit lister les guides existants et permettre création/duplication/suppression, avec sélection d’un guide par défaut pour chaque type de document. [Source: docs/tech-spec-epic-4-generation-ia.md:73-86]
- Formulaire : nom du guide, ton (Formel/Semi-formel/Informel), longueur cible (Court 50-80 / Standard 80-120 / Long 120-150), niveau de langage (Simple/Soutenu), personne (1re/3e), variabilité, phrases bannies/préférées. [Source: docs/tech-spec-epic-4-generation-ia.md:75-86; src/components/organisms/style-guide-management.tsx:405-520]
- Les guides alimentent l’IA via Souz API `/style-guides` (CRUD) et doivent être persistés pour toutes générations futures. [Source: docs/tech-spec-epic-4-generation-ia.md:199-225]
- Le hook `useStyleGuides` doit migrer des mocks vers un client API tout en conservant filtres, gestion du guide par défaut, et actions `create/update/delete/duplicate`. [Source: src/features/appreciations/hooks/use-style-guides.ts:1-220; docs/tech-spec-epic-4-generation-ia.md:175-179]
- `StyleGuideManagement`, `AppreciationGenerationInterface`, `ChatAppreciationInterface` doivent continuer à consommer `useStyleGuides` pour sélectionner un guide lors de la génération IA. [Source: src/components/organisms/style-guide-management.tsx:53-520; src/components/organisms/appreciation-generation-interface.tsx:82-520]
<!-- requirements_context_summary:end -->

<!-- structure_alignment_summary:start -->
## Alignement structurel et enseignements

### Constats
- `StyleGuideManagement` fournit UI complète (listes, formulaires, duplication) mais s’appuie actuellement sur mocks; la story doit brancher ce composant aux nouveaux endpoints via `useStyleGuides`. [Source: src/components/organisms/style-guide-management.tsx:53-520]
- `useStyleGuides` gère filtres, defaults, CRUD; la migration vers Souz API doit préserver son interface publique pour les autres composants (barres de génération). [Source: src/features/appreciations/hooks/use-style-guides.ts:1-220]
- Les types `StyleGuide` sont définis dans `@/types/uml-entities`; ne pas modifier directement, prévoir des types d’input (Create/Update) locaux. [Source: AGENTS.md]
- Le paramétrage du guide (banned/preferred phrases) est utilisé dans `appreciation-generator`; garder la compatibilité en adaptant l’accès aux guides persistés. [Source: src/features/appreciations/services/appreciation-generator.ts]

### Leçons issues des stories précédentes
- La story 4.1 (banque de phrases) suit la même démarche (client API + hook + UI). Reproduire ce pattern garantit cohérence et minimisation des régressions. [Source: docs/stories/story-4.1.md]
- Utiliser `useAsyncOperation`/toasts pour protéger les mutations et garder l’UX alignée avec Epic 3 & 4 (feedback utilisateur, désactivation bouton). [Source: shared/hooks/use-async-operation.ts; src/components/organisms/style-guide-management.tsx:97-210]
<!-- structure_alignment_summary:end -->

<!-- acceptance_criteria:start -->
## Acceptance Criteria

1. La page `Appréciations > Guides de Style` liste tous les guides avec leurs paramètres (ton, longueur, registre, phrases préférées/bannies) et affiche le guide par défaut. [Source: docs/tech-spec-epic-4-generation-ia.md:73-82; src/components/organisms/style-guide-management.tsx:188-320]
2. Le bouton « Nouveau guide » ouvre un formulaire capturant toutes les options décrites (ton, longueur, registre, personne, variabilité, phrases préférées/bannies) et persiste via `POST /style-guides`. [Source: docs/tech-spec-epic-4-generation-ia.md:75-86]
3. Chaque guide propose les actions « Modifier », « Dupliquer », « Supprimer » mappées sur `PATCH`/`POST`/`DELETE` Souz API avec feedback et rafraîchissement local. [Source: docs/tech-spec-epic-4-generation-ia.md:80-86; src/components/organisms/style-guide-management.tsx:120-210]
4. L’utilisateur peut définir un guide par défaut pour chaque type de document (parents/bulletins) et ce choix est stocké/persisté. [Source: docs/tech-spec-epic-4-generation-ia.md:79-86]
5. Les guides sont disponibles dans les interfaces de génération (`AppreciationGenerationInterface`, `ChatAppreciationInterface`) via `useStyleGuides`, sans régression sur le sélecteur existant. [Source: src/components/organisms/appreciation-generation-interface.tsx:82-520; src/components/organisms/chat-appreciation-interface.tsx:39-180]
6. L’état de chargement/erreur est géré (spinner/toast) et les filtres (ton, registre, longueur, recherche) fonctionnent avec les données persistées. [Source: src/features/appreciations/hooks/use-style-guides.ts:73-102; shared/hooks/use-async-operation.ts]
<!-- acceptance_criteria:end -->

<!-- tasks_subtasks:start -->
## Tasks / Subtasks

- [ ] Implémenter client API pour guides de style (AC: 1-5)
  - [ ] Créer `src/features/appreciations/api/style-guides-client.ts` exposant `list`, `create`, `update`, `remove`, `setDefault`. [Source: docs/tech-spec-epic-4-generation-ia.md:221-225]
  - [ ] Ajouter mappeurs (backend ↔️ front) pour champs bannis/préférés, ton, longueur. [Source: docs/tech-spec-epic-4-generation-ia.md:281-296]
- [ ] Refactorer `useStyleGuides` (AC: 1-5)
  - [ ] Remplacer les mocks par le client API tout en conservant filtres, `defaultGuide`, duplication. [Source: src/features/appreciations/hooks/use-style-guides.ts:1-220]
  - [ ] Gérer persistance du guide par défaut (peut utiliser endpoint dédié ou `PATCH` metadonnées). [Source: docs/tech-spec-epic-4-generation-ia.md:79-86]
- [ ] Adapter UI (`StyleGuideManagement`) (AC: 1-4,6)
  - [ ] Brancher formulaires/actions sur les nouvelles méthodes du hook (création, édition, duplication, suppression, set default). [Source: src/components/organisms/style-guide-management.tsx:53-520]
  - [ ] Afficher badges ton/registre/longueur et indicateur « Défaut ». [Source: docs/tech-spec-epic-4-generation-ia.md:75-86]
- [ ] Vérifier intégration dans génération IA (AC: 5)
  - [ ] Mettre à jour `AppreciationGenerationInterface` et `ChatAppreciationInterface` pour utiliser les guides persistés (sélecteur). [Source: src/components/organisms/appreciation-generation-interface.tsx:82-520; src/components/organisms/chat-appreciation-interface.tsx:39-180]
- [ ] Tests & validation (AC: 1-6)
  - [ ] Suivre checklist « Story 4.2: Style Guides » (création, default, duplication, filtres). [Source: docs/tech-spec-epic-4-generation-ia.md:429-432]
  - [ ] Tester scénarios d’erreur (validation ton/longueur, duplication existante). [Source: shared/hooks/use-async-operation.ts]
<!-- tasks_subtasks:end -->

<!-- dev_notes_with_citations:start -->
## Dev Notes

- Prévoir une structure d’enregistrement normalisée pour ton/registre/longueur (ex: enums) afin d’assurer compatibilité côté IA; convertir dans le service lors des appels API. [Source: docs/tech-spec-epic-4-generation-ia.md:75-86]
- La duplication peut utiliser les données existantes du hook (pas besoin d’endpoint dédié) puis appeler `create`; conserver l’UX actuelle (nom suffixé). [Source: src/components/organisms/style-guide-management.tsx:120-140]
- Stocker le guide par défaut dans le backend (champ `is_default` ou table meta) pour éviter divergence multi-session; côté front, mettre à jour `defaultGuide` après mutation. [Source: docs/tech-spec-epic-4-generation-ia.md:79-86]
- Conserver les phrases favorites/bannies sous forme de tableau simple (string[]) pour faciliter la génération IA; prévoir normalisation/trim. [Source: src/components/organisms/style-guide-management.tsx:427-520]

### Project Structure Notes

- Fichiers impactés : `src/features/appreciations/api/style-guides-client.ts` (nouveau), `use-style-guides.ts` (refactor), `style-guide-management.tsx`, `appreciation-generation-interface.tsx`, `chat-appreciation-interface.tsx`. [Source: docs/tech-spec-epic-4-generation-ia.md:175-340]
- Pas de modification directe dans `@/types/uml-entities` ; créer des types d’input/response spécifiques si besoin. [Source: AGENTS.md]
- Tests manuels sur la route `app/dashboard/appreciations` afin de vérifier cycles complet (CRUD + sélection). [Source: docs/tech-spec-epic-4-generation-ia.md:73-86]

### References

- docs/tech-spec-epic-4-generation-ia.md
- docs/epics.md
- docs/PRD.md
- docs/souz-api-openapi.json
- docs/stories/story-4.1.md
- src/app/dashboard/appreciations/page.tsx
- src/features/appreciations/hooks/use-style-guides.ts
- src/components/organisms/style-guide-management.tsx
- src/components/organisms/appreciation-generation-interface.tsx
- src/components/organisms/chat-appreciation-interface.tsx
- src/features/appreciations/services/appreciation-generator.ts
<!-- dev_notes_with_citations:end -->

<!-- change_log:start -->
## Dev Agent Record

### Context Reference

- À compléter via workflow `story-context` après validation.

### Agent Model Used

Codex (GPT-5)

### Debug Log References

- N/A

### Completion Notes List

- 2025-10-17 – Story 4.2 initial draft (assistant).

### File List

- docs/stories/story-4.2.md
<!-- change_log:end -->
