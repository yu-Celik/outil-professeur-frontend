/**
 * Hook de gestion des étudiants
 * Utilise l'architecture partagée pour éliminer la duplication
 */

import { useState, useCallback } from "react";
import type { Student, Class } from "@/types/uml-entities";
import { MOCK_STUDENTS } from "@/data/mock-students";
import { MOCK_CLASSES } from "@/data/mock-classes";
import { useBaseManagement, generateUniqueId } from "@/hooks/shared/use-base-management";
import { requiredRule, customRule } from "@/hooks/shared/use-validation";

export interface StudentFormData {
  firstName: string;
  lastName: string;
  currentClassId: string;
  needs: string[];
  observations: string[];
  strengths: string[];
  improvementAxes: string[];
}

export interface UseStudentManagementReturn {
  // Données de base héritées du hook partagé
  students: Student[];
  loading: boolean;
  error: string | null;
  createStudent: (data: StudentFormData) => Promise<Student>;
  updateStudent: (id: string, data: StudentFormData) => Promise<Student>;
  deleteStudent: (id: string) => Promise<void>;
  getStudentById: (id: string) => Student | undefined;
  validateForm: (data: StudentFormData, excludeId?: string) => Record<keyof StudentFormData, string | null>;
  hasValidationErrors: (errors: Record<keyof StudentFormData, string | null>) => boolean;
  refresh: () => void;

  // Données et méthodes spécifiques aux étudiants
  classes: Class[];
  getStudentsByClass: (classId: string) => Student[];
  transferStudent: (studentId: string, newClassId: string) => Promise<Student>;
}

export function useStudentManagement(): UseStudentManagementReturn {
  const [classes] = useState<Class[]>(MOCK_CLASSES);

  // Configuration pour le hook de base
  const baseManagement = useBaseManagement<Student, StudentFormData>({
    entityName: "élève",
    mockData: MOCK_STUDENTS,
    generateId: () => `student-${generateUniqueId()}`,
    
    // Règles de validation
    validationRules: {
      firstName: [
        requiredRule("firstName", "Prénom"),
      ],
      lastName: [
        requiredRule("lastName", "Nom de famille"),
      ],
      currentClassId: [
        requiredRule("currentClassId", "Classe"),
        customRule(
          (value: string, items: Student[]) => {
            // Vérifier que la classe existe
            return classes.some((cls) => cls.id === value);
          },
          "La classe sélectionnée n'existe pas"
        ),
        customRule(
          (value: string, items: Student[], excludeId?: string) => {
            // Vérifier l'unicité prénom+nom dans la classe
            const formData = arguments[3] as StudentFormData;
            if (!formData) return true;
            
            return !items.some((student) => 
              student.id !== excludeId &&
              student.firstName.toLowerCase() === formData.firstName.toLowerCase() &&
              student.lastName.toLowerCase() === formData.lastName.toLowerCase() &&
              student.currentClassId === value
            );
          },
          "Un élève avec ce nom existe déjà dans cette classe"
        ),
      ],
      needs: [], // Optionnel
      observations: [], // Optionnel
      strengths: [], // Optionnel
      improvementAxes: [], // Optionnel
    },

    // Création d'entité
    createEntity: (data: StudentFormData) => ({
      firstName: data.firstName.trim(),
      lastName: data.lastName.trim(),
      currentClassId: data.currentClassId,
      needs: data.needs || [],
      observations: data.observations || [],
      strengths: data.strengths || [],
      improvementAxes: data.improvementAxes || [],
      // Méthodes UML
      getCurrentClass: () => classes.find((cls) => cls.id === data.currentClassId) || null,
      getParticipations: () => [],
      getExamResults: () => [],
      calculateAverage: () => 0,
      generateAppreciations: () => [],
    }),

    // Mise à jour d'entité
    updateEntity: (existing: Student, data: StudentFormData) => ({
      firstName: data.firstName.trim(),
      lastName: data.lastName.trim(),
      currentClassId: data.currentClassId,
      needs: data.needs || [],
      observations: data.observations || [],
      strengths: data.strengths || [],
      improvementAxes: data.improvementAxes || [],
      // Mettre à jour la méthode getCurrentClass
      getCurrentClass: () => classes.find((cls) => cls.id === data.currentClassId) || null,
    }),
  });

  // Méthodes spécifiques aux étudiants
  const getStudentsByClass = useCallback((classId: string) => {
    return baseManagement.items.filter((student) => student.currentClassId === classId);
  }, [baseManagement.items]);

  const transferStudent = useCallback(async (studentId: string, newClassId: string): Promise<Student> => {
    // Vérifier que la nouvelle classe existe
    const newClass = classes.find((cls) => cls.id === newClassId);
    if (!newClass) {
      throw new Error("La classe de destination n'existe pas");
    }

    // Vérifier que l'étudiant existe
    const student = baseManagement.getById(studentId);
    if (!student) {
      throw new Error("Élève introuvable");
    }

    // Vérifier qu'il n'y a pas déjà un élève avec ce nom dans la nouvelle classe
    const conflict = baseManagement.items.some((s) => 
      s.id !== studentId &&
      s.firstName.toLowerCase() === student.firstName.toLowerCase() &&
      s.lastName.toLowerCase() === student.lastName.toLowerCase() &&
      s.currentClassId === newClassId
    );

    if (conflict) {
      throw new Error("Un élève avec ce nom existe déjà dans la classe de destination");
    }

    // Effectuer le transfert via la méthode update
    return baseManagement.update(studentId, {
      firstName: student.firstName,
      lastName: student.lastName,
      currentClassId: newClassId,
      needs: student.needs,
      observations: student.observations,
      strengths: student.strengths,
      improvementAxes: student.improvementAxes,
    });
  }, [baseManagement, classes]);

  return {
    // Propriétés héritées du hook de base
    students: baseManagement.items,
    loading: baseManagement.loading,
    error: baseManagement.error,
    createStudent: baseManagement.create,
    updateStudent: baseManagement.update,
    deleteStudent: baseManagement.delete,
    getStudentById: baseManagement.getById,
    validateForm: baseManagement.validateForm,
    hasValidationErrors: baseManagement.hasValidationErrors,
    refresh: baseManagement.refresh,

    // Propriétés spécifiques
    classes,
    getStudentsByClass,
    transferStudent,
  };
}