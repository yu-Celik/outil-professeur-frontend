"use client";

import {
  Activity,
  AlertTriangle,
  Award,
  Brain,
  CheckCircle,
  Clock,
  Eye,
  Lightbulb,
  RefreshCw,
  Target,
  TrendingDown,
  TrendingUp,
  Users,
  Zap,
} from "lucide-react";
import { Badge } from "@/components/atoms/badge";
import { Button } from "@/components/atoms/button";
import { Card, CardContent, CardHeader } from "@/components/molecules/card";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/atoms/tabs";
import { useStudentAnalytics } from "@/features/students/hooks";
import type { Student } from "@/types/uml-entities";

interface StudentAnalysisPanelProps {
  student: Student;
  academicPeriodId: string;
  className?: string;
}

export function StudentAnalysisPanel({
  student,
  academicPeriodId,
  className = "",
}: StudentAnalysisPanelProps) {
  const {
    behavioralAnalysis,
    behavioralTrends,
    behavioralAlerts,
    academicAnalysis,
    academicProgress,
    academicRisks,
    recommendations,
    loading,
    error,
    lastAnalyzedAt,
    dataQuality,
    analyzeAll,
    refresh,
  } = useStudentAnalytics({
    studentId: student.id,
    academicPeriodId,
  });

  const getSeverityColor = (severity: "low" | "medium" | "high") => {
    switch (severity) {
      case "high":
        return "destructive";
      case "medium":
        return "warning";
      case "low":
        return "secondary";
      default:
        return "secondary";
    }
  };

  const getPriorityIcon = (priority: "low" | "medium" | "high") => {
    switch (priority) {
      case "high":
        return <AlertTriangle className="h-4 w-4 text-destructive" />;
      case "medium":
        return <Clock className="h-4 w-4 text-warning" />;
      case "low":
        return <CheckCircle className="h-4 w-4 text-muted-foreground" />;
      default:
        return <CheckCircle className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getTrendIcon = (direction: "up" | "down" | "stable") => {
    switch (direction) {
      case "up":
        return <TrendingUp className="h-4 w-4 text-success" />;
      case "down":
        return <TrendingDown className="h-4 w-4 text-destructive" />;
      case "stable":
        return <Activity className="h-4 w-4 text-muted-foreground" />;
      default:
        return <Activity className="h-4 w-4 text-muted-foreground" />;
    }
  };

  if (loading) {
    return (
      <Card className={className}>
        <CardContent className="p-6">
          <div className="flex items-center justify-center space-x-2">
            <RefreshCw className="h-5 w-5 animate-spin text-primary" />
            <span className="text-sm text-muted-foreground">
              Analyse en cours...
            </span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className={className}>
        <CardContent className="p-6">
          <div className="text-center">
            <AlertTriangle className="h-12 w-12 mx-auto mb-4 text-destructive opacity-50" />
            <p className="text-sm font-medium mb-2 text-destructive">
              Erreur lors de l'analyse
            </p>
            <p className="text-xs text-muted-foreground mb-4">{error}</p>
            <Button variant="outline" size="sm" onClick={refresh}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Réessayer
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!dataQuality.hasEnoughData) {
    return (
      <Card className={className}>
        <CardContent className="p-6">
          <div className="text-center">
            <Eye className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
            <p className="text-sm font-medium mb-2">Données insuffisantes</p>
            <p className="text-xs text-muted-foreground mb-4">
              Au moins 5 participations ou 3 évaluations sont nécessaires pour
              générer une analyse fiable.
            </p>
            <div className="text-xs text-muted-foreground">
              Actuellement: {dataQuality.participationCount} participations,{" "}
              {dataQuality.examCount} évaluations
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Brain className="h-4 w-4 text-primary" />
            <h4 className="font-semibold">Analyse Automatique</h4>
            <Badge variant="outline" className="text-xs">
              Confiance: {Math.round(dataQuality.confidenceScore * 100)}%
            </Badge>
          </div>
          <div className="flex items-center gap-2">
            {lastAnalyzedAt && (
              <span className="text-xs text-muted-foreground">
                Mise à jour: {lastAnalyzedAt.toLocaleDateString("fr-FR")}
              </span>
            )}
            <Button variant="ghost" size="sm" onClick={analyzeAll}>
              <RefreshCw className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <Tabs defaultValue="synthesis" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="synthesis" className="text-xs">
              <Zap className="h-3 w-3 mr-1" />
              Synthèse
            </TabsTrigger>
            <TabsTrigger value="behavioral" className="text-xs">
              <Users className="h-3 w-3 mr-1" />
              Comportemental
            </TabsTrigger>
            <TabsTrigger value="academic" className="text-xs">
              <Award className="h-3 w-3 mr-1" />
              Académique
            </TabsTrigger>
            <TabsTrigger value="recommendations" className="text-xs">
              <Lightbulb className="h-3 w-3 mr-1" />
              Actions
            </TabsTrigger>
          </TabsList>

          {/* Onglet Synthèse */}
          <TabsContent value="synthesis" className="space-y-4 mt-4">
            {/* Alertes importantes */}
            {(behavioralAlerts.length > 0 || academicRisks.length > 0) && (
              <div className="space-y-2">
                <h5 className="text-sm font-medium text-destructive flex items-center gap-1">
                  <AlertTriangle className="h-3 w-3" />
                  Alertes ({behavioralAlerts.length + academicRisks.length})
                </h5>
                {behavioralAlerts.slice(0, 2).map((alert, index) => (
                  <div
                    key={index}
                    className="p-3 bg-destructive/5 border border-destructive/20 rounded-md"
                  >
                    <div className="flex items-start gap-2">
                      <AlertTriangle className="h-3 w-3 text-destructive mt-0.5" />
                      <div>
                        <p className="text-xs font-medium text-destructive">
                          {alert.message}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {alert.suggestedActions[0]}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
                {academicRisks.slice(0, 1).map((risk, index) => (
                  <div
                    key={index}
                    className="p-3 bg-warning/5 border border-warning/20 rounded-md"
                  >
                    <div className="flex items-start gap-2">
                      <AlertTriangle className="h-3 w-3 text-warning mt-0.5" />
                      <div>
                        <p className="text-xs font-medium text-warning">
                          {risk.description}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {risk.suggestedActions[0]}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Métriques clés */}
            <div className="grid grid-cols-2 gap-3">
              {behavioralAnalysis && (
                <>
                  <div className="p-3 bg-primary/5 rounded-lg text-center">
                    <div className="text-lg font-bold text-primary">
                      {behavioralAnalysis.participationLevel}/20
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Participation
                    </div>
                  </div>
                  <div className="p-3 bg-success/5 rounded-lg text-center">
                    <div className="text-lg font-bold text-success">
                      {Math.round(behavioralAnalysis.attendanceRate * 100)}%
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Présence
                    </div>
                  </div>
                </>
              )}
              {academicAnalysis && (
                <>
                  <div className="p-3 bg-blue-500/5 rounded-lg text-center">
                    <div className="text-lg font-bold text-blue-600">
                      {academicAnalysis.overallAverage}/20
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Moyenne générale
                    </div>
                  </div>
                  <div className="p-3 bg-purple-500/5 rounded-lg text-center">
                    <div className="text-lg font-bold text-purple-600">
                      {Math.round(academicAnalysis.consistencyScore * 100)}%
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Régularité
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Points saillants */}
            <div className="space-y-2">
              <h5 className="text-sm font-medium">Points saillants</h5>
              {behavioralAnalysis?.dominantBehaviors.map((behavior, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Target className="h-3 w-3 text-primary" />
                  <span className="text-xs">{behavior}</span>
                </div>
              ))}
              {academicAnalysis?.strongestSubjects.map((subject, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Award className="h-3 w-3 text-success" />
                  <span className="text-xs">Excellent en {subject}</span>
                </div>
              ))}
            </div>
          </TabsContent>

          {/* Onglet Comportemental */}
          <TabsContent value="behavioral" className="space-y-4 mt-4">
            {behavioralAnalysis && (
              <>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">
                        Attention
                      </span>
                      <span className="text-xs font-medium">
                        {behavioralAnalysis.attentionLevel}/20
                      </span>
                    </div>
                    <div className="w-full bg-muted h-2 rounded">
                      <div
                        className="bg-primary h-2 rounded"
                        style={{
                          width: `${(behavioralAnalysis.attentionLevel / 20) * 100}%`,
                        }}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">
                        Coopération
                      </span>
                      <span className="text-xs font-medium">
                        {behavioralAnalysis.cooperationLevel}/20
                      </span>
                    </div>
                    <div className="w-full bg-muted h-2 rounded">
                      <div
                        className="bg-success h-2 rounded"
                        style={{
                          width: `${(behavioralAnalysis.cooperationLevel / 20) * 100}%`,
                        }}
                      />
                    </div>
                  </div>
                </div>

                {behavioralTrends && (
                  <div className="space-y-2">
                    <h5 className="text-sm font-medium">Évolution</h5>
                    <div className="flex items-center gap-2">
                      {getTrendIcon(behavioralTrends.attentionTrend.direction)}
                      <span className="text-xs">
                        {behavioralTrends.attentionTrend.periodComparison}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {behavioralTrends.evolutionSummary}
                    </p>
                  </div>
                )}
              </>
            )}
          </TabsContent>

          {/* Onglet Académique */}
          <TabsContent value="academic" className="space-y-4 mt-4">
            {academicAnalysis && (
              <>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Matières fortes</span>
                  </div>
                  {academicAnalysis.strongestSubjects.length > 0 ? (
                    academicAnalysis.strongestSubjects.map((subject, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <Award className="h-3 w-3 text-success" />
                        <span className="text-xs">{subject}</span>
                      </div>
                    ))
                  ) : (
                    <span className="text-xs text-muted-foreground">
                      Aucune matière forte identifiée
                    </span>
                  )}
                </div>

                {academicAnalysis.weakestSubjects.length > 0 && (
                  <div className="space-y-3">
                    <span className="text-sm font-medium">Difficultés</span>
                    {academicAnalysis.weakestSubjects.map((subject, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <AlertTriangle className="h-3 w-3 text-warning" />
                        <span className="text-xs">{subject}</span>
                      </div>
                    ))}
                  </div>
                )}

                {academicProgress && (
                  <div className="space-y-2">
                    <h5 className="text-sm font-medium">Progression</h5>
                    <div className="flex items-center gap-2">
                      {getTrendIcon(
                        academicProgress.overallTrend === "improving"
                          ? "up"
                          : academicProgress.overallTrend === "declining"
                            ? "down"
                            : "stable",
                      )}
                      <span className="text-xs">
                        Évolution:{" "}
                        {academicProgress.overallTrend === "improving"
                          ? "positive"
                          : academicProgress.overallTrend === "declining"
                            ? "négative"
                            : "stable"}
                      </span>
                    </div>
                  </div>
                )}
              </>
            )}
          </TabsContent>

          {/* Onglet Recommandations */}
          <TabsContent value="recommendations" className="space-y-4 mt-4">
            {recommendations.length > 0 ? (
              <div className="space-y-3">
                {recommendations.slice(0, 5).map((rec, index) => (
                  <div key={index} className="p-3 bg-muted/30 rounded-md">
                    <div className="flex items-start gap-2 mb-2">
                      {getPriorityIcon(rec.priority)}
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium">{rec.title}</p>
                        <p className="text-xs text-muted-foreground">
                          {rec.description}
                        </p>
                      </div>
                      <Badge
                        variant={
                          rec.priority === "high" ? "destructive" : "secondary"
                        }
                        className="text-xs"
                      >
                        {rec.priority === "high"
                          ? "Urgent"
                          : rec.priority === "medium"
                            ? "Important"
                            : "Suggéré"}
                      </Badge>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      <strong>Actions:</strong>{" "}
                      {rec.actionItems.slice(0, 2).join(", ")}
                      {rec.actionItems.length > 2 && "..."}
                    </div>
                  </div>
                ))}
                {recommendations.length > 5 && (
                  <p className="text-xs text-center text-muted-foreground">
                    Et {recommendations.length - 5} autres recommandations...
                  </p>
                )}
              </div>
            ) : (
              <div className="text-center py-6">
                <Lightbulb className="h-8 w-8 mx-auto mb-2 text-muted-foreground opacity-50" />
                <p className="text-xs text-muted-foreground">
                  Aucune recommandation spécifique pour le moment
                </p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
