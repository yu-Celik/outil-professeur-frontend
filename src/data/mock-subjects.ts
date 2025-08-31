import type { Subject } from "@/types/uml-entities";

export const MOCK_SUBJECTS: Subject[] = [
  {
    id: "subject-anglais",
    createdBy: "KsmNtVf4zwqO3VV3SQJqPrRlQBA1fFyR",
    name: "Anglais",
    code: "ANG",
    description: "Cours d'anglais langue étrangère",
    createdAt: new Date("2025-09-01"),
    updatedAt: new Date(),
  },
  {
    id: "subject-etlv",
    createdBy: "KsmNtVf4zwqO3VV3SQJqPrRlQBA1fFyR",
    name: "ETLV",
    code: "ETLV",
    description: "Enseignement Technologique en Langue Vivante",
    createdAt: new Date("2025-09-01"),
    updatedAt: new Date(),
  },
];

// Helper function to find subject by ID
export const findSubjectById = (id: string): Subject | undefined => {
  return MOCK_SUBJECTS.find((subject) => subject.id === id);
};

// Helper function to find subjects by code
export const findSubjectsByCode = (codes: string[]): Subject[] => {
  return MOCK_SUBJECTS.filter((subject) => codes.includes(subject.code));
};

// Alias for compatibility
export const getSubjectById = findSubjectById;
