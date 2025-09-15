"use client";

import { useState, useCallback } from "react";
import { useNotationSystem } from "@/features/evaluations/hooks";
import type { StudentExamResult, Exam, Student } from "@/types/uml-entities";

interface GradeChangeHistory {
  id: string;
  resultId: string;
  previousGrade: number | null;
  newGrade: number | null;
  previousAbsent: boolean;
  newAbsent: boolean;
  changedBy: string;
  changeReason?: string;
  changedAt: Date;
}

interface GradeStatistics {
  count: number;
  average: number;
  median: number;
  min: number;
  max: number;
  passRate: number;
  distribution: Record<string, number>;
}

export function useGradeManagement(teacherId: string) {
  const { validateGrade, formatGrade, defaultSystem } = useNotationSystem();
  const [gradeHistory, setGradeHistory] = useState<GradeChangeHistory[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Save or update a grade
  const saveGrade = useCallback(async (
    studentId: string,
    examId: string,
    gradeData: Partial<StudentExamResult>
  ): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);

    try {
      // Validate grade if not absent
      if (!gradeData.isAbsent && gradeData.grade !== null && gradeData.grade !== undefined) {
        if (!validateGrade(gradeData.grade)) {
          return { success: false, error: "Note invalide selon le système de notation" };
        }
      }

      // TODO: In real implementation, save to database
      // For now, we'll simulate the save operation

      // Create history entry
      const historyEntry: GradeChangeHistory = {
        id: crypto.randomUUID(),
        resultId: `${studentId}-${examId}`,
        previousGrade: null, // TODO: Get from existing result
        newGrade: gradeData.grade || null,
        previousAbsent: false, // TODO: Get from existing result
        newAbsent: gradeData.isAbsent || false,
        changedBy: teacherId,
        changedAt: new Date(),
      };

      setGradeHistory(prev => [historyEntry, ...prev]);

      return { success: true };
    } catch (error) {
      return { success: false, error: "Erreur lors de la sauvegarde" };
    } finally {
      setIsLoading(false);
    }
  }, [teacherId, validateGrade]);

  // Calculate statistics for a set of results
  const calculateStatistics = useCallback((results: StudentExamResult[]): GradeStatistics => {
    const validResults = results.filter(r => !r.isAbsent && r.grade !== null);

    if (validResults.length === 0) {
      return {
        count: 0,
        average: 0,
        median: 0,
        min: 0,
        max: 0,
        passRate: 0,
        distribution: {},
      };
    }

    const grades = validResults.map(r => r.grade).sort((a, b) => a - b);
    const count = grades.length;
    const sum = grades.reduce((acc, grade) => acc + grade, 0);
    const average = sum / count;
    const median = count % 2 === 0
      ? (grades[count / 2 - 1] + grades[count / 2]) / 2
      : grades[Math.floor(count / 2)];
    const min = grades[0];
    const max = grades[grades.length - 1];
    const passingGrades = grades.filter(grade => grade >= 10);
    const passRate = (passingGrades.length / count) * 100;

    // Calculate distribution by grade ranges
    const distribution = {
      "0-5": 0,
      "5-10": 0,
      "10-12": 0,
      "12-14": 0,
      "14-16": 0,
      "16-18": 0,
      "18-20": 0,
    };

    grades.forEach(grade => {
      if (grade < 5) distribution["0-5"]++;
      else if (grade < 10) distribution["5-10"]++;
      else if (grade < 12) distribution["10-12"]++;
      else if (grade < 14) distribution["12-14"]++;
      else if (grade < 16) distribution["14-16"]++;
      else if (grade < 18) distribution["16-18"]++;
      else distribution["18-20"]++;
    });

    return {
      count,
      average: Math.round(average * 100) / 100,
      median: Math.round(median * 100) / 100,
      min,
      max,
      passRate: Math.round(passRate * 100) / 100,
      distribution,
    };
  }, []);

  // Auto-calculate grade from points
  const calculateGradeFromPoints = useCallback((
    pointsObtained: number,
    exam: Exam
  ): number => {
    if (!defaultSystem || !exam.totalPoints) return 0;

    const percentage = pointsObtained / exam.totalPoints;
    const grade = percentage * defaultSystem.maxValue;

    return Math.round(grade * 100) / 100;
  }, [defaultSystem]);

  // Calculate points from grade
  const calculatePointsFromGrade = useCallback((
    grade: number,
    exam: Exam
  ): number => {
    if (!defaultSystem || !exam.totalPoints) return 0;

    const percentage = grade / defaultSystem.maxValue;
    const points = percentage * exam.totalPoints;

    return Math.round(points * 100) / 100;
  }, [defaultSystem]);

  // Get grade change history for a specific result
  const getGradeHistory = useCallback((resultId: string): GradeChangeHistory[] => {
    return gradeHistory.filter(entry => entry.resultId === resultId);
  }, [gradeHistory]);

  // Validate multiple grades (bulk validation)
  const validateBulkGrades = useCallback((
    grades: Array<{ grade: number | null; isAbsent: boolean }>
  ): Array<{ isValid: boolean; error?: string }> => {
    return grades.map(({ grade, isAbsent }) => {
      if (isAbsent) return { isValid: true };
      if (grade === null || grade === undefined) return { isValid: false, error: "Note manquante" };
      if (!validateGrade(grade)) return { isValid: false, error: "Note invalide" };
      return { isValid: true };
    });
  }, [validateGrade]);

  return {
    // CRUD operations
    saveGrade,
    isLoading,

    // Statistics
    calculateStatistics,

    // Calculations
    calculateGradeFromPoints,
    calculatePointsFromGrade,

    // History
    gradeHistory,
    getGradeHistory,

    // Validation
    validateBulkGrades,

    // Utility
    formatGrade: (grade: number) => defaultSystem ? formatGrade(grade, defaultSystem) : grade.toString(),
  };
}