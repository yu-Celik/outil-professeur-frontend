"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { MOCK_CLASSES, MOCK_SUBJECTS, MOCK_TIME_SLOTS } from "@/data";
import { useTeachingAssignments } from "@/hooks/use-teaching-assignments";
import { useWeeklySessions } from "@/hooks/use-weekly-sessions";
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
  isDateInWeek,
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
 */
export function useCalendar(teacherId: string) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [loading, setLoading] = useState(true);
  const [dynamicSessions, setDynamicSessions] = useState<CourseSession[]>([]);

  const { rights, assignments } = useTeachingAssignments(teacherId);

  // Utiliser les sessions générées depuis les templates hebdomadaires
  const weeklySessionsHook = useWeeklySessions(teacherId);

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
    const processedSessionIds = new Set<string>();

    // Utiliser directement allSessions qui contient toutes les sessions sur une période étendue
    const allSessionsInMonth = weeklySessionsHook.allSessions.filter(
      (session) => {
        const sessionDate = new Date(session.sessionDate);
        return (
          sessionDate.getFullYear() === currentDate.getFullYear() &&
          sessionDate.getMonth() === currentDate.getMonth()
        );
      },
    );

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

    // NOTE: dynamicSessions supprimées car allSessions contient déjà toutes les sessions

    return events;
  }, [
    currentDate,
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

      // Créer la nouvelle session avec un ID unique
      const newSession: CourseSession = {
        id: `session-${Date.now()}`,
        createdBy: teacherId,
        classId: sessionData.classId,
        subjectId: sessionData.subjectId,
        timeSlotId: sessionData.timeSlotId,
        sessionDate: sessionData.sessionDate,
        status: sessionData.status || "planned",
        objectives: sessionData.objectives || null,
        content: sessionData.content || null,
        homeworkAssigned: sessionData.homeworkAssigned || null,
        isMakeup: sessionData.isMakeup || false,
        isMoved: sessionData.isMoved ?? false,
        notes: sessionData.notes || null,
        createdAt: new Date(),
        updatedAt: new Date(),
        // Méthodes requises par l'interface (implémentation basique)
        reschedule: () => {},
        takeAttendance: () => {},
        summary: () => `${sessionData.subjectId} - ${sessionData.classId}`,
      };

      // Ajouter la session à l'état local pour mise à jour immediate de l'UI
      setDynamicSessions((prev) => [...prev, newSession]);

      console.log("Nouvelle session créée et ajoutée à l'UI:", newSession);
    },
    [teacherId],
  );

  // Fonction pour annuler une session
  const cancelSession = useCallback(
    (sessionId: string) => {
      console.log(`Annulation de la session ${sessionId}`);

      // Mettre à jour les sessions générées par templates
      weeklySessionsHook.updateSessionStatus(sessionId, "cancelled");

      // Mettre à jour les sessions dynamiques locales
      setDynamicSessions((prev) =>
        prev.map((session) =>
          session.id === sessionId
            ? {
                ...session,
                status: "cancelled" as const,
                updatedAt: new Date(),
              }
            : session,
        ),
      );

      console.log(`Session ${sessionId} annulée avec succès`);
    },
    [weeklySessionsHook],
  );

  // Fonction pour déplacer une session
  const moveSession = useCallback(
    (sessionId: string, updates: Partial<CourseSession>) => {
      console.log(`Déplacement de la session ${sessionId}`, updates);

      // Si on a sessionDate et timeSlotId, utiliser la nouvelle méthode de déplacement
      if (updates.sessionDate && updates.timeSlotId) {
        const newDate = new Date(updates.sessionDate);

        // Trouver la session originale pour obtenir sa date
        const originalSession =
          weeklySessionsHook.weekSessions.find((s) => s.id === sessionId) ||
          dynamicSessions.find((s) => s.id === sessionId);

        if (originalSession) {
          const originalDate = new Date(originalSession.sessionDate);

          // Utiliser la fonction moveSession du hook weekly sessions
          if (weeklySessionsHook.moveSession) {
            weeklySessionsHook.moveSession(
              sessionId,
              newDate,
              updates.timeSlotId,
              originalDate,
            );
          }
        }
      } else {
        // Fallback vers l'ancienne méthode
        weeklySessionsHook.updateSession(sessionId, updates);
      }

      // Mettre à jour les sessions dynamiques locales
      setDynamicSessions((prev) =>
        prev.map((session) =>
          session.id === sessionId
            ? {
                ...session,
                ...updates,
                updatedAt: new Date(),
              }
            : session,
        ),
      );

      console.log(`Session ${sessionId} déplacée avec succès`);
    },
    [weeklySessionsHook, dynamicSessions],
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
    navigateMonth,
    navigateToToday,
    navigateToJanuary2025,
    navigateToAugust2025,

    // Actions
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
