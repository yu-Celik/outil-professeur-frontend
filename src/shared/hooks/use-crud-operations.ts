"use client";

/**
 * Hook générique pour les opérations CRUD
 * Élimine la duplication entre tous les hooks de management
 */

import { useState, useCallback } from "react";

export interface CRUDConfig<T, FormData> {
  entityName: string;
  mockData: T[];
  generateId: () => string;
  validateCreate: (data: FormData, existingItems: T[]) => string | null;
  validateUpdate: (id: string, data: FormData, existingItems: T[]) => string | null;
  createEntity: (data: FormData) => Partial<T>;
  updateEntity: (existing: T, data: FormData) => Partial<T>;
}

export interface CRUDOperations<T, FormData> {
  items: T[];
  loading: boolean;
  error: string | null;
  create: (data: FormData) => Promise<T>;
  update: (id: string, data: FormData) => Promise<T>;
  delete: (id: string) => Promise<void>;
  getById: (id: string) => T | undefined;
  refresh: () => void;
}

/**
 * Hook générique pour les opérations CRUD avec mock data
 */
export function useCRUDOperations<T extends { id: string; createdAt: Date; updatedAt: Date }, FormData>(
  config: CRUDConfig<T, FormData>
): CRUDOperations<T, FormData> {
  const [items, setItems] = useState<T[]>(config.mockData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const create = useCallback(async (data: FormData): Promise<T> => {
    setLoading(true);
    setError(null);

    try {
      // Simuler délai API
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Validation
      const validationError = config.validateCreate(data, items);
      if (validationError) {
        throw new Error(validationError);
      }

      // Créer l'entité
      const now = new Date();
      const newEntity = {
        id: config.generateId(),
        ...config.createEntity(data),
        createdAt: now,
        updatedAt: now,
      } as T;

      setItems((prev) => [...prev, newEntity]);
      return newEntity;

    } catch (err) {
      const errorMessage = err instanceof Error 
        ? err.message 
        : `Erreur lors de la création de ${config.entityName}`;
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [items, config]);

  const update = useCallback(async (id: string, data: FormData): Promise<T> => {
    setLoading(true);
    setError(null);

    try {
      // Simuler délai API
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Vérifier existence
      const existingItem = items.find((item) => item.id === id);
      if (!existingItem) {
        throw new Error(`${config.entityName} introuvable`);
      }

      // Validation
      const validationError = config.validateUpdate(id, data, items);
      if (validationError) {
        throw new Error(validationError);
      }

      // Mettre à jour
      const updatedEntity = {
        ...existingItem,
        ...config.updateEntity(existingItem, data),
        updatedAt: new Date(),
      } as T;

      setItems((prev) => prev.map((item) => (item.id === id ? updatedEntity : item)));
      return updatedEntity;

    } catch (err) {
      const errorMessage = err instanceof Error 
        ? err.message 
        : `Erreur lors de la mise à jour de ${config.entityName}`;
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [items, config]);

  const deleteItem = useCallback(async (id: string): Promise<void> => {
    setLoading(true);
    setError(null);

    try {
      // Simuler délai API
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Vérifier existence
      const exists = items.some((item) => item.id === id);
      if (!exists) {
        throw new Error(`${config.entityName} introuvable`);
      }

      setItems((prev) => prev.filter((item) => item.id !== id));

    } catch (err) {
      const errorMessage = err instanceof Error 
        ? err.message 
        : `Erreur lors de la suppression de ${config.entityName}`;
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [items, config]);

  const getById = useCallback((id: string) => {
    return items.find((item) => item.id === id);
  }, [items]);

  const refresh = useCallback(() => {
    setItems(config.mockData);
    setError(null);
  }, [config.mockData]);

  return {
    items,
    loading,
    error,
    create,
    update,
    delete: deleteItem,
    getById,
    refresh,
  };
}