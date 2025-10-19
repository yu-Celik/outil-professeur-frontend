"use client";

import { useState, useEffect, useCallback } from "react";
import type {
  Student,
  StudentProfile,
  SchoolYear,
  AcademicPeriod,
} from "@/types/uml-entities";
import { studentsClient } from "../api/students-client";
import { formatDateToISO, parseDateFromISO } from "@/utils/date-utils";
import { useAsyncOperation } from "@/shared/hooks";
import type {
  StudentObservation,
  ObservationFormData,
} from "../types/observation-types";
import {
  parseObservationsFromAPI,
  serializeObservationsForAPI,
} from "../types/observation-types";
import { toast } from "sonner";

interface StudentParticipation {
  id: string;
  courseSessionId: string;
  subject: string;
  date: string;
  time: string;
  isPresent: boolean;
  participationLevel: number;
  behavior: string;
  specificRemarks: string;
  technicalIssues: string;
  markedAt: Date;
}

export function useStudentProfile(studentId: string) {
  const [student, setStudent] = useState<Student | null>(null);
  const [currentProfile, setCurrentProfile] = useState<StudentProfile | null>(
    null,
  );
  const [observations, setObservations] = useState<StudentObservation[]>([]);
  const [isWatchlisted, setIsWatchlisted] = useState(false);
  const [etag, setEtag] = useState<string | undefined>(undefined);

  // Mock school year and period - In production, these would come from API
  const [schoolYear] = useState<SchoolYear>({
    id: "year-2025",
    createdBy: "admin-1",
    name: "2024-2025",
    startDate: new Date("2024-09-01"),
    endDate: new Date("2025-06-30"),
    isActive: true,
    createdAt: new Date("2024-08-15"),
    updatedAt: new Date(),
    createPeriod: (_name: string, _start: Date, _end: Date, _order: number) =>
      ({}) as AcademicPeriod,
  });

  const [currentPeriod] = useState<AcademicPeriod>({
    id: "period-1",
    createdBy: "admin-1",
    schoolYearId: "year-2025",
    name: "Premier trimestre",
    order: 1,
    startDate: new Date("2024-09-01"),
    endDate: new Date("2024-12-20"),
    isActive: true,
    createdAt: new Date("2024-08-15"),
    updatedAt: new Date(),
    contains: (date: Date) =>
      date >= new Date("2024-09-01") && date <= new Date("2024-12-20"),
  });

  const [recentParticipations, setRecentParticipations] = useState<
    StudentParticipation[]
  >([]);

  const {
    isLoading: profileLoading,
    error: profileError,
    execute: loadProfile,
  } = useAsyncOperation();

  // Load student profile data from API
  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const startDate = formatDateToISO(currentPeriod.startDate);
        const endDate = formatDateToISO(currentPeriod.endDate);

        // Fetch student basic info and profile with analytics
        const [studentData, profileData] = await Promise.all([
          studentsClient.getStudent(studentId),
          studentsClient.getStudentProfile(studentId, {
            start_date: startDate,
            end_date: endDate,
          }),
        ]);

        // Map API response to Student entity
        const studentEntity: Student = {
          id: studentData.id,
          createdBy: "system", // Not provided by API
          firstName: studentData.first_name,
          lastName: studentData.last_name,
          currentClassId: studentData.current_class_id || "", // Empty string if not provided
          needs: studentData.needs || [],
          observations: studentData.observations || [],
          strengths: studentData.strengths || [],
          improvementAxes: studentData.improvement_axes || [],
          createdAt: parseDateFromISO(studentData.created_at),
          updatedAt: parseDateFromISO(studentData.updated_at),
          fullName: () => studentData.full_name,
          attendanceRate: (_start: Date, _end: Date) =>
            profileData.analytics.attendance_rate ?? 0,
          participationAverage: (_start: Date, _end: Date) =>
            profileData.analytics.participation_average ?? 0,
        };

        setStudent(studentEntity);

        // Parse and set observations from API
        const parsedObservations = parseObservationsFromAPI(
          studentData.observations,
          "Enseignant",
        );
        setObservations(parsedObservations);

        // Set watchlist status
        setIsWatchlisted(studentData.watchlist ?? false);

        // Store ETag for optimistic concurrency control (if available from headers)
        // Note: axios response headers are lowercase
        const responseEtag = undefined; // TODO: Extract from response headers if API provides it
        setEtag(responseEtag);

        // Generate StudentProfile from API data
        const profile: StudentProfile = {
          id: `profile-${studentEntity.id}-${currentPeriod.id}`,
          createdBy: "system",
          studentId: studentEntity.id,
          academicPeriodId: currentPeriod.id,
          features: {
            averageParticipation:
              profileData.analytics.participation_average?.toFixed(1) ?? "0.0",
            attendanceRate:
              profileData.analytics.attendance_rate?.toFixed(1) ?? "0.0",
            dominantBehaviors: [], // Will be populated by behavioral analysis
            strengths: studentEntity.strengths,
            improvementAxes: studentEntity.improvementAxes,
            needs: studentEntity.needs,
            observations: studentEntity.observations,
          },
          evidenceRefs: {
            participations: [],
            sessions: [],
            subjects: [],
          },
          status: "active",
          generatedAt: new Date(),
          updatedAt: new Date(),
          review: (notes: string) => console.log("Profile reviewed:", notes),
        };

        setCurrentProfile(profile);
      } catch (error) {
        console.error("Error loading student profile:", error);
        throw error;
      }
    };

    loadProfile(fetchProfileData);
  }, [studentId, currentPeriod, loadProfile]);

  // Load recent participations (mock for now - will be replaced with API call later)
  useEffect(() => {
    // TODO: Replace with API call when participation endpoints are available
    // For now, keep mock data to maintain UI compatibility
    setRecentParticipations([]);
  }, [studentId]);

  /**
   * Create a new observation
   */
  const createObservation = useCallback(
    async (formData: ObservationFormData) => {
      if (!student) {
        toast.error("Impossible d'ajouter une observation sans élève chargé");
        return;
      }

      try {
        const newObservation: StudentObservation = {
          id: `obs-${Date.now()}`,
          content: formData.content,
          createdAt: formData.date || new Date(),
          updatedAt: new Date(),
          author: "Enseignant",
        };

        const updatedObservations = [...observations, newObservation];
        setObservations(updatedObservations);

        // Persist to API
        const apiObservations =
          serializeObservationsForAPI(updatedObservations);
        const updatedStudent = await studentsClient.updateStudent(
          studentId,
          { observations: apiObservations },
          etag,
        );

        // Update student entity
        setStudent({
          ...student,
          observations: updatedStudent.observations || [],
          updatedAt: parseDateFromISO(updatedStudent.updated_at),
        });

        toast.success("Observation ajoutée avec succès");

        return newObservation;
      } catch (error) {
        // Rollback optimistic update
        setObservations(observations);
        console.error("Error creating observation:", error);
        toast.error("Impossible d'ajouter l'observation. Veuillez réessayer.");
        throw error;
      }
    },
    [student, studentId, observations, etag],
  );

  /**
   * Update an existing observation
   */
  const updateObservation = useCallback(
    async (observationId: string, content: string) => {
      if (!student) {
        toast.error("Impossible de modifier une observation sans élève chargé");
        return;
      }

      const previousObservations = [...observations];

      try {
        const updatedObservations = observations.map((obs) =>
          obs.id === observationId
            ? { ...obs, content, updatedAt: new Date() }
            : obs,
        );

        setObservations(updatedObservations);

        // Persist to API
        const apiObservations =
          serializeObservationsForAPI(updatedObservations);
        const updatedStudent = await studentsClient.updateStudent(
          studentId,
          { observations: apiObservations },
          etag,
        );

        // Update student entity
        setStudent({
          ...student,
          observations: updatedStudent.observations || [],
          updatedAt: parseDateFromISO(updatedStudent.updated_at),
        });

        toast.success("Observation modifiée avec succès");
      } catch (error) {
        // Rollback optimistic update
        setObservations(previousObservations);
        console.error("Error updating observation:", error);
        toast.error("Impossible de modifier l'observation. Veuillez réessayer.");
        throw error;
      }
    },
    [student, studentId, observations, etag],
  );

  /**
   * Delete an observation
   */
  const removeObservation = useCallback(
    async (observationId: string) => {
      if (!student) {
        toast.error("Impossible de supprimer une observation sans élève chargé");
        return;
      }

      const previousObservations = [...observations];

      try {
        const updatedObservations = observations.filter(
          (obs) => obs.id !== observationId,
        );

        setObservations(updatedObservations);

        // Persist to API
        const apiObservations =
          serializeObservationsForAPI(updatedObservations);
        const updatedStudent = await studentsClient.updateStudent(
          studentId,
          { observations: apiObservations },
          etag,
        );

        // Update student entity
        setStudent({
          ...student,
          observations: updatedStudent.observations || [],
          updatedAt: parseDateFromISO(updatedStudent.updated_at),
        });

        toast.success("Observation supprimée avec succès");
      } catch (error) {
        // Rollback optimistic update
        setObservations(previousObservations);
        console.error("Error removing observation:", error);
        toast.error("Impossible de supprimer l'observation. Veuillez réessayer.");
        throw error;
      }
    },
    [student, studentId, observations, etag],
  );

  /**
   * Toggle watchlist status
   */
  const toggleWatchlist = useCallback(async () => {
    if (!student) {
      toast.error("Impossible de modifier le statut de surveillance");
      return;
    }

    const previousStatus = isWatchlisted;

    try {
      // Optimistic update
      const newStatus = !isWatchlisted;
      setIsWatchlisted(newStatus);

      // Persist to API
      const updatedStudent = await studentsClient.toggleWatchlist(
        studentId,
        newStatus,
        etag,
      );

      // Update student entity
      setStudent({
        ...student,
        updatedAt: parseDateFromISO(updatedStudent.updated_at),
      });

      toast.success(
        newStatus
          ? "Élève ajouté à la liste de surveillance"
          : "Élève retiré de la liste de surveillance",
      );
    } catch (error) {
      // Rollback optimistic update
      setIsWatchlisted(previousStatus);
      console.error("Error toggling watchlist:", error);
      toast.error(
        "Impossible de modifier le statut de surveillance. Veuillez réessayer.",
      );
      throw error;
    }
  }, [student, studentId, isWatchlisted, etag]);

  return {
    student,
    schoolYear,
    currentPeriod,
    currentProfile,
    recentParticipations,
    loading: profileLoading,
    error: profileError,
    // Observations management
    observations,
    createObservation,
    updateObservation,
    removeObservation,
    // Watchlist management
    isWatchlisted,
    toggleWatchlist,
  };
}
