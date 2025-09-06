"use client";

import * as React from "react";
import { Toaster } from "sonner";
import { SessionCardWithMove } from "@/components/organisms/session-card-with-move";
import type {
  CourseSession,
  TimeSlot,
  Class,
  Subject,
} from "@/types/uml-entities";

/**
 * Exemple d'utilisation du système de déplacement de séance
 *
 * Ce composant démontre comment intégrer tous les éléments :
 * - SessionCardWithMove avec menu contextuel
 * - Dialog de déplacement avec gestion des conflits
 * - Toast notifications avec undo
 * - Badges de statut
 */
export function SessionMoveExample() {
  const [sessions, setSessions] = React.useState<CourseSession[]>([
    // Exemple de données mockées
    {
      id: "session-1",
      createdBy: "teacher-1",
      sessionDate: new Date("2024-08-26"),
      timeSlotId: "slot-10h40-11h35",
      classId: "class-2nde-jaspe",
      subjectId: "subject-anglais",
      status: "planned",
      objectives: null,
      content: null,
      homeworkAssigned: null,
      room: "A1",
      isMakeup: null,
      isMoved: null,
      notes: null,
      createdAt: new Date(),
      updatedAt: new Date(),
      reschedule: () => {},
      takeAttendance: () => {},
      summary: () => "Example session",
    },
  ]);

  // Mock data - en production, ces données viendraient de vos hooks
  const mockTimeSlots: TimeSlot[] = [
    {
      id: "slot-8h30-9h25",
      createdBy: "teacher-1",
      name: "8h30-9h25",
      startTime: "08:30",
      endTime: "09:25",
      durationMinutes: 55,
      displayOrder: 1,
      isBreak: false,
      createdAt: new Date(),
      updatedAt: new Date(),
      overlaps: () => false,
      getDuration: () => 55,
    },
    {
      id: "slot-10h40-11h35",
      createdBy: "teacher-1",
      name: "10h40-11h35",
      startTime: "10:40",
      endTime: "11:35",
      durationMinutes: 55,
      displayOrder: 2,
      isBreak: false,
      createdAt: new Date(),
      updatedAt: new Date(),
      overlaps: () => false,
      getDuration: () => 55,
    },
    {
      id: "slot-13h40-14h35",
      createdBy: "teacher-1",
      name: "13h40-14h35",
      startTime: "13:40",
      endTime: "14:35",
      durationMinutes: 55,
      displayOrder: 3,
      isBreak: false,
      createdAt: new Date(),
      updatedAt: new Date(),
      overlaps: () => false,
      getDuration: () => 55,
    },
  ];

  const mockClass: Class = {
    id: "class-2nde-jaspe",
    createdBy: "teacher-1",
    classCode: "2nde Jaspe",
    gradeLabel: "2nde",
    schoolYearId: "year-2024-2025",
    createdAt: new Date(),
    updatedAt: new Date(),
    assignStudent: () => {},
    transferStudent: () => {},
    getStudents: () => [],
    getSessions: () => [],
    getExams: () => [],
  };

  const mockSubject: Subject = {
    id: "subject-anglais",
    createdBy: "teacher-1",
    name: "Anglais",
    code: "ANG",
    description: "Langue vivante 1",
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const handleUpdateSession = (
    sessionId: string,
    updates: Partial<CourseSession>,
  ) => {
    setSessions((prev) =>
      prev.map((session) =>
        session.id === sessionId
          ? { ...session, ...updates, updatedAt: new Date() }
          : session,
      ),
    );
  };

  const handleViewDetails = (sessionId: string) => {
    console.log("Voir détails de la séance:", sessionId);
  };

  const handleManageAttendance = (sessionId: string) => {
    console.log("Gérer la participation pour la séance:", sessionId);
  };

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">Exemple : Déplacement de séance</h1>

      <div className="prose text-sm text-muted-foreground max-w-none">
        <p>
          Cliquez sur le menu (⋯) de la carte ci-dessous et sélectionnez
          "Déplacer la séance" pour tester le système de déplacement.
        </p>
        <p>Le système inclut :</p>
        <ul>
          <li>Affichage du contexte figé (séance actuelle)</li>
          <li>Sélection date et horaire avec validation</li>
          <li>Détection et gestion des conflits</li>
          <li>Badge de statut sur la carte après déplacement</li>
          <li>Toast notification avec fonction "Annuler"</li>
        </ul>
      </div>

      <div className="w-full max-w-md">
        {sessions.map((session) => (
          <SessionCardWithMove
            key={session.id}
            session={session}
            sessionClass={mockClass}
            subject={mockSubject}
            timeSlots={mockTimeSlots}
            allSessions={sessions}
            onUpdate={handleUpdateSession}
            onViewDetails={handleViewDetails}
            onManageAttendance={handleManageAttendance}
          />
        ))}
      </div>

      {/* Toast container - requis pour afficher les notifications */}
      <Toaster richColors position="bottom-right" />
    </div>
  );
}
