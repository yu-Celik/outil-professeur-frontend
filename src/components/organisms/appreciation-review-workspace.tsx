"use client";

import { useMemo, useCallback } from "react";
import {
  StudentReviewList,
  type StudentReviewItem,
} from "@/components/molecules/student-review-list";
import {
  AppreciationStatsPanel,
  type StatsSection,
} from "@/components/molecules/appreciation-stats-panel";
import { AppreciationEditorCard } from "@/components/molecules/appreciation-editor-card";
import {
  useAppreciationRevision,
  type RevisionStudent,
} from "@/features/appreciations/hooks/use-appreciation-revision";
import type { AppreciationContent } from "@/types/uml-entities";

export interface AppreciationReviewWorkspaceProps {
  students: RevisionStudent[];
  appreciations: AppreciationContent[];
  onValidate: (appreciationId: string) => Promise<void>;
  onUpdateContent: (appreciationId: string, content: string) => Promise<void>;
  buildStats: (studentId: string) => StatsSection[];
  isSaving?: boolean;
  getSubjectLabel?: (subjectId?: string) => string | undefined;
  getPeriodLabel?: (periodId?: string) => string | undefined;
}

export function AppreciationReviewWorkspace({
  students,
  appreciations,
  onValidate,
  onUpdateContent,
  buildStats,
  isSaving = false,
  getSubjectLabel,
  getPeriodLabel,
}: AppreciationReviewWorkspaceProps) {
  const revision = useAppreciationRevision({
    students,
    appreciations,
    onValidate,
    onUpdateContent,
  });

  // Transform students for the list component
  const studentListItems: StudentReviewItem[] = useMemo(
    () =>
      revision.students.map((student) => ({
        id: student.id,
        name: student.name,
        isValidated: student.isValidated,
        isModified: student.appreciationId
          ? revision.isModified(student.appreciationId)
          : false,
      })),
    [revision],
  );

  // Get stats for selected student
  const statsForSelected: StatsSection[] = useMemo(() => {
    if (!revision.selectedStudentId) return [];
    return buildStats(revision.selectedStudentId);
  }, [revision.selectedStudentId, buildStats]);

  // Handle content change with modification tracking
  const handleContentChange = useCallback(
    (content: string) => {
      if (revision.selectedAppreciation) {
        onUpdateContent(revision.selectedAppreciation.id, content);
        revision.markAsModified(revision.selectedAppreciation.id, content);
      }
    },
    [revision, onUpdateContent],
  );

  // Handle validation
  const handleValidate = useCallback(async () => {
    if (revision.selectedAppreciation) {
      await revision.validateAppreciation(revision.selectedAppreciation.id);
    }
  }, [revision]);

  // Handle reset to original
  const handleReset = useCallback(() => {
    if (revision.selectedAppreciation) {
      const original = revision.resetToOriginal(
        revision.selectedAppreciation.id,
      );
      if (original) {
        // The resetToOriginal already calls onUpdateContent
      }
    }
  }, [revision]);

  const selectedAppreciation = revision.selectedAppreciation;
  const isModified = selectedAppreciation
    ? revision.isModified(selectedAppreciation.id)
    : false;

  return (
    <div className="flex h-full min-h-0">
      {/* Left column: Student list */}
      <div className="w-64 flex-shrink-0 border-r border-border">
        <StudentReviewList
          students={studentListItems}
          selectedStudentId={revision.selectedStudentId}
          onSelectStudent={revision.selectStudent}
          stats={revision.stats}
        />
      </div>

      {/* Center column: Editor */}
      <div className="flex-1 min-w-0 p-4 overflow-y-auto">
        {selectedAppreciation ? (
          <AppreciationEditorCard
            content={selectedAppreciation.content}
            originalContent={
              (selectedAppreciation.inputData?.originalContent as
                | string
                | undefined) || selectedAppreciation.content
            }
            studentName={revision.selectedStudent?.name}
            subjectLabel={
              getSubjectLabel
                ? getSubjectLabel(selectedAppreciation.subjectId)
                : selectedAppreciation.subjectId
            }
            periodLabel={
              getPeriodLabel
                ? getPeriodLabel(selectedAppreciation.academicPeriodId)
                : selectedAppreciation.academicPeriodId
            }
            isValidated={selectedAppreciation.status === "validated"}
            isModified={isModified}
            isSaving={isSaving}
            onContentChange={handleContentChange}
            onValidate={handleValidate}
            onReset={handleReset}
            autoSaveDelay={10000}
          />
        ) : (
          <div className="flex items-center justify-center h-full text-muted-foreground">
            <div className="text-center">
              <p className="text-sm">Sélectionnez un élève pour commencer</p>
              <p className="text-xs mt-1">
                Utilisez les flèches ↑↓ pour naviguer
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Right column: Stats */}
      <div className="w-80 flex-shrink-0 border-l border-border">
        <AppreciationStatsPanel
          studentName={revision.selectedStudent?.name}
          sections={statsForSelected}
        />
      </div>
    </div>
  );
}
