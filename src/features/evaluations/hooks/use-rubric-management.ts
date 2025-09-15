"use client";

import { useState, useCallback, useEffect } from "react";
import type { Rubric } from "@/types/uml-entities";
import {
  getRubricsByTeacher,
  getRubricById,
  validateRubric,
  calculateRubricMaxScore,
  MOCK_RUBRICS,
  type RubricSection,
  type RubricCriterion,
  type RubricLevel,
  type RubricConstraints,
} from "@/features/evaluations/mocks";

export interface RubricFormData {
  name: string;
  sections: Record<string, RubricSection>;
  constraints: RubricConstraints;
}

export interface RubricValidationResult {
  isValid: boolean;
  errors: string[];
}

export interface RubricEvaluationData {
  rubricId: string;
  evaluations: Record<string, Record<string, number>>; // sectionId -> criterionId -> points
  totalScore: number;
  maxScore: number;
  percentage: number;
}

export function useRubricManagement(teacherId: string = "KsmNtVf4zwqO3VV3SQJqPrRlQBA1fFyR") {
  const [rubrics, setRubrics] = useState<Rubric[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Chargement initial des données
  useEffect(() => {
    try {
      const teacherRubrics = getRubricsByTeacher(teacherId);
      setRubrics(teacherRubrics);
      setLoading(false);
    } catch (err) {
      setError("Erreur lors du chargement des grilles d'évaluation");
      setLoading(false);
    }
  }, [teacherId]);

  // Création d'une nouvelle grille
  const createRubric = useCallback(async (data: RubricFormData): Promise<Rubric> => {
    try {
      const newRubric: Rubric = {
        id: `rubric-${Date.now()}`,
        createdBy: teacherId,
        name: data.name,
        sections: data.sections,
        constraints: data.constraints as unknown as Record<string, unknown>,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      // Valider la grille avant de la créer
      const validation = validateRubric(newRubric);
      if (!validation.isValid) {
        throw new Error(`Grille invalide: ${validation.errors.join(", ")}`);
      }

      // Ajouter à la liste locale (en attendant l'API)
      setRubrics(prev => [...prev, newRubric]);
      MOCK_RUBRICS.push(newRubric);

      return newRubric;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Erreur lors de la création";
      setError(message);
      throw err;
    }
  }, [teacherId]);

  // Modification d'une grille existante
  const updateRubric = useCallback(async (rubricId: string, data: Partial<RubricFormData>): Promise<Rubric> => {
    try {
      const existingIndex = rubrics.findIndex(r => r.id === rubricId);
      if (existingIndex === -1) {
        throw new Error("Grille d'évaluation non trouvée");
      }

      const updated: Rubric = {
        ...rubrics[existingIndex],
        ...data,
        constraints: (data.constraints || rubrics[existingIndex].constraints) as unknown as Record<string, unknown>,
        updatedAt: new Date(),
      };

      // Valider la grille modifiée
      const validation = validateRubric(updated);
      if (!validation.isValid) {
        throw new Error(`Grille invalide: ${validation.errors.join(", ")}`);
      }

      // Mettre à jour dans la liste locale
      const newRubrics = [...rubrics];
      newRubrics[existingIndex] = updated;
      setRubrics(newRubrics);

      // Mettre à jour dans les données mock
      const mockIndex = MOCK_RUBRICS.findIndex(r => r.id === rubricId);
      if (mockIndex !== -1) {
        MOCK_RUBRICS[mockIndex] = updated;
      }

      return updated;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Erreur lors de la modification";
      setError(message);
      throw err;
    }
  }, [rubrics]);

  // Suppression d'une grille
  const deleteRubric = useCallback(async (rubricId: string): Promise<void> => {
    try {
      // Supprimer de la liste locale
      setRubrics(prev => prev.filter(r => r.id !== rubricId));

      // Supprimer des données mock
      const mockIndex = MOCK_RUBRICS.findIndex(r => r.id === rubricId);
      if (mockIndex !== -1) {
        MOCK_RUBRICS.splice(mockIndex, 1);
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "Erreur lors de la suppression";
      setError(message);
      throw err;
    }
  }, []);

  // Récupération d'une grille par ID
  const getRubric = useCallback((rubricId: string): Rubric | undefined => {
    return getRubricById(rubricId);
  }, []);

  // Validation d'une grille
  const validateRubricData = useCallback((rubric: Rubric): RubricValidationResult => {
    return validateRubric(rubric);
  }, []);

  // Calcul du score maximum d'une grille
  const getMaxScore = useCallback((rubric: Rubric): number => {
    return calculateRubricMaxScore(rubric);
  }, []);

  // Évaluation d'un étudiant avec une grille
  const evaluateWithRubric = useCallback((
    rubricId: string,
    evaluations: Record<string, Record<string, number>>
  ): RubricEvaluationData | null => {
    const rubric = getRubric(rubricId);
    if (!rubric) return null;

    const sections = rubric.sections as Record<string, RubricSection>;
    let totalScore = 0;
    const maxScore = getMaxScore(rubric);

    // Calculer le score total
    Object.entries(evaluations).forEach(([sectionId, criteria]) => {
      Object.entries(criteria).forEach(([criterionId, points]) => {
        totalScore += points;
      });
    });

    const percentage = maxScore > 0 ? (totalScore / maxScore) * 100 : 0;

    return {
      rubricId,
      evaluations,
      totalScore,
      maxScore,
      percentage: Math.round(percentage * 100) / 100,
    };
  }, [getRubric, getMaxScore]);

  // Création d'une section vide pour l'éditeur
  const createEmptySection = useCallback((): RubricSection => {
    return {
      id: `section-${Date.now()}`,
      name: "Nouvelle section",
      weight: 25,
      criteria: [],
    };
  }, []);

  // Création d'un critère vide pour l'éditeur
  const createEmptyCriterion = useCallback((): RubricCriterion => {
    return {
      id: `criterion-${Date.now()}`,
      name: "Nouveau critère",
      description: "",
      levels: [
        {
          id: "excellent",
          name: "Excellent",
          description: "",
          points: 4,
        },
        {
          id: "good",
          name: "Bien",
          description: "",
          points: 3,
        },
        {
          id: "satisfactory",
          name: "Satisfaisant",
          description: "",
          points: 2,
        },
        {
          id: "insufficient",
          name: "Insuffisant",
          description: "",
          points: 1,
        },
      ],
    };
  }, []);

  // Modèle de contraintes par défaut
  const getDefaultConstraints = useCallback((): RubricConstraints => {
    return {
      maxTotalPoints: 20,
      sectionsRequired: true,
      minCriteria: 1,
      maxCriteria: 10,
      allowPartialPoints: true,
    };
  }, []);

  // Rafraîchissement des données
  const refresh = useCallback(() => {
    try {
      const teacherRubrics = getRubricsByTeacher(teacherId);
      setRubrics(teacherRubrics);
      setError(null);
    } catch (err) {
      setError("Erreur lors du rafraîchissement");
    }
  }, [teacherId]);

  // Filtrer les grilles par nom
  const searchRubrics = useCallback((query: string): Rubric[] => {
    if (!query.trim()) return rubrics;

    const searchTerm = query.toLowerCase();
    return rubrics.filter(rubric =>
      rubric.name.toLowerCase().includes(searchTerm)
    );
  }, [rubrics]);

  return {
    // État
    rubrics,
    loading,
    error,

    // Actions CRUD
    createRubric,
    updateRubric,
    deleteRubric,
    getRubric,

    // Validation et calculs
    validateRubricData,
    getMaxScore,
    evaluateWithRubric,

    // Utilitaires pour l'édition
    createEmptySection,
    createEmptyCriterion,
    getDefaultConstraints,

    // Autres actions
    refresh,
    searchRubrics,

    // Nettoyage d'erreur
    clearError: () => setError(null),
  };
}