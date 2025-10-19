"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Card } from "@/components/atoms/card";
import { Button } from "@/components/atoms/button";
import { Input } from "@/components/atoms/input";
import { Textarea } from "@/components/atoms/textarea";
import { Badge } from "@/components/atoms/badge";
import { Label } from "@/components/atoms/label";
import { Checkbox } from "@/components/atoms/checkbox";
import { ExamGradeDisplay } from "@/components/atoms/exam-grade-display";
import { ExamStatisticsCards } from "@/components/molecules/exam-statistics-cards";
import { ExamExportDialog } from "@/components/organisms/exam-export-dialog";
import { ExamDetailedStatistics } from "@/components/organisms/exam-detailed-statistics";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/atoms/tabs";
import {
  Save,
  Users,
  UserCheck,
  UserX,
  AlertTriangle,
  CheckCircle,
  Download,
  FileText,
  BarChart3,
  Loader2,
} from "lucide-react";
import {
  useExamManagement,
  type StudentExamResultFormData,
} from "@/features/evaluations";
import { useNotationSystem } from "@/features/evaluations";
import {
  useRubricManagement,
  type RubricEvaluationData,
} from "@/features/evaluations";
import { RubricGradingInterface } from "@/components/organisms/rubric-grading-interface";
import {
  fetchStudentsForClass,
  fetchExamResults,
  saveExamResultsBatch,
  fetchExamStats,
  convertGradeDataToApiFormat,
  convertApiResultToEntity,
  type ExamStatsResponse,
} from "@/features/evaluations/api/exam-grading-service";
import type { Exam, Student, StudentExamResult } from "@/types/uml-entities";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export interface ExamGradingInterfaceProps {
  exam: Exam;
  className?: string;
}

export function ExamGradingInterface({
  exam,
  className,
}: ExamGradingInterfaceProps) {
  const [activeTab, setActiveTab] = useState("grading");
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(
    null,
  );
  const [gradeData, setGradeData] = useState<
    Record<string, StudentExamResultFormData>
  >({});
  const [rubricEvaluations, setRubricEvaluations] = useState<
    Record<string, Record<string, Record<string, number>>>
  >({});
  const [rubricComments, setRubricComments] = useState<Record<string, string>>(
    {},
  );
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showExportDialog, setShowExportDialog] = useState(false);
  const [classStudents, setClassStudents] = useState<Student[]>([]);
  const [examResults, setExamResults] = useState<StudentExamResult[]>([]);
  const [statistics, setStatistics] = useState<ExamStatsResponse | null>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const autoSaveTimerRef = useRef<NodeJS.Timeout | null>(null);

  const { getRubric } = useRubricManagement();
  const examRubric = exam.rubricId ? getRubric(exam.rubricId) : null;

  const { notationSystems, formatGrade, validateGrade } = useNotationSystem();
  const notationSystem = notationSystems.find(
    (ns) => ns.id === exam.notationSystemId,
  );

  // Load students and existing results from API
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        // Fetch students for this exam's class
        const students = await fetchStudentsForClass(exam.classId);
        setClassStudents(students);

        // Fetch existing results
        const resultsResponse = await fetchExamResults(exam.id);
        const convertedResults = resultsResponse.items.map((r) =>
          convertApiResultToEntity(r, exam.createdBy),
        );
        setExamResults(convertedResults);

        // Initialize grade data
        const initialData: Record<string, StudentExamResultFormData> = {};
        students.forEach((student) => {
          const existingResult = convertedResults.find(
            (result) => result.studentId === student.id,
          );

          initialData[student.id] = {
            studentId: student.id,
            pointsObtained: existingResult?.pointsObtained || 0,
            isAbsent: existingResult?.isAbsent || false,
            comments: existingResult?.comments || "",
          };
        });
        setGradeData(initialData);

        // Load statistics
        await loadStatistics();
      } catch (error) {
        console.error("Error loading exam grading data:", error);
        toast.error("Impossible de charger les données de l'examen.");
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [exam.id, exam.classId, exam.createdBy]);

  // Load statistics
  const loadStatistics = useCallback(async () => {
    try {
      const stats = await fetchExamStats(exam.id);
      setStatistics(stats);
    } catch (error) {
      console.error("Error loading statistics:", error);
    }
  }, [exam.id]);

  // Auto-save setup - triggers every 10 seconds if there are unsaved changes
  useEffect(() => {
    if (hasUnsavedChanges && !isSaving) {
      // Clear existing timer
      if (autoSaveTimerRef.current) {
        clearTimeout(autoSaveTimerRef.current);
      }

      // Set new timer for 10 seconds
      autoSaveTimerRef.current = setTimeout(() => {
        handleSaveAll(true); // true = auto-save mode
      }, 10000);
    }

    // Cleanup on unmount
    return () => {
      if (autoSaveTimerRef.current) {
        clearTimeout(autoSaveTimerRef.current);
      }
    };
  }, [hasUnsavedChanges, isSaving]);

  const handleGradeChange = (
    studentId: string,
    field: keyof StudentExamResultFormData,
    value: any,
  ) => {
    setGradeData((prev) => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        [field]: value,
      },
    }));
    setHasUnsavedChanges(true);
  };

  const handleSaveAll = async (isAutoSave = false) => {
    if (isSaving) return;

    setIsSaving(true);
    try {
      // Convert all grade data to API format
      const items = Object.values(gradeData).map((data) =>
        convertGradeDataToApiFormat(data),
      );

      // Save batch
      const response = await saveExamResultsBatch(exam.id, items);

      // Show success toast
      if (!isAutoSave) {
        toast.success(`${response.updated_count} résultat(s) enregistré(s)`);
      }

      // Mark as saved
      setHasUnsavedChanges(false);

      // Refresh statistics after save
      await loadStatistics();

      // Clear auto-save timer
      if (autoSaveTimerRef.current) {
        clearTimeout(autoSaveTimerRef.current);
        autoSaveTimerRef.current = null;
      }
    } catch (error: any) {
      console.error("Error saving exam results:", error);
      toast.error(
        error.message || "Une erreur est survenue lors de la sauvegarde",
      );
    } finally {
      setIsSaving(false);
    }
  };

  // Gestion des évaluations par grille
  const handleRubricEvaluationChange = (
    studentId: string,
    evaluation: RubricEvaluationData,
  ) => {
    setRubricEvaluations((prev) => ({
      ...prev,
      [studentId]: evaluation.evaluations,
    }));

    // Synchroniser avec les données de note traditionnelles
    setGradeData((prev) => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        pointsObtained: evaluation.totalScore,
      },
    }));
  };

  const handleRubricCommentsChange = (studentId: string, comments: string) => {
    setRubricComments((prev) => ({
      ...prev,
      [studentId]: comments,
    }));

    // Synchroniser avec les commentaires traditionnels
    setGradeData((prev) => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        comments,
      },
    }));
  };

  const validatePoints = (points: number): boolean => {
    if (!notationSystem) return true;
    return (
      points >= 0 &&
      points <= exam.totalPoints &&
      validateGrade(points, exam.notationSystemId)
    );
  };

  const getStudentStatus = (studentId: string) => {
    const data = gradeData[studentId];
    const existingResult = examResults.find(
      (result) => result.studentId === studentId,
    );

    if (data?.isAbsent) return "absent";
    if (existingResult) return "graded";
    return "pending";
  };

  // Calculate progress (X/Y students graded)
  const getProgressStats = () => {
    const total = classStudents.length;
    const graded = Object.values(gradeData).filter(
      (data) => !data.isAbsent && data.pointsObtained > 0,
    ).length;
    const absent = Object.values(gradeData).filter(
      (data) => data.isAbsent,
    ).length;
    return { total, graded, absent };
  };

  const progressStats = getProgressStats();

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "graded":
        return <CheckCircle className="w-4 h-4 text-chart-3" />;
      case "absent":
        return <UserX className="w-4 h-4 text-muted-foreground" />;
      case "pending":
      default:
        return <AlertTriangle className="w-4 h-4 text-chart-4" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "graded":
        return <Badge variant="default">Noté</Badge>;
      case "absent":
        return <Badge variant="outline">Absent</Badge>;
      case "pending":
      default:
        return <Badge variant="secondary">En attente</Badge>;
    }
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className={cn("space-y-6", className)}>
        <Card className="p-6">
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
            <span className="ml-3 text-muted-foreground">
              Chargement des données...
            </span>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className={cn("space-y-6", className)}>
      {/* En-tête de l'examen */}
      <Card className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold">{exam.title}</h1>
            <p className="text-muted-foreground">{exam.description}</p>
            <div className="flex items-center gap-4 mt-2 text-sm">
              <span>📅 {exam.examDate.toLocaleDateString("fr-FR")}</span>
              <span>⏱️ {exam.durationMinutes}min</span>
              <span>📊 {exam.totalPoints} points</span>
              <span>×{exam.coefficient}</span>
            </div>
          </div>

          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setShowExportDialog(true)}>
              <Download className="w-4 h-4 mr-2" />
              Exporter
            </Button>
            <Button
              onClick={() => handleSaveAll(false)}
              disabled={isSaving || !hasUnsavedChanges}
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Sauvegarde...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Tout sauvegarder
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Progress indicator */}
        <div className="mb-4 p-3 bg-muted/50 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-chart-3" />
              <span className="text-sm font-medium">
                Progression: {progressStats.graded}/{progressStats.total} élèves
                saisis
              </span>
              {progressStats.absent > 0 && (
                <Badge variant="outline" className="ml-2">
                  {progressStats.absent} absent(s)
                </Badge>
              )}
            </div>
            {hasUnsavedChanges && (
              <Badge variant="secondary" className="animate-pulse">
                Non sauvegardé
              </Badge>
            )}
          </div>
        </div>

        {/* Statistiques rapides */}
        {statistics && (
          <ExamStatisticsCards
            statistics={{
              totalStudents: statistics.total_students,
              submittedCount: statistics.submitted_count,
              absentCount: statistics.absent_count,
              averageGrade: statistics.avg_points,
              medianGrade: statistics.median_points,
              minGrade: statistics.min_points,
              maxGrade: statistics.max_points,
              passRate: statistics.pass_rate,
            }}
          />
        )}
      </Card>

      {/* Interface de correction */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="grading" className="flex items-center gap-2">
            <FileText className="w-4 h-4" />
            Correction
          </TabsTrigger>
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            Vue d'ensemble
          </TabsTrigger>
          <TabsTrigger value="statistics" className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4" />
            Statistiques
          </TabsTrigger>
        </TabsList>

        <TabsContent value="grading" className="space-y-4">
          <div className="grid gap-6 lg:grid-cols-3">
            {/* Liste des étudiants */}
            <Card className="p-4">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Users className="w-4 h-4" />
                Étudiants ({classStudents.length})
              </h3>

              <div className="space-y-2 max-h-96 overflow-y-auto">
                {classStudents.map((student) => {
                  const status = getStudentStatus(student.id);
                  const isSelected = selectedStudentId === student.id;

                  return (
                    <div
                      key={student.id}
                      className={cn(
                        "flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-colors",
                        isSelected && "border-primary bg-primary/5",
                        !isSelected && "hover:bg-muted/50",
                      )}
                      onClick={() => setSelectedStudentId(student.id)}
                    >
                      <div className="flex items-center gap-3">
                        {getStatusIcon(status)}
                        <div>
                          <div className="font-medium">
                            {student.firstName} {student.lastName}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {student.id}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {status === "graded" &&
                          !gradeData[student.id]?.isAbsent && (
                            <ExamGradeDisplay
                              grade={gradeData[student.id]?.pointsObtained || 0}
                              isAbsent={false}
                              notationSystemId={exam.notationSystemId}
                              showBadge={false}
                              className="text-sm"
                            />
                          )}
                        {getStatusBadge(status)}
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>

            {/* Formulaire de notation */}
            <Card className="p-6 lg:col-span-2">
              {selectedStudentId ? (
                (() => {
                  const student = classStudents.find(
                    (s) => s.id === selectedStudentId,
                  );
                  const data = gradeData[selectedStudentId];

                  if (!student || !data) return null;

                  return (
                    <div className="space-y-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-lg font-semibold">
                            {student.firstName} {student.lastName}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            Correction de l'examen
                          </p>
                        </div>

                        <Button
                          onClick={() => handleSaveAll(false)}
                          disabled={isSaving}
                        >
                          <Save className="w-4 h-4 mr-2" />
                          Sauvegarder
                        </Button>
                      </div>

                      {/* Option absence */}
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id={`absent-${selectedStudentId}`}
                          checked={data.isAbsent}
                          onCheckedChange={(checked) =>
                            handleGradeChange(
                              selectedStudentId,
                              "isAbsent",
                              checked,
                            )
                          }
                        />
                        <Label htmlFor={`absent-${selectedStudentId}`}>
                          Élève absent
                        </Label>
                      </div>

                      {!data.isAbsent && (
                        <>
                          {examRubric ? (
                            /* Interface de notation par grille */
                            <RubricGradingInterface
                              rubric={examRubric}
                              student={student}
                              onEvaluationChange={(evaluation) =>
                                handleRubricEvaluationChange(
                                  selectedStudentId,
                                  evaluation,
                                )
                              }
                              onCommentsChange={(comments) =>
                                handleRubricCommentsChange(
                                  selectedStudentId,
                                  comments,
                                )
                              }
                              initialEvaluation={
                                rubricEvaluations[selectedStudentId] || {}
                              }
                              initialComments={
                                rubricComments[selectedStudentId] || ""
                              }
                            />
                          ) : (
                            <>
                              {/* Note traditionnelle */}
                              <div className="space-y-2">
                                <Label htmlFor={`points-${selectedStudentId}`}>
                                  Note obtenue (sur {exam.totalPoints} points)
                                </Label>
                                <div className="flex items-center gap-4">
                                  <Input
                                    id={`points-${selectedStudentId}`}
                                    type="number"
                                    min="0"
                                    max={exam.totalPoints}
                                    step="0.5"
                                    value={data.pointsObtained}
                                    onChange={(e) =>
                                      handleGradeChange(
                                        selectedStudentId,
                                        "pointsObtained",
                                        parseFloat(e.target.value) || 0,
                                      )
                                    }
                                    className={cn(
                                      "w-32",
                                      !validatePoints(data.pointsObtained) &&
                                        "border-destructive",
                                    )}
                                  />

                                  {notationSystem && (
                                    <div className="text-sm text-muted-foreground">
                                      ={" "}
                                      {formatGrade(
                                        data.pointsObtained,
                                        notationSystem,
                                        "fr-FR",
                                      )}
                                    </div>
                                  )}

                                  <div className="text-sm text-muted-foreground">
                                    (
                                    {(
                                      (data.pointsObtained / exam.totalPoints) *
                                      100
                                    ).toFixed(1)}
                                    %)
                                  </div>
                                </div>
                              </div>

                              {/* Aperçu de la note */}
                              <div className="p-4 bg-muted/50 rounded-lg">
                                <div className="flex items-center gap-4">
                                  <span className="text-sm font-medium">
                                    Aperçu:
                                  </span>
                                  <ExamGradeDisplay
                                    grade={data.pointsObtained}
                                    isAbsent={false}
                                    notationSystemId={exam.notationSystemId}
                                    showBadge={true}
                                  />
                                </div>
                              </div>

                              {/* Commentaires traditionnels */}
                              <div className="space-y-2">
                                <Label
                                  htmlFor={`comments-${selectedStudentId}`}
                                >
                                  Commentaires
                                </Label>
                                <Textarea
                                  id={`comments-${selectedStudentId}`}
                                  value={data.comments}
                                  onChange={(e) =>
                                    handleGradeChange(
                                      selectedStudentId,
                                      "comments",
                                      e.target.value,
                                    )
                                  }
                                  placeholder="Commentaires sur la copie, conseils d'amélioration..."
                                  rows={4}
                                />
                              </div>
                            </>
                          )}
                        </>
                      )}
                    </div>
                  );
                })()
              ) : (
                <div className="flex items-center justify-center h-64 text-center text-muted-foreground">
                  <div>
                    <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <h3 className="text-lg font-medium mb-2">
                      Sélectionnez un étudiant
                    </h3>
                    <p className="text-sm">
                      Choisissez un étudiant dans la liste pour commencer la
                      correction
                    </p>
                  </div>
                </div>
              )}
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="overview" className="space-y-4">
          {/* Tableau récapitulatif */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">
              Récapitulatif des notes
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-2">Étudiant</th>
                    <th className="text-center p-2">Statut</th>
                    <th className="text-center p-2">Note</th>
                    <th className="text-center p-2">%</th>
                    <th className="text-left p-2">Commentaires</th>
                  </tr>
                </thead>
                <tbody>
                  {classStudents.map((student) => {
                    const data = gradeData[student.id];
                    const status = getStudentStatus(student.id);

                    return (
                      <tr
                        key={student.id}
                        className="border-b hover:bg-muted/50"
                      >
                        <td className="p-2">
                          <div className="font-medium">
                            {student.firstName} {student.lastName}
                          </div>
                        </td>
                        <td className="p-2 text-center">
                          {getStatusBadge(status)}
                        </td>
                        <td className="p-2 text-center">
                          {data && !data.isAbsent ? (
                            <ExamGradeDisplay
                              grade={data.pointsObtained}
                              isAbsent={false}
                              notationSystemId={exam.notationSystemId}
                              showBadge={false}
                            />
                          ) : (
                            <span className="text-muted-foreground">-</span>
                          )}
                        </td>
                        <td className="p-2 text-center">
                          {data && !data.isAbsent ? (
                            <span className="text-sm text-muted-foreground">
                              {(
                                (data.pointsObtained / exam.totalPoints) *
                                100
                              ).toFixed(1)}
                              %
                            </span>
                          ) : (
                            <span className="text-muted-foreground">-</span>
                          )}
                        </td>
                        <td className="p-2">
                          <span className="text-sm text-muted-foreground">
                            {data?.comments
                              ? data.comments.length > 50
                                ? data.comments.substring(0, 50) + "..."
                                : data.comments
                              : "-"}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="statistics" className="space-y-4">
          <ExamDetailedStatistics exam={exam} />
        </TabsContent>
      </Tabs>

      {/* Dialog d'export */}
      <ExamExportDialog
        isOpen={showExportDialog}
        onClose={() => setShowExportDialog(false)}
        exam={exam}
      />
    </div>
  );
}
