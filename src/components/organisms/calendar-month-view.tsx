"use client";

import { memo } from "react";
import { Card, CardContent } from "@/components/molecules/card";
import { CalendarEventCard } from "@/components/molecules/calendar-event-card";
import type { CalendarWeek } from "@/hooks/use-calendar";
import type { SessionException } from "@/services/session-generator";

interface CalendarMonthViewProps {
  calendarWeeks: CalendarWeek[];
  weekDays: string[];
  getStatusColor: (status: string) => string;
  onDayClick: (date: Date) => void;
  onExceptionCreate?: (exception: Omit<SessionException, "id">) => void;
  onViewDetails?: (sessionId: string) => void;
  onManageAttendance?: (sessionId: string) => void;
}

export const CalendarMonthView = memo<CalendarMonthViewProps>(
  function CalendarMonthView({
    calendarWeeks,
    weekDays,
    getStatusColor,
    onDayClick,
    onExceptionCreate,
    onViewDetails,
    onManageAttendance,
  }) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="space-y-4">
            {/* En-têtes des jours */}
            <div className="grid grid-cols-7 gap-2">
              {weekDays.map((day) => (
                <div
                  key={day}
                  className="p-3 text-center text-sm font-semibold text-muted-foreground bg-muted/30 rounded-lg"
                >
                  {day}
                </div>
              ))}
            </div>

            {/* Grille du calendrier */}
            <div className="space-y-2">
              {calendarWeeks.map((week) => (
                <div key={week.weekNumber} className="grid grid-cols-7 gap-2">
                  {week.days.map((day) => (
                    <Card
                      key={day.date.toISOString()}
                      className={`min-h-32 cursor-pointer transition-all duration-200 hover:shadow-md ${
                        day.isToday
                          ? "ring-2 ring-primary bg-primary/5"
                          : day.isCurrentMonth
                            ? "hover:bg-muted/50"
                            : "opacity-60 bg-muted/20"
                      }`}
                      onClick={() => onDayClick(day.date)}
                    >
                      <CardContent className="p-3 h-full">
                        <div
                          className={`text-sm font-medium mb-2 ${
                            day.isToday
                              ? "text-primary font-bold"
                              : day.isCurrentMonth
                                ? "text-foreground"
                                : "text-muted-foreground"
                          }`}
                        >
                          {day.date.getDate()}
                        </div>

                        <div className="space-y-1">
                          {day.events.slice(0, 2).map((event) => (
                            <CalendarEventCard
                              key={event.id}
                              event={event}
                              getStatusColor={getStatusColor}
                              compact={true}
                              onExceptionCreate={onExceptionCreate}
                              onViewDetails={onViewDetails}
                              onManageAttendance={onManageAttendance}
                            />
                          ))}
                          {day.events.length > 2 && (
                            <div className="text-xs text-muted-foreground text-center p-1">
                              +{day.events.length - 2} autres
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  },
);
