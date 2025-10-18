"use client";

import { useEffect, useState } from "react";

import {
  AlertTriangle,
  BookOpen,
  Camera,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  ClipboardList,
  Eye,
  Star,
  TrendingUp,
  Users,
  Wifi,
  XCircle,
} from "lucide-react";
import { Badge } from "@/components/atoms/badge";
import { Button } from "@/components/atoms/button";
import { Input } from "@/components/atoms/input";
import { Slider } from "@/components/atoms/slider";
import { Switch } from "@/components/atoms/switch";
import { Textarea } from "@/components/atoms/textarea";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/molecules/tooltip";
import { getStudentParticipation } from "@/features/students/mocks";
import type {
  CourseSession,
  Student,
  StudentParticipation,
} from "@/types/uml-entities";

type ParticipationFormState = {
  isPresent: boolean;
  behavior: string;
  participationLevel: number;
  homeworkDone: boolean;
  specificRemarks: string;
  technicalIssues: string;
  cameraEnabled: boolean;
};

const createFormState = (
  data?: StudentParticipation,
): ParticipationFormState => ({
  isPresent: data?.isPresent ?? false,
  behavior: data?.behavior ?? "",
  participationLevel: data?.participationLevel ?? 0,
  homeworkDone: data?.homeworkDone ?? false,
  specificRemarks: data?.specificRemarks ?? "",
  technicalIssues: data?.technicalIssues ?? "",
  cameraEnabled: data?.cameraEnabled ?? false,
});

interface StudentParticipationAccordionProps {
  student: Student;
  session: CourseSession;
  isOpen: boolean;
  onToggle: () => void;
  participation?: StudentParticipation | null;
  onSave?: (participation: Partial<StudentParticipation>) => Promise<void>;
}

export function StudentParticipationAccordion({
  student,
  session,
  isOpen,
  onToggle,
  participation: providedParticipation,
  onSave,
}: StudentParticipationAccordionProps) {
  // Use provided participation from API or fallback to mock for backward compatibility
  const participation =
    providedParticipation ?? getStudentParticipation(student.id, session.id);

  const [formState, setFormState] = useState<ParticipationFormState>(() =>
    createFormState(participation),
  );

  useEffect(() => {
    setFormState(createFormState(participation));
  }, [participation?.id, session.id, student.id]);

  const handleFieldChange = <K extends keyof ParticipationFormState>(
    key: K,
    value: ParticipationFormState[K],
  ) => {
    setFormState((previous) => ({ ...previous, [key]: value }));
  };

  const handleSave = async () => {
    const participationData: Partial<StudentParticipation> = {
      studentId: student.id,
      courseSessionId: session.id,
      isPresent: formState.isPresent,
      behavior: formState.behavior,
      participationLevel: formState.participationLevel,
      homeworkDone: formState.homeworkDone,
      specificRemarks: formState.specificRemarks,
      technicalIssues: formState.technicalIssues,
      cameraEnabled: formState.cameraEnabled,
    };

    if (onSave) {
      // Use provided callback for API save
      await onSave(participationData);
    } else {
      // Fallback to mock mutation for backward compatibility
      if (participation) {
        participation.isPresent = formState.isPresent;
        participation.behavior = formState.behavior;
        participation.participationLevel = formState.participationLevel;
        participation.homeworkDone = formState.homeworkDone;
        participation.specificRemarks = formState.specificRemarks;
        participation.technicalIssues = formState.technicalIssues;
        participation.cameraEnabled = formState.cameraEnabled;
      }

      console.log(
        `[sessions] Participation enregistrée pour ${student.id} - ${session.id}`,
        formState,
      );
    }
  };

  const handleClear = () => {
    setFormState(createFormState());
  };

  const getParticipationStatusBadge = () => {
    if (!formState.isPresent) {
      return (
        <Badge variant="destructive" className="shadow-sm">
          <XCircle className="h-3 w-3 mr-1" />
          Absent
        </Badge>
      );
    }

    const isComplete =
      formState.isPresent &&
      formState.behavior.trim().length > 0 &&
      formState.participationLevel > 0;

    return isComplete ? (
      <Badge className="bg-success text-success-foreground shadow-sm">
        <CheckCircle2 className="h-3 w-3 mr-1" />
        Évalué
      </Badge>
    ) : (
      <Badge variant="secondary" className="shadow-sm">
        <AlertTriangle className="h-3 w-3 mr-1" />
        En cours
      </Badge>
    );
  };

  return (
    <div className="mb-2">
      <button
        onClick={onToggle}
        className="flex items-center justify-between w-full text-left hover:bg-muted/20 rounded-md p-2 transition-all duration-150 group border border-border/30 hover:border-border/50"
      >
        <div className="flex items-center gap-2">
          <div className="p-0.5 rounded-full bg-primary/10 group-hover:bg-primary/20 transition-all duration-150">
            {isOpen ? (
              <ChevronDown className="h-3 w-3 text-primary transition-transform duration-150" />
            ) : (
              <ChevronRight className="h-3 w-3 text-primary transition-transform duration-150" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-medium text-sm text-foreground group-hover:text-foreground/90 transition-colors truncate">
              {student.firstName} {student.lastName}
            </h3>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <Star className="h-3 w-3 text-warning" />
                <span className="font-medium">
                  {formState.participationLevel}/10
                </span>
              </div>
              <div className="h-1 w-1 rounded-full bg-muted-foreground/30" />
              <span className="truncate">
                {formState.behavior.trim() || "Non évalué"}
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 ml-2">
          <div className="hidden md:flex items-center gap-1">
            {formState.cameraEnabled && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <span
                    className="inline-flex"
                    tabIndex={0}
                    aria-label="Caméra activée"
                  >
                    <Camera className="h-3 w-3 text-success" />
                  </span>
                </TooltipTrigger>
                <TooltipContent side="bottom">Caméra activée</TooltipContent>
              </Tooltip>
            )}
            {formState.homeworkDone && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <span
                    className="inline-flex"
                    tabIndex={0}
                    aria-label="Devoirs faits"
                  >
                    <BookOpen className="h-3 w-3 text-primary" />
                  </span>
                </TooltipTrigger>
                <TooltipContent side="bottom">Devoirs faits</TooltipContent>
              </Tooltip>
            )}
          </div>
          {getParticipationStatusBadge()}
        </div>
      </button>

      {isOpen && (
        <div className="mt-2 p-4 bg-muted/20 rounded-md border border-border/30 animate-in slide-in-from-top-2 duration-200">
          <div className="border-t border-border pt-6">
            <div className="flex items-center gap-2 mb-6">
              <div className="p-1 rounded-lg bg-primary/10">
                <Eye className="h-4 w-4 text-primary" />
              </div>
              <h4 className="font-semibold text-foreground">
                Évaluation détaillée
              </h4>
            </div>

            {/* Formulaire de participation pour cet élève */}
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="space-y-3">
                  <label className="block text-sm font-semibold text-foreground flex items-center gap-2">
                    <Users className="h-4 w-4 text-primary" />
                    Présence
                  </label>
                  <div className="flex gap-3">
                    <button
                      className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 flex-1 ${
                        formState.isPresent
                          ? "bg-success text-success-foreground shadow-lg transform scale-105"
                          : "bg-muted text-muted-foreground border border-border hover:bg-muted/80"
                      }`}
                      onClick={() => handleFieldChange("isPresent", true)}
                      type="button"
                    >
                      <CheckCircle2 className="h-4 w-4 mr-1 inline" />
                      Présent
                    </button>
                    <button
                      className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 flex-1 ${
                        !formState.isPresent
                          ? "bg-destructive text-destructive-foreground shadow-lg transform scale-105"
                          : "bg-muted text-muted-foreground border border-border hover:bg-muted/80"
                      }`}
                      onClick={() => handleFieldChange("isPresent", false)}
                      type="button"
                    >
                      <XCircle className="h-4 w-4 mr-1 inline" />
                      Absent
                    </button>
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="block text-sm font-semibold text-foreground flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-warning" />
                    Niveau de participation
                  </label>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">
                        Score
                      </span>
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 text-warning" />
                        <span className="text-lg font-bold text-foreground">
                          {formState.participationLevel}/10
                        </span>
                      </div>
                    </div>
                    <Slider
                      value={[formState.participationLevel]}
                      max={10}
                      min={0}
                      step={1}
                      onValueChange={(value) =>
                        handleFieldChange("participationLevel", value[0] ?? 0)
                      }
                      disabled={!formState.isPresent}
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="block text-sm font-semibold text-foreground flex items-center gap-2">
                    <BookOpen className="h-4 w-4 text-primary" />
                    Devoirs
                  </label>
                  <div className="p-3 rounded-lg bg-muted border border-border flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div
                        className={`p-1.5 rounded-full ${
                          formState.homeworkDone
                            ? "bg-success"
                            : "bg-muted-foreground/30"
                        } transition-all duration-200`}
                      >
                        <CheckCircle2 className="h-3 w-3 text-white" />
                      </div>
                      <span
                        className={`text-sm font-medium ${
                          formState.homeworkDone
                            ? "text-success-foreground"
                            : "text-muted-foreground"
                        }`}
                      >
                        {formState.homeworkDone
                          ? "Devoirs faits"
                          : "Devoirs non faits"}
                      </span>
                    </div>
                    <Switch
                      checked={formState.homeworkDone}
                      onCheckedChange={(value) =>
                        handleFieldChange("homeworkDone", value)
                      }
                      aria-label="Basculer le statut des devoirs"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <label className="block text-sm font-semibold text-foreground flex items-center gap-2">
                    <Star className="h-4 w-4 text-primary" />
                    Comportement
                  </label>
                  <Input
                    placeholder="Décrire le comportement observé"
                    value={formState.behavior}
                    onChange={(event) =>
                      handleFieldChange("behavior", event.target.value)
                    }
                  />
                </div>

                <div className="space-y-3">
                  <label className="block text-sm font-semibold text-foreground flex items-center gap-2">
                    <Camera className="h-4 w-4 text-success" />
                    Statut technique
                  </label>
                  <div className="space-y-2">
                    <div className="p-3 rounded-lg bg-muted border border-border flex items-center gap-3">
                      <Camera
                        className={`h-4 w-4 ${
                          formState.cameraEnabled
                            ? "text-success"
                            : "text-muted-foreground/60"
                        }`}
                      />
                      <span
                        className={`text-sm font-medium ${
                          formState.cameraEnabled
                            ? "text-success-foreground"
                            : "text-muted-foreground"
                        }`}
                      >
                        Caméra{" "}
                        {formState.cameraEnabled ? "activée" : "désactivée"}
                      </span>
                      <Switch
                        checked={formState.cameraEnabled}
                        onCheckedChange={(value) =>
                          handleFieldChange("cameraEnabled", value)
                        }
                        aria-label="Basculer l'état de la caméra"
                        className="ml-auto"
                      />
                    </div>
                    <Input
                      placeholder="Décrire un incident technique (laisser vide si aucun)"
                      value={formState.technicalIssues}
                      onChange={(event) =>
                        handleFieldChange("technicalIssues", event.target.value)
                      }
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <label className="block text-sm font-semibold text-foreground flex items-center gap-2">
                  <ClipboardList className="h-4 w-4 text-muted-foreground" />
                  Remarques spécifiques
                </label>
                <Textarea
                  value={formState.specificRemarks}
                  onChange={(event) =>
                    handleFieldChange("specificRemarks", event.target.value)
                  }
                  className="w-full"
                  rows={3}
                  placeholder="Ajoutez des observations spécifiques..."
                />
              </div>

              {formState.technicalIssues && (
                <div className="space-y-3">
                  <label className="block text-sm font-semibold text-foreground flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-warning" />
                    Incidents techniques
                  </label>
                  <div className="p-4 bg-warning/10 rounded-xl border border-warning/20 shadow-sm">
                    <div className="flex items-start gap-3">
                      <div className="p-1 rounded-full bg-warning mt-0.5">
                        <Wifi className="h-3 w-3 text-warning-foreground" />
                      </div>
                      <div>
                        <div className="text-warning-foreground font-medium text-sm">
                          {formState.technicalIssues}
                        </div>
                        <div className="text-warning-foreground/80 text-xs mt-1">
                          Signalé automatiquement
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex gap-3 justify-end pt-6 border-t border-border">
                <Button
                  size="sm"
                  variant="ghost"
                  className="text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                  type="button"
                  onClick={handleClear}
                >
                  <XCircle className="h-4 w-4 mr-1" />
                  Effacer
                </Button>
                <Button size="sm" type="button" onClick={handleSave}>
                  <CheckCircle2 className="h-4 w-4 mr-1" />
                  Sauvegarder
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
