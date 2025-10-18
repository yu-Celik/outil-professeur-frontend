"use client";

import { Calendar, List, Grid } from "lucide-react";
import { Suspense, useState, useEffect, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";

import { Button } from "@/components/atoms/button";
import { SessionsList } from "@/components/organisms/sessions-list";
import { SessionsTimeline } from "@/components/organisms/sessions-timeline";
import { AttendanceBatchEditor } from "@/components/organisms/attendance-batch-editor";
import { useClassSelection } from "@/contexts/class-selection-context";
import { useSessionManagement } from "@/features/sessions";
import { useAttendanceApi } from "@/features/sessions/api";
import { useSetPageTitle } from "@/shared/hooks";
import type { StudentParticipation } from "@/types/uml-entities";

type ViewMode = "list" | "batch";

function SessionsPageContent() {
  useSetPageTitle("Gestion des participations");

  const { selectedClassId, assignmentsLoading } = useClassSelection();
  const searchParams = useSearchParams();
  const viewModeParam = searchParams.get("viewMode") as ViewMode | null;
  const { upsertSessionAttendance, mapToUpsertItem } = useAttendanceApi();

  const [viewMode, setViewMode] = useState<ViewMode>("list");

  // Initialize view mode from URL parameter
  useEffect(() => {
    if (viewModeParam === "batch" || viewModeParam === "list") {
      setViewMode(viewModeParam);
    }
  }, [viewModeParam]);

  const {
    // States
    selectedDate,
    selectedSessionId,
    openAccordions,

    // Data
    allSessions,
    selectedSession,
    studentsForSession,
    attendanceData,

    // Actions
    setSelectedDate,
    setSelectedSessionId,
    toggleAccordion,
    refreshAttendance,
  } = useSessionManagement();

  // Handle individual participation save
  const handleSaveParticipation = useCallback(
    async (participation: Partial<StudentParticipation>) => {
      if (!selectedSession) return;

      try {
        const upsertItem = mapToUpsertItem(participation);
        await upsertSessionAttendance(selectedSession.id, {
          items: [upsertItem],
        });

        // Refresh attendance data after save
        await refreshAttendance(selectedSession.id);

        toast.success("Participation enregistrée avec succès");
      } catch (error) {
        console.error("Failed to save participation:", error);
        toast.error("Erreur lors de l'enregistrement de la participation");
      }
    },
    [
      selectedSession,
      mapToUpsertItem,
      upsertSessionAttendance,
      refreshAttendance,
    ],
  );

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
          selectedSessionId={
            selectedSessionId === "all" ? null : selectedSessionId
          }
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
        {/* View mode toggle - only show when a session is selected */}
        {selectedSessionId !== "all" && selectedSession && (
          <div className="flex gap-2 mb-3">
            <Button
              variant={viewMode === "list" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("list")}
              className="flex-1"
            >
              <List className="h-4 w-4 mr-2" />
              Vue détaillée
            </Button>
            <Button
              variant={viewMode === "batch" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("batch")}
              className="flex-1"
            >
              <Grid className="h-4 w-4 mr-2" />
              Saisie rapide
            </Button>
          </div>
        )}

        {/* Conditional rendering based on view mode */}
        {viewMode === "list" ? (
          <SessionsList
            selectedSessionId={selectedSessionId}
            selectedSession={selectedSession || null}
            studentsForSession={studentsForSession}
            openAccordions={openAccordions}
            onToggleAccordion={toggleAccordion}
            attendanceData={attendanceData}
            onSaveParticipation={handleSaveParticipation}
          />
        ) : (
          selectedSession &&
          selectedSessionId !== "all" && (
            <AttendanceBatchEditor
              sessionId={selectedSession.id}
              students={studentsForSession}
              existingAttendance={attendanceData || []}
              onSave={(savedData) => {
                console.log("Attendance saved:", savedData);
                refreshAttendance(selectedSession.id);
              }}
              onCancel={() => setViewMode("list")}
            />
          )
        )}
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
