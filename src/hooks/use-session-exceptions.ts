"use client";

import { useState, useCallback } from "react";
import type { SessionException } from "@/services/session-generator";
import { MOCK_SESSION_EXCEPTIONS } from "@/data";

/**
 * Hook pour gérer les exceptions de sessions (ajustements ponctuels)
 * Permet d'ajouter, modifier et supprimer des exceptions
 */
export function useSessionExceptions(teacherId: string) {
  const [exceptions, setExceptions] = useState<SessionException[]>(
    MOCK_SESSION_EXCEPTIONS,
  );

  /**
   * Ajoute une nouvelle exception
   */
  const addException = useCallback(
    (exception: Omit<SessionException, "id">) => {
      const newException: SessionException = {
        ...exception,
        id: `exception-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      };

      setExceptions((prev) => [...prev, newException]);

      // TODO: En production, persister en base de données
      console.log("Exception ajoutée:", newException);

      return newException;
    },
    [],
  );

  /**
   * Supprime une exception (pour annuler un ajustement)
   */
  const removeException = useCallback((exceptionId: string) => {
    setExceptions((prev) => prev.filter((exc) => exc.id !== exceptionId));

    // TODO: En production, supprimer de la base de données
    console.log("Exception supprimée:", exceptionId);
  }, []);

  /**
   * Annule une session (crée une exception de type cancelled)
   */
  const cancelSession = useCallback(
    (templateId: string, date: Date, reason: string) => {
      const cancellation: Omit<SessionException, "id"> = {
        templateId,
        exceptionDate: date,
        type: "cancelled",
        reason,
      };

      return addException(cancellation);
    },
    [addException],
  );

  /**
   * Déplace une session (crée une exception de type moved)
   */
  const moveSession = useCallback(
    (
      templateId: string,
      date: Date,
      newTimeSlotId: string,
      newRoom?: string,
      reason?: string,
    ) => {
      const move: Omit<SessionException, "id"> = {
        templateId,
        exceptionDate: date,
        type: "moved",
        newTimeSlotId,
        newRoom,
        reason,
      };

      return addException(move);
    },
    [addException],
  );

  /**
   * Programme un rattrapage (crée une exception de type added)
   */
  const scheduleReplacement = useCallback(
    (
      originalDate: Date,
      makeupDate: Date,
      timeSlotId: string,
      classId: string,
      subjectId: string,
      room: string,
      reason: string,
    ) => {
      const replacement: Omit<SessionException, "id"> = {
        templateId: "", // Pas de template pour un rattrapage
        exceptionDate: makeupDate,
        type: "added",
        newTimeSlotId: timeSlotId,
        newRoom: room,
        reason: `Rattrapage du ${originalDate.toLocaleDateString("fr-FR")} - ${reason}`,
        // TODO: Ajouter classId et subjectId si nécessaire dans SessionException
      };

      return addException(replacement);
    },
    [addException],
  );

  /**
   * Obtient toutes les exceptions pour une semaine donnée
   */
  const getExceptionsForWeek = useCallback(
    (weekStart: Date): SessionException[] => {
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekEnd.getDate() + 6);

      return exceptions.filter(
        (exception) =>
          exception.exceptionDate >= weekStart &&
          exception.exceptionDate <= weekEnd,
      );
    },
    [exceptions],
  );

  /**
   * Obtient les exceptions pour un template spécifique
   */
  const getExceptionsForTemplate = useCallback(
    (templateId: string): SessionException[] => {
      return exceptions.filter(
        (exception) => exception.templateId === templateId,
      );
    },
    [exceptions],
  );

  /**
   * Vérifie si une session est affectée par une exception
   */
  const isSessionAffected = useCallback(
    (templateId: string, date: Date): SessionException | null => {
      return (
        exceptions.find(
          (exc) =>
            exc.templateId === templateId &&
            exc.exceptionDate.toDateString() === date.toDateString(),
        ) || null
      );
    },
    [exceptions],
  );

  /**
   * Statistiques des exceptions
   */
  const getExceptionStats = useCallback(() => {
    const total = exceptions.length;
    const cancelled = exceptions.filter(
      (exc) => exc.type === "cancelled",
    ).length;
    const moved = exceptions.filter((exc) => exc.type === "moved").length;
    const added = exceptions.filter((exc) => exc.type === "added").length;

    return {
      total,
      cancelled,
      moved,
      added,
    };
  }, [exceptions]);

  return {
    // État
    exceptions,

    // Actions
    addException,
    removeException,
    cancelSession,
    moveSession,
    scheduleReplacement,

    // Requêtes
    getExceptionsForWeek,
    getExceptionsForTemplate,
    isSessionAffected,
    getExceptionStats,
  };
}
