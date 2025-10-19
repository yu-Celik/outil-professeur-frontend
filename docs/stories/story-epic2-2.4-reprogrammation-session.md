<!-- story_header:start -->
# Story 2.4: Reprogrammation de Session

Status: Ready for Review
<!-- story_header:end -->

<!-- requirements_context_summary:start -->
### Synthèse des exigences
- Depuis la fenêtre de détails d’une session, l’enseignante doit pouvoir déclencher un flux de reprogrammation qui affiche la date/créneau actuels, propose une nouvelle planification et confirme le changement. [Source: docs/epics.md:255; src/app/dashboard/calendrier/page.tsx:240]
- La modal `SessionMoveDialog` gère déjà la sélection date/heure, la détection de conflits (`conflictingSessions`) et les toasts Sonner via `useSessionMoves`; l’intégration doit persister les changements via `useCourseSessionsApi.update` et adapter le statut (`planned`, `cancelled`) selon l’option choisie. [Source: src/components/molecules/session-move-dialog.tsx:23; src/features/calendar/hooks/use-session-moves.ts:20; src/features/calendar/api/use-course-sessions-api.ts:290]
- Les cas “Reportée” et “Annulée” doivent respecter les règles business : nouvelle date obligatoire pour report, statut `cancelled` pour annulation, journalisation via `SessionManagementService.moveSession` / `cancelSession`. [Source: docs/epics.md:262; src/services/session-makeup.ts:57; src/services/session-makeup.ts:96]
- L’API souple `/course-sessions/{id}` (PATCH) accepte `session_date`, `time_slot_id`, `status`, `notes` et retourne les conflits (409) ou validations (422); l’interface doit afficher le message “Session reprogrammée au …” ou l’erreur correspondante. [Source: docs/souz-api-openapi.json#/paths/~1course-sessions~1{id}/patch; src/components/atoms/toast-notifications.tsx:11]
<!-- requirements_context_summary:end -->

## Story

<!-- story_body:start -->
As a teacher, I want to reschedule an existing session to a different day or time slot, so that I can handle unexpected events (holidays, absences, technical issues) without losing the session. [Source: docs/epics.md:255]
<!-- story_body:end -->

## Acceptance Criteria

<!-- acceptance_criteria:start -->
1. From a session detail action (calendar modal), clicking “Reprogrammer” opens a dialog that shows the current date/time slot and allows choosing a new combination. [Source: docs/epics.md:256; src/app/dashboard/calendrier/page.tsx:240]
2. The dialog enforces validation: requires a new date/time slot for reports, disables confirming when nothing changes, and blocks “pause” slots using shared `TimeSlotSelector` rules. [Source: docs/tech-spec-epic-2-sessions-presences.md:103; src/components/molecules/session-move-dialog.tsx:62]
3. Submitting a reschedule calls `PATCH /course-sessions/{id}` with `session_date`, `time_slot_id`, `status: "planned"` (or `is_moved` flag) and on success refreshes the calendar via `useCourseSessionsApi.refresh`. [Source: docs/souz-api-openapi.json#/paths/~1course-sessions~1{id}/patch; src/features/calendar/api/use-course-sessions-api.ts:290]
4. If the backend returns HTTP 409 for a conflicting session, the UI shows a Sonner error toast describing the clash and keeps the dialog open for correction. [Source: docs/epics.md:259; src/components/atoms/toast-notifications.tsx:40]
5. When “Annulée” is selected, the dialog (or linked cancel flow) updates status to `cancelled`, optional reason notes, and the calendar reflects the new state without creating duplicate sessions. [Source: docs/epics.md:261; src/services/session-makeup.ts:96]
6. Successful rescheduling displays “Session reprogrammée au <jour> <heure>” via `showSessionMoveToast`, closes the modal, and records an undo entry for quick rollback. [Source: docs/epics.md:263; src/features/calendar/hooks/use-session-moves.ts:20]
7. The feature stores a history entry (notes) indicating the original schedule (`SessionManagementService.moveSession`) and resets form fields upon close; no mock data is used in production. [Source: src/services/session-makeup.ts:57; src/components/molecules/session-move-dialog.tsx:38]
<!-- acceptance_criteria:end -->

## Tasks / Subtasks

<!-- tasks_subtasks:start -->
- [x] Connect the "Reprogrammer" CTA in session detail modal to `SessionMoveDialog`, passing selected session and existing conflicts. (AC: 1)
  - [x] Ensure calendar events provide class/subject/time slot context to the dialog header. [Source: src/app/dashboard/calendrier/page.tsx:276]
- [x] Harden `SessionMoveDialog` validation for new date/time slot selection and forbid pause slots. (AC: 2)
  - [x] Reuse `TimeSlotSelector` filtering logic to hide `isBreak` entries. [Source: src/components/atoms/time-slot-selector.tsx:1]
- [x] Persist reschedules through API patch and refresh. (AC: 3)
  - [x] Call `api.courseSessions.update` with mapped payload, then invoke `useCourseSessionsApi.refresh`. [Source: src/lib/api.ts:396; src/features/calendar/api/use-course-sessions-api.ts:290]
- [x] Surface conflict/validation errors and keep dialog state for correction. (AC: 4)
  - [x] Map HTTP 409/422 responses to Sonner errors; fall back to generic messages otherwise. [Source: docs/souz-api-openapi.json#/paths/~1course-sessions~1{id}/patch]
- [x] Support cancellation flow and status updates. (AC: 5)
  - [x] Wire “Annulée” selection to `SessionCancelDialog` / `useCourseSessionsApi.update` with `status: "cancelled"`. [Source: src/components/molecules/session-cancel-dialog.tsx:1]
- [x] Emit success toast + undo bookkeeping with original schedule notes. (AC: 6,7)
  - [x] Use `SessionManagementService.moveSession` to generate note context and `showSessionMoveToast` for messaging. [Source: src/services/session-makeup.ts:57; src/components/atoms/toast-notifications.tsx:11]
- [ ] Document testing strategy (manual + E2E) covering reschedule, undo, and cancel paths. (AC: 7)
  - [ ] Extend calendar test checklist to include session move undo verification. [Source: docs/tech-spec-epic-2-sessions-presences.md:608]
<!-- tasks_subtasks:end -->

## Dev Notes

<!-- dev_notes_with_citations:start -->
- **API integration**: Use `api.courseSessions.update(id, payload)` for PATCH and rely on `useCourseSessionsApi.updateSession` + `refresh`. Ensure payload includes `session_date`, `time_slot_id`, `status`, `notes`. [Source: src/lib/api.ts:396; src/features/calendar/api/use-course-sessions-api.ts:290]
- **UI hooks**: `useSessionMoves` already formats success toasts/undo; pass `moveSession` from `useCalendar` so state and API stay consistent. [Source: src/features/calendar/hooks/use-session-moves.ts:20; src/features/calendar/hooks/use-calendar.ts:414]
- **Business logic**: `SessionManagementService.moveSession` / `cancelSession` provide consistent note/status updates; call before persisting to ensure UML fields (`isMoved`, `notes`) remain aligned. [Source: src/services/session-makeup.ts:57]
- **Conflict detection**: Keep local guard via `conflictingSessions` but trust backend 409 responses; convert into actionable error message. [Source: src/components/molecules/session-move-dialog.tsx:108; docs/souz-api-openapi.json#/paths/~1course-sessions~1{id}/patch]
- **Testing**: Manual checklist already lists reschedule scenarios — extend with Playwright test covering move + undo + cancellation to prevent regressions. [Source: docs/tech-spec-epic-2-sessions-presences.md:608]
<!-- dev_notes_with_citations:end -->

### Project Structure Notes

- Reschedule UI remains in `src/app/dashboard/calendrier/page.tsx` orchestrating modals, with dialog logic in `src/components/molecules/session-move-dialog.tsx` and API orchestration in `src/features/calendar/api/use-course-sessions-api.ts`. [Source: src/app/dashboard/calendrier/page.tsx:1]
- Status updates and note formatting should leverage existing services/hooks rather than new modules to stay aligned with calendar feature conventions. [Source: src/services/session-makeup.ts:57]

### References

- docs/epics.md:255
- docs/tech-spec-epic-2-sessions-presences.md:98
- docs/souz-api-openapi.json#/paths/~1course-sessions~1{id}/patch
- src/app/dashboard/calendrier/page.tsx:1
- src/components/molecules/session-move-dialog.tsx:23
- src/components/molecules/session-cancel-dialog.tsx:1
- src/features/calendar/api/use-course-sessions-api.ts:290
- src/features/calendar/hooks/use-session-moves.ts:20
- src/features/calendar/hooks/use-calendar.ts:414
- src/services/session-makeup.ts:57
- src/components/atoms/toast-notifications.tsx:11
- src/components/atoms/time-slot-selector.tsx:1
- docs/tech-spec-epic-2-sessions-presences.md:608

## Change Log

<!-- change_log:start -->
| Date       | Description                                                                                       | Author |
|------------|---------------------------------------------------------------------------------------------------|--------|
| 2025-10-18 | Initial draft aligning story 2.4 with new workflow.                                               | Yusuf  |
| 2025-10-18 | Implementation validated: reschedule + cancel flows live with API integration and toasts.         | Yusuf  |
| 2025-10-18 | Open follow-up: add automated tests for reschedule/undo/cancel scenarios (tracked in task list). | Yusuf  |
<!-- change_log:end -->

## Dev Agent Record

### Context Reference

<!-- Path(s) to story context XML/JSON will be added here by context workflow -->

### Agent Model Used

claude-sonnet-4-5-20250929

### Debug Log References

**Story 2.4 - Reprogrammation: IMPLEMENTED**

Validation résumé :
1. **AC 1 (Entrée depuis calendrier)**: Reprogrammer accessible via modal détail + SessionMoveDialog [calendar.tsx:414; session-move-dialog.tsx:23]
2. **AC 2 (Validation)**: TimeSlotSelector filtre `isBreak`, SessionMoveDialog désactive le bouton tant que date/créneau invalides [time-slot-selector.tsx:30; session-move-dialog.tsx:100]
3. **AC 3 (API)**: moveSession appelle `updateCourseSession` + `refreshSessions` pour persistance [use-calendar.ts:414-438]
4. **AC 4 (Erreurs)**: HTTP 409 -> toast explicite, modal reste ouverte [page.tsx:183-191]
5. **AC 5 (Annulation)**: cancelSession passe par API + refresh [use-calendar.ts:384-408]
6. **AC 6 (Toast succès)**: showSessionMoveToast + undo [use-session-moves.ts:23-73]
7. **AC 7 (Historique)**: notes et flags `isMoved` gérés via service, formulaire reset automatique [session-move-dialog.tsx:52-59]

Tests recommandés :
- Tester le flow PATCH happy path + conflict 409
- Valider undo move -> restore original session
- Couvrir annulation (status `cancelled`) avec refresh

### Completion Notes List

**Story 2.4 - Reprogrammation: COMPLETE**

- ✅ Déplacement et annulation opérationnels via API Souz
- ✅ Toasts + undo cohérents avec guidelines Sonner
- ✅ Notes et flags UML (`isMoved`, `notes`) maintenus
- ⚠️ Tests automatisés à ajouter (Playwright + unitaires)

### File List

- src/app/dashboard/calendrier/page.tsx
- src/features/calendar/hooks/use-calendar.ts
- src/components/molecules/session-move-dialog.tsx
- src/components/molecules/session-cancel-dialog.tsx
- src/features/calendar/api/use-course-sessions-api.ts
- src/features/calendar/hooks/use-session-moves.ts
- src/components/atoms/toast-notifications.tsx
- src/components/atoms/time-slot-selector.tsx
