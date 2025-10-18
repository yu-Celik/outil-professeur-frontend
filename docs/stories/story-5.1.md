<!-- story_header:start -->
# Story 5.1: Tableau de Bord Enseignant

Status: Draft
<!-- story_header:end -->

<!-- story_body:start -->
## Story

As a teacher,
I want a central dashboard that summarizes today’s priorities,
so that I can start each day knowing which classes, alerts, and shortcuts need attention. [Source: docs/epics.md:643; docs/PRD.md:419]
<!-- story_body:end -->

<!-- requirements_context_summary:start -->
## Contexte et exigences

### Synthèse des exigences
- Après authentification, l’utilisatrice doit être dirigée vers `/dashboard/accueil` et voir un message personnalisé « Bonjour {Prénom}, bienvenue sur outil-professor ». [Source: docs/epics.md:643; src/features/auth/hooks/use-login.ts:18; src/app/dashboard/page.tsx:1]
- Les widgets principaux couvrent la journée (sessions du jour), les 5 prochaines sessions, les alertes élèves et les statistiques rapides exposant présence, examens à corriger et rapports à générer. [Source: docs/epics.md:646; docs/epics.md:648; docs/epics.md:649]
- Le tableau de bord doit charger en moins de 2 secondes, respecter une grille responsive (3/2/1 colonnes) et rester navigable clavier/souris conformément aux contraintes UX. [Source: docs/epics.md:651; docs/PRD.md:717; docs/PRD.md:671]
- Les hooks `useUserSession`, `useDashboardData` et `useDashboardSessions` fournissent la base de données (classes, élèves, sessions) et doivent être orchestrés avec Suspense ou chargements parallèles. [Source: src/app/dashboard/accueil/page.tsx:15; src/features/accueil/hooks/use-dashboard-data.ts:30; src/features/sessions/hooks/use-dashboard-sessions.ts:19]
- Les organismes existants (`ClassesStudentsCard`, `AlertsWidget`, `CalendarWidget`, `ChatAI`) restent les blocs fondamentaux, mais doivent consommer les données réelles et afficher des compteurs alignés sur les AC. [Source: src/app/dashboard/accueil/page.tsx:73; src/components/organisms/alerts-widget.tsx:32]
- Le dashboard sert de point d’entrée aux raccourcis d’actions fréquentes (présences, calendrier, générer rapports) conformément au parcours hebdomadaire décrit dans le PRD. [Source: docs/epics.md:650; docs/PRD.md:419]
<!-- requirements_context_summary:end -->

<!-- structure_alignment_summary:start -->
## Alignement structurel et enseignements

### Constats
- `AccueilPage` assemble déjà les organismes clés mais se base sur des mocks et ne structure pas encore les widgets Sessions/Statistiques/Actions rapides requises. [Source: src/app/dashboard/accueil/page.tsx:12]
- `useDashboardData` et `useDashboardSessions` exposent classes/élèves/sessions à partir des mocks et devront être remplacés ou complétés par des appels unifiés afin d’éviter les divergences d’état. [Source: src/features/accueil/hooks/use-dashboard-data.ts:30; src/features/sessions/hooks/use-dashboard-sessions.ts:19]
- `AlertsWidget` s’appuie sur `useStudentAlerts`; il doit être alimenté avec les classIds filtrées et afficher le badge compteur attendu par l’épic. [Source: src/components/organisms/alerts-widget.tsx:32]
- Le layout responsive doit s’appuyer sur les templates existants (`dashboard layout`, `sidebar`) pour garantir cohérence avec l’architecture Atomic + Feature. [Source: docs/solution-architecture.md:2488]

### Leçons issues des stories précédentes
- Les stories 4.x ont démontré l’importance de centraliser les requêtes dans des hooks feature (`useAppreciationGeneration`, `useDashboardSessions`) et de garder la logique métier hors des composants. [Source: docs/stories/story-4.3.md:80; src/features/sessions/hooks/use-dashboard-sessions.ts:19]
- Les patterns de toasts/loading (`useAsyncOperation`) utilisés sur les features précédentes doivent être répliqués pour les chargements dashboard afin de garantir des feedbacks instantanés. [Source: docs/stories/story-4.3.md:81; src/shared/hooks/use-async-operation.ts:15]
<!-- structure_alignment_summary:end -->

<!-- acceptance_criteria:start -->
## Acceptance Criteria

1. Après login ou accès direct, l’utilisatrice arrive sur `/dashboard/accueil` et voit l’en-tête personnalisé « Bonjour {Prénom}, bienvenue sur outil-professor ». [Source: docs/epics.md:644; src/features/auth/hooks/use-login.ts:18; src/app/dashboard/accueil/page.tsx:12]
2. Le widget « Sessions aujourd’hui » liste toutes les sessions du jour avec heure, classe, matière et statut, mis à jour en temps réel. [Source: docs/epics.md:646; src/features/sessions/hooks/use-dashboard-sessions.ts:19]
3. Un widget « À venir cette semaine » affiche les 5 prochaines sessions triées chronologiquement (classe, matière, date). [Source: docs/epics.md:647; src/features/sessions/hooks/use-dashboard-sessions.ts:40]
4. Le widget « Alertes » montre un badge compteur et les alertes élèves critiques, avec navigation vers la fiche élève. [Source: docs/epics.md:648; src/components/organisms/alerts-widget.tsx:32]
5. Le bloc « Statistiques rapides » expose au minimum le taux de présence hebdomadaire, le nombre d’examens à corriger et de rapports en attente. [Source: docs/epics.md:649]
6. Un bloc « Accès rapides » propose les boutons Saisir présences, Créer session, Voir calendrier, Générer rapports et déclenche les routes correspondantes. [Source: docs/epics.md:650; docs/PRD.md:671]
7. Le dashboard affiche un squelette/loader et reste interactif en < 2 s sur connexion standard, avec instrumentation du temps de chargement. [Source: docs/epics.md:651; docs/PRD.md:717]
8. Le layout reste responsive (3 colonnes desktop ≥1280px, 2 colonnes tablette 768‑1279px, 1 colonne mobile), tout en préservant la navigation clavier. [Source: docs/PRD.md:717; docs/PRD.md:671]
<!-- acceptance_criteria:end -->

<!-- tasks_subtasks:start -->
## Tasks / Subtasks

- [ ] Structurer la page d’accueil (AC: 1,8)
  - [ ] Injecter le greeting personnalisé dans `AccueilPage` à partir de `useUserSession` et garantir la redirection `/dashboard/accueil`. [Source: src/app/dashboard/accueil/page.tsx:15; docs/epics.md:644]
  - [ ] Mettre en place les containers responsive (3/2/1 colonnes) avec Skeleton loaders. [Source: docs/PRD.md:717]
- [ ] Widgets sessions et calendrier (AC: 2-3)
  - [ ] Brancher `useDashboardSessions` pour alimenter sessions du jour et prochaines sessions. [Source: src/features/sessions/hooks/use-dashboard-sessions.ts:19]
  - [ ] Ajouter un widget dédié (cards ou timeline) pour les 5 sessions à venir. [Source: docs/epics.md:647]
- [ ] Alertes et statistiques (AC: 4-5)
  - [ ] Relier `AlertsWidget` au contexte classe/matière et afficher badge compteur + navigation. [Source: src/components/organisms/alerts-widget.tsx:32; docs/epics.md:648]
  - [ ] Calculer les statistiques rapides (présence hebdo, examens à corriger, rapports en attente) et les afficher dans un organisme dédié. [Source: docs/epics.md:649]
- [ ] Accès rapides et onboarding (AC: 6)
  - [ ] Créer le composant « Quick Actions » déclenchant les routes clés et intégrer l’onboarding banner conditionnel. [Source: docs/epics.md:650; src/app/dashboard/accueil/page.tsx:59]
- [ ] Performance et instrumentation (AC: 7-8)
  - [ ] Charger les données en parallèle (Suspense/cache) et mesurer le temps initial (<2 s) avec logs ou métriques Sonner. [Source: docs/epics.md:651; src/shared/hooks/use-async-operation.ts:15]
  - [ ] Couvrir la navigation clavier et les breakpoints via tests exploratoires/Playwright si nécessaire. [Source: docs/PRD.md:671]
- [ ] Validation & documentation (AC: 1-8)
  - [ ] Conduire une revue visuelle + checklist Epic 5 (widgets, temps de chargement, responsive). [Source: docs/epics.md:643]
  - [ ] Mettre à jour Dev Agent Record et lancer le workflow `story-context` après validation. [Source: bmad/bmm/workflows/4-implementation/create-story/instructions.md:74]
<!-- tasks_subtasks:end -->

<!-- dev_notes_with_citations:start -->
## Dev Notes

- Centraliser le fetch des classes/élèves/sessions dans un hook unique (`useDashboardOverview`) pour éliminer la duplication actuellement présente entre `useDashboardData` et `useDashboardSessions`. [Source: src/features/accueil/hooks/use-dashboard-data.ts:30; src/features/sessions/hooks/use-dashboard-sessions.ts:19]
- Réutiliser `AlertsWidget`, `ClassesStudentsCard`, `CalendarWidget` et `ChatAI` mais en leur fournissant des props dérivées des vraies données (plus de `console.log`). [Source: src/app/dashboard/accueil/page.tsx:73]
- Ajouter une instrumentation légère (e.g. `performance.mark`) pour vérifier le chargement < 2 s et journaliser l’information dans la console dev. [Source: docs/epics.md:651]
- Prévoir des Skeletons/progress indicators cohérents avec les guidelines UX pour éviter des flashs de contenu vide. [Source: docs/PRD.md:717]

### Project Structure Notes

- Les nouveaux widgets (sessions du jour, statistiques rapides, quick actions) doivent être placés dans `src/components/organisms/dashboard-*` afin de respecter l’architecture Atomic. [Source: docs/solution-architecture.md:2547]
- Les hooks consolidés iront sous `src/features/accueil/hooks/` et exposeront une API unique depuis l’index du feature. [Source: docs/solution-architecture.md:2648]

### References

- docs/epics.md
- docs/PRD.md
- docs/solution-architecture.md
- src/app/dashboard/accueil/page.tsx
- src/app/dashboard/page.tsx
- src/features/auth/hooks/use-login.ts
- src/features/accueil/hooks/use-dashboard-data.ts
- src/features/sessions/hooks/use-dashboard-sessions.ts
- src/components/organisms/alerts-widget.tsx
- docs/stories/story-4.3.md
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

- 2025-10-18 – Story 5.1 initial draft (assistant).

### File List

- docs/stories/story-5.1.md
<!-- change_log:end -->
