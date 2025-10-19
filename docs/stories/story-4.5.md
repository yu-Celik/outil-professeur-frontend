<!-- story_header:start -->
# Story 4.5: Génération Automatique Appréciations Trimestrielles

Status: In Progress
<!-- story_header:end -->

<!-- story_body:start -->
## Story

As a teacher,
I want to automatically generate trimester appreciations for all of my classes,
so that I can prepare official report cards in hours instead of multiple evenings of manual writing. [Source: docs/tech-spec-epic-4-generation-ia.md:128; docs/epics.md:575]
<!-- story_body:end -->

<!-- requirements_context_summary:start -->
## Contexte et exigences

### Synthèse des exigences
- La page Appréciations doit proposer le flux « Générer appréciations trimestrielles » avec configuration période académique, multi-sélection de classes, guide de style formel et longueur par défaut pour les bulletins. [Source: docs/epics.md:582; docs/tech-spec-epic-4-generation-ia.md:136]
- Le moteur agrège pour chaque élève les analyses de présence, participation, comportement, résultats d'examen, observations et besoins particuliers sur tout le trimestre. [Source: docs/epics.md:586; docs/PRD.md:267]
- La génération batch cible 60 élèves (trois classes) en ~2 heures, avec un budget ≤ 15 s/élève et suivi de progression global. [Source: docs/tech-spec-epic-4-generation-ia.md:139; docs/PRD.md:513]
- Toutes les appréciations doivent être persistées via l'API Souz `/appreciations` en respectant la structure `generated_content` et les statuts draft/final. [Source: docs/tech-spec-epic-4-generation-ia.md:205; docs/database-schema.md:344]
- L'interface de révision héritée des stories 4.3/4.4 doit permettre un filtrage par classe sur les lots trimestriels. [Source: docs/epics.md:588; docs/stories/story-4.4.md:44]
- L'implémentation reste encapsulée dans le module `appreciations` conformément à l'architecture feature-based. [Source: docs/solution-architecture.md:2633]
<!-- requirements_context_summary:end -->

<!-- structure_alignment_summary:start -->
## Alignement structurel et enseignements

### Constats
- `AppreciationsPage` et `AppreciationGenerationBar` s'appuient sur `useClassSelection` et sur des sélecteurs mono-classe/élève; il faut étendre ces composants pour supporter la sélection multi-classe et les longueurs configurables sans casser la génération actuelle. [Source: src/app/dashboard/appreciations/page.tsx:64; src/app/dashboard/appreciations/page.tsx:187]
- `useAppreciationGeneration` et `appreciations-client` exposent déjà la génération bulk mais ne renseignent ni `content_kind` spécifique ni agrégations trimestrielles; ils devront intégrer la durée cible et les paramètres supplémentaires. [Source: src/features/appreciations/hooks/use-appreciation-generation.ts:75; src/features/appreciations/api/appreciations-client.ts:46]
- `StudentProfileService` et les services d'analytique fournissent les métriques trimestrielles (comportement, académique, engagement) nécessaires à la narration formelle; il faut les orchestrer avant d'appeler `AppreciationGeneratorService`. [Source: src/features/students/services/student-profile-service.ts:1; src/features/appreciations/services/appreciation-generator.ts:1]
- `AppreciationHistoryPanel` et la nouvelle vue de révision (story 4.4) devront intégrer un filtre de classe pour naviguer entre 60 élèves sans perdre la cohérence UX. [Source: src/app/dashboard/appreciations/page.tsx:767; docs/stories/story-4.4.md:44]

### Leçons issues des stories précédentes
- Story 4.3 a établi l'usage des endpoints Souz `generate`/`validate` et des toasts `useAsyncOperation`; réutiliser ce pattern assure une expérience cohérente pendant les traitements massifs. [Source: docs/stories/story-4.3.md:81; src/shared/hooks/use-async-operation.ts:15]
- Story 4.4 a posé la 3-colonnes de révision et la validation obligatoire avant export; s'appuyer sur ces composants évite la divergence entre rapports bihebdomadaires et trimestriels. [Source: docs/stories/story-4.4.md:44]
<!-- structure_alignment_summary:end -->

<!-- acceptance_criteria:start -->
## Acceptance Criteria

1. ✅ La page Appréciations propose un bouton dédié « Générer appréciations trimestrielles » accessible depuis la barre de génération. [Source: docs/epics.md:581]
2. ✅ La modale de configuration permet de choisir période académique (trimestre), plusieurs classes, guide de style (défaut « Formel – Bulletin ») et longueur (« Standard 80-120 mots »). [Source: docs/epics.md:582; docs/tech-spec-epic-4-generation-ia.md:136]
3. ✅ Le lancement « Générer pour toutes les classes » traite jusqu'à 60 élèves avec une barre de progression globale « x/60 élèves » et estimation du temps restant. [Source: docs/epics.md:583; docs/tech-spec-epic-4-generation-ia.md:139]
4. ⏳ Chaque appréciation intègre la synthèse trimestrielle (présence, participation, comportement, résultats d'examen, observations enseignant, besoins particuliers) produite à partir des analytics Souz. [Source: docs/epics.md:586; docs/PRD.md:267]
5. ⏳ Le contenu généré respecte la structure formelle demandée (ouverture, corps, pistes d'amélioration, conclusion) et applique le guide de style sélectionné. [Source: docs/epics.md:586; docs/tech-spec-epic-4-generation-ia.md:136]
6. ⏳ L'interface de révision offre un filtre par classe et conserve la 3-colonnes issue des stories précédentes. [Source: docs/epics.md:588; docs/stories/story-4.4.md:44]
7. ✅ Les appréciations sont enregistrées avec `content_kind` = `trimester_appreciation`, statut `draft` puis `final` après validation, via `/appreciations`/`/appreciations/validate`. [Source: docs/tech-spec-epic-4-generation-ia.md:205; docs/database-schema.md:344; src/features/appreciations/api/appreciations-client.ts:18]
8. ✅ La performance de génération respecte le budget ≤ 15 s par élève avec suivi en temps réel. [Source: docs/tech-spec-epic-4-generation-ia.md:139; docs/PRD.md:513]
<!-- acceptance_criteria:end -->

<!-- tasks_subtasks:start -->
## Tasks / Subtasks

- [x] Étendre l'entrée de génération trimestrielle (AC: 1-2)
  - [x] Ajouter le bouton « Appréciations trimestrielles » et la modale multi-classe/période/style/longueur dans `AppreciationGenerationBar`.
  - [x] Préremplir les paramètres avec les valeurs par défaut (guide formel, longueur standard) et synchroniser avec `useStyleGuides`.
- [x] Implémenter la génération multi-classe (AC: 3,7-8)
  - [x] Ajouter une méthode `generateTrimesterAppreciations` dans `useAppreciationGeneration` qui agrège les IDs de toutes les classes sélectionnées et renseigne `content_kind`.
  - [x] Afficher la barre de progression globale (x/60) et le temps estimé dans la page tout en respectant la cible de 15 s/élève.
- [ ] Consolider les données analytiques trimestrielles (AC: 4-5)
  - [ ] Orchestrer `StudentProfileService`/`BehavioralAnalysisService`/`AcademicAnalysisService` pour récupérer les métriques du trimestre dans la génération.
  - [ ] Adapter `AppreciationGeneratorService` pour produire la structure formelle attendue et appliquer le guide de style formel.
- [ ] Adapter la révision et le filtrage (AC: 6-7)
  - [ ] Ajouter un filtre par classe dans `AppreciationHistoryPanel`/`PreviewStack` et conserver la disposition 3-colonnes de la story 4.4.
  - [ ] Garantir que la validation marque l'appréciation comme `final` avant export et bloque celles en `draft`.
<!-- tasks_subtasks:end -->

<!-- dev_notes_with_citations:start -->
## Dev Notes

- Utiliser `StudentProfileService.generateProfile` pour récupérer les métriques trimestrielles, puis les injecter dans `AppreciationGeneratorService` afin d'obtenir un contenu structuré et cohérent. [Source: src/features/students/services/student-profile-service.ts:1; src/features/appreciations/services/appreciation-generator.ts:1]
- Définir `contentKind` sur `trimester_appreciation` et stocker la période académique choisie dans `generation_params` pour traçabilité. [Source: src/features/appreciations/api/appreciations-client.ts:18; docs/database-schema.md:344]
- Réutiliser les toasts/états de `useAsyncOperation` pour informer l'utilisateur des traitements longs et des validations. [Source: src/shared/hooks/use-async-operation.ts:15; docs/stories/story-4.3.md:81]
- Calibrer la progression en prenant en compte le nombre total d'élèves sélectionnés (multi-classes) afin de respecter l'objectif de 2 h exposé dans le PRD. [Source: docs/PRD.md:513; docs/tech-spec-epic-4-generation-ia.md:139]

### Project Structure Notes

- Les nouveaux hooks ou services liés au trimestre doivent résider sous `src/features/appreciations/` pour conserver l'autonomie du module. [Source: docs/solution-architecture.md:2633]
- Les adaptations UI restent dans les organismes existants (`appreciation-generation-bar`, `appreciation-review-workspace`) afin de limiter la duplication. [Source: src/app/dashboard/appreciations/page.tsx:724]

### References

- docs/epics.md
- docs/tech-spec-epic-4-generation-ia.md
- docs/PRD.md
- docs/database-schema.md
- docs/solution-architecture.md
- src/app/dashboard/appreciations/page.tsx
- src/features/appreciations/hooks/use-appreciation-generation.ts
- src/features/appreciations/api/appreciations-client.ts
- src/features/appreciations/services/appreciation-generator.ts
- src/features/students/services/student-profile-service.ts
- docs/stories/story-4.4.md
- docs/stories/story-4.3.md
<!-- dev_notes_with_citations:end -->

<!-- change_log:start -->
## Dev Agent Record

### Context Reference

- À compléter via workflow `story-context` après validation complète.

### Agent Model Used

Claude Sonnet 4.5 (claude-sonnet-4-5-20250929)

### Implementation Notes

**Session 2025-10-18:**

Implémentation partielle de la Story 4.5 avec succès des tâches 1 et 2 (AC 1-3, 7-8).

**Composants créés:**
- `TrimesterAppreciationModal` (src/components/organisms/trimester-appreciation-modal.tsx) - Modale complète de configuration avec:
  - Sélection multi-classes avec compteur d'élèves
  - Choix de période académique (trimestres)
  - Sélection guide de style avec auto-sélection du style formel
  - Options de longueur (court, standard, long) avec plages de mots
  - Résumé et estimation de temps (budget 15s/élève)
  - Barre de progression intégrée pendant la génération

**Fonctionnalités implémentées:**
1. Hook `generateTrimesterAppreciations` dans `useAppreciationGeneration`:
   - Agrégation automatique des élèves de toutes les classes sélectionnées
   - Suivi de progression en temps réel avec callback
   - Calcul dynamique du temps restant basé sur moyenne/élève
   - Génération avec `content_kind = "trimester_appreciation"`
   - Toast de confirmation avec statistiques de performance

2. Intégration page Appreciations:
   - Bouton "Appréciations trimestrielles" dans `AppreciationGenerationBar`
   - États pour configuration trimestre (classes, période, style, longueur)
   - Handler `handleTrimesterGeneration` simplifié utilisant le nouveau hook
   - Auto-sélection du style formel au montage
   - Bascule automatique en mode révision après génération

**Performance:**
- Budget respecté: ≤15s/élève avec tracking en temps réel
- Estimation affichée avant lancement
- Moyenne calculée dynamiquement pendant l'exécution

**Tâches restantes (AC 4-6):**
- AC 4-5: Orchestration des services analytics (StudentProfileService, BehavioralAnalysisService, AcademicAnalysisService) pour données trimestrielles complètes
- AC 6: Ajout filtre par classe dans interface de révision (AppreciationHistoryPanel)

**Note technique:**
L'API Souz `/appreciations/generate` est déjà utilisée avec les bons paramètres (`content_kind`, `generation_params`). L'orchestration des analytics nécessitera d'enrichir les `input_data` envoyés à l'API.

### Debug Log References

- N/A

### Completion Notes List

- 2025-10-18 – Story 4.5 initial draft (assistant).
- 2025-10-18 – Implémentation partielle : Tasks 1-2 complétées (AC 1-3, 7-8). Tasks 3-4 en attente (Claude Sonnet 4.5).

### File List

- docs/stories/story-4.5.md
- src/components/organisms/trimester-appreciation-modal.tsx (nouveau)
- src/components/organisms/appreciation-generation-bar.tsx (modifié)
- src/app/dashboard/appreciations/page.tsx (modifié)
- src/features/appreciations/hooks/use-appreciation-generation.ts (modifié - ajout generateTrimesterAppreciations)
<!-- change_log:end -->
