"use client";

import { useState, useMemo } from "react";
import { Calendar, FileText, Users, Settings as SettingsIcon } from "lucide-react";
import { Button } from "@/components/atoms/button";
import { Label } from "@/components/atoms/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/molecules/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/atoms/select";
import { Checkbox } from "@/components/atoms/checkbox";
import { cn } from "@/lib/utils";
import { Progress } from "@/components/atoms/progress";

export interface ClassOption {
  id: string;
  label: string;
  studentCount: number;
}

export interface AcademicPeriodOption {
  id: string;
  label: string;
  startDate: Date;
  endDate: Date;
}

export interface StyleGuideOption {
  id: string;
  label: string;
  tone?: string;
}

export interface LengthOption {
  id: string;
  label: string;
  wordRange: string;
}

export interface TrimesterAppreciationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  classes: ClassOption[];
  periods: AcademicPeriodOption[];
  styleGuides: StyleGuideOption[];
  selectedClassIds: string[];
  selectedPeriodId?: string;
  selectedStyleGuideId?: string;
  selectedLengthId?: string;
  onClassToggle: (classId: string) => void;
  onPeriodChange: (periodId: string) => void;
  onStyleGuideChange: (styleGuideId: string) => void;
  onLengthChange: (lengthId: string) => void;
  onGenerate: () => void;
  onOpenStyleManager: () => void;
  isGenerating: boolean;
  progress?: {
    current: number;
    total: number;
    currentStudentName?: string;
    estimatedTimeRemaining?: string;
  };
}

const LENGTH_OPTIONS: LengthOption[] = [
  { id: "short", label: "Court (60-80 mots)", wordRange: "60-80" },
  { id: "standard", label: "Standard (80-120 mots)", wordRange: "80-120" },
  { id: "long", label: "Long (120-150 mots)", wordRange: "120-150" },
];

export function TrimesterAppreciationModal({
  open,
  onOpenChange,
  classes,
  periods,
  styleGuides,
  selectedClassIds,
  selectedPeriodId,
  selectedStyleGuideId,
  selectedLengthId,
  onClassToggle,
  onPeriodChange,
  onStyleGuideChange,
  onLengthChange,
  onGenerate,
  onOpenStyleManager,
  isGenerating,
  progress,
}: TrimesterAppreciationModalProps) {
  const totalStudents = useMemo(() => {
    return classes
      .filter((cls) => selectedClassIds.includes(cls.id))
      .reduce((sum, cls) => sum + cls.studentCount, 0);
  }, [classes, selectedClassIds]);

  const estimatedTime = useMemo(() => {
    const timePerStudent = 15; // secondes
    const totalSeconds = totalStudents * timePerStudent;
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);

    if (hours > 0) {
      return `~${hours}h${minutes > 0 ? minutes : ""}`;
    }
    return `~${minutes}min`;
  }, [totalStudents]);

  const canGenerate =
    selectedClassIds.length > 0 &&
    selectedPeriodId &&
    selectedStyleGuideId &&
    selectedLengthId &&
    !isGenerating;

  const selectedPeriod = periods.find((p) => p.id === selectedPeriodId);
  const selectedStyle = styleGuides.find((s) => s.id === selectedStyleGuideId);
  const selectedLength = LENGTH_OPTIONS.find((l) => l.id === selectedLengthId);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            Génération Appréciations Trimestrielles
          </DialogTitle>
          <DialogDescription>
            Configurez et lancez la génération automatique des appréciations pour les
            bulletins trimestriels. Le système analysera les présences, participations,
            résultats d'examens et observations pour chaque élève.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Sélection de la période académique */}
          <div className="space-y-3">
            <Label className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Période académique *
            </Label>
            <Select value={selectedPeriodId} onValueChange={onPeriodChange}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner un trimestre" />
              </SelectTrigger>
              <SelectContent>
                {periods.map((period) => (
                  <SelectItem key={period.id} value={period.id}>
                    {period.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {selectedPeriod && (
              <p className="text-xs text-muted-foreground">
                Du {selectedPeriod.startDate.toLocaleDateString("fr-FR")} au{" "}
                {selectedPeriod.endDate.toLocaleDateString("fr-FR")}
              </p>
            )}
          </div>

          {/* Sélection multi-classes */}
          <div className="space-y-3">
            <Label className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Classes à traiter *
              {selectedClassIds.length > 0 && (
                <span className="text-xs font-normal text-muted-foreground">
                  ({selectedClassIds.length} classe{selectedClassIds.length > 1 ? "s" : ""},{" "}
                  {totalStudents} élève{totalStudents > 1 ? "s" : ""})
                </span>
              )}
            </Label>
            <div className="grid gap-2 sm:grid-cols-2">
              {classes.map((cls) => {
                const isSelected = selectedClassIds.includes(cls.id);
                return (
                  <button
                    key={cls.id}
                    type="button"
                    onClick={() => onClassToggle(cls.id)}
                    className={cn(
                      "flex items-start gap-3 rounded-lg border p-3 text-left transition",
                      isSelected
                        ? "border-primary/60 bg-primary/5"
                        : "hover:bg-muted/60",
                    )}
                  >
                    <Checkbox checked={isSelected} className="pointer-events-none mt-0.5" />
                    <div className="flex-1 space-y-0.5">
                      <div className="font-medium text-sm">{cls.label}</div>
                      <div className="text-xs text-muted-foreground">
                        {cls.studentCount} élève{cls.studentCount > 1 ? "s" : ""}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Guide de style */}
          <div className="space-y-3">
            <Label className="flex items-center gap-2">
              <SettingsIcon className="h-4 w-4" />
              Guide de style *
            </Label>
            <div className="flex gap-2">
              <Select
                value={selectedStyleGuideId}
                onValueChange={onStyleGuideChange}
              >
                <SelectTrigger className="flex-1">
                  <SelectValue placeholder="Sélectionner un guide de style" />
                </SelectTrigger>
                <SelectContent>
                  {styleGuides.map((style) => (
                    <SelectItem key={style.id} value={style.id}>
                      {style.label}
                      {style.tone && (
                        <span className="text-xs text-muted-foreground ml-2">
                          ({style.tone})
                        </span>
                      )}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button
                variant="outline"
                size="icon"
                onClick={onOpenStyleManager}
                type="button"
              >
                <SettingsIcon className="h-4 w-4" />
              </Button>
            </div>
            {selectedStyle && (
              <p className="text-xs text-muted-foreground">
                Recommandé pour les bulletins officiels : ton formel et structure complète
              </p>
            )}
          </div>

          {/* Longueur du texte */}
          <div className="space-y-3">
            <Label>Longueur du texte *</Label>
            <Select value={selectedLengthId} onValueChange={onLengthChange}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner une longueur" />
              </SelectTrigger>
              <SelectContent>
                {LENGTH_OPTIONS.map((option) => (
                  <SelectItem key={option.id} value={option.id}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {selectedLength && (
              <p className="text-xs text-muted-foreground">
                {selectedLength.wordRange} mots par appréciation
              </p>
            )}
          </div>

          {/* Résumé et estimation */}
          {totalStudents > 0 && selectedPeriodId && (
            <div className="rounded-lg bg-muted/50 p-4 space-y-2">
              <h4 className="font-medium text-sm">Résumé de la génération</h4>
              <div className="grid gap-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Nombre d'élèves :</span>
                  <span className="font-medium">{totalStudents}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Temps estimé :</span>
                  <span className="font-medium">{estimatedTime}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Budget par élève :</span>
                  <span className="font-medium">≤ 15s</span>
                </div>
              </div>
            </div>
          )}

          {/* Barre de progression pendant la génération */}
          {isGenerating && progress && (
            <div className="space-y-3 rounded-lg border border-primary/20 bg-primary/5 p-4">
              <div className="flex justify-between items-center text-sm">
                <span className="font-medium">Génération en cours...</span>
                <span className="text-muted-foreground">
                  {progress.current}/{progress.total}
                </span>
              </div>
              <Progress
                value={(progress.current / progress.total) * 100}
                className="h-2"
              />
              {progress.currentStudentName && (
                <p className="text-xs text-muted-foreground">
                  En cours : {progress.currentStudentName}
                </p>
              )}
              {progress.estimatedTimeRemaining && (
                <p className="text-xs text-muted-foreground">
                  Temps restant estimé : {progress.estimatedTimeRemaining}
                </p>
              )}
            </div>
          )}
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isGenerating}
          >
            {isGenerating ? "Génération en cours..." : "Annuler"}
          </Button>
          <Button onClick={onGenerate} disabled={!canGenerate}>
            {isGenerating
              ? "Génération..."
              : `Générer pour ${totalStudents} élève${totalStudents > 1 ? "s" : ""}`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
