/**
 * Students API Client
 * Provides typed access to student-related endpoints
 */

import { axiosInstance } from "@/lib/api";

// ============================================================================
// Type Definitions (from OpenAPI spec)
// ============================================================================

export interface DateRangeInfo {
  start_date: string;
  end_date: string;
}

export interface AttendanceRateResponse {
  student_id: string;
  total_sessions: number;
  attended_sessions: number;
  attendance_rate: number | null;
  period: DateRangeInfo;
}

export interface ParticipationAverageResponse {
  student_id: string;
  total_sessions_with_participation: number;
  total_sessions_in_period: number;
  coverage_percentage: number;
  participation_average: number | null;
  period: DateRangeInfo;
}

export interface StudentProfileAnalytics {
  attendance_rate: number | null;
  participation_average: number | null;
  exam_count: number;
  average_grade: number | null;
  period: DateRangeInfo | null;
}

export interface StudentProfileResponse {
  id: string;
  first_name: string;
  last_name: string;
  full_name: string;
  current_class_id: string | null;
  external_id: string | null;
  needs: string[] | null;
  observations: string[] | null;
  strengths: string[] | null;
  improvement_axes: string[] | null;
  analytics: StudentProfileAnalytics;
  created_at: string;
  updated_at: string;
}

export interface StudentExamResultWithDetails {
  id: string;
  exam_id: string;
  student_id: string;
  points_obtained: number | null;
  is_absent: boolean;
  comments: string | null;
  marked_at: string | null;
  exam_title: string;
  exam_date: string;
  max_points: number | null;
  coefficient: number | null;
  subject_name: string | null;
  created_at: string;
  updated_at: string;
}

export interface StudentExamResultsListResponse {
  items: StudentExamResultWithDetails[];
  next_cursor: string | null;
}

export interface StudentResponse {
  id: string;
  first_name: string;
  last_name: string;
  full_name: string;
  current_class_id: string | null;
  external_id: string | null;
  needs: string[] | null;
  observations: string[] | null;
  strengths: string[] | null;
  improvement_axes: string[] | null;
  watchlist: boolean | null;
  created_at: string;
  updated_at: string;
}

export interface UpdateStudentRequest {
  first_name?: string;
  last_name?: string;
  current_class_id?: string | null;
  external_id?: string | null;
  needs?: string[] | null;
  observations?: string[] | null;
  strengths?: string[] | null;
  improvement_axes?: string[] | null;
  watchlist?: boolean | null;
}

// ============================================================================
// Students Client
// ============================================================================

export const studentsClient = {
  /**
   * Get student by ID
   * GET /students/{id}
   */
  getStudent: async (id: string): Promise<StudentResponse> => {
    const response = await axiosInstance.get<StudentResponse>(
      `/students/${id}`,
    );
    return response.data;
  },

  /**
   * Get complete student profile with analytics
   * GET /students/{id}/profile
   */
  getStudentProfile: async (
    id: string,
    params?: {
      start_date?: string;
      end_date?: string;
    },
  ): Promise<StudentProfileResponse> => {
    const response = await axiosInstance.get<StudentProfileResponse>(
      `/students/${id}/profile`,
      { params },
    );
    return response.data;
  },

  /**
   * Get student attendance rate for a period
   * GET /students/{id}/attendance-rate
   */
  getAttendanceRate: async (
    id: string,
    params: {
      start_date: string;
      end_date: string;
    },
  ): Promise<AttendanceRateResponse> => {
    const response = await axiosInstance.get<AttendanceRateResponse>(
      `/students/${id}/attendance-rate`,
      { params },
    );
    return response.data;
  },

  /**
   * Get student participation average for a period
   * GET /students/{id}/participation-average
   */
  getParticipationAverage: async (
    id: string,
    params: {
      start_date: string;
      end_date: string;
    },
  ): Promise<ParticipationAverageResponse> => {
    const response = await axiosInstance.get<ParticipationAverageResponse>(
      `/students/${id}/participation-average`,
      { params },
    );
    return response.data;
  },

  /**
   * Get student exam results with details
   * GET /students/{id}/results
   */
  getStudentResults: async (
    id: string,
    params?: {
      date_from?: string;
      date_to?: string;
      subject_id?: string;
      cursor?: string;
      limit?: number;
    },
  ): Promise<StudentExamResultsListResponse> => {
    const response = await axiosInstance.get<StudentExamResultsListResponse>(
      `/students/${id}/results`,
      { params },
    );
    return response.data;
  },

  /**
   * Update student information
   * PATCH /students/{id}
   * Supports partial updates including observations and watchlist status
   */
  updateStudent: async (
    id: string,
    data: UpdateStudentRequest,
    etag?: string,
  ): Promise<StudentResponse> => {
    const headers = etag ? { "If-Match": etag } : {};
    const response = await axiosInstance.patch<StudentResponse>(
      `/students/${id}`,
      data,
      { headers },
    );
    return response.data;
  },

  /**
   * Toggle watchlist status for a student
   * Convenience method that updates only the watchlist field
   */
  toggleWatchlist: async (
    id: string,
    watchlist: boolean,
    etag?: string,
  ): Promise<StudentResponse> => {
    return studentsClient.updateStudent(id, { watchlist }, etag);
  },
};
