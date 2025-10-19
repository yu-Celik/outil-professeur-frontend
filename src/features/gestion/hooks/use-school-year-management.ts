/**
 * School Year Management Hook
 * Provides CRUD operations for school years with API integration
 */

"use client";

import { useState, useEffect, useCallback } from "react";
import type { SchoolYear } from "@/types/uml-entities";
import {
  schoolYearsClient,
  type SchoolYearResponse,
  type CreateSchoolYearRequest,
  type UpdateSchoolYearRequest,
} from "@/features/gestion/api";
import { MOCK_SCHOOL_YEARS } from "@/features/gestion/mocks";

// ============================================================================
// Type Definitions
// ============================================================================

export interface SchoolYearFormData {
  name: string;
  startDate: Date;
  endDate: Date;
  isActive?: boolean;
}

interface UseSchoolYearManagementOptions {
  teacherId?: string;
  useMockData?: boolean; // Flag to use mock data instead of API
}

// ============================================================================
// Mapper Functions: API (snake_case) ↔ UML (camelCase)
// ============================================================================

function apiResponseToSchoolYear(
  response: SchoolYearResponse,
  teacherId: string,
): SchoolYear {
  return {
    id: response.id,
    createdBy: teacherId,
    name: response.name,
    startDate: new Date(response.start_date),
    endDate: new Date(response.end_date),
    isActive: response.is_active,
    createdAt: new Date(response.created_at),
    updatedAt: new Date(response.updated_at),
    createPeriod: (name: string, start: Date, end: Date, order: number) => ({
      id: `period-${Date.now()}`,
      createdBy: teacherId,
      schoolYearId: response.id,
      name,
      order,
      startDate: start,
      endDate: end,
      isActive: false,
      createdAt: new Date(),
      updatedAt: new Date(),
      contains: (date: Date) => date >= start && date <= end,
    }),
  };
}

function schoolYearFormDataToCreateRequest(
  data: SchoolYearFormData,
): CreateSchoolYearRequest {
  return {
    name: data.name,
    start_date: data.startDate.toISOString().split("T")[0], // YYYY-MM-DD
    end_date: data.endDate.toISOString().split("T")[0],
    is_active: data.isActive ?? false,
  };
}

function schoolYearFormDataToUpdateRequest(
  data: Partial<SchoolYearFormData>,
): UpdateSchoolYearRequest {
  return {
    ...(data.name && { name: data.name }),
    ...(data.startDate && {
      start_date: data.startDate.toISOString().split("T")[0],
    }),
    ...(data.endDate && { end_date: data.endDate.toISOString().split("T")[0] }),
    ...(data.isActive !== undefined && { is_active: data.isActive }),
  };
}

// ============================================================================
// Main Hook
// ============================================================================

export function useSchoolYearManagement(
  options: UseSchoolYearManagementOptions = {},
) {
  const { teacherId = "current-user", useMockData = false } = options;

  const [schoolYears, setSchoolYears] = useState<SchoolYear[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ============================================================================
  // Load School Years
  // ============================================================================

  const loadSchoolYears = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      if (useMockData) {
        // Use mock data for tests
        await new Promise((resolve) => setTimeout(resolve, 100));
        setSchoolYears(MOCK_SCHOOL_YEARS);
      } else {
        // Fetch from API
        const response = await schoolYearsClient.list();
        const mapped = response.items.map((item) =>
          apiResponseToSchoolYear(item, teacherId),
        );
        setSchoolYears(mapped);
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Erreur lors du chargement des années scolaires";
      setError(errorMessage);
      console.error("Failed to load school years:", err);
    } finally {
      setLoading(false);
    }
  }, [teacherId, useMockData]);

  // ============================================================================
  // Create School Year
  // ============================================================================

  const createSchoolYear = useCallback(
    async (data: SchoolYearFormData): Promise<SchoolYear> => {
      setLoading(true);
      setError(null);

      try {
        // Validate dates
        if (data.startDate >= data.endDate) {
          throw new Error(
            "La date de début doit être antérieure à la date de fin",
          );
        }

        if (useMockData) {
          // Mock implementation
          await new Promise((resolve) => setTimeout(resolve, 200));

          const newSchoolYear: SchoolYear = {
            id: `year-${Date.now()}`,
            createdBy: teacherId,
            name: data.name,
            startDate: data.startDate,
            endDate: data.endDate,
            isActive: data.isActive ?? false,
            createdAt: new Date(),
            updatedAt: new Date(),
            createPeriod: (name: string, start: Date, end: Date, order: number) => ({
              id: `period-${Date.now()}`,
              createdBy: teacherId,
              schoolYearId: `year-${Date.now()}`,
              name,
              order,
              startDate: start,
              endDate: end,
              isActive: false,
              createdAt: new Date(),
              updatedAt: new Date(),
              contains: (date: Date) => date >= start && date <= end,
            }),
          };

          setSchoolYears((prev) => [...prev, newSchoolYear]);
          return newSchoolYear;
        } else {
          // API implementation
          const request = schoolYearFormDataToCreateRequest(data);
          const response = await schoolYearsClient.create(request);
          const newSchoolYear = apiResponseToSchoolYear(response, teacherId);

          setSchoolYears((prev) => [...prev, newSchoolYear]);
          return newSchoolYear;
        }
      } catch (err) {
        const errorMessage =
          err instanceof Error
            ? err.message
            : "Erreur lors de la création de l'année scolaire";
        setError(errorMessage);
        throw new Error(errorMessage);
      } finally {
        setLoading(false);
      }
    },
    [teacherId, useMockData],
  );

  // ============================================================================
  // Update School Year
  // ============================================================================

  const updateSchoolYear = useCallback(
    async (
      id: string,
      data: Partial<SchoolYearFormData>,
    ): Promise<SchoolYear> => {
      setLoading(true);
      setError(null);

      try {
        // Validate dates if both are provided
        if (data.startDate && data.endDate && data.startDate >= data.endDate) {
          throw new Error(
            "La date de début doit être antérieure à la date de fin",
          );
        }

        if (useMockData) {
          // Mock implementation
          await new Promise((resolve) => setTimeout(resolve, 200));

          const existing = schoolYears.find((y) => y.id === id);
          if (!existing) {
            throw new Error("Année scolaire non trouvée");
          }

          const updated: SchoolYear = {
            ...existing,
            ...data,
            updatedAt: new Date(),
          };

          setSchoolYears((prev) => prev.map((y) => (y.id === id ? updated : y)));
          return updated;
        } else {
          // API implementation
          const request = schoolYearFormDataToUpdateRequest(data);
          const response = await schoolYearsClient.update(id, request);
          const updated = apiResponseToSchoolYear(response, teacherId);

          setSchoolYears((prev) => prev.map((y) => (y.id === id ? updated : y)));
          return updated;
        }
      } catch (err) {
        const errorMessage =
          err instanceof Error
            ? err.message
            : "Erreur lors de la mise à jour de l'année scolaire";
        setError(errorMessage);
        throw new Error(errorMessage);
      } finally {
        setLoading(false);
      }
    },
    [teacherId, schoolYears, useMockData],
  );

  // ============================================================================
  // Delete School Year
  // ============================================================================

  const deleteSchoolYear = useCallback(
    async (id: string): Promise<void> => {
      setLoading(true);
      setError(null);

      try {
        if (useMockData) {
          // Mock implementation
          await new Promise((resolve) => setTimeout(resolve, 200));

          const exists = schoolYears.some((y) => y.id === id);
          if (!exists) {
            throw new Error("Année scolaire non trouvée");
          }

          setSchoolYears((prev) => prev.filter((y) => y.id !== id));
        } else {
          // API implementation
          await schoolYearsClient.delete(id);
          setSchoolYears((prev) => prev.filter((y) => y.id !== id));
        }
      } catch (err) {
        const errorMessage =
          err instanceof Error
            ? err.message
            : "Erreur lors de la suppression de l'année scolaire";
        setError(errorMessage);
        throw new Error(errorMessage);
      } finally {
        setLoading(false);
      }
    },
    [schoolYears, useMockData],
  );

  // ============================================================================
  // Utility Methods
  // ============================================================================

  const getSchoolYearById = useCallback(
    (id: string): SchoolYear | undefined => {
      return schoolYears.find((y) => y.id === id);
    },
    [schoolYears],
  );

  const getActiveSchoolYear = useCallback((): SchoolYear | undefined => {
    return schoolYears.find((y) => y.isActive);
  }, [schoolYears]);

  const activateSchoolYear = useCallback(
    async (id: string): Promise<SchoolYear> => {
      // Deactivate all other years first (client-side logic)
      const deactivatePromises = schoolYears
        .filter((y) => y.isActive && y.id !== id)
        .map((y) => updateSchoolYear(y.id, { isActive: false }));

      await Promise.all(deactivatePromises);

      // Activate the target year
      return updateSchoolYear(id, { isActive: true });
    },
    [schoolYears, updateSchoolYear],
  );

  // ============================================================================
  // Load data on mount
  // ============================================================================

  useEffect(() => {
    loadSchoolYears();
  }, [loadSchoolYears]);

  // ============================================================================
  // Return API
  // ============================================================================

  return {
    // State
    schoolYears,
    loading,
    error,

    // CRUD operations
    createSchoolYear,
    updateSchoolYear,
    deleteSchoolYear,

    // Utility methods
    getSchoolYearById,
    getActiveSchoolYear,
    activateSchoolYear,

    // Refresh
    reload: loadSchoolYears,
  };
}
