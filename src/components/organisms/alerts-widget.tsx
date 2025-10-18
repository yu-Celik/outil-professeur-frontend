"use client";

import {
  AlertTriangle,
  AlertCircle,
  TrendingDown,
  UserX,
  Users,
  RefreshCw,
  AlertOctagon,
} from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/atoms/badge";
import { Button } from "@/components/atoms/button";
import { Card, CardContent, CardHeader } from "@/components/molecules/card";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/molecules/sheet";
import { useStudentAlerts } from "@/features/students/hooks";
import type {
  StudentAlert,
  StudentAlertType,
  StudentAlertSeverity,
} from "@/features/students/services";

export interface AlertsWidgetProps {
  classIds: Array<{ id: string; name?: string }>;
  onAlertClick?: (studentId: string, alertType: StudentAlertType) => void;
}

const ALERT_TYPE_CONFIG: Record<
  StudentAlertType,
  {
    icon: React.ElementType;
    label: string;
    color: string;
  }
> = {
  attendance: {
    icon: UserX,
    label: "Présence faible",
    color: "text-red-500",
  },
  grade_drop: {
    icon: TrendingDown,
    label: "Baisse de notes",
    color: "text-orange-500",
  },
  participation: {
    icon: Users,
    label: "Participation faible",
    color: "text-yellow-600",
  },
  behavior: {
    icon: AlertOctagon,
    label: "Comportement",
    color: "text-purple-600",
  },
};

const SEVERITY_CONFIG: Record<
  StudentAlertSeverity,
  {
    badgeVariant: "destructive" | "secondary" | "default";
    label: string;
  }
> = {
  high: {
    badgeVariant: "destructive",
    label: "Critique",
  },
  medium: {
    badgeVariant: "secondary",
    label: "Attention",
  },
  low: {
    badgeVariant: "default",
    label: "Surveillance",
  },
};

function AlertIcon({
  type,
  className,
}: {
  type: StudentAlertType;
  className?: string;
}) {
  const Icon = ALERT_TYPE_CONFIG[type].icon;
  return <Icon className={className} />;
}

function AlertItem({
  alert,
  onClick,
}: {
  alert: StudentAlert;
  onClick?: () => void;
}) {
  const config = ALERT_TYPE_CONFIG[alert.type];
  const severityConfig = SEVERITY_CONFIG[alert.severity];

  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full text-left p-4 rounded-lg hover:bg-muted/50 transition-colors border flex items-start gap-3 group"
    >
      <div className={`flex-shrink-0 mt-0.5 ${config.color}`}>
        <AlertIcon type={alert.type} className="h-5 w-5" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2 mb-1">
          <div className="flex-1">
            <h4 className="font-medium text-sm group-hover:text-primary transition-colors">
              {alert.studentName}
            </h4>
            {alert.className && (
              <p className="text-xs text-muted-foreground">{alert.className}</p>
            )}
          </div>
          <Badge
            variant={severityConfig.badgeVariant}
            className="text-xs flex-shrink-0"
          >
            {severityConfig.label}
          </Badge>
        </div>
        <div className="flex items-start gap-2">
          <span className="text-xs font-medium text-muted-foreground">
            {config.label}:
          </span>
          <p className="text-xs text-muted-foreground flex-1">
            {alert.message}
          </p>
        </div>
      </div>
    </button>
  );
}

function AlertsPanel({
  alerts,
  isLoading,
  onRefresh,
  onAlertClick,
}: {
  alerts: StudentAlert[];
  isLoading: boolean;
  onRefresh: () => void;
  onAlertClick?: (studentId: string, alertType: StudentAlertType) => void;
}) {
  const router = useRouter();

  // Group alerts by type
  const alertsByType = alerts.reduce(
    (acc, alert) => {
      if (!acc[alert.type]) {
        acc[alert.type] = [];
      }
      acc[alert.type].push(alert);
      return acc;
    },
    {} as Record<StudentAlertType, StudentAlert[]>,
  );

  const handleAlertClick = (alert: StudentAlert) => {
    if (onAlertClick) {
      onAlertClick(alert.studentId, alert.type);
    } else {
      router.push(`/dashboard/mes-eleves/${alert.studentId}`);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-semibold">Élèves en difficulté</h3>
          <p className="text-sm text-muted-foreground">
            {alerts.length} alerte{alerts.length > 1 ? "s" : ""} détectée
            {alerts.length > 1 ? "s" : ""}
          </p>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={onRefresh}
          disabled={isLoading}
          className="h-8 w-8 p-0"
        >
          <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
        </Button>
      </div>

      {alerts.length === 0 ? (
        <div className="text-center py-8">
          <AlertCircle className="h-12 w-12 mx-auto text-muted-foreground/50 mb-3" />
          <p className="text-sm text-muted-foreground">
            Aucune alerte détectée
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Tous vos élèves semblent être sur la bonne voie
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {(Object.keys(alertsByType) as StudentAlertType[]).map((type) => {
            const typeAlerts = alertsByType[type];
            const config = ALERT_TYPE_CONFIG[type];

            return (
              <div key={type} className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className={config.color}>
                    <AlertIcon type={type} className="h-4 w-4" />
                  </div>
                  <span className="text-sm font-medium">
                    {config.label} ({typeAlerts.length})
                  </span>
                </div>
                <div className="space-y-2">
                  {typeAlerts.map((alert) => (
                    <AlertItem
                      key={alert.id}
                      alert={alert}
                      onClick={() => handleAlertClick(alert)}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export function AlertsWidget({ classIds, onAlertClick }: AlertsWidgetProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { alerts, totalCount, isLoading, error, refresh } = useStudentAlerts({
    classIds,
    autoLoad: true,
  });

  const criticalCount = alerts.filter((a) => a.severity === "high").length;

  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 px-6">
        <div className="flex items-center gap-3">
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center ${
              criticalCount > 0
                ? "bg-red-500"
                : totalCount > 0
                  ? "bg-orange-500"
                  : "bg-muted"
            }`}
          >
            <AlertTriangle
              className={`h-4 w-4 ${
                totalCount > 0 ? "text-white" : "text-muted-foreground"
              }`}
            />
          </div>
          <div>
            <h3 className="font-semibold text-base">Alertes</h3>
            <p className="text-xs text-muted-foreground">
              Élèves nécessitant un suivi
            </p>
          </div>
        </div>
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" size="lg" className="relative">
              Voir
              {totalCount > 0 && (
                <Badge
                  variant={criticalCount > 0 ? "destructive" : "secondary"}
                  className="ml-2 h-5 min-w-5 px-1"
                >
                  {totalCount}
                </Badge>
              )}
            </Button>
          </SheetTrigger>
          <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
            <SheetHeader>
              <SheetTitle>Alertes élèves</SheetTitle>
              <SheetDescription>
                Surveillance automatique des élèves nécessitant un suivi
                particulier
              </SheetDescription>
            </SheetHeader>
            <div className="mt-6">
              <AlertsPanel
                alerts={alerts}
                isLoading={isLoading}
                onRefresh={refresh}
                onAlertClick={onAlertClick}
              />
            </div>
          </SheetContent>
        </Sheet>
      </CardHeader>

      <CardContent className="px-6">
        {error && (
          <div className="text-sm text-red-500 bg-red-50 dark:bg-red-950/20 p-3 rounded-md">
            {error}
          </div>
        )}

        {!error && totalCount > 0 && (
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Alertes critiques</span>
              <span className="font-semibold text-red-500">
                {criticalCount}
              </span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Total alertes</span>
              <span className="font-semibold">{totalCount}</span>
            </div>

            {/* Preview of top 2 alerts */}
            <div className="space-y-2 pt-2">
              {alerts.slice(0, 2).map((alert) => {
                const config = ALERT_TYPE_CONFIG[alert.type];
                return (
                  <div
                    key={alert.id}
                    className="flex items-center gap-2 text-xs p-2 bg-muted/30 rounded"
                  >
                    <div className={config.color}>
                      <AlertIcon type={alert.type} className="h-3 w-3" />
                    </div>
                    <span className="font-medium truncate flex-1">
                      {alert.studentName}
                    </span>
                    <Badge
                      variant={SEVERITY_CONFIG[alert.severity].badgeVariant}
                      className="text-xs h-4 px-1"
                    >
                      {config.label}
                    </Badge>
                  </div>
                );
              })}
              {totalCount > 2 && (
                <p className="text-xs text-muted-foreground text-center pt-1">
                  +{totalCount - 2} autre{totalCount - 2 > 1 ? "s" : ""}
                </p>
              )}
            </div>
          </div>
        )}

        {!error && totalCount === 0 && !isLoading && (
          <div className="text-center py-4">
            <AlertCircle className="h-8 w-8 mx-auto text-muted-foreground/50 mb-2" />
            <p className="text-xs text-muted-foreground">
              Aucune alerte en cours
            </p>
          </div>
        )}

        {isLoading && (
          <div className="text-center py-4">
            <RefreshCw className="h-8 w-8 mx-auto text-muted-foreground/50 animate-spin mb-2" />
            <p className="text-xs text-muted-foreground">Analyse en cours...</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
