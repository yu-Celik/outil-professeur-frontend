/**
 * Academic Context Hook
 * Provides global access to active school year and academic period
 * Used by all features for filtering and analytics calculations
 */

"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import type { SchoolYear, AcademicPeriod } from "@/types/uml-entities";
import { useSchoolYearManagement } from "./use-school-year-management";
import { useAcademicPeriods } from "./use-academic-periods";

// ============================================================================
// Context Type Definition
// ============================================================================

export interface AcademicContextValue {
  // Active entities
  activeSchoolYear: SchoolYear | null;
  activePeriod: AcademicPeriod | null;

  // All available data
  schoolYears: SchoolYear[];
  periods: AcademicPeriod[];

  // Loading states
  loading: boolean;
  error: string | null;

  // Actions
  setActiveSchoolYear: (id: string) => Promise<void>;
  setActivePeriod: (id: string) => Promise<void>;
  reload: () => void;
}

// ============================================================================
// Context
// ============================================================================

const AcademicContext = createContext<AcademicContextValue | null>(null);

// ============================================================================
// Provider Props
// ============================================================================

export interface AcademicContextProviderProps {
  children: React.ReactNode;
  teacherId?: string;
  useMockData?: boolean;
}

// ============================================================================
// Provider Component
// ============================================================================

export function AcademicContextProvider({
  children,
  teacherId,
  useMockData = false,
}: AcademicContextProviderProps) {
  const {
    schoolYears,
    loading: yearsLoading,
    error: yearsError,
    getActiveSchoolYear,
    activateSchoolYear,
    reload: reloadYears,
  } = useSchoolYearManagement({ teacherId, useMockData });

  const activeYear = getActiveSchoolYear();

  const {
    periods,
    loading: periodsLoading,
    error: periodsError,
    getActivePeriod,
    setActivePeriod: setActivePeriodHook,
    reload: reloadPeriods,
  } = useAcademicPeriods({
    teacherId,
    schoolYearId: activeYear?.id,
    useMockData,
  });

  const activePeriod = getActivePeriod(activeYear?.id);

  const handleSetActiveSchoolYear = async (id: string) => {
    await activateSchoolYear(id);
  };

  const handleSetActivePeriod = async (id: string) => {
    if (!activeYear) {
      throw new Error("Aucune année scolaire active");
    }
    await setActivePeriodHook(id, activeYear.id);
  };

  const reload = () => {
    reloadYears();
    reloadPeriods();
  };

  const value: AcademicContextValue = {
    activeSchoolYear: activeYear || null,
    activePeriod: activePeriod || null,
    schoolYears,
    periods,
    loading: yearsLoading || periodsLoading,
    error: yearsError || periodsError,
    setActiveSchoolYear: handleSetActiveSchoolYear,
    setActivePeriod: handleSetActivePeriod,
    reload,
  };

  return (
    <AcademicContext.Provider value={value}>
      {children}
    </AcademicContext.Provider>
  );
}

// ============================================================================
// Consumer Hook
// ============================================================================

/**
 * Hook to access academic context (active school year and period)
 * Must be used within AcademicContextProvider
 *
 * @example
 * ```tsx
 * const { activeSchoolYear, activePeriod } = useAcademicContext();
 *
 * // Filter data by active period
 * const filteredSessions = sessions.filter(s =>
 *   activePeriod?.contains(s.sessionDate)
 * );
 * ```
 */
export function useAcademicContext(): AcademicContextValue {
  const context = useContext(AcademicContext);

  if (!context) {
    throw new Error(
      "useAcademicContext must be used within AcademicContextProvider",
    );
  }

  return context;
}

// ============================================================================
// Optional: Standalone hook without context (for backward compatibility)
// ============================================================================

/**
 * Standalone hook to get active academic entities without context
 * Useful for components that don't need the provider
 */
export function useActiveAcademicEntities(
  teacherId?: string,
  useMockData = false,
) {
  const {
    schoolYears,
    loading: yearsLoading,
    getActiveSchoolYear,
  } = useSchoolYearManagement({ teacherId, useMockData });

  const activeYear = getActiveSchoolYear();

  const {
    periods,
    loading: periodsLoading,
    getActivePeriod,
  } = useAcademicPeriods({
    teacherId,
    schoolYearId: activeYear?.id,
    useMockData,
  });

  const activePeriod = getActivePeriod(activeYear?.id);

  return {
    activeSchoolYear: activeYear || null,
    activePeriod: activePeriod || null,
    loading: yearsLoading || periodsLoading,
  };
}
