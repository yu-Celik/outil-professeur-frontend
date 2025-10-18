"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useWeeklySessions } from "@/features/calendar";
import { useCourseSessionsApi } from "@/features/calendar/api/use-course-sessions-api";
import { MOCK_TIME_SLOTS } from "@/features/calendar/mocks";
import { useTeachingAssignments } from "@/features/gestion";
import { MOCK_CLASSES, MOCK_SUBJECTS } from "@/features/gestion/mocks";
import {
  getSessionStatusColor,
  getSessionStatusLabel,
} from "@/types/calendar-status";
import type {
  Class,
  CourseSession,
  Subject,
  TimeSlot,
} from "@/types/uml-entities";
import {
  combineDateAndTime,
  formatDateFR,
  getWeekStart,
  isSameDay,
  isToday,
} from "@/utils/date-utils";

export interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  courseSession: CourseSession;
  subject: Subject;
  class: Class;
  timeSlot: TimeSlot;
  canEdit: boolean;
  canView: boolean;
}

export interface CalendarDay {
  date: Date;
  events: CalendarEvent[];
  isToday: boolean;
  isCurrentMonth: boolean;
  hasEvents: boolean;
}

export interface CalendarWeek {
  days: CalendarDay[];
  weekNumber: number;
  weekStart: Date;
}

/**
 * Hook pour gérer le calendrier d'observation des séances
 * Utilise les sessions générées depuis les templates hebdomadaires récurrents
 * Intègre l'API avec fallback sur les données mock
 */
export function useCalendar(teacherId: string) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [loading, setLoading] = useState(true);
  const [dynamicSessions, setDynamicSessions] = useState<CourseSession[]>([]);
  const isDevelopment = process.env.NODE_ENV !== "production";

  const { rights, assignments } = useTeachingAssignments(teacherId);

  // Utiliser les sessions générées depuis les templates hebdomadaires
  const weeklySessionsHook = useWeeklySessions(teacherId);

  // API integration - fetch sessions from backend
  const monthStart = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    1,
  );
  const monthEnd = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() + 1,
    0,
  );

  const courseSessionsApi = useCourseSessionsApi({
    from: monthStart.toISOString().split("T")[0],
    to: monthEnd.toISOString().split("T")[0],
    autoFetch: true,
  });

  const {
    sessions: apiSessions,
    loading: apiSessionsLoading,
    error: apiError,
    refresh: refreshSessions,
    createSession: createCourseSession,
    updateSession: updateCourseSession,
    deleteSession: deleteCourseSession,
  } = courseSessionsApi;

  // Données statiques
  const subjects = MOCK_SUBJECTS;
  const classes = MOCK_CLASSES;
  const timeSlots = MOCK_TIME_SLOTS;

  // Synchroniser la date courante avec le hook des sessions hebdomadaires
  useEffect(() => {
    weeklySessionsHook.navigateToWeek(currentDate);
  }, [currentDate, weeklySessionsHook.navigateToWeek]);

  useEffect(() => {
    setLoading(false);
  }, []);

  // Convertir les sessions en événements calendrier
  const calendarEvents = useMemo(() => {
    const events: CalendarEvent[] = [];
    const processedSessionIds = new Set<string>();

    // Utiliser les sessions API si disponibles, sinon fallback sur les sessions mock
    let sessionsSource: CourseSession[] = [];

    if (apiSessions.length > 0 && !apiError) {
      // API sessions disponibles
      sessionsSource = apiSessions;
    } else {
      // Fallback: Utiliser les sessions générées depuis les templates
      sessionsSource = weeklySessionsHook.allSessions.filter((session) => {
        const sessionDate = new Date(session.sessionDate);
        return (
          sessionDate.getFullYear() === currentDate.getFullYear() &&
          sessionDate.getMonth() === currentDate.getMonth()
        );
      });
    }

    const allSessionsInMonth = sessionsSource;

    // Traiter toutes les sessions du mois (templates + déplacées) en évitant les doublons
    allSessionsInMonth.forEach((session) => {
      // Éviter les doublons
      if (processedSessionIds.has(session.id)) {
        return;
      }
      processedSessionIds.add(session.id);
      const subject = subjects.find((s) => s.id === session.subjectId);
      const classEntity = classes.find((c) => c.id === session.classId);
      const timeSlot = timeSlots.find((t) => t.id === session.timeSlotId);

      if (!subject || !classEntity || !timeSlot) {
        return;
      }

      // Calculer startAt et endAt à partir de sessionDate + timeSlot
      const startDateTime = combineDateAndTime(
        session.sessionDate,
        timeSlot.startTime,
      );
      const endDateTime = combineDateAndTime(
        session.sessionDate,
        timeSlot.endTime,
      );

      const event: CalendarEvent = {
        id: session.id,
        title: `${subject.name} - ${classEntity.classCode}`,
        start: startDateTime,
        end: endDateTime,
        courseSession: session,
        subject,
        class: classEntity,
        timeSlot,
        canEdit: rights.canManageSessions,
        canView: rights.canViewSessions,
      };

      events.push(event);
    });

    // NOTE: dynamicSessions supprimées car allSessions contient déjà toutes les sessions

    return events;
  }, [
    currentDate,
    apiSessions,
    apiError,
    weeklySessionsHook.allSessions,
    subjects,
    classes,
    timeSlots,
    rights,
  ]);

  // Générer les semaines du calendrier pour la vue mois
  const calendarWeeks = useMemo(() => {
    const weeks: CalendarWeek[] = [];
    const monthStart = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      1,
    );
    const monthEnd = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() + 1,
      0,
    );

    const currentWeekStart = getWeekStart(monthStart);
    let weekNumber = 1;

    // Générer les semaines jusqu'à couvrir tout le mois
    while (currentWeekStart <= monthEnd || weekNumber === 1) {
      const days: CalendarDay[] = [];

      for (let i = 0; i < 7; i++) {
        const date = new Date(currentWeekStart);
        date.setDate(date.getDate() + i);

        const dayEvents = calendarEvents.filter((event) =>
          isSameDay(event.start, date),
        );

        const day: CalendarDay = {
          date,
          events: dayEvents,
          isToday: isToday(date),
          isCurrentMonth: date.getMonth() === currentDate.getMonth(),
          hasEvents: dayEvents.length > 0,
        };

        days.push(day);
      }

      const week: CalendarWeek = {
        days,
        weekNumber,
        weekStart: new Date(currentWeekStart),
      };

      weeks.push(week);

      currentWeekStart.setDate(currentWeekStart.getDate() + 7);
      weekNumber++;

      // Arrêter si on a dépassé le mois et qu'on a au moins une semaine
      if (currentWeekStart > monthEnd && weekNumber > 1) {
        break;
      }
    }

    return weeks;
  }, [currentDate, calendarEvents]);

  // Obtenir la semaine courante pour la vue semaine
  const getCurrentWeek = () => {
    const weekStart = getWeekStart(currentDate);
    const days = [];

    for (let i = 0; i < 7; i++) {
      const date = new Date(weekStart);
      date.setDate(date.getDate() + i);

      // Inclure les événements des templates ET des sessions dynamiques
      const dayEvents = calendarEvents.filter((event) =>
        isSameDay(event.start, date),
      );

      days.push({
        date,
        events: dayEvents,
        isToday: isToday(date),
      });
    }

    return days;
  };

  // Statistiques des sessions (intégré depuis use-calendar-sessions)
  const stats = useMemo(() => {
    const completed = calendarEvents.filter(
      (e) => e.courseSession.status === "done",
    ).length;
    const inProgress = calendarEvents.filter(
      (e) => e.courseSession.status === "in_progress",
    ).length;
    const planned = calendarEvents.filter(
      (e) => e.courseSession.status === "planned",
    ).length;
    const cancelled = calendarEvents.filter(
      (e) => e.courseSession.status === "cancelled",
    ).length;

    return {
      completed,
      inProgress,
      planned,
      cancelled,
      total: calendarEvents.length,
    };
  }, [calendarEvents]);

  // Navigation hebdomadaire
  const navigateWeek = useCallback((direction: "prev" | "next") => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev);
      if (direction === "prev") {
        newDate.setDate(newDate.getDate() - 7);
      } else {
        newDate.setDate(newDate.getDate() + 7);
      }
      return newDate;
    });
  }, []);

  const navigateToToday = useCallback(() => {
    setCurrentDate(new Date());
  }, []);

  const navigateToJanuary2025 = useCallback(() => {
    setCurrentDate(new Date(2025, 0, 1)); // Janvier = mois 0
  }, []);

  const navigateToAugust2025 = useCallback(() => {
    setCurrentDate(new Date(2025, 7, 1)); // Août = mois 7
  }, []);

  // Navigation mensuelle
  const navigateMonth = useCallback((direction: "prev" | "next") => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev);
      if (direction === "prev") {
        newDate.setMonth(newDate.getMonth() - 1);
      } else {
        newDate.setMonth(newDate.getMonth() + 1);
      }
      return newDate;
    });
  }, []);

  // Formatage
  const monthYear = useMemo(
    () =>
      formatDateFR(currentDate, {
        month: "long",
        year: "numeric",
      }),
    [currentDate],
  );

  const weekDays = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];

  // Couleurs et labels de statut (maintenant centralisés)
  const getStatusColor = useCallback(getSessionStatusColor, []);
  const getStatusLabel = useCallback(getSessionStatusLabel, []);

  // Fonction pour ajouter une session ponctuelle
  const addSession = useCallback(
    async (sessionData: Partial<CourseSession>) => {
      if (
        !sessionData.classId ||
        !sessionData.subjectId ||
        !sessionData.timeSlotId ||
        !sessionData.sessionDate
      ) {
        throw new Error(
          "Session incomplète - champs manquants pour la création API",
        );
      }

      const created = await createCourseSession(sessionData);
      await refreshSessions();

      if (isDevelopment) {
        console.info(
          "[useCalendar] Session créée via API:",
          created.id,
          created.sessionDate,
        );
      }

      return created;
    },
    [createCourseSession, refreshSessions, isDevelopment],
  );

  // Fonction pour annuler une session
  const cancelSession = useCallback(
    async (sessionId: string) => {
      if (isDevelopment) {
        console.log(`Annulation de la session ${sessionId}`);
      }

      try {
        // Call API to update session status to cancelled
        await updateCourseSession(sessionId, { status: "cancelled" });

        // Refresh sessions from API
        await refreshSessions();

        if (isDevelopment) {
          console.log(`Session ${sessionId} annulée avec succès via API`);
        }
      } catch (error) {
        if (isDevelopment) {
          console.error(
            `Erreur lors de l'annulation de la session ${sessionId}:`,
            error,
          );
        }
        throw error; // Re-throw to let caller handle the error
      }
    },
    [updateCourseSession, refreshSessions, isDevelopment],
  );

  // Fonction pour déplacer une session
  const moveSession = useCallback(
    async (sessionId: string, updates: Partial<CourseSession>) => {
      if (isDevelopment) {
        console.log(`Déplacement de la session ${sessionId}`, updates);
      }

      try {
        // Call API to update the session
        await updateCourseSession(sessionId, updates);

        // Refresh sessions from API
        await refreshSessions();

        if (isDevelopment) {
          console.log(`Session ${sessionId} déplacée avec succès via API`);
        }
      } catch (error) {
        if (isDevelopment) {
          console.error(
            `Erreur lors du déplacement de la session ${sessionId}:`,
            error,
          );
        }
        throw error; // Re-throw to let caller handle the error
      }
    },
    [updateCourseSession, refreshSessions, isDevelopment],
  );

  return {
    // État
    currentDate,
    loading: loading || apiSessionsLoading,
    calendarEvents,
    calendarWeeks,
    monthYear,
    weekDays,
    subjects,
    classes,
    timeSlots,

    // Sessions hebdomadaires (nouveau)
    weeklySessionsHook,
    getCurrentWeek,

    // Statistiques
    stats,

    // API
    api: {
      sessions: apiSessions,
      loading: apiSessionsLoading,
      error: apiError,
      refresh: refreshSessions,
      createSession: createCourseSession,
      updateSession: updateCourseSession,
      deleteSession: deleteCourseSession,
    },

    // Navigation
    navigateWeek,
    navigateMonth,
    navigateToToday,
    navigateToJanuary2025,
    navigateToAugust2025,

    // Actions (local mock actions)
    addSession,
    cancelSession,
    moveSession,

    // Utilitaires
    getStatusColor,
    getStatusLabel,

    // Droits
    rights,
    assignments,
  };
}

// Utilitaires maintenant importés de @/utils/date-utils
