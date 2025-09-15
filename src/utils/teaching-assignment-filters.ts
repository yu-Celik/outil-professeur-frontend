/**
 * Utilitaires de filtrage intelligent basés sur TeachingAssignment
 *
 * Principe : Chaque classe n'est reliée qu'aux matières qui lui sont réellement enseignées
 * via les affectations d'enseignement (TeachingAssignment)
 */

import { MOCK_CLASSES } from "@/features/gestion/mocks";
import { MOCK_SUBJECTS } from "@/features/gestion/mocks";
import { MOCK_TEACHING_ASSIGNMENTS } from "@/features/gestion/mocks";
import type { Class, Subject, TeachingAssignment } from "@/types/uml-entities";

/**
 * Obtient les classes autorisées pour une matière donnée
 * @param subjectId ID de la matière
 * @param teacherId ID du professeur (optionnel, pour filtrer par prof)
 * @param schoolYearId ID de l'année scolaire
 * @returns Liste des classes qui suivent cette matière
 */
export function getClassesForSubject(
  subjectId: string,
  teacherId?: string,
  schoolYearId: string = "year-2025",
): Class[] {
  // Filtrer les affectations pour cette matière
  let assignments = MOCK_TEACHING_ASSIGNMENTS.filter(
    (assignment) =>
      assignment.subjectId === subjectId &&
      assignment.schoolYearId === schoolYearId &&
      assignment.isActive,
  );

  // Si un professeur est spécifié, filtrer par professeur
  if (teacherId) {
    assignments = assignments.filter(
      (assignment) => assignment.userId === teacherId,
    );
  }

  // Récupérer les classes correspondantes
  const classIds = assignments.map((assignment) => assignment.classId);

  return MOCK_CLASSES.filter((classEntity) =>
    classIds.includes(classEntity.id),
  );
}

/**
 * Obtient les matières enseignées dans une classe donnée
 * @param classId ID de la classe
 * @param teacherId ID du professeur (optionnel, pour filtrer par prof)
 * @param schoolYearId ID de l'année scolaire
 * @returns Liste des matières enseignées dans cette classe
 */
export function getSubjectsForClass(
  classId: string,
  teacherId?: string,
  schoolYearId: string = "year-2025",
): Subject[] {
  // Filtrer les affectations pour cette classe
  let assignments = MOCK_TEACHING_ASSIGNMENTS.filter(
    (assignment) =>
      assignment.classId === classId &&
      assignment.schoolYearId === schoolYearId &&
      assignment.isActive,
  );

  // Si un professeur est spécifié, filtrer par professeur
  if (teacherId) {
    assignments = assignments.filter(
      (assignment) => assignment.userId === teacherId,
    );
  }

  // Récupérer les matières correspondantes
  const subjectIds = assignments.map((assignment) => assignment.subjectId);

  return MOCK_SUBJECTS.filter((subject) => subjectIds.includes(subject.id));
}

/**
 * Vérifie si un professeur peut enseigner une matière à une classe
 * @param teacherId ID du professeur
 * @param subjectId ID de la matière
 * @param classId ID de la classe
 * @param schoolYearId ID de l'année scolaire
 * @returns true si l'affectation existe et est active
 */
export function canTeachSubjectToClass(
  teacherId: string,
  subjectId: string,
  classId: string,
  schoolYearId: string = "year-2025",
): boolean {
  return MOCK_TEACHING_ASSIGNMENTS.some(
    (assignment) =>
      assignment.userId === teacherId &&
      assignment.subjectId === subjectId &&
      assignment.classId === classId &&
      assignment.schoolYearId === schoolYearId &&
      assignment.isActive,
  );
}

/**
 * Obtient toutes les combinaisons classe-matière valides pour un professeur
 * @param teacherId ID du professeur
 * @param schoolYearId ID de l'année scolaire
 * @returns Liste des combinaisons autorisées
 */
export function getValidClassSubjectCombinations(
  teacherId: string,
  schoolYearId: string = "year-2025",
): Array<{
  class: Class;
  subject: Subject;
  assignment: TeachingAssignment;
}> {
  const assignments = MOCK_TEACHING_ASSIGNMENTS.filter(
    (assignment) =>
      assignment.userId === teacherId &&
      assignment.schoolYearId === schoolYearId &&
      assignment.isActive,
  );

  return assignments.map((assignment) => {
    const classEntity = MOCK_CLASSES.find((c) => c.id === assignment.classId);
    const subject = MOCK_SUBJECTS.find((s) => s.id === assignment.subjectId);

    if (!classEntity || !subject) {
      throw new Error(
        `Données incohérentes pour l'affectation ${assignment.id}`,
      );
    }

    return {
      class: classEntity,
      subject: subject,
      assignment: assignment,
    };
  });
}

/**
 * Statistiques des affectations pour debuggage
 */
export function getAssignmentStats(schoolYearId: string = "year-2025") {
  const assignments = MOCK_TEACHING_ASSIGNMENTS.filter(
    (assignment) =>
      assignment.schoolYearId === schoolYearId && assignment.isActive,
  );

  const subjectStats = new Map<string, number>();
  const classStats = new Map<string, number>();

  assignments.forEach((assignment) => {
    // Compter par matière
    subjectStats.set(
      assignment.subjectId,
      (subjectStats.get(assignment.subjectId) || 0) + 1,
    );

    // Compter par classe
    classStats.set(
      assignment.classId,
      (classStats.get(assignment.classId) || 0) + 1,
    );
  });

  return {
    totalAssignments: assignments.length,
    subjectStats: Object.fromEntries(subjectStats),
    classStats: Object.fromEntries(classStats),
  };
}
