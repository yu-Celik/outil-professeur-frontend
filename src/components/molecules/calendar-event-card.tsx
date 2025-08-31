"use client";

import { memo, useState } from "react";
import { Clock } from "lucide-react";
import { useClassColors } from "@/hooks/use-class-colors";
import { SessionContextMenu } from "./session-context-menu";
import type { CalendarEvent } from "@/hooks/use-calendar";
interface CalendarEventCardProps {
  event: CalendarEvent;
  getStatusColor: (status: string) => string;
  compact?: boolean;
  onViewDetails?: (sessionId: string) => void;
  onManageAttendance?: (sessionId: string) => void;
  isCurrentEvent?: boolean;
  cellClasses?: string;
}

export const CalendarEventCard = memo<CalendarEventCardProps>(
  function CalendarEventCard({
    event,
    getStatusColor: _getStatusColor,
    compact = false,
    onViewDetails = () => { },
    onManageAttendance = () => { },
    isCurrentEvent = false,
    cellClasses = "",
  }) {
    const { getClassColorWithText } = useClassColors(
      event.courseSession.createdBy,
      "year-2025",
    );
    const classColors = getClassColorWithText(event.class.id);
    const [_showMenu, _setShowMenu] = useState(false);

    if (compact) {
      return (
        <div
          key={event.id}
          className="text-xs p-1.5 rounded border-l-4 bg-background/80 group relative"
          style={{
            borderLeftColor: classColors.borderColor,
            backgroundColor: `${classColors.backgroundColor}15`, // 15 = ~8% opacity
          }}
        >
          <div className="font-medium truncate">{event.subject.name}</div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1 text-muted-foreground">
              <Clock className="h-2.5 w-2.5" />
              <span>{event.timeSlot.startTime}</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-xs font-medium">
                {event.class.classCode}
              </span>
              <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                <SessionContextMenu
                  session={event.courseSession}
                  onViewDetails={onViewDetails}
                  onManageAttendance={onManageAttendance}
                />
              </div>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div
        className={`group text-xs border-l-4 relative ${cellClasses} ${isCurrentEvent ? "bg-orange-50" : ""
          }`}
        style={{
          borderLeftColor: classColors.borderColor,
          backgroundColor: isCurrentEvent ? undefined : `${classColors.backgroundColor}08`, // Plus subtil (3% opacity)
        }}
      >
        {isCurrentEvent && (
          <div className="absolute -left-1 top-0 w-1 h-full bg-orange-400 rounded-full animate-pulse"></div>
        )}
        
        {/* En-tête avec matière et menu */}
        <div className="flex items-start justify-between mb-2">
          <div className="font-semibold text-sm leading-tight text-foreground flex-1">
            {event.subject.name}
          </div>
          <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 ml-2">
            <SessionContextMenu
              session={event.courseSession}
              onViewDetails={onViewDetails}
              onManageAttendance={onManageAttendance}
            />
          </div>
        </div>

        {/* Code de classe en bas */}
        <div>
          <span
            className="text-xs font-medium px-2 py-0.5 rounded border inline-block text-foreground"
            style={{
              borderColor: `${classColors.borderColor}60`,
              backgroundColor: `${classColors.backgroundColor}15`
            }}
          >
            {event.class.classCode}
          </span>
        </div>
      </div>
    );
  },
);
