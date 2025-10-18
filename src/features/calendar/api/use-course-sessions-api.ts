"use client";

import { useCallback, useEffect, useState } from "react";
import { type ApiError, api } from "@/lib/api";
import type { CourseSession } from "@/types/uml-entities";

interface CourseSessionApiResponse {
  id: string;
  createdBy?: string;
  created_by?: string;
  classId?: string;
  class_id?: string;
  subjectId?: string;
  subject_id?: string;
  timeSlotId?: string;
  time_slot_id?: string;
  sessionDate?: string | number | Date;
  session_date?: string | number | Date;
  status?: CourseSession["status"];
  objectives?: string | null;
  content?: string | null;
  homeworkAssigned?: string | null;
  homework_assigned?: string | null;
  isMakeup?: boolean;
  is_makeup?: boolean;
  isMoved?: boolean;
  is_moved?: boolean;
  notes?: string | null;
  createdAt?: string | number | Date;
  created_at?: string | number | Date;
  updatedAt?: string | number | Date;
  updated_at?: string | number | Date;
  subjectName?: string;
  classCode?: string;
  subject?: { name?: string };
  class?: { classCode?: string; gradeLabel?: string };
  [key: string]: unknown;
}

interface CourseSessionsListResponse {
  items?: CourseSessionApiResponse[];
  next_cursor?: string | null;
}

function toSessionPayload(
  data: Partial<CourseSession>,
): Record<string, unknown> {
  const payload: Record<string, unknown> = {};

  if (data.classId) payload.class_id = data.classId;
  if (data.subjectId) payload.subject_id = data.subjectId;
  if (data.timeSlotId) payload.time_slot_id = data.timeSlotId;
  if (data.status) payload.status = data.status;
  if (data.objectives !== undefined) payload.objectives = data.objectives;
  if (data.content !== undefined) payload.content = data.content;
  if (data.homeworkAssigned !== undefined) {
    payload.homework_assigned = data.homeworkAssigned;
  }
  if (data.notes !== undefined) payload.notes = data.notes;
  if (data.isMakeup !== undefined) payload.is_makeup = data.isMakeup;
  if (data.isMoved !== undefined) payload.is_moved = data.isMoved;
  if (data.sessionDate) {
    if (data.sessionDate instanceof Date) {
      payload.session_date = data.sessionDate.toISOString().split("T")[0];
    } else {
      payload.session_date = data.sessionDate;
    }
  }

  return payload;
}

const toDate = (value: unknown): Date | null => {
  if (value instanceof Date) return value;
  if (typeof value === "number") {
    const parsed = new Date(value);
    return Number.isNaN(parsed.valueOf()) ? null : parsed;
  }
  if (typeof value === "string" && value.trim().length > 0) {
    const parsed = new Date(value);
    return Number.isNaN(parsed.valueOf()) ? null : parsed;
  }
  return null;
};

const toOptionalString = (value: unknown): string | null =>
  typeof value === "string" && value.trim().length > 0 ? value : null;

const toStringOrEmpty = (value: unknown): string =>
  typeof value === "string" ? value : "";

const toBoolean = (value: unknown, fallback = false): boolean =>
  typeof value === "boolean" ? value : fallback;

const toStatus = (value: unknown): CourseSession["status"] => {
  if (
    value === "planned" ||
    value === "in_progress" ||
    value === "done" ||
    value === "cancelled"
  ) {
    return value;
  }
  return "planned";
};

export interface UseCourseSessionsApiOptions {
  classId?: string;
  subjectId?: string;
  date?: string;
  from?: string;
  to?: string;
  status?: string;
  autoFetch?: boolean;
}

export interface UseCourseSessionsApiResult {
  sessions: CourseSession[];
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  createSession: (data: Partial<CourseSession>) => Promise<CourseSession>;
  updateSession: (
    id: string,
    data: Partial<CourseSession>,
  ) => Promise<CourseSession>;
  deleteSession: (id: string) => Promise<void>;
}

/**
 * Hook pour gérer les sessions de cours via l'API
 * Supporte le fallback sur les données mock si l'API n'est pas disponible
 */
export function useCourseSessionsApi(
  options: UseCourseSessionsApiOptions = {},
): UseCourseSessionsApiResult {
  const {
    classId,
    subjectId,
    date,
    from,
    to,
    status,
    autoFetch = true,
  } = options;

  const [sessions, setSessions] = useState<CourseSession[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isDevelopment = process.env.NODE_ENV !== "production";

  const toCourseSession = useCallback(
    (raw: CourseSessionApiResponse): CourseSession => {
      const sessionDate =
        toDate(raw.sessionDate ?? raw.session_date) ?? new Date();

      const defaultSummarySubject =
        toOptionalString(raw.subject?.name) ??
        toOptionalString(raw.subjectName) ??
        toStringOrEmpty(raw.subject_id ?? raw.subjectId);
      const defaultSummaryClass =
        toOptionalString(raw.class?.classCode) ??
        toOptionalString(raw.classCode) ??
        toStringOrEmpty(raw.class_id ?? raw.classId);

      const createdAt =
        toDate(raw.createdAt ?? raw.created_at) ??
        // fallback to sessionDate to preserve chronological ordering
        new Date(sessionDate);
      const updatedAt =
        toDate(raw.updatedAt ?? raw.updated_at) ??
        new Date(createdAt.getTime());

      return {
        id: raw.id,
        createdBy: toStringOrEmpty(raw.createdBy ?? raw.created_by),
        classId: toStringOrEmpty(raw.classId ?? raw.class_id),
        subjectId: toStringOrEmpty(raw.subjectId ?? raw.subject_id),
        timeSlotId: toStringOrEmpty(raw.timeSlotId ?? raw.time_slot_id),
        sessionDate,
        status: toStatus(raw.status),
        objectives: toOptionalString(raw.objectives),
        content: toOptionalString(raw.content),
        homeworkAssigned: toOptionalString(
          raw.homeworkAssigned ?? raw.homework_assigned,
        ),
        isMakeup: toBoolean(raw.isMakeup ?? raw.is_makeup),
        isMoved: toBoolean(raw.isMoved ?? raw.is_moved),
        notes: toOptionalString(raw.notes),
        createdAt,
        updatedAt,
        reschedule: () => {},
        takeAttendance: () => {},
        summary: () => `${defaultSummarySubject} - ${defaultSummaryClass}`,
      };
    },
    [],
  );
  const mapSessions = useCallback(
    (items?: CourseSessionApiResponse[]): CourseSession[] => {
      if (!items || items.length === 0) return [];
      return items.map(toCourseSession);
    },
    [toCourseSession],
  );

  const fetchSessions = useCallback(async () => {
    if (!autoFetch) return;

    setLoading(true);
    setError(null);

    try {
      const params: Record<string, string> = {};
      if (classId) params.class_id = classId;
      if (subjectId) params.subject_id = subjectId;
      if (date) params.date = date;
      if (from) params.from = from;
      if (to) params.to = to;
      if (status) params.status = status;

      const response = (await api.courseSessions.list(
        params,
      )) as CourseSessionsListResponse;
      if (isDevelopment) {
        console.info(
          "[useCourseSessionsApi] Sessions received:",
          response.items?.length ?? 0,
        );
      }
      setSessions(mapSessions(response.items));
      setError(null);
    } catch (err) {
      const apiError = err as ApiError;
      const errorMessage =
        apiError.message ||
        "Erreur lors du chargement des sessions. Utilisation des données mock.";
      setError(errorMessage);
      if (isDevelopment) {
        console.warn("[useCourseSessionsApi] Fetch failed:", apiError);
      }
      // Ne pas définir sessions ici - le composant parent gérera le fallback
    } finally {
      setLoading(false);
    }
  }, [
    autoFetch,
    classId,
    from,
    mapSessions,
    status,
    subjectId,
    date,
    to,
    isDevelopment,
  ]);

  useEffect(() => {
    if (autoFetch) {
      fetchSessions();
    }
  }, [autoFetch, fetchSessions]);

  const createSession = useCallback(
    async (data: Partial<CourseSession>): Promise<CourseSession> => {
      setLoading(true);
      setError(null);

      try {
        const response = (await api.courseSessions.create(
          toSessionPayload(data),
        )) as CourseSessionApiResponse;
        const normalized = toCourseSession(response);
        await fetchSessions(); // Rafraîchir la liste
        return normalized;
      } catch (err) {
        const apiError = err as ApiError;
        const errorMessage =
          apiError.message || "Erreur lors de la création de la session";
        setError(errorMessage);
        throw apiError;
      } finally {
        setLoading(false);
      }
    },
    [fetchSessions, toCourseSession],
  );

  const updateSession = useCallback(
    async (
      id: string,
      data: Partial<CourseSession>,
    ): Promise<CourseSession> => {
      setLoading(true);
      setError(null);

      try {
        const response = (await api.courseSessions.update(
          id,
          toSessionPayload(data),
        )) as CourseSessionApiResponse;
        const normalized = toCourseSession(response);
        await fetchSessions(); // Rafraîchir la liste
        return normalized;
      } catch (err) {
        const apiError = err as ApiError;
        const errorMessage =
          apiError.message || "Erreur lors de la mise à jour de la session";
        setError(errorMessage);
        throw apiError;
      } finally {
        setLoading(false);
      }
    },
    [fetchSessions, toCourseSession],
  );

  const deleteSession = useCallback(
    async (id: string): Promise<void> => {
      setLoading(true);
      setError(null);

      try {
        await api.courseSessions.delete(id);
        await fetchSessions(); // Rafraîchir la liste
      } catch (err) {
        const apiError = err as ApiError;
        const errorMessage =
          apiError.message || "Erreur lors de la suppression de la session";
        setError(errorMessage);
        throw apiError;
      } finally {
        setLoading(false);
      }
    },
    [fetchSessions],
  );

  return {
    sessions,
    loading,
    error,
    refresh: fetchSessions,
    createSession,
    updateSession,
    deleteSession,
  };
}
