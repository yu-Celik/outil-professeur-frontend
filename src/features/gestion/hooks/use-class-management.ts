/**
 * Class Management Hook
 * Provides CRUD operations for classes with API integration
 */

"use client";

import { useState, useEffect, useCallback } from "react";
import type { Class, SchoolYear } from "@/types/uml-entities";
import {
  classesClient,
  type ClassResponse,
  type CreateClassRequest,
  type UpdateClassRequest,
} from "@/features/gestion/api";
import { MOCK_CLASSES, MOCK_SCHOOL_YEARS } from "@/features/gestion/mocks";

// ============================================================================
// Type Definitions
// ============================================================================

export interface ClassFormData {
  classCode: string;
  gradeLabel: string;
  schoolYearId: string;
}

interface UseClassManagementOptions {
  teacherId?: string;
  useMockData?: boolean; // Flag to use mock data instead of API
}

export interface UseClassManagementReturn {
  // State
  classes: Class[];
  loading: boolean;
  error: string | null;

  // CRUD operations
  createClass: (data: ClassFormData) => Promise<Class>;
  updateClass: (id: string, data: ClassFormData, etag?: string) => Promise<Class>;
  deleteClass: (id: string) => Promise<void>;

  // Utility methods
  getClassById: (id: string) => Class | undefined;
  getClassesBySchoolYear: (schoolYearId: string) => Class[];

  // Validation
  validateForm: (
    data: ClassFormData,
    excludeId?: string,
  ) => Record<keyof ClassFormData, string | null>;
  hasValidationErrors: (
    errors: Record<keyof ClassFormData, string | null>,
  ) => boolean;

  // School years for dropdown
  schoolYears: SchoolYear[];

  // Refresh
  refresh: () => void;
}

// ============================================================================
// Mapper Functions: API (snake_case) ↔ UML (camelCase)
// ============================================================================

function apiResponseToClass(response: ClassResponse, teacherId: string): Class {
  return {
    id: response.id,
    createdBy: response.teacher_id,
    classCode: response.class_code,
    gradeLabel: response.grade_label,
    schoolYearId: response.school_year_id,
    createdAt: new Date(response.created_at),
    updatedAt: new Date(response.updated_at),
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
}

function classFormDataToCreateRequest(
  data: ClassFormData,
): CreateClassRequest {
  return {
    class_code: data.classCode,
    grade_label: data.gradeLabel,
    school_year_id: data.schoolYearId,
  };
}

function classFormDataToUpdateRequest(
  data: ClassFormData,
): UpdateClassRequest {
  return {
    class_code: data.classCode,
    grade_label: data.gradeLabel,
    school_year_id: data.schoolYearId,
  };
}

// ============================================================================
// Validation Functions
// ============================================================================

function validateClassForm(
  data: ClassFormData,
  classes: Class[],
  excludeId?: string,
): Record<keyof ClassFormData, string | null> {
  const errors: Record<keyof ClassFormData, string | null> = {
    classCode: null,
    gradeLabel: null,
    schoolYearId: null,
  };

  // Validate classCode
  if (!data.classCode || data.classCode.trim() === "") {
    errors.classCode = "Le code de classe est requis";
  } else {
    // Check uniqueness within the same school year
    const isDuplicate = classes.some(
      (cls) =>
        cls.id !== excludeId &&
        cls.classCode === data.classCode &&
        cls.schoolYearId === data.schoolYearId,
    );
    if (isDuplicate) {
      errors.classCode =
        "Une classe avec ce code existe déjà pour cette année scolaire";
    }
  }

  // Validate gradeLabel
  if (!data.gradeLabel || data.gradeLabel.trim() === "") {
    errors.gradeLabel = "Le niveau de classe est requis";
  }

  // Validate schoolYearId
  if (!data.schoolYearId || data.schoolYearId.trim() === "") {
    errors.schoolYearId = "L'année scolaire est requise";
  }

  return errors;
}

function hasValidationErrors(
  errors: Record<keyof ClassFormData, string | null>,
): boolean {
  return Object.values(errors).some((error) => error !== null);
}

// ============================================================================
// Main Hook
// ============================================================================

export function useClassManagement(
  options: UseClassManagementOptions = {},
): UseClassManagementReturn {
  const { teacherId = "current-user", useMockData = false } = options;

  const [classes, setClasses] = useState<Class[]>([]);
  const [schoolYears] = useState<SchoolYear[]>(MOCK_SCHOOL_YEARS);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ============================================================================
  // Load Classes
  // ============================================================================

  const loadClasses = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      if (useMockData) {
        // Use mock data for tests
        await new Promise((resolve) => setTimeout(resolve, 100));
        setClasses(MOCK_CLASSES);
      } else {
        // Fetch from API
        const response = await classesClient.list();
        const mapped = response.items.map((item) =>
          apiResponseToClass(item, teacherId),
        );
        setClasses(mapped);
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Erreur lors du chargement des classes";
      setError(errorMessage);
      console.error("Failed to load classes:", err);
    } finally {
      setLoading(false);
    }
  }, [teacherId, useMockData]);

  // ============================================================================
  // Create Class
  // ============================================================================

  const createClass = useCallback(
    async (data: ClassFormData): Promise<Class> => {
      setLoading(true);
      setError(null);

      try {
        // Validate form
        const errors = validateClassForm(data, classes);
        if (hasValidationErrors(errors)) {
          const firstError = Object.values(errors).find((err) => err !== null);
          throw new Error(firstError || "Erreur de validation");
        }

        if (useMockData) {
          // Mock implementation
          await new Promise((resolve) => setTimeout(resolve, 200));

          const newClass: Class = {
            id: `class-${Date.now()}`,
            createdBy: teacherId,
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
        } else {
          // API implementation with Idempotency-Key
          const idempotencyKey = crypto.randomUUID();
          const request = classFormDataToCreateRequest(data);
          const response = await classesClient.create(request, idempotencyKey);
          const newClass = apiResponseToClass(response, teacherId);

          setClasses((prev) => [...prev, newClass]);
          return newClass;
        }
      } catch (err) {
        const errorMessage =
          err instanceof Error
            ? err.message
            : "Erreur lors de la création de la classe";
        setError(errorMessage);
        throw new Error(errorMessage);
      } finally {
        setLoading(false);
      }
    },
    [teacherId, classes, useMockData],
  );

  // ============================================================================
  // Update Class
  // ============================================================================

  const updateClass = useCallback(
    async (
      id: string,
      data: ClassFormData,
      etag?: string,
    ): Promise<Class> => {
      setLoading(true);
      setError(null);

      try {
        // Validate form
        const errors = validateClassForm(data, classes, id);
        if (hasValidationErrors(errors)) {
          const firstError = Object.values(errors).find((err) => err !== null);
          throw new Error(firstError || "Erreur de validation");
        }

        if (useMockData) {
          // Mock implementation
          await new Promise((resolve) => setTimeout(resolve, 200));

          const existing = classes.find((c) => c.id === id);
          if (!existing) {
            throw new Error("Classe non trouvée");
          }

          const updated: Class = {
            ...existing,
            classCode: data.classCode,
            gradeLabel: data.gradeLabel,
            schoolYearId: data.schoolYearId,
            updatedAt: new Date(),
          };

          setClasses((prev) => prev.map((c) => (c.id === id ? updated : c)));
          return updated;
        } else {
          // API implementation with ETag support
          const request = classFormDataToUpdateRequest(data);
          const response = await classesClient.update(id, request, etag);
          const updated = apiResponseToClass(response, teacherId);

          setClasses((prev) => prev.map((c) => (c.id === id ? updated : c)));
          return updated;
        }
      } catch (err) {
        const errorMessage =
          err instanceof Error
            ? err.message
            : "Erreur lors de la mise à jour de la classe";
        setError(errorMessage);
        throw new Error(errorMessage);
      } finally {
        setLoading(false);
      }
    },
    [teacherId, classes, useMockData],
  );

  // ============================================================================
  // Delete Class
  // ============================================================================

  const deleteClass = useCallback(
    async (id: string): Promise<void> => {
      setLoading(true);
      setError(null);

      try {
        if (useMockData) {
          // Mock implementation
          await new Promise((resolve) => setTimeout(resolve, 200));

          const exists = classes.some((c) => c.id === id);
          if (!exists) {
            throw new Error("Classe non trouvée");
          }

          setClasses((prev) => prev.filter((c) => c.id !== id));
        } else {
          // API implementation (soft delete)
          await classesClient.delete(id);
          setClasses((prev) => prev.filter((c) => c.id !== id));
        }
      } catch (err) {
        const errorMessage =
          err instanceof Error
            ? err.message
            : "Erreur lors de la suppression de la classe";
        setError(errorMessage);
        throw new Error(errorMessage);
      } finally {
        setLoading(false);
      }
    },
    [classes, useMockData],
  );

  // ============================================================================
  // Utility Methods
  // ============================================================================

  const getClassById = useCallback(
    (id: string): Class | undefined => {
      return classes.find((c) => c.id === id);
    },
    [classes],
  );

  const getClassesBySchoolYear = useCallback(
    (schoolYearId: string): Class[] => {
      return classes.filter((c) => c.schoolYearId === schoolYearId);
    },
    [classes],
  );

  const validateForm = useCallback(
    (
      data: ClassFormData,
      excludeId?: string,
    ): Record<keyof ClassFormData, string | null> => {
      return validateClassForm(data, classes, excludeId);
    },
    [classes],
  );

  // ============================================================================
  // Load data on mount
  // ============================================================================

  useEffect(() => {
    loadClasses();
  }, [loadClasses]);

  // ============================================================================
  // Return API
  // ============================================================================

  return {
    // State
    classes,
    loading,
    error,

    // CRUD operations
    createClass,
    updateClass,
    deleteClass,

    // Utility methods
    getClassById,
    getClassesBySchoolYear,

    // Validation
    validateForm,
    hasValidationErrors,

    // School years
    schoolYears,

    // Refresh
    refresh: loadClasses,
  };
}
