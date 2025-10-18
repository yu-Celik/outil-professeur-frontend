"use client";

import { CalendarEventCard } from "@/components/molecules/calendar-event-card";
import { Card, CardContent } from "@/components/molecules/card";
import type { CalendarEvent } from "@/features/calendar/hooks/use-calendar";
import type { CourseSession, TimeSlot } from "@/types/uml-entities";

interface WeekDay {
  date: Date;
  events: CalendarEvent[];
  isToday: boolean;
}

interface CalendarWeekViewProps {
  weekDays: string[];
  timeSlots: TimeSlot[];
  getCurrentWeek: () => WeekDay[];
  getStatusColor: (status: string) => string;
  onViewDetails?: (sessionId: string) => void;
  onManageAttendance?: (sessionId: string) => void;
  onMove?: (session: CourseSession) => void;
  onCancel?: (session: CourseSession) => void;
  onCreateSession?: (params: {
    date: Date;
    timeSlotId: string;
    type: "normal" | "makeup";
  }) => void;
}

export function CalendarWeekView({
  weekDays,
  timeSlots,
  getCurrentWeek,
  getStatusColor,
  onViewDetails,
  onManageAttendance,
  onMove,
  onCancel,
  onCreateSession,
}: CalendarWeekViewProps) {
  const now = new Date();
  const currentTime = now.getHours() * 60 + now.getMinutes(); // En minutes depuis minuit

  const isTimeSlotCurrent = (timeSlot: TimeSlot) => {
    if (!timeSlot?.startTime || !timeSlot?.endTime) return false;
    const [startHour, startMin] = timeSlot.startTime.split(":").map(Number);
    const [endHour, endMin] = timeSlot.endTime.split(":").map(Number);
    const slotStart = startHour * 60 + startMin;
    const slotEnd = endHour * 60 + endMin;
    return currentTime >= slotStart && currentTime <= slotEnd;
  };

  const isTimeSlotPast = (timeSlot: TimeSlot) => {
    if (!timeSlot?.endTime) return false;
    const [endHour, endMin] = timeSlot.endTime.split(":").map(Number);
    const slotEnd = endHour * 60 + endMin;
    return currentTime > slotEnd;
  };
  return (
    <Card className="py-0">
      <CardContent className="p-0">
        {/* En-têtes simplifiés */}
        <div className="border-b-2 border-muted/40 bg-muted/50">
          <div className="grid grid-cols-8 gap-0">
            <div className="p-4 text-center text-sm font-bold text-foreground bg-muted/50 border-r-4 border-muted">
              Heure
            </div>
            {weekDays.map((day, index) => {
              const currentWeek = getCurrentWeek();
              const weekDay = currentWeek?.[index];
              return (
                <div
                  key={day}
                  className={`p-4 text-center text-sm font-bold border-r-2 border-muted ${
                    weekDay?.isToday
                      ? "bg-primary/25 text-primary border-l-4 border-l-primary ring-1 ring-primary/20"
                      : "text-foreground bg-muted/40"
                  }`}
                >
                  <div>{day}</div>
                  <div className="text-xs mt-1 font-normal text-muted-foreground">
                    {weekDay?.date?.getDate()}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Grille horaire simplifiée */}
        <div>
          {timeSlots
            .sort((a, b) => a.displayOrder - b.displayOrder)
            .filter((slot) => !slot.isBreak)
            .map((timeSlot) => {
              const isCurrent = isTimeSlotCurrent(timeSlot);
              const isPast = isTimeSlotPast(timeSlot);

              return (
                <div
                  key={timeSlot.id}
                  className="grid grid-cols-8 gap-0 border-b border-muted/40"
                >
                  {/* Colonne horaire */}
                  <div
                    className={`p-4 text-center border-r-4 border-muted ${
                      isCurrent
                        ? "bg-orange-100/80 border-r-orange-200"
                        : isPast
                          ? "bg-muted/50"
                          : "bg-muted/40"
                    }`}
                  >
                    <div
                      className={`text-sm font-bold ${
                        isPast ? "text-muted-foreground" : "text-foreground"
                      }`}
                    >
                      {timeSlot.name}
                      {isCurrent && (
                        <div className="text-xs font-normal mt-1 text-orange-600">
                          ● En cours
                        </div>
                      )}
                    </div>
                    <div className="text-xs mt-1 text-muted-foreground">
                      {timeSlot.startTime} - {timeSlot.endTime}
                    </div>
                  </div>

                  {/* Cases pour chaque jour - simplifiées */}
                  {getCurrentWeek()?.map((day, dayIndex) => {
                    if (!day) return null;
                    const dayEvents =
                      day.events?.filter((event) => {
                        const eventTimeSlot = event?.timeSlot?.id;
                        return eventTimeSlot === timeSlot.id;
                      }) || [];

                    const isPastDay = day.date < now && !day.isToday;
                    const isDayPastTime = day.isToday && isPast;

                    const triggerSessionCreation = () => {
                      if (!onCreateSession || isPastDay || isDayPastTime) {
                        return;
                      }
                      onCreateSession({
                        date: day.date,
                        timeSlotId: timeSlot.id,
                        type: "normal",
                      });
                    };

                    return dayEvents.length > 0 ? (
                      <div
                        key={`${timeSlot.id}-${dayIndex}`}
                        className="space-y-2"
                      >
                        {dayEvents.map((event) => {
                          const isEventCurrent = day.isToday && isCurrent;
                          const cellClasses = `min-h-24 p-2 border-r border-muted/50 ${
                            day.isToday && isCurrent
                              ? "bg-orange-100 border-l-4 border-l-primary ring-1 ring-primary/20"
                              : day.isToday
                                ? "bg-primary/20 border-l-4 border-l-primary ring-1 ring-primary/20"
                                : isPastDay || isDayPastTime
                                  ? "bg-muted/10"
                                  : "bg-background hover:bg-muted/5"
                          }`;

                          return (
                            <CalendarEventCard
                              key={event.id}
                              event={event}
                              getStatusColor={getStatusColor}
                              compact={false}
                              onViewDetails={onViewDetails}
                              onManageAttendance={onManageAttendance}
                              onMove={onMove}
                              onCancel={onCancel}
                              isCurrentEvent={isEventCurrent}
                              cellClasses={cellClasses}
                            />
                          );
                        })}
                      </div>
                    ) : (
                      <button
                        key={`${timeSlot.id}-${dayIndex}`}
                        className={`min-h-24 p-2 w-full text-left border-r border-muted/50 group relative ${
                          day.isToday && isCurrent
                            ? "bg-orange-100 border-l-4 border-l-primary ring-1 ring-primary/20"
                            : day.isToday
                              ? "bg-primary/20 border-l-4 border-l-primary ring-1 ring-primary/20"
                              : isPastDay || isDayPastTime
                                ? "bg-muted/10"
                                : "bg-background hover:bg-muted/5 cursor-pointer"
                        }`}
                        type="button"
                        disabled={isPastDay || isDayPastTime}
                        aria-label={`Créer une session le ${day.date.toLocaleDateString("fr-FR")} sur le créneau ${timeSlot.name}`}
                        onClick={triggerSessionCreation}
                      >
                        {/* Indicateur de clic pour les cellules vides (seulement futures) */}
                        {!(isPastDay || isDayPastTime) && (
                          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                            <div className="text-xs text-muted-foreground bg-background/80 px-2 py-1 rounded border">
                              + Nouvelle session
                            </div>
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              );
            })}
        </div>
      </CardContent>
    </Card>
  );
}
