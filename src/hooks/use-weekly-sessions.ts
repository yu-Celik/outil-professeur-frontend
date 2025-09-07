"use client";

import { useCallback, useMemo, useState } from "react";
import { getCompletedSessionsForTeacher } from "@/data/mock-completed-sessions";
import { MOCK_SCHOOL_YEARS } from "@/data/mock-school-years";
import { getWeeklyTemplatesForTeacher } from "@/data/mock-weekly-templates";
import { WeekSessionGenerator } from "@/services/session-generator";
import type { CourseSession } from "@/types/uml-entities";
import { getWeekStart, isDateInWeek, isSameDay } from "@/utils/date-utils";

/**
 * Hook pour gérer les sessions générées depuis les templates hebdomadaires
 * Implémente la logique d'observation des séances (pas de gestion d'emploi du temps)
 */
export function useWeeklySessions(teacherId?: string, dateParam?: string) {
  const [currentWeek, setCurrentWeek] = useState<Date>(() => {
    // Initialiser au lundi de la semaine courante
    return getWeekStart(new Date());
  });

  const [loading, setLoading] = useState(false);

  // State simple pour les sessions modifiées
  const [modifiedSessions, setModifiedSessions] = useState<
    Map<string, CourseSession>
  >(new Map());
  // On n'a plus besoin des exceptions complexes

  // Récupérer l'année scolaire active
  const activeSchoolYear = MOCK_SCHOOL_YEARS.find((year) => year.isActive);

  // Récupérer les templates hebdomadaires du professeur
  const weeklyTemplates = useMemo(() => {
    if (!activeSchoolYear || !teacherId) return [];
    return getWeeklyTemplatesForTeacher(teacherId).filter(
      (template) => template.schoolYearId === activeSchoolYear.id,
    );
  }, [teacherId, activeSchoolYear?.id]);

  // Générer les sessions de la semaine courante
  const weekSessions = useMemo(() => {
    if (weeklyTemplates.length === 0) return [];

    const sessions: CourseSession[] = [];

    // Générer les sessions depuis les templates
    weeklyTemplates.forEach((template) => {
      const sessionDate = new Date(currentWeek);
      sessionDate.setDate(sessionDate.getDate() + (template.dayOfWeek - 1)); // 1=Lundi, 2=Mardi, etc.

      // Vérifier si la session a été modifiée
      const sessionId = `session-${template.id}-${sessionDate.getFullYear()}-${sessionDate.getMonth() + 1}-${sessionDate.getDate()}`;
      const modifiedSession = modifiedSessions.get(sessionId);

      const session: CourseSession = modifiedSession || {
        id: sessionId,
        createdBy: template.teacherId,
        classId: template.classId,
        subjectId: template.subjectId,
        timeSlotId: template.timeSlotId,
        sessionDate: sessionDate,
        status: "planned",
        objectives: null,
        content: null,
        homeworkAssigned: null,
        isMakeup: false,
        isMoved: false,
        notes: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        reschedule: (_newDate: Date) => {},
        takeAttendance: () => {},
        summary: () => `Session depuis template ${template.id}`,
      };

      sessions.push(session);
    });

    // Ajouter les sessions déplacées vers cette semaine
    Array.from(modifiedSessions.values()).forEach((session) => {
      if (
        session.id.startsWith("session-moved-") &&
        isDateInWeek(session.sessionDate, currentWeek)
      ) {
        sessions.push(session);
      }
    });

    return sessions;
  }, [currentWeek, weeklyTemplates, modifiedSessions]);

  // Générer toutes les sessions sur une période étendue (pour la page sessions)
  const allSessions = useMemo(() => {
    const sessions: CourseSession[] = [];

    // Ajouter les sessions complétées (historique)
    if (teacherId) {
      const completedSessions = getCompletedSessionsForTeacher(teacherId);
      sessions.push(...completedSessions);
    }

    // Générer les sessions futures depuis les templates
    if (weeklyTemplates.length > 0) {
      // Générer les sessions pour 3 mois (passé et futur)
      const startDate = new Date();
      startDate.setMonth(startDate.getMonth() - 2);
      const endDate = new Date();
      endDate.setMonth(endDate.getMonth() + 1);

      // Générer semaine par semaine
      let currentWeekDate = getWeekStart(startDate);

      while (currentWeekDate <= endDate) {
        weeklyTemplates.forEach((template) => {
          const sessionDate = new Date(currentWeekDate);
          sessionDate.setDate(sessionDate.getDate() + (template.dayOfWeek - 1));

          // Vérifier si la session a été modifiée
          const sessionId = `session-${template.id}-${sessionDate.getFullYear()}-${sessionDate.getMonth() + 1}-${sessionDate.getDate()}`;
          const modifiedSession = modifiedSessions.get(sessionId);

          const session: CourseSession = modifiedSession || {
            id: sessionId,
            createdBy: template.teacherId,
            classId: template.classId,
            subjectId: template.subjectId,
            timeSlotId: template.timeSlotId,
            sessionDate: sessionDate,
            status: "planned",
            objectives: null,
            content: null,
            homeworkAssigned: null,
            isMakeup: false,
            isMoved: false,
            notes: null,
            createdAt: new Date(),
            updatedAt: new Date(),
            reschedule: (_newDate: Date) => {},
            takeAttendance: () => {},
            summary: () => `Session depuis template ${template.id}`,
          };

          sessions.push(session);
        });

        // Passer à la semaine suivante
        currentWeekDate = new Date(currentWeekDate);
        currentWeekDate.setDate(currentWeekDate.getDate() + 7);
      }

      // Ajouter toutes les sessions déplacées
      Array.from(modifiedSessions.values()).forEach((session) => {
        if (session.id.startsWith("session-moved-")) {
          sessions.push(session);
        }
      });
    }

    // Trier par date
    return sessions.sort(
      (a, b) =>
        new Date(a.sessionDate).getTime() - new Date(b.sessionDate).getTime(),
    );
  }, [weeklyTemplates, modifiedSessions, teacherId]);

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
    return {
      total,
      cancelled: 0,
      moved: 0,
      added: 0,
      normal: total,
    };
  };

  /**
   * Mettre à jour le statut d'une session
   */
  const updateSessionStatus = useCallback(
    (sessionId: string, status: string) => {
      console.log(
        `Mise à jour du statut de la session ${sessionId} vers "${status}"`,
      );

      if (status === "canceled") {
        // Trouver la session dans les sessions actuelles
        const session =
          weekSessions.find((s) => s.id === sessionId) ||
          allSessions.find((s) => s.id === sessionId);

        if (session) {
          // Marquer comme annulée avec le statut UML
          setModifiedSessions((prev) => {
            const newMap = new Map(prev);
            const canceledSession = {
              ...session,
              status: "canceled" as const,
            };
            newMap.set(session.id, canceledSession);
            return newMap;
          });
        }
      }
    },
    [weekSessions, allSessions],
  );

  /**
   * Déplacer une session vers une nouvelle date/heure
   */
  const moveSession = useCallback(
    (
      sessionId: string,
      newDate: Date,
      newTimeSlotId: string,
      originalDate: Date,
    ) => {
      console.log(
        `Déplacement de la session ${sessionId} vers ${newDate.toISOString()} ${newTimeSlotId}`,
      );

      // Trouver la session dans les sessions actuelles
      const originalSession =
        weekSessions.find((s) => s.id === sessionId) ||
        allSessions.find((s) => s.id === sessionId);

      if (originalSession) {
        setModifiedSessions((prev) => {
          const newMap = new Map(prev);

          // 1. Marquer la session originale comme déplacée
          const movedOriginal = {
            ...originalSession,
            isMoved: true,
          };
          newMap.set(originalSession.id, movedOriginal);

          // 2. Créer une nouvelle session à la nouvelle position
          const newSession: CourseSession = {
            ...originalSession,
            id: `session-moved-${sessionId}-${Date.now()}`,
            sessionDate: newDate,
            timeSlotId: newTimeSlotId,
            status: "planned",
            notes: `Session déplacée depuis ${originalSession.sessionDate.toLocaleDateString("fr-FR")}`,
            updatedAt: new Date(),
          };
          newMap.set(newSession.id, newSession);

          return newMap;
        });
      }
    },
    [weekSessions, allSessions],
  );

  /**
   * Mettre à jour une session avec de nouvelles données (legacy pour compatibilité)
   */
  const updateSession = useCallback(
    (sessionId: string, updates: Partial<CourseSession>) => {
      console.log(`Mise à jour de la session ${sessionId}`, updates);

      // Si c'est un déplacement, utiliser la nouvelle méthode
      if (updates.sessionDate && updates.timeSlotId) {
        const originalSession =
          weekSessions.find((s) => s.id === sessionId) ||
          allSessions.find((s) => s.id === sessionId);

        if (originalSession) {
          const newDate = new Date(updates.sessionDate);
          const originalDate = new Date(originalSession.sessionDate);
          moveSession(sessionId, newDate, updates.timeSlotId, originalDate);
        }
      }
    },
    [weekSessions, allSessions, moveSession],
  );

  return {
    // État
    currentWeek,
    weekSessions,
    allSessions,
    loading,
    activeSchoolYear,
    weeklyTemplates,

    // Navigation
    navigateToPreviousWeek,
    navigateToNextWeek,
    navigateToCurrentWeek,
    navigateToWeek,

    // Utilitaires
    getSessionsForDay,
    getWeekSummary,

    // Actions
    updateSessionStatus,
    updateSession,
    moveSession,
  };
}
