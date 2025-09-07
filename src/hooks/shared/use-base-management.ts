/**
 * Hook de management de base générique
 * Combine CRUD operations et validation pour éliminer la duplication
 */

import { useCRUDOperations, type CRUDConfig } from "./use-crud-operations";
import { validateObject, type ValidationRule, hasValidationErrors } from "./use-validation";

export interface BaseManagementConfig<T, FormData> extends CRUDConfig<T, FormData> {
  validationRules: Record<keyof FormData, ValidationRule<T>[]>;
}

export interface BaseManagementReturn<T, FormData> {
  // État et données
  items: T[];
  loading: boolean;
  error: string | null;
  
  // Opérations CRUD
  create: (data: FormData) => Promise<T>;
  update: (id: string, data: FormData) => Promise<T>;
  delete: (id: string) => Promise<void>;
  getById: (id: string) => T | undefined;
  refresh: () => void;
  
  // Validation
  validateForm: (data: FormData, excludeId?: string) => Record<keyof FormData, string | null>;
  hasValidationErrors: (errors: Record<keyof FormData, string | null>) => boolean;
}

/**
 * Hook de management de base réutilisable
 */
export function useBaseManagement<T extends { id: string; createdAt: Date; updatedAt: Date }, FormData>(
  config: BaseManagementConfig<T, FormData>
): BaseManagementReturn<T, FormData> {
  
  const crud = useCRUDOperations({
    entityName: config.entityName,
    mockData: config.mockData,
    generateId: config.generateId,
    createEntity: config.createEntity,
    updateEntity: config.updateEntity,
    validateCreate: (data: FormData, existingItems: T[]) => {
      const errors = validateObject(data, config.validationRules, existingItems);
      if (hasValidationErrors(errors)) {
        const firstError = Object.values(errors).find(error => error !== null);
        return firstError || "Erreur de validation";
      }
      return null;
    },
    validateUpdate: (id: string, data: FormData, existingItems: T[]) => {
      const errors = validateObject(data, config.validationRules, existingItems, id);
      if (hasValidationErrors(errors)) {
        const firstError = Object.values(errors).find(error => error !== null);
        return firstError || "Erreur de validation";
      }
      return null;
    },
  });

  const validateForm = (data: FormData, excludeId?: string) => {
    return validateObject(data, config.validationRules, crud.items, excludeId);
  };

  return {
    ...crud,
    validateForm,
    hasValidationErrors,
  };
}

/**
 * Utilitaire pour générer un ID unique
 */
export function generateUniqueId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}