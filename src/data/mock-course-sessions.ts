import type { CourseSession } from "@/types/uml-entities";

/**
 * ATTENTION: Les sessions sont maintenant générées dynamiquement depuis les templates hebdomadaires
 *
 * Ce fichier ne contient plus de sessions statiques hardcodées.
 * Les sessions sont créées par le WeekSessionGenerator à partir des WeeklyTemplate.
 *
 * Pour voir les sessions, consultez:
 * - /src/data/mock-weekly-templates.ts (templates récurrents)
 * - /src/services/session-generator.ts (générateur)
 * - /src/hooks/use-weekly-sessions.ts (hook de gestion)
 */

/**
 * Sessions mockées pour le développement et les tests uniquement
 * Ces sessions ne sont PAS utilisées par l'interface calendrier
 * Elles servent uniquement pour les tests unitaires ou démos
 */
export const MOCK_COURSE_SESSIONS: CourseSession[] = [
  // Exemple de session pour tests - non utilisée par l'interface
  {
    id: "test-session-example",
    createdBy: "test-teacher",
    classId: "test-class",
    subjectId: "test-subject",
    timeSlotId: "test-slot",
    sessionDate: new Date("2025-01-01"),
    room: "Test Room",
    status: "scheduled",
    objectives: "Session de test",
    content: "Contenu de test",
    homeworkAssigned: "Devoirs de test",
    notes: "Notes de test",
    attendanceTaken: false,
    createdAt: new Date(),
    updatedAt: new Date(),
    reschedule: (_newDate: Date) => {},
    takeAttendance: () => {},
    summary: () => "Session de test",
  },
];

/**
 * @deprecated Cette fonction n'est plus utilisée
 * Les sessions sont maintenant générées par WeekSessionGenerator
 */
export function getTeacherSessions(teacherId: string): CourseSession[] {
  console.warn(
    "getTeacherSessions est deprecated. Utilisez useWeeklySessions hook à la place.",
  );
  return MOCK_COURSE_SESSIONS.filter(
    (session) => session.createdBy === teacherId,
  );
}
