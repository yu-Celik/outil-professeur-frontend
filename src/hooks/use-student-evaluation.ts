import { useCallback, useState } from "react";
import type { CourseSession, StudentParticipation } from "@/types/uml-entities";
import { useAsyncOperation } from "./shared/use-async-operation";
import { useEntityState } from "./shared/use-entity-state";

interface UseStudentEvaluationReturn {
  // State
  currentSession: CourseSession | null;
  participation: StudentParticipation | null;
  isLoading: boolean;
  hasUnsavedChanges: boolean;

  // Actions
  updateParticipation: (
    studentId: string,
    data: Partial<StudentParticipation>,
  ) => void;
  markAttendance: (studentId: string, isPresent: boolean) => void;
  setParticipationLevel: (studentId: string, level: number) => void;
  addRemarks: (studentId: string, remarks: string) => void;
  updateBehavior: (studentId: string, behavior: string) => void;
  updateTechnicalIssues: (studentId: string, issues: string) => void;
  saveEvaluation: () => Promise<void>;
  resetEvaluation: () => void;
}

export function useStudentEvaluation(
  sessionId: string,
  studentId: string,
): UseStudentEvaluationReturn {
  // Mock data pour la démonstration
  const [currentSession, _setCurrentSession] = useState<CourseSession>({
    id: "session-1",
    createdBy: "KsmNtVf4zwqO3VV3SQJqPrRlQBA1fFyR",
    classId: "class-b1",
    subjectId: "subject-math",
    timeSlotId: "timeslot-16h",
    sessionDate: new Date("2025-02-18T16:00:00"),
    room: "Salle virtuelle",
    status: "active",
    objectives: "Évaluation des étudiants",
    content: "Session d'évaluation",
    homeworkAssigned: "",
    notes: "",
    attendanceTaken: false,
    createdAt: new Date(),
    updatedAt: new Date(),
    reschedule: () => {},
    takeAttendance: () => {},
    summary: () => "Session d'évaluation",
  });

  // Utilisation des hooks partagés pour éliminer la duplication
  const { isLoading, execute } = useAsyncOperation<void>();
  const {
    entity: participation,
    updateEntity: updateParticipationEntity,
    hasUnsavedChanges,
    markSaved,
    resetChanges,
  } = useEntityState<StudentParticipation>({
    id: `participation-${studentId}`,
    createdBy: "KsmNtVf4zwqO3VV3SQJqPrRlQBA1fFyR",
    courseSessionId: sessionId,
    studentId: studentId,
    isPresent: true,
    behavior: "Attentif",
    participationLevel: 18,
    specificRemarks: "",
    technicalIssues: "",
    cameraEnabled: true,
    markedAt: new Date(),
    markAttendance: (_isPresent: boolean) => {},
    setParticipationLevel: (_level: number) => {},
    addRemarks: (_remarks: string) => {},
    updateBehavior: (_behavior: string) => {},
  });

  // Méthodes simplifiées grâce à useEntityState
  const markAttendance = useCallback(
    (_studentId: string, isPresent: boolean) => {
      updateParticipationEntity({
        isPresent,
        markedAt: new Date(),
      });
    },
    [updateParticipationEntity],
  );

  const setParticipationLevel = useCallback(
    (_studentId: string, level: number) => {
      updateParticipationEntity({ participationLevel: level });
    },
    [updateParticipationEntity],
  );

  const addRemarks = useCallback(
    (_studentId: string, remarks: string) => {
      updateParticipationEntity({ specificRemarks: remarks });
    },
    [updateParticipationEntity],
  );

  const updateBehavior = useCallback(
    (_studentId: string, behavior: string) => {
      updateParticipationEntity({ behavior });
    },
    [updateParticipationEntity],
  );

  const updateTechnicalIssues = useCallback(
    (_studentId: string, issues: string) => {
      updateParticipationEntity({
        technicalIssues: issues,
        cameraEnabled: !issues.includes("caméra") && issues !== "",
      });
    },
    [updateParticipationEntity],
  );

  const updateParticipation = useCallback(
    (_studentId: string, data: Partial<StudentParticipation>) => {
      updateParticipationEntity(data);
    },
    [updateParticipationEntity],
  );

  const saveEvaluation = useCallback(async () => {
    await execute(async () => {
      // Simulation d'un appel API
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Ici on enverrait les données au backend
      console.log("Sauvegarde de l'évaluation:", {
        session: currentSession,
        participation,
      });

      markSaved();
    });
  }, [execute, currentSession, participation, markSaved]);

  const resetEvaluation = useCallback(() => {
    updateParticipationEntity({
      behavior: "Attentif",
      participationLevel: 10,
      specificRemarks: "",
      technicalIssues: "",
      isPresent: true,
      cameraEnabled: true,
    });
    resetChanges();
  }, [updateParticipationEntity, resetChanges]);

  return {
    currentSession,
    participation,
    isLoading,
    hasUnsavedChanges,
    updateParticipation,
    markAttendance,
    setParticipationLevel,
    addRemarks,
    updateBehavior,
    updateTechnicalIssues,
    saveEvaluation,
    resetEvaluation,
  };
}
