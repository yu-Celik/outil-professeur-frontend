"use client";

import { useCallback, useState } from "react";

export interface AsyncOperationState {
  isLoading: boolean;
  error: string | null;
}

export interface AsyncOperationResult<T> extends AsyncOperationState {
  execute: (operation: () => Promise<T>) => Promise<T>;
  reset: () => void;
}

/**
 * Hook réutilisable pour gérer les opérations asynchrones avec loading et error states
 * Élimine la duplication du pattern async/await dans les hooks
 */
export function useAsyncOperation<T = void>(): AsyncOperationResult<T> {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const isDevelopment = process.env.NODE_ENV !== "production";

  const execute = useCallback(
    async (operation: () => Promise<T>): Promise<T> => {
      setIsLoading(true);
      setError(null);

      try {
        const result = await operation();
        return result;
      } catch (err) {
        const errorMessage =
          err instanceof Error
            ? err.message
            : "Une erreur inattendue s'est produite";
        setError(errorMessage);
        if (isDevelopment) {
          console.error("Async operation error:", err);
        }
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [isDevelopment],
  );

  const reset = useCallback(() => {
    setIsLoading(false);
    setError(null);
  }, []);

  return {
    isLoading,
    error,
    execute,
    reset,
  };
}
