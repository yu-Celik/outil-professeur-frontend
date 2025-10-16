"use client";

import { useCallback, useState } from "react";

export type CalendarView = "month" | "week";

export interface CalendarNavigationState {
  currentDate: Date;
  view: CalendarView;
}

/**
 * Hook pour la navigation dans le calendrier
 * Gère la vue (mois/semaine) et la navigation temporelle
 */
export function useCalendarNavigation(initialDate: Date = new Date()) {
  const [currentDate, setCurrentDate] = useState(initialDate);
  const [view, setView] = useState<CalendarView>("month");

  // Basculer entre vues mois/semaine
  const toggleView = useCallback(() => {
    setView((prev) => (prev === "month" ? "week" : "month"));
  }, []);

  // Définir la vue explicitement
  const setViewMode = useCallback((mode: CalendarView) => {
    setView(mode);
  }, []);

  // Navigation mensuelle
  const navigateMonth = useCallback((direction: "prev" | "next") => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev);
      if (direction === "prev") {
        newDate.setMonth(newDate.getMonth() - 1);
      } else {
        newDate.setMonth(newDate.getMonth() + 1);
      }
      return newDate;
    });
  }, []);

  const goToPreviousMonth = useCallback(() => navigateMonth("prev"), [navigateMonth]);
  const goToNextMonth = useCallback(() => navigateMonth("next"), [navigateMonth]);

  // Navigation hebdomadaire
  const navigateWeek = useCallback((direction: "prev" | "next") => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev);
      if (direction === "prev") {
        newDate.setDate(newDate.getDate() - 7);
      } else {
        newDate.setDate(newDate.getDate() + 7);
      }
      return newDate;
    });
  }, []);

  const goToPreviousWeek = useCallback(() => navigateWeek("prev"), [navigateWeek]);
  const goToNextWeek = useCallback(() => navigateWeek("next"), [navigateWeek]);

  // Navigation contextuelle selon la vue
  const navigate = useCallback(
    (direction: "prev" | "next") => {
      if (view === "month") {
        navigateMonth(direction);
      } else {
        navigateWeek(direction);
      }
    },
    [view, navigateMonth, navigateWeek],
  );

  const goToPrevious = useCallback(() => navigate("prev"), [navigate]);
  const goToNext = useCallback(() => navigate("next"), [navigate]);

  // Retour à aujourd'hui
  const goToToday = useCallback(() => {
    setCurrentDate(new Date());
  }, []);

  // Navigation vers une date spécifique
  const goToDate = useCallback((date: Date) => {
    setCurrentDate(new Date(date));
  }, []);

  // Utilitaires de formatage
  const getMonthYear = useCallback(() => {
    return currentDate.toLocaleDateString("fr-FR", {
      month: "long",
      year: "numeric",
    });
  }, [currentDate]);

  const getWeekRange = useCallback(() => {
    const weekStart = new Date(currentDate);
    const day = weekStart.getDay();
    const diff = weekStart.getDate() - day + (day === 0 ? -6 : 1);
    weekStart.setDate(diff);

    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekEnd.getDate() + 6);

    return {
      start: weekStart,
      end: weekEnd,
      label: `${weekStart.toLocaleDateString("fr-FR", { day: "numeric", month: "short" })} - ${weekEnd.toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" })}`,
    };
  }, [currentDate]);

  const getCurrentPeriodLabel = useCallback(() => {
    return view === "month" ? getMonthYear() : getWeekRange().label;
  }, [view, getMonthYear, getWeekRange]);

  return {
    // État
    currentDate,
    view,

    // Contrôles de vue
    toggleView,
    setViewMode,
    isMonthView: view === "month",
    isWeekView: view === "week",

    // Navigation
    navigate,
    goToPrevious,
    goToNext,
    goToToday,
    goToDate,

    // Navigation spécifique mois
    navigateMonth,
    goToPreviousMonth,
    goToNextMonth,

    // Navigation spécifique semaine
    navigateWeek,
    goToPreviousWeek,
    goToNextWeek,

    // Utilitaires
    getMonthYear,
    getWeekRange,
    getCurrentPeriodLabel,
  };
}
