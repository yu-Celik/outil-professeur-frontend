"use client";

import { useState } from "react";
import { Button } from "@/components/atoms/button";
import { SessionExceptionForm } from "./session-exception-form";
import { Settings } from "lucide-react";
import type { CourseSession } from "@/types/uml-entities";
import type { SessionException } from "@/services/session-generator";

/**
 * Composant de debug pour tester les ajustements ponctuels
 * À supprimer une fois que l'intégration fonctionne
 */
export function DebugSessionMenu() {
  const [showForm, setShowForm] = useState(false);

  // Session d'exemple pour tester
  const mockSession: CourseSession = {
    id: "session-test-debug",
    createdBy: "KsmNtVf4zwqO3VV3SQJqPrRlQBA1fFyR",
    classId: "class-2nde-jaspe",
    subjectId: "subject-anglais",
    timeSlotId: "slot-10h40-11h35",
    sessionDate: new Date(),
    room: "Salle A1",
    status: "scheduled",
    objectives: "Test session",
    content: "",
    homeworkAssigned: "",
    notes: "",
    attendanceTaken: false,
    createdAt: new Date(),
    updatedAt: new Date(),
    reschedule: () => {},
    takeAttendance: () => {},
    summary: () => "Test session",
  };

  const handleSave = (exception: Omit<SessionException, "id">) => {
    console.log("Exception créée (debug):", exception);
    alert(
      `Exception créée!\nType: ${exception.type}\nMotif: ${exception.reason}`,
    );
    setShowForm(false);
  };

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        onClick={() => setShowForm(true)}
        className="gap-2 bg-chart-5/10 border-chart-5/20 text-chart-5 hover:bg-chart-5/20"
      >
        <Settings className="h-4 w-4" />🚧 Test Ajustements
      </Button>

      {showForm && (
        <SessionExceptionForm
          session={mockSession}
          onClose={() => setShowForm(false)}
          onSave={handleSave}
        />
      )}
    </>
  );
}
