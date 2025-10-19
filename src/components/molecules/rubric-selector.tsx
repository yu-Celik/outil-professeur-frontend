"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/atoms/button";
import { Label } from "@/components/atoms/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/atoms/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/atoms/dialog";
import { Badge } from "@/components/atoms/badge";
import { Grid3x3, Target, Scale, Eye, Plus, X } from "lucide-react";
import { useRubricManagement } from "@/features/evaluations";
import type { Rubric } from "@/types/uml-entities";
import type { RubricSection } from "@/features/evaluations/mocks";

export interface RubricSelectorProps {
  value?: string;
  onValueChange?: (rubricId: string | null) => void;
  teacherId?: string;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  error?: string;
}

export function RubricSelector({
  value = "",
  onValueChange,
  teacherId,
  placeholder = "Sélectionner une grille (optionnel)",
  disabled = false,
  className = "",
  error,
}: RubricSelectorProps) {
  const [previewRubric, setPreviewRubric] = useState<Rubric | null>(null);
  const { rubrics, loading, getRubric } = useRubricManagement(teacherId);

  const selectedRubric = value ? getRubric(value) : null;

  const handleValueChange = (newValue: string) => {
    if (newValue === "none") {
      onValueChange?.(null);
    } else {
      onValueChange?.(newValue);
    }
  };

  const handlePreview = (rubricId: string) => {
    const rubric = getRubric(rubricId);
    if (rubric) {
      setPreviewRubric(rubric);
    }
  };

  const handleRemove = () => {
    onValueChange?.(null);
  };

  if (loading) {
    return (
      <div className={`space-y-2 ${className}`}>
        <Label>Grille d'évaluation</Label>
        <Select disabled>
          <SelectTrigger>
            <SelectValue placeholder="Chargement..." />
          </SelectTrigger>
        </Select>
      </div>
    );
  }

  return (
    <>
      <div className={`space-y-2 ${className}`}>
        <Label>Grille d'évaluation</Label>

        {/* Sélecteur */}
        <div className="flex gap-2">
          <Select
            value={value || "none"}
            onValueChange={handleValueChange}
            disabled={disabled}
          >
            <SelectTrigger
              className={error ? "border-destructive flex-1" : "flex-1"}
            >
              <SelectValue placeholder={placeholder} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">Aucune grille</SelectItem>
              {rubrics.map((rubric) => (
                <SelectItem key={rubric.id} value={rubric.id}>
                  {rubric.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Boutons d'action */}
          {value && (
            <>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => handlePreview(value)}
              >
                <Eye className="h-4 w-4" />
                <span className="sr-only">Aperçu de la grille</span>
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleRemove}
              >
                <X className="h-4 w-4" />
                <span className="sr-only">Retirer la grille</span>
              </Button>
            </>
          )}
        </div>

        {/* Message d'erreur */}
        {error && <p className="text-sm text-destructive">{error}</p>}

        {/* Info sur la grille sélectionnée */}
        {selectedRubric && (
          <div className="p-3 bg-muted/50 rounded-md border">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="font-medium text-sm text-foreground">
                  {selectedRubric.name}
                </p>
                <RubricSummary rubric={selectedRubric} />
              </div>
            </div>
          </div>
        )}

        {/* Message si aucune grille disponible */}
        {rubrics.length === 0 && (
          <div className="p-3 text-center text-muted-foreground text-sm border border-dashed rounded-md">
            <Grid3x3 className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p>Aucune grille d'évaluation disponible</p>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="mt-2"
              onClick={() => {
                // TODO: Ouvrir le dialog de création de grille
                console.log("Créer une nouvelle grille");
              }}
            >
              <Plus className="h-4 w-4 mr-1" />
              Créer une grille
            </Button>
          </div>
        )}
      </div>

      {/* Dialog d'aperçu */}
      {previewRubric && (
        <Dialog
          open={!!previewRubric}
          onOpenChange={() => setPreviewRubric(null)}
        >
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                Aperçu de la grille : {previewRubric.name}
              </DialogTitle>
              <DialogDescription>
                Détails des sections et critères de cette grille d'évaluation
              </DialogDescription>
            </DialogHeader>

            <RubricPreview rubric={previewRubric} />
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}

// Composant pour afficher un résumé de grille
function RubricSummary({ rubric }: { rubric: Rubric }) {
  const sections = rubric.sections as Record<string, RubricSection>;
  const sectionsCount = Object.keys(sections).length;
  const totalCriteria = Object.values(sections).reduce(
    (sum, section) => sum + section.criteria.length,
    0,
  );

  return (
    <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
      <div className="flex items-center gap-1">
        <Grid3x3 className="h-3 w-3" />
        {sectionsCount} section{sectionsCount > 1 ? "s" : ""}
      </div>
      <div className="flex items-center gap-1">
        <Target className="h-3 w-3" />
        {totalCriteria} critère{totalCriteria > 1 ? "s" : ""}
      </div>
      <div className="flex items-center gap-1">
        <Scale className="h-3 w-3" />
        Score max variable
      </div>
    </div>
  );
}

// Composant pour l'aperçu détaillé de grille
function RubricPreview({ rubric }: { rubric: Rubric }) {
  const sections = rubric.sections as Record<string, RubricSection>;

  return (
    <div className="space-y-4">
      {Object.values(sections).map((section) => (
        <div key={section.id} className="border rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-medium text-foreground">{section.name}</h4>
            <Badge variant="outline">{section.weight}%</Badge>
          </div>

          <div className="space-y-2">
            {section.criteria.map((criterion) => (
              <div key={criterion.id} className="bg-muted/30 rounded p-3">
                <div className="font-medium text-sm mb-1">{criterion.name}</div>
                {criterion.description && (
                  <div className="text-xs text-muted-foreground mb-2">
                    {criterion.description}
                  </div>
                )}

                <div className="flex flex-wrap gap-2">
                  {criterion.levels.map((level) => (
                    <div
                      key={level.id}
                      className="flex items-center gap-1 bg-background rounded px-2 py-1 text-xs border"
                    >
                      <span className="font-medium">{level.points} pts</span>
                      <span className="text-muted-foreground">
                        - {level.name}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
