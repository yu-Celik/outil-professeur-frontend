"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import {
  CheckCircle2,
  Save,
  Users,
  X,
  CheckSquare,
  Square,
} from "lucide-react";
import { Badge } from "@/components/atoms/badge";
import { Button } from "@/components/atoms/button";
import { Input } from "@/components/atoms/input";
import { Textarea } from "@/components/atoms/textarea";
import { Card, CardContent, CardHeader } from "@/components/molecules/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/atoms/select";
import type { Student, StudentParticipation } from "@/types/uml-entities";
import {
  useAttendanceApi,
  type AttendanceUpsertRequest,
} from "@/features/sessions/api";

interface AttendanceBatchEditorProps {
  sessionId: string;
  students: Student[];
  existingAttendance?: StudentParticipation[];
  onSave: (data: StudentParticipation[]) => void;
  onCancel?: () => void;
}

interface AttendanceRow {
  studentId: string;
  isPresent: boolean;
  participationLevel: number;
  behavior: string;
  cameraEnabled: boolean;
  homeworkDone: boolean;
  specificRemarks: string;
  technicalIssues: string;
  isDirty: boolean;
}

const PARTICIPATION_LEVELS: Array<{ value: number; label: string }> = [
  { value: 0, label: "0 - Non évalué" },
  { value: 1, label: "1 - Très faible" },
  { value: 2, label: "2 - Faible" },
  { value: 3, label: "3 - Moyen" },
  { value: 4, label: "4 - Bien" },
  { value: 5, label: "5 - Très bien" },
];

const BEHAVIOR_OPTIONS = [
  { value: "", label: "Non évalué" },
  { value: "excellent", label: "Excellent" },
  { value: "bien", label: "Bien" },
  { value: "correct", label: "Correct" },
  { value: "à améliorer", label: "À améliorer" },
  { value: "problématique", label: "Problématique" },
];

/**
 * Batch attendance editor for rapid data entry
 * Optimized for completing 30 students in ≤ 2 minutes
 * Features:
 * - Inline editable grid
 * - Bulk actions (Mark all present)
 * - Auto-save every 10 seconds
 * - Keyboard navigation (Tab, Enter)
 */
export function AttendanceBatchEditor({
  sessionId,
  students,
  existingAttendance = [],
  onSave,
  onCancel,
}: AttendanceBatchEditorProps) {
  const { upsertSessionAttendance, mapToUpsertItem, mapFromApiResponse } =
    useAttendanceApi();

  // Initialize rows from existing attendance or create empty ones
  const initializeRows = useCallback((): Map<string, AttendanceRow> => {
    const rowMap = new Map<string, AttendanceRow>();

    for (const student of students) {
      const existing = existingAttendance.find(
        (a) => a.studentId === student.id,
      );

      rowMap.set(student.id, {
        studentId: student.id,
        isPresent: existing?.isPresent ?? false,
        participationLevel: existing?.participationLevel ?? 0,
        behavior: existing?.behavior ?? "",
        cameraEnabled: existing?.cameraEnabled ?? false,
        homeworkDone: existing?.homeworkDone ?? false,
        specificRemarks: existing?.specificRemarks ?? "",
        technicalIssues: existing?.technicalIssues ?? "",
        isDirty: false,
      });
    }

    return rowMap;
  }, [students, existingAttendance]);

  const [rows, setRows] = useState<Map<string, AttendanceRow>>(initializeRows);
  const [autoSaving, setAutoSaving] = useState(false);
  const [lastSaveTime, setLastSaveTime] = useState<Date | null>(null);
  const [sessionStartTime] = useState<number>(() => performance.now());
  const [completionTime, setCompletionTime] = useState<number | null>(null);

  // Update rows when students or existing attendance changes
  useEffect(() => {
    setRows(initializeRows());
  }, [initializeRows]);

  // Track dirty rows for auto-save
  const dirtyRows = useMemo(() => {
    return Array.from(rows.values()).filter((row) => row.isDirty);
  }, [rows]);

  /**
   * Update a field for a specific student
   */
  const updateRow = useCallback(
    <K extends keyof AttendanceRow>(
      studentId: string,
      field: K,
      value: AttendanceRow[K],
    ) => {
      setRows((prev) => {
        const newRows = new Map(prev);
        const row = newRows.get(studentId);
        if (row) {
          newRows.set(studentId, {
            ...row,
            [field]: value,
            isDirty: true,
          });
        }
        return newRows;
      });
    },
    [],
  );

  /**
   * Bulk action: Mark all students as present
   */
  const markAllPresent = useCallback(() => {
    setRows((prev) => {
      const newRows = new Map(prev);
      for (const [studentId, row] of newRows) {
        newRows.set(studentId, {
          ...row,
          isPresent: true,
          isDirty: true,
        });
      }
      return newRows;
    });
    toast.success(`${students.length} élèves marqués présents`);
  }, [students.length]);

  /**
   * Bulk action: Mark all students as absent
   */
  const markAllAbsent = useCallback(() => {
    setRows((prev) => {
      const newRows = new Map(prev);
      for (const [studentId, row] of newRows) {
        newRows.set(studentId, {
          ...row,
          isPresent: false,
          isDirty: true,
        });
      }
      return newRows;
    });
    toast.success(`${students.length} élèves marqués absents`);
  }, [students.length]);

  /**
   * Save attendance data (auto-save or manual)
   */
  const saveAttendance = useCallback(
    async (showToast = true) => {
      const rowsToSave = Array.from(rows.values()).filter((row) => row.isDirty);

      if (rowsToSave.length === 0) {
        if (showToast) {
          toast.info("Aucune modification à enregistrer");
        }
        return;
      }

      setAutoSaving(true);

      try {
        const upsertRequest: AttendanceUpsertRequest = {
          items: rowsToSave.map((row) => mapToUpsertItem(row)),
        };

        const apiResponse = await upsertSessionAttendance(
          sessionId,
          upsertRequest,
        );
        const savedData = apiResponse.map(mapFromApiResponse);

        // Mark rows as clean
        setRows((prev) => {
          const newRows = new Map(prev);
          for (const row of rowsToSave) {
            const existing = newRows.get(row.studentId);
            if (existing) {
              newRows.set(row.studentId, {
                ...existing,
                isDirty: false,
              });
            }
          }
          return newRows;
        });

        setLastSaveTime(new Date());
        if (showToast) {
          toast.success(
            `${rowsToSave.length} élève(s) enregistré(s) avec succès`,
          );
        }

        onSave(savedData);
      } catch (error) {
        console.error("Failed to save attendance:", error);
        toast.error(
          "Erreur lors de l'enregistrement. Vos données sont conservées localement.",
        );
      } finally {
        setAutoSaving(false);
      }
    },
    [
      rows,
      sessionId,
      mapToUpsertItem,
      upsertSessionAttendance,
      mapFromApiResponse,
      onSave,
    ],
  );

  /**
   * Auto-save effect: debounced 10s save
   */
  useEffect(() => {
    if (dirtyRows.length === 0) return;

    const timerId = setTimeout(() => {
      saveAttendance(false);
    }, 10000); // 10 seconds

    return () => clearTimeout(timerId);
  }, [dirtyRows, saveAttendance]);

  /**
   * Final save and close
   */
  const handleSaveAndClose = async () => {
    // Calculate completion time
    const endTime = performance.now();
    const durationMs = endTime - sessionStartTime;
    const durationSeconds = Math.round(durationMs / 1000);
    setCompletionTime(durationSeconds);

    // Log performance metrics
    if (process.env.NODE_ENV !== "production") {
      console.log("[Performance] Attendance completion metrics:", {
        totalStudents: students.length,
        durationSeconds,
        targetSeconds: 120,
        withinTarget: durationSeconds <= 120,
        averageSecondsPerStudent: (durationSeconds / students.length).toFixed(
          2,
        ),
      });
    }

    // TODO: Send telemetry to analytics (when analytics pipeline exists)
    // sendTelemetry('attendance_completion', { duration: durationSeconds, studentCount: students.length });

    await saveAttendance(true);

    // Show completion toast with timing
    const emoji = durationSeconds <= 120 ? "🎉" : "⏱️";
    toast.success(
      `${emoji} Saisie terminée en ${durationSeconds}s (${students.length} élèves)`,
    );

    if (onCancel) {
      onCancel();
    }
  };

  // Calculate stats
  const stats = useMemo(() => {
    const rowArray = Array.from(rows.values());
    const presentCount = rowArray.filter((r) => r.isPresent).length;
    const evaluatedCount = rowArray.filter(
      (r) => r.isPresent && r.behavior && r.participationLevel > 0,
    ).length;

    return {
      total: students.length,
      present: presentCount,
      absent: students.length - presentCount,
      evaluated: evaluatedCount,
    };
  }, [rows, students.length]);

  return (
    <Card className="flex flex-col h-full">
      <CardHeader className="flex-shrink-0 border-b">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <Users className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h2 className="text-lg font-semibold">
                Saisie rapide des présences
              </h2>
              <p className="text-sm text-muted-foreground">
                {stats.evaluated}/{stats.total} élèves évalués • {stats.present}{" "}
                présents • {stats.absent} absents
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Auto-save indicator */}
            {autoSaving && (
              <Badge variant="secondary" className="animate-pulse">
                <Save className="h-3 w-3 mr-1" />
                Sauvegarde...
              </Badge>
            )}
            {lastSaveTime && !autoSaving && dirtyRows.length === 0 && (
              <Badge variant="outline" className="text-success">
                <CheckCircle2 className="h-3 w-3 mr-1" />
                Sauvegardé à {lastSaveTime.toLocaleTimeString("fr-FR")}
              </Badge>
            )}
            {dirtyRows.length > 0 && !autoSaving && (
              <Badge variant="secondary">
                {dirtyRows.length} modification(s) non sauvegardée(s)
              </Badge>
            )}
          </div>
        </div>

        {/* Bulk actions */}
        <div className="flex gap-2 mt-4">
          <Button
            variant="outline"
            size="sm"
            onClick={markAllPresent}
            className="flex-1"
          >
            <CheckSquare className="h-4 w-4 mr-2" />
            Marquer tous présents
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={markAllAbsent}
            className="flex-1"
          >
            <Square className="h-4 w-4 mr-2" />
            Marquer tous absents
          </Button>
        </div>
      </CardHeader>

      <CardContent className="flex-1 overflow-y-auto p-6">
        <div className="space-y-2">
          {/* Table header */}
          <div className="grid grid-cols-12 gap-2 pb-2 border-b font-semibold text-sm text-muted-foreground sticky top-0 bg-card z-10">
            <div className="col-span-2">Élève</div>
            <div className="col-span-1 text-center">Présent</div>
            <div className="col-span-2">Participation</div>
            <div className="col-span-2">Comportement</div>
            <div className="col-span-1 text-center">Caméra</div>
            <div className="col-span-1 text-center">Devoirs</div>
            <div className="col-span-3">Notes</div>
          </div>

          {/* Table rows */}
          {students.map((student, index) => {
            const row = rows.get(student.id);
            if (!row) return null;

            return (
              <div
                key={student.id}
                className="grid grid-cols-12 gap-2 items-center py-2 border-b hover:bg-muted/20 transition-colors"
              >
                {/* Student name */}
                <div className="col-span-2 font-medium text-sm truncate">
                  {student.firstName} {student.lastName}
                </div>

                {/* Present checkbox */}
                <div className="col-span-1 flex justify-center">
                  <input
                    type="checkbox"
                    checked={row.isPresent}
                    onChange={(e) =>
                      updateRow(student.id, "isPresent", e.target.checked)
                    }
                    className="h-4 w-4 rounded border-gray-300"
                    tabIndex={index * 8 + 1}
                  />
                </div>

                {/* Participation level */}
                <div className="col-span-2">
                  <Select
                    value={row.participationLevel.toString()}
                    onValueChange={(value) =>
                      updateRow(student.id, "participationLevel", Number(value))
                    }
                    disabled={!row.isPresent}
                  >
                    <SelectTrigger
                      className="h-8 text-xs"
                      tabIndex={index * 8 + 2}
                    >
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {PARTICIPATION_LEVELS.map((level) => (
                        <SelectItem
                          key={level.value}
                          value={level.value.toString()}
                        >
                          {level.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Behavior */}
                <div className="col-span-2">
                  <Select
                    value={row.behavior}
                    onValueChange={(value) =>
                      updateRow(student.id, "behavior", value)
                    }
                    disabled={!row.isPresent}
                  >
                    <SelectTrigger
                      className="h-8 text-xs"
                      tabIndex={index * 8 + 3}
                    >
                      <SelectValue placeholder="Sélectionner" />
                    </SelectTrigger>
                    <SelectContent>
                      {BEHAVIOR_OPTIONS.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Camera enabled */}
                <div className="col-span-1 flex justify-center">
                  <input
                    type="checkbox"
                    checked={row.cameraEnabled}
                    onChange={(e) =>
                      updateRow(student.id, "cameraEnabled", e.target.checked)
                    }
                    disabled={!row.isPresent}
                    className="h-4 w-4 rounded border-gray-300"
                    tabIndex={index * 8 + 4}
                  />
                </div>

                {/* Homework done */}
                <div className="col-span-1 flex justify-center">
                  <input
                    type="checkbox"
                    checked={row.homeworkDone}
                    onChange={(e) =>
                      updateRow(student.id, "homeworkDone", e.target.checked)
                    }
                    disabled={!row.isPresent}
                    className="h-4 w-4 rounded border-gray-300"
                    tabIndex={index * 8 + 5}
                  />
                </div>

                {/* Specific remarks */}
                <div className="col-span-3">
                  <Input
                    value={row.specificRemarks}
                    onChange={(e) =>
                      updateRow(student.id, "specificRemarks", e.target.value)
                    }
                    disabled={!row.isPresent}
                    placeholder="Remarques..."
                    className="h-8 text-xs"
                    tabIndex={index * 8 + 6}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>

      {/* Footer with action buttons */}
      <div className="flex-shrink-0 border-t p-4 flex items-center justify-between bg-muted/20">
        <div className="text-sm text-muted-foreground">
          <kbd className="px-2 py-1 text-xs border rounded bg-muted">Tab</kbd>{" "}
          pour naviguer •{" "}
          <kbd className="px-2 py-1 text-xs border rounded bg-muted">Enter</kbd>{" "}
          pour valider
        </div>

        <div className="flex gap-2">
          {onCancel && (
            <Button variant="outline" onClick={onCancel}>
              <X className="h-4 w-4 mr-2" />
              Annuler
            </Button>
          )}
          <Button onClick={handleSaveAndClose}>
            <Save className="h-4 w-4 mr-2" />
            Enregistrer et fermer
          </Button>
        </div>
      </div>
    </Card>
  );
}
