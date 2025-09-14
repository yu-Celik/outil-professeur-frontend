"use client";

import { Badge } from "@/components/atoms/badge";
import { useNotationSystem } from "@/hooks/use-notation-system";
import type { NotationSystem } from "@/types/uml-entities";

export interface ExamGradeDisplayProps {
  grade: number;
  isAbsent: boolean;
  notationSystemId: string;
  className?: string;
  showBadge?: boolean;
}

export function ExamGradeDisplay({
  grade,
  isAbsent,
  notationSystemId,
  className = "",
  showBadge = true,
}: ExamGradeDisplayProps) {
  const { notationSystems, formatGrade, getGradeBadgeVariant, getGradeColor } = useNotationSystem();
  
  const notationSystem = notationSystems.find(ns => ns.id === notationSystemId) || notationSystems[0];

  if (isAbsent) {
    if (showBadge) {
      return (
        <Badge variant="outline" className={className}>
          Absent
        </Badge>
      );
    }
    return <span className={`text-muted-foreground ${className}`}>Absent</span>;
  }

  if (!notationSystem) {
    return <span className={className}>{grade}</span>;
  }

  const formattedGrade = formatGrade(grade, notationSystem, "fr-FR");
  const gradeColor = getGradeColor(grade, notationSystem);
  
  if (showBadge) {
    const badgeVariant = getGradeBadgeVariant(grade, notationSystem);
    return (
      <Badge variant={badgeVariant} className={className}>
        {formattedGrade}
      </Badge>
    );
  }

  return (
    <span className={`font-medium ${gradeColor} ${className}`}>
      {formattedGrade}
    </span>
  );
}