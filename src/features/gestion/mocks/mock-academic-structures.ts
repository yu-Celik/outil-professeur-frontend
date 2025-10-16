import type { AcademicStructure } from "@/types/uml-entities";

export const MOCK_ACADEMIC_STRUCTURES: AcademicStructure[] = [
  {
    id: "structure-trimestre-francais",
    createdBy: "KsmNtVf4zwqO3VV3SQJqPrRlQBA1fFyR",
    name: "Système Trimestre (France)",
    periodModel: "trimestre",
    periodsPerYear: 3,
    periodNames: {
      "1": "1er Trimestre",
      "2": "2ème Trimestre",
      "3": "3ème Trimestre",
    },
    createdAt: new Date("2025-08-15"),
    updatedAt: new Date("2025-09-06"),
  },
  {
    id: "structure-semestre-universitaire",
    createdBy: "KsmNtVf4zwqO3VV3SQJqPrRlQBA1fFyR",
    name: "Système Semestre (Universitaire)",
    periodModel: "semestre",
    periodsPerYear: 2,
    periodNames: {
      "1": "1er Semestre",
      "2": "2ème Semestre",
    },
    createdAt: new Date("2025-08-15"),
    updatedAt: new Date("2025-09-06"),
  },
  {
    id: "structure-quartier-americain",
    createdBy: "KsmNtVf4zwqO3VV3SQJqPrRlQBA1fFyR",
    name: "Système Quartier (États-Unis)",
    periodModel: "quartier",
    periodsPerYear: 4,
    periodNames: {
      "1": "Automne",
      "2": "Hiver",
      "3": "Printemps",
      "4": "Été",
    },
    createdAt: new Date("2025-08-15"),
    updatedAt: new Date("2025-09-06"),
  },
  {
    id: "structure-bimestre-primaire",
    createdBy: "KsmNtVf4zwqO3VV3SQJqPrRlQBA1fFyR",
    name: "Système Bimestre (Primaire)",
    periodModel: "bimestre",
    periodsPerYear: 5,
    periodNames: {
      "1": "Septembre-Octobre",
      "2": "Novembre-Décembre",
      "3": "Janvier-Février",
      "4": "Mars-Avril",
      "5": "Mai-Juin",
    },
    createdAt: new Date("2025-08-15"),
    updatedAt: new Date("2025-09-06"),
  },
];

// Templates prédéfinis pour configuration rapide
export const ACADEMIC_STRUCTURE_TEMPLATES = {
  trimestre: {
    name: "Système Trimestre (France)",
    periodModel: "trimestre",
    periodsPerYear: 3,
    periodNames: {
      "1": "1er Trimestre",
      "2": "2ème Trimestre",
      "3": "3ème Trimestre",
    },
    distribution: [
      { start: "2025-09-01", end: "2025-12-20" }, // 1er trimestre
      { start: "2026-01-06", end: "2026-03-28" }, // 2ème trimestre
      { start: "2026-04-14", end: "2026-06-30" }, // 3ème trimestre
    ],
  },
  semestre: {
    name: "Système Semestre (Universitaire)",
    periodModel: "semestre",
    periodsPerYear: 2,
    periodNames: {
      "1": "1er Semestre",
      "2": "2ème Semestre",
    },
    distribution: [
      { start: "2025-09-01", end: "2026-01-31" }, // 1er semestre
      { start: "2026-02-01", end: "2026-06-30" }, // 2ème semestre
    ],
  },
  quartier: {
    name: "Système Quartier (États-Unis)",
    periodModel: "quartier",
    periodsPerYear: 4,
    periodNames: {
      "1": "Automne",
      "2": "Hiver",
      "3": "Printemps",
      "4": "Été",
    },
    distribution: [
      { start: "2025-09-01", end: "2025-11-30" }, // Automne
      { start: "2025-12-01", end: "2026-02-28" }, // Hiver
      { start: "2026-03-01", end: "2026-05-31" }, // Printemps
      { start: "2026-06-01", end: "2026-08-31" }, // Été
    ],
  },
  bimestre: {
    name: "Système Bimestre (Primaire)",
    periodModel: "bimestre",
    periodsPerYear: 5,
    periodNames: {
      "1": "Septembre-Octobre",
      "2": "Novembre-Décembre",
      "3": "Janvier-Février",
      "4": "Mars-Avril",
      "5": "Mai-Juin",
    },
    distribution: [
      { start: "2025-09-01", end: "2025-10-31" }, // Sept-Oct
      { start: "2025-11-01", end: "2025-12-31" }, // Nov-Déc
      { start: "2026-01-01", end: "2026-02-28" }, // Jan-Fév
      { start: "2026-03-01", end: "2026-04-30" }, // Mar-Avr
      { start: "2026-05-01", end: "2026-06-30" }, // Mai-Juin
    ],
  },
} as const;

// Helper functions
export const getAcademicStructureById = (
  id: string,
): AcademicStructure | undefined => {
  return MOCK_ACADEMIC_STRUCTURES.find((structure) => structure.id === id);
};

export const getAcademicStructuresByTeacher = (
  teacherId: string,
): AcademicStructure[] => {
  return MOCK_ACADEMIC_STRUCTURES.filter(
    (structure) => structure.createdBy === teacherId,
  );
};

export const getTemplateByModel = (model: string) => {
  return ACADEMIC_STRUCTURE_TEMPLATES[
    model as keyof typeof ACADEMIC_STRUCTURE_TEMPLATES
  ];
};

export const getDefaultAcademicStructure = (): AcademicStructure => {
  return MOCK_ACADEMIC_STRUCTURES[0]; // Trimestre français par défaut
};
