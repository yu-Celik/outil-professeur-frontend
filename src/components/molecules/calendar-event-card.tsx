"use client";

import { memo, useState } from "react";
import { Clock, Plus, ArrowRight } from "lucide-react";
import { useClassColors } from "@/hooks/use-class-colors";
import { SessionContextMenu } from "./session-context-menu";
import { SessionStatusBadge } from "@/components/atoms/session-status-badge";
import type { CalendarEvent } from "@/hooks/use-calendar";
import type { CourseSession } from "@/types/uml-entities";
interface CalendarEventCardProps {
  event: CalendarEvent;
  getStatusColor: (status: string) => string;
  compact?: boolean;
  onViewDetails?: (sessionId: string) => void;
  onManageAttendance?: (sessionId: string) => void;
  onMove?: (session: CourseSession) => void;
  onCancel?: (session: CourseSession) => void;
  isCurrentEvent?: boolean;
  cellClasses?: string;
}

export const CalendarEventCard = memo<CalendarEventCardProps>(
  function CalendarEventCard({
    event,
    getStatusColor: _getStatusColor,
    compact = false,
    onViewDetails = () => {},
    onManageAttendance = () => {},
    onMove,
    onCancel,
    isCurrentEvent = false,
    cellClasses = "",
  }) {
    const { getClassColorWithText } = useClassColors(
      event.courseSession.createdBy,
      "year-2025",
    );
    const classColors = getClassColorWithText(event.class.id);
    const [_showMenu, _setShowMenu] = useState(false);

    // Vérifier si c'est une session de rattrapage via le champ UML dédié
    const isMakeup = event.courseSession.isMakeup === true;
    // Vérifier si c'est une session déplacée via le champ UML dédié
    const isMoved = event.courseSession.isMoved === true;

    if (compact) {
      return (
        <div
          key={event.id}
          className={`text-xs p-1.5 rounded border-l-4 bg-background/80 group relative ${
            isMoved ? "opacity-60 bg-muted/50" : ""
          }`}
          style={{
            borderLeftColor: classColors.borderColor,
            backgroundColor: `${classColors.backgroundColor}15`, // 15 = ~8% opacity
          }}
        >
          <div className="flex items-center gap-1.5">
            <div className="font-medium truncate flex-1">
              {event.subject.name}
            </div>
            {isMakeup && <Plus className="h-3 w-3 text-amber-600" />}
            {isMoved && <ArrowRight className="h-3 w-3 text-blue-600" />}
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1 text-muted-foreground">
              <Clock className="h-2.5 w-2.5" />
              <span>{event.timeSlot.startTime}</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-xs font-medium">
                {event.class.classCode}
              </span>
              {isMakeup && (
                <span className="text-xs bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded">
                  Rattrapage
                </span>
              )}
              {isMoved && (
                <span className="text-xs bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded">
                  Déplacé
                </span>
              )}
              <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                <SessionContextMenu
                  session={event.courseSession}
                  onViewDetails={onViewDetails}
                  onManageAttendance={onManageAttendance}
                  onMove={onMove}
                  onCancel={onCancel}
                />
              </div>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div
        className={`group text-xs border-l-4 relative ${cellClasses} ${
          isCurrentEvent ? "bg-orange-50" : ""
        } ${isMakeup ? "border-l-amber-400 bg-amber-50/50" : ""} ${
          isMoved ? "border-l-blue-400 bg-muted/30 opacity-60" : ""
        }`}
        style={{
          borderLeftColor: isMoved 
            ? "#3b82f6" // Blue-500 pour déplacé
            : isMakeup 
              ? "#f59e0b" // Amber-500 pour rattrapage
              : classColors.borderColor,
          backgroundColor: isCurrentEvent
            ? undefined
            : isMoved
              ? "#f1f5f9" // Slate-100 pour déplacé
              : isMakeup
                ? "#fef3c7" // Amber-100 avec transparence
                : `${classColors.backgroundColor}08`,
        }}
      >
        {isCurrentEvent && (
          <div className="absolute -left-1 top-0 w-1 h-full bg-orange-400 rounded-full animate-pulse"></div>
        )}

        {/* En-tête avec matière et menu */}
        <div className="flex items-start justify-between mb-2">
          <div className="font-semibold text-sm leading-tight text-foreground flex-1 pr-2">
            {event.subject.name}
            {isMakeup && (
              <span className="block text-xs font-normal text-amber-700 mt-0.5">
                Session de rattrapage
              </span>
            )}
            {isMoved && (
              <span className="block text-xs font-normal text-blue-700 mt-0.5">
                Session déplacée
              </span>
            )}
          </div>
          <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <SessionContextMenu
              session={event.courseSession}
              onViewDetails={onViewDetails}
              onManageAttendance={onManageAttendance}
              onMove={onMove}
              onCancel={onCancel}
            />
          </div>
        </div>

        {/* Badges de statut */}
        <div className="flex gap-1 mb-2">
          {(event.courseSession as any).status === "moved" && (
            <SessionStatusBadge
              status="moved"
              originalDateTime={(event.courseSession as any).originalDateTime}
            />
          )}
          {(event.courseSession as any).status === "canceled" && (
            <SessionStatusBadge
              status="canceled"
              originalDateTime={(event.courseSession as any).originalDateTime}
            />
          )}
        </div>

        {/* Code de classe en bas */}
        <div>
          <span
            className="text-xs font-medium px-2 py-0.5 rounded border inline-block text-foreground"
            style={{
              borderColor: isMakeup
                ? "#f59e0b60"
                : `${classColors.borderColor}60`, // Amber-500 avec transparence pour rattrapage
              backgroundColor: isMakeup
                ? "#fef3c715"
                : `${classColors.backgroundColor}15`,
            }}
          >
            {event.class.classCode}
          </span>
        </div>
      </div>
    );
  },
);
