"use client";

import {
  BookOpen,
  Calculator,
  FileText,
  FolderOpen,
  Microscope,
  Monitor,
  PenTool,
  Users,
} from "lucide-react";

export interface ExamTypeIconProps {
  examType: string;
  className?: string;
}

export function ExamTypeIcon({
  examType,
  className = "w-4 h-4",
}: ExamTypeIconProps) {
  const getIconForType = (type: string) => {
    const normalizedType = type.toLowerCase();

    if (
      normalizedType.includes("contrôle") ||
      normalizedType.includes("ecrit")
    ) {
      return FileText;
    }

    if (normalizedType.includes("quiz") || normalizedType.includes("ligne")) {
      return Monitor;
    }

    if (
      normalizedType.includes("présentation") ||
      normalizedType.includes("oral")
    ) {
      return Users;
    }

    if (
      normalizedType.includes("projet") ||
      normalizedType.includes("créatif")
    ) {
      return FolderOpen;
    }

    if (
      normalizedType.includes("dissertation") ||
      normalizedType.includes("rédaction")
    ) {
      return PenTool;
    }

    if (
      normalizedType.includes("lecture") ||
      normalizedType.includes("compréhension")
    ) {
      return BookOpen;
    }

    if (
      normalizedType.includes("calcul") ||
      normalizedType.includes("mathématiques")
    ) {
      return Calculator;
    }

    if (
      normalizedType.includes("expérience") ||
      normalizedType.includes("sciences")
    ) {
      return Microscope;
    }

    // Icône par défaut
    return FileText;
  };

  const IconComponent = getIconForType(examType);

  return <IconComponent className={className} />;
}
