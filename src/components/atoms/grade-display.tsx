"use client";

import { Badge } from "@/components/atoms/badge";
import { useNotationSystem } from "@/hooks/use-notation-system";
import type { NotationSystem } from "@/types/uml-entities";

interface GradeDisplayProps {
  value: number;
  system?: NotationSystem;
  variant?: "badge" | "text" | "large";
  showSystemName?: boolean;
  locale?: string;
  className?: string;
}

export function GradeDisplay({
  value,
  system,
  variant = "text",
  showSystemName = false,
  locale = "fr-FR",
  className = "",
}: GradeDisplayProps) {
  const { defaultSystem, formatGrade, getGradeColor, getGradeBadgeVariant } =
    useNotationSystem();

  const notationSystem = system || defaultSystem;

  if (!notationSystem) {
    return <span className={className}>N/A</span>;
  }

  const formattedGrade = formatGrade(value, notationSystem, locale);
  const isValid = notationSystem.validateGrade(value);

  if (!isValid) {
    return (
      <span className={`text-muted-foreground ${className}`}>Non évalué</span>
    );
  }

  if (variant === "badge") {
    const badgeVariant = getGradeBadgeVariant(value, notationSystem);
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <Badge variant={badgeVariant}>{formattedGrade}</Badge>
        {showSystemName && (
          <span className="text-xs text-muted-foreground">
            ({notationSystem.name})
          </span>
        )}
      </div>
    );
  }

  if (variant === "large") {
    const colorClass = getGradeColor(value, notationSystem);
    return (
      <div className={`text-center ${className}`}>
        <div className={`text-2xl font-bold ${colorClass}`}>
          {formattedGrade}
        </div>
        {showSystemName && (
          <div className="text-xs text-muted-foreground mt-1">
            {notationSystem.name}
          </div>
        )}
      </div>
    );
  }

  // variant === "text"
  const colorClass = getGradeColor(value, notationSystem);
  return (
    <span className={`${colorClass} font-medium ${className}`}>
      {formattedGrade}
      {showSystemName && (
        <span className="text-xs text-muted-foreground ml-1">
          ({notationSystem.name})
        </span>
      )}
    </span>
  );
}
