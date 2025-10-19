<!-- story_header:start -->
# Story 4.3: Génération Automatique Rapports Bihebdomadaires

Status: Approved
<!-- story_header:end -->

<!-- story_body:start -->
## Story

As a teacher,
I want to automatically generate biweekly reports for an entire class,
so that I can communicate progress to families in minutes instead of hours. [Source: docs/tech-spec-epic-4-generation-ia.md:92-104]
<!-- story_body:end -->

<!-- requirements_context_summary:start -->
## Contexte et exigences

### Synthèse des exigences
- Le dashboard doit afficher l'alerte « Rapports bihebdomadaires à générer (15 jours écoulés) » et offrir un accès direct depuis l'alerte ou la page Appréciations. [Source: docs/tech-spec-epic-4-generation-ia.md:96-103; docs/PRD.md:461-469]
- La modale de génération configure classe, guide de style (défaut « Informel - Parents ») et période (2 dernières semaines) avant d'exécuter « Générer pour tous les élèves ». [Source: docs/epics.md:523-528; docs/tech-spec-epic-4-generation-ia.md:99-101]
- Le pipeline en lot doit analyser présences, participation, comportement, examens récents et sélectionner les phrases adaptées via guide/banque en ≤10 s par élève. [Source: docs/epics.md:529-535; docs/PRD.md:464-468]
- Les données d'entrée proviennent des endpoints analytics existants (profils, présences, participation, résultats, sessions) déjà exposés par Souz. [Source: docs/tech-spec-epic-4-generation-ia.md:200-214]
- Les rapports générés sont persistés via `/appreciations` et `/appreciations/generate`, alignés avec la table `generated_content` et ses statuts (draft/final). [Source: docs/tech-spec-epic-4-generation-ia.md:207-214; docs/database-schema.md:330-373]
- L'interface doit afficher la progression (« 12/20 élèves ») puis permettre export ZIP et confirmation finale pour un lot de 20 rapports en <15 minutes (machine + révision). [Source: docs/epics.md:528-542; docs/PRD.md:476-479; docs/tech-spec-epic-4-generation-ia.md:101-104]
- Aucune persistance locale n'est autorisée : seuls des caches mémoire temporaires sont tolérés, tout contenu doit être synchronisé avec l'API. [Source: docs/tech-spec-epic-4-generation-ia.md:200-201]
<!-- requirements_context_summary:end -->

<!-- structure_alignment_summary:start -->
## Alignement structurel et enseignements

### Constats
- `AppreciationGenerationInterface` orchestre déjà les modes individuel/lot avec mocks; la migration doit remplacer ces mocks par des appels API tout en conservant la gestion de progression et les sélecteurs existants. [Source: src/components/organisms/appreciation-generation-interface.tsx:1-188]
- `useAppreciationGeneration` centralise état, filtres et génération mais repose sur des données simulées; il doit consommer les endpoints Souz et exposer une progression fiable pour le bulk. [Source: src/features/appreciations/hooks/use-appreciation-generation.ts:1-188]
- `AppreciationGeneratorService` encapsule la logique IA et doit intégrer les analytics étudiants (comportement/academique) plutôt que des valeurs aléatoires. [Source: src/features/appreciations/services/appreciation-generator.ts:1-120; src/features/students/hooks/use-student-analytics.ts:1-120]
- `AppreciationGenerationBar` et la page `/dashboard/appreciations` attendent des callbacks stables (`onGenerate`, progress); le refactoring doit préserver ces signatures. [Source: src/app/dashboard/appreciations/page.tsx:812-845]
- Les dépendances style guide / phrase bank introduites en 4.1-4.2 doivent rester disponibles : la nouvelle génération doit consommer les mêmes hooks pour cohérence. [Source: docs/stories/story-4.2.md:29-37]

### Leçons issues des stories précédentes
- Story 4.2 insiste sur l'usage de `useAsyncOperation` et des toasts pour sécuriser les mutations; réutiliser ce pattern évite la régression UX pendant les traitements longs. [Source: docs/stories/story-4.2.md:35-37; src/shared/hooks/use-async-operation.ts:15-58]
- Les stories précédentes ont introduit des clients API dédiés par feature; appliquer la même structuration (`features/appreciations/api`) maintient l'architecture modulaire décrite. [Source: docs/stories/story-4.2.md:35-37; docs/solution-architecture.md:2573-2645]
<!-- structure_alignment_summary:end -->

<!-- acceptance_criteria:start -->
## Acceptance Criteria

1. Le dashboard signale l'échéance bihebdomadaire et permet d'ouvrir la génération depuis l'alerte ou la page Appréciations. [Source: docs/epics.md:523-526; docs/PRD.md:461-469]
2. La modale de configuration sélectionne classe, guide de style (défaut « Informel - Parents ») et période (2 dernières semaines) avant lancement. [Source: docs/epics.md:526-528; docs/tech-spec-epic-4-generation-ia.md:99-101]
3. L'action « Générer pour tous les élèves » déclenche une génération bulk avec barre de progression et estimation temps restant. [Source: docs/epics.md:528-535; docs/tech-spec-epic-4-generation-ia.md:100-102]
4. Chaque rapport compile présences, participation, comportement et examens récents avec phrase bank et style guide en ≤10 s/élève. [Source: docs/epics.md:529-535; docs/PRD.md:464-468]
5. L'écran de révision liste les rapports générés, permet lecture rapide et édition légère avant validation. [Source: docs/epics.md:536-537; docs/PRD.md:468-475]
6. L'utilisateur peut valider individuellement ou en lot, ce qui persiste les statuts via l'API. [Source: docs/epics.md:539-541; docs/database-schema.md:330-373]
7. L'export batch produit un ZIP de 20 PDF et affiche la confirmation « 20 rapports générés et exportés ». [Source: docs/epics.md:541-542; docs/PRD.md:476-479]
8. La génération complète respecte la cible <15 minutes pour 20 élèves avec feedback de progression continu. [Source: docs/tech-spec-epic-4-generation-ia.md:101-104; docs/PRD.md:476-479]
<!-- acceptance_criteria:end -->

<!-- tasks_subtasks:start -->
## Tasks / Subtasks

- [ ] Mettre en place client Souz pour appréciations (AC: 1-4,6-7)
  - [ ] Créer `src/features/appreciations/api/appreciations-client.ts` avec `list`, `generate`, `validate`, `export` alignés sur `/appreciations*`. [Source: docs/tech-spec-epic-4-generation-ia.md:207-228]
  - [ ] Gérer la récupération binaire du ZIP et les erreurs API (401/422) lors de l'export. [Source: docs/epics.md:541-542; docs/PRD.md:476-479]
- [ ] Orchestrer pipeline bihebdomadaire dans `useAppreciationGeneration` (AC: 3-6,8)
  - [ ] Brancher les analytics étudiants (présences, participation, résultats) avant appel `generate`. [Source: docs/tech-spec-epic-4-generation-ia.md:200-214; src/features/students/hooks/use-student-analytics.ts:1-120]
  - [ ] Implémenter suivi de progression (current/total/ETA) et mise à jour des statuts via API. [Source: src/features/appreciations/hooks/use-appreciation-generation.ts:59-187; docs/epics.md:528-541]
  - [ ] Mapper les réponses API vers `generated_content` (status draft/final) et rafraîchir l'historique. [Source: docs/database-schema.md:330-373]
- [ ] Adapter Dashboard & page Appréciations (AC: 1-3,5)
  - [ ] Ajouter widget/alerte bihebdomadaire sur `/dashboard/accueil` avec CTA vers génération. [Source: docs/epics.md:523-526; src/app/dashboard/accueil/page.tsx:54-96]
  - [ ] Étendre `AppreciationGenerationInterface` et `AppreciationGenerationBar` pour la configuration classe/période/guide et déclenchement bulk. [Source: src/components/organisms/appreciation-generation-interface.tsx:71-186; src/app/dashboard/appreciations/page.tsx:812-845]
- [ ] Gérer révision, validation et export (AC: 5-7)
  - [ ] Ajouter liste de rapports générés avec aperçu rapide et édition légère avant validation finale. [Source: docs/epics.md:536-537; docs/PRD.md:468-475]
  - [ ] Implémenter validation individuelle/bulk et message de confirmation après export. [Source: docs/epics.md:539-542; docs/PRD.md:476-479]
- [ ] Tests & qualification (AC: 1-8)
  - [ ] Couvrir la checklist « Story 4.3: Biweekly Reports » (déclenchement, progression, temps de génération). [Source: docs/tech-spec-epic-4-generation-ia.md:435-438]
  - [ ] Documenter résultats et éventuels écarts dans Dev Agent Record / story-context. [Source: docs/tech-spec-epic-4-generation-ia.md:435-438]
<!-- tasks_subtasks:end -->

<!-- dev_notes_with_citations:start -->
## Dev Notes

- Le service `AppreciationGeneratorService` doit composer les rapports à partir des analytics consolidés (comportement + académique) et appliquer styles/phrases pour garantir un contenu cohérent. [Source: src/features/appreciations/services/appreciation-generator.ts:1-120; docs/tech-spec-epic-4-generation-ia.md:200-214]
- Utiliser `useAsyncOperation` (ou pattern équivalent) pour encapsuler la génération bulk et propager erreurs/toasts tout en mettant à jour la barre de progression. [Source: src/shared/hooks/use-async-operation.ts:15-58; docs/epics.md:528-541]
- Persister chaque rapport via `/appreciations` / `/appreciations/generate` en respectant la structure `generated_content` (status draft → final lors validation). [Source: docs/tech-spec-epic-4-generation-ia.md:207-214; docs/database-schema.md:330-373]
- L'export ZIP repose sur le service PDF prévu côté frontend; orchestrer la récupération du flux et la confirmation utilisateur après téléchargement. [Source: docs/solution-architecture.md:1492-1504; docs/epics.md:541-542]

### Project Structure Notes

- Nouveau client API sous `src/features/appreciations/api/appreciations-client.ts` + index d'exports. [Source: docs/tech-spec-epic-4-generation-ia.md:207-228]
- Refactor `useAppreciationGeneration` et `AppreciationGenerationInterface` pour consommer le client et exposer progression/validation. [Source: src/features/appreciations/hooks/use-appreciation-generation.ts:1-188; src/components/organisms/appreciation-generation-interface.tsx:71-186]
- Ajouter l'alerte bihebdomadaire sur `src/app/dashboard/accueil/page.tsx` en cohérence avec le hub de génération existant. [Source: docs/epics.md:523-526; src/app/dashboard/accueil/page.tsx:54-96]

### References

- docs/tech-spec-epic-4-generation-ia.md
- docs/epics.md
- docs/PRD.md
- docs/database-schema.md
- docs/solution-architecture.md
- src/features/appreciations/hooks/use-appreciation-generation.ts
- src/components/organisms/appreciation-generation-interface.tsx
- src/features/students/hooks/use-student-analytics.ts
- docs/stories/story-4.2.md
<!-- dev_notes_with_citations:end -->

<!-- change_log:start -->
## Dev Agent Record

### Context Reference

- docs/story-context-4.3.xml

### Agent Model Used

Codex (GPT-5)

### Debug Log References

- N/A

### Completion Notes List

- 2025-10-17 – Story 4.3 initial draft (assistant).

### File List

- docs/stories/story-4.3.md
<!-- change_log:end -->
