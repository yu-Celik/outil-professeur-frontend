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
      {/* En-tête fixe */}
      <div className="flex-shrink-0 space-y-3 px-5 py-6 border-b-0">
        <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
          <Badge variant="outline" className="capitalize">
            {studentName ?? "Élève non sélectionné"}
          </Badge>
          {subjectLabel && <Badge variant="secondary">{subjectLabel}</Badge>}
          {periodLabel && <Badge variant="outline">{periodLabel}</Badge>}
        </div>
        <h2 className="text-xl font-semibold text-foreground">Contexte utilisé par l'IA</h2>
        <p className="text-sm text-muted-foreground">
          Activez ou désactivez les blocs de données que l'IA doit prendre en compte pour personnaliser l'appréciation.
        </p>
      </div>

      {/* Contenu scrollable */}
      <div className="flex-1 overflow-y-auto min-h-0">
        <div className="space-y-6 px-5 py-6">
          {loading ? (
            <div className="flex h-40 items-center justify-center text-sm text-muted-foreground">
              Chargement du contexte...
            </div>
          ) : sections.length === 0 ? (
            <div className="flex h-40 flex-col items-center justify-center text-center text-sm text-muted-foreground">
              <Info className="mb-2 h-5 w-5" />
              Sélectionnez un élève pour afficher les informations contextuelles.
            </div>
          ) : (
            sections.map((section, index) => (
              <div key={section.id} className="space-y-4">
                {index > 0 && <Separator />}
                <div className="flex flex-col gap-4">
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-semibold text-foreground">
                        {section.title}
                      </h3>
                      <Badge variant={section.enabled ? "default" : "outline"}>
                        {section.enabled ? "Inclus" : "Exclu"}
                      </Badge>
                    </div>
                    {section.description && (
                      <p className="text-sm text-muted-foreground">
                        {section.description}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-3">
                    {!section.enabled && (
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <AlertCircle className="h-3.5 w-3.5" />
                        Ignoré lors de la génération
                      </div>
                    )}
                    <Switch
                      checked={section.enabled}
                      onCheckedChange={(checked) => onToggleSection(section.id, Boolean(checked))}
                      aria-label={`Activer ${section.title}`}
                    />
                  </div>
                </div>

                {section.metrics && section.metrics.length > 0 && (
                  <div className="grid gap-3">
                    {section.metrics.map((metric) => (
                      <div
                        key={metric.label}
                        className={cn(
                          "rounded-lg border bg-background p-3",
                          section.enabled ? "border-border" : "border-dashed border-muted"
                        )}
                      >
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <span>{metric.label}</span>
                          {metric.trend && TREND_ICONS[metric.trend]}
                        </div>
                        <div className="mt-1 text-lg font-semibold text-foreground">
                          {metric.value}
                        </div>
                        {metric.helperText && (
                          <div className="mt-1 text-xs text-muted-foreground">
                            {metric.helperText}
                            {metric.trendLabel && (
                              <span className="ml-1 font-medium text-foreground/75">
                                {metric.trendLabel}
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {section.items && section.items.length > 0 && (
                  <div className="grid gap-2">
                    {section.items.map((item) => (
                      <div
                        key={item.label}
                        className={cn(
                          "rounded-lg border px-3 py-2 text-sm",
                          section.enabled ? "bg-background" : "bg-muted/40",
                          item.tone === "positive" && "border-emerald-100 text-emerald-700 dark:border-emerald-500/40 dark:text-emerald-300",
                          item.tone === "warning" && "border-amber-100 text-amber-700 dark:border-amber-500/40 dark:text-amber-300"
                        )}
                      >
                        <div className="flex items-center gap-2">
                          {item.icon}
                          <span className="font-medium">{item.label}</span>
                        </div>
                        {item.description && (
                          <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
                            {item.description}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {section.footerNote && (
                  <p className="text-xs text-muted-foreground">
                    {section.footerNote}
                  </p>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
