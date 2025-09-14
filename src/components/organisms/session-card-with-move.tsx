"use client";

import * as React from "react";
import { SessionStatusBadge } from "@/components/atoms/session-status-badge";
import { Card } from "@/components/molecules/card";
import { SessionContextMenu } from "@/components/molecules/session-context-menu";
import { SessionMoveDialog } from "@/components/molecules/session-move-dialog";
import { useSessionMoves } from "@/hooks/use-session-moves";
import type {
  Class,
  CourseSession,
  Subject,
  TimeSlot,
} from "@/types/uml-entities";

interface SessionCardWithMoveProps {
  session: CourseSession;
  sessionClass: Class;
  subject: Subject;
  timeSlots: TimeSlot[];
  allSessions: CourseSession[]; // For conflict detection
  onUpdate: (sessionId: string, updates: Partial<CourseSession>) => void;
  onViewDetails: (sessionId: string) => void;
  onManageAttendance: (sessionId: string) => void;
  className?: string;
}

/**
 * Carte de séance avec fonctionnalité de déplacement intégrée
 * Exemple d'intégration complète du système de déplacement
 */
export function SessionCardWithMove({
  session,
  sessionClass,
  subject,
  timeSlots,
  allSessions,
  onUpdate,
  onViewDetails,
  onManageAttendance,
  className,
}: SessionCardWithMoveProps) {
  const [showMoveDialog, setShowMoveDialog] = React.useState(false);
  const { moveSession } = useSessionMoves();

  const timeSlot = timeSlots.find((ts) => ts.id === session.timeSlotId);

  const formatSessionTime = () => {
    if (!timeSlot) return "Horaire non défini";
    return timeSlot.name;
  };

  const getConflictingSessions = (newDate: Date, newTimeSlot: TimeSlot) => {
    return allSessions.filter((cs) => {
      const csDate = new Date(cs.sessionDate);
      return (
        csDate.toDateString() === newDate.toDateString() &&
        cs.timeSlotId === newTimeSlot.id &&
        cs.classId === session.classId &&
        cs.id !== session.id
      );
    });
  };

  const handleMoveSession = (
    sessionId: string,
    newDate: Date,
    newTimeSlot: TimeSlot,
  ) => {
    moveSession(sessionId, newDate, newTimeSlot, session, onUpdate);
  };

  const handleOpenMoveDialog = () => {
    setShowMoveDialog(true);
  };

  return (
    <>
      <Card className={`p-4 space-y-3 ${className}`}>
        {/* En-tête avec menu contextuel */}
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <h3 className="font-medium text-sm">{subject.name}</h3>
            <p className="text-xs text-muted-foreground">
              {sessionClass.classCode} • {formatSessionTime()}
            </p>
          </div>

          <SessionContextMenu
            session={session}
            onViewDetails={onViewDetails}
            onManageAttendance={onManageAttendance}
            onMove={handleOpenMoveDialog}
            canMove={session.status !== "cancelled"}
          />
        </div>

        {/* Badges de statut */}
        <div className="flex gap-2">
          {session.isMoved && (
            <SessionStatusBadge
              status="moved"
            />
          )}
          {session.status === "cancelled" && (
            <SessionStatusBadge
              status="cancelled"
            />
          )}
        </div>

        {/* Contenu supplémentaire de la séance */}
        {session.content && (
          <p className="text-xs text-muted-foreground">{session.content}</p>
        )}
      </Card>

      {/* Dialog de déplacement */}
      <SessionMoveDialog
        open={showMoveDialog}
        onOpenChange={setShowMoveDialog}
        session={session}
        sessionClass={sessionClass}
        subject={subject}
        timeSlots={timeSlots}
        onMove={handleMoveSession}
        conflictingSessions={allSessions}
      />
    </>
  );
}
