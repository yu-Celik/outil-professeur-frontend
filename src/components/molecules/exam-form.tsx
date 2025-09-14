"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/atoms/button";
import { Input } from "@/components/atoms/input";
import { Textarea } from "@/components/atoms/textarea";
import { Label } from "@/components/atoms/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/atoms/select";
import { Calendar } from "@/components/atoms/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/atoms/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { RubricSelector } from "@/components/molecules/rubric-selector";
import type { ExamFormData } from "@/hooks/use-exam-management";
import type { Exam, Class, Subject, AcademicPeriod, NotationSystem } from "@/types/uml-entities";

export interface ExamFormProps {
  exam?: Exam | null;
  classes: Class[];
  subjects: Subject[];
  academicPeriods: AcademicPeriod[];
  notationSystems: NotationSystem[];
  onSubmit: (data: ExamFormData) => Promise<void>;
  onCancel: () => void;
  isSubmitting?: boolean;
}

const examTypes = [
  "Contrôle écrit",
  "Quiz en ligne", 
  "Présentation orale",
  "Projet créatif",
  "Dissertation",
  "Examen final",
  "Test de connaissances",
  "Évaluation pratique",
];

export function ExamForm({
  exam,
  classes,
  subjects,
  academicPeriods,
  notationSystems,
  onSubmit,
  onCancel,
  isSubmitting = false,
}: ExamFormProps) {
  const [formData, setFormData] = useState<ExamFormData>({
    title: exam?.title || "",
    description: exam?.description || "",
    classId: exam?.classId || "",
    subjectId: exam?.subjectId || "",
    academicPeriodId: exam?.academicPeriodId || "",
    notationSystemId: exam?.notationSystemId || "",
    examDate: exam?.examDate || new Date(),
    examType: exam?.examType || "",
    durationMinutes: exam?.durationMinutes || 60,
    totalPoints: exam?.totalPoints || 20,
    coefficient: exam?.coefficient || 1,
    instructions: exam?.instructions || "",
    rubricId: exam?.rubricId || undefined,
  });

  const [errors, setErrors] = useState<Partial<Record<keyof ExamFormData, string>>>({});

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof ExamFormData, string>> = {};

    if (!formData.title.trim()) {
      newErrors.title = "Le titre est requis";
    }

    if (!formData.classId) {
      newErrors.classId = "La classe est requise";
    }

    if (!formData.subjectId) {
      newErrors.subjectId = "La matière est requise";
    }

    if (!formData.academicPeriodId) {
      newErrors.academicPeriodId = "La période académique est requise";
    }

    if (!formData.notationSystemId) {
      newErrors.notationSystemId = "Le système de notation est requis";
    }

    if (!formData.examType) {
      newErrors.examType = "Le type d'examen est requis";
    }

    if (formData.durationMinutes <= 0) {
      newErrors.durationMinutes = "La durée doit être positive";
    }

    if (formData.totalPoints <= 0) {
      newErrors.totalPoints = "Le total de points doit être positif";
    }

    if (formData.coefficient <= 0) {
      newErrors.coefficient = "Le coefficient doit être positif";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      await onSubmit(formData);
    } catch (error) {
      console.error("Erreur lors de la soumission:", error);
    }
  };

  const updateField = <K extends keyof ExamFormData>(
    key: K,
    value: ExamFormData[K]
  ) => {
    setFormData(prev => ({ ...prev, [key]: value }));
    // Effacer l'erreur pour ce champ
    if (errors[key]) {
      setErrors(prev => ({ ...prev, [key]: undefined }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Informations générales */}
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="title">Titre *</Label>
          <Input
            id="title"
            value={formData.title}
            onChange={(e) => updateField("title", e.target.value)}
            placeholder="Ex: Contrôle n°1 - Fonctions"
            className={errors.title ? "border-destructive" : ""}
          />
          {errors.title && (
            <p className="text-sm text-destructive">{errors.title}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="examType">Type d'examen *</Label>
          <Select
            value={formData.examType}
            onValueChange={(value) => updateField("examType", value)}
          >
            <SelectTrigger className={errors.examType ? "border-destructive" : ""}>
              <SelectValue placeholder="Sélectionnez un type" />
            </SelectTrigger>
            <SelectContent>
              {examTypes.map((type) => (
                <SelectItem key={type} value={type}>
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.examType && (
            <p className="text-sm text-destructive">{errors.examType}</p>
          )}
        </div>
      </div>

      {/* Description */}
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => updateField("description", e.target.value)}
          placeholder="Description détaillée de l'évaluation..."
          rows={3}
        />
      </div>

      {/* Classe, Matière et Période */}
      <div className="grid gap-4 md:grid-cols-3">
        <div className="space-y-2">
          <Label>Classe *</Label>
          <Select
            value={formData.classId}
            onValueChange={(value) => updateField("classId", value)}
          >
            <SelectTrigger className={errors.classId ? "border-destructive" : ""}>
              <SelectValue placeholder="Sélectionnez une classe" />
            </SelectTrigger>
            <SelectContent>
              {classes.map((classe) => (
                <SelectItem key={classe.id} value={classe.id}>
                  {classe.classCode} - {classe.gradeLabel}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.classId && (
            <p className="text-sm text-destructive">{errors.classId}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label>Matière *</Label>
          <Select
            value={formData.subjectId}
            onValueChange={(value) => updateField("subjectId", value)}
          >
            <SelectTrigger className={errors.subjectId ? "border-destructive" : ""}>
              <SelectValue placeholder="Sélectionnez une matière" />
            </SelectTrigger>
            <SelectContent>
              {subjects.map((subject) => (
                <SelectItem key={subject.id} value={subject.id}>
                  {subject.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.subjectId && (
            <p className="text-sm text-destructive">{errors.subjectId}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label>Période *</Label>
          <Select
            value={formData.academicPeriodId}
            onValueChange={(value) => updateField("academicPeriodId", value)}
          >
            <SelectTrigger className={errors.academicPeriodId ? "border-destructive" : ""}>
              <SelectValue placeholder="Sélectionnez une période" />
            </SelectTrigger>
            <SelectContent>
              {academicPeriods.map((period) => (
                <SelectItem key={period.id} value={period.id}>
                  {period.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.academicPeriodId && (
            <p className="text-sm text-destructive">{errors.academicPeriodId}</p>
          )}
        </div>
      </div>

      {/* Date et paramètres */}
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label>Date de l'examen *</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !formData.examDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {formData.examDate ? (
                  format(formData.examDate, "dd MMM yyyy", { locale: fr })
                ) : (
                  "Sélectionner une date"
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={formData.examDate}
                onSelect={(date) => date && updateField("examDate", date)}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        <div className="space-y-2">
          <Label htmlFor="durationMinutes">Durée (minutes) *</Label>
          <Input
            id="durationMinutes"
            type="number"
            min="1"
            max="600"
            value={formData.durationMinutes}
            onChange={(e) => updateField("durationMinutes", parseInt(e.target.value) || 0)}
            className={errors.durationMinutes ? "border-destructive" : ""}
          />
          {errors.durationMinutes && (
            <p className="text-sm text-destructive">{errors.durationMinutes}</p>
          )}
        </div>
      </div>

      {/* Notation */}
      <div className="grid gap-4 md:grid-cols-3">
        <div className="space-y-2">
          <Label>Système de notation *</Label>
          <Select
            value={formData.notationSystemId}
            onValueChange={(value) => updateField("notationSystemId", value)}
          >
            <SelectTrigger className={errors.notationSystemId ? "border-destructive" : ""}>
              <SelectValue placeholder="Sélectionnez un système" />
            </SelectTrigger>
            <SelectContent>
              {notationSystems.map((system) => (
                <SelectItem key={system.id} value={system.id}>
                  {system.name} ({system.minValue}-{system.maxValue})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.notationSystemId && (
            <p className="text-sm text-destructive">{errors.notationSystemId}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="totalPoints">Total points *</Label>
          <Input
            id="totalPoints"
            type="number"
            min="1"
            max="200"
            step="0.5"
            value={formData.totalPoints}
            onChange={(e) => updateField("totalPoints", parseFloat(e.target.value) || 0)}
            className={errors.totalPoints ? "border-destructive" : ""}
          />
          {errors.totalPoints && (
            <p className="text-sm text-destructive">{errors.totalPoints}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="coefficient">Coefficient *</Label>
          <Input
            id="coefficient"
            type="number"
            min="0.1"
            max="10"
            step="0.1"
            value={formData.coefficient}
            onChange={(e) => updateField("coefficient", parseFloat(e.target.value) || 0)}
            className={errors.coefficient ? "border-destructive" : ""}
          />
          {errors.coefficient && (
            <p className="text-sm text-destructive">{errors.coefficient}</p>
          )}
        </div>
      </div>

      {/* Grille d'évaluation */}
      <RubricSelector
        value={formData.rubricId}
        onValueChange={(rubricId) => updateField("rubricId", rubricId || undefined)}
        teacherId={exam?.createdBy}
        className="w-full"
      />

      {/* Instructions */}
      <div className="space-y-2">
        <Label htmlFor="instructions">Instructions pour les élèves</Label>
        <Textarea
          id="instructions"
          value={formData.instructions}
          onChange={(e) => updateField("instructions", e.target.value)}
          placeholder="Consignes particulières, matériel autorisé, etc."
          rows={3}
        />
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-2 pt-4 border-t">
        <Button type="button" variant="outline" onClick={onCancel}>
          Annuler
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Enregistrement..." : exam ? "Modifier" : "Créer"}
        </Button>
      </div>
    </form>
  );
}