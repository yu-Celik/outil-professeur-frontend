"use client";

import {
  Calendar,
  Clock,
  BookOpen,
  GraduationCap,
  Save,
  X,
} from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "@/components/atoms/button";
import { Label } from "@/components/atoms/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/atoms/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/atoms/dialog";
import { useClassManagement, useSubjectManagement } from "@/features/gestion";
import { useTimeSlots } from "@/features/calendar";
import type { WeeklyTemplate } from "@/types/uml-entities";

interface WeeklyTemplateFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: WeeklyTemplateFormData) => void;
  editingTemplate?: WeeklyTemplate | null;
  teacherId: string;
  isLoading?: boolean;
}

interface WeeklyTemplateFormData {
  schoolYearId: string;
  dayOfWeek: number;
  timeSlotId: string;
  classId: string;
  subjectId: string;
  teacherId: string;
  isActive: boolean;
}

const DAYS_OF_WEEK = [
  { value: 1, label: "Lundi" },
  { value: 2, label: "Mardi" },
  { value: 3, label: "Mercredi" },
  { value: 4, label: "Jeudi" },
  { value: 5, label: "Vendredi" },
  { value: 6, label: "Samedi" },
  { value: 7, label: "Dimanche" },
];

export function WeeklyTemplateForm({
  isOpen,
  onClose,
  onSubmit,
  editingTemplate,
  teacherId,
  isLoading = false,
}: WeeklyTemplateFormProps) {
  // Load data from hooks
  const { classes } = useClassManagement();
  const { subjects } = useSubjectManagement();
  const { timeSlots } = useTimeSlots(teacherId);

  // Form state
  const [schoolYearId, setSchoolYearId] = useState(
    editingTemplate?.schoolYearId || "sy-2024-2025",
  );
  const [dayOfWeek, setDayOfWeek] = useState<number | undefined>(
    editingTemplate?.dayOfWeek,
  );
  const [timeSlotId, setTimeSlotId] = useState(
    editingTemplate?.timeSlotId || "",
  );
  const [classId, setClassId] = useState(editingTemplate?.classId || "");
  const [subjectId, setSubjectId] = useState(editingTemplate?.subjectId || "");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const isEditing = !!editingTemplate;

  // Filter active time slots (not breaks)
  const activeTimeSlots = timeSlots.filter((slot) => !slot.isBreak);

  // Reset form when editing template changes
  useEffect(() => {
    if (editingTemplate) {
      setSchoolYearId(editingTemplate.schoolYearId);
      setDayOfWeek(editingTemplate.dayOfWeek);
      setTimeSlotId(editingTemplate.timeSlotId);
      setClassId(editingTemplate.classId);
      setSubjectId(editingTemplate.subjectId);
    }
  }, [editingTemplate]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!schoolYearId) {
      newErrors.schoolYearId = "L'année scolaire est requise";
    }
    if (!dayOfWeek) {
      newErrors.dayOfWeek = "Le jour de la semaine est requis";
    }
    if (!timeSlotId) {
      newErrors.timeSlotId = "Le créneau horaire est requis";
    }
    if (!classId) {
      newErrors.classId = "La classe est requise";
    }
    if (!subjectId) {
      newErrors.subjectId = "La matière est requise";
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
      schoolYearId,
      dayOfWeek: dayOfWeek!,
      timeSlotId,
      classId,
      subjectId,
      teacherId,
      isActive: true,
    });
  };

  const handleClose = () => {
    if (!isLoading) {
      setSchoolYearId("sy-2024-2025");
      setDayOfWeek(undefined);
      setTimeSlotId("");
      setClassId("");
      setSubjectId("");
      setErrors({});
      onClose();
    }
  };

  const selectedClass = classes.find((c) => c.id === classId);
  const selectedSubject = subjects.find((s) => s.id === subjectId);
  const selectedTimeSlot = activeTimeSlots.find((ts) => ts.id === timeSlotId);
  const selectedDay = DAYS_OF_WEEK.find((d) => d.value === dayOfWeek);

  const isValid =
    schoolYearId && dayOfWeek && timeSlotId && classId && subjectId;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" />
            {isEditing
              ? "Modifier le template"
              : "Nouveau template hebdomadaire"}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Modifiez votre template de session récurrente"
              : "Créez un template de session qui se répètera chaque semaine"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* School Year - Fixed for now */}
          <div className="space-y-2">
            <Label htmlFor="schoolYear" className="text-sm font-medium">
              Année scolaire
            </Label>
            <Select
              value={schoolYearId}
              onValueChange={setSchoolYearId}
              disabled={isLoading}
            >
              <SelectTrigger
                id="schoolYear"
                className={`h-11 ${errors.schoolYearId ? "border-destructive" : ""}`}
              >
                <SelectValue placeholder="Sélectionner l'année" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sy-2024-2025">2024-2025</SelectItem>
                <SelectItem value="sy-2025-2026">2025-2026</SelectItem>
              </SelectContent>
            </Select>
            {errors.schoolYearId && (
              <p className="text-sm text-destructive">{errors.schoolYearId}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Day of Week */}
            <div className="space-y-2">
              <Label
                htmlFor="dayOfWeek"
                className="text-sm font-medium flex items-center gap-2"
              >
                <Calendar className="h-4 w-4 text-primary" />
                Jour de la semaine
              </Label>
              <Select
                value={dayOfWeek?.toString()}
                onValueChange={(value) => setDayOfWeek(Number.parseInt(value))}
                disabled={isLoading}
              >
                <SelectTrigger
                  id="dayOfWeek"
                  className={`h-11 ${errors.dayOfWeek ? "border-destructive" : ""}`}
                >
                  <SelectValue placeholder="Choisir un jour" />
                </SelectTrigger>
                <SelectContent>
                  {DAYS_OF_WEEK.map((day) => (
                    <SelectItem key={day.value} value={day.value.toString()}>
                      {day.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.dayOfWeek && (
                <p className="text-sm text-destructive">{errors.dayOfWeek}</p>
              )}
            </div>

            {/* Time Slot */}
            <div className="space-y-2">
              <Label
                htmlFor="timeSlot"
                className="text-sm font-medium flex items-center gap-2"
              >
                <Clock className="h-4 w-4 text-primary" />
                Créneau horaire
              </Label>
              <Select
                value={timeSlotId}
                onValueChange={setTimeSlotId}
                disabled={isLoading}
              >
                <SelectTrigger
                  id="timeSlot"
                  className={`h-11 ${errors.timeSlotId ? "border-destructive" : ""}`}
                >
                  <SelectValue placeholder="Choisir un créneau" />
                </SelectTrigger>
                <SelectContent>
                  {activeTimeSlots.length === 0 ? (
                    <div className="p-2 text-sm text-muted-foreground text-center">
                      Aucun créneau disponible
                    </div>
                  ) : (
                    activeTimeSlots.map((slot) => (
                      <SelectItem key={slot.id} value={slot.id}>
                        {slot.name} ({slot.startTime} - {slot.endTime})
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
              {errors.timeSlotId && (
                <p className="text-sm text-destructive">{errors.timeSlotId}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Class */}
            <div className="space-y-2">
              <Label
                htmlFor="class"
                className="text-sm font-medium flex items-center gap-2"
              >
                <GraduationCap className="h-4 w-4 text-primary" />
                Classe
              </Label>
              <Select
                value={classId}
                onValueChange={setClassId}
                disabled={isLoading}
              >
                <SelectTrigger
                  id="class"
                  className={`h-11 ${errors.classId ? "border-destructive" : ""}`}
                >
                  <SelectValue placeholder="Choisir une classe" />
                </SelectTrigger>
                <SelectContent>
                  {classes.length === 0 ? (
                    <div className="p-2 text-sm text-muted-foreground text-center">
                      Aucune classe disponible
                    </div>
                  ) : (
                    classes.map((cls) => (
                      <SelectItem key={cls.id} value={cls.id}>
                        {cls.classCode} - {cls.gradeLabel}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
              {errors.classId && (
                <p className="text-sm text-destructive">{errors.classId}</p>
              )}
            </div>

            {/* Subject */}
            <div className="space-y-2">
              <Label
                htmlFor="subject"
                className="text-sm font-medium flex items-center gap-2"
              >
                <BookOpen className="h-4 w-4 text-primary" />
                Matière
              </Label>
              <Select
                value={subjectId}
                onValueChange={setSubjectId}
                disabled={isLoading}
              >
                <SelectTrigger
                  id="subject"
                  className={`h-11 ${errors.subjectId ? "border-destructive" : ""}`}
                >
                  <SelectValue placeholder="Choisir une matière" />
                </SelectTrigger>
                <SelectContent>
                  {subjects.length === 0 ? (
                    <div className="p-2 text-sm text-muted-foreground text-center">
                      Aucune matière disponible
                    </div>
                  ) : (
                    subjects.map((subject) => (
                      <SelectItem key={subject.id} value={subject.id}>
                        {subject.name} ({subject.code})
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
              {errors.subjectId && (
                <p className="text-sm text-destructive">{errors.subjectId}</p>
              )}
            </div>
          </div>

          {/* Preview */}
          {isValid && (
            <div className="p-4 bg-muted/30 rounded-lg border border-border/50">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Calendar className="h-6 w-6 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-sm mb-1">
                    {selectedDay?.label} - {selectedClass?.classCode}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {selectedSubject?.name} • {selectedTimeSlot?.startTime} -{" "}
                    {selectedTimeSlot?.endTime}
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
