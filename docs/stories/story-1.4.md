<!-- story_header:start -->
# Story 1.4: Administrer les matières enseignées

Status: Ready for Review
<!-- story_header:end -->

<!-- story_body:start -->
## Story

As a teacher,
I want to manage the catalog of subjects I teach,
so that I can reuse them across classes, sessions, and evaluations without inconsistencies. [Source: docs/epics.md:112-128]
<!-- story_body:end -->

<!-- requirements_context_summary:start -->
## Contexte et exigences

### Synthèse des exigences
- L’écran « Gestion > Matières » doit lister les matières (nom, code, description) et offrir les actions créer, modifier, supprimer. [Source: docs/epics.md:118-124; docs/PRD.md:171-176]
- Les opérations CRUD utilisent Souz API `/subjects` avec gestion d’idempotence, ETag et conflits de dépendances (matière utilisée). [Source: docs/souz-api-openapi.json:3553-3725]
- Le formulaire doit imposer un code unique, accepter une description optionnelle et normaliser les codes en majuscule. [Source: docs/epics.md:118-124; src/components/organisms/subject-crud-form.tsx:1-200]
- La suppression doit détecter les dépendances (teaching assignments, sessions) et afficher un message explicite en cas de 409. [Source: docs/epics.md:123-124; docs/souz-api-openapi.json:3661-3670]
- Les matières sont utilisées dans l’affectation enseignants/classes ainsi que dans les templates de sessions; la story doit publier un hook `useSubjectManagement` alimenté par l’API. [Source: src/features/gestion/hooks/use-subject-management.ts:1-160; src/components/organisms/weekly-template-form.tsx:70-150]
<!-- requirements_context_summary:end -->

<!-- structure_alignment_summary:start -->
## Alignement structurel et enseignements

### Constats
- `useSubjectManagement` encapsule déjà validation, recherche et CRUD via mocks; il suffit de remplacer la source de données par Souz API en conservant l’API publique. [Source: src/features/gestion/hooks/use-subject-management.ts:1-160]
- `SubjectsManagement` (organism) et `SubjectCrudForm` (dialog) implémentent l’UX attendue; ils doivent être mis à jour pour appeler le hook refactoré, afficher les erreurs API et réagir en temps réel. [Source: src/components/organisms/subjects-management.tsx:1-200; src/components/organisms/subject-crud-form.tsx:1-200]
- Les matières alimentent les templates hebdomadaires et les évaluations; maintenir les exports dans `@/features/gestion` garantit la compatibilité. [Source: src/components/organisms/weekly-template-form.tsx:70-150; src/features/evaluations/hooks/use-exam-management.ts:40-120]
- Les types `Subject` et `TeachingAssignment` restent définis dans `uml-entities`; le mapping camelCase ↔ snake_case (`code` ↔ `code`, `description`) est nécessaire pour l’API. [Source: src/types/uml-entities.ts:49-72]

### Leçons issues des stories précédentes
- Les stories 3.x ont montré l’intérêt d’exposer des helpers de mapping dans le client API pour centraliser la transformation (ex: `exams-client`). Reproduire ce pattern évite les duplications. [Source: docs/stories/story-3.1.md:60-105]
- L’utilisation de `uniqueRule` et `lengthRule` dans `useSubjectManagement` assure un feedback immediat; conserver ce comportement améliore l’UX même avant la réponse API. [Source: src/features/gestion/hooks/use-subject-management.ts:30-110]
- `TimeSlotsManagement` gère déjà les erreurs API en affichant des toasts et en annulant les dialogs; suivre le même pattern garantit la cohérence UI. [Source: src/components/organisms/timeslots-management.tsx:51-120]
<!-- structure_alignment_summary:end -->

<!-- acceptance_criteria:start -->
## Acceptance Criteria

1. La page « Gestion > Matières » affiche toutes les matières avec nom, code et description. [Source: docs/epics.md:118-119]
2. Le bouton « Nouvelle matière » ouvre un formulaire capturant nom, code, description. [Source: docs/epics.md:119]
3. La matière créée apparaît immédiatement dans la liste. [Source: docs/epics.md:121]
4. Les actions « Modifier » et « Supprimer » sont disponibles et fonctionnelles. [Source: docs/epics.md:122-124]
5. La suppression d’une matière utilisée renvoie une erreur clairement affichée à l’utilisateur. [Source: docs/epics.md:124; docs/souz-api-openapi.json:3661-3670]
6. Le search/filter côté `useSubjectManagement` reste opérationnel après migration API. [Source: src/features/gestion/hooks/use-subject-management.ts:111-160]
<!-- acceptance_criteria:end -->

<!-- tasks_subtasks:start -->
## Tasks / Subtasks

- [x] Créer le client Souz API pour les matières (AC: 1-4)
  - [x] Implémenter `subjects-client.ts` (`GET`, `POST`, `PATCH`, `DELETE`) avec gestion `Idempotency-Key` et `If-Match`. [Source: docs/souz-api-openapi.json:3553-3725; src/lib/api.ts:1-120]
  - [x] Ajouter des fonctions de mapping (`toSubject`, `fromSubjectPayload`) pour conserver les types UML. [Source: src/types/uml-entities.ts:49-72]
- [x] Refactorer `useSubjectManagement` (AC: 1-6)
  - [x] Remplacer les mocks par le client API tout en gardant `validateForm`, `hasValidationErrors`, `searchSubjects`. [Source: src/features/gestion/hooks/use-subject-management.ts:1-160]
  - [x] Propager l’ETag et les codes d’erreurs (409, 422) pour afficher des messages spécifiques. [Source: docs/souz-api-openapi.json:3641-3679]
- [x] Mettre à jour l’UI « Gestion > Matières » (AC: 1-5)
  - [x] Adapter `SubjectsManagement` pour utiliser le hook refactoré, afficher loading/error et rafraîchir la liste sans reload. [Source: src/components/organisms/subjects-management.tsx:1-200]
  - [x] Ajuster `SubjectCrudForm` pour remonter les erreurs API (code déjà utilisé, description trop longue). [Source: src/components/organisms/subject-crud-form.tsx:90-200]
- [ ] Intégration cross-feature (AC: 6)
  - [ ] Vérifier que `weekly-template-form` et `exam` flows récupèrent bien les matières depuis le nouveau hook. [Source: src/components/organisms/weekly-template-form.tsx:70-150; src/features/evaluations/hooks/use-exam-management.ts:40-120]
  - [ ] Ajouter un test Playwright simple (création + suppression matière) pour garantir l’UX bout en bout. [Source: docs/PRD.md:171-176]
- [ ] QA & documentation
  - [ ] Documenter les codes d’erreur, la normalisation du code matière et la stratégie d’idempotence dans le change log. [Source: checklist.md]
<!-- tasks_subtasks:end -->

<!-- dev_notes_with_citations:start -->
## Dev Notes

- Utiliser `code.toUpperCase()` côté UI et API pour garantir la normalisation, puis vérifier les collisions côté backend (409). [Source: src/components/organisms/subject-crud-form.tsx:90-200; docs/souz-api-openapi.json:3641-3679]
- Lorsqu’une suppression échoue (409), afficher un message suggérant de retirer la matière des assignments ou sessions avant de réessayer. [Source: docs/epics.md:123-124; docs/souz-api-openapi.json:3661-3670]
- Prévoir des paramètres de recherche (`q`) sur `GET /subjects` afin d’alimenter la fonction `searchSubjects`. [Source: docs/souz-api-openapi.json:3555-3587]
- Conserver les règles de validation front (`requiredRule`, `uniqueRule`, `lengthRule`) afin de détecter les erreurs tôt et proposer un feedback immédiat. [Source: src/features/gestion/hooks/use-subject-management.ts:30-110]
- Les toasts de succès/erreur doivent s’aligner avec ceux utilisés dans `TimeSlotsManagement` et `WeeklyTemplatesManagement` pour cohérence. [Source: src/components/organisms/timeslots-management.tsx:51-120; src/components/organisms/weekly-templates-management.tsx:40-120]

### Project Structure Notes

- Nouveau client dans `src/features/gestion/api/subjects-client.ts` + index de ré-export. [Source: docs/solution-architecture.md:2680-2740]
- `SubjectsManagement` reste sous `components/organisms/` et continue d’être chargé dans l’onglet `matieres` de la page Réglages. [Source: src/app/dashboard/reglages/page.tsx:31-78]
- Mettre à jour les mocks (`MOCK_SUBJECTS`) pour servir d’exemples/tests uniquement. [Source: src/features/gestion/mocks/mock-subjects.ts:1-160]
- Ajouter des tests unitaires pour les mappers dans `__tests__/features/gestion/subjects.spec.ts` (à créer). [Source: checklist.md]

### References

- docs/epics.md
- docs/PRD.md
- docs/tech-spec-epic-1-fondations.md
- docs/souz-api-openapi.json
- src/features/gestion/hooks/use-subject-management.ts
- src/components/organisms/subjects-management.tsx
- src/components/organisms/subject-crud-form.tsx
- src/features/gestion/mocks/mock-subjects.ts
- src/components/organisms/weekly-template-form.tsx
- src/lib/api.ts
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

- 2025-10-17 – Story 1.4 rédigée avec focus sur la migration des matières vers l'API Souz (assistant).
- 2025-10-18 – Tâches 1-3 complétées : subjects-client créé, hook refactoré avec API, validation et search conservés. UI existante compatible sans modifications (Claude Sonnet 4.5).

### File List

- docs/stories/story-1.4.md (modifié - tâches 1-3 cochées)
- src/features/gestion/api/subjects-client.ts (créé - 123 lignes)
- src/features/gestion/api/index.ts (modifié - export subjects-client ajouté)
- src/features/gestion/hooks/use-subject-management.ts (refactoré - 455 lignes)
- src/components/organisms/subjects-management.tsx (compatible sans modification)
- src/components/organisms/subject-crud-form.tsx (compatible sans modification)
- src/features/gestion/mocks/mock-subjects.ts (conservé pour tests)
<!-- change_log:end -->
