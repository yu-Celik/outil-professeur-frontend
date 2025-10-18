/**
 * Appreciations API Client
 * Handles appreciation content generation, management, and export
 */

import { axiosInstance } from "@/lib/api";
import type { AppreciationContent } from "@/types/uml-entities";

// ============================================================================
// Type Definitions (from OpenAPI spec)
// ============================================================================

/**
 * API request/response types
 */
export interface AppreciationContentResponse {
  id: string;
  created_by: string;
  student_id: string;
  subject_id?: string;
  academic_period_id?: string;
  school_year_id?: string;
  style_guide_id: string;
  phrase_bank_id?: string;
  rubric_id?: string;
  content_kind: string; // 'biweekly_report' | 'trimester_appreciation' | 'subject_comment'
  scope: string; // 'general' | 'subject' | 'class'
  audience: string; // 'parents' | 'bulletins' | 'administration'
  generation_trigger: string; // 'manual' | 'automatic' | 'bulk'
  content: string;
  input_data: Record<string, unknown>;
  generation_params: Record<string, unknown>;
  language: string;
  status: string; // 'draft' | 'validated' | 'exported'
  is_favorite: boolean;
  reuse_count: number;
  generated_at: string;
  updated_at: string;
}

export interface AppreciationContentListResponse {
  items: AppreciationContentResponse[];
  next_cursor: string | null;
}

export interface CreateAppreciationRequest {
  student_id: string;
  subject_id?: string;
  academic_period_id?: string;
  school_year_id?: string;
  style_guide_id: string;
  phrase_bank_id?: string;
  rubric_id?: string;
  content_kind: string;
  scope: string;
  audience: string;
  generation_trigger: string;
  content: string;
  input_data: Record<string, unknown>;
  generation_params: Record<string, unknown>;
  language: string;
}

export interface UpdateAppreciationRequest {
  content?: string;
  status?: string;
  is_favorite?: boolean;
  input_data?: Record<string, unknown>;
  generation_params?: Record<string, unknown>;
}

/**
 * Bulk generation request
 */
export interface BulkGenerateRequest {
  student_ids: string[];
  class_id?: string;
  subject_id?: string;
  academic_period_id?: string;
  school_year_id?: string;
  style_guide_id: string;
  phrase_bank_id?: string;
  rubric_id?: string;
  content_kind: string;
  scope: string;
  audience: string;
  generation_params?: Record<string, unknown>;
  language: string;
}

/**
 * Bulk generation response with progress tracking
 */
export interface BulkGenerateResponse {
  job_id?: string; // For async operations
  results: AppreciationContentResponse[];
  failed?: Array<{
    student_id: string;
    error: string;
  }>;
}

/**
 * Validate single or multiple appreciations
 */
export interface ValidateRequest {
  appreciation_ids: string[];
}

/**
 * Export request
 */
export interface ExportRequest {
  appreciation_ids: string[];
  format: "pdf" | "docx" | "zip";
  include_metadata?: boolean;
}

// ============================================================================
// Data mappers: API ↔ Frontend
// ============================================================================

/**
 * Convert API response to frontend AppreciationContent type
 */
export function mapAppreciationFromAPI(
  apiData: AppreciationContentResponse,
): AppreciationContent {
  return {
    id: apiData.id,
    createdBy: apiData.created_by,
    studentId: apiData.student_id,
    subjectId: apiData.subject_id,
    academicPeriodId: apiData.academic_period_id,
    schoolYearId: apiData.school_year_id,
    styleGuideId: apiData.style_guide_id,
    phraseBankId: apiData.phrase_bank_id,
    rubricId: apiData.rubric_id,
    contentKind: apiData.content_kind,
    scope: apiData.scope,
    audience: apiData.audience,
    generationTrigger: apiData.generation_trigger,
    content: apiData.content,
    inputData: apiData.input_data,
    generationParams: apiData.generation_params,
    language: apiData.language,
    status: apiData.status,
    isFavorite: apiData.is_favorite,
    reuseCount: apiData.reuse_count,
    generatedAt: new Date(apiData.generated_at),
    updatedAt: new Date(apiData.updated_at),
    // Methods from UML spec
    exportAs: function (format: string) {
      switch (format) {
        case "pdf":
          return `PDF export of: ${this.content.substring(0, 50)}...`;
        case "word":
          return `DOCX export of: ${this.content.substring(0, 50)}...`;
        default:
          return this.content;
      }
    },
    updateContent: function (newText: string) {
      this.content = newText;
      this.updatedAt = new Date();
    },
    markAsFavorite: function () {
      this.isFavorite = true;
      this.updatedAt = new Date();
    },
    unmarkFavorite: function () {
      this.isFavorite = false;
      this.updatedAt = new Date();
    },
    incrementReuseCount: function () {
      this.reuseCount++;
      this.updatedAt = new Date();
    },
    canBeReused: function () {
      return this.status === "validated" && this.isFavorite;
    },
    regenerate: function (params: Record<string, unknown>) {
      return {
        ...this,
        id: `${this.id}-regenerated-${Date.now()}`,
        generationParams: { ...this.generationParams, ...params },
        generatedAt: new Date(),
        status: "draft",
        reuseCount: 0,
      } as AppreciationContent;
    },
  };
}

/**
 * Convert frontend AppreciationContent to API request format
 */
export function mapAppreciationToAPI(
  data: Partial<AppreciationContent> & {
    studentId: string;
    styleGuideId: string;
    content: string;
  },
): CreateAppreciationRequest {
  return {
    student_id: data.studentId,
    subject_id: data.subjectId,
    academic_period_id: data.academicPeriodId,
    school_year_id: data.schoolYearId,
    style_guide_id: data.styleGuideId,
    phrase_bank_id: data.phraseBankId,
    rubric_id: data.rubricId,
    content_kind: data.contentKind || "biweekly_report",
    scope: data.scope || "general",
    audience: data.audience || "parents",
    generation_trigger: data.generationTrigger || "manual",
    content: data.content,
    input_data: data.inputData || {},
    generation_params: data.generationParams || {},
    language: data.language || "fr",
  };
}

// ============================================================================
// Appreciations Client
// ============================================================================

export const appreciationsClient = {
  /**
   * List all appreciations
   * GET /appreciations
   */
  list: async (params?: {
    student_id?: string;
    class_id?: string;
    subject_id?: string;
    academic_period_id?: string;
    content_kind?: string;
    status?: string;
    cursor?: string;
    limit?: number;
  }): Promise<AppreciationContentListResponse> => {
    const response = await axiosInstance.get<AppreciationContentListResponse>(
      "/appreciations",
      { params },
    );
    return response.data;
  },

  /**
   * Get appreciation by ID
   * GET /appreciations/{id}
   */
  getById: async (id: string): Promise<AppreciationContentResponse> => {
    const response = await axiosInstance.get<AppreciationContentResponse>(
      `/appreciations/${id}`,
    );
    return response.data;
  },

  /**
   * Create new appreciation manually
   * POST /appreciations
   */
  create: async (
    data: CreateAppreciationRequest,
  ): Promise<AppreciationContentResponse> => {
    const response = await axiosInstance.post<AppreciationContentResponse>(
      "/appreciations",
      data,
    );
    return response.data;
  },

  /**
   * Generate appreciation(s) using AI
   * POST /appreciations/generate
   *
   * This is the main endpoint for AI-powered generation.
   * Can handle single or multiple students.
   */
  generate: async (
    data: BulkGenerateRequest,
  ): Promise<BulkGenerateResponse> => {
    const response = await axiosInstance.post<BulkGenerateResponse>(
      "/appreciations/generate",
      data,
      {
        timeout: 300000, // 5 minutes for bulk operations
      },
    );
    return response.data;
  },

  /**
   * Update existing appreciation
   * PATCH /appreciations/{id}
   */
  update: async (
    id: string,
    data: UpdateAppreciationRequest,
    etag?: string,
  ): Promise<AppreciationContentResponse> => {
    const headers = etag ? { "If-Match": etag } : {};
    const response = await axiosInstance.patch<AppreciationContentResponse>(
      `/appreciations/${id}`,
      data,
      { headers },
    );
    return response.data;
  },

  /**
   * Delete appreciation
   * DELETE /appreciations/{id}
   */
  delete: async (id: string): Promise<void> => {
    await axiosInstance.delete(`/appreciations/${id}`);
  },

  /**
   * Validate one or more appreciations
   * POST /appreciations/{id}/validate or bulk endpoint
   */
  validate: async (appreciationIds: string[]): Promise<void> => {
    if (appreciationIds.length === 1) {
      // Single validation
      await axiosInstance.post(`/appreciations/${appreciationIds[0]}/validate`);
    } else {
      // Bulk validation
      await axiosInstance.post("/appreciations/validate", {
        appreciation_ids: appreciationIds,
      });
    }
  },

  /**
   * Export appreciations as ZIP/PDF
   * POST /appreciations/export
   *
   * Returns binary data (ZIP file)
   */
  export: async (
    appreciationIds: string[],
    format: "pdf" | "docx" | "zip" = "zip",
  ): Promise<Blob> => {
    const response = await axiosInstance.post(
      "/appreciations/export",
      {
        appreciation_ids: appreciationIds,
        format,
        include_metadata: true,
      },
      {
        responseType: "blob",
        timeout: 120000, // 2 minutes for export
      },
    );
    return response.data;
  },

  /**
   * Get appreciations for a specific student
   */
  getByStudent: async (
    studentId: string,
  ): Promise<AppreciationContentListResponse> => {
    return appreciationsClient.list({ student_id: studentId });
  },

  /**
   * Get appreciations for a specific class
   */
  getByClass: async (
    classId: string,
  ): Promise<AppreciationContentListResponse> => {
    return appreciationsClient.list({ class_id: classId });
  },

  /**
   * Get draft appreciations (for review)
   */
  getDrafts: async (): Promise<AppreciationContentListResponse> => {
    return appreciationsClient.list({ status: "draft" });
  },

  /**
   * Get validated appreciations
   */
  getValidated: async (): Promise<AppreciationContentListResponse> => {
    return appreciationsClient.list({ status: "validated" });
  },
};

// ============================================================================
// Helper utilities for bulk generation
// ============================================================================

/**
 * Download exported file (ZIP/PDF)
 */
export function downloadExportedFile(blob: Blob, filename: string): void {
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
}

/**
 * Calculate estimated time for bulk generation
 * @param studentCount Number of students
 * @param timePerStudent Estimated seconds per student (default 10s)
 */
export function estimateBulkGenerationTime(
  studentCount: number,
  timePerStudent: number = 10,
): {
  seconds: number;
  formatted: string;
} {
  const seconds = studentCount * timePerStudent;
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  const formatted =
    minutes > 0 ? `${minutes}min ${remainingSeconds}s` : `${seconds}s`;

  return { seconds, formatted };
}

/**
 * Validate biweekly report generation request
 */
export function validateBiweeklyRequest(data: {
  studentIds: string[];
  styleGuideId?: string;
  periodStart?: Date;
  periodEnd?: Date;
}): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!data.studentIds || data.studentIds.length === 0) {
    errors.push("Au moins un élève doit être sélectionné");
  }

  if (!data.styleGuideId) {
    errors.push("Un guide de style doit être sélectionné");
  }

  if (data.periodStart && data.periodEnd) {
    const daysDiff =
      (data.periodEnd.getTime() - data.periodStart.getTime()) /
      (1000 * 60 * 60 * 24);
    if (daysDiff < 7 || daysDiff > 21) {
      errors.push("La période doit être entre 1 et 3 semaines (7-21 jours)");
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Get period for biweekly reports (last 2 weeks)
 */
export function getBiweeklyPeriod(): { start: Date; end: Date } {
  const end = new Date();
  const start = new Date();
  start.setDate(start.getDate() - 14); // 2 weeks ago

  return { start, end };
}

/**
 * Check if biweekly reports are due (more than 14 days since last generation)
 */
export function isBiweeklyReportDue(lastGenerationDate?: Date): boolean {
  if (!lastGenerationDate) return true;

  const daysSinceLastReport =
    (new Date().getTime() - lastGenerationDate.getTime()) /
    (1000 * 60 * 60 * 24);

  return daysSinceLastReport >= 14;
}
