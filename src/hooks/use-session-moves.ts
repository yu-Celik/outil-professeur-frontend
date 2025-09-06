"use client";

import { useState, useCallback } from "react";
import type { CourseSession, TimeSlot } from "@/types/uml-entities";
import {
  showSessionMoveToast,
  showSessionMoveErrorToast,
  showSessionUndoMoveToast,
} from "@/components/atoms/toast-notifications";

interface MoveOperation {
  sessionId: string;
  originalDate: Date;
  originalTimeSlotId: string;
  newDate: Date;
  newTimeSlotId: string;
  timestamp: number;
}

export function useSessionMoves() {
  const [recentMoves, setRecentMoves] = useState<MoveOperation[]>([]);

  const moveSession = useCallback(
    (
      sessionId: string,
      newDate: Date,
      newTimeSlot: TimeSlot,
      originalSession: CourseSession,
      onUpdate: (sessionId: string, updates: Partial<CourseSession>) => void,
    ) => {
      try {
        // Store move operation for undo
        const moveOp: MoveOperation = {
          sessionId,
          originalDate: new Date(originalSession.sessionDate),
          originalTimeSlotId: originalSession.timeSlotId,
          newDate,
          newTimeSlotId: newTimeSlot.id,
          timestamp: Date.now(),
        };

        // Apply the move
        onUpdate(sessionId, {
          sessionDate: newDate.toISOString().split("T")[0],
          timeSlotId: newTimeSlot.id,
          status: "moved" as const,
          originalDateTime: formatDateTime(
            new Date(originalSession.sessionDate),
            originalSession.timeSlotId,
          ),
        });

        // Add to recent moves
        setRecentMoves((prev) => [moveOp, ...prev.slice(0, 4)]); // Keep only last 5 moves

        // Format new date time for toast
        const newDateTime = formatDateTime(newDate, newTimeSlot.id);

        // Show success toast with undo option
        showSessionMoveToast({
          newDateTime,
          onUndo: () => undoMove(moveOp, onUpdate),
        });
      } catch (error) {
        showSessionMoveErrorToast(
          error instanceof Error
            ? error.message
            : "Une erreur inconnue s'est produite",
        );
      }
    },
    [],
  );

  const undoMove = useCallback(
    (
      moveOp: MoveOperation,
      onUpdate: (sessionId: string, updates: Partial<CourseSession>) => void,
    ) => {
      // Restore original session data
      onUpdate(moveOp.sessionId, {
        sessionDate: moveOp.originalDate.toISOString().split("T")[0],
        timeSlotId: moveOp.originalTimeSlotId,
        status: "scheduled" as const,
        originalDateTime: undefined,
      });

      // Remove from recent moves
      setRecentMoves((prev) =>
        prev.filter((op) => op.sessionId !== moveOp.sessionId),
      );

      showSessionUndoMoveToast();
    },
    [],
  );

  const formatDateTime = (date: Date, timeSlotId: string): string => {
    const dateStr = new Intl.DateTimeFormat("fr-FR", {
      weekday: "short",
      day: "numeric",
      month: "short",
    }).format(date);

    // This would typically come from your time slots data
    // For now, using the timeSlotId as fallback
    const timeStr = timeSlotId.includes("-")
      ? timeSlotId.split("-").slice(1).join("-")
      : timeSlotId;

    return `${dateStr} ${timeStr}`;
  };

  return {
    moveSession,
    recentMoves,
  };
}
