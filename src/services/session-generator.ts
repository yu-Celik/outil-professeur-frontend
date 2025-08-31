/**
 * Service de génération de sessions hebdomadaires
 * Génère des CourseSession à partir des templates hebdomadaires récurrents
 * Respecte strictement les entités UML existantes
 */

import type { CourseSession } from "@/types/uml-entities";
import type { WeeklyTemplate } from "@/data/mock-weekly-templates";
import {
  calculateSessionDate,
  generateExceptionKey,
  getWeekStart,
  isDateInWeek,
} from "@/utils/date-utils";

export interface SessionException {
  id: string;
  templateId: string; // WeeklyTemplate.id concerné
  exceptionDate: Date; // Date spécifique de l'exception
  type: "cancelled" | "moved" | "added";
  newTimeSlotId?: string; // Pour les déplacements
  newRoom?: string; // Pour les changements de salle
  reason?: string; // Motif de l'exception
}

/**
 * Générateur de sessions pour une semaine donnée
 */
export class WeekSessionGenerator {
  /**
   * Génère toutes les sessions pour une semaine à partir des templates
   * @param weekStartDate Date du lundi de la semaine (Date)
   * @param templates Templates hebdomadaires actifs
   * @param exceptions Exceptions pour cette semaine
   * @returns Array de CourseSession générées
   */
  static generateWeekSessions(
    weekStartDate: Date,
    templates: WeeklyTemplate[],
    exceptions: SessionException[] = [],
  ): CourseSession[] {
    const sessions: CourseSession[] = [];
    const exceptionsMap = new Map<string, SessionException>();

    // Indexer les exceptions par templateId + date
    exceptions.forEach((exception) => {
      const key = generateExceptionKey(
        exception.templateId,
        exception.exceptionDate,
      );
      exceptionsMap.set(key, exception);
    });

    // Générer les sessions pour chaque template
    templates.forEach((template) => {
      const sessionDate = calculateSessionDate(
        weekStartDate,
        template.dayOfWeek,
      );
      const exceptionKey = generateExceptionKey(template.id, sessionDate);
      const exception = exceptionsMap.get(exceptionKey);

      // Si session annulée, on ne la génère pas
      if (exception?.type === "cancelled") {
        return;
      }

      // Générer la session avec les données du template ou de l'exception
      const session: CourseSession = {
        id: `session-${template.id}-${sessionDate.getFullYear()}-${sessionDate.getMonth() + 1}-${sessionDate.getDate()}`,
        createdBy: template.teacherId,
        classId: template.classId,
        subjectId: template.subjectId,
        timeSlotId:
          exception?.type === "moved" && exception.newTimeSlotId
            ? exception.newTimeSlotId
            : template.timeSlotId,
        sessionDate: sessionDate,
        room: exception?.newRoom || template.room,
        status: "planned", // Par défaut, session planifiée
        objectives: "", // À remplir lors de l'observation
        content: "", // À remplir lors de l'observation
        homeworkAssigned: "", // À remplir lors de l'observation
        notes: exception?.reason || "", // Motif d'exception si applicable
        attendanceTaken: false, // Pas encore pris
        createdAt: new Date(),
        updatedAt: new Date(),
        reschedule: (_newDate: Date) => {},
        takeAttendance: () => {},
        summary: () => `Session générée depuis template ${template.id}`,
      };

      sessions.push(session);
    });

    // Ajouter les sessions exceptionnelles (type "added")
    exceptions
      .filter((exception) => exception.type === "added")
      .forEach((exception) => {
        // Pour les ajouts, on aurait besoin des infos complètes dans l'exception
        // Ici on fait un exemple basique
        const addedSession: CourseSession = {
          id: `session-added-${exception.id}`,
          createdBy: "teacher-id", // À définir selon le contexte
          classId: "class-id", // À définir selon l'exception
          subjectId: "subject-id", // À définir selon l'exception
          timeSlotId: exception.newTimeSlotId || "",
          sessionDate: exception.exceptionDate,
          room: exception.newRoom || "",
          status: "planned",
          objectives: "",
          content: "",
          homeworkAssigned: "",
          notes: `Session ajoutée : ${exception.reason}`,
          attendanceTaken: false,
          createdAt: new Date(),
          updatedAt: new Date(),
          reschedule: (_newDate: Date) => {},
          takeAttendance: () => {},
          summary: () => `Session ajoutée exceptionnellement`,
        };

        sessions.push(addedSession);
      });

    return sessions;
  }

  /**
   * Génère les sessions pour toute une année scolaire
   * @param schoolYear Année scolaire (SchoolYear)
   * @param templates Templates hebdomadaires
   * @param exceptions Toutes les exceptions de l'année
   * @returns Toutes les sessions de l'année
   */
  static generateSchoolYearSessions(
    schoolYearStart: Date,
    schoolYearEnd: Date,
    templates: WeeklyTemplate[],
    exceptions: SessionException[] = [],
  ): CourseSession[] {
    const allSessions: CourseSession[] = [];
    let currentWeek = getWeekStart(schoolYearStart);

    // Générer semaine par semaine jusqu'à la fin de l'année scolaire
    while (currentWeek <= schoolYearEnd) {
      const weekExceptions = exceptions.filter((exception) =>
        isDateInWeek(exception.exceptionDate, currentWeek),
      );

      const weekSessions = this.generateWeekSessions(
        currentWeek,
        templates,
        weekExceptions,
      );

      allSessions.push(...weekSessions);

      // Passer à la semaine suivante
      currentWeek = new Date(currentWeek);
      currentWeek.setDate(currentWeek.getDate() + 7);
    }

    return allSessions;
  }
}

/**
 * Utilitaires pour les exceptions
 */
export class SessionExceptionUtils {
  /**
   * Crée une exception d'annulation
   */
  static createCancellation(
    templateId: string,
    date: Date,
    reason: string,
  ): SessionException {
    return {
      id: `exception-cancel-${Date.now()}`,
      templateId,
      exceptionDate: date,
      type: "cancelled",
      reason,
    };
  }

  /**
   * Crée une exception de déplacement
   */
  static createMove(
    templateId: string,
    date: Date,
    newTimeSlotId: string,
    newRoom?: string,
    reason?: string,
  ): SessionException {
    return {
      id: `exception-move-${Date.now()}`,
      templateId,
      exceptionDate: date,
      type: "moved",
      newTimeSlotId,
      newRoom,
      reason,
    };
  }

  /**
   * Crée une exception d'ajout
   */
  static createAddition(
    date: Date,
    timeSlotId: string,
    room: string,
    reason: string,
  ): SessionException {
    return {
      id: `exception-add-${Date.now()}`,
      templateId: "", // Pas de template pour un ajout
      exceptionDate: date,
      type: "added",
      newTimeSlotId: timeSlotId,
      newRoom: room,
      reason,
    };
  }
}
