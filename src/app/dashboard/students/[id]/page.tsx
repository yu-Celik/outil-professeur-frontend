"use client";

import {
  AlertCircle,
  Bot,
  Calendar,
  CheckCircle,
  ChevronDown,
  Clock,
  RotateCcw,
  Save,
  User,
  Users,
} from "lucide-react";
import { use } from "react";
import { Badge } from "@/components/atoms/badge";
import { Button } from "@/components/atoms/button";
import { GradeDisplay } from "@/components/atoms/grade-display";
import { Label } from "@/components/atoms/label";
import { Slider } from "@/components/atoms/slider";
import { Textarea } from "@/components/atoms/textarea";
import { Card, CardContent, CardHeader } from "@/components/molecules/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/molecules/select";
import { useNotationSystem } from "@/hooks/use-notation-system";
import { useUMLEvaluation } from "@/hooks/use-uml-evaluation";

interface StudentEvaluationPageProps {
  params: Promise<{ id: string }>;
  searchParams?: Promise<{ session?: string }>;
}

export default function StudentEvaluationPage({
  params,
  searchParams,
}: StudentEvaluationPageProps) {
  const { id } = use(params);
  const search = use(
    searchParams || Promise.resolve({} as { session?: string }),
  );
  const sessionId = search?.session;

  // Hook basé sur les entités UML complètes
  const {
    courseSession,
    student,
    subject,
    timeSlot,
    class: classEntity,
    participation,
    isLoading,
    hasUnsavedChanges,
    markAttendance,
    setParticipationLevel,
    addRemarks,
    updateBehavior,
    updateTechnicalIssues,
    saveParticipation,
    takeAttendance,
    getSessionSummary,
    canEvaluate,
    getAttendanceRate,
    getParticipationAverage,
  } = useUMLEvaluation(id, sessionId);

  useNotationSystem();

  // Données mock pour la liste des étudiants de la session
  const sessionStudents = [
    { id: "1", name: "Pierre", status: "current", completion: "in_progress" },
    { id: "2", name: "Sacha", status: "pending", completion: "not_started" },
    { id: "3", name: "Paulette", status: "completed", completion: "completed" },
    { id: "4", name: "Roberto", status: "pending", completion: "not_started" },
    { id: "5", name: "Francis", status: "pending", completion: "not_started" },
    { id: "6", name: "Riko", status: "pending", completion: "not_started" },
    { id: "7", name: "Georges", status: "pending", completion: "not_started" },
  ];

  const behaviorOptions = [
    "Attentif",
    "Participatif",
    "Perturbateur",
    "Timide",
    "Collaboratif",
  ];
  const technicalProblems = [
    "Problème caméra",
    "Problème Micro",
    "Problème caméra + micro",
    "Problème réseau",
    "Autre",
  ];

  const toggleBehaviorTag = (tag: string) => {
    if (!participation) return;

    const currentBehaviors = participation.behavior
      .split(",")
      .filter((b) => b.trim());
    const newBehaviors = currentBehaviors.includes(tag)
      ? currentBehaviors.filter((b) => b !== tag)
      : [...currentBehaviors, tag];

    updateBehavior(newBehaviors.join(","));
  };

  const handleSave = async () => {
    try {
      await saveParticipation();
      // Optionnel: notification de succès
    } catch (error) {
      console.error("Erreur lors de la sauvegarde:", error);
    }
  };

  const formatTimeSlot = () => {
    if (!timeSlot || !courseSession) return "";
    return `${courseSession.sessionDate.toLocaleDateString("fr-FR")} | ${timeSlot.startTime} - ${timeSlot.endTime}`;
  };

  const getCompletionBadge = (completion: string) => {
    switch (completion) {
      case "completed":
        return (
          <Badge className="bg-chart-3/10 text-chart-3 border-chart-3/20">
            Terminé
          </Badge>
        );
      case "in_progress":
        return (
          <Badge className="bg-chart-1/10 text-chart-1 border-chart-1/20">
            En cours
          </Badge>
        );
      default:
        return (
          <Badge
            variant="outline"
            className="text-chart-4 bg-chart-4/10 border-chart-4/20"
          >
            À faire
          </Badge>
        );
    }
  };

  if (!canEvaluate()) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <Card className="w-96">
          <CardContent className="p-6 text-center">
            <AlertCircle className="h-12 w-12 text-chart-4 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Accès non autorisé</h3>
            <p className="text-muted-foreground">
              Vous n'avez pas les droits nécessaires pour évaluer cet étudiant
              dans cette session.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header avec contexte UML complet */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Badge variant="outline">{classEntity?.classCode}</Badge>
              <span className="text-lg font-medium">{subject?.name}</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>{formatTimeSlot()}</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span>{timeSlot?.durationMinutes}min</span>
            </div>
          </div>
          <div className="text-sm text-muted-foreground">
            {courseSession?.objectives}
          </div>
        </div>

        {/* Actions avec état UML */}
        <div className="flex items-center gap-2">
          {hasUnsavedChanges && (
            <div className="flex items-center gap-1 text-chart-4">
              <AlertCircle className="h-4 w-4" />
              <span className="text-sm">Modifications non sauvegardées</span>
            </div>
          )}
          <Button
            variant="outline"
            onClick={() => window.location.reload()}
            className="gap-2"
          >
            <RotateCcw className="h-4 w-4" />
            Réinitialiser
          </Button>
          <Button onClick={handleSave} disabled={isLoading} className="gap-2">
            <Save className="h-4 w-4" />
            {isLoading ? "Sauvegarde..." : "Sauvegarder"}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Section d'évaluation basée sur StudentParticipation */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <User className="h-5 w-5 text-primary" />
                  <div>
                    <h2 className="text-xl font-semibold">
                      {student?.fullName()}
                    </h2>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span>
                        Taux de présence:{" "}
                        {Math.round(getAttendanceRate() * 100)}%
                      </span>
                      <span>
                        Participation moyenne:{" "}
                        {getParticipationAverage().toFixed(1)}/20
                      </span>
                    </div>
                  </div>
                </div>
                <Badge
                  variant={participation?.isPresent ? "default" : "destructive"}
                  className={
                    participation?.isPresent
                      ? "bg-chart-3/10 text-chart-3 border-chart-3/20"
                      : ""
                  }
                >
                  {participation?.isPresent ? "Présent" : "Absent"}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Remarques spécifiques (UML: specificRemarks) */}
              <div className="space-y-2">
                <Label>Remarque anecdotique</Label>
                <Textarea
                  placeholder="Saisir une remarque..."
                  value={participation?.specificRemarks || ""}
                  onChange={(e) => addRemarks(e.target.value)}
                  className="min-h-[80px]"
                />
              </div>

              {/* Comportement (UML: behavior) */}
              <div className="space-y-3">
                <Label>Comportement</Label>
                <div className="flex flex-wrap gap-2">
                  {behaviorOptions.map((behavior) => (
                    <Button
                      key={behavior}
                      variant={
                        participation?.behavior.includes(behavior)
                          ? "default"
                          : "outline"
                      }
                      size="sm"
                      onClick={() => toggleBehaviorTag(behavior)}
                      className="h-8"
                    >
                      {behavior}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Participation (UML: participationLevel) */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label>Niveau de participation</Label>
                  <GradeDisplay
                    value={participation?.participationLevel || 0}
                    variant="text"
                    className="text-sm font-medium"
                  />
                </div>
                <Slider
                  value={[participation?.participationLevel || 0]}
                  onValueChange={(value) => setParticipationLevel(value[0])}
                  max={20}
                  step={1}
                  className="w-full"
                />
              </div>

              {/* Problèmes techniques (UML: technicalIssues + cameraEnabled) */}
              <div className="space-y-2">
                <Label>Problème technique</Label>
                <Select
                  value={participation?.technicalIssues || "none"}
                  onValueChange={(value) =>
                    updateTechnicalIssues(value === "none" ? "" : value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Aucun problème" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Aucun problème</SelectItem>
                    {technicalProblems.map((problem) => (
                      <SelectItem key={problem} value={problem}>
                        {problem}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {participation?.technicalIssues &&
                  !participation.cameraEnabled && (
                    <div className="flex items-center gap-2 text-sm text-chart-4">
                      <AlertCircle className="h-4 w-4" />
                      <span>Caméra désactivée</span>
                    </div>
                  )}
              </div>

              {/* Présence/Absence (UML: isPresent + markedAt) */}
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <Label>Présence/Absence</Label>
                  <Select
                    value={participation?.isPresent ? "present" : "absent"}
                    onValueChange={(value) =>
                      markAttendance(value === "present")
                    }
                  >
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="present">Présent</SelectItem>
                      <SelectItem value="absent">Absent</SelectItem>
                    </SelectContent>
                  </Select>
                  {participation?.markedAt && (
                    <p className="text-xs text-muted-foreground">
                      Marqué le {participation.markedAt.toLocaleString("fr-FR")}
                    </p>
                  )}
                </div>
                <Button
                  className="bg-chart-3 hover:bg-chart-3/90 gap-2"
                  onClick={handleSave}
                  disabled={isLoading}
                >
                  <CheckCircle className="h-4 w-4" />
                  {isLoading ? "..." : "Confirmer"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Liste des étudiants de la session */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-primary" />
                <h3 className="font-semibold">
                  Session {classEntity?.classCode}
                </h3>
              </div>
              <p className="text-sm text-muted-foreground">
                {subject?.name} • {timeSlot?.name}
              </p>
            </CardHeader>
            <CardContent className="space-y-2">
              {sessionStudents.map((student) => (
                <div
                  key={student.id}
                  className={`flex items-center justify-between p-3 rounded-lg border transition-colors cursor-pointer ${
                    student.status === "current"
                      ? "bg-primary/5 border-primary/20"
                      : "hover:bg-muted/50"
                  }`}
                >
                  <span className="font-medium">{student.name}</span>
                  <div className="flex items-center gap-2">
                    {getCompletionBadge(student.completion)}
                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Résumé de session (UML: CourseSession.summary()) */}
          <Card>
            <CardHeader>
              <h3 className="font-semibold">Résumé de la session</h3>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-3">
                {getSessionSummary()}
              </p>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Salle:</span>
                  <span>-</span>
                </div>
                <div className="flex justify-between">
                  <span>Durée:</span>
                  <span>{timeSlot?.durationMinutes}min</span>
                </div>
                <div className="flex justify-between">
                  <span>Présences prises:</span>
                  <span>{courseSession?.attendanceTaken ? "Oui" : "Non"}</span>
                </div>
              </div>

              {!courseSession?.attendanceTaken && (
                <Button
                  className="w-full mt-4 gap-2"
                  onClick={takeAttendance}
                  variant="outline"
                >
                  <CheckCircle className="h-4 w-4" />
                  Finaliser les présences
                </Button>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Bouton IA flottant */}
      <div className="fixed bottom-6 right-6">
        <Button size="lg" className="rounded-full w-14 h-14 shadow-lg">
          <Bot className="h-6 w-6" />
        </Button>
      </div>
    </div>
  );
}
