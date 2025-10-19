/**
 * Academic Periods API Client
 * Provides typed access to academic period endpoints
 */

import { axiosInstance } from "@/lib/api";

// ============================================================================
// Type Definitions (matching OpenAPI spec)
// ============================================================================

export interface AcademicPeriodResponse {
  id: string;
  school_year_id: string;
  name: string;
  order: number;
  start_date: string;
  end_date: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface AcademicPeriodsListResponse {
  items: AcademicPeriodResponse[];
  next_cursor: string | null;
}

export interface CreateAcademicPeriodRequest {
  school_year_id: string;
  name: string;
  order: number;
  start_date: string; // ISO date format YYYY-MM-DD
  end_date: string; // ISO date format YYYY-MM-DD
  is_active?: boolean;
}

export interface UpdateAcademicPeriodRequest {
  name?: string;
  order?: number;
  start_date?: string;
  end_date?: string;
  is_active?: boolean;
}

// ============================================================================
// Academic Periods Client
// ============================================================================

export const academicPeriodsClient = {
  /**
   * List all academic periods (optionally filtered by school year)
   * GET /academic-periods
   */
  list: async (params?: {
    cursor?: string;
    limit?: number;
    school_year_id?: string;
    is_active?: boolean;
  }): Promise<AcademicPeriodsListResponse> => {
    const response = await axiosInstance.get<AcademicPeriodsListResponse>(
      "/academic-periods",
      { params },
    );
    return response.data;
  },

  /**
   * Get academic period by ID
   * GET /academic-periods/{id}
   */
  getById: async (id: string): Promise<AcademicPeriodResponse> => {
    const response = await axiosInstance.get<AcademicPeriodResponse>(
      `/academic-periods/${id}`,
    );
    return response.data;
  },

  /**
   * Create a new academic period
   * POST /academic-periods
   */
  create: async (
    data: CreateAcademicPeriodRequest,
  ): Promise<AcademicPeriodResponse> => {
    const response = await axiosInstance.post<AcademicPeriodResponse>(
      "/academic-periods",
      data,
    );
    return response.data;
  },

  /**
   * Update academic period
   * PATCH /academic-periods/{id}
   */
  update: async (
    id: string,
    data: UpdateAcademicPeriodRequest,
    etag?: string,
  ): Promise<AcademicPeriodResponse> => {
    const headers = etag ? { "If-Match": etag } : {};
    const response = await axiosInstance.patch<AcademicPeriodResponse>(
      `/academic-periods/${id}`,
      data,
      { headers },
    );
    return response.data;
  },

  /**
   * Delete academic period
   * DELETE /academic-periods/{id}
   */
  delete: async (id: string): Promise<void> => {
    await axiosInstance.delete(`/academic-periods/${id}`);
  },

  /**
   * Get all periods for a school year
   * Convenience method that filters by school_year_id
   */
  getBySchoolYear: async (
    schoolYearId: string,
  ): Promise<AcademicPeriodResponse[]> => {
    const response = await academicPeriodsClient.list({
      school_year_id: schoolYearId,
    });
    return response.items;
  },

  /**
   * Get the active period for a school year
   * Returns the period with is_active=true
   */
  getActivePeriod: async (
    schoolYearId: string,
  ): Promise<AcademicPeriodResponse | null> => {
    const response = await academicPeriodsClient.list({
      school_year_id: schoolYearId,
      is_active: true,
      limit: 1,
    });
    return response.items.length > 0 ? response.items[0] : null;
  },

  /**
   * Activate a period and deactivate all others in the same school year
   * This is handled client-side by making multiple requests
   */
  setActivePeriod: async (
    id: string,
    schoolYearId: string,
    etag?: string,
  ): Promise<AcademicPeriodResponse> => {
    // First, deactivate all periods for this school year
    const periods = await academicPeriodsClient.getBySchoolYear(schoolYearId);

    // Deactivate all active periods except the target
    const deactivatePromises = periods
      .filter((p) => p.is_active && p.id !== id)
      .map((p) => academicPeriodsClient.update(p.id, { is_active: false }));

    await Promise.all(deactivatePromises);

    // Activate the target period
    return academicPeriodsClient.update(id, { is_active: true }, etag);
  },

  /**
   * Validate period dates don't overlap with existing periods in the same school year
   * Client-side validation helper
   */
  validateNoOverlap: (
    startDate: Date,
    endDate: Date,
    existingPeriods: AcademicPeriodResponse[],
    excludeId?: string,
  ): { valid: boolean; conflictingPeriod?: AcademicPeriodResponse } => {
    for (const period of existingPeriods) {
      if (excludeId && period.id === excludeId) continue;

      const periodStart = new Date(period.start_date);
      const periodEnd = new Date(period.end_date);

      // Check for overlap
      const overlaps =
        (startDate >= periodStart && startDate <= periodEnd) ||
        (endDate >= periodStart && endDate <= periodEnd) ||
        (startDate <= periodStart && endDate >= periodEnd);

      if (overlaps) {
        return { valid: false, conflictingPeriod: period };
      }
    }

    return { valid: true };
  },
};
