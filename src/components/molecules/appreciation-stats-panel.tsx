"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/molecules/card";
import { TrendingUp, TrendingDown, Minus, UserCheck } from "lucide-react";

export interface StatMetric {
  label: string;
  value: string;
  helperText?: string;
  trend?: "up" | "down" | "steady";
  trendLabel?: string;
}

export interface StatsSection {
  id: string;
  title: string;
  metrics: StatMetric[];
}

export interface AppreciationStatsPanelProps {
  studentName?: string;
  sections: StatsSection[];
}

export function AppreciationStatsPanel({
  studentName,
  sections,
}: AppreciationStatsPanelProps) {
  return (
    <Card className="h-full flex flex-col border-0 rounded-none">
      <CardHeader className="flex-shrink-0 pb-3">
        <div className="flex items-center gap-2">
          <UserCheck className="h-4 w-4 text-muted-foreground" />
          <CardTitle className="text-base">Statistiques de l'élève</CardTitle>
        </div>
        {studentName && (
          <p className="text-sm text-muted-foreground mt-1">{studentName}</p>
        )}
      </CardHeader>

      <CardContent className="flex-1 min-h-0 overflow-y-auto space-y-4">
        {sections.length === 0 ? (
          <div className="text-center py-8 text-sm text-muted-foreground">
            Sélectionnez un élève pour voir ses statistiques
          </div>
        ) : (
          sections.map((section) => (
            <div key={section.id} className="space-y-2">
              <h4 className="text-sm font-medium text-foreground">
                {section.title}
              </h4>
              <div className="space-y-3">
                {section.metrics.map((metric, index) => (
                  <div
                    key={`${section.id}-${index}`}
                    className="flex items-start justify-between"
                  >
                    <div className="flex-1">
                      <div className="text-sm text-muted-foreground">
                        {metric.label}
                      </div>
                      {metric.helperText && (
                        <div className="text-xs text-muted-foreground/70 mt-0.5">
                          {metric.helperText}
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-2 ml-3">
                      <span className="text-sm font-medium">
                        {metric.value}
                      </span>
                      {metric.trend && (
                        <div
                          className="flex-shrink-0"
                          title={metric.trendLabel}
                        >
                          {metric.trend === "up" ? (
                            <TrendingUp className="h-3.5 w-3.5 text-emerald-500" />
                          ) : metric.trend === "down" ? (
                            <TrendingDown className="h-3.5 w-3.5 text-amber-500" />
                          ) : (
                            <Minus className="h-3.5 w-3.5 text-muted-foreground" />
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}
