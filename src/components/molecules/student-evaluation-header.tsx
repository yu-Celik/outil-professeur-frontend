"use client";

import { AlertCircle, Calendar, Clock, RotateCcw, Save } from "lucide-react";
import { Badge } from "@/components/atoms/badge";
import { Button } from "@/components/atoms/button";
import type {
  Class,
  CourseSession,
  Subject,
  TimeSlot,
} from "@/types/uml-entities";

interface StudentEvaluationHeaderProps {
  courseSession: CourseSession | null;
  subject: Subject | null;
  timeSlot: TimeSlot | null;
  classEntity: Class | null;
  hasUnsavedChanges: boolean;
  isLoading: boolean;
  onSave: () => void;
  onReset: () => void;
}

export function StudentEvaluationHeader({
  courseSession,
  subject,
  timeSlot,
  classEntity,
  hasUnsavedChanges,
  isLoading,
  onSave,
  onReset,
}: StudentEvaluationHeaderProps) {
  const formatTimeSlot = () => {
    if (!timeSlot || !courseSession) return "";
    return `${courseSession.sessionDate.toLocaleDateString("fr-FR")} | ${timeSlot.startTime} - ${timeSlot.endTime}`;
  };

  return (
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
        <Button variant="outline" onClick={onReset} className="gap-2">
          <RotateCcw className="h-4 w-4" />
          Réinitialiser
        </Button>
        <Button onClick={onSave} disabled={isLoading} className="gap-2">
          <Save className="h-4 w-4" />
          {isLoading ? "Sauvegarde..." : "Sauvegarder"}
        </Button>
      </div>
    </div>
  );
}
