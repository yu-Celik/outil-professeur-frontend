import type {
  AppreciationContent,
  StyleGuide,
  PhraseBank,
  Student,
  Subject
} from "@/types/uml-entities";

// Types pour la génération d'appréciations
export interface StudentData {
  student: Student;
  participationLevel: number;
  averageGrade: number;
  attendanceRate: number;
  strengths: string[];
  improvementAreas: string[];
  behaviorNotes: string[];
  specificObservations?: string[];
}

export interface GenerationContext {
  styleGuide: StyleGuide;
  phraseBank: PhraseBank;
  subject?: Subject;
  academicPeriod?: {
    name: string;
    startDate: Date;
    endDate: Date;
  };
  customInstructions?: string;
}

export interface GenerationParameters {
  includeStrengths: boolean;
  includeImprovements: boolean;
  includeEncouragement: boolean;
  focusAreas: string[];
  customTone?: string;
  targetLength?: number;
  emphasizeProgress?: boolean;
  includeSpecificExamples?: boolean;
}

export interface GenerationResult {
  content: string;
  metadata: {
    wordsCount: number;
    sentencesCount: number;
    tone: string;
    focusAreas: string[];
    phrasesUsed: string[];
    generationTime: number;
  };
  suggestions: string[];
  alternatives: string[];
}

/**
 * Service de génération d'appréciations IA
 * Simule un système de génération intelligent basé sur les données de l'élève
 * et les paramètres de style définis par l'enseignant.
 */
export class AppreciationGeneratorService {

  /**
   * Génère une appréciation complète basée sur les données de l'élève
   */
  static async generateAppreciation(
    studentData: StudentData,
    context: GenerationContext,
    parameters: GenerationParameters
  ): Promise<GenerationResult> {
    const startTime = performance.now();

    try {
      // Analyser les données de l'élève
      const analysis = this.analyzeStudentData(studentData);

      // Sélectionner les phrases appropriées
      const selectedPhrases = this.selectPhrases(
        context.phraseBank,
        analysis,
        parameters
      );

      // Générer le contenu selon le style guide
      const content = this.generateContent(
        studentData,
        context,
        parameters,
        selectedPhrases,
        analysis
      );

      // Calculer les métadonnées
      const metadata = this.calculateMetadata(
        content,
        context.styleGuide,
        selectedPhrases,
        performance.now() - startTime
      );

      // Générer des suggestions et alternatives
      const suggestions = this.generateSuggestions(analysis, parameters);
      const alternatives = this.generateAlternatives(content, context.styleGuide);

      return {
        content,
        metadata,
        suggestions,
        alternatives
      };
    } catch (error) {
      throw new Error(`Erreur lors de la génération: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
    }
  }

  /**
   * Génération en lot pour plusieurs élèves
   */
  static async generateBulkAppreciations(
    studentsData: StudentData[],
    context: GenerationContext,
    parameters: GenerationParameters,
    progressCallback?: (current: number, total: number, studentName: string) => void
  ): Promise<GenerationResult[]> {
    const results: GenerationResult[] = [];

    for (let i = 0; i < studentsData.length; i++) {
      const studentData = studentsData[i];

      if (progressCallback) {
        progressCallback(i + 1, studentsData.length, studentData.student.fullName());
      }

      // Ajouter une variation pour éviter les répétitions
      const variedParameters = this.addVariation(parameters, i);

      const result = await this.generateAppreciation(
        studentData,
        context,
        variedParameters
      );

      results.push(result);

      // Délai pour simuler le traitement IA
      await new Promise(resolve => setTimeout(resolve, 300));
    }

    return results;
  }

  /**
   * Analyser les données de l'élève pour déterminer les axes principaux
   */
  private static analyzeStudentData(studentData: StudentData) {
    const { participationLevel, averageGrade, attendanceRate, strengths, improvementAreas } = studentData;

    // Déterminer le profil général
    let overallProfile: 'excellent' | 'good' | 'average' | 'struggling';

    if (averageGrade >= 16 && participationLevel >= 8 && attendanceRate >= 95) {
      overallProfile = 'excellent';
    } else if (averageGrade >= 13 && participationLevel >= 6.5 && attendanceRate >= 85) {
      overallProfile = 'good';
    } else if (averageGrade >= 10 && participationLevel >= 5 && attendanceRate >= 75) {
      overallProfile = 'average';
    } else {
      overallProfile = 'struggling';
    }

    // Identifier les points forts dominants
    const dominantStrengths = strengths.slice(0, 3);
    const primaryImprovements = improvementAreas.slice(0, 2);

    // Calculer le trend de progression (simulé)
    const progressionTrend = this.calculateProgressionTrend(participationLevel, averageGrade);

    return {
      overallProfile,
      dominantStrengths,
      primaryImprovements,
      progressionTrend,
      engagementLevel: participationLevel,
      academicLevel: averageGrade,
      attendance: attendanceRate
    };
  }

  /**
   * Sélectionner les phrases appropriées depuis la banque
   */
  private static selectPhrases(
    phraseBank: PhraseBank,
    analysis: any,
    parameters: GenerationParameters
  ): { positive: string[]; improvements: string[]; encouragements: string[] } {
    const entries = phraseBank.entries as any;

    const positive: string[] = [];
    const improvements: string[] = [];
    const encouragements: string[] = [];

    // Sélection basée sur le profil de l'élève
    if (parameters.includeStrengths && entries.positiveElements) {
      parameters.focusAreas.forEach(area => {
        if (entries.positiveElements[area]) {
          const phrases = entries.positiveElements[area];
          positive.push(this.selectRandomPhrase(phrases));
        }
      });
    }

    if (parameters.includeImprovements && entries.improvementAreas) {
      const improvementPhrases = entries.improvementAreas;
      improvements.push(this.selectRandomPhrase(improvementPhrases));
    }

    if (parameters.includeEncouragement && entries.encouragements) {
      const encouragementPhrases = entries.encouragements;
      encouragements.push(this.selectRandomPhrase(encouragementPhrases));
    }

    return { positive, improvements, encouragements };
  }

  /**
   * Générer le contenu final selon le style guide
   */
  private static generateContent(
    studentData: StudentData,
    context: GenerationContext,
    parameters: GenerationParameters,
    selectedPhrases: any,
    analysis: any
  ): string {
    const { styleGuide } = context;
    const studentName = studentData.student.firstName;

    // Construire l'appréciation selon la structure définie
    let content = "";

    // Introduction avec nom de l'élève selon la personne choisie
    if (styleGuide.person === "deuxieme") {
      content += `${studentName}, vous `;
    } else {
      content += `${studentName} `;
    }

    // Ajouter les éléments positifs
    if (parameters.includeStrengths && selectedPhrases.positive.length > 0) {
      content += selectedPhrases.positive.join(" et ");

      if (styleGuide.length === "long") {
        content += ". Cette attitude témoigne d'un réel investissement personnel. ";
      } else {
        content += ". ";
      }
    }

    // Ajouter les axes d'amélioration de manière constructive
    if (parameters.includeImprovements && selectedPhrases.improvements.length > 0) {
      const improvement = selectedPhrases.improvements[0];

      if (styleGuide.tone === "constructif" || styleGuide.tone === "bienveillant") {
        content += `Pour poursuivre cette progression, ${studentName.toLowerCase()} ${improvement}. `;
      } else {
        content += `${improvement}. `;
      }
    }

    // Ajouter l'encouragement selon le ton
    if (parameters.includeEncouragement && selectedPhrases.encouragements.length > 0) {
      const encouragement = selectedPhrases.encouragements[0];
      content += encouragement;

      if (styleGuide.tone === "valorisant") {
        content += " L'évolution positive est remarquable et laisse présager de belles réussites.";
      }
    }

    // Ajuster selon la variabilité souhaitée
    if (styleGuide.variability === "elevee") {
      content = this.addVariations(content);
    }

    // Nettoyer et finaliser
    content = this.cleanAndFinalize(content, styleGuide);

    return content;
  }

  /**
   * Calculer les métadonnées de génération
   */
  private static calculateMetadata(
    content: string,
    styleGuide: StyleGuide,
    selectedPhrases: any,
    generationTime: number
  ) {
    return {
      wordsCount: content.split(' ').length,
      sentencesCount: content.split(/[.!?]/).filter(s => s.trim().length > 0).length,
      tone: styleGuide.tone,
      focusAreas: Object.keys(selectedPhrases.positive || {}),
      phrasesUsed: [
        ...selectedPhrases.positive || [],
        ...selectedPhrases.improvements || [],
        ...selectedPhrases.encouragements || []
      ],
      generationTime: Math.round(generationTime)
    };
  }

  /**
   * Générer des suggestions d'amélioration
   */
  private static generateSuggestions(analysis: any, parameters: GenerationParameters): string[] {
    const suggestions: string[] = [];

    if (analysis.overallProfile === 'struggling') {
      suggestions.push("Envisager un entretien individuel pour comprendre les difficultés");
      suggestions.push("Proposer des ressources d'aide personnalisées");
    }

    if (analysis.engagementLevel < 5) {
      suggestions.push("Travailler sur la motivation et l'engagement de l'élève");
    }

    if (parameters.targetLength && parameters.targetLength > 150) {
      suggestions.push("Considérer d'ajouter des exemples concrets");
    }

    return suggestions;
  }

  /**
   * Générer des versions alternatives
   */
  private static generateAlternatives(content: string, styleGuide: StyleGuide): string[] {
    // Simuler des alternatives en variant le ton
    const alternatives: string[] = [];

    if (styleGuide.tone !== "professionnel") {
      alternatives.push("Version plus formelle disponible");
    }

    if (styleGuide.tone !== "bienveillant") {
      alternatives.push("Version plus encourageante disponible");
    }

    if (styleGuide.length !== "court") {
      alternatives.push("Version condensée disponible");
    }

    return alternatives;
  }

  // Méthodes utilitaires privées
  private static selectRandomPhrase(phrases: string[]): string {
    return phrases[Math.floor(Math.random() * phrases.length)];
  }

  private static calculateProgressionTrend(participation: number, grade: number): string {
    const average = (participation + grade) / 2;
    if (average >= 15) return "ascending";
    if (average >= 12) return "stable";
    if (average >= 8) return "mixed";
    return "declining";
  }

  private static addVariation(params: GenerationParameters, index: number): GenerationParameters {
    const varied = { ...params };

    // Varier légèrement les paramètres pour éviter les répétitions
    if (index % 2 === 0) {
      varied.emphasizeProgress = !varied.emphasizeProgress;
    }

    if (index % 3 === 0) {
      varied.includeSpecificExamples = !varied.includeSpecificExamples;
    }

    return varied;
  }

  private static addVariations(content: string): string {
    // Ajouter des variations stylistiques mineures
    return content
      .replace(/\. /g, Math.random() > 0.7 ? '. En effet, ' : '. ')
      .replace(/Par ailleurs/g, Math.random() > 0.5 ? 'De plus' : 'Par ailleurs');
  }

  private static cleanAndFinalize(content: string, styleGuide: StyleGuide): string {
    // Nettoyer les espaces multiples
    content = content.replace(/\s+/g, ' ').trim();

    // Vérifier les phrases bannies
    styleGuide.bannedPhrases.forEach(banned => {
      const regex = new RegExp(banned, 'gi');
      content = content.replace(regex, '');
    });

    // S'assurer que le contenu se termine bien
    if (!content.endsWith('.') && !content.endsWith('!')) {
      content += '.';
    }

    return content;
  }
}