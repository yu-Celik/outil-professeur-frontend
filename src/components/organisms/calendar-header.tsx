"use client";

import { memo } from "react";
import { Calendar, ChevronLeft, ChevronRight, Grid3X3, List } from "lucide-react";
import { Button } from "@/components/atoms/button";
import { Badge } from "@/components/atoms/badge";
import type { CalendarView } from "@/features/calendar";

interface CalendarHeaderProps {
  currentPeriodLabel: string;
  view: CalendarView;
  onToggleView: () => void;
  onSetView: (view: CalendarView) => void;
  onGoToPrevious: () => void;
  onGoToNext: () => void;
  onGoToToday: () => void;
  statsCompleted?: number;
  statsInProgress?: number;
  statsPlanned?: number;
}

export const CalendarHeader = memo(function CalendarHeader({
  currentPeriodLabel,
  view,
  onToggleView,
  onSetView,
  onGoToPrevious,
  onGoToNext,
  onGoToToday,
  statsCompleted = 0,
  statsInProgress = 0,
  statsPlanned = 0,
}: CalendarHeaderProps) {
  return (
    <div className="space-y-4">
      {/* Navigation principale */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h2 className="text-2xl font-bold capitalize">{currentPeriodLabel}</h2>
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="sm"
              onClick={onGoToPrevious}
              className="p-2"
              aria-label={view === "month" ? "Mois précédent" : "Semaine précédente"}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={onGoToToday}
              className="px-3"
            >
              Aujourd'hui
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={onGoToNext}
              className="p-2"
              aria-label={view === "month" ? "Mois suivant" : "Semaine suivante"}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Contrôles de vue */}
        <div className="flex items-center gap-2">
          <div className="flex items-center border rounded-md">
            <Button
              variant={view === "month" ? "default" : "ghost"}
              size="sm"
              onClick={() => onSetView("month")}
              className="rounded-r-none"
              aria-label="Vue mensuelle"
            >
              <Grid3X3 className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Mois</span>
            </Button>
            <Button
              variant={view === "week" ? "default" : "ghost"}
              size="sm"
              onClick={() => onSetView("week")}
              className="rounded-l-none border-l"
              aria-label="Vue hebdomadaire"
            >
              <List className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Semaine</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Statistiques et indicateurs */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-6 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-chart-3/10 border border-chart-3/20" />
            <span>
              <strong className="text-foreground">{statsCompleted}</strong> Terminées
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-chart-1/10 border border-chart-1/20" />
            <span>
              <strong className="text-foreground">{statsInProgress}</strong> En cours
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-chart-4/10 border border-chart-4/20" />
            <span>
              <strong className="text-foreground">{statsPlanned}</strong> À venir
            </span>
          </div>
        </div>

        <Badge variant="secondary" className="gap-2">
          <Calendar className="h-3 w-3" />
          Mon calendrier personnel
        </Badge>
      </div>
    </div>
  );
});
