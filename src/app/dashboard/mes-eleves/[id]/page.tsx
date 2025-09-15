"use client";

import { use } from "react";
import { AuthorizationGuard } from "@/components/molecules/authorization-guard";
import { ParticipationHistoryCard } from "@/components/organisms/participation-history-card";
import { StudentDetailsGrid } from "@/components/organisms/student-details-grid";
import { StudentHeaderCard } from "@/components/organisms/student-header-card";
import { StudentMetricsCards } from "@/components/organisms/student-metrics-cards";
import { StudentProfileSummary } from "@/components/organisms/student-profile-summary";
import { useNotationSystem } from "@/features/evaluations";
import { useStudentProfile } from "@/features/students";
import { useTeachingAssignments } from "@/features/gestion";

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
  } = useStudentProfile(id);

  const handleValidateProfile = () => {
    currentProfile?.review("Profil validé par l'enseignant");
  };

  // Calculer les statistiques
  const totalSessions = recentParticipations.length;
  const presentSessions = recentParticipations.filter((p) => p.isPresent).length;

  if (rightsLoading) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="text-center">
          <div className="text-lg font-medium">
            Vérification des autorisations...
          </div>
          <div className="text-sm text-muted-foreground mt-2">
            Chargement en cours
          </div>
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
    </AuthorizationGuard>
  );
}