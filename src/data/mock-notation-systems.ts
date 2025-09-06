import type { NotationSystem } from "@/types/uml-entities";

export const MOCK_NOTATION_SYSTEMS: NotationSystem[] = [
  {
    id: "notation-numeric-20",
    createdBy: "KsmNtVf4zwqO3VV3SQJqPrRlQBA1fFyR",
    name: "Notation sur 20",
    scaleType: "numeric",
    minValue: 0,
    maxValue: 20,
    rules: {
      passingGrade: 10,
      excellentGrade: 16,
      gradeLabels: {
        0: "Non acquis",
        5: "Insuffisant",
        10: "Passable",
        12: "Assez bien",
        14: "Bien",
        16: "Très bien",
        18: "Excellent",
        20: "Parfait",
      },
    },
    createdAt: new Date("2025-08-15"),
    updatedAt: new Date("2025-09-06"),
    validateGrade: (grade: number) => grade >= 0 && grade <= 20,
    convert: function (value: number, fromSystem: NotationSystem): number {
      const ratio =
        (this.maxValue - this.minValue) /
        (fromSystem.maxValue - fromSystem.minValue);
      return Math.round((value - fromSystem.minValue) * ratio + this.minValue);
    },
    formatDisplay: (grade: number, _locale: string = "fr-FR") => `${grade}/20`,
  },
  {
    id: "notation-letter-af",
    createdBy: "KsmNtVf4zwqO3VV3SQJqPrRlQBA1fFyR",
    name: "Notation A-F",
    scaleType: "letter",
    minValue: 0,
    maxValue: 4,
    rules: {
      gradeLabels: {
        0: "F - Échec",
        1: "D - Passable",
        2: "C - Satisfaisant",
        3: "B - Bien",
        4: "A - Excellent",
      },
    },
    createdAt: new Date("2025-08-15"),
    updatedAt: new Date("2025-09-06"),
    validateGrade: (grade: number) => grade >= 0 && grade <= 4,
    convert: function (value: number, fromSystem: NotationSystem): number {
      const ratio =
        (this.maxValue - this.minValue) /
        (fromSystem.maxValue - fromSystem.minValue);
      return Math.round((value - fromSystem.minValue) * ratio + this.minValue);
    },
    formatDisplay: (grade: number, _locale: string = "fr-FR") => {
      const labels = ["F", "D", "C", "B", "A"];
      return labels[Math.round(grade)] || "F";
    },
  },
  {
    id: "notation-competencies",
    createdBy: "KsmNtVf4zwqO3VV3SQJqPrRlQBA1fFyR",
    name: "Évaluation par compétences",
    scaleType: "competency",
    minValue: 0,
    maxValue: 3,
    rules: {
      competencyLevels: {
        0: "Non acquis",
        1: "En cours",
        2: "Acquis",
        3: "Expert",
      },
    },
    createdAt: new Date("2025-08-15"),
    updatedAt: new Date("2025-09-06"),
    validateGrade: (grade: number) => grade >= 0 && grade <= 3,
    convert: function (value: number, fromSystem: NotationSystem): number {
      const ratio =
        (this.maxValue - this.minValue) /
        (fromSystem.maxValue - fromSystem.minValue);
      return Math.round((value - fromSystem.minValue) * ratio + this.minValue);
    },
    formatDisplay: (grade: number, _locale: string = "fr-FR") => {
      const labels = ["Non acquis", "En cours", "Acquis", "Expert"];
      return labels[Math.round(grade)] || "Non acquis";
    },
  },
];

// Helper functions
export const getNotationSystemById = (
  id: string,
): NotationSystem | undefined => {
  return MOCK_NOTATION_SYSTEMS.find((system) => system.id === id);
};

export const getActiveNotationSystems = (): NotationSystem[] => {
  return MOCK_NOTATION_SYSTEMS;
};

export const getDefaultNotationSystem = (): NotationSystem => {
  return MOCK_NOTATION_SYSTEMS[0]; // Notation sur 20 par défaut
};
