"use client";

import {
  BookOpen,
  CalendarIcon,
  Clock,
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
} from "@/components/molecules/select";
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
  subjects: Subject[];
  classes: Class[];
  timeSlots: TimeSlot[];
  teacherId?: string;
  schoolYearId?: string;
}

export function SessionForm({
  onClose,
  onSave,
  initialDate,
  subjects,
  classes,
  timeSlots,
  teacherId = "KsmNtVf4zwqO3VV3SQJqPrRlQBA1fFyR",
  schoolYearId = "year-2025",
}: SessionFormProps) {

  const [formData, setFormData] = useState({
    subjectId: "",
    classId: "",
    timeSlotId: "",
    sessionDate: initialDate ? initialDate.toISOString().split("T")[0] : "",
    room: "",
    objectives: "",
    content: "",
    homeworkAssigned: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.subjectId) newErrors.subjectId = "Matière requise";
    if (!formData.classId) newErrors.classId = "Classe requise";
    if (!formData.timeSlotId) newErrors.timeSlotId = "Créneau horaire requis";
    if (!formData.sessionDate) newErrors.sessionDate = "Date requise";
    if (!formData.objectives.trim()) newErrors.objectives = "Objectifs requis";

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
      room: formData.room || "",
      objectives: formData.objectives,
      content: formData.content,
      homeworkAssigned: formData.homeworkAssigned,
      status: "upcoming",
      attendanceTaken: false,
    };

    onSave(newSession);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const formSelectedSubject = subjects.find((s) => s.id === formData.subjectId);
  const formSelectedClass = classes.find((c) => c.id === formData.classId);
  const selectedTimeSlot = timeSlots.find((t) => t.id === formData.timeSlotId);

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CalendarIcon className="h-5 w-5 text-primary" />
            <h2 className="text-xl font-semibold">Nouvelle session de cours</h2>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>

      <CardContent>
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
                  onValueChange={(value) => handleInputChange("subjectId", value)}
                >
                  <SelectTrigger
                    className={errors.subjectId ? "border-destructive" : ""}
                  >
                    <SelectValue placeholder="Sélectionner une matière" />
                  </SelectTrigger>
                  <SelectContent>
                    {subjects.map((subject) => (
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
                <Select
                  value={formData.classId}
                  onValueChange={(value) => handleInputChange("classId", value)}
                >
                  <SelectTrigger
                    className={errors.classId ? "border-destructive" : ""}
                  >
                    <SelectValue placeholder="Sélectionner une classe" />
                  </SelectTrigger>
                  <SelectContent>
                    {classes.map((classItem) => (
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
                  onChange={(e) =>
                    handleInputChange("sessionDate", e.target.value)
                  }
                  className={errors.sessionDate ? "border-destructive" : ""}
                />
                {errors.sessionDate && (
                  <p className="text-destructive text-sm">
                    {errors.sessionDate}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="timeSlot">
                  <Clock className="h-4 w-4 inline mr-1" />
                  Créneau horaire *
                </Label>
                <Select
                  value={formData.timeSlotId}
                  onValueChange={(value) =>
                    handleInputChange("timeSlotId", value)
                  }
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
                  <p className="text-destructive text-sm">
                    {errors.timeSlotId}
                  </p>
                )}
              </div>
            </div>

            {/* Salle */}
            <div className="space-y-2">
              <Label htmlFor="room">Salle</Label>
              <Input
                id="room"
                placeholder="Ex: Salle A1, Laboratoire, Amphithéâtre..."
                value={formData.room}
                onChange={(e) => handleInputChange("room", e.target.value)}
              />
            </div>

            {/* Objectifs */}
            <div className="space-y-2">
              <Label htmlFor="objectives">Objectifs de la session *</Label>
              <Textarea
                id="objectives"
                placeholder="Décrivez les objectifs pédagogiques de cette session..."
                value={formData.objectives}
                onChange={(e) =>
                  handleInputChange("objectives", e.target.value)
                }
                rows={3}
                className={errors.objectives ? "border-destructive" : ""}
              />
              {errors.objectives && (
                <p className="text-destructive text-sm">{errors.objectives}</p>
              )}
            </div>

            {/* Contenu */}
            <div className="space-y-2">
              <Label htmlFor="content">Contenu du cours</Label>
              <Textarea
                id="content"
                placeholder="Décrivez le contenu détaillé du cours..."
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

            {/* Résumé de la session */}
            {formSelectedSubject && formSelectedClass && selectedTimeSlot && (
              <div className="p-4 bg-muted/50 rounded-md border">
                <h4 className="font-medium mb-2">Aperçu de la session</h4>
                <div className="text-sm space-y-1">
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
                        )
                      : "-"}
                  </p>
                  {formData.room && (
                    <p>
                      <strong>Salle:</strong> {formData.room}
                    </p>
                  )}
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
      </CardContent>
    </Card>
  );
}
