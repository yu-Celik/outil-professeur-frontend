"use client";

import { useState, useMemo, useCallback } from "react";
import type { Exam } from "@/types/uml-entities";
import { useTeachingAssignments } from "@/hooks/use-teaching-assignments";

export type ExamSortField = "title" | "examDate" | "examType" | "classId" | "subjectId" | "createdAt";
export type SortDirection = "asc" | "desc";
export type ExamStatusFilter = "all" | "published" | "unpublished" | "upcoming" | "past";

export interface ExamFilters {
  search: string;
  classId: string;
  subjectId: string;
  academicPeriodId: string;
  examType: string;
  status: ExamStatusFilter;
  dateRange: {
    start: Date | null;
    end: Date | null;
  };
}

export interface ExamSort {
  field: ExamSortField;
  direction: SortDirection;
}

const defaultFilters: ExamFilters = {
  search: "",
  classId: "",
  subjectId: "",
  academicPeriodId: "",
  examType: "",
  status: "all",
  dateRange: {
    start: null,
    end: null,
  },
};

const defaultSort: ExamSort = {
  field: "examDate",
  direction: "desc",
};

export function useExamFilters(exams: Exam[], teacherId: string = "KsmNtVf4zwqO3VV3SQJqPrRlQBA1fFyR") {
  const [filters, setFilters] = useState<ExamFilters>(defaultFilters);
  const [sort, setSort] = useState<ExamSort>(defaultSort);
  
  // Obtenir les autorisations du professeur
  const { assignments } = useTeachingAssignments(teacherId);

  // Application des filtres
  const filteredExams = useMemo(() => {
    let result = [...exams];

    // Filtre par recherche textuelle
    if (filters.search.trim()) {
      const searchLower = filters.search.toLowerCase();
      result = result.filter(exam =>
        exam.title.toLowerCase().includes(searchLower) ||
        exam.description.toLowerCase().includes(searchLower) ||
        exam.examType.toLowerCase().includes(searchLower)
      );
    }

    // Filtre par classe
    if (filters.classId && filters.classId !== "ALL_CLASSES") {
      result = result.filter(exam => exam.classId === filters.classId);
    }

    // Filtre par matière
    if (filters.subjectId && filters.subjectId !== "ALL_SUBJECTS") {
      result = result.filter(exam => exam.subjectId === filters.subjectId);
    }

    // Filtre par période académique
    if (filters.academicPeriodId && filters.academicPeriodId !== "ALL_PERIODS") {
      result = result.filter(exam => exam.academicPeriodId === filters.academicPeriodId);
    }

    // Filtre par type d'examen
    if (filters.examType && filters.examType !== "ALL_TYPES") {
      result = result.filter(exam => exam.examType === filters.examType);
    }

    // Filtre par statut
    const now = new Date();
    switch (filters.status) {
      case "published":
        result = result.filter(exam => exam.isPublished);
        break;
      case "unpublished":
        result = result.filter(exam => !exam.isPublished);
        break;
      case "upcoming":
        result = result.filter(exam => exam.examDate >= now);
        break;
      case "past":
        result = result.filter(exam => exam.examDate < now);
        break;
      // "all" ne filtre rien
    }

    // Filtre par plage de dates
    if (filters.dateRange.start) {
      result = result.filter(exam => exam.examDate >= filters.dateRange.start!);
    }
    if (filters.dateRange.end) {
      result = result.filter(exam => exam.examDate <= filters.dateRange.end!);
    }

    return result;
  }, [exams, filters]);

  // Application du tri
  const sortedExams = useMemo(() => {
    const result = [...filteredExams];
    
    result.sort((a, b) => {
      let aValue: any;
      let bValue: any;

      switch (sort.field) {
        case "title":
          aValue = a.title.toLowerCase();
          bValue = b.title.toLowerCase();
          break;
        case "examDate":
          aValue = a.examDate.getTime();
          bValue = b.examDate.getTime();
          break;
        case "examType":
          aValue = a.examType.toLowerCase();
          bValue = b.examType.toLowerCase();
          break;
        case "classId":
          aValue = a.classId;
          bValue = b.classId;
          break;
        case "subjectId":
          aValue = a.subjectId;
          bValue = b.subjectId;
          break;
        case "createdAt":
          aValue = a.createdAt.getTime();
          bValue = b.createdAt.getTime();
          break;
        default:
          return 0;
      }

      if (aValue < bValue) {
        return sort.direction === "asc" ? -1 : 1;
      }
      if (aValue > bValue) {
        return sort.direction === "asc" ? 1 : -1;
      }
      return 0;
    });

    return result;
  }, [filteredExams, sort]);

  // Fonctions de mise à jour des filtres
  const updateFilter = useCallback(<K extends keyof ExamFilters>(
    key: K,
    value: ExamFilters[K]
  ) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
    }));
  }, []);

  const updateSort = useCallback((field: ExamSortField, direction?: SortDirection) => {
    setSort(prev => ({
      field,
      direction: direction || (prev.field === field && prev.direction === "asc" ? "desc" : "asc"),
    }));
  }, []);

  const resetFilters = useCallback(() => {
    setFilters(defaultFilters);
  }, []);

  const resetSort = useCallback(() => {
    setSort(defaultSort);
  }, []);

  // Statistiques sur les résultats filtrés
  const filterStats = useMemo(() => {
    const now = new Date();
    return {
      total: filteredExams.length,
      published: filteredExams.filter(e => e.isPublished).length,
      unpublished: filteredExams.filter(e => !e.isPublished).length,
      upcoming: filteredExams.filter(e => e.examDate >= now).length,
      past: filteredExams.filter(e => e.examDate < now).length,
    };
  }, [filteredExams]);

  // Types d'examens uniques pour les filtres
  const examTypes = useMemo(() => {
    const types = new Set(exams.map(exam => exam.examType));
    return Array.from(types).sort();
  }, [exams]);

  // Classes autorisées pour le professeur (uniquement celles qu'il enseigne)
  const classIds = useMemo(() => {
    const authorizedClasses = new Set(assignments.map(assignment => assignment.classId));
    const examClasses = new Set(exams.map(exam => exam.classId));
    // Intersection: seulement les classes où le professeur enseigne ET a des examens
    const filteredClasses = Array.from(examClasses).filter(classId => authorizedClasses.has(classId));
    return filteredClasses.sort();
  }, [exams, assignments]);

  // Matières autorisées pour le professeur (uniquement celles qu'il enseigne)
  const subjectIds = useMemo(() => {
    const authorizedSubjects = new Set(assignments.map(assignment => assignment.subjectId));
    // Ne montrer que les matières que le professeur est autorisé à enseigner
    return Array.from(authorizedSubjects).sort();
  }, [assignments]);

  // Périodes académiques uniques pour les filtres (basé sur les examens existants)
  const academicPeriodIds = useMemo(() => {
    const periods = new Set(exams.map(exam => exam.academicPeriodId));
    return Array.from(periods).sort();
  }, [exams]);

  return {
    // Résultats
    filteredExams: sortedExams,
    
    // État des filtres
    filters,
    sort,
    filterStats,
    
    // Fonctions de mise à jour
    updateFilter,
    updateSort,
    resetFilters,
    resetSort,
    
    // Options pour les filtres
    examTypes,
    classIds,
    subjectIds,
    academicPeriodIds,
    
    // Helpers
    hasActiveFilters: Object.values(filters).some(value => {
      if (typeof value === 'string') return value !== '';
      if (typeof value === 'object' && value !== null) {
        return Object.values(value).some(v => v !== null);
      }
      return false;
    }),
    
    isEmpty: sortedExams.length === 0,
    isFiltered: sortedExams.length !== exams.length,
  };
}