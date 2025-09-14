"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/molecules/card";
import { Badge } from "@/components/atoms/badge";
import { Button } from "@/components/atoms/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/atoms/collapsible";
import {
  ChevronDown,
  ChevronRight,
  Scale,
  Target,
  Trophy,
  MessageSquare,
  BarChart3,
} from "lucide-react";
import { useRubricManagement } from "@/hooks/use-rubric-management";
import type { StudentExamResult, Exam, Subject } from "@/types/uml-entities";
import type { RubricSection } from "@/data/mock-rubrics";

export interface RubricResultDisplayProps {
  result: StudentExamResult;
  exam: Exam;
  subject?: Subject;
  rubricEvaluations?: Record<string, Record<string, number>>;
  className?: string;
  compact?: boolean;
}

export function RubricResultDisplay({
  result,
  exam,
  subject,
  rubricEvaluations = {},
  className = "",
  compact = false,
}: RubricResultDisplayProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const { getRubric } = useRubricManagement();

  const rubric = exam.rubricId ? getRubric(exam.rubricId) : null;

  if (!rubric) {
    // Fallback pour les examens sans grille
    return (
      <div className={`p-3 bg-muted/20 hover:bg-muted/40 rounded-lg transition-all duration-200 ${className}`}>
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
          <div className="flex items-center gap-2">
            {result.isAbsent ? (
              <Badge variant="destructive" className="text-xs">
                Absent
              </Badge>
            ) : (
              <>
                <div className="text-right">
                  <div className="text-sm font-bold text-foreground">
                    {result.gradeDisplay}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {result.pointsObtained}/{exam.totalPoints}
                  </div>
                </div>
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
              </>
            )}
          </div>
        </div>
        {result.comments && (
          <div className="mt-2 text-xs text-muted-foreground p-2 bg-muted/30 rounded">
            {result.comments}
          </div>
        )}
      </div>
    );
  }

  const sections = rubric.sections as Record<string, RubricSection>;
  const hasEvaluations = Object.keys(rubricEvaluations).length > 0;

  return (
    <Card className={`${className}`}>
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

              <div className="flex items-center gap-2">
                {result.isAbsent ? (
                  <Badge variant="destructive" className="text-xs">
                    Absent
                  </Badge>
                ) : (
                  <>
                    <div className="text-right">
                      <div className="text-sm font-bold text-foreground">
                        {result.gradeDisplay}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {result.pointsObtained} pts
                      </div>
                    </div>
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
                  </>
                )}
              </div>
            </div>
          </CardHeader>
        </CollapsibleTrigger>

        <CollapsibleContent>
          <CardContent className="pt-0">
            {result.isAbsent ? (
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
                {/* Détail par sections */}
                {Object.values(sections).map((section) => {
                  const sectionEvaluations = rubricEvaluations[section.id] || {};
                  const sectionScore = Object.values(sectionEvaluations).reduce((sum, points) => sum + points, 0);
                  const sectionMaxScore = section.criteria.reduce((sum, criterion) => {
                    return sum + Math.max(...criterion.levels.map(level => level.points));
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
                          const maxPoints = Math.max(...criterion.levels.map(level => level.points));
                          const level = criterion.levels.find(l => l.points === points);

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

                {/* Commentaires généraux */}
                {result.comments && (
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
                <Target className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">Évaluation par grille - Détails non disponibles</p>
                <p className="text-xs mt-1">Les critères détaillés n'ont pas été sauvegardés</p>
                {result.comments && (
                  <div className="mt-3 text-xs p-2 bg-muted/30 rounded">
                    {result.comments}
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
}