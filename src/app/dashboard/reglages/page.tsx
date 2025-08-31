"use client";

import { useState } from "react";
import { ClassColorPicker } from "@/components/molecules/class-color-picker";
import { TimeSlotsManagement } from "@/components/organisms/timeslots-management";
import { useUserSession } from "@/hooks/use-user-session";

export default function ReglagesPage() {
  const { user } = useUserSession();
  const [activeTab, setActiveTab] = useState<"profil" | "creneaux" | "couleurs" | "preferences" | "securite">("profil");

  const tabs = [
    { id: "profil" as const, label: "Profil", icon: "👤" },
    { id: "creneaux" as const, label: "Créneaux horaires", icon: "🕐" },
    { id: "couleurs" as const, label: "Couleurs des classes", icon: "🎨" },
    { id: "preferences" as const, label: "Préférences", icon: "⚙️" },
    { id: "securite" as const, label: "Sécurité", icon: "🔒" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Réglages</h1>
        <p className="text-muted-foreground">
          Configurez votre profil et les paramètres de l'application
        </p>
      </div>

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
        {activeTab === "creneaux" && <TimeSlotsManagement teacherId={user?.id} />}
        {activeTab === "couleurs" && (
          <div>
            <ClassColorPicker
              isOpen={true}
              onClose={() => {}}
              teacherId={user?.id || "KsmNtVf4zwqO3VV3SQJqPrRlQBA1fFyR"}
            />
          </div>
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
                <label htmlFor="nom-complet" className="text-sm font-medium mb-2 block">
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
                <label htmlFor="email" className="text-sm font-medium mb-2 block">
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
                <label htmlFor="langue" className="text-sm font-medium mb-2 block">
                  Langue
                </label>
                <select id="langue" className="w-full px-3 py-2 border rounded-md">
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
  return (
    <div className="grid gap-6 md:grid-cols-2">
      <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
        <div className="p-6">
          <h3 className="text-lg font-semibold mb-4">Préférences</h3>
          <div className="space-y-4">
            <div>
              <label htmlFor="langue" className="text-sm font-medium mb-2 block">
                Langue
              </label>
              <select id="langue" className="w-full px-3 py-2 border rounded-md">
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