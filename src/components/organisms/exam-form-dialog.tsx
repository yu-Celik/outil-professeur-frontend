"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/atoms/dialog";
import { ExamForm } from "@/components/molecules/exam-form";
import { useExamManagement } from "@/features/evaluations";
import { useNotationSystem } from "@/features/evaluations";
import type { Exam } from "@/types/uml-entities";
import {
  MOCK_CLASSES,
  MOCK_SUBJECTS,
  MOCK_ACADEMIC_PERIODS,
} from "@/features/gestion/mocks";

export interface ExamFormDialogProps {
  isOpen: boolean;
  onClose: () => void;
  exam?: Exam | null;
  onSuccess?: () => void;
}

export function ExamFormDialog({
  isOpen,
  onClose,
  exam,
  onSuccess,
}: ExamFormDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { createExam, updateExam } = useExamManagement();
  const { notationSystems } = useNotationSystem();

  const handleSubmit = async (formData: any) => {
    setIsSubmitting(true);

    try {
      if (exam) {
        await updateExam(exam.id, formData);
      } else {
        await createExam(formData);
      }

      onSuccess?.();
      onClose();
    } catch (error) {
      console.error("Erreur lors de l'enregistrement:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    if (!isSubmitting) {
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {exam ? "Modifier l'examen" : "Créer un nouvel examen"}
          </DialogTitle>
        </DialogHeader>

        <div className="mt-4">
          <ExamForm
            exam={exam}
            classes={MOCK_CLASSES}
            subjects={MOCK_SUBJECTS}
            academicPeriods={MOCK_ACADEMIC_PERIODS}
            notationSystems={notationSystems}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            isSubmitting={isSubmitting}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
