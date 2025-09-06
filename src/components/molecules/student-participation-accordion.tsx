"use client";

import {
  ChevronDown,
  ChevronRight,
  Users,
  TrendingUp,
  Star,
  Eye,
  Camera,
  Wifi,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  BookOpen,
  ClipboardList,
} from "lucide-react";
import { Badge } from "@/components/atoms/badge";
import { Button } from "@/components/atoms/button";
import { Card, CardContent, CardHeader } from "@/components/molecules/card";
import { getStudentParticipation } from "@/data/mock-student-participation";
import type { CourseSession, Student } from "@/types/uml-entities";

interface StudentParticipationAccordionProps {
  student: Student;
  session: CourseSession;
  isOpen: boolean;
  onToggle: () => void;
}

export function StudentParticipationAccordion({
  student,
  session,
  isOpen,
  onToggle,
}: StudentParticipationAccordionProps) {
  // Récupérer la vraie participation de l'élève pour cette session
  const participation = getStudentParticipation(student.id, session.id);

  // Données par défaut si pas de participation enregistrée
  const participationData = participation || {
    isPresent: false,
    behavior: "Non évalué",
    participationLevel: 0,
    homeworkDone: false,
    specificRemarks: "",
    technicalIssues: "",
    cameraEnabled: false,
  };

  const getParticipationStatusBadge = () => {
    if (!participationData.isPresent) {
      return (
        <Badge variant="destructive" className="shadow-sm">
          <XCircle className="h-3 w-3 mr-1" />
          Absent
        </Badge>
      );
    }

    const isComplete = participationData.isPresent &&
      participationData.behavior &&
      participationData.participationLevel > 0;

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
    <Card className="mb-4 shadow-md hover:shadow-lg transition-all duration-300 bg-card/95 backdrop-blur-sm">
      <CardHeader className="pb-2">
        <button
          onClick={onToggle}
          className="flex items-center justify-between w-full text-left hover:bg-muted/50 rounded-xl p-4 transition-all duration-300 group"
        >
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="p-1 rounded-full bg-primary/10 group-hover:bg-primary/20 transition-all duration-300">
                {isOpen ? (
                  <ChevronDown className="h-4 w-4 text-primary transition-transform duration-200" />
                ) : (
                  <ChevronRight className="h-4 w-4 text-primary transition-transform duration-200" />
                )}
              </div>
              <div className="p-2 rounded-xl bg-primary/10 shadow-sm">
                <Users className="h-5 w-5 text-primary" />
              </div>
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-lg text-foreground group-hover:text-foreground/90 transition-colors">
                {student.firstName} {student.lastName}
              </h3>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <TrendingUp className="h-3 w-3" />
                <span>Participation</span>
                <div className="h-1 w-1 rounded-full bg-muted-foreground/30" />
                <div className="flex items-center gap-1">
                  <Star className="h-3 w-3 text-warning" />
                  <span className="font-medium text-muted-foreground">{participationData.participationLevel}/10</span>
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex flex-col items-end gap-1">
              <div className="text-sm font-medium text-muted-foreground">
                {participationData.behavior}
              </div>
              <div className="flex items-center gap-2">
                {participationData.cameraEnabled && <Camera className="h-3 w-3 text-success" />}
                {participationData.homeworkDone && <BookOpen className="h-3 w-3 text-primary" />}
                <Wifi className="h-3 w-3 text-muted-foreground/60" />
              </div>
            </div>
            <div className="flex flex-col items-end gap-2">
              {getParticipationStatusBadge()}
            </div>
          </div>
        </button>
      </CardHeader>

      {isOpen && (
        <CardContent className="pt-0 animate-in slide-in-from-top-2 duration-300">
          <div className="border-t border-border pt-6">
            <div className="flex items-center gap-2 mb-6">
              <div className="p-1 rounded-lg bg-primary/10">
                <Eye className="h-4 w-4 text-primary" />
              </div>
              <h4 className="font-semibold text-foreground">Évaluation détaillée</h4>
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
                      className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 flex-1 ${participationData.isPresent
                          ? 'bg-success text-success-foreground shadow-lg transform scale-105'
                          : 'bg-muted text-muted-foreground border border-border hover:bg-muted/80'
                        }`}
                    >
                      <CheckCircle2 className="h-4 w-4 mr-1 inline" />
                      Présent
                    </button>
                    <button
                      className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 flex-1 ${!participationData.isPresent
                          ? 'bg-destructive text-destructive-foreground shadow-lg transform scale-105'
                          : 'bg-muted text-muted-foreground border border-border hover:bg-muted/80'
                        }`}
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
                      <span className="text-sm text-muted-foreground">Score</span>
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 text-warning" />
                        <span className="text-lg font-bold text-foreground">{participationData.participationLevel}/10</span>
                      </div>
                    </div>
                    <div className="relative">
                      <div className="h-3 bg-muted rounded-full overflow-hidden shadow-inner">
                        <div
                          className="h-full bg-gradient-to-r from-warning via-warning/80 to-destructive rounded-full transition-all duration-500 shadow-sm"
                          style={{ width: `${participationData.participationLevel * 10}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="block text-sm font-semibold text-foreground flex items-center gap-2">
                    <BookOpen className="h-4 w-4 text-primary" />
                    Devoirs
                  </label>
                  <div className="p-3 rounded-lg bg-muted border border-border">
                    <div className="flex items-center gap-3">
                      <div className={`p-1.5 rounded-full ${participationData.homeworkDone
                          ? 'bg-success'
                          : 'bg-muted-foreground/30'
                        } transition-all duration-200`}>
                        <CheckCircle2 className="h-3 w-3 text-white" />
                      </div>
                      <span className={`text-sm font-medium ${participationData.homeworkDone
                          ? 'text-success-foreground'
                          : 'text-muted-foreground'
                        }`}>
                        {participationData.homeworkDone ? "Devoirs faits" : "Devoirs non faits"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <label className="block text-sm font-semibold text-foreground flex items-center gap-2">
                    <Star className="h-4 w-4 text-primary" />
                    Comportement
                  </label>
                  <div className="p-4 bg-primary/5 rounded-xl border border-primary/10 shadow-sm">
                    <div className="flex items-center gap-2">
                      <div className="p-1 rounded-full bg-primary">
                        <div className="h-2 w-2 bg-primary-foreground rounded-full" />
                      </div>
                      <span className="text-primary font-medium">{participationData.behavior}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="block text-sm font-semibold text-foreground flex items-center gap-2">
                    <Camera className="h-4 w-4 text-success" />
                    Statut technique
                  </label>
                  <div className="space-y-2">
                    <div className="p-3 rounded-lg bg-muted border border-border">
                      <div className="flex items-center gap-3">
                        <Camera className={`h-4 w-4 ${participationData.cameraEnabled ? 'text-success' : 'text-muted-foreground/60'
                          }`} />
                        <span className={`text-sm font-medium ${participationData.cameraEnabled ? 'text-success-foreground' : 'text-muted-foreground'
                          }`}>
                          Caméra {participationData.cameraEnabled ? "activée" : "désactivée"}
                        </span>
                        <div className={`ml-auto h-2 w-2 rounded-full ${participationData.cameraEnabled ? 'bg-success' : 'bg-muted-foreground/30'
                          } animate-pulse`} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <label className="block text-sm font-semibold text-foreground flex items-center gap-2">
                  <ClipboardList className="h-4 w-4 text-muted-foreground" />
                  Remarques spécifiques
                </label>
                <div className="relative">
                  <textarea
                    value={participationData.specificRemarks || "Aucune remarque particulière pour cette séance"}
                    className="w-full p-4 border-2 border-border rounded-xl text-sm bg-background focus:border-primary focus:ring-4 focus:ring-primary/20 transition-all duration-200 resize-none"
                    rows={3}
                    placeholder="Ajoutez des observations spécifiques..."
                    readOnly
                  />
                  <div className="absolute top-2 right-2">
                    <div className="p-1 rounded bg-muted">
                      <Eye className="h-3 w-3 text-muted-foreground" />
                    </div>
                  </div>
                </div>
              </div>

              {participationData.technicalIssues && (
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
                          {participationData.technicalIssues}
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
                <Button size="sm" variant="outline">
                  <Eye className="h-4 w-4 mr-1" />
                  Modifier
                </Button>
                <Button size="sm" variant="ghost" className="text-muted-foreground hover:text-destructive hover:bg-destructive/10">
                  <XCircle className="h-4 w-4 mr-1" />
                  Effacer
                </Button>
                <Button size="sm">
                  <CheckCircle2 className="h-4 w-4 mr-1" />
                  Sauvegarder
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      )}
    </Card>
  );
}