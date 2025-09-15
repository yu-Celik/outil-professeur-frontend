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
import { 
  MOCK_CLASSES,
  MOCK_STUDENTS, 
  MOCK_SUBJECTS,
  MOCK_TIME_SLOTS,
  MOCK_COMPLETED_SESSIONS
} from "@/data";
import { useAsyncOperation } from "@/shared/hooks";
import { useEntityState } from "./shared/use-entity-state";

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
  // Utiliser les données mockées au lieu de données en dur
  const [courseSession] = useState<CourseSession | null>(() => {
    if (sessionId) {
      return MOCK_COMPLETED_SESSIONS.find(s => s.id === sessionId) || null;
    }
    return MOCK_COMPLETED_SESSIONS[0] || null;
  });

  const [subject, _setSubject] = useState<Subject | null>(() => {
    if (courseSession?.subjectId) {
      return MOCK_SUBJECTS.find(s => s.id === courseSession.subjectId) || null;
    }
    return MOCK_SUBJECTS[0] || null;
  });

  const [timeSlot, _setTimeSlot] = useState<TimeSlot | null>(() => {
    if (courseSession?.timeSlotId) {
      return MOCK_TIME_SLOTS.find(ts => ts.id === courseSession.timeSlotId) || null;
    }
    return MOCK_TIME_SLOTS[0] || null;
  });

  const [classEntity, _setClassEntity] = useState<Class | null>(() => {
    if (courseSession?.classId) {
      return MOCK_CLASSES.find(c => c.id === courseSession.classId) || null;
    }
    return MOCK_CLASSES[0] || null;
  });

  const [student, _setStudent] = useState<Student | null>(() => {
    return MOCK_STUDENTS.find(s => s.id === studentId) || MOCK_STUDENTS[0] || null;
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
    homeworkDone: false,
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
      // Note: l'état d'attendance est géré via StudentParticipation.isPresent
      // Pas besoin de modifier CourseSession pour cette information
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
