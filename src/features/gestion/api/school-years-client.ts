/**
 * School Years API Client
 * Provides typed access to school year endpoints
 */

import { axiosInstance } from "@/lib/api";

// ============================================================================
// Type Definitions (matching OpenAPI spec)
// ============================================================================

export interface SchoolYearResponse {
  id: string;
  name: string;
  start_date: string;
  end_date: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface SchoolYearsListResponse {
  items: SchoolYearResponse[];
  next_cursor: string | null;
}

export interface CreateSchoolYearRequest {
  name: string;
  start_date: string; // ISO date format YYYY-MM-DD
  end_date: string; // ISO date format YYYY-MM-DD
  is_active?: boolean;
}

export interface UpdateSchoolYearRequest {
  name?: string;
  start_date?: string;
  end_date?: string;
  is_active?: boolean;
}

// ============================================================================
// School Years Client
// ============================================================================

export const schoolYearsClient = {
  /**
   * List all school years
   * GET /school-years
   */
  list: async (params?: {
    cursor?: string;
    limit?: number;
    is_active?: boolean;
  }): Promise<SchoolYearsListResponse> => {
    const response = await axiosInstance.get<SchoolYearsListResponse>(
      "/school-years",
      { params },
    );
    return response.data;
  },

  /**
   * Get school year by ID
   * GET /school-years/{id}
   */
  getById: async (id: string): Promise<SchoolYearResponse> => {
    const response = await axiosInstance.get<SchoolYearResponse>(
      `/school-years/${id}`,
    );
    return response.data;
  },

  /**
   * Create a new school year
   * POST /school-years
   */
  create: async (
    data: CreateSchoolYearRequest,
  ): Promise<SchoolYearResponse> => {
    const response = await axiosInstance.post<SchoolYearResponse>(
      "/school-years",
      data,
    );
    return response.data;
  },

  /**
   * Update school year
   * PATCH /school-years/{id}
   */
  update: async (
    id: string,
    data: UpdateSchoolYearRequest,
    etag?: string,
  ): Promise<SchoolYearResponse> => {
    const headers = etag ? { "If-Match": etag } : {};
    const response = await axiosInstance.patch<SchoolYearResponse>(
      `/school-years/${id}`,
      data,
      { headers },
    );
    return response.data;
  },

  /**
   * Delete school year
   * DELETE /school-years/{id}
   */
  delete: async (id: string): Promise<void> => {
    await axiosInstance.delete(`/school-years/${id}`);
  },

  /**
   * Get the active school year
   * Convenience method that filters by is_active=true
   */
  getActive: async (): Promise<SchoolYearResponse | null> => {
    const response = await schoolYearsClient.list({ is_active: true, limit: 1 });
    return response.items.length > 0 ? response.items[0] : null;
  },

  /**
   * Activate a school year (sets is_active to true)
   * Deactivates all other school years first
   */
  activate: async (id: string, etag?: string): Promise<SchoolYearResponse> => {
    return schoolYearsClient.update(id, { is_active: true }, etag);
  },

  /**
   * Deactivate a school year (sets is_active to false)
   */
  deactivate: async (id: string, etag?: string): Promise<SchoolYearResponse> => {
    return schoolYearsClient.update(id, { is_active: false }, etag);
  },
};
