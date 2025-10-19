"use client";

import { useState, useEffect } from "react";
import { ClassColorPicker } from "@/components/molecules/class-color-picker";
import { TimeSlotsManagement } from "@/components/organisms/timeslots-management";
import { SubjectsManagement } from "@/components/organisms/subjects-management";
import { AcademicStructuresManagement } from "@/components/organisms/academic-structures-management";
import { NotationSystemConfig } from "@/components/organisms/notation-system-config";
import { WeeklyTemplatesManagement } from "@/components/organisms/weekly-templates-management";
import { SchoolYearsManagement } from "@/components/organisms/school-years-management";
import { useSetPageTitle } from "@/shared/hooks";
import { useUserSession } from "@/features/settings";

export default function ReglagesPage() {
  useSetPageTitle("Réglages");

  const { user } = useUserSession();
  const [activeTab, setActiveTab] = useState<
    | "profil"
    | "creneaux"
    | "matieres"
    | "structures"
    | "annees"
    | "couleurs"
    | "preferences"
    | "securite"
    | "notation"
    | "templates"
  >("profil");

  const tabs = [
    { id: "profil" as const, label: "Profil", icon: "👤" },
    { id: "creneaux" as const, label: "Créneaux horaires", icon: "🕐" },
    { id: "matieres" as const, label: "Matières", icon: "📚" },
    { id: "structures" as const, label: "Structures académiques", icon: "📅" },
    { id: "annees" as const, label: "Années scolaires", icon: "📆" },
    { id: "templates" as const, label: "Templates Hebdomadaires", icon: "🗓️" },
    { id: "couleurs" as const, label: "Couleurs des classes", icon: "🎨" },
    { id: "notation" as const, label: "Systèmes de notation", icon: "📊" },
    { id: "preferences" as const, label: "Préférences", icon: "⚙️" },
    { id: "securite" as const, label: "Sécurité", icon: "🔒" },
  ];

  return (
    <div className="space-y-6">
      {/* Navigation par onglets */}
      <div className="border-b border-border">
        <nav className="-mb-px flex space-x-8" aria-label="Tabs">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-2 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                activeTab === tab.id
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground hover:border-muted-foreground"
              }`}
            >
              <span className="mr-2">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Contenu des onglets */}
      <div className="mt-6">
        {activeTab === "profil" && <ProfilSettings />}
        {activeTab === "creneaux" && (
          <TimeSlotsManagement teacherId={user?.id} />
        )}
        {activeTab === "matieres" && (
          <SubjectsManagement teacherId={user?.id} />
        )}
        {activeTab === "structures" && (
          <AcademicStructuresManagement teacherId={user?.id} />
        )}
        {activeTab === "annees" && (
          <SchoolYearsManagement teacherId={user?.id} useMockData={true} />
        )}
        {activeTab === "templates" && (
          <WeeklyTemplatesManagement teacherId={user?.id} />
        )}
        {activeTab === "couleurs" && (
          <CouleursSettings
            teacherId={user?.id || "KsmNtVf4zwqO3VV3SQJqPrRlQBA1fFyR"}
          />
        )}
        {activeTab === "notation" && (
          <NotationSystemConfig
            schoolYearId="year-2025"
            onSystemChange={(system) => {
              console.log("Système de notation changé:", system);
            }}
          />
        )}
        {activeTab === "preferences" && <PreferencesSettings />}
        {activeTab === "securite" && <SecuritySettings />}
      </div>
    </div>
  );
}

function ProfilSettings() {
  return (
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
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function PreferencesSettings() {
  const [hoverDelay, setHoverDelay] = useState(1000);

  // Charger la valeur depuis localStorage côté client seulement
  useEffect(() => {
    const saved = localStorage.getItem("sidebar-hover-delay");
    if (saved) {
      setHoverDelay(parseInt(saved, 10));
    }
  }, []);

  const handleHoverDelayChange = (value: number) => {
    setHoverDelay(value);
    localStorage.setItem("sidebar-hover-delay", value.toString());
    // Déclencher un événement personnalisé pour notifier les composants
    window.dispatchEvent(
      new CustomEvent("sidebar-hover-delay-change", { detail: value }),
    );
  };

  return (
    <div className="grid gap-6 md:grid-cols-1">
      <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
        <div className="p-6">
          <h3 className="text-lg font-semibold mb-4">Interface</h3>
          <div className="space-y-6">
            <div>
              <label
                htmlFor="hover-delay"
                className="text-sm font-medium mb-2 block"
              >
                Délai d'ouverture du sélecteur de classe (ms)
              </label>
              <div className="space-y-2">
                <input
                  id="hover-delay"
                  type="range"
                  min="0"
                  max="2000"
                  step="100"
                  value={hoverDelay}
                  onChange={(e) =>
                    handleHoverDelayChange(parseInt(e.target.value, 10))
                  }
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Immédiat (0ms)</span>
                  <span className="font-medium text-foreground">
                    {hoverDelay}ms
                  </span>
                  <span>Lent (2s)</span>
                </div>
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                Temps d'attente avant que le sélecteur de classe s'ouvre
                automatiquement au survol
              </p>
            </div>

            <hr className="border-border" />

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
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function CouleursSettings({ teacherId }: { teacherId: string }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="grid gap-6 md:grid-cols-1">
      <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
        <div className="p-6">
          <h3 className="text-lg font-semibold mb-4">Couleurs des classes</h3>
          <p className="text-muted-foreground mb-4">
            Personnalisez les couleurs de vos classes pour une meilleure
            organisation visuelle dans le calendrier et les autres vues.
          </p>
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
          >
            🎨 Gérer les couleurs
          </button>
        </div>
      </div>

      <ClassColorPicker
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        teacherId={teacherId}
      />
    </div>
  );
}

function SecuritySettings() {
  return (
    <div className="grid gap-6 md:grid-cols-2">
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
          </div>
        </div>
      </div>
    </div>
  );
}
