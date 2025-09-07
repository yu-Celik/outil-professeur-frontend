"use client";

import {
  Clock,
  Coffee,
  Hash,
  Play,
  Save,
  Square,
  X,
} from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "@/components/atoms/button";
import { Input } from "@/components/atoms/input";
import { Label } from "@/components/atoms/label";
import { Checkbox } from "@/components/atoms/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/molecules/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/molecules/dialog";
import type { TimeSlot } from "@/types/uml-entities";

interface TimeSlotCrudFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: TimeSlotFormData) => void;
  editingTimeSlot?: TimeSlot | null;
  existingTimeSlots?: TimeSlot[];
  isLoading?: boolean;
  calculateDuration?: (startTime: string, endTime: string) => number;
  checkConflicts?: (data: { startTime: string; endTime: string; name: string }, excludeId?: string) => string[];
}

interface TimeSlotFormData {
  name: string;
  startTime: string;
  endTime: string;
  durationMinutes: number;
  displayOrder: number;
  isBreak: boolean;
}

const PREDEFINED_TIMESLOTS = [
  { name: "M1", startTime: "08:00", endTime: "09:00", isBreak: false },
  { name: "M2", startTime: "09:00", endTime: "10:00", isBreak: false },
  { name: "Récréation", startTime: "10:00", endTime: "10:15", isBreak: true },
  { name: "M3", startTime: "10:15", endTime: "11:15", isBreak: false },
  { name: "M4", startTime: "11:15", endTime: "12:15", isBreak: false },
  { name: "Pause déjeuner", startTime: "12:15", endTime: "13:15", isBreak: true },
  { name: "S1", startTime: "13:15", endTime: "14:15", isBreak: false },
  { name: "S2", startTime: "14:15", endTime: "15:15", isBreak: false },
  { name: "Récréation", startTime: "15:15", endTime: "15:30", isBreak: true },
  { name: "S3", startTime: "15:30", endTime: "16:30", isBreak: false },
  { name: "S4", startTime: "16:30", endTime: "17:30", isBreak: false },
];

export function TimeSlotCrudForm({
  isOpen,
  onClose,
  onSubmit,
  editingTimeSlot,
  existingTimeSlots = [],
  isLoading = false,
  calculateDuration,
  checkConflicts,
}: TimeSlotCrudFormProps) {
  const [name, setName] = useState(editingTimeSlot?.name || "");
  const [startTime, setStartTime] = useState(editingTimeSlot?.startTime || "");
  const [endTime, setEndTime] = useState(editingTimeSlot?.endTime || "");
  const [displayOrder, setDisplayOrder] = useState(
    editingTimeSlot?.displayOrder || existingTimeSlots.length + 1,
  );
  const [isBreak, setIsBreak] = useState(editingTimeSlot?.isBreak || false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [durationMinutes, setDurationMinutes] = useState(
    editingTimeSlot?.durationMinutes || 0,
  );

  const isEditing = !!editingTimeSlot;

  // Calculer la durée automatiquement quand les heures changent
  useEffect(() => {
    if (startTime && endTime) {
      if (calculateDuration) {
        // Utiliser la fonction externe si fournie
        const minutes = calculateDuration(startTime, endTime);
        setDurationMinutes(minutes);
      } else {
        // Calcul par défaut
        const start = new Date(`2000-01-01T${startTime}:00`);
        const end = new Date(`2000-01-01T${endTime}:00`);
        const diff = end.getTime() - start.getTime();
        const minutes = Math.max(0, Math.floor(diff / (1000 * 60)));
        setDurationMinutes(minutes);
      }
    }
  }, [startTime, endTime, calculateDuration]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!name.trim()) {
      newErrors.name = "Le nom du créneau est requis";
    }

    if (!startTime) {
      newErrors.startTime = "L'heure de début est requise";
    }

    if (!endTime) {
      newErrors.endTime = "L'heure de fin est requise";
    }

    if (startTime && endTime) {
      const start = new Date(`2000-01-01T${startTime}:00`);
      const end = new Date(`2000-01-01T${endTime}:00`);
      
      if (start >= end) {
        newErrors.endTime = "L'heure de fin doit être après l'heure de début";
      }

      // Vérifier les chevauchements avec d'autres créneaux
      if (checkConflicts) {
        // Utiliser la fonction externe si fournie
        const conflicts = checkConflicts(
          { startTime, endTime, name },
          isEditing ? editingTimeSlot.id : undefined
        );
        if (conflicts.length > 0) {
          newErrors.overlap = `Ce créneau chevauche avec: ${conflicts.join(", ")}`;
        }
      } else {
        // Vérification par défaut
        const hasOverlap = existingTimeSlots.some((slot) => {
          if (isEditing && slot.id === editingTimeSlot.id) return false;
          
          const slotStart = new Date(`2000-01-01T${slot.startTime}:00`);
          const slotEnd = new Date(`2000-01-01T${slot.endTime}:00`);
          
          return (start < slotEnd && end > slotStart);
        });

        if (hasOverlap) {
          newErrors.overlap = "Ce créneau chevauche avec un autre créneau existant";
        }
      }
    }

    if (displayOrder < 1) {
      newErrors.displayOrder = "L'ordre d'affichage doit être supérieur à 0";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    onSubmit({
      name: name.trim(),
      startTime,
      endTime,
      durationMinutes,
      displayOrder,
      isBreak,
    });
  };

  const handleClose = () => {
    if (!isLoading) {
      setName("");
      setStartTime("");
      setEndTime("");
      setDisplayOrder(existingTimeSlots.length + 1);
      setIsBreak(false);
      setDurationMinutes(0);
      setErrors({});
      onClose();
    }
  };

  const handlePredefinedSelect = (predefined: typeof PREDEFINED_TIMESLOTS[0]) => {
    setName(predefined.name);
    setStartTime(predefined.startTime);
    setEndTime(predefined.endTime);
    setIsBreak(predefined.isBreak);
  };

  const formatDuration = (minutes: number): string => {
    if (minutes === 0) return "0min";
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours === 0) return `${mins}min`;
    if (mins === 0) return `${hours}h`;
    return `${hours}h${mins.toString().padStart(2, "0")}`;
  };

  const isValid = name.trim() && startTime && endTime && displayOrder >= 1 && durationMinutes > 0;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent size="2xl" className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-primary" />
            {isEditing ? "Modifier le créneau" : "Nouveau créneau horaire"}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Modifiez les informations du créneau horaire"
              : "Créez un nouveau créneau horaire pour l'emploi du temps"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Créneaux prédéfinis */}
          {!isEditing && (
            <div className="space-y-3">
              <Label className="text-sm font-medium">
                Créneaux prédéfinis (optionnel)
              </Label>
              <div className="grid grid-cols-3 gap-2 max-h-32 overflow-y-auto">
                {PREDEFINED_TIMESLOTS.map((slot, index) => (
                  <Button
                    key={index}
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => handlePredefinedSelect(slot)}
                    className="text-left justify-start h-auto p-2"
                    disabled={isLoading}
                  >
                    <div className="flex items-center gap-2">
                      {slot.isBreak ? (
                        <Coffee className="h-3 w-3 text-orange-500" />
                      ) : (
                        <Clock className="h-3 w-3 text-blue-500" />
                      )}
                      <div>
                        <div className="font-medium text-xs">{slot.name}</div>
                        <div className="text-xs text-muted-foreground">
                          {slot.startTime} - {slot.endTime}
                        </div>
                      </div>
                    </div>
                  </Button>
                ))}
              </div>
              <div className="text-center">
                <div className="text-xs text-muted-foreground">
                  ou créez un créneau personnalisé ci-dessous
                </div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Nom du créneau */}
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-medium">
                Nom du créneau
              </Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex: M1, S2, Récréation..."
                className={`h-11 ${errors.name ? "border-destructive" : ""}`}
                disabled={isLoading}
              />
              {errors.name && (
                <p className="text-sm text-destructive">{errors.name}</p>
              )}
            </div>

            {/* Ordre d'affichage */}
            <div className="space-y-2">
              <Label
                htmlFor="displayOrder"
                className="text-sm font-medium flex items-center gap-2"
              >
                <Hash className="h-4 w-4 text-primary" />
                Ordre d'affichage
              </Label>
              <Input
                id="displayOrder"
                type="number"
                value={displayOrder}
                onChange={(e) => setDisplayOrder(Number(e.target.value))}
                min="1"
                className={`h-11 ${errors.displayOrder ? "border-destructive" : ""}`}
                disabled={isLoading}
              />
              {errors.displayOrder && (
                <p className="text-sm text-destructive">{errors.displayOrder}</p>
              )}
            </div>

            {/* Heure de début */}
            <div className="space-y-2">
              <Label
                htmlFor="startTime"
                className="text-sm font-medium flex items-center gap-2"
              >
                <Play className="h-4 w-4 text-green-500" />
                Heure de début
              </Label>
              <Input
                id="startTime"
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className={`h-11 ${errors.startTime ? "border-destructive" : ""}`}
                disabled={isLoading}
              />
              {errors.startTime && (
                <p className="text-sm text-destructive">{errors.startTime}</p>
              )}
            </div>

            {/* Heure de fin */}
            <div className="space-y-2">
              <Label
                htmlFor="endTime"
                className="text-sm font-medium flex items-center gap-2"
              >
                <Square className="h-4 w-4 text-red-500" />
                Heure de fin
              </Label>
              <Input
                id="endTime"
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className={`h-11 ${errors.endTime ? "border-destructive" : ""}`}
                disabled={isLoading}
              />
              {errors.endTime && (
                <p className="text-sm text-destructive">{errors.endTime}</p>
              )}
            </div>
          </div>

          {/* Durée calculée */}
          {durationMinutes > 0 && (
            <div className="p-3 bg-muted/30 rounded-lg border border-border/50">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-blue-500" />
                <span className="text-sm font-medium">
                  Durée: {formatDuration(durationMinutes)}
                </span>
              </div>
            </div>
          )}

          {/* Type de créneau */}
          <div className="flex items-center space-x-2">
            <Checkbox
              id="isBreak"
              checked={isBreak}
              onCheckedChange={(checked) => setIsBreak(checked as boolean)}
              disabled={isLoading}
            />
            <Label htmlFor="isBreak" className="text-sm font-medium flex items-center gap-2">
              <Coffee className="h-4 w-4 text-orange-500" />
              Créneau de pause (récréation, déjeuner...)
            </Label>
          </div>

          {/* Erreur de chevauchement */}
          {errors.overlap && (
            <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
              <p className="text-sm text-destructive">{errors.overlap}</p>
            </div>
          )}

          {/* Aperçu du créneau */}
          {isValid && (
            <div className="p-4 bg-muted/30 rounded-lg border border-border/50">
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                  isBreak ? "bg-orange-100" : "bg-primary/10"
                }`}>
                  {isBreak ? (
                    <Coffee className="h-5 w-5 text-orange-500" />
                  ) : (
                    <Clock className="h-5 w-5 text-primary" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-medium text-sm">{name}</p>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      isBreak 
                        ? "bg-orange-100 text-orange-800" 
                        : "bg-primary/20 text-primary"
                    }`}>
                      {isBreak ? "Pause" : "Cours"}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span>{startTime} - {endTime}</span>
                    <span>{formatDuration(durationMinutes)}</span>
                    <span>Ordre: {displayOrder}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isLoading}
            >
              <X className="h-4 w-4 mr-2" />
              Annuler
            </Button>
            <Button type="submit" disabled={!isValid || isLoading}>
              <Save className="h-4 w-4 mr-2" />
              {isLoading
                ? "Enregistrement..."
                : isEditing
                  ? "Modifier"
                  : "Créer"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}