export default function CalendrierPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Calendrier</h1>
        <p className="text-muted-foreground">
          Gérez votre emploi du temps et vos cours
        </p>
      </div>

      <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
        <div className="p-6">
          <h3 className="text-lg font-semibold mb-4">Prochains cours</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
              <div>
                <p className="font-medium">Aucun cours planifié</p>
                <p className="text-sm text-muted-foreground">
                  Commencez par ajouter un cours
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
            <button
              type="button"
              className="w-full text-left p-2 rounded hover:bg-muted"
            >
              + Nouveau cours
            </button>
            <button
              type="button"
              className="w-full text-left p-2 rounded hover:bg-muted"
            >
              📅 Planifier une session
            </button>
            <button
              type="button"
              className="w-full text-left p-2 rounded hover:bg-muted"
            >
              ⏰ Modifier horaires
            </button>
          </div>
        </div>

        <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
          <h3 className="text-lg font-semibold mb-4">Statistiques</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Cours cette semaine:</span>
              <span className="font-medium">0</span>
            </div>
            <div className="flex justify-between">
              <span>Heures enseignées:</span>
              <span className="font-medium">0h</span>
            </div>
            <div className="flex justify-between">
              <span>Taux de présence:</span>
              <span className="font-medium">-</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
