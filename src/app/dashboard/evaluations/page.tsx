"use client";

import { useState } from "react";
import { useSetPageTitle } from "@/hooks/use-set-page-title";
import { Button } from "@/components/atoms/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/molecules/card";
import { ClassSelectionLayout } from "@/components/templates/class-selection-layout";
import { ExamsList } from "@/components/organisms/exams-list";
import { ExamFormDialog } from "@/components/organisms/exam-form-dialog";
import { ExamGradingPage } from "@/components/organisms/exam-grading-page";
import { useExamManagement } from "@/hooks/use-exam-management";
import { useClassSelection } from "@/contexts/class-selection-context";
import { BookOpen } from "lucide-react";
import type { Exam } from "@/types/uml-entities";

export default function EvaluationsPage() {
  useSetPageTitle("Évaluations");
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [editingExam, setEditingExam] = useState<Exam | null>(null);
  const [gradingExamId, setGradingExamId] = useState<string | null>(null);
  
  const { selectedClassId, currentTeacherId } = useClassSelection();
  const { refresh, getExamById, getExamsByClassId } = useExamManagement(currentTeacherId);

  const handleCreateExam = () => {
    setEditingExam(null);
    setShowCreateDialog(true);
  };

  const handleEditExam = (examId: string) => {
    const exam = getExamById(examId);
    if (exam) {
      setEditingExam(exam);
      setShowCreateDialog(true);
    }
  };

  const handleDeleteExam = (examId: string) => {
    console.log("Examen supprimé:", examId);
  };

  const handleGradeExam = (examId: string) => {
    setGradingExamId(examId);
  };

  const handleFormSuccess = () => {
    refresh();
  };

  const handleCloseDialog = () => {
    setShowCreateDialog(false);
    setEditingExam(null);
  };

  // Si on est en mode correction, afficher l'interface de correction
  if (gradingExamId) {
    return (
      <ExamGradingPage
        examId={gradingExamId}
        onBack={() => setGradingExamId(null)}
      />
    );
  }

  return (
    <>
      <ClassSelectionLayout
        emptyStateIcon={<BookOpen className="h-8 w-8" />}
        emptyStateTitle="Sélectionnez une classe"
        emptyStateDescription="Choisissez une classe dans la sidebar pour créer et gérer ses évaluations"
      >

        {/* Liste des évaluations */}
        <ExamsList
          teacherId={currentTeacherId}
          selectedClassId={selectedClassId}
          onCreateExam={handleCreateExam}
          onEditExam={handleEditExam}
          onDeleteExam={handleDeleteExam}
          onGradeExam={handleGradeExam}
          showFilters={false}
          showStatistics={true}
          className="w-full"
        />
      </ClassSelectionLayout>

      {/* Dialog de création/édition d'examen */}
      <ExamFormDialog
        isOpen={showCreateDialog}
        onClose={handleCloseDialog}
        exam={editingExam}
        onSuccess={handleFormSuccess}
      />
    </>
  );
}