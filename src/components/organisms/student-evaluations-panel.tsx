"use client";

import {
  Eye,
  GraduationCap,
  Star,
  X,
} from "lucide-react";
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/atoms/avatar";
import { Badge } from "@/components/atoms/badge";
import { Button } from "@/components/atoms/button";
import { Card, CardContent, CardHeader } from "@/components/molecules/card";
import { useExamManagement } from "@/features/evaluations";
import { getStudentExamResults } from "@/features/evaluations/mocks";
import { getClassById, getSubjectById } from "@/features/gestion/mocks";
import type { Student, Exam, StudentExamResult } from "@/types/uml-entities";

interface StudentEvaluationsPanelProps {
  student: Student;
  teacherId: string;
  onClose: () => void;
  onGradeExam: (examId: string) => void;
}

export function StudentEvaluationsPanel({
  student,
  teacherId,
  onClose,
  onGradeExam,
}: StudentEvaluationsPanelProps) {
  // Panel de consultation des résultats seulement (pas de création)

  // Récupérer les entités Exam pour la classe de l'élève
  const { exams } = useExamManagement(teacherId);
  const classExams = exams.filter(exam => exam.classId === student.currentClassId);

  // Récupérer les StudentExamResult pour cet élève
  const studentResults = getStudentExamResults(student.id);

  // Informations sur la classe et les résultats
  const studentClass = getClassById(student.currentClassId);
  const averageGrade = studentResults.length > 0 
    ? studentResults.reduce((sum, result) => sum + (result.grade || 0), 0) / studentResults.length 
    : 0;

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const getGradeColor = (grade: number | null) => {
    if (!grade) return "text-muted-foreground";
    if (grade >= 16) return "text-green-600";
    if (grade >= 14) return "text-blue-600";
    if (grade >= 12) return "text-orange-600";
    if (grade >= 10) return "text-yellow-600";
    return "text-red-600";
  };

  return (
    <div className="flex-1 border-l border-border/50 bg-gradient-to-b from-background to-muted/20 flex flex-col max-h-full">
      {/* En-tête du panel */}
      <div className="px-6 py-4 border-b border-border/50 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10 ring-2 ring-primary/10">
              <AvatarImage src="" />
              <AvatarFallback className="bg-primary/10 text-primary font-medium">
                {student.firstName.charAt(0)}
                {student.lastName.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-semibold text-base">
                {student.firstName} {student.lastName}
              </h3>
              <p className="text-sm text-muted-foreground">
                {studentClass?.classCode} - {studentClass?.gradeLabel}
              </p>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Statistiques rapides */}
      <div className="px-6 py-4 border-b border-border/50 flex-shrink-0">
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">
              {classExams.length}
            </div>
            <p className="text-xs text-muted-foreground">Évaluations</p>
          </div>
          <div className="text-center">
            <div className={`text-2xl font-bold ${getGradeColor(averageGrade)}`}>
              {averageGrade > 0 ? averageGrade.toFixed(1) : "—"}
            </div>
            <p className="text-xs text-muted-foreground">Moyenne</p>
          </div>
        </div>
      </div>

      {/* En-tête des résultats */}
      <div className="px-6 py-3 border-b border-border/50 flex-shrink-0">
        <h4 className="font-medium text-sm text-foreground">
          Résultats de {student.firstName}
        </h4>
        <p className="text-xs text-muted-foreground mt-1">
          Consultation des notes et évaluations
        </p>
      </div>

      {/* Contenu des résultats seulement */}
      <div className="flex-1 overflow-y-auto min-h-0">
        <div className="p-4 space-y-4">
          {/* Résultats StudentExamResult pour cet élève */}
          <div className="space-y-3">
            {studentResults.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Star className="h-8 w-8 mx-auto mb-2" />
                <p className="text-sm">Aucune note enregistrée</p>
                <p className="text-xs mt-1">Les notes de {student.firstName} apparaîtront ici</p>
              </div>
            ) : (
              studentResults.map((result) => {
                const exam = classExams.find(e => e.id === result.examId);
                const subject = exam ? getSubjectById(exam.subjectId) : null;
                
                return (
                  <Card key={result.id} className="p-3">
                    <div className="space-y-2">
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <h5 className="font-medium text-sm truncate">
                            {exam?.title || "Évaluation supprimée"}
                          </h5>
                          <p className="text-xs text-muted-foreground">
                            {subject?.name} • {exam ? formatDate(exam.examDate.toISOString()) : "—"}
                          </p>
                        </div>
                        <div className="text-right">
                          <div className={`text-lg font-bold ${getGradeColor(result.grade)}`}>
                            {result.grade || "—"}<span className="text-sm">/20</span>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            Coef. {exam?.coefficient || 1}
                          </p>
                        </div>
                      </div>
                      
                      {result.comments && (
                        <div className="bg-muted/30 rounded-md p-2">
                          <p className="text-xs text-muted-foreground italic">
                            "{result.comments}"
                          </p>
                        </div>
                      )}
                      
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-muted-foreground">
                          Noté le {formatDate(result.markedAt.toISOString())}
                        </span>
                        {exam && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onGradeExam(exam.id)}
                            className="h-6 px-2 text-xs"
                          >
                            <Eye className="h-3 w-3 mr-1" />
                            Revoir
                          </Button>
                        )}
                      </div>
                    </div>
                  </Card>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}