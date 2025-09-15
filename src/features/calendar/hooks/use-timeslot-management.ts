/**
 * Hook de gestion des créneaux horaires
 * Utilise l'architecture partagée pour éliminer la duplication
 */

import { useState, useCallback } from "react";
import type { TimeSlot } from "@/types/uml-entities";
import { MOCK_TIME_SLOTS } from "@/features/calendar/mocks";
import { useBaseManagement, generateUniqueId } from "@/shared/hooks";
import { requiredRule, uniqueRule, customRule } from "@/shared/hooks";

export interface TimeSlotFormData {
  name: string;
  startTime: string;
  endTime: string;
  durationMinutes: number;
  displayOrder: number;
  isBreak: boolean;
}

export interface UseTimeSlotManagementReturn {
  // Données de base héritées du hook partagé
  timeSlots: TimeSlot[];
  loading: boolean;
  error: string | null;
  createTimeSlot: (data: TimeSlotFormData) => Promise<TimeSlot>;
  updateTimeSlot: (id: string, data: TimeSlotFormData) => Promise<TimeSlot>;
  deleteTimeSlot: (id: string) => Promise<void>;
  getTimeSlotById: (id: string) => TimeSlot | undefined;
  validateForm: (data: TimeSlotFormData, excludeId?: string) => Record<keyof TimeSlotFormData, string | null>;
  hasValidationErrors: (errors: Record<keyof TimeSlotFormData, string | null>) => boolean;
  refresh: () => void;

  // Méthodes spécifiques aux créneaux horaires
  getTimeSlotsByType: (isBreak: boolean) => TimeSlot[];
  reorderTimeSlots: (timeSlotIds: string[]) => Promise<void>;
  validateTimeSlotOverlap: (startTime: string, endTime: string, excludeId?: string) => boolean;
}

export function useTimeSlotManagement(): UseTimeSlotManagementReturn {
  
  // Configuration pour le hook de base
  const baseManagement = useBaseManagement<TimeSlot, TimeSlotFormData>({
    entityName: "créneau horaire",
    mockData: MOCK_TIME_SLOTS.sort((a, b) => a.displayOrder - b.displayOrder),
    generateId: () => `timeslot-${generateUniqueId()}`,
    
    // Règles de validation
    validationRules: {
      name: [
        requiredRule("name", "Nom du créneau"),
        uniqueRule("name", "Nom de créneau"),
      ],
      startTime: [
        requiredRule("startTime", "Heure de début"),
        customRule(
          (value: string, items: TimeSlot[], excludeId?: string) => {
            const formData = arguments[3] as TimeSlotFormData;
            if (!formData || !formData.endTime) return true;
            
            const start = new Date(`2000-01-01T${value}:00`);
            const end = new Date(`2000-01-01T${formData.endTime}:00`);
            
            return start < end;
          },
          "L'heure de début doit être antérieure à l'heure de fin"
        ),
        customRule(
          (value: string, items: TimeSlot[], excludeId?: string) => {
            const formData = arguments[3] as TimeSlotFormData;
            if (!formData || !formData.endTime) return true;
            
            const start = new Date(`2000-01-01T${value}:00`);
            const end = new Date(`2000-01-01T${formData.endTime}:00`);
            
            return !items.some((slot) => {
              if (excludeId && slot.id === excludeId) return false;
              
              const slotStart = new Date(`2000-01-01T${slot.startTime}:00`);
              const slotEnd = new Date(`2000-01-01T${slot.endTime}:00`);
              
              return (start < slotEnd && end > slotStart);
            });
          },
          "Ce créneau chevauche avec un créneau existant"
        ),
      ],
      endTime: [
        requiredRule("endTime", "Heure de fin"),
      ],
      durationMinutes: [
        customRule(
          (value: number) => value > 0 && value <= 300,
          "La durée doit être comprise entre 1 et 300 minutes"
        ),
      ],
      displayOrder: [
        customRule(
          (value: number) => value >= 0,
          "L'ordre d'affichage doit être positif"
        ),
        uniqueRule("displayOrder", "Ordre d'affichage"),
      ],
      isBreak: [], // Pas de validation nécessaire pour un boolean
    },

    // Création d'entité
    createEntity: (data: TimeSlotFormData) => ({
      name: data.name.trim(),
      startTime: data.startTime,
      endTime: data.endTime,
      durationMinutes: data.durationMinutes,
      displayOrder: data.displayOrder,
      isBreak: data.isBreak,
      // Méthodes UML
      getSessions: () => [],
      isAvailable: (date: Date) => true,
      formatTimeRange: () => `${data.startTime} - ${data.endTime}`,
    }),

    // Mise à jour d'entité
    updateEntity: (existing: TimeSlot, data: TimeSlotFormData) => ({
      name: data.name.trim(),
      startTime: data.startTime,
      endTime: data.endTime,
      durationMinutes: data.durationMinutes,
      displayOrder: data.displayOrder,
      isBreak: data.isBreak,
      // Mettre à jour formatTimeRange
      formatTimeRange: () => `${data.startTime} - ${data.endTime}`,
    }),
  });

  // Fonction helper pour valider les chevauchements
  const validateTimeSlotOverlap = useCallback((
    startTime: string, 
    endTime: string, 
    excludeId?: string
  ): boolean => {
    const start = new Date(`2000-01-01T${startTime}:00`);
    const end = new Date(`2000-01-01T${endTime}:00`);
    
    return baseManagement.items.some((slot) => {
      if (excludeId && slot.id === excludeId) return false;
      
      const slotStart = new Date(`2000-01-01T${slot.startTime}:00`);
      const slotEnd = new Date(`2000-01-01T${slot.endTime}:00`);
      
      return (start < slotEnd && end > slotStart);
    });
  }, [baseManagement.items]);

  // Méthodes spécifiques aux créneaux horaires
  const getTimeSlotsByType = useCallback((isBreak: boolean) => {
    return baseManagement.items.filter((slot) => slot.isBreak === isBreak);
  }, [baseManagement.items]);

  const reorderTimeSlots = useCallback(async (timeSlotIds: string[]): Promise<void> => {
    try {
      // Simuler délai API
      await new Promise((resolve) => setTimeout(resolve, 300));

      // Mettre à jour l'ordre d'affichage
      const updates = timeSlotIds.map(async (id, index) => {
        const slot = baseManagement.getById(id);
        if (!slot) throw new Error(`Créneau ${id} introuvable`);

        return baseManagement.update(id, {
          name: slot.name,
          startTime: slot.startTime,
          endTime: slot.endTime,
          durationMinutes: slot.durationMinutes,
          displayOrder: index,
          isBreak: slot.isBreak,
        });
      });

      await Promise.all(updates);
    } catch (error) {
      throw new Error("Erreur lors de la réorganisation des créneaux");
    }
  }, [baseManagement]);

  return {
    // Propriétés héritées du hook de base
    timeSlots: baseManagement.items,
    loading: baseManagement.loading,
    error: baseManagement.error,
    createTimeSlot: baseManagement.create,
    updateTimeSlot: baseManagement.update,
    deleteTimeSlot: baseManagement.delete,
    getTimeSlotById: baseManagement.getById,
    validateForm: baseManagement.validateForm,
    hasValidationErrors: baseManagement.hasValidationErrors,
    refresh: baseManagement.refresh,

    // Propriétés spécifiques
    getTimeSlotsByType,
    reorderTimeSlots,
    validateTimeSlotOverlap,
  };
}