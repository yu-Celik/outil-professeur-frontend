"use client";

import { use, useState } from "react";
import { AuthorizationGuard } from "@/components/molecules/authorization-guard";
import { ParticipationHistoryCard } from "@/components/organisms/participation-history-card";
import { StudentDetailsGrid } from "@/components/organisms/student-details-grid";
import { StudentHeaderCard } from "@/components/organisms/student-header-card";
import { StudentMetricsCards } from "@/components/organisms/student-metrics-cards";
import { StudentProfileSummary } from "@/components/organisms/student-profile-summary";
import { StudentObservationsTimeline } from "@/components/organisms/student-observations-timeline";
import { StudentObservationDialog } from "@/components/organisms/student-observation-dialog";
import { useNotationSystem } from "@/features/evaluations";
import { useStudentProfile } from "@/features/students";
import { useTeachingAssignments } from "@/features/gestion";
import type {
  ObservationFormData,
  StudentObservation,
} from "@/features/students/types/observation-types";

interface StudentProfilePageProps {
  params: Promise<{ id: string }>;
}

export default function StudentProfilePage({
  params,
}: StudentProfilePageProps) {
  const { id } = use(params);
  const { rights, loading: rightsLoading } = useTeachingAssignments();
  useNotationSystem();

  const {
    student,
    schoolYear,
    currentPeriod,
    currentProfile,
    recentParticipations,
    loading: profileLoading,
    error: profileError,
    observations,
    createObservation,
    updateObservation,
    removeObservation,
    isWatchlisted,
    toggleWatchlist,
  } = useStudentProfile(id);

  // Observation dialog state
  const [observationDialogOpen, setObservationDialogOpen] = useState(false);
  const [editingObservation, setEditingObservation] = useState<
    StudentObservation | undefined
  >(undefined);

  const handleValidateProfile = () => {
    currentProfile?.review("Profil validé par l'enseignant");
  };

  const handleAddObservation = () => {
    setEditingObservation(undefined);
    setObservationDialogOpen(true);
  };

  const handleEditObservation = (observation: StudentObservation) => {
    setEditingObservation(observation);
    setObservationDialogOpen(true);
  };

  const handleSaveObservation = async (formData: ObservationFormData) => {
    if (editingObservation) {
      await updateObservation(editingObservation.id, formData.content);
    } else {
      await createObservation(formData);
    }
  };

  const handleDeleteObservation = async (observationId: string) => {
    await removeObservation(observationId);
  };

  // Calculer les statistiques
  const totalSessions = recentParticipations.length;
  const presentSessions = recentParticipations.filter(
    (p) => p.isPresent,
  ).length;

  if (rightsLoading || profileLoading) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="text-center">
          <div className="text-lg font-medium">
            {rightsLoading
              ? "Vérification des autorisations..."
              : "Chargement du profil..."}
          </div>
          <div className="text-sm text-muted-foreground mt-2">
            Chargement en cours
          </div>
        </div>
      </div>
    );
  }

  if (profileError) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="text-center">
          <div className="text-lg font-medium text-destructive">
            Erreur de chargement
          </div>
          <div className="text-sm text-muted-foreground mt-2">
            {profileError}
          </div>
        </div>
      </div>
    );
  }

  if (!student) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="text-center">
          <div className="text-lg font-medium">Élève introuvable</div>
        </div>
      </div>
    );
  }

  return (
    <AuthorizationGuard
      hasPermission={rights.canViewStudentProfile(
        student.id,
        student.currentClassId,
      )}
      fallbackMessage="Accès non autorisé au profil étudiant"
      requiredRole="Enseignant de la classe"
    >
      <div className="space-y-6">
        {/* Header du profil étudiant */}
        <StudentHeaderCard
          student={student}
          schoolYear={schoolYear}
          currentPeriod={currentPeriod}
          canContact={rights.canViewStudentProfile(
            student.id,
            student.currentClassId,
          )}
          canGenerateReport={rights.canEditStudentData(
            student.id,
            student.currentClassId,
          )}
          isWatchlisted={isWatchlisted}
          onToggleWatchlist={toggleWatchlist}
        />

        {/* Métriques calculées */}
        <StudentMetricsCards
          currentProfile={currentProfile}
          totalSessions={totalSessions}
          presentSessions={presentSessions}
        />

        {/* Profil détaillé */}
        <StudentDetailsGrid student={student} />

        {/* Historique des participations */}
        <ParticipationHistoryCard
          currentPeriod={currentPeriod}
          recentParticipations={recentParticipations}
          studentId={id}
        />

        {/* Observations enseignante */}
        <StudentObservationsTimeline
          observations={observations}
          onAdd={handleAddObservation}
          onEdit={handleEditObservation}
          onDelete={handleDeleteObservation}
          isLoading={profileLoading}
        />

        {/* Profil généré et actions */}
        <StudentProfileSummary
          currentProfile={currentProfile}
          currentPeriod={currentPeriod}
          canEditStudentData={rights.canEditStudentData(
            student.id,
            student.currentClassId,
          )}
          onValidateProfile={handleValidateProfile}
        />
      </div>

      {/* Observation Dialog */}
      <StudentObservationDialog
        open={observationDialogOpen}
        onOpenChange={setObservationDialogOpen}
        onSave={handleSaveObservation}
        observation={editingObservation}
        studentName={student.fullName()}
      />
    </AuthorizationGuard>
  );
}
