"use client";

import { AlertCircle, Bot } from "lucide-react";
import { use } from "react";
import { Button } from "@/components/atoms/button";
import { Card, CardContent } from "@/components/molecules/card";
import { SessionStudentsList } from "@/components/molecules/session-students-list";
import { SessionSummaryCard } from "@/components/molecules/session-summary-card";
import { StudentEvaluationHeader } from "@/components/molecules/student-evaluation-header";
import { StudentEvaluationForm } from "@/components/organisms/student-evaluation-form";
import { useNotationSystem } from "@/hooks/use-notation-system";
import { useStudentEvaluation } from "@/hooks/use-student-evaluation";

interface StudentEvaluationPageProps {
  params: Promise<{ id: string }>;
  searchParams?: Promise<{ session?: string }>;
}

export default function StudentEvaluationPage({
  params,
  searchParams,
}: StudentEvaluationPageProps) {
  const { id } = use(params);
  const search = use(
    searchParams || Promise.resolve({} as { session?: string }),
  );
  const sessionId = search?.session;

  // Hook basé sur les entités UML complètes
  const {
    courseSession,
    student,
    subject,
    timeSlot,
    class: classEntity,
    participation,
    isLoading,
    hasUnsavedChanges,
    markAttendance,
    setParticipationLevel,
    addRemarks,
    updateBehavior,
    updateTechnicalIssues,
    takeAttendance,
    getSessionSummary,
    canEvaluate,
    getAttendanceRate,
    getParticipationAverage,
    sessionStudents,
    handleSave,
    handleReset,
  } = useStudentEvaluation(id, sessionId);

  useNotationSystem();

  if (!canEvaluate()) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <Card className="w-96">
          <CardContent className="p-6 text-center">
            <AlertCircle className="h-12 w-12 text-chart-4 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Accès non autorisé</h3>
            <p className="text-muted-foreground">
              Vous n'avez pas les droits nécessaires pour évaluer cet étudiant
              dans cette session.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header avec contexte UML complet */}
      <StudentEvaluationHeader
        courseSession={courseSession}
        subject={subject}
        timeSlot={timeSlot}
        classEntity={classEntity}
        hasUnsavedChanges={hasUnsavedChanges}
        isLoading={isLoading}
        onSave={handleSave}
        onReset={handleReset}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Section d'évaluation basée sur StudentParticipation */}
        <div className="lg:col-span-2">
          <StudentEvaluationForm
            student={student}
            participation={participation}
            isLoading={isLoading}
            getAttendanceRate={getAttendanceRate}
            getParticipationAverage={getParticipationAverage}
            markAttendance={markAttendance}
            setParticipationLevel={setParticipationLevel}
            addRemarks={addRemarks}
            updateBehavior={updateBehavior}
            updateTechnicalIssues={updateTechnicalIssues}
            onSave={handleSave}
          />
        </div>

        {/* Liste des étudiants de la session */}
        <div className="space-y-4">
          <SessionStudentsList
            classEntity={classEntity}
            subject={subject}
            timeSlot={timeSlot}
            students={sessionStudents}
          />

          {/* Résumé de session (UML: CourseSession.summary()) */}
          <SessionSummaryCard
            courseSession={courseSession}
            timeSlot={timeSlot}
            getSessionSummary={getSessionSummary}
            takeAttendance={takeAttendance}
          />
        </div>
      </div>

      {/* Bouton IA flottant */}
      <div className="fixed bottom-6 right-6">
        <Button size="lg" className="rounded-full w-14 h-14 shadow-lg">
          <Bot className="h-6 w-6" />
        </Button>
      </div>
    </div>
  );
}
