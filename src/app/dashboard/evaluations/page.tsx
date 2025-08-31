export default function EvaluationsPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Évaluations</h1>
          <p className="text-muted-foreground">
            Créez et gérez vos contrôles et examens
          </p>
        </div>
        <button
          type="button"
          className="bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md"
        >
          + Nouvelle évaluation
        </button>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
          <div className="flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="tracking-tight text-sm font-medium">
              Total évaluations
            </h3>
          </div>
          <div className="text-2xl font-bold">0</div>
          <p className="text-xs text-muted-foreground">créées</p>
        </div>

        <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
          <div className="flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="tracking-tight text-sm font-medium">En attente</h3>
          </div>
          <div className="text-2xl font-bold">0</div>
          <p className="text-xs text-muted-foreground">à corriger</p>
        </div>

        <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
          <div className="flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="tracking-tight text-sm font-medium">Corrigées</h3>
          </div>
          <div className="text-2xl font-bold">0</div>
          <p className="text-xs text-muted-foreground">terminées</p>
        </div>

        <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
          <div className="flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="tracking-tight text-sm font-medium">
              Moyenne classe
            </h3>
          </div>
          <div className="text-2xl font-bold">-</div>
          <p className="text-xs text-muted-foreground">sur 20</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="md:col-span-2">
          <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Évaluations récentes</h3>
                <div className="flex gap-2">
                  <select className="px-3 py-1 border rounded-md text-sm">
                    <option>Toutes les matières</option>
                    <option>Mathématiques</option>
                  </select>
                  <select className="px-3 py-1 border rounded-md text-sm">
                    <option>Tous les statuts</option>
                    <option>En attente</option>
                    <option>Corrigées</option>
                  </select>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-center p-8 text-center text-muted-foreground">
                  <div>
                    <div className="text-4xl mb-4">📝</div>
                    <h4 className="text-lg font-medium mb-2">
                      Aucune évaluation
                    </h4>
                    <p className="text-sm">
                      Créez votre première évaluation pour vos élèves
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
            <h3 className="text-lg font-semibold mb-4">Actions rapides</h3>
            <div className="space-y-2">
              <button
                type="button"
                className="w-full text-left p-2 rounded hover:bg-muted"
              >
                + Créer un contrôle
              </button>
              <button
                type="button"
                className="w-full text-left p-2 rounded hover:bg-muted"
              >
                📊 Créer un examen
              </button>
              <button
                type="button"
                className="w-full text-left p-2 rounded hover:bg-muted"
              >
                📋 Quiz rapide
              </button>
              <button
                type="button"
                className="w-full text-left p-2 rounded hover:bg-muted"
              >
                📈 Voir les statistiques
              </button>
            </div>
          </div>

          <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
            <h3 className="text-lg font-semibold mb-4">Prochaines échéances</h3>
            <div className="space-y-3">
              <div className="text-center text-muted-foreground py-2">
                <p className="text-sm">Aucune échéance</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
        <div className="p-6">
          <h3 className="text-lg font-semibold mb-4">Types d'évaluations</h3>
          <div className="grid gap-4 md:grid-cols-4">
            <div className="p-4 rounded-lg border-2 border-dashed border-chart-1/30 text-center cursor-pointer hover:border-chart-1/50">
              <div className="text-2xl mb-2">📝</div>
              <h4 className="font-medium">Contrôle écrit</h4>
              <p className="text-xs text-muted-foreground">
                Évaluation traditionnelle
              </p>
            </div>
            <div className="p-4 rounded-lg border-2 border-dashed border-chart-3/30 text-center cursor-pointer hover:border-chart-3/50">
              <div className="text-2xl mb-2">💻</div>
              <h4 className="font-medium">Quiz en ligne</h4>
              <p className="text-xs text-muted-foreground">
                Évaluation interactive
              </p>
            </div>
            <div className="p-4 rounded-lg border-2 border-dashed border-chart-2/30 text-center cursor-pointer hover:border-chart-2/50">
              <div className="text-2xl mb-2">👥</div>
              <h4 className="font-medium">Présentation</h4>
              <p className="text-xs text-muted-foreground">Évaluation orale</p>
            </div>
            <div className="p-4 rounded-lg border-2 border-dashed border-chart-4/30 text-center cursor-pointer hover:border-chart-4/50">
              <div className="text-2xl mb-2">📁</div>
              <h4 className="font-medium">Projet</h4>
              <p className="text-xs text-muted-foreground">
                Travail à long terme
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
