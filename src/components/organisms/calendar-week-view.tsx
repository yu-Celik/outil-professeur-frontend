"use client";

import { Card, CardContent } from "@/components/molecules/card";
import { CalendarEventCard } from "@/components/molecules/calendar-event-card";
import type { TimeSlot } from "@/types/uml-entities";
import type { SessionException } from "@/services/session-generator";

interface WeekDay {
  date: Date;
  events: any[];
  isToday: boolean;
}

interface CalendarWeekViewProps {
  weekDays: string[];
  timeSlots: TimeSlot[];
  getCurrentWeek: () => WeekDay[];
  getStatusColor: (status: string) => string;
  onExceptionCreate?: (exception: Omit<SessionException, "id">) => void;
  onViewDetails?: (sessionId: string) => void;
  onManageAttendance?: (sessionId: string) => void;
}

export function CalendarWeekView({
  weekDays,
  timeSlots,
  getCurrentWeek,
  getStatusColor,
  onExceptionCreate,
  onViewDetails,
  onManageAttendance,
}: CalendarWeekViewProps) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="space-y-4">
          {/* En-têtes des jours de la semaine */}
          <div className="grid grid-cols-8 gap-2">
            <div className="p-3 text-center text-sm font-semibold text-muted-foreground">
              Heure
            </div>
            {weekDays.map((day, index) => {
              const weekDay = getCurrentWeek()[index];
              return (
                <div
                  key={day}
                  className={`p-3 text-center text-sm font-semibold rounded-lg ${
                    weekDay?.isToday
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted/30 text-muted-foreground"
                  }`}
                >
                  <div>{day}</div>
                  <div className="text-xs mt-1">{weekDay?.date.getDate()}</div>
                </div>
              );
            })}
          </div>

          {/* Grille horaire */}
          <div className="grid grid-cols-8 gap-2">
            {/* Créneaux horaires dynamiques */}
            {timeSlots
              .sort((a, b) => a.displayOrder - b.displayOrder)
              .filter((slot) => !slot.isBreak)
              .map((timeSlot) => (
                <div key={timeSlot.id} className="contents">
                  {/* Colonne horaire */}
                  <div className="p-3 text-xs text-muted-foreground bg-muted/20 rounded-lg text-center font-medium">
                    {timeSlot.name}
                  </div>

                  {/* Cases pour chaque jour */}
                  {getCurrentWeek().map((day, dayIndex) => {
                    const dayEvents = day.events.filter((event) => {
                      const eventTimeSlot = event.timeSlot.id;
                      return eventTimeSlot === timeSlot.id;
                    });

                    return (
                      <div
                        key={`${timeSlot.id}-${dayIndex}`}
                        className={`min-h-20 p-2 border rounded-lg ${
                          day.isToday
                            ? "bg-primary/5 border-primary/20"
                            : "bg-background hover:bg-muted/50"
                        }`}
                      >
                        {dayEvents.map((event) => (
                          <CalendarEventCard
                            key={event.id}
                            event={event}
                            getStatusColor={getStatusColor}
                            compact={false}
                            onExceptionCreate={onExceptionCreate}
                            onViewDetails={onViewDetails}
                            onManageAttendance={onManageAttendance}
                          />
                        ))}
                      </div>
                    );
                  })}
                </div>
              ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
