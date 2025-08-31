"use client";

import { Card, CardContent } from "@/components/molecules/card";
import { CalendarNavigation } from "@/components/molecules/calendar-navigation";
import { CalendarActions } from "@/components/molecules/calendar-actions";

interface CalendarToolbarProps {
  monthYear: string;
  viewMode: "month" | "week";
  showFilters: boolean;
  onNavigateMonth: (direction: "prev" | "next") => void;
  onNavigateToToday: () => void;
  onNavigateToJanuary2025: () => void;
  onNavigateToAugust2025: () => void;
  onViewModeChange: (mode: "month" | "week") => void;
  onToggleFilters: () => void;
  onCreateSession: () => void;
  onManageColors?: () => void;
}

export function CalendarToolbar({
  monthYear,
  viewMode,
  showFilters,
  onNavigateMonth,
  onNavigateToToday,
  onNavigateToJanuary2025,
  onNavigateToAugust2025,
  onViewModeChange,
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
            viewMode={viewMode}
            onViewModeChange={onViewModeChange}
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
