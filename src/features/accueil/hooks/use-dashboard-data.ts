import { useState } from "react";
import { MOCK_CLASSES, MOCK_SUBJECTS } from "@/features/gestion/mocks";
import { MOCK_STUDENTS } from "@/features/students/mocks";
import { MOCK_TIME_SLOTS } from "@/features/calendar/mocks";
import { useWeeklySessions } from "@/features/calendar";
import { combineDateAndTime } from "@/utils/date-utils";

interface UpcomingCourse {
  id: string;
  class: string;
  time: string;
  duration: string;
}

// Interface simplifiée pour le dashboard
interface DashboardClass {
  id: string;
  name: string;
  studentCount: number;
}

interface DashboardStudent {
  id: string;
  name: string;
  class: string;
  level?: string;
  status?: "present" | "absent" | "late";
}

export function useDashboardData() {
  // Transformation des données UML en format dashboard
  const [classes] = useState<DashboardClass[]>(
    MOCK_CLASSES.map((cls) => ({
      id: cls.id,
      name: cls.classCode,
      studentCount:
        MOCK_STUDENTS.filter((student) => student.currentClassId === cls.id)
          .length || 0, // Pas de fallback aléatoire pour éviter les erreurs d'hydratation
    })),
  );

  const [students] = useState<DashboardStudent[]>(
    MOCK_STUDENTS.map((student) => {
      // Trouve la première classe associée
      const associatedClass = MOCK_CLASSES.find(
        (cls) => student.currentClassId === cls.id,
      );

      return {
        id: student.id,
        name: `${student.firstName} ${student.lastName}`,
        class: associatedClass?.classCode || "Non assigné",
        level: associatedClass?.gradeLabel,
      };
    }),
  );

  // Remplacer par des cours générés depuis les templates
  // TODO: Utiliser useDashboardSessions pour les cours à venir
  const [upcomingCourses] = useState<UpcomingCourse[]>([
    // Cours temporaires - maintenant remplacés par le système de templates
  ]);

  const addNewClass = (className: string) => {
    // Logic to add new class
    console.log("Adding new class:", className);
  };

  const addNewStudent = (studentName: string, studentClass: string) => {
    // Logic to add new student
    console.log("Adding new student:", studentName, "to class:", studentClass);
  };

  return {
    classes,
    students,
    upcomingCourses,
    addNewClass,
    addNewStudent,
  };
}
