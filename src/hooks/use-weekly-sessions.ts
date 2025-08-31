"use client";

import { useState, useMemo, useCallback } from "react";
import { WeekSessionGenerator } from "@/services/session-generator";
import { getWeeklyTemplatesForTeacher } from "@/data/mock-weekly-templates";
import { MOCK_SCHOOL_YEARS } from "@/data/mock-school-years";
import type { CourseSession } from "@/types/uml-entities";
import { getWeekStart, isSameDay } from "@/utils/date-utils";

/**
 * Hook pour gérer les sessions générées depuis les templates hebdomadaires
 * Implémente la logique d'observation des séances (pas de gestion d'emploi du temps)
 */
export function useWeeklySessions(dateParam?: string, teacherId?: string) {
  const [currentWeek, setCurrentWeek] = useState<Date>(() => {
    // Initialiser au lundi de la semaine courante
    return getWeekStart(new Date());
  });

  const [loading, setLoading] = useState(false);

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

    return WeekSessionGenerator.generateWeekSessions(
      currentWeek,
      weeklyTemplates,
      [], // Pas d'exceptions
    );
  }, [currentWeek, weeklyTemplates]);

  // Générer toutes les sessions sur une période étendue (pour la page sessions)
  const allSessions = useMemo(() => {
    if (weeklyTemplates.length === 0) return [];

    const sessions: CourseSession[] = [];
    // Générer les sessions pour les 12 derniers mois et 3 mois à venir
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - 12);
    const endDate = new Date();
    endDate.setMonth(endDate.getMonth() + 3);

    // Générer semaine par semaine
    const currentDate = getWeekStart(startDate);
    while (currentDate <= endDate) {
      const weekSessions = WeekSessionGenerator.generateWeekSessions(
        currentDate,
        weeklyTemplates,
        [], // Pas d'exceptions
      );
      sessions.push(...weekSessions);
      currentDate.setDate(currentDate.getDate() + 7);
    }

    return sessions;
  }, [weeklyTemplates]);

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
  };
}