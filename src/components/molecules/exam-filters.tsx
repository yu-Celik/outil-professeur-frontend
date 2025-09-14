"use client";

import { Input } from "@/components/atoms/input";
import { Button } from "@/components/atoms/button";
import { Badge } from "@/components/atoms/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/atoms/select";
import { Calendar } from "@/components/atoms/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/atoms/popover";
import { Search, Filter, X, Calendar as CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import type { ExamFilters, ExamStatusFilter } from "@/hooks/use-exam-filters";

export interface ExamFiltersProps {
  filters: ExamFilters;
  onFilterChange: (key: keyof ExamFilters, value: any) => void;
  onResetFilters: () => void;
  examTypes: string[];
  classIds: string[];
  subjectIds: string[];
  academicPeriodIds: string[];
  filterStats: {
    total: number;
    published: number;
    unpublished: number;
    upcoming: number;
    past: number;
  };
  hasActiveFilters: boolean;
  className?: string;
}

const statusOptions: { value: ExamStatusFilter; label: string }[] = [
  { value: "all", label: "Tous les statuts" },
  { value: "published", label: "Publiés" },
  { value: "unpublished", label: "Brouillons" },
  { value: "upcoming", label: "À venir" },
  { value: "past", label: "Terminés" },
];

export function ExamFilters({
  filters,
  onFilterChange,
  onResetFilters,
  examTypes,
  classIds,
  subjectIds,
  academicPeriodIds,
  filterStats,
  hasActiveFilters,
  className = "",
}: ExamFiltersProps) {
  const handleDateRangeChange = (field: "start" | "end", date: Date | null) => {
    onFilterChange("dateRange", {
      ...filters.dateRange,
      [field]: date,
    });
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Barre de recherche */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Rechercher un examen..."
          value={filters.search}
          onChange={(e) => onFilterChange("search", e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Filtres rapides par statut */}
      <div className="flex flex-wrap gap-2">
        {statusOptions.map((option) => {
          const count = option.value === "all" ? filterStats.total : filterStats[option.value as keyof typeof filterStats];
          const isActive = filters.status === option.value;
          
          return (
            <Button
              key={option.value}
              variant={isActive ? "default" : "outline"}
              size="sm"
              onClick={() => onFilterChange("status", option.value)}
              className="h-8"
            >
              {option.label}
              <Badge variant="secondary" className="ml-2 text-xs">
                {count}
              </Badge>
            </Button>
          );
        })}
      </div>

      {/* Filtres avancés */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Filtre par classe */}
        <Select
          value={filters.classId}
          onValueChange={(value) => onFilterChange("classId", value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Toutes les classes" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL_CLASSES">Toutes les classes</SelectItem>
            {classIds.map((classId) => (
              <SelectItem key={classId} value={classId}>
                {classId}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Filtre par matière */}
        <Select
          value={filters.subjectId}
          onValueChange={(value) => onFilterChange("subjectId", value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Toutes les matières" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL_SUBJECTS">Toutes les matières</SelectItem>
            {subjectIds.map((subjectId) => (
              <SelectItem key={subjectId} value={subjectId}>
                {subjectId}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Filtre par période académique */}
        <Select
          value={filters.academicPeriodId}
          onValueChange={(value) => onFilterChange("academicPeriodId", value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Toutes les périodes" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL_PERIODS">Toutes les périodes</SelectItem>
            {academicPeriodIds.map((periodId) => (
              <SelectItem key={periodId} value={periodId}>
                {periodId}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Filtre par type d'examen */}
        <Select
          value={filters.examType}
          onValueChange={(value) => onFilterChange("examType", value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Tous les types" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL_TYPES">Tous les types</SelectItem>
            {examTypes.map((type) => (
              <SelectItem key={type} value={type}>
                {type}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Filtres de dates */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <label className="text-sm font-medium mb-2 block">Date de début</label>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-full justify-start">
                <CalendarIcon className="mr-2 w-4 h-4" />
                {filters.dateRange.start ? (
                  format(filters.dateRange.start, "dd MMM yyyy", { locale: fr })
                ) : (
                  "Sélectionner une date"
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={filters.dateRange.start || undefined}
                onSelect={(date) => handleDateRangeChange("start", date || null)}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        <div className="flex-1">
          <label className="text-sm font-medium mb-2 block">Date de fin</label>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-full justify-start">
                <CalendarIcon className="mr-2 w-4 h-4" />
                {filters.dateRange.end ? (
                  format(filters.dateRange.end, "dd MMM yyyy", { locale: fr })
                ) : (
                  "Sélectionner une date"
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={filters.dateRange.end || undefined}
                onSelect={(date) => handleDateRangeChange("end", date || null)}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>

      {/* Bouton de réinitialisation */}
      {hasActiveFilters && (
        <div className="flex justify-center">
          <Button variant="outline" size="sm" onClick={onResetFilters}>
            <X className="w-4 h-4 mr-2" />
            Réinitialiser les filtres
          </Button>
        </div>
      )}
    </div>
  );
}