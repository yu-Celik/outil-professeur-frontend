/**
 * Students API Client
 * Provides typed access to student endpoints including class enrollment
 */

import { axiosInstance } from "@/lib/api";

// ============================================================================
// Type Definitions (matching OpenAPI spec)
// ============================================================================

export interface StudentResponse {
  id: string;
  teacher_id: string;
  first_name: string;
  last_name: string;
  external_id: string | null;
  needs: string | null;
  observations: string | null;
  strengths: string | null;
  improvement_axes: string | null;
  created_at: string;
  updated_at: string;
}

export interface StudentsListResponse {
  items: StudentResponse[];
  next_cursor: string | null;
}

export interface CreateStudentRequest {
  first_name: string;
  last_name: string;
  external_id?: string;
  needs?: string;
  observations?: string;
  strengths?: string;
  improvement_axes?: string;
}

export interface UpdateStudentRequest {
  first_name?: string;
  last_name?: string;
  external_id?: string;
  needs?: string;
  observations?: string;
  strengths?: string;
  improvement_axes?: string;
}

export interface EnrollStudentRequest {
  student_id: string;
}

// ============================================================================
// Students Client
// ============================================================================

export const studentsClient = {
  list: async (params?: {
    cursor?: string;
    limit?: number;
    q?: string;
    class_id?: string;
    external_id?: string;
  }): Promise<StudentsListResponse> => {
    const response = await axiosInstance.get<StudentsListResponse>(
      "/students",
      { params },
    );
    return response.data;
  },

  getById: async (id: string): Promise<StudentResponse> => {
    const response = await axiosInstance.get<StudentResponse>(
      `/students/${id}`,
    );
    return response.data;
  },

  create: async (
    data: CreateStudentRequest,
    idempotencyKey: string,
  ): Promise<StudentResponse> => {
    const response = await axiosInstance.post<StudentResponse>(
      "/students",
      data,
      {
        headers: {
          "Idempotency-Key": idempotencyKey,
        },
      },
    );
    return response.data;
  },

  update: async (
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

  delete: async (id: string): Promise<void> => {
    await axiosInstance.delete(`/students/${id}`);
  },

  search: async (query: string, classId?: string): Promise<StudentResponse[]> => {
    const response = await studentsClient.list({ q: query, class_id: classId });
    return response.items;
  },
};

// ============================================================================
// Class Enrollment Client
// ============================================================================

export const classEnrollmentClient = {
  listStudentsInClass: async (
    classId: string,
    params?: {
      cursor?: string;
      limit?: number;
      q?: string;
    },
  ): Promise<StudentsListResponse> => {
    const response = await axiosInstance.get<StudentsListResponse>(
      `/classes/${classId}/students`,
      { params },
    );
    return response.data;
  },

  enrollStudent: async (
    classId: string,
    studentId: string,
  ): Promise<void> => {
    await axiosInstance.post(
      `/classes/${classId}/students`,
      { student_id: studentId },
    );
  },

  unenrollStudent: async (
    classId: string,
    studentId: string,
  ): Promise<void> => {
    await axiosInstance.delete(`/classes/${classId}/students/${studentId}`);
  },
};
