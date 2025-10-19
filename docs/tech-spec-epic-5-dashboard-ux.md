# Technical Specification: Epic 5 - Dashboard & UX

**Project:** outil-professor
**Epic:** Epic 5 - Dashboard, Expérience Utilisateur et Fiabilité
**Timeline:** Transversal Sprint 1-9 + Sprint 10 polish (1-2 semaines finales)
**Stories:** 6 user stories
**Priority:** MOYENNE initialement, CRITIQUE en fin de projet

---

## Table of Contents

1. [Epic Overview](#epic-overview)
2. [User Stories](#user-stories)
3. [Architecture Components](#architecture-components)
4. [Frontend Components](#frontend-components)
5. [Stratégie UI & Intégration API](#stratégie-ui--intégration-api)
6. [Implementation Guide](#implementation-guide)
7. [Performance Optimization](#performance-optimization)
8. [Testing Approach](#testing-approach)

---

## Epic Overview

### Objective

Construire l'interface unifiée (dashboard), garantir une expérience utilisateur fluide et cohérente à travers toute l'application, et implémenter les mécanismes de fiabilité mission-critical (auto-save, backup, récupération).

### Success Criteria

- ✅ Dashboard charge en < 2 secondes avec toutes statistiques
- ✅ Navigation entre pages < 300ms (perception instantanée)
- ✅ Sélection contexte fonctionne, filtrage automatique à travers app
- ✅ 0 perte de données pendant tout trimestre MVP (RPO=0 validé)
- ✅ Export backup hebdomadaire automatique fonctionne, récupération testée
- ✅ NPS utilisatrice ≥ 40 après premier trimestre complet d'utilisation

### Value Delivered

Point d'entrée unique et intuitif pour toute l'application. Expérience fluide et efficace alignée sur les 10 UX principles. Confiance absolue dans la persistance et sécurité des données. Adoption facilitée par design centré utilisateur non-technique.

---

## User Stories

### Story 5.1: Tableau de Bord Enseignant

**En tant qu'** enseignante,
**Je veux** accéder à un tableau de bord central avec vue d'ensemble,
**Afin de** démarrer ma journée et accéder rapidement aux actions importantes.

**Critères d'acceptation:**
1. Après login, redirection automatique vers Dashboard
2. Header dashboard : Message personnalisé "Bonjour Marie, bienvenue sur outil-professor"
3. Widget "Sessions Aujourd'hui" : Liste sessions du jour avec heure, classe, matière, statut
4. Widget "Sessions À Venir Cette Semaine" : Prochaines 5 sessions avec dates
5. Widget "Alertes" : Badge compteur + liste élèves nécessitant attention
6. Widget "Statistiques Rapides" : Taux présence moyen semaine, nombre examens à corriger, rapports en attente
7. Widget "Accès Rapides" : Boutons vers actions fréquentes (Saisir présences, Créer session, Voir calendrier, Générer rapports)
8. Chargement dashboard complet en < 2 secondes (NFR)

---

### Story 5.2: Sélection Contexte Classe/Matière Globale

**En tant qu'** enseignante,
**Je veux** sélectionner un contexte classe/matière actif qui filtre toute l'application,
**Afin de** me concentrer sur un groupe spécifique sans naviguer constamment.

**Critères d'acceptation:**
1. Header application affiche ClassSelectorDropdown toujours visible
2. Dropdown double : Classe (dropdown 1) + Matière (dropdown 2 filtré selon classe)
3. Sélection persiste entre sessions (localStorage)
4. Changement contexte recharge données filtrées dans page actuelle
5. Pages concernées auto-filtrées : Sessions, Présences, Examens, Élèves de la classe
6. Indicateur visuel contexte actif : badge dans header "5ème A - Anglais"
7. Option "Toutes classes" désactive filtre (vue globale)

---

### Story 5.3: Navigation Fluide et Breadcrumb

**En tant qu'** enseignante,
**Je veux** naviguer facilement entre pages et savoir où je suis,
**Afin de** ne jamais me perdre dans l'application.

**Critères d'acceptation:**
1. Sidebar gauche toujours visible avec sections : Accueil, Calendrier, Sessions, Mes Élèves, Évaluations, Appréciations, Gestion, Paramètres
2. Item menu actif visuellement distinct (couleur primaire, fond)
3. Breadcrumb en haut de page : Dashboard > Sessions > Session du 15/11 > Présences
4. Breadcrumb cliquable pour navigation rapide niveau supérieur
5. Navigation page ≤ 300ms (perception instantanée - NFR)
6. Transition fade subtile entre pages pour fluidité
7. Raccourcis clavier : Alt+1 Dashboard, Alt+2 Calendrier, Alt+3 Sessions, etc.

---

### Story 5.4: Export et Sauvegarde Manuelle Données

**En tant qu'** enseignante,
**Je veux** exporter et sauvegarder manuellement toutes mes données,
**Afin de** créer des backups de sécurité et éviter perte de données.

**Critères d'acceptation:**
1. Page "Paramètres > Sauvegarde et Export"
2. Section "Export Complet" : Bouton "Exporter toutes les données (JSON)" télécharge archive complète
3. Archive contient : classes, élèves, sessions, présences, examens, résultats, appréciations en JSON structuré
4. Nom fichier : `outil-professor-backup-2024-11-15.zip`
5. Section "Export Sélectif" : Checkboxes par type données, bouton "Exporter sélection"
6. Section "Historique Exports" : Liste 10 derniers exports avec date, taille, bouton re-télécharger
7. Confirmation post-export : "Backup créé avec succès : 245 KB, 1500 enregistrements"

---

### Story 5.5: Sauvegarde Automatique et Récupération (Mission-Critical)

**En tant qu'** enseignante,
**Je veux** que mes données soient sauvegardées automatiquement sans action de ma part,
**Afin de** ne jamais perdre mon travail même en cas de crash.

**Critères d'acceptation:**
1. Auto-save toutes les 15 minutes en arrière-plan (silencieux)
2. Indicateur header : "Dernière sauvegarde : il y a 3 minutes" (mise à jour dynamique)
3. Lors saisie formulaires (présences, notes), auto-save toutes les 10 secondes
4. En cas échec auto-save, notification alerte : "⚠️ Échec sauvegarde, vérifiez connexion" + retry automatique
5. Backup hebdomadaire automatique (dimanche 2h du matin si app ouverte, ou au prochain démarrage)
6. Page "Paramètres > Sauvegardes Auto" : Liste backups auto avec dates, bouton restaurer
7. **RPO = 0** : Aucune donnée perdue validée (auto-save immédiat après action critique)
8. **RTO < 5 minutes** : Récupération depuis backup testée et fonctionnelle en < 5min

---

### Story 5.6: Performance et Optimisation

**En tant qu'** enseignante,
**Je veux** que l'application soit rapide et fluide à tout moment,
**Afin de** ne pas perdre de temps à attendre les chargements.

**Critères d'acceptation:**
1. Temps chargement initial application ≤ 2 secondes (NFR)
2. Navigation entre pages ≤ 300ms (NFR)
3. Saisie présences 30 élèves complétée en ≤ 2 minutes (objectif UX - NFR)
4. Génération rapport bihebdomadaire ≤ 10 secondes par élève (NFR)
5. Génération appréciation trimestrielle ≤ 15 secondes par élève (NFR)
6. Skeleton loading pour opérations longues (génération rapports)
7. Optimistic UI : actions apparaissent instantanées (confirmation backend async)
8. Bundle frontend initial ≤ 500KB gzipped (NFR)

---

## Architecture Components

### Feature Module: `accueil`

```
/src/features/accueil/
├── hooks/
│   └── use-dashboard-data.ts        # Dashboard data aggregation
├── api/
│   └── dashboard-client.ts          # Aggregates /course-sessions, /exams, /students
└── index.ts
```

### Global Services

```
/src/services/
├── backup-service.ts                # Manual and auto backup
└── performance-monitor.ts           # Performance tracking
```

### Shared Infrastructure

```
/src/contexts/
└── class-selection-context.tsx      # Global class/subject context

/src/shared/hooks/
├── use-page-title.tsx              # Centralized page titles
├── use-mobile.ts                   # Responsive utilities
└── use-async-operation.ts          # Async state management
```

---

## Frontend Components

### Templates & layout existants
- `app-sidebar`, `site-header`, `nav-main`, `nav-user`, `class-selector-dropdown` (`@/components/templates`) — structure navigation principale

### Organismes & widgets réutilisables
- `OnboardingBanner`, `ClassesStudentsCard`, `CalendarWidget`, `ChatAI`, `UpcomingCoursesWidget` (`@/components/organisms`) — contenu dashboard accueil
- `SessionsTimeline`, `SessionsList`, `StudentMetricsCards`, `StudentAnalysisPanel` (`@/components/organisms`) — widgets spécialisés à intégrer
### Hooks & contextes clés
- `useDashboardData` (`@/features/accueil`) — agrégation des données dashboard
- `useClassSelection`, `useUserSession` — contexte global classe/enseignant
- `useSessionManagement`, `useExamManagement`, `useStudentAnalytics` — alimentent KPI
- `useSetPageTitle`, `useModal`, `useAsyncOperation` — cohérence UX

---

## Stratégie UI & Intégration API

1. **Agrégation côté front**  
   - `useDashboardData` interroge `GET /course-sessions?date=...` pour les sessions du jour et `GET /course-sessions?from=...&to=...` pour la semaine.  
   - `GET /exams?is_published=false&class_id=...` fournit les examens à corriger.  
   - `GET /students?class_id=...` puis `GET /students/{id}/profile`/`attendance-rate` permettent d'identifier les élèves en alerte.  
   - Utiliser `Promise.all` + normalisation pour limiter les requêtes.

2. **Contexte classe/matière**  
   - Filtrer toutes les requêtes en fonction de `selectedClassId` (ou vue globale).  
   - Mettre à jour `class-selector-dropdown` pour refléter l'état (badge, shortcuts).

3. **Widgets existants avant création**  
   - Réutiliser `ClassesStudentsCard` (statistiques classes/élèves), `CalendarWidget` (sessions du jour), `ChatAI` (assist IA).  
   - Compléter avec des `Card` + `DataTable` pour statistiques supplémentaires si nécessaire.

4. **Fiabilité & sauvegarde**  
   - Surface `auto-save` via `useAsyncOperation` + toasts (statut global).  
   - Rappeler l’export manuel disponible dans `Réglages > Sauvegarde` tant qu’aucun endpoint dédié n’est exposé.

5. **Accessibilité & performance**  
   - Optimiser chargement initial (<2s) avec data prefetch (Next.js route actions) et skeletons existants.  
   - Centraliser les raccourcis clavier via un hook dédié.

---

## Implementation Guide

### Phase 1: Data orchestration (Sem. 1)
1. Étendre `useDashboardData` pour faire appel à `GET /course-sessions`, `GET /exams`, `GET /students`.  
2. Normaliser la réponse (sessionsToday, upcomingSessions, alertStudents, pendingExams, pendingReports).  
3. Exposer `isLoading`, `error`, `refresh`.

### Phase 2: Assemblage UI (Sem. 1)
1. Composer `src/app/dashboard/accueil/page.tsx` avec `OnboardingBanner`, `ClassesStudentsCard`, `CalendarWidget`, `ChatAI`, `UpcomingCoursesWidget`.  
2. Ajouter un bandeau KPI (présence moyenne, examens à corriger) via `Card` + données `useDashboardData`.  
3. Gérer états vides / loading via skeletons existants.

### Phase 3: Navigation & UX (Sem. 2)
1. `site-header` : intégrer `AutoSaveIndicator` (statut global) + raccourcis.  
2. `app-sidebar` : activer les raccourcis `Alt+1..7` et état actif.  
3. Implémenter breadcrumb dynamique via App Router (utiliser segments).

### Phase 4: Fiabilité & backup (Sem. 2)
1. Ajouter un rappel hebdomadaire dans le dashboard pour lancer `exportAllData()` côté front jusqu’à disponibilité d’un endpoint dédié.  
2. Stocker l'historique d'exports côté UI (ex: localStorage) et l’afficher dans `Réglages`.  
3. Instrumenter temps de chargement (Performance API) + logs console en dev.

---

## Performance Optimization

### Critical Performance Targets

| Metric | Target | Measurement |
|--------|--------|-------------|
| Initial Load | < 2s | Time to Interactive (TTI) |
| Page Navigation | < 300ms | Route transition time |
| Dashboard Load | < 2s | All widgets loaded |
| Attendance Entry | < 2min for 30 students | Manual timing |
| Report Generation | < 10s/student | Backend timing |

### Optimization Strategies

**1. Server-Side Rendering (SSR)**
- Use Server Components for static content
- Fetch data on server when possible
- Reduce client-side JavaScript

**2. Code Splitting**
- Lazy load routes
- Lazy load heavy components (charts, editors)
- Use dynamic imports

**3. Image Optimization**
- Use next/image for automatic optimization
- Serve WebP format
- Lazy load images below fold

**4. Caching**
- Cache API responses (5 min stale-while-revalidate)
- Cache static assets (1 year)
- Use React Query for server state caching

**5. Bundle Optimization**
- Tree-shake unused code
- Minimize dependencies
- Use Turbopack for faster builds

---

## Testing Approach

### Manual Testing Checklist

**Story 5.1: Dashboard**
- [ ] Dashboard loads in < 2s
- [ ] All widgets display correctly
- [ ] Today's sessions accurate
- [ ] Alerts count correct
- [ ] Quick actions work

**Story 5.2: Context Selection**
- [ ] Can select class
- [ ] Can select subject
- [ ] Selection persists after refresh
- [ ] Pages filter correctly
- [ ] Indicator shows selected context

**Story 5.3: Navigation**
- [ ] All menu items work
- [ ] Active item highlighted
- [ ] Breadcrumb displays correctly
- [ ] Navigation < 300ms
- [ ] Keyboard shortcuts work

**Story 5.4: Manual Backup**
- [ ] Full export downloads
- [ ] Selective export works
- [ ] ZIP contains correct data
- [ ] History shows exports

**Story 5.5: Auto-Save**
- [ ] Auto-save triggers every 10s
- [ ] Indicator shows status
- [ ] Error retry works
- [ ] Weekly backup creates

**Story 5.6: Performance**
- [ ] Initial load < 2s
- [ ] Navigation < 300ms
- [ ] No janky animations
- [ ] Smooth scrolling

### Performance Testing

**Lighthouse Audit Targets:**
- Performance: ≥ 90
- Accessibility: ≥ 95
- Best Practices: ≥ 95
- SEO: ≥ 90

**Core Web Vitals:**
- LCP (Largest Contentful Paint): < 2.5s
- FID (First Input Delay): < 100ms
- CLS (Cumulative Layout Shift): < 0.1

---

## Dependencies

### NPM Packages
```json
{
  "date-fns": "^2.30.0",
  "jszip": "^3.10.1"
}
```

---

## Notes

**Critical Path:**
Dashboard → Context Selection → Navigation → Auto-Save → Performance

**Transversal Work:**
This epic spans all sprints - implement incrementally:
- Sprint 1-2: Navigation and context
- Sprint 3-4: Dashboard basics
- Sprint 5-6: Auto-save
- Sprint 7-9: Advanced dashboard widgets
- Sprint 10: Performance polish

**Performance Critical:**
- Dashboard must load fast (first impression)
- Navigation must feel instant
- Auto-save must be reliable (zero data loss)

---

**Document Status:** ✅ Ready for Implementation
**Generated:** 2025-10-14
**Epic Timeline:** Transversal + Sprint 10 (1-2 weeks polish)
