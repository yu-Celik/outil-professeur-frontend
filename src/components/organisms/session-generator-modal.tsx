"use client";

import {
  Calendar as CalendarIcon,
  Play,
  X,
  AlertCircle,
  CheckCircle2,
  Loader2,
} from "lucide-react";
import { useState, useEffect } from "react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Button } from "@/components/atoms/button";
import { Label } from "@/components/atoms/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/atoms/dialog";
import { Calendar } from "@/components/atoms/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/atoms/popover";
import { Progress } from "@/components/atoms/progress";
import type { WeeklyTemplate } from "@/types/uml-entities";
import { useSessionGeneration } from "@/features/weekly-templates";

interface SessionGeneratorModalProps {
  isOpen: boolean;
  onClose: () => void;
  template: WeeklyTemplate;
  templateName: string;
  onSuccess?: (count: number) => void;
}

export function SessionGeneratorModal({
  isOpen,
  onClose,
  template,
  templateName,
  onSuccess,
}: SessionGeneratorModalProps) {
  const {
    generating,
    progress,
    error,
    generateSessions,
    calculateSessionCount,
    reset,
  } = useSessionGeneration();

  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  const [sessionCount, setSessionCount] = useState(0);
  const [showSuccess, setShowSuccess] = useState(false);
  const [generatedCount, setGeneratedCount] = useState(0);

  // Calculate session count when dates change
  useEffect(() => {
    if (startDate && endDate) {
      const count = calculateSessionCount(template, startDate, endDate);
      setSessionCount(count);
    } else {
      setSessionCount(0);
    }
  }, [startDate, endDate, template, calculateSessionCount]);

  const handleGenerate = async () => {
    if (!startDate || !endDate) return;

    try {
      const result = await generateSessions(template, startDate, endDate);
      setGeneratedCount(result.successful);
      setShowSuccess(true);

      // Notify parent of success
      if (onSuccess) {
        onSuccess(result.successful);
      }

      // Auto-close after success
      setTimeout(() => {
        handleClose();
      }, 3000);
    } catch (err) {
      console.error("Erreur lors de la génération:", err);
    }
  };

  const handleClose = () => {
    if (!generating) {
      setStartDate(undefined);
      setEndDate(undefined);
      setSessionCount(0);
      setShowSuccess(false);
      setGeneratedCount(0);
      reset();
      onClose();
    }
  };

  const isValid = startDate && endDate && sessionCount > 0;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Play className="h-5 w-5 text-primary" />
            Générer des sessions
          </DialogTitle>
          <DialogDescription>
            Créer automatiquement des sessions depuis le template :{" "}
            {templateName}
          </DialogDescription>
        </DialogHeader>

        {!showSuccess ? (
          <div className="space-y-6">
            {/* Date Range Selection */}
            <div className="grid grid-cols-2 gap-4">
              {/* Start Date */}
              <div className="space-y-2">
                <Label>Date de début</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                      disabled={generating}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {startDate ? (
                        format(startDate, "dd MMM yyyy", { locale: fr })
                      ) : (
                        <span>Choisir</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={startDate}
                      onSelect={setStartDate}
                      disabled={generating}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              {/* End Date */}
              <div className="space-y-2">
                <Label>Date de fin</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                      disabled={generating}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {endDate ? (
                        format(endDate, "dd MMM yyyy", { locale: fr })
                      ) : (
                        <span>Choisir</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={endDate}
                      onSelect={setEndDate}
                      disabled={(date) =>
                        generating || (startDate ? date < startDate : false)
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            {/* Preview */}
            {isValid && !generating && (
              <div className="p-4 bg-primary/10 border border-primary/20 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">Sessions à créer</p>
                    <p className="text-xs text-muted-foreground">
                      Du {format(startDate, "dd MMM", { locale: fr })} au{" "}
                      {format(endDate, "dd MMM yyyy", { locale: fr })}
                    </p>
                  </div>
                  <div className="text-3xl font-bold text-primary">
                    {sessionCount}
                  </div>
                </div>
              </div>
            )}

            {/* Progress */}
            {generating && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">
                    Génération en cours...
                  </span>
                  <span className="font-medium">{Math.round(progress)}%</span>
                </div>
                <Progress value={progress} className="h-2" />
              </div>
            )}

            {/* Error */}
            {error && (
              <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg flex items-start gap-2">
                <AlertCircle className="h-4 w-4 text-destructive mt-0.5" />
                <p className="text-sm text-destructive">{error}</p>
              </div>
            )}

            {/* Actions */}
            <div className="flex justify-end gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={generating}
              >
                <X className="h-4 w-4 mr-2" />
                Annuler
              </Button>
              <Button
                onClick={handleGenerate}
                disabled={!isValid || generating}
              >
                {generating ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Génération...
                  </>
                ) : (
                  <>
                    <Play className="h-4 w-4 mr-2" />
                    Générer {sessionCount} session{sessionCount > 1 ? "s" : ""}
                  </>
                )}
              </Button>
            </div>
          </div>
        ) : (
          /* Success State */
          <div className="py-8 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center mx-auto">
              <CheckCircle2 className="h-8 w-8 text-green-500" />
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-1">
                {generatedCount} session{generatedCount > 1 ? "s" : ""} créée
                {generatedCount > 1 ? "s" : ""} avec succès
              </h3>
              <p className="text-sm text-muted-foreground">
                Les sessions sont maintenant visibles dans votre calendrier
              </p>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
