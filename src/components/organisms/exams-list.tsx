"use client";

import { useState } from "react";
import { Button } from "@/components/atoms/button";
import { ExamCard } from "@/components/molecules/exam-card";
import { ExamFilters } from "@/components/molecules/exam-filters";
import { ExamStatisticsCards } from "@/components/molecules/exam-statistics-cards";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/atoms/select";
import { Plus, Grid, List, ArrowUpDown } from "lucide-react";
import { useExamManagement } from "@/features/evaluations";
import { useExamFilters } from "@/features/evaluations";
import { calculateExamStatistics } from "@/features/evaluations/mocks";
import type { ExamSortField, SortDirection } from "@/features/evaluations";

export interface ExamsListProps {
  teacherId?: string;
  className?: string;
  onCreateExam?: () => void;
  onEditExam?: (examId: string) => void;
  onDeleteExam?: (examId: string) => void;
  onGradeExam?: (examId: string) => void;
  showFilters?: boolean;
  showStatistics?: boolean;
  selectedClassId?: string | null; // Filtrage par classe externe
}

const sortOptions: { value: ExamSortField; label: string }[] = [
  { value: "examDate", label: "Date d'examen" },
  { value: "title", label: "Titre" },
  { value: "examType", label: "Type" },
  { value: "classId", label: "Classe" },
  { value: "subjectId", label: "Matière" },
  { value: "createdAt", label: "Date de création" },
];

export function ExamsList({
  teacherId = "KsmNtVf4zwqO3VV3SQJqPrRlQBA1fFyR",
  className = "",
  onCreateExam,
  onEditExam,
  onDeleteExam,
  onGradeExam,
  showFilters = true,
  showStatistics = true,
  selectedClassId = null,
}: ExamsListProps) {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const { exams, loading, error, deleteExam, toggleExamPublication } =
    useExamManagement(teacherId);

  const {
    filteredExams,
    filters,
    sort,
    filterStats,
    updateFilter,
    updateSort,
    resetFilters,
    examTypes,
    classIds,
    subjectIds,
    academicPeriodIds,
    hasActiveFilters,
    isEmpty,
    isFiltered,
  } = useExamFilters(exams, teacherId);

  // Filtrer par classe sélectionnée si fournie
  const finalFilteredExams = selectedClassId
    ? filteredExams.filter((exam) => exam.classId === selectedClassId)
    : filteredExams;

  const handleDeleteExam = async (examId: string) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cet examen ?")) {
      try {
        await deleteExam(examId);
        // Optionnellement, appeler onDeleteExam pour des actions supplémentaires
        onDeleteExam?.(examId);
      } catch (error) {
        console.error("Erreur lors de la suppression:", error);
      }
    }
  };

  const handleTogglePublication = async (examId: string) => {
    try {
      await toggleExamPublication(examId);
    } catch (error) {
      console.error("Erreur lors de la publication:", error);
    }
  };

  const getExamStatistics = (examId: string) => {
    return calculateExamStatistics(examId);
  };

  if (loading) {
    return (
      <div className={`space-y-6 ${className}`}>
        <div className="flex items-center justify-between">
          <div className="h-8 w-48 bg-muted animate-pulse rounded" />
          <div className="h-10 w-36 bg-muted animate-pulse rounded" />
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-64 bg-muted animate-pulse rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`text-center py-12 ${className}`}>
        <p className="text-destructive mb-4">{error}</p>
        <Button variant="outline" onClick={() => window.location.reload()}>
          Réessayer
        </Button>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* En-tête avec actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">
            Évaluations
            {isFiltered && (
              <span className="text-lg font-normal text-muted-foreground ml-2">
                ({finalFilteredExams.length} sur {exams.length})
              </span>
            )}
          </h2>
          <p className="text-muted-foreground">
            Gérez vos examens et suivez les performances de vos élèves
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Tri */}
          <Select
            value={`${sort.field}-${sort.direction}`}
            onValueChange={(value) => {
              const [field, direction] = value.split("-") as [
                ExamSortField,
                SortDirection,
              ];
              updateSort(field, direction);
            }}
          >
            <SelectTrigger className="w-48">
              <ArrowUpDown className="w-4 h-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {sortOptions.map((option) => (
                <SelectItem
                  key={`${option.value}-asc`}
                  value={`${option.value}-asc`}
                >
                  {option.label} (A-Z)
                </SelectItem>
              ))}
              {sortOptions.map((option) => (
                <SelectItem
                  key={`${option.value}-desc`}
                  value={`${option.value}-desc`}
                >
                  {option.label} (Z-A)
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Mode d'affichage */}
          <div className="flex items-center border rounded-md">
            <Button
              variant={viewMode === "grid" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("grid")}
              className="rounded-r-none"
            >
              <Grid className="w-4 h-4" />
            </Button>
            <Button
              variant={viewMode === "list" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("list")}
              className="rounded-l-none"
            >
              <List className="w-4 h-4" />
            </Button>
          </div>

          {/* Bouton de création */}
          <Button onClick={onCreateExam}>
            <Plus className="w-4 h-4 mr-2" />
            Nouvelle évaluation
          </Button>
        </div>
      </div>

      {/* Filtres */}
      {showFilters && (
        <ExamFilters
          filters={filters}
          onFilterChange={updateFilter}
          onResetFilters={resetFilters}
          examTypes={examTypes}
          classIds={classIds}
          subjectIds={subjectIds}
          academicPeriodIds={academicPeriodIds}
          filterStats={filterStats}
          hasActiveFilters={hasActiveFilters}
        />
      )}

      {/* Liste des examens */}
      {isEmpty ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📝</div>
          <h3 className="text-lg font-semibold mb-2">
            {hasActiveFilters ? "Aucun examen trouvé" : "Aucune évaluation"}
          </h3>
          <p className="text-muted-foreground mb-4">
            {hasActiveFilters
              ? "Essayez de modifier vos filtres pour voir plus de résultats"
              : "Créez votre première évaluation pour vos élèves"}
          </p>
          {hasActiveFilters ? (
            <Button variant="outline" onClick={resetFilters}>
              Réinitialiser les filtres
            </Button>
          ) : (
            <Button onClick={onCreateExam}>
              <Plus className="w-4 h-4 mr-2" />
              Créer une évaluation
            </Button>
          )}
        </div>
      ) : (
        <div
          className={
            viewMode === "grid"
              ? "grid gap-6 md:grid-cols-2 lg:grid-cols-3"
              : "space-y-4"
          }
        >
          {finalFilteredExams.map((exam) => {
            const stats = getExamStatistics(exam.id);

            return (
              <ExamCard
                key={exam.id}
                exam={exam}
                onEdit={onEditExam}
                onDelete={handleDeleteExam}
                onGrade={onGradeExam}
                onTogglePublication={handleTogglePublication}
                showActions={true}
                showStats={true}
                resultsCount={stats.submittedCount}
                averageGrade={stats.averageGrade}
                className={viewMode === "list" ? "max-w-none" : ""}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}
