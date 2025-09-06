// Template hebdomadaire récurrent - Pattern qui se répète chaque semaine
// Utilise les entités UML définies dans /src/types/uml-entities.ts

import type { WeeklyTemplate } from "@/types/uml-entities";

// Template hebdomadaire pour le professeur d'anglais - Emploi du temps actualisé
export const MOCK_WEEKLY_TEMPLATES: WeeklyTemplate[] = [
  // Lundi
  {
    id: "template-lundi-11h40-jaspe",
    teacherId: "KsmNtVf4zwqO3VV3SQJqPrRlQBA1fFyR",
    dayOfWeek: 1, // Lundi
    timeSlotId: "slot-11h40-12h35",
    classId: "class-2nde-jaspe",
    subjectId: "subject-anglais",
    schoolYearId: "year-2025",
    room: "Salle A1",
    isActive: true,
  },
  {
    id: "template-lundi-12h40-thulite",
    teacherId: "KsmNtVf4zwqO3VV3SQJqPrRlQBA1fFyR",
    dayOfWeek: 1, // Lundi
    timeSlotId: "slot-12h40-13h35",
    classId: "class-2nde-thulite",
    subjectId: "subject-anglais",
    schoolYearId: "year-2025",
    room: "Salle A1",
    isActive: true,
  },
  {
    id: "template-lundi-14h40-tanzanite",
    teacherId: "KsmNtVf4zwqO3VV3SQJqPrRlQBA1fFyR",
    dayOfWeek: 1, // Lundi
    timeSlotId: "slot-14h40-15h35",
    classId: "class-term-tanzanite",
    subjectId: "subject-anglais",
    schoolYearId: "year-2025",
    room: "Salle A1",
    isActive: true,
  },

  // Mardi
  {
    id: "template-mardi-10h40-jaspe",
    teacherId: "KsmNtVf4zwqO3VV3SQJqPrRlQBA1fFyR",
    dayOfWeek: 2, // Mardi
    timeSlotId: "slot-10h40-11h35",
    classId: "class-2nde-jaspe",
    subjectId: "subject-anglais",
    schoolYearId: "year-2025",
    room: "Salle A1",
    isActive: true,
  },
  {
    id: "template-mardi-11h40-thulite",
    teacherId: "KsmNtVf4zwqO3VV3SQJqPrRlQBA1fFyR",
    dayOfWeek: 2, // Mardi
    timeSlotId: "slot-11h40-12h35",
    classId: "class-2nde-thulite",
    subjectId: "subject-anglais",
    schoolYearId: "year-2025",
    room: "Salle A1",
    isActive: true,
  },
  {
    id: "template-mardi-14h40-onyx",
    teacherId: "KsmNtVf4zwqO3VV3SQJqPrRlQBA1fFyR",
    dayOfWeek: 2, // Mardi
    timeSlotId: "slot-14h40-15h35",
    classId: "class-1e-onyx",
    subjectId: "subject-anglais",
    schoolYearId: "year-2025",
    room: "Salle A1",
    isActive: true,
  },

  // Mercredi
  {
    id: "template-mercredi-13h40-zircon",
    teacherId: "KsmNtVf4zwqO3VV3SQJqPrRlQBA1fFyR",
    dayOfWeek: 3, // Mercredi
    timeSlotId: "slot-13h40-14h35",
    classId: "class-2nde-zircon",
    subjectId: "subject-anglais",
    schoolYearId: "year-2025",
    room: "Salle A1",
    isActive: true,
  },
  {
    id: "template-mercredi-14h40-tanzanite",
    teacherId: "KsmNtVf4zwqO3VV3SQJqPrRlQBA1fFyR",
    dayOfWeek: 3, // Mercredi
    timeSlotId: "slot-14h40-15h35",
    classId: "class-term-tanzanite",
    subjectId: "subject-anglais",
    schoolYearId: "year-2025",
    room: "Salle A1",
    isActive: true,
  },

  // Jeudi
  {
    id: "template-jeudi-09h30-onyx",
    teacherId: "KsmNtVf4zwqO3VV3SQJqPrRlQBA1fFyR",
    dayOfWeek: 4, // Jeudi
    timeSlotId: "slot-9h30-10h25",
    classId: "class-1e-onyx",
    subjectId: "subject-etlv",
    schoolYearId: "year-2025",
    room: "Salle A1",
    isActive: true,
  },
  {
    id: "template-jeudi-10h40-tanzanite",
    teacherId: "KsmNtVf4zwqO3VV3SQJqPrRlQBA1fFyR",
    dayOfWeek: 4, // Jeudi
    timeSlotId: "slot-10h40-11h35",
    classId: "class-term-tanzanite",
    subjectId: "subject-etlv",
    schoolYearId: "year-2025",
    room: "Salle A1",
    isActive: true,
  },

  // Vendredi
  {
    id: "template-vendredi-09h30-onyx",
    teacherId: "KsmNtVf4zwqO3VV3SQJqPrRlQBA1fFyR",
    dayOfWeek: 5, // Vendredi
    timeSlotId: "slot-9h30-10h25",
    classId: "class-1e-onyx",
    subjectId: "subject-anglais",
    schoolYearId: "year-2025",
    room: "Salle A1",
    isActive: true,
  },
  {
    id: "template-vendredi-10h40-zircon",
    teacherId: "KsmNtVf4zwqO3VV3SQJqPrRlQBA1fFyR",
    dayOfWeek: 5, // Vendredi
    timeSlotId: "slot-10h40-11h35",
    classId: "class-2nde-zircon",
    subjectId: "subject-anglais",
    schoolYearId: "year-2025",
    room: "Salle A1",
    isActive: true,
  },
];

/**
 * Récupère les templates hebdomadaires pour un professeur donné
 */
export function getWeeklyTemplatesForTeacher(
  teacherId: string,
): WeeklyTemplate[] {
  return MOCK_WEEKLY_TEMPLATES.filter(
    (template) => template.teacherId === teacherId && template.isActive,
  );
}

/**
 * Récupère les templates pour une année scolaire donnée
 */
export function getWeeklyTemplatesForSchoolYear(
  schoolYearId: string,
): WeeklyTemplate[] {
  return MOCK_WEEKLY_TEMPLATES.filter(
    (template) => template.schoolYearId === schoolYearId && template.isActive,
  );
}
