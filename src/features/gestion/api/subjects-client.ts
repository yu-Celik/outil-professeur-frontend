/**
 * Subjects API Client
 * Provides typed access to subject endpoints with mappers for UML types
 */

import { axiosInstance } from "@/lib/api";

// ============================================================================
// Type Definitions (matching OpenAPI spec)
// ============================================================================

export interface SubjectResponse {
  id: string;
  teacher_id: string;
  name: string;
  code: string;
  description: string;
  created_at: string;
  updated_at: string;
}

export interface SubjectsListResponse {
  items: SubjectResponse[];
  next_cursor: string | null;
}

export interface CreateSubjectRequest {
  name: string;
  code: string;
  description?: string;
}

export interface UpdateSubjectRequest {
  name?: string;
  code?: string;
  description?: string;
}

// ============================================================================
// Subjects Client
// ============================================================================

export const subjectsClient = {
  /**
   * List all subjects
   * GET /subjects
   * Supports search with 'q' parameter
   */
  list: async (params?: {
    cursor?: string;
    limit?: number;
    q?: string; // Search query
  }): Promise<SubjectsListResponse> => {
    const response = await axiosInstance.get<SubjectsListResponse>(
      "/subjects",
      { params },
    );
    return response.data;
  },

  /**
   * Get subject by ID
   * GET /subjects/{id}
   */
  getById: async (id: string): Promise<SubjectResponse> => {
    const response = await axiosInstance.get<SubjectResponse>(
      `/subjects/${id}`,
    );
    return response.data;
  },

  /**
   * Create a new subject
   * POST /subjects
   * Requires Idempotency-Key header to prevent duplicate creation
   */
  create: async (
    data: CreateSubjectRequest,
    idempotencyKey: string,
  ): Promise<SubjectResponse> => {
    const response = await axiosInstance.post<SubjectResponse>(
      "/subjects",
      data,
      {
        headers: {
          "Idempotency-Key": idempotencyKey,
        },
      },
    );
    return response.data;
  },

  /**
   * Update subject
   * PATCH /subjects/{id}
   * Supports ETag for optimistic locking via If-Match header
   */
  update: async (
    id: string,
    data: UpdateSubjectRequest,
    etag?: string,
  ): Promise<SubjectResponse> => {
    const headers = etag ? { "If-Match": etag } : {};
    const response = await axiosInstance.patch<SubjectResponse>(
      `/subjects/${id}`,
      data,
      { headers },
    );
    return response.data;
  },

  /**
   * Delete subject (soft delete)
   * DELETE /subjects/{id}
   * May return 409 if subject is in use (teaching assignments, sessions, exams)
   */
  delete: async (id: string): Promise<void> => {
    await axiosInstance.delete(`/subjects/${id}`);
  },

  /**
   * Search subjects by query
   * Convenience method that uses the 'q' parameter
   */
  search: async (query: string): Promise<SubjectResponse[]> => {
    const response = await subjectsClient.list({ q: query });
    return response.items;
  },
};
