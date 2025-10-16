"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/molecules/card";
import { CalendarHeader } from "@/components/organisms/calendar-header";
import { CalendarMonthView } from "@/components/organisms/calendar-month-view";
import { CalendarWeekView } from "@/components/organisms/calendar-week-view";
import { SessionDetailModal } from "@/components/organisms/session-detail-modal";
import {
  useCalendar,
  useCalendarNavigation,
  useCalendarSessions,
  type CalendarEvent,
} from "@/features/calendar";

interface CalendarVisualProps {
  teacherId: string;
  className?: string;
  onCreateSession?: (date: Date) => void;
  onEditSession?: (event: CalendarEvent) => void;
}

/**
 * Composant calendrier visuel complet avec navigation mois/semaine
 * Implémente Story 2.1 - Calendrier Visuel des Sessions
 */
export function CalendarVisual({
  teacherId,
  className = "",
  onCreateSession,
  onEditSession,
}: CalendarVisualProps) {
  const {
    currentDate,
    view,
    toggleView,
    setViewMode,
    goToPrevious,
    goToNext,
    goToToday,
    getCurrentPeriodLabel,
  } = useCalendarNavigation();

  const {
    calendarEvents,
    calendarWeeks,
    loading,
    weekDays,
    getCurrentWeek,
    getStatusColor,
    rights,
  } = useCalendar(teacherId);

  const { stats, getEventsForDay } = useCalendarSessions({
    sessions: calendarEvents.map((e) => e.courseSession),
    canEdit: rights.canManageSessions,
    canView: rights.canViewSessions,
  });

  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  const handleDayClick = (date: Date) => {
    setSelectedDate(date);
    setIsDetailModalOpen(true);
  };

  const handleDayDoubleClick = (date: Date) => {
    onCreateSession?.(date);
  };

  const getEventStatusColor = (status: string) => {
    switch (status) {
      case "done":
        return "bg-chart-3/10 text-chart-3 border-chart-3/20";
      case "in_progress":
        return "bg-chart-1/10 text-chart-1 border-chart-1/20";
      case "planned":
        return "bg-chart-4/10 text-chart-4 border-chart-4/20";
      case "cancelled":
        return "bg-muted text-muted-foreground border-border";
      default:
        return "bg-muted text-muted-foreground border-border";
    }
  };

  if (loading) {
    return (
      <Card className={className}>
        <CardContent className="p-8 text-center">
          <div className="text-lg font-medium mb-2">
            Chargement du calendrier...
          </div>
          <div className="text-sm text-muted-foreground">
            Récupération des sessions de cours
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card className={className}>
        <CardContent className="p-6 space-y-6">
          <CalendarHeader
            currentPeriodLabel={getCurrentPeriodLabel()}
            view={view}
            onToggleView={toggleView}
            onSetView={setViewMode}
            onGoToPrevious={goToPrevious}
            onGoToNext={goToNext}
            onGoToToday={goToToday}
            statsCompleted={stats.completed}
            statsInProgress={stats.inProgress}
            statsPlanned={stats.planned}
          />

          {view === "month" && (
            <CalendarMonthView
              weeks={calendarWeeks}
              weekDays={weekDays}
              onDayClick={handleDayClick}
              onDayDoubleClick={handleDayDoubleClick}
              getEventStatusColor={getEventStatusColor}
            />
          )}

          {view === "week" && (
            <CalendarWeekView
              weekDays={weekDays}
              timeSlots={[]} // Will be populated from useCalendar
              getCurrentWeek={getCurrentWeek}
              getStatusColor={getStatusColor}
            />
          )}
        </CardContent>
      </Card>

      <SessionDetailModal
        date={selectedDate}
        events={selectedDate ? getEventsForDay(selectedDate) : []}
        isOpen={isDetailModalOpen}
        onClose={() => {
          setIsDetailModalOpen(false);
          setSelectedDate(null);
        }}
        onCreateSession={onCreateSession}
        onEditSession={onEditSession}
        getStatusColor={getEventStatusColor}
      />
    </>
  );
}
