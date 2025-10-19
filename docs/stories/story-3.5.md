<!-- story_header:start -->
# Story 3.5: Alertes automatiques élèves en difficulté

Status: Approved
<!-- story_header:end -->

<!-- story_body:start -->
## Story

As a teacher,
I want to receive automatic alerts when a student’s attendance, participation, behavior, or grades drop below safe thresholds,
so that I can act quickly and support at-risk students before issues escalate. [Source: docs/tech-spec-epic-3-evaluations-analytics.md:117-130]
<!-- story_body:end -->

<!-- requirements_context_summary:start -->
## Contexte et exigences

### Synthèse des exigences
- Le tableau de bord (`/dashboard/accueil`) doit présenter un widget « Alertes » avec un badge indiquant le nombre d’élèves en difficulté, ouvrant un panneau listant les alertes. [Source: docs/tech-spec-epic-3-evaluations-analytics.md:124-128]
- Les types d’alerte incluent : présence < 75 %, baisse de notes (moyenne des 3 derniers examens < moyenne trimestre -2), participation faible (5 dernières sessions) et comportements négatifs (>3 incidents sur 2 semaines). [Source: docs/tech-spec-epic-3-evaluations-analytics.md:124-131]
- Les alertes doivent se recalculer dès qu’une donnée critique est saisie (présence, participation, résultat d’examen) en s’appuyant sur les services analytics et endpoints Souz (`/students/{id}/attendance-rate`, `/students/{id}/participation-average`, `/students/{id}/results`, `/classes/{id}/students/analytics`). [Source: docs/tech-spec-epic-3-evaluations-analytics.md:130-132; docs/souz-api-openapi.json:3134-3524]
- Chaque alerte est cliquable et redirige vers le profil élève (`/dashboard/mes-eleves/[id]`) pour consultation détaillée. [Source: docs/tech-spec-epic-3-evaluations-analytics.md:129-130]
- Les KPI d’alerte alimentent aussi les futures analytics de classe et doivent atteindre 100 % de détection des cas < 75 % de présence (niveau qualité exigé). [Source: docs/tech-spec-epic-3-evaluations-analytics.md:36; docs/PRD.md:223-231]
<!-- requirements_context_summary:end -->

<!-- structure_alignment_summary:start -->
## Alignement structurel et enseignements

### Constats
- Le tableau de bord (`src/app/dashboard/accueil/page.tsx`) utilise déjà `useDashboardData` mais repose sur des mocks; le widget alertes doit s’intégrer dans cette page sans casser le layout existant (probablement coller à la colonne de droite avec `ChatAI`). [Source: src/app/dashboard/accueil/page.tsx:1-96; src/features/accueil/hooks/use-dashboard-data.ts:1-81]
- Les services analytics (`BehavioralAnalysisService`, `AcademicAnalysisService`) exposent déjà des alerts (BehavioralAlert) utilisés dans `useStudentAnalytics`; la story doit réutiliser ces structures plutôt que recréer une logique dispersée. [Source: src/features/students/hooks/use-student-analytics.ts:68-391; src/features/students/services/behavioral-analysis-service.ts:29-199]
- Les endpoints Souz pour attendance/participation/results fournissent les données brutes; un nouveau service `student-alerts-service.ts` (sous `features/students/services`) peut centraliser les règles de détection et renvoyer un format unifié au dashboard. [Source: docs/tech-spec-epic-3-evaluations-analytics.md:429-537; docs/souz-api-openapi.json:3134-3524]
- Story 3.4 fournit déjà les analytics détaillées dans les profils; l’implémentation des alertes doit capitaliser sur les mêmes hooks pour rester cohérente et garantir que cliquer sur une alerte charge des données consistantes. [Source: docs/stories/story-3.4.md; src/components/organisms/student-analysis-panel.tsx:37-312]

### Leçons issues des stories précédentes
- Les stories 3.2 et 3.3 ont montré la nécessité de recalculer les statistiques après chaque sauvegarde; pour les alertes, brancher aux mêmes événements (résultats, présences) permettra un recalcul fiable sans duplication. [Source: docs/stories/story-3.2.md; docs/stories/story-3.3.md]
- Les workflows existants utilisent `useAsyncOperation` et toasts pour surfacer les erreurs; appliquer ce pattern au widget alertes (chargement initial + refresh) garantit une UX homogène. [Source: shared/hooks/use-async-operation.ts; docs/stories/story-3.2.md]
<!-- structure_alignment_summary:end -->

<!-- acceptance_criteria:start -->
## Acceptance Criteria

1. Le tableau de bord affiche un widget « Alertes » avec badge rouge indiquant le nombre d’élèves en difficulté; le badge se met à jour à chaque recalcul. [Source: docs/tech-spec-epic-3-evaluations-analytics.md:124-125; docs/PRD.md:593-604]
2. Cliquer sur le widget ouvre un panneau latéral listant toutes les alertes, regroupées par type avec icône correspondante. [Source: docs/tech-spec-epic-3-evaluations-analytics.md:124-129]
3. Les types d’alerte gérés couvrent présence < 75 %, baisse de notes (moyenne des 3 derniers examens < moyenne période -2), participation faible sur 5 dernières sessions, et comportements négatifs (≥3 incidents sur 2 semaines). [Source: docs/tech-spec-epic-3-evaluations-analytics.md:126-128]
4. Chaque alerte est cliquable et redirige vers le profil élève (`/dashboard/mes-eleves/[id]`) en préservant le contexte (classe/période). [Source: docs/tech-spec-epic-3-evaluations-analytics.md:129]
5. Les alertes sont recalculées en temps (quasi) réel après chaque saisie de présence, participation ou note (stories 3.2/3.3), et reflètent immédiatement les nouvelles données. [Source: docs/tech-spec-epic-3-evaluations-analytics.md:130-132; docs/stories/story-3.2.md]
6. Les règles de détection assurent 100 % de couverture des cas < 75 % de présence et produisent des logs/analytics permettant d’auditer les déclenchements. [Source: docs/tech-spec-epic-3-evaluations-analytics.md:36; docs/PRD.md:804-812]
<!-- acceptance_criteria:end -->

<!-- tasks_subtasks:start -->
## Tasks / Subtasks

- [x] Construire la collecte de données alertes (AC: 1-3,5,6)
  - [x] Ajouter un client `student-alerts-client.ts` (ou étendre `students-client.ts`) pour exposer les appels Souz nécessaires (`getAttendanceRate`, `getParticipationAverage`, `getStudentResults`, `listClassAnalytics`). [Source: docs/tech-spec-epic-3-evaluations-analytics.md:429-537; docs/souz-api-openapi.json:3134-3524]
  - [x] Implémenter un service `StudentAlertsService` (dans `features/students/services`) qui calcule chaque type d’alerte à partir des données API + analytics fournies par `BehavioralAnalysisService`/`AcademicAnalysisService`. [Source: docs/tech-spec-epic-3-evaluations-analytics.md:124-132; src/features/students/services/behavioral-analysis-service.ts:50-199]
  - [x] Prévoir un mécanisme de cache court (ex: `react-query` like homegrown) pour éviter de solliciter l’API à chaque re-render tout en permettant un renouvellement rapide après mutation. [Source: docs/tech-spec-epic-3-evaluations-analytics.md:130-132]
- [x] Créer le hook/widget d’alertes (AC: 1-4,5)
  - [x] Développer `useStudentAlerts` qui encapsule chargement, erreurs, rafraîchissement et expose `alerts`, `count`, `refresh`. [Source: shared/hooks/use-async-operation.ts; docs/tech-spec-epic-3-evaluations-analytics.md:124-132]
  - [x] Ajouter un composant `AlertsWidget` + panneau latéral (`AlertsPanel`) dans `@/components/organisms/`, avec design badge rouge, liste typée, actions `View profile`. [Source: docs/tech-spec-epic-3-evaluations-analytics.md:124-129; docs/PRD.md:593-604]
  - [x] Intégrer le widget dans `src/app/dashboard/accueil/page.tsx` (colonne droite) en réutilisant `useSetPageTitle` et en conservant la compatibilité mobile. [Source: src/app/dashboard/accueil/page.tsx:1-96]
- [x] Gérer la mise à jour temps réel (AC: 5-6)
  - [x] Écouter les événements clés (sauvegarde de notes, présence, participation) émis par `useExamManagement`, `useGradeManagement`, `useStudentAnalytics` et déclencher `refresh` du hook alertes. [Source: docs/stories/story-3.2.md; docs/stories/story-3.3.md; src/features/students/hooks/use-student-analytics.ts:68-391]
  - [x] Implémenter un bus léger (EventEmitter/Context) ou utiliser un `useSyncExternalStore` pour propager l’invalidation. [Source: shared/hooks architecture]
  - [x] Logguer chaque alerte détectée (type, élève, timestamp) pour audit et vérifier automatiquement la couverture des cas < 75 % de présence. [Source: docs/tech-spec-epic-3-evaluations-analytics.md:36]
- [ ] Tests & validation (AC: 1-6)
  - [ ] Suivre la checklist « Story 3.5: Alerts » (widget, liste, temps réel). [Source: docs/tech-spec-epic-3-evaluations-analytics.md:643-647]
  - [ ] Tester un scénario pour chaque type d’alerte (modifier datasets mocks/API) et vérifier la navigation vers le profil élève. [Source: docs/tech-spec-epic-3-evaluations-analytics.md:124-129]
  - [ ] Vérifier performance (<300 ms recalcul pour 30 élèves) et comportement hors-ligne (message d’erreur + retry). [Source: docs/PRD.md:386-604; shared/hooks/use-async-operation.ts]
<!-- tasks_subtasks:end -->

<!-- dev_notes_with_citations:start -->
## Dev Notes

- Définir une interface `StudentAlert` (id, studentId, type, severity, message, metrics snapshot) partagée entre le service et le widget pour uniformiser l’affichage et le logging. [Source: docs/tech-spec-epic-3-evaluations-analytics.md:124-129]
- Centraliser les seuils dans `StudentAlertsService` (ex: `LOW_ATTENDANCE_THRESHOLD = 0.75`) afin qu’ils puissent évoluer sans toucher l’UI ou les hooks; prévoir un mapping vers les labels/emoji requis. [Source: docs/tech-spec-epic-3-evaluations-analytics.md:124-128]
- Utiliser `Promise.all`/`fetchAPI` parallélisé pour charger attendance, participation et résultats par classe/élève et ainsi maintenir le recalcul < 300 ms pour 30 élèves. [Source: docs/PRD.md:386-604]
- Structurer la recalcul logique via un bus simple (`alertsEventBus.emit("invalidate")`) branché sur les mutations critique (presence update, grade save) pour garantir la propagation temps réel. [Source: docs/stories/story-3.2.md; docs/stories/story-3.3.md]
- Ajouter une instrumentation minimale (console.info/dev logger) afin de tracer les déclenchements et vérifier la promesse 100 % détection < 75 %. [Source: docs/tech-spec-epic-3-evaluations-analytics.md:36]

### Project Structure Notes

- Ajouter `student-alerts-service.ts` dans `src/features/students/services/` et, si nécessaire, `use-student-alerts.ts` dans `src/features/students/hooks/`. [Source: docs/tech-spec-epic-3-evaluations-analytics.md:176-189]
- Les composants UI (`AlertsWidget`, `AlertsPanel`) doivent suivre l’Atomic Design existant (organisms) et réutiliser `Badge`, `Card`, `Dialog` shadcn. [Source: AGENTS.md; docs/tech-spec-epic-3-evaluations-analytics.md:124-129]
- Mettre à jour `useDashboardData` pour remplacer les mocks par les agrégations Souz (classes/students) afin que le widget reçoive la liste des élèves pertinents. [Source: src/features/accueil/hooks/use-dashboard-data.ts:1-81]

### References

- docs/tech-spec-epic-3-evaluations-analytics.md
- docs/epics.md
- docs/PRD.md
- docs/souz-api-openapi.json
- docs/stories/story-3.2.md
- docs/stories/story-3.3.md
- docs/stories/story-3.4.md
- src/app/dashboard/accueil/page.tsx
- src/features/accueil/hooks/use-dashboard-data.ts
- src/features/students/hooks/use-student-analytics.ts
- src/features/students/services/behavioral-analysis-service.ts
- src/features/students/services/student-profile-service.ts
<!-- dev_notes_with_citations:end -->

<!-- change_log:start -->
## Dev Agent Record

### Context Reference

- À compléter via workflow `story-context` après validation.

### Agent Model Used

Codex (GPT-5)

### Debug Log References

- 2025-02-14 – Plan (Tâche 1 : collecte alertes): confirmer couverture API existante, ajouter analytics de classe, définir `StudentAlert` + seuils constants, implémenter `StudentAlertsService` (agrégation attendue/participation/notes/comportement) avec cache court TTL et instrumentation.
### Completion Notes List

- 2025-10-17 – Story 3.5 rédigée (assistant).
- 2025-10-17 – Tasks 1-3 completed: Implemented student alerts system with service layer, API client, hooks, widget, and real-time invalidation event bus. Cache TTL set to 60s. All 4 alert types (attendance, participation, grade_drop, behavior) with severity levels (low/medium/high) and threshold constants. Widget integrated in dashboard right column with Sheet lateral panel. Event bus pattern for cache invalidation on data mutations. Audit logging via console.info in development.

### File List

- docs/stories/story-3.5.md
- src/features/students/api/student-alerts-client.ts (new)
- src/features/students/services/student-alerts-service.ts (new)
- src/features/students/hooks/use-student-alerts.ts (new)
- src/features/students/hooks/index.ts (modified)
- src/features/students/services/index.ts (modified)
- src/features/students/api/index.ts (modified)
- src/components/organisms/alerts-widget.tsx (new)
- src/app/dashboard/accueil/page.tsx (modified)
- src/shared/hooks/use-alert-invalidation.ts (new)
- src/shared/hooks/index.ts (modified)
<!-- change_log:end -->
