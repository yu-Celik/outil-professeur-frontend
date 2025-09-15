"use client";

import { Suspense } from "react";

import { SessionsList } from "@/components/organisms/sessions-list";
import { ClassSelectionLayout } from "@/components/templates/class-selection-layout";
import { SessionsTimeline } from "@/components/organisms/sessions-timeline";
import { useSessionManagement } from "@/features/sessions";
import { useSetPageTitle } from "@/shared/hooks";
import { useClassColors } from "@/features/calendar";
import { useUserSession } from "@/features/settings";
import { Calendar } from "lucide-react";

function SessionsPageContent() {
  useSetPageTitle("Gestion des participations");

  const { user } = useUserSession();
  const teacherId = user?.id || "KsmNtVf4zwqO3VV3SQJqPrRlQBA1fFyR";
  const { getClassColorWithText } = useClassColors(teacherId);

  const {
    // States
    selectedClassId,
    selectedDate,
    selectedSessionId,
    openAccordions,

    // Data
    allSessions,
    uniqueClasses,
    selectedSession,
    studentsForSession,

    // Actions
    setSelectedClassId,
    setSelectedDate,
    setSelectedSessionId,
    toggleAccordion,
  } = useSessionManagement();

  return (
    <ClassSelectionLayout
      emptyStateIcon={<Calendar className="h-8 w-8" />}
      emptyStateTitle="Sélectionnez une classe"
      emptyStateDescription="Choisissez une classe dans la sidebar pour gérer les participations"
      customClasses={uniqueClasses}
      customSelectedClassId={selectedClassId === "all" ? null : selectedClassId}
      customOnClassSelect={(classId) => setSelectedClassId(classId || "all")}
      customGetClassColorWithText={getClassColorWithText}
    >
      {/* Zone principale avec timeline et détails */}
      <div className="flex gap-6 -m-6 min-h-0 flex-1">
        {/* Timeline des séances */}
        <div className="w-1/2 min-w-0 flex flex-col p-6">
          <SessionsTimeline
            sessions={allSessions}
            selectedClassId={selectedClassId === "all" ? null : selectedClassId}
            selectedSessionId={selectedSessionId === "all" ? null : selectedSessionId}
            onSessionSelect={setSelectedSessionId}
            currentDate={selectedDate}
            onNavigateDate={(direction) => {
              const currentDate = new Date(selectedDate);
              if (direction === "prev") {
                currentDate.setDate(currentDate.getDate() - 1);
              } else {
                currentDate.setDate(currentDate.getDate() + 1);
              }
              setSelectedDate(currentDate.toISOString().split("T")[0]);
            }}
          />
        </div>

        {/* Détail de la séance */}
        <div className="w-1/2 min-w-0 flex flex-col p-6">
          <SessionsList
            selectedSessionId={selectedSessionId}
            selectedSession={selectedSession || null}
            studentsForSession={studentsForSession}
            openAccordions={openAccordions}
            onToggleAccordion={toggleAccordion}
          />
        </div>
      </div>
    </ClassSelectionLayout>
  );
}

export default function SessionsPage() {
  return (
    <Suspense
      fallback={
        <ClassSelectionLayout
          emptyStateIcon={<Calendar className="h-8 w-8" />}
          emptyStateTitle="Chargement..."
          emptyStateDescription="Préparation de l'interface de gestion des participations"
        >
          <div className="flex gap-6 -m-6 min-h-0 flex-1">
            <div className="w-1/2 space-y-4 p-6">
              <div className="h-12 bg-muted animate-pulse rounded"></div>
              <div className="space-y-3">
                <div className="h-20 bg-muted animate-pulse rounded"></div>
                <div className="h-20 bg-muted animate-pulse rounded"></div>
                <div className="h-20 bg-muted animate-pulse rounded"></div>
              </div>
            </div>
            <div className="w-1/2 space-y-4 p-6">
              <div className="h-32 bg-muted animate-pulse rounded"></div>
              <div className="h-24 bg-muted animate-pulse rounded"></div>
            </div>
          </div>
        </ClassSelectionLayout>
      }
    >
      <SessionsPageContent />
    </Suspense>
  );
}
