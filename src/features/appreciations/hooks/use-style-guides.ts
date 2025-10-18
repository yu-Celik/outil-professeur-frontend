"use client";

import { useEffect, useState, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import {
  styleGuidesClient,
  mapStyleGuideFromAPI,
  STYLE_GUIDE_TONES,
  STYLE_GUIDE_REGISTERS,
  STYLE_GUIDE_LENGTHS,
  validateStyleGuide,
  normalizePhrases,
} from "@/features/appreciations/api/style-guides-client";
import type { StyleGuide } from "@/types/uml-entities";

export interface StyleGuideFilters {
  tone?: string;
  register?: string;
  length?: string;
  search?: string;
}

export interface CreateStyleGuideData {
  name: string;
  tone: string;
  register: string;
  length: string;
  person: string;
  variability: string;
  bannedPhrases: string[];
  preferredPhrases: string[];
}

export interface UpdateStyleGuideData extends Partial<CreateStyleGuideData> {
  id: string;
}

export function useStyleGuides(
  teacherId: string = "KsmNtVf4zwqO3VV3SQJqPrRlQBA1fFyR",
) {
  const { toast } = useToast();
  const [styleGuides, setStyleGuides] = useState<StyleGuide[]>([]);
  const [filteredGuides, setFilteredGuides] = useState<StyleGuide[]>([]);
  const [defaultGuide, setDefaultGuide] = useState<StyleGuide | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<StyleGuideFilters>({});

  // Chargement initial des données depuis l'API
  const loadStyleGuides = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Charger tous les guides de style depuis l'API
      const response = await styleGuidesClient.list();
      const guides = response.items.map(mapStyleGuideFromAPI);
      setStyleGuides(guides);

      // Trouver le guide par défaut
      const defaultResponse = response.items.find((g) => g.is_default);
      if (defaultResponse) {
        setDefaultGuide(mapStyleGuideFromAPI(defaultResponse));
      } else {
        setDefaultGuide(null);
      }

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
    loadStyleGuides();
  }, [loadStyleGuides]);

  // Filtrage des guides
  useEffect(() => {
    let filtered = [...styleGuides];

    if (filters.tone) {
      filtered = filtered.filter((guide) => guide.tone === filters.tone);
    }

    if (filters.register) {
      filtered = filtered.filter(
        (guide) => guide.register === filters.register,
      );
    }

    if (filters.length) {
      filtered = filtered.filter((guide) => guide.length === filters.length);
    }

    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      filtered = filtered.filter(
        (guide) =>
          guide.name.toLowerCase().includes(searchTerm) ||
          guide.tone.toLowerCase().includes(searchTerm) ||
          guide.register.toLowerCase().includes(searchTerm),
      );
    }

    setFilteredGuides(filtered);
  }, [styleGuides, filters]);

  // CRUD Operations
  const createStyleGuide = useCallback(
    async (data: CreateStyleGuideData): Promise<StyleGuide | null> => {
      try {
        setLoading(true);
        setError(null);

        // Validate data
        const validation = validateStyleGuide({
          name: data.name,
          tone: data.tone,
          register: data.register,
          length: data.length,
          person: data.person,
          variability: data.variability,
          banned_phrases: normalizePhrases(data.bannedPhrases),
          preferred_phrases: normalizePhrases(data.preferredPhrases),
        });

        if (!validation.valid) {
          throw new Error(validation.errors.join(", "));
        }

        // Call API to create
        const response = await styleGuidesClient.create({
          name: data.name,
          tone: data.tone,
          register: data.register,
          length: data.length,
          person: data.person,
          variability: data.variability,
          banned_phrases: normalizePhrases(data.bannedPhrases),
          preferred_phrases: normalizePhrases(data.preferredPhrases),
        });

        const newGuide = mapStyleGuideFromAPI(response);
        setStyleGuides((prev) => [...prev, newGuide]);

        toast({
          title: "Guide créé",
          description: `Le guide "${data.name}" a été créé avec succès.`,
        });

        return newGuide;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Erreur lors de la création";
        setError(errorMessage);
        toast({
          variant: "destructive",
          title: "Erreur",
          description: errorMessage,
        });
        return null;
      } finally {
        setLoading(false);
      }
    },
    [toast],
  );

  const updateStyleGuide = useCallback(
    async (data: UpdateStyleGuideData): Promise<StyleGuide | null> => {
      try {
        setLoading(true);
        setError(null);

        // Prepare update request
        const updateRequest: any = {};
        if (data.name) updateRequest.name = data.name;
        if (data.tone) updateRequest.tone = data.tone;
        if (data.register) updateRequest.register = data.register;
        if (data.length) updateRequest.length = data.length;
        if (data.person) updateRequest.person = data.person;
        if (data.variability) updateRequest.variability = data.variability;
        if (data.bannedPhrases)
          updateRequest.banned_phrases = normalizePhrases(data.bannedPhrases);
        if (data.preferredPhrases)
          updateRequest.preferred_phrases = normalizePhrases(
            data.preferredPhrases,
          );

        // Call API to update
        const response = await styleGuidesClient.update(data.id, updateRequest);
        const updatedGuide = mapStyleGuideFromAPI(response);

        // Update local state
        setStyleGuides((prev) =>
          prev.map((guide) => (guide.id === data.id ? updatedGuide : guide)),
        );

        // Update default guide if it was the one being updated
        if (defaultGuide?.id === data.id) {
          setDefaultGuide(updatedGuide);
        }

        toast({
          title: "Guide modifié",
          description: `Le guide a été modifié avec succès.`,
        });

        return updatedGuide;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Erreur lors de la mise à jour";
        setError(errorMessage);
        toast({
          variant: "destructive",
          title: "Erreur",
          description: errorMessage,
        });
        return null;
      } finally {
        setLoading(false);
      }
    },
    [defaultGuide, toast],
  );

  const deleteStyleGuide = useCallback(
    async (id: string): Promise<boolean> => {
      try {
        setLoading(true);
        setError(null);

        // Call API to delete
        await styleGuidesClient.delete(id);

        // Update local state
        setStyleGuides((prev) => prev.filter((guide) => guide.id !== id));

        // Clear default guide if it was deleted
        if (defaultGuide?.id === id) {
          setDefaultGuide(null);
        }

        toast({
          title: "Guide supprimé",
          description: "Le guide a été supprimé avec succès.",
        });

        return true;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Erreur lors de la suppression";
        setError(errorMessage);
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
    [defaultGuide, toast],
  );

  const getStyleGuide = useCallback(
    (id: string): StyleGuide | undefined => {
      return styleGuides.find((guide) => guide.id === id);
    },
    [styleGuides],
  );

  const duplicateStyleGuide = useCallback(
    async (id: string): Promise<StyleGuide | null> => {
      try {
        setLoading(true);
        setError(null);

        const guideToDuplicate = styleGuides.find((guide) => guide.id === id);
        if (!guideToDuplicate) {
          throw new Error("Guide de style non trouvé");
        }

        // Create new guide with "Copie de" prefix
        const duplicateData: CreateStyleGuideData = {
          name: `Copie de ${guideToDuplicate.name}`,
          tone: guideToDuplicate.tone,
          register: guideToDuplicate.register,
          length: guideToDuplicate.length,
          person: guideToDuplicate.person,
          variability: guideToDuplicate.variability,
          bannedPhrases: [...guideToDuplicate.bannedPhrases],
          preferredPhrases: [...guideToDuplicate.preferredPhrases],
        };

        return await createStyleGuide(duplicateData);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Erreur lors de la duplication";
        setError(errorMessage);
        toast({
          variant: "destructive",
          title: "Erreur",
          description: errorMessage,
        });
        return null;
      } finally {
        setLoading(false);
      }
    },
    [styleGuides, createStyleGuide, toast],
  );

  const setDefaultStyleGuide = useCallback(
    async (id: string): Promise<boolean> => {
      try {
        setLoading(true);
        setError(null);

        // Call API to set as default
        const response = await styleGuidesClient.setAsDefault(id);
        const updatedGuide = mapStyleGuideFromAPI(response);

        // Update local state - unset all defaults, then set the new one
        setStyleGuides((prev) =>
          prev.map((guide) => ({
            ...guide,
            // Note: is_default is not in StyleGuide type, but we track it via defaultGuide state
          })),
        );

        setDefaultGuide(updatedGuide);

        toast({
          title: "Guide par défaut",
          description: `"${updatedGuide.name}" est maintenant le guide par défaut.`,
        });

        return true;
      } catch (err) {
        const errorMessage =
          err instanceof Error
            ? err.message
            : "Erreur lors de la définition du guide par défaut";
        setError(errorMessage);
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
    [toast],
  );

  // Fonctions utilitaires
  const getGuidesByTone = useCallback(
    (tone: string): StyleGuide[] => {
      return styleGuides.filter((guide) => guide.tone === tone);
    },
    [styleGuides],
  );

  const getGuidesByLength = useCallback(
    (length: string): StyleGuide[] => {
      return styleGuides.filter((guide) => guide.length === length);
    },
    [styleGuides],
  );

  const getAllTones = useCallback((): string[] => {
    return Array.from(STYLE_GUIDE_TONES);
  }, []);

  const getAllRegisters = useCallback((): string[] => {
    return Array.from(STYLE_GUIDE_REGISTERS);
  }, []);

  const getAllLengths = useCallback((): string[] => {
    return Array.from(STYLE_GUIDE_LENGTHS);
  }, []);

  const applyFilters = useCallback((newFilters: StyleGuideFilters) => {
    setFilters(newFilters);
  }, []);

  const clearFilters = useCallback(() => {
    setFilters({});
  }, []);

  const searchGuides = useCallback((searchTerm: string) => {
    setFilters((prev) => ({ ...prev, search: searchTerm }));
  }, []);

  // Statistiques
  const getStats = useCallback(() => {
    const totalGuides = styleGuides.length;
    const byTone = styleGuides.reduce(
      (acc, guide) => {
        acc[guide.tone] = (acc[guide.tone] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>,
    );

    const byLength = styleGuides.reduce(
      (acc, guide) => {
        acc[guide.length] = (acc[guide.length] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>,
    );

    return {
      total: totalGuides,
      byTone,
      byLength,
      filtered: filteredGuides.length,
    };
  }, [styleGuides, filteredGuides]);

  return {
    // State
    styleGuides: filteredGuides,
    allStyleGuides: styleGuides,
    defaultGuide,
    loading,
    error,
    filters,

    // CRUD operations
    createStyleGuide,
    updateStyleGuide,
    deleteStyleGuide,
    getStyleGuide,

    // Filtering and search
    applyFilters,
    clearFilters,
    searchGuides,

    // Utility functions
    getGuidesByTone,
    getGuidesByLength,
    getAllTones,
    getAllRegisters,
    getAllLengths,
    getStats,

    // Additional operations
    duplicateStyleGuide,
    setDefaultStyleGuide,

    // Refresh function
    refresh: loadStyleGuides,
  };
}
