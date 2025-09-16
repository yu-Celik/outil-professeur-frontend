"use client";

import { Suspense } from "react";

import { SessionsList } from "@/components/organisms/sessions-list";
import { SessionsTimeline } from "@/components/organisms/sessions-timeline";
import { useSessionManagement } from "@/features/sessions";
import { useSetPageTitle } from "@/shared/hooks";
import { useClassColors } from "@/features/calendar";
import { useUserSession } from "@/features/settings";
import { useClassSelection } from "@/contexts/class-selection-context";
import { Calendar } from "lucide-react";

function SessionsPageContent() {
  useSetPageTitle("Gestion des participations");

  const { user } = useUserSession();
  const teacherId = user?.id || "KsmNtVf4zwqO3VV3SQJqPrRlQBA1fFyR";
  const { getClassColorWithText } = useClassColors(teacherId);
  const { selectedClassId, assignmentsLoading } = useClassSelection();

  const {
    // States
    selectedDate,
    selectedSessionId,
    openAccordions,

    // Data
    allSessions,
    selectedSession,
    studentsForSession,

    // Actions
    setSelectedDate,
    setSelectedSessionId,
    toggleAccordion,
  } = useSessionManagement();

  if (assignmentsLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-muted-foreground">Chargement...</div>
      </div>
    );
  }

  // Si aucune classe n'est sélectionnée
  if (!selectedClassId) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-muted/50 to-muted/30 flex items-center justify-center mb-6">
          <Calendar className="h-8 w-8" />
        </div>
        <div className="text-xl font-semibold mb-3 text-foreground">
          Sélectionnez une classe
        </div>
        <div className="text-sm text-center max-w-sm leading-relaxed">
          Choisissez une classe dans la sidebar pour gérer les participations
        </div>
      </div>
    );
  }

  return (
    <div className="flex gap-6 min-h-0 flex-1 p-6">
      {/* Timeline des séances */}
      <div className="w-1/2 min-w-0 flex flex-col">
        <SessionsTimeline
          sessions={allSessions}
          selectedClassId={selectedClassId}
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
      <div className="w-1/2 min-w-0 flex flex-col">
        <SessionsList
          selectedSessionId={selectedSessionId}
          selectedSession={selectedSession || null}
          studentsForSession={studentsForSession}
          openAccordions={openAccordions}
          onToggleAccordion={toggleAccordion}
        />
      </div>
    </div>
  );
}

export default function SessionsPage() {
  return (
    <Suspense
      fallback={
        <div className="flex gap-6 min-h-0 flex-1 p-6">
          <div className="w-1/2 space-y-4">
            <div className="h-12 bg-muted animate-pulse rounded"></div>
            <div className="space-y-3">
              <div className="h-20 bg-muted animate-pulse rounded"></div>
              <div className="h-20 bg-muted animate-pulse rounded"></div>
              <div className="h-20 bg-muted animate-pulse rounded"></div>
            </div>
          </div>
          <div className="w-1/2 space-y-4">
            <div className="h-32 bg-muted animate-pulse rounded"></div>
            <div className="h-24 bg-muted animate-pulse rounded"></div>
          </div>
        </div>
      }
    >
      <SessionsPageContent />
    </Suspense>
  );
}
