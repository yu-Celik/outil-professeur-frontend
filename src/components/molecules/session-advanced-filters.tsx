"use client";

import { useState } from "react";
import { Filter, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/atoms/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/atoms/select";

interface SessionAdvancedFiltersProps {
  onFilterChange?: (filters: {
    status?: string;
    type?: string;
    dateRange?: string;
  }) => void;
}

export function SessionAdvancedFilters({
  onFilterChange,
}: SessionAdvancedFiltersProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [filters, setFilters] = useState({
    status: "all",
    type: "all",
    dateRange: "all",
  });

  const handleFilterChange = (key: string, value: string) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange?.(newFilters);
  };

  const hasActiveFilters = Object.values(filters).some(
    (value) => value !== "all",
  );

  return (
    <div className="border border-border/50 rounded-lg bg-muted/20">
      {/* En-tête des filtres */}
      <Button
        variant="ghost"
        onClick={() => setIsExpanded(!isExpanded)}
        className={`w-full justify-between p-3 h-auto rounded-lg ${
          hasActiveFilters ? "text-primary" : "text-muted-foreground"
        }`}
      >
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4" />
          <span className="text-sm font-medium">
            Filtres avancés
            {hasActiveFilters && (
              <span className="ml-1 text-xs bg-primary text-primary-foreground px-1.5 py-0.5 rounded-full">
                Actifs
              </span>
            )}
          </span>
        </div>
        {isExpanded ? (
          <ChevronUp className="h-4 w-4" />
        ) : (
          <ChevronDown className="h-4 w-4" />
        )}
      </Button>

      {/* Contenu des filtres */}
      {isExpanded && (
        <div className="p-4 pt-2 space-y-4 border-t border-border/30">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Filtre par statut */}
            <div className="space-y-2">
              <label className="text-xs font-medium text-foreground">
                Statut des séances
              </label>
              <Select
                value={filters.status}
                onValueChange={(value) => handleFilterChange("status", value)}
              >
                <SelectTrigger className="h-8 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes</SelectItem>
                  <SelectItem value="planned">Planifiées</SelectItem>
                  <SelectItem value="done">Terminées</SelectItem>
                  <SelectItem value="cancelled">Annulées</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Filtre par type */}
            <div className="space-y-2">
              <label className="text-xs font-medium text-foreground">
                Type de séance
              </label>
              <Select
                value={filters.type}
                onValueChange={(value) => handleFilterChange("type", value)}
              >
                <SelectTrigger className="h-8 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous types</SelectItem>
                  <SelectItem value="normal">Normales</SelectItem>
                  <SelectItem value="makeup">Rattrapages</SelectItem>
                  <SelectItem value="moved">Déplacées</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Filtre par période */}
            <div className="space-y-2">
              <label className="text-xs font-medium text-foreground">
                Période
              </label>
              <Select
                value={filters.dateRange}
                onValueChange={(value) =>
                  handleFilterChange("dateRange", value)
                }
              >
                <SelectTrigger className="h-8 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes</SelectItem>
                  <SelectItem value="past">Passées</SelectItem>
                  <SelectItem value="today">Aujourd'hui</SelectItem>
                  <SelectItem value="upcoming">À venir</SelectItem>
                  <SelectItem value="this-week">Cette semaine</SelectItem>
                  <SelectItem value="this-month">Ce mois</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Actions */}
          {hasActiveFilters && (
            <div className="flex justify-end pt-2 border-t border-border/20">
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  const resetFilters = {
                    status: "all",
                    type: "all",
                    dateRange: "all",
                  };
                  setFilters(resetFilters);
                  onFilterChange?.(resetFilters);
                }}
                className="text-xs"
              >
                Réinitialiser
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
