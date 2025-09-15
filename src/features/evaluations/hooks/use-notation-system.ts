"use client";

import { useEffect, useState, useCallback } from "react";
import { getActiveNotationSystems, getDefaultNotationSystem } from "@/features/evaluations/mocks";
import { notationSystemService, type CreateNotationSystemData, type UpdateNotationSystemData, type NotationSystemSearchOptions } from "@/features/evaluations/services/notation-system-service";
import type { NotationSystem } from "@/types/uml-entities";

export function useNotationSystem(_schoolYearId: string = "year-2025") {
  const [notationSystems, setNotationSystems] = useState<NotationSystem[]>([]);
  const [defaultSystem, setDefaultSystem] = useState<NotationSystem | null>(
    null,
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load data from service
  const loadNotationSystems = useCallback(async (options?: NotationSystemSearchOptions) => {
    try {
      setLoading(true);
      setError(null);
      const systems = await notationSystemService.getAll(options);
      setNotationSystems(systems);

      if (!defaultSystem && systems.length > 0) {
        setDefaultSystem(getDefaultNotationSystem());
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur lors du chargement");
    } finally {
      setLoading(false);
    }
  }, [defaultSystem]);

  // Initial load
  useEffect(() => {
    loadNotationSystems();
  }, [loadNotationSystems]);

  // CRUD Operations
  const createNotationSystem = useCallback(async (data: CreateNotationSystemData): Promise<NotationSystem | null> => {
    try {
      setLoading(true);
      setError(null);
      const newSystem = await notationSystemService.create(data);
      await loadNotationSystems(); // Refresh the list
      return newSystem;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur lors de la création");
      return null;
    } finally {
      setLoading(false);
    }
  }, [loadNotationSystems]);

  const updateNotationSystem = useCallback(async (data: UpdateNotationSystemData): Promise<NotationSystem | null> => {
    try {
      setLoading(true);
      setError(null);
      const updatedSystem = await notationSystemService.update(data);
      if (updatedSystem) {
        await loadNotationSystems(); // Refresh the list
      }
      return updatedSystem;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur lors de la mise à jour");
      return null;
    } finally {
      setLoading(false);
    }
  }, [loadNotationSystems]);

  const deleteNotationSystem = useCallback(async (id: string): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);
      const success = await notationSystemService.delete(id);
      if (success) {
        await loadNotationSystems(); // Refresh the list
      }
      return success;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur lors de la suppression");
      return false;
    } finally {
      setLoading(false);
    }
  }, [loadNotationSystems]);

  const getNotationSystemById = useCallback(async (id: string): Promise<NotationSystem | null> => {
    try {
      return await notationSystemService.getById(id);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur lors de la récupération");
      return null;
    }
  }, []);

  // Advanced operations
  const convertGradeBetweenSystems = useCallback(async (
    value: number,
    fromSystemId: string,
    toSystemId: string,
  ): Promise<number | null> => {
    try {
      return await notationSystemService.convertGrade(value, fromSystemId, toSystemId);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur lors de la conversion");
      return null;
    }
  }, []);

  const getScaleConfigurations = useCallback(async () => {
    try {
      return await notationSystemService.getScaleConfigurations();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur lors de la récupération des configurations");
      return {};
    }
  }, []);

  const importNotationSystems = useCallback(async (systemsData: Partial<NotationSystem>[]): Promise<NotationSystem[]> => {
    try {
      setLoading(true);
      setError(null);
      const imported = await notationSystemService.importSystems(systemsData);
      await loadNotationSystems(); // Refresh the list
      return imported;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur lors de l'importation");
      return [];
    } finally {
      setLoading(false);
    }
  }, [loadNotationSystems]);

  const exportNotationSystems = useCallback(async (systemIds?: string[]): Promise<Partial<NotationSystem>[]> => {
    try {
      return await notationSystemService.exportSystems(systemIds);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur lors de l'exportation");
      return [];
    }
  }, []);

  // Legacy methods for compatibility
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
    // State
    notationSystems,
    defaultSystem,
    loading,
    error,

    // Data management
    loadNotationSystems,
    refresh: loadNotationSystems,

    // CRUD operations
    createNotationSystem,
    updateNotationSystem,
    deleteNotationSystem,
    getNotationSystemById,

    // Advanced operations
    convertGradeBetweenSystems,
    getScaleConfigurations,
    importNotationSystems,
    exportNotationSystems,

    // Legacy methods (kept for compatibility)
    convertGrade,
    formatGradeWithSystem,
    formatGrade,
    validateGrade,
    getGradeLabel,
    getGradeColor,
    getGradeBadgeVariant,
  };
}
