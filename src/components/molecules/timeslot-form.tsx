"use client";

import { useState } from "react";
import { Clock, Save, X } from "lucide-react";
import { Button } from "@/components/atoms/button";
import { Input } from "@/components/atoms/input";
import { Label } from "@/components/atoms/label";
import { Card, CardContent, CardHeader } from "@/components/molecules/card";
import type { TimeSlot } from "@/types/uml-entities";

interface TimeSlotFormProps {
  onClose: () => void;
  onSave: (data: {
    name: string;
    startTime: string;
    endTime: string;
    isBreak?: boolean;
  }) => Promise<void>;
  onUpdate?: (data: {
    id: string;
    name: string;
    startTime: string;
    endTime: string;
    isBreak?: boolean;
  }) => Promise<void>;
  initialData?: TimeSlot;
  calculateDuration: (startTime: string, endTime: string) => number;
  checkConflicts: (data: any, excludeId?: string) => TimeSlot[];
  standalone?: boolean;
}

export function TimeSlotForm({
  onClose,
  onSave,
  onUpdate,
  initialData,
  calculateDuration,
  checkConflicts,
  standalone = true,
}: TimeSlotFormProps) {
  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    startTime: initialData?.startTime || "",
    endTime: initialData?.endTime || "",
    isBreak: initialData?.isBreak || false,
  });
  const [errors, setErrors] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const duration =
    formData.startTime && formData.endTime
      ? calculateDuration(formData.startTime, formData.endTime)
      : 0;

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h${mins > 0 ? ` ${mins}min` : ""}`;
    }
    return `${mins}min`;
  };

  const conflicts =
    formData.startTime && formData.endTime
      ? checkConflicts(formData, initialData?.id)
      : [];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: string[] = [];

    if (!formData.name.trim()) {
      newErrors.push("Le nom est requis");
    }

    if (!formData.startTime) {
      newErrors.push("L'heure de début est requise");
    }

    if (!formData.endTime) {
      newErrors.push("L'heure de fin est requise");
    }

    if (formData.startTime && formData.endTime && duration <= 0) {
      newErrors.push("L'heure de fin doit être après l'heure de début");
    }

    if (duration < 5) {
      newErrors.push("La durée minimale est de 5 minutes");
    }

    if (conflicts.length > 0) {
      newErrors.push(
        `Conflit avec: ${conflicts.map((c) => c.name).join(", ")}`,
      );
    }

    setErrors(newErrors);

    if (newErrors.length > 0) return;

    setLoading(true);

    try {
      if (initialData && onUpdate) {
        await onUpdate({
          id: initialData.id,
          ...formData,
        });
      } else {
        await onSave(formData);
      }
      onClose();
    } catch (error) {
      setErrors([error instanceof Error ? error.message : "Erreur inconnue"]);
    } finally {
      setLoading(false);
    }
  };

  // Contenu du formulaire (sans wrapper)
  const formContent = (
    <form onSubmit={handleSubmit} className="space-y-4">
      {errors.length > 0 && (
        <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-md">
          <ul className="text-sm text-destructive space-y-1">
            {errors.map((error, index) => (
              <li key={index}>{error}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="name">Nom du créneau *</Label>
        <Input
          id="name"
          type="text"
          placeholder="Ex: 8h30-9h25, Pause déjeuner..."
          value={formData.name}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, name: e.target.value }))
          }
          className={
            errors.some((e) => e.includes("nom")) ? "border-destructive" : ""
          }
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="startTime">Heure de début *</Label>
          <Input
            id="startTime"
            type="time"
            value={formData.startTime}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, startTime: e.target.value }))
            }
            className={
              errors.some((e) => e.includes("début"))
                ? "border-destructive"
                : ""
            }
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="endTime">Heure de fin *</Label>
          <Input
            id="endTime"
            type="time"
            value={formData.endTime}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, endTime: e.target.value }))
            }
            className={
              errors.some((e) => e.includes("fin")) ? "border-destructive" : ""
            }
          />
        </div>
      </div>

      {duration > 0 && (
        <div className="p-3 bg-muted/50 rounded-md">
          <div className="text-sm">
            <strong>Durée:</strong> {formatDuration(duration)}
          </div>
        </div>
      )}

      {conflicts.length > 0 && (
        <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-md">
          <div className="text-sm text-destructive">
            <strong>⚠️ Conflit détecté avec:</strong>
            <ul className="mt-1 ml-4">
              {conflicts.map((conflict) => (
                <li key={conflict.id}>
                  • {conflict.name} ({conflict.startTime}-{conflict.endTime})
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="isBreak"
          checked={formData.isBreak}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, isBreak: e.target.checked }))
          }
          className="rounded border-gray-300"
        />
        <Label htmlFor="isBreak" className="text-sm">
          Marquer comme pause (désactivé)
        </Label>
      </div>

      <div className="flex justify-end gap-3 pt-4">
        <Button type="button" variant="outline" onClick={onClose}>
          Annuler
        </Button>
        <Button
          type="submit"
          disabled={loading || conflicts.length > 0}
          className="gap-2"
        >
          <Save className="h-4 w-4" />
          {loading ? "Enregistrement..." : "Enregistrer"}
        </Button>
      </div>
    </form>
  );

  // Retourner avec ou sans Card selon le mode
  if (standalone) {
    return (
      <Card className="w-full max-w-lg">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-semibold">
                {initialData ? "Modifier le créneau" : "Nouveau créneau"}
              </h2>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>{formContent}</CardContent>
      </Card>
    );
  }

  // Mode Dialog - juste le contenu du formulaire
  return formContent;
}
