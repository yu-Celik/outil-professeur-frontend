"use client";

import { StudentProfilePanel } from "@/components/organisms/student-profile-panel";
import { StudentsGrid } from "@/components/organisms/students-grid";
import { useSetPageTitle } from "@/shared/hooks";
import { useStudentsManagement } from "@/features/students";
import { useClassSelection } from "@/contexts/class-selection-context";
import { Users } from "lucide-react";

export default function MesElevesPage() {
  useSetPageTitle("Mes Élèves");

  const { selectedClassId, assignmentsLoading } = useClassSelection();
  const {
    currentTeacherId,
    selectedStudent,
    selectedClass,
    studentsOfSelectedClass,
    handleStudentClick,
    handleCloseStudentProfile,
    handleSessionClick,
  } = useStudentsManagement(selectedClassId);

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
          <Users className="h-8 w-8" />
        </div>
        <div className="text-xl font-semibold mb-3 text-foreground">
          Sélectionnez une classe
        </div>
        <div className="text-sm text-center max-w-sm leading-relaxed">
          Choisissez une classe dans la sidebar pour voir ses élèves
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-1 min-h-0 h-full">
      {/* Grille des élèves - largeur w-106 */}
      <div className="w-106 flex flex-col min-w-0 bg-background/60 backdrop-blur-sm overflow-y-auto min-h-0 p-6">
        <StudentsGrid
          students={studentsOfSelectedClass}
          selectedClassId={selectedClassId}
          selectedStudent={selectedStudent}
          selectedClass={selectedClass}
          onStudentClick={handleStudentClick}
        />
      </div>

      {/* Panel de profil élève */}
      {selectedStudent && (
        <StudentProfilePanel
          student={selectedStudent}
          teacherId={currentTeacherId}
          onClose={handleCloseStudentProfile}
          onSessionClick={handleSessionClick}
        />
      )}
    </div>
  );
}