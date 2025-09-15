 import type { Exam, StudentExamResult } from "@/types/uml-entities";

export const MOCK_EXAMS: Exam[] = [
  {
    id: "exam-anglais-controle-1",
    createdBy: "KsmNtVf4zwqO3VV3SQJqPrRlQBA1fFyR",
    title: "Contrôle n°1 - Past Simple",
    description: "Évaluation sur le past simple et les verbes irréguliers",
    classId: "class-2nde-jaspe",
    subjectId: "subject-anglais",
    academicPeriodId: "period-trimester-1",
    notationSystemId: "notation-numeric-20",
    examDate: new Date("2025-10-15"),
    examType: "Contrôle écrit",
    durationMinutes: 60,
    totalPoints: 20,
    coefficient: 2,
    instructions: "Calculatrice interdite. Rédigez soigneusement vos réponses en anglais.",
    isPublished: true,
    createdAt: new Date("2025-10-01"),
    updatedAt: new Date("2025-10-14"),
    publish: function() {
      this.isPublished = true;
      this.updatedAt = new Date();
    },
    unpublish: function() {
      this.isPublished = false;
      this.updatedAt = new Date();
    },
    calculateStatistics: function() {
      // Cette méthode sera implémentée dans le hook
      return {};
    },
    addResult: function(studentId: string, points: number): StudentExamResult {
      // Cette méthode sera implémentée dans le hook
      return {} as StudentExamResult;
    },
  },
  {
    id: "exam-etlv-presentation-1",
    createdBy: "KsmNtVf4zwqO3VV3SQJqPrRlQBA1fFyR",
    title: "Présentation - Sustainable Technologies",
    description: "Présentation en anglais sur les technologies durables",
    classId: "class-2nde-zircon",
    subjectId: "subject-etlv",
    academicPeriodId: "period-trimester-1",
    notationSystemId: "notation-numeric-20",
    examDate: new Date("2025-11-20"),
    examType: "Présentation orale",
    durationMinutes: 20,
    totalPoints: 20,
    coefficient: 3,
    instructions: "Présentation de 15 minutes en anglais suivie de 5 minutes de questions.",
    isPublished: false,
    createdAt: new Date("2025-11-01"),
    updatedAt: new Date("2025-11-15"),
    publish: function() {
      this.isPublished = true;
      this.updatedAt = new Date();
    },
    unpublish: function() {
      this.isPublished = false;
      this.updatedAt = new Date();
    },
    calculateStatistics: function() {
      return {};
    },
    addResult: function(studentId: string, points: number): StudentExamResult {
      return {} as StudentExamResult;
    },
  },
  {
    id: "exam-anglais-quiz-1",
    createdBy: "KsmNtVf4zwqO3VV3SQJqPrRlQBA1fFyR",
    title: "Quiz - Vocabulary & Grammar",
    description: "Quiz sur le vocabulaire et la grammaire anglaise",
    classId: "class-2nde-thulite",
    subjectId: "subject-anglais",
    academicPeriodId: "period-trimester-1",
    notationSystemId: "notation-competencies",
    examDate: new Date("2025-09-25"),
    examType: "Quiz en ligne",
    durationMinutes: 30,
    totalPoints: 4,
    coefficient: 1,
    instructions: "QCM avec une seule réponse possible par question.",
    isPublished: true,
    createdAt: new Date("2025-09-15"),
    updatedAt: new Date("2025-09-24"),
    publish: function() {
      this.isPublished = true;
      this.updatedAt = new Date();
    },
    unpublish: function() {
      this.isPublished = false;
      this.updatedAt = new Date();
    },
    calculateStatistics: function() {
      return {};
    },
    addResult: function(studentId: string, points: number): StudentExamResult {
      return {} as StudentExamResult;
    },
  },
  {
    id: "exam-etlv-project-1",
    createdBy: "KsmNtVf4zwqO3VV3SQJqPrRlQBA1fFyR",
    title: "Project - Innovation Report",
    description: "Rapport en anglais sur une innovation technologique récente",
    classId: "class-1e-onyx",
    subjectId: "subject-etlv",
    academicPeriodId: "period-trimester-1",
    notationSystemId: "notation-letter-af",
    examDate: new Date("2025-12-10"),
    examType: "Projet écrit",
    durationMinutes: 180, // 3 heures de travail en classe
    totalPoints: 6,
    coefficient: 2,
    instructions: "Rapport de 3 pages minimum avec sources et références.",
    isPublished: true,
    createdAt: new Date("2025-11-25"),
    updatedAt: new Date("2025-12-05"),
    publish: function() {
      this.isPublished = true;
      this.updatedAt = new Date();
    },
    unpublish: function() {
      this.isPublished = false;
      this.updatedAt = new Date();
    },
    calculateStatistics: function() {
      return {};
    },
    addResult: function(studentId: string, points: number): StudentExamResult {
      return {} as StudentExamResult;
    },
  },
  {
    id: "exam-anglais-oral-1",
    createdBy: "KsmNtVf4zwqO3VV3SQJqPrRlQBA1fFyR",
    title: "Oral - Career Interview",
    description: "Simulation d'entretien professionnel en anglais",
    classId: "class-term-tanzanite",
    subjectId: "subject-anglais",
    academicPeriodId: "period-trimester-1",
    notationSystemId: "notation-numeric-20",
    examDate: new Date("2025-12-15"),
    examType: "Épreuve orale",
    durationMinutes: 15, // 10 min présentation + 5 min questions
    totalPoints: 20,
    coefficient: 2.5,
    instructions: "Entretien individuel de 10 minutes suivi de 5 minutes de questions.",
    isPublished: false,
    createdAt: new Date("2025-11-01"),
    updatedAt: new Date("2025-12-01"),
    publish: function() {
      this.isPublished = true;
      this.updatedAt = new Date();
    },
    unpublish: function() {
      this.isPublished = false;
      this.updatedAt = new Date();
    },
    calculateStatistics: function() {
      return {};
    },
    addResult: function(studentId: string, points: number): StudentExamResult {
      return {} as StudentExamResult;
    },
  },
];

export const MOCK_STUDENT_EXAM_RESULTS: StudentExamResult[] = [
  // Résultats pour le contrôle d'anglais en 2nde Jaspe
  {
    id: "result-exam-anglais-controle-1-student-1",
    createdBy: "KsmNtVf4zwqO3VV3SQJqPrRlQBA1fFyR",
    examId: "exam-anglais-controle-1",
    studentId: "student-2nde-jaspe-1",
    pointsObtained: 16.5,
    grade: 16.5,
    gradeDisplay: "16,5/20",
    isAbsent: false,
    comments: "Excellent travail sur le past simple. Vocabulaire riche et précis.",
    markedAt: new Date("2025-10-20"),
    isPassing: function(system) {
      return this.grade >= system.minValue + (system.maxValue - system.minValue) * 0.5;
    },
    gradeCategory: function(system) {
      const percentage = (this.grade - system.minValue) / (system.maxValue - system.minValue) * 100;
      if (percentage >= 80) return "Excellent";
      if (percentage >= 60) return "Bien";
      if (percentage >= 40) return "Satisfaisant";
      return "Insuffisant";
    },
    percentage: function(examTotalPoints) {
      return (this.pointsObtained / examTotalPoints) * 100;
    },
    updateDisplay: function(system, locale) {
      this.gradeDisplay = system.formatDisplay(this.grade, locale);
    },
  },
  {
    id: "result-exam-anglais-controle-1-student-2",
    createdBy: "KsmNtVf4zwqO3VV3SQJqPrRlQBA1fFyR",
    examId: "exam-anglais-controle-1",
    studentId: "student-2nde-jaspe-2",
    pointsObtained: 12,
    grade: 12,
    gradeDisplay: "12/20",
    isAbsent: false,
    comments: "Bonnes bases mais quelques erreurs sur les verbes irréguliers.",
    markedAt: new Date("2025-10-20"),
    isPassing: function(system) {
      return this.grade >= system.minValue + (system.maxValue - system.minValue) * 0.5;
    },
    gradeCategory: function(system) {
      const percentage = (this.grade - system.minValue) / (system.maxValue - system.minValue) * 100;
      if (percentage >= 80) return "Excellent";
      if (percentage >= 60) return "Bien";
      if (percentage >= 40) return "Satisfaisant";
      return "Insuffisant";
    },
    percentage: function(examTotalPoints) {
      return (this.pointsObtained / examTotalPoints) * 100;
    },
    updateDisplay: function(system, locale) {
      this.gradeDisplay = system.formatDisplay(this.grade, locale);
    },
  },
  {
    id: "result-exam-anglais-controle-1-student-3",
    createdBy: "KsmNtVf4zwqO3VV3SQJqPrRlQBA1fFyR",
    examId: "exam-anglais-controle-1",
    studentId: "student-2nde-jaspe-3",
    pointsObtained: 0,
    grade: 0,
    gradeDisplay: "Absent",
    isAbsent: true,
    comments: "Absence justifiée - rattrapage prévu le 25/10",
    markedAt: new Date("2025-10-20"),
    isPassing: function(system) {
      return !this.isAbsent && this.grade >= system.minValue + (system.maxValue - system.minValue) * 0.5;
    },
    gradeCategory: function(system) {
      if (this.isAbsent) return "Absent";
      const percentage = (this.grade - system.minValue) / (system.maxValue - system.minValue) * 100;
      if (percentage >= 80) return "Excellent";
      if (percentage >= 60) return "Bien";
      if (percentage >= 40) return "Satisfaisant";
      return "Insuffisant";
    },
    percentage: function(examTotalPoints) {
      if (this.isAbsent) return 0;
      return (this.pointsObtained / examTotalPoints) * 100;
    },
    updateDisplay: function(system, locale) {
      if (this.isAbsent) {
        this.gradeDisplay = "Absent";
      } else {
        this.gradeDisplay = system.formatDisplay(this.grade, locale);
      }
    },
  },
  // Résultats pour le quiz d'anglais en 2nde Thulite
  {
    id: "result-exam-anglais-quiz-1-student-1",
    createdBy: "KsmNtVf4zwqO3VV3SQJqPrRlQBA1fFyR",
    examId: "exam-anglais-quiz-1",
    studentId: "student-2nde-thulite-1",
    pointsObtained: 3,
    grade: 3,
    gradeDisplay: "Acquis",
    isAbsent: false,
    comments: "Bonne maîtrise du vocabulaire et de la grammaire.",
    markedAt: new Date("2025-09-30"),
    isPassing: function(system) {
      return this.grade >= 2; // Seuil d'acquisition pour les compétences
    },
    gradeCategory: function(system) {
      if (this.grade >= 3) return "Acquis";
      if (this.grade >= 2) return "En cours d'acquisition";
      return "Non acquis";
    },
    percentage: function(examTotalPoints) {
      return (this.pointsObtained / examTotalPoints) * 100;
    },
    updateDisplay: function(system, locale) {
      this.gradeDisplay = system.formatDisplay(this.grade, locale);
    },
  },
  {
    id: "result-exam-anglais-quiz-1-student-2",
    createdBy: "KsmNtVf4zwqO3VV3SQJqPrRlQBA1fFyR",
    examId: "exam-anglais-quiz-1",
    studentId: "student-2nde-thulite-2",
    pointsObtained: 2,
    grade: 2,
    gradeDisplay: "En cours d'acquisition",
    isAbsent: false,
    comments: "Quelques hésitations sur la grammaire. À consolider.",
    markedAt: new Date("2025-09-30"),
    isPassing: function(system) {
      return this.grade >= 2;
    },
    gradeCategory: function(system) {
      if (this.grade >= 3) return "Acquis";
      if (this.grade >= 2) return "En cours d'acquisition";
      return "Non acquis";
    },
    percentage: function(examTotalPoints) {
      return (this.pointsObtained / examTotalPoints) * 100;
    },
    updateDisplay: function(system, locale) {
      this.gradeDisplay = system.formatDisplay(this.grade, locale);
    },
  },
  // Résultats pour la présentation ETLV en 2nde Zircon
  {
    id: "result-exam-etlv-presentation-1-student-1",
    createdBy: "KsmNtVf4zwqO3VV3SQJqPrRlQBA1fFyR",
    examId: "exam-etlv-presentation-1",
    studentId: "student-2nde-zircon-1",
    pointsObtained: 15.5,
    grade: 15.5,
    gradeDisplay: "15,5/20",
    isAbsent: false,
    comments: "Présentation claire et bien documentée. Excellent anglais technique.",
    markedAt: new Date("2025-11-25"),
    isPassing: function(system) {
      return this.grade >= system.minValue + (system.maxValue - system.minValue) * 0.5;
    },
    gradeCategory: function(system) {
      const percentage = (this.grade - system.minValue) / (system.maxValue - system.minValue) * 100;
      if (percentage >= 80) return "Excellent";
      if (percentage >= 60) return "Bien";
      if (percentage >= 40) return "Satisfaisant";
      return "Insuffisant";
    },
    percentage: function(examTotalPoints) {
      return (this.pointsObtained / examTotalPoints) * 100;
    },
    updateDisplay: function(system, locale) {
      this.gradeDisplay = system.formatDisplay(this.grade, locale);
    },
  },
  {
    id: "result-exam-etlv-presentation-1-student-2",
    createdBy: "KsmNtVf4zwqO3VV3SQJqPrRlQBA1fFyR",
    examId: "exam-etlv-presentation-1",
    studentId: "student-2nde-zircon-2",
    pointsObtained: 13,
    grade: 13,
    gradeDisplay: "13/20",
    isAbsent: false,
    comments: "Bonne recherche mais quelques difficultés à l'oral en anglais.",
    markedAt: new Date("2025-11-25"),
    isPassing: function(system) {
      return this.grade >= system.minValue + (system.maxValue - system.minValue) * 0.5;
    },
    gradeCategory: function(system) {
      const percentage = (this.grade - system.minValue) / (system.maxValue - system.minValue) * 100;
      if (percentage >= 80) return "Excellent";
      if (percentage >= 60) return "Bien";
      if (percentage >= 40) return "Satisfaisant";
      return "Insuffisant";
    },
    percentage: function(examTotalPoints) {
      return (this.pointsObtained / examTotalPoints) * 100;
    },
    updateDisplay: function(system, locale) {
      this.gradeDisplay = system.formatDisplay(this.grade, locale);
    },
  },
  // Résultats pour le projet ETLV en 1e Onyx
  {
    id: "result-exam-etlv-project-1-student-1",
    createdBy: "KsmNtVf4zwqO3VV3SQJqPrRlQBA1fFyR",
    examId: "exam-etlv-project-1",
    studentId: "student-1e-onyx-1",
    pointsObtained: 5,
    grade: 5,
    gradeDisplay: "A",
    isAbsent: false,
    comments: "Rapport exceptionnel avec analyse poussée de l'innovation. Anglais parfait.",
    markedAt: new Date("2025-12-15"),
    isPassing: function(system) {
      return this.grade >= 2; // Seuil de réussite pour le système A-F
    },
    gradeCategory: function(system) {
      if (this.grade >= 4) return "Excellent";
      if (this.grade >= 3) return "Bien";
      if (this.grade >= 2) return "Satisfaisant";
      return "Insuffisant";
    },
    percentage: function(examTotalPoints) {
      return (this.pointsObtained / examTotalPoints) * 100;
    },
    updateDisplay: function(system, locale) {
      this.gradeDisplay = system.formatDisplay(this.grade, locale);
    },
  },
];

// Fonction utilitaire pour ajouter des résultats d'examens supplémentaires
function generateMissingResults(): StudentExamResult[] {
  const additionalResults: StudentExamResult[] = [];
  
  // Ajouter plus de résultats pour le contrôle d'anglais en 2nde Jaspe
  for (let i = 4; i <= 6; i++) {
    additionalResults.push({
      id: `result-exam-anglais-controle-1-student-${i}`,
      createdBy: "KsmNtVf4zwqO3VV3SQJqPrRlQBA1fFyR",
      examId: "exam-anglais-controle-1",
      studentId: `student-2nde-jaspe-${i}`,
      pointsObtained: Math.random() * 8 + 10, // Notes entre 10 et 18
      grade: 0, // Sera calculé dynamiquement
      gradeDisplay: "",
      isAbsent: false,
      comments: "Résultat généré automatiquement.",
      markedAt: new Date("2025-10-20"),
      isPassing: function(system) {
        return this.grade >= system.minValue + (system.maxValue - system.minValue) * 0.5;
      },
      gradeCategory: function(system) {
        const percentage = (this.grade - system.minValue) / (system.maxValue - system.minValue) * 100;
        if (percentage >= 80) return "Excellent";
        if (percentage >= 60) return "Bien";
        if (percentage >= 40) return "Satisfaisant";
        return "Insuffisant";
      },
      percentage: function(examTotalPoints) {
        return (this.pointsObtained / examTotalPoints) * 100;
      },
      updateDisplay: function(system, locale) {
        this.gradeDisplay = system.formatDisplay(this.grade, locale);
      },
    });
    // Finaliser le grade et l'affichage
    const result = additionalResults[additionalResults.length - 1];
    result.grade = Math.round(result.pointsObtained * 100) / 100;
    result.gradeDisplay = `${result.grade}/20`;
  }
  
  return additionalResults;
}

// Ajouter les résultats supplémentaires
MOCK_STUDENT_EXAM_RESULTS.push(...generateMissingResults());

// Fonction pour générer des résultats pour tous les élèves de toutes les classes
function generateComprehensiveResults(): StudentExamResult[] {
  const additionalResults: StudentExamResult[] = [];
  
  // IDs des élèves par classe (basé sur les données mock des students)
  const studentsByClass: Record<string, string[]> = {
    "class-2nde-jaspe": ["student-2nde-jaspe-1", "student-2nde-jaspe-2", "student-2nde-jaspe-3", "student-2nde-jaspe-4", "student-2nde-jaspe-5", "student-2nde-jaspe-6"],
    "class-2nde-thulite": ["student-2nde-thulite-1", "student-2nde-thulite-2", "student-2nde-thulite-3", "student-2nde-thulite-4"],
    "class-2nde-zircon": ["student-2nde-zircon-1", "student-2nde-zircon-2", "student-2nde-zircon-3", "student-2nde-zircon-4", "student-2nde-zircon-5"],
    "class-1e-onyx": ["student-1e-onyx-1", "student-1e-onyx-2", "student-1e-onyx-3"],
    "class-term-tanzanite": ["student-term-tanzanite-1", "student-term-tanzanite-2"]
  };
  
  // Générer des résultats pour chaque examen et chaque élève de la classe correspondante
  MOCK_EXAMS.forEach(exam => {
    const studentsInClass = studentsByClass[exam.classId] || [];
    
    studentsInClass.forEach((studentId) => {
      // Éviter de dupliquer les résultats existants
      const existingResult = MOCK_STUDENT_EXAM_RESULTS.find(
        result => result.examId === exam.id && result.studentId === studentId
      );
      
      if (!existingResult) {
        // Générer une note réaliste selon le type de notation
        let pointsObtained: number;
        let grade: number;
        let gradeDisplay: string;
        let isAbsent = Math.random() < 0.05; // 5% de chance d'être absent
        
        if (isAbsent) {
          pointsObtained = 0;
          grade = 0;
          gradeDisplay = "Absent";
        } else {
          // Générer des notes selon la distribution normale
          const mean = exam.totalPoints * 0.65; // Moyenne à 65%
          const std = exam.totalPoints * 0.15; // Écart type à 15%
          
          // Génération avec distribution normale approximée
          let randomScore = (Math.random() + Math.random() + Math.random() + Math.random()) / 4;
          pointsObtained = Math.max(0, Math.min(exam.totalPoints, mean + (randomScore - 0.5) * 2 * std));
          pointsObtained = Math.round(pointsObtained * 4) / 4; // Arrondir au quart de point
          
          grade = pointsObtained;
          
          // Adapter l'affichage selon le système de notation
          if (exam.notationSystemId === "notation-numeric-20") {
            gradeDisplay = `${pointsObtained}/20`;
          } else if (exam.notationSystemId === "notation-competencies") {
            if (pointsObtained >= 3) gradeDisplay = "Acquis";
            else if (pointsObtained >= 2) gradeDisplay = "En cours d'acquisition";
            else gradeDisplay = "Non acquis";
          } else if (exam.notationSystemId === "notation-letter-af") {
            if (pointsObtained >= 5) gradeDisplay = "A";
            else if (pointsObtained >= 4) gradeDisplay = "B";
            else if (pointsObtained >= 3) gradeDisplay = "C";
            else if (pointsObtained >= 2) gradeDisplay = "D";
            else gradeDisplay = "F";
          } else {
            gradeDisplay = pointsObtained.toString();
          }
        }
        
        // Générer des commentaires variés
        const comments = isAbsent 
          ? "Absence non justifiée - rattrapage à prévoir"
          : generateRandomComment(pointsObtained, exam.totalPoints);
        
        const result: StudentExamResult = {
          id: `result-${exam.id}-${studentId}`,
          createdBy: exam.createdBy,
          examId: exam.id,
          studentId,
          pointsObtained,
          grade,
          gradeDisplay,
          isAbsent,
          comments,
          markedAt: new Date(exam.examDate.getTime() + 5 * 24 * 60 * 60 * 1000), // 5 jours après l'examen
          isPassing: function(system) {
            return !this.isAbsent && this.grade >= system.minValue + (system.maxValue - system.minValue) * 0.5;
          },
          gradeCategory: function(system) {
            if (this.isAbsent) return "Absent";
            const percentage = (this.grade - system.minValue) / (system.maxValue - system.minValue) * 100;
            if (percentage >= 80) return "Excellent";
            if (percentage >= 60) return "Bien";
            if (percentage >= 40) return "Satisfaisant";
            return "Insuffisant";
          },
          percentage: function(examTotalPoints) {
            if (this.isAbsent) return 0;
            return (this.pointsObtained / examTotalPoints) * 100;
          },
          updateDisplay: function(system, locale) {
            if (this.isAbsent) {
              this.gradeDisplay = "Absent";
            } else {
              this.gradeDisplay = system.formatDisplay(this.grade, locale);
            }
          },
        };
        
        additionalResults.push(result);
      }
    });
  });
  
  return additionalResults;
}

// Fonction pour générer des commentaires aléatoires
function generateRandomComment(points: number, totalPoints: number): string {
  const percentage = (points / totalPoints) * 100;
  
  const excellentComments = [
    "Travail exceptionnel, félicitations !",
    "Excellente maîtrise du sujet.",
    "Très bon niveau, continuez ainsi.",
    "Résultat remarquable, bravo !"
  ];
  
  const goodComments = [
    "Bon travail, quelques points à améliorer.",
    "Résultat satisfaisant dans l'ensemble.",
    "Bonne compréhension du sujet.",
    "Travail correctement réalisé."
  ];
  
  const averageComments = [
    "Résultat moyen, des efforts à fournir.",
    "Quelques lacunes à combler.",
    "Travail à approfondir.",
    "Bases acquises mais perfectibles."
  ];
  
  const poorComments = [
    "Travail insuffisant, révision nécessaire.",
    "Des difficultés importantes à surmonter.",
    "Niveau préoccupant, soutien recommandé.",
    "Beaucoup d'efforts à fournir."
  ];
  
  if (percentage >= 80) {
    return excellentComments[Math.floor(Math.random() * excellentComments.length)];
  } else if (percentage >= 60) {
    return goodComments[Math.floor(Math.random() * goodComments.length)];
  } else if (percentage >= 40) {
    return averageComments[Math.floor(Math.random() * averageComments.length)];
  } else {
    return poorComments[Math.floor(Math.random() * poorComments.length)];
  }
}

// Ajouter les résultats complets
MOCK_STUDENT_EXAM_RESULTS.push(...generateComprehensiveResults());

// Fonctions utilitaires pour récupérer les données
export function getExamsByTeacher(teacherId: string): Exam[] {
  return MOCK_EXAMS.filter(exam => exam.createdBy === teacherId);
}

export function getExamsByClass(classId: string): Exam[] {
  return MOCK_EXAMS.filter(exam => exam.classId === classId);
}

export function getExamsBySubject(subjectId: string): Exam[] {
  return MOCK_EXAMS.filter(exam => exam.subjectId === subjectId);
}

export function getExamsByAcademicPeriod(academicPeriodId: string): Exam[] {
  return MOCK_EXAMS.filter(exam => exam.academicPeriodId === academicPeriodId);
}

export function getStudentExamResults(studentId: string): StudentExamResult[] {
  return MOCK_STUDENT_EXAM_RESULTS.filter(result => result.studentId === studentId);
}

export function getExamResults(examId: string): StudentExamResult[] {
  return MOCK_STUDENT_EXAM_RESULTS.filter(result => result.examId === examId);
}

export function getExamById(examId: string): Exam | undefined {
  return MOCK_EXAMS.find(exam => exam.id === examId);
}

export function getStudentExamResultById(resultId: string): StudentExamResult | undefined {
  return MOCK_STUDENT_EXAM_RESULTS.find(result => result.id === resultId);
}

// Statistiques d'examens
export function calculateExamStatistics(examId: string) {
  const results = getExamResults(examId).filter(result => !result.isAbsent);
  
  if (results.length === 0) {
    return {
      totalStudents: 0,
      submittedCount: 0,
      absentCount: 0,
      averageGrade: 0,
      medianGrade: 0,
      minGrade: 0,
      maxGrade: 0,
      passRate: 0,
    };
  }

  const exam = getExamById(examId);
  const allResults = getExamResults(examId);
  const grades = results.map(r => r.grade).sort((a, b) => a - b);
  
  const average = grades.reduce((sum, grade) => sum + grade, 0) / grades.length;
  const median = grades.length % 2 === 0 
    ? (grades[grades.length / 2 - 1] + grades[grades.length / 2]) / 2
    : grades[Math.floor(grades.length / 2)];
  
  // Calcul du taux de réussite (≥ 10/20 ou équivalent)
  const passingThreshold = exam ? exam.totalPoints * 0.5 : 10;
  const passingCount = results.filter(r => r.pointsObtained >= passingThreshold).length;
  
  return {
    totalStudents: allResults.length,
    submittedCount: results.length,
    absentCount: allResults.filter(r => r.isAbsent).length,
    averageGrade: Math.round(average * 100) / 100,
    medianGrade: Math.round(median * 100) / 100,
    minGrade: Math.min(...grades),
    maxGrade: Math.max(...grades),
    passRate: Math.round((passingCount / results.length) * 100),
  };
}