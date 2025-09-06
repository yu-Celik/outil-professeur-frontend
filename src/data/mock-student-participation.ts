
import type { StudentParticipation } from "@/types/uml-entities";
import { MOCK_STUDENTS } from "./mock-students";
import { MOCK_COMPLETED_SESSIONS } from "./mock-completed-sessions";

// Helper function to create a realistic participation record with deterministic data
const createParticipation = (
  studentId: string,
  sessionId: string,
): StudentParticipation => {
  // Utiliser un hash déterministe basé sur les IDs pour éviter l'hydratation mismatch
  const hash = (str: string) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    return Math.abs(hash);
  };

  const seed = hash(studentId + sessionId);
  const isPresent = (seed % 10) > 0; // 90% de présence
  const behavior = ["Excellent", "Bon", "Moyen", "Distrait"];
  const remarks = [
    "Très bonne intervention sur le sujet X.",
    "A aidé ses camarades en difficulté.",
    "Doit améliorer sa concentration.",
    "Semble fatigué aujourd'hui.",
    "Participation active et pertinente.",
    null,
  ];

  return {
    id: `participation-${sessionId}-${studentId}`,
    createdBy: "KsmNtVf4zwqO3VV3SQJqPrRlQBA1fFyR",
    courseSessionId: sessionId,
    studentId: studentId,
    isPresent: isPresent,
    behavior: isPresent ? behavior[seed % behavior.length] : "Absent",
    participationLevel: isPresent ? ((seed % 8) + 3) : 0, // 3-10
    homeworkDone: isPresent ? ((seed % 5) > 0) : false, // 80% devoirs faits
    specificRemarks: isPresent ? (remarks[seed % remarks.length] || "") : "",
    technicalIssues: (isPresent && (seed % 10) === 9) ? "Connexion instable" : "",
    cameraEnabled: isPresent ? ((seed % 10) > 2) : false,
    markedAt: new Date("2024-09-01"), // Date fixe pour la rentrée 2024
    markAttendance: function (isPresent: boolean) { this.isPresent = isPresent; },
    setParticipationLevel: function (level: number) { this.participationLevel = level; },
    addRemarks: function (remarks: string) { this.specificRemarks = remarks; },
    updateBehavior: function (behavior: string) { this.behavior = behavior; },
  };
};

// Generate participation data for all students in all completed sessions
export const MOCK_STUDENT_PARTICIPATION: StudentParticipation[] = [];

MOCK_COMPLETED_SESSIONS.forEach(session => {
  const students = MOCK_STUDENTS.filter(s => s.currentClassId === session.classId);
  students.forEach(student => {
    MOCK_STUDENT_PARTICIPATION.push(createParticipation(student.id, session.id));
  });
});


// Helper functions
export const getStudentParticipation = (
  studentId: string,
  sessionId: string,
): StudentParticipation | undefined => {
  return MOCK_STUDENT_PARTICIPATION.find(
    (p) => p.studentId === studentId && p.courseSessionId === sessionId,
  );
};

export const getParticipationsForSession = (
  sessionId: string,
): StudentParticipation[] => {
  return MOCK_STUDENT_PARTICIPATION.filter((p) => p.courseSessionId === sessionId);
};
