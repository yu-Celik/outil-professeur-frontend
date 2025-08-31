"use client";

import { ChevronLeft, ChevronRight, Calendar } from "lucide-react";
import { Button } from "@/components/atoms/button";

interface CalendarNavigationProps {
  monthYear: string;
  onNavigateMonth: (direction: "prev" | "next") => void;
  onNavigateToToday: () => void;
  onNavigateToJanuary2025: () => void;
  onNavigateToAugust2025: () => void;
}

export function CalendarNavigation({
  monthYear,
  onNavigateMonth,
  onNavigateToToday,
  onNavigateToJanuary2025,
  onNavigateToAugust2025,
}: CalendarNavigationProps) {
  return (
    <div className="flex items-center gap-4">
      {/* Navigation hebdomadaire */}
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onNavigateMonth("prev")}
          className="flex items-center gap-1"
        >
          <ChevronLeft className="h-4 w-4" />
          <span className="hidden sm:inline">Semaine précédente</span>
        </Button>
        
        <div className="px-3">
          <h2 className="text-lg font-semibold">
            {monthYear}
          </h2>
        </div>
        
        <Button
          variant="outline"
          size="sm"
          onClick={() => onNavigateMonth("next")}
          className="flex items-center gap-1"
        >
          <span className="hidden sm:inline">Semaine suivante</span>
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
      
      {/* Actions rapides */}
      <div className="flex items-center gap-2">
        <Button
          variant="default"
          size="sm"
          onClick={onNavigateToToday}
          className="font-medium"
        >
          Cette semaine
        </Button>
      </div>
    </div>
  );
}
