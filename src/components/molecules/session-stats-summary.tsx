"use client";

import { useMemo } from "react";
import { Users, TrendingUp, CheckCircle2, XCircle } from "lucide-react";
import { Badge } from "@/components/atoms/badge";
import { Card, CardContent } from "@/components/molecules/card";
import type { StudentParticipation } from "@/types/uml-entities";

interface SessionStatsSummaryProps {
  attendanceData: StudentParticipation[];
  totalStudents: number;
}

/**
 * Session-level statistics display
 * Shows:
 * - Attendance rate (%)
 * - Average participation level
 * - Present/Absent counts
 * - Completion status
 */
export function SessionStatsSummary({
  attendanceData,
  totalStudents,
}: SessionStatsSummaryProps) {
  const stats = useMemo(() => {
    const presentCount = attendanceData.filter((a) => a.isPresent).length;
    const absentCount = totalStudents - presentCount;
    const attendanceRate =
      totalStudents > 0 ? (presentCount / totalStudents) * 100 : 0;

    // Calculate average participation level (only for present students)
    const presentStudents = attendanceData.filter((a) => a.isPresent);
    const totalParticipation = presentStudents.reduce(
      (sum, a) => sum + (a.participationLevel || 0),
      0,
    );
    const avgParticipation =
      presentStudents.length > 0
        ? totalParticipation / presentStudents.length
        : 0;

    // Check if all students have been evaluated (present students have behavior and participation)
    const evaluatedCount = presentStudents.filter(
      (a) =>
        a.behavior && a.behavior.trim().length > 0 && a.participationLevel > 0,
    ).length;
    const isFullyEvaluated =
      evaluatedCount === presentCount && presentCount > 0;

    return {
      presentCount,
      absentCount,
      attendanceRate,
      avgParticipation,
      evaluatedCount,
      isFullyEvaluated,
    };
  }, [attendanceData, totalStudents]);

  return (
    <Card className="bg-muted/30 border-border/50">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <Users className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-foreground">
                Statistiques de la séance
              </h4>
              <div className="flex items-center gap-3 mt-1">
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <CheckCircle2 className="h-3.5 w-3.5 text-success" />
                  <span className="font-medium">
                    {stats.presentCount} présents
                  </span>
                </div>
                <div className="h-1 w-1 bg-muted-foreground/30 rounded-full" />
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <XCircle className="h-3.5 w-3.5 text-destructive" />
                  <span className="font-medium">
                    {stats.absentCount} absents
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Attendance Rate */}
            <div className="text-right">
              <div className="text-xs text-muted-foreground mb-0.5">
                Taux de présence
              </div>
              <div
                className={`text-lg font-bold ${
                  stats.attendanceRate >= 80
                    ? "text-success"
                    : stats.attendanceRate >= 60
                      ? "text-warning"
                      : "text-destructive"
                }`}
              >
                {stats.attendanceRate.toFixed(0)}%
              </div>
            </div>

            {/* Average Participation */}
            <div className="text-right">
              <div className="text-xs text-muted-foreground mb-0.5">
                Participation moy.
              </div>
              <div className="flex items-center gap-1">
                <TrendingUp
                  className={`h-4 w-4 ${
                    stats.avgParticipation >= 7
                      ? "text-success"
                      : stats.avgParticipation >= 5
                        ? "text-warning"
                        : "text-muted-foreground"
                  }`}
                />
                <span
                  className={`text-lg font-bold ${
                    stats.avgParticipation >= 7
                      ? "text-success"
                      : stats.avgParticipation >= 5
                        ? "text-warning"
                        : "text-muted-foreground"
                  }`}
                >
                  {stats.avgParticipation.toFixed(1)}/10
                </span>
              </div>
            </div>

            {/* Evaluation Status Badge */}
            {stats.isFullyEvaluated ? (
              <Badge className="bg-success text-success-foreground">
                <CheckCircle2 className="h-3 w-3 mr-1" />
                Complet
              </Badge>
            ) : (
              <Badge variant="secondary">
                {stats.evaluatedCount}/{stats.presentCount} évalués
              </Badge>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
