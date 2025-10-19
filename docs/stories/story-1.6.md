<!-- story_header:start -->
# Story 1.6: Configurer les créneaux horaires d’enseignement

Status: Draft
<!-- story_header:end -->

<!-- story_body:start -->
## Story

As a teacher,
I want to define and maintain my daily teaching time slots,
so that session planning, templates, and attendance always align with my actual schedule. [Source: docs/epics.md:155-173]
<!-- story_body:end -->

<!-- requirements_context_summary:start -->
## Contexte et exigences

### Synthèse des exigences
- La page « Paramètres > Créneaux Horaires » liste tous les créneaux (heure début/fin, durée, jour, ordre, type normal/pause) avec actions d’édition. [Source: docs/epics.md:161-167; docs/PRD.md:185-192]
- La création d’un créneau collecte start/end time, jour de la semaine, ordre, flag `is_break`; la durée est calculée automatiquement. [Source: docs/epics.md:162-165; src/features/calendar/hooks/use-timeslots.ts:1-120]
- La suppression est interdite si le créneau est utilisé dans une session planifiée; l’API renvoie un conflit à gérer côté UI. [Source: docs/epics.md:167-169; docs/souz-api-openapi.json:3992-4160]
- Les créneaux « Pause » doivent être visuellement distincts et bloquer la planification de sessions. [Source: docs/epics.md:164-169; src/components/organisms/timeslots-management.tsx:1-200]
- L’ordre d’affichage et le drag & drop existant doivent persister tout en étant sauvegardés côté API (reorder). [Source: src/components/organisms/timeslots-management.tsx:31-120; src/features/calendar/hooks/use-timeslots.ts:1-200]
<!-- requirements_context_summary:end -->

<!-- structure_alignment_summary:start -->
## Alignement structurel et enseignements

### Constats
- `TimeSlotsManagement` fournit déjà l’UX (cards, drag & drop, badges) et appelle `useTimeSlots`; la story doit remplacer les mocks du hook par Souz API. [Source: src/components/organisms/timeslots-management.tsx:1-200; src/features/calendar/hooks/use-timeslots.ts:1-200]
- `MOCK_TIME_SLOTS` (calendar mocks) et la logique de calcul de durée devront être remplacés/synchronisés avec les données API pour éviter les divergences. [Source: src/features/calendar/mocks/mock-time-slots.ts:1-160]
- Les sessions (`/course-sessions`) valident que le créneau n’est pas une pause; il est essentiel de propager l’information `isBreak` correctement. [Source: docs/souz-api-openapi.json:1283-1400; src/features/calendar/hooks/use-weekly-sessions.ts:20-80]
- Les types `TimeSlot` sont définis dans `uml-entities`; conserver les méthodes `overlaps` et `getDuration` dans le mapping. [Source: src/types/uml-entities.ts:86-112]

### Leçons issues des stories précédentes
- Les stories Epic 2 ont déjà démontré l’importance de garder la timeline cohérente (templates, sessions reprogrammation). Réutiliser leur stratégie de synchronisation évite les conflits. [Source: docs/stories/story-epic2-2.2-templates-hebdomadaires.md:40-110]
- La migration API des features `sessions` et `evaluations` a montré qu’il est utile de centraliser les helpers snake_case ↔ camelCase dans le client. [Source: docs/stories/story-3.1.md:60-105]
- `useAttendanceApi` gère les validations backend en surfacant des messages lisibles; appliquer ce pattern aux time slots pour les conflits (overlap, usage). [Source: src/features/sessions/api/use-attendance-api.ts:65-150]
<!-- structure_alignment_summary:end -->

<!-- acceptance_criteria:start -->
## Acceptance Criteria

1. La page « Paramètres > Créneaux Horaires » liste les créneaux avec heure début/fin, durée, jour, ordre, type. [Source: docs/epics.md:161-162]
2. « Nouveau créneau » ouvre un formulaire capturant heure début, heure fin, jour, ordre, pause. [Source: docs/epics.md:162-163]
3. La durée est calculée automatiquement à partir des heures saisies. [Source: docs/epics.md:163-164; src/features/calendar/hooks/use-timeslots.ts:18-48]
4. Les créneaux « Pause » s’affichent différemment (badge gris) et ne peuvent pas accueillir de session. [Source: docs/epics.md:164-169; src/components/organisms/timeslots-management.tsx:139-180]
5. La liste est triée par jour puis ordre d’affichage et supporte le drag & drop pour réordonner. [Source: docs/epics.md:165-166; src/components/organisms/timeslots-management.tsx:97-120]
6. Les actions « Modifier » et « Supprimer » fonctionnent; la suppression vérifie les dépendances et affiche un message de conflit le cas échéant. [Source: docs/epics.md:166-169; docs/souz-api-openapi.json:3992-4133]
7. Le backend Souz stocke les nouveaux créneaux via `/time-slots` et renvoie les conflits de validation (overlap). [Source: docs/souz-api-openapi.json:3992-4123]
<!-- acceptance_criteria:end -->

<!-- tasks_subtasks:start -->
## Tasks / Subtasks

- [ ] Intégrer Souz API dans `useTimeSlots` (AC: 1-7)
  - [ ] Créer `time-slots-client.ts` (`GET`, `POST`, `PATCH`, `DELETE`) avec mapping `start_time`, `end_time`, `is_break`. [Source: docs/souz-api-openapi.json:3992-4160; src/lib/api.ts:1-120]
  - [ ] Remplacer `MOCK_TIME_SLOTS` par les données API et conserver les helpers `calculateDuration`, `checkConflicts`. [Source: src/features/calendar/hooks/use-timeslots.ts:1-200; src/features/calendar/mocks/mock-time-slots.ts:1-160]
- [ ] Mettre à jour `TimeSlotsManagement` (AC: 1-6)
  - [ ] Adapter le component pour utiliser les états loading/error du hook et rafraîchir la liste après mutations. [Source: src/components/organisms/timeslots-management.tsx:1-200]
  - [ ] Gérer les messages d’erreur 409/422 (overlap, slot utilisé) et différencier visuellement les slots `isBreak`. [Source: docs/souz-api-openapi.json:4094-4123]
- [ ] Sauvegarder le nouvel ordre (AC: 5)
  - [ ] Implémenter un endpoint ou un appel `PATCH` batch (si disponible) pour persister `display_order` après drag & drop; sinon, envoyer une requête pour chaque slot. [Source: docs/souz-api-openapi.json:3992-4160; src/components/organisms/timeslots-management.tsx:97-120]
- [ ] Tests et QA
  - [ ] Ajouter un test Playwright de création/modification/suppression avec vérification du drag & drop. [Source: docs/PRD.md:185-192]
  - [ ] Vérifier que les templates hebdomadaires se mettent à jour avec les nouveaux IDs/ordre. [Source: src/components/organisms/weekly-templates-management.tsx:40-120]
<!-- tasks_subtasks:end -->

<!-- dev_notes_with_citations:start -->
## Dev Notes

- `createTimeSlot` doit envoyer un header `Idempotency-Key` comme précisé dans l’OpenAPI pour éviter les doublons lors des retries. [Source: docs/souz-api-openapi.json:4060-4072]
- Les durées doivent rester calculées côté client pour l’affichage, mais la valeur `duration` renvoyée par l’API peut être utilisée pour vérification (en cas de diff). [Source: src/features/calendar/hooks/use-timeslots.ts:18-70; docs/souz-api-openapi.json:3992-4123]
- Lors de la suppression, gérer le code `409` « Time slot has dependencies » et proposer de convertir le slot en pause au lieu de le supprimer. [Source: docs/souz-api-openapi.json:4094-4133]
- Conserver les méthodes `overlaps` et `getDuration` dans le mapping pour compatibilité avec les features sessions. [Source: src/types/uml-entities.ts:86-112]
- Réutiliser `useAsyncOperation` pour encapsuler les appels API et unifier l’affichage des toasts. [Source: src/shared/hooks/use-async-operation.ts]

### Project Structure Notes

- Nouveau client `time-slots-client.ts` dans `src/features/calendar/api/` avec re-export. [Source: docs/solution-architecture.md:2680-2740]
- `useTimeSlots` reste dans `src/features/calendar/hooks` avec la même signature afin que `TimeSlotsManagement` et d’autres consumers n’aient pas à changer. [Source: src/features/calendar/hooks/use-timeslots.ts:1-200]
- Mettre à jour les tests/fixtures `mock-time-slots.ts` pour usage storybook seulement. [Source: src/features/calendar/mocks/mock-time-slots.ts:1-160]
- Vérifier l’impact sur `weekly-templates` et `dashboard` pour maintenir la cohérence des créneaux. [Source: src/features/calendar/hooks/use-weekly-sessions.ts:20-120]

### References

- docs/epics.md
- docs/PRD.md
- docs/tech-spec-epic-1-fondations.md
- docs/souz-api-openapi.json
- src/features/calendar/hooks/use-timeslots.ts
- src/components/organisms/timeslots-management.tsx
- src/features/calendar/mocks/mock-time-slots.ts
- src/components/organisms/weekly-templates-management.tsx
- src/shared/hooks/use-async-operation.ts
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

- 2025-10-17 – Story 1.6 rédigée, migration des créneaux horaires planifiée (assistant).

### File List

- docs/stories/story-1.6.md
- src/features/calendar/api/time-slots-client.ts (à créer)
- src/features/calendar/hooks/use-timeslots.ts (à modifier)
- src/components/organisms/timeslots-management.tsx (à modifier)
- src/features/calendar/mocks/mock-time-slots.ts (à ajuster pour tests)
- src/components/organisms/weekly-templates-management.tsx (à vérifier)
<!-- change_log:end -->
