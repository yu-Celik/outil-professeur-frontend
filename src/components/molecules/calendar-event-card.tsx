"use client";

import { memo, useState } from "react";
import { Clock } from "lucide-react";
import { useClassColors } from "@/hooks/use-class-colors";
import { SessionContextMenu } from "./session-context-menu";
import type { CalendarEvent } from "@/hooks/use-calendar";
import type { SessionException } from "@/services/session-generator";

interface CalendarEventCardProps {
  event: CalendarEvent;
  getStatusColor: (status: string) => string;
  compact?: boolean;
  onExceptionCreate?: (exception: Omit<SessionException, "id">) => void;
  onViewDetails?: (sessionId: string) => void;
  onManageAttendance?: (sessionId: string) => void;
}

export const CalendarEventCard = memo<CalendarEventCardProps>(
  function CalendarEventCard({
    event,
    getStatusColor: _getStatusColor,
    compact = false,
    onExceptionCreate,
    onViewDetails = () => {},
    onManageAttendance = () => {},
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
              {onExceptionCreate && (
                <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                  <SessionContextMenu
                    session={event.courseSession}
                    onExceptionCreate={onExceptionCreate}
                    onViewDetails={onViewDetails}
                    onManageAttendance={onManageAttendance}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      );
    }

    return (
      <div
        className="text-xs p-2 rounded border-l-4 bg-background/90 mb-1 group relative"
        style={{
          borderLeftColor: classColors.borderColor,
          backgroundColor: `${classColors.backgroundColor}20`, // 20 = ~12% opacity
        }}
      >
        <div className="font-medium truncate">{event.subject.name}</div>
        <div className="flex items-center justify-between mt-1">
          <span className="opacity-75">{event.class.classCode}</span>
          <div className="flex items-center gap-1">
            <div
              className="px-2 py-0.5 rounded text-xs font-medium"
              style={classColors}
            >
              {event.timeSlot.startTime}
            </div>
            {onExceptionCreate && (
              <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                <SessionContextMenu
                  session={event.courseSession}
                  onExceptionCreate={onExceptionCreate}
                  onViewDetails={onViewDetails}
                  onManageAttendance={onManageAttendance}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    );
  },
);
