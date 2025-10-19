/**
 * Time Slots API Client
 * Provides typed access to time slot endpoints with overlap detection
 */

import { axiosInstance } from "@/lib/api";

// ============================================================================
// Type Definitions (matching OpenAPI spec)
// ============================================================================

export interface TimeSlotResponse {
  id: string;
  teacher_id: string;
  start_time: string;
  end_time: string;
  duration_minutes: number;
  display_order: number;
  is_break: boolean;
  created_at: string;
  updated_at: string;
}

export interface TimeSlotsListResponse {
  items: TimeSlotResponse[];
  next_cursor: string | null;
}

export interface CreateTimeSlotRequest {
  start_time: string;
  end_time: string;
  display_order: number;
  is_break?: boolean;
}

export interface UpdateTimeSlotRequest {
  start_time?: string;
  end_time?: string;
  display_order?: number;
  is_break?: boolean;
}

// ============================================================================
// Time Slots Client
// ============================================================================

export const timeSlotsClient = {
  /**
   * List all time slots
   * GET /time-slots
   * Supports filtering by is_break and pagination
   */
  list: async (params?: {
    cursor?: string;
    limit?: number;
    is_break?: boolean;
  }): Promise<TimeSlotsListResponse> => {
    const response = await axiosInstance.get<TimeSlotsListResponse>(
      "/time-slots",
      { params },
    );
    return response.data;
  },

  /**
   * Get time slot by ID
   * GET /time-slots/{id}
   */
  getById: async (id: string): Promise<TimeSlotResponse> => {
    const response = await axiosInstance.get<TimeSlotResponse>(
      `/time-slots/${id}`,
    );
    return response.data;
  },

  /**
   * Create a new time slot
   * POST /time-slots
   * Requires Idempotency-Key header
   * Returns 409 if slot overlaps with existing non-break slot
   */
  create: async (
    data: CreateTimeSlotRequest,
    idempotencyKey: string,
  ): Promise<TimeSlotResponse> => {
    const response = await axiosInstance.post<TimeSlotResponse>(
      "/time-slots",
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
   * Update time slot
   * PATCH /time-slots/{id}
   * Supports ETag for optimistic locking via If-Match header
   * Returns 409 if new times overlap with another slot
   */
  update: async (
    id: string,
    data: UpdateTimeSlotRequest,
    etag?: string,
  ): Promise<TimeSlotResponse> => {
    const headers = etag ? { "If-Match": etag } : {};
    const response = await axiosInstance.patch<TimeSlotResponse>(
      `/time-slots/${id}`,
      data,
      { headers },
    );
    return response.data;
  },

  /**
   * Delete time slot (soft delete)
   * DELETE /time-slots/{id}
   * Returns 409 if slot has dependencies (used in sessions)
   */
  delete: async (id: string): Promise<void> => {
    await axiosInstance.delete(`/time-slots/${id}`);
  },

  /**
   * Get active (non-break) time slots
   * Convenience method
   */
  getActiveSlots: async (): Promise<TimeSlotResponse[]> => {
    const response = await timeSlotsClient.list({ is_break: false });
    return response.items;
  },

  /**
   * Get break time slots only
   * Convenience method
   */
  getBreakSlots: async (): Promise<TimeSlotResponse[]> => {
    const response = await timeSlotsClient.list({ is_break: true });
    return response.items;
  },
};
