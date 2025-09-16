"use client";

import { BookOpen } from "lucide-react";
import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/molecules/card";
import { ExamFormDialog } from "@/components/organisms/exam-form-dialog";
import { ExamGradingPage } from "@/components/organisms/exam-grading-page";
import { ExamsList } from "@/components/organisms/exams-list";
import { useClassSelection } from "@/contexts/class-selection-context";
import { useExamManagement } from "@/features/evaluations";
import { useSetPageTitle } from "@/shared/hooks";
import type { Exam } from "@/types/uml-entities";

export default function EvaluationsPage() {
  useSetPageTitle("Évaluations");
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [editingExam, setEditingExam] = useState<Exam | null>(null);
  const [gradingExamId, setGradingExamId] = useState<string | null>(null);

  const { selectedClassId, currentTeacherId, assignmentsLoading } = useClassSelection();
  const { refresh, getExamById } = useExamManagement(currentTeacherId);

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
          <BookOpen className="h-8 w-8" />
        </div>
        <div className="text-xl font-semibold mb-3 text-foreground">
          Sélectionnez une classe
        </div>
        <div className="text-sm text-center max-w-sm leading-relaxed">
          Choisissez une classe dans la sidebar pour créer et gérer ses évaluations
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <Card className="mb-6">
        <CardHeader className="pb-3">
          <CardTitle>Comment attribuer des notes rapidement ?</CardTitle>
          <p className="text-sm text-muted-foreground">
            Sélectionne une classe, crée ton évaluation puis clique sur
            <span className="font-medium">
              {" "}
              «&nbsp;Saisir les notes&nbsp;»
            </span>
            pour accéder à la grille de correction interactive.
          </p>
        </CardHeader>
        <CardContent className="grid gap-3 md:grid-cols-3 text-sm text-muted-foreground">
          <div>
            <span className="text-foreground font-medium">1.</span> Crée ou
            sélectionne un examen dans la liste.
          </div>
          <div>
            <span className="text-foreground font-medium">2.</span> Clique sur
            <span className="font-medium">
              {" "}
              «&nbsp;Saisir les notes&nbsp;»
            </span>{" "}
            : tu arrives sur la grille élève par élève.
          </div>
          <div>
            <span className="text-foreground font-medium">3.</span> Saisie
            inline ou via la modal détaillée ; les validations suivent le
            barème de l'examen.
          </div>
        </CardContent>
      </Card>

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

      {/* Dialog de création/édition d'examen */}
      <ExamFormDialog
        isOpen={showCreateDialog}
        onClose={handleCloseDialog}
        exam={editingExam}
        onSuccess={handleFormSuccess}
      />
    </div>
  );
}
