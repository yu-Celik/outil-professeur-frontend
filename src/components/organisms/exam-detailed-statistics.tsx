"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/atoms/card";
import { Badge } from "@/components/atoms/badge";
import { Button } from "@/components/atoms/button";
import { ExamProgressRing } from "@/components/atoms/exam-progress-ring";
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Target,
  Award,
  AlertTriangle,
  Users,
  Clock,
  Calculator,
  Percent,
  Loader2,
  RefreshCw,
} from "lucide-react";
import { useNotationSystem } from "@/features/evaluations";
import {
  fetchExamResults,
  fetchExamStats,
  fetchStudentsForClass,
  type ExamStatsResponse,
} from "@/features/evaluations/api/exam-grading-service";
import type { Exam, Student, StudentExamResult } from "@/types/uml-entities";
import { toast } from "sonner";

export interface ExamDetailedStatisticsProps {
  exam: Exam;
  className?: string;
}

interface GradeDistribution {
  range: string;
  count: number;
  percentage: number;
  color: string;
}

interface StrugglingStudent {
  student: Student;
  points: number;
  percentage: number;
}

export function ExamDetailedStatistics({
  exam,
  className = "",
}: ExamDetailedStatisticsProps) {
  const [statistics, setStatistics] = useState<ExamStatsResponse | null>(null);
  const [examResults, setExamResults] = useState<StudentExamResult[]>([]);
  const [classStudents, setClassStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { notationSystems, formatGrade } = useNotationSystem();

  const notationSystem = notationSystems.find(
    (ns) => ns.id === exam.notationSystemId,
  );

  // Load data from API
  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [statsData, resultsData, studentsData] = await Promise.all([
        fetchExamStats(exam.id),
        fetchExamResults(exam.id),
        fetchStudentsForClass(exam.classId),
      ]);

      setStatistics(statsData);
      setExamResults(
        resultsData.items.map((r) => ({
          id: r.id,
          createdBy: exam.createdBy,
          examId: r.exam_id,
          studentId: r.student_id,
          pointsObtained: r.points_obtained,
          grade: r.points_obtained,
          gradeDisplay: r.is_absent ? "ABS" : r.points_obtained.toString(),
          isAbsent: r.is_absent,
          comments: r.comments || "",
          markedAt: new Date(r.marked_at),
          isPassing: function (system) {
            if (this.isAbsent) return false;
            const threshold =
              system.minValue + (system.maxValue - system.minValue) * 0.5;
            return this.grade >= threshold;
          },
          gradeCategory: function (system) {
            if (this.isAbsent) return "Absent";
            const percentage =
              ((this.grade - system.minValue) /
                (system.maxValue - system.minValue)) *
              100;
            if (percentage >= 80) return "Excellent";
            if (percentage >= 60) return "Bien";
            if (percentage >= 40) return "Satisfaisant";
            return "Insuffisant";
          },
          percentage: function (examTotalPoints) {
            if (this.isAbsent || examTotalPoints <= 0) return 0;
            return (this.pointsObtained / examTotalPoints) * 100;
          },
          updateDisplay: function (system, locale) {
            this.gradeDisplay = this.isAbsent
              ? "ABS"
              : system.formatDisplay(this.grade, locale);
          },
        })),
      );
      setClassStudents(studentsData);
    } catch (err: any) {
      console.error("Error loading exam statistics:", err);
      setError(err.message || "Erreur lors du chargement des statistiques");
      toast.error("Impossible de charger les statistiques de l'examen.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [exam.id, exam.classId]);

  // Retry handler
  const handleRetry = () => {
    loadData();
  };

  // Calculs avancés
  const submittedResults = examResults.filter((result) => !result.isAbsent);
  const grades = submittedResults.map((result) => result.pointsObtained);

  // Écart-type (use API value if available, calculate as fallback)
  const standardDeviation = statistics?.stddev_points || 0;

  // Distribution des notes par tranches
  const getGradeDistribution = (): GradeDistribution[] => {
    if (grades.length === 0) return [];

    const ranges = [
      { min: 0, max: 0.25, label: "0-25%", color: "text-red-600" },
      { min: 0.25, max: 0.5, label: "25-50%", color: "text-orange-600" },
      { min: 0.5, max: 0.65, label: "50-65%", color: "text-yellow-600" },
      { min: 0.65, max: 0.8, label: "65-80%", color: "text-blue-600" },
      { min: 0.8, max: 1, label: "80-100%", color: "text-green-600" },
    ];

    return ranges.map((range) => {
      const count = grades.filter((grade) => {
        const percentage = grade / exam.totalPoints;
        return (
          percentage >= range.min &&
          (range.max === 1 ? percentage <= range.max : percentage < range.max)
        );
      }).length;

      return {
        range: range.label,
        count,
        percentage: grades.length > 0 ? (count / grades.length) * 100 : 0,
        color: range.color,
      };
    });
  };

  const distribution = getGradeDistribution();

  // Quartiles
  const sortedGrades = [...grades].sort((a, b) => a - b);
  const q1 =
    sortedGrades.length > 0
      ? sortedGrades[Math.floor(sortedGrades.length * 0.25)]
      : 0;
  const q3 =
    sortedGrades.length > 0
      ? sortedGrades[Math.floor(sortedGrades.length * 0.75)]
      : 0;

  // Élèves en difficulté (<8/20 or <40%) et excellents (≥80%)
  const strugglingStudentsList: StrugglingStudent[] = submittedResults
    .filter((result) => {
      const percentage = (result.pointsObtained / exam.totalPoints) * 100;
      return percentage < 40; // Less than 40% = struggling (equivalent to <8/20)
    })
    .map((result) => {
      const student = classStudents.find((s) => s.id === result.studentId);
      return {
        student: student!,
        points: result.pointsObtained,
        percentage: (result.pointsObtained / exam.totalPoints) * 100,
      };
    })
    .filter((item) => item.student) // Remove undefined students
    .sort((a, b) => a.points - b.points); // Sort by points ascending (worst first)

  const strugglingStudents = strugglingStudentsList.length;

  const excellentStudents = submittedResults.filter(
    (result) => result.pointsObtained / exam.totalPoints >= 0.8,
  ).length;

  // If loading, show skeleton
  if (loading) {
    return (
      <div className={`space-y-6 ${className}`}>
        <Card className="p-6">
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
            <span className="ml-3 text-muted-foreground">
              Chargement des statistiques...
            </span>
          </div>
        </Card>
      </div>
    );
  }

  // If error, show retry button
  if (error || !statistics) {
    return (
      <div className={`space-y-6 ${className}`}>
        <Card className="p-6">
          <div className="flex flex-col items-center justify-center py-12 gap-4">
            <AlertTriangle className="w-12 h-12 text-destructive" />
            <div className="text-center">
              <h3 className="text-lg font-semibold mb-2">
                Erreur de chargement
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                {error || "Impossible de charger les statistiques"}
              </p>
              <Button onClick={handleRetry} variant="outline">
                <RefreshCw className="w-4 h-4 mr-2" />
                Recharger les statistiques
              </Button>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Métriques principales */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <Calculator className="w-8 h-8 p-1.5 bg-chart-1/10 text-chart-1 rounded-lg" />
            <div>
              <div className="text-sm text-muted-foreground">Écart-type</div>
              <div className="text-lg font-bold">
                {submittedResults.length > 0
                  ? standardDeviation.toFixed(2)
                  : "-"}
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <Target className="w-8 h-8 p-1.5 bg-chart-2/10 text-chart-2 rounded-lg" />
            <div>
              <div className="text-sm text-muted-foreground">Médiane</div>
              <div className="text-lg font-bold">
                {statistics.submitted_count > 0
                  ? notationSystem
                    ? formatGrade(
                        statistics.median_points,
                        notationSystem,
                        "fr-FR",
                      )
                    : statistics.median_points.toFixed(1)
                  : "-"}
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <Award className="w-8 h-8 p-1.5 bg-chart-3/10 text-chart-3 rounded-lg" />
            <div>
              <div className="text-sm text-muted-foreground">Excellents</div>
              <div className="text-lg font-bold">{excellentStudents}</div>
              <div className="text-xs text-muted-foreground">≥ 80%</div>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-8 h-8 p-1.5 bg-chart-4/10 text-chart-4 rounded-lg" />
            <div>
              <div className="text-sm text-muted-foreground">En difficulté</div>
              <div className="text-lg font-bold">{strugglingStudents}</div>
              <div className="text-xs text-muted-foreground">{"< 50%"}</div>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Distribution des notes */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            Distribution des notes
          </h3>

          {distribution.length > 0 ? (
            <div className="space-y-3">
              {distribution.map((range, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className={`font-medium ${range.color}`}>
                      {range.range}
                    </span>
                    <span className="text-muted-foreground">
                      {range.count} élève{range.count !== 1 ? "s" : ""} (
                      {range.percentage.toFixed(1)}%)
                    </span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-current rounded-full transition-all duration-300"
                      style={{
                        width: `${range.percentage}%`,
                        color: range.color
                          .replace("text-", "")
                          .replace("-600", ""),
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center text-muted-foreground py-8">
              <BarChart3 className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>Aucune note disponible pour l'analyse</p>
            </div>
          )}
        </Card>

        {/* Analyse des quartiles */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Analyse statistique
          </h3>

          {submittedResults.length > 0 ? (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-muted/50 rounded-lg">
                  <div className="text-sm text-muted-foreground">
                    1er Quartile (Q1)
                  </div>
                  <div className="text-lg font-bold">
                    {notationSystem
                      ? formatGrade(q1, notationSystem, "fr-FR")
                      : q1.toFixed(1)}
                  </div>
                </div>
                <div className="text-center p-3 bg-muted/50 rounded-lg">
                  <div className="text-sm text-muted-foreground">
                    3ème Quartile (Q3)
                  </div>
                  <div className="text-lg font-bold">
                    {notationSystem
                      ? formatGrade(q3, notationSystem, "fr-FR")
                      : q3.toFixed(1)}
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span>Étendue interquartile:</span>
                  <span className="font-medium">
                    {(q3 - q1).toFixed(2)} points
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Coefficient de variation:</span>
                  <span className="font-medium">
                    {statistics.avg_points > 0
                      ? (
                          (standardDeviation / statistics.avg_points) *
                          100
                        ).toFixed(1) + "%"
                      : "-"}
                  </span>
                </div>
              </div>

              {/* Indicateurs de performance */}
              <div className="pt-4 border-t">
                <div className="grid grid-cols-2 gap-2">
                  <Badge
                    variant={
                      excellentStudents >= submittedResults.length * 0.2
                        ? "default"
                        : "secondary"
                    }
                    className="justify-center py-2"
                  >
                    <Award className="w-3 h-3 mr-1" />
                    {excellentStudents} excellents
                  </Badge>
                  <Badge
                    variant={
                      strugglingStudents <= submittedResults.length * 0.2
                        ? "default"
                        : "destructive"
                    }
                    className="justify-center py-2"
                  >
                    <AlertTriangle className="w-3 h-3 mr-1" />
                    {strugglingStudents} en difficulté
                  </Badge>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center text-muted-foreground py-8">
              <TrendingUp className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>Analyse disponible après correction des copies</p>
            </div>
          )}
        </Card>

        {/* Élèves en difficulté */}
        {strugglingStudentsList.length > 0 && (
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-orange-600" />
              Élèves en difficulté ({"<"}40%)
            </h3>

            <div className="space-y-2">
              {strugglingStudentsList.map((item) => (
                <div
                  key={item.student.id}
                  className="flex items-center justify-between p-3 bg-orange-50 border border-orange-200 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <AlertTriangle className="w-4 h-4 text-orange-600" />
                    <div>
                      <div className="font-medium">
                        {item.student.firstName} {item.student.lastName}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {item.student.id}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-orange-900">
                      {item.points.toFixed(1)} / {exam.totalPoints}
                    </div>
                    <div className="text-xs text-orange-700">
                      {item.percentage.toFixed(1)}%
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 p-3 bg-muted/50 rounded-lg text-sm text-muted-foreground">
              <strong>{strugglingStudentsList.length}</strong> élève
              {strugglingStudentsList.length > 1 ? "s" : ""} en difficulté (note
              inférieure à 40%). Un suivi individuel est recommandé.
            </div>
          </Card>
        )}
      </div>

      {/* Recommandations pédagogiques */}
      {submittedResults.length > 0 && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Users className="w-5 h-5" />
            Recommandations pédagogiques
          </h3>

          <div className="grid gap-4 md:grid-cols-3">
            {statistics.pass_rate < 50 && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="w-4 h-4 text-red-600" />
                  <span className="font-medium text-red-900">
                    Difficultés importantes
                  </span>
                </div>
                <p className="text-sm text-red-700">
                  Moins de 50% de réussite. Considérez une révision des concepts
                  ou un rattrapage.
                </p>
              </div>
            )}

            {standardDeviation > exam.totalPoints * 0.3 && (
              <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingDown className="w-4 h-4 text-orange-600" />
                  <span className="font-medium text-orange-900">
                    Résultats dispersés
                  </span>
                </div>
                <p className="text-sm text-orange-700">
                  Grande variabilité des résultats. Différenciation pédagogique
                  recommandée.
                </p>
              </div>
            )}

            {excellentStudents > submittedResults.length * 0.3 && (
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Award className="w-4 h-4 text-green-600" />
                  <span className="font-medium text-green-900">
                    Excellents résultats
                  </span>
                </div>
                <p className="text-sm text-green-700">
                  Plus de 30% d'excellents. Proposez des défis supplémentaires
                  aux meilleurs élèves.
                </p>
              </div>
            )}
          </div>
        </Card>
      )}
    </div>
  );
}
