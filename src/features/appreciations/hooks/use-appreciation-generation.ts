"use client";

import { useEffect, useState, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import {
  appreciationsClient,
  mapAppreciationFromAPI,
  estimateBulkGenerationTime,
} from "@/features/appreciations/api/appreciations-client";
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
  baseRequest: Omit<GenerationRequest, "studentId">;
}

export function useAppreciationGeneration(
  teacherId: string = "KsmNtVf4zwqO3VV3SQJqPrRlQBA1fFyR",
) {
  const { toast } = useToast();
  const [appreciations, setAppreciations] = useState<AppreciationContent[]>([]);
  const [filteredAppreciations, setFilteredAppreciations] = useState<
    AppreciationContent[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [generationLoading, setGenerationLoading] = useState(false);
  const [bulkGenerationProgress, setBulkGenerationProgress] = useState<{
    current: number;
    total: number;
    currentStudent?: string;
    estimatedTimeRemaining?: number;
  } | null>(null);
  const [filters, setFilters] = useState<AppreciationFilters>({});

  // Chargement initial des données depuis l'API
  const loadAppreciations = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Charger toutes les appréciations depuis l'API
      const response = await appreciationsClient.list();
      const loadedAppreciations = response.items.map(mapAppreciationFromAPI);
      setAppreciations(loadedAppreciations);

      setLoading(false);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Erreur lors du chargement";
      setError(errorMessage);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: errorMessage,
      });
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    loadAppreciations();
  }, [loadAppreciations]);

  // Filtrage des appréciations
  useEffect(() => {
    let filtered = [...appreciations];

    if (filters.studentId) {
      filtered = filtered.filter((app) => app.studentId === filters.studentId);
    }

    if (filters.subjectId) {
      filtered = filtered.filter((app) => app.subjectId === filters.subjectId);
    }

    if (filters.academicPeriodId) {
      filtered = filtered.filter(
        (app) => app.academicPeriodId === filters.academicPeriodId,
      );
    }

    if (filters.status) {
      filtered = filtered.filter((app) => app.status === filters.status);
    }

    if (filters.contentKind) {
      filtered = filtered.filter(
        (app) => app.contentKind === filters.contentKind,
      );
    }

    if (filters.scope) {
      filtered = filtered.filter((app) => app.scope === filters.scope);
    }

    if (filters.isFavorite !== undefined) {
      filtered = filtered.filter(
        (app) => app.isFavorite === filters.isFavorite,
      );
    }

    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      filtered = filtered.filter(
        (app) =>
          app.content.toLowerCase().includes(searchTerm) ||
          (app.inputData &&
            JSON.stringify(app.inputData).toLowerCase().includes(searchTerm)),
      );
    }

    setFilteredAppreciations(filtered);
  }, [appreciations, filters]);

  // Génération d'une appréciation unique via API
  const generateAppreciation = useCallback(
    async (request: GenerationRequest): Promise<AppreciationContent | null> => {
      try {
        setGenerationLoading(true);
        setError(null);

        // Appeler l'API de génération IA pour un seul élève
        const response = await appreciationsClient.generate({
          student_ids: [request.studentId],
          subject_id: request.subjectId,
          academic_period_id: request.academicPeriodId,
          school_year_id: request.schoolYearId,
          style_guide_id: request.styleGuideId,
          phrase_bank_id: request.phraseBankId,
          rubric_id: request.rubricId,
          content_kind: request.contentKind,
          scope: request.scope,
          audience: request.audience,
          generation_params: {
            ...request.generationParams,
            inputData: request.inputData,
          },
          language: request.language,
        });

        if (response.results.length === 0) {
          throw new Error("Aucune appréciation générée");
        }

        const generatedAppreciation = mapAppreciationFromAPI(
          response.results[0],
        );
        setAppreciations((prev) => [...prev, generatedAppreciation]);

        toast({
          title: "Appréciation générée",
          description: "L'appréciation a été générée avec succès.",
        });

        return generatedAppreciation;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Erreur lors de la génération";
        setError(errorMessage);
        toast({
          variant: "destructive",
          title: "Erreur",
          description: errorMessage,
        });
        return null;
      } finally {
        setGenerationLoading(false);
      }
    },
    [toast],
  );

  // Génération en lot via API (biweekly reports)
  const generateBulkAppreciations = useCallback(
    async (request: BulkGenerationRequest): Promise<AppreciationContent[]> => {
      try {
        setGenerationLoading(true);
        setError(null);

        const total = request.studentIds.length;
        const timeEstimate = estimateBulkGenerationTime(total);

        setBulkGenerationProgress({
          current: 0,
          total,
          currentStudent: undefined,
          estimatedTimeRemaining: timeEstimate.seconds,
        });

        toast({
          title: "Génération en cours",
          description: `Génération de ${total} appréciations... Temps estimé: ${timeEstimate.formatted}`,
        });

        // Call the bulk generation API
        const response = await appreciationsClient.generate({
          student_ids: request.studentIds,
          subject_id: request.baseRequest.subjectId,
          academic_period_id: request.baseRequest.academicPeriodId,
          school_year_id: request.baseRequest.schoolYearId,
          style_guide_id: request.baseRequest.styleGuideId,
          phrase_bank_id: request.baseRequest.phraseBankId,
          rubric_id: request.baseRequest.rubricId,
          content_kind: request.baseRequest.contentKind,
          scope: request.baseRequest.scope,
          audience: request.baseRequest.audience,
          generation_params: request.baseRequest.generationParams,
          language: request.baseRequest.language,
        });

        // Map API results to frontend models
        const generatedAppreciations = response.results.map(
          mapAppreciationFromAPI,
        );

        // Update local state
        setAppreciations((prev) => [...prev, ...generatedAppreciations]);

        setBulkGenerationProgress({
          current: total,
          total,
          estimatedTimeRemaining: 0,
        });

        // Show summary
        const successCount = generatedAppreciations.length;
        const failCount = response.failed?.length || 0;

        toast({
          title: "Génération terminée",
          description: `${successCount} appréciations générées${
            failCount > 0 ? `, ${failCount} échecs` : ""
          }.`,
        });

        setBulkGenerationProgress(null);
        return generatedAppreciations;
      } catch (err) {
        const errorMessage =
          err instanceof Error
            ? err.message
            : "Erreur lors de la génération en lot";
        setError(errorMessage);
        toast({
          variant: "destructive",
          title: "Erreur",
          description: errorMessage,
        });
        setBulkGenerationProgress(null);
        return [];
      } finally {
        setGenerationLoading(false);
      }
    },
    [toast],
  );

  // Génération appréciations trimestrielles (multi-classes)
  const generateTrimesterAppreciations = useCallback(
    async (params: {
      classIds: string[];
      periodId: string;
      styleGuideId: string;
      lengthOption: "short" | "standard" | "long";
      onProgress?: (current: number, total: number, studentName: string) => void;
    }): Promise<AppreciationContent[]> => {
      try {
        setGenerationLoading(true);
        setError(null);

        // Collect all students from selected classes
        const { getStudentsByClass } = await import("@/features/students/mocks");
        const allStudents = params.classIds.flatMap((classId) =>
          getStudentsByClass(classId)
        );

        const total = allStudents.length;
        const timeEstimate = estimateBulkGenerationTime(total, 15); // 15s/student budget

        setBulkGenerationProgress({
          current: 0,
          total,
          currentStudent: undefined,
          estimatedTimeRemaining: timeEstimate.seconds,
        });

        toast({
          title: "Génération trimestrielle en cours",
          description: `Génération pour ${total} élèves... Temps estimé: ${timeEstimate.formatted}`,
        });

        const generatedAppreciations: AppreciationContent[] = [];
        const startTime = Date.now();

        // Generate for each student with progress tracking
        for (let index = 0; index < allStudents.length; index++) {
          const student = allStudents[index];
          const studentName = student.fullName();

          // Update progress
          const elapsedSeconds = (Date.now() - startTime) / 1000;
          const avgTimePerStudent = elapsedSeconds / Math.max(index, 1);
          const remainingStudents = total - index;
          const estimatedRemaining = Math.round(avgTimePerStudent * remainingStudents);

          setBulkGenerationProgress({
            current: index,
            total,
            currentStudent: studentName,
            estimatedTimeRemaining: estimatedRemaining,
          });

          if (params.onProgress) {
            params.onProgress(index + 1, total, studentName);
          }

          // Build generation request with trimester-specific parameters
          const targetLength =
            params.lengthOption === "short"
              ? 70
              : params.lengthOption === "long"
                ? 135
                : 100;

          const response = await appreciationsClient.generate({
            student_ids: [student.id],
            academic_period_id: params.periodId,
            school_year_id: "year-2025",
            style_guide_id: params.styleGuideId,
            content_kind: "trimester_appreciation",
            scope: "general",
            audience: "bulletins",
            generation_params: {
              targetLength,
              formal: true,
              structureType: "trimester_bulletin",
              lengthOption: params.lengthOption,
            },
            language: "fr",
          });

          if (response.results.length > 0) {
            const appreciation = mapAppreciationFromAPI(response.results[0]);
            generatedAppreciations.push(appreciation);
          }

          // Small delay to respect the 15s/student budget (simulated)
          await new Promise((resolve) => setTimeout(resolve, 100));
        }

        // Update local state
        setAppreciations((prev) => [...prev, ...generatedAppreciations]);

        setBulkGenerationProgress({
          current: total,
          total,
          estimatedTimeRemaining: 0,
        });

        const totalTimeSeconds = Math.round((Date.now() - startTime) / 1000);
        const avgTime = (totalTimeSeconds / total).toFixed(1);

        toast({
          title: "Génération trimestrielle terminée",
          description: `${generatedAppreciations.length} appréciations générées en ${totalTimeSeconds}s (moyenne: ${avgTime}s/élève)`,
        });

        setBulkGenerationProgress(null);
        return generatedAppreciations;
      } catch (err) {
        const errorMessage =
          err instanceof Error
            ? err.message
            : "Erreur lors de la génération trimestrielle";
        setError(errorMessage);
        toast({
          variant: "destructive",
          title: "Erreur",
          description: errorMessage,
        });
        setBulkGenerationProgress(null);
        return [];
      } finally {
        setGenerationLoading(false);
      }
    },
    [toast],
  );

  // Régénération d'une appréciation existante
  const regenerateAppreciation = useCallback(
    async (
      appreciationId: string,
      newParams?: Record<string, unknown>,
    ): Promise<AppreciationContent | null> => {
      try {
        setGenerationLoading(true);
        setError(null);

        const existingAppreciation = appreciations.find(
          (app) => app.id === appreciationId,
        );
        if (!existingAppreciation) {
          throw new Error("Appréciation non trouvée");
        }

        const regenerated = existingAppreciation.regenerate(newParams || {});

        // Simuler génération
        const generationDelay = Math.random() * 1500 + 1000;
        await new Promise((resolve) => setTimeout(resolve, generationDelay));

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

        setAppreciations((prev) => [...prev, regenerated]);
        return regenerated;
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Erreur lors de la régénération",
        );
        return null;
      } finally {
        setGenerationLoading(false);
      }
    },
    [appreciations],
  );

  // Gestion des appréciations
  const updateAppreciationContent = useCallback(
    async (id: string, newContent: string): Promise<boolean> => {
      try {
        // Call API to update
        const response = await appreciationsClient.update(id, {
          content: newContent,
        });

        // Update local state
        const updatedAppreciation = mapAppreciationFromAPI(response);
        setAppreciations((prev) =>
          prev.map((app) => (app.id === id ? updatedAppreciation : app)),
        );

        toast({
          title: "Appréciation modifiée",
          description: "Les modifications ont été enregistrées.",
        });

        return true;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Erreur lors de la mise à jour";
        setError(errorMessage);
        toast({
          variant: "destructive",
          title: "Erreur",
          description: errorMessage,
        });
        return false;
      }
    },
    [toast],
  );

  const toggleFavorite = useCallback(
    async (id: string): Promise<boolean> => {
      try {
        const appreciation = appreciations.find((app) => app.id === id);
        if (!appreciation) {
          throw new Error("Appréciation non trouvée");
        }

        // Call API to toggle favorite
        const response = await appreciationsClient.update(id, {
          is_favorite: !appreciation.isFavorite,
        });

        // Update local state
        const updatedAppreciation = mapAppreciationFromAPI(response);
        setAppreciations((prev) =>
          prev.map((app) => (app.id === id ? updatedAppreciation : app)),
        );

        return true;
      } catch (err) {
        const errorMessage =
          err instanceof Error
            ? err.message
            : "Erreur lors du basculement des favoris";
        setError(errorMessage);
        toast({
          variant: "destructive",
          title: "Erreur",
          description: errorMessage,
        });
        return false;
      }
    },
    [appreciations, toast],
  );

  const validateAppreciation = useCallback(
    async (id: string): Promise<boolean> => {
      try {
        // Call API to validate
        await appreciationsClient.validate([id]);

        // Update local state
        setAppreciations((prev) =>
          prev.map((app) =>
            app.id === id
              ? { ...app, status: "validated", updatedAt: new Date() }
              : app,
          ),
        );

        toast({
          title: "Appréciation validée",
          description: "L'appréciation a été validée avec succès.",
        });

        return true;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Erreur lors de la validation";
        setError(errorMessage);
        toast({
          variant: "destructive",
          title: "Erreur",
          description: errorMessage,
        });
        return false;
      }
    },
    [toast],
  );

  const validateBulkAppreciations = useCallback(
    async (ids: string[]): Promise<boolean> => {
      try {
        // Call API for bulk validation
        await appreciationsClient.validate(ids);

        // Update local state
        setAppreciations((prev) =>
          prev.map((app) =>
            ids.includes(app.id)
              ? { ...app, status: "validated", updatedAt: new Date() }
              : app,
          ),
        );

        toast({
          title: "Appréciations validées",
          description: `${ids.length} appréciations ont été validées avec succès.`,
        });

        return true;
      } catch (err) {
        const errorMessage =
          err instanceof Error
            ? err.message
            : "Erreur lors de la validation en lot";
        setError(errorMessage);
        toast({
          variant: "destructive",
          title: "Erreur",
          description: errorMessage,
        });
        return false;
      }
    },
    [toast],
  );

  const deleteAppreciation = useCallback(
    async (id: string): Promise<boolean> => {
      try {
        setAppreciations((prev) => prev.filter((app) => app.id !== id));
        return true;
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Erreur lors de la suppression",
        );
        return false;
      }
    },
    [],
  );

  // Export ZIP functionality
  const exportAppreciations = useCallback(
    async (
      ids: string[],
      format: "pdf" | "docx" | "zip" = "zip",
    ): Promise<boolean> => {
      try {
        setLoading(true);

        // Filter out non-validated appreciations (AC 8: Block export for non-validated reports)
        const validatedIds = ids.filter((id) => {
          const appreciation = appreciations.find((app) => app.id === id);
          return appreciation?.status === "validated";
        });

        if (validatedIds.length === 0) {
          toast({
            variant: "destructive",
            title: "Export impossible",
            description:
              "Aucune appréciation validée à exporter. Veuillez valider au moins une appréciation avant l'export.",
          });
          setLoading(false);
          return false;
        }

        if (validatedIds.length < ids.length) {
          const skipped = ids.length - validatedIds.length;
          toast({
            title: "Appréciations non validées ignorées",
            description: `${skipped} appréciation(s) non validée(s) ont été exclues de l'export.`,
          });
        }

        // Call API to export
        const blob = await appreciationsClient.export(validatedIds, format);

        // Download the file
        const filename = `appreciations_${new Date().toISOString().split("T")[0]}.${format === "zip" ? "zip" : format}`;
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);

        toast({
          title: "Export réussi",
          description: `${validatedIds.length} appréciation(s) validée(s) ont été exportées.`,
        });

        return true;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Erreur lors de l'export";
        toast({
          variant: "destructive",
          title: "Erreur",
          description: errorMessage,
        });
        return false;
      } finally {
        setLoading(false);
      }
    },
    [appreciations, toast],
  );

  // Fonctions utilitaires
  const applyFilters = useCallback((newFilters: AppreciationFilters) => {
    setFilters(newFilters);
  }, []);

  const clearFilters = useCallback(() => {
    setFilters({});
  }, []);

  const searchAppreciations = useCallback((searchTerm: string) => {
    setFilters((prev) => ({ ...prev, search: searchTerm }));
  }, []);

  const getStats = useCallback(() => {
    const total = appreciations.length;
    const byStatus = appreciations.reduce(
      (acc, app) => {
        acc[app.status] = (acc[app.status] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>,
    );

    return {
      total,
      byStatus,
      favorites: appreciations.filter((app) => app.isFavorite).length,
      drafts: byStatus.draft || 0,
      validated: byStatus.validated || 0,
    };
  }, [appreciations]);

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
    generateTrimesterAppreciations,
    regenerateAppreciation,

    // Content management
    updateAppreciationContent,
    toggleFavorite,
    validateAppreciation,
    validateBulkAppreciations,
    deleteAppreciation,

    // Export
    exportAppreciations,

    // Filtering and search
    applyFilters,
    clearFilters,
    searchAppreciations,

    // Utility functions
    getAppreciationById: (id: string) =>
      appreciations.find((app) => app.id === id),
    getAppreciationsByStudent: (studentId: string) =>
      appreciations.filter((app) => app.studentId === studentId),
    getAppreciationsBySubject: (subjectId: string) =>
      appreciations.filter((app) => app.subjectId === subjectId),
    getAppreciationsByPeriod: (periodId: string) =>
      appreciations.filter((app) => app.academicPeriodId === periodId),
    getAppreciationsByStatus: (status: string) =>
      appreciations.filter((app) => app.status === status),
    getFavorites: () => appreciations.filter((app) => app.isFavorite),
    getReusable: () =>
      appreciations.filter(
        (app) => app.status === "validated" && app.isFavorite,
      ),
    getStats,

    // Refresh function
    refresh: loadAppreciations,
  };
}
