"use client";

import { useState, useEffect, useCallback } from "react";
import type { AcademicStructure } from "@/types/uml-entities";
import {
  MOCK_ACADEMIC_STRUCTURES,
  ACADEMIC_STRUCTURE_TEMPLATES,
  getAcademicStructureById,
  getAcademicStructuresByTeacher
} from "@/features/gestion/mocks";

interface UseAcademicStructuresOptions {
  teacherId?: string;
}

interface CreateAcademicStructureData {
  name: string;
  periodModel: string;
  periodsPerYear: number;
  periodNames: Record<string, string>;
}

interface UpdateAcademicStructureData extends Partial<CreateAcademicStructureData> {
  id: string;
}

export function useAcademicStructures(options: UseAcademicStructuresOptions = {}) {
  const { teacherId } = options;

  const [academicStructures, setAcademicStructures] = useState<AcademicStructure[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Charger les structures académiques
  const loadAcademicStructures = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      // Simuler un délai d'API
      await new Promise(resolve => setTimeout(resolve, 100));

      const structures = teacherId
        ? getAcademicStructuresByTeacher(teacherId)
        : MOCK_ACADEMIC_STRUCTURES;

      setAcademicStructures(structures);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur lors du chargement des structures académiques");
    } finally {
      setLoading(false);
    }
  }, [teacherId]);

  // Créer une nouvelle structure académique
  const createAcademicStructure = useCallback(async (data: CreateAcademicStructureData): Promise<AcademicStructure> => {
    setLoading(true);
    setError(null);

    try {
      // Vérifier la contrainte : 1 structure max par professeur
      const existingStructure = academicStructures.find(s => s.createdBy === (teacherId || "current-user"));
      if (existingStructure) {
        throw new Error("Vous avez déjà une structure académique. Vous ne pouvez en avoir qu'une seule.");
      }

      // Simuler un délai d'API
      await new Promise(resolve => setTimeout(resolve, 200));

      const newStructure: AcademicStructure = {
        id: `structure-${Date.now()}`,
        createdBy: teacherId || "current-user",
        name: data.name,
        periodModel: data.periodModel,
        periodsPerYear: data.periodsPerYear,
        periodNames: data.periodNames,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      // Ajouter à la liste locale (en production, ce serait une API call)
      setAcademicStructures(prev => [...prev, newStructure]);

      return newStructure;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Erreur lors de la création de la structure académique";
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [teacherId, academicStructures]);

  // Mettre à jour une structure académique
  const updateAcademicStructure = useCallback(async (data: UpdateAcademicStructureData): Promise<AcademicStructure> => {
    setLoading(true);
    setError(null);

    try {
      // Simuler un délai d'API
      await new Promise(resolve => setTimeout(resolve, 200));

      const existingStructure = getAcademicStructureById(data.id);
      if (!existingStructure) {
        throw new Error("Structure académique non trouvée");
      }

      const updatedStructure: AcademicStructure = {
        ...existingStructure,
        ...data,
        updatedAt: new Date(),
      };

      // Mettre à jour dans la liste locale
      setAcademicStructures(prev =>
        prev.map(structure =>
          structure.id === data.id ? updatedStructure : structure
        )
      );

      return updatedStructure;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Erreur lors de la mise à jour de la structure académique";
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  // Supprimer une structure académique
  const deleteAcademicStructure = useCallback(async (id: string): Promise<void> => {
    setLoading(true);
    setError(null);

    try {
      // Simuler un délai d'API
      await new Promise(resolve => setTimeout(resolve, 200));

      // Vérifier si la structure existe
      const existingStructure = getAcademicStructureById(id);
      if (!existingStructure) {
        throw new Error("Structure académique non trouvée");
      }

      // Supprimer de la liste locale
      setAcademicStructures(prev => prev.filter(structure => structure.id !== id));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Erreur lors de la suppression de la structure académique";
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  // Créer une structure à partir d'un template
  const createFromTemplate = useCallback(async (templateKey: string, customName?: string): Promise<AcademicStructure> => {
    const template = ACADEMIC_STRUCTURE_TEMPLATES[templateKey as keyof typeof ACADEMIC_STRUCTURE_TEMPLATES];
    if (!template) {
      throw new Error("Template non trouvé");
    }

    return createAcademicStructure({
      name: customName || template.name,
      periodModel: template.periodModel,
      periodsPerYear: template.periodsPerYear,
      periodNames: template.periodNames,
    });
  }, [createAcademicStructure]);

  // Obtenir une structure par ID
  const getStructureById = useCallback((id: string): AcademicStructure | undefined => {
    return academicStructures.find(structure => structure.id === id);
  }, [academicStructures]);

  // Obtenir la structure du professeur (1 max)
  const getTeacherStructure = useCallback((): AcademicStructure | undefined => {
    return academicStructures.find(structure => structure.createdBy === (teacherId || "current-user"));
  }, [academicStructures, teacherId]);

  // Vérifier si le professeur a déjà une structure
  const hasActiveStructure = useCallback((): boolean => {
    return getTeacherStructure() !== undefined;
  }, [getTeacherStructure]);

  // Valider une structure académique
  const validateStructure = useCallback((data: CreateAcademicStructureData): { isValid: boolean; errors: string[] } => {
    const errors: string[] = [];

    if (!data.name?.trim()) {
      errors.push("Le nom de la structure est requis");
    }

    if (!data.periodModel?.trim()) {
      errors.push("Le modèle de période est requis");
    }

    if (!data.periodsPerYear || data.periodsPerYear < 1 || data.periodsPerYear > 12) {
      errors.push("Le nombre de périodes doit être entre 1 et 12");
    }

    if (!data.periodNames || Object.keys(data.periodNames).length !== data.periodsPerYear) {
      errors.push("Le nombre de noms de périodes doit correspondre au nombre de périodes");
    }

    // Vérifier que tous les noms de périodes sont définis
    for (let i = 1; i <= data.periodsPerYear; i++) {
      if (!data.periodNames[i.toString()]?.trim()) {
        errors.push(`Le nom de la période ${i} est requis`);
      }
    }

    return { isValid: errors.length === 0, errors };
  }, []);

  // Exporter une structure
  const exportStructure = useCallback((id: string): string => {
    const structure = getStructureById(id);
    if (!structure) {
      throw new Error("Structure non trouvée");
    }

    const exportData = {
      name: structure.name,
      periodModel: structure.periodModel,
      periodsPerYear: structure.periodsPerYear,
      periodNames: structure.periodNames,
      exportedAt: new Date().toISOString(),
    };

    return JSON.stringify(exportData, null, 2);
  }, [getStructureById]);

  // Importer une structure
  const importStructure = useCallback(async (jsonData: string): Promise<AcademicStructure> => {
    try {
      const data = JSON.parse(jsonData);

      const structureData: CreateAcademicStructureData = {
        name: data.name || "Structure importée",
        periodModel: data.periodModel,
        periodsPerYear: data.periodsPerYear,
        periodNames: data.periodNames,
      };

      const validation = validateStructure(structureData);
      if (!validation.isValid) {
        throw new Error(`Données invalides: ${validation.errors.join(", ")}`);
      }

      return createAcademicStructure(structureData);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Erreur lors de l'importation";
      throw new Error(`Erreur d'importation: ${errorMessage}`);
    }
  }, [createAcademicStructure, validateStructure]);

  // Charger les données au montage
  useEffect(() => {
    loadAcademicStructures();
  }, [loadAcademicStructures]);

  return {
    academicStructures,
    loading,
    error,
    createAcademicStructure,
    updateAcademicStructure,
    deleteAcademicStructure,
    createFromTemplate,
    getStructureById,
    getTeacherStructure,
    hasActiveStructure,
    validateStructure,
    exportStructure,
    importStructure,
    templates: ACADEMIC_STRUCTURE_TEMPLATES,
    reload: loadAcademicStructures,
  };
}