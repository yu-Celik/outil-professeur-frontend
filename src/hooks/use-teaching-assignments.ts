"use client";

import { useEffect, useState } from "react";
import {
  MOCK_CLASSES,
  MOCK_SCHOOL_YEARS,
  MOCK_SUBJECTS,
  MOCK_TEACHING_ASSIGNMENTS,
} from "@/data";
import type {
  Class,
  SchoolYear,
  Subject,
  TeachingAssignment,
} from "@/types/uml-entities";

export interface TeachingAssignmentWithRelations extends TeachingAssignment {
  class: Class;
  subject: Subject;
  schoolYear: SchoolYear;
}

export interface TeachingRights {
  canEvaluateStudent: (
    studentId: string,
    subjectId: string,
    classId: string,
  ) => boolean;
  canManageClass: (classId: string) => boolean;
  canAccessSubject: (subjectId: string) => boolean;
  canCreateSession: (classId: string, subjectId: string) => boolean;
  canViewStudentProfile: (studentId: string, classId: string) => boolean;
  canEditStudentData: (studentId: string, classId: string) => boolean;
  canManageSessions: boolean;
  canViewSessions: boolean;
  getAuthorizedClasses: () => Class[];
  getAuthorizedSubjects: () => Subject[];
  getCurrentAssignments: () => TeachingAssignmentWithRelations[];
}

export function useTeachingAssignments(
  teacherId: string = "KsmNtVf4zwqO3VV3SQJqPrRlQBA1fFyR",
) {
  const [assignments, setAssignments] = useState<
    TeachingAssignmentWithRelations[]
  >([]);
  const [loading, setLoading] = useState(true);

  // Chargement des données depuis /src/data/
  useEffect(() => {
    // Créer les assignments avec relations à partir des données centralisées
    const assignmentsWithRelations: TeachingAssignmentWithRelations[] =
      MOCK_TEACHING_ASSIGNMENTS.filter(
        (assignment) => assignment.userId === teacherId && assignment.isActive,
      )
        .map((assignment) => {
          const classEntity = MOCK_CLASSES.find(
            (c) => c.id === assignment.classId,
          );
          const subject = MOCK_SUBJECTS.find(
            (s) => s.id === assignment.subjectId,
          );
          const schoolYear = MOCK_SCHOOL_YEARS.find(
            (sy) => sy.id === assignment.schoolYearId,
          );

          if (!classEntity || !subject || !schoolYear) {
            return null;
          }

          return {
            ...assignment,
            class: classEntity,
            subject: subject,
            schoolYear: schoolYear,
          };
        })
        .filter(Boolean) as TeachingAssignmentWithRelations[];

    setAssignments(assignmentsWithRelations);
    setLoading(false);
  }, [teacherId]);

  const teachingRights: TeachingRights = {
    canEvaluateStudent: (
      _studentId: string,
      subjectId: string,
      classId: string,
    ) => {
      return assignments.some(
        (assignment) =>
          assignment.subjectId === subjectId &&
          assignment.classId === classId &&
          assignment.isActive,
      );
    },

    canManageClass: (classId: string) => {
      return assignments.some(
        (assignment) =>
          assignment.classId === classId &&
          assignment.isActive &&
          assignment.role === "teacher",
      );
    },

    canAccessSubject: (subjectId: string) => {
      return assignments.some(
        (assignment) =>
          assignment.subjectId === subjectId && assignment.isActive,
      );
    },

    canCreateSession: (classId: string, subjectId: string) => {
      return assignments.some(
        (assignment) =>
          assignment.classId === classId &&
          assignment.subjectId === subjectId &&
          assignment.isActive,
      );
    },

    canViewStudentProfile: (_studentId: string, classId: string) => {
      return assignments.some(
        (assignment) => assignment.classId === classId && assignment.isActive,
      );
    },

    canEditStudentData: (_studentId: string, classId: string) => {
      return assignments.some(
        (assignment) =>
          assignment.classId === classId &&
          assignment.isActive &&
          assignment.role === "teacher",
      );
    },

    getAuthorizedClasses: () => {
      return assignments
        .filter((assignment) => assignment.isActive)
        .map((assignment) => assignment.class)
        .filter(
          (classItem, index, self) =>
            index === self.findIndex((c) => c.id === classItem.id),
        );
    },

    getAuthorizedSubjects: () => {
      return assignments
        .filter((assignment) => assignment.isActive)
        .map((assignment) => assignment.subject)
        .filter(
          (subject, index, self) =>
            index === self.findIndex((s) => s.id === subject.id),
        );
    },

    canManageSessions: assignments.some(
      (assignment) => assignment.isActive && assignment.role === "teacher",
    ),
    canViewSessions: assignments.some((assignment) => assignment.isActive),

    getCurrentAssignments: () => {
      return assignments.filter((assignment) => assignment.isActive);
    },
  };

  return {
    assignments,
    loading,
    rights: teachingRights,
  };
}
