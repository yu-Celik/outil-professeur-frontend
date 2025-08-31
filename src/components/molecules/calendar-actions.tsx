"use client";

import { Filter, Plus, Palette } from "lucide-react";
import { Button } from "@/components/atoms/button";
interface CalendarActionsProps {
  showFilters: boolean;
  onToggleFilters: () => void;
  onCreateSession: () => void;
  onManageColors?: () => void;
}

export function CalendarActions({
  showFilters,
  onToggleFilters,
  onCreateSession,
  onManageColors,
}: CalendarActionsProps) {
  return (
    <div className="flex items-center gap-2">{/* Vue hebdomadaire uniquement */}

      <Button
        variant="outline"
        size="sm"
        onClick={onToggleFilters}
        className={showFilters ? "bg-muted" : ""}
      >
        <Filter className="h-4 w-4" />
      </Button>

      {onManageColors && (
        <Button
          variant="outline"
          size="sm"
          onClick={onManageColors}
          className="gap-2"
        >
          <Palette className="h-4 w-4" />
          <span className="hidden sm:inline">Couleurs</span>
        </Button>
      )}

      <Button size="sm" onClick={onCreateSession} className="gap-2">
        <Plus className="h-4 w-4" />
        <span className="hidden sm:inline">Nouvelle session</span>
      </Button>
    </div>
  );
}
