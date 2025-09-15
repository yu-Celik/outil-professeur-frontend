"use client";

import { useCallback, useState } from "react";
import type { SessionException } from "@/services/session-generator";
import type { CourseSession, TimeSlot } from "@/types/uml-entities";

/**
 * Hook pour gérer les exceptions de sessions (déplacements, annulations, ajouts)
 */
export function useSessionExceptions() {
  const [exceptions, setExceptions] = useState<SessionException[]>([]);

  const addMoveException = useCallback(
    (
      session: CourseSession,
      newDate: Date,
      newTimeSlot: TimeSlot,
      originalDate: Date,
    ) => {
      // Extraire le templateId : session-template-mardi-14h40-onyx-2025-9-2 -> template-mardi-14h40-onyx
      const parts = session.id.split("-");
      const templateId =
        parts.length > 1 ? parts.slice(1, -3).join("-") : session.id;

      // Nettoyer les anciennes exceptions pour cette session/template
      setExceptions((prev) =>
        prev.filter(
          (ex) =>
            !(
              ex.templateId === templateId &&
              (ex.id.includes(`exception-move-${session.id}`) ||
                ex.id.includes(`exception-add-${session.id}`) ||
                ex.id.includes(`exception-cancel-${session.id}`))
            ),
        ),
      );

      // 1. Marquer la session originale comme déplacée (exception moved)
      const moveException: SessionException = {
        id: `exception-move-${session.id}-${Date.now()}`,
        templateId,
        exceptionDate: originalDate,
        type: "moved",
        newTimeSlotId: newTimeSlot.id,
        reason: `Session déplacée vers ${newDate.toLocaleDateString("fr-FR")} ${newTimeSlot.name}`,
      };

      // 2. Créer une nouvelle session à la nouvelle position (normale)
      const addException: SessionException & {
        sessionData?: {
          classId: string;
          subjectId: string;
          createdBy: string;
        };
      } = {
        id: `exception-add-${session.id}-${Date.now()}`,
        templateId: templateId, // Garder le templateId original
        exceptionDate: newDate,
        type: "added",
        newTimeSlotId: newTimeSlot.id,
        reason: `Session déplacée depuis ${originalDate.toLocaleDateString("fr-FR")}`,
        sessionData: {
          classId: session.classId,
          subjectId: session.subjectId,
          createdBy: session.createdBy,
          // status: "planned" par défaut
        },
      };

      // Ajouter les exceptions
      setExceptions((prev) => [...prev, moveException, addException]);

      return { moveException, addException };
    },
    [],
  );

  const addCancelException = useCallback((session: CourseSession) => {
    const exception: SessionException = {
      id: `exception-cancel-${session.id}-${Date.now()}`,
      templateId: session.id.split("-")[1] || session.id,
      exceptionDate: new Date(session.sessionDate),
      type: "cancelled",
      reason: "Session annulée",
    };

    setExceptions((prev) => [...prev, exception]);
    return exception;
  }, []);

  const removeException = useCallback((exceptionId: string) => {
    setExceptions((prev) => prev.filter((ex) => ex.id !== exceptionId));
  }, []);

  const clearAllExceptions = useCallback(() => {
    setExceptions([]);
  }, []);

  const getExceptionsForWeek = useCallback(
    (weekStart: Date) => {
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekEnd.getDate() + 6);

      return exceptions.filter((exception) => {
        const exceptionDate = new Date(exception.exceptionDate);
        return exceptionDate >= weekStart && exceptionDate <= weekEnd;
      });
    },
    [exceptions],
  );

  return {
    exceptions,
    addMoveException,
    addCancelException,
    removeException,
    clearAllExceptions,
    getExceptionsForWeek,
  };
}
