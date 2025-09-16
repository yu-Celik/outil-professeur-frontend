"use client";

import { Edit, MoreHorizontal, Save, X } from "lucide-react";
import { useState } from "react";
import { AbsenceToggle } from "@/components/atoms/absence-toggle";
import { Button } from "@/components/atoms/button";
import { GradeInput } from "@/components/atoms/grade-input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/molecules/dropdown-menu";
import { GradeEntryModal } from "@/components/molecules/grade-entry-modal";
import {
  calculatePointsFromGrade,
  formatGradeDisplay,
} from "@/features/evaluations/utils/notation-utils";
import type {
  Exam,
  NotationSystem,
  Student,
  StudentExamResult,
} from "@/types/uml-entities";

interface InlineResultEditorProps {
  result?: StudentExamResult;
  exam: Exam;
  student: Student;
  notationSystem: NotationSystem;
  onSave: (
    resultId: string | undefined,
    data: Partial<StudentExamResult>,
  ) => void;
  canEdit?: boolean;
  compact?: boolean;
}

export function InlineResultEditor({
  result,
  exam,
  student,
  notationSystem,
  onSave,
  canEdit = true,
  compact: _compact = false,
}: InlineResultEditorProps) {
  const [isInlineEditing, setIsInlineEditing] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editData, setEditData] = useState({
    grade: result?.grade || null,
    isAbsent: result?.isAbsent || false,
  });

  const handleInlineEdit = () => {
    setIsInlineEditing(true);
    setEditData({
      grade: result?.grade || null,
      isAbsent: result?.isAbsent || false,
    });
  };

  const gradeIsValid = editData.isAbsent
    ? true
    : editData.grade !== null && notationSystem.validateGrade(editData.grade);

  const handleInlineSave = () => {
    if (!gradeIsValid) return;

    const effectiveGrade = editData.isAbsent
      ? notationSystem.minValue
      : (editData.grade ?? notationSystem.minValue);

    const computedPoints = editData.isAbsent
      ? 0
      : calculatePointsFromGrade(effectiveGrade, exam, notationSystem);

    const dataToSave: Partial<StudentExamResult> = {
      grade: effectiveGrade,
      pointsObtained: computedPoints,
      isAbsent: editData.isAbsent,
      gradeDisplay: editData.isAbsent
        ? "ABS"
        : formatGradeDisplay(effectiveGrade, notationSystem, "fr-FR"),
      markedAt: new Date(),
      // Keep existing comments if any
      comments: result?.comments || "",
    };

    onSave(result?.id, dataToSave);
    setIsInlineEditing(false);
  };

  const handleInlineCancel = () => {
    setEditData({
      grade: result?.grade || null,
      isAbsent: result?.isAbsent || false,
    });
    setIsInlineEditing(false);
  };

  if (!canEdit) {
    // Read-only display
    return (
      <div className="flex items-center gap-2 text-sm">
        {result?.isAbsent ? (
          <span className="text-destructive font-medium">ABS</span>
        ) : (
          <span className="font-medium">{result?.gradeDisplay || "—"}</span>
        )}
      </div>
    );
  }

  if (isInlineEditing) {
    // Inline editing mode
    return (
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1">
          <AbsenceToggle
            isAbsent={editData.isAbsent}
            onChange={(isAbsent) =>
              setEditData((prev) => ({ ...prev, isAbsent }))
            }
            size="sm"
          />
          {!editData.isAbsent && (
            <GradeInput
              value={editData.grade}
              onChange={(grade) => setEditData((prev) => ({ ...prev, grade }))}
              notationSystem={notationSystem}
              className="w-16 h-7 text-xs"
              error={
                editData.grade !== null &&
                !notationSystem.validateGrade(editData.grade)
                  ? `Note invalide (${notationSystem.minValue}-${notationSystem.maxValue})`
                  : undefined
              }
            />
          )}
        </div>
        <div className="flex items-center gap-1">
          <Button
            size="sm"
            onClick={handleInlineSave}
            className="h-6 w-6 p-0"
            disabled={!gradeIsValid}
          >
            <Save className="h-3 w-3" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleInlineCancel}
            className="h-6 w-6 p-0"
          >
            <X className="h-3 w-3" />
          </Button>
        </div>
      </div>
    );
  }

  // Display mode with edit actions
  return (
    <>
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-2">
          {result?.isAbsent ? (
            <span className="text-destructive font-medium text-sm">ABS</span>
          ) : (
            <span className="font-medium text-sm">
              {result?.gradeDisplay || "—"}
            </span>
          )}
          {result && !result.isAbsent && notationSystem && (
            <span className="text-xs text-muted-foreground">
              /{notationSystem.maxValue}
            </span>
          )}
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <MoreHorizontal className="h-3 w-3" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-40">
            <DropdownMenuItem onClick={handleInlineEdit}>
              <Edit className="h-3 w-3 mr-2" />
              Modification rapide
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setIsModalOpen(true)}>
              <Edit className="h-3 w-3 mr-2" />
              Édition détaillée
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <GradeEntryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={(data) => onSave(result?.id, data)}
        student={student}
        exam={exam}
        result={result}
        notationSystem={notationSystem}
      />
    </>
  );
}
