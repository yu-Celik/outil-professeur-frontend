/**
 * Utilitaires de gestion des dates pour le calendrier
 * Centralisé pour éviter la duplication de code
 */

/**
 * Trouve le lundi d'une date donnée
 * @param date Date source
 * @returns Date du lundi de la semaine
 */
export function getWeekStart(date: Date): Date {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  return new Date(d.setDate(diff));
}

/**
 * Vérifie si une date appartient à une semaine donnée
 * @param date Date à vérifier
 * @param weekStart Lundi de la semaine de référence
 * @returns true si la date est dans la semaine
 */
export function isDateInWeek(date: Date, weekStart: Date): boolean {
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekEnd.getDate() + 6);
  return date >= weekStart && date <= weekEnd;
}

/**
 * Calcule la date de session à partir du lundi et du jour de la semaine
 * @param weekStartDate Date du lundi
 * @param dayOfWeek Jour de la semaine (1=lundi, 2=mardi, ..., 7=dimanche)
 * @returns Date de la session
 */
export function calculateSessionDate(
  weekStartDate: Date,
  dayOfWeek: number,
): Date {
  const sessionDate = new Date(weekStartDate);
  sessionDate.setDate(sessionDate.getDate() + (dayOfWeek - 1));
  return sessionDate;
}

/**
 * Génère une clé unique pour indexer les exceptions
 * @param templateId ID du template
 * @param date Date de l'exception
 * @returns Clé unique
 */
export function generateExceptionKey(templateId: string, date: Date): string {
  return `${templateId}-${date.toISOString().split("T")[0]}`;
}

/**
 * Combine une date avec une heure (format HH:mm)
 * @param date Date de base
 * @param time Heure au format "HH:mm"
 * @returns Date avec l'heure appliquée
 */
export function combineDateAndTime(date: Date, time: string): Date {
  const [hours, minutes] = time.split(":").map(Number);
  const result = new Date(date);
  result.setHours(hours, minutes, 0, 0);
  return result;
}

/**
 * Vérifie si deux dates sont le même jour
 * @param date1 Première date
 * @param date2 Deuxième date
 * @returns true si même jour
 */
export function isSameDay(date1: Date, date2: Date): boolean {
  return date1.toDateString() === date2.toDateString();
}

/**
 * Vérifie si une date est aujourd'hui
 * @param date Date à vérifier
 * @returns true si c'est aujourd'hui
 */
export function isToday(date: Date): boolean {
  return isSameDay(date, new Date());
}

/**
 * Formate une date en français
 * @param date Date à formater
 * @param options Options de formatage
 * @returns Date formatée
 */
export function formatDateFR(
  date: Date,
  options: Intl.DateTimeFormatOptions = {
    weekday: "long",
    day: "numeric",
    month: "long",
  },
): string {
  return date.toLocaleDateString("fr-FR", options);
}

/**
 * Formate une date au format ISO (YYYY-MM-DD) pour les API
 * @param date Date à formater
 * @returns Date au format YYYY-MM-DD
 */
export function formatDateToISO(date: Date): string {
  return date.toISOString().split("T")[0];
}

/**
 * Parse une date ISO et retourne un objet Date
 * @param isoDate Date au format ISO (YYYY-MM-DD ou ISO 8601 complet)
 * @returns Objet Date
 */
export function parseDateFromISO(isoDate: string): Date {
  return new Date(isoDate);
}
