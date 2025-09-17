"use client";
import { useMemo } from "react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Sparkles, Clock, History, Filter, Star, MessageSquare } from "lucide-react";
import { Badge } from "@/components/atoms/badge";
import { Button } from "@/components/atoms/button";
import { Input } from "@/components/atoms/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/atoms/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/molecules/card";
import type { AppreciationContent } from "@/types/uml-entities";

export interface HistoryOption {
  id: string;
  label: string;
}

const ALL_STUDENTS_VALUE = "__all-students" as const;
const ALL_SUBJECTS_VALUE = "__all-subjects" as const;
const ALL_PERIODS_VALUE = "__all-periods" as const;
const ALL_STYLES_VALUE = "__all-styles" as const;
const ALL_STATUS_VALUE = "__all-status" as const;

export interface AppreciationHistoryFilters {

  studentId?: string;
  subjectId?: string;
  periodId?: string;
  styleGuideId?: string;
  status?: string;
  search?: string;
}

export interface AppreciationHistoryPanelProps {
  items: AppreciationContent[];
  students: HistoryOption[];
  subjects: HistoryOption[];
  periods: HistoryOption[];
  styles: HistoryOption[];
  filters: AppreciationHistoryFilters;
  onFiltersChange: (filters: AppreciationHistoryFilters) => void;
  onResetFilters: () => void;
  onReuse?: (appreciation: AppreciationContent) => void;
}

export function AppreciationHistoryPanel({
  items,
  students,
  subjects,
  periods,
  styles,
  filters,
  onFiltersChange,
  onResetFilters,
  onReuse,
}: AppreciationHistoryPanelProps) {
  const filteredItems = useMemo(() => {
    return items
      .filter((item) => {
        if (filters.studentId && item.studentId !== filters.studentId) return false;
        if (filters.subjectId && item.subjectId !== filters.subjectId) return false;
        if (filters.periodId && item.academicPeriodId !== filters.periodId) return false;
        if (filters.styleGuideId && item.styleGuideId !== filters.styleGuideId) return false;
        if (filters.status && item.status !== filters.status) return false;
        if (filters.search) {
          const haystack = `${item.content} ${(item.inputData?.studentName as string) ?? ""}`.toLowerCase();
          if (!haystack.includes(filters.search.toLowerCase())) {
            return false;
          }
        }
        return true;
      })
      .sort((a, b) => {
        const dateA = a.generatedAt ? new Date(a.generatedAt).getTime() : 0;
        const dateB = b.generatedAt ? new Date(b.generatedAt).getTime() : 0;
        return dateB - dateA;
      });
  }, [items, filters]);

  const stats = useMemo(() => {
    const validated = items.filter((item) => item.status === "validated").length;
    const favorites = items.filter((item) => item.isFavorite).length;
    return { total: items.length, validated, favorites };
  }, [items]);

  return (
    <Card className="border-primary/10 rounded-b-none">
      <CardHeader>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <CardTitle className="flex items-center gap-2">
              <History className="h-5 w-5 text-primary" />
              Historique des appréciations
            </CardTitle>
            <CardDescription>
              Retrouvez toutes les appréciations générées et filtrer par élève, matière, période ou statut.
            </CardDescription>
          </div>
          <Badge variant="outline" className="flex items-center gap-1">
            <Sparkles className="h-3.5 w-3.5" />
            {stats.total} générées
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <Input
            placeholder="Rechercher dans les appréciations"
            value={filters.search ?? ""}
            onChange={(event) => onFiltersChange({ ...filters, search: event.target.value })}
            className="max-w-md"
          />

          <div className="flex flex-wrap items-center gap-3">
            <Select
              value={filters.studentId ?? ALL_STUDENTS_VALUE}
              onValueChange={(value) => onFiltersChange({ ...filters, studentId: value === ALL_STUDENTS_VALUE ? undefined : value })}
            >
              <SelectTrigger className="w-auto min-w-[140px]">
                <SelectValue placeholder="Élèves" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={ALL_STUDENTS_VALUE}>Tous les élèves</SelectItem>
                {students.map((student) => (
                  <SelectItem key={student.id} value={student.id}>
                    {student.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={filters.subjectId ?? ALL_SUBJECTS_VALUE}
              onValueChange={(value) => onFiltersChange({ ...filters, subjectId: value === ALL_SUBJECTS_VALUE ? undefined : value })}
            >
              <SelectTrigger className="w-auto min-w-[120px]">
                <SelectValue placeholder="Matières" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={ALL_SUBJECTS_VALUE}>Toutes matières</SelectItem>
                {subjects.map((subject) => (
                  <SelectItem key={subject.id} value={subject.id}>
                    {subject.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={filters.periodId ?? ALL_PERIODS_VALUE}
              onValueChange={(value) => onFiltersChange({ ...filters, periodId: value === ALL_PERIODS_VALUE ? undefined : value })}
            >
              <SelectTrigger className="w-auto min-w-[120px]">
                <SelectValue placeholder="Périodes" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={ALL_PERIODS_VALUE}>Toutes périodes</SelectItem>
                {periods.map((period) => (
                  <SelectItem key={period.id} value={period.id}>
                    {period.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={filters.styleGuideId ?? ALL_STYLES_VALUE}
              onValueChange={(value) => onFiltersChange({ ...filters, styleGuideId: value === ALL_STYLES_VALUE ? undefined : value })}
            >
              <SelectTrigger className="w-auto min-w-[100px]">
                <SelectValue placeholder="Styles" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={ALL_STYLES_VALUE}>Tous styles</SelectItem>
                {styles.map((style) => (
                  <SelectItem key={style.id} value={style.id}>
                    {style.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={filters.status ?? ALL_STATUS_VALUE}
              onValueChange={(value) => onFiltersChange({ ...filters, status: value === ALL_STATUS_VALUE ? undefined : value })}
            >
              <SelectTrigger className="w-auto min-w-[100px]">
                <SelectValue placeholder="Statuts" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={ALL_STATUS_VALUE}>Tous statuts</SelectItem>
                <SelectItem value="validated">Validées</SelectItem>
                <SelectItem value="draft">Brouillons</SelectItem>
              </SelectContent>
            </Select>

            <Button variant="ghost" onClick={onResetFilters} className="ml-auto">
              <Filter className="h-4 w-4 mr-2" />
              Réinitialiser
            </Button>
          </div>
        </div>

        <div className="grid gap-4">
          {filteredItems.length === 0 ? (
            <div className="rounded-lg border border-dashed p-6 text-center text-sm text-muted-foreground">
              <MessageSquare className="mx-auto mb-3 h-8 w-8 opacity-60" />
              Aucun résultat pour ces filtres. Ajustez vos critères ou générez une nouvelle appréciation.
            </div>
          ) : (
            filteredItems.map((item) => {
              const generatedAt = item.generatedAt
                ? format(new Date(item.generatedAt), "d MMM yyyy 'à' HH:mm", { locale: fr })
                : "Date inconnue";

              const studentName = typeof item.inputData?.studentName === "string"
                ? item.inputData.studentName
                : undefined;

              return (
                <div key={item.id} className="rounded-xl border bg-background/70 p-4 shadow-sm">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="h-3.5 w-3.5" />
                        {generatedAt}
                      </div>
                      <div className="flex flex-wrap items-center gap-2">
                        {studentName && (
                          <Badge variant="secondary">{studentName}</Badge>
                        )}
                        {item.subjectId && (
                          <Badge variant="outline">{item.subjectId}</Badge>
                        )}
                        {item.academicPeriodId && (
                          <Badge variant="outline">{item.academicPeriodId}</Badge>
                        )}
                        {item.styleGuideId && (
                          <Badge variant="outline">{item.styleGuideId}</Badge>
                        )}
                        {item.isFavorite && (
                          <Badge variant="outline" className="flex items-center gap-1">
                            <Star className="h-3 w-3" />
                            Favori
                          </Badge>
                        )}
                      </div>
                    </div>
                    {onReuse && (
                      <Button variant="outline" size="sm" onClick={() => onReuse(item)}>
                        <Sparkles className="mr-1.5 h-4 w-4" />
                        Réutiliser
                      </Button>
                    )}
                  </div>
                  <p className="mt-3 text-sm text-foreground/90 leading-relaxed">
                    {item.content}
                  </p>
                </div>
              );
            })
          )}
        </div>
      </CardContent>
    </Card>
  );
}
