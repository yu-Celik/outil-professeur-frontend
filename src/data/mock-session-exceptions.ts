/**
 * Exceptions mockées pour illustrer les ajustements ponctuels
 * Exemples d'annulations, déplacements et ajouts de sessions
 */

import type { SessionException } from "@/services/session-generator";

export const MOCK_SESSION_EXCEPTIONS: SessionException[] = [
  // Annulation - Cours annulé pour sortie scolaire
  {
    id: "exception-cancel-2025-01-13",
    templateId: "template-lundi-11h40-jaspe", // Template du lundi 11h40 avec 2nde Jaspe
    exceptionDate: new Date("2025-01-13"), // Lundi 13 janvier 2025
    type: "cancelled",
    reason: "Sortie scolaire - Visite du musée d'Orsay",
  },

  // Déplacement - Cours déplacé pour réunion parents-profs
  {
    id: "exception-move-2025-01-17",
    templateId: "template-vendredi-08h30-thulite", // Vendredi 8h30 avec 2nde Thulite
    exceptionDate: new Date("2025-01-17"), // Vendredi 17 janvier 2025
    type: "moved",
    newTimeSlotId: "slot-10h40-11h35", // Déplacé à 10h40
    newRoom: "Salle B2",
    reason: "Réunion parents-professeurs à 8h30",
  },

  // Ajout - Cours de rattrapage exceptionnel
  {
    id: "exception-add-2025-01-22",
    templateId: "", // Pas de template pour un ajout
    exceptionDate: new Date("2025-01-22"), // Mercredi 22 janvier 2025
    type: "added",
    newTimeSlotId: "slot-13h40-14h35",
    newRoom: "Salle A3",
    reason: "Rattrapage suite à l'annulation du 13 janvier",
  },

  // Autre annulation - Professeur malade
  {
    id: "exception-cancel-2025-02-03",
    templateId: "template-lundi-14h40-tanzanite", // Lundi 14h40 avec Term Tanzanite
    exceptionDate: new Date("2025-02-03"), // Lundi 3 février 2025
    type: "cancelled",
    reason: "Professeur en arrêt maladie",
  },

  // Déplacement de salle
  {
    id: "exception-move-room-2025-01-28",
    templateId: "template-mardi-10h40-jaspe", // Mardi 10h40 avec 2nde Jaspe
    exceptionDate: new Date("2025-01-28"), // Mardi 28 janvier 2025
    type: "moved",
    newTimeSlotId: "slot-10h40-11h35", // Même créneau
    newRoom: "Laboratoire multimédia", // Changement de salle uniquement
    reason: "Séance avec support multimédia - laboratoire réservé",
  },
];

/**
 * Récupère les exceptions pour une semaine donnée
 * @param weekStart Lundi de la semaine
 * @returns Exceptions de la semaine
 */
export function getExceptionsForWeek(weekStart: Date): SessionException[] {
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekEnd.getDate() + 6);

  return MOCK_SESSION_EXCEPTIONS.filter(
    (exception) =>
      exception.exceptionDate >= weekStart &&
      exception.exceptionDate <= weekEnd,
  );
}

/**
 * Récupère les exceptions pour un template donné
 * @param templateId ID du template
 * @returns Exceptions pour ce template
 */
export function getExceptionsForTemplate(
  templateId: string,
): SessionException[] {
  return MOCK_SESSION_EXCEPTIONS.filter(
    (exception) => exception.templateId === templateId,
  );
}

/**
 * Récupère les exceptions par type
 * @param type Type d'exception
 * @returns Exceptions de ce type
 */
export function getExceptionsByType(
  type: SessionException["type"],
): SessionException[] {
  return MOCK_SESSION_EXCEPTIONS.filter((exception) => exception.type === type);
}
