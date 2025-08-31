"use client";

import { Card, CardContent } from "@/components/molecules/card";
import { CalendarEventCard } from "@/components/molecules/calendar-event-card";
import type { TimeSlot } from "@/types/uml-entities";

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
  onViewDetails?: (sessionId: string) => void;
  onManageAttendance?: (sessionId: string) => void;
}

export function CalendarWeekView({
  weekDays,
  timeSlots,
  getCurrentWeek,
  getStatusColor,
  onViewDetails,
  onManageAttendance,
}: CalendarWeekViewProps) {
  const now = new Date();
  const currentTime = now.getHours() * 60 + now.getMinutes(); // En minutes depuis minuit
  
  const isTimeSlotCurrent = (timeSlot: TimeSlot) => {
    const [startHour, startMin] = timeSlot.startTime.split(':').map(Number);
    const [endHour, endMin] = timeSlot.endTime.split(':').map(Number);
    const slotStart = startHour * 60 + startMin;
    const slotEnd = endHour * 60 + endMin;
    return currentTime >= slotStart && currentTime <= slotEnd;
  };
  
  const isTimeSlotPast = (timeSlot: TimeSlot) => {
    const [endHour, endMin] = timeSlot.endTime.split(':').map(Number);
    const slotEnd = endHour * 60 + endMin;
    return currentTime > slotEnd;
  };
  return (
    <Card className="py-0">
      <CardContent className="p-0">
          {/* En-têtes simplifiés */}
          <div className="border-b-2 border-muted/40 bg-muted/20">
            <div className="grid grid-cols-8 gap-0">
              <div className="p-4 text-center text-sm font-bold text-foreground bg-background border-r-2 border-muted/50">
                Heure
              </div>
              {weekDays.map((day, index) => {
                const weekDay = getCurrentWeek()[index];
                return (
                  <div
                    key={day}
                    className={`p-4 text-center text-sm font-bold border-r border-muted/50 ${
                      weekDay?.isToday
                        ? "bg-primary/15 text-primary border-l-2 border-l-primary shadow-sm"
                        : "text-foreground"
                    }`}
                  >
                    <div>{day}</div>
                    <div className="text-xs mt-1 font-normal text-muted-foreground">{weekDay?.date.getDate()}</div>
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
                <div key={timeSlot.id} className="grid grid-cols-8 gap-0 border-b border-muted/40">
                  {/* Colonne horaire */}
                  <div className={`p-4 text-center border-r-2 border-muted/50 ${
                    isCurrent 
                      ? "bg-orange-50" 
                      : isPast 
                        ? "bg-muted/20" 
                        : "bg-muted/10"
                  }`}>
                    <div className={`text-sm font-bold ${
                      isPast ? "text-muted-foreground" : "text-foreground"
                    }`}>
                      {timeSlot.name}
                      {isCurrent && <div className="text-xs font-normal mt-1 text-orange-600">● En cours</div>}
                    </div>
                    <div className="text-xs mt-1 text-muted-foreground">
                      {timeSlot.startTime} - {timeSlot.endTime}
                    </div>
                  </div>

                  {/* Cases pour chaque jour - simplifiées */}
                  {getCurrentWeek().map((day, dayIndex) => {
                    const dayEvents = day.events.filter((event) => {
                      const eventTimeSlot = event.timeSlot.id;
                      return eventTimeSlot === timeSlot.id;
                    });
                    
                    const isPastDay = day.date < now && !day.isToday;
                    const isDayPastTime = day.isToday && isPast;

                    return dayEvents.length > 0 ? (
                      <div key={`${timeSlot.id}-${dayIndex}`} className="space-y-2">
                        {dayEvents.map((event) => {
                          const isEventCurrent = day.isToday && isCurrent;
                          const cellClasses = `min-h-24 p-2 border-r border-muted/50 ${
                            day.isToday && isCurrent
                              ? "bg-orange-100 border-l-2 border-l-primary" 
                              : day.isToday 
                                ? "bg-primary/10 border-l-2 border-l-primary" 
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
                              isCurrentEvent={isEventCurrent}
                              cellClasses={cellClasses}
                            />
                          );
                        })}
                      </div>
                    ) : (
                      <div 
                        key={`${timeSlot.id}-${dayIndex}`}
                        className={`min-h-24 p-2 border-r border-muted/50 ${
                          day.isToday && isCurrent
                            ? "bg-orange-100 border-l-2 border-l-primary" 
                            : day.isToday 
                              ? "bg-primary/10 border-l-2 border-l-primary" 
                              : isPastDay || isDayPastTime
                                ? "bg-muted/10"
                                : "bg-background hover:bg-muted/5"
                        }`}
                      />
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
