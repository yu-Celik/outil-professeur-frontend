"use client";

/**
 * Hook pour le filtrage intelligent des classes et matières
 *
 * Utilise TeachingAssignment pour ne proposer que les combinaisons valides
 */

import { useCallback, useMemo, useState } from "react";
import type { Class, Subject } from "@/types/uml-entities";
import {
  canTeachSubjectToClass,
  getAssignmentStats,
  getClassesForSubject,
  getSubjectsForClass,
  getValidClassSubjectCombinations,
} from "@/utils/teaching-assignment-filters";

interface UseSmartFilteringProps {
  teacherId: string;
  schoolYearId?: string;
}

interface UseSmartFilteringReturn {
  // État des sélections
  selectedSubject: Subject | null;
  selectedClass: Class | null;

  // Actions de sélection
  selectSubject: (subject: Subject | null) => void;
  selectClass: (classEntity: Class | null) => void;

  // Listes filtrées intelligemment
  availableClasses: Class[];
  availableSubjects: Subject[];

  // Validation
  isValidCombination: boolean;
  canCreateSession: boolean;

  // Toutes les combinaisons valides
  validCombinations: Array<{
    class: Class;
    subject: Subject;
    assignment: import("@/types/uml-entities").TeachingAssignment;
  }>;

  // Statistiques pour debug
  assignmentStats: {
    totalAssignments: number;
    subjectStats: Record<string, number>;
    classStats: Record<string, number>;
  };

  // Réinitialisation
  reset: () => void;
}

export function useSmartFiltering({
  teacherId,
  schoolYearId = "year-2025",
}: UseSmartFilteringProps): UseSmartFilteringReturn {
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);
  const [selectedClass, setSelectedClass] = useState<Class | null>(null);

  // Toutes les combinaisons valides pour ce professeur
  const validCombinations = useMemo(
    () => getValidClassSubjectCombinations(teacherId, schoolYearId),
    [teacherId, schoolYearId],
  );

  // Classes disponibles selon la matière sélectionnée
  const availableClasses = useMemo(() => {
    if (!selectedSubject) {
      // Aucune matière sélectionnée → toutes les classes du professeur
      return Array.from(new Set(validCombinations.map((combo) => combo.class)));
    }

    // Matière sélectionnée → classes qui suivent cette matière
    return getClassesForSubject(selectedSubject.id, teacherId, schoolYearId);
  }, [selectedSubject, teacherId, schoolYearId, validCombinations]);

  // Matières disponibles selon la classe sélectionnée
  const availableSubjects = useMemo(() => {
    if (!selectedClass) {
      // Aucune classe sélectionnée → toutes les matières du professeur
      return Array.from(
        new Set(validCombinations.map((combo) => combo.subject)),
      );
    }

    // Classe sélectionnée → matières enseignées dans cette classe
    return getSubjectsForClass(selectedClass.id, teacherId, schoolYearId);
  }, [selectedClass, teacherId, schoolYearId, validCombinations]);

  // Validation de la combinaison actuelle
  const isValidCombination = useMemo(() => {
    if (!selectedSubject || !selectedClass) return true; // Pas de sélection = valide

    return canTeachSubjectToClass(
      teacherId,
      selectedSubject.id,
      selectedClass.id,
      schoolYearId,
    );
  }, [selectedSubject, selectedClass, teacherId, schoolYearId]);

  // Peut créer une session (combinaison complète et valide)
  const canCreateSession = useMemo(() => {
    return (
      selectedSubject !== null && selectedClass !== null && isValidCombination
    );
  }, [selectedSubject, selectedClass, isValidCombination]);

  // Statistiques pour debug
  const assignmentStats = useMemo(
    () => getAssignmentStats(schoolYearId),
    [schoolYearId],
  );

  // Actions de sélection avec validation
  const selectSubject = useCallback(
    (subject: Subject | null) => {
      setSelectedSubject(subject);

      // Si la classe actuelle n'est plus compatible, la désélectionner
      if (selectedClass && subject) {
        const validClasses = getClassesForSubject(
          subject.id,
          teacherId,
          schoolYearId,
        );
        const isClassStillValid = validClasses.some(
          (c) => c.id === selectedClass.id,
        );

        if (!isClassStillValid) {
          setSelectedClass(null);
        }
      }
    },
    [selectedClass, teacherId, schoolYearId],
  );

  const selectClass = useCallback(
    (classEntity: Class | null) => {
      setSelectedClass(classEntity);

      // Si la matière actuelle n'est plus compatible, la désélectionner
      if (selectedSubject && classEntity) {
        const validSubjects = getSubjectsForClass(
          classEntity.id,
          teacherId,
          schoolYearId,
        );
        const isSubjectStillValid = validSubjects.some(
          (s) => s.id === selectedSubject.id,
        );

        if (!isSubjectStillValid) {
          setSelectedSubject(null);
        }
      }
    },
    [selectedSubject, teacherId, schoolYearId],
  );

  const reset = useCallback(() => {
    setSelectedSubject(null);
    setSelectedClass(null);
  }, []);

  return {
    selectedSubject,
    selectedClass,
    selectSubject,
    selectClass,
    availableClasses,
    availableSubjects,
    isValidCombination,
    canCreateSession,
    validCombinations,
    assignmentStats,
    reset,
  };
}
