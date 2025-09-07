import { useState, useCallback } from "react";
import type { Class, SchoolYear } from "@/types/uml-entities";
import { MOCK_CLASSES } from "@/data/mock-classes";
import { MOCK_SCHOOL_YEARS } from "@/data/mock-school-years";

interface ClassFormData {
  classCode: string;
  gradeLabel: string;
  schoolYearId: string;
}

interface UseClassManagementReturn {
  classes: Class[];
  schoolYears: SchoolYear[];
  loading: boolean;
  error: string | null;
  createClass: (data: ClassFormData) => Promise<Class>;
  updateClass: (id: string, data: ClassFormData) => Promise<Class>;
  deleteClass: (id: string) => Promise<void>;
  getClassById: (id: string) => Class | undefined;
  getClassesBySchoolYear: (schoolYearId: string) => Class[];
}

export function useClassManagement(): UseClassManagementReturn {
  const [classes, setClasses] = useState<Class[]>(MOCK_CLASSES);
  const [schoolYears] = useState<SchoolYear[]>(MOCK_SCHOOL_YEARS);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createClass = useCallback(async (data: ClassFormData): Promise<Class> => {
    setLoading(true);
    setError(null);

    try {
      // Simuler un délai API
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Vérifier la duplication
      const exists = classes.some(
        (cls) => cls.classCode === data.classCode && cls.schoolYearId === data.schoolYearId
      );

      if (exists) {
        throw new Error("Une classe avec ce code existe déjà pour cette année scolaire");
      }

      const newClass: Class = {
        id: `class-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        createdBy: "current-user-id", // À remplacer par l'ID de l'utilisateur connecté
        classCode: data.classCode,
        gradeLabel: data.gradeLabel,
        schoolYearId: data.schoolYearId,
        createdAt: new Date(),
        updatedAt: new Date(),
        assignStudent: (studentId: string) => {
          console.log("Assign student:", studentId);
        },
        transferStudent: (studentId: string, toClassId: string) => {
          console.log("Transfer student:", studentId, "to:", toClassId);
        },
        getStudents: () => [],
        getSessions: () => [],
        getExams: () => [],
      };

      setClasses((prev) => [...prev, newClass]);
      return newClass;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Erreur lors de la création de la classe";
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [classes]);

  const updateClass = useCallback(async (id: string, data: ClassFormData): Promise<Class> => {
    setLoading(true);
    setError(null);

    try {
      // Simuler un délai API
      await new Promise((resolve) => setTimeout(resolve, 500));

      const existingClass = classes.find((cls) => cls.id === id);
      if (!existingClass) {
        throw new Error("Classe introuvable");
      }

      // Vérifier la duplication (exclure la classe actuelle)
      const exists = classes.some(
        (cls) => 
          cls.id !== id && 
          cls.classCode === data.classCode && 
          cls.schoolYearId === data.schoolYearId
      );

      if (exists) {
        throw new Error("Une classe avec ce code existe déjà pour cette année scolaire");
      }

      const updatedClass: Class = {
        ...existingClass,
        classCode: data.classCode,
        gradeLabel: data.gradeLabel,
        schoolYearId: data.schoolYearId,
        updatedAt: new Date(),
      };

      setClasses((prev) => prev.map((cls) => (cls.id === id ? updatedClass : cls)));
      return updatedClass;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Erreur lors de la modification de la classe";
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [classes]);

  const deleteClass = useCallback(async (id: string): Promise<void> => {
    setLoading(true);
    setError(null);

    try {
      // Simuler un délai API
      await new Promise((resolve) => setTimeout(resolve, 300));

      const existingClass = classes.find((cls) => cls.id === id);
      if (!existingClass) {
        throw new Error("Classe introuvable");
      }

      // Vérifier s'il y a des élèves associés
      const hasStudents = existingClass.getStudents().length > 0;
      if (hasStudents) {
        throw new Error("Impossible de supprimer une classe qui contient des élèves");
      }

      setClasses((prev) => prev.filter((cls) => cls.id !== id));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Erreur lors de la suppression de la classe";
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [classes]);

  const getClassById = useCallback((id: string): Class | undefined => {
    return classes.find((cls) => cls.id === id);
  }, [classes]);

  const getClassesBySchoolYear = useCallback((schoolYearId: string): Class[] => {
    return classes.filter((cls) => cls.schoolYearId === schoolYearId);
  }, [classes]);

  return {
    classes,
    schoolYears,
    loading,
    error,
    createClass,
    updateClass,
    deleteClass,
    getClassById,
    getClassesBySchoolYear,
  };
}