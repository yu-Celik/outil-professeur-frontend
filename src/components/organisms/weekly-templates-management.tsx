"use client";

import { Calendar, Plus, Play } from "lucide-react";
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
import { WeeklyTemplateCard } from "@/components/molecules/weekly-template-card";
import { WeeklyTemplateForm } from "@/components/organisms/weekly-template-form";
import { SessionGeneratorModal } from "@/components/organisms/session-generator-modal";
import { useWeeklyTemplates } from "@/features/weekly-templates";
import { useClassManagement, useSubjectManagement } from "@/features/gestion";
import { useTimeSlots } from "@/features/calendar";
import type { WeeklyTemplate } from "@/types/uml-entities";

interface WeeklyTemplatesManagementProps {
  teacherId?: string;
}

const DAYS_OF_WEEK = [
  "",
  "Lundi",
  "Mardi",
  "Mercredi",
  "Jeudi",
  "Vendredi",
  "Samedi",
  "Dimanche",
];

export function WeeklyTemplatesManagement({
  teacherId = "teacher-001",
}: WeeklyTemplatesManagementProps) {
  const {
    templates,
    loading,
    error,
    createTemplate,
    updateTemplate,
    deleteTemplate,
  } = useWeeklyTemplates(teacherId);

  const { classes } = useClassManagement();
  const { subjects } = useSubjectManagement();
  const { timeSlots } = useTimeSlots(teacherId);

  const [showForm, setShowForm] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<WeeklyTemplate | null>(
    null,
  );
  const [generatingTemplate, setGeneratingTemplate] =
    useState<WeeklyTemplate | null>(null);

  // Group templates by day of week
  const templatesByDay = templates.reduce(
    (acc, template) => {
      const day = template.dayOfWeek;
      if (!acc[day]) {
        acc[day] = [];
      }
      acc[day].push(template);
      return acc;
    },
    {} as Record<number, WeeklyTemplate[]>,
  );

  const handleCreate = async (data: any) => {
    try {
      await createTemplate(data);
      setShowForm(false);
      setEditingTemplate(null);
    } catch (error) {
      console.error("Erreur lors de la création du template:", error);
      throw error;
    }
  };

  const handleUpdate = async (data: any) => {
    try {
      if (editingTemplate) {
        await updateTemplate(editingTemplate.id, data);
        setShowForm(false);
        setEditingTemplate(null);
      }
    } catch (error) {
      console.error("Erreur lors de la mise à jour du template:", error);
      throw error;
    }
  };

  const handleDelete = async (id: string) => {
    if (
      confirm(
        "Êtes-vous sûr de vouloir supprimer ce template ? Cette action est irréversible.",
      )
    ) {
      try {
        await deleteTemplate(id);
      } catch (error) {
        console.error("Erreur lors de la suppression du template:", error);
      }
    }
  };

  const handleGenerate = (template: WeeklyTemplate) => {
    setGeneratingTemplate(template);
  };

  const handleGenerationSuccess = (count: number) => {
    console.log(`${count} sessions générées avec succès`);
    // TODO: Refresh calendar or show toast notification
  };

  // Helper functions to get names
  const getClassName = (classId: string) => {
    const cls = classes.find((c) => c.id === classId);
    return cls ? `${cls.classCode} - ${cls.gradeLabel}` : "Classe inconnue";
  };

  const getSubjectName = (subjectId: string) => {
    const subject = subjects.find((s) => s.id === subjectId);
    return subject ? subject.name : "Matière inconnue";
  };

  const getTimeSlotName = (timeSlotId: string) => {
    const slot = timeSlots.find((ts) => ts.id === timeSlotId);
    return slot ? `${slot.startTime} - ${slot.endTime}` : "Créneau inconnu";
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Calendar className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-semibold">Templates Hebdomadaires</h2>
              <p className="text-sm text-muted-foreground">
                Gérez vos templates de sessions récurrentes
              </p>
            </div>
          </div>
          <Button onClick={() => setShowForm(true)} className="gap-2">
            <Plus className="h-4 w-4" />
            Nouveau template
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Statistics */}
        <div className="grid grid-cols-3 gap-4">
          <div className="p-3 bg-chart-1/10 border border-chart-1/20 rounded-lg">
            <div className="text-2xl font-bold text-chart-1">
              {templates.length}
            </div>
            <div className="text-xs text-chart-1">Templates actifs</div>
          </div>
          <div className="p-3 bg-chart-2/10 border border-chart-2/20 rounded-lg">
            <div className="text-2xl font-bold text-chart-2">
              {Object.keys(templatesByDay).length}
            </div>
            <div className="text-xs text-chart-2">Jours couverts</div>
          </div>
          <div className="p-3 bg-chart-3/10 border border-chart-3/20 rounded-lg">
            <div className="text-2xl font-bold text-chart-3">
              {
                new Set(templates.map((t) => `${t.classId}-${t.subjectId}`))
                  .size
              }
            </div>
            <div className="text-xs text-chart-3">Combinaisons uniques</div>
          </div>
        </div>

        {/* Templates grouped by day */}
        {templates.length > 0 ? (
          <div className="space-y-6">
            {DAYS_OF_WEEK.slice(1).map((dayName, index) => {
              const dayNumber = index + 1;
              const dayTemplates = templatesByDay[dayNumber] || [];

              if (dayTemplates.length === 0) return null;

              return (
                <div key={dayNumber}>
                  <div className="flex items-center gap-2 mb-3">
                    <Badge variant="outline" className="font-semibold">
                      {dayName}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {dayTemplates.length} template
                      {dayTemplates.length > 1 ? "s" : ""}
                    </span>
                  </div>
                  <div className="space-y-2">
                    {dayTemplates.map((template) => (
                      <WeeklyTemplateCard
                        key={template.id}
                        template={template}
                        className={getClassName(template.classId)}
                        subjectName={getSubjectName(template.subjectId)}
                        timeSlotName={getTimeSlotName(template.timeSlotId)}
                        onEdit={() => {
                          setEditingTemplate(template);
                          setShowForm(true);
                        }}
                        onDelete={() => handleDelete(template.id)}
                        onGenerate={() => handleGenerate(template)}
                      />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* Empty State */
          <div className="text-center py-12">
            <div className="w-20 h-20 rounded-2xl bg-muted/50 flex items-center justify-center mx-auto mb-4">
              <Calendar className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="font-semibold text-lg mb-2">
              Aucun template configuré
            </h3>
            <p className="text-muted-foreground mb-4 max-w-md mx-auto">
              Créez votre premier template hebdomadaire pour générer
              automatiquement vos sessions récurrentes chaque semaine.
            </p>
            <Button onClick={() => setShowForm(true)} className="gap-2">
              <Plus className="h-4 w-4" />
              Créer un template
            </Button>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
            <p className="text-sm text-destructive">{error}</p>
          </div>
        )}
      </CardContent>

      {/* Form Modal */}
      <Dialog
        open={showForm}
        onOpenChange={(open) => {
          if (!open) {
            setShowForm(false);
            setEditingTemplate(null);
          }
        }}
      >
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingTemplate ? "Modifier le template" : "Nouveau template"}
            </DialogTitle>
          </DialogHeader>
          <WeeklyTemplateForm
            isOpen={showForm}
            onClose={() => {
              setShowForm(false);
              setEditingTemplate(null);
            }}
            onSubmit={editingTemplate ? handleUpdate : handleCreate}
            editingTemplate={editingTemplate}
            teacherId={teacherId}
            isLoading={loading}
          />
        </DialogContent>
      </Dialog>

      {/* Session Generation Modal */}
      {generatingTemplate && (
        <SessionGeneratorModal
          isOpen={!!generatingTemplate}
          onClose={() => setGeneratingTemplate(null)}
          template={generatingTemplate}
          templateName={`${DAYS_OF_WEEK[generatingTemplate.dayOfWeek]} - ${getClassName(generatingTemplate.classId)} - ${getSubjectName(generatingTemplate.subjectId)}`}
          onSuccess={handleGenerationSuccess}
        />
      )}
    </Card>
  );
}
