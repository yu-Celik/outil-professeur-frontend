/**
 * Client-side observation types
 * These provide a richer structure than the API's string[] format
 */

export interface StudentObservation {
  /** Client-generated UUID for this observation */
  id: string;
  /** Observation content/text */
  content: string;
  /** When this observation was created */
  createdAt: Date;
  /** When this observation was last updated */
  updatedAt: Date;
  /** Author of the observation (teacher name or ID) */
  author: string;
}

/**
 * Form data for creating/editing an observation
 */
export interface ObservationFormData {
  content: string;
  date?: Date; // Defaults to today if not provided
}

/**
 * Utility to convert API observations (string[]) to rich client observations
 * Note: Since API stores observations as plain strings, we generate metadata client-side
 */
export function parseObservationsFromAPI(
  observations: string[] | null | undefined,
  author = "Enseignant",
): StudentObservation[] {
  if (!observations || observations.length === 0) {
    return [];
  }

  // For now, we treat each string as a standalone observation
  // In the future, we might encode metadata in the string (e.g., JSON or delimited format)
  return observations.map((content, index) => ({
    id: `obs-${Date.now()}-${index}`, // Temporary ID until we have structured storage
    content,
    createdAt: new Date(), // We don't have this info from API yet
    updatedAt: new Date(),
    author,
  }));
}

/**
 * Utility to convert rich client observations back to API format
 */
export function serializeObservationsForAPI(
  observations: StudentObservation[],
): string[] {
  return observations.map((obs) => obs.content);
}
