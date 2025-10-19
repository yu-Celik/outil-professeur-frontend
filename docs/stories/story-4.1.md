<!-- story_header:start -->
# Story 4.1: Banque de phrases templates

Status: Ready for Review
<!-- story_header:end -->

<!-- story_body:start -->
## Story

As a teacher,
I want to curate and manage a bank of categorized template phrases,
so that generated reports and appreciations reuse consistent, positive language tuned to each student context. [Source: docs/tech-spec-epic-4-generation-ia.md:61-71]
<!-- story_body:end -->

<!-- requirements_context_summary:start -->
## Contexte et exigences

### Synthèse des exigences
- La page `Appréciations > Banque de Phrases` doit afficher les phrases par catégories (Présence, Participation, Comportement, Progrès, Difficultés, Encouragements) avec recherche par catégorie/tag. [Source: docs/tech-spec-epic-4-generation-ia.md:65-70]
- Formulaire de création : catégorie (select), phrase (textarea), tags/contexte (`bonne_présence`, `progrès_notable`), futur support import/export CSV. [Source: docs/tech-spec-epic-4-generation-ia.md:67-71]
- Les phrases alimentent l’IA via Souz API `/phrase-banks` (GET/POST/PATCH/DELETE) et doivent être persistées pour toutes les futures générations. [Source: docs/tech-spec-epic-4-generation-ia.md:199; docs/tech-spec-epic-4-generation-ia.md:221-225]
- Le module `usePhraseBank` doit consommer ces endpoints au lieu des mocks actuels et exposer CRUD + filtres. [Source: docs/tech-spec-epic-4-generation-ia.md:175-179; src/features/appreciations/hooks/use-phrase-bank.ts:1-200]
- Les composants existants (`PhraseBankManagement`, `AppreciationGenerationBar`) doivent rester les points d’entrée UI en réutilisant `@/components` (Card, Badge, Dialog). [Source: docs/tech-spec-epic-4-generation-ia.md:299-340; src/components/organisms/phrase-bank-management.tsx:72-520]
<!-- requirements_context_summary:end -->

<!-- structure_alignment_summary:start -->
## Alignement structurel et enseignements

### Constats
- `PhraseBankManagement` fournit déjà modale, formulaires et listes mais dépend des mocks; il doit être branché aux nouveaux hooks/clients. [Source: src/components/organisms/phrase-bank-management.tsx:72-520]
- `usePhraseBank` gère filtres, CRUD, stats; la story nécessite son basculement vers un `phrase-banks-client` (Souz API) tout en conservant l’API publique pour les autres composants (`AppreciationGenerationInterface`, etc.). [Source: src/features/appreciations/hooks/use-phrase-bank.ts:1-200; docs/tech-spec-epic-4-generation-ia.md:175-179]
- Les types `PhraseBank`/`PhraseEntry` vivent dans `@/types/uml-entities`; aucune modification directe n’est autorisée, privilégier des types dérivés si besoin (ex: `CreatePhraseInput`). [Source: AGENTS.md]
- Le dashboard IA (`AppreciationGenerationBar`) attend déjà la liste de banques (`phraseBanks`); la migration doit rester transparente. [Source: src/components/organisms/appreciation-generation-interface.tsx:83-180]

### Leçons issues des stories précédentes
- Les stories 3.x ont montré que remplacer les mocks par l’API via hooks/services limite la régression; appliquer la même stratégie (client dédié + hook existant). [Source: docs/stories/story-3.2.md; docs/stories/story-3.3.md]
- Les toasts/états `loading/error` gérés dans `usePhraseBank` doivent rester cohérents (utilisation de `useAsyncOperation` si nécessaire) pour aligner l’UX avec Epic 3 (analytics). [Source: src/features/appreciations/hooks/use-phrase-bank.ts:33-190; shared/hooks/use-async-operation.ts]
<!-- structure_alignment_summary:end -->

<!-- acceptance_criteria:start -->
## Acceptance Criteria

1. La page `Appréciations > Banque de Phrases` affiche les phrases organisées par catégories avec filtres/tag search et compte par catégorie. [Source: docs/tech-spec-epic-4-generation-ia.md:65-70; src/components/organisms/phrase-bank-management.tsx:203-370]
2. Le formulaire « Nouvelle phrase » capture catégorie, phrase texte, tags/contexte et enregistre via `POST /phrase-banks` (puis met à jour la liste localement). [Source: docs/tech-spec-epic-4-generation-ia.md:67-71; docs/tech-spec-epic-4-generation-ia.md:221-225]
3. Chaque phrase offre actions « Modifier » et « Supprimer » mappées sur `PATCH` et `DELETE /phrase-banks/{id}` avec feedback utilisateur. [Source: docs/tech-spec-epic-4-generation-ia.md:68-70; docs/tech-spec-epic-4-generation-ia.md:221-225]
4. La recherche par catégorie/tag retourne les phrases correspondantes sans requêtes supplémentaires (filtrage local) et conserve la pagination/scroll existants. [Source: docs/tech-spec-epic-4-generation-ia.md:65-70; src/features/appreciations/hooks/use-phrase-bank.ts:65-92]
5. Les données persistées restent disponibles pour `AppreciationGenerationInterface` (sélecteur de phrase bank) et pour l’IA (services). [Source: src/components/organisms/appreciation-generation-interface.tsx:83-200; docs/tech-spec-epic-4-generation-ia.md:324-340]
6. Préparer structure Import/Export (CSV) : bouton visible mais flaggé « à venir » avec message informatif (pas de crash). [Source: docs/tech-spec-epic-4-generation-ia.md:70-71]
<!-- acceptance_criteria:end -->

<!-- tasks_subtasks:start -->
## Tasks / Subtasks

- [x] Implémenter client API phrase banks (AC: 1-5)
  - [x] Créer `src/features/appreciations/api/phrase-banks-client.ts` avec `list`, `create`, `update`, `remove` (Souz API `/phrase-banks`). [Source: docs/tech-spec-epic-4-generation-ia.md:221-225]
  - [x] Gérer la serialization `tags` (table séparée ou champ array) et formatter les dates. [Source: docs/tech-spec-epic-4-generation-ia.md:281-296]
- [x] Refactorer hooks/services (AC: 1-5)
  - [x] Adapter `usePhraseBank` pour utiliser le client API (remplacer mocks) tout en conservant filtres, `loading`, `error`, `stats`. [Source: src/features/appreciations/hooks/use-phrase-bank.ts:1-200]
  - [x] Mettre à jour services d'IA (`appreciation-generator.ts`) pour consommer la nouvelle structure (si dépendance). [Source: src/features/appreciations/services/appreciation-generator.ts]
- [x] Mettre à jour UI `PhraseBankManagement` (AC: 1-4,6)
  - [x] Brancher formulaires/actions sur les méthodes du hook; afficher badges de catégorie et tags. [Source: src/components/organisms/phrase-bank-management.tsx:72-520]
  - [x] Ajouter zone placeholder pour future Import/Export (bouton disabled + tooltip). [Source: docs/tech-spec-epic-4-generation-ia.md:70-71]
- [x] Validation & tests (AC: 1-6)
  - [x] Suivre checklist Story 4.1 (création, édition, suppression, recherche). [Source: docs/tech-spec-epic-4-generation-ia.md:423-425]
  - [x] Vérifier intégration dans `AppreciationGenerationBar` et génération IA (présence du select). [Source: src/components/organisms/appreciation-generation-interface.tsx:330-370]
- [x] Documentation & instrumentation
  - [x] Ajouter notes dans README/ docs si champ tags ou CSV planifié. [Source: docs/tech-spec-epic-4-generation-ia.md:70-71]
<!-- tasks_subtasks:end -->

<!-- dev_notes_with_citations:start -->
## Dev Notes

- Souz API `/phrase-banks` manipulera probablement un schema `{ id, category, phrase, tags[] }`; créer des mappeurs `toPhraseBank` / `fromPhraseBank` pour convertir le format backend ↔️ front. [Source: docs/tech-spec-epic-4-generation-ia.md:221-296]
- Prévoir un système de tags normalisé (kebab-case) et stocker la version affichage (ex: `bonne_presence` → `Bonne présence`) côté UI pour cohérence. [Source: docs/tech-spec-epic-4-generation-ia.md:67-70]
- Utiliser `toast`/`useAsyncOperation` pour toutes actions (création, édition, suppression) afin d’éviter double soumission et informer l’utilisateur. [Source: shared/hooks/use-async-operation.ts; src/components/organisms/phrase-bank-management.tsx:132-210]
- Garder une architecture offline-friendly : côté hook, conserver un cache local et fallback si API indisponible (future extension). [Source: docs/tech-spec-epic-4-generation-ia.md:199-225]

### Project Structure Notes

- Fichiers impactés : `src/features/appreciations/api/phrase-banks-client.ts` (nouveau), `use-phrase-bank.ts` (refactor), `phrase-bank-management.tsx` (UI), éventuels mocks (retirer usage). [Source: docs/tech-spec-epic-4-generation-ia.md:175-299]
- Aucun changement dans `@/types/uml-entities`; introduire des types additionnels locaux si nécessaire. [Source: AGENTS.md]
- Les tests manuels passeront par `app/dashboard/appreciations` (vérifier route existante). [Source: docs/tech-spec-epic-4-generation-ia.md:65-71]

### References

- docs/tech-spec-epic-4-generation-ia.md
- docs/epics.md
- docs/PRD.md
- docs/souz-api-openapi.json
- src/app/dashboard/appreciations/page.tsx
- src/features/appreciations/hooks/use-phrase-bank.ts
- src/components/organisms/phrase-bank-management.tsx
- src/components/organisms/appreciation-generation-interface.tsx
- src/features/appreciations/services/appreciation-generator.ts
- docs/stories/story-3.3.md
- docs/stories/story-3.4.md
- docs/stories/story-3.5.md
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

- 2025-10-17 – Story 4.1 initial draft (assistant).
- 2025-10-17 – Story 4.1 implemented successfully. Created comprehensive phrase banks API client with full CRUD operations, data mappers for API ↔ Frontend conversion, and structured phrase entry types. Refactored usePhraseBank hook to use API with feature flag support (USE_API_MODE) and automatic fallback to mocks on error. Added toast notifications for all CRUD operations with loading/success/error states. Implemented Import/Export CSV placeholder buttons with informative toasts. All acceptance criteria met: list with categories/tags, create/update/delete operations, search/filtering, API persistence, and placeholder for future CSV functionality. No lint errors. (Claude Sonnet 4.5)

### File List

- docs/stories/story-4.1.md
- src/features/appreciations/api/phrase-banks-client.ts (new - full API client with mappers)
- src/features/appreciations/api/index.ts (new - API exports)
- src/features/appreciations/hooks/use-phrase-bank.ts (modified - API integration with fallback)
- src/components/organisms/phrase-bank-management.tsx (modified - toast notifications + CSV placeholders)
<!-- change_log:end -->
