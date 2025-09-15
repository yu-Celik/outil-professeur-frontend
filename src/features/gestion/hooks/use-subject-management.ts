/**
 * Hook de gestion des matières
 * Utilise l'architecture partagée pour éliminer la duplication
 */

import { useCallback } from "react";
import type { Subject } from "@/types/uml-entities";
import { MOCK_SUBJECTS } from "@/features/gestion/mocks";
import { useBaseManagement, generateUniqueId } from "@/shared/hooks";
import { requiredRule, uniqueRule, lengthRule } from "@/shared/hooks";

export interface SubjectFormData {
  name: string;
  code: string;
  description: string;
}

export interface UseSubjectManagementReturn {
  // Données de base héritées du hook partagé
  subjects: Subject[];
  loading: boolean;
  error: string | null;
  createSubject: (data: SubjectFormData) => Promise<Subject>;
  updateSubject: (id: string, data: SubjectFormData) => Promise<Subject>;
  deleteSubject: (id: string) => Promise<void>;
  getSubjectById: (id: string) => Subject | undefined;
  validateForm: (data: SubjectFormData, excludeId?: string) => Record<keyof SubjectFormData, string | null>;
  hasValidationErrors: (errors: Record<keyof SubjectFormData, string | null>) => boolean;
  refresh: () => void;

  // Méthodes spécifiques aux matières
  getSubjectByCode: (code: string) => Subject | undefined;
  searchSubjects: (query: string) => Subject[];
}

export function useSubjectManagement(): UseSubjectManagementReturn {
  
  // Configuration pour le hook de base
  const baseManagement = useBaseManagement<Subject, SubjectFormData>({
    entityName: "matière",
    mockData: MOCK_SUBJECTS,
    generateId: () => `subject-${generateUniqueId()}`,
    
    // Règles de validation
    validationRules: {
      name: [
        requiredRule("name", "Nom de la matière"),
        lengthRule(2, 100, "Nom de la matière"),
        uniqueRule("name", "Nom de matière"),
      ],
      code: [
        requiredRule("code", "Code de la matière"),
        lengthRule(2, 10, "Code de la matière"),
        uniqueRule("code", "Code de matière"),
      ],
      description: [
        lengthRule(0, 500, "Description"),
      ],
    },

    // Création d'entité
    createEntity: (data: SubjectFormData) => ({
      name: data.name.trim(),
      code: data.code.trim().toUpperCase(),
      description: data.description.trim(),
      // Méthodes UML
      getTeachingAssignments: () => [],
      getSessions: () => [],
      getExams: () => [],
    }),

    // Mise à jour d'entité
    updateEntity: (existing: Subject, data: SubjectFormData) => ({
      name: data.name.trim(),
      code: data.code.trim().toUpperCase(),
      description: data.description.trim(),
    }),
  });

  // Méthodes spécifiques aux matières
  const getSubjectByCode = useCallback((code: string) => {
    return baseManagement.items.find((subject) => 
      subject.code.toLowerCase() === code.toLowerCase()
    );
  }, [baseManagement.items]);

  const searchSubjects = useCallback((query: string) => {
    if (!query.trim()) {
      return baseManagement.items;
    }

    const searchTerm = query.toLowerCase().trim();
    return baseManagement.items.filter((subject) => 
      subject.name.toLowerCase().includes(searchTerm) ||
      subject.code.toLowerCase().includes(searchTerm) ||
      subject.description.toLowerCase().includes(searchTerm)
    );
  }, [baseManagement.items]);

  return {
    // Propriétés héritées du hook de base
    subjects: baseManagement.items,
    loading: baseManagement.loading,
    error: baseManagement.error,
    createSubject: baseManagement.create,
    updateSubject: baseManagement.update,
    deleteSubject: baseManagement.delete,
    getSubjectById: baseManagement.getById,
    validateForm: baseManagement.validateForm,
    hasValidationErrors: baseManagement.hasValidationErrors,
    refresh: baseManagement.refresh,

    // Propriétés spécifiques
    getSubjectByCode,
    searchSubjects,
  };
}