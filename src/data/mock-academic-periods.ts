import type { AcademicPeriod } from "@/types/uml-entities";

export const MOCK_ACADEMIC_PERIODS: AcademicPeriod[] = [
  {
    id: "period-trimester-1",
    createdBy: "KsmNtVf4zwqO3VV3SQJqPrRlQBA1fFyR",
    schoolYearId: "year-2025",
    name: "1er Trimestre",
    order: 1,
    startDate: new Date("2025-09-01"),
    endDate: new Date("2025-12-20"),
    isActive: true,
    createdAt: new Date("2025-08-15"),
    updatedAt: new Date("2025-09-06"),
    contains: (date: Date) => {
      return date >= new Date("2025-09-01") && date <= new Date("2025-12-20");
    },
  },
  {
    id: "period-trimester-2",
    createdBy: "KsmNtVf4zwqO3VV3SQJqPrRlQBA1fFyR",
    schoolYearId: "year-2025",
    name: "2ème Trimestre",
    order: 2,
    startDate: new Date("2026-01-06"),
    endDate: new Date("2026-03-28"),
    isActive: false,
    createdAt: new Date("2025-08-15"),
    updatedAt: new Date("2025-09-06"),
    contains: (date: Date) => {
      return date >= new Date("2026-01-06") && date <= new Date("2026-03-28");
    },
  },
  {
    id: "period-trimester-3",
    createdBy: "KsmNtVf4zwqO3VV3SQJqPrRlQBA1fFyR",
    schoolYearId: "year-2025",
    name: "3ème Trimestre",
    order: 3,
    startDate: new Date("2026-04-14"),
    endDate: new Date("2026-06-30"),
    isActive: false,
    createdAt: new Date("2025-08-15"),
    updatedAt: new Date("2025-09-06"),
    contains: (date: Date) => {
      return date >= new Date("2026-04-14") && date <= new Date("2026-06-30");
    },
  },
];

// Helper functions
export const getCurrentAcademicPeriod = (): AcademicPeriod | undefined => {
  return MOCK_ACADEMIC_PERIODS.find((period) => period.isActive);
};

export const getAcademicPeriodById = (
  id: string,
): AcademicPeriod | undefined => {
  return MOCK_ACADEMIC_PERIODS.find((period) => period.id === id);
};

export const getAcademicPeriodsBySchoolYear = (
  schoolYearId: string,
): AcademicPeriod[] => {
  return MOCK_ACADEMIC_PERIODS.filter(
    (period) => period.schoolYearId === schoolYearId,
  );
};
