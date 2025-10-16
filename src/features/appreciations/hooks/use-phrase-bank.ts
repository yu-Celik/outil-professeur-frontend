"use client";

import { useEffect, useState, useCallback } from "react";
import {
  MOCK_PHRASE_BANKS,
  getPhraseBankById,
  getPhraseBanksBySubject,
  getPhraseBanksByScope,
  getGeneralPhraseBank,
  getAllAvailablePhrases,
} from "@/features/appreciations/mocks";
import type { PhraseBank } from "@/types/uml-entities";

export interface PhraseBankFilters {
  subjectId?: string;
  scope?: string;
  search?: string;
}

export interface CreatePhraseBankData {
  scope: string;
  subjectId: string;
  entries: Record<string, unknown>;
}

export interface UpdatePhraseBankData extends Partial<CreatePhraseBankData> {
  id: string;
}

export function usePhraseBank(
  teacherId: string = "KsmNtVf4zwqO3VV3SQJqPrRlQBA1fFyR",
) {
  const [phraseBanks, setPhraseBanks] = useState<PhraseBank[]>([]);
  const [filteredBanks, setFilteredBanks] = useState<PhraseBank[]>([]);
  const [generalBank, setGeneralBank] = useState<PhraseBank | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<PhraseBankFilters>({});

  // Chargement initial des données
  useEffect(() => {
    try {
      setLoading(true);
      setError(null);

      // Charger toutes les banques de phrases
      const banks = MOCK_PHRASE_BANKS.filter(
        (bank) => bank.createdBy === teacherId,
      );
      setPhraseBanks(banks);

      // Définir la banque générale
      const general = getGeneralPhraseBank();
      setGeneralBank(general || null);

      setLoading(false);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Erreur lors du chargement",
      );
      setLoading(false);
    }
  }, [teacherId]);

  // Filtrage des banques
  useEffect(() => {
    let filtered = [...phraseBanks];

    if (filters.subjectId) {
      filtered = filtered.filter(
        (bank) =>
          bank.subjectId === filters.subjectId || bank.scope === "general",
      );
    }

    if (filters.scope) {
      filtered = filtered.filter((bank) => bank.scope === filters.scope);
    }

    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      filtered = filtered.filter((bank) => {
        const entries = JSON.stringify(bank.entries).toLowerCase();
        return (
          bank.scope.toLowerCase().includes(searchTerm) ||
          bank.subjectId.toLowerCase().includes(searchTerm) ||
          entries.includes(searchTerm)
        );
      });
    }

    setFilteredBanks(filtered);
  }, [phraseBanks, filters]);

  // CRUD Operations
  const createPhraseBank = useCallback(
    async (data: CreatePhraseBankData): Promise<PhraseBank | null> => {
      try {
        setLoading(true);
        setError(null);

        const newBank: PhraseBank = {
          id: `phrase-bank-${data.scope}-${data.subjectId}-${Date.now()}`,
          createdBy: teacherId,
          scope: data.scope,
          subjectId: data.subjectId,
          entries: data.entries,
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        // Simuler un délai d'API
        await new Promise((resolve) => setTimeout(resolve, 500));

        setPhraseBanks((prev) => [...prev, newBank]);
        return newBank;
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

  const updatePhraseBank = useCallback(
    async (data: UpdatePhraseBankData): Promise<PhraseBank | null> => {
      try {
        setLoading(true);
        setError(null);

        const bankIndex = phraseBanks.findIndex((bank) => bank.id === data.id);
        if (bankIndex === -1) {
          throw new Error("Banque de phrases non trouvée");
        }

        const updatedBank: PhraseBank = {
          ...phraseBanks[bankIndex],
          ...data,
          updatedAt: new Date(),
        };

        // Simuler un délai d'API
        await new Promise((resolve) => setTimeout(resolve, 500));

        const updatedBanks = [...phraseBanks];
        updatedBanks[bankIndex] = updatedBank;
        setPhraseBanks(updatedBanks);

        return updatedBank;
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Erreur lors de la mise à jour",
        );
        return null;
      } finally {
        setLoading(false);
      }
    },
    [phraseBanks],
  );

  const deletePhraseBank = useCallback(
    async (id: string): Promise<boolean> => {
      try {
        setLoading(true);
        setError(null);

        const bankExists = phraseBanks.some((bank) => bank.id === id);
        if (!bankExists) {
          throw new Error("Banque de phrases non trouvée");
        }

        // Simuler un délai d'API
        await new Promise((resolve) => setTimeout(resolve, 500));

        setPhraseBanks((prev) => prev.filter((bank) => bank.id !== id));
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
    [phraseBanks],
  );

  const getPhraseBank = useCallback((id: string): PhraseBank | undefined => {
    return getPhraseBankById(id);
  }, []);

  // Fonctions utilitaires pour les phrases
  const getBanksBySubject = useCallback((subjectId: string): PhraseBank[] => {
    return getPhraseBanksBySubject(subjectId);
  }, []);

  const getBanksByScope = useCallback((scope: string): PhraseBank[] => {
    return getPhraseBanksByScope(scope);
  }, []);

  const getAllPhrases = useCallback(
    (subjectId?: string): Record<string, string[]> => {
      return getAllAvailablePhrases(subjectId);
    },
    [],
  );

  const getPhrasesForCategory = useCallback(
    (category: string, subjectId?: string): string[] => {
      const allPhrases = getAllAvailablePhrases(subjectId);
      return allPhrases[category] || [];
    },
    [],
  );

  const addPhraseToBank = useCallback(
    async (
      bankId: string,
      category: string,
      phrase: string,
      subcategory?: string,
    ): Promise<boolean> => {
      try {
        setLoading(true);
        setError(null);

        const bank = phraseBanks.find((b) => b.id === bankId);
        if (!bank) {
          throw new Error("Banque de phrases non trouvée");
        }

        const updatedEntries = { ...bank.entries };

        if (subcategory) {
          if (!updatedEntries[category]) {
            updatedEntries[category] = {};
          }
          const categoryObj = updatedEntries[category] as Record<
            string,
            string[]
          >;
          if (!categoryObj[subcategory]) {
            categoryObj[subcategory] = [];
          }
          categoryObj[subcategory].push(phrase);
        } else {
          if (!updatedEntries[category]) {
            updatedEntries[category] = [];
          }
          (updatedEntries[category] as string[]).push(phrase);
        }

        const updateResult = await updatePhraseBank({
          id: bankId,
          entries: updatedEntries,
        });

        return updateResult !== null;
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Erreur lors de l'ajout de phrase",
        );
        return false;
      } finally {
        setLoading(false);
      }
    },
    [phraseBanks, updatePhraseBank],
  );

  const removePhraseFromBank = useCallback(
    async (
      bankId: string,
      category: string,
      phraseIndex: number,
      subcategory?: string,
    ): Promise<boolean> => {
      try {
        setLoading(true);
        setError(null);

        const bank = phraseBanks.find((b) => b.id === bankId);
        if (!bank) {
          throw new Error("Banque de phrases non trouvée");
        }

        const updatedEntries = { ...bank.entries };

        if (subcategory) {
          const categoryObj = updatedEntries[category] as Record<
            string,
            string[]
          >;
          if (categoryObj && categoryObj[subcategory]) {
            categoryObj[subcategory].splice(phraseIndex, 1);
          }
        } else {
          const categoryArray = updatedEntries[category] as string[];
          if (categoryArray) {
            categoryArray.splice(phraseIndex, 1);
          }
        }

        const updateResult = await updatePhraseBank({
          id: bankId,
          entries: updatedEntries,
        });

        return updateResult !== null;
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Erreur lors de la suppression de phrase",
        );
        return false;
      } finally {
        setLoading(false);
      }
    },
    [phraseBanks, updatePhraseBank],
  );

  // Fonctions de filtrage
  const applyFilters = useCallback((newFilters: PhraseBankFilters) => {
    setFilters(newFilters);
  }, []);

  const clearFilters = useCallback(() => {
    setFilters({});
  }, []);

  const searchBanks = useCallback((searchTerm: string) => {
    setFilters((prev) => ({ ...prev, search: searchTerm }));
  }, []);

  // Statistiques
  const getStats = useCallback(() => {
    const totalBanks = phraseBanks.length;
    const byScope = phraseBanks.reduce(
      (acc, bank) => {
        acc[bank.scope] = (acc[bank.scope] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>,
    );

    const totalPhrases = phraseBanks.reduce((acc, bank) => {
      const entries = bank.entries;
      let count = 0;

      Object.values(entries).forEach((entry) => {
        if (Array.isArray(entry)) {
          count += entry.length;
        } else if (typeof entry === "object" && entry !== null) {
          Object.values(entry).forEach((subEntry) => {
            if (Array.isArray(subEntry)) {
              count += subEntry.length;
            }
          });
        }
      });

      return acc + count;
    }, 0);

    return {
      totalBanks,
      byScope,
      totalPhrases,
      filtered: filteredBanks.length,
    };
  }, [phraseBanks, filteredBanks]);

  return {
    // State
    phraseBanks: filteredBanks,
    allPhraseBanks: phraseBanks,
    generalBank,
    loading,
    error,
    filters,

    // CRUD operations
    createPhraseBank,
    updatePhraseBank,
    deletePhraseBank,
    getPhraseBank,

    // Phrase management
    addPhraseToBank,
    removePhraseFromBank,

    // Filtering and search
    applyFilters,
    clearFilters,
    searchBanks,

    // Utility functions
    getBanksBySubject,
    getBanksByScope,
    getAllPhrases,
    getPhrasesForCategory,
    getStats,

    // Refresh function
    refresh: () => {
      setPhraseBanks([
        ...MOCK_PHRASE_BANKS.filter((bank) => bank.createdBy === teacherId),
      ]);
      setError(null);
    },
  };
}
