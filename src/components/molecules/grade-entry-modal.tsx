"use client";

import { useState, useEffect } from "react";
import { Save, X, Calculator, MessageSquare, Clock } from "lucide-react";
import { Button } from "@/components/atoms/button";
import { GradeInput } from "@/components/atoms/grade-input";
import { AbsenceToggle } from "@/components/atoms/absence-toggle";
import { Badge } from "@/components/atoms/badge";
import { Textarea } from "@/components/atoms/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/atoms/dialog";
import type { StudentExamResult, Exam, Student, NotationSystem } from "@/types/uml-entities";

interface GradeEntryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Partial<StudentExamResult>) => void;
  student: Student;
  exam: Exam;
  result?: StudentExamResult;
  notationSystem: NotationSystem;
}

export function GradeEntryModal({
  isOpen,
  onClose,
  onSave,
  student,
  exam,
  result,
  notationSystem,
}: GradeEntryModalProps) {
  const [formData, setFormData] = useState({
    grade: result?.grade || null,
    pointsObtained: result?.pointsObtained || null,
    isAbsent: result?.isAbsent || false,
    comments: result?.comments || "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Reset form when modal opens/closes or result changes
  useEffect(() => {
    if (isOpen) {
      setFormData({
        grade: result?.grade || null,
        pointsObtained: result?.pointsObtained || null,
        isAbsent: result?.isAbsent || false,
        comments: result?.comments || "",
      });
      setErrors({});
    }
  }, [isOpen, result]);

  // Auto-calculate grade from points
  useEffect(() => {
    if (formData.pointsObtained !== null && !formData.isAbsent && exam.totalPoints) {
      const calculatedGrade = (formData.pointsObtained / exam.totalPoints) * notationSystem.maxValue;
      setFormData(prev => ({
        ...prev,
        grade: Math.round(calculatedGrade * 100) / 100
      }));
    }
  }, [formData.pointsObtained, formData.isAbsent, exam.totalPoints, notationSystem.maxValue]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.isAbsent) {
      if (formData.grade === null || formData.grade === undefined) {
        newErrors.grade = "Note obligatoire si non absent";
      } else if (!notationSystem.validateGrade(formData.grade)) {
        newErrors.grade = `Note invalide (${notationSystem.minValue}-${notationSystem.maxValue})`;
      }

      if (formData.pointsObtained === null || formData.pointsObtained === undefined) {
        newErrors.pointsObtained = "Points obligatoires si non absent";
      } else if (formData.pointsObtained < 0 || formData.pointsObtained > exam.totalPoints) {
        newErrors.pointsObtained = `Points invalides (0-${exam.totalPoints})`;
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!validateForm()) return;

    const dataToSave: Partial<StudentExamResult> = {
      grade: formData.isAbsent ? 0 : formData.grade || 0,
      pointsObtained: formData.isAbsent ? 0 : formData.pointsObtained || 0,
      isAbsent: formData.isAbsent,
      comments: formData.comments,
      gradeDisplay: formData.isAbsent
        ? "ABS"
        : notationSystem.formatDisplay(formData.grade || 0, "fr-FR"),
      markedAt: new Date(),
    };

    onSave(dataToSave);
    onClose();
  };

  const handleAbsenceChange = (isAbsent: boolean) => {
    setFormData(prev => ({
      ...prev,
      isAbsent,
      grade: isAbsent ? null : prev.grade,
      pointsObtained: isAbsent ? null : prev.pointsObtained,
    }));
  };

  const calculatePercentage = () => {
    if (formData.pointsObtained !== null && exam.totalPoints) {
      return Math.round((formData.pointsObtained / exam.totalPoints) * 100);
    }
    return null;
  };

  // Don't render if no notation system
  if (!notationSystem) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calculator className="h-4 w-4" />
            Saisie de note
          </DialogTitle>
          <DialogDescription>
            {student.firstName} {student.lastName} • {exam.title}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Statut de présence */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Présence</label>
            <AbsenceToggle
              isAbsent={formData.isAbsent}
              onChange={handleAbsenceChange}
            />
          </div>

          {/* Saisie des points */}
          <div className="space-y-2">
            <label className="text-sm font-medium">
              Points obtenus
              <span className="text-xs text-muted-foreground ml-1">
                (sur {exam.totalPoints})
              </span>
            </label>
            <GradeInput
              value={formData.pointsObtained}
              onChange={(value) => setFormData(prev => ({ ...prev, pointsObtained: value }))}
              isAbsent={formData.isAbsent}
              error={errors.pointsObtained}
              placeholder={`0-${exam.totalPoints}`}
              min={0}
              max={exam.totalPoints}
            />
          </div>

          {/* Note calculée */}
          <div className="space-y-2">
            <label className="text-sm font-medium">
              Note finale
              <span className="text-xs text-muted-foreground ml-1">
                (sur {notationSystem.maxValue})
              </span>
            </label>
            <div className="flex items-center gap-2">
              <GradeInput
                value={formData.grade}
                onChange={(value) => setFormData(prev => ({ ...prev, grade: value }))}
                notationSystem={notationSystem}
                isAbsent={formData.isAbsent}
                error={errors.grade}
              />
              {calculatePercentage() !== null && !formData.isAbsent && (
                <Badge variant="outline" className="text-xs">
                  {calculatePercentage()}%
                </Badge>
              )}
            </div>
          </div>

          {/* Commentaires */}
          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-1">
              <MessageSquare className="h-3 w-3" />
              Commentaires
              <span className="text-xs text-muted-foreground">(facultatif)</span>
            </label>
            <Textarea
              value={formData.comments}
              onChange={(e) => setFormData(prev => ({ ...prev, comments: e.target.value }))}
              placeholder="Commentaires sur la copie, points à améliorer..."
              rows={3}
              disabled={formData.isAbsent}
            />
          </div>

          {/* Métadonnées */}
          <div className="text-xs text-muted-foreground space-y-1 pt-2 border-t">
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              <span>
                {result ? "Modifié" : "Créé"} le {new Date().toLocaleDateString("fr-FR")}
              </span>
            </div>
          </div>
        </div>

        <div className="flex gap-2 pt-4">
          <Button variant="outline" onClick={onClose} className="flex-1">
            <X className="h-3 w-3 mr-1" />
            Annuler
          </Button>
          <Button onClick={handleSave} className="flex-1">
            <Save className="h-3 w-3 mr-1" />
            Enregistrer
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}