"use client";

import { Calendar } from "lucide-react";
import { Badge } from "@/components/atoms/badge";
import { useAcademicContext } from "@/features/gestion";

/**
 * Displays the currently active academic period
 * Can be placed anywhere in the dashboard to show period context
 */
export function ActivePeriodBadge() {
  const { activePeriod, activeSchoolYear, loading } = useAcademicContext();

  if (loading) {
    return (
      <Badge variant="outline" className="gap-2">
        <Calendar className="h-3 w-3" />
        <span className="text-xs">Chargement...</span>
      </Badge>
    );
  }

  if (!activeSchoolYear) {
    return (
      <Badge variant="outline" className="gap-2 text-muted-foreground">
        <Calendar className="h-3 w-3" />
        <span className="text-xs">Aucune année active</span>
      </Badge>
    );
  }

  if (!activePeriod) {
    return (
      <Badge variant="outline" className="gap-2">
        <Calendar className="h-3 w-3" />
        <span className="text-xs">{activeSchoolYear.name}</span>
      </Badge>
    );
  }

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("fr-FR", {
      day: "numeric",
      month: "short",
    }).format(date);
  };

  return (
    <Badge variant="default" className="gap-2">
      <Calendar className="h-3 w-3" />
      <span className="text-xs font-medium">
        {activePeriod.name} • {formatDate(activePeriod.startDate)} -{" "}
        {formatDate(activePeriod.endDate)}
      </span>
    </Badge>
  );
}
