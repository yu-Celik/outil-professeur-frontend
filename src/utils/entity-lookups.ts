/**
 * Utilitaires réutilisables pour les lookups d'entités UML
 * Élimine la duplication des patterns find() dans les hooks
 */

export interface EntityWithId {
  id: string;
}

/**
 * Trouve une entité par ID avec type safety
 */
export function findEntityById<T extends EntityWithId>(
  entities: T[],
  id: string,
): T | undefined {
  return entities.find((entity) => entity.id === id);
}

/**
 * Trouve plusieurs entités par leurs IDs
 */
export function findEntitiesByIds<T extends EntityWithId>(
  entities: T[],
  ids: string[],
): (T | undefined)[] {
  return ids.map((id) => findEntityById(entities, id));
}

/**
 * Crée une Map pour des lookups optimisés O(1)
 */
export function createEntityMap<T extends EntityWithId>(
  entities: T[],
): Map<string, T> {
  return new Map(entities.map((entity) => [entity.id, entity]));
}

/**
 * Filtre les entités par IDs avec validation
 */
export function filterEntitiesByIds<T extends EntityWithId>(
  entities: T[],
  ids: string[],
): T[] {
  const idSet = new Set(ids);
  return entities.filter((entity) => idSet.has(entity.id));
}

/**
 * Lookup sécurisé avec fallback
 */
export function safeEntityLookup<T extends EntityWithId>(
  entities: T[],
  id: string,
  fallback: T,
): T {
  return findEntityById(entities, id) ?? fallback;
}

/**
 * Extrait les IDs d'une liste d'entités
 */
export function extractEntityIds<T extends EntityWithId>(
  entities: T[],
): string[] {
  return entities.map((entity) => entity.id);
}

/**
 * Vérifie si un ID existe dans une collection
 */
export function entityExists<T extends EntityWithId>(
  entities: T[],
  id: string,
): boolean {
  return entities.some((entity) => entity.id === id);
}
