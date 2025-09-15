"use client";

import { useCallback, useMemo, useState } from "react";
import {
  createUserPreferences,
  getUserPreferences,
  updateUserPreferences,
} from "@/features/settings/mocks";
import type { UserPreferences } from "@/types/uml-entities";

/**
 * Calcule la couleur de texte lisible selon le contraste
 */
function getReadableTextColor(bgColor: string): string {
  // Convertit hex en RGB
  const hex = bgColor.replace("#", "");
  const r = parseInt(hex.substr(0, 2), 16);
  const g = parseInt(hex.substr(2, 2), 16);
  const b = parseInt(hex.substr(4, 2), 16);

  // Calcul de luminance relative
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

  return luminance > 0.5 ? "#000000" : "#FFFFFF";
}

/**
 * Hook pour gérer les couleurs des classes via l'entité UML UserPreferences
 * Fournit les fonctions pour obtenir/modifier les couleurs des classes
 */
export function useClassColors(
  userId: string = "KsmNtVf4zwqO3VV3SQJqPrRlQBA1fFyR",
  schoolYearId: string = "year-2025",
) {
  const [, forceUpdate] = useState(0);

  // Force un re-render quand les couleurs changent
  const triggerUpdate = useCallback(() => {
    forceUpdate((prev) => prev + 1);
  }, []);

  // Récupère les préférences utilisateur UML
  const userPreferences = useMemo(() => {
    return (
      getUserPreferences(userId, schoolYearId) ||
      createUserPreferences(userId, schoolYearId)
    );
  }, [userId, schoolYearId]);

  /**
   * Obtient la couleur d'une classe avec texte lisible
   */
  const getClassColorWithText = useCallback((classId: string) => {
    const bgColor = getClassBackgroundColor(classId);
    const textColor = getReadableTextColor(bgColor);

    return {
      backgroundColor: bgColor,
      color: textColor,
      borderColor: bgColor,
    };
  }, []);

  /**
   * Obtient uniquement la couleur de fond
   */
  const getClassBackgroundColor = useCallback(
    (classId: string) => {
      const existingColor = userPreferences.getClassColor(classId);
      if (existingColor) return existingColor;

      if (!userPreferences.preferences.autoAssignColors) {
        return "#64748B"; // Gris neutre par défaut
      }

      // Auto-attribution d'une nouvelle couleur
      const usedColors = Object.values(userPreferences.preferences.classColors);
      const availableColors = userPreferences.preferences.colorPalette.filter(
        (color) => !usedColors.includes(color),
      );

      const newColor =
        availableColors[0] || userPreferences.preferences.colorPalette[0];
      userPreferences.updateClassColor(classId, newColor);

      return newColor;
    },
    [userPreferences],
  );

  /**
   * Définit une nouvelle couleur pour une classe
   */
  const updateClassColor = useCallback(
    (classId: string, color: `#${string}`) => {
      userPreferences.updateClassColor(classId, color);
      triggerUpdate();
    },
    [userPreferences, triggerUpdate],
  );

  /**
   * Obtient toutes les couleurs actuelles
   */
  const getAllCurrentColors = useCallback(() => {
    return userPreferences.preferences.classColors;
  }, [userPreferences]);

  /**
   * Réinitialise toutes les couleurs
   */
  const resetAllColors = useCallback(() => {
    userPreferences.resetToDefaults();
    triggerUpdate();
  }, [userPreferences, triggerUpdate]);

  /**
   * Met à jour les préférences générales
   */
  const updatePreferences = useCallback(
    (settings: Partial<UserPreferences["preferences"]>) => {
      updateUserPreferences(userId, settings);
      triggerUpdate();
    },
    [userId, triggerUpdate],
  );

  /**
   * Obtient les préférences utilisateur complètes
   */
  const getPreferences = useCallback(() => {
    return userPreferences.preferences;
  }, [userPreferences]);

  return {
    // Obtenir les couleurs
    getClassColorWithText,
    getClassBackgroundColor,
    getAllCurrentColors,

    // Modifier les couleurs
    updateClassColor,
    resetAllColors,
    updatePreferences,
    getPreferences,

    // Accès direct aux préférences UML
    userPreferences,
  };
}
