"use client";

import { useState, useCallback, useEffect, useMemo } from "react";
import type {
  StudentParticipation,
  StudentExamResult,
  Exam,
} from "@/types/uml-entities";
import {
  BehavioralAnalysisService,
  type BehavioralFeatures,
  type BehavioralTrends,
  type BehavioralAlert,
  type Recommendation,
} from "../services/behavioral-analysis-service";
import {
  AcademicAnalysisService,
  type SubjectPerformances,
  type AcademicProgress,
  type AcademicRisk,
} from "../services/academic-analysis-service";

export interface UseStudentAnalyticsProps {
  studentId: string;
  academicPeriodId: string;
}

export interface UseStudentAnalyticsReturn {
  // Analyses comportementales
  behavioralAnalysis: BehavioralFeatures | null;
  behavioralTrends: BehavioralTrends | null;
  behavioralAlerts: BehavioralAlert[];

  // Analyses académiques
  academicAnalysis: SubjectPerformances | null;
  academicProgress: AcademicProgress | null;
  academicRisks: AcademicRisk[];

  // Recommandations
  recommendations: Recommendation[];

  // État et contrôle
  loading: boolean;
  error: string | null;
  lastAnalyzedAt: Date | null;
  dataQuality: {
    participationCount: number;
    examCount: number;
    confidenceScore: number;
    hasEnoughData: boolean;
  };

  // Actions analyse
  analyzeBehavior: () => Promise<void>;
  analyzeAcademicPerformance: () => Promise<void>;
  analyzeAll: () => Promise<void>;
  generateRecommendations: () => Promise<Recommendation[]>;

  // Contrôles
  refresh: () => void;
  clearError: () => void;
  reset: () => void;
}

/**
 * Hook spécialisé pour les analyses comportementales et académiques d'un élève
 */
export function useStudentAnalytics({
  studentId,
  academicPeriodId,
}: UseStudentAnalyticsProps): UseStudentAnalyticsReturn {
  // États des analyses
  const [behavioralAnalysis, setBehavioralAnalysis] =
    useState<BehavioralFeatures | null>(null);
  const [behavioralTrends, setBehavioralTrends] =
    useState<BehavioralTrends | null>(null);
  const [behavioralAlerts, setBehavioralAlerts] = useState<BehavioralAlert[]>(
    [],
  );

  const [academicAnalysis, setAcademicAnalysis] =
    useState<SubjectPerformances | null>(null);
  const [academicProgress, setAcademicProgress] =
    useState<AcademicProgress | null>(null);
  const [academicRisks, setAcademicRisks] = useState<AcademicRisk[]>([]);

  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [lastAnalyzedAt, setLastAnalyzedAt] = useState<Date | null>(null);

  // Données sources (à charger depuis les mocks/API)
  const [participations, setParticipations] = useState<StudentParticipation[]>(
    [],
  );
  const [examResults, setExamResults] = useState<StudentExamResult[]>([]);
  const [exams, setExams] = useState<Exam[]>([]);
  const [subjects, setSubjects] = useState<Array<{ id: string; name: string }>>(
    [],
  );

  // État d'erreur et de loading
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Calcul de la qualité des données
  const dataQuality = useMemo(() => {
    const participationCount = participations.length;
    const examCount = examResults.filter((r) => !r.isAbsent).length;

    // Score de confiance basé sur la quantité de données
    const participationScore = Math.min(1, participationCount / 15); // 15 participations = score optimal
    const examScore = Math.min(1, examCount / 8); // 8 examens = score optimal
    const confidenceScore = (participationScore + examScore) / 2;

    // Seuil minimum pour des analyses fiables
    const hasEnoughData = participationCount >= 5 || examCount >= 3;

    return {
      participationCount,
      examCount,
      confidenceScore: Math.round(confidenceScore * 100) / 100,
      hasEnoughData,
    };
  }, [participations, examResults]);

  // Charger les données sources au montage
  useEffect(() => {
    loadSourceData();
  }, [studentId, academicPeriodId]);

  const loadSourceData = useCallback(async () => {
    try {
      // Charger les participations depuis les mocks (pour maintenant)
      // TODO: Replace with API call when session participation endpoints are available
      const { getParticipationsForAnalysis } = await import(
        "@/features/students/mocks/mock-student-participation"
      );
      const participationsData = getParticipationsForAnalysis(studentId);
      setParticipations(participationsData);

      // Charger les résultats d'examens depuis l'API
      const { studentsClient } = await import("../api/students-client");
      const { formatDateToISO } = await import("@/utils/date-utils");

      // Get current period dates (fallback to mock period if not provided)
      const startDate = formatDateToISO(new Date("2024-09-01"));
      const endDate = formatDateToISO(new Date("2024-12-20"));

      const resultsResponse = await studentsClient.getStudentResults(
        studentId,
        {
          date_from: startDate,
          date_to: endDate,
        },
      );

      // Map API results to StudentExamResult entities
      const mappedResults: StudentExamResult[] = resultsResponse.items.map(
        (item) => {
          const maxPoints = item.max_points ?? 20;
          const points = item.points_obtained ?? 0;
          const grade = (points / maxPoints) * 20; // Normalize to /20 scale

          return {
            id: item.id,
            createdBy: "system",
            examId: item.exam_id,
            studentId: item.student_id,
            pointsObtained: points,
            grade: grade,
            gradeDisplay: `${grade.toFixed(1)}/20`,
            isAbsent: item.is_absent,
            comments: item.comments || "",
            markedAt: item.marked_at ? new Date(item.marked_at) : new Date(),
            isPassing: () => grade >= 10,
            gradeCategory: () =>
              grade >= 16
                ? "excellent"
                : grade >= 12
                  ? "good"
                  : grade >= 10
                    ? "average"
                    : "poor",
            percentage: (examTotalPoints: number) =>
              (points / examTotalPoints) * 100,
            updateDisplay: () => {}, // Not needed for analytics
          };
        },
      );

      setExamResults(mappedResults);

      // Map exams from API results
      const relatedExams: Exam[] = resultsResponse.items.map((item) => ({
        id: item.exam_id,
        createdBy: "system",
        title: item.exam_title,
        description: "",
        classId: "mock-class", // Not provided in the response
        subjectId: "mock-subject", // Would need to parse or get from elsewhere
        academicPeriodId: "period-1",
        notationSystemId: "default-system",
        examDate: new Date(item.exam_date),
        examType: "Contrôle",
        durationMinutes: 60,
        totalPoints: item.max_points ?? 20,
        coefficient: item.coefficient ?? 1,
        instructions: "",
        rubricId: undefined,
        isPublished: true,
        createdAt: new Date(),
        updatedAt: new Date(),
        publish: () => {},
        unpublish: () => {},
        calculateStatistics: () => ({}),
        addResult: () => ({}) as StudentExamResult,
      }));

      setExams(relatedExams);

      // Extract unique subjects from results
      const uniqueSubjects = new Map<string, string>();
      resultsResponse.items.forEach((item) => {
        if (item.subject_name) {
          uniqueSubjects.set(`subject-${item.subject_name}`, item.subject_name);
        }
      });

      const relatedSubjects = Array.from(uniqueSubjects.entries()).map(
        ([id, name]) => ({
          id,
          name,
        }),
      );

      setSubjects(relatedSubjects);
    } catch (err) {
      console.error("Error loading source data:", err);
      setError(
        err instanceof Error
          ? err.message
          : "Erreur lors du chargement des données",
      );
    }
  }, [studentId, academicPeriodId]);

  const analyzeBehavior = useCallback(async (): Promise<void> => {
    setIsLoading(true);
    setError(null);

    try {
      if (participations.length === 0) {
        setBehavioralAnalysis(null);
        setBehavioralTrends(null);
        setBehavioralAlerts([]);
        return;
      }

      // Analyse des patterns comportementaux
      const analysis =
        BehavioralAnalysisService.analyzeBehavioralPatterns(participations);
      setBehavioralAnalysis(analysis);

      // Calcul des tendances
      const trends =
        BehavioralAnalysisService.calculateBehavioralTrends(participations);
      setBehavioralTrends(trends);

      // Détection des alertes
      const alerts =
        BehavioralAnalysisService.detectBehavioralAlerts(participations);
      setBehavioralAlerts(alerts);

      setLastAnalyzedAt(new Date());
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Erreur lors de l'analyse comportementale";
      setError(errorMessage);
      console.error("Behavioral analysis error:", err);
    } finally {
      setIsLoading(false);
    }
  }, [participations]);

  const analyzeAcademicPerformance = useCallback(async (): Promise<void> => {
    setIsLoading(true);
    setError(null);

    try {
      if (examResults.length === 0) {
        setAcademicAnalysis(null);
        setAcademicProgress(null);
        setAcademicRisks([]);
        return;
      }

      // Analyse des performances par matière
      const analysis = AcademicAnalysisService.analyzeSubjectPerformances(
        examResults,
        exams,
        subjects,
      );
      setAcademicAnalysis(analysis);

      // Calcul de la progression académique
      const progress =
        AcademicAnalysisService.calculateAcademicProgress(examResults);
      setAcademicProgress(progress);

      // Détection des risques académiques
      const risks = AcademicAnalysisService.detectAcademicRisks(
        examResults,
        exams,
        subjects,
      );
      setAcademicRisks(risks);

      setLastAnalyzedAt(new Date());
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Erreur lors de l'analyse académique";
      setError(errorMessage);
      console.error("Academic analysis error:", err);
    } finally {
      setIsLoading(false);
    }
  }, [examResults, exams, subjects]);

  const analyzeAll = useCallback(async (): Promise<void> => {
    setIsLoading(true);
    setError(null);

    try {
      // Analyse comportementale
      if (participations.length > 0) {
        const analysis =
          BehavioralAnalysisService.analyzeBehavioralPatterns(participations);
        setBehavioralAnalysis(analysis);

        const trends =
          BehavioralAnalysisService.calculateBehavioralTrends(participations);
        setBehavioralTrends(trends);

        const alerts =
          BehavioralAnalysisService.detectBehavioralAlerts(participations);
        setBehavioralAlerts(alerts);
      } else {
        setBehavioralAnalysis(null);
        setBehavioralTrends(null);
        setBehavioralAlerts([]);
      }

      // Analyse académique
      if (examResults.length > 0) {
        const analysis = AcademicAnalysisService.analyzeSubjectPerformances(
          examResults,
          exams,
          subjects,
        );
        setAcademicAnalysis(analysis);

        const progress =
          AcademicAnalysisService.calculateAcademicProgress(examResults);
        setAcademicProgress(progress);

        const risks = AcademicAnalysisService.detectAcademicRisks(
          examResults,
          exams,
          subjects,
        );
        setAcademicRisks(risks);
      } else {
        setAcademicAnalysis(null);
        setAcademicProgress(null);
        setAcademicRisks([]);
      }

      setLastAnalyzedAt(new Date());
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Erreur lors de l'analyse globale";
      setError(errorMessage);
      console.error("Global analysis error:", err);
    } finally {
      setIsLoading(false);
    }
  }, [participations, examResults, exams, subjects]);

  const generateRecommendations = useCallback(async (): Promise<
    Recommendation[]
  > => {
    try {
      const allRecommendations: Recommendation[] = [];

      // Recommandations comportementales
      if (behavioralAnalysis) {
        const behavioralRecs =
          BehavioralAnalysisService.generateBehavioralRecommendations(
            behavioralAnalysis,
          );
        allRecommendations.push(...behavioralRecs);
      }

      // Recommandations académiques
      if (academicAnalysis) {
        const academicRecs =
          AcademicAnalysisService.generateAcademicRecommendations(
            academicAnalysis,
          );
        allRecommendations.push(...academicRecs);
      }

      // Trier par priorité (high -> medium -> low)
      const sortedRecommendations = allRecommendations.sort((a, b) => {
        const priorityOrder = { high: 3, medium: 2, low: 1 };
        return priorityOrder[b.priority] - priorityOrder[a.priority];
      });

      setRecommendations(sortedRecommendations);
      return sortedRecommendations;
    } catch (err) {
      console.error("Error generating recommendations:", err);
      return [];
    }
  }, [behavioralAnalysis, academicAnalysis]);

  const refresh = useCallback(() => {
    loadSourceData();
  }, [loadSourceData]);

  const resetAnalytics = useCallback(() => {
    setBehavioralAnalysis(null);
    setBehavioralTrends(null);
    setBehavioralAlerts([]);
    setAcademicAnalysis(null);
    setAcademicProgress(null);
    setAcademicRisks([]);
    setRecommendations([]);
    setLastAnalyzedAt(null);
    setError(null);
    setIsLoading(false);
  }, []);

  // Lancer une analyse automatique quand les données sont disponibles
  useEffect(() => {
    if (dataQuality.hasEnoughData && !isLoading && !lastAnalyzedAt) {
      analyzeAll();
    }
  }, [dataQuality.hasEnoughData, isLoading, lastAnalyzedAt, analyzeAll]);

  // Générer les recommandations automatiquement quand les analyses changent
  useEffect(() => {
    if (behavioralAnalysis || academicAnalysis) {
      generateRecommendations();
    }
  }, [behavioralAnalysis, academicAnalysis, generateRecommendations]);

  return {
    // Analyses comportementales
    behavioralAnalysis,
    behavioralTrends,
    behavioralAlerts,

    // Analyses académiques
    academicAnalysis,
    academicProgress,
    academicRisks,

    // Recommandations
    recommendations,

    // État et contrôle
    loading: isLoading,
    error,
    lastAnalyzedAt,
    dataQuality,

    // Actions analyse
    analyzeBehavior,
    analyzeAcademicPerformance,
    analyzeAll,
    generateRecommendations,

    // Contrôles
    refresh,
    clearError: () => setError(null),
    reset: resetAnalytics,
  };
}
