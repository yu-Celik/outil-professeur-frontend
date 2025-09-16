import type { StudentProfile, StudentParticipation, StudentExamResult } from "@/types/uml-entities";
import type { StudentProfileFeatures, StudentProfileEvidenceRefs } from "../services/student-profile-service";

// Mock de participations enrichies pour les analyses comportementales
export const MOCK_STUDENT_PARTICIPATIONS: StudentParticipation[] = [
  // Participations pour Antoine Girard (student-2nde-zircon-1)
  {
    id: "participation-zircon-001",
    createdBy: "teacher-1",
    studentId: "student-2nde-zircon-1",
    courseSessionId: "session-001",
    isPresent: true,
    behavior: "Très engagé en classe",
    participationLevel: 16,
    homeworkDone: true,
    specificRemarks: "Excellente analyse du texte",
    technicalIssues: "",
    cameraEnabled: true,
    markedAt: new Date("2024-11-15T10:00:00Z"),
    markAttendance: (isPresent: boolean) => console.log("Marked attendance:", isPresent),
    setParticipationLevel: (level: number) => console.log("Set participation level:", level),
    addRemarks: (remarks: string) => console.log("Added remarks:", remarks),
    updateBehavior: (behavior: string) => console.log("Updated behavior:", behavior),
  },
  {
    id: "participation-zircon-002",
    createdBy: "teacher-1",
    studentId: "student-2nde-zircon-1",
    courseSessionId: "session-002",
    isPresent: true,
    behavior: "Participatif et attentif",
    participationLevel: 14,
    homeworkDone: true,
    specificRemarks: "Bonnes questions sur le cours",
    technicalIssues: "",
    cameraEnabled: true,
    markedAt: new Date("2024-11-18T10:00:00Z"),
    markAttendance: (isPresent: boolean) => console.log("Marked attendance:", isPresent),
    setParticipationLevel: (level: number) => console.log("Set participation level:", level),
    addRemarks: (remarks: string) => console.log("Added remarks:", remarks),
    updateBehavior: (behavior: string) => console.log("Updated behavior:", behavior),
  },
  {
    id: "participation-zircon-003",
    createdBy: "teacher-1",
    studentId: "student-2nde-zircon-1",
    courseSessionId: "session-003",
    isPresent: false,
    behavior: "Absent justifié",
    participationLevel: 0,
    homeworkDone: false,
    specificRemarks: "Certificat médical fourni",
    technicalIssues: "",
    cameraEnabled: false,
    markedAt: new Date("2024-11-22T10:00:00Z"),
    markAttendance: (isPresent: boolean) => console.log("Marked attendance:", isPresent),
    setParticipationLevel: (level: number) => console.log("Set participation level:", level),
    addRemarks: (remarks: string) => console.log("Added remarks:", remarks),
    updateBehavior: (behavior: string) => console.log("Updated behavior:", behavior),
  },
  {
    id: "participation-zircon-004",
    createdBy: "teacher-1",
    studentId: "student-2nde-zircon-1",
    courseSessionId: "session-004",
    isPresent: true,
    behavior: "Très bonne participation orale",
    participationLevel: 18,
    homeworkDone: true,
    specificRemarks: "Présentation remarquable",
    technicalIssues: "",
    cameraEnabled: true,
    markedAt: new Date("2024-11-25T10:00:00Z"),
    markAttendance: (isPresent: boolean) => console.log("Marked attendance:", isPresent),
    setParticipationLevel: (level: number) => console.log("Set participation level:", level),
    addRemarks: (remarks: string) => console.log("Added remarks:", remarks),
    updateBehavior: (behavior: string) => console.log("Updated behavior:", behavior),
  },
  {
    id: "participation-zircon-005",
    createdBy: "teacher-1",
    studentId: "student-2nde-zircon-1",
    courseSessionId: "session-005",
    isPresent: true,
    behavior: "Concentré et méticuleux",
    participationLevel: 15,
    homeworkDone: true,
    specificRemarks: "Aide volontiers ses camarades",
    technicalIssues: "",
    cameraEnabled: true,
    markedAt: new Date("2024-11-29T10:00:00Z"),
    markAttendance: (isPresent: boolean) => console.log("Marked attendance:", isPresent),
    setParticipationLevel: (level: number) => console.log("Set participation level:", level),
    addRemarks: (remarks: string) => console.log("Added remarks:", remarks),
    updateBehavior: (behavior: string) => console.log("Updated behavior:", behavior),
  },
  {
    id: "participation-zircon-006",
    createdBy: "teacher-1",
    studentId: "student-2nde-zircon-1",
    courseSessionId: "session-006",
    isPresent: true,
    behavior: "Légèrement distrait",
    participationLevel: 12,
    homeworkDone: false,
    specificRemarks: "Semble fatigué, devoir non rendu",
    technicalIssues: "",
    cameraEnabled: true,
    markedAt: new Date("2024-12-02T10:00:00Z"),
    markAttendance: (isPresent: boolean) => console.log("Marked attendance:", isPresent),
    setParticipationLevel: (level: number) => console.log("Set participation level:", level),
    addRemarks: (remarks: string) => console.log("Added remarks:", remarks),
    updateBehavior: (behavior: string) => console.log("Updated behavior:", behavior),
  }
];

// Mock de profils étudiants enrichis
export const MOCK_STUDENT_PROFILES: StudentProfile[] = [
  {
    id: "profile-001",
    createdBy: "teacher-1",
    studentId: "student-001",
    academicPeriodId: "period-1",
    features: {
      behavioral: {
        dominantBehaviors: ["Très participatif", "Excellent esprit d'équipe", "Très autonome"],
        behavioralEvolution: "improving" as const,
        attentionLevel: 16.0,
        participationLevel: 15.8,
        cooperationLevel: 16.0,
        autonomyLevel: 17.0,
        attendanceRate: 0.83,
        punctualityRate: 0.80,
        cameraUsageRate: 0.83,
      },
      academic: {
        subjectAnalyses: {
          "math-001": {
            subjectId: "math-001",
            subjectName: "Mathématiques",
            average: 16.5,
            examCount: 3,
            trend: "improving" as const,
            consistency: 0.85,
            lastExamGrade: 18.0,
            progressFromFirst: 3.5,
          },
          "french-001": {
            subjectId: "french-001",
            subjectName: "Français",
            average: 13.2,
            examCount: 2,
            trend: "stable" as const,
            consistency: 0.75,
            lastExamGrade: 13.5,
            progressFromFirst: 0.5,
          },
        },
        overallAverage: 14.85,
        strongestSubjects: ["Mathématiques"],
        weakestSubjects: [],
        consistencyScore: 0.80,
      },
      engagement: {
        attendanceRate: 0.83,
        homeworkCompletionRate: 0.90,
        punctualityRate: 0.80,
        cameraUsageRate: 0.83,
      },
      alerts: {
        behavioralAlerts: [],
        academicRisks: [],
        recommendations: [
          {
            type: "behavioral",
            category: "Ponctualité",
            title: "Améliorer la ponctualité",
            description: "L'élève arrive parfois en retard aux sessions",
            priority: "medium",
            actionItems: [
              "Rappeler l'importance de la ponctualité",
              "Vérifier s'il y a des obstacles logistiques",
              "Mettre en place des rappels automatiques",
            ],
          },
        ],
      },
      trends: {
        behavioral: {
          attentionTrend: {
            direction: "up",
            changePercentage: 12.5,
            periodComparison: "attention en amélioration",
          },
          participationTrend: {
            direction: "stable",
            changePercentage: 2.1,
            periodComparison: "participation stable",
          },
          evolutionSummary: "Évolution observée: attention en amélioration",
        },
        academic: {
          overallTrend: "improving" as const,
          progressRate: 0.25,
          periodComparison: {
            currentPeriodAverage: 15.2,
            previousPeriodAverage: 13.8,
            improvement: 1.4,
          },
          milestones: [
            {
              date: new Date("2025-01-25T00:00:00Z"),
              type: "improvement",
              description: "Nette amélioration: +3.5 points",
              impact: "high",
            },
          ],
        },
      },
      analysisMetadata: {
        generatedAt: new Date("2025-02-05T00:00:00Z"),
        dataPointsCount: {
          participations: 6,
          examResults: 5,
          sessionsAnalyzed: 6,
        },
        confidence: 0.85,
      },
    } as unknown as Record<string, unknown>,
    evidenceRefs: {
      participations: [
        "participation-001",
        "participation-002",
        "participation-003",
        "participation-004",
        "participation-005",
        "participation-006",
      ],
      examResults: ["exam-result-001", "exam-result-002", "exam-result-003", "exam-result-004", "exam-result-005"],
      sessions: ["session-001", "session-002", "session-003", "session-004", "session-005", "session-006"],
      subjects: ["math-001", "french-001"],
      analysisMetadata: {
        analysisDate: new Date("2025-02-05T00:00:00Z"),
        analysisVersion: "1.0.0",
        participationCount: 6,
        examCount: 5,
        analysisScope: "period",
      },
      relatedProfiles: [],
      comparisonBaseline: null,
    } as unknown as Record<string, unknown>,
    status: "validated",
    generatedAt: new Date("2025-02-05T00:00:00Z"),
    updatedAt: new Date("2025-02-05T00:00:00Z"),
    review: (notes: string) => console.log("Profile reviewed with notes:", notes),
  },
  {
    id: "profile-002",
    createdBy: "teacher-1",
    studentId: "student-002",
    academicPeriodId: "period-1",
    features: {
      behavioral: {
        dominantBehaviors: ["Attention difficile", "Participation faible", "Absences fréquentes"],
        behavioralEvolution: "declining",
        attentionLevel: 8.5,
        participationLevel: 7.2,
        cooperationLevel: 9.0,
        autonomyLevel: 6.8,
        attendanceRate: 0.65,
        punctualityRate: 0.70,
        cameraUsageRate: 0.45,
      },
      academic: {
        subjectAnalyses: {
          "math-001": {
            subjectId: "math-001",
            subjectName: "Mathématiques",
            average: 8.2,
            examCount: 3,
            trend: "declining" as const,
            consistency: 0.60,
            lastExamGrade: 6.5,
            progressFromFirst: -2.5,
          },
          "french-001": {
            subjectId: "french-001",
            subjectName: "Français",
            average: 9.8,
            examCount: 2,
            trend: "stable" as const,
            consistency: 0.80,
            lastExamGrade: 10.0,
            progressFromFirst: 0.2,
          },
        },
        overallAverage: 9.0,
        strongestSubjects: [],
        weakestSubjects: ["Mathématiques"],
        consistencyScore: 0.70,
      },
      engagement: {
        attendanceRate: 0.65,
        homeworkCompletionRate: 0.55,
        punctualityRate: 0.70,
        cameraUsageRate: 0.45,
      },
      alerts: {
        behavioralAlerts: [
          {
            type: "attendance_risk",
            severity: "high",
            message: "Taux de présence préoccupant: 65%",
            suggestedActions: [
              "Contacter les parents/tuteurs",
              "Proposer un suivi individualisé",
              "Identifier les obstacles à la présence",
            ],
            detectedAt: new Date("2025-02-05T00:00:00Z"),
          },
          {
            type: "participation_low",
            severity: "high",
            message: "Niveau de participation faible: 7.2/20",
            suggestedActions: [
              "Encourager la participation active",
              "Adapter les méthodes pédagogiques",
              "Proposer des activités en petits groupes",
            ],
            detectedAt: new Date("2025-02-05T00:00:00Z"),
          },
        ],
        academicRisks: [
          {
            type: "subject_difficulty",
            severity: "high",
            affectedSubjects: ["Mathématiques"],
            description: "Difficultés importantes en Mathématiques: moyenne de 8.2/20",
            suggestedActions: [
              "Soutien spécialisé en Mathématiques",
              "Adapter les méthodes pédagogiques",
              "Proposer des exercices de remédiation",
              "Envisager un tutorat par les pairs",
            ],
            identifiedAt: new Date("2025-02-05T00:00:00Z"),
          },
        ],
        recommendations: [
          {
            type: "behavioral",
            category: "Engagement",
            title: "Plan de soutien urgentent",
            description: "L'élève nécessite un accompagnement renforcé immédiat",
            priority: "high",
            actionItems: [
              "Organiser un entretien avec l'élève et les parents",
              "Mettre en place un suivi hebdomadaire personnalisé",
              "Identifier les causes du désengagement",
              "Proposer des objectifs courts et réalisables",
            ],
          },
        ],
      },
      trends: {
        behavioral: {
          attentionTrend: {
            direction: "down",
            changePercentage: -25.3,
            periodComparison: "attention en baisse",
          },
          participationTrend: {
            direction: "down",
            changePercentage: -18.7,
            periodComparison: "participation en baisse",
          },
          evolutionSummary: "Évolution observée: attention en baisse et participation en baisse",
        },
        academic: {
          overallTrend: "declining" as const,
          progressRate: -0.35,
          periodComparison: {
            currentPeriodAverage: 8.5,
            previousPeriodAverage: 11.2,
            improvement: -2.7,
          },
          milestones: [
            {
              date: new Date("2025-01-28T00:00:00Z"),
              type: "decline",
              description: "Baisse préoccupante: -2.5 points",
              impact: "high",
            },
          ],
        },
      },
      analysisMetadata: {
        generatedAt: new Date("2025-02-05T00:00:00Z"),
        dataPointsCount: {
          participations: 8,
          examResults: 5,
          sessionsAnalyzed: 8,
        },
        confidence: 0.90,
      },
    } as unknown as Record<string, unknown>,
    evidenceRefs: {
      participations: [
        "participation-007",
        "participation-008",
        "participation-009",
        "participation-010",
        "participation-011",
        "participation-012",
        "participation-013",
        "participation-014",
      ],
      examResults: ["exam-result-006", "exam-result-007", "exam-result-008", "exam-result-009", "exam-result-010"],
      sessions: ["session-007", "session-008", "session-009", "session-010", "session-011", "session-012", "session-013", "session-014"],
      subjects: ["math-001", "french-001"],
      analysisMetadata: {
        analysisDate: new Date("2025-02-05T00:00:00Z"),
        analysisVersion: "1.0.0",
        participationCount: 8,
        examCount: 5,
        analysisScope: "period",
      },
      relatedProfiles: [],
      comparisonBaseline: null,
    } as unknown as Record<string, unknown>,
    status: "generated",
    generatedAt: new Date("2025-02-05T00:00:00Z"),
    updatedAt: new Date("2025-02-05T00:00:00Z"),
    review: (notes: string) => console.log("Profile reviewed with notes:", notes),
  },
];

// Fonctions utilitaires pour accéder aux données mockées
export function getStudentProfileById(profileId: string): StudentProfile | undefined {
  return MOCK_STUDENT_PROFILES.find((profile) => profile.id === profileId);
}

export function getStudentProfilesByStudentId(studentId: string): StudentProfile[] {
  return MOCK_STUDENT_PROFILES.filter((profile) => profile.studentId === studentId);
}

export function getStudentProfilesByPeriod(academicPeriodId: string): StudentProfile[] {
  return MOCK_STUDENT_PROFILES.filter((profile) => profile.academicPeriodId === academicPeriodId);
}

export function getStudentProfilesByStatus(status: string): StudentProfile[] {
  return MOCK_STUDENT_PROFILES.filter((profile) => profile.status === status);
}

export function getStudentParticipationsByStudentId(studentId: string): StudentParticipation[] {
  return MOCK_STUDENT_PARTICIPATIONS.filter((participation) => participation.studentId === studentId);
}

