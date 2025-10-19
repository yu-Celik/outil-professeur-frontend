import type { WeeklyTemplate } from "@/types/uml-entities";

/**
 * Mock weekly templates for development and testing
 * These templates represent recurring weekly session patterns
 */
export const MOCK_WEEKLY_TEMPLATES: WeeklyTemplate[] = [
  {
    id: "wt-1",
    teacherId: "teacher-001",
    dayOfWeek: 1, // Monday
    timeSlotId: "slot-1", // 08:00-09:00
    classId: "class-1", // 5A
    subjectId: "subject-1", // Anglais
    schoolYearId: "sy-2024-2025",
    isActive: true,
  },
  {
    id: "wt-2",
    teacherId: "teacher-001",
    dayOfWeek: 1, // Monday
    timeSlotId: "slot-3", // 10:00-11:00
    classId: "class-2", // 5B
    subjectId: "subject-1", // Anglais
    schoolYearId: "sy-2024-2025",
    isActive: true,
  },
  {
    id: "wt-3",
    teacherId: "teacher-001",
    dayOfWeek: 2, // Tuesday
    timeSlotId: "slot-1", // 08:00-09:00
    classId: "class-1", // 5A
    subjectId: "subject-2", // Français
    schoolYearId: "sy-2024-2025",
    isActive: true,
  },
  {
    id: "wt-4",
    teacherId: "teacher-001",
    dayOfWeek: 3, // Wednesday
    timeSlotId: "slot-2", // 09:00-10:00
    classId: "class-3", // 6A
    subjectId: "subject-1", // Anglais
    schoolYearId: "sy-2024-2025",
    isActive: true,
  },
  {
    id: "wt-5",
    teacherId: "teacher-001",
    dayOfWeek: 4, // Thursday
    timeSlotId: "slot-1", // 08:00-09:00
    classId: "class-2", // 5B
    subjectId: "subject-2", // Français
    schoolYearId: "sy-2024-2025",
    isActive: true,
  },
  {
    id: "wt-6",
    teacherId: "teacher-001",
    dayOfWeek: 4, // Thursday
    timeSlotId: "slot-4", // 11:00-12:00
    classId: "class-1", // 5A
    subjectId: "subject-3", // Mathématiques
    schoolYearId: "sy-2024-2025",
    isActive: true,
  },
  {
    id: "wt-7",
    teacherId: "teacher-001",
    dayOfWeek: 5, // Friday
    timeSlotId: "slot-2", // 09:00-10:00
    classId: "class-3", // 6A
    subjectId: "subject-2", // Français
    schoolYearId: "sy-2024-2025",
    isActive: true,
  },
  // Inactive template (archived)
  {
    id: "wt-8",
    teacherId: "teacher-001",
    dayOfWeek: 5, // Friday
    timeSlotId: "slot-5", // 14:00-15:00
    classId: "class-4", // 4A
    subjectId: "subject-1", // Anglais
    schoolYearId: "sy-2023-2024", // Previous year
    isActive: false,
  },
];

/**
 * Helper function to get template display name
 */
export function getTemplateDisplayName(
  template: WeeklyTemplate,
  className: string,
  subjectName: string,
): string {
  const days = [
    "",
    "Lundi",
    "Mardi",
    "Mercredi",
    "Jeudi",
    "Vendredi",
    "Samedi",
    "Dimanche",
  ];
  return `${days[template.dayOfWeek]} - ${className} - ${subjectName}`;
}

/**
 * Get all templates grouped by day of week
 */
export function getTemplatesByDay(
  templates: WeeklyTemplate[],
): Record<number, WeeklyTemplate[]> {
  return templates.reduce(
    (acc, template) => {
      const day = template.dayOfWeek;
      if (!acc[day]) {
        acc[day] = [];
      }
      acc[day].push(template);
      return acc;
    },
    {} as Record<number, WeeklyTemplate[]>,
  );
}
