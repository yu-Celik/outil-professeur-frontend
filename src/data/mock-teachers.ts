import type { Teacher } from "@/types/uml-entities";

export const MOCK_TEACHERS: Teacher[] = [
  {
    id: "KsmNtVf4zwqO3VV3SQJqPrRlQBA1fFyR",
    email: "nandini.sorubakanthan@ecole.fr",
    language: "fr",
    createdAt: new Date("2025-09-01"),
    updatedAt: new Date(),
  },
];

// Helper functions
export const getTeacherById = (id: string): Teacher | undefined => {
  return MOCK_TEACHERS.find((teacher) => teacher.id === id);
};

export const getActiveTeachers = (): Teacher[] => {
  return MOCK_TEACHERS;
};
