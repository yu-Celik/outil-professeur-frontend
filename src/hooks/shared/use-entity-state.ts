"use client";

import { useCallback, useState } from "react";

export interface EntityStateResult<T> {
  entity: T | null;
  setEntity: (entity: T | null) => void;
  updateEntity: (updates: Partial<T>) => void;
  hasUnsavedChanges: boolean;
  resetChanges: () => void;
  markSaved: () => void;
}

/**
 * Hook réutilisable pour gérer l'état d'une entité UML avec tracking des changements
 * Élimine la duplication entre use-student-evaluation et use-uml-evaluation
 */
export function useEntityState<T>(
  initialEntity: T | null = null,
): EntityStateResult<T> {
  const [entity, setEntity] = useState<T | null>(initialEntity);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  const updateEntity = useCallback((updates: Partial<T>) => {
    setEntity((prev) => {
      if (!prev) return null;
      return { ...prev, ...updates };
    });
    setHasUnsavedChanges(true);
  }, []);

  const resetChanges = useCallback(() => {
    setHasUnsavedChanges(false);
  }, []);

  const markSaved = useCallback(() => {
    setHasUnsavedChanges(false);
  }, []);

  const setEntityWrapper = useCallback((newEntity: T | null) => {
    setEntity(newEntity);
    setHasUnsavedChanges(false);
  }, []);

  return {
    entity,
    setEntity: setEntityWrapper,
    updateEntity,
    hasUnsavedChanges,
    resetChanges,
    markSaved,
  };
}
