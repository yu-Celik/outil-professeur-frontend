import { useState, useCallback } from "react";
import type { Student, Class } from "@/types/uml-entities";
import { MOCK_STUDENTS } from "@/data/mock-students";
import { MOCK_CLASSES } from "@/data/mock-classes";

interface StudentFormData {
  firstName: string;
  lastName: string;
  currentClassId: string;
  needs: string[];
  observations: string[];
  strengths: string[];
  improvementAxes: string[];
}

interface UseStudentManagementReturn {
  students: Student[];
  classes: Class[];
  loading: boolean;
  error: string | null;
  createStudent: (data: StudentFormData) => Promise<Student>;
  updateStudent: (id: string, data: StudentFormData) => Promise<Student>;
  deleteStudent: (id: string) => Promise<void>;
  getStudentById: (id: string) => Student | undefined;
  getStudentsByClass: (classId: string) => Student[];
  transferStudent: (studentId: string, newClassId: string) => Promise<Student>;
}

export function useStudentManagement(): UseStudentManagementReturn {
  const [students, setStudents] = useState<Student[]>(MOCK_STUDENTS);
  const [classes] = useState<Class[]>(MOCK_CLASSES);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createStudent = useCallback(async (data: StudentFormData): Promise<Student> => {
    setLoading(true);
    setError(null);

    try {
      // Simuler un délai API
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Vérifier que la classe existe
      const classExists = classes.find((cls) => cls.id === data.currentClassId);
      if (!classExists) {
        throw new Error("La classe sélectionnée n'existe pas");
      }

      // Vérifier la duplication
      const exists = students.some(
        (student) => 
          student.firstName.toLowerCase() === data.firstName.toLowerCase() &&
          student.lastName.toLowerCase() === data.lastName.toLowerCase() &&
          student.currentClassId === data.currentClassId
      );

      if (exists) {
        throw new Error("Un élève avec ce nom existe déjà dans cette classe");
      }

      const newStudent: Student = {
        id: `student-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        createdBy: "current-user-id", // À remplacer par l'ID de l'utilisateur connecté
        firstName: data.firstName,
        lastName: data.lastName,
        currentClassId: data.currentClassId,
        needs: data.needs,
        observations: data.observations,
        strengths: data.strengths,
        improvementAxes: data.improvementAxes,
        createdAt: new Date(),
        updatedAt: new Date(),
        fullName: () => `${data.firstName} ${data.lastName}`,
        attendanceRate: (start: Date, end: Date) => {
          console.log("Calculate attendance rate:", start, end);
          return 85; // Placeholder
        },
        participationAverage: (start: Date, end: Date) => {
          console.log("Calculate participation average:", start, end);
          return 3.5; // Placeholder
        },
      };

      setStudents((prev) => [...prev, newStudent]);
      return newStudent;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Erreur lors de la création de l'élève";
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [students, classes]);

  const updateStudent = useCallback(async (id: string, data: StudentFormData): Promise<Student> => {
    setLoading(true);
    setError(null);

    try {
      // Simuler un délai API
      await new Promise((resolve) => setTimeout(resolve, 500));

      const existingStudent = students.find((student) => student.id === id);
      if (!existingStudent) {
        throw new Error("Élève introuvable");
      }

      // Vérifier que la classe existe
      const classExists = classes.find((cls) => cls.id === data.currentClassId);
      if (!classExists) {
        throw new Error("La classe sélectionnée n'existe pas");
      }

      // Vérifier la duplication (exclure l'élève actuel)
      const exists = students.some(
        (student) => 
          student.id !== id &&
          student.firstName.toLowerCase() === data.firstName.toLowerCase() &&
          student.lastName.toLowerCase() === data.lastName.toLowerCase() &&
          student.currentClassId === data.currentClassId
      );

      if (exists) {
        throw new Error("Un élève avec ce nom existe déjà dans cette classe");
      }

      const updatedStudent: Student = {
        ...existingStudent,
        firstName: data.firstName,
        lastName: data.lastName,
        currentClassId: data.currentClassId,
        needs: data.needs,
        observations: data.observations,
        strengths: data.strengths,
        improvementAxes: data.improvementAxes,
        updatedAt: new Date(),
        fullName: () => `${data.firstName} ${data.lastName}`,
      };

      setStudents((prev) => prev.map((student) => (student.id === id ? updatedStudent : student)));
      return updatedStudent;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Erreur lors de la modification de l'élève";
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [students, classes]);

  const deleteStudent = useCallback(async (id: string): Promise<void> => {
    setLoading(true);
    setError(null);

    try {
      // Simuler un délai API
      await new Promise((resolve) => setTimeout(resolve, 300));

      const existingStudent = students.find((student) => student.id === id);
      if (!existingStudent) {
        throw new Error("Élève introuvable");
      }

      // Vérifier s'il y a des données liées (participations, examens, etc.)
      // Pour l'instant, on permet la suppression directe
      // Dans un vrai système, on vérifierait les relations

      setStudents((prev) => prev.filter((student) => student.id !== id));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Erreur lors de la suppression de l'élève";
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [students]);

  const transferStudent = useCallback(async (studentId: string, newClassId: string): Promise<Student> => {
    setLoading(true);
    setError(null);

    try {
      // Simuler un délai API
      await new Promise((resolve) => setTimeout(resolve, 400));

      const existingStudent = students.find((student) => student.id === studentId);
      if (!existingStudent) {
        throw new Error("Élève introuvable");
      }

      const newClass = classes.find((cls) => cls.id === newClassId);
      if (!newClass) {
        throw new Error("Classe de destination introuvable");
      }

      const updatedStudent: Student = {
        ...existingStudent,
        currentClassId: newClassId,
        updatedAt: new Date(),
      };

      setStudents((prev) => prev.map((student) => (student.id === studentId ? updatedStudent : student)));
      return updatedStudent;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Erreur lors du transfert de l'élève";
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [students, classes]);

  const getStudentById = useCallback((id: string): Student | undefined => {
    return students.find((student) => student.id === id);
  }, [students]);

  const getStudentsByClass = useCallback((classId: string): Student[] => {
    return students.filter((student) => student.currentClassId === classId);
  }, [students]);

  return {
    students,
    classes,
    loading,
    error,
    createStudent,
    updateStudent,
    deleteStudent,
    getStudentById,
    getStudentsByClass,
    transferStudent,
  };
}