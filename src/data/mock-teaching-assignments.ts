import type { TeachingAssignment } from "@/types/uml-entities";

export const MOCK_TEACHING_ASSIGNMENTS: TeachingAssignment[] = [
  // Anglais - 2nde Jaspe
  {
    id: "assignment-anglais-2nde-jaspe",
    createdBy: "KsmNtVf4zwqO3VV3SQJqPrRlQBA1fFyR",
    userId: "KsmNtVf4zwqO3VV3SQJqPrRlQBA1fFyR",
    classId: "class-2nde-jaspe",
    subjectId: "subject-anglais",
    schoolYearId: "year-2025",
    role: "teacher",
    isActive: true,
    createdAt: new Date("2025-09-01"),
    updatedAt: new Date("2025-09-01"),
  },
  // Anglais - 2nde Zircon
  {
    id: "assignment-anglais-2nde-zircon",
    createdBy: "KsmNtVf4zwqO3VV3SQJqPrRlQBA1fFyR",
    userId: "KsmNtVf4zwqO3VV3SQJqPrRlQBA1fFyR",
    classId: "class-2nde-zircon",
    subjectId: "subject-anglais",
    schoolYearId: "year-2025",
    role: "teacher",
    isActive: true,
    createdAt: new Date("2025-09-01"),
    updatedAt: new Date("2025-09-01"),
  },
  // Anglais - 2nde Thulite
  {
    id: "assignment-anglais-2nde-thulite",
    createdBy: "KsmNtVf4zwqO3VV3SQJqPrRlQBA1fFyR",
    userId: "KsmNtVf4zwqO3VV3SQJqPrRlQBA1fFyR",
    classId: "class-2nde-thulite",
    subjectId: "subject-anglais",
    schoolYearId: "year-2025",
    role: "teacher",
    isActive: true,
    createdAt: new Date("2025-09-01"),
    updatedAt: new Date("2025-09-01"),
  },
  // Anglais - 1e Onyx
  {
    id: "assignment-anglais-1e-onyx",
    createdBy: "KsmNtVf4zwqO3VV3SQJqPrRlQBA1fFyR",
    userId: "KsmNtVf4zwqO3VV3SQJqPrRlQBA1fFyR",
    classId: "class-1e-onyx",
    subjectId: "subject-anglais",
    schoolYearId: "year-2025",
    role: "teacher",
    isActive: true,
    createdAt: new Date("2025-09-01"),
    updatedAt: new Date("2025-09-01"),
  },
  // Anglais - Term Tanzanite
  {
    id: "assignment-anglais-term-tanzanite",
    createdBy: "KsmNtVf4zwqO3VV3SQJqPrRlQBA1fFyR",
    userId: "KsmNtVf4zwqO3VV3SQJqPrRlQBA1fFyR",
    classId: "class-term-tanzanite",
    subjectId: "subject-anglais",
    schoolYearId: "year-2025",
    role: "teacher",
    isActive: true,
    createdAt: new Date("2025-09-01"),
    updatedAt: new Date("2025-09-01"),
  },
  // ETLV - 1e Onyx
  {
    id: "assignment-etlv-1e-onyx",
    createdBy: "KsmNtVf4zwqO3VV3SQJqPrRlQBA1fFyR",
    userId: "KsmNtVf4zwqO3VV3SQJqPrRlQBA1fFyR",
    classId: "class-1e-onyx",
    subjectId: "subject-etlv",
    schoolYearId: "year-2025",
    role: "teacher",
    isActive: true,
    createdAt: new Date("2025-09-01"),
    updatedAt: new Date("2025-09-01"),
  },
  // ETLV - Term Tanzanite
  {
    id: "assignment-etlv-term-tanzanite",
    createdBy: "KsmNtVf4zwqO3VV3SQJqPrRlQBA1fFyR",
    userId: "KsmNtVf4zwqO3VV3SQJqPrRlQBA1fFyR",
    classId: "class-term-tanzanite",
    subjectId: "subject-etlv",
    schoolYearId: "year-2025",
    role: "teacher",
    isActive: true,
    createdAt: new Date("2025-09-01"),
    updatedAt: new Date("2025-09-01"),
  },
];

// Helper functions
export const getTeachingAssignmentsByTeacher = (
  teacherId: string,
): TeachingAssignment[] => {
  return MOCK_TEACHING_ASSIGNMENTS.filter(
    (assignment) => assignment.userId === teacherId && assignment.isActive,
  );
};

export const getTeachingAssignmentsByClass = (
  classId: string,
): TeachingAssignment[] => {
  return MOCK_TEACHING_ASSIGNMENTS.filter(
    (assignment) => assignment.classId === classId && assignment.isActive,
  );
};

export const getTeachingAssignmentsBySubject = (
  subjectId: string,
): TeachingAssignment[] => {
  return MOCK_TEACHING_ASSIGNMENTS.filter(
    (assignment) => assignment.subjectId === subjectId && assignment.isActive,
  );
};

export const getTeachingAssignmentById = (
  id: string,
): TeachingAssignment | undefined => {
  return MOCK_TEACHING_ASSIGNMENTS.find((assignment) => assignment.id === id);
};
