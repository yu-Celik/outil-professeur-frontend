"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/molecules/card";
import { Button } from "@/components/atoms/button";
import { Badge } from "@/components/atoms/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/molecules/dropdown-menu";
import {
  MoreVertical,
  Edit,
  Trash2,
  Copy,
  Eye,
  Grid3x3,
  Target,
  Scale,
} from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import type { Rubric } from "@/types/uml-entities";
import type {
  RubricSection,
  RubricConstraints,
} from "@/features/evaluations/mocks";

export interface RubricCardProps {
  rubric: Rubric;
  onEdit?: (rubricId: string) => void;
  onDelete?: (rubricId: string) => void;
  onDuplicate?: (rubricId: string) => void;
  onView?: (rubricId: string) => void;
  className?: string;
}

export function RubricCard({
  rubric,
  onEdit,
  onDelete,
  onDuplicate,
  onView,
  className = "",
}: RubricCardProps) {
  const [isActionsOpen, setIsActionsOpen] = useState(false);

  const sections = rubric.sections as Record<string, RubricSection>;
  const constraints = rubric.constraints as unknown as RubricConstraints;

  const sectionsCount = Object.keys(sections).length;
  const totalCriteria = Object.values(sections).reduce(
    (sum, section) => sum + section.criteria.length,
    0,
  );

  const handleEdit = () => {
    setIsActionsOpen(false);
    onEdit?.(rubric.id);
  };

  const handleDelete = () => {
    setIsActionsOpen(false);
    if (
      window.confirm(
        `Êtes-vous sûr de vouloir supprimer la grille "${rubric.name}" ?`,
      )
    ) {
      onDelete?.(rubric.id);
    }
  };

  const handleDuplicate = () => {
    setIsActionsOpen(false);
    onDuplicate?.(rubric.id);
  };

  const handleView = () => {
    setIsActionsOpen(false);
    onView?.(rubric.id);
  };

  return (
    <Card className={`group hover:shadow-md transition-shadow ${className}`}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <CardTitle className="text-lg font-medium text-foreground truncate">
              {rubric.name}
            </CardTitle>
            <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Grid3x3 className="h-4 w-4" />
                {sectionsCount} section{sectionsCount > 1 ? "s" : ""}
              </div>
              <div className="flex items-center gap-1">
                <Target className="h-4 w-4" />
                {totalCriteria} critère{totalCriteria > 1 ? "s" : ""}
              </div>
              <div className="flex items-center gap-1">
                <Scale className="h-4 w-4" />/{constraints.maxTotalPoints} pts
              </div>
            </div>
          </div>

          <DropdownMenu open={isActionsOpen} onOpenChange={setIsActionsOpen}>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <MoreVertical className="h-4 w-4" />
                <span className="sr-only">Actions</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem onClick={handleView}>
                <Eye className="mr-2 h-4 w-4" />
                Aperçu
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleEdit}>
                <Edit className="mr-2 h-4 w-4" />
                Modifier
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleDuplicate}>
                <Copy className="mr-2 h-4 w-4" />
                Dupliquer
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={handleDelete}
                className="text-destructive focus:text-destructive"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Supprimer
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        {/* Sections aperçu */}
        <div className="space-y-2 mb-4">
          {Object.values(sections)
            .slice(0, 3)
            .map((section) => (
              <div
                key={section.id}
                className="flex items-center justify-between"
              >
                <span className="text-sm text-foreground truncate flex-1 mr-2">
                  {section.name}
                </span>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs px-1.5 py-0.5">
                    {section.weight}%
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    {section.criteria.length} critère
                    {section.criteria.length > 1 ? "s" : ""}
                  </span>
                </div>
              </div>
            ))}

          {sectionsCount > 3 && (
            <div className="text-xs text-muted-foreground text-center py-1">
              +{sectionsCount - 3} section{sectionsCount - 3 > 1 ? "s" : ""} de
              plus
            </div>
          )}
        </div>

        {/* Métadonnées */}
        <div className="flex items-center justify-between pt-2 border-t border-border/50">
          <div className="text-xs text-muted-foreground">
            Créée le {format(rubric.createdAt, "dd MMM yyyy", { locale: fr })}
          </div>

          <div className="flex gap-1">
            {constraints.allowPartialPoints && (
              <Badge variant="secondary" className="text-xs px-2 py-0.5">
                Décimales
              </Badge>
            )}
            {constraints.sectionsRequired && (
              <Badge variant="secondary" className="text-xs px-2 py-0.5">
                Sections
              </Badge>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
