# Intégration du Contexte Académique - Guide Complet

## 🎯 Objectif

Rendre la période académique active accessible partout dans le dashboard pour filtrer automatiquement les données (sessions, analytics, évaluations, etc.) par période.

## ✅ Ce qui a été fait

### 1. Context Provider installé dans le Layout

**Fichier**: `src/app/dashboard/layout.tsx`

```tsx
import { AcademicContextProvider } from "@/features/gestion";

export default async function DashboardLayout({ children }) {
  return (
    <PageTitleProvider>
      <AcademicContextProvider useMockData={true}>
        {/* Toutes les pages du dashboard ont maintenant accès au contexte */}
        <ClassSelectionProvider>
          {children}
        </ClassSelectionProvider>
      </AcademicContextProvider>
    </PageTitleProvider>
  );
}
```

**Impact**: TOUTES les pages sous `/dashboard/*` peuvent maintenant utiliser `useAcademicContext()`.

### 2. Badge de période active dans le Header

**Fichier**: `src/components/molecules/active-period-badge.tsx`

Affiche en temps réel :
- Le nom de la période active
- Les dates (format court : "1 sept. - 20 déc.")
- État de chargement
- Gestion des cas "pas de période active"

**Fichier**: `src/components/templates/site-header.tsx`

Le badge est affiché dans le coin droit du header, visible sur toutes les pages.

## 📱 Résultat Visuel

```
┌─────────────────────────────────────────────────────────┐
│ ☰ | Mes Élèves              [Trimestre 1 • 1 sept. - 20 déc.]│
└─────────────────────────────────────────────────────────┘
     ↑                                    ↑
  Sidebar                         Badge période active
  trigger
```

## 🔧 Comment l'utiliser dans une page

### Exemple 1: Afficher la période dans une page

```tsx
// src/app/dashboard/mes-eleves/page.tsx
"use client";

import { useAcademicContext } from "@/features/gestion";

export default function StudentsPage() {
  const { activePeriod, activeSchoolYear } = useAcademicContext();

  return (
    <div>
      <h1>Mes Élèves</h1>
      {activePeriod && (
        <p className="text-sm text-muted-foreground">
          Période: {activePeriod.name} ({formatDate(activePeriod.startDate)} - {formatDate(activePeriod.endDate)})
        </p>
      )}
      {/* ... */}
    </div>
  );
}
```

### Exemple 2: Filtrer des données par période

```tsx
"use client";

import { useAcademicContext } from "@/features/gestion";

export default function SessionsPage() {
  const { activePeriod } = useAcademicContext();
  const { sessions } = useCourseSessions();

  // Filtrer automatiquement par période active
  const filteredSessions = sessions.filter(session =>
    activePeriod?.contains(session.sessionDate)
  );

  return (
    <div>
      <h1>Sessions</h1>
      <p>{filteredSessions.length} sessions pour {activePeriod?.name}</p>
      {/* Afficher les sessions filtrées */}
    </div>
  );
}
```

### Exemple 3: Calculer des analytics pour la période active

```tsx
"use client";

import { useAcademicContext } from "@/features/gestion";

export default function StudentProfile({ studentId }: { studentId: string }) {
  const { activePeriod } = useAcademicContext();

  // API automatiquement filtrée par période
  const { data: attendance } = useAttendanceRate(studentId, {
    startDate: activePeriod?.startDate.toISOString(),
    endDate: activePeriod?.endDate.toISOString(),
  });

  const { data: participation } = useParticipationAverage(studentId, {
    startDate: activePeriod?.startDate.toISOString(),
    endDate: activePeriod?.endDate.toISOString(),
  });

  return (
    <div>
      <h2>Analytics pour {activePeriod?.name}</h2>
      <div>Présence: {attendance?.attendance_rate}%</div>
      <div>Participation: {participation?.participation_average}/5</div>
    </div>
  );
}
```

## 🎛️ Changer la période active

### Option 1: Via les Réglages (UI)

1. Aller dans **Paramètres > Années scolaires**
2. Cliquer **"Gérer les périodes"** pour l'année active
3. Cliquer **"Activer"** sur la période désirée
4. ✅ Toutes les pages se mettent à jour automatiquement

### Option 2: Programmatiquement

```tsx
import { useAcademicContext } from "@/features/gestion";

function PeriodSelector() {
  const { periods, activePeriod, setActivePeriod } = useAcademicContext();

  return (
    <select
      value={activePeriod?.id}
      onChange={(e) => setActivePeriod(e.target.value)}
    >
      {periods.map(period => (
        <option key={period.id} value={period.id}>
          {period.name}
        </option>
      ))}
    </select>
  );
}
```

## 🔄 Flux de données

```
┌──────────────────────────────────────┐
│  AcademicContextProvider             │
│  (dans dashboard/layout.tsx)         │
│                                      │
│  1. Charge années/périodes via API   │
│  2. Identifie période active         │
│  3. Expose via Context               │
└────────────┬─────────────────────────┘
             │
             │ useAcademicContext()
             │
    ┌────────┴────────┬────────────┬────────────┐
    │                 │            │            │
┌───▼───┐      ┌─────▼─────┐  ┌──▼───┐   ┌────▼─────┐
│Header │      │ Mes Élèves│  │ Eval │   │Calendrier│
│Badge  │      │   Page    │  │ Page │   │  Page    │
└───────┘      └───────────┘  └──────┘   └──────────┘
    │                 │            │            │
    └─────────────────┴────────────┴────────────┘
              Tous affichent/filtrent
              par la MÊME période active
```

## 🧪 Tester l'intégration

### Test Manuel Simple

1. **Démarrer l'app**: `npm run dev`
2. **Se connecter** au dashboard
3. **Vérifier le header**: Tu devrais voir le badge avec "Trimestre 1 • ..." (ou autre période)
4. **Aller dans Réglages > Années scolaires**
5. **Gérer les périodes** et **activer Trimestre 2**
6. **Revenir à l'accueil**: Le badge devrait afficher "Trimestre 2 • ..."

### Test avec Console DevTools

```javascript
// Dans la console du navigateur (F12)
// Sur n'importe quelle page du dashboard

// Vérifier que le context est chargé
window.__ACADEMIC_CONTEXT__ = true; // (pas implémenté, juste pour debug)

// Ou ajouter temporairement dans une page :
const { activePeriod } = useAcademicContext();
console.log("Période active:", activePeriod);
```

## 📊 État Actuel

✅ **Provider installé** dans `dashboard/layout.tsx`
✅ **Badge visible** dans le header de toutes les pages
✅ **Hook accessible** partout dans le dashboard
✅ **Données mockées** (`useMockData={true}`)

⏳ **À faire plus tard** :
- Passer à `useMockData={false}` quand le backend Souz est prêt
- Récupérer le `teacherId` depuis `useUserSession()`
- Ajouter persistance de la période active (localStorage ?)

## 🚀 Prochaines Étapes

### 1. Intégration dans les Features Existantes

**Mes Élèves** - Filtrer les analytics par période active
**Calendrier** - Afficher uniquement les sessions de la période
**Évaluations** - Filtrer les examens par période
**Sessions** - Filtrer les sessions complétées

### 2. Migration vers Souz API

Quand le backend est prêt :
```tsx
// dashboard/layout.tsx
<AcademicContextProvider
  teacherId={user?.id}
  useMockData={false}  // ← Changer ici
>
```

### 3. Optimisations

- Cache des périodes (React Query ?)
- Persistance dans localStorage
- Préchargement au login

## 📚 Documentation Complète

- **Guide d'utilisation**: [src/features/gestion/docs/academic-context-usage.md](../src/features/gestion/docs/academic-context-usage.md)
- **Tests Playwright**: [docs/tests/academic-period-propagation.test-spec.md](./tests/academic-period-propagation.test-spec.md)
- **QA Manuel**: [docs/tests/story-1.2-qa-manual.md](./tests/story-1.2-qa-manual.md)
- **Story 1.2**: [docs/stories/story-1.2.md](./stories/story-1.2.md)

## ❓ Questions Fréquentes

**Q: Pourquoi `useMockData={true}` ?**
R: Pour pouvoir tester sans avoir le backend Souz démarré. Passer à `false` en production.

**Q: Le badge ne s'affiche pas ?**
R: Vérifier que le provider est bien dans le layout et que tu es connecté.

**Q: Comment ajouter une nouvelle page qui utilise le context ?**
R: Juste importer et utiliser `useAcademicContext()` - c'est tout !

**Q: La période active persiste après refresh ?**
R: Actuellement non. À implémenter avec localStorage si nécessaire.

---

**Créé le**: 2025-10-18
**Story**: 1.2 - Configurer les années scolaires et périodes
**Status**: ✅ Intégré et fonctionnel
