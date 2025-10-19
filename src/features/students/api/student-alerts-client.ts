/**
 * Specialized client for student alert data aggregation.
 * Wraps Souz API endpoints required to evaluate alert conditions.
 */

import { axiosInstance } from "@/lib/api";
import {
  studentsClient,
  type AttendanceRateResponse,
  type ParticipationAverageResponse,
  type StudentExamResultsListResponse,
  type StudentProfileResponse,
  type DateRangeInfo,
} from "./students-client";

export interface SessionCounts {
  total_sessions: number;
  attended_sessions: number;
  sessions_with_participation: number;
}

export interface AtRiskStudentResponse {
  student_id: string;
  full_name: string;
  risk_factors: string[];
  attendance_rate: number | null;
  participation_average: number | null;
}

export interface ClassStatsResponse {
  total_students: number;
  students_with_data: number;
  average_attendance_rate: number | null;
  average_participation: number | null;
  at_risk_students: AtRiskStudentResponse[];
}

export interface ClassAnalyticsMetadata {
  sort_applied: string;
  period_source: string;
  calculation_time: string;
}

export interface ClassStudentSummary {
  student_id: string;
  full_name: string;
  attendance_rate: number | null;
  participation_average: number | null;
  session_counts: SessionCounts;
}

export interface ClassStudentAnalyticsResponse {
  class_id: string;
  analytics_period: DateRangeInfo;
  class_statistics: ClassStatsResponse;
  metadata: ClassAnalyticsMetadata;
  students: ClassStudentSummary[];
}

export interface ClassAnalyticsParams {
  start_date?: string | null;
  end_date?: string | null;
  sort_by?: "name" | "attendance" | "participation";
}

/**
 * Aggregated client surface for alert-related fetches.
 */
export const studentAlertsClient = {
  getAttendanceRate: studentsClient.getAttendanceRate,
  getParticipationAverage: studentsClient.getParticipationAverage,
  getStudentResults: studentsClient.getStudentResults,
  getStudentProfile: studentsClient.getStudentProfile,

  /**
   * Load consolidated analytics for every student in a class.
   * GET /classes/{id}/students/analytics
   */
  getClassStudentAnalytics: async (
    classId: string,
    params?: ClassAnalyticsParams,
  ): Promise<ClassStudentAnalyticsResponse> => {
    const response = await axiosInstance.get<ClassStudentAnalyticsResponse>(
      `/classes/${classId}/students/analytics`,
      { params },
    );
    return response.data;
  },
};

export type {
  AttendanceRateResponse,
  ParticipationAverageResponse,
  StudentExamResultsListResponse,
  StudentProfileResponse,
  DateRangeInfo,
};
