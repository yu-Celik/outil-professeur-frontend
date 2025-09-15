import type { Class } from "@/types/uml-entities";

export const MOCK_CLASSES: Class[] = [
  {
    id: "class-2nde-jaspe",
    createdBy: "KsmNtVf4zwqO3VV3SQJqPrRlQBA1fFyR",
    classCode: "2nde Jaspe",
    gradeLabel: "Seconde Jaspe",
    schoolYearId: "year-2025",
    createdAt: new Date("2025-09-01"),
    updatedAt: new Date("2025-09-06"),
    assignStudent: (studentId: string) =>
      console.log("Assign student:", studentId),
    transferStudent: (_studentId: string, _toClassId: string) =>
      console.log("Transfer student"),
    getStudents: () => [],
    getSessions: () => [],
    getExams: () => [],
  },
  {
    id: "class-2nde-zircon",
    createdBy: "KsmNtVf4zwqO3VV3SQJqPrRlQBA1fFyR",
    classCode: "2nde Zircon",
    gradeLabel: "Seconde Zircon",
    schoolYearId: "year-2025",
    createdAt: new Date("2025-09-01"),
    updatedAt: new Date("2025-09-06"),
    assignStudent: (studentId: string) =>
      console.log("Assign student:", studentId),
    transferStudent: (_studentId: string, _toClassId: string) =>
      console.log("Transfer student"),
    getStudents: () => [],
    getSessions: () => [],
    getExams: () => [],
  },
  {
    id: "class-2nde-thulite",
    createdBy: "KsmNtVf4zwqO3VV3SQJqPrRlQBA1fFyR",
    classCode: "2nde Thulite",
    gradeLabel: "Seconde Thulite",
    schoolYearId: "year-2025",
    createdAt: new Date("2025-09-01"),
    updatedAt: new Date("2025-09-06"),
    assignStudent: (studentId: string) =>
      console.log("Assign student:", studentId),
    transferStudent: (_studentId: string, _toClassId: string) =>
      console.log("Transfer student"),
    getStudents: () => [],
    getSessions: () => [],
    getExams: () => [],
  },
  {
    id: "class-1e-onyx",
    createdBy: "KsmNtVf4zwqO3VV3SQJqPrRlQBA1fFyR",
    classCode: "1e Onyx",
    gradeLabel: "Première Onyx",
    schoolYearId: "year-2025",
    createdAt: new Date("2025-09-01"),
    updatedAt: new Date("2025-09-06"),
    assignStudent: (studentId: string) =>
      console.log("Assign student:", studentId),
    transferStudent: (_studentId: string, _toClassId: string) =>
      console.log("Transfer student"),
    getStudents: () => [],
    getSessions: () => [],
    getExams: () => [],
  },
  {
    id: "class-term-tanzanite",
    createdBy: "KsmNtVf4zwqO3VV3SQJqPrRlQBA1fFyR",
    classCode: "Term Tanzanite",
    gradeLabel: "Terminale Tanzanite",
    schoolYearId: "year-2025",
    createdAt: new Date("2025-09-01"),
    updatedAt: new Date("2025-09-06"),
    assignStudent: (studentId: string) =>
      console.log("Assign student:", studentId),
    transferStudent: (_studentId: string, _toClassId: string) =>
      console.log("Transfer student"),
    getStudents: () => [],
    getSessions: () => [],
    getExams: () => [],
  },
];

// Helper functions
export const getClassById = (id: string): Class | undefined => {
  return MOCK_CLASSES.find((classEntity) => classEntity.id === id);
};

export const getActiveClasses = (): Class[] => {
  return MOCK_CLASSES;
};

export const getClassesBySchoolYear = (schoolYearId: string): Class[] => {
  return MOCK_CLASSES.filter(
    (classEntity) => classEntity.schoolYearId === schoolYearId,
  );
};
