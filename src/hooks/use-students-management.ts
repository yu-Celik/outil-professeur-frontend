"use client";

import { useState, useCallback, useMemo } from "react";
import { getStudentsByClass } from "@/data/mock-students";
import { useUserSession } from "@/hooks/use-user-session";
import { useTeachingAssignments } from "@/hooks/use-teaching-assignments";
import { useClassColors } from "@/hooks/use-class-colors";
import type { Student, Class } from "@/types/uml-entities";

export function useStudentsManagement() {
  const { user } = useUserSession();
  const [selectedClassId, setSelectedClassId] = useState<string | null>(null);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

  const currentTeacherId = user?.id || "KsmNtVf4zwqO3VV3SQJqPrRlQBA1fFyR";
  
  // Récupérer les données des assignments et classes
  const { assignments, rights, loading: assignmentsLoading } = useTeachingAssignments(currentTeacherId);
  const classes = rights.getAuthorizedClasses();
  const { getClassColorWithText } = useClassColors(currentTeacherId);

  // Mémoisé les étudiants de la classe sélectionnée
  const studentsOfSelectedClass = useMemo(() => {
    if (!selectedClassId) return [];
    return getStudentsByClass(selectedClassId);
  }, [selectedClassId]);

  // Trouver la classe sélectionnée
  const selectedClass = useMemo(() => {
    if (!selectedClassId || !classes) return undefined;
    return classes.find((c) => c.id === selectedClassId);
  }, [selectedClassId, classes]);

  // Gestionnaires d'événements
  const handleClassSelect = useCallback((classId: string) => {
    setSelectedClassId(classId);
    setSelectedStudent(null); // Réinitialiser la sélection d'élève
  }, []);

  const handleStudentClick = useCallback((student: Student) => {
    setSelectedStudent(student);
  }, []);

  const handleCloseStudentProfile = useCallback(() => {
    setSelectedStudent(null);
  }, []);

  const handleSessionClick = useCallback((sessionId: string) => {
    console.log("Ouvrir la session:", sessionId);
    // TODO: Navigation vers les détails de la session
  }, []);

  // Sélectionner automatiquement la première classe s'il y en a une
  const selectFirstClassIfAvailable = useCallback(() => {
    if (!selectedClassId && classes && classes.length > 0) {
      setSelectedClassId(classes[0].id);
    }
  }, [selectedClassId, classes]);

  return {
    // État
    currentTeacherId,
    selectedClassId,
    selectedStudent,
    selectedClass,
    classes,
    studentsOfSelectedClass,
    assignmentsLoading,
    
    // Fonctions utilitaires
    getClassColorWithText,
    
    // Gestionnaires d'événements
    handleClassSelect,
    handleStudentClick,
    handleCloseStudentProfile,
    handleSessionClick,
    selectFirstClassIfAvailable,
  };
}