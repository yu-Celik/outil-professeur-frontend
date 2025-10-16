"use client";

import { useEffect, useState, useCallback } from "react";
import {
  MOCK_STYLE_GUIDES,
  getStyleGuideById,
  getStyleGuidesByTone,
  getStyleGuidesByLength,
  getDefaultStyleGuide,
  getAllStyleGuideTones,
  getAllStyleGuideRegisters,
  getAllStyleGuideLengths,
} from "@/features/appreciations/mocks";
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
  const [styleGuides, setStyleGuides] = useState<StyleGuide[]>([]);
  const [filteredGuides, setFilteredGuides] = useState<StyleGuide[]>([]);
  const [defaultGuide, setDefaultGuide] = useState<StyleGuide | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<StyleGuideFilters>({});

  // Chargement initial des données
  useEffect(() => {
    try {
      setLoading(true);
      setError(null);

      // Charger tous les guides de style
      const guides = MOCK_STYLE_GUIDES.filter(
        (guide) => guide.createdBy === teacherId,
      );
      setStyleGuides(guides);

      // Définir le guide par défaut
      const defaultStyleGuide = getDefaultStyleGuide();
      setDefaultGuide(defaultStyleGuide);

      setLoading(false);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Erreur lors du chargement",
      );
      setLoading(false);
    }
  }, [teacherId]);

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

        const newGuide: StyleGuide = {
          id: `style-guide-${Date.now()}`,
          createdBy: teacherId,
          name: data.name,
          tone: data.tone,
          register: data.register,
          length: data.length,
          person: data.person,
          variability: data.variability,
          bannedPhrases: data.bannedPhrases,
          preferredPhrases: data.preferredPhrases,
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        // Simuler un délai d'API
        await new Promise((resolve) => setTimeout(resolve, 500));

        setStyleGuides((prev) => [...prev, newGuide]);
        return newGuide;
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Erreur lors de la création",
        );
        return null;
      } finally {
        setLoading(false);
      }
    },
    [teacherId],
  );

  const updateStyleGuide = useCallback(
    async (data: UpdateStyleGuideData): Promise<StyleGuide | null> => {
      try {
        setLoading(true);
        setError(null);

        const guideIndex = styleGuides.findIndex(
          (guide) => guide.id === data.id,
        );
        if (guideIndex === -1) {
          throw new Error("Guide de style non trouvé");
        }

        const updatedGuide: StyleGuide = {
          ...styleGuides[guideIndex],
          ...data,
          updatedAt: new Date(),
        };

        // Simuler un délai d'API
        await new Promise((resolve) => setTimeout(resolve, 500));

        const updatedGuides = [...styleGuides];
        updatedGuides[guideIndex] = updatedGuide;
        setStyleGuides(updatedGuides);

        return updatedGuide;
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Erreur lors de la mise à jour",
        );
        return null;
      } finally {
        setLoading(false);
      }
    },
    [styleGuides],
  );

  const deleteStyleGuide = useCallback(
    async (id: string): Promise<boolean> => {
      try {
        setLoading(true);
        setError(null);

        const guideExists = styleGuides.some((guide) => guide.id === id);
        if (!guideExists) {
          throw new Error("Guide de style non trouvé");
        }

        // Simuler un délai d'API
        await new Promise((resolve) => setTimeout(resolve, 500));

        setStyleGuides((prev) => prev.filter((guide) => guide.id !== id));
        return true;
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Erreur lors de la suppression",
        );
        return false;
      } finally {
        setLoading(false);
      }
    },
    [styleGuides],
  );

  const getStyleGuide = useCallback((id: string): StyleGuide | undefined => {
    return getStyleGuideById(id);
  }, []);

  // Fonctions utilitaires
  const getGuidesByTone = useCallback((tone: string): StyleGuide[] => {
    return getStyleGuidesByTone(tone);
  }, []);

  const getGuidesByLength = useCallback((length: string): StyleGuide[] => {
    return getStyleGuidesByLength(length);
  }, []);

  const getAllTones = useCallback((): string[] => {
    return getAllStyleGuideTones();
  }, []);

  const getAllRegisters = useCallback((): string[] => {
    return getAllStyleGuideRegisters();
  }, []);

  const getAllLengths = useCallback((): string[] => {
    return getAllStyleGuideLengths();
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

    // Refresh function
    refresh: () => {
      setStyleGuides([
        ...MOCK_STYLE_GUIDES.filter((guide) => guide.createdBy === teacherId),
      ]);
      setError(null);
    },
  };
}
