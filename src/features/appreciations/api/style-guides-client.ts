/**
 * Style Guides API Client
 * Provides typed access to style-guides endpoints for AI content generation
 */

import { axiosInstance } from "@/lib/api";
import type { StyleGuide } from "@/types/uml-entities";

// ============================================================================
// Type Definitions (from OpenAPI spec + frontend extensions)
// ============================================================================

/**
 * API request/response types
 * Backend StyleGuide schema (snake_case)
 */
export interface StyleGuideResponse {
  id: string;
  created_by: string;
  name: string;
  tone: string; // 'formal' | 'semi-formal' | 'informal'
  register: string; // 'simple' | 'standard' | 'sophisticated'
  length: string; // 'court' | 'standard' | 'long'
  person: string; // 'premiere' | 'troisieme'
  variability: string; // 'low' | 'medium' | 'high'
  banned_phrases: string[];
  preferred_phrases: string[];
  is_default: boolean; // Backend manages default flag
  created_at: string;
  updated_at: string;
}

export interface StyleGuideListResponse {
  items: StyleGuideResponse[];
  next_cursor: string | null;
}

export interface CreateStyleGuideRequest {
  name: string;
  tone: string;
  register: string;
  length: string;
  person: string;
  variability: string;
  banned_phrases: string[];
  preferred_phrases: string[];
  is_default?: boolean;
}

export interface UpdateStyleGuideRequest {
  name?: string;
  tone?: string;
  register?: string;
  length?: string;
  person?: string;
  variability?: string;
  banned_phrases?: string[];
  preferred_phrases?: string[];
  is_default?: boolean;
}

// ============================================================================
// Frontend enums for style guide options
// ============================================================================

export const STYLE_GUIDE_TONES = ["formal", "semi-formal", "informal"] as const;
export const STYLE_GUIDE_REGISTERS = [
  "simple",
  "standard",
  "sophisticated",
] as const;
export const STYLE_GUIDE_LENGTHS = ["court", "standard", "long"] as const;
export const STYLE_GUIDE_PERSONS = ["premiere", "troisieme"] as const;
export const STYLE_GUIDE_VARIABILITY = ["low", "medium", "high"] as const;

export type StyleGuideTone = (typeof STYLE_GUIDE_TONES)[number];
export type StyleGuideRegister = (typeof STYLE_GUIDE_REGISTERS)[number];
export type StyleGuideLength = (typeof STYLE_GUIDE_LENGTHS)[number];
export type StyleGuidePerson = (typeof STYLE_GUIDE_PERSONS)[number];
export type StyleGuideVariability = (typeof STYLE_GUIDE_VARIABILITY)[number];

/**
 * Length target ranges in words (for UI display and validation)
 */
export const LENGTH_RANGES: Record<
  StyleGuideLength,
  { min: number; max: number }
> = {
  court: { min: 50, max: 80 },
  standard: { min: 80, max: 120 },
  long: { min: 120, max: 150 },
};

// ============================================================================
// Data mappers: API ↔ Frontend
// ============================================================================

/**
 * Convert API response to frontend StyleGuide type
 */
export function mapStyleGuideFromAPI(apiData: StyleGuideResponse): StyleGuide {
  return {
    id: apiData.id,
    createdBy: apiData.created_by,
    name: apiData.name,
    tone: apiData.tone,
    register: apiData.register,
    length: apiData.length,
    person: apiData.person,
    variability: apiData.variability,
    bannedPhrases: apiData.banned_phrases || [],
    preferredPhrases: apiData.preferred_phrases || [],
    createdAt: new Date(apiData.created_at),
    updatedAt: new Date(apiData.updated_at),
  };
}

/**
 * Convert frontend StyleGuide to API request format
 */
export function mapStyleGuideToAPI(
  data: Partial<StyleGuide> & { name: string },
): CreateStyleGuideRequest | UpdateStyleGuideRequest {
  const request: any = {
    name: data.name,
  };

  if (data.tone) request.tone = data.tone;
  if (data.register) request.register = data.register;
  if (data.length) request.length = data.length;
  if (data.person) request.person = data.person;
  if (data.variability) request.variability = data.variability;
  if (data.bannedPhrases) request.banned_phrases = data.bannedPhrases;
  if (data.preferredPhrases) request.preferred_phrases = data.preferredPhrases;

  return request;
}

// ============================================================================
// Style Guides Client
// ============================================================================

export const styleGuidesClient = {
  /**
   * List all style guides
   * GET /style-guides
   */
  list: async (params?: {
    tone?: string;
    register?: string;
    length?: string;
    cursor?: string;
    limit?: number;
  }): Promise<StyleGuideListResponse> => {
    const response = await axiosInstance.get<StyleGuideListResponse>(
      "/style-guides",
      { params },
    );
    return response.data;
  },

  /**
   * Get style guide by ID
   * GET /style-guides/{id}
   */
  getById: async (id: string): Promise<StyleGuideResponse> => {
    const response = await axiosInstance.get<StyleGuideResponse>(
      `/style-guides/${id}`,
    );
    return response.data;
  },

  /**
   * Create new style guide
   * POST /style-guides
   */
  create: async (
    data: CreateStyleGuideRequest,
  ): Promise<StyleGuideResponse> => {
    const response = await axiosInstance.post<StyleGuideResponse>(
      "/style-guides",
      data,
    );
    return response.data;
  },

  /**
   * Update existing style guide
   * PATCH /style-guides/{id}
   */
  update: async (
    id: string,
    data: UpdateStyleGuideRequest,
    etag?: string,
  ): Promise<StyleGuideResponse> => {
    const headers = etag ? { "If-Match": etag } : {};
    const response = await axiosInstance.patch<StyleGuideResponse>(
      `/style-guides/${id}`,
      data,
      { headers },
    );
    return response.data;
  },

  /**
   * Delete style guide
   * DELETE /style-guides/{id}
   */
  delete: async (id: string): Promise<void> => {
    await axiosInstance.delete(`/style-guides/${id}`);
  },

  /**
   * Set a style guide as default
   * PATCH /style-guides/{id} with is_default: true
   * This will automatically unset other guides as default on the backend
   */
  setAsDefault: async (id: string): Promise<StyleGuideResponse> => {
    const response = await axiosInstance.patch<StyleGuideResponse>(
      `/style-guides/${id}`,
      { is_default: true },
    );
    return response.data;
  },

  /**
   * Get the default style guide
   * Convenience method to get default guide (filters on backend)
   */
  getDefault: async (): Promise<StyleGuideResponse | null> => {
    const response = await styleGuidesClient.list();
    const defaultGuide = response.items.find((guide) => guide.is_default);
    return defaultGuide || null;
  },

  /**
   * Get style guides by tone
   * Convenience method to filter by tone
   */
  getByTone: async (tone: string): Promise<StyleGuideListResponse> => {
    return styleGuidesClient.list({ tone });
  },

  /**
   * Get style guides by register
   * Convenience method to filter by register
   */
  getByRegister: async (register: string): Promise<StyleGuideListResponse> => {
    return styleGuidesClient.list({ register });
  },

  /**
   * Get style guides by length
   * Convenience method to filter by length
   */
  getByLength: async (length: string): Promise<StyleGuideListResponse> => {
    return styleGuidesClient.list({ length });
  },
};

// ============================================================================
// Helper utilities for style guide management
// ============================================================================

/**
 * Validate style guide data before submission
 */
export function validateStyleGuide(data: Partial<CreateStyleGuideRequest>): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (!data.name || data.name.trim().length === 0) {
    errors.push("Le nom du guide est obligatoire");
  }

  if (data.tone && !STYLE_GUIDE_TONES.includes(data.tone as any)) {
    errors.push("Ton invalide");
  }

  if (data.register && !STYLE_GUIDE_REGISTERS.includes(data.register as any)) {
    errors.push("Registre invalide");
  }

  if (data.length && !STYLE_GUIDE_LENGTHS.includes(data.length as any)) {
    errors.push("Longueur invalide");
  }

  if (data.person && !STYLE_GUIDE_PERSONS.includes(data.person as any)) {
    errors.push("Personne invalide");
  }

  if (
    data.variability &&
    !STYLE_GUIDE_VARIABILITY.includes(data.variability as any)
  ) {
    errors.push("Variabilité invalide");
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Get display labels for style guide options (French)
 */
export const STYLE_GUIDE_LABELS = {
  tones: {
    formal: "Formel",
    "semi-formal": "Semi-formel",
    informal: "Informel",
  },
  registers: {
    simple: "Simple",
    standard: "Standard",
    sophisticated: "Soutenu",
  },
  lengths: {
    court: "Court (50-80 mots)",
    standard: "Standard (80-120 mots)",
    long: "Long (120-150 mots)",
  },
  persons: {
    premiere: "1ère personne",
    troisieme: "3ème personne",
  },
  variability: {
    low: "Faible",
    medium: "Moyenne",
    high: "Élevée",
  },
} as const;

/**
 * Get word count target for a given length
 */
export function getWordCountTarget(length: StyleGuideLength): {
  min: number;
  max: number;
} {
  return LENGTH_RANGES[length];
}

/**
 * Check if a text matches the style guide length requirements
 */
export function isWithinLengthRange(
  text: string,
  length: StyleGuideLength,
): boolean {
  const wordCount = text.trim().split(/\s+/).length;
  const range = LENGTH_RANGES[length];
  return wordCount >= range.min && wordCount <= range.max;
}

/**
 * Normalize phrase arrays (trim, remove empty strings)
 */
export function normalizePhrases(phrases: string[]): string[] {
  return phrases
    .map((p) => p.trim())
    .filter((p) => p.length > 0)
    .filter((p, index, self) => self.indexOf(p) === index); // Remove duplicates
}
