"use client";

import {
  BookOpen,
  Clock,
  Users,
  CheckCircle,
  XCircle,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/atoms/button";
import { SessionStatusBadge } from "@/components/atoms/session-status-badge";
import { getClassById } from "@/features/gestion/mocks";
import { getSubjectById } from "@/features/gestion/mocks";
import { getTimeSlotById } from "@/features/calendar/mocks";
import { getStudentsByClass } from "@/features/students/mocks";
import type { CourseSession } from "@/types/uml-entities";

interface SessionTimelineItemProps {
  session: CourseSession;
  isSelected: boolean;
  onSelect: (sessionId: string) => void;
}

export function SessionTimelineItem({
  session,
  isSelected,
  onSelect,
}: SessionTimelineItemProps) {
  const classData = getClassById(session.classId);
  const subject = getSubjectById(session.subjectId);
  const timeSlot = getTimeSlotById(session.timeSlotId);
  const studentsCount = getStudentsByClass(session.classId).length;

  const sessionTime = timeSlot?.startTime || "Non défini";
  const sessionEndTime = timeSlot?.endTime || "";

  // Déterminer l'état de la séance
  const now = new Date();
  const sessionDateTime = new Date(session.sessionDate);
  const isToday = sessionDateTime.toDateString() === now.toDateString();
  const isPast = sessionDateTime < now;
  const isFuture = sessionDateTime > now;

  // Icône selon le statut
  const getStatusIcon = () => {
    if (session.status === "done")
      return <CheckCircle className="h-4 w-4 text-green-600" />;
    if (session.status === "cancelled")
      return <XCircle className="h-4 w-4 text-red-600" />;
    if (session.status === "planned" && isToday)
      return <AlertCircle className="h-4 w-4 text-orange-600" />;
    return <Clock className="h-4 w-4 text-blue-600" />;
  };

  return (
    <Button
      variant={isSelected ? "default" : "ghost"}
      className={`w-full justify-start text-left p-4 h-auto transition-all duration-200 ${
        isSelected
          ? "bg-primary text-primary-foreground shadow-md border-primary/20"
          : "hover:bg-muted/50 hover:shadow-sm"
      }`}
      onClick={() => onSelect(session.id)}
    >
      <div className="flex items-center gap-4 w-full">
        {/* Indicateur temporel et statut */}
        <div className="flex-shrink-0 flex flex-col items-center gap-1">
          <div className="flex items-center gap-1">
            {getStatusIcon()}
            <span
              className={`font-mono text-sm font-medium ${
                isSelected ? "text-primary-foreground" : "text-foreground"
              }`}
            >
              {sessionTime}
            </span>
          </div>
          {sessionEndTime && (
            <span
              className={`font-mono text-xs ${
                isSelected
                  ? "text-primary-foreground/70"
                  : "text-muted-foreground"
              }`}
            >
              {sessionEndTime}
            </span>
          )}
        </div>

        {/* Séparateur visuel */}
        <div
          className={`w-px h-12 ${
            isSelected
              ? "bg-primary-foreground/20"
              : isPast
                ? "bg-muted-foreground/30"
                : "bg-primary/30"
          }`}
        />

        {/* Contenu principal */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <BookOpen className="h-4 w-4 flex-shrink-0" />
            <span className="font-semibold truncate">
              {subject?.name || session.subjectId}
            </span>
            {session.isMakeup && (
              <span
                className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                  isSelected
                    ? "bg-primary-foreground/20 text-primary-foreground"
                    : "bg-orange-100 text-orange-800"
                }`}
              >
                Rattrapage
              </span>
            )}
          </div>

          <div className="flex items-center gap-4 text-sm">
            <div
              className={`flex items-center gap-1 ${
                isSelected
                  ? "text-primary-foreground/80"
                  : "text-muted-foreground"
              }`}
            >
              <Users className="h-3 w-3" />
              <span>{classData?.classCode || session.classId}</span>
            </div>

            <span
              className={`text-xs ${
                isSelected
                  ? "text-primary-foreground/70"
                  : "text-muted-foreground"
              }`}
            >
              {studentsCount} élève{studentsCount > 1 ? "s" : ""}
            </span>

            {/* Badge de statut */}
            <div className="ml-auto">
              {session.status === "cancelled" && (
                <SessionStatusBadge status="cancelled" />
              )}
            </div>
          </div>

          {/* Notes ou objectifs si disponibles */}
          {(session.objectives || session.notes) && (
            <div
              className={`mt-2 text-xs truncate ${
                isSelected
                  ? "text-primary-foreground/70"
                  : "text-muted-foreground"
              }`}
            >
              {session.objectives || session.notes}
            </div>
          )}
        </div>
      </div>
    </Button>
  );
}
