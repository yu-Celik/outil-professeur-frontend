import type { CourseSession, TimeSlot } from "@/types/uml-entities";

export interface MakeupSessionOptions {
  originalSessionId?: string;
  classId: string;
  subjectId: string;
  timeSlotId: string;
  sessionDate: Date;
  reason?: string;
  objectives?: string;
  content?: string;
}

export interface SessionMoveOptions {
  sessionId: string;
  newDate: Date;
  newTimeSlotId: string;
  reason?: string;
}

export interface SessionCancelOptions {
  sessionId: string;
  reason?: string;
}

/**
 * Service pour la gestion des déplacements, rattrapages et annulations de séances
 * Conforme au diagramme UML avec les champs isMakeup et isMoved
 */
export class SessionManagementService {
  /**
   * Créer une séance de rattrapage
   */
  static createMakeupSession(
    options: MakeupSessionOptions,
    teacherId: string,
  ): CourseSession {
    const {
      originalSessionId,
      classId,
      subjectId,
      timeSlotId,
      sessionDate,
      reason,
      objectives,
      content,
    } = options;

    const makeupSession: CourseSession = {
      id: `makeup-session-${Date.now()}`,
      createdBy: teacherId,
      classId,
      subjectId,
      timeSlotId,
      sessionDate,
      status: "planned",
      objectives: objectives || null,
      content: content || null,
      homeworkAssigned: null,
      isMakeup: true, // ✅ Champ UML obligatoire
      isMoved: false,
      notes: originalSessionId
        ? `Rattrapage de la séance ${originalSessionId}${reason ? ` - ${reason}` : ""}`
        : `Séance de rattrapage${reason ? ` - ${reason}` : ""}`,
      createdAt: new Date(),
      updatedAt: new Date(),
      reschedule: function (newDate: Date) {
        this.sessionDate = newDate;
        this.isMoved = true;
        this.updatedAt = new Date();
        this.notes = `${this.notes || ""} (Redéplacé le ${newDate.toLocaleDateString()})`;
      },
      takeAttendance: function () {
        this.status = "in_progress";
        this.updatedAt = new Date();
      },
      summary: function () {
        return `Rattrapage ${this.classId} - ${this.subjectId} le ${this.sessionDate.toLocaleDateString()}`;
      },
    };

    return makeupSession;
  }

  /**
   * Déplacer une séance existante
   */
  static moveSession(
    session: CourseSession,
    options: SessionMoveOptions,
  ): CourseSession {
    const { newDate, newTimeSlotId, reason } = options;

    const originalInfo = `${session.sessionDate.toLocaleDateString()} (${session.timeSlotId})`;

    const movedSession: CourseSession = {
      ...session,
      sessionDate: newDate,
      timeSlotId: newTimeSlotId,
      isMoved: true, // ✅ Champ UML obligatoire
      notes: `Déplacé depuis ${originalInfo}${reason ? ` - ${reason}` : ""}`,
      updatedAt: new Date(),
    };

    return movedSession;
  }

  /**
   * Annuler une séance
   */
  static cancelSession(
    session: CourseSession,
    options: SessionCancelOptions,
  ): CourseSession {
    const { reason } = options;

    const cancelledSession: CourseSession = {
      ...session,
      status: "cancelled",
      notes: `Séance annulée${reason ? ` - ${reason}` : ""}`,
      updatedAt: new Date(),
    };

    return cancelledSession;
  }

  /**
   * Vérifier les conflits de planning
   */
  static checkScheduleConflict(
    sessions: CourseSession[],
    date: Date,
    timeSlotId: string,
    excludeSessionId?: string,
  ): CourseSession | null {
    return (
      sessions.find(
        (session) =>
          session.id !== excludeSessionId &&
          session.status !== "cancelled" &&
          session.sessionDate.toDateString() === date.toDateString() &&
          session.timeSlotId === timeSlotId,
      ) || null
    );
  }

  /**
   * Obtenir les statistiques des mouvements et rattrapages
   */
  static getSessionStats(sessions: CourseSession[]): {
    total: number;
    moved: number;
    makeup: number;
    cancelled: number;
    planned: number;
    completed: number;
  } {
    return {
      total: sessions.length,
      moved: sessions.filter((s) => s.isMoved).length,
      makeup: sessions.filter((s) => s.isMakeup).length,
      cancelled: sessions.filter((s) => s.status === "cancelled").length,
      planned: sessions.filter((s) => s.status === "planned").length,
      completed: sessions.filter((s) => s.status === "done").length,
    };
  }

  /**
   * Validation des données pour une séance de rattrapage
   */
  static validateMakeupSession(options: MakeupSessionOptions): {
    isValid: boolean;
    errors: string[];
  } {
    const errors: string[] = [];

    if (!options.classId) {
      errors.push("L'ID de la classe est requis");
    }

    if (!options.subjectId) {
      errors.push("L'ID de la matière est requis");
    }

    if (!options.timeSlotId) {
      errors.push("L'ID du créneau horaire est requis");
    }

    if (!options.sessionDate) {
      errors.push("La date de la séance est requise");
    } else if (options.sessionDate < new Date()) {
      errors.push("La date de rattrapage ne peut pas être dans le passé");
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * Générer un rapport des modifications de planning
   */
  static generatePlanningReport(sessions: CourseSession[]): {
    summary: string;
    details: Array<{
      sessionId: string;
      type: "moved" | "makeup" | "cancelled" | "normal";
      date: string;
      notes: string;
    }>;
  } {
    const stats = this.getSessionStats(sessions);

    const summary = `${stats.total} séances au total : ${stats.completed} terminées, ${stats.planned} planifiées, ${stats.moved} déplacées, ${stats.makeup} rattrapages, ${stats.cancelled} annulées`;

    const details = sessions.map((session) => ({
      sessionId: session.id,
      type:
        session.status === "cancelled"
          ? ("cancelled" as const)
          : session.isMakeup
            ? ("makeup" as const)
            : session.isMoved
              ? ("moved" as const)
              : ("normal" as const),
      date: session.sessionDate.toLocaleDateString(),
      notes: session.notes || "",
    }));

    return { summary, details };
  }
}
