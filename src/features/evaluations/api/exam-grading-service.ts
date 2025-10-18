/**
 * Exam Grading API Service
 * Handles batch exam result operations for Story 3.2
 */

import { api } from "@/lib/api";
import type { Student, StudentExamResult } from "@/types/uml-entities";

export interface ExamResultUpsertItem {
  student_id: string;
  points_obtained?: number | null;
  is_absent: boolean;
  comments?: string | null;
}

export interface ExamResultsResponse {
  items: Array<{
    id: string;
    exam_id: string;
    student_id: string;
    points_obtained: number;
    is_absent: boolean;
    comments: string | null;
    marked_at: string;
    created_at: string;
    updated_at: string;
  }>;
  next_cursor: string | null;
}

export interface ExamStatsResponse {
  exam_id: string;
  total_students: number;
  submitted_count: number;
  absent_count: number;
  avg_points: number;
  median_points: number;
  min_points: number;
  max_points: number;
  stddev_points: number;
  pass_rate: number;
}

/**
 * Fetch students for a specific class
 */
export async function fetchStudentsForClass(
  classId: string,
): Promise<Student[]> {
  try {
    const response = await api.students.list({
      class_id: classId,
      limit: 100, // Get all students in one call
    });
    return response.items as Student[];
  } catch (error) {
    console.error("Error fetching students for class:", error);
    throw error;
  }
}

/**
 * Fetch existing exam results with pagination support
 */
export async function fetchExamResults(
  examId: string,
): Promise<ExamResultsResponse> {
  try {
    const results = await api.exams.getResults(examId, {
      limit: 100, // Get all results in one call
    });
    return results;
  } catch (error) {
    console.error("Error fetching exam results:", error);
    throw error;
  }
}

/**
 * Save exam results in batch (upsert operation)
 */
export async function saveExamResultsBatch(
  examId: string,
  results: ExamResultUpsertItem[],
): Promise<{ updated_count: number }> {
  try {
    const response = await api.exams.upsertResults(examId, {
      items: results,
    });
    return { updated_count: response.updated_count };
  } catch (error) {
    console.error("Error saving exam results batch:", error);
    throw error;
  }
}

/**
 * Fetch exam statistics
 */
export async function fetchExamStats(
  examId: string,
): Promise<ExamStatsResponse> {
  try {
    const stats = await api.exams.getStats(examId);
    return stats;
  } catch (error) {
    console.error("Error fetching exam stats:", error);
    throw error;
  }
}

/**
 * Helper: Convert local grade data to API format
 */
export function convertGradeDataToApiFormat(gradeData: {
  studentId: string;
  pointsObtained: number;
  isAbsent: boolean;
  comments: string;
}): ExamResultUpsertItem {
  return {
    student_id: gradeData.studentId,
    points_obtained: gradeData.isAbsent ? null : gradeData.pointsObtained,
    is_absent: gradeData.isAbsent,
    comments: gradeData.comments || null,
  };
}

/**
 * Helper: Convert API result to StudentExamResult entity
 */
export function convertApiResultToEntity(
  apiResult: ExamResultsResponse["items"][0],
  teacherId: string,
): StudentExamResult {
  return {
    id: apiResult.id,
    createdBy: teacherId,
    examId: apiResult.exam_id,
    studentId: apiResult.student_id,
    pointsObtained: apiResult.points_obtained,
    grade: apiResult.points_obtained, // Will be calculated by notation system
    gradeDisplay: apiResult.is_absent
      ? "ABS"
      : apiResult.points_obtained.toString(),
    isAbsent: apiResult.is_absent,
    comments: apiResult.comments || "",
    markedAt: new Date(apiResult.marked_at),
    isPassing: function (system) {
      if (this.isAbsent) return false;
      const threshold =
        system.minValue + (system.maxValue - system.minValue) * 0.5;
      return this.grade >= threshold;
    },
    gradeCategory: function (system) {
      if (this.isAbsent) return "Absent";
      const percentage =
        ((this.grade - system.minValue) / (system.maxValue - system.minValue)) *
        100;
      if (percentage >= 80) return "Excellent";
      if (percentage >= 60) return "Bien";
      if (percentage >= 40) return "Satisfaisant";
      return "Insuffisant";
    },
    percentage: function (examTotalPoints) {
      if (this.isAbsent || examTotalPoints <= 0) return 0;
      return (this.pointsObtained / examTotalPoints) * 100;
    },
    updateDisplay: function (system, locale) {
      this.gradeDisplay = this.isAbsent
        ? "ABS"
        : system.formatDisplay(this.grade, locale);
    },
  };
}
