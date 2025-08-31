export default function ReglagesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Réglages</h1>
        <p className="text-muted-foreground">
          Configurez votre profil et les paramètres de l'application
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-6">
          <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
            <div className="p-6">
              <h3 className="text-lg font-semibold mb-4">Profil utilisateur</h3>
              <div className="space-y-4">
                <div>
                  <label
                    htmlFor="nom-complet"
                    className="text-sm font-medium mb-2 block"
                  >
                    Nom complet
                  </label>
                  <input
                    id="nom-complet"
                    type="text"
                    placeholder="Votre nom"
                    className="w-full px-3 py-2 border rounded-md"
                  />
                </div>
                <div>
                  <label
                    htmlFor="email"
                    className="text-sm font-medium mb-2 block"
                  >
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    placeholder="votre.email@example.com"
                    className="w-full px-3 py-2 border rounded-md"
                  />
                </div>
                <div>
                  <label
                    htmlFor="etablissement"
                    className="text-sm font-medium mb-2 block"
                  >
                    Établissement
                  </label>
                  <input
                    id="etablissement"
                    type="text"
                    placeholder="Nom de votre établissement"
                    className="w-full px-3 py-2 border rounded-md"
                  />
                </div>
                <div>
                  <label
                    htmlFor="matiere-principale"
                    className="text-sm font-medium mb-2 block"
                  >
                    Matière principale
                  </label>
                  <select
                    id="matiere-principale"
                    className="w-full px-3 py-2 border rounded-md"
                  >
                    <option>Sélectionner une matière</option>
                    <option>Mathématiques</option>
                    <option>Français</option>
                    <option>Histoire-Géographie</option>
                    <option>Sciences</option>
                    <option>Anglais</option>
                    <option>Autre</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
            <div className="p-6">
              <h3 className="text-lg font-semibold mb-4">Notifications</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Notifications par email</p>
                    <p className="text-sm text-muted-foreground">
                      Recevoir les mises à jour par email
                    </p>
                  </div>
                  <input type="checkbox" className="rounded" />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Rappels de cours</p>
                    <p className="text-sm text-muted-foreground">
                      Notifications avant les cours
                    </p>
                  </div>
                  <input type="checkbox" className="rounded" />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Évaluations à corriger</p>
                    <p className="text-sm text-muted-foreground">
                      Rappels pour les corrections
                    </p>
                  </div>
                  <input type="checkbox" className="rounded" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
            <div className="p-6">
              <h3 className="text-lg font-semibold mb-4">Préférences</h3>
              <div className="space-y-4">
                <div>
                  <label
                    htmlFor="langue"
                    className="text-sm font-medium mb-2 block"
                  >
                    Langue
                  </label>
                  <select
                    id="langue"
                    className="w-full px-3 py-2 border rounded-md"
                  >
                    <option>Français</option>
                    <option>English</option>
                    <option>Español</option>
                  </select>
                </div>
                <div>
                  <label
                    htmlFor="fuseau-horaire"
                    className="text-sm font-medium mb-2 block"
                  >
                    Fuseau horaire
                  </label>
                  <select
                    id="fuseau-horaire"
                    className="w-full px-3 py-2 border rounded-md"
                  >
                    <option>Europe/Paris (UTC+1)</option>
                    <option>Europe/London (UTC+0)</option>
                    <option>America/New_York (UTC-5)</option>
                  </select>
                </div>
                <div>
                  <label
                    htmlFor="format-date"
                    className="text-sm font-medium mb-2 block"
                  >
                    Format de date
                  </label>
                  <select
                    id="format-date"
                    className="w-full px-3 py-2 border rounded-md"
                  >
                    <option>DD/MM/YYYY</option>
                    <option>MM/DD/YYYY</option>
                    <option>YYYY-MM-DD</option>
                  </select>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Mode sombre</p>
                    <p className="text-sm text-muted-foreground">
                      Activer le thème sombre
                    </p>
                  </div>
                  <input type="checkbox" className="rounded" />
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
            <div className="p-6">
              <h3 className="text-lg font-semibold mb-4">Sécurité</h3>
              <div className="space-y-3">
                <button
                  type="button"
                  className="w-full text-left p-3 rounded hover:bg-muted border"
                >
                  🔒 Changer le mot de passe
                </button>
                <button
                  type="button"
                  className="w-full text-left p-3 rounded hover:bg-muted border"
                >
                  📱 Authentification à deux facteurs
                </button>
                <button
                  type="button"
                  className="w-full text-left p-3 rounded hover:bg-muted border"
                >
                  📊 Voir les sessions actives
                </button>
              </div>
            </div>
          </div>

          <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
            <div className="p-6">
              <h3 className="text-lg font-semibold mb-4">Données</h3>
              <div className="space-y-3">
                <button
                  type="button"
                  className="w-full text-left p-3 rounded hover:bg-muted border"
                >
                  📥 Exporter mes données
                </button>
                <button
                  type="button"
                  className="w-full text-left p-3 rounded hover:bg-muted border"
                >
                  📋 Sauvegarder les cours
                </button>
                <button
                  type="button"
                  className="w-full text-left p-3 rounded hover:bg-muted border text-destructive"
                >
                  🗑️ Supprimer le compte
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-2">
        <button
          type="button"
          className="px-4 py-2 border rounded-md hover:bg-muted"
        >
          Annuler
        </button>
        <button
          type="button"
          className="bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md"
        >
          Enregistrer les modifications
        </button>
      </div>
    </div>
  );
}
