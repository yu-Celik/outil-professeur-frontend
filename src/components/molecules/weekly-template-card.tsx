"use client";

import { Calendar, Clock, Edit, Trash2, Play } from "lucide-react";
import { Badge } from "@/components/atoms/badge";
import { Button } from "@/components/atoms/button";
import { Card } from "@/components/molecules/card";
import type { WeeklyTemplate } from "@/types/uml-entities";

interface WeeklyTemplateCardProps {
  template: WeeklyTemplate;
  className?: string;
  subjectName?: string;
  timeSlotName?: string;
  onEdit?: () => void;
  onDelete?: () => void;
  onGenerate?: () => void;
}

const DAYS_OF_WEEK = [
  "",
  "Lundi",
  "Mardi",
  "Mercredi",
  "Jeudi",
  "Vendredi",
  "Samedi",
  "Dimanche",
];

export function WeeklyTemplateCard({
  template,
  className,
  subjectName = "Matière inconnue",
  timeSlotName = "Créneau inconnu",
  onEdit,
  onDelete,
  onGenerate,
}: WeeklyTemplateCardProps) {
  const dayName = DAYS_OF_WEEK[template.dayOfWeek] || "Jour inconnu";

  return (
    <Card
      className={`group p-4 transition-all duration-200 hover:border-primary/50 ${className}`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4 flex-1">
          {/* Day Badge */}
          <div className="flex flex-col items-center gap-1 min-w-[80px]">
            <Badge variant="outline" className="w-full justify-center">
              <Calendar className="h-3 w-3 mr-1" />
              {dayName}
            </Badge>
          </div>

          {/* Template Info */}
          <div className="flex-1">
            <div className="font-medium text-foreground">{subjectName}</div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
              <Clock className="h-3 w-3" />
              <span>{timeSlotName}</span>
            </div>
          </div>

          {/* Status */}
          {!template.isActive && (
            <Badge variant="secondary" className="text-xs">
              Inactif
            </Badge>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          {onGenerate && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onGenerate}
              title="Générer des sessions"
            >
              <Play className="h-4 w-4" />
            </Button>
          )}

          {onEdit && (
            <Button variant="ghost" size="sm" onClick={onEdit} title="Modifier">
              <Edit className="h-4 w-4" />
            </Button>
          )}

          {onDelete && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onDelete}
              className="text-destructive hover:text-destructive"
              title="Supprimer"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
}
