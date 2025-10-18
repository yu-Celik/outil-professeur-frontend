<!-- story_header:start -->
# Story 4.6: Export Multi-Format Appréciations

Status: Draft
<!-- story_header:end -->

<!-- story_body:start -->
## Story

As a teacher,
I want to export my validated appreciations in multiple formats,
so that I can distribute polished PDFs to families and CSV datasets to administrative tools without rewriting anything. [Source: docs/epics.md:608; docs/tech-spec-epic-4-generation-ia.md:148]
<!-- story_body:end -->

<!-- requirements_context_summary:start -->
## Contexte et exigences

### Synthèse des exigences
- Le workspace de révision doit proposer un bouton « Exporter » ouvrant une modale qui offre PDF individuel (ZIP), PDF batch multi-pages et CSV structuré pour les appréciations validées. [Source: docs/epics.md:613; docs/epics.md:615; docs/tech-spec-epic-4-generation-ia.md:153]
- L’export PDF doit appliquer le template professionnel (header, logo, footer daté) et assembler les fichiers en moins de 30 s pour un lot de 20 élèves, avec déclenchement de téléchargement et message de succès automatiques. [Source: docs/epics.md:618; docs/epics.md:620; docs/epics.md:621; docs/PRD.md:476]
- Le CSV généré expose exactement les colonnes `nom,prénom,classe,appréciation`, compatibles avec les imports bulletins des établissements. [Source: docs/epics.md:619; docs/tech-spec-epic-4-generation-ia.md:159]
- Seuls les contenus au statut `final` doivent être exportables; la pipeline doit s’appuyer sur `/appreciations/export` et bloquer les éléments encore en `draft`. [Source: docs/database-schema.md:356; docs/stories/story-4.4.md:51; src/features/appreciations/api/appreciations-client.ts:343]
- La modale doit pouvoir lancer une archive interne (S3/local) en complément du téléchargement afin de respecter les obligations de sauvegarde. [Source: docs/epics.md:622; docs/PRD.md:299]
- Les tests de recette doivent couvrir la checklist Story 4.6 (PDF/ZIP/CSV) et confirmer la conformité des données exportées. [Source: docs/tech-spec-epic-4-generation-ia.md:454]
<!-- requirements_context_summary:end -->

<!-- structure_alignment_summary:start -->
## Alignement structurel et enseignements

### Constats
- La vue de révision 3-colonnes introduite par la story 4.4 accueille déjà les actions de validation; l’entrée « Exporter » doit s’intégrer dans cette zone sans casser la navigation existante. [Source: docs/stories/story-4.4.md:44]
- `useAppreciationGeneration` filtre les appréciations et devra exposer la sélection d’IDs validés pour alimenter l’export. [Source: src/features/appreciations/hooks/use-appreciation-generation.ts:70; src/features/appreciations/hooks/use-appreciation-generation.ts:112]
- `appreciations-client` fournit `export`, `getValidated` et `downloadExportedFile`; la story doit capitaliser sur ces utilitaires au lieu de réimplémenter la logique réseau. [Source: src/features/appreciations/api/appreciations-client.ts:343; src/features/appreciations/api/appreciations-client.ts:390; src/features/appreciations/api/appreciations-client.ts:402]
- La génération PDF repose sur le service planifié (`pdf-service.ts`) et jsPDF; il faudra concrétiser cette brique pour produire les headers/footers et composer un ZIP ou PDF batch. [Source: docs/solution-architecture.md:1915]

### Leçons issues des stories précédentes
- Story 4.4 impose que seules les appréciations validées soient exportables, ce qui doit rester vrai pour les formats PDF/CSV. [Source: docs/stories/story-4.4.md:51]
- Story 4.5 prépare des lots de 60 élèves; l’export multi-format doit gérer ces volumes sans dégrader l’UX et s’appuyer sur les filtres par classe introduits. [Source: docs/stories/story-4.5.md:66]
<!-- structure_alignment_summary:end -->

<!-- acceptance_criteria:start -->
## Acceptance Criteria

1. Le workspace de révision expose un bouton « Exporter » qui ouvre une modale listant les formats disponibles pour les appréciations validées sélectionnées. [Source: docs/epics.md:613; docs/tech-spec-epic-4-generation-ia.md:153]
2. La modale permet de choisir entre PDF individuel (ZIP), PDF batch multi-pages et CSV, avec saisie éventuelle du nom de fichier et indication du nombre d’élèves exportés. [Source: docs/epics.md:615; docs/tech-spec-epic-4-generation-ia.md:155]
3. Le PDF généré respecte le template professionnel (header avec identité, corps formaté, footer daté) et utilise le guide de style choisi. [Source: docs/epics.md:618; docs/solution-architecture.md:1915]
4. Le CSV produit les colonnes `nom,prénom,classe,appréciation` et encode correctement les accents (UTF-8) pour les imports bulletins. [Source: docs/epics.md:619; docs/tech-spec-epic-4-generation-ia.md:159]
5. L’export refuse les éléments non validés et ne traite que les appréciations dont le statut est `final`; un message informe l’utilisateur des items bloqués. [Source: docs/stories/story-4.4.md:51; docs/database-schema.md:356]
6. Après traitement, le téléchargement démarre automatiquement, un toast confirme la réussite (« Export réussi : … archive.zip téléchargé ») et les timings (< 30 s pour 20 PDFs) sont consignés. [Source: docs/epics.md:620; docs/epics.md:621; docs/PRD.md:476]
7. L’option « Archiver dans le système » enregistre une copie (local/S3) avec métadonnées (période, classe, format) et retour visuel une fois l’archivage effectué. [Source: docs/epics.md:622; docs/PRD.md:299]
8. La checklist Story 4.6 (PDF/ZIP/CSV/fidélité des données) est exécutée et documentée dans le Dev Agent Record. [Source: docs/tech-spec-epic-4-generation-ia.md:454]
<!-- acceptance_criteria:end -->

<!-- tasks_subtasks:start -->
## Tasks / Subtasks

- [ ] Créer la modale d’export (AC: 1-2)
  - [ ] Ajouter le bouton « Exporter » et l’état modal dans la vue de révision (`/dashboard/appreciations`). [Source: docs/epics.md:613; src/app/dashboard/appreciations/page.tsx:724]
  - [ ] Préparer le résumé (formats, nombre d’élèves, nom de fichier) et les validations UI. [Source: docs/tech-spec-epic-4-generation-ia.md:153]
- [ ] Orchestrer l’API d’export (AC: 2,5-6)
  - [ ] Étendre `useAppreciationGeneration` pour récupérer les IDs validés et appeler `appreciationsClient.export`. [Source: src/features/appreciations/hooks/use-appreciation-generation.ts:70; src/features/appreciations/api/appreciations-client.ts:343]
  - [ ] Utiliser `downloadExportedFile` et gérer les toasts (succès/erreurs/temps écoulé). [Source: src/features/appreciations/api/appreciations-client.ts:402; docs/epics.md:621]
- [ ] Produire les sorties PDF/ZIP (AC: 3,6)
  - [ ] Implémenter `PDFService` (jsPDF) avec header/logo/footer et génération batch + archivage ZIP via JSZip. [Source: docs/solution-architecture.md:1915; docs/epics.md:616]
  - [ ] Mesurer le temps d’export pour 20 élèves et enregistrer la valeur dans le Dev Agent Record. [Source: docs/PRD.md:476]
- [ ] Générer le CSV normalisé (AC: 4-5)
  - [ ] Ajouter un export CSV (Papa Parse ou custom) respectant l’ordre des colonnes et l’encodage UTF-8. [Source: docs/epics.md:619; docs/tech-spec-epic-4-generation-ia.md:159]
  - [ ] Mettre à jour l’UX pour afficher les éléments ignorés (statut `draft`). [Source: docs/stories/story-4.4.md:51]
- [ ] Archiver et documenter (AC: 7-8)
  - [ ] Implémenter l’option d’archivage (chemin local/S3) avec métadonnées de lot. [Source: docs/epics.md:622; docs/PRD.md:299]
  - [ ] Exécuter la checklist « Story 4.6: Export », consigner résultats/temps, lancer le workflow `story-context` après validation. [Source: docs/tech-spec-epic-4-generation-ia.md:454; bmad/bmm/workflows/4-implementation/create-story/instructions.md:74]
<!-- tasks_subtasks:end -->

<!-- dev_notes_with_citations:start -->
## Dev Notes

- Prévoir des builders réutilisables (ex: `buildPdfDocument(appreciation)`) afin de mutualiser la mise en page entre PDF individuel et batch. [Source: docs/solution-architecture.md:1915]
- S’appuyer sur `downloadExportedFile` pour éviter les soucis de compatibilité navigateurs lors du déclenchement du téléchargement. [Source: src/features/appreciations/api/appreciations-client.ts:402]
- Rappeler l’état `final` côté hook avant export pour éviter les erreurs serveur liées à `/appreciations/export`. [Source: docs/database-schema.md:356; src/features/appreciations/hooks/use-appreciation-generation.ts:112]
- Stocker les paramètres d’export (format, période, classes) dans `generation_params` ou les métadonnées d’archive afin de tracer les exports précédents. [Source: docs/PRD.md:299; src/features/appreciations/api/appreciations-client.ts:352]

### Project Structure Notes

- Implémenter `pdf-service.ts` et un utilitaire CSV sous `src/services/` pour préserver la séparation logique. [Source: docs/solution-architecture.md:1890]
- Ajouter les composants/modales dans `src/components/organisms/` afin de rester aligné avec la méthodologie Atomic + feature. [Source: docs/solution-architecture.md:2633]

### References

- docs/epics.md
- docs/tech-spec-epic-4-generation-ia.md
- docs/PRD.md
- docs/database-schema.md
- docs/solution-architecture.md
- src/app/dashboard/appreciations/page.tsx
- src/features/appreciations/hooks/use-appreciation-generation.ts
- src/features/appreciations/api/appreciations-client.ts
- docs/stories/story-4.4.md
- docs/stories/story-4.5.md
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

- 2025-10-18 – Story 4.6 initial draft (assistant).

### File List

- docs/stories/story-4.6.md
<!-- change_log:end -->
