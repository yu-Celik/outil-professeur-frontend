"use client";

import { Card, CardContent } from "@/components/molecules/card";
import { CalendarNavigation } from "@/components/molecules/calendar-navigation";
import { CalendarActions } from "@/components/molecules/calendar-actions";

interface CalendarToolbarProps {
  monthYear: string;
  showFilters: boolean;
  onNavigateMonth: (direction: "prev" | "next") => void;
  onNavigateToToday: () => void;
  onNavigateToJanuary2025: () => void;
  onNavigateToAugust2025: () => void;
  onToggleFilters: () => void;
  onCreateSession: () => void;
  onManageColors?: () => void;
}

export function CalendarToolbar({
  monthYear,
  showFilters,
  onNavigateMonth,
  onNavigateToToday,
  onNavigateToJanuary2025,
  onNavigateToAugust2025,
  onToggleFilters,
  onCreateSession,
  onManageColors,
}: CalendarToolbarProps) {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <CalendarNavigation
            monthYear={monthYear}
            onNavigateMonth={onNavigateMonth}
            onNavigateToToday={onNavigateToToday}
            onNavigateToJanuary2025={onNavigateToJanuary2025}
            onNavigateToAugust2025={onNavigateToAugust2025}
          />

          <CalendarActions
            showFilters={showFilters}
            onToggleFilters={onToggleFilters}
            onCreateSession={onCreateSession}
            onManageColors={onManageColors}
          />
        </div>
      </CardContent>
    </Card>
  );
}
