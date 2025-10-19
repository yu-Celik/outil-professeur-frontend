import { useState, useCallback } from "react";
import { format } from "date-fns";
import type { WeeklyTemplate } from "@/types/uml-entities";
import { WeekSessionGenerator } from "@/services/session-generator";
import { api } from "@/lib/api";

interface SessionGenerationResult {
  successful: number;
  failed: number;
  total: number;
  errors: string[];
}

/**
 * Hook for generating course sessions from weekly templates
 * Handles bulk session creation via API with progress tracking
 */
export function useSessionGeneration() {
  const [generating, setGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  /**
   * Generate sessions from a weekly template
   * @param template Weekly template to generate from
   * @param startDate Start date of generation period
   * @param endDate End date of generation period
   * @returns Generation result with counts
   */
  const generateSessions = useCallback(
    async (
      template: WeeklyTemplate,
      startDate: Date,
      endDate: Date,
    ): Promise<SessionGenerationResult> => {
      setGenerating(true);
      setProgress(0);
      setError(null);

      try {
        // 1. Calculate all session dates using the service
        const sessionDates = WeekSessionGenerator.generateSessionDates(
          template,
          startDate,
          endDate,
        );

        if (sessionDates.length === 0) {
          return {
            successful: 0,
            failed: 0,
            total: 0,
            errors: ["Aucune session à générer pour cette période"],
          };
        }

        // 2. Create sessions via batch API calls
        const results = await Promise.allSettled(
          sessionDates.map(async (date, index) => {
            try {
              // Create session via API
              await api.courseSessions.create({
                session_date: format(date, "yyyy-MM-dd"),
                time_slot_id: template.timeSlotId,
                class_id: template.classId,
                subject_id: template.subjectId,
                status: "planned",
              });

              // Update progress
              setProgress(((index + 1) / sessionDates.length) * 100);

              return { success: true, date };
            } catch (err) {
              return {
                success: false,
                date,
                error: err instanceof Error ? err.message : "Unknown error",
              };
            }
          }),
        );

        // 3. Count successes and failures
        const successful = results.filter(
          (r) => r.status === "fulfilled",
        ).length;
        const failed = results.filter((r) => r.status === "rejected").length;
        const errors = results
          .filter((r) => r.status === "rejected")
          .map((r) => {
            if (r.status === "rejected") {
              return r.reason?.message || "Erreur inconnue";
            }
            return "";
          })
          .filter(Boolean);

        setProgress(100);

        return {
          successful,
          failed,
          total: sessionDates.length,
          errors,
        };
      } catch (err) {
        const errorMessage =
          err instanceof Error
            ? err.message
            : "Erreur lors de la génération des sessions";
        setError(errorMessage);
        throw err;
      } finally {
        setGenerating(false);
      }
    },
    [],
  );

  /**
   * Calculate how many sessions will be generated (preview)
   */
  const calculateSessionCount = useCallback(
    (template: WeeklyTemplate, startDate: Date, endDate: Date): number => {
      return WeekSessionGenerator.calculateSessionCount(
        template,
        startDate,
        endDate,
      );
    },
    [],
  );

  /**
   * Reset state
   */
  const reset = useCallback(() => {
    setGenerating(false);
    setProgress(0);
    setError(null);
  }, []);

  return {
    generating,
    progress,
    error,
    generateSessions,
    calculateSessionCount,
    reset,
  };
}
