"use client";

import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { getCompletedSessionsForTeacher } from "@/features/sessions/mocks";
import { getStudentsByClass } from "@/features/students/mocks";
import { getWeeklyTemplatesForTeacher } from "@/features/calendar/mocks";
import { useTeachingAssignments } from "@/features/gestion";
import { useUserSession } from "@/features/settings";
import { useClassSelection } from "@/contexts/class-selection-context";
import { useAttendanceApi } from "@/features/sessions/api";
import type {
  Class,
  CourseSession,
  StudentParticipation,
} from "@/types/uml-entities";

export function useSessionManagement() {
  const { user } = useUserSession();
  const teacherId = user?.id || "KsmNtVf4zwqO3VV3SQJqPrRlQBA1fFyR";
  const searchParams = useSearchParams();

  // Utiliser le contexte global pour la sélection de classe
  const { selectedClassId, handleClassSelect, classes } = useClassSelection();

  // Paramètres de route
  const sessionIdParam = searchParams.get("sessionId");
  const classIdParam = searchParams.get("classId");
  const dateParam = searchParams.get("date");

  // Get today's date consistently - utiliser une date pour l'année scolaire 2024-2025
  const todayDate = useMemo(() => {
    // Utiliser une date de l'année scolaire en cours (octobre 2024)
    if (typeof window === "undefined") {
      return "2024-10-15"; // Date fixe pour le SSR - octobre 2024
    }
    // En production, utiliser une date de l'année scolaire actuelle
    return "2024-10-15";
  }, []);

  // Initialiser la classe depuis l'URL si fournie
  useEffect(() => {
    if (classIdParam && classIdParam !== "all") {
      handleClassSelect(classIdParam);
    }
  }, [classIdParam, handleClassSelect]);

  // Créer un selectedClassId compatible (string au lieu de string|null)
  const sessionSelectedClassId = selectedClassId || "all";

  // Fonction compatible pour setSelectedClassId
  const setSessionSelectedClassId = (classId: string) => {
    if (classId === "all") {
      handleClassSelect(null);
    } else {
      handleClassSelect(classId);
    }
  };
  const [selectedDate, setSelectedDate] = useState<string>(
    dateParam || todayDate,
  );
  const [selectedSessionId, setSelectedSessionId] = useState<string>(
    sessionIdParam || "all",
  );
  const [openAccordions, setOpenAccordions] = useState<Set<string>>(new Set());
  const [attendanceData, setAttendanceData] = useState<
    StudentParticipation[] | null
  >(null);
  const [attendanceLoading, setAttendanceLoading] = useState(false);

  // Hooks
  const { assignments } = useTeachingAssignments(teacherId);
  const { getSessionAttendance, mapFromApiResponse } = useAttendanceApi();

  // Générer les sessions directement depuis les mock data
  const allSessions = useMemo(() => {
    const sessions: CourseSession[] = [];

    // 1. Ajouter toutes les sessions complétées pour ce teacher
    sessions.push(...getCompletedSessionsForTeacher(teacherId));

    // 2. Générer quelques sessions futures depuis les templates
    const today = new Date("2024-10-15"); // Date fixe pour l'année scolaire 2024-2025
    const futureWeeks = 4; // Générer 4 semaines futures

    const teacherTemplates = getWeeklyTemplatesForTeacher(teacherId);

    for (let week = 0; week < futureWeeks; week++) {
      teacherTemplates.forEach((template) => {
        // Calculer la date de la session
        const sessionDate = new Date(today);
        sessionDate.setDate(
          today.getDate() + week * 7 + (template.dayOfWeek - today.getDay()),
        );

        const sessionId = `session-generated-${template.id}-${week}`;

        const session: CourseSession = {
          id: sessionId,
          createdBy: template.teacherId,
          classId: template.classId,
          subjectId: template.subjectId,
          timeSlotId: template.timeSlotId,
          sessionDate: sessionDate,
          status: sessionDate.getTime() > today.getTime() ? "planned" : "done",
          objectives: null,
          content: null,
          homeworkAssigned: null,
          isMakeup: false,
          isMoved: false,
          notes: null,
          createdAt: today,
          updatedAt: today,
          reschedule: () => {},
          takeAttendance: () => {},
          summary: () => `Session générée depuis template ${template.id}`,
        };

        sessions.push(session);
      });
    }

    // Trier par date
    const sortedSessions = sessions.sort(
      (a, b) =>
        new Date(a.sessionDate).getTime() - new Date(b.sessionDate).getTime(),
    );

    // Debug : afficher le nombre de sessions générées
    console.log(`Sessions générées pour ${teacherId}:`, sortedSessions.length);
    console.log(
      "Sessions complétées:",
      getCompletedSessionsForTeacher(teacherId).length,
    );
    console.log("Templates:", getWeeklyTemplatesForTeacher(teacherId).length);

    return sortedSessions;
  }, [teacherId]);

  // Get unique classes to avoid duplicate keys
  const uniqueClasses = useMemo(() => {
    if (!assignments) return [];

    const classMap = new Map();
    assignments.forEach((assignment) => {
      if (!classMap.has(assignment.classId)) {
        classMap.set(assignment.classId, assignment.class);
      }
    });

    return Array.from(classMap.entries()).map(([classId, classData]) => ({
      id: classId,
      ...classData,
    })) as Class[];
  }, [assignments]);

  // Récupérer la session sélectionnée si une session spécifique est choisie
  const selectedSession =
    selectedSessionId !== "all"
      ? allSessions.find((session) => session.id === selectedSessionId)
      : null;

  // Récupérer les élèves de la session sélectionnée
  const studentsForSession = selectedSession
    ? getStudentsByClass(selectedSession.classId)
    : [];

  // Fetch attendance data when session is selected
  const fetchAttendanceData = useCallback(
    async (sessionId: string) => {
      if (!sessionId || sessionId === "all") {
        setAttendanceData(null);
        return;
      }

      setAttendanceLoading(true);
      try {
        const apiResponse = await getSessionAttendance(sessionId);
        const mappedData = apiResponse.map(mapFromApiResponse);
        setAttendanceData(mappedData);
      } catch (error) {
        console.error(
          `Failed to fetch attendance for session ${sessionId}:`,
          error,
        );
        // Fallback to empty array instead of null to indicate fetch was attempted
        setAttendanceData([]);
      } finally {
        setAttendanceLoading(false);
      }
    },
    [getSessionAttendance, mapFromApiResponse],
  );

  // Auto-load attendance data when session changes
  useEffect(() => {
    if (selectedSessionId && selectedSessionId !== "all") {
      fetchAttendanceData(selectedSessionId);
    } else {
      setAttendanceData(null);
    }
  }, [selectedSessionId, fetchAttendanceData]);

  // Auto-ouvrir l'accordéon si sessionId fourni en paramètre
  useEffect(() => {
    if (sessionIdParam && selectedSession) {
      // Si on vient du calendrier avec un sessionId, on ouvre tous les accordéons pour cette session
      const allStudentIds = getStudentsByClass(selectedSession.classId).map(
        (s) => s.id,
      );
      setOpenAccordions(new Set(allStudentIds));
    } else {
      // Sinon, tout fermer
      setOpenAccordions(new Set());
    }
  }, [sessionIdParam, selectedSession]);

  // Réinitialiser les accordéons fermés quand la session change manuellement
  useEffect(() => {
    if (!sessionIdParam) {
      // Ne pas réinitialiser si on vient du calendrier
      setOpenAccordions(new Set());
    }
  }, [selectedSessionId, sessionIdParam]);

  const toggleAccordion = (studentId: string) => {
    const newOpenAccordions = new Set(openAccordions);
    if (newOpenAccordions.has(studentId)) {
      newOpenAccordions.delete(studentId);
    } else {
      newOpenAccordions.add(studentId);
    }
    setOpenAccordions(newOpenAccordions);
  };

  return {
    // States
    selectedClassId: sessionSelectedClassId,
    selectedDate,
    selectedSessionId,
    openAccordions,
    attendanceLoading,

    // Data
    allSessions,
    uniqueClasses,
    selectedSession,
    studentsForSession,
    attendanceData,

    // Actions
    setSelectedClassId: setSessionSelectedClassId,
    setSelectedDate,
    setSelectedSessionId,
    toggleAccordion,
    refreshAttendance: fetchAttendanceData,
  };
}
