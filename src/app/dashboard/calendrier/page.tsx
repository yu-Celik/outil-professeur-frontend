"use client";

import { useEffect, useState } from "react";
import { LoadingSpinner } from "@/components/atoms/loading-spinner";
import { CalendarHeader } from "@/components/organisms/calendar-header";
import { CalendarToolbar } from "@/components/organisms/calendar-toolbar";
import { CalendarWeekView } from "@/components/organisms/calendar-week-view";
import { SessionForm } from "@/components/molecules/session-form";
import { ClassColorPicker } from "@/components/molecules/class-color-picker";
import { SessionCancelDialog } from "@/components/molecules/session-cancel-dialog";
import { SessionMoveDialog } from "@/components/molecules/session-move-dialog";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/molecules/dialog";
import { Toaster } from "sonner";
import { useCalendar } from "@/hooks/use-calendar";
import { useUserSession } from "@/hooks/use-user-session";
import { useClassColors } from "@/hooks/use-class-colors";
import { useModal, useSimpleModal } from "@/hooks/use-modal";
import { useSessionMoves } from "@/hooks/use-session-moves";
import type { CourseSession, TimeSlot } from "@/types/uml-entities";

export default function CalendrierPage() {
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
    calendarWeeks,
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
      const preferences = getPreferences();
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
      case "canceled":
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
    // Navigation vers la gestion des présences
    window.location.href = `/dashboard/sessions/${sessionId}?tab=attendance`;
  };

  const handleCreateMakeupSession = (date: Date, timeSlotId: string) => {
    sessionFormModal.open({ date, timeSlotId, type: "makeup" });
  };

  const handleCancelSession = (session: CourseSession) => {
    cancelModal.open(session);
  };

  const handleConfirmCancel = (sessionId: string) => {
    cancelSession(sessionId);
    cancelModal.close();
  };

  const handleOpenMoveDialog = (session: CourseSession) => {
    moveModal.open(session);
  };

  const handleMoveSessionConfirm = (
    sessionId: string,
    newDate: Date,
    newTimeSlot: TimeSlot,
  ) => {
    if (!moveModal.data) return;

    // Utiliser le hook de déplacement pour la logique métier et les notifications
    handleMoveSession(
      sessionId,
      newDate,
      newTimeSlot,
      moveModal.data,
      moveSession, // Fonction du hook useCalendar pour mettre à jour les données
    );

    moveModal.close();
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
      <CalendarHeader />

      <CalendarToolbar
        monthYear={weekTitle}
        showFilters={showFilters}
        onNavigateMonth={navigateWeek}
        onNavigateToToday={navigateToToday}
        onNavigateToJanuary2025={navigateToJanuary2025}
        onNavigateToAugust2025={navigateToAugust2025}
        onToggleFilters={() => setShowFilters(!showFilters)}
        onCreateSession={() => {
          sessionFormModal.open({
            date: new Date(),
            timeSlotId: "",
            type: "normal",
          });
        }}
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
        onCreateMakeupSession={handleCreateMakeupSession}
      />

      {/* Modal de création de session */}
      <Dialog {...sessionFormModal.modalProps}>
        <DialogContent size="xl" className="max-h-[90vh] overflow-y-auto">
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
              onSave={(session) => {
                addSession(session);
                sessionFormModal.close();
              }}
              initialDate={sessionFormModal.data.date || undefined}
              initialTimeSlotId={sessionFormModal.data.timeSlotId}
              subjects={subjects}
              classes={classes}
              timeSlots={timeSlots}
              teacherId={teacherId}
              schoolYearId="year-2025"
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
    </div>
  );
}
