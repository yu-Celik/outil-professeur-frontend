/**
 * Phrase Banks API Client
 * Provides typed access to phrase-banks endpoints for AI content generation
 */

import { axiosInstance } from "@/lib/api";
import type { PhraseBank } from "@/types/uml-entities";

// ============================================================================
// Type Definitions (from OpenAPI spec + frontend extensions)
// ============================================================================

/**
 * API request/response types
 * Note: The backend stores PhraseBank with `entries: Record<string, unknown>`
 * The frontend extends this with structured phrase entry types
 */

export interface PhraseBankResponse {
  id: string;
  created_by: string;
  scope: string; // 'general' | 'subject_specific' | 'class_specific'
  subject_id: string | null;
  entries: Record<string, unknown>; // Backend generic storage
  created_at: string;
  updated_at: string;
}

export interface PhraseBankListResponse {
  items: PhraseBankResponse[];
  next_cursor: string | null;
}

export interface CreatePhraseBankRequest {
  scope: string;
  subject_id?: string | null;
  entries: Record<string, unknown>;
}

export interface UpdatePhraseBankRequest {
  scope?: string;
  subject_id?: string | null;
  entries?: Record<string, unknown>;
}

// ============================================================================
// Frontend-specific types for structured phrase entries
// ============================================================================

/**
 * Categories for phrase organization
 */
export type PhraseCategory =
  | "attendance" // Présence
  | "participation" // Participation
  | "behavior" // Comportement
  | "progress" // Progrès
  | "difficulties" // Difficultés
  | "encouragement"; // Encouragements

/**
 * Individual phrase entry with metadata
 */
export interface PhraseEntry {
  id: string; // Frontend-generated UUID for UI management
  phrase: string;
  category: PhraseCategory;
  tags: string[]; // e.g., ['bonne_presence', 'progres_notable']
  context?: {
    attendanceRange?: [number, number]; // e.g., [75, 100]
    participationLevel?: "low" | "medium" | "high";
    behaviorScore?: [number, number];
    gradeRange?: [number, number];
  };
}

/**
 * Structured entries format for frontend use
 * Maps category to array of phrases
 */
export interface StructuredPhraseEntries {
  attendance?: PhraseEntry[];
  participation?: PhraseEntry[];
  behavior?: PhraseEntry[];
  progress?: PhraseEntry[];
  difficulties?: PhraseEntry[];
  encouragement?: PhraseEntry[];
}

// ============================================================================
// Data mappers: API ↔ Frontend
// ============================================================================

/**
 * Convert API response to frontend PhraseBank type
 */
export function mapPhraseBankFromAPI(apiData: PhraseBankResponse): PhraseBank {
  return {
    id: apiData.id,
    createdBy: apiData.created_by,
    scope: apiData.scope,
    subjectId: apiData.subject_id || "",
    entries: apiData.entries,
    createdAt: new Date(apiData.created_at),
    updatedAt: new Date(apiData.updated_at),
  };
}

/**
 * Convert frontend PhraseBank to API request format
 */
export function mapPhraseBankToAPI(
  data: Partial<PhraseBank>,
): CreatePhraseBankRequest | UpdatePhraseBankRequest {
  return {
    scope: data.scope,
    subject_id: data.subjectId || null,
    entries: data.entries || {},
  };
}

// ============================================================================
// Phrase Banks Client
// ============================================================================

export const phraseBanksClient = {
  /**
   * List all phrase banks
   * GET /phrase-banks
   */
  list: async (params?: {
    scope?: string;
    subject_id?: string;
    cursor?: string;
    limit?: number;
  }): Promise<PhraseBankListResponse> => {
    const response = await axiosInstance.get<PhraseBankListResponse>(
      "/phrase-banks",
      { params },
    );
    return response.data;
  },

  /**
   * Get phrase bank by ID
   * GET /phrase-banks/{id}
   */
  getById: async (id: string): Promise<PhraseBankResponse> => {
    const response = await axiosInstance.get<PhraseBankResponse>(
      `/phrase-banks/${id}`,
    );
    return response.data;
  },

  /**
   * Create new phrase bank
   * POST /phrase-banks
   */
  create: async (
    data: CreatePhraseBankRequest,
  ): Promise<PhraseBankResponse> => {
    const response = await axiosInstance.post<PhraseBankResponse>(
      "/phrase-banks",
      data,
    );
    return response.data;
  },

  /**
   * Update existing phrase bank
   * PATCH /phrase-banks/{id}
   */
  update: async (
    id: string,
    data: UpdatePhraseBankRequest,
    etag?: string,
  ): Promise<PhraseBankResponse> => {
    const headers = etag ? { "If-Match": etag } : {};
    const response = await axiosInstance.patch<PhraseBankResponse>(
      `/phrase-banks/${id}`,
      data,
      { headers },
    );
    return response.data;
  },

  /**
   * Delete phrase bank
   * DELETE /phrase-banks/{id}
   */
  delete: async (id: string): Promise<void> => {
    await axiosInstance.delete(`/phrase-banks/${id}`);
  },

  /**
   * Get phrase banks by scope
   * Convenience method to filter by scope (general, subject_specific, etc.)
   */
  getByScope: async (scope: string): Promise<PhraseBankListResponse> => {
    return phraseBanksClient.list({ scope });
  },

  /**
   * Get phrase banks for a specific subject
   * Convenience method to get subject-specific phrase banks
   */
  getBySubject: async (subjectId: string): Promise<PhraseBankListResponse> => {
    return phraseBanksClient.list({ subject_id: subjectId });
  },
};

// ============================================================================
// Helper utilities for structured phrase management
// ============================================================================

/**
 * Helper to create structured entries from phrase list
 */
export function createStructuredEntries(
  phrases: PhraseEntry[],
): StructuredPhraseEntries {
  return phrases.reduce((acc, phrase) => {
    const category = phrase.category;
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category]!.push(phrase);
    return acc;
  }, {} as StructuredPhraseEntries);
}

/**
 * Helper to flatten structured entries to phrase list
 */
export function flattenStructuredEntries(
  entries: StructuredPhraseEntries,
): PhraseEntry[] {
  return Object.values(entries)
    .flat()
    .filter((p) => p !== undefined);
}

/**
 * Helper to get all phrases for a specific category
 */
export function getPhrasesByCategory(
  entries: Record<string, unknown>,
  category: PhraseCategory,
): PhraseEntry[] {
  const structured = entries as StructuredPhraseEntries;
  return structured[category] || [];
}
