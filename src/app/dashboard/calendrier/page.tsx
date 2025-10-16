"use client";

import { useState } from "react";
import { Toaster } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/atoms/dialog";
import { LoadingSpinner } from "@/components/atoms/loading-spinner";
import { SessionForm } from "@/components/molecules/session-form";
import { CalendarVisual } from "@/components/organisms/calendar-visual";
import { useCalendar, type CalendarEvent } from "@/features/calendar";
import { useUserSession } from "@/features/settings";
import { useModal, useSetPageTitle } from "@/shared/hooks";

export default function CalendrierPage() {
  useSetPageTitle("Calendrier");

  const { user, isLoading: userLoading } = useUserSession();
  const teacherId = user?.id || "KsmNtVf4zwqO3VV3SQJqPrRlQBA1fFyR";

  const { subjects, classes, timeSlots, addSession } = useCalendar(teacherId);

  const [sessionToCreate, setSessionToCreate] = useState<Date | null>(null);
  const [sessionToEdit, setSessionToEdit] = useState<CalendarEvent | null>(null);
  const sessionFormModal = useModal<{ date: Date; event?: CalendarEvent }>();

  const handleCreateSession = (date: Date) => {
    sessionFormModal.open({ date });
  };

  const handleEditSession = (event: CalendarEvent) => {
    sessionFormModal.open({ date: event.start, event });
  };

  if (userLoading) {
    return (
      <LoadingSpinner
        text="Chargement du calendrier"
        subText="Authentification..."
      />
    );
  }

  return (
    <div className="space-y-6">
      <CalendarVisual
        teacherId={teacherId}
        onCreateSession={handleCreateSession}
        onEditSession={handleEditSession}
      />

      {/* Modal de création/édition de session */}
      <Dialog {...sessionFormModal.modalProps}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {sessionFormModal.data?.event
                ? "Modifier la session"
                : "Nouvelle session"}
            </DialogTitle>
          </DialogHeader>
          {sessionFormModal.data && (
            <SessionForm
              onClose={sessionFormModal.close}
              onSave={(session) => {
                addSession(session);
                sessionFormModal.close();
              }}
              initialDate={sessionFormModal.data.date}
              subjects={subjects}
              classes={classes}
              timeSlots={timeSlots}
              teacherId={teacherId}
              schoolYearId="year-2025"
              standalone={false}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Toast notifications */}
      <Toaster richColors position="bottom-right" />
    </div>
  );
}
