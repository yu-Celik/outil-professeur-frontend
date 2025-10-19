/**
 * Classes API Client
 * Provides typed access to class endpoints with support for ETag and Idempotency-Key
 */

import { axiosInstance } from "@/lib/api";

// ============================================================================
// Type Definitions (matching OpenAPI spec)
// ============================================================================

export interface ClassResponse {
  id: string;
  teacher_id: string;
  class_code: string;
  grade_label: string;
  school_year_id: string;
  created_at: string;
  updated_at: string;
}

export interface ClassesListResponse {
  items: ClassResponse[];
  next_cursor: string | null;
}

export interface CreateClassRequest {
  class_code: string;
  grade_label: string;
  school_year_id: string;
}

export interface UpdateClassRequest {
  class_code?: string;
  grade_label?: string;
  school_year_id?: string;
}

// ============================================================================
// Classes Client
// ============================================================================

export const classesClient = {
  /**
   * List all classes
   * GET /classes
   */
  list: async (params?: {
    cursor?: string;
    limit?: number;
    school_year_id?: string;
  }): Promise<ClassesListResponse> => {
    const response = await axiosInstance.get<ClassesListResponse>("/classes", {
      params,
    });
    return response.data;
  },

  /**
   * Get class by ID
   * GET /classes/{id}
   */
  getById: async (id: string): Promise<ClassResponse> => {
    const response = await axiosInstance.get<ClassResponse>(`/classes/${id}`);
    return response.data;
  },

  /**
   * Create a new class
   * POST /classes
   * Requires Idempotency-Key header to prevent duplicate creation
   */
  create: async (
    data: CreateClassRequest,
    idempotencyKey: string,
  ): Promise<ClassResponse> => {
    const response = await axiosInstance.post<ClassResponse>("/classes", data, {
      headers: {
        "Idempotency-Key": idempotencyKey,
      },
    });
    return response.data;
  },

  /**
   * Update class
   * PATCH /classes/{id}
   * Supports ETag for optimistic locking via If-Match header
   */
  update: async (
    id: string,
    data: UpdateClassRequest,
    etag?: string,
  ): Promise<ClassResponse> => {
    const headers = etag ? { "If-Match": etag } : {};
    const response = await axiosInstance.patch<ClassResponse>(
      `/classes/${id}`,
      data,
      { headers },
    );
    return response.data;
  },

  /**
   * Delete class (soft delete)
   * DELETE /classes/{id}
   */
  delete: async (id: string): Promise<void> => {
    await axiosInstance.delete(`/classes/${id}`);
  },

  /**
   * Get classes by school year
   * Convenience method that filters by school_year_id
   */
  getBySchoolYear: async (schoolYearId: string): Promise<ClassResponse[]> => {
    const response = await classesClient.list({ school_year_id: schoolYearId });
    return response.items;
  },
};
