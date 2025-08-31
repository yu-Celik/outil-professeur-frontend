"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
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
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onNavigateMonth("prev")}
          className="p-2"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <h2 className="text-xl font-semibold capitalize min-w-48 text-center">
          {monthYear}
        </h2>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onNavigateMonth("next")}
          className="p-2"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
      <Button
        variant="outline"
        size="sm"
        onClick={onNavigateToToday}
        className="hidden sm:inline-flex"
      >
        Aujourd'hui
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={onNavigateToJanuary2025}
        className="hidden sm:inline-flex"
      >
        Janvier 2025
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={onNavigateToAugust2025}
        className="hidden sm:inline-flex"
      >
        Août 2025
      </Button>
    </div>
  );
}
