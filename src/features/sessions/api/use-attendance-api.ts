"use client";

import { useState, useCallback } from "react";
import { api } from "@/lib/api";
import type { StudentParticipation } from "@/types/uml-entities";

/**
 * API client for attendance/participation operations
 * Maps to /sessions/{session_id}/attendance endpoints from souz-api
 */

export interface AttendanceUpsertItem {
  student_id: string;
  is_present: boolean;
  participation_level?: number | null;
  behavior?: string | null;
  camera_enabled?: boolean | null;
  homework_done?: boolean | null;
  specific_remarks?: string | null;
  technical_issues?: string | null;
}

export interface AttendanceUpsertRequest {
  items: AttendanceUpsertItem[];
}

export interface StudentParticipationResponse {
  id: string;
  user_id: string;
  course_session_id: string;
  student_id: string;
  is_present: boolean;
  participation_level?: number | null;
  behavior?: string | null;
  camera_enabled?: boolean | null;
  homework_done?: boolean | null;
  specific_remarks?: string | null;
  technical_issues?: string | null;
  marked_at: string;
  version: number;
}

export interface AttendanceResponse {
  items: StudentParticipationResponse[];
}

/**
 * Hook for managing attendance API operations
 * Provides GET and PUT operations for batch attendance management
 */
export function useAttendanceApi() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  /**
   * Fetch attendance records for a course session
   * GET /sessions/{session_id}/attendance
   */
  const getSessionAttendance = useCallback(
    async (sessionId: string): Promise<StudentParticipationResponse[]> => {
      setLoading(true);
      setError(null);

      try {
        const response = await api.get<AttendanceResponse>(
          `/sessions/${sessionId}/attendance`,
        );
        return response.items;
      } catch (err) {
        const error =
          err instanceof Error ? err : new Error("Failed to fetch attendance");
        setError(error);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  /**
   * Upsert (batch update/insert) attendance records for a session
   * PUT /sessions/{session_id}/attendance
   */
  const upsertSessionAttendance = useCallback(
    async (
      sessionId: string,
      attendanceData: AttendanceUpsertRequest,
    ): Promise<StudentParticipationResponse[]> => {
      setLoading(true);
      setError(null);

      try {
        const response = await api.put<AttendanceResponse>(
          `/sessions/${sessionId}/attendance`,
          attendanceData,
        );
        return response.items;
      } catch (err) {
        const error =
          err instanceof Error ? err : new Error("Failed to update attendance");
        setError(error);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  /**
   * Convert StudentParticipation (UML entity) to API upsert item format
   */
  const mapToUpsertItem = useCallback(
    (participation: Partial<StudentParticipation>): AttendanceUpsertItem => {
      if (!participation.studentId) {
        throw new Error("Student ID is required for attendance upsert");
      }

      return {
        student_id: participation.studentId,
        is_present: participation.isPresent ?? false,
        participation_level: participation.participationLevel ?? null,
        behavior: participation.behavior ?? null,
        camera_enabled: participation.cameraEnabled ?? null,
        homework_done: participation.homeworkDone ?? null,
        specific_remarks: participation.specificRemarks ?? null,
        technical_issues: participation.technicalIssues ?? null,
      };
    },
    [],
  );

  /**
   * Convert API response to StudentParticipation (UML entity)
   */
  const mapFromApiResponse = useCallback(
    (response: StudentParticipationResponse): StudentParticipation => {
      return {
        id: response.id,
        courseSessionId: response.course_session_id,
        studentId: response.student_id,
        isPresent: response.is_present,
        participationLevel: response.participation_level ?? 0,
        behavior: response.behavior ?? "",
        cameraEnabled: response.camera_enabled ?? false,
        homeworkDone: response.homework_done ?? false,
        specificRemarks: response.specific_remarks ?? "",
        technicalIssues: response.technical_issues ?? "",
        markedAt: new Date(response.marked_at),
        updatedAt: new Date(response.marked_at),
      };
    },
    [],
  );

  return {
    loading,
    error,
    getSessionAttendance,
    upsertSessionAttendance,
    mapToUpsertItem,
    mapFromApiResponse,
  };
}
