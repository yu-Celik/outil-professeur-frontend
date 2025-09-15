"use client";

import { useEffect, useState } from "react";
import { getActiveNotationSystems, getDefaultNotationSystem } from "@/data";
import type { NotationSystem } from "@/types/uml-entities";

export function useNotationSystem(_schoolYearId: string = "year-2025") {
  const [notationSystems, setNotationSystems] = useState<NotationSystem[]>([]);
  const [defaultSystem, setDefaultSystem] = useState<NotationSystem | null>(
    null,
  );
  const [loading, setLoading] = useState(true);

  // Chargement des données depuis /src/data/
  useEffect(() => {
    setNotationSystems(getActiveNotationSystems());
    setDefaultSystem(getDefaultNotationSystem());
    setLoading(false);
  }, []);

  const convertGrade = (
    value: number,
    fromSystemId: string,
    toSystemId: string,
  ): number => {
    const fromSystem = notationSystems.find((sys) => sys.id === fromSystemId);
    const toSystem = notationSystems.find((sys) => sys.id === toSystemId);

    if (!fromSystem || !toSystem) return value;

    // Simple linear conversion
    const ratio =
      (toSystem.maxValue - toSystem.minValue) /
      (fromSystem.maxValue - fromSystem.minValue);
    return Math.round(
      (value - fromSystem.minValue) * ratio + toSystem.minValue,
    );
  };

  const formatGradeWithSystem = (value: number, systemId?: string): string => {
    const system = systemId
      ? notationSystems.find((sys) => sys.id === systemId)
      : defaultSystem;

    if (!system) return value.toString();

    return system.formatDisplay(value, "fr-FR");
  };

  const validateGrade = (value: number, systemId?: string): boolean => {
    const system = systemId
      ? notationSystems.find((sys) => sys.id === systemId)
      : defaultSystem;

    if (!system) return true;

    return system.validateGrade(value);
  };

  const getGradeLabel = (value: number, systemId?: string): string => {
    const system = systemId
      ? notationSystems.find((sys) => sys.id === systemId)
      : defaultSystem;

    if (!system) return "";

    // Extraire les labels des règles du système de notation
    const rules = system.rules as any;
    if (rules.gradeLabels) {
      const gradeValue = Math.round(value);
      return rules.gradeLabels[gradeValue] || "";
    }

    if (rules.competencyLevels) {
      const competencyValue = Math.round(value);
      return rules.competencyLevels[competencyValue] || "";
    }

    return "";
  };

  // Fonction formatGrade compatible avec GradeDisplay
  const formatGrade = (
    value: number,
    system: NotationSystem,
    locale: string = "fr-FR",
  ): string => {
    return system.formatDisplay(value, locale);
  };

  // Fonction pour obtenir la couleur d'une note
  const getGradeColor = (value: number, system: NotationSystem): string => {
    const percentage =
      ((value - system.minValue) / (system.maxValue - system.minValue)) * 100;

    if (percentage >= 80) return "text-chart-3"; // Excellent - green
    if (percentage >= 60) return "text-chart-1"; // Good - blue
    if (percentage >= 40) return "text-chart-4"; // Average - orange
    return "text-destructive"; // Poor - red
  };

  // Fonction pour obtenir le variant de badge d'une note
  const getGradeBadgeVariant = (
    value: number,
    system: NotationSystem,
  ): "default" | "secondary" | "destructive" | "outline" => {
    const percentage =
      ((value - system.minValue) / (system.maxValue - system.minValue)) * 100;

    if (percentage >= 80) return "default"; // Excellent
    if (percentage >= 60) return "secondary"; // Good
    if (percentage >= 40) return "outline"; // Average
    return "destructive"; // Poor
  };

  return {
    notationSystems,
    defaultSystem,
    loading,
    convertGrade,
    formatGradeWithSystem,
    formatGrade,
    validateGrade,
    getGradeLabel,
    getGradeColor,
    getGradeBadgeVariant,
  };
}
