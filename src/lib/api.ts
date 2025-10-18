/**
 * API Client for Rust Backend (Souz)
 * Base URL: http://localhost:8080
 * Authentication: JWT stored in HttpOnly cookie (auth_token)
 * Refresh Token: Automatic rotation with Epic 7 system
 */

import axios, {
  type AxiosError,
  type AxiosInstance,
  type InternalAxiosRequestConfig,
} from "axios";
import type {
  LoginResponse,
  RegisterResponse,
  RefreshResponse,
  LogoutResponse,
} from "@/types/auth";
import { tokenManager } from "@/lib/auth/token-manager";
import { isTokenExpiringSoon, getCsrfToken } from "@/lib/auth/token-storage";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
const ENABLE_CSRF_HEADER =
  process.env.NEXT_PUBLIC_ENABLE_CSRF_HEADER === "true";

export class ApiError extends Error {
  constructor(
    message: string,
    public status?: number,
    public code?: string,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

/**
 * Get user-friendly HTTP error messages (SaaS-style)
 */
function getHttpErrorMessage(status: number): string {
  switch (status) {
    case 400:
      return "Requête invalide. Veuillez vérifier les informations saisies.";
    case 401:
      return "Session expirée. Veuillez vous reconnecter.";
    case 403:
      return "Accès refusé. Vous n'avez pas les permissions nécessaires.";
    case 404:
      return "Ressource introuvable.";
    case 409:
      return "Conflit détecté. Cette opération ne peut pas être effectuée.";
    case 422:
      return "Données invalides. Veuillez vérifier votre saisie.";
    case 429:
      return "Trop de requêtes. Veuillez patienter quelques instants.";
    case 500:
      return "Erreur serveur. Nos équipes ont été notifiées.";
    case 502:
    case 503:
    case 504:
      return "Le service est temporairement indisponible. Veuillez réessayer dans quelques instants.";
    default:
      return `Erreur ${status}. Veuillez réessayer ou contacter le support.`;
  }
}

// Create axios instance
const axiosInstance: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // 30 seconds
  withCredentials: true, // CRITICAL: Send auth_token cookie
  headers: {
    "Content-Type": "application/json",
  },
});

// ============================================================================
// Request Interceptor - CSRF token + Auto-refresh before expiration
// ============================================================================
axiosInstance.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    // Add CSRF token header for defense-in-depth (configurable)
    if (ENABLE_CSRF_HEADER && config.headers) {
      const csrfToken = getCsrfToken();
      if (csrfToken) {
        config.headers["X-CSRF-Token"] = csrfToken;
      }
    }

    // Skip token check for auth endpoints
    const isAuthEndpoint = config.url?.startsWith("/auth/");
    if (isAuthEndpoint) {
      return config;
    }

    // Check if token is expiring soon (within 2 minutes)
    if (isTokenExpiringSoon()) {
      try {
        // Trigger refresh (will queue other requests)
        await tokenManager.checkAndRefresh();
      } catch (error) {
        console.error("Pre-request token refresh failed:", error);
        // Continue with request, let response interceptor handle 401
      }
    }

    return config;
  },
  (error) => Promise.reject(error),
);

// ============================================================================
// Response Interceptor - Handle 401 and errors
// ============================================================================
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    // Handle 401 Unauthorized - token expired
    if (error.response?.status === 401 && !originalRequest._retry) {
      // Skip retry for auth endpoints (avoid infinite loop)
      const isAuthEndpoint = originalRequest.url?.startsWith("/auth/");
      if (isAuthEndpoint) {
        const data = error.response.data as any;
        const errorMessage =
          data?.message ||
          data?.error ||
          getHttpErrorMessage(error.response.status);
        throw new ApiError(errorMessage, error.response.status, data?.code);
      }

      // Mark request as retried
      originalRequest._retry = true;

      try {
        // Attempt token refresh
        await tokenManager.forceRefresh();

        // Retry original request with new token
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        // Refresh failed - logout required
        console.error("Token refresh failed on 401:", refreshError);
        throw new ApiError(
          "Session expirée. Veuillez vous reconnecter.",
          401,
          "TOKEN_REFRESH_FAILED",
        );
      }
    }

    // Handle other errors
    if (error.response) {
      // Server responded with error status
      const data = error.response.data as any;
      const errorMessage =
        data?.message ||
        data?.error ||
        getHttpErrorMessage(error.response.status);
      throw new ApiError(errorMessage, error.response.status, data?.code);
    } else if (error.request) {
      // Network error - no response received
      throw new ApiError(
        "Le service est temporairement indisponible. Veuillez vérifier que le serveur backend est démarré.",
        undefined,
        "NETWORK_ERROR",
      );
    } else {
      // Something else happened
      throw new ApiError(
        error.message || "Une erreur inattendue s'est produite",
        undefined,
        "UNKNOWN_ERROR",
      );
    }
  },
);

// Typed API helpers
export const api = {
  auth: {
    /**
     * Login with email and password
     * Returns user data and session metadata for token refresh
     */
    login: async (email: string, password: string) => {
      const response = await axiosInstance.post<LoginResponse>("/auth/login", {
        email,
        password,
      });
      return response.data;
    },

    /**
     * Register new user
     * Returns user data and session metadata for token refresh
     */
    register: async (email: string, password: string, displayName: string) => {
      const response = await axiosInstance.post<RegisterResponse>(
        "/auth/register",
        {
          email,
          password,
          display_name: displayName,
        },
      );
      return response.data;
    },

    /**
     * Get current authenticated user
     */
    me: async () => {
      const response = await axiosInstance.get<{
        id: string;
        email: string;
        display_name: string;
      }>("/auth/me");
      return response.data;
    },

    /**
     * Refresh access token using HttpOnly refresh token cookie
     * Returns new session metadata with updated expiration
     */
    refresh: async () => {
      const response = await axiosInstance.post<RefreshResponse>(
        "/auth/refresh",
        {},
        {
          headers: {
            "Content-Type": "application/json",
          },
        },
      );
      return response.data;
    },

    /**
     * Logout user and revoke refresh token
     */
    logout: async () => {
      const response = await axiosInstance.post<LogoutResponse>(
        "/auth/logout",
        {},
        {
          headers: {
            "Content-Type": "application/json",
          },
        },
      );
      return response.data;
    },
  },

  // Students endpoints
  students: {
    list: async (params?: {
      cursor?: string;
      limit?: number;
      q?: string;
      class_id?: string;
    }) => {
      const response = await axiosInstance.get<{
        items: any[];
        next_cursor: string | null;
      }>("/students", {
        params,
      });
      return response.data;
    },

    getById: async (id: string) => {
      const response = await axiosInstance.get<any>(`/students/${id}`);
      return response.data;
    },

    create: async (data: any) => {
      const response = await axiosInstance.post<any>("/students", data);
      return response.data;
    },

    update: async (id: string, data: any) => {
      const response = await axiosInstance.patch<any>(`/students/${id}`, data);
      return response.data;
    },

    delete: async (id: string) => {
      await axiosInstance.delete(`/students/${id}`);
    },
  },

  // Classes endpoints
  classes: {
    list: async (params?: {
      cursor?: string;
      limit?: number;
      school_year_id?: string;
    }) => {
      const response = await axiosInstance.get<{
        items: any[];
        next_cursor: string | null;
      }>("/classes", {
        params,
      });
      return response.data;
    },

    getById: async (id: string) => {
      const response = await axiosInstance.get<any>(`/classes/${id}`);
      return response.data;
    },

    create: async (data: any, idempotencyKey: string) => {
      const response = await axiosInstance.post<any>("/classes", data, {
        headers: {
          "Idempotency-Key": idempotencyKey,
        },
      });
      return response.data;
    },

    update: async (id: string, data: any, etag?: string) => {
      const response = await axiosInstance.patch<any>(`/classes/${id}`, data, {
        headers: etag ? { "If-Match": etag } : {},
      });
      return response.data;
    },

    delete: async (id: string) => {
      await axiosInstance.delete(`/classes/${id}`);
    },
  },

  // School Years endpoints
  schoolYears: {
    list: async (params?: {
      cursor?: string;
      limit?: number;
      is_active?: boolean;
    }) => {
      const response = await axiosInstance.get<{
        items: any[];
        next_cursor: string | null;
      }>("/school-years", {
        params,
      });
      return response.data;
    },

    getById: async (id: string) => {
      const response = await axiosInstance.get<any>(`/school-years/${id}`);
      return response.data;
    },

    create: async (data: any) => {
      const response = await axiosInstance.post<any>("/school-years", data);
      return response.data;
    },

    update: async (id: string, data: any) => {
      const response = await axiosInstance.patch<any>(
        `/school-years/${id}`,
        data,
      );
      return response.data;
    },

    delete: async (id: string) => {
      await axiosInstance.delete(`/school-years/${id}`);
    },
  },

  // Course Sessions endpoints
  courseSessions: {
    list: async (params?: {
      class_id?: string;
      subject_id?: string;
      date?: string;
      from?: string;
      to?: string;
      status?: string;
      cursor?: string;
      limit?: number;
    }) => {
      const response = await axiosInstance.get<{
        items: any[];
        next_cursor: string | null;
      }>("/course-sessions", {
        params,
      });
      return response.data;
    },

    getById: async (id: string) => {
      const response = await axiosInstance.get<any>(`/course-sessions/${id}`);
      return response.data;
    },

    create: async (data: any) => {
      const response = await axiosInstance.post<any>("/course-sessions", data);
      return response.data;
    },

    update: async (id: string, data: any) => {
      const response = await axiosInstance.patch<any>(
        `/course-sessions/${id}`,
        data,
      );
      return response.data;
    },

    delete: async (id: string) => {
      await axiosInstance.delete(`/course-sessions/${id}`);
    },
  },

  // Weekly Templates endpoints
  weeklyTemplates: {
    list: async (params?: {
      cursor?: string;
      limit?: number;
      school_year_id?: string;
      day_of_week?: number;
      class_id?: string;
      subject_id?: string;
    }) => {
      const response = await axiosInstance.get<{
        data: any[];
        next_cursor: string | null;
      }>("/weekly-templates", {
        params,
      });
      return response.data;
    },

    create: async (data: {
      school_year_id: string;
      day_of_week: number;
      time_slot_id: string;
      class_id: string;
      subject_id: string;
      is_active?: boolean;
    }) => {
      const response = await axiosInstance.post<any>("/weekly-templates", data);
      return response.data;
    },

    delete: async (id: string) => {
      await axiosInstance.delete(`/weekly-templates/${id}`);
    },
  },

  // Exams endpoints
  exams: {
    list: async (params?: {
      cursor?: string;
      limit?: number;
      class_id?: string;
      subject_id?: string;
      school_year_id?: string;
      exam_date?: string;
      from?: string;
      to?: string;
      is_published?: boolean;
    }) => {
      const response = await axiosInstance.get<{
        items: any[];
        next_cursor: string | null;
      }>("/exams", {
        params,
      });
      return response.data;
    },

    getById: async (id: string) => {
      const response = await axiosInstance.get<any>(`/exams/${id}`);
      return response.data;
    },

    create: async (data: {
      title: string;
      class_id: string;
      subject_id: string;
      school_year_id: string;
      exam_date: string;
      description?: string;
      exam_type?: string;
      duration_minutes?: number;
      max_points?: number;
      coefficient?: number;
      instructions?: string;
      notation_system_id?: string;
      rubric_id?: string;
      is_published?: boolean;
    }) => {
      const response = await axiosInstance.post<any>("/exams", data);
      return response.data;
    },

    update: async (
      id: string,
      data: Partial<{
        title: string;
        class_id: string;
        subject_id: string;
        school_year_id: string;
        exam_date: string;
        description?: string;
        exam_type?: string;
        duration_minutes?: number;
        max_points?: number;
        coefficient?: number;
        instructions?: string;
        notation_system_id?: string;
        rubric_id?: string;
        is_published?: boolean;
      }>,
    ) => {
      const response = await axiosInstance.patch<any>(`/exams/${id}`, data);
      return response.data;
    },

    delete: async (id: string) => {
      await axiosInstance.delete(`/exams/${id}`);
    },

    // Exam Results endpoints
    getResults: async (
      examId: string,
      params?: {
        cursor?: string;
        limit?: number;
      },
    ) => {
      const response = await axiosInstance.get<{
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
      }>(`/exams/${examId}/results`, {
        params,
      });
      return response.data;
    },

    upsertResults: async (
      examId: string,
      data: {
        items: Array<{
          student_id: string;
          points_obtained?: number | null;
          is_absent: boolean;
          comments?: string | null;
        }>;
      },
    ) => {
      const response = await axiosInstance.put<{
        updated_count: number;
        items: Array<{
          id: string;
          exam_id: string;
          student_id: string;
          points_obtained: number;
          is_absent: boolean;
          comments: string | null;
          marked_at: string;
        }>;
      }>(`/exams/${examId}/results`, data);
      return response.data;
    },

    getStats: async (examId: string) => {
      const response = await axiosInstance.get<{
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
      }>(`/exams/${examId}/stats`);
      return response.data;
    },
  },
};

// Export axios instance for direct use if needed
export { axiosInstance };
