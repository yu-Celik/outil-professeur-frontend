/**
 * Subject Management Hook
 * Provides CRUD operations for subjects with API integration
 */

"use client";

import { useState, useEffect, useCallback } from "react";
import type { Subject } from "@/types/uml-entities";
import {
  subjectsClient,
  type SubjectResponse,
  type CreateSubjectRequest,
  type UpdateSubjectRequest,
} from "@/features/gestion/api";
import { MOCK_SUBJECTS } from "@/features/gestion/mocks";

// ============================================================================
// Type Definitions
// ============================================================================

export interface SubjectFormData {
  name: string;
  code: string;
  description: string;
}

interface UseSubjectManagementOptions {
  teacherId?: string;
  useMockData?: boolean; // Flag to use mock data instead of API
}

export interface UseSubjectManagementReturn {
  // State
  subjects: Subject[];
  loading: boolean;
  error: string | null;

  // CRUD operations
  createSubject: (data: SubjectFormData) => Promise<Subject>;
  updateSubject: (id: string, data: SubjectFormData, etag?: string) => Promise<Subject>;
  deleteSubject: (id: string) => Promise<void>;

  // Utility methods
  getSubjectById: (id: string) => Subject | undefined;
  getSubjectByCode: (code: string) => Subject | undefined;
  searchSubjects: (query: string) => Subject[];

  // Validation
  validateForm: (
    data: SubjectFormData,
    excludeId?: string,
  ) => Record<keyof SubjectFormData, string | null>;
  hasValidationErrors: (
    errors: Record<keyof SubjectFormData, string | null>,
  ) => boolean;

  // Refresh
  refresh: () => void;
}

// ============================================================================
// Mapper Functions: API (snake_case) ↔ UML (camelCase)
// ============================================================================

function apiResponseToSubject(response: SubjectResponse, teacherId: string): Subject {
  return {
    id: response.id,
    createdBy: response.teacher_id,
    name: response.name,
    code: response.code,
    description: response.description,
    createdAt: new Date(response.created_at),
    updatedAt: new Date(response.updated_at),
    getTeachingAssignments: () => [],
    getSessions: () => [],
    getExams: () => [],
  };
}

function subjectFormDataToCreateRequest(
  data: SubjectFormData,
): CreateSubjectRequest {
  return {
    name: data.name.trim(),
    code: data.code.trim().toUpperCase(), // Normalisation en majuscule
    description: data.description.trim() || undefined,
  };
}

function subjectFormDataToUpdateRequest(
  data: SubjectFormData,
): UpdateSubjectRequest {
  return {
    name: data.name.trim(),
    code: data.code.trim().toUpperCase(),
    description: data.description.trim() || undefined,
  };
}

// ============================================================================
// Validation Functions
// ============================================================================

function validateSubjectForm(
  data: SubjectFormData,
  subjects: Subject[],
  excludeId?: string,
): Record<keyof SubjectFormData, string | null> {
  const errors: Record<keyof SubjectFormData, string | null> = {
    name: null,
    code: null,
    description: null,
  };

  // Validate name
  if (!data.name || data.name.trim() === "") {
    errors.name = "Le nom de la matière est requis";
  } else if (data.name.trim().length < 2) {
    errors.name = "Le nom doit contenir au moins 2 caractères";
  } else if (data.name.trim().length > 100) {
    errors.name = "Le nom ne peut pas dépasser 100 caractères";
  } else {
    // Check uniqueness
    const isDuplicate = subjects.some(
      (s) => s.id !== excludeId && s.name.toLowerCase() === data.name.trim().toLowerCase(),
    );
    if (isDuplicate) {
      errors.name = "Une matière avec ce nom existe déjà";
    }
  }

  // Validate code
  if (!data.code || data.code.trim() === "") {
    errors.code = "Le code de la matière est requis";
  } else if (data.code.trim().length < 2) {
    errors.code = "Le code doit contenir au moins 2 caractères";
  } else if (data.code.trim().length > 10) {
    errors.code = "Le code ne peut pas dépasser 10 caractères";
  } else {
    // Check uniqueness (case-insensitive)
    const isDuplicate = subjects.some(
      (s) => s.id !== excludeId && s.code.toLowerCase() === data.code.trim().toLowerCase(),
    );
    if (isDuplicate) {
      errors.code = "Une matière avec ce code existe déjà";
    }
  }

  // Validate description (optional)
  if (data.description && data.description.length > 500) {
    errors.description = "La description ne peut pas dépasser 500 caractères";
  }

  return errors;
}

function hasValidationErrors(
  errors: Record<keyof SubjectFormData, string | null>,
): boolean {
  return Object.values(errors).some((error) => error !== null);
}

// ============================================================================
// Main Hook
// ============================================================================

export function useSubjectManagement(
  options: UseSubjectManagementOptions = {},
): UseSubjectManagementReturn {
  const { teacherId = "current-user", useMockData = false } = options;

  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ============================================================================
  // Load Subjects
  // ============================================================================

  const loadSubjects = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      if (useMockData) {
        // Use mock data for tests
        await new Promise((resolve) => setTimeout(resolve, 100));
        setSubjects(MOCK_SUBJECTS);
      } else {
        // Fetch from API
        const response = await subjectsClient.list();
        const mapped = response.items.map((item) =>
          apiResponseToSubject(item, teacherId),
        );
        setSubjects(mapped);
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Erreur lors du chargement des matières";
      setError(errorMessage);
      console.error("Failed to load subjects:", err);
    } finally {
      setLoading(false);
    }
  }, [teacherId, useMockData]);

  // ============================================================================
  // Create Subject
  // ============================================================================

  const createSubject = useCallback(
    async (data: SubjectFormData): Promise<Subject> => {
      setLoading(true);
      setError(null);

      try {
        // Validate form
        const errors = validateSubjectForm(data, subjects);
        if (hasValidationErrors(errors)) {
          const firstError = Object.values(errors).find((err) => err !== null);
          throw new Error(firstError || "Erreur de validation");
        }

        if (useMockData) {
          // Mock implementation
          await new Promise((resolve) => setTimeout(resolve, 200));

          const newSubject: Subject = {
            id: `subject-${Date.now()}`,
            createdBy: teacherId,
            name: data.name.trim(),
            code: data.code.trim().toUpperCase(),
            description: data.description.trim(),
            createdAt: new Date(),
            updatedAt: new Date(),
            getTeachingAssignments: () => [],
            getSessions: () => [],
            getExams: () => [],
          };

          setSubjects((prev) => [...prev, newSubject]);
          return newSubject;
        } else {
          // API implementation with Idempotency-Key
          const idempotencyKey = crypto.randomUUID();
          const request = subjectFormDataToCreateRequest(data);
          const response = await subjectsClient.create(request, idempotencyKey);
          const newSubject = apiResponseToSubject(response, teacherId);

          setSubjects((prev) => [...prev, newSubject]);
          return newSubject;
        }
      } catch (err) {
        const errorMessage =
          err instanceof Error
            ? err.message
            : "Erreur lors de la création de la matière";
        setError(errorMessage);
        throw new Error(errorMessage);
      } finally {
        setLoading(false);
      }
    },
    [teacherId, subjects, useMockData],
  );

  // ============================================================================
  // Update Subject
  // ============================================================================

  const updateSubject = useCallback(
    async (
      id: string,
      data: SubjectFormData,
      etag?: string,
    ): Promise<Subject> => {
      setLoading(true);
      setError(null);

      try {
        // Validate form
        const errors = validateSubjectForm(data, subjects, id);
        if (hasValidationErrors(errors)) {
          const firstError = Object.values(errors).find((err) => err !== null);
          throw new Error(firstError || "Erreur de validation");
        }

        if (useMockData) {
          // Mock implementation
          await new Promise((resolve) => setTimeout(resolve, 200));

          const existing = subjects.find((s) => s.id === id);
          if (!existing) {
            throw new Error("Matière non trouvée");
          }

          const updated: Subject = {
            ...existing,
            name: data.name.trim(),
            code: data.code.trim().toUpperCase(),
            description: data.description.trim(),
            updatedAt: new Date(),
          };

          setSubjects((prev) => prev.map((s) => (s.id === id ? updated : s)));
          return updated;
        } else {
          // API implementation with ETag support
          const request = subjectFormDataToUpdateRequest(data);
          const response = await subjectsClient.update(id, request, etag);
          const updated = apiResponseToSubject(response, teacherId);

          setSubjects((prev) => prev.map((s) => (s.id === id ? updated : s)));
          return updated;
        }
      } catch (err) {
        const errorMessage =
          err instanceof Error
            ? err.message
            : "Erreur lors de la mise à jour de la matière";
        setError(errorMessage);
        throw new Error(errorMessage);
      } finally {
        setLoading(false);
      }
    },
    [teacherId, subjects, useMockData],
  );

  // ============================================================================
  // Delete Subject
  // ============================================================================

  const deleteSubject = useCallback(
    async (id: string): Promise<void> => {
      setLoading(true);
      setError(null);

      try {
        if (useMockData) {
          // Mock implementation
          await new Promise((resolve) => setTimeout(resolve, 200));

          const exists = subjects.some((s) => s.id === id);
          if (!exists) {
            throw new Error("Matière non trouvée");
          }

          setSubjects((prev) => prev.filter((s) => s.id !== id));
        } else {
          // API implementation (soft delete, may return 409 if in use)
          await subjectsClient.delete(id);
          setSubjects((prev) => prev.filter((s) => s.id !== id));
        }
      } catch (err) {
        const errorMessage =
          err instanceof Error
            ? err.message
            : "Erreur lors de la suppression de la matière";
        setError(errorMessage);
        throw new Error(errorMessage);
      } finally {
        setLoading(false);
      }
    },
    [subjects, useMockData],
  );

  // ============================================================================
  // Utility Methods
  // ============================================================================

  const getSubjectById = useCallback(
    (id: string): Subject | undefined => {
      return subjects.find((s) => s.id === id);
    },
    [subjects],
  );

  const getSubjectByCode = useCallback(
    (code: string): Subject | undefined => {
      return subjects.find(
        (s) => s.code.toLowerCase() === code.toLowerCase(),
      );
    },
    [subjects],
  );

  const searchSubjects = useCallback(
    (query: string): Subject[] => {
      if (!query.trim()) {
        return subjects;
      }

      const searchTerm = query.toLowerCase().trim();
      return subjects.filter(
        (subject) =>
          subject.name.toLowerCase().includes(searchTerm) ||
          subject.code.toLowerCase().includes(searchTerm) ||
          subject.description.toLowerCase().includes(searchTerm),
      );
    },
    [subjects],
  );

  const validateForm = useCallback(
    (
      data: SubjectFormData,
      excludeId?: string,
    ): Record<keyof SubjectFormData, string | null> => {
      return validateSubjectForm(data, subjects, excludeId);
    },
    [subjects],
  );

  // ============================================================================
  // Load data on mount
  // ============================================================================

  useEffect(() => {
    loadSubjects();
  }, [loadSubjects]);

  // ============================================================================
  // Return API
  // ============================================================================

  return {
    // State
    subjects,
    loading,
    error,

    // CRUD operations
    createSubject,
    updateSubject,
    deleteSubject,

    // Utility methods
    getSubjectById,
    getSubjectByCode,
    searchSubjects,

    // Validation
    validateForm,
    hasValidationErrors,

    // Refresh
    refresh: loadSubjects,
  };
}
