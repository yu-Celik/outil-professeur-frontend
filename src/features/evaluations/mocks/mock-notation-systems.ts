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
      precision: 0.5, // Permet 0.5, 1.0, 1.5, etc.
      displayFormat: "{value}/20",
    },
    createdAt: new Date("2025-08-15"),
    updatedAt: new Date("2025-09-06"),
    validateGrade: (grade: number) =>
      grade >= 0 && grade <= 20 && (grade * 2) % 1 === 0,
    convert: function (value: number, fromSystem: NotationSystem): number {
      const ratio =
        (this.maxValue - this.minValue) /
        (fromSystem.maxValue - fromSystem.minValue);
      const converted = (value - fromSystem.minValue) * ratio + this.minValue;
      return Math.round(converted * 2) / 2; // Round to nearest 0.5
    },
    formatDisplay: (grade: number, _locale: string = "fr-FR") => `${grade}/20`,
  },
  {
    id: "notation-numeric-100",
    createdBy: "KsmNtVf4zwqO3VV3SQJqPrRlQBA1fFyR",
    name: "Notation sur 100",
    scaleType: "numeric",
    minValue: 0,
    maxValue: 100,
    rules: {
      passingGrade: 50,
      excellentGrade: 80,
      gradeLabels: {
        0: "Non acquis",
        25: "Insuffisant",
        50: "Passable",
        60: "Assez bien",
        70: "Bien",
        80: "Très bien",
        90: "Excellent",
        100: "Parfait",
      },
      precision: 1,
      displayFormat: "{value}%",
    },
    createdAt: new Date("2025-08-15"),
    updatedAt: new Date("2025-09-06"),
    validateGrade: (grade: number) =>
      grade >= 0 && grade <= 100 && grade % 1 === 0,
    convert: function (value: number, fromSystem: NotationSystem): number {
      const ratio =
        (this.maxValue - this.minValue) /
        (fromSystem.maxValue - fromSystem.minValue);
      return Math.round((value - fromSystem.minValue) * ratio + this.minValue);
    },
    formatDisplay: (grade: number, _locale: string = "fr-FR") => `${grade}%`,
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
      letterMappings: {
        F: { value: 0, description: "Échec", threshold: 0 },
        D: { value: 1, description: "Passable", threshold: 50 },
        C: { value: 2, description: "Satisfaisant", threshold: 60 },
        B: { value: 3, description: "Bien", threshold: 75 },
        A: { value: 4, description: "Excellent", threshold: 85 },
      },
      allowPlusMinusModifiers: false,
    },
    createdAt: new Date("2025-08-15"),
    updatedAt: new Date("2025-09-06"),
    validateGrade: (grade: number) =>
      grade >= 0 && grade <= 4 && grade % 1 === 0,
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
    id: "notation-letter-extended",
    createdBy: "KsmNtVf4zwqO3VV3SQJqPrRlQBA1fFyR",
    name: "Notation A-F avec +/-",
    scaleType: "letter",
    minValue: 0,
    maxValue: 12,
    rules: {
      gradeLabels: {
        0: "F",
        1: "F+",
        2: "D-",
        3: "D",
        4: "D+",
        5: "C-",
        6: "C",
        7: "C+",
        8: "B-",
        9: "B",
        10: "B+",
        11: "A-",
        12: "A",
      },
      letterMappings: {
        F: { value: 0, description: "Échec" },
        "F+": { value: 1, description: "Échec (haut)" },
        "D-": { value: 2, description: "Passable (bas)" },
        D: { value: 3, description: "Passable" },
        "D+": { value: 4, description: "Passable (haut)" },
        "C-": { value: 5, description: "Satisfaisant (bas)" },
        C: { value: 6, description: "Satisfaisant" },
        "C+": { value: 7, description: "Satisfaisant (haut)" },
        "B-": { value: 8, description: "Bien (bas)" },
        B: { value: 9, description: "Bien" },
        "B+": { value: 10, description: "Bien (haut)" },
        "A-": { value: 11, description: "Excellent (bas)" },
        A: { value: 12, description: "Excellent" },
      },
      allowPlusMinusModifiers: true,
    },
    createdAt: new Date("2025-08-15"),
    updatedAt: new Date("2025-09-06"),
    validateGrade: (grade: number) =>
      grade >= 0 && grade <= 12 && grade % 1 === 0,
    convert: function (value: number, fromSystem: NotationSystem): number {
      const ratio =
        (this.maxValue - this.minValue) /
        (fromSystem.maxValue - fromSystem.minValue);
      return Math.round((value - fromSystem.minValue) * ratio + this.minValue);
    },
    formatDisplay: (grade: number, _locale: string = "fr-FR") => {
      const labels = [
        "F",
        "F+",
        "D-",
        "D",
        "D+",
        "C-",
        "C",
        "C+",
        "B-",
        "B",
        "B+",
        "A-",
        "A",
      ];
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
        1: "En cours d'acquisition",
        2: "Acquis",
        3: "Expert",
      },
      levelDescriptions: {
        0: "La compétence n'est pas maîtrisée",
        1: "La compétence est en cours d'acquisition",
        2: "La compétence est maîtrisée",
        3: "La compétence est parfaitement maîtrisée",
      },
      colorCoding: {
        0: "red",
        1: "orange",
        2: "green",
        3: "blue",
      },
      passingLevel: 2,
    },
    createdAt: new Date("2025-08-15"),
    updatedAt: new Date("2025-09-06"),
    validateGrade: (grade: number) =>
      grade >= 0 && grade <= 3 && grade % 1 === 0,
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
  {
    id: "notation-competencies-extended",
    createdBy: "KsmNtVf4zwqO3VV3SQJqPrRlQBA1fFyR",
    name: "Compétences (5 niveaux)",
    scaleType: "competency",
    minValue: 0,
    maxValue: 4,
    rules: {
      competencyLevels: {
        0: "Non acquis",
        1: "En cours (débutant)",
        2: "En cours (confirmé)",
        3: "Acquis",
        4: "Expert",
      },
      levelDescriptions: {
        0: "Aucune maîtrise de la compétence",
        1: "Début d'acquisition avec aide",
        2: "Acquisition en cours, autonomie partielle",
        3: "Maîtrise complète et autonome",
        4: "Maîtrise experte, capable d'enseigner",
      },
      colorCoding: {
        0: "red",
        1: "orange",
        2: "yellow",
        3: "green",
        4: "blue",
      },
      passingLevel: 3,
    },
    createdAt: new Date("2025-08-15"),
    updatedAt: new Date("2025-09-06"),
    validateGrade: (grade: number) =>
      grade >= 0 && grade <= 4 && grade % 1 === 0,
    convert: function (value: number, fromSystem: NotationSystem): number {
      const ratio =
        (this.maxValue - this.minValue) /
        (fromSystem.maxValue - fromSystem.minValue);
      return Math.round((value - fromSystem.minValue) * ratio + this.minValue);
    },
    formatDisplay: (grade: number, _locale: string = "fr-FR") => {
      const labels = ["Non acquis", "Débutant", "Confirmé", "Acquis", "Expert"];
      return labels[Math.round(grade)] || "Non acquis";
    },
  },
  {
    id: "notation-custom-stars",
    createdBy: "KsmNtVf4zwqO3VV3SQJqPrRlQBA1fFyR",
    name: "Notation par étoiles",
    scaleType: "custom",
    minValue: 0,
    maxValue: 5,
    rules: {
      displaySymbol: "★",
      emptySymbol: "☆",
      format: "{stars}",
      suffix: " étoiles",
      showEmptyStars: true,
      gradeLabels: {
        0: "Aucune étoile",
        1: "⭐",
        2: "⭐⭐",
        3: "⭐⭐⭐",
        4: "⭐⭐⭐⭐",
        5: "⭐⭐⭐⭐⭐",
      },
    },
    createdAt: new Date("2025-08-15"),
    updatedAt: new Date("2025-09-06"),
    validateGrade: (grade: number) =>
      grade >= 0 && grade <= 5 && grade % 1 === 0,
    convert: function (value: number, fromSystem: NotationSystem): number {
      const ratio =
        (this.maxValue - this.minValue) /
        (fromSystem.maxValue - fromSystem.minValue);
      return Math.round((value - fromSystem.minValue) * ratio + this.minValue);
    },
    formatDisplay: (grade: number, _locale: string = "fr-FR") => {
      const stars = "⭐".repeat(Math.round(grade));
      return stars || "0 étoiles";
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
