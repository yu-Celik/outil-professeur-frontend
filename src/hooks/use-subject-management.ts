import { useState, useCallback } from "react";
import type { Subject } from "@/types/uml-entities";
import { MOCK_SUBJECTS } from "@/data/mock-subjects";

interface SubjectFormData {
  name: string;
  code: string;
  description: string;
}

interface UseSubjectManagementReturn {
  subjects: Subject[];
  loading: boolean;
  error: string | null;
  createSubject: (data: SubjectFormData) => Promise<Subject>;
  updateSubject: (id: string, data: SubjectFormData) => Promise<Subject>;
  deleteSubject: (id: string) => Promise<void>;
  getSubjectById: (id: string) => Subject | undefined;
  getSubjectByCode: (code: string) => Subject | undefined;
  searchSubjects: (query: string) => Subject[];
}

export function useSubjectManagement(): UseSubjectManagementReturn {
  const [subjects, setSubjects] = useState<Subject[]>(MOCK_SUBJECTS);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createSubject = useCallback(async (data: SubjectFormData): Promise<Subject> => {
    setLoading(true);
    setError(null);

    try {
      // Simuler un délai API
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Vérifier la duplication par code
      const codeExists = subjects.some(
        (subject) => subject.code.toLowerCase() === data.code.toLowerCase()
      );

      if (codeExists) {
        throw new Error("Une matière avec ce code existe déjà");
      }

      // Vérifier la duplication par nom
      const nameExists = subjects.some(
        (subject) => subject.name.toLowerCase() === data.name.toLowerCase()
      );

      if (nameExists) {
        throw new Error("Une matière avec ce nom existe déjà");
      }

      const newSubject: Subject = {
        id: `subject-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        createdBy: "current-user-id", // À remplacer par l'ID de l'utilisateur connecté
        name: data.name,
        code: data.code.toUpperCase(),
        description: data.description,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      setSubjects((prev) => [...prev, newSubject]);
      return newSubject;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Erreur lors de la création de la matière";
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [subjects]);

  const updateSubject = useCallback(async (id: string, data: SubjectFormData): Promise<Subject> => {
    setLoading(true);
    setError(null);

    try {
      // Simuler un délai API
      await new Promise((resolve) => setTimeout(resolve, 500));

      const existingSubject = subjects.find((subject) => subject.id === id);
      if (!existingSubject) {
        throw new Error("Matière introuvable");
      }

      // Vérifier la duplication par code (exclure la matière actuelle)
      const codeExists = subjects.some(
        (subject) => 
          subject.id !== id && 
          subject.code.toLowerCase() === data.code.toLowerCase()
      );

      if (codeExists) {
        throw new Error("Une matière avec ce code existe déjà");
      }

      // Vérifier la duplication par nom (exclure la matière actuelle)
      const nameExists = subjects.some(
        (subject) => 
          subject.id !== id && 
          subject.name.toLowerCase() === data.name.toLowerCase()
      );

      if (nameExists) {
        throw new Error("Une matière avec ce nom existe déjà");
      }

      const updatedSubject: Subject = {
        ...existingSubject,
        name: data.name,
        code: data.code.toUpperCase(),
        description: data.description,
        updatedAt: new Date(),
      };

      setSubjects((prev) => prev.map((subject) => (subject.id === id ? updatedSubject : subject)));
      return updatedSubject;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Erreur lors de la modification de la matière";
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [subjects]);

  const deleteSubject = useCallback(async (id: string): Promise<void> => {
    setLoading(true);
    setError(null);

    try {
      // Simuler un délai API
      await new Promise((resolve) => setTimeout(resolve, 300));

      const existingSubject = subjects.find((subject) => subject.id === id);
      if (!existingSubject) {
        throw new Error("Matière introuvable");
      }

      // Vérifier s'il y a des données liées (sessions de cours, examens, etc.)
      // Pour l'instant, on permet la suppression directe
      // Dans un vrai système, on vérifierait les relations avec:
      // - TeachingAssignments
      // - CourseSessions
      // - Exams
      
      setSubjects((prev) => prev.filter((subject) => subject.id !== id));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Erreur lors de la suppression de la matière";
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [subjects]);

  const getSubjectById = useCallback((id: string): Subject | undefined => {
    return subjects.find((subject) => subject.id === id);
  }, [subjects]);

  const getSubjectByCode = useCallback((code: string): Subject | undefined => {
    return subjects.find((subject) => subject.code.toLowerCase() === code.toLowerCase());
  }, [subjects]);

  const searchSubjects = useCallback((query: string): Subject[] => {
    if (!query.trim()) {
      return subjects;
    }

    const searchTerm = query.toLowerCase().trim();
    
    return subjects.filter((subject) => 
      subject.name.toLowerCase().includes(searchTerm) ||
      subject.code.toLowerCase().includes(searchTerm) ||
      subject.description.toLowerCase().includes(searchTerm)
    );
  }, [subjects]);

  return {
    subjects,
    loading,
    error,
    createSubject,
    updateSubject,
    deleteSubject,
    getSubjectById,
    getSubjectByCode,
    searchSubjects,
  };
}