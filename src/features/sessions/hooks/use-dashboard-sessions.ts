"use client";

import { useMemo } from "react";
import { MOCK_CLASSES, MOCK_SUBJECTS } from "@/features/gestion/mocks";
import { MOCK_TIME_SLOTS } from "@/features/calendar/mocks";
import { useWeeklySessions } from "@/features/calendar";
import { combineDateAndTime, isToday } from "@/utils/date-utils";

interface UpcomingSession {
  id: string;
  class: string;
  subject: string;
  time: string;
  duration: string;
  status: string;
}

/**
 * Hook pour récupérer les sessions du dashboard
 * Utilise les sessions générées depuis les templates hebdomadaires
 */
export function useDashboardSessions(teacherId: string) {
  const { getSessionsForDay, weeklyTemplates, activeSchoolYear } =
    useWeeklySessions(teacherId);

  // Sessions d'aujourd'hui
  const todaySessions = useMemo(() => {
    const today = new Date();
    return getSessionsForDay(today);
  }, [getSessionsForDay]);

  // Prochaines sessions à venir (des 7 prochains jours)
  const upcomingSessions = useMemo((): UpcomingSession[] => {
    const now = new Date(); // Revenir à la date courante
    const weekSessions = [];

    // Générer les sessions des 7 prochains jours
    for (let i = 0; i < 7; i++) {
      const date = new Date(now);
      date.setDate(date.getDate() + i);
      const daySessions = getSessionsForDay(date);
      weekSessions.push(...daySessions);
    }

    return weekSessions
      .map((session) => {
        const timeSlot = MOCK_TIME_SLOTS.find(
          (slot) => slot.id === session.timeSlotId,
        );
        const classEntity = MOCK_CLASSES.find(
          (cls) => cls.id === session.classId,
        );
        const subject = MOCK_SUBJECTS.find(
          (sub) => sub.id === session.subjectId,
        );

        if (!timeSlot || !classEntity || !subject) return null;

        const sessionDateTime = combineDateAndTime(
          session.sessionDate,
          timeSlot.startTime,
        );

        return {
          id: session.id,
          class: classEntity.classCode,
          subject: subject.name,
          time: timeSlot.startTime,
          duration: `${timeSlot.durationMinutes}min`,
          status: session.status,
          sessionDateTime, // Pour le tri
        };
      })
      .filter(Boolean) // Enlever les nulls
      .filter((session) => session!.sessionDateTime > now) // Sessions futures seulement
      .sort(
        (a, b) => a!.sessionDateTime.getTime() - b!.sessionDateTime.getTime(),
      ) // Tri chronologique
      .slice(0, 3) // Prendre les 3 prochaines
      .map((session) => {
        const { sessionDateTime, ...rest } = session!;
        return rest;
      });
  }, [todaySessions]);

  // Statistiques du jour
  const todayStats = useMemo(() => {
    const total = todaySessions.length;
    const completed = todaySessions.filter((s) => s.status === "done").length;
    const scheduled = todaySessions.filter(
      (s) => s.status === "planned",
    ).length;
    const cancelled = todaySessions.filter(
      (s) => s.status === "cancelled",
    ).length;

    return {
      total,
      completed,
      scheduled,
      cancelled,
    };
  }, [todaySessions]);

  // Sessions de la semaine pour le widget calendrier
  const weekSessions = useMemo(() => {
    const today = new Date();
    const sessions = [];

    // Générer les sessions des 7 prochains jours
    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() + i);

      const daySessions = getSessionsForDay(date);
      sessions.push(...daySessions);
    }

    return sessions;
  }, [getSessionsForDay]);

  return {
    upcomingSessions,
    todaySessions,
    todayStats,
    weekSessions,
  };
}
