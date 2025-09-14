"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/molecules/card";
import { Badge } from "@/components/atoms/badge";
import { Button } from "@/components/atoms/button";
import { InlineResultEditor } from "@/components/molecules/inline-result-editor";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/atoms/collapsible";
import {
  ChevronDown,
  ChevronRight,
  Scale,
  Trophy,
  MessageSquare,
  BarChart3,
  Edit,
  History,
} from "lucide-react";
import { useRubricManagement } from "@/hooks/use-rubric-management";
import { useNotationSystem } from "@/hooks/use-notation-system";
import { useGradeManagement } from "@/hooks/use-grade-management";
import type { StudentExamResult, Exam, Subject, Student } from "@/types/uml-entities";
import type { RubricSection } from "@/data/mock-rubrics";

interface EditableResultDisplayProps {
  result?: StudentExamResult;
  exam: Exam;
  student: Student;
  subject?: Subject;
  rubricEvaluations?: Record<string, Record<string, number>>;
  className?: string;
  canEdit?: boolean;
  onSave?: (data: Partial<StudentExamResult>) => void;
}

export function EditableResultDisplay({
  result,
  exam,
  student,
  subject,
  rubricEvaluations = {},
  className = "",
  canEdit = false,
  onSave,
}: EditableResultDisplayProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const { getRubric } = useRubricManagement();
  const { defaultSystem, loading } = useNotationSystem();
  const { saveGrade, calculateStatistics } = useGradeManagement("current-teacher");

  const rubric = exam.rubricId ? getRubric(exam.rubricId) : null;

  // Show loading state while notation system loads
  if (loading) {
    return (
      <div className={`p-3 bg-muted/20 rounded-lg ${className}`}>
        <div className="text-center text-muted-foreground">
          <p className="text-sm">Chargement...</p>
        </div>
      </div>
    );
  }

  // Early return if no notation system available
  if (!defaultSystem) {
    return (
      <div className={`p-3 bg-muted/20 rounded-lg ${className}`}>
        <div className="text-center text-muted-foreground">
          <p className="text-sm">Système de notation non disponible</p>
        </div>
      </div>
    );
  }

  const notationSystem = defaultSystem;

  const handleSave = async (data: Partial<StudentExamResult>) => {
    if (onSave) {
      onSave(data);
    } else {
      // Default save behavior
      await saveGrade(student.id, exam.id, data);
    }
  };

  const getGradeColorClass = (grade: number | undefined) => {
    if (!grade) return "text-muted-foreground";
    if (grade >= 16) return "text-green-600";
    if (grade >= 14) return "text-blue-600";
    if (grade >= 12) return "text-orange-600";
    if (grade >= 10) return "text-yellow-600";
    return "text-red-600";
  };

  if (!rubric) {
    // Simple result display without rubric
    return (
      <div className={`group p-3 bg-muted/20 hover:bg-muted/30 rounded-lg transition-all duration-200 ${className}`}>
        <div className="flex items-center justify-between">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <Trophy className="h-3 w-3 text-primary" />
              <span className="text-sm font-medium text-foreground truncate">
                {exam.title}
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span>{subject?.name || "Matière"}</span>
              <div className="h-1 w-1 rounded-full bg-muted-foreground/30" />
              <span>{new Date(exam.examDate).toLocaleDateString("fr-FR")}</span>
              <div className="h-1 w-1 rounded-full bg-muted-foreground/30" />
              <span>{exam.examType}</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Grade Display/Editor */}
            {canEdit ? (
              <InlineResultEditor
                result={result}
                exam={exam}
                student={student}
                notationSystem={notationSystem}
                onSave={handleSave}
                canEdit={canEdit}
              />
            ) : (
              <div className="text-right">
                {result?.isAbsent ? (
                  <Badge variant="destructive" className="text-xs">
                    Absent
                  </Badge>
                ) : (
                  <>
                    <div className={`text-sm font-bold ${getGradeColorClass(result?.grade)}`}>
                      {result?.gradeDisplay || "—"}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {result?.pointsObtained || 0}/{exam.totalPoints}
                    </div>
                  </>
                )}
              </div>
            )}

            {/* Result Status Badge */}
            {result && !result.isAbsent && (
              <Badge
                variant={result.grade >= 10 ? "default" : "destructive"}
                className={`text-xs ${
                  result.grade >= 10
                    ? "bg-success text-success-foreground"
                    : ""
                }`}
              >
                {result.grade >= 10 ? "Réussi" : "Échoué"}
              </Badge>
            )}
          </div>
        </div>

        {/* Comments */}
        {result?.comments && (
          <div className="mt-2 text-xs text-muted-foreground p-2 bg-muted/30 rounded">
            {result.comments}
          </div>
        )}

        {/* Edit History Indicator */}
        {canEdit && result && (
          <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
            <span>
              Modifié le {new Date(result.markedAt).toLocaleDateString("fr-FR")}
            </span>
            <Button variant="ghost" size="sm" className="h-5 px-1 opacity-0 group-hover:opacity-100">
              <History className="h-3 w-3" />
            </Button>
          </div>
        )}
      </div>
    );
  }

  // Rubric-based result display
  const sections = rubric.sections as Record<string, RubricSection>;
  const hasEvaluations = Object.keys(rubricEvaluations).length > 0;

  return (
    <Card className={`group ${className}`}>
      <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
        <CollapsibleTrigger asChild>
          <CardHeader className="pb-3 cursor-pointer hover:bg-muted/30 transition-colors">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                  {isExpanded ? (
                    <ChevronDown className="h-3 w-3" />
                  ) : (
                    <ChevronRight className="h-3 w-3" />
                  )}
                </Button>
                <div className="flex-1 min-w-0">
                  <CardTitle className="text-sm font-medium truncate">
                    {exam.title}
                  </CardTitle>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                    <Scale className="h-3 w-3" />
                    <span>{rubric.name}</span>
                    <div className="h-1 w-1 rounded-full bg-muted-foreground/30" />
                    <span>{subject?.name}</span>
                    <div className="h-1 w-1 rounded-full bg-muted-foreground/30" />
                    <span>{new Date(exam.examDate).toLocaleDateString("fr-FR")}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                {/* Grade Display/Editor */}
                {canEdit ? (
                  <InlineResultEditor
                    result={result}
                    exam={exam}
                    student={student}
                    notationSystem={notationSystem}
                    onSave={handleSave}
                    canEdit={canEdit}
                  />
                ) : (
                  <div className="text-right">
                    {result?.isAbsent ? (
                      <Badge variant="destructive" className="text-xs">
                        Absent
                      </Badge>
                    ) : (
                      <>
                        <div className={`text-sm font-bold ${getGradeColorClass(result?.grade)}`}>
                          {result?.gradeDisplay || "—"}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {result?.pointsObtained || 0} pts
                        </div>
                      </>
                    )}
                  </div>
                )}

                {/* Result Status Badge */}
                {result && !result.isAbsent && (
                  <Badge
                    variant={result.grade >= 10 ? "default" : "destructive"}
                    className={`text-xs ${
                      result.grade >= 10
                        ? "bg-success text-success-foreground"
                        : ""
                    }`}
                  >
                    {result.grade >= 10 ? "Réussi" : "Échoué"}
                  </Badge>
                )}
              </div>
            </div>
          </CardHeader>
        </CollapsibleTrigger>

        <CollapsibleContent>
          <CardContent className="pt-0">
            {result?.isAbsent ? (
              <div className="text-center py-4 text-muted-foreground">
                <MessageSquare className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">Élève absent lors de cette évaluation</p>
                {result.comments && (
                  <div className="mt-2 text-xs p-2 bg-muted/30 rounded">
                    {result.comments}
                  </div>
                )}
              </div>
            ) : hasEvaluations ? (
              <div className="space-y-4">
                {/* Detailed rubric sections */}
                {Object.values(sections).map((section) => {
                  const sectionEvaluations = rubricEvaluations[section.id] || {};
                  const sectionScore = Object.values(sectionEvaluations).reduce(
                    (sum, points) => sum + points,
                    0
                  );
                  const sectionMaxScore = section.criteria.reduce((sum, criterion) => {
                    return sum + Math.max(...criterion.levels.map((level) => level.points));
                  }, 0);

                  return (
                    <div key={section.id} className="border rounded-lg p-3">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <BarChart3 className="h-4 w-4 text-primary" />
                          <span className="font-medium text-sm">{section.name}</span>
                          <Badge variant="outline" className="text-xs">
                            {section.weight}%
                          </Badge>
                        </div>
                        <div className="text-sm font-semibold">
                          {sectionScore}/{sectionMaxScore}
                        </div>
                      </div>

                      <div className="grid gap-2">
                        {section.criteria.map((criterion) => {
                          const points = sectionEvaluations[criterion.id] || 0;
                          const maxPoints = Math.max(
                            ...criterion.levels.map((level) => level.points)
                          );
                          const level = criterion.levels.find((l) => l.points === points);

                          return (
                            <div key={criterion.id} className="bg-muted/30 rounded p-2">
                              <div className="flex items-center justify-between">
                                <div className="flex-1">
                                  <div className="font-medium text-xs">{criterion.name}</div>
                                  {level && (
                                    <div className="text-xs text-muted-foreground mt-1">
                                      {level.name} - {level.description}
                                    </div>
                                  )}
                                </div>
                                <Badge variant="outline" className="text-xs">
                                  {points}/{maxPoints}
                                </Badge>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}

                {/* General comments */}
                {result?.comments && (
                  <div className="border rounded-lg p-3">
                    <div className="flex items-center gap-2 mb-2">
                      <MessageSquare className="h-4 w-4 text-primary" />
                      <span className="font-medium text-sm">Commentaires</span>
                    </div>
                    <div className="text-xs text-muted-foreground p-2 bg-muted/30 rounded">
                      {result.comments}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-4 text-muted-foreground">
                <BarChart3 className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">Évaluation par grille - Détails non disponibles</p>
                <p className="text-xs mt-1">Les critères détaillés n'ont pas été sauvegardés</p>
                {result?.comments && (
                  <div className="mt-3 text-xs p-2 bg-muted/30 rounded">
                    {result.comments}
                  </div>
                )}
              </div>
            )}

            {/* Edit History */}
            {canEdit && result && (
              <div className="mt-4 pt-3 border-t flex items-center justify-between text-xs text-muted-foreground">
                <span>
                  Modifié le {new Date(result.markedAt).toLocaleDateString("fr-FR")}
                </span>
                <Button variant="ghost" size="sm" className="h-5 px-1">
                  <History className="h-3 w-3 mr-1" />
                  Historique
                </Button>
              </div>
            )}
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
}