"use client";

import { Calendar } from "lucide-react";
import { SessionTimelineItem } from "./session-timeline-item";
import type { CourseSession } from "@/types/uml-entities";

interface TimelineDateGroupProps {
  date: string;
  sessions: CourseSession[];
  selectedSessionId: string | null;
  onSessionSelect: (sessionId: string) => void;
}

export function TimelineDateGroup({
  date,
  sessions,
  selectedSessionId,
  onSessionSelect,
}: TimelineDateGroupProps) {
  const dateObj = new Date(date);
  const today = new Date();
  const isToday = dateObj.toDateString() === today.toDateString();
  const isPast = dateObj < today;

  // Formatage de la date
  const formattedDate = dateObj.toLocaleDateString("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

  const formattedShortDate = dateObj.toLocaleDateString("fr-FR", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });

  return (
    <div className="space-y-3">
      {/* En-tête de date */}
      <div className="flex items-center gap-3 sticky top-0 bg-background/95 backdrop-blur-sm py-2 z-10">
        <div className="flex items-center gap-2">
          <div
            className={`p-1.5 rounded-lg ${
              isToday
                ? "bg-primary text-primary-foreground"
                : isPast
                  ? "bg-muted text-muted-foreground"
                  : "bg-secondary text-secondary-foreground"
            }`}
          >
            <Calendar className="h-4 w-4" />
          </div>
          <div>
            <h3
              className={`font-semibold text-sm capitalize ${
                isToday
                  ? "text-primary"
                  : isPast
                    ? "text-muted-foreground"
                    : "text-foreground"
              }`}
            >
              {formattedDate}
            </h3>
            <p className="text-xs text-muted-foreground">
              {sessions.length} séance{sessions.length > 1 ? "s" : ""}
            </p>
          </div>
        </div>

        {/* Indicateur aujourd'hui */}
        {isToday && (
          <div className="ml-auto">
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary border border-primary/20">
              Aujourd'hui
            </span>
          </div>
        )}
      </div>

      {/* Liste des séances */}
      <div className="space-y-2 pl-4 border-l-2 border-muted/30 relative">
        {/* Ligne de connexion pour aujourd'hui */}
        {isToday && (
          <div className="absolute -left-[2px] top-0 bottom-0 w-0.5 bg-primary"></div>
        )}

        {sessions.map((session, index) => (
          <div key={session.id} className="relative">
            {/* Point de connexion */}
            <div
              className={`absolute -left-[22px] top-4 w-3 h-3 rounded-full border-2 ${
                selectedSessionId === session.id
                  ? "bg-primary border-primary"
                  : isToday
                    ? "bg-primary/20 border-primary"
                    : isPast
                      ? "bg-muted border-muted"
                      : "bg-secondary border-secondary"
              }`}
            />

            <SessionTimelineItem
              session={session}
              isSelected={selectedSessionId === session.id}
              onSelect={onSessionSelect}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
