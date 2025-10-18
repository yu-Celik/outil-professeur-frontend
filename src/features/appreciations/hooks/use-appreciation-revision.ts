"use client";

import { useState, useCallback, useEffect, useMemo } from "react";
import type { AppreciationContent } from "@/types/uml-entities";

export interface RevisionStudent {
  id: string;
  name: string;
  appreciationId?: string;
  isValidated: boolean;
}

export interface UseAppreciationRevisionProps {
  students: RevisionStudent[];
  appreciations: AppreciationContent[];
  onValidate?: (appreciationId: string) => Promise<void>;
  onUpdateContent?: (appreciationId: string, content: string) => Promise<void>;
}

export function useAppreciationRevision({
  students,
  appreciations,
  onValidate,
  onUpdateContent,
}: UseAppreciationRevisionProps) {
  const [selectedStudentId, setSelectedStudentId] = useState<
    string | undefined
  >(students[0]?.id);
  const [originalContents, setOriginalContents] = useState<Map<string, string>>(
    new Map(),
  );

  // Track which appreciations have been modified
  const [modifiedAppreciations, setModifiedAppreciations] = useState<
    Set<string>
  >(new Set());

  // Initialize original contents from appreciations
  useEffect(() => {
    const contents = new Map<string, string>();
    for (const appreciation of appreciations) {
      contents.set(appreciation.id, appreciation.content);
    }
    setOriginalContents(contents);
  }, [appreciations]);

  // Get selected student index
  const selectedIndex = useMemo(() => {
    return students.findIndex((s) => s.id === selectedStudentId);
  }, [students, selectedStudentId]);

  // Get selected appreciation
  const selectedAppreciation = useMemo(() => {
    const student = students.find((s) => s.id === selectedStudentId);
    if (!student?.appreciationId) return undefined;
    return appreciations.find((a) => a.id === student.appreciationId);
  }, [selectedStudentId, students, appreciations]);

  // Navigation functions
  const selectNext = useCallback(() => {
    if (selectedIndex < students.length - 1) {
      setSelectedStudentId(students[selectedIndex + 1].id);
    }
  }, [selectedIndex, students]);

  const selectPrevious = useCallback(() => {
    if (selectedIndex > 0) {
      setSelectedStudentId(students[selectedIndex - 1].id);
    }
  }, [selectedIndex, students]);

  const selectStudent = useCallback((studentId: string) => {
    setSelectedStudentId(studentId);
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Only handle arrow keys when not in an input/textarea
      if (
        event.target instanceof HTMLInputElement ||
        event.target instanceof HTMLTextAreaElement
      ) {
        return;
      }

      if (event.key === "ArrowDown") {
        event.preventDefault();
        selectNext();
      } else if (event.key === "ArrowUp") {
        event.preventDefault();
        selectPrevious();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectNext, selectPrevious]);

  // Check if content has been modified
  const isModified = useCallback(
    (appreciationId: string) => {
      return modifiedAppreciations.has(appreciationId);
    },
    [modifiedAppreciations],
  );

  // Mark content as modified
  const markAsModified = useCallback(
    (appreciationId: string, content: string) => {
      const original = originalContents.get(appreciationId);
      if (original && content !== original) {
        setModifiedAppreciations((prev) => new Set(prev).add(appreciationId));
      } else {
        setModifiedAppreciations((prev) => {
          const next = new Set(prev);
          next.delete(appreciationId);
          return next;
        });
      }
    },
    [originalContents],
  );

  // Reset content to original
  const resetToOriginal = useCallback(
    (appreciationId: string) => {
      const original = originalContents.get(appreciationId);
      if (original && onUpdateContent) {
        onUpdateContent(appreciationId, original);
        setModifiedAppreciations((prev) => {
          const next = new Set(prev);
          next.delete(appreciationId);
          return next;
        });
      }
      return original;
    },
    [originalContents, onUpdateContent],
  );

  // Validate appreciation
  const validateAppreciation = useCallback(
    async (appreciationId: string) => {
      if (onValidate) {
        await onValidate(appreciationId);
      }
    },
    [onValidate],
  );

  // Get validation stats
  const stats = useMemo(() => {
    const total = students.length;
    const validated = students.filter((s) => s.isValidated).length;
    const modified = modifiedAppreciations.size;
    const remaining = total - validated;

    return {
      total,
      validated,
      modified,
      remaining,
      progress: total > 0 ? Math.round((validated / total) * 100) : 0,
    };
  }, [students, modifiedAppreciations]);

  return {
    // Selection
    selectedStudentId,
    selectedStudent: students.find((s) => s.id === selectedStudentId),
    selectedAppreciation,
    selectedIndex,

    // Navigation
    selectStudent,
    selectNext,
    selectPrevious,
    canSelectNext: selectedIndex < students.length - 1,
    canSelectPrevious: selectedIndex > 0,

    // Modification tracking
    isModified,
    markAsModified,
    resetToOriginal,

    // Validation
    validateAppreciation,

    // Stats
    stats,

    // Lists
    students,
    appreciations,
  };
}
