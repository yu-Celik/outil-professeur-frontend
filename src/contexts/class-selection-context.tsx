"use client";

import { createContext, useContext, useEffect, useState, useCallback, ReactNode } from "react";
import { useTeachingAssignments } from "@/features/gestion/hooks";
import { useClassColors } from "@/features/calendar/hooks";
import { useUserSession } from "@/features/settings/hooks";
import type { Class } from "@/types/uml-entities";

interface ClassSelectionContextType {
  // État
  currentTeacherId: string;
  selectedClassId: string | null;
  classes: Class[];
  assignmentsLoading: boolean;
  
  // Fonctions
  getClassColorWithText: (classId: string) => { backgroundColor: string; color: string; borderColor: string };
  handleClassSelect: (classId: string | null) => void;
  selectFirstClassIfAvailable: () => void;
}

const ClassSelectionContext = createContext<ClassSelectionContextType | undefined>(undefined);

interface ClassSelectionProviderProps {
  children: ReactNode;
}

export function ClassSelectionProvider({ children }: ClassSelectionProviderProps) {
  const { user } = useUserSession();
  const currentTeacherId = user?.id || "KsmNtVf4zwqO3VV3SQJqPrRlQBA1fFyR";
  
  // État global persistant
  const [selectedClassId, setSelectedClassId] = useState<string | null>(null);
  
  // Hooks pour les données
  const { assignments, loading: assignmentsLoading } = useTeachingAssignments(currentTeacherId);
  const { getClassColorWithText } = useClassColors(currentTeacherId);

  // Classes disponibles (déduplication basée sur l'ID)
  const classes: Class[] = assignments?.reduce((uniqueClasses, assignment) => {
    const classExists = uniqueClasses.some(c => c.id === assignment.classId);
    if (!classExists) {
      uniqueClasses.push({
        ...assignment.class,
        id: assignment.classId
      });
    }
    return uniqueClasses;
  }, [] as Class[]) || [];

  // Gestionnaire de sélection de classe
  const handleClassSelect = useCallback((classId: string | null) => {
    setSelectedClassId(classId);
    // Optionnel : sauvegarder dans localStorage pour persistance
    if (classId) {
      localStorage.setItem('selectedClassId', classId);
    } else {
      localStorage.removeItem('selectedClassId');
    }
  }, []);

  // Sélectionner automatiquement la première classe disponible
  const selectFirstClassIfAvailable = useCallback(() => {
    if (!selectedClassId && classes.length > 0) {
      // Essayer de récupérer depuis localStorage
      const savedClassId = localStorage.getItem('selectedClassId');
      if (savedClassId && classes.some(c => c.id === savedClassId)) {
        setSelectedClassId(savedClassId);
      } else {
        // Sinon, prendre la première classe
        setSelectedClassId(classes[0].id);
      }
    }
  }, [selectedClassId, classes]);

  // Restaurer la sélection depuis localStorage au montage
  useEffect(() => {
    const savedClassId = localStorage.getItem('selectedClassId');
    if (savedClassId && classes.some(c => c.id === savedClassId)) {
      setSelectedClassId(savedClassId);
    }
  }, [classes]);

  // Auto-sélection quand les classes sont chargées
  useEffect(() => {
    selectFirstClassIfAvailable();
  }, [selectFirstClassIfAvailable]);

  const value: ClassSelectionContextType = {
    currentTeacherId,
    selectedClassId,
    classes,
    assignmentsLoading,
    getClassColorWithText,
    handleClassSelect,
    selectFirstClassIfAvailable,
  };

  return (
    <ClassSelectionContext.Provider value={value}>
      {children}
    </ClassSelectionContext.Provider>
  );
}

export function useClassSelection() {
  const context = useContext(ClassSelectionContext);
  if (context === undefined) {
    throw new Error('useClassSelection must be used within a ClassSelectionProvider');
  }
  return context;
}