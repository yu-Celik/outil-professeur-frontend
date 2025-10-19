"use client";

import {
  Calendar,
  Download,
  Edit,
  FileText,
  Plus,
  Settings,
  Trash2,
  Upload,
} from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/atoms/badge";
import { Button } from "@/components/atoms/button";
import { Card, CardContent, CardHeader } from "@/components/molecules/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/atoms/dialog";
import {
  AcademicStructureCrudForm,
  type AcademicStructureFormData,
} from "@/components/organisms/academic-structure-crud-form";
import { useAcademicStructures } from "@/features/gestion";
import { PeriodCalculator } from "@/services/period-calculator";
import { getCurrentSchoolYear } from "@/features/gestion/mocks";
import type { AcademicStructure } from "@/types/uml-entities";

interface AcademicStructuresManagementProps {
  teacherId?: string;
}

export function AcademicStructuresManagement({
  teacherId,
}: AcademicStructuresManagementProps) {
  const {
    academicStructures,
    loading,
    error,
    createAcademicStructure,
    updateAcademicStructure,
    deleteAcademicStructure,
    createFromTemplate,
    getTeacherStructure,
    hasActiveStructure,
    exportStructure,
    importStructure,
    templates,
  } = useAcademicStructures({ teacherId });

  const [showForm, setShowForm] = useState(false);
  const [editingStructure, setEditingStructure] =
    useState<AcademicStructure | null>(null);

  const currentSchoolYear = getCurrentSchoolYear();
  const teacherStructure = getTeacherStructure();
  const hasStructure = hasActiveStructure();

  // Créer une nouvelle structure
  const handleCreate = async (data: AcademicStructureFormData) => {
    try {
      await createAcademicStructure(data);
      setShowForm(false);
      setEditingStructure(null);
    } catch (error) {
      console.error("Erreur lors de la création de la structure:", error);
    }
  };

  // Modifier une structure
  const handleUpdate = async (data: AcademicStructureFormData) => {
    if (!editingStructure) return;

    try {
      await updateAcademicStructure({ ...data, id: editingStructure.id });
      setShowForm(false);
      setEditingStructure(null);
    } catch (error) {
      console.error("Erreur lors de la modification de la structure:", error);
    }
  };

  // Supprimer une structure
  const handleDelete = async (id: string) => {
    if (
      confirm("Êtes-vous sûr de vouloir supprimer cette structure académique ?")
    ) {
      try {
        await deleteAcademicStructure(id);
      } catch (error) {
        console.error("Erreur lors de la suppression:", error);
      }
    }
  };

  // Exporter une structure
  const handleExport = (id: string) => {
    try {
      const jsonData = exportStructure(id);
      const blob = new Blob([jsonData], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `structure-academique-${id}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Erreur lors de l'export:", error);
    }
  };

  // Créer à partir d'un template ou ouvrir la structure existante
  const handleCreateFromTemplate = async (templateKey: string) => {
    if (hasStructure && teacherStructure) {
      // Si une structure existe déjà, l'ouvrir en modification
      setEditingStructure(teacherStructure);
      setShowForm(true);
    } else {
      // Sinon créer à partir du template
      try {
        await createFromTemplate(templateKey);
      } catch (error) {
        console.error("Erreur lors de la création depuis le template:", error);
        alert(
          `Erreur: ${error instanceof Error ? error.message : "Erreur inconnue"}`,
        );
      }
    }
  };

  // Obtenir les statistiques d'une structure
  const getStructureStats = (structure: AcademicStructure) => {
    if (!currentSchoolYear) return null;

    try {
      return PeriodCalculator.calculateStructureStats(
        structure,
        currentSchoolYear,
      );
    } catch {
      return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* En-tête simplifié */}
      <div>
        <h2 className="text-xl font-semibold">Votre système de périodes</h2>
        <p className="text-muted-foreground">
          Choisissez comment votre établissement organise l'année scolaire
        </p>
      </div>

      {/* Structure active OU choix initial */}
      {hasStructure && teacherStructure ? (
        <Card className="border-green-200 bg-green-50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center space-x-2">
                  <Badge
                    variant="secondary"
                    className="bg-green-100 text-green-800"
                  >
                    ✓ Configuré
                  </Badge>
                  <span className="text-lg font-medium">
                    {teacherStructure.name}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  {Object.values(teacherStructure.periodNames).join(" • ")}
                </p>
              </div>
              <Button
                variant="outline"
                onClick={() => {
                  setEditingStructure(teacherStructure);
                  setShowForm(true);
                }}
              >
                <Settings className="h-4 w-4 mr-2" />
                Changer
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <h3 className="font-medium">Choisissez votre système</h3>
            <p className="text-sm text-muted-foreground">
              Sélectionnez le modèle utilisé par votre établissement
            </p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(templates).map(([key, template]) => (
                <Button
                  key={key}
                  variant="outline"
                  className="h-auto p-4 text-left"
                  onClick={() => handleCreateFromTemplate(key)}
                  disabled={loading}
                >
                  <div className="w-full">
                    <div className="font-medium text-base mb-1">
                      {template.name}
                    </div>
                    <div className="text-sm text-muted-foreground mb-2">
                      {template.periodsPerYear} périodes dans l'année
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {Object.values(template.periodNames).join(" • ")}
                    </div>
                  </div>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Message d'erreur uniquement */}
      {error && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-4">
            <div className="text-red-700">Erreur: {error}</div>
          </CardContent>
        </Card>
      )}

      {/* Dialog pour le formulaire */}
      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <AcademicStructureCrudForm
            academicStructure={editingStructure}
            onSubmit={editingStructure ? handleUpdate : handleCreate}
            onCancel={() => {
              setShowForm(false);
              setEditingStructure(null);
            }}
            loading={loading}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
