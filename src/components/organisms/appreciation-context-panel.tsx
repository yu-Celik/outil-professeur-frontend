"use client";

import { ReactNode } from "react";
import { Switch } from "@/components/atoms/switch";
import { Badge } from "@/components/atoms/badge";
import { Separator } from "@/components/atoms/separator";
import { TrendingUp, TrendingDown, Minus, Info, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export type ContextTrend = "up" | "down" | "steady";

export interface ContextMetric {
  label: string;
  value: string;
  helperText?: string;
  trend?: ContextTrend;
  trendLabel?: string;
}

export interface ContextListItem {
  label: string;
  description?: string;
  tone?: "positive" | "neutral" | "warning";
  icon?: ReactNode;
}

export interface AppreciationContextSection {
  id: string;
  title: string;
  description?: string;
  enabled: boolean;
  metrics?: ContextMetric[];
  items?: ContextListItem[];
  footerNote?: string;
}

export interface AppreciationContextPanelProps {
  studentName?: string;
  subjectLabel?: string;
  periodLabel?: string;
  sections: AppreciationContextSection[];
  onToggleSection: (sectionId: string, enabled: boolean) => void;
  loading?: boolean;
}

const TREND_ICONS: Record<ContextTrend, ReactNode> = {
  up: <TrendingUp className="h-3.5 w-3.5 text-emerald-500" />,
  down: <TrendingDown className="h-3.5 w-3.5 text-rose-500" />,
  steady: <Minus className="h-3.5 w-3.5 text-muted-foreground" />,
};

export function AppreciationContextPanel({
  studentName,
  subjectLabel,
  periodLabel,
  sections,
  onToggleSection,
  loading = false,
}: AppreciationContextPanelProps) {
  return (
    <div className="flex h-full flex-col">
      {/* En-tête compact */}
      <div className="flex-shrink-0 px-4 py-3 border-b border-border/50">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs">
            <Badge variant="secondary" className="text-xs py-0.5">
              {studentName ?? "Aucun élève"}
            </Badge>
            {subjectLabel && <Badge variant="outline" className="text-xs py-0.5">{subjectLabel}</Badge>}
            {periodLabel && <Badge variant="outline" className="text-xs py-0.5">{periodLabel}</Badge>}
          </div>
          <h2 className="text-sm font-medium text-foreground">Contexte IA</h2>
        </div>
      </div>

      {/* Contenu scrollable */}
      <div className="flex-1 overflow-y-auto min-h-0">
        <div className="p-3 space-y-3">
          {loading ? (
            <div className="flex h-32 items-center justify-center text-xs text-muted-foreground">
              Chargement...
            </div>
          ) : sections.length === 0 ? (
            <div className="flex h-32 flex-col items-center justify-center text-center text-xs text-muted-foreground">
              <Info className="mb-2 h-4 w-4" />
              Sélectionnez un élève
            </div>
          ) : (
            sections.map((section) => (
              <div key={section.id} className="space-y-2">
                {/* En-tête section compacte */}
                <div className="flex items-center justify-between py-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-xs font-medium text-foreground">
                      {section.title}
                    </h3>
                    <Switch
                      checked={section.enabled}
                      onCheckedChange={(checked) => onToggleSection(section.id, Boolean(checked))}
                      className="scale-75"
                    />
                  </div>
                </div>

                {/* Métriques compactes */}
                {section.enabled && section.metrics && section.metrics.length > 0 && (
                  <div className="space-y-1.5">
                    {section.metrics.map((metric) => (
                      <div
                        key={metric.label}
                        className="flex items-center justify-between p-2 rounded border bg-muted/30"
                      >
                        <div className="min-w-0 flex-1">
                          <div className="text-xs text-muted-foreground">{metric.label}</div>
                          <div className="text-sm font-medium">{metric.value}</div>
                          {metric.helperText && (
                            <div className="text-xs text-muted-foreground truncate">
                              {metric.helperText}
                            </div>
                          )}
                        </div>
                        {metric.trend && (
                          <div className="ml-2">
                            {TREND_ICONS[metric.trend]}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {/* Items compacts */}
                {section.enabled && section.items && section.items.length > 0 && (
                  <div className="space-y-1">
                    {section.items.slice(0, 3).map((item) => (
                      <div
                        key={item.label}
                        className={cn(
                          "px-2 py-1.5 rounded text-xs",
                          item.tone === "positive" && "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300",
                          item.tone === "warning" && "bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-300",
                          !item.tone && "bg-muted/40 text-muted-foreground"
                        )}
                      >
                        <span className="font-medium">{item.label}</span>
                      </div>
                    ))}
                    {section.items.length > 3 && (
                      <div className="text-xs text-muted-foreground px-2">
                        +{section.items.length - 3} autres...
                      </div>
                    )}
                  </div>
                )}

                {!section.enabled && (
                  <div className="text-xs text-muted-foreground px-2 py-1">
                    Section désactivée
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
