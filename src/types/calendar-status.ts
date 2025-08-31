/**
 * Types et constantes pour les statuts de sessions
 * Centralise les définitions pour éviter la duplication
 */

export type SessionStatus =
  | "planned"
  | "done"
  | "canceled"
  | "in_progress";

export const SESSION_STATUS_CONFIG = {
  planned: {
    label: "Planifiée",
    color: "bg-chart-1/10 text-chart-1 border-chart-1/20",
    badgeColor: "bg-chart-1/20 text-chart-1",
  },
  done: {
    label: "Terminée",
    color: "bg-chart-3/10 text-chart-3 border-chart-3/20",
    badgeColor: "bg-chart-3/20 text-chart-3",
  },
  canceled: {
    label: "Annulée",
    color: "bg-destructive/10 text-destructive border-destructive/20",
    badgeColor: "bg-destructive/20 text-destructive",
  },
  in_progress: {
    label: "En cours",
    color: "bg-chart-4/10 text-chart-4 border-chart-4/20",
    badgeColor: "bg-chart-4/20 text-chart-4",
  },
} as const;

/**
 * Récupère la couleur d'un statut de session
 */
export function getSessionStatusColor(status: string): string {
  return (
    SESSION_STATUS_CONFIG[status as SessionStatus]?.color ||
    "bg-muted/50 text-muted-foreground border-border"
  );
}

/**
 * Récupère le label d'un statut de session
 */
export function getSessionStatusLabel(status: string): string {
  return SESSION_STATUS_CONFIG[status as SessionStatus]?.label || "Inconnue";
}

/**
 * Récupère la couleur de badge d'un statut de session
 */
export function getSessionStatusBadgeColor(status: string): string {
  return (
    SESSION_STATUS_CONFIG[status as SessionStatus]?.badgeColor ||
    "bg-muted text-muted-foreground"
  );
}
