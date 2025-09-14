"use client";

import { useMemo } from "react";
import { Calendar, Clock, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/atoms/button";
import { TimelineDateGroup } from "@/components/molecules/timeline-date-group";
import { SessionAdvancedFilters } from "@/components/molecules/session-advanced-filters";
import type { CourseSession } from "@/types/uml-entities";

interface SessionsTimelineProps {
  sessions: CourseSession[];
  selectedClassId: string | null;
  selectedSessionId: string | null;
  onSessionSelect: (sessionId: string) => void;
  onNavigateDate?: (direction: "prev" | "next") => void;
  currentDate?: string;
}

interface GroupedSessions {
  [date: string]: CourseSession[];
}

export function SessionsTimeline({
  sessions,
  selectedClassId,
  selectedSessionId,
  onSessionSelect,
  onNavigateDate,
  currentDate,
}: SessionsTimelineProps) {
  // Filtrer les sessions par classe sélectionnée
  const filteredSessions = useMemo(() => {
    if (!selectedClassId || selectedClassId === "all") {
      return sessions;
    }
    return sessions.filter((session) => session.classId === selectedClassId);
  }, [sessions, selectedClassId]);

  // Grouper les sessions par date
  const groupedSessions = useMemo<GroupedSessions>(() => {
    const groups: GroupedSessions = {};
    
    filteredSessions.forEach((session) => {
      const dateKey = new Date(session.sessionDate).toISOString().split("T")[0];
      if (!groups[dateKey]) {
        groups[dateKey] = [];
      }
      groups[dateKey].push(session);
    });

    // Trier les sessions de chaque jour par heure
    Object.keys(groups).forEach((date) => {
      groups[date].sort((a, b) => {
        // Comparer par sessionDate complète pour l'ordre temporel
        return new Date(a.sessionDate).getTime() - new Date(b.sessionDate).getTime();
      });
    });

    return groups;
  }, [filteredSessions]);

  // Obtenir les dates triées
  const sortedDates = useMemo(() => {
    return Object.keys(groupedSessions).sort();
  }, [groupedSessions]);

  // Obtenir la prochaine séance
  const nextSession = useMemo(() => {
    const now = new Date();
    return filteredSessions
      .filter((session) => new Date(session.sessionDate) > now)
      .sort((a, b) => new Date(a.sessionDate).getTime() - new Date(b.sessionDate).getTime())[0];
  }, [filteredSessions]);

  // Obtenir les sessions d'aujourd'hui
  const todaySessions = useMemo(() => {
    const today = new Date().toISOString().split("T")[0];
    return groupedSessions[today] || [];
  }, [groupedSessions]);

  const handleTodayClick = () => {
    if (todaySessions.length > 0) {
      onSessionSelect(todaySessions[0].id);
    }
  };

  const handleNextSessionClick = () => {
    if (nextSession) {
      onSessionSelect(nextSession.id);
    }
  };

  if (filteredSessions.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-muted/50 flex items-center justify-center mx-auto">
            <Calendar className="h-6 w-6 text-muted-foreground" />
          </div>
          <div>
            <h3 className="font-medium text-foreground mb-2">Aucune séance</h3>
            <p className="text-sm text-muted-foreground">
              {selectedClassId && selectedClassId !== "all" 
                ? "Pas de séance pour cette classe"
                : "Aucune séance trouvée"}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col flex-1 space-y-4 min-h-0">
      {/* Navigation rapide */}
      <div className="flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant={todaySessions.length > 0 ? "default" : "secondary"}
            onClick={handleTodayClick}
            disabled={todaySessions.length === 0}
            className="text-xs"
          >
            <Clock className="h-3 w-3 mr-1" />
            Aujourd'hui
          </Button>
          <Button
            size="sm"
            variant={nextSession ? "default" : "secondary"}
            onClick={handleNextSessionClick}
            disabled={!nextSession}
            className="text-xs"
          >
            <Calendar className="h-3 w-3 mr-1" />
            Prochaine séance
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => onSessionSelect("all")}
            className="text-xs"
          >
            Toutes
          </Button>
        </div>

        {/* Navigation jour par jour */}
        {currentDate && onNavigateDate && (
          <div className="flex items-center gap-1">
            <Button
              size="sm"
              variant="outline"
              onClick={() => onNavigateDate("prev")}
              className="px-2"
            >
              <ChevronLeft className="h-3 w-3" />
            </Button>
            <span className="text-xs text-muted-foreground px-2 font-medium">
              {new Date(currentDate).toLocaleDateString("fr-FR", {
                weekday: "short",
                day: "numeric",
                month: "short"
              })}
            </span>
            <Button
              size="sm"
              variant="outline"
              onClick={() => onNavigateDate("next")}
              className="px-2"
            >
              <ChevronRight className="h-3 w-3" />
            </Button>
          </div>
        )}
      </div>

      {/* Filtres avancés */}
      <div className="flex-shrink-0">
        <SessionAdvancedFilters />
      </div>

      {/* Timeline des séances */}
      <div className="flex-1 space-y-4 overflow-y-auto min-h-0">
        {sortedDates.map((date) => (
          <TimelineDateGroup
            key={date}
            date={date}
            sessions={groupedSessions[date]}
            selectedSessionId={selectedSessionId}
            onSessionSelect={onSessionSelect}
          />
        ))}
      </div>
    </div>
  );
}