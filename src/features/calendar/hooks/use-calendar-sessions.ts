"use client";

import { useMemo } from "react";
import { MOCK_CLASSES, MOCK_SUBJECTS } from "@/features/gestion/mocks";
import { MOCK_TIME_SLOTS } from "@/features/calendar/mocks";
import type {
  Class,
  CourseSession,
  Subject,
  TimeSlot,
} from "@/types/uml-entities";
import { combineDateAndTime } from "@/utils/date-utils";
import { filterSessionsByDateRange, groupSessionsByDay } from "@/utils/calendar-utils";
import type { CalendarEvent } from "./use-calendar";

export interface UseCalendarSessionsOptions {
  sessions: CourseSession[];
  startDate?: Date;
  endDate?: Date;
  canEdit?: boolean;
  canView?: boolean;
}

/**
 * Hook pour gérer l'intégration des sessions dans le calendrier
 * Filtre, groupe et transforme les sessions en événements calendrier
 */
export function useCalendarSessions({
  sessions,
  startDate,
  endDate,
  canEdit = true,
  canView = true,
}: UseCalendarSessionsOptions) {
  const subjects = MOCK_SUBJECTS;
  const classes = MOCK_CLASSES;
  const timeSlots = MOCK_TIME_SLOTS;

  // Filtrer les sessions par plage de dates
  const filteredSessions = useMemo(() => {
    if (!startDate || !endDate) return sessions;
    return filterSessionsByDateRange(sessions, startDate, endDate);
  }, [sessions, startDate, endDate]);

  // Convertir les sessions en événements calendrier
  const calendarEvents = useMemo(() => {
    const events: CalendarEvent[] = [];

    for (const session of filteredSessions) {
      const subject = subjects.find((s) => s.id === session.subjectId);
      const classEntity = classes.find((c) => c.id === session.classId);
      const timeSlot = timeSlots.find((t) => t.id === session.timeSlotId);

      if (!subject || !classEntity || !timeSlot) {
        continue;
      }

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
        canEdit,
        canView,
      };

      events.push(event);
    }

    return events;
  }, [filteredSessions, subjects, classes, timeSlots, canEdit, canView]);

  // Grouper les événements par jour
  const eventsByDay = useMemo(() => {
    return groupSessionsByDay(filteredSessions);
  }, [filteredSessions]);

  // Statistiques
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

  // Obtenir les événements d'un jour spécifique
  const getEventsForDay = (date: Date): CalendarEvent[] => {
    return calendarEvents.filter(
      (event) => event.start.toDateString() === date.toDateString(),
    );
  };

  // Obtenir les événements pour une plage de dates
  const getEventsForRange = (start: Date, end: Date): CalendarEvent[] => {
    return calendarEvents.filter(
      (event) => event.start >= start && event.start <= end,
    );
  };

  return {
    calendarEvents,
    eventsByDay,
    stats,
    getEventsForDay,
    getEventsForRange,
    subjects,
    classes,
    timeSlots,
  };
}
