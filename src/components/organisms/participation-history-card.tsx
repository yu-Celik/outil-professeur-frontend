"use client";

import { BarChart3 } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/atoms/badge";
import { Button } from "@/components/atoms/button";
import { GradeDisplay } from "@/components/atoms/grade-display";
import { Card, CardContent, CardHeader } from "@/components/molecules/card";
import type { AcademicPeriod } from "@/types/uml-entities";

interface StudentParticipation {
  id: string;
  courseSessionId: string;
  subject: string;
  date: string;
  time: string;
  isPresent: boolean;
  participationLevel: number;
  behavior: string;
  specificRemarks: string;
  technicalIssues: string;
  markedAt: Date;
}

interface ParticipationHistoryCardProps {
  currentPeriod: AcademicPeriod;
  recentParticipations: StudentParticipation[];
  studentId: string;
}

export function ParticipationHistoryCard({
  currentPeriod,
  recentParticipations,
  studentId,
}: ParticipationHistoryCardProps) {
  const getBehaviorBadge = (behavior: string) => {
    const colorMap: Record<string, string> = {
      Attentif: "bg-chart-3/10 text-chart-3 border-chart-3/20",
      Participatif: "bg-chart-1/10 text-chart-1 border-chart-1/20",
      Timide: "bg-chart-5/10 text-chart-5 border-chart-5/20",
      Perturbateur: "bg-destructive/10 text-destructive border-destructive/20",
    };

    return (
      <Badge
        variant="outline"
        className={`text-xs ${colorMap[behavior] || "bg-muted/50 text-muted-foreground border-border"}`}
      >
        {behavior}
      </Badge>
    );
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold">
              Historique des participations
            </h2>
            <p className="text-sm text-muted-foreground">
              Sessions avec évaluations détaillées - {currentPeriod.name}
            </p>
          </div>
          <Button variant="outline" className="gap-2">
            <BarChart3 className="h-4 w-4" />
            Voir tendances
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {recentParticipations.map((participation) => (
          <div
            key={participation.id}
            className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
          >
            <div className="flex items-center gap-4">
              <div className="text-center min-w-16">
                <div className="font-semibold text-sm">
                  {participation.date}
                </div>
                <div className="text-xs text-muted-foreground">
                  {participation.time}
                </div>
              </div>

              <div className="flex-1">
                <div className="font-medium mb-1">{participation.subject}</div>
                <div className="flex items-center gap-2">
                  {participation.isPresent ? (
                    <>
                      <Badge variant="outline" className="text-xs">
                        Participation:{" "}
                        <GradeDisplay
                          value={participation.participationLevel}
                        />
                      </Badge>
                      {participation.behavior
                        .split(",")
                        .filter((b) => b.trim())
                        .map((behavior) => (
                          <div key={behavior.trim()}>
                            {getBehaviorBadge(behavior.trim())}
                          </div>
                        ))}
                      {participation.technicalIssues && (
                        <Badge variant="destructive" className="text-xs">
                          Problème technique
                        </Badge>
                      )}
                    </>
                  ) : (
                    <Badge variant="destructive" className="text-xs">
                      Absent
                    </Badge>
                  )}
                </div>
                {participation.specificRemarks && (
                  <p className="text-sm text-muted-foreground mt-1">
                    "{participation.specificRemarks}"
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Badge
                variant="default"
                className="text-xs bg-chart-3/10 text-chart-3 border-chart-3/20"
              >
                Évalué
              </Badge>
              <Link
                href={`/dashboard/students/${studentId}?session=${participation.courseSessionId}`}
              >
                <Button variant="ghost" size="sm">
                  Voir détails
                </Button>
              </Link>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
