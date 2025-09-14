"use client";

import { ArrowLeftRight, Clock, XCircle } from "lucide-react";
import { Badge } from "@/components/atoms/badge";

interface SessionStatusBadgeProps {
  status: "moved" | "cancelled" | "rescheduled";
  originalDateTime?: string;
  className?: string;
}

/**
 * Badge pour afficher le statut d'une séance (déplacée, annulée, reprogrammée)
 */
export function SessionStatusBadge({
  status,
  originalDateTime,
  className,
}: SessionStatusBadgeProps) {
  const getStatusConfig = () => {
    switch (status) {
      case "moved":
        return {
          icon: ArrowLeftRight,
          text: "Déplacé",
          variant: "secondary" as const,
          tooltip: originalDateTime
            ? `Déplacé depuis ${originalDateTime}`
            : "Séance déplacée",
        };
      case "cancelled":
        return {
          icon: XCircle,
          text: "Annulé",
          variant: "destructive" as const,
          tooltip: originalDateTime
            ? `Annulé (était prévu ${originalDateTime})`
            : "Séance annulée",
        };
      case "rescheduled":
        return {
          icon: Clock,
          text: "Reprogrammé",
          variant: "outline" as const,
          tooltip: originalDateTime
            ? `Reprogrammé depuis ${originalDateTime}`
            : "Séance reprogrammée",
        };
      default:
        return null;
    }
  };

  const config = getStatusConfig();

  if (!config) return null;

  const Icon = config.icon;

  return (
    <Badge
      variant={config.variant}
      className={`flex items-center gap-1 ${className}`}
      title={config.tooltip}
    >
      <Icon className="h-3 w-3" />
      {config.text}
    </Badge>
  );
}
