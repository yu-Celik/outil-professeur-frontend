/**
 * Academic Periods Management Hook
 * Provides CRUD operations for academic periods with validation
 */

"use client";

import { useState, useEffect, useCallback } from "react";
import type { AcademicPeriod } from "@/types/uml-entities";
import {
  academicPeriodsClient,
  type AcademicPeriodResponse,
  type CreateAcademicPeriodRequest,
  type UpdateAcademicPeriodRequest,
} from "@/features/gestion/api";
import { MOCK_ACADEMIC_PERIODS } from "@/features/gestion/mocks";

// ============================================================================
// Type Definitions
// ============================================================================

export interface AcademicPeriodFormData {
  schoolYearId: string;
  name: string;
  order: number;
  startDate: Date;
  endDate: Date;
  isActive?: boolean;
}

interface UseAcademicPeriodsOptions {
  teacherId?: string;
  schoolYearId?: string; // Filter by school year
  useMockData?: boolean;
}

// ============================================================================
// Mapper Functions: API (snake_case) ↔ UML (camelCase)
// ============================================================================

function apiResponseToAcademicPeriod(
  response: AcademicPeriodResponse,
  teacherId: string,
): AcademicPeriod {
  const startDate = new Date(response.start_date);
  const endDate = new Date(response.end_date);

  return {
    id: response.id,
    createdBy: teacherId,
    schoolYearId: response.school_year_id,
    name: response.name,
    order: response.order,
    startDate,
    endDate,
    isActive: response.is_active,
    createdAt: new Date(response.created_at),
    updatedAt: new Date(response.updated_at),
    contains: (date: Date) => date >= startDate && date <= endDate,
  };
}

function periodFormDataToCreateRequest(
  data: AcademicPeriodFormData,
): CreateAcademicPeriodRequest {
  return {
    school_year_id: data.schoolYearId,
    name: data.name,
    order: data.order,
    start_date: data.startDate.toISOString().split("T")[0], // YYYY-MM-DD
    end_date: data.endDate.toISOString().split("T")[0],
    is_active: data.isActive ?? false,
  };
}

function periodFormDataToUpdateRequest(
  data: Partial<AcademicPeriodFormData>,
): UpdateAcademicPeriodRequest {
  return {
    ...(data.name && { name: data.name }),
    ...(data.order !== undefined && { order: data.order }),
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

export function useAcademicPeriods(options: UseAcademicPeriodsOptions = {}) {
  const {
    teacherId = "current-user",
    schoolYearId,
    useMockData = false,
  } = options;

  const [periods, setPeriods] = useState<AcademicPeriod[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ============================================================================
  // Load Academic Periods
  // ============================================================================

  const loadPeriods = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      if (useMockData) {
        // Use mock data
        await new Promise((resolve) => setTimeout(resolve, 100));
        const filtered = schoolYearId
          ? MOCK_ACADEMIC_PERIODS.filter((p) => p.schoolYearId === schoolYearId)
          : MOCK_ACADEMIC_PERIODS;
        setPeriods(filtered);
      } else {
        // Fetch from API
        const response = await academicPeriodsClient.list({
          school_year_id: schoolYearId,
        });
        const mapped = response.items.map((item) =>
          apiResponseToAcademicPeriod(item, teacherId),
        );
        setPeriods(mapped);
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Erreur lors du chargement des périodes académiques";
      setError(errorMessage);
      console.error("Failed to load academic periods:", err);
    } finally {
      setLoading(false);
    }
  }, [teacherId, schoolYearId, useMockData]);

  // ============================================================================
  // Create Academic Period
  // ============================================================================

  const createPeriod = useCallback(
    async (data: AcademicPeriodFormData): Promise<AcademicPeriod> => {
      setLoading(true);
      setError(null);

      try {
        // Validate dates
        if (data.startDate >= data.endDate) {
          throw new Error(
            "La date de début doit être antérieure à la date de fin",
          );
        }

        // Check for overlaps with existing periods in the same school year
        const existingPeriods = periods.filter(
          (p) => p.schoolYearId === data.schoolYearId,
        );

        const apiPeriods: AcademicPeriodResponse[] = existingPeriods.map((p) => ({
          id: p.id,
          school_year_id: p.schoolYearId,
          name: p.name,
          order: p.order,
          start_date: p.startDate.toISOString().split("T")[0],
          end_date: p.endDate.toISOString().split("T")[0],
          is_active: p.isActive,
          created_at: p.createdAt.toISOString(),
          updated_at: p.updatedAt.toISOString(),
        }));

        const validation = academicPeriodsClient.validateNoOverlap(
          data.startDate,
          data.endDate,
          apiPeriods,
        );

        if (!validation.valid) {
          throw new Error(
            `Chevauchement détecté avec la période "${validation.conflictingPeriod?.name}"`,
          );
        }

        if (useMockData) {
          // Mock implementation
          await new Promise((resolve) => setTimeout(resolve, 200));

          const newPeriod: AcademicPeriod = {
            id: `period-${Date.now()}`,
            createdBy: teacherId,
            schoolYearId: data.schoolYearId,
            name: data.name,
            order: data.order,
            startDate: data.startDate,
            endDate: data.endDate,
            isActive: data.isActive ?? false,
            createdAt: new Date(),
            updatedAt: new Date(),
            contains: (date: Date) =>
              date >= data.startDate && date <= data.endDate,
          };

          setPeriods((prev) => [...prev, newPeriod]);
          return newPeriod;
        } else {
          // API implementation
          const request = periodFormDataToCreateRequest(data);
          const response = await academicPeriodsClient.create(request);
          const newPeriod = apiResponseToAcademicPeriod(response, teacherId);

          setPeriods((prev) => [...prev, newPeriod]);
          return newPeriod;
        }
      } catch (err) {
        const errorMessage =
          err instanceof Error
            ? err.message
            : "Erreur lors de la création de la période académique";
        setError(errorMessage);
        throw new Error(errorMessage);
      } finally {
        setLoading(false);
      }
    },
    [teacherId, periods, useMockData],
  );

  // ============================================================================
  // Update Academic Period
  // ============================================================================

  const updatePeriod = useCallback(
    async (
      id: string,
      data: Partial<AcademicPeriodFormData>,
    ): Promise<AcademicPeriod> => {
      setLoading(true);
      setError(null);

      try {
        const existing = periods.find((p) => p.id === id);
        if (!existing) {
          throw new Error("Période académique non trouvée");
        }

        // Validate dates if both are provided
        const startDate = data.startDate ?? existing.startDate;
        const endDate = data.endDate ?? existing.endDate;

        if (startDate >= endDate) {
          throw new Error(
            "La date de début doit être antérieure à la date de fin",
          );
        }

        // Check for overlaps (excluding current period)
        const existingPeriods = periods.filter(
          (p) => p.schoolYearId === existing.schoolYearId,
        );

        const apiPeriods: AcademicPeriodResponse[] = existingPeriods.map((p) => ({
          id: p.id,
          school_year_id: p.schoolYearId,
          name: p.name,
          order: p.order,
          start_date: p.startDate.toISOString().split("T")[0],
          end_date: p.endDate.toISOString().split("T")[0],
          is_active: p.isActive,
          created_at: p.createdAt.toISOString(),
          updated_at: p.updatedAt.toISOString(),
        }));

        const validation = academicPeriodsClient.validateNoOverlap(
          startDate,
          endDate,
          apiPeriods,
          id,
        );

        if (!validation.valid) {
          throw new Error(
            `Chevauchement détecté avec la période "${validation.conflictingPeriod?.name}"`,
          );
        }

        if (useMockData) {
          // Mock implementation
          await new Promise((resolve) => setTimeout(resolve, 200));

          const updated: AcademicPeriod = {
            ...existing,
            ...data,
            updatedAt: new Date(),
          };

          setPeriods((prev) => prev.map((p) => (p.id === id ? updated : p)));
          return updated;
        } else {
          // API implementation
          const request = periodFormDataToUpdateRequest(data);
          const response = await academicPeriodsClient.update(id, request);
          const updated = apiResponseToAcademicPeriod(response, teacherId);

          setPeriods((prev) => prev.map((p) => (p.id === id ? updated : p)));
          return updated;
        }
      } catch (err) {
        const errorMessage =
          err instanceof Error
            ? err.message
            : "Erreur lors de la mise à jour de la période académique";
        setError(errorMessage);
        throw new Error(errorMessage);
      } finally {
        setLoading(false);
      }
    },
    [teacherId, periods, useMockData],
  );

  // ============================================================================
  // Delete Academic Period
  // ============================================================================

  const deletePeriod = useCallback(
    async (id: string): Promise<void> => {
      setLoading(true);
      setError(null);

      try {
        if (useMockData) {
          // Mock implementation
          await new Promise((resolve) => setTimeout(resolve, 200));

          const exists = periods.some((p) => p.id === id);
          if (!exists) {
            throw new Error("Période académique non trouvée");
          }

          setPeriods((prev) => prev.filter((p) => p.id !== id));
        } else {
          // API implementation
          await academicPeriodsClient.delete(id);
          setPeriods((prev) => prev.filter((p) => p.id !== id));
        }
      } catch (err) {
        const errorMessage =
          err instanceof Error
            ? err.message
            : "Erreur lors de la suppression de la période académique";
        setError(errorMessage);
        throw new Error(errorMessage);
      } finally {
        setLoading(false);
      }
    },
    [periods, useMockData],
  );

  // ============================================================================
  // Set Active Period
  // ============================================================================

  const setActivePeriod = useCallback(
    async (id: string, schoolYearId: string): Promise<AcademicPeriod> => {
      setLoading(true);
      setError(null);

      try {
        if (useMockData) {
          // Mock: deactivate all others, activate this one
          const updatedPeriods = periods.map((p) =>
            p.schoolYearId === schoolYearId
              ? { ...p, isActive: p.id === id }
              : p,
          );
          setPeriods(updatedPeriods);

          const activated = updatedPeriods.find((p) => p.id === id);
          if (!activated) {
            throw new Error("Période non trouvée");
          }
          return activated;
        } else {
          // API implementation with multiple requests
          const response = await academicPeriodsClient.setActivePeriod(
            id,
            schoolYearId,
          );
          const activated = apiResponseToAcademicPeriod(response, teacherId);

          // Refresh the list to get updated states
          await loadPeriods();

          return activated;
        }
      } catch (err) {
        const errorMessage =
          err instanceof Error
            ? err.message
            : "Erreur lors de l'activation de la période";
        setError(errorMessage);
        throw new Error(errorMessage);
      } finally {
        setLoading(false);
      }
    },
    [teacherId, periods, useMockData, loadPeriods],
  );

  // ============================================================================
  // Utility Methods
  // ============================================================================

  const getPeriodById = useCallback(
    (id: string): AcademicPeriod | undefined => {
      return periods.find((p) => p.id === id);
    },
    [periods],
  );

  const getActivePeriod = useCallback(
    (schoolYearId?: string): AcademicPeriod | undefined => {
      return periods.find(
        (p) =>
          p.isActive &&
          (schoolYearId === undefined || p.schoolYearId === schoolYearId),
      );
    },
    [periods],
  );

  const getPeriodsBySchoolYear = useCallback(
    (schoolYearId: string): AcademicPeriod[] => {
      return periods.filter((p) => p.schoolYearId === schoolYearId);
    },
    [periods],
  );

  // ============================================================================
  // Load data on mount or when school year changes
  // ============================================================================

  useEffect(() => {
    loadPeriods();
  }, [loadPeriods]);

  // ============================================================================
  // Return API
  // ============================================================================

  return {
    // State
    periods,
    loading,
    error,

    // CRUD operations
    createPeriod,
    updatePeriod,
    deletePeriod,

    // Period activation
    setActivePeriod,

    // Utility methods
    getPeriodById,
    getActivePeriod,
    getPeriodsBySchoolYear,

    // Refresh
    reload: loadPeriods,
  };
}
