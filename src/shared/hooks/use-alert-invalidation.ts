"use client";

import { useEffect, useCallback } from "react";
import { StudentAlertsService } from "@/features/students/services";

/**
 * Type d'événement qui invalide le cache des alertes.
 * Ces événements déclenchent un recalcul des alertes pour les élèves concernés.
 */
export type AlertInvalidationEvent =
  | "attendance_updated"
  | "participation_updated"
  | "grade_saved"
  | "exam_created"
  | "behavior_updated";

/**
 * Payload d'un événement d'invalidation d'alerte
 */
export interface AlertInvalidationPayload {
  event: AlertInvalidationEvent;
  studentId?: string;
  classId?: string;
  timestamp: number;
}

type AlertInvalidationListener = (payload: AlertInvalidationPayload) => void;

/**
 * Event bus simple pour gérer les invalidations d'alertes.
 * Pattern singleton pour garantir une instance unique à travers l'application.
 */
class AlertInvalidationBus {
  private listeners: Set<AlertInvalidationListener> = new Set();
  private static instance: AlertInvalidationBus;

  private constructor() {
    // Singleton
  }

  static getInstance(): AlertInvalidationBus {
    if (!AlertInvalidationBus.instance) {
      AlertInvalidationBus.instance = new AlertInvalidationBus();
    }
    return AlertInvalidationBus.instance;
  }

  /**
   * Émet un événement d'invalidation
   */
  emit(payload: AlertInvalidationPayload): void {
    const isDevelopment = process.env.NODE_ENV !== "production";

    if (isDevelopment) {
      console.info("[AlertInvalidationBus] Event emitted:", payload);
    }

    // Invalider le cache selon le scope
    if (payload.studentId) {
      StudentAlertsService.invalidateCacheForStudent(payload.studentId);
    } else if (payload.classId) {
      StudentAlertsService.invalidateCacheForClass(payload.classId);
    } else {
      StudentAlertsService.invalidateCache();
    }

    // Notifier tous les listeners
    this.listeners.forEach((listener) => {
      try {
        listener(payload);
      } catch (error) {
        console.error("[AlertInvalidationBus] Listener error:", error);
      }
    });
  }

  /**
   * S'abonne aux événements d'invalidation
   */
  subscribe(listener: AlertInvalidationListener): () => void {
    this.listeners.add(listener);

    // Retourne une fonction de désabonnement
    return () => {
      this.listeners.delete(listener);
    };
  }

  /**
   * Obtient le nombre de listeners actifs (pour debug)
   */
  getListenerCount(): number {
    return this.listeners.size;
  }
}

/**
 * Instance globale du bus d'invalidation
 */
export const alertInvalidationBus = AlertInvalidationBus.getInstance();

/**
 * Hook pour écouter les événements d'invalidation d'alertes.
 * Automatiquement nettoie l'abonnement au démontage du composant.
 */
export function useAlertInvalidation(
  onInvalidation: (payload: AlertInvalidationPayload) => void,
): void {
  useEffect(() => {
    const unsubscribe = alertInvalidationBus.subscribe(onInvalidation);
    return unsubscribe;
  }, [onInvalidation]);
}

/**
 * Hook pour émettre des événements d'invalidation.
 * Fournit une fonction stable pour déclencher l'invalidation.
 */
export function useAlertInvalidationEmitter() {
  const emit = useCallback(
    (
      event: AlertInvalidationEvent,
      context?: { studentId?: string; classId?: string },
    ) => {
      alertInvalidationBus.emit({
        event,
        studentId: context?.studentId,
        classId: context?.classId,
        timestamp: Date.now(),
      });
    },
    [],
  );

  return { emit };
}
