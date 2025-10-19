"use client";

import {
  BookOpen,
  CalendarDays,
  Clock,
  Copy,
  Edit,
  Eye,
  GraduationCap,
  MoreVertical,
  Share2,
  Trash2,
} from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/atoms/badge";
import { Button } from "@/components/atoms/button";
import { Card } from "@/components/atoms/card";
import { ExamProgressRing } from "@/components/atoms/exam-progress-ring";
import { ExamStatusBadge } from "@/components/atoms/exam-status-badge";
import { ExamTypeIcon } from "@/components/atoms/exam-type-icon";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/molecules/dropdown-menu";
import type { Exam } from "@/types/uml-entities";

export interface ExamCardProps {
  exam: Exam;
  className?: string;
  onEdit?: (examId: string) => void;
  onDelete?: (examId: string) => void;
  onDuplicate?: (examId: string) => void;
  onGrade?: (examId: string) => void;
  onTogglePublication?: (examId: string) => void;
  showActions?: boolean;
  showStats?: boolean;
  resultsCount?: number;
  averageGrade?: number;
}

export function ExamCard({
  exam,
  className = "",
  onEdit,
  onDelete,
  onDuplicate,
  onGrade,
  onTogglePublication,
  showActions = true,
  showStats = true,
  resultsCount = 0,
  averageGrade = 0,
}: ExamCardProps) {
  const handleEdit = () => onEdit?.(exam.id);
  const handleDelete = () => onDelete?.(exam.id);
  const handleDuplicate = () => onDuplicate?.(exam.id);
  const handleGrade = () => onGrade?.(exam.id);
  const handleTogglePublication = () => onTogglePublication?.(exam.id);

  const completionPercentage = resultsCount > 0 ? (resultsCount / 25) * 100 : 0; // Assuming 25 students per class

  return (
    <Card className={`p-6 hover:shadow-md transition-shadow ${className}`}>
      {/* En-tête avec titre et actions */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <ExamTypeIcon
              examType={exam.examType}
              className="w-5 h-5 text-muted-foreground"
            />
            <h3 className="text-lg font-semibold truncate">{exam.title}</h3>
          </div>

          <div className="flex items-center gap-2 mb-2">
            <ExamStatusBadge
              isPublished={exam.isPublished}
              examDate={exam.examDate}
            />
            <Badge variant="outline" className="text-xs">
              {exam.examType}
            </Badge>
          </div>
        </div>

        {showActions && (
          <div className="flex items-center gap-2">
            {onGrade && (
              <Button
                size="sm"
                variant="secondary"
                onClick={handleGrade}
                className="hidden sm:inline-flex"
              >
                <GraduationCap className="w-4 h-4 mr-2" />
                Saisir les notes
              </Button>
            )}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <MoreVertical className="w-4 h-4" />
                  <span className="sr-only">Actions</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <Link
                    href={`/dashboard/evaluations/${exam.id}`}
                    className="flex items-center"
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    Voir les détails
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleEdit}>
                  <Edit className="w-4 h-4 mr-2" />
                  Modifier
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleGrade}>
                  <GraduationCap className="w-4 h-4 mr-2" />
                  Saisir les notes
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleDuplicate}>
                  <Copy className="w-4 h-4 mr-2" />
                  Dupliquer
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleTogglePublication}>
                  <Share2 className="w-4 h-4 mr-2" />
                  {exam.isPublished ? "Dépublier" : "Publier"}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={handleDelete}
                  className="text-destructive"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Supprimer
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}
      </div>

      {/* Description */}
      {exam.description && (
        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
          {exam.description}
        </p>
      )}

      {/* Informations détaillées */}
      <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
        <div className="flex items-center gap-2">
          <CalendarDays className="w-4 h-4 text-muted-foreground" />
          <span>{formatDate(exam.examDate, "fr-FR")}</span>
        </div>

        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-muted-foreground" />
          <span>{formatDuration(exam.durationMinutes)}</span>
        </div>

        <div className="flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-muted-foreground" />
          <span>{exam.totalPoints} points</span>
        </div>

        <div className="flex items-center gap-2">
          <span className="w-4 h-4 flex items-center justify-center text-xs font-bold rounded bg-muted text-muted-foreground">
            ×
          </span>
          <span>Coeff. {exam.coefficient}</span>
        </div>
      </div>

      {/* Statistiques */}
      {showStats && (
        <div className="flex items-center justify-between pt-4 border-t">
          <div className="flex items-center gap-4">
            <div className="text-center">
              <div className="text-lg font-semibold">{resultsCount}</div>
              <div className="text-xs text-muted-foreground">Rendus</div>
            </div>

            {averageGrade > 0 && (
              <div className="text-center">
                <div className="text-lg font-semibold">
                  {averageGrade.toFixed(1)}
                </div>
                <div className="text-xs text-muted-foreground">Moyenne</div>
              </div>
            )}
          </div>

          {resultsCount > 0 && (
            <ExamProgressRing
              percentage={completionPercentage}
              size="sm"
              color={
                completionPercentage >= 80
                  ? "green"
                  : completionPercentage >= 50
                    ? "orange"
                    : "red"
              }
            />
          )}
        </div>
      )}

      {resultsCount === 0 && showActions && (
        <div className="mt-4 rounded-lg bg-muted/30 p-3 text-xs text-muted-foreground">
          Aucune note saisie pour le moment. Utilisez le bouton «&nbsp;Saisir
          les notes&nbsp;» pour attribuer rapidement les résultats aux élèves.
        </div>
      )}
    </Card>
  );
}

// Helper functions
function formatDate(date: Date, locale: string): string {
  return date.toLocaleDateString(locale, {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function _formatTime(date: Date, locale: string): string {
  return date.toLocaleTimeString(locale, {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatDuration(minutes: number): string {
  if (minutes < 60) {
    return `${minutes}min`;
  }
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  if (remainingMinutes === 0) {
    return `${hours}h`;
  }
  return `${hours}h${remainingMinutes.toString().padStart(2, "0")}`;
}
