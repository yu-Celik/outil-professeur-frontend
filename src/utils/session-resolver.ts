/**
 * Utilitaires pour résoudre les sessions dynamiques
 * Permet de récupérer une session générée depuis les templates hebdomadaires
 */

import { MOCK_SESSION_EXCEPTIONS } from "@/data/mock-session-exceptions";
import { MOCK_WEEKLY_TEMPLATES } from "@/data/mock-weekly-templates";
import { WeekSessionGenerator } from "@/services/session-generator";
import type { CourseSession } from "@/types/uml-entities";
import { getWeekStart, isDateInWeek } from "@/utils/date-utils";

/**
 * Résout une session par son ID dynamique
 * Format attendu: "session-{templateId}-{year}-{month}-{day}"
 */
export function resolveSessionById(sessionId: string): CourseSession | null {
  // Extraire le templateId et la date de l'ID
  const match = sessionId.match(/^session-(.+)-(\d{4})-(\d{1,2})-(\d{1,2})$/);
  if (!match) {
    console.warn(`Invalid session ID format: ${sessionId}`);
    return null;
  }

  const [, templateId, yearStr, monthStr, dayStr] = match;
  const year = parseInt(yearStr, 10);
  const month = parseInt(monthStr, 10) - 1; // JavaScript months are 0-indexed
  const day = parseInt(dayStr, 10);

  // Créer la date de la session
  const sessionDate = new Date(year, month, day);

  // Trouver le template correspondant
  const template = MOCK_WEEKLY_TEMPLATES.find((t) => t.id === templateId);
  if (!template) {
    console.warn(`Template not found: ${templateId}`);
    return null;
  }

  // Générer les sessions de la semaine correspondante
  const weekStart = getWeekStart(sessionDate);
  const weekExceptions = MOCK_SESSION_EXCEPTIONS.filter((exc) =>
    isDateInWeek(exc.exceptionDate, weekStart),
  );

  // Générer toutes les sessions de la semaine
  const weekSessions = WeekSessionGenerator.generateWeekSessions(
    weekStart,
    [template], // Seulement le template qui nous intéresse
    weekExceptions,
  );

  // Trouver la session exacte
  const targetSession = weekSessions.find(
    (session) => session.id === sessionId,
  );

  if (!targetSession) {
    console.warn(`Session not found after generation: ${sessionId}`);
    return null;
  }

  return targetSession;
}

/**
 * Résout toutes les sessions d'une semaine pour un enseignant
 */
export function resolveWeekSessions(
  weekStart: Date,
  teacherId: string,
): CourseSession[] {
  const teacherTemplates = MOCK_WEEKLY_TEMPLATES.filter(
    (t) => t.teacherId === teacherId,
  );
  const weekExceptions = MOCK_SESSION_EXCEPTIONS.filter((exc) =>
    isDateInWeek(exc.exceptionDate, weekStart),
  );

  return WeekSessionGenerator.generateWeekSessions(
    weekStart,
    teacherTemplates,
    weekExceptions,
  );
}

/**
 * Vérifie si un ID de session a le format dynamique
 */
export function isDynamicSessionId(sessionId: string): boolean {
  return /^session-.+-\d{4}-\d{1,2}-\d{1,2}$/.test(sessionId);
}
