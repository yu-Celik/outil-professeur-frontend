import { useCallback, useState } from "react";
import type {
  Class,
  CourseSession,
  Student,
  StudentParticipation,
  Subject,
  TeachingAssignment,
  TimeSlot,
} from "@/types/uml-entities";
import { useAsyncOperation } from "./shared/use-async-operation";
import { useEntityState } from "./shared/use-entity-state";
import { findEntityById } from "@/utils/entity-lookups";

interface UseUMLEvaluationReturn {
  // Entités UML principales
  courseSession: CourseSession | null;
  student: Student | null;
  subject: Subject | null;
  timeSlot: TimeSlot | null;
  class: Class | null;
  participation: StudentParticipation | null;
  teachingAssignment: TeachingAssignment | null;

  // State
  isLoading: boolean;
  hasUnsavedChanges: boolean;

  // Actions basées sur les méthodes UML
  markAttendance: (isPresent: boolean) => void;
  setParticipationLevel: (level: number) => void;
  addRemarks: (remarks: string) => void;
  updateBehavior: (behavior: string) => void;
  updateTechnicalIssues: (issues: string) => void;
  saveParticipation: () => Promise<void>;
  takeAttendance: () => Promise<void>;

  // Méthodes calculées
  getSessionSummary: () => string;
  canEvaluate: () => boolean;
  getAttendanceRate: () => number;
  getParticipationAverage: () => number;
}

export function useUMLEvaluation(
  studentId: string,
  sessionId?: string,
): UseUMLEvaluationReturn {
  // Mock data basé exactement sur les entités UML
  const [courseSession, setCourseSession] = useState<CourseSession>({
    id: sessionId || "session-1",
    createdBy: "KsmNtVf4zwqO3VV3SQJqPrRlQBA1fFyR",
    classId: "class-b1",
    subjectId: "subject-math",
    timeSlotId: "timeslot-1",
    sessionDate: new Date("2025-02-18T16:00:00"),
    room: "Salle A",
    status: "in_progress",
    objectives: "Résoudre des équations du second degré",
    content: "Cours sur les équations quadratiques",
    homeworkAssigned: "Exercices 1-5 page 42",
    notes: "",
    attendanceTaken: false,
    createdAt: new Date(),
    updatedAt: new Date(),
    reschedule: (newDate: Date) => console.log("Reschedule to", newDate),
    takeAttendance: () => console.log("Taking attendance"),
    summary: () => "Session de mathématiques - Équations du second degré",
  });

  const [subject, _setSubject] = useState<Subject>({
    id: "subject-math",
    createdBy: "KsmNtVf4zwqO3VV3SQJqPrRlQBA1fFyR",
    name: "Mathématiques",
    code: "MATH",
    description: "Cours de mathématiques niveau secondaire",
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  const [timeSlot, _setTimeSlot] = useState<TimeSlot>({
    id: "timeslot-1",
    createdBy: "KsmNtVf4zwqO3VV3SQJqPrRlQBA1fFyR",
    name: "16h00-17h00",
    startTime: "16:00",
    endTime: "17:00",
    durationMinutes: 60,
    displayOrder: 1,
    isBreak: false,
    createdAt: new Date(),
    updatedAt: new Date(),
    overlaps: (_other: TimeSlot) => false,
    getDuration: () => 60,
  });

  const [classEntity, _setClassEntity] = useState<Class>({
    id: "class-b1",
    createdBy: "KsmNtVf4zwqO3VV3SQJqPrRlQBA1fFyR",
    classCode: "B1",
    gradeLabel: "Niveau B1",
    schoolYearId: "year-2025",
    createdAt: new Date(),
    updatedAt: new Date(),
    assignStudent: (studentId: string) =>
      console.log("Assign student", studentId),
    transferStudent: (_studentId: string, _toClassId: string) =>
      console.log("Transfer student"),
    getStudents: () => [],
    getSessions: () => [],
    getExams: () => [],
  });

  const [student, _setStudent] = useState<Student>({
    id: studentId,
    createdBy: "KsmNtVf4zwqO3VV3SQJqPrRlQBA1fFyR",
    firstName: "Pierre",
    lastName: "Collin",
    currentClassId: "class-b1",
    needs: ["Améliorer la concentration"],
    observations: ["Élève attentif mais timide"],
    strengths: ["Bon en calcul mental"],
    improvementAxes: ["Participation orale"],
    createdAt: new Date(),
    updatedAt: new Date(),
    fullName: () => "Pierre Collin",
    attendanceRate: (_start: Date, _end: Date) => 0.85,
    participationAverage: (_start: Date, _end: Date) => 16.5,
  });

  // Utilisation des hooks partagés pour éliminer la duplication
  const { isLoading, execute } = useAsyncOperation<void>();
  const {
    entity: participation,
    updateEntity: updateParticipationEntity,
    hasUnsavedChanges,
    markSaved,
  } = useEntityState<StudentParticipation>({
    id: `participation-${studentId}-${sessionId}`,
    createdBy: "KsmNtVf4zwqO3VV3SQJqPrRlQBA1fFyR",
    courseSessionId: sessionId || "session-1",
    studentId: studentId,
    isPresent: true,
    behavior: "",
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

  const [teachingAssignment, _setTeachingAssignment] =
    useState<TeachingAssignment>({
      id: "assignment-1",
      createdBy: "KsmNtVf4zwqO3VV3SQJqPrRlQBA1fFyR",
      userId: "KsmNtVf4zwqO3VV3SQJqPrRlQBA1fFyR",
      classId: "class-b1",
      subjectId: "subject-math",
      schoolYearId: "year-2025",
      role: "teacher",
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

  // Actions simplifiées grâce à useEntityState
  const markAttendance = useCallback(
    (isPresent: boolean) => {
      updateParticipationEntity({
        isPresent,
        markedAt: new Date(),
      });
    },
    [updateParticipationEntity],
  );

  const setParticipationLevel = useCallback(
    (level: number) => {
      updateParticipationEntity({ participationLevel: level });
    },
    [updateParticipationEntity],
  );

  const addRemarks = useCallback(
    (remarks: string) => {
      updateParticipationEntity({ specificRemarks: remarks });
    },
    [updateParticipationEntity],
  );

  const updateBehavior = useCallback(
    (behavior: string) => {
      updateParticipationEntity({ behavior });
    },
    [updateParticipationEntity],
  );

  const updateTechnicalIssues = useCallback(
    (issues: string) => {
      updateParticipationEntity({
        technicalIssues: issues,
        cameraEnabled: !issues.includes("caméra") && issues !== "",
      });
    },
    [updateParticipationEntity],
  );

  const saveParticipation = useCallback(async () => {
    await execute(async () => {
      // Simulation API call - utilise les méthodes UML
      await new Promise((resolve) => setTimeout(resolve, 1000));
      console.log("Saving participation:", participation);
      markSaved();
    });
  }, [execute, participation, markSaved]);

  const takeAttendance = useCallback(async () => {
    if (courseSession && participation) {
      // Appel de la méthode UML CourseSession.takeAttendance()
      courseSession.takeAttendance();
      setCourseSession((prev) => ({
        ...prev,
        attendanceTaken: true,
      }));
    }
  }, [courseSession, participation]);

  // Méthodes calculées basées sur les entités UML
  const getSessionSummary = useCallback(() => {
    return courseSession?.summary() || "";
  }, [courseSession]);

  const canEvaluate = useCallback(() => {
    return (
      teachingAssignment?.isActive &&
      teachingAssignment.role === "teacher" &&
      courseSession?.status === "in_progress"
    );
  }, [teachingAssignment, courseSession]);

  const getAttendanceRate = useCallback(() => {
    const now = new Date();
    const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    return student?.attendanceRate(monthAgo, now) || 0;
  }, [student]);

  const getParticipationAverage = useCallback(() => {
    const now = new Date();
    const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    return student?.participationAverage(monthAgo, now) || 0;
  }, [student]);

  return {
    courseSession,
    student,
    subject,
    timeSlot,
    class: classEntity,
    participation,
    teachingAssignment,
    isLoading,
    hasUnsavedChanges,
    markAttendance,
    setParticipationLevel,
    addRemarks,
    updateBehavior,
    updateTechnicalIssues,
    saveParticipation,
    takeAttendance,
    getSessionSummary,
    canEvaluate,
    getAttendanceRate,
    getParticipationAverage,
  };
}
