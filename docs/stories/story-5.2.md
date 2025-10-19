<!-- story_header:start -->
# Story 5.2: Sélection Contexte Classe/Matière Globale

Status: Draft
<!-- story_header:end -->

<!-- story_body:start -->
## Story

As a teacher,
I want a persistent class and subject selector that filters every dashboard page,
so that I can stay focused on the right group without reconfiguring each view. [Source: docs/epics.md:652; docs/PRD.md:661]
<!-- story_body:end -->

<!-- requirements_context_summary:start -->
## Contexte et exigences

### Synthèse des exigences
- L’application doit exposer un sélecteur double Classe → Matière accessible en permanence (header/sidebar) et filtrant automatiquement les matières selon la classe choisie. [Source: docs/epics.md:654; src/components/templates/class-selector-dropdown.tsx:1]
- Le contexte sélectionné (classe, matière) est persistant entre sessions via localStorage et rétabli au montage du provider global. [Source: docs/epics.md:655; src/contexts/class-selection-context.tsx:53]
- Toutes les pages pédagogiques (Sessions, Présences, Élèves, Évaluations, Appréciations) consomment ce contexte et rechargent leurs données lors d’un changement de classe/matière. [Source: docs/epics.md:656; src/app/dashboard/sessions/page.tsx:17; src/app/dashboard/mes-eleves/page.tsx:10; src/app/dashboard/evaluations/page.tsx:16; src/app/dashboard/appreciations/page.tsx:70]
- Le header affiche un badge clair « Classe – Matière » pour rappeler le contexte actif et proposer une option « Toutes classes / Toutes matières ». [Source: docs/epics.md:657; docs/PRD.md:676]
- Les combinaisons proposées respectent les assignments enseignants (matières autorisées par classe) grâce au filtrage intelligent existant. [Source: docs/epics.md:654; src/shared/hooks/use-smart-filtering.ts:10]
<!-- requirements_context_summary:end -->

<!-- structure_alignment_summary:start -->
## Alignement structurel et enseignements

### Constats
- `ClassSelectionContext` ne gère actuellement que l’identifiant de classe; il faut y ajouter la sélection matière, la persistance des deux valeurs et l’accès aux listes issues des assignments. [Source: src/contexts/class-selection-context.tsx:15]
- `ClassSelectorDropdown` vit dans la sidebar mais ne propose qu’un menu classe; la story impose un double menu + option « Toutes » avec remontée des événements vers le context. [Source: src/components/templates/class-selector-dropdown.tsx:1]
- `SiteHeader` n’affiche pas aujourd’hui de badge de contexte; une adaptation est nécessaire pour répondre à l’AC sur la visibilité permanente. [Source: src/components/templates/site-header.tsx:1]
- Les pages `sessions`, `mes-eleves`, `evaluations`, `appreciations` s’appuient toutes sur `useClassSelection`; étendre le context à la matière doit rester transparent pour elles mais impose une mise à jour de leurs hooks/services. [Source: src/app/dashboard/sessions/page.tsx:17; src/app/dashboard/mes-eleves/page.tsx:10; src/app/dashboard/evaluations/page.tsx:16; src/app/dashboard/appreciations/page.tsx:34]

### Leçons issues des stories précédentes
- Les features 4.x ont montré que centraliser le contexte dans un provider partagé évite la duplication et sécurise la persistance (pattern similaire au story 4.4 pour l’état de révision). [Source: docs/stories/story-4.4.md:44]
- `useSmartFiltering` fournit déjà des combinaisons valides classe/matière; l’utiliser dans la story limite la logique à re-développer et garantit la cohérence des filtres. [Source: src/shared/hooks/use-smart-filtering.ts:10]
<!-- structure_alignment_summary:end -->

<!-- acceptance_criteria:start -->
## Acceptance Criteria

1. Un sélecteur combiné Classe/Matière est visible dans l’interface (header ou sidebar) avec affichage du couple sélectionné. [Source: docs/epics.md:654; src/components/templates/class-selector-dropdown.tsx:1]
2. Le dropdown classe liste uniquement les classes autorisées pour l’enseignant, le dropdown matière se met à jour selon la classe sélectionnée, et inversement. [Source: docs/epics.md:654; src/shared/hooks/use-smart-filtering.ts:26]
3. Les choix classe/matière se sauvegardent et se restaurent entre sessions navigateur via localStorage. [Source: docs/epics.md:655; src/contexts/class-selection-context.tsx:66]
4. Changer de classe ou de matière entraîne le rafraîchissement automatique des pages Sessions, Mes Élèves, Évaluations, Appréciations avec les données filtrées correspondantes. [Source: docs/epics.md:656; src/app/dashboard/sessions/page.tsx:17; src/app/dashboard/mes-eleves/page.tsx:10; src/app/dashboard/evaluations/page.tsx:16; src/app/dashboard/appreciations/page.tsx:34]
5. Le header affiche un badge contextuel « Classe – Matière » ou « Toutes classes / Toutes matières » lorsque les valeurs par défaut sont actives. [Source: docs/epics.md:657; docs/PRD.md:677]
6. Une option « Toutes classes » et « Toutes matières » est disponible pour revenir à une vue globale, ce qui neutralise les filtres. [Source: docs/epics.md:658]
7. Les combinaisons invalides (classe/matière non assignées au professeur) sont désactivées ou masquées, en s’appuyant sur les règles d’assignation. [Source: docs/epics.md:654; src/shared/hooks/use-smart-filtering.ts:98]
<!-- acceptance_criteria:end -->

<!-- tasks_subtasks:start -->
## Tasks / Subtasks

- [ ] Étendre le context global (AC: 2-3,7)
  - [ ] Ajouter `selectedSubjectId`, setters, persistance et exposer les listes filtrées via `useSmartFiltering`. [Source: src/contexts/class-selection-context.tsx:15; src/shared/hooks/use-smart-filtering.ts:26]
  - [ ] Synchroniser localStorage pour classe et matière et fournir un reset « All ». [Source: src/contexts/class-selection-context.tsx:66]
- [ ] Refondre le sélecteur UI (AC: 1-2,6)
  - [ ] Transformer `ClassSelectorDropdown` en un composant double dropdown (classe + matière) avec option « Toutes ». [Source: src/components/templates/class-selector-dropdown.tsx:1]
  - [ ] Propager les callbacks au context et afficher compteurs/classes/matières valides. [Source: src/shared/hooks/use-smart-filtering.ts:74]
- [ ] Afficher le badge de contexte (AC: 1,5)
  - [ ] Mettre à jour `SiteHeader` pour montrer le badge « Classe – Matière » et indiquer l’état global. [Source: src/components/templates/site-header.tsx:1]
  - [ ] Ajouter une version condensée pour mobile/Sidebar. [Source: docs/PRD.md:717]
- [ ] Propager les filtres aux pages (AC: 4,6-7)
  - [ ] Mettre à jour Sessions, Mes Élèves, Évaluations, Appréciations pour consommer `selectedSubjectId` et gérer l’état « Toutes matières ». [Source: src/app/dashboard/sessions/page.tsx:17; src/app/dashboard/mes-eleves/page.tsx:10; src/app/dashboard/evaluations/page.tsx:16; src/app/dashboard/appreciations/page.tsx:34]
  - [ ] Ajuster les hooks métiers (`useSessionManagement`, `useExamManagement`, etc.) pour filtrer selon classe/matière quand pertinent. [Source: src/features/sessions/hooks/use-session-management.ts:10; src/features/evaluations/index.ts]
- [ ] Tests & documentation (AC: 1-7)
  - [ ] Vérifier via checklist Epic 5 (persistance, filtrage pages, options « Toutes ») et consigner les résultats. [Source: docs/epics.md:652]
  - [ ] Mettre à jour Dev Agent Record et exécuter le workflow `story-context` après validation. [Source: bmad/bmm/workflows/4-implementation/create-story/instructions.md:74]
<!-- tasks_subtasks:end -->

<!-- dev_notes_with_citations:start -->
## Dev Notes

- Réutiliser `useSmartFiltering` au niveau du context pour rendre disponibles `availableClasses`/`availableSubjects` sans dupliquer la logique de compatibilité. [Source: src/shared/hooks/use-smart-filtering.ts:26]
- Prévoir une valeur spéciale (ex: `null` ou `all`) pour représenter les options « Toutes » et l’exposer dans les hooks consommateurs. [Source: docs/epics.md:658]
- Ajouter des tests unitaires simples sur le context (sélection/persistance) et vérifier que les pages n’émettent plus de `Sélectionnez une classe` quand une classe est mémorisée. [Source: src/app/dashboard/sessions/page.tsx:58]
- Documenter l’API du context dans `contexts/` afin d’éviter les usages hors Provider. [Source: docs/solution-architecture.md:1168]

### Project Structure Notes

- Les adaptations context restent dans `src/contexts/class-selection-context.tsx`; toute nouvelle logique d’assignation devrait vivre sous `src/utils/teaching-assignment-filters.ts`. [Source: docs/solution-architecture.md:2672]
- Les composants UI supplémentaires pour la matière (menus, badges) doivent être ajoutés dans `src/components/templates/` ou `src/components/organisms/` selon leur rôle. [Source: docs/solution-architecture.md:2547]

### References

- docs/epics.md
- docs/PRD.md
- docs/solution-architecture.md
- src/contexts/class-selection-context.tsx
- src/components/templates/class-selector-dropdown.tsx
- src/components/templates/site-header.tsx
- src/shared/hooks/use-smart-filtering.ts
- src/app/dashboard/sessions/page.tsx
- src/app/dashboard/mes-eleves/page.tsx
- src/app/dashboard/evaluations/page.tsx
- src/app/dashboard/appreciations/page.tsx
- src/features/sessions/hooks/use-session-management.ts
- docs/stories/story-4.4.md
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

- 2025-10-18 – Story 5.2 initial draft (assistant).

### File List

- docs/stories/story-5.2.md
<!-- change_log:end -->
