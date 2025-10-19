/**
 * Utilitaires pour le calendrier visuel
 * Fonctions avancées pour la gestion des vues mois/semaine
 */

import type { CourseSession } from "@/types/uml-entities";

/**
 * Génère la structure de semaines pour la vue mois
 * Inclut les jours avant/après le mois pour compléter les semaines
 */
export function generateMonthWeeks(year: number, month: number) {
  const weeks: Date[][] = [];
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);

  // Trouver le lundi de la première semaine
  const startDate = new Date(firstDay);
  const day = startDate.getDay();
  const diff = startDate.getDate() - day + (day === 0 ? -6 : 1);
  startDate.setDate(diff);

  let currentDate = new Date(startDate);

  // Générer les semaines jusqu'à couvrir tout le mois
  while (currentDate <= lastDay || weeks.length === 0) {
    const week: Date[] = [];
    for (let i = 0; i < 7; i++) {
      week.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
    }
    weeks.push(week);

    // Arrêter si on a dépassé le mois après au moins une semaine complète
    if (currentDate > lastDay && weeks.length > 0) {
      break;
    }
  }

  return weeks;
}

/**
 * Génère la structure de jours pour la vue semaine
 */
export function generateWeekDays(date: Date): Date[] {
  const weekStart = getWeekStart(date);
  const days: Date[] = [];

  for (let i = 0; i < 7; i++) {
    const day = new Date(weekStart);
    day.setDate(day.getDate() + i);
    days.push(day);
  }

  return days;
}

/**
 * Trouve le lundi de la semaine
 */
export function getWeekStart(date: Date): Date {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  return new Date(d.setDate(diff));
}

/**
 * Vérifie si une date appartient au mois donné
 */
export function isDateInMonth(
  date: Date,
  month: number,
  year: number,
): boolean {
  return date.getMonth() === month && date.getFullYear() === year;
}

/**
 * Groupe les sessions par jour
 */
export function groupSessionsByDay(
  sessions: CourseSession[],
): Map<string, CourseSession[]> {
  const grouped = new Map<string, CourseSession[]>();

  for (const session of sessions) {
    const dateKey = new Date(session.sessionDate).toISOString().split("T")[0];
    const existing = grouped.get(dateKey) || [];
    grouped.set(dateKey, [...existing, session]);
  }

  return grouped;
}

/**
 * Filtre les sessions pour une plage de dates
 */
export function filterSessionsByDateRange(
  sessions: CourseSession[],
  startDate: Date,
  endDate: Date,
): CourseSession[] {
  return sessions.filter((session) => {
    const sessionDate = new Date(session.sessionDate);
    return sessionDate >= startDate && sessionDate <= endDate;
  });
}

/**
 * Obtient la couleur d'une session selon sa classe
 */
export function getSessionColor(classId: string, classes: any[]): string {
  const index = classes.findIndex((c) => c.id === classId);
  const colors = [
    "bg-blue-500",
    "bg-green-500",
    "bg-purple-500",
    "bg-orange-500",
    "bg-pink-500",
    "bg-teal-500",
    "bg-indigo-500",
    "bg-red-500",
  ];
  return colors[index % colors.length];
}

/**
 * Vérifie si une session est dans le passé
 */
export function isSessionPast(session: CourseSession): boolean {
  const now = new Date();
  const sessionDate = new Date(session.sessionDate);
  return sessionDate < now;
}

/**
 * Vérifie si une session est aujourd'hui
 */
export function isSessionToday(session: CourseSession): boolean {
  const now = new Date();
  const sessionDate = new Date(session.sessionDate);
  return (
    sessionDate.getDate() === now.getDate() &&
    sessionDate.getMonth() === now.getMonth() &&
    sessionDate.getFullYear() === now.getFullYear()
  );
}

/**
 * Calcule le nombre de sessions par jour dans un mois
 */
export function getSessionCountByDay(
  sessions: CourseSession[],
  year: number,
  month: number,
): Map<number, number> {
  const counts = new Map<number, number>();

  for (const session of sessions) {
    const date = new Date(session.sessionDate);
    if (date.getFullYear() === year && date.getMonth() === month) {
      const day = date.getDate();
      counts.set(day, (counts.get(day) || 0) + 1);
    }
  }

  return counts;
}
