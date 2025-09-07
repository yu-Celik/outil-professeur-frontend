import { useState, useCallback } from "react";
import type { TimeSlot } from "@/types/uml-entities";
import { MOCK_TIME_SLOTS } from "@/data/mock-time-slots";

interface TimeSlotFormData {
  name: string;
  startTime: string;
  endTime: string;
  durationMinutes: number;
  displayOrder: number;
  isBreak: boolean;
}

interface UseTimeSlotManagementReturn {
  timeSlots: TimeSlot[];
  loading: boolean;
  error: string | null;
  createTimeSlot: (data: TimeSlotFormData) => Promise<TimeSlot>;
  updateTimeSlot: (id: string, data: TimeSlotFormData) => Promise<TimeSlot>;
  deleteTimeSlot: (id: string) => Promise<void>;
  getTimeSlotById: (id: string) => TimeSlot | undefined;
  getTimeSlotsByType: (isBreak: boolean) => TimeSlot[];
  reorderTimeSlots: (timeSlotIds: string[]) => Promise<void>;
  validateTimeSlotOverlap: (startTime: string, endTime: string, excludeId?: string) => boolean;
}

export function useTimeSlotManagement(): UseTimeSlotManagementReturn {
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>(
    MOCK_TIME_SLOTS.sort((a, b) => a.displayOrder - b.displayOrder)
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const validateTimeSlotOverlap = useCallback((
    startTime: string, 
    endTime: string, 
    excludeId?: string
  ): boolean => {
    const start = new Date(`2000-01-01T${startTime}:00`);
    const end = new Date(`2000-01-01T${endTime}:00`);
    
    return timeSlots.some((slot) => {
      if (excludeId && slot.id === excludeId) return false;
      
      const slotStart = new Date(`2000-01-01T${slot.startTime}:00`);
      const slotEnd = new Date(`2000-01-01T${slot.endTime}:00`);
      
      return (start < slotEnd && end > slotStart);
    });
  }, [timeSlots]);

  const createTimeSlot = useCallback(async (data: TimeSlotFormData): Promise<TimeSlot> => {
    setLoading(true);
    setError(null);

    try {
      // Simuler un délai API
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Vérifier les chevauchements
      const hasOverlap = validateTimeSlotOverlap(data.startTime, data.endTime);
      if (hasOverlap) {
        throw new Error("Ce créneau chevauche avec un autre créneau existant");
      }

      // Vérifier la duplication de nom
      const nameExists = timeSlots.some(
        (slot) => slot.name.toLowerCase() === data.name.toLowerCase()
      );

      if (nameExists) {
        throw new Error("Un créneau avec ce nom existe déjà");
      }

      // Vérifier l'ordre d'affichage
      const orderExists = timeSlots.some(
        (slot) => slot.displayOrder === data.displayOrder
      );

      if (orderExists) {
        throw new Error("Un créneau avec cet ordre d'affichage existe déjà");
      }

      const newTimeSlot: TimeSlot = {
        id: `timeslot-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        createdBy: "current-user-id", // À remplacer par l'ID de l'utilisateur connecté
        name: data.name,
        startTime: data.startTime,
        endTime: data.endTime,
        durationMinutes: data.durationMinutes,
        displayOrder: data.displayOrder,
        isBreak: data.isBreak,
        createdAt: new Date(),
        updatedAt: new Date(),
        overlaps: (other: TimeSlot) => {
          const thisStart = new Date(`2000-01-01T${data.startTime}:00`);
          const thisEnd = new Date(`2000-01-01T${data.endTime}:00`);
          const otherStart = new Date(`2000-01-01T${other.startTime}:00`);
          const otherEnd = new Date(`2000-01-01T${other.endTime}:00`);
          
          return (thisStart < otherEnd && thisEnd > otherStart);
        },
        getDuration: () => data.durationMinutes,
      };

      setTimeSlots((prev) => [...prev, newTimeSlot].sort((a, b) => a.displayOrder - b.displayOrder));
      return newTimeSlot;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Erreur lors de la création du créneau";
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [timeSlots, validateTimeSlotOverlap]);

  const updateTimeSlot = useCallback(async (id: string, data: TimeSlotFormData): Promise<TimeSlot> => {
    setLoading(true);
    setError(null);

    try {
      // Simuler un délai API
      await new Promise((resolve) => setTimeout(resolve, 500));

      const existingTimeSlot = timeSlots.find((slot) => slot.id === id);
      if (!existingTimeSlot) {
        throw new Error("Créneau introuvable");
      }

      // Vérifier les chevauchements (exclure le créneau actuel)
      const hasOverlap = validateTimeSlotOverlap(data.startTime, data.endTime, id);
      if (hasOverlap) {
        throw new Error("Ce créneau chevauche avec un autre créneau existant");
      }

      // Vérifier la duplication de nom (exclure le créneau actuel)
      const nameExists = timeSlots.some(
        (slot) => slot.id !== id && slot.name.toLowerCase() === data.name.toLowerCase()
      );

      if (nameExists) {
        throw new Error("Un créneau avec ce nom existe déjà");
      }

      // Vérifier l'ordre d'affichage (exclure le créneau actuel)
      const orderExists = timeSlots.some(
        (slot) => slot.id !== id && slot.displayOrder === data.displayOrder
      );

      if (orderExists) {
        throw new Error("Un créneau avec cet ordre d'affichage existe déjà");
      }

      const updatedTimeSlot: TimeSlot = {
        ...existingTimeSlot,
        name: data.name,
        startTime: data.startTime,
        endTime: data.endTime,
        durationMinutes: data.durationMinutes,
        displayOrder: data.displayOrder,
        isBreak: data.isBreak,
        updatedAt: new Date(),
        overlaps: (other: TimeSlot) => {
          const thisStart = new Date(`2000-01-01T${data.startTime}:00`);
          const thisEnd = new Date(`2000-01-01T${data.endTime}:00`);
          const otherStart = new Date(`2000-01-01T${other.startTime}:00`);
          const otherEnd = new Date(`2000-01-01T${other.endTime}:00`);
          
          return (thisStart < otherEnd && thisEnd > otherStart);
        },
        getDuration: () => data.durationMinutes,
      };

      setTimeSlots((prev) => 
        prev
          .map((slot) => (slot.id === id ? updatedTimeSlot : slot))
          .sort((a, b) => a.displayOrder - b.displayOrder)
      );
      
      return updatedTimeSlot;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Erreur lors de la modification du créneau";
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [timeSlots, validateTimeSlotOverlap]);

  const deleteTimeSlot = useCallback(async (id: string): Promise<void> => {
    setLoading(true);
    setError(null);

    try {
      // Simuler un délai API
      await new Promise((resolve) => setTimeout(resolve, 300));

      const existingTimeSlot = timeSlots.find((slot) => slot.id === id);
      if (!existingTimeSlot) {
        throw new Error("Créneau introuvable");
      }

      // Vérifier s'il y a des données liées (sessions de cours, templates hebdomadaires, etc.)
      // Pour l'instant, on permet la suppression directe
      // Dans un vrai système, on vérifierait les relations avec:
      // - CourseSessions
      // - WeeklyTemplates
      
      setTimeSlots((prev) => prev.filter((slot) => slot.id !== id));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Erreur lors de la suppression du créneau";
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [timeSlots]);

  const reorderTimeSlots = useCallback(async (timeSlotIds: string[]): Promise<void> => {
    setLoading(true);
    setError(null);

    try {
      // Simuler un délai API
      await new Promise((resolve) => setTimeout(resolve, 300));

      const reorderedTimeSlots = timeSlotIds.map((id, index) => {
        const slot = timeSlots.find((ts) => ts.id === id);
        if (!slot) {
          throw new Error(`Créneau avec l'ID ${id} introuvable`);
        }
        
        return {
          ...slot,
          displayOrder: index + 1,
          updatedAt: new Date(),
        };
      });

      setTimeSlots(reorderedTimeSlots);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Erreur lors de la réorganisation des créneaux";
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [timeSlots]);

  const getTimeSlotById = useCallback((id: string): TimeSlot | undefined => {
    return timeSlots.find((slot) => slot.id === id);
  }, [timeSlots]);

  const getTimeSlotsByType = useCallback((isBreak: boolean): TimeSlot[] => {
    return timeSlots.filter((slot) => slot.isBreak === isBreak);
  }, [timeSlots]);

  return {
    timeSlots,
    loading,
    error,
    createTimeSlot,
    updateTimeSlot,
    deleteTimeSlot,
    getTimeSlotById,
    getTimeSlotsByType,
    reorderTimeSlots,
    validateTimeSlotOverlap,
  };
}