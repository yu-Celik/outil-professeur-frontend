/**
 * Utilitaires de validation réutilisables
 * Élimine la duplication des règles de validation entre hooks
 */

export type ValidationRule<T> = (
  value: any,
  items: T[],
  excludeId?: string,
) => string | null;

/**
 * Créer une règle de validation pour champ obligatoire
 */
export function requiredRule<T>(
  fieldName: string,
  displayName: string,
): ValidationRule<T> {
  return (value: any) => {
    if (!value || (typeof value === "string" && value.trim() === "")) {
      return `${displayName} est obligatoire`;
    }
    return null;
  };
}

/**
 * Créer une règle de validation d'unicité pour un champ
 */
export function uniqueRule<T>(
  fieldName: keyof T,
  displayName: string,
  additionalFields?: Array<keyof T>,
): ValidationRule<T> {
  return (value: any, items: T[], excludeId?: string) => {
    const existingItem = items.find((item) => {
      // Ignorer l'item en cours de modification
      if (excludeId && (item as any).id === excludeId) return false;

      // Vérifier le champ principal
      if ((item as any)[fieldName] !== value) return false;

      // Vérifier les champs additionnels si fournis
      if (additionalFields) {
        return additionalFields.every((field) => {
          return (item as any)[field] === (value as any)[field];
        });
      }

      return true;
    });

    return existingItem ? `${displayName} déjà existant` : null;
  };
}

/**
 * Créer une règle de validation de format (regex)
 */
export function formatRule<T>(
  pattern: RegExp,
  displayName: string,
  errorMessage?: string,
): ValidationRule<T> {
  return (value: any) => {
    if (value && typeof value === "string" && !pattern.test(value)) {
      return errorMessage || `Format de ${displayName} invalide`;
    }
    return null;
  };
}

/**
 * Créer une règle de validation de longueur
 */
export function lengthRule<T>(
  minLength: number,
  maxLength: number,
  displayName: string,
): ValidationRule<T> {
  return (value: any) => {
    if (typeof value === "string") {
      if (value.length < minLength) {
        return `${displayName} doit contenir au moins ${minLength} caractères`;
      }
      if (value.length > maxLength) {
        return `${displayName} doit contenir au maximum ${maxLength} caractères`;
      }
    }
    return null;
  };
}

/**
 * Créer une règle de validation personnalisée
 */
export function customRule<T>(
  validator: (value: any, items: T[], excludeId?: string) => boolean,
  errorMessage: string,
): ValidationRule<T> {
  return (value: any, items: T[], excludeId?: string) => {
    return validator(value, items, excludeId) ? null : errorMessage;
  };
}

/**
 * Appliquer une liste de règles de validation
 */
export function validateWithRules<T>(
  value: any,
  rules: ValidationRule<T>[],
  items: T[],
  excludeId?: string,
): string | null {
  for (const rule of rules) {
    const error = rule(value, items, excludeId);
    if (error) return error;
  }
  return null;
}

/**
 * Validation d'objet complet avec règles par champ
 */
export function validateObject<T, FormData>(
  formData: FormData,
  fieldRules: Record<keyof FormData, ValidationRule<T>[]>,
  items: T[],
  excludeId?: string,
): Record<keyof FormData, string | null> {
  const errors = {} as Record<keyof FormData, string | null>;

  for (const [field, rules] of Object.entries(fieldRules) as Array<
    [keyof FormData, ValidationRule<T>[]]
  >) {
    errors[field] = validateWithRules(
      (formData as any)[field],
      rules,
      items,
      excludeId,
    );
  }

  return errors;
}

/**
 * Vérifier si un objet d'erreurs contient des erreurs
 */
export function hasValidationErrors<FormData>(
  errors: Record<keyof FormData, string | null>,
): boolean {
  return Object.values(errors).some((error) => error !== null);
}
