"use client";

import { AlertCircle, CheckCircle, User } from "lucide-react";
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
} from "@/components/atoms/select";
import type { Student, StudentParticipation } from "@/types/uml-entities";

interface StudentEvaluationFormProps {
  student: Student | null;
  participation: StudentParticipation | null;
  isLoading: boolean;
  getAttendanceRate: () => number;
  getParticipationAverage: () => number;
  markAttendance: (isPresent: boolean) => void;
  setParticipationLevel: (level: number) => void;
  addRemarks: (remarks: string) => void;
  updateBehavior: (behavior: string) => void;
  updateTechnicalIssues: (issues: string) => void;
  onSave: () => void;
}

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

export function StudentEvaluationForm({
  student,
  participation,
  isLoading,
  getAttendanceRate,
  getParticipationAverage,
  markAttendance,
  setParticipationLevel,
  addRemarks,
  updateBehavior,
  updateTechnicalIssues,
  onSave,
}: StudentEvaluationFormProps) {
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

  return (
    <Card>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <User className="h-5 w-5 text-primary" />
            <div>
              <h2 className="text-xl font-semibold">{student?.fullName()}</h2>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span>
                  Taux de présence: {Math.round(getAttendanceRate() * 100)}%
                </span>
                <span>
                  Participation moyenne: {getParticipationAverage().toFixed(1)}
                  /20
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
          {participation?.technicalIssues && !participation.cameraEnabled && (
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
              onValueChange={(value) => markAttendance(value === "present")}
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
            onClick={onSave}
            disabled={isLoading}
          >
            <CheckCircle className="h-4 w-4" />
            {isLoading ? "..." : "Confirmer"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
