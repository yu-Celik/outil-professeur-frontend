"use client";

import { useCallback, useEffect, useState } from "react";
import { useAsyncOperation, useAlertInvalidation } from "@/shared/hooks";
import {
  StudentAlertsService,
  type StudentAlertsResult,
  type StudentAlert,
} from "../services/student-alerts-service";
import type { ClassAnalyticsParams } from "../api/student-alerts-client";

export interface UseStudentAlertsOptions {
  classIds: Array<{ id: string; name?: string }>;
  params?: ClassAnalyticsParams;
  autoLoad?: boolean;
  pollingInterval?: number;
}

export interface UseStudentAlertsResult {
  alerts: StudentAlert[];
  alertsByClass: Map<string, StudentAlert[]>;
  totalCount: number;
  isLoading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  invalidateCache: () => void;
}

/**
 * Hook pour gérer les alertes élèves en difficulté.
 * Agrège les alertes de plusieurs classes et gère le cache et le rafraîchissement.
 */
export function useStudentAlerts(
  options: UseStudentAlertsOptions,
): UseStudentAlertsResult {
  const { classIds, params, autoLoad = true, pollingInterval } = options;
  const { isLoading, error, execute } =
    useAsyncOperation<StudentAlertsResult[]>();

  const [results, setResults] = useState<StudentAlertsResult[]>([]);
  const [alerts, setAlerts] = useState<StudentAlert[]>([]);
  const [alertsByClass, setAlertsByClass] = useState<
    Map<string, StudentAlert[]>
  >(new Map());

  const loadAlerts = useCallback(async () => {
    if (classIds.length === 0) {
      setResults([]);
      setAlerts([]);
      setAlertsByClass(new Map());
      return;
    }

    const alertsResults = await execute(() =>
      StudentAlertsService.getAlertsForClasses(classIds, { params }),
    );

    setResults(alertsResults);

    // Aggregate all alerts
    const allAlerts = alertsResults.flatMap((result) => result.alerts);
    setAlerts(allAlerts);

    // Build alerts by class map
    const byClass = new Map<string, StudentAlert[]>();
    alertsResults.forEach((result) => {
      byClass.set(result.classId, result.alerts);
    });
    setAlertsByClass(byClass);
  }, [classIds, params, execute]);

  const refresh = useCallback(async () => {
    await loadAlerts();
  }, [loadAlerts]);

  const invalidateCache = useCallback(() => {
    StudentAlertsService.invalidateCache();
  }, []);

  // Auto-load on mount or when dependencies change
  useEffect(() => {
    if (autoLoad) {
      loadAlerts();
    }
  }, [autoLoad, loadAlerts]);

  // Optional polling
  useEffect(() => {
    if (!pollingInterval) {
      return;
    }

    const interval = setInterval(() => {
      loadAlerts();
    }, pollingInterval);

    return () => clearInterval(interval);
  }, [pollingInterval, loadAlerts]);

  // Listen for invalidation events and auto-refresh
  useAlertInvalidation(
    useCallback(
      (payload) => {
        const isDevelopment = process.env.NODE_ENV !== "production";
        if (isDevelopment) {
          console.info(
            "[useStudentAlerts] Invalidation event received:",
            payload,
          );
        }

        // Refresh alerts when invalidation event occurs
        // Cache is already invalidated by the event bus
        loadAlerts();
      },
      [loadAlerts],
    ),
  );

  return {
    alerts,
    alertsByClass,
    totalCount: alerts.length,
    isLoading,
    error,
    refresh,
    invalidateCache,
  };
}
