import type { CourseSession } from "@/types/uml-entities";

/**
 * Sessions complétées pour donner des statistiques réalistes
 * Ces sessions représentent les cours déjà donnés depuis septembre 2024 (année scolaire 2024-2025)
 */
export const MOCK_COMPLETED_SESSIONS: CourseSession[] = [
  // Septembre 2024 - Sessions Anglais 2nde Jaspe
  {
    id: "session-completed-jaspe-sept-1",
    createdBy: "KsmNtVf4zwqO3VV3SQJqPrRlQBA1fFyR",
    classId: "class-2nde-jaspe",
    subjectId: "subject-anglais",
    timeSlotId: "slot-11h40-12h35",
    sessionDate: new Date("2024-09-02"), // Lundi
    status: "done",
    objectives: "Introduction - Getting to know each other",
    content: "Présentations, règles de classe, premiers échanges",
    homeworkAssigned: "Prepare personal presentation",
    isMakeup: false,
    isMoved: false,
    notes: "Très bonne première session, élèves motivés",
    createdAt: new Date("2024-09-02"),
    updatedAt: new Date("2024-09-02"),
    reschedule: () => {},
    takeAttendance: () => {},
    summary: () => "Session d'introduction réussie",
  },
  {
    id: "session-completed-jaspe-sept-2",
    createdBy: "KsmNtVf4zwqO3VV3SQJqPrRlQBA1fFyR",
    classId: "class-2nde-jaspe",
    subjectId: "subject-anglais",
    timeSlotId: "slot-10h40-11h35",
    sessionDate: new Date("2024-09-03"), // Mardi
    status: "done",
    objectives: "Present Simple vs Present Continuous",
    content: "Grammar focus, exercises, speaking practice",
    homeworkAssigned: "Workbook p.12-13",
    isMakeup: false,
    isMoved: false,
    notes: "Bonne participation, quelques difficultés sur le continuous",
    createdAt: new Date("2024-09-03"),
    updatedAt: new Date("2024-09-03"),
    reschedule: () => {},
    takeAttendance: () => {},
    summary: () => "Grammar session - present tenses",
  },

  // Sessions Anglais 2nde Thulite
  {
    id: "session-completed-thulite-sept-1",
    createdBy: "KsmNtVf4zwqO3VV3SQJqPrRlQBA1fFyR",
    classId: "class-2nde-thulite",
    subjectId: "subject-anglais",
    timeSlotId: "slot-12h40-13h35",
    sessionDate: new Date("2024-09-02"), // Lundi
    status: "done",
    objectives: "Class introduction and expectations",
    content: "Course overview, assessment methods, ice-breakers",
    homeworkAssigned: "Complete student information sheet",
    isMakeup: false,
    isMoved: false,
    notes: "Classe dynamique, bon niveau général",
    createdAt: new Date("2024-09-02"),
    updatedAt: new Date("2024-09-02"),
    reschedule: () => {},
    takeAttendance: () => {},
    summary: () => "Introduction session with 2nde Thulite",
  },

  // Sessions ETLV 1e Onyx
  {
    id: "session-completed-onyx-etlv-sept-1",
    createdBy: "KsmNtVf4zwqO3VV3SQJqPrRlQBA1fFyR",
    classId: "class-1e-onyx",
    subjectId: "subject-etlv",
    timeSlotId: "slot-9h30-10h25",
    sessionDate: new Date("2024-09-05"), // Jeudi
    status: "done",
    objectives: "ETLV Introduction - Science in English",
    content: "What is ETLV? Scientific method vocabulary",
    homeworkAssigned: "Research a scientific discovery",
    isMakeup: false,
    isMoved: false,
    notes: "Élèves intéressés par l'approche interdisciplinaire",
    createdAt: new Date("2024-09-05"),
    updatedAt: new Date("2024-09-05"),
    reschedule: () => {},
    takeAttendance: () => {},
    summary: () => "ETLV program introduction",
  },

  // Sessions Term Tanzanite Anglais
  {
    id: "session-completed-tanzanite-sept-1",
    createdBy: "KsmNtVf4zwqO3VV3SQJqPrRlQBA1fFyR",
    classId: "class-term-tanzanite",
    subjectId: "subject-anglais",
    timeSlotId: "slot-14h40-15h35",
    sessionDate: new Date("2024-09-02"), // Lundi
    status: "done",
    objectives: "Bac preparation - Essay writing techniques",
    content: "Argumentative essay structure, thesis statements",
    homeworkAssigned: "Write practice essay on given topic",
    isMakeup: false,
    isMoved: false,
    notes: "Niveau avancé, préparation intensive au Bac",
    createdAt: new Date("2024-09-02"),
    updatedAt: new Date("2024-09-02"),
    reschedule: () => {},
    takeAttendance: () => {},
    summary: () => "Bac prep - essay writing",
  },

  // Octobre 2025 - Plus de sessions pour chaque classe/matière
  {
    id: "session-completed-jaspe-oct-1",
    createdBy: "KsmNtVf4zwqO3VV3SQJqPrRlQBA1fFyR",
    classId: "class-2nde-jaspe",
    subjectId: "subject-anglais",
    timeSlotId: "slot-11h40-12h35",
    sessionDate: new Date("2024-10-07"),
    status: "done",
    objectives: "Past tenses revision",
    content: "Past simple, past continuous, past perfect",
    homeworkAssigned: "Complete grammar exercises",
    isMakeup: false,
    isMoved: false,
    notes: "Progrès visible depuis septembre",
    createdAt: new Date("2024-10-07"),
    updatedAt: new Date("2024-10-07"),
    reschedule: () => {},
    takeAttendance: () => {},
    summary: () => "Past tenses revision session",
  },

  {
    id: "session-completed-zircon-oct-1",
    createdBy: "KsmNtVf4zwqO3VV3SQJqPrRlQBA1fFyR",
    classId: "class-2nde-zircon",
    subjectId: "subject-anglais",
    timeSlotId: "slot-13h40-14h35",
    sessionDate: new Date("2024-10-09"), // Mercredi
    status: "done",
    objectives: "Vocabulary - Daily routines",
    content: "Time expressions, frequency adverbs",
    homeworkAssigned: "Describe your typical day",
    isMakeup: false,
    isMoved: false,
    notes: "Participation active, bon esprit de classe",
    createdAt: new Date("2024-10-09"),
    updatedAt: new Date("2024-10-09"),
    reschedule: () => {},
    takeAttendance: () => {},
    summary: () => "Daily routines vocabulary",
  },

  // Novembre 2025 - Sessions supplémentaires
  {
    id: "session-completed-onyx-nov-1",
    createdBy: "KsmNtVf4zwqO3VV3SQJqPrRlQBA1fFyR",
    classId: "class-1e-onyx",
    subjectId: "subject-anglais",
    timeSlotId: "slot-9h30-10h25",
    sessionDate: new Date("2024-11-08"), // Vendredi
    status: "done",
    objectives: "Literature analysis - Shakespeare extract",
    content: "Romeo and Juliet Act 2, character analysis",
    homeworkAssigned: "Character profile worksheet",
    isMakeup: false,
    isMoved: false,
    notes: "Très bonne analyse littéraire, élèves engagés",
    createdAt: new Date("2024-11-08"),
    updatedAt: new Date("2024-11-08"),
    reschedule: () => {},
    takeAttendance: () => {},
    summary: () => "Shakespeare literature analysis",
  },

  // Décembre 2025 - Avant les vacances
  {
    id: "session-completed-tanzanite-dec-1",
    createdBy: "KsmNtVf4zwqO3VV3SQJqPrRlQBA1fFyR",
    classId: "class-term-tanzanite",
    subjectId: "subject-etlv",
    timeSlotId: "slot-10h40-11h35",
    sessionDate: new Date("2024-12-05"), // Jeudi
    status: "done",
    objectives: "Environmental science vocabulary",
    content: "Climate change, renewable energy terms",
    homeworkAssigned: "Research renewable energy project",
    isMakeup: false,
    isMoved: false,
    notes: "Sujet d'actualité, très bons échanges",
    createdAt: new Date("2024-12-05"),
    updatedAt: new Date("2024-12-05"),
    reschedule: () => {},
    takeAttendance: () => {},
    summary: () => "Environmental science ETLV session",
  },

  // Janvier 2026
  {
    id: "session-completed-thulite-jan-1",
    createdBy: "KsmNtVf4zwqO3VV3SQJqPrRlQBA1fFyR",
    classId: "class-2nde-thulite",
    subjectId: "subject-anglais",
    timeSlotId: "slot-11h40-12h35",
    sessionDate: new Date("2026-01-07"), // Mardi
    status: "done",
    objectives: "New Year resolutions - Future tenses",
    content: "Will, be going to, present continuous for future",
    homeworkAssigned: "Write about your 2026 goals",
    isMakeup: false,
    isMoved: false,
    notes: "Retour de vacances motivant, bons objectifs",
    createdAt: new Date("2026-01-07"),
    updatedAt: new Date("2026-01-07"),
    reschedule: () => {},
    takeAttendance: () => {},
    summary: () => "New Year - future tenses",
  },
];

/**
 * Récupère les sessions complétées pour un teacher
 */
export function getCompletedSessionsForTeacher(
  teacherId: string,
): CourseSession[] {
  return MOCK_COMPLETED_SESSIONS.filter(
    (session) => session.createdBy === teacherId,
  );
}

/**
 * Récupère les sessions complétées pour une combinaison classe-matière
 */
export function getCompletedSessionsForCourse(
  classId: string,
  subjectId: string,
): CourseSession[] {
  return MOCK_COMPLETED_SESSIONS.filter(
    (session) => session.classId === classId && session.subjectId === subjectId,
  );
}
