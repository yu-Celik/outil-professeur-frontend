"use client";

import { useEffect, useState, useCallback } from "react";
import {
  MOCK_APPRECIATION_CONTENT,
  getAppreciationContentById,
  getAppreciationContentByStudent,
  getAppreciationContentBySubject,
  getAppreciationContentByPeriod,
  getAppreciationContentByStatus,
  getFavoriteAppreciationContent,
  getReusableAppreciationContent,
  getAppreciationContentStats
} from "@/features/appreciations/mocks";
import type { AppreciationContent } from "@/types/uml-entities";

export interface AppreciationFilters {
  studentId?: string;
  subjectId?: string;
  academicPeriodId?: string;
  status?: string;
  contentKind?: string;
  scope?: string;
  isFavorite?: boolean;
  search?: string;
}

export interface GenerationRequest {
  studentId: string;
  subjectId?: string;
  academicPeriodId?: string;
  schoolYearId?: string;
  styleGuideId: string;
  phraseBankId?: string;
  rubricId?: string;
  contentKind: string;
  scope: string;
  audience: string;
  generationTrigger: "manual" | "automatic" | "bulk";
  inputData: Record<string, unknown>;
  generationParams: Record<string, unknown>;
  language: string;
}

export interface BulkGenerationRequest {
  studentIds: string[];
  baseRequest: Omit<GenerationRequest, 'studentId'>;
}

export function useAppreciationGeneration(teacherId: string = "KsmNtVf4zwqO3VV3SQJqPrRlQBA1fFyR") {
  const [appreciations, setAppreciations] = useState<AppreciationContent[]>([]);
  const [filteredAppreciations, setFilteredAppreciations] = useState<AppreciationContent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [generationLoading, setGenerationLoading] = useState(false);
  const [bulkGenerationProgress, setBulkGenerationProgress] = useState<{
    current: number;
    total: number;
    currentStudent?: string;
  } | null>(null);
  const [filters, setFilters] = useState<AppreciationFilters>({});

  // Chargement initial des données
  useEffect(() => {
    try {
      setLoading(true);
      setError(null);

      // Charger toutes les appréciations
      const allAppreciations = MOCK_APPRECIATION_CONTENT.filter(
        appreciation => appreciation.createdBy === teacherId
      );
      setAppreciations(allAppreciations);

      setLoading(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur lors du chargement");
      setLoading(false);
    }
  }, [teacherId]);

  // Filtrage des appréciations
  useEffect(() => {
    let filtered = [...appreciations];

    if (filters.studentId) {
      filtered = filtered.filter(app => app.studentId === filters.studentId);
    }

    if (filters.subjectId) {
      filtered = filtered.filter(app => app.subjectId === filters.subjectId);
    }

    if (filters.academicPeriodId) {
      filtered = filtered.filter(app => app.academicPeriodId === filters.academicPeriodId);
    }

    if (filters.status) {
      filtered = filtered.filter(app => app.status === filters.status);
    }

    if (filters.contentKind) {
      filtered = filtered.filter(app => app.contentKind === filters.contentKind);
    }

    if (filters.scope) {
      filtered = filtered.filter(app => app.scope === filters.scope);
    }

    if (filters.isFavorite !== undefined) {
      filtered = filtered.filter(app => app.isFavorite === filters.isFavorite);
    }

    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      filtered = filtered.filter(app =>
        app.content.toLowerCase().includes(searchTerm) ||
        (app.inputData && JSON.stringify(app.inputData).toLowerCase().includes(searchTerm))
      );
    }

    setFilteredAppreciations(filtered);
  }, [appreciations, filters]);

  // Génération d'une appréciation unique
  const generateAppreciation = useCallback(async (
    request: GenerationRequest
  ): Promise<AppreciationContent | null> => {
    try {
      setGenerationLoading(true);
      setError(null);

      // Simuler un délai de génération IA (2-4 secondes)
      const generationDelay = Math.random() * 2000 + 2000;
      await new Promise(resolve => setTimeout(resolve, generationDelay));

      // Simuler une génération IA avec du contenu dynamique
      const generatedContent = generateMockContent(request);

      const newAppreciation: AppreciationContent = {
        id: `appreciation-generated-${Date.now()}`,
        createdBy: teacherId,
        studentId: request.studentId,
        subjectId: request.subjectId,
        academicPeriodId: request.academicPeriodId,
        schoolYearId: request.schoolYearId,
        styleGuideId: request.styleGuideId,
        phraseBankId: request.phraseBankId,
        rubricId: request.rubricId,
        contentKind: request.contentKind,
        scope: request.scope,
        audience: request.audience,
        generationTrigger: request.generationTrigger,
        content: generatedContent,
        inputData: request.inputData,
        generationParams: request.generationParams,
        language: request.language,
        status: "draft",
        isFavorite: false,
        reuseCount: 0,
        generatedAt: new Date(),
        updatedAt: new Date(),
        exportAs: (format: string) => {
          switch (format) {
            case 'pdf': return 'PDF export content...';
            case 'word': return 'Word export content...';
            default: return 'Plain text export...';
          }
        },
        updateContent: function(newText: string) {
          this.content = newText;
          this.updatedAt = new Date();
        },
        markAsFavorite: function() {
          this.isFavorite = true;
          this.updatedAt = new Date();
        },
        unmarkFavorite: function() {
          this.isFavorite = false;
          this.updatedAt = new Date();
        },
        incrementReuseCount: function() {
          this.reuseCount++;
          this.updatedAt = new Date();
        },
        canBeReused: function() {
          return this.status === 'validated' && this.isFavorite;
        },
        regenerate: function(params: Record<string, unknown>) {
          return {
            ...this,
            id: `${this.id}-regenerated-${Date.now()}`,
            generationParams: { ...this.generationParams, ...params },
            generatedAt: new Date(),
            status: 'draft',
            reuseCount: 0
          } as AppreciationContent;
        }
      };

      setAppreciations(prev => [...prev, newAppreciation]);
      return newAppreciation;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur lors de la génération");
      return null;
    } finally {
      setGenerationLoading(false);
    }
  }, [teacherId]);

  // Génération en lot
  const generateBulkAppreciations = useCallback(async (
    request: BulkGenerationRequest
  ): Promise<AppreciationContent[]> => {
    try {
      setGenerationLoading(true);
      setError(null);

      const results: AppreciationContent[] = [];
      const total = request.studentIds.length;

      setBulkGenerationProgress({ current: 0, total, currentStudent: undefined });

      for (let i = 0; i < request.studentIds.length; i++) {
        const studentId = request.studentIds[i];
        setBulkGenerationProgress({
          current: i + 1,
          total,
          currentStudent: studentId
        });

        const appreciation = await generateAppreciation({
          ...request.baseRequest,
          studentId,
        });

        if (appreciation) {
          results.push(appreciation);
        }

        // Délai entre chaque génération pour éviter la surcharge
        await new Promise(resolve => setTimeout(resolve, 500));
      }

      setBulkGenerationProgress(null);
      return results;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur lors de la génération en lot");
      setBulkGenerationProgress(null);
      return [];
    } finally {
      setGenerationLoading(false);
    }
  }, [generateAppreciation]);

  // Régénération d'une appréciation existante
  const regenerateAppreciation = useCallback(async (
    appreciationId: string,
    newParams?: Record<string, unknown>
  ): Promise<AppreciationContent | null> => {
    try {
      setGenerationLoading(true);
      setError(null);

      const existingAppreciation = appreciations.find(app => app.id === appreciationId);
      if (!existingAppreciation) {
        throw new Error("Appréciation non trouvée");
      }

      const regenerated = existingAppreciation.regenerate(newParams || {});

      // Simuler génération
      const generationDelay = Math.random() * 1500 + 1000;
      await new Promise(resolve => setTimeout(resolve, generationDelay));

      // Régénérer le contenu
      regenerated.content = generateMockContent({
        studentId: regenerated.studentId,
        subjectId: regenerated.subjectId,
        academicPeriodId: regenerated.academicPeriodId,
        schoolYearId: regenerated.schoolYearId,
        styleGuideId: regenerated.styleGuideId,
        phraseBankId: regenerated.phraseBankId,
        rubricId: regenerated.rubricId,
        contentKind: regenerated.contentKind,
        scope: regenerated.scope,
        audience: regenerated.audience,
        generationTrigger: "manual",
        inputData: regenerated.inputData,
        generationParams: regenerated.generationParams,
        language: regenerated.language,
      });

      setAppreciations(prev => [...prev, regenerated]);
      return regenerated;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur lors de la régénération");
      return null;
    } finally {
      setGenerationLoading(false);
    }
  }, [appreciations]);

  // Gestion des appréciations
  const updateAppreciationContent = useCallback(async (
    id: string,
    newContent: string
  ): Promise<boolean> => {
    try {
      const appreciation = appreciations.find(app => app.id === id);
      if (!appreciation) {
        throw new Error("Appréciation non trouvée");
      }

      appreciation.updateContent(newContent);

      // Trigger re-render
      setAppreciations(prev => [...prev]);
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur lors de la mise à jour");
      return false;
    }
  }, [appreciations]);

  const toggleFavorite = useCallback(async (id: string): Promise<boolean> => {
    try {
      const appreciation = appreciations.find(app => app.id === id);
      if (!appreciation) {
        throw new Error("Appréciation non trouvée");
      }

      if (appreciation.isFavorite) {
        appreciation.unmarkFavorite();
      } else {
        appreciation.markAsFavorite();
      }

      // Trigger re-render
      setAppreciations(prev => [...prev]);
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur lors du basculement des favoris");
      return false;
    }
  }, [appreciations]);

  const validateAppreciation = useCallback(async (id: string): Promise<boolean> => {
    try {
      const appreciationIndex = appreciations.findIndex(app => app.id === id);
      if (appreciationIndex === -1) {
        throw new Error("Appréciation non trouvée");
      }

      const updatedAppreciations = [...appreciations];
      updatedAppreciations[appreciationIndex].status = "validated";
      updatedAppreciations[appreciationIndex].updatedAt = new Date();

      setAppreciations(updatedAppreciations);
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur lors de la validation");
      return false;
    }
  }, [appreciations]);

  const deleteAppreciation = useCallback(async (id: string): Promise<boolean> => {
    try {
      setAppreciations(prev => prev.filter(app => app.id !== id));
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur lors de la suppression");
      return false;
    }
  }, []);

  // Fonctions utilitaires
  const applyFilters = useCallback((newFilters: AppreciationFilters) => {
    setFilters(newFilters);
  }, []);

  const clearFilters = useCallback(() => {
    setFilters({});
  }, []);

  const searchAppreciations = useCallback((searchTerm: string) => {
    setFilters(prev => ({ ...prev, search: searchTerm }));
  }, []);

  const getStats = useCallback(() => {
    return getAppreciationContentStats();
  }, []);

  return {
    // State
    appreciations: filteredAppreciations,
    allAppreciations: appreciations,
    loading,
    error,
    generationLoading,
    bulkGenerationProgress,
    filters,

    // Generation functions
    generateAppreciation,
    generateBulkAppreciations,
    regenerateAppreciation,

    // Content management
    updateAppreciationContent,
    toggleFavorite,
    validateAppreciation,
    deleteAppreciation,

    // Filtering and search
    applyFilters,
    clearFilters,
    searchAppreciations,

    // Utility functions
    getAppreciationById: getAppreciationContentById,
    getAppreciationsByStudent: getAppreciationContentByStudent,
    getAppreciationsBySubject: getAppreciationContentBySubject,
    getAppreciationsByPeriod: getAppreciationContentByPeriod,
    getAppreciationsByStatus: getAppreciationContentByStatus,
    getFavorites: getFavoriteAppreciationContent,
    getReusable: getReusableAppreciationContent,
    getStats,

    // Refresh function
    refresh: () => {
      setAppreciations([...MOCK_APPRECIATION_CONTENT.filter(app => app.createdBy === teacherId)]);
      setError(null);
    }
  };
}

// Fonction utilitaire pour générer du contenu mock
function generateMockContent(request: GenerationRequest): string {
  const tones = {
    'professionnel': 'démontre',
    'bienveillant': 'progresse avec',
    'constructif': 'peut améliorer',
    'valorisant': 'excelle dans',
    'neutre': 'présente',
  };

  const phrases = [
    'un engagement remarquable dans ses apprentissages',
    'des compétences en développement constant',
    'une participation active et constructive',
    'une progression encourageante ce trimestre',
    'des qualités humaines appréciables',
  ];

  const improvements = [
    'gagnerait à consolider certains acquis',
    'pourrait développer davantage sa confiance',
    'devrait approfondir ses méthodes de travail',
    'peut améliorer sa régularité dans l\'effort',
  ];

  const encouragements = [
    'Les progrès sont nets et encourageants.',
    'Continue sur cette voie prometteuse !',
    'Le travail fourni porte ses fruits.',
    'L\'investissement personnel est notable.',
  ];

  // Simuler une génération basée sur les paramètres
  const inputData = request.inputData as any;
  const studentName = inputData?.studentName || 'L\'élève';
  const tone = (request.generationParams as any)?.tone || 'professionnel';

  const verb = tones[tone as keyof typeof tones] || 'présente';
  const randomPhrase = phrases[Math.floor(Math.random() * phrases.length)];
  const randomImprovement = improvements[Math.floor(Math.random() * improvements.length)];
  const randomEncouragement = encouragements[Math.floor(Math.random() * encouragements.length)];

  return `${studentName} ${verb} ${randomPhrase}. ${randomImprovement}. ${randomEncouragement}`;
}