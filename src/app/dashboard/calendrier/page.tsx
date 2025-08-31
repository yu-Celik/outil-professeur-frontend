"use client";

import { useEffect, useState } from "react";
import { LoadingSpinner } from "@/components/atoms/loading-spinner";
import { CalendarHeader } from "@/components/organisms/calendar-header";
import { CalendarToolbar } from "@/components/organisms/calendar-toolbar";
import { CalendarWeekView } from "@/components/organisms/calendar-week-view";
import { SessionForm } from "@/components/molecules/session-form";
import { ClassColorPicker } from "@/components/molecules/class-color-picker";
import { useCalendar } from "@/hooks/use-calendar";
import { useUserSession } from "@/hooks/use-user-session";
import { useClassColors } from "@/hooks/use-class-colors";

export default function CalendrierPage() {
  // Vue hebdomadaire uniquement
  const [showFilters, setShowFilters] = useState(false);
  const [showSessionForm, setShowSessionForm] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [sessionFormDate, setSessionFormDate] = useState<Date | null>(null);
  const [_selectedFilters, _setSelectedFilters] = useState({
    subjects: [] as string[],
    classes: [] as string[],
    status: [] as string[],
  });

  const { user, isLoading: userLoading } = useUserSession();
  const teacherId = user?.id || "KsmNtVf4zwqO3VV3SQJqPrRlQBA1fFyR";
  const { getPreferences } = useClassColors(teacherId, "year-2025");

  const {
    currentDate,
    calendarWeeks,
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
  
  const weekTitle = startOfWeek && endOfWeek 
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
          setSessionFormDate(new Date());
          setShowSessionForm(true);
        }}
        onManageColors={() => setShowColorPicker(true)}
      />

      <CalendarWeekView
        weekDays={weekDays}
        timeSlots={timeSlots}
        getCurrentWeek={getCurrentWeek}
        getStatusColor={getStatusColor}
        onViewDetails={handleViewDetails}
        onManageAttendance={handleManageAttendance}
      />

      {/* Modal de création de session */}
      {showSessionForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="max-h-[90vh] overflow-y-auto">
            <SessionForm
              onClose={() => {
                setShowSessionForm(false);
                setSessionFormDate(null);
              }}
              onSave={(session) => {
                addSession(session);
                setShowSessionForm(false);
                setSessionFormDate(null);
              }}
              initialDate={sessionFormDate || undefined}
              subjects={subjects}
              classes={classes}
              timeSlots={timeSlots}
              teacherId={teacherId}
              schoolYearId="year-2025"
            />
          </div>
        </div>
      )}

      {/* Modal de gestion des couleurs */}
      <ClassColorPicker
        isOpen={showColorPicker}
        onClose={() => setShowColorPicker(false)}
        teacherId={teacherId}
      />
    </div>
  );
}
