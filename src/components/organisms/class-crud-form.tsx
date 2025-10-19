"use client";

import {
  Building2,
  Calendar,
  GraduationCap,
  Hash,
  Save,
  X,
} from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/atoms/button";
import { Input } from "@/components/atoms/input";
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
import type { Class, SchoolYear } from "@/types/uml-entities";

interface ClassCrudFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ClassFormData) => void;
  editingClass?: Class | null;
  schoolYears: SchoolYear[];
  isLoading?: boolean;
}

interface ClassFormData {
  classCode: string;
  gradeLabel: string;
  schoolYearId: string;
}

const DEFAULT_GRADE_LABELS = [
  { value: "cp", label: "CP" },
  { value: "ce1", label: "CE1" },
  { value: "ce2", label: "CE2" },
  { value: "cm1", label: "CM1" },
  { value: "cm2", label: "CM2" },
  { value: "6eme", label: "6ème" },
  { value: "5eme", label: "5ème" },
  { value: "4eme", label: "4ème" },
  { value: "3eme", label: "3ème" },
  { value: "2nde", label: "2nde" },
  { value: "1ere", label: "1ère" },
  { value: "terminale", label: "Terminale" },
];

export function ClassCrudForm({
  isOpen,
  onClose,
  onSubmit,
  editingClass,
  schoolYears,
  isLoading = false,
}: ClassCrudFormProps) {
  const [classCode, setClassCode] = useState(editingClass?.classCode || "");
  const [gradeLabel, setGradeLabel] = useState(editingClass?.gradeLabel || "");
  const [schoolYearId, setSchoolYearId] = useState(
    editingClass?.schoolYearId || "",
  );
  const [errors, setErrors] = useState<Record<string, string>>({});

  const isEditing = !!editingClass;
  const isValid = classCode.trim() && gradeLabel.trim() && schoolYearId;

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!classCode.trim()) {
      newErrors.classCode = "Le code de classe est requis";
    }
    if (!gradeLabel.trim()) {
      newErrors.gradeLabel = "Le libellé de niveau est requis";
    }
    if (!schoolYearId) {
      newErrors.schoolYearId = "L'année scolaire est requise";
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
      classCode: classCode.trim(),
      gradeLabel: gradeLabel.trim(),
      schoolYearId,
    });
  };

  const handleClose = () => {
    if (!isLoading) {
      setClassCode("");
      setGradeLabel("");
      setSchoolYearId("");
      setErrors({});
      onClose();
    }
  };

  const selectedSchoolYear = schoolYears.find((sy) => sy.id === schoolYearId);

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5 text-primary" />
            {isEditing ? "Modifier la classe" : "Nouvelle classe"}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Modifiez les informations de la classe"
              : "Créez une nouvelle classe pour l'année scolaire sélectionnée"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Code de classe */}
          <div className="space-y-2">
            <Label
              htmlFor="classCode"
              className="text-sm font-medium flex items-center gap-2"
            >
              <Hash className="h-4 w-4 text-primary" />
              Code de classe
            </Label>
            <Input
              id="classCode"
              value={classCode}
              onChange={(e) => setClassCode(e.target.value)}
              placeholder="Ex: 2nde A, CM1 B, 6ème Jaspe..."
              className={`h-11 ${errors.classCode ? "border-destructive" : ""}`}
              disabled={isLoading}
            />
            {errors.classCode && (
              <p className="text-sm text-destructive">{errors.classCode}</p>
            )}
          </div>

          {/* Libellé du niveau */}
          <div className="space-y-2">
            <Label
              htmlFor="gradeLabel"
              className="text-sm font-medium flex items-center gap-2"
            >
              <GraduationCap className="h-4 w-4 text-primary" />
              Libellé du niveau
            </Label>
            <Select value={gradeLabel} onValueChange={setGradeLabel}>
              <SelectTrigger
                className={`h-11 ${errors.gradeLabel ? "border-destructive" : ""}`}
              >
                <SelectValue placeholder="Sélectionnez un niveau..." />
              </SelectTrigger>
              <SelectContent>
                {DEFAULT_GRADE_LABELS.map((grade) => (
                  <SelectItem key={grade.value} value={grade.label}>
                    {grade.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.gradeLabel && (
              <p className="text-sm text-destructive">{errors.gradeLabel}</p>
            )}
          </div>

          {/* Année scolaire */}
          <div className="space-y-2">
            <Label
              htmlFor="schoolYear"
              className="text-sm font-medium flex items-center gap-2"
            >
              <Calendar className="h-4 w-4 text-primary" />
              Année scolaire
            </Label>
            <Select value={schoolYearId} onValueChange={setSchoolYearId}>
              <SelectTrigger
                className={`h-11 ${errors.schoolYearId ? "border-destructive" : ""}`}
              >
                <SelectValue placeholder="Sélectionnez une année scolaire..." />
              </SelectTrigger>
              <SelectContent>
                {schoolYears.map((year) => (
                  <SelectItem key={year.id} value={year.id}>
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-2 h-2 rounded-full ${
                          year.isActive ? "bg-green-500" : "bg-gray-400"
                        }`}
                      ></div>
                      {year.name}
                      {year.isActive && (
                        <span className="text-xs text-green-600 ml-1">
                          (Active)
                        </span>
                      )}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.schoolYearId && (
              <p className="text-sm text-destructive">{errors.schoolYearId}</p>
            )}
          </div>

          {/* Aperçu de la classe */}
          {isValid && (
            <div className="p-4 bg-muted/30 rounded-lg border border-border/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <GraduationCap className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium text-sm">
                    Classe {classCode} - {gradeLabel}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Année: {selectedSchoolYear?.name}
                  </p>
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
