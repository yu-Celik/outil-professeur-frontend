/**
 * Données d'exemple pour les exceptions de sessions
 * Représente les annulations, déplacements et ajouts ponctuels par rapport aux templates hebdomadaires
 */

import type { SessionException } from "@/services/session-generator";

export const MOCK_SESSION_EXCEPTIONS: SessionException[] = [
  {
    id: "exc-001",
    templateId: "template-math-6a-lundi-8h00",
    exceptionDate: new Date("2024-12-09"), // Lundi 9 décembre - session annulée
    type: "cancelled",
    reason: "Réunion pédagogique",
  },
  {
    id: "exc-002",
    templateId: "template-francais-5b-mardi-10h00",
    exceptionDate: new Date("2024-12-10"), // Mardi 10 décembre - session déplacée
    type: "moved",
    newTimeSlotId: "slot-14h00-14h55",
    reason: "Sortie scolaire le matin",
  },
  {
    id: "exc-003",
    templateId: "template-histoire-4c-jeudi-14h00",
    exceptionDate: new Date("2024-12-12"), // Jeudi 12 décembre - changement de salle
    type: "moved",
    newRoom: "Salle B205",
    reason: "Travaux dans la salle habituelle",
  },
  {
    id: "exc-004",
    templateId: "template-math-3a-vendredi-9h00",
    exceptionDate: new Date("2024-12-13"), // Vendredi 13 décembre - session annulée
    type: "cancelled",
    reason: "Absence enseignant",
  },
  {
    id: "exc-005",
    templateId: "template-anglais-6b-lundi-15h00",
    exceptionDate: new Date("2024-12-16"), // Lundi 16 décembre - session déplacée
    type: "moved",
    newTimeSlotId: "slot-16h00-16h55",
    newRoom: "Salle d'anglais 2",
    reason: "Intervention extérieure",
  },
  {
    id: "exc-006",
    templateId: "template-physique-2nde-mardi-11h00",
    exceptionDate: new Date("2024-12-17"), // Mardi 17 décembre - session supplémentaire
    type: "added",
    reason: "Rattrapage avant les vacances",
  },
];