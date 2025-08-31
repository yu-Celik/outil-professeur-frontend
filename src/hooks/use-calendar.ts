"use client";

import { useEffect, useMemo, useState, useCallback } from "react";
import { MOCK_TIME_SLOTS, MOCK_SUBJECTS, MOCK_CLASSES } from "@/data";
import { useTeachingAssignments } from "@/hooks/use-teaching-assignments";
import { useWeeklySessions } from "@/hooks/use-weekly-sessions";
import type {
  CourseSession,
  TimeSlot,
  Subject,
  Class,
} from "@/types/uml-entities";
import {
  getWeekStart,
  isDateInWeek,
  isSameDay,
  isToday,
  combineDateAndTime,
  formatDateFR,
} from "@/utils/date-utils";
import {
  getSessionStatusColor,
  getSessionStatusLabel,
} from "@/types/calendar-status";

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
 */
export function useCalendar(teacherId: string) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [loading, setLoading] = useState(true);

  const { rights, assignments } = useTeachingAssignments(teacherId);

  // Utiliser les sessions générées depuis les templates hebdomadaires
  const weeklySessionsHook = useWeeklySessions(undefined, teacherId);

  // Données statiques
  const subjects = MOCK_SUBJECTS;
  const classes = MOCK_CLASSES;
  const timeSlots = MOCK_TIME_SLOTS;

  // Synchroniser la date courante avec le hook des sessions hebdomadaires
  useEffect(() => {
    weeklySessionsHook.navigateToWeek(currentDate);
  }, [currentDate]);

  useEffect(() => {
    setLoading(false);
  }, []);

  // Convertir les sessions en événements calendrier
  const calendarEvents = useMemo(() => {
    const events: CalendarEvent[] = [];

    // Générer les événements pour le mois courant
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

    // Pour chaque semaine du mois, récupérer les sessions
    let currentWeekStart = getWeekStart(monthStart);

    while (currentWeekStart <= monthEnd) {
      // Utiliser le hook pour cette semaine (on navigue temporairement)
      const weekSessions = weeklySessionsHook.weekSessions.filter((session) =>
        isDateInWeek(session.sessionDate, currentWeekStart),
      );

      weekSessions.forEach((session) => {
        const subject = subjects.find((s) => s.id === session.subjectId);
        const classEntity = classes.find((c) => c.id === session.classId);
        const timeSlot = timeSlots.find((t) => t.id === session.timeSlotId);

        if (!subject || !classEntity || !timeSlot) {
          return null;
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

      // Passer à la semaine suivante
      currentWeekStart = new Date(currentWeekStart);
      currentWeekStart.setDate(currentWeekStart.getDate() + 7);
    }

    return events;
  }, [
    currentDate,
    weeklySessionsHook.weekSessions,
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

    let currentWeekStart = getWeekStart(monthStart);
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
    (sessionData: Partial<CourseSession>) => {
      // Validation des champs requis
      if (
        !sessionData.classId ||
        !sessionData.subjectId ||
        !sessionData.timeSlotId ||
        !sessionData.sessionDate
      ) {
        console.error("Session incomplète - champs manquants:", sessionData);
        return;
      }

      // Pour l'instant, on ajoute juste une exception d'ajout
      // Dans une vraie app, cela créerait une session ponctuelle en base
      const newException = {
        id: `add-${Date.now()}`,
        templateId: "ponctuel",
        exceptionDate: new Date(sessionData.sessionDate),
        type: "added" as const,
        reason: "Session ajoutée manuellement",
        addedSession: {
          id: `session-${Date.now()}`,
          createdBy: "KsmNtVf4zwqO3VV3SQJqPrRlQBA1fFyR",
          classId: sessionData.classId,
          subjectId: sessionData.subjectId,
          timeSlotId: sessionData.timeSlotId,
          sessionDate: sessionData.sessionDate,
          room: sessionData.room || "Salle virtuelle",
          status: sessionData.status || "scheduled",
          attendanceTaken: sessionData.attendanceTaken || false,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      };

      weeklySessionsHook.addException(newException);
    },
    [weeklySessionsHook],
  );

  return {
    // État
    currentDate,
    loading,
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

    // Navigation
    navigateWeek,
    navigateToToday,
    navigateToJanuary2025,
    navigateToAugust2025,

    // Actions
    addSession,

    // Utilitaires
    getStatusColor,
    getStatusLabel,

    // Droits
    rights,
    assignments,
  };
}

// Utilitaires maintenant importés de @/utils/date-utils
