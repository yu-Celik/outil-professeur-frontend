"use client";

import {
  BookOpen,
  Database,
  MessageSquare,
  Settings,
  Sparkles,
  Users,
} from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/atoms/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/molecules/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/molecules/tabs";
import { AppreciationGenerationInterface } from "@/components/organisms/appreciation-generation-interface";
import { PhraseBankManagement } from "@/components/organisms/phrase-bank-management";
import { StyleGuideManagement } from "@/components/organisms/style-guide-management";
import { ClassSelectionLayout } from "@/components/templates/class-selection-layout";
import {
  ClassSelectionProvider,
  useClassSelection,
} from "@/contexts/class-selection-context";
import { useSetPageTitle } from "@/shared/hooks";

function AppreciationsContent() {
  useSetPageTitle("Appréciations IA");
  const [activeTab, setActiveTab] = useState("generation");
  const { selectedClassId, classes } = useClassSelection();

  const selectedClass = classes.find((c) => c.id === selectedClassId);

  return (
    <div className="space-y-6">
      {/* En-tête de la page avec contexte de classe */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
            <Sparkles className="h-8 w-8 text-primary" />
            Appréciations IA
          </h1>
          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
            <p className="text-muted-foreground">
              Génération automatisée d'appréciations personnalisées
            </p>
            {selectedClass && (
              <Badge variant="secondary" className="w-fit">
                <Users className="h-3 w-3 mr-1" />
                {selectedClass.classCode} - {selectedClass.gradeLabel}
              </Badge>
            )}
          </div>
        </div>
        <Badge variant="outline" className="w-fit">
          <Sparkles className="h-3 w-3 mr-1" />
          IA Activée
        </Badge>
      </div>

      {/* Navigation par onglets optimisée */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-2 sm:grid-cols-4 w-full max-w-2xl">
          <TabsTrigger value="generation" className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            <span className="hidden sm:inline">Génération</span>
            <span className="sm:hidden">Gen</span>
          </TabsTrigger>
          <TabsTrigger value="styles" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            <span className="hidden sm:inline">Styles</span>
            <span className="sm:hidden">Sty</span>
          </TabsTrigger>
          <TabsTrigger value="phrases" className="flex items-center gap-2">
            <Database className="h-4 w-4" />
            <span className="hidden sm:inline">Phrases</span>
            <span className="sm:hidden">Phr</span>
          </TabsTrigger>
          <TabsTrigger value="historique" className="flex items-center gap-2">
            <BookOpen className="h-4 w-4" />
            <span className="hidden sm:inline">Historique</span>
            <span className="sm:hidden">Hist</span>
          </TabsTrigger>
        </TabsList>

        {/* Onglet Génération */}
        <TabsContent value="generation" className="space-y-6 mt-6">
          <AppreciationGenerationInterface />
        </TabsContent>

        {/* Onglet Gestion des styles */}
        <TabsContent value="styles" className="space-y-6 mt-6">
          <StyleGuideManagement />
        </TabsContent>

        {/* Onglet Gestion des phrases */}
        <TabsContent value="phrases" className="space-y-6 mt-6">
          <PhraseBankManagement />
        </TabsContent>

        {/* Onglet Historique */}
        <TabsContent value="historique" className="space-y-6 mt-6">
          <div className="grid gap-6">
            {/* Statistiques rapides */}
            {selectedClass && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">
                          Appréciations générées
                        </p>
                        <p className="text-2xl font-bold">0</p>
                      </div>
                      <MessageSquare className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">
                          Élèves traités
                        </p>
                        <p className="text-2xl font-bold">0</p>
                      </div>
                      <Users className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">
                          Dernière génération
                        </p>
                        <p className="text-sm text-muted-foreground">Jamais</p>
                      </div>
                      <BookOpen className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Liste de l'historique */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5" />
                    Historique des appréciations
                    {selectedClass && (
                      <Badge variant="outline" className="ml-2">
                        {selectedClass.classCode}
                      </Badge>
                    )}
                  </div>
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  {selectedClass
                    ? `Appréciations générées pour la classe ${selectedClass.classCode} - ${selectedClass.gradeLabel}`
                    : "Sélectionnez une classe pour voir l'historique des appréciations"}
                </p>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12 text-muted-foreground">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-muted/50 to-muted/30 flex items-center justify-center mx-auto mb-6">
                    <BookOpen className="h-8 w-8" />
                  </div>
                  <div className="space-y-2">
                    <p className="text-lg font-semibold text-foreground">
                      {selectedClass
                        ? "Aucune appréciation générée"
                        : "Sélectionnez une classe"}
                    </p>
                    <p className="text-sm max-w-sm mx-auto leading-relaxed">
                      {selectedClass
                        ? "Commencez par générer des appréciations dans l'onglet Génération pour voir l'historique apparaître ici."
                        : "Choisissez une classe dans la barre latérale pour consulter l'historique des appréciations générées."}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default function AppreciationsPage() {
  return (
    <ClassSelectionProvider>
      <ClassSelectionLayout
        emptyStateIcon={<Sparkles className="h-8 w-8 text-muted-foreground" />}
        emptyStateTitle="Sélectionnez une classe"
        emptyStateDescription="Choisissez une classe dans la barre latérale pour commencer la génération d'appréciations"
      >
        <AppreciationsContent />
      </ClassSelectionLayout>
    </ClassSelectionProvider>
  );
}
