export default function MesElevesPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Mes élèves</h1>
          <p className="text-muted-foreground">
            Gérez vos élèves et suivez leur progression
          </p>
        </div>
        <button className="bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md">
          + Ajouter un élève
        </button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
          <div className="flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="tracking-tight text-sm font-medium">Total élèves</h3>
          </div>
          <div className="text-2xl font-bold">0</div>
          <p className="text-xs text-muted-foreground">élèves inscrits</p>
        </div>

        <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
          <div className="flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="tracking-tight text-sm font-medium">
              Présents aujourd'hui
            </h3>
          </div>
          <div className="text-2xl font-bold">0</div>
          <p className="text-xs text-muted-foreground">taux de présence</p>
        </div>

        <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
          <div className="flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="tracking-tight text-sm font-medium">
              Moyenne générale
            </h3>
          </div>
          <div className="text-2xl font-bold">-</div>
          <p className="text-xs text-muted-foreground">sur 20</p>
        </div>
      </div>

      <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Liste des élèves</h3>
            <div className="flex gap-2">
              <input
                type="search"
                placeholder="Rechercher un élève..."
                className="px-3 py-1 border rounded-md text-sm"
              />
              <select className="px-3 py-1 border rounded-md text-sm">
                <option>Tous les cours</option>
                <option>Mathématiques</option>
              </select>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-center p-8 text-center text-muted-foreground">
              <div>
                <div className="text-4xl mb-4">👥</div>
                <h4 className="text-lg font-medium mb-2">
                  Aucun élève pour le moment
                </h4>
                <p className="text-sm">
                  Ajoutez des élèves pour commencer à suivre leur progression
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
          <h3 className="text-lg font-semibold mb-4">Actions rapides</h3>
          <div className="space-y-2">
            <button className="w-full text-left p-2 rounded hover:bg-muted">
              + Ajouter un élève
            </button>
            <button className="w-full text-left p-2 rounded hover:bg-muted">
              📊 Voir les performances
            </button>
            <button className="w-full text-left p-2 rounded hover:bg-muted">
              📧 Envoyer un message
            </button>
            <button className="w-full text-left p-2 rounded hover:bg-muted">
              📋 Prendre les présences
            </button>
          </div>
        </div>

        <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
          <h3 className="text-lg font-semibold mb-4">Activités récentes</h3>
          <div className="space-y-3">
            <div className="text-center text-muted-foreground py-4">
              <p className="text-sm">Aucune activité récente</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
