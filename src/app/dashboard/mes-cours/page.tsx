import { Plus } from "lucide-react";

export default function MesCoursPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Mes cours</h1>
          <p className="text-muted-foreground">
            Gérez vos matières et contenus pédagogiques
          </p>
        </div>
        <div>
          {/* Version desktop */}
          <button
            type="button"
            className="hidden lg:flex bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Nouveau cours
          </button>
          {/* Version mobile */}
          <button
            type="button"
            className="flex lg:hidden bg-primary text-primary-foreground hover:bg-primary/90 w-10 h-10 rounded-md items-center justify-center"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Mathématiques</h3>
            <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
              Actif
            </span>
          </div>
          <p className="text-sm text-muted-foreground mb-4">
            Cours de mathématiques niveau secondaire
          </p>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Élèves:</span>
              <span className="font-medium">0</span>
            </div>
            <div className="flex justify-between">
              <span>Leçons:</span>
              <span className="font-medium">0</span>
            </div>
            <div className="flex justify-between">
              <span>Évaluations:</span>
              <span className="font-medium">0</span>
            </div>
          </div>
        </div>

        <div className="rounded-lg border-2 border-dashed border-muted-foreground/25 p-6 flex flex-col items-center justify-center text-center">
          <div className="text-4xl mb-4">📚</div>
          <h3 className="text-lg font-medium mb-2">Ajouter un cours</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Créez un nouveau cours pour vos élèves
          </p>
          <div>
            {/* Version desktop */}
            <button
              type="button"
              className="hidden lg:flex text-primary hover:underline items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Créer un cours
            </button>
            {/* Version mobile */}
            <button
              type="button"
              className="flex lg:hidden text-primary hover:bg-primary/10 w-10 h-10 rounded-md items-center justify-center"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
        <div className="p-6">
          <h3 className="text-lg font-semibold mb-4">Activité récente</h3>
          <div className="space-y-4">
            <div className="flex items-start gap-3 p-4 bg-muted rounded-lg">
              <div className="text-2xl">📝</div>
              <div className="flex-1">
                <p className="font-medium">Aucune activité récente</p>
                <p className="text-sm text-muted-foreground">
                  Commencez par créer votre premier cours
                </p>
              </div>
              <span className="text-sm text-muted-foreground">-</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
