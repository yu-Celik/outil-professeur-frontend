"use client";

import { useState, useEffect, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/molecules/card";
import { Button } from "@/components/atoms/button";
import { Badge } from "@/components/atoms/badge";
import { Label } from "@/components/atoms/label";
import { Textarea } from "@/components/atoms/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/atoms/radio-group";
import {
  Scale,
  Target,
  Check,
  AlertTriangle,
  Calculator,
  BookOpen,
} from "lucide-react";
import { useRubricManagement, type RubricEvaluationData } from "@/hooks/use-rubric-management";
import type { Rubric, Student } from "@/types/uml-entities";
import type { RubricSection, RubricCriterion, RubricLevel } from "@/data/mock-rubrics";

export interface RubricGradingInterfaceProps {
  rubric: Rubric;
  student: Student;
  onEvaluationChange?: (evaluation: RubricEvaluationData) => void;
  onCommentsChange?: (comments: string) => void;
  initialEvaluation?: Record<string, Record<string, number>>;
  initialComments?: string;
  className?: string;
}

export function RubricGradingInterface({
  rubric,
  student,
  onEvaluationChange,
  onCommentsChange,
  initialEvaluation = {},
  initialComments = "",
  className = "",
}: RubricGradingInterfaceProps) {
  const [evaluations, setEvaluations] = useState<Record<string, Record<string, number>>>(initialEvaluation);
  const [comments, setComments] = useState(initialComments);
  const { evaluateWithRubric } = useRubricManagement();

  const sections = rubric.sections as Record<string, RubricSection>;

  // Calculer les résultats en temps réel
  const evaluationResult = useMemo(() => {
    return evaluateWithRubric(rubric.id, evaluations);
  }, [rubric.id, evaluations, evaluateWithRubric]);

  // Notifier les changements
  useEffect(() => {
    if (evaluationResult) {
      onEvaluationChange?.(evaluationResult);
    }
  }, [evaluationResult, onEvaluationChange]);

  useEffect(() => {
    onCommentsChange?.(comments);
  }, [comments, onCommentsChange]);

  const handleCriterionChange = (sectionId: string, criterionId: string, points: number) => {
    setEvaluations(prev => ({
      ...prev,
      [sectionId]: {
        ...prev[sectionId],
        [criterionId]: points,
      },
    }));
  };

  const getSectionScore = (sectionId: string): number => {
    const sectionEvals = evaluations[sectionId] || {};
    return Object.values(sectionEvals).reduce((sum, points) => sum + points, 0);
  };

  const getSectionMaxScore = (section: RubricSection): number => {
    return section.criteria.reduce((sum, criterion) => {
      return sum + Math.max(...criterion.levels.map(level => level.points));
    }, 0);
  };

  const getCompletionStatus = (sectionId: string): "complete" | "partial" | "empty" => {
    const section = sections[sectionId];
    const sectionEvals = evaluations[sectionId] || {};
    const evaluatedCount = Object.keys(sectionEvals).length;
    const totalCount = section.criteria.length;

    if (evaluatedCount === 0) return "empty";
    if (evaluatedCount === totalCount) return "complete";
    return "partial";
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* En-tête avec informations de l'élève */}
      <Card>
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg">
                Évaluation de {student.firstName} {student.lastName}
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Grille : {rubric.name}
              </p>
            </div>

            {/* Score total */}
            {evaluationResult && (
              <div className="text-right">
                <div className="text-2xl font-bold text-primary">
                  {evaluationResult.totalScore}/{evaluationResult.maxScore}
                </div>
                <div className="text-sm text-muted-foreground">
                  {evaluationResult.percentage}%
                </div>
              </div>
            )}
          </div>
        </CardHeader>
      </Card>

      {/* Sections de la grille */}
      <div className="space-y-4">
        {Object.values(sections).map((section) => {
          const status = getCompletionStatus(section.id);
          const sectionScore = getSectionScore(section.id);
          const sectionMaxScore = getSectionMaxScore(section);

          return (
            <Card key={section.id} className="overflow-hidden">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-2 h-8 rounded-full ${
                      status === "complete"
                        ? "bg-green-500"
                        : status === "partial"
                        ? "bg-yellow-500"
                        : "bg-gray-300"
                    }`} />
                    <div>
                      <CardTitle className="text-base">{section.name}</CardTitle>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline" className="text-xs">
                          {section.weight}%
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {section.criteria.length} critère{section.criteria.length > 1 ? "s" : ""}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-lg font-semibold">
                      {sectionScore}/{sectionMaxScore}
                    </div>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      {status === "complete" && (
                        <>
                          <Check className="h-3 w-3 text-green-500" />
                          Complet
                        </>
                      )}
                      {status === "partial" && (
                        <>
                          <AlertTriangle className="h-3 w-3 text-yellow-500" />
                          Partiel
                        </>
                      )}
                      {status === "empty" && (
                        <>
                          <Target className="h-3 w-3 text-gray-400" />
                          Non évalué
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                {section.criteria.map((criterion) => (
                  <RubricCriterionEvaluation
                    key={criterion.id}
                    sectionId={section.id}
                    criterion={criterion}
                    selectedValue={evaluations[section.id]?.[criterion.id]}
                    onValueChange={(points) =>
                      handleCriterionChange(section.id, criterion.id, points)
                    }
                  />
                ))}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Commentaires généraux */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <BookOpen className="h-4 w-4" />
            Commentaires généraux
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            value={comments}
            onChange={(e) => setComments(e.target.value)}
            placeholder="Ajouter des commentaires sur l'évaluation globale..."
            rows={4}
            className="resize-none"
          />
        </CardContent>
      </Card>

      {/* Résumé */}
      {evaluationResult && (
        <Card className="border-primary/20 bg-primary/5">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Calculator className="h-5 w-5 text-primary" />
                <div>
                  <div className="font-medium">Score final</div>
                  <div className="text-sm text-muted-foreground">
                    Basé sur {Object.keys(sections).length} sections évaluées
                  </div>
                </div>
              </div>

              <div className="text-right">
                <div className="text-xl font-bold text-primary">
                  {evaluationResult.totalScore} / {evaluationResult.maxScore} pts
                </div>
                <div className="text-sm font-medium">
                  {evaluationResult.percentage}%
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

// Composant pour évaluer un critère individuel
interface RubricCriterionEvaluationProps {
  sectionId: string;
  criterion: RubricCriterion;
  selectedValue?: number;
  onValueChange: (points: number) => void;
}

function RubricCriterionEvaluation({
  sectionId,
  criterion,
  selectedValue,
  onValueChange,
}: RubricCriterionEvaluationProps) {
  return (
    <div className="border rounded-lg p-4 space-y-3">
      <div>
        <Label className="text-sm font-medium">{criterion.name}</Label>
        {criterion.description && (
          <p className="text-xs text-muted-foreground mt-1">
            {criterion.description}
          </p>
        )}
      </div>

      <RadioGroup
        value={selectedValue?.toString() || ""}
        onValueChange={(value) => onValueChange(parseFloat(value))}
      >
        <div className="grid gap-2">
          {criterion.levels.map((level) => (
            <div key={level.id} className="flex items-center space-x-3 p-2 rounded border hover:bg-muted/50">
              <RadioGroupItem
                value={level.points.toString()}
                id={`${sectionId}-${criterion.id}-${level.id}`}
              />
              <Label
                htmlFor={`${sectionId}-${criterion.id}-${level.id}`}
                className="flex-1 cursor-pointer"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-medium text-sm">{level.name}</span>
                    {level.description && (
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {level.description}
                      </p>
                    )}
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {level.points} pt{level.points !== 1 ? "s" : ""}
                  </Badge>
                </div>
              </Label>
            </div>
          ))}
        </div>
      </RadioGroup>
    </div>
  );
}