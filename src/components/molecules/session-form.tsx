"use client";

import {
  BookOpen,
  CalendarIcon,
  Clock,
  Plus,
  Save,
  Users,
  X,
} from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/atoms/button";
import { Input } from "@/components/atoms/input";
import { Label } from "@/components/atoms/label";
import { Textarea } from "@/components/atoms/textarea";
import { Card, CardContent, CardHeader } from "@/components/molecules/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/atoms/select";
import { useTeachingAssignments } from "@/hooks/use-teaching-assignments";
import type {
  Class,
  CourseSession,
  Subject,
  TimeSlot,
} from "@/types/uml-entities";

interface SessionFormProps {
  onClose: () => void;
  onSave: (session: Partial<CourseSession>) => void;
  initialDate?: Date;
  initialTimeSlotId?: string;
  subjects: Subject[];
  classes: Class[];
  timeSlots: TimeSlot[];
  teacherId?: string;
  schoolYearId?: string;
  sessionType?: "normal" | "makeup";
  standalone?: boolean; // Pour afficher avec Card ou juste le contenu
}

export function SessionForm({
  onClose,
  onSave,
  initialDate,
  initialTimeSlotId,
  subjects,
  classes,
  timeSlots,
  teacherId = "KsmNtVf4zwqO3VV3SQJqPrRlQBA1fFyR",
  schoolYearId = "year-2025",
  sessionType = "normal",
  standalone = true,
}: SessionFormProps) {
  const { rights } = useTeachingAssignments(teacherId);

  const [formData, setFormData] = useState({
    subjectId: "",
    classId: "",
    timeSlotId: initialTimeSlotId || "",
    sessionDate: initialDate ? initialDate.toISOString().split("T")[0] : "",
    objectives: "",
    content: "",
    homeworkAssigned: "",
    notes: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.subjectId) newErrors.subjectId = "Matière requise";
    if (!formData.classId) newErrors.classId = "Classe requise";
    if (!formData.timeSlotId) newErrors.timeSlotId = "Créneau horaire requis";
    if (!formData.sessionDate) newErrors.sessionDate = "Date requise";
    // Tous les champs textuels sont maintenant optionnels dans l'UML

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    const sessionDate = new Date(formData.sessionDate);

    const newSession: Partial<CourseSession> = {
      subjectId: formData.subjectId,
      classId: formData.classId,
      timeSlotId: formData.timeSlotId,
      sessionDate,
      objectives: formData.objectives.trim() || null,
      content: formData.content.trim() || null,
      homeworkAssigned: formData.homeworkAssigned.trim() || null,
      notes: formData.notes.trim() || null,
      isMakeup: sessionType === "makeup",
      status: "planned",
    };

    onSave(newSession);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handleSubjectChange = (subjectId: string) => {
    setFormData((prev) => {
      const newData = { ...prev, subjectId };

      // Vérifier si la classe actuelle est toujours compatible
      if (prev.classId) {
        const assignmentsForSubject = rights
          .getCurrentAssignments()
          .filter((assignment) => assignment.subjectId === subjectId);
        const isClassStillValid = assignmentsForSubject.some(
          (assignment) => assignment.classId === prev.classId,
        );

        if (!isClassStillValid) {
          newData.classId = ""; // Réinitialiser la classe
        }
      }

      return newData;
    });

    if (errors.subjectId) {
      setErrors((prev) => ({ ...prev, subjectId: "" }));
    }
  };

  const handleClassChange = (classId: string) => {
    setFormData((prev) => {
      const newData = { ...prev, classId };

      // Vérifier si la matière actuelle est toujours compatible
      if (prev.subjectId) {
        const assignmentsForClass = rights
          .getCurrentAssignments()
          .filter((assignment) => assignment.classId === classId);
        const isSubjectStillValid = assignmentsForClass.some(
          (assignment) => assignment.subjectId === prev.subjectId,
        );

        if (!isSubjectStillValid) {
          newData.subjectId = ""; // Réinitialiser la matière
        }
      }

      return newData;
    });

    if (errors.classId) {
      setErrors((prev) => ({ ...prev, classId: "" }));
    }
  };

  // Filtrage intelligent relationnel
  const getAvailableClasses = () => {
    if (!formData.subjectId) {
      // Aucune matière sélectionnée → toutes les classes
      return classes;
    }

    // Matière sélectionnée → classes où cette matière est enseignée
    const assignmentsForSubject = rights
      .getCurrentAssignments()
      .filter((assignment) => assignment.subjectId === formData.subjectId);

    return classes.filter((classItem) =>
      assignmentsForSubject.some(
        (assignment) => assignment.classId === classItem.id,
      ),
    );
  };

  const getAvailableSubjects = () => {
    if (!formData.classId) {
      // Aucune classe sélectionnée → toutes les matières
      return subjects;
    }

    // Classe sélectionnée → matières enseignées dans cette classe
    const assignmentsForClass = rights
      .getCurrentAssignments()
      .filter((assignment) => assignment.classId === formData.classId);

    return subjects.filter((subject) =>
      assignmentsForClass.some(
        (assignment) => assignment.subjectId === subject.id,
      ),
    );
  };

  const availableClasses = getAvailableClasses();
  const availableSubjects = getAvailableSubjects();

  const formSelectedSubject = subjects.find((s) => s.id === formData.subjectId);
  const formSelectedClass = classes.find((c) => c.id === formData.classId);
  const selectedTimeSlot = timeSlots.find((t) => t.id === formData.timeSlotId);

  // Contenu du formulaire (sans wrapper)
  const formContent = (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Informations de base */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="subject">
            <BookOpen className="h-4 w-4 inline mr-1" />
            Matière *
          </Label>
          <Select
            value={formData.subjectId}
            onValueChange={handleSubjectChange}
          >
            <SelectTrigger
              className={errors.subjectId ? "border-destructive" : ""}
            >
              <SelectValue placeholder="Sélectionner une matière" />
            </SelectTrigger>
            <SelectContent>
              {availableSubjects.map((subject) => (
                <SelectItem key={subject.id} value={subject.id}>
                  {subject.name} ({subject.code})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.subjectId && (
            <p className="text-destructive text-sm">{errors.subjectId}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="class">
            <Users className="h-4 w-4 inline mr-1" />
            Classe *
          </Label>
          <Select value={formData.classId} onValueChange={handleClassChange}>
            <SelectTrigger
              className={errors.classId ? "border-destructive" : ""}
            >
              <SelectValue placeholder="Sélectionner une classe" />
            </SelectTrigger>
            <SelectContent>
              {availableClasses.map((classItem) => (
                <SelectItem key={classItem.id} value={classItem.id}>
                  {classItem.classCode} - {classItem.gradeLabel}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.classId && (
            <p className="text-destructive text-sm">{errors.classId}</p>
          )}
        </div>
      </div>

      {/* Date et horaire */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="date">
            <CalendarIcon className="h-4 w-4 inline mr-1" />
            Date *
          </Label>
          <Input
            id="date"
            type="date"
            value={formData.sessionDate}
            onChange={(e) => handleInputChange("sessionDate", e.target.value)}
            className={errors.sessionDate ? "border-destructive" : ""}
          />
          {errors.sessionDate && (
            <p className="text-destructive text-sm">{errors.sessionDate}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="timeSlot">
            <Clock className="h-4 w-4 inline mr-1" />
            Créneau horaire *
          </Label>
          <Select
            value={formData.timeSlotId}
            onValueChange={(value) => handleInputChange("timeSlotId", value)}
          >
            <SelectTrigger
              className={errors.timeSlotId ? "border-destructive" : ""}
            >
              <SelectValue placeholder="Sélectionner un créneau" />
            </SelectTrigger>
            <SelectContent>
              {timeSlots.map((slot) => (
                <SelectItem key={slot.id} value={slot.id}>
                  {slot.name} ({slot.startTime} - {slot.endTime})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.timeSlotId && (
            <p className="text-destructive text-sm">{errors.timeSlotId}</p>
          )}
        </div>
      </div>

      {/* Objectifs */}
      <div className="space-y-2">
        <Label htmlFor="objectives">Objectifs de la session</Label>
        <Textarea
          id="objectives"
          placeholder={
            sessionType === "makeup"
              ? "Décrivez les objectifs pédagogiques de ce rattrapage..."
              : "Décrivez les objectifs pédagogiques de cette session..."
          }
          value={formData.objectives}
          onChange={(e) => handleInputChange("objectives", e.target.value)}
          rows={3}
        />
      </div>

      {/* Contenu */}
      <div className="space-y-2">
        <Label htmlFor="content">Contenu prévu</Label>
        <Textarea
          id="content"
          placeholder={
            sessionType === "makeup"
              ? "Décrivez le contenu spécifique pour ce rattrapage..."
              : "Décrivez le contenu détaillé du cours..."
          }
          value={formData.content}
          onChange={(e) => handleInputChange("content", e.target.value)}
          rows={3}
        />
      </div>

      {/* Devoirs */}
      <div className="space-y-2">
        <Label htmlFor="homework">Devoirs à donner</Label>
        <Textarea
          id="homework"
          placeholder="Exercices, lectures, projets à assigner aux étudiants..."
          value={formData.homeworkAssigned}
          onChange={(e) =>
            handleInputChange("homeworkAssigned", e.target.value)
          }
          rows={2}
        />
      </div>

      {/* Notes */}
      <div className="space-y-2">
        <Label htmlFor="notes">
          {sessionType === "makeup" ? "Notes complémentaires" : "Notes"}
        </Label>
        <Textarea
          id="notes"
          placeholder={
            sessionType === "makeup"
              ? "Ex: Rattrapage suite à l'absence du 15/01, renforcement avant contrôle..."
              : "Notes complémentaires sur cette session..."
          }
          value={formData.notes}
          onChange={(e) => handleInputChange("notes", e.target.value)}
          rows={2}
        />
        {sessionType === "makeup" && (
          <p className="text-xs text-muted-foreground">
            Ces notes vous aideront à identifier facilement cette session de
            rattrapage dans le calendrier.
          </p>
        )}
      </div>

      {/* Résumé de la session */}
      {formSelectedSubject && formSelectedClass && selectedTimeSlot && (
        <div
          className={`p-4 rounded-md border ${
            sessionType === "makeup"
              ? "bg-amber-50 border-amber-200"
              : "bg-muted/50"
          }`}
        >
          <div className="flex items-start gap-3">
            {sessionType === "makeup" && (
              <Plus className="h-5 w-5 text-amber-600 mt-0.5" />
            )}
            <div className="flex-1">
              <h4
                className={`font-medium mb-2 ${
                  sessionType === "makeup" ? "text-amber-900" : ""
                }`}
              >
                {sessionType === "makeup"
                  ? "Aperçu du rattrapage"
                  : "Aperçu de la session"}
              </h4>
              <div
                className={`text-sm space-y-1 ${
                  sessionType === "makeup" ? "text-amber-800" : ""
                }`}
              >
                <p>
                  <strong>Matière:</strong> {formSelectedSubject.name}
                </p>
                <p>
                  <strong>Classe:</strong> {formSelectedClass.classCode} -{" "}
                  {formSelectedClass.gradeLabel}
                </p>
                <p>
                  <strong>Horaire:</strong> {selectedTimeSlot.name}
                </p>
                <p>
                  <strong>Date:</strong>{" "}
                  {formData.sessionDate
                    ? new Date(formData.sessionDate).toLocaleDateString(
                        "fr-FR",
                        {
                          weekday: "long",
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        },
                      )
                    : "-"}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex justify-end gap-3 pt-4">
        <Button type="button" variant="outline" onClick={onClose}>
          Annuler
        </Button>
        <Button type="submit" className="gap-2">
          <Save className="h-4 w-4" />
          Créer la session
        </Button>
      </div>
    </form>
  );

  // Retourner avec ou sans Card selon le mode
  if (standalone) {
    return (
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {sessionType === "makeup" ? (
                <Plus className="h-5 w-5 text-amber-600" />
              ) : (
                <CalendarIcon className="h-5 w-5 text-primary" />
              )}
              <h2 className="text-xl font-semibold">
                {sessionType === "makeup"
                  ? "Programmer un rattrapage"
                  : "Nouvelle session de cours"}
              </h2>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          {sessionType === "makeup" && (
            <p className="text-sm text-muted-foreground">
              Créez une session de rattrapage pour récupérer un cours manqué ou
              ajouter du temps d'enseignement.
            </p>
          )}
        </CardHeader>
        <CardContent>{formContent}</CardContent>
      </Card>
    );
  }

  // Mode Dialog - juste le contenu du formulaire
  return formContent;
}
