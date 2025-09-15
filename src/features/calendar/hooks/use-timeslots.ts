"use client";

import { useCallback, useState } from "react";
import { MOCK_TIME_SLOTS } from "@/features/calendar/mocks";
import type { TimeSlot } from "@/types/uml-entities";

interface CreateTimeSlotData {
  name: string;
  startTime: string;
  endTime: string;
  isBreak?: boolean;
}

interface UpdateTimeSlotData extends CreateTimeSlotData {
  id: string;
}

export function useTimeSlots(
  teacherId: string = "KsmNtVf4zwqO3VV3SQJqPrRlQBA1fFyR",
) {
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>(
    MOCK_TIME_SLOTS.filter((slot) => slot.createdBy === teacherId).sort(
      (a, b) => a.displayOrder - b.displayOrder,
    ),
  );
  const [loading, setLoading] = useState(false);

  // Calculer la durée en minutes entre deux heures
  const calculateDuration = useCallback(
    (startTime: string, endTime: string): number => {
      const [startHour, startMin] = startTime.split(":").map(Number);
      const [endHour, endMin] = endTime.split(":").map(Number);

      const startMinutes = startHour * 60 + startMin;
      const endMinutes = endHour * 60 + endMin;

      return endMinutes - startMinutes;
    },
    [],
  );

  // Valider les données d'un créneau
  const validateTimeSlot = useCallback(
    (data: CreateTimeSlotData): string[] => {
      const errors: string[] = [];

      if (!data.name.trim()) {
        errors.push("Le nom est requis");
      }

      if (!data.startTime) {
        errors.push("L'heure de début est requise");
      }

      if (!data.endTime) {
        errors.push("L'heure de fin est requise");
      }

      if (data.startTime && data.endTime) {
        const duration = calculateDuration(data.startTime, data.endTime);
        if (duration <= 0) {
          errors.push("L'heure de fin doit être après l'heure de début");
        }
        if (duration < 5) {
          errors.push("La durée minimale est de 5 minutes");
        }
        if (duration > 480) {
          // 8 heures max
          errors.push("La durée maximale est de 8 heures");
        }
      }

      return errors;
    },
    [calculateDuration],
  );

  // Créer un nouveau créneau
  const createTimeSlot = useCallback(
    async (data: CreateTimeSlotData): Promise<TimeSlot> => {
      setLoading(true);

      try {
        const errors = validateTimeSlot(data);
        if (errors.length > 0) {
          throw new Error(errors.join(", "));
        }

        const duration = calculateDuration(data.startTime, data.endTime);
        const nextOrder =
          Math.max(...timeSlots.map((slot) => slot.displayOrder), 0) + 1;

        const newTimeSlot: TimeSlot = {
          id: `slot-${Date.now()}`,
          createdBy: teacherId,
          name: data.name.trim(),
          startTime: data.startTime,
          endTime: data.endTime,
          durationMinutes: duration,
          displayOrder: nextOrder,
          isBreak: data.isBreak || false,
          createdAt: new Date(),
          updatedAt: new Date(),
          overlaps: function (other: TimeSlot): boolean {
            const thisStart = parseInt(this.startTime.replace(":", ""), 10);
            const thisEnd = parseInt(this.endTime.replace(":", ""), 10);
            const otherStart = parseInt(other.startTime.replace(":", ""), 10);
            const otherEnd = parseInt(other.endTime.replace(":", ""), 10);
            return thisStart < otherEnd && thisEnd > otherStart;
          },
          getDuration: function (): number {
            return this.durationMinutes;
          },
        };

        setTimeSlots((prev) =>
          [...prev, newTimeSlot].sort(
            (a, b) => a.displayOrder - b.displayOrder,
          ),
        );
        return newTimeSlot;
      } finally {
        setLoading(false);
      }
    },
    [teacherId, timeSlots, validateTimeSlot, calculateDuration],
  );

  // Modifier un créneau
  const updateTimeSlot = useCallback(
    async (data: UpdateTimeSlotData): Promise<TimeSlot> => {
      setLoading(true);

      try {
        const errors = validateTimeSlot(data);
        if (errors.length > 0) {
          throw new Error(errors.join(", "));
        }

        const duration = calculateDuration(data.startTime, data.endTime);

        setTimeSlots((prev) =>
          prev.map((slot) =>
            slot.id === data.id
              ? {
                  ...slot,
                  name: data.name.trim(),
                  startTime: data.startTime,
                  endTime: data.endTime,
                  durationMinutes: duration,
                  isBreak: data.isBreak || false,
                  updatedAt: new Date(),
                }
              : slot,
          ),
        );

        const updatedSlot = timeSlots.find((slot) => slot.id === data.id);
        if (!updatedSlot) {
          throw new Error("Créneau non trouvé");
        }

        return {
          ...updatedSlot,
          name: data.name.trim(),
          startTime: data.startTime,
          endTime: data.endTime,
          durationMinutes: duration,
          isBreak: data.isBreak || false,
          updatedAt: new Date(),
        };
      } finally {
        setLoading(false);
      }
    },
    [timeSlots, validateTimeSlot, calculateDuration],
  );

  // Supprimer un créneau (soft delete via isBreak)
  const deleteTimeSlot = useCallback(async (id: string): Promise<void> => {
    setLoading(true);

    try {
      setTimeSlots((prev) => prev.filter((slot) => slot.id !== id));
    } finally {
      setLoading(false);
    }
  }, []);

  // Désactiver/activer un créneau
  const toggleTimeSlot = useCallback(async (id: string): Promise<void> => {
    setLoading(true);

    try {
      setTimeSlots((prev) =>
        prev.map((slot) =>
          slot.id === id
            ? { ...slot, isBreak: !slot.isBreak, updatedAt: new Date() }
            : slot,
        ),
      );
    } finally {
      setLoading(false);
    }
  }, []);

  // Réorganiser les créneaux
  const reorderTimeSlots = useCallback(
    async (reorderedSlots: TimeSlot[]): Promise<void> => {
      setLoading(true);

      try {
        const slotsWithNewOrder = reorderedSlots.map((slot, index) => ({
          ...slot,
          displayOrder: index + 1,
          updatedAt: new Date(),
        }));

        setTimeSlots(slotsWithNewOrder);
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  // Obtenir les créneaux actifs uniquement
  const getActiveTimeSlots = useCallback(() => {
    return timeSlots.filter((slot) => !slot.isBreak);
  }, [timeSlots]);

  // Vérifier les conflits avec un nouveau créneau
  const checkConflicts = useCallback(
    (newSlot: CreateTimeSlotData | UpdateTimeSlotData, excludeId?: string) => {
      const conflicts = timeSlots.filter((slot) => {
        if (excludeId && slot.id === excludeId) return false;
        if (slot.isBreak) return false;

        const slotStart = parseInt(slot.startTime.replace(":", ""), 10);
        const slotEnd = parseInt(slot.endTime.replace(":", ""), 10);
        const newStart = parseInt(newSlot.startTime.replace(":", ""), 10);
        const newEnd = parseInt(newSlot.endTime.replace(":", ""), 10);

        return newStart < slotEnd && newEnd > slotStart;
      });

      return conflicts;
    },
    [timeSlots],
  );

  return {
    timeSlots,
    loading,
    createTimeSlot,
    updateTimeSlot,
    deleteTimeSlot,
    toggleTimeSlot,
    reorderTimeSlots,
    getActiveTimeSlots,
    checkConflicts,
    calculateDuration,
    validateTimeSlot,
  };
}
