"use client";

import { useEffect } from "react";
import { ClassesSidebar } from "@/components/organisms/classes-sidebar";
import { StudentProfilePanel } from "@/components/organisms/student-profile-panel";
import { StudentsGrid } from "@/components/organisms/students-grid";
import { useSetPageTitle } from "@/hooks/use-set-page-title";
import { useStudentsManagement } from "@/hooks/use-students-management";

export default function MesElevesPage() {
  useSetPageTitle("Mes Élèves");

  const {
    currentTeacherId,
    selectedClassId,
    selectedStudent,
    selectedClass,
    classes,
    studentsOfSelectedClass,
    assignmentsLoading,
    getClassColorWithText,
    handleClassSelect,
    handleStudentClick,
    handleCloseStudentProfile,
    handleSessionClick,
    selectFirstClassIfAvailable,
  } = useStudentsManagement();

  // Sélectionner automatiquement la première classe
  useEffect(() => {
    selectFirstClassIfAvailable();
  }, [selectFirstClassIfAvailable]);

  if (assignmentsLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-muted-foreground">Chargement...</div>
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100vh-112px)] bg-gradient-to-br from-background via-background to-muted/20">
      {/* Sidebar des classes */}
      <ClassesSidebar
        classes={classes}
        selectedClassId={selectedClassId}
        onClassSelect={handleClassSelect}
        getClassColorWithText={getClassColorWithText}
      />

      {/* Grille des élèves */}
      <div className="flex-1 flex flex-col min-w-0 bg-background/60 backdrop-blur-sm overflow-y-auto min-h-0">
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