"use client";

import { useState, useCallback, useEffect } from "react";
import type { StudentProfile } from "@/types/uml-entities";
import {
  StudentProfileService,
  type ProfileGenerationParams,
} from "../services/student-profile-service";

export interface UseStudentProfileGenerationProps {
  studentId: string;
  academicPeriodId: string;
}

export interface UseStudentProfileGenerationReturn {
  // État profil
  currentProfile: StudentProfile | null;
  profiles: StudentProfile[];
  loading: boolean;
  error: string | null;

  // Actions génération
  generateProfile: (
    params?: ProfileGenerationParams,
  ) => Promise<StudentProfile | null>;
  regenerateProfile: (
    profileId: string,
    params?: ProfileGenerationParams,
  ) => Promise<StudentProfile | null>;
  updateProfile: (
    profileId: string,
    data: Partial<StudentProfile>,
  ) => Promise<StudentProfile | null>;

  // Actions validation
  validateProfile: (
    profileId: string,
    notes: string,
  ) => Promise<StudentProfile | null>;
  reviewProfile: (profileId: string, feedback: string) => Promise<void>;

  // Export
  exportProfile: (
    profileId: string,
    format: "pdf" | "json",
  ) => Promise<string | null>;

  // Filtres et recherche
  getProfilesByPeriod: (periodId: string) => StudentProfile[];
  getProfilesByStatus: (status: string) => StudentProfile[];

  // Actions de refresh
  refresh: () => void;
  clearError: () => void;
}

/**
 * Hook spécialisé pour la génération et la gestion des profils étudiants
 */
export function useStudentProfileGeneration({
  studentId,
  academicPeriodId,
}: UseStudentProfileGenerationProps): UseStudentProfileGenerationReturn {
  // État local des profils
  const [profiles, setProfiles] = useState<StudentProfile[]>([]);
  const [currentProfile, setCurrentProfile] = useState<StudentProfile | null>(
    null,
  );

  // État d'erreur et de loading
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Charger les profils existants au montage
  useEffect(() => {
    loadExistingProfiles();
  }, [studentId, academicPeriodId]);

  const loadExistingProfiles = useCallback(async () => {
    try {
      const existingProfiles = await StudentProfileService.getProfilesByStudent(
        studentId,
        academicPeriodId,
      );
      setProfiles(existingProfiles);

      // Sélectionner le profil le plus récent comme profil courant
      const latestProfile = existingProfiles.sort(
        (a, b) =>
          new Date(b.generatedAt).getTime() - new Date(a.generatedAt).getTime(),
      )[0];

      setCurrentProfile(latestProfile || null);
    } catch (err) {
      console.error("Error loading existing profiles:", err);
    }
  }, [studentId, academicPeriodId]);

  const generateProfile = useCallback(
    async (
      params: ProfileGenerationParams = {},
    ): Promise<StudentProfile | null> => {
      setIsLoading(true);
      setError(null);

      try {
        const newProfile = await StudentProfileService.generateProfile(
          studentId,
          academicPeriodId,
          params,
        );

        // Mettre à jour l'état local
        setProfiles((prev) => [newProfile, ...prev]);
        setCurrentProfile(newProfile);

        return newProfile;
      } catch (err) {
        const errorMessage =
          err instanceof Error
            ? err.message
            : "Erreur lors de la génération du profil";
        setError(errorMessage);
        console.error("Profile generation error:", err);
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [studentId, academicPeriodId],
  );

  const regenerateProfile = useCallback(
    async (
      profileId: string,
      params: ProfileGenerationParams = {},
    ): Promise<StudentProfile | null> => {
      setIsLoading(true);
      setError(null);

      try {
        const updatedProfile = await StudentProfileService.regenerateProfile(
          profileId,
          params,
        );

        // Mettre à jour l'état local
        setProfiles((prev) =>
          prev.map((p) => (p.id === profileId ? updatedProfile : p)),
        );

        if (currentProfile?.id === profileId) {
          setCurrentProfile(updatedProfile);
        }

        return updatedProfile;
      } catch (err) {
        const errorMessage =
          err instanceof Error
            ? err.message
            : "Erreur lors de la régénération du profil";
        setError(errorMessage);
        console.error("Profile regeneration error:", err);
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [currentProfile],
  );

  const updateProfile = useCallback(
    async (
      profileId: string,
      data: Partial<StudentProfile>,
    ): Promise<StudentProfile | null> => {
      setIsLoading(true);
      setError(null);

      try {
        const updatedProfile = await StudentProfileService.updateProfile(
          profileId,
          data,
        );

        // Mettre à jour l'état local
        setProfiles((prev) =>
          prev.map((p) => (p.id === profileId ? updatedProfile : p)),
        );

        if (currentProfile?.id === profileId) {
          setCurrentProfile(updatedProfile);
        }

        return updatedProfile;
      } catch (err) {
        const errorMessage =
          err instanceof Error
            ? err.message
            : "Erreur lors de la mise à jour du profil";
        setError(errorMessage);
        console.error("Profile update error:", err);
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [currentProfile],
  );

  const validateProfile = useCallback(
    async (
      profileId: string,
      notes: string,
    ): Promise<StudentProfile | null> => {
      setIsLoading(true);
      setError(null);

      try {
        const validatedProfile = await StudentProfileService.validateProfile(
          profileId,
          notes,
          "current-user", // TODO: Get actual user ID
        );

        // Mettre à jour l'état local
        setProfiles((prev) =>
          prev.map((p) => (p.id === profileId ? validatedProfile : p)),
        );

        if (currentProfile?.id === profileId) {
          setCurrentProfile(validatedProfile);
        }

        return validatedProfile;
      } catch (err) {
        const errorMessage =
          err instanceof Error
            ? err.message
            : "Erreur lors de la validation du profil";
        setError(errorMessage);
        console.error("Profile validation error:", err);
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [currentProfile],
  );

  const reviewProfile = useCallback(
    async (profileId: string, feedback: string): Promise<void> => {
      setIsLoading(true);
      setError(null);

      try {
        const profile = profiles.find((p) => p.id === profileId);
        if (!profile) {
          throw new Error(`Profile ${profileId} not found`);
        }

        // Appeler la méthode review du profil
        profile.review(feedback);

        // TODO: Persister les commentaires de review
        console.log(`Profile ${profileId} reviewed with feedback:`, feedback);
      } catch (err) {
        const errorMessage =
          err instanceof Error
            ? err.message
            : "Erreur lors de la review du profil";
        setError(errorMessage);
        console.error("Profile review error:", err);
      } finally {
        setIsLoading(false);
      }
    },
    [profiles],
  );

  const exportProfile = useCallback(
    async (
      profileId: string,
      format: "pdf" | "json",
    ): Promise<string | null> => {
      setIsLoading(true);
      setError(null);

      try {
        const exportedData = await StudentProfileService.exportProfile(
          profileId,
          format,
        );
        return exportedData;
      } catch (err) {
        const errorMessage =
          err instanceof Error
            ? err.message
            : "Erreur lors de l'export du profil";
        setError(errorMessage);
        console.error("Profile export error:", err);
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [],
  );

  const getProfilesByPeriod = useCallback(
    (periodId: string): StudentProfile[] => {
      return profiles.filter(
        (profile) => profile.academicPeriodId === periodId,
      );
    },
    [profiles],
  );

  const getProfilesByStatus = useCallback(
    (status: string): StudentProfile[] => {
      return profiles.filter((profile) => profile.status === status);
    },
    [profiles],
  );

  const refresh = useCallback(() => {
    loadExistingProfiles();
  }, [loadExistingProfiles]);

  return {
    // État profil
    currentProfile,
    profiles,
    loading: isLoading,
    error,

    // Actions génération
    generateProfile,
    regenerateProfile,
    updateProfile,

    // Actions validation
    validateProfile,
    reviewProfile,

    // Export
    exportProfile,

    // Filtres et recherche
    getProfilesByPeriod,
    getProfilesByStatus,

    // Actions de refresh
    refresh,
    clearError: () => setError(null),
  };
}
