"use client";

import { useState } from "react";
import { Button } from "@/components/atoms/button";
import { Input } from "@/components/atoms/input";
import { Label } from "@/components/atoms/label";
import type { SchoolYear } from "@/types/uml-entities";

interface SchoolYearCrudFormProps {
  onSubmit: (data: {
    name: string;
    startDate: Date;
    endDate: Date;
    isActive?: boolean;
  }) => Promise<void>;
  onCancel: () => void;
  editingYear?: SchoolYear | null;
  existingYears: SchoolYear[];
}

export function SchoolYearCrudForm({
  onSubmit,
  onCancel,
  editingYear,
  existingYears,
}: SchoolYearCrudFormProps) {
  const [name, setName] = useState(editingYear?.name ?? "");
  const [startDate, setStartDate] = useState(
    editingYear?.startDate.toISOString().split("T")[0] ?? "",
  );
  const [endDate, setEndDate] = useState(
    editingYear?.endDate.toISOString().split("T")[0] ?? "",
  );
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!name.trim()) {
      newErrors.name = "Le nom est requis";
    }

    if (!startDate) {
      newErrors.startDate = "La date de début est requise";
    }

    if (!endDate) {
      newErrors.endDate = "La date de fin est requise";
    }

    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);

      if (start >= end) {
        newErrors.endDate =
          "La date de fin doit être postérieure à la date de début";
      }

      // Check for overlaps with existing years
      const overlappingYear = existingYears.find((year) => {
        if (editingYear && year.id === editingYear.id) return false;

        return (
          (start >= year.startDate && start <= year.endDate) ||
          (end >= year.startDate && end <= year.endDate) ||
          (start <= year.startDate && end >= year.endDate)
        );
      });

      if (overlappingYear) {
        newErrors.startDate = `Chevauchement avec "${overlappingYear.name}"`;
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    setSubmitting(true);

    try {
      await onSubmit({
        name,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        isActive: editingYear?.isActive ?? false,
      });
    } catch (error) {
      console.error("Form submission error:", error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Nom de l'année scolaire</Label>
        <Input
          id="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="ex: Année scolaire 2025-2026"
          className={errors.name ? "border-destructive" : ""}
        />
        {errors.name && (
          <p className="text-sm text-destructive">{errors.name}</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="startDate">Date de début</Label>
          <Input
            id="startDate"
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className={errors.startDate ? "border-destructive" : ""}
          />
          {errors.startDate && (
            <p className="text-sm text-destructive">{errors.startDate}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="endDate">Date de fin</Label>
          <Input
            id="endDate"
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className={errors.endDate ? "border-destructive" : ""}
          />
          {errors.endDate && (
            <p className="text-sm text-destructive">{errors.endDate}</p>
          )}
        </div>
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Annuler
        </Button>
        <Button type="submit" disabled={submitting}>
          {submitting
            ? "Enregistrement..."
            : editingYear
              ? "Mettre à jour"
              : "Créer"}
        </Button>
      </div>
    </form>
  );
}
