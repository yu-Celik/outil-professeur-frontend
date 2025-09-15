"use client";

import { useState, useCallback, useEffect } from "react";
import type { Exam, StudentExamResult, NotationSystem } from "@/types/uml-entities";
import {
  getExamsByTeacher,
  getExamsByClass,
  getExamsBySubject,
  getExamsByAcademicPeriod,
  getExamResults,
  getExamById,
  calculateExamStatistics,
  MOCK_EXAMS,
  MOCK_STUDENT_EXAM_RESULTS,
} from "@/data";
import { useNotationSystem } from "./use-notation-system";

export interface ExamFormData {
  title: string;
  description: string;
  classId: string;
  subjectId: string;
  academicPeriodId: string;
  notationSystemId: string;
  examDate: Date;
  examType: string;
  durationMinutes: number;
  totalPoints: number;
  coefficient: number;
  instructions: string;
  rubricId?: string;
}

export interface StudentExamResultFormData {
  studentId: string;
  pointsObtained: number;
  isAbsent: boolean;
  comments: string;
}

export interface ExamStatistics {
  totalStudents: number;
  submittedCount: number;
  absentCount: number;
  averageGrade: number;
  medianGrade: number;
  minGrade: number;
  maxGrade: number;
  passRate: number;
}

export function useExamManagement(teacherId: string = "KsmNtVf4zwqO3VV3SQJqPrRlQBA1fFyR") {
  const [exams, setExams] = useState<Exam[]>([]);
  const [examResults, setExamResults] = useState<StudentExamResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const { defaultSystem, notationSystems } = useNotationSystem();

  // Chargement initial des données
  useEffect(() => {
    try {
      const teacherExams = getExamsByTeacher(teacherId);
      setExams(teacherExams);
      setExamResults(MOCK_STUDENT_EXAM_RESULTS);
      setLoading(false);
    } catch (err) {
      setError("Erreur lors du chargement des examens");
      setLoading(false);
    }
  }, [teacherId]);

  // Création d'un nouvel examen
  const createExam = useCallback(async (data: ExamFormData): Promise<Exam> => {
    try {
      const newExam: Exam = {
        id: `exam-${Date.now()}`,
        createdBy: teacherId,
        title: data.title,
        description: data.description,
        classId: data.classId,
        subjectId: data.subjectId,
        academicPeriodId: data.academicPeriodId,
        notationSystemId: data.notationSystemId,
        examDate: data.examDate,
        examType: data.examType,
        durationMinutes: data.durationMinutes,
        totalPoints: data.totalPoints,
        coefficient: data.coefficient,
        instructions: data.instructions,
        rubricId: data.rubricId,
        isPublished: false,
        createdAt: new Date(),
        updatedAt: new Date(),
        publish: function() {
          this.isPublished = true;
          this.updatedAt = new Date();
        },
        unpublish: function() {
          this.isPublished = false;
          this.updatedAt = new Date();
        },
        calculateStatistics: function() {
          return calculateExamStatistics(this.id);
        },
        addResult: function(studentId: string, points: number): StudentExamResult {
          const resultId = `result-${this.id}-${studentId}-${Date.now()}`;
          const notationSystem = notationSystems.find(ns => ns.id === this.notationSystemId) || defaultSystem;
          
          const result: StudentExamResult = {
            id: resultId,
            createdBy: teacherId,
            examId: this.id,
            studentId,
            pointsObtained: points,
            grade: points, // Même valeur pour simplifier
            gradeDisplay: notationSystem?.formatDisplay(points, "fr-FR") || points.toString(),
            isAbsent: false,
            comments: "",
            markedAt: new Date(),
            isPassing: function(system) {
              return this.grade >= system.minValue + (system.maxValue - system.minValue) * 0.5;
            },
            gradeCategory: function(system) {
              const percentage = (this.grade - system.minValue) / (system.maxValue - system.minValue) * 100;
              if (percentage >= 80) return "Excellent";
              if (percentage >= 60) return "Bien";
              if (percentage >= 40) return "Satisfaisant";
              return "Insuffisant";
            },
            percentage: function(examTotalPoints) {
              return (this.pointsObtained / examTotalPoints) * 100;
            },
            updateDisplay: function(system, locale) {
              this.gradeDisplay = system.formatDisplay(this.grade, locale);
            },
          };

          return result;
        },
      };

      MOCK_EXAMS.push(newExam);
      setExams(prev => [...prev, newExam]);
      return newExam;
    } catch (err) {
      setError("Erreur lors de la création de l'examen");
      throw err;
    }
  }, [teacherId, notationSystems, defaultSystem]);

  // Mise à jour d'un examen
  const updateExam = useCallback(async (examId: string, data: Partial<ExamFormData>): Promise<Exam> => {
    try {
      const examIndex = MOCK_EXAMS.findIndex(e => e.id === examId);
      if (examIndex === -1) {
        throw new Error("Examen non trouvé");
      }

      const updatedExam = {
        ...MOCK_EXAMS[examIndex],
        ...data,
        updatedAt: new Date(),
      };

      MOCK_EXAMS[examIndex] = updatedExam;
      setExams(prev => prev.map(e => e.id === examId ? updatedExam : e));
      
      return updatedExam;
    } catch (err) {
      setError("Erreur lors de la mise à jour de l'examen");
      throw err;
    }
  }, []);

  // Suppression d'un examen
  const deleteExam = useCallback(async (examId: string): Promise<void> => {
    try {
      const examIndex = MOCK_EXAMS.findIndex(e => e.id === examId);
      if (examIndex === -1) {
        throw new Error("Examen non trouvé");
      }

      // Supprimer aussi les résultats associés
      const resultIndices = MOCK_STUDENT_EXAM_RESULTS
        .map((result, index) => result.examId === examId ? index : -1)
        .filter(index => index !== -1)
        .sort((a, b) => b - a); // Trier en ordre décroissant pour supprimer sans affecter les indices

      resultIndices.forEach(index => {
        MOCK_STUDENT_EXAM_RESULTS.splice(index, 1);
      });

      MOCK_EXAMS.splice(examIndex, 1);
      setExams(prev => prev.filter(e => e.id !== examId));
      setExamResults(prev => prev.filter(r => r.examId !== examId));
    } catch (err) {
      setError("Erreur lors de la suppression de l'examen");
      throw err;
    }
  }, []);

  // Publication/dépublication d'un examen
  const toggleExamPublication = useCallback(async (examId: string): Promise<void> => {
    try {
      const exam = MOCK_EXAMS.find(e => e.id === examId);
      if (!exam) {
        throw new Error("Examen non trouvé");
      }

      if (exam.isPublished) {
        exam.unpublish();
      } else {
        exam.publish();
      }

      setExams(prev => prev.map(e => e.id === examId ? exam : e));
    } catch (err) {
      setError("Erreur lors de la publication de l'examen");
      throw err;
    }
  }, []);

  // Ajouter un résultat d'examen
  const addExamResult = useCallback(async (examId: string, data: StudentExamResultFormData): Promise<StudentExamResult> => {
    try {
      const exam = MOCK_EXAMS.find(e => e.id === examId);
      if (!exam) {
        throw new Error("Examen non trouvé");
      }

      const notationSystem = notationSystems.find(ns => ns.id === exam.notationSystemId) || defaultSystem;
      const resultId = `result-${examId}-${data.studentId}-${Date.now()}`;
      
      const newResult: StudentExamResult = {
        id: resultId,
        createdBy: teacherId,
        examId,
        studentId: data.studentId,
        pointsObtained: data.isAbsent ? 0 : data.pointsObtained,
        grade: data.isAbsent ? 0 : data.pointsObtained,
        gradeDisplay: data.isAbsent 
          ? "Absent" 
          : notationSystem?.formatDisplay(data.pointsObtained, "fr-FR") || data.pointsObtained.toString(),
        isAbsent: data.isAbsent,
        comments: data.comments,
        markedAt: new Date(),
        isPassing: function(system) {
          return !this.isAbsent && this.grade >= system.minValue + (system.maxValue - system.minValue) * 0.5;
        },
        gradeCategory: function(system) {
          if (this.isAbsent) return "Absent";
          const percentage = (this.grade - system.minValue) / (system.maxValue - system.minValue) * 100;
          if (percentage >= 80) return "Excellent";
          if (percentage >= 60) return "Bien";
          if (percentage >= 40) return "Satisfaisant";
          return "Insuffisant";
        },
        percentage: function(examTotalPoints) {
          if (this.isAbsent) return 0;
          return (this.pointsObtained / examTotalPoints) * 100;
        },
        updateDisplay: function(system, locale) {
          if (this.isAbsent) {
            this.gradeDisplay = "Absent";
          } else {
            this.gradeDisplay = system.formatDisplay(this.grade, locale);
          }
        },
      };

      MOCK_STUDENT_EXAM_RESULTS.push(newResult);
      setExamResults(prev => [...prev, newResult]);
      
      return newResult;
    } catch (err) {
      setError("Erreur lors de l'ajout du résultat");
      throw err;
    }
  }, [teacherId, notationSystems, defaultSystem]);

  // Mise à jour d'un résultat d'examen
  const updateExamResult = useCallback(async (resultId: string, data: Partial<StudentExamResultFormData>): Promise<StudentExamResult> => {
    try {
      const resultIndex = MOCK_STUDENT_EXAM_RESULTS.findIndex(r => r.id === resultId);
      if (resultIndex === -1) {
        throw new Error("Résultat non trouvé");
      }

      const existing = MOCK_STUDENT_EXAM_RESULTS[resultIndex];
      const exam = MOCK_EXAMS.find(e => e.id === existing.examId);
      const notationSystem = notationSystems.find(ns => ns.id === exam?.notationSystemId) || defaultSystem;

      const updatedResult = {
        ...existing,
        ...data,
        grade: data.isAbsent ? 0 : (data.pointsObtained ?? existing.pointsObtained),
        gradeDisplay: data.isAbsent 
          ? "Absent" 
          : notationSystem?.formatDisplay(data.pointsObtained ?? existing.pointsObtained, "fr-FR") 
            || (data.pointsObtained ?? existing.pointsObtained).toString(),
      };

      MOCK_STUDENT_EXAM_RESULTS[resultIndex] = updatedResult;
      setExamResults(prev => prev.map(r => r.id === resultId ? updatedResult : r));
      
      return updatedResult;
    } catch (err) {
      setError("Erreur lors de la mise à jour du résultat");
      throw err;
    }
  }, [notationSystems, defaultSystem]);

  // Fonctions utilitaires
  const getExamsByClassId = useCallback((classId: string) => {
    return exams.filter(exam => exam.classId === classId);
  }, [exams]);

  const getExamsBySubjectId = useCallback((subjectId: string) => {
    return exams.filter(exam => exam.subjectId === subjectId);
  }, [exams]);

  const getExamsByAcademicPeriodId = useCallback((academicPeriodId: string) => {
    return exams.filter(exam => exam.academicPeriodId === academicPeriodId);
  }, [exams]);

  const getResultsForExam = useCallback((examId: string) => {
    return examResults.filter(result => result.examId === examId);
  }, [examResults]);

  const getResultsForStudent = useCallback((studentId: string) => {
    return examResults.filter(result => result.studentId === studentId);
  }, [examResults]);

  const getExamStatistics = useCallback((examId: string): ExamStatistics => {
    return calculateExamStatistics(examId);
  }, []);

  // Validation des formulaires
  const validateExamForm = useCallback((data: ExamFormData) => {
    const errors: Partial<Record<keyof ExamFormData, string>> = {};

    if (!data.title?.trim()) {
      errors.title = "Le titre est requis";
    }

    if (!data.classId) {
      errors.classId = "La classe est requise";
    }

    if (!data.subjectId) {
      errors.subjectId = "La matière est requise";
    }

    if (!data.academicPeriodId) {
      errors.academicPeriodId = "La période académique est requise";
    }

    if (!data.notationSystemId) {
      errors.notationSystemId = "Le système de notation est requis";
    }

    if (data.durationMinutes <= 0) {
      errors.durationMinutes = "La durée doit être positive";
    }

    if (data.totalPoints <= 0) {
      errors.totalPoints = "Le total de points doit être positif";
    }

    if (data.coefficient <= 0) {
      errors.coefficient = "Le coefficient doit être positif";
    }

    return errors;
  }, []);

  const validateResultForm = useCallback((data: StudentExamResultFormData, examId: string) => {
    const errors: Partial<Record<keyof StudentExamResultFormData, string>> = {};

    if (!data.studentId) {
      errors.studentId = "L'étudiant est requis";
    }

    if (!data.isAbsent) {
      const exam = MOCK_EXAMS.find(e => e.id === examId);
      if (exam && (data.pointsObtained < 0 || data.pointsObtained > exam.totalPoints)) {
        errors.pointsObtained = `Les points doivent être entre 0 et ${exam.totalPoints}`;
      }
    }

    return errors;
  }, []);

  return {
    // État
    exams,
    examResults,
    loading,
    error,

    // Opérations CRUD - Examens
    createExam,
    updateExam,
    deleteExam,
    toggleExamPublication,

    // Opérations CRUD - Résultats
    addExamResult,
    updateExamResult,

    // Fonctions utilitaires
    getExamsByClassId,
    getExamsBySubjectId,
    getExamsByAcademicPeriodId,
    getResultsForExam,
    getResultsForStudent,
    getExamStatistics,

    // Validation
    validateExamForm,
    validateResultForm,

    // État managé
    refresh: () => {
      const teacherExams = getExamsByTeacher(teacherId);
      setExams(teacherExams);
      setExamResults(MOCK_STUDENT_EXAM_RESULTS);
    },

    // Getters
    getExamById: (examId: string) => exams.find(e => e.id === examId),
  };
}

// Hook spécialisé pour les statistiques d'examens
export function useExamStatistics(examId: string) {
  const [stats, setStats] = useState<ExamStatistics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (examId) {
      const statistics = calculateExamStatistics(examId);
      setStats(statistics);
      setLoading(false);
    }
  }, [examId]);

  return { stats, loading };
}