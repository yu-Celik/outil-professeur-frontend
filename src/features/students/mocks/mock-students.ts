import type { Student } from "@/types/uml-entities";

// Fonction utilitaire pour générer des IDs uniques
const generateStudentId = (classCode: string, index: number) => {
  return `student-${classCode}-${index}`;
};

// Fonction pour générer des données d'élève aléatoires mais réalistes
const generateStudentData = (classId: string, index: number) => {
  const firstNames = [
    "Emma",
    "Lucas",
    "Léa",
    "Thomas",
    "Sarah",
    "Antoine",
    "Camille",
    "Maxime",
    "Julie",
    "Alexandre",
    "Marine",
    "Hugo",
    "Manon",
    "Paul",
    "Alice",
    "Louis",
    "Jeanne",
    "Arthur",
    "Clara",
    "Jules",
    "Anaïs",
    "Nathan",
    "Chloé",
    "Ethan",
    "Lola",
    "Tom",
    "Inès",
    "Raphaël",
    "Lina",
    "Mathis",
  ];

  const lastNames = [
    "Martin",
    "Dubois",
    "Garcia",
    "Bernard",
    "Lefebvre",
    "Rousseau",
    "Moreau",
    "Leroy",
    "Petit",
    "Simon",
    "Durand",
    "Lambert",
    "Mercier",
    "Dupont",
    "Faure",
    "Bertrand",
    "Roux",
    "Girard",
    "Fournier",
    "Morel",
    "David",
    "Perrin",
    "Blanc",
    "Robert",
    "Richard",
    "Henry",
    "Lemoine",
    "Payet",
    "Lucas",
    "Marchand",
  ];

  const needs = [
    "Améliorer la concentration",
    "Développer l'autonomie",
    "Améliorer la méthodologie",
    "Gérer le stress",
    "Développer l'expression écrite",
    "Améliorer la syntaxe",
    "Améliorer la prononciation",
    "Enrichir le vocabulaire",
    "Gagner en confiance",
    "Participer plus activement",
    "Améliorer l'attention",
    "Régulariser le travail",
    "Développer l'argumentation",
    "Améliorer la syntaxe complexe",
    "Approfondir l'analyse littéraire",
    "Maîtriser l'ETLV",
    "Développer l'esprit critique",
    "Améliorer la synthèse",
    "Perfectionner l'expression écrite",
    "Préparer intensivement le Bac",
    "Consolider l'ETLV",
    "Améliorer la gestion du temps",
  ];

  const observations = [
    "Élève appliquée",
    "Participe régulièrement",
    "Élève motivé mais anxieux",
    "Élève sérieux et régulier",
    "Travail de qualité",
    "Élève discrète mais compétente",
    "Travail soigné",
    "Élève intelligent mais dispersé",
    "Potentiel important",
    "Élève brillante",
    "Très investie",
    "Élève mature",
    "Bon niveau général",
    "Élève consciencieuse",
    "Progresse régulièrement",
    "Élève excellent",
    "Très motivé",
    "Élève sérieuse",
    "Ambitions post-bac élevées",
  ];

  const strengths = [
    "Excellente en vocabulaire",
    "Très organisée",
    "Bon raisonnement logique",
    "Persévérant",
    "Excellente compréhension orale",
    "Leadership naturel",
    "Excellent en grammaire",
    "Très méthodique",
    "Très bonne compréhension",
    "Réfléchie",
    "Très créatif",
    "Excellente culture générale",
    "Excellente à l'oral",
    "Vocabulaire riche",
    "Excellent raisonnement",
    "Très autonome",
    "Très organisée",
    "Bonne mémorisation",
    "Niveau quasi-bilingue",
    "Leadership",
    "Très rigoureuse",
    "Excellente analyse",
  ];

  const improvementAxes = [
    "Expression orale",
    "Confiance en soi",
    "Gestion du temps",
    "Confiance en examens",
    "Grammaire anglaise",
    "Structure des phrases",
    "Fluidité à l'oral",
    "Spontanéité",
    "Participation orale",
    "Prise d'initiative",
    "Organisation",
    "Constance dans l'effort",
    "Structures grammaticales",
    "Nuances linguistiques",
    "Expression nuancée",
    "Vocabulaire scientifique",
    "Analyse personnelle",
    "Prise de position",
    "Gestion du stress",
    "Techniques d'examen",
    "Rapidité d'exécution",
    "Confiance en soi",
  ];

  // Sélection aléatoire de données
  const randomFirstName =
    firstNames[Math.floor(Math.random() * firstNames.length)];
  const randomLastName =
    lastNames[Math.floor(Math.random() * lastNames.length)];

  // Sélection de 2 besoins aléatoires
  const shuffledNeeds = [...needs].sort(() => 0.5 - Math.random());
  const selectedNeeds = shuffledNeeds.slice(0, 2);

  // Sélection de 2 observations aléatoires
  const shuffledObservations = [...observations].sort(
    () => 0.5 - Math.random(),
  );
  const selectedObservations = shuffledObservations.slice(0, 2);

  // Sélection de 2 forces aléatoires
  const shuffledStrengths = [...strengths].sort(() => 0.5 - Math.random());
  const selectedStrengths = shuffledStrengths.slice(0, 2);

  // Sélection de 2 axes d'amélioration aléatoires
  const shuffledImprovementAxes = [...improvementAxes].sort(
    () => 0.5 - Math.random(),
  );
  const selectedImprovementAxes = shuffledImprovementAxes.slice(0, 2);

  // Génération de taux aléatoires
  const attendanceRateValue = 0.8 + Math.random() * 0.19; // entre 0.80 et 0.99
  const participationAverageValue = 14 + Math.random() * 6; // entre 14 et 20

  return {
    id: generateStudentId(classId.replace("class-", ""), index),
    createdBy: "KsmNtVf4zwqO3VV3SQJqPrRlQBA1fFyR",
    firstName: randomFirstName,
    lastName: randomLastName,
    currentClassId: classId,
    needs: selectedNeeds,
    observations: selectedObservations,
    strengths: selectedStrengths,
    improvementAxes: selectedImprovementAxes,
    createdAt: new Date("2025-09-01"),
    updatedAt: new Date("2025-09-06"),
    fullName: function () {
      return `${this.firstName} ${this.lastName}`;
    },
    attendanceRate: (_start: Date, _end: Date) => attendanceRateValue,
    participationAverage: (_start: Date, _end: Date) =>
      participationAverageValue,
  };
};

// Génération des élèves pour chaque classe
const generateStudentsForClass = (
  classId: string,
  count: number,
): Student[] => {
  return Array.from({ length: count }, (_, i) => {
    // Cas spécial pour Antoine Girard dans la classe 2nde Zircon
    if (classId === "class-2nde-zircon" && i === 0) {
      return {
        id: "student-2nde-zircon-1",
        createdBy: "KsmNtVf4zwqO3VV3SQJqPrRlQBA1fFyR",
        firstName: "Antoine",
        lastName: "Girard",
        currentClassId: classId,
        needs: ["Améliorer la concentration", "Développer l'autonomie"],
        observations: ["Élève appliqué", "Participe régulièrement"],
        strengths: ["Excellent en vocabulaire", "Très organisé"],
        improvementAxes: ["Expression orale", "Confiance en soi"],
        createdAt: new Date("2025-09-01"),
        updatedAt: new Date("2025-09-06"),
        fullName: function () {
          return `${this.firstName} ${this.lastName}`;
        },
        attendanceRate: (_start: Date, _end: Date) => 0.85,
        participationAverage: (_start: Date, _end: Date) => 15.5,
      };
    }
    return generateStudentData(classId, i + 1);
  });
};

// Génération de tous les élèves
const ALL_STUDENTS: Student[] = [
  // 2nde Jaspe (10 élèves sur 28 max)
  ...generateStudentsForClass("class-2nde-jaspe", 10),

  // 2nde Zircon (8 élèves sur 26 max)
  ...generateStudentsForClass("class-2nde-zircon", 8),

  // 2nde Thulite (12 élèves sur 30 max)
  ...generateStudentsForClass("class-2nde-thulite", 12),

  // 1e Onyx (9 élèves sur 24 max)
  ...generateStudentsForClass("class-1e-onyx", 9),

  // Term Tanzanite (7 élèves sur 22 max)
  ...generateStudentsForClass("class-term-tanzanite", 7),
];

export const MOCK_STUDENTS: Student[] = ALL_STUDENTS;

// Helper functions
export const getStudentById = (id: string): Student | undefined => {
  return MOCK_STUDENTS.find((student) => student.id === id);
};

export const getStudentsByClass = (classId: string): Student[] => {
  return MOCK_STUDENTS.filter((student) => student.currentClassId === classId);
};

export const getActiveStudents = (): Student[] => {
  return MOCK_STUDENTS;
};

// Statistiques par classe
export const getClassStatistics = (classId: string) => {
  const students = getStudentsByClass(classId);
  if (students.length === 0) {
    return {
      totalStudents: 0,
      averageAttendance: 0,
      averageParticipation: 0,
    };
  }

  return {
    totalStudents: students.length,
    averageAttendance:
      students.reduce(
        (sum, student) =>
          sum + student.attendanceRate(new Date("2025-09-01"), new Date()),
        0,
      ) / students.length,
    averageParticipation:
      students.reduce(
        (sum, student) =>
          sum +
          student.participationAverage(new Date("2025-09-01"), new Date()),
        0,
      ) / students.length,
  };
};
