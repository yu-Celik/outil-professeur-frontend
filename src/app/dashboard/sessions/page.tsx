"use client";

import { Suspense } from "react";

import { SessionFilters } from "@/components/molecules/session-filters";
import { SessionsList } from "@/components/organisms/sessions-list";
import { useSessionManagement } from "@/hooks/use-session-management";
import { useSetPageTitle } from "@/hooks/use-set-page-title";

function SessionsPageContent() {
  useSetPageTitle("Gestion des séances");

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
    <div className="space-y-6 p-1">
      {/* Filtres */}
      <SessionFilters
        selectedClassId={selectedClassId}
        selectedDate={selectedDate}
        selectedSessionId={selectedSessionId}
        uniqueClasses={uniqueClasses}
        allSessions={allSessions}
        onClassChange={setSelectedClassId}
        onDateChange={setSelectedDate}
        onSessionChange={setSelectedSessionId}
      />

      {/* Liste des sessions */}
      <SessionsList
        selectedSessionId={selectedSessionId}
        selectedSession={selectedSession || null}
        studentsForSession={studentsForSession}
        openAccordions={openAccordions}
        onToggleAccordion={toggleAccordion}
      />
    </div>
  );
}

export default function SessionsPage() {
  return (
    <Suspense
      fallback={
        <div className="space-y-6">
          <div className="h-8 bg-muted animate-pulse rounded"></div>
          <div className="h-32 bg-muted animate-pulse rounded"></div>
        </div>
      }
    >
      <SessionsPageContent />
    </Suspense>
  );
}
