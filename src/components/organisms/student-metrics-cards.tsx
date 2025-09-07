"use client";

import { BookOpen, Calendar, TrendingUp } from "lucide-react";
import { Badge } from "@/components/atoms/badge";
import { GradeDisplay } from "@/components/atoms/grade-display";
import { Card, CardContent } from "@/components/molecules/card";
import type { StudentProfile } from "@/types/uml-entities";

interface StudentMetricsCardsProps {
  currentProfile: StudentProfile | null;
  totalSessions: number;
  presentSessions: number;
}

export function StudentMetricsCards({
  currentProfile,
  totalSessions,
  presentSessions,
}: StudentMetricsCardsProps) {
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
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* Participation moyenne */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium">Participation moyenne</span>
          </div>
          <div className="text-2xl font-bold">
            <GradeDisplay
              value={parseFloat(
                String(currentProfile?.features.averageParticipation || "0"),
              )}
              variant="large"
            />
          </div>
          <p className="text-xs text-muted-foreground">
            Basée sur {presentSessions} sessions
          </p>
        </CardContent>
      </Card>

      {/* Présence */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <Calendar className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium">Présence</span>
          </div>
          <div className="text-2xl font-bold">
            {String(currentProfile?.features.attendanceRate || "0")}%
          </div>
          <p className="text-xs text-muted-foreground">
            {presentSessions}/{totalSessions} cours présent
          </p>
        </CardContent>
      </Card>

      {/* Comportement dominant */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <BookOpen className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium">Comportement dominant</span>
          </div>
          <div className="flex flex-wrap gap-1 mt-2">
            {Array.isArray(currentProfile?.features.dominantBehaviors) &&
              (currentProfile.features.dominantBehaviors as string[]).map(
                (behavior: string) => (
                  <div key={behavior}>{getBehaviorBadge(behavior)}</div>
                ),
              )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}