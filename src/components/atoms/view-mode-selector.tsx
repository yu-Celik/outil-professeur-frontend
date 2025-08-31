"use client";

import { Grid3X3, Calendar } from "lucide-react";
import { Button } from "@/components/atoms/button";

interface ViewModeSelectorProps {
  viewMode: "month" | "week";
  onViewModeChange: (mode: "month" | "week") => void;
}

export function ViewModeSelector({
  viewMode,
  onViewModeChange,
}: ViewModeSelectorProps) {
  return (
    <div className="flex items-center border rounded-lg">
      <Button
        variant={viewMode === "week" ? "default" : "ghost"}
        size="sm"
        onClick={() => onViewModeChange("week")}
        className="rounded-r-none"
      >
        <Calendar className="h-4 w-4" />
      </Button>
      <Button
        variant={viewMode === "month" ? "default" : "ghost"}
        size="sm"
        onClick={() => onViewModeChange("month")}
        className="rounded-l-none"
      >
        <Grid3X3 className="h-4 w-4" />
      </Button>
    </div>
  );
}
