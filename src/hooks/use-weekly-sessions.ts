"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import {
  WeekSessionGenerator,
  type SessionException,
} from "@/services/session-generator";
import { getWeeklyTemplatesForTeacher } from "@/data/mock-weekly-templates";
import { MOCK_SCHOOL_YEARS } from "@/data/mock-school-years";
import { MOCK_SESSION_EXCEPTIONS } from "@/data/mock-session-exceptions";
import type { CourseSession } from "@/types/uml-entities";
import { getWeekStart, isDateInWeek, isSameDay } from "@/utils/date-utils";

/**
 * Hook pour gérer les sessions générées depuis les templates hebdomadaires
 * Implémente la logique d'observation des séances (pas de gestion d'emploi du temps)
 */
export function useWeeklySessions(teacherId: string) {
  const [currentWeek, setCurrentWeek] = useState<Date>(() => {
    // Initialiser au lundi de la semaine courante
    return getWeekStart(new Date());
  });

  const [exceptions, setExceptions] = useState<SessionException[]>(
    MOCK_SESSION_EXCEPTIONS,
  );
  const [loading, setLoading] = useState(false);

  // Récupérer l'année scolaire active
  const activeSchoolYear = MOCK_SCHOOL_YEARS.find((year) => year.isActive);

  // Récupérer les templates hebdomadaires du professeur
  const weeklyTemplates = useMemo(() => {
    if (!activeSchoolYear) return [];
    return getWeeklyTemplatesForTeacher(teacherId).filter(
      (template) => template.schoolYearId === activeSchoolYear.id,
    );
  }, [teacherId, activeSchoolYear?.id]);

  // Générer les sessions de la semaine courante
  const weekSessions = useMemo(() => {
    if (weeklyTemplates.length === 0) return [];

    return WeekSessionGenerator.generateWeekSessions(
      currentWeek,
      weeklyTemplates,
      exceptions.filter((exc) => isDateInWeek(exc.exceptionDate, currentWeek)),
    );
  }, [currentWeek, weeklyTemplates, exceptions]);

  /**
   * Naviguer vers la semaine précédente
   */
  const navigateToPreviousWeek = useCallback(() => {
    setCurrentWeek((prev) => {
      const newWeek = new Date(prev);
      newWeek.setDate(newWeek.getDate() - 7);
      return newWeek;
    });
  }, []);

  /**
   * Naviguer vers la semaine suivante
   */
  const navigateToNextWeek = useCallback(() => {
    setCurrentWeek((prev) => {
      const newWeek = new Date(prev);
      newWeek.setDate(newWeek.getDate() + 7);
      return newWeek;
    });
  }, []);

  /**
   * Naviguer vers la semaine courante
   */
  const navigateToCurrentWeek = useCallback(() => {
    setCurrentWeek(getWeekStart(new Date()));
  }, []);

  /**
   * Naviguer vers une semaine spécifique
   */
  const navigateToWeek = useCallback((date: Date) => {
    setCurrentWeek(getWeekStart(date));
  }, []);

  /**
   * Ajouter une exception (annulation, déplacement, ajout)
   */
  const addException = (exception: SessionException) => {
    setExceptions((prev) => [...prev, exception]);
  };

  /**
   * Supprimer une exception
   */
  const removeException = (exceptionId: string) => {
    setExceptions((prev) => prev.filter((exc) => exc.id !== exceptionId));
  };

  /**
   * Annuler une session
   */
  const cancelSession = (templateId: string, date: Date, reason: string) => {
    const cancellation: SessionException = {
      id: `cancel-${templateId}-${date.getTime()}`,
      templateId,
      exceptionDate: date,
      type: "cancelled",
      reason,
    };
    addException(cancellation);
  };

  /**
   * Déplacer une session
   */
  const moveSession = (
    templateId: string,
    date: Date,
    newTimeSlotId: string,
    newRoom?: string,
    reason?: string,
  ) => {
    const move: SessionException = {
      id: `move-${templateId}-${date.getTime()}`,
      templateId,
      exceptionDate: date,
      type: "moved",
      newTimeSlotId,
      newRoom,
      reason,
    };
    addException(move);
  };

  /**
   * Ajouter une session exceptionnelle
   */
  const addExceptionalSession = (
    date: Date,
    timeSlotId: string,
    classId: string,
    subjectId: string,
    room: string,
    reason: string,
  ) => {
    // Note: Pour un ajout complet, on devrait étendre SessionException
    // Ici on fait une version simplifiée
    const addition: SessionException = {
      id: `add-${date.getTime()}`,
      templateId: "", // Pas de template pour un ajout
      exceptionDate: date,
      type: "added",
      newTimeSlotId: timeSlotId,
      newRoom: room,
      reason,
    };
    addException(addition);
  };

  /**
   * Obtenir les sessions d'un jour spécifique
   */
  const getSessionsForDay = useCallback(
    (date: Date): CourseSession[] => {
      return weekSessions.filter((session) =>
        isSameDay(session.sessionDate, date),
      );
    },
    [weekSessions],
  );

  /**
   * Obtenir le résumé de la semaine
   */
  const getWeekSummary = () => {
    const total = weekSessions.length;
    const cancelled = exceptions.filter(
      (exc) =>
        exc.type === "cancelled" &&
        isDateInWeek(exc.exceptionDate, currentWeek),
    ).length;
    const moved = exceptions.filter(
      (exc) =>
        exc.type === "moved" && isDateInWeek(exc.exceptionDate, currentWeek),
    ).length;
    const added = exceptions.filter(
      (exc) =>
        exc.type === "added" && isDateInWeek(exc.exceptionDate, currentWeek),
    ).length;

    return {
      total,
      cancelled,
      moved,
      added,
      normal: total - cancelled - moved + added,
    };
  };

  return {
    // État
    currentWeek,
    weekSessions,
    exceptions,
    loading,
    activeSchoolYear,
    weeklyTemplates,

    // Navigation
    navigateToPreviousWeek,
    navigateToNextWeek,
    navigateToCurrentWeek,
    navigateToWeek,

    // Exceptions
    addException,
    removeException,
    cancelSession,
    moveSession,
    addExceptionalSession,

    // Utilitaires
    getSessionsForDay,
    getWeekSummary,
  };
}

// Utilitaires maintenant importés de @/utils/date-utils
