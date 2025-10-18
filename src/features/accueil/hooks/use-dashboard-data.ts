import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import { useAsyncOperation } from "@/shared/hooks";

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
  const [classes, setClasses] = useState<DashboardClass[]>([]);
  const [students, setStudents] = useState<DashboardStudent[]>([]);
  const [upcomingCourses] = useState<UpcomingCourse[]>([]);

  const {
    isLoading: classesLoading,
    error: classesError,
    execute: loadClasses,
  } = useAsyncOperation();

  const {
    isLoading: studentsLoading,
    error: studentsError,
    execute: loadStudents,
  } = useAsyncOperation();

  // Load classes from API
  useEffect(() => {
    const fetchClasses = async () => {
      const response = await api.classes.list();

      // Transform API response to dashboard format
      const dashboardClasses: DashboardClass[] = response.items.map(
        (cls: any) => ({
          id: cls.id,
          name: cls.class_code,
          studentCount: 0, // Will be calculated when students are loaded
        }),
      );

      setClasses(dashboardClasses);
    };

    loadClasses(fetchClasses);
  }, [loadClasses]);

  // Load students from API
  useEffect(() => {
    const fetchStudents = async () => {
      const response = await api.students.list();

      // Transform API response to dashboard format
      const dashboardStudents: DashboardStudent[] = response.items.map(
        (student: any) => ({
          id: student.id,
          name: student.full_name,
          class: student.current_class_id || "Non assigné",
          level: undefined, // Could be enriched by joining with classes data
        }),
      );

      setStudents(dashboardStudents);

      // Update class student counts
      setClasses((prevClasses) =>
        prevClasses.map((cls) => ({
          ...cls,
          studentCount: dashboardStudents.filter(
            (s) => s.class === cls.id,
          ).length,
        })),
      );
    };

    loadStudents(fetchStudents);
  }, [loadStudents]);

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
