"use client";

import { useEffect, useState } from "react";
import { Toaster, toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/atoms/dialog";
import { LoadingSpinner } from "@/components/atoms/loading-spinner";
import { ClassColorPicker } from "@/components/molecules/class-color-picker";
import { SessionCancelDialog } from "@/components/molecules/session-cancel-dialog";
import { SessionForm } from "@/components/molecules/session-form";
import { SessionMoveDialog } from "@/components/molecules/session-move-dialog";
import { CalendarToolbar } from "@/components/organisms/calendar-toolbar";
import { CalendarWeekView } from "@/components/organisms/calendar-week-view";
import {
  useCalendar,
  useClassColors,
  useSessionMoves,
} from "@/features/calendar";
import { useUserSession } from "@/features/settings";
import { ApiError } from "@/lib/api";
import { useModal, useSetPageTitle, useSimpleModal } from "@/shared/hooks";
import type { CourseSession, TimeSlot } from "@/types/uml-entities";
import { TestApiButton } from "./test-api-button";

export default function CalendrierPage() {
  useSetPageTitle("Calendrier");

  // Vue hebdomadaire uniquement
  const [showFilters, setShowFilters] = useState(false);

  // ✨ Pattern standardisé pour les modales
  const cancelModal = useModal<CourseSession>();
  const moveModal = useModal<CourseSession>();
  const colorPickerModal = useSimpleModal();
  const sessionFormModal = useModal<{
    date: Date | null;
    timeSlotId: string;
    type: "normal" | "makeup";
  }>();
  const [_selectedFilters, _setSelectedFilters] = useState({
    subjects: [] as string[],
    classes: [] as string[],
    status: [] as string[],
  });

  const { user, isLoading: userLoading } = useUserSession();
  const teacherId = user?.id || "KsmNtVf4zwqO3VV3SQJqPrRlQBA1fFyR";
  const { getPreferences } = useClassColors(teacherId, "year-2025");
  const { moveSession: handleMoveSession } = useSessionMoves();

  const {
    currentDate,
    calendarEvents,
    loading,
    navigateWeek,
    navigateToToday,
    navigateToAugust2025,
    navigateToJanuary2025,
    getCurrentWeek,
    subjects,
    classes,
    timeSlots,
    addSession,
    cancelSession,
    moveSession,
  } = useCalendar(teacherId);

  // Synchroniser avec les préférences UML
  useEffect(() => {
    if (!userLoading) {
      getPreferences();
      // Vue hebdomadaire uniquement - plus de préférence de vue
    }
  }, [userLoading, getPreferences]);

  // Calcul de la semaine actuelle
  const currentWeek = getCurrentWeek();
  const startOfWeek = currentWeek[0]?.date;
  const endOfWeek = currentWeek[6]?.date;

  const weekTitle =
    startOfWeek && endOfWeek
      ? `${startOfWeek.getDate()} ${startOfWeek.toLocaleDateString("fr-FR", { month: "short" })} - ${endOfWeek.getDate()} ${endOfWeek.toLocaleDateString("fr-FR", { month: "short" })} ${endOfWeek.getFullYear()}`
      : currentDate.toLocaleDateString("fr-FR", {
          month: "long",
          year: "numeric",
        });

  const weekDays = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "done":
        return "bg-chart-3/10 text-chart-3 border-chart-3/20"; // Vert du thème
      case "in_progress":
        return "bg-chart-4/10 text-chart-4 border-chart-4/20"; // Orange/jaune du thème
      case "planned":
        return "bg-chart-1/10 text-chart-1 border-chart-1/20"; // Bleu/primaire du thème
      case "cancelled":
        return "bg-destructive/10 text-destructive border-destructive/20"; // Rouge pour annulé
      case "moved":
        return "bg-muted/50 text-muted-foreground/70 border-muted/30 opacity-60"; // Grisé pour déplacé
      default:
        return "bg-muted text-muted-foreground border-border";
    }
  };

  const handleViewDetails = (sessionId: string) => {
    // Navigation vers les détails de la session
    window.location.href = `/dashboard/sessions/${sessionId}`;
  };

  const handleManageAttendance = (sessionId: string) => {
    // Navigation vers la page sessions unifiée avec sessionId et viewMode=batch pour saisie rapide
    window.location.href = `/dashboard/sessions?sessionId=${sessionId}&viewMode=batch`;
  };

  const handleOpenSessionForm = ({
    date,
    timeSlotId,
    type,
  }: {
    date: Date;
    timeSlotId: string;
    type: "normal" | "makeup";
  }) => {
    sessionFormModal.open({ date, timeSlotId, type });
  };

  const handleCancelSession = (session: CourseSession) => {
    cancelModal.open(session);
  };

  const handleConfirmCancel = async (sessionId: string) => {
    try {
      await cancelSession(sessionId);
      toast.success("Session annulée avec succès");
      cancelModal.close();
    } catch (error) {
      const fallbackMessage =
        error instanceof Error
          ? error.message
          : "Impossible d'annuler la session. Veuillez réessayer.";
      toast.error(fallbackMessage);
    }
  };

  const handleOpenMoveDialog = (session: CourseSession) => {
    moveModal.open(session);
  };

  const handleMoveSessionConfirm = async (
    sessionId: string,
    newDate: Date,
    newTimeSlot: TimeSlot,
  ) => {
    if (!moveModal.data) return;

    try {
      // Update via API
      await moveSession(sessionId, {
        sessionDate: newDate,
        timeSlotId: newTimeSlot.id,
        isMoved: true,
        notes: `Déplacé depuis ${new Date(moveModal.data.sessionDate).toLocaleDateString("fr-FR")} - ${timeSlots.find((t) => t.id === moveModal.data?.timeSlotId)?.name || ""}`,
      });

      // Show success toast with undo functionality
      handleMoveSession(
        sessionId,
        newDate,
        newTimeSlot,
        moveModal.data,
        moveSession,
      );

      moveModal.close();
    } catch (error) {
      if (error instanceof ApiError && error.status === 409) {
        const subject = subjects.find(
          (s) => s.id === moveModal.data?.subjectId,
        );
        const classEntity = classes.find(
          (c) => c.id === moveModal.data?.classId,
        );
        const conflictMessage = `Créneau déjà occupé par session Classe ${classEntity?.classCode || "inconnue"} - Matière ${subject?.name || "inconnue"}`;
        toast.error(conflictMessage);
      } else {
        const fallbackMessage =
          error instanceof Error
            ? error.message
            : "Impossible de déplacer la session. Veuillez réessayer.";
        toast.error(fallbackMessage);
      }
    }
  };

  const handleSessionFormSubmit = async (
    sessionData: Partial<CourseSession>,
  ) => {
    try {
      const createdSession = await addSession(sessionData);
      toast.success("Session créée avec succès");
      sessionFormModal.close();
      return createdSession;
    } catch (error) {
      if (error instanceof ApiError && error.status === 409) {
        const subject = subjects.find((s) => s.id === sessionData.subjectId);
        const classEntity = classes.find((c) => c.id === sessionData.classId);
        const subjectLabel =
          subject?.name ?? sessionData.subjectId ?? "Matière inconnue";
        const classLabel =
          classEntity?.classCode ?? sessionData.classId ?? "Classe inconnue";
        const conflictMessage = `Créneau déjà occupé par session Classe ${classLabel} - Matière ${subjectLabel}`;
        toast.error(conflictMessage);
        throw new ApiError(conflictMessage, error.status, error.code);
      }

      const fallbackMessage =
        error instanceof Error
          ? error.message
          : "Impossible de créer la session. Veuillez réessayer.";
      toast.error(fallbackMessage);

      if (error instanceof Error) {
        throw error;
      }

      throw new Error(fallbackMessage);
    }
  };

  if (loading || userLoading) {
    return (
      <LoadingSpinner
        text="Chargement du calendrier"
        subText={
          userLoading
            ? "Authentification..."
            : "Récupération de vos sessions..."
        }
      />
    );
  }

  return (
    <div className="space-y-6">
      <CalendarToolbar
        monthYear={weekTitle}
        showFilters={showFilters}
        onNavigateMonth={navigateWeek}
        onNavigateToToday={navigateToToday}
        onNavigateToJanuary2025={navigateToJanuary2025}
        onNavigateToAugust2025={navigateToAugust2025}
        onToggleFilters={() => setShowFilters(!showFilters)}
        onCreateSession={() =>
          handleOpenSessionForm({
            date: new Date(),
            timeSlotId: "",
            type: "normal",
          })
        }
        onManageColors={colorPickerModal.open}
      />

      <CalendarWeekView
        weekDays={weekDays}
        timeSlots={timeSlots}
        getCurrentWeek={getCurrentWeek}
        getStatusColor={getStatusColor}
        onViewDetails={handleViewDetails}
        onManageAttendance={handleManageAttendance}
        onMove={handleOpenMoveDialog}
        onCancel={handleCancelSession}
        onCreateSession={({ date, timeSlotId, type }) =>
          handleOpenSessionForm({ date, timeSlotId, type })
        }
      />

      {/* Modal de création de session */}
      <Dialog {...sessionFormModal.modalProps}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {sessionFormModal.data?.type === "makeup"
                ? "Créer une session de rattrapage"
                : "Nouvelle session"}
            </DialogTitle>
          </DialogHeader>
          {sessionFormModal.data && (
            <SessionForm
              onClose={sessionFormModal.close}
              onSave={handleSessionFormSubmit}
              initialDate={sessionFormModal.data.date || undefined}
              initialTimeSlotId={sessionFormModal.data.timeSlotId}
              subjects={subjects}
              classes={classes}
              timeSlots={timeSlots}
              teacherId={teacherId}
              sessionType={sessionFormModal.data.type}
              standalone={false}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Modal de gestion des couleurs */}
      <ClassColorPicker
        {...colorPickerModal.modalProps}
        isOpen={colorPickerModal.isOpen}
        onClose={colorPickerModal.close}
        teacherId={teacherId}
      />

      {/* Modal d'annulation de session */}
      <SessionCancelDialog
        session={cancelModal.data}
        {...cancelModal.modalProps}
        onConfirm={handleConfirmCancel}
      />

      {/* Modal de déplacement de session */}
      {moveModal.data && (
        <SessionMoveDialog
          {...moveModal.modalProps}
          session={moveModal.data}
          sessionClass={
            classes.find((c) => c.id === moveModal.data?.classId) || classes[0]
          }
          subject={
            subjects.find((s) => s.id === moveModal.data?.subjectId) ||
            subjects[0]
          }
          timeSlots={timeSlots}
          onMove={handleMoveSessionConfirm}
          conflictingSessions={calendarEvents.map((e) => e.courseSession)}
        />
      )}

      {/* Toast notifications */}
      <Toaster richColors position="bottom-right" />

      {/* 🧪 Bouton de test API (À SUPPRIMER après les tests) */}
      <TestApiButton />
    </div>
  );
}
