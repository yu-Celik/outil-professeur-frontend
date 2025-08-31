import type { Student } from "@/types/uml-entities";

export const MOCK_STUDENTS: Student[] = [
  // Classe B1 (15 élèves)
  {
    id: "student-1",
    createdBy: "KsmNtVf4zwqO3VV3SQJqPrRlQBA1fFyR",
    firstName: "Emma",
    lastName: "Martin",
    currentClassId: "class-b1",
    needs: ["Améliorer la concentration", "Développer l'autonomie"],
    observations: ["Élève appliquée", "Participe régulièrement"],
    strengths: ["Excellente en calcul", "Très organisée"],
    improvementAxes: ["Expression orale", "Confiance en soi"],
    createdAt: new Date("2025-09-01"),
    updatedAt: new Date(),
    fullName: function () {
      return `${this.firstName} ${this.lastName}`;
    },
    attendanceRate: (_start: Date, _end: Date) => 0.92,
    participationAverage: (_start: Date, _end: Date) => 17.2,
  },
  {
    id: "student-2",
    createdBy: "KsmNtVf4zwqO3VV3SQJqPrRlQBA1fFyR",
    firstName: "Lucas",
    lastName: "Dubois",
    currentClassId: "class-b1",
    needs: ["Améliorer la méthodologie", "Gérer le stress"],
    observations: ["Élève motivé mais anxieux"],
    strengths: ["Bon raisonnement logique", "Persévérant"],
    improvementAxes: ["Gestion du temps", "Confiance en examens"],
    createdAt: new Date("2025-09-01"),
    updatedAt: new Date(),
    fullName: function () {
      return `${this.firstName} ${this.lastName}`;
    },
    attendanceRate: (_start: Date, _end: Date) => 0.88,
    participationAverage: (start: Date, end: Date) => 15.8,
  },
  {
    id: "student-3",
    createdBy: "KsmNtVf4zwqO3VV3SQJqPrRlQBA1fFyR",
    firstName: "Léa",
    lastName: "Rousseau",
    currentClassId: "class-b1",
    needs: ["Consolider les bases", "Améliorer l'attention"],
    observations: ["Élève discrète mais studieuse"],
    strengths: ["Très consciencieuse", "Aide ses camarades"],
    improvementAxes: ["Participation orale", "Rapidité d'exécution"],
    createdAt: new Date("2025-09-01"),
    updatedAt: new Date(),
    fullName: function () {
      return `${this.firstName} ${this.lastName}`;
    },
    attendanceRate: (start: Date, end: Date) => 0.95,
    participationAverage: (start: Date, end: Date) => 16.5,
  },
  {
    id: "student-4",
    createdBy: "KsmNtVf4zwqO3VV3SQJqPrRlQBA1fFyR",
    firstName: "Nathan",
    lastName: "Bernard",
    currentClassId: "class-b1",
    needs: ["Développer la rigueur", "Améliorer la rédaction"],
    observations: ["Élève créatif avec de bonnes idées"],
    strengths: ["Esprit d'initiative", "Bon à l'oral"],
    improvementAxes: ["Organisation du travail", "Précision"],
    createdAt: new Date("2025-09-01"),
    updatedAt: new Date(),
    fullName: function () {
      return `${this.firstName} ${this.lastName}`;
    },
    attendanceRate: (start: Date, end: Date) => 0.85,
    participationAverage: (start: Date, end: Date) => 14.3,
  },
  {
    id: "student-5",
    createdBy: "KsmNtVf4zwqO3VV3SQJqPrRlQBA1fFyR",
    firstName: "Chloé",
    lastName: "Moreau",
    currentClassId: "class-b1",
    needs: ["Renforcer la confiance", "Améliorer la compréhension"],
    observations: ["Élève timide mais attentive"],
    strengths: ["Très polie", "Écoute bien"],
    improvementAxes: ["Prise de parole", "Rapidité de compréhension"],
    createdAt: new Date("2025-09-01"),
    updatedAt: new Date(),
    fullName: function () {
      return `${this.firstName} ${this.lastName}`;
    },
    attendanceRate: (start: Date, end: Date) => 0.9,
    participationAverage: (start: Date, end: Date) => 13.7,
  },

  // Classe C1 (12 élèves)
  {
    id: "student-16",
    createdBy: "KsmNtVf4zwqO3VV3SQJqPrRlQBA1fFyR",
    firstName: "Thomas",
    lastName: "Roux",
    currentClassId: "class-c1",
    needs: ["Approfondir les concepts", "Développer l'analyse"],
    observations: ["Élève brillant et curieux"],
    strengths: ["Excellente logique", "Pose de bonnes questions"],
    improvementAxes: ["Patience avec les autres", "Travail en équipe"],
    createdAt: new Date("2025-09-01"),
    updatedAt: new Date(),
    fullName: function () {
      return `${this.firstName} ${this.lastName}`;
    },
    attendanceRate: (start: Date, end: Date) => 0.98,
    participationAverage: (start: Date, end: Date) => 18.5,
  },
  {
    id: "student-17",
    createdBy: "KsmNtVf4zwqO3VV3SQJqPrRlQBA1fFyR",
    firstName: "Jade",
    lastName: "Morel",
    currentClassId: "class-c1",
    needs: ["Consolider les acquis", "Améliorer la régularité"],
    observations: ["Élève avec des résultats variables"],
    strengths: ["Créative", "Bonne compréhension globale"],
    improvementAxes: ["Régularité du travail", "Attention aux détails"],
    createdAt: new Date("2025-09-01"),
    updatedAt: new Date(),
    fullName: function () {
      return `${this.firstName} ${this.lastName}`;
    },
    attendanceRate: (start: Date, end: Date) => 0.83,
    participationAverage: (start: Date, end: Date) => 15.2,
  },

  // Classe A2 (18 élèves)
  {
    id: "student-28",
    createdBy: "KsmNtVf4zwqO3VV3SQJqPrRlQBA1fFyR",
    firstName: "Alexis",
    lastName: "Faure",
    currentClassId: "class-a2",
    needs: ["Développer l'autonomie", "Améliorer l'expression"],
    observations: ["Élève sérieux et appliqué"],
    strengths: ["Travailleur", "Respectueux"],
    improvementAxes: ["Initiative personnelle", "Expression créative"],
    createdAt: new Date("2025-09-01"),
    updatedAt: new Date(),
    fullName: function () {
      return `${this.firstName} ${this.lastName}`;
    },
    attendanceRate: (start: Date, end: Date) => 0.91,
    participationAverage: (start: Date, end: Date) => 16.8,
  },
  {
    id: "student-29",
    createdBy: "KsmNtVf4zwqO3VV3SQJqPrRlQBA1fFyR",
    firstName: "Mathilde",
    lastName: "Perrin",
    currentClassId: "class-a2",
    needs: ["Gérer les difficultés", "Renforcer les bases"],
    observations: ["Élève courageuse malgré les difficultés"],
    strengths: ["Persévérante", "Solidaire"],
    improvementAxes: ["Méthodes de travail", "Confiance en ses capacités"],
    createdAt: new Date("2025-09-01"),
    updatedAt: new Date(),
    fullName: function () {
      return `${this.firstName} ${this.lastName}`;
    },
    attendanceRate: (start: Date, end: Date) => 0.87,
    participationAverage: (start: Date, end: Date) => 12.4,
  },

  // Classe B2 (14 élèves)
  {
    id: "student-46",
    createdBy: "KsmNtVf4zwqO3VV3SQJqPrRlQBA1fFyR",
    firstName: "Benjamin",
    lastName: "Lecomte",
    currentClassId: "class-b2",
    needs: ["Approfondir les notions", "Développer l'esprit critique"],
    observations: ["Élève mature et réfléchi"],
    strengths: ["Analyse bien", "Leadership naturel"],
    improvementAxes: ["Patience pédagogique", "Humilité"],
    createdAt: new Date("2025-09-01"),
    updatedAt: new Date(),
    fullName: function () {
      return `${this.firstName} ${this.lastName}`;
    },
    attendanceRate: (start: Date, end: Date) => 0.94,
    participationAverage: (start: Date, end: Date) => 17.6,
  },

  // Classe C2 (10 élèves)
  {
    id: "student-60",
    createdBy: "KsmNtVf4zwqO3VV3SQJqPrRlQBA1fFyR",
    firstName: "Alexandre",
    lastName: "Giraud",
    currentClassId: "class-c2",
    needs: ["Perfectionner le niveau", "Préparer examens avancés"],
    observations: ["Élève excellent avec de grandes ambitions"],
    strengths: ["Très bon niveau", "Motivé"],
    improvementAxes: ["Gestion du perfectionnisme", "Relaxation"],
    createdAt: new Date("2025-09-01"),
    updatedAt: new Date(),
    fullName: function () {
      return `${this.firstName} ${this.lastName}`;
    },
    attendanceRate: (start: Date, end: Date) => 0.97,
    participationAverage: (start: Date, end: Date) => 18.9,
  },

  // Classe A1 (20 élèves)
  {
    id: "student-70",
    createdBy: "KsmNtVf4zwqO3VV3SQJqPrRlQBA1fFyR",
    firstName: "Pierre",
    lastName: "Collin",
    currentClassId: "class-a1",
    needs: ["Améliorer la concentration", "Développer la confiance"],
    observations: ["Élève attentif mais timide"],
    strengths: ["Bon en calcul mental", "Très poli"],
    improvementAxes: ["Participation orale", "Prise d'initiatives"],
    createdAt: new Date("2025-09-01"),
    updatedAt: new Date(),
    fullName: function () {
      return `${this.firstName} ${this.lastName}`;
    },
    attendanceRate: (start: Date, end: Date) => 0.85,
    participationAverage: (start: Date, end: Date) => 16.5,
  },

  // Classe Préparatoire (8 élèves)
  {
    id: "student-90",
    createdBy: "KsmNtVf4zwqO3VV3SQJqPrRlQBA1fFyR",
    firstName: "Antoine",
    lastName: "Lejeune",
    currentClassId: "class-preparatoire",
    needs: ["Acquérir les bases", "Développer la méthodologie"],
    observations: ["Élève débutant mais motivé"],
    strengths: ["Grande motivation", "Écoute attentivement"],
    improvementAxes: ["Vocabulaire de base", "Compréhension orale"],
    createdAt: new Date("2025-09-01"),
    updatedAt: new Date(),
    fullName: function () {
      return `${this.firstName} ${this.lastName}`;
    },
    attendanceRate: (start: Date, end: Date) => 0.89,
    participationAverage: (start: Date, end: Date) => 12.8,
  },

  // Classe Avancé (6 élèves)
  {
    id: "student-98",
    createdBy: "KsmNtVf4zwqO3VV3SQJqPrRlQBA1fFyR",
    firstName: "Maxime",
    lastName: "Olivier",
    currentClassId: "class-avance",
    needs: ["Maintenir l'excellence", "Préparer certifications"],
    observations: ["Élève d'exception avec un niveau remarquable"],
    strengths: ["Maîtrise parfaite", "Aide les autres"],
    improvementAxes: ["Perfectionnement stylistique", "Leadership"],
    createdAt: new Date("2025-09-01"),
    updatedAt: new Date(),
    fullName: function () {
      return `${this.firstName} ${this.lastName}`;
    },
    attendanceRate: (start: Date, end: Date) => 0.99,
    participationAverage: (start: Date, end: Date) => 19.2,
  },
];

// Helper functions
export const findStudentById = (id: string): Student | undefined => {
  return MOCK_STUDENTS.find((student) => student.id === id);
};

export const getStudentsByClass = (classId: string): Student[] => {
  return MOCK_STUDENTS.filter((student) => student.currentClassId === classId);
};

export const getStudentsByClassCode = (classCode: string): Student[] => {
  // Map class codes to class IDs for filtering
  const classIdMap: Record<string, string> = {
    B1: "class-b1",
    A2: "class-a2",
    C1: "class-c1",
    B2: "class-b2",
    C2: "class-c2",
    A1: "class-a1",
    Préparatoire: "class-preparatoire",
    Avancé: "class-avance",
  };

  const classId = classIdMap[classCode];
  return classId ? getStudentsByClass(classId) : [];
};
