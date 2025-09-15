"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/atoms/button";
import { Badge } from "@/components/atoms/badge";
import { ExamGradingInterface } from "@/components/organisms/exam-grading-interface";
import { ArrowLeft, Calendar, Clock, Users, Target } from "lucide-react";
import { useExamManagement } from "@/features/evaluations";
import { useNotationSystem } from "@/features/evaluations";
import type { Exam } from "@/types/uml-entities";
import { MOCK_CLASSES, MOCK_SUBJECTS } from "@/data";

export interface ExamGradingPageProps {
  examId: string;
  onBack?: () => void;
}

export function ExamGradingPage({ examId, onBack }: ExamGradingPageProps) {
  const { getExamById } = useExamManagement();
  const { notationSystems } = useNotationSystem();
  const [exam, setExam] = useState<Exam | null>(null);

  useEffect(() => {
    const examData = getExamById(examId);
    setExam(examData || null);
  }, [examId, getExamById]);

  if (!exam) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="text-lg font-medium mb-2">Examen non trouvé</div>
          <p className="text-muted-foreground mb-4">
            L'examen demandé n'existe pas ou a été supprimé.
          </p>
          {onBack && (
            <Button onClick={onBack} variant="outline">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Retour à la liste
            </Button>
          )}
        </div>
      </div>
    );
  }

  const examClass = MOCK_CLASSES.find(c => c.id === exam.classId);
  const examSubject = MOCK_SUBJECTS.find(s => s.id === exam.subjectId);
  const notationSystem = notationSystems.find(ns => ns.id === exam.notationSystemId);

  return (
    <div className="space-y-6">
      {/* En-tête avec navigation */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          {onBack && (
            <Button onClick={onBack} variant="outline" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Retour
            </Button>
          )}
          
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Correction d'examen</h1>
            <p className="text-muted-foreground">
              Interface de notation et d'évaluation des copies
            </p>
          </div>
        </div>
      </div>

      {/* Informations de l'examen */}
      <div className="grid gap-4 md:grid-cols-4">
        <div className="flex items-center gap-3 p-4 bg-card rounded-lg border">
          <Calendar className="w-8 h-8 p-1.5 bg-chart-1/10 text-chart-1 rounded-lg" />
          <div>
            <div className="text-sm text-muted-foreground">Date</div>
            <div className="font-medium">
              {exam.examDate.toLocaleDateString("fr-FR", {
                day: 'numeric',
                month: 'long',
                year: 'numeric'
              })}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 p-4 bg-card rounded-lg border">
          <Clock className="w-8 h-8 p-1.5 bg-chart-2/10 text-chart-2 rounded-lg" />
          <div>
            <div className="text-sm text-muted-foreground">Durée</div>
            <div className="font-medium">{exam.durationMinutes} minutes</div>
          </div>
        </div>

        <div className="flex items-center gap-3 p-4 bg-card rounded-lg border">
          <Target className="w-8 h-8 p-1.5 bg-chart-3/10 text-chart-3 rounded-lg" />
          <div>
            <div className="text-sm text-muted-foreground">Barème</div>
            <div className="font-medium">
              {exam.totalPoints} points (×{exam.coefficient})
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 p-4 bg-card rounded-lg border">
          <Users className="w-8 h-8 p-1.5 bg-chart-4/10 text-chart-4 rounded-lg" />
          <div>
            <div className="text-sm text-muted-foreground">Contexte</div>
            <div className="font-medium">
              {examClass?.classCode} - {examSubject?.name}
            </div>
          </div>
        </div>
      </div>

      {/* Métadonnées de l'examen */}
      <div className="flex flex-wrap gap-2">
        <Badge variant="outline">
          {exam.examType}
        </Badge>
        {notationSystem && (
          <Badge variant="secondary">
            Notation: {notationSystem.name} ({notationSystem.minValue}-{notationSystem.maxValue})
          </Badge>
        )}
        {exam.isPublished && (
          <Badge variant="default">
            Publié
          </Badge>
        )}
      </div>

      {/* Interface de correction principale */}
      <ExamGradingInterface exam={exam} />
    </div>
  );
}