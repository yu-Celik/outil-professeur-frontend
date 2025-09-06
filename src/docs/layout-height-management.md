# Gestion de la hauteur dans le layout dashboard

Guide pour créer des pages qui utilisent toute la hauteur disponible sans débordement dans le système de layout dashboard.

## Architecture du layout

Le layout dashboard utilise une structure complexe avec plusieurs niveaux d'imbrication :

```tsx
<SidebarProvider>
  <AppSidebar />
  <SidebarInset>
    <SiteHeader />                 // --header-height
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <div className="px-4 lg:px-6">
            {children}               // Votre page ici
          </div>
        </div>
      </div>
    </div>
  </SidebarInset>
</SidebarProvider>
```

## Espaces à prendre en compte

### 1. Header du layout
- Hauteur définie par `--header-height` (CSS custom property)
- Valeur : `calc(var(--spacing) * 12)`

### 2. Padding du conteneur parent
- `py-4 md:py-6` : Padding vertical du conteneur des pages
- `px-4 lg:px-6` : Padding horizontal du conteneur des pages

### 3. Marge du SidebarInset
- `md:peer-data-[variant=inset]:m-2` : Marge de 0.5rem sur tous les côtés
- Impact vertical : 0.5rem (top) + 0.5rem (bottom) = 1rem total

## Solution pour pages pleine hauteur

### Approche recommandée

```tsx
export default function MaPage() {
  return (
    <div className="flex flex-col min-h-0 -m-4 md:-m-6 h-[calc(100vh-var(--header-height)-1rem)] overflow-hidden">
      {/* En-tête de page */}
      <div className="p-4 border-b border-border/50 flex-shrink-0">
        <h1>Titre de la page</h1>
      </div>

      {/* Contenu principal avec scroll */}
      <div className="flex flex-1 min-h-0">
        {/* Colonnes avec overflow-y-auto */}
        <div className="flex-1 overflow-y-auto">
          {/* Contenu scrollable */}
        </div>
      </div>
    </div>
  );
}
```

### Explication des classes

#### Conteneur principal
- `flex flex-col` : Layout flexbox vertical
- `min-h-0` : Permet aux enfants flex de réduire leur taille
- `overflow-hidden` : Évite les débordements au niveau racine

#### Annulation des marges parent
- `-m-4 md:-m-6` : Annule le padding du conteneur parent
  - `-m-4` correspond à `py-4` et `px-4`
  - `md:-m-6` correspond à `md:py-6` et `lg:px-6`

#### Calcul de hauteur
- `h-[calc(100vh-var(--header-height)-1rem)]`
  - `100vh` : Hauteur totale de la viewport
  - `-var(--header-height)` : Moins la hauteur du header
  - `-1rem` : Moins la marge verticale du SidebarInset (m-2)

#### Structure de contenu
- `flex-shrink-0` : L'en-tête ne se réduit pas
- `flex-1 min-h-0` : Le contenu prend l'espace restant
- `overflow-y-auto` : Scroll vertical quand nécessaire

## Exemple complet : Page mes-élèves

```tsx
export default function MesElevesPage() {
  return (
    <div className="flex flex-col min-h-0 -m-4 md:-m-6 h-[calc(100vh-var(--header-height)-1rem)] overflow-hidden">
      {/* En-tête optimisé */}
      <div className="p-4 border-b border-border/50 flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10">
            <Users className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground">Mes élèves</h1>
            <p className="text-muted-foreground text-sm">
              Profils et historique de vos élèves
            </p>
          </div>
        </div>
      </div>

      {/* Layout principal à 3 colonnes */}
      <div className="flex flex-1 min-h-0">
        {/* Sidebar des classes */}
        <div className="w-64 border-r border-border/50 flex flex-col">
          <div className="px-6 py-4 flex-shrink-0">
            <h3>Mes Classes</h3>
          </div>
          <div className="flex-1 p-4 overflow-y-auto min-h-0">
            {/* Liste des classes scrollable */}
          </div>
        </div>

        {/* Zone d'affichage des élèves */}
        <div className="flex-1 flex flex-col min-w-0">
          <div className="flex-1 overflow-y-auto min-h-0 p-4">
            {/* Liste des élèves scrollable */}
          </div>
        </div>

        {/* Panneau latéral (optionnel) */}
        {showPanel && (
          <div className="w-96 border-l border-border/50">
            {/* Contenu du panneau */}
          </div>
        )}
      </div>
    </div>
  );
}
```

## Bonnes pratiques

### ✅ À faire
- Utiliser `min-h-0` sur les conteneurs flex pour permettre le shrinking
- Placer `overflow-y-auto` sur les zones de contenu, pas le conteneur principal
- Utiliser `flex-shrink-0` pour les en-têtes et éléments fixes
- Annuler les marges parent avec `-m-4 md:-m-6`

### ❌ À éviter
- `h-screen` ou `h-full` seuls (ne prennent pas en compte les marges)
- `overflow-y-auto` sur le conteneur principal (empêche le layout flex)
- Oublier `min-h-0` sur les conteneurs flex parents
- Calculer manuellement les hauteurs sans tenir compte du SidebarInset

## Débogage

### Problème : Mini scroll résiduel
**Cause** : Marge du SidebarInset non prise en compte
**Solution** : Ajouter `-1rem` au calcul de hauteur

### Problème : Contenu coupé
**Cause** : `overflow-hidden` mal placé ou `min-h-0` manquant
**Solution** : Vérifier la structure flex et les classes de débordement

### Problème : Layout qui ne remplit pas l'écran
**Cause** : Marges parent non annulées
**Solution** : Utiliser `-m-4 md:-m-6` pour annuler le padding

## Variables CSS disponibles

- `--header-height` : Hauteur du header (définie dans le layout)
- `--sidebar-width` : Largeur de la sidebar (définie dans le layout)