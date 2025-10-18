"use client";

import { Calendar, Save } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/atoms/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/molecules/dialog";
import { Input } from "@/components/atoms/input";
import { Label } from "@/components/atoms/label";
import { Textarea } from "@/components/atoms/textarea";
import type {
  ObservationFormData,
  StudentObservation,
} from "@/features/students/types/observation-types";
import { format } from "date-fns";

interface StudentObservationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (data: ObservationFormData) => Promise<void>;
  observation?: StudentObservation; // If provided, we're editing
  studentName?: string;
}

export function StudentObservationDialog({
  open,
  onOpenChange,
  onSave,
  observation,
  studentName,
}: StudentObservationDialogProps) {
  const [content, setContent] = useState("");
  const [date, setDate] = useState<string>("");
  const [isSaving, setIsSaving] = useState(false);
  const [errors, setErrors] = useState<{ content?: string; date?: string }>({});

  const isEditing = !!observation;

  // Initialize form when dialog opens or observation changes
  useEffect(() => {
    if (open) {
      if (observation) {
        setContent(observation.content);
        setDate(format(observation.createdAt, "yyyy-MM-dd"));
      } else {
        setContent("");
        setDate(format(new Date(), "yyyy-MM-dd"));
      }
      setErrors({});
    }
  }, [open, observation]);

  const validate = (): boolean => {
    const newErrors: { content?: string; date?: string } = {};

    if (!content.trim()) {
      newErrors.content = "Le contenu de l'observation est requis";
    } else if (content.length > 2000) {
      newErrors.content = "Le contenu ne peut pas dépasser 2000 caractères";
    }

    if (!date) {
      newErrors.date = "La date est requise";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) {
      return;
    }

    setIsSaving(true);
    try {
      await onSave({
        content: content.trim(),
        date: new Date(date),
      });

      // Close dialog on success
      onOpenChange(false);
    } catch (error) {
      console.error("Error saving observation:", error);
      // Error toast is handled by the hook
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Modifier l'observation" : "Nouvelle observation"}
          </DialogTitle>
          <DialogDescription>
            {studentName
              ? `Observation pour ${studentName}`
              : "Ajoutez une observation pédagogique"}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Date Field */}
          <div className="space-y-2">
            <Label
              htmlFor="observation-date"
              className="flex items-center gap-2"
            >
              <Calendar className="h-4 w-4" />
              Date
            </Label>
            <Input
              id="observation-date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className={errors.date ? "border-destructive" : ""}
            />
            {errors.date && (
              <p className="text-xs text-destructive">{errors.date}</p>
            )}
          </div>

          {/* Content Field */}
          <div className="space-y-2">
            <Label htmlFor="observation-content">
              Contenu
              <span className="text-xs text-muted-foreground ml-2">
                ({content.length}/2000 caractères)
              </span>
            </Label>
            <Textarea
              id="observation-content"
              placeholder="Décrivez votre observation..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={10}
              className={errors.content ? "border-destructive" : ""}
            />
            {errors.content && (
              <p className="text-xs text-destructive">{errors.content}</p>
            )}
            <p className="text-xs text-muted-foreground">
              Notez vos observations sur le comportement, la participation, les
              progrès ou tout autre élément pertinent pour le suivi de l'élève.
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleCancel} disabled={isSaving}>
            Annuler
          </Button>
          <Button onClick={handleSave} disabled={isSaving}>
            <Save className="h-4 w-4 mr-2" />
            {isSaving
              ? "Enregistrement..."
              : isEditing
                ? "Mettre à jour"
                : "Enregistrer"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
