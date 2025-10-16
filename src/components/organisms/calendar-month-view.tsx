"use client";

import { memo } from "react";
import { Clock, Plus } from "lucide-react";
import type { CalendarWeek } from "@/features/calendar";

interface CalendarMonthViewProps {
  weeks: CalendarWeek[];
  weekDays: string[];
  onDayClick?: (date: Date) => void;
  onDayDoubleClick?: (date: Date) => void;
  getEventStatusColor: (status: string) => string;
}

export const CalendarMonthView = memo(function CalendarMonthView({
  weeks,
  weekDays,
  onDayClick,
  onDayDoubleClick,
  getEventStatusColor,
}: CalendarMonthViewProps) {
  return (
    <div className="space-y-4">
      {/* En-têtes des jours */}
      <div className="grid grid-cols-7 gap-1">
        {weekDays.map((day) => (
          <div
            key={day}
            className="p-2 text-center text-sm font-medium text-muted-foreground"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Grille du calendrier */}
      <div className="space-y-1">
        {weeks.map((week) => (
          <div key={week.weekNumber} className="grid grid-cols-7 gap-1">
            {week.days.map((day) => (
              <button
                type="button"
                key={day.date.toISOString()}
                className={`min-h-24 p-2 border rounded-md cursor-pointer hover:bg-muted/50 transition-colors text-left w-full ${
                  day.isToday
                    ? "border-primary bg-primary/5 ring-2 ring-primary/20"
                    : day.isCurrentMonth
                      ? "border-border"
                      : "border-border/50 bg-muted/20"
                }`}
                onClick={() => onDayClick?.(day.date)}
                onDoubleClick={() => onDayDoubleClick?.(day.date)}
                aria-label={`${day.date.toLocaleDateString("fr-FR")} - ${day.events.length} session(s)`}
              >
                <div
                  className={`text-sm mb-1 font-medium ${
                    day.isToday
                      ? "font-bold text-primary"
                      : day.isCurrentMonth
                        ? "text-foreground"
                        : "text-muted-foreground"
                  }`}
                >
                  {day.date.getDate()}
                </div>

                <div className="space-y-1">
                  {day.events.slice(0, 3).map((event) => (
                    <div
                      key={event.id}
                      className={`text-xs p-2 rounded border ${getEventStatusColor(event.courseSession.status)}`}
                    >
                      <div className="font-medium truncate">{event.title}</div>
                      <div className="flex items-center gap-1 mt-1 text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        <span>{event.timeSlot.startTime}</span>
                      </div>
                    </div>
                  ))}
                  {day.events.length > 3 && (
                    <div className="text-xs text-muted-foreground text-center py-1 flex items-center justify-center gap-1">
                      <Plus className="h-3 w-3" />
                      {day.events.length - 3} autre{day.events.length - 3 > 1 ? "s" : ""}
                    </div>
                  )}
                </div>
              </button>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
});
