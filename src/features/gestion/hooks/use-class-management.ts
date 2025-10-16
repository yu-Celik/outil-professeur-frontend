/**
 * Hook de gestion des classes
 * Utilise l'architecture partagée pour éliminer la duplication
 */

import { useState, useCallback } from "react";
import type { Class, SchoolYear } from "@/types/uml-entities";
import { MOCK_CLASSES } from "@/features/gestion/mocks";
import { MOCK_SCHOOL_YEARS } from "@/features/gestion/mocks";
import { useBaseManagement, generateUniqueId } from "@/shared/hooks";
import { requiredRule, customRule } from "@/shared/hooks";

export interface ClassFormData {
  classCode: string;
  gradeLabel: string;
  schoolYearId: string;
}

export interface UseClassManagementReturn {
  // Données de base héritées du hook partagé
  classes: Class[];
  loading: boolean;
  error: string | null;
  createClass: (data: ClassFormData) => Promise<Class>;
  updateClass: (id: string, data: ClassFormData) => Promise<Class>;
  deleteClass: (id: string) => Promise<void>;
  getClassById: (id: string) => Class | undefined;
  validateForm: (
    data: ClassFormData,
    excludeId?: string,
  ) => Record<keyof ClassFormData, string | null>;
  hasValidationErrors: (
    errors: Record<keyof ClassFormData, string | null>,
  ) => boolean;

  // Données et méthodes spécifiques aux classes
  schoolYears: SchoolYear[];
  getClassesBySchoolYear: (schoolYearId: string) => Class[];
  refresh: () => void;
}

export function useClassManagement(): UseClassManagementReturn {
  const [schoolYears] = useState<SchoolYear[]>(MOCK_SCHOOL_YEARS);

  // Configuration pour le hook de base
  const baseManagement = useBaseManagement<Class, ClassFormData>({
    entityName: "classe",
    mockData: MOCK_CLASSES,
    generateId: () => `class-${generateUniqueId()}`,

    // Règles de validation
    validationRules: {
      classCode: [
        requiredRule("classCode", "Code de classe"),
        customRule((value: string, items: Class[], excludeId?: string) => {
          // Vérifier l'unicité du code dans l'année scolaire
          const formData = arguments[3] as ClassFormData;
          return !items.some(
            (cls) =>
              cls.id !== excludeId &&
              cls.classCode === value &&
              cls.schoolYearId === (formData as any).schoolYearId,
          );
        }, "Une classe avec ce code existe déjà pour cette année scolaire"),
      ],
      gradeLabel: [requiredRule("gradeLabel", "Niveau de classe")],
      schoolYearId: [requiredRule("schoolYearId", "Année scolaire")],
    },

    // Création d'entité
    createEntity: (data: ClassFormData) => ({
      createdBy: "current-user-id", // TODO: remplacer par l'utilisateur connecté
      classCode: data.classCode,
      gradeLabel: data.gradeLabel,
      schoolYearId: data.schoolYearId,
      assignStudent: (studentId: string) => {
        console.log("Assign student:", studentId);
      },
      transferStudent: (studentId: string, toClassId: string) => {
        console.log("Transfer student:", studentId, "to:", toClassId);
      },
      getStudents: () => [],
      getSessions: () => [],
      getExams: () => [],
    }),

    // Mise à jour d'entité
    updateEntity: (existing: Class, data: ClassFormData) => ({
      classCode: data.classCode,
      gradeLabel: data.gradeLabel,
      schoolYearId: data.schoolYearId,
    }),
  });

  // Méthodes spécifiques aux classes
  const getClassesBySchoolYear = useCallback(
    (schoolYearId: string) => {
      return baseManagement.items.filter(
        (cls) => cls.schoolYearId === schoolYearId,
      );
    },
    [baseManagement.items],
  );

  return {
    // Propriétés héritées du hook de base
    classes: baseManagement.items,
    loading: baseManagement.loading,
    error: baseManagement.error,
    createClass: baseManagement.create,
    updateClass: baseManagement.update,
    deleteClass: baseManagement.delete,
    getClassById: baseManagement.getById,
    validateForm: baseManagement.validateForm,
    hasValidationErrors: baseManagement.hasValidationErrors,
    refresh: baseManagement.refresh,

    // Propriétés spécifiques
    schoolYears,
    getClassesBySchoolYear,
  };
}
