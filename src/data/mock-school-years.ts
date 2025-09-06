import type { SchoolYear } from "@/types/uml-entities";

export const MOCK_SCHOOL_YEARS: SchoolYear[] = [
  {
    id: "year-2025",
    createdBy: "KsmNtVf4zwqO3VV3SQJqPrRlQBA1fFyR",
    name: "Année scolaire 2025-2026",
    startDate: new Date("2025-09-01"),
    endDate: new Date("2026-06-30"),
    isActive: true,
    createdAt: new Date("2025-08-15"),
    updatedAt: new Date("2025-09-06"),
    createPeriod: (name: string, start: Date, end: Date, order: number) => ({
      id: `period-${Date.now()}`,
      createdBy: "KsmNtVf4zwqO3VV3SQJqPrRlQBA1fFyR",
      schoolYearId: "year-2025",
      name,
      order,
      startDate: start,
      endDate: end,
      isActive: false,
      createdAt: new Date(),
      updatedAt: new Date(),
      contains: (date: Date) => date >= start && date <= end,
    }),
  },
  {
    id: "year-2024",
    createdBy: "KsmNtVf4zwqO3VV3SQJqPrRlQBA1fFyR",
    name: "Année scolaire 2024-2025",
    startDate: new Date("2024-09-01"),
    endDate: new Date("2025-06-30"),
    isActive: false,
    createdAt: new Date("2024-08-15"),
    updatedAt: new Date("2025-09-06"),
    createPeriod: (name: string, start: Date, end: Date, order: number) => ({
      id: `period-${Date.now()}`,
      createdBy: "KsmNtVf4zwqO3VV3SQJqPrRlQBA1fFyR",
      schoolYearId: "year-2024",
      name,
      order,
      startDate: start,
      endDate: end,
      isActive: false,
      createdAt: new Date(),
      updatedAt: new Date(),
      contains: (date: Date) => date >= start && date <= end,
    }),
  },
  {
    id: "year-2023",
    createdBy: "KsmNtVf4zwqO3VV3SQJqPrRlQBA1fFyR",
    name: "Année scolaire 2023-2024",
    startDate: new Date("2023-09-01"),
    endDate: new Date("2024-06-30"),
    isActive: false,
    createdAt: new Date("2023-08-15"),
    updatedAt: new Date("2025-09-06"),
    createPeriod: (name: string, start: Date, end: Date, order: number) => ({
      id: `period-${Date.now()}`,
      createdBy: "KsmNtVf4zwqO3VV3SQJqPrRlQBA1fFyR",
      schoolYearId: "year-2023",
      name,
      order,
      startDate: start,
      endDate: end,
      isActive: false,
      createdAt: new Date(),
      updatedAt: new Date(),
      contains: (date: Date) => date >= start && date <= end,
    }),
  },
];

// Helper functions
export const getCurrentSchoolYear = (): SchoolYear | undefined => {
  return MOCK_SCHOOL_YEARS.find((year) => year.isActive);
};

export const getSchoolYearById = (id: string): SchoolYear | undefined => {
  return MOCK_SCHOOL_YEARS.find((year) => year.id === id);
};
