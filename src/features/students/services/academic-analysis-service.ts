import type { StudentExamResult, Exam, NotationSystem } from "@/types/uml-entities";
import type { Recommendation } from "./behavioral-analysis-service";

export interface SubjectPerformances {
  subjectAnalyses: Record<string, SubjectAnalysis>;
  overallAverage: number;
  strongestSubjects: string[];
  weakestSubjects: string[];
  consistencyScore: number; // 0-1, mesure la régularité des performances
}

export interface SubjectAnalysis {
  subjectId: string;
  subjectName: string;
  average: number;
  examCount: number;
  trend: 'improving' | 'stable' | 'declining';
  consistency: number; // 0-1, écart-type normalisé
  lastExamGrade: number;
  progressFromFirst: number; // Différence entre premier et dernier examen
}

export interface AcademicProgress {
  overallTrend: 'improving' | 'stable' | 'declining';
  progressRate: number; // -1 à 1, taux de progression global
  periodComparison: {
    currentPeriodAverage: number;
    previousPeriodAverage: number;
    improvement: number;
  };
  milestones: AcademicMilestone[];
}

export interface AcademicMilestone {
  date: Date;
  type: 'improvement' | 'decline' | 'achievement' | 'challenge';
  description: string;
  impact: 'low' | 'medium' | 'high';
}

export interface AcademicRisk {
  type: 'grade_decline' | 'subject_difficulty' | 'consistency_issue' | 'achievement_gap';
  severity: 'low' | 'medium' | 'high';
  affectedSubjects: string[];
  description: string;
  suggestedActions: string[];
  identifiedAt: Date;
}

export class AcademicAnalysisService {
  /**
   * Analyse les performances par matière
   */
  static analyzeSubjectPerformances(
    examResults: StudentExamResult[],
    exams: Exam[],
    subjects: Array<{ id: string; name: string }>
  ): SubjectPerformances {
    if (examResults.length === 0) {
      return this.getEmptySubjectPerformances();
    }

    // Grouper les résultats par matière
    const resultsBySubject = this.groupResultsBySubject(examResults, exams);
    const subjectAnalyses: Record<string, SubjectAnalysis> = {};

    let totalGrades = 0;
    let totalCount = 0;
    const subjectAverages: number[] = [];

    // Analyser chaque matière
    Object.entries(resultsBySubject).forEach(([subjectId, results]) => {
      const subject = subjects.find(s => s.id === subjectId);
      const analysis = this.analyzeSubjectResults(subjectId, subject?.name || 'Matière', results);

      subjectAnalyses[subjectId] = analysis;
      subjectAverages.push(analysis.average);
      totalGrades += analysis.average * analysis.examCount;
      totalCount += analysis.examCount;
    });

    // Calculs globaux
    const overallAverage = totalCount > 0 ? totalGrades / totalCount : 0;
    const consistencyScore = this.calculateConsistencyScore(subjectAverages);

    // Identifier les matières les plus fortes et les plus faibles
    const sortedSubjects = Object.entries(subjectAnalyses)
      .sort((a, b) => b[1].average - a[1].average);

    const strongestSubjects = sortedSubjects
      .slice(0, Math.min(3, sortedSubjects.length))
      .filter(([, analysis]) => analysis.average >= 12)
      .map(([subjectId, analysis]) => analysis.subjectName);

    const weakestSubjects = sortedSubjects
      .slice(-Math.min(3, sortedSubjects.length))
      .filter(([, analysis]) => analysis.average < 10)
      .map(([subjectId, analysis]) => analysis.subjectName);

    return {
      subjectAnalyses,
      overallAverage: Math.round(overallAverage * 100) / 100,
      strongestSubjects,
      weakestSubjects,
      consistencyScore: Math.round(consistencyScore * 100) / 100
    };
  }

  /**
   * Calcule la progression académique
   */
  static calculateAcademicProgress(examResults: StudentExamResult[]): AcademicProgress {
    if (examResults.length < 2) {
      return this.getEmptyAcademicProgress();
    }

    // Trier les résultats par date
    const sortedResults = [...examResults]
      .filter(result => !result.isAbsent)
      .sort((a, b) => new Date(a.markedAt).getTime() - new Date(b.markedAt).getTime());

    if (sortedResults.length < 2) {
      return this.getEmptyAcademicProgress();
    }

    // Calculer la tendance générale
    const overallTrend = this.calculateOverallTrend(sortedResults);
    const progressRate = this.calculateProgressRate(sortedResults);

    // Diviser en périodes pour comparaison
    const midPoint = Math.floor(sortedResults.length / 2);
    const firstPeriod = sortedResults.slice(0, midPoint);
    const secondPeriod = sortedResults.slice(midPoint);

    const currentPeriodAverage = this.calculateAverageGrade(secondPeriod);
    const previousPeriodAverage = this.calculateAverageGrade(firstPeriod);
    const improvement = currentPeriodAverage - previousPeriodAverage;

    // Identifier les jalons importants
    const milestones = this.identifyAcademicMilestones(sortedResults);

    return {
      overallTrend,
      progressRate: Math.round(progressRate * 100) / 100,
      periodComparison: {
        currentPeriodAverage: Math.round(currentPeriodAverage * 100) / 100,
        previousPeriodAverage: Math.round(previousPeriodAverage * 100) / 100,
        improvement: Math.round(improvement * 100) / 100
      },
      milestones
    };
  }

  /**
   * Détecte les risques académiques
   */
  static detectAcademicRisks(
    examResults: StudentExamResult[],
    exams: Exam[],
    subjects: Array<{ id: string; name: string }>
  ): AcademicRisk[] {
    const risks: AcademicRisk[] = [];
    const performances = this.analyzeSubjectPerformances(examResults, exams, subjects);
    const progress = this.calculateAcademicProgress(examResults);

    // Risque de baisse générale des notes
    if (progress.overallTrend === 'declining' && progress.progressRate < -0.3) {
      risks.push({
        type: 'grade_decline',
        severity: progress.progressRate < -0.5 ? 'high' : 'medium',
        affectedSubjects: Object.values(performances.subjectAnalyses)
          .filter(analysis => analysis.trend === 'declining')
          .map(analysis => analysis.subjectName),
        description: `Baisse générale des performances: ${Math.round(Math.abs(progress.progressRate) * 100)}% de régression`,
        suggestedActions: [
          'Identifier les causes de cette baisse',
          'Proposer un soutien pédagogique ciblé',
          'Revoir les méthodes d\'apprentissage',
          'Planifier des séances de remédiation'
        ],
        identifiedAt: new Date()
      });
    }

    // Risques par matière
    Object.values(performances.subjectAnalyses).forEach(analysis => {
      if (analysis.average < 8) {
        risks.push({
          type: 'subject_difficulty',
          severity: analysis.average < 5 ? 'high' : 'medium',
          affectedSubjects: [analysis.subjectName],
          description: `Difficultés importantes en ${analysis.subjectName}: moyenne de ${analysis.average}/20`,
          suggestedActions: [
            `Soutien spécialisé en ${analysis.subjectName}`,
            'Adapter les méthodes pédagogiques',
            'Proposer des exercices de remédiation',
            'Envisager un tutorat par les pairs'
          ],
          identifiedAt: new Date()
        });
      }
    });

    // Risque de manque de régularité
    if (performances.consistencyScore < 0.6) {
      risks.push({
        type: 'consistency_issue',
        severity: performances.consistencyScore < 0.4 ? 'high' : 'medium',
        affectedSubjects: Object.values(performances.subjectAnalyses)
          .filter(analysis => analysis.consistency < 0.6)
          .map(analysis => analysis.subjectName),
        description: 'Performances irrégulières entre les matières ou dans le temps',
        suggestedActions: [
          'Identifier les facteurs de variabilité',
          'Stabiliser les méthodes de travail',
          'Proposer un suivi plus régulier',
          'Travailler sur la gestion du stress'
        ],
        identifiedAt: new Date()
      });
    }

    return risks;
  }

  /**
   * Génère des recommandations académiques
   */
  static generateAcademicRecommendations(analysis: SubjectPerformances): Recommendation[] {
    const recommendations: Recommendation[] = [];

    // Recommandations pour les matières faibles
    analysis.weakestSubjects.forEach(subjectName => {
      recommendations.push({
        type: 'academic',
        category: `Soutien ${subjectName}`,
        title: `Renforcer les acquis en ${subjectName}`,
        description: `L'élève rencontre des difficultés dans cette matière`,
        priority: 'high',
        actionItems: [
          'Identifier les concepts non maîtrisés',
          'Proposer des exercices de rattrapage ciblés',
          'Adapter le rythme d\'apprentissage',
          'Encourager les questions et demandes d\'aide'
        ]
      });
    });

    // Recommandations pour valoriser les points forts
    if (analysis.strongestSubjects.length > 0) {
      recommendations.push({
        type: 'academic',
        category: 'Valorisation',
        title: 'Capitaliser sur les points forts',
        description: `L'élève excelle en ${analysis.strongestSubjects.join(', ')}`,
        priority: 'medium',
        actionItems: [
          'Proposer des défis supplémentaires',
          'Encourager le tutorat par les pairs',
          'Développer des projets transversaux',
          'Valoriser ces compétences auprès de la classe'
        ]
      });
    }

    // Recommandations pour la régularité
    if (analysis.consistencyScore < 0.7) {
      recommendations.push({
        type: 'academic',
        category: 'Régularité',
        title: 'Stabiliser les performances',
        description: 'Les résultats manquent de régularité',
        priority: 'medium',
        actionItems: [
          'Établir une routine de travail',
          'Travailler sur la gestion du stress',
          'Proposer des méthodes d\'organisation',
          'Assurer un suivi plus fréquent'
        ]
      });
    }

    // Recommandation globale si moyenne insuffisante
    if (analysis.overallAverage < 10) {
      recommendations.push({
        type: 'academic',
        category: 'Soutien général',
        title: 'Accompagnement pédagogique renforcé',
        description: 'Les résultats globaux nécessitent un accompagnement spécialisé',
        priority: 'high',
        actionItems: [
          'Mettre en place un plan de soutien personnalisé',
          'Organiser des séances de remédiation',
          'Impliquer les parents dans le suivi',
          'Coordonner l\'équipe pédagogique'
        ]
      });
    }

    return recommendations;
  }

  // Méthodes utilitaires privées

  private static getEmptySubjectPerformances(): SubjectPerformances {
    return {
      subjectAnalyses: {},
      overallAverage: 0,
      strongestSubjects: [],
      weakestSubjects: [],
      consistencyScore: 0
    };
  }

  private static getEmptyAcademicProgress(): AcademicProgress {
    return {
      overallTrend: 'stable',
      progressRate: 0,
      periodComparison: {
        currentPeriodAverage: 0,
        previousPeriodAverage: 0,
        improvement: 0
      },
      milestones: []
    };
  }

  private static groupResultsBySubject(
    examResults: StudentExamResult[],
    exams: Exam[]
  ): Record<string, StudentExamResult[]> {
    const grouped: Record<string, StudentExamResult[]> = {};

    examResults.forEach(result => {
      if (result.isAbsent) return;

      const exam = exams.find(e => e.id === result.examId);
      if (!exam) return;

      if (!grouped[exam.subjectId]) {
        grouped[exam.subjectId] = [];
      }
      grouped[exam.subjectId].push(result);
    });

    return grouped;
  }

  private static analyzeSubjectResults(
    subjectId: string,
    subjectName: string,
    results: StudentExamResult[]
  ): SubjectAnalysis {
    if (results.length === 0) {
      return {
        subjectId,
        subjectName,
        average: 0,
        examCount: 0,
        trend: 'stable',
        consistency: 0,
        lastExamGrade: 0,
        progressFromFirst: 0
      };
    }

    // Trier par date
    const sortedResults = [...results].sort((a, b) =>
      new Date(a.markedAt).getTime() - new Date(b.markedAt).getTime()
    );

    // Calculs de base
    const grades = sortedResults.map(r => r.grade);
    const average = grades.reduce((sum, grade) => sum + grade, 0) / grades.length;
    const lastExamGrade = grades[grades.length - 1];
    const firstExamGrade = grades[0];
    const progressFromFirst = lastExamGrade - firstExamGrade;

    // Calcul de la tendance
    const trend = this.calculateSubjectTrend(grades);

    // Calcul de la régularité (inverse de l'écart-type normalisé)
    const consistency = this.calculateSubjectConsistency(grades);

    return {
      subjectId,
      subjectName,
      average: Math.round(average * 100) / 100,
      examCount: results.length,
      trend,
      consistency: Math.round(consistency * 100) / 100,
      lastExamGrade,
      progressFromFirst: Math.round(progressFromFirst * 100) / 100
    };
  }

  private static calculateSubjectTrend(grades: number[]): 'improving' | 'stable' | 'declining' {
    if (grades.length < 3) return 'stable';

    // Utiliser la régression linéaire simple pour déterminer la tendance
    const n = grades.length;
    const x = grades.map((_, i) => i + 1);
    const y = grades;

    const sumX = x.reduce((a, b) => a + b, 0);
    const sumY = y.reduce((a, b) => a + b, 0);
    const sumXY = x.reduce((acc, xi, i) => acc + xi * y[i], 0);
    const sumXX = x.reduce((acc, xi) => acc + xi * xi, 0);

    const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);

    if (slope > 0.5) return 'improving';
    if (slope < -0.5) return 'declining';
    return 'stable';
  }

  private static calculateSubjectConsistency(grades: number[]): number {
    if (grades.length <= 1) return 1;

    const mean = grades.reduce((sum, grade) => sum + grade, 0) / grades.length;
    const variance = grades.reduce((sum, grade) => sum + Math.pow(grade - mean, 2), 0) / grades.length;
    const standardDeviation = Math.sqrt(variance);

    // Normaliser par la moyenne (coefficient de variation inversé)
    const coefficientOfVariation = mean > 0 ? standardDeviation / mean : 0;
    return Math.max(0, 1 - coefficientOfVariation);
  }

  private static calculateConsistencyScore(subjectAverages: number[]): number {
    if (subjectAverages.length <= 1) return 1;

    const mean = subjectAverages.reduce((sum, avg) => sum + avg, 0) / subjectAverages.length;
    const variance = subjectAverages.reduce((sum, avg) => sum + Math.pow(avg - mean, 2), 0) / subjectAverages.length;
    const standardDeviation = Math.sqrt(variance);

    // Score de consistance basé sur l'écart-type (plus c'est bas, plus c'est consistant)
    const maxExpectedDeviation = 5; // Écart-type maximum attendu pour des notes
    return Math.max(0, 1 - (standardDeviation / maxExpectedDeviation));
  }

  private static calculateOverallTrend(results: StudentExamResult[]): 'improving' | 'stable' | 'declining' {
    if (results.length < 3) return 'stable';

    const grades = results.map(r => r.grade);

    // Comparer les moyennes des première et dernière parties
    const midPoint = Math.floor(results.length / 2);
    const firstHalf = grades.slice(0, midPoint);
    const secondHalf = grades.slice(midPoint);

    const firstAvg = firstHalf.reduce((sum, grade) => sum + grade, 0) / firstHalf.length;
    const secondAvg = secondHalf.reduce((sum, grade) => sum + grade, 0) / secondHalf.length;

    const improvement = secondAvg - firstAvg;

    if (improvement > 1) return 'improving';
    if (improvement < -1) return 'declining';
    return 'stable';
  }

  private static calculateProgressRate(results: StudentExamResult[]): number {
    if (results.length < 2) return 0;

    const firstGrade = results[0].grade;
    const lastGrade = results[results.length - 1].grade;

    if (firstGrade === 0) return 0;

    return (lastGrade - firstGrade) / firstGrade;
  }

  private static calculateAverageGrade(results: StudentExamResult[]): number {
    if (results.length === 0) return 0;

    const sum = results.reduce((acc, result) => acc + result.grade, 0);
    return sum / results.length;
  }

  private static identifyAcademicMilestones(results: StudentExamResult[]): AcademicMilestone[] {
    const milestones: AcademicMilestone[] = [];

    if (results.length < 3) return milestones;

    // Identifier les pics et creux de performance
    for (let i = 1; i < results.length - 1; i++) {
      const prev = results[i - 1].grade;
      const current = results[i].grade;
      const next = results[i + 1].grade;

      // Pic de performance
      if (current > prev && current > next && current >= 15) {
        milestones.push({
          date: new Date(results[i].markedAt),
          type: 'achievement',
          description: `Excellente performance: ${current}/20`,
          impact: 'medium'
        });
      }

      // Chute de performance
      if (current < prev && current < next && current <= 8) {
        milestones.push({
          date: new Date(results[i].markedAt),
          type: 'challenge',
          description: `Difficulté rencontrée: ${current}/20`,
          impact: 'medium'
        });
      }

      // Amélioration significative
      if (current - prev >= 4) {
        milestones.push({
          date: new Date(results[i].markedAt),
          type: 'improvement',
          description: `Nette amélioration: +${Math.round((current - prev) * 100) / 100} points`,
          impact: 'high'
        });
      }

      // Baisse significative
      if (prev - current >= 4) {
        milestones.push({
          date: new Date(results[i].markedAt),
          type: 'decline',
          description: `Baisse préoccupante: -${Math.round((prev - current) * 100) / 100} points`,
          impact: 'high'
        });
      }
    }

    return milestones.slice(-5); // Garder seulement les 5 derniers jalons
  }
}