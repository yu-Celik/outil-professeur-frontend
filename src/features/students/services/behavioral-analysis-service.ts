import type { StudentParticipation, CourseSession } from "@/types/uml-entities";

export interface BehavioralFeatures {
  dominantBehaviors: string[];
  behavioralEvolution: 'improving' | 'stable' | 'declining';
  attentionLevel: number;      // 0-20
  participationLevel: number;   // 0-20
  cooperationLevel: number;     // 0-20
  autonomyLevel: number;        // 0-20
  attendanceRate: number;       // 0-1
  punctualityRate: number;      // 0-1
  cameraUsageRate: number;      // 0-1
}

export interface BehavioralTrends {
  attentionTrend: {
    direction: 'up' | 'down' | 'stable';
    changePercentage: number;
    periodComparison: string;
  };
  participationTrend: {
    direction: 'up' | 'down' | 'stable';
    changePercentage: number;
    periodComparison: string;
  };
  evolutionSummary: string;
}

export interface BehavioralAlert {
  type: 'attention_decline' | 'participation_low' | 'attendance_risk' | 'behavioral_change';
  severity: 'low' | 'medium' | 'high';
  message: string;
  suggestedActions: string[];
  detectedAt: Date;
}

export interface Recommendation {
  type: 'behavioral' | 'academic' | 'pedagogical';
  category: string;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  actionItems: string[];
}

export class BehavioralAnalysisService {
  /**
   * Analyse les patterns comportementaux d'un élève à partir de ses participations
   */
  static analyzeBehavioralPatterns(participations: StudentParticipation[]): BehavioralFeatures {
    if (participations.length === 0) {
      return this.getEmptyBehavioralFeatures();
    }

    const validParticipations = participations.filter(p => p.isPresent);
    const totalSessions = participations.length;
    const presentSessions = validParticipations.length;

    // Calcul des moyennes des différents niveaux
    const avgAttention = 15; // Mock - à calculer depuis behavior
    const avgParticipation = this.calculateAverageLevel(validParticipations, 'participationLevel');
    const avgCooperation = 14; // Mock - à calculer depuis behavior
    const avgAutonomy = 16; // Mock - à calculer depuis homeworkDone

    // Calcul des taux
    const attendanceRate = totalSessions > 0 ? presentSessions / totalSessions : 0;
    const punctualityRate = 0.8; // Mock - calculer depuis markedAt vs session start
    const cameraUsageRate = this.calculateCameraUsageRate(validParticipations);

    // Analyse des comportements dominants
    const dominantBehaviors = this.identifyDominantBehaviors({
      attention: avgAttention,
      participation: avgParticipation,
      cooperation: avgCooperation,
      autonomy: avgAutonomy,
      attendance: attendanceRate
    });

    // Analyse de l'évolution comportementale
    const behavioralEvolution = this.calculateBehavioralEvolution(participations);

    return {
      dominantBehaviors,
      behavioralEvolution,
      attentionLevel: Math.round(avgAttention * 100) / 100,
      participationLevel: Math.round(avgParticipation * 100) / 100,
      cooperationLevel: Math.round(avgCooperation * 100) / 100,
      autonomyLevel: Math.round(avgAutonomy * 100) / 100,
      attendanceRate: Math.round(attendanceRate * 100) / 100,
      punctualityRate: Math.round(punctualityRate * 100) / 100,
      cameraUsageRate: Math.round(cameraUsageRate * 100) / 100,
    };
  }

  /**
   * Calcule les tendances comportementales sur une période
   */
  static calculateBehavioralTrends(participations: StudentParticipation[]): BehavioralTrends {
    if (participations.length < 4) {
      return this.getEmptyBehavioralTrends();
    }

    // Diviser les participations en deux périodes pour comparer l'évolution
    const sortedParticipations = [...participations].sort((a, b) =>
      new Date(a.markedAt).getTime() - new Date(b.markedAt).getTime()
    );

    const midPoint = Math.floor(sortedParticipations.length / 2);
    const firstPeriod = sortedParticipations.slice(0, midPoint);
    const secondPeriod = sortedParticipations.slice(midPoint);

    // Calculer les moyennes pour chaque période
    const firstPeriodAttention = 15; // Mock - pas d'attentionLevel dans UML
    const secondPeriodAttention = 14; // Mock - pas d'attentionLevel dans UML

    const firstPeriodParticipation = this.calculateAverageLevel(firstPeriod.filter(p => p.isPresent), 'participationLevel');
    const secondPeriodParticipation = this.calculateAverageLevel(secondPeriod.filter(p => p.isPresent), 'participationLevel');

    // Calculer les tendances
    const attentionTrend = this.calculateTrend(firstPeriodAttention, secondPeriodAttention, 'attention');
    const participationTrend = this.calculateTrend(firstPeriodParticipation, secondPeriodParticipation, 'participation');

    return {
      attentionTrend,
      participationTrend,
      evolutionSummary: this.generateEvolutionSummary(attentionTrend, participationTrend)
    };
  }

  /**
   * Détecte les alertes comportementales
   */
  static detectBehavioralAlerts(participations: StudentParticipation[]): BehavioralAlert[] {
    const alerts: BehavioralAlert[] = [];
    const features = this.analyzeBehavioralPatterns(participations);
    const trends = this.calculateBehavioralTrends(participations);

    // Alerte présence
    if (features.attendanceRate < 0.8) {
      alerts.push({
        type: 'attendance_risk',
        severity: features.attendanceRate < 0.6 ? 'high' : 'medium',
        message: `Taux de présence préoccupant: ${Math.round(features.attendanceRate * 100)}%`,
        suggestedActions: [
          'Contacter les parents/tuteurs',
          'Proposer un suivi individualisé',
          'Identifier les obstacles à la présence'
        ],
        detectedAt: new Date()
      });
    }

    // Alerte participation
    if (features.participationLevel < 8) {
      alerts.push({
        type: 'participation_low',
        severity: features.participationLevel < 5 ? 'high' : 'medium',
        message: `Niveau de participation faible: ${features.participationLevel}/20`,
        suggestedActions: [
          'Encourager la participation active',
          'Adapter les méthodes pédagogiques',
          'Proposer des activités en petits groupes'
        ],
        detectedAt: new Date()
      });
    }

    // Alerte déclin attention
    if (trends.attentionTrend.direction === 'down' && trends.attentionTrend.changePercentage < -20) {
      alerts.push({
        type: 'attention_decline',
        severity: 'medium',
        message: `Baisse d'attention significative: ${Math.round(Math.abs(trends.attentionTrend.changePercentage))}%`,
        suggestedActions: [
          'Varier les supports pédagogiques',
          'Introduire plus de pauses',
          'Proposer des activités interactives'
        ],
        detectedAt: new Date()
      });
    }

    return alerts;
  }

  /**
   * Génère des recommandations pédagogiques basées sur l'analyse comportementale
   */
  static generateBehavioralRecommendations(analysis: BehavioralFeatures): Recommendation[] {
    const recommendations: Recommendation[] = [];

    // Recommandations basées sur le niveau d'attention
    if (analysis.attentionLevel < 12) {
      recommendations.push({
        type: 'behavioral',
        category: 'Attention',
        title: 'Améliorer la concentration',
        description: 'L\'élève montre des signes de difficulté à maintenir son attention',
        priority: 'high',
        actionItems: [
          'Réduire la durée des activités théoriques',
          'Alterner théorie et pratique plus fréquemment',
          'Utiliser des supports visuels attractifs',
          'Permettre des pauses courtes et fréquentes'
        ]
      });
    }

    // Recommandations basées sur la participation
    if (analysis.participationLevel < 10) {
      recommendations.push({
        type: 'behavioral',
        category: 'Participation',
        title: 'Stimuler l\'engagement',
        description: 'L\'élève participe peu aux activités de classe',
        priority: 'medium',
        actionItems: [
          'Poser des questions directes mais bienveillantes',
          'Proposer des activités en binômes',
          'Valoriser chaque contribution',
          'Créer un environnement de confiance'
        ]
      });
    }

    // Recommandations basées sur la coopération
    if (analysis.cooperationLevel < 10) {
      recommendations.push({
        type: 'behavioral',
        category: 'Coopération',
        title: 'Développer l\'esprit collaboratif',
        description: 'L\'élève a des difficultés dans les activités de groupe',
        priority: 'medium',
        actionItems: [
          'Assigner des rôles clairs dans les groupes',
          'Former des groupes hétérogènes',
          'Enseigner les compétences de communication',
          'Encourager l\'entraide entre élèves'
        ]
      });
    }

    // Recommandations basées sur l'autonomie
    if (analysis.autonomyLevel < 10) {
      recommendations.push({
        type: 'behavioral',
        category: 'Autonomie',
        title: 'Renforcer l\'autonomie',
        description: 'L\'élève a besoin de développer son indépendance',
        priority: 'low',
        actionItems: [
          'Proposer des activités autocorrectives',
          'Diminuer progressivement l\'accompagnement',
          'Enseigner des stratégies d\'apprentissage',
          'Encourager la prise d\'initiatives'
        ]
      });
    }

    return recommendations;
  }

  // Méthodes utilitaires privées

  private static getEmptyBehavioralFeatures(): BehavioralFeatures {
    return {
      dominantBehaviors: [],
      behavioralEvolution: 'stable',
      attentionLevel: 0,
      participationLevel: 0,
      cooperationLevel: 0,
      autonomyLevel: 0,
      attendanceRate: 0,
      punctualityRate: 0,
      cameraUsageRate: 0,
    };
  }

  private static getEmptyBehavioralTrends(): BehavioralTrends {
    return {
      attentionTrend: {
        direction: 'stable',
        changePercentage: 0,
        periodComparison: 'Données insuffisantes'
      },
      participationTrend: {
        direction: 'stable',
        changePercentage: 0,
        periodComparison: 'Données insuffisantes'
      },
      evolutionSummary: 'Pas assez de données pour analyser l\'évolution'
    };
  }

  private static calculateAverageLevel(participations: StudentParticipation[], field: keyof StudentParticipation): number {
    if (participations.length === 0) return 0;

    const validParticipations = participations.filter(p => {
      const value = p[field];
      return typeof value === 'number' && value > 0;
    });

    if (validParticipations.length === 0) return 0;

    const sum = validParticipations.reduce((acc, p) => {
      const value = p[field] as number;
      return acc + value;
    }, 0);

    return sum / validParticipations.length;
  }

  private static calculatePunctualityRate(participations: StudentParticipation[]): number {
    if (participations.length === 0) return 0;

    // Mock calculation - in reality would compare markedAt with session start time
    return 0.8;
  }

  private static calculateCameraUsageRate(participations: StudentParticipation[]): number {
    if (participations.length === 0) return 0;

    const cameraOnCount = participations.filter(p => p.cameraEnabled).length;
    return cameraOnCount / participations.length;
  }

  private static identifyDominantBehaviors(metrics: {
    attention: number;
    participation: number;
    cooperation: number;
    autonomy: number;
    attendance: number;
  }): string[] {
    const behaviors: string[] = [];

    // Seuils pour déterminer les comportements dominants
    if (metrics.attention >= 15) behaviors.push('Très attentif');
    else if (metrics.attention <= 8) behaviors.push('Attention difficile');

    if (metrics.participation >= 15) behaviors.push('Très participatif');
    else if (metrics.participation <= 8) behaviors.push('Participation faible');

    if (metrics.cooperation >= 15) behaviors.push('Excellent esprit d\'équipe');
    else if (metrics.cooperation <= 8) behaviors.push('Difficultés relationnelles');

    if (metrics.autonomy >= 15) behaviors.push('Très autonome');
    else if (metrics.autonomy <= 8) behaviors.push('Besoin d\'accompagnement');

    if (metrics.attendance >= 0.95) behaviors.push('Très assidu');
    else if (metrics.attendance <= 0.8) behaviors.push('Absences fréquentes');

    // Comportements par défaut si aucun extrême
    if (behaviors.length === 0) {
      if (metrics.attention > metrics.participation) {
        behaviors.push('Plutôt observateur');
      } else {
        behaviors.push('Plutôt participatif');
      }
    }

    return behaviors;
  }

  private static calculateBehavioralEvolution(participations: StudentParticipation[]): 'improving' | 'stable' | 'declining' {
    if (participations.length < 4) return 'stable';

    const sortedParticipations = [...participations].sort((a, b) =>
      new Date(a.markedAt).getTime() - new Date(b.markedAt).getTime()
    );

    const midPoint = Math.floor(sortedParticipations.length / 2);
    const firstHalf = sortedParticipations.slice(0, midPoint);
    const secondHalf = sortedParticipations.slice(midPoint);

    const firstAvg = this.calculateOverallAverage(firstHalf.filter(p => p.isPresent));
    const secondAvg = this.calculateOverallAverage(secondHalf.filter(p => p.isPresent));

    const improvement = secondAvg - firstAvg;

    if (improvement > 1.5) return 'improving';
    if (improvement < -1.5) return 'declining';
    return 'stable';
  }

  private static calculateOverallAverage(participations: StudentParticipation[]): number {
    if (participations.length === 0) return 0;

    const fields: (keyof StudentParticipation)[] = ['participationLevel'];
    let totalSum = 0;
    let totalCount = 0;

    fields.forEach(field => {
      participations.forEach(p => {
        const value = p[field];
        if (typeof value === 'number' && value > 0) {
          totalSum += value;
          totalCount++;
        }
      });
    });

    return totalCount > 0 ? totalSum / totalCount : 0;
  }

  private static calculateTrend(firstPeriod: number, secondPeriod: number, type: string): {
    direction: 'up' | 'down' | 'stable';
    changePercentage: number;
    periodComparison: string;
  } {
    const change = secondPeriod - firstPeriod;
    const changePercentage = firstPeriod > 0 ? (change / firstPeriod) * 100 : 0;

    let direction: 'up' | 'down' | 'stable';
    if (Math.abs(changePercentage) < 10) {
      direction = 'stable';
    } else {
      direction = changePercentage > 0 ? 'up' : 'down';
    }

    return {
      direction,
      changePercentage: Math.round(changePercentage * 100) / 100,
      periodComparison: `${type} ${direction === 'up' ? 'en amélioration' : direction === 'down' ? 'en baisse' : 'stable'}`
    };
  }

  private static generateEvolutionSummary(
    attentionTrend: { direction: string; changePercentage: number },
    participationTrend: { direction: string; changePercentage: number }
  ): string {
    const trends = [];

    if (attentionTrend.direction !== 'stable') {
      trends.push(`attention ${attentionTrend.direction === 'up' ? 'en amélioration' : 'en baisse'}`);
    }

    if (participationTrend.direction !== 'stable') {
      trends.push(`participation ${participationTrend.direction === 'up' ? 'en amélioration' : 'en baisse'}`);
    }

    if (trends.length === 0) {
      return 'Comportement stable sur la période observée';
    }

    return `Évolution observée: ${trends.join(' et ')}`;
  }
}