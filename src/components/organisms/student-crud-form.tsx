"use client";

import {
  BookOpen,
  GraduationCap,
  Heart,
  Lightbulb,
  Save,
  TrendingUp,
  User,
  X,
} from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/atoms/badge";
import { Button } from "@/components/atoms/button";
import { Input } from "@/components/atoms/input";
import { Label } from "@/components/atoms/label";
import { Textarea } from "@/components/atoms/textarea";
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
import type { Student, Class } from "@/types/uml-entities";

interface StudentCrudFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: StudentFormData) => void;
  editingStudent?: Student | null;
  classes: Class[];
  isLoading?: boolean;
}

interface StudentFormData {
  firstName: string;
  lastName: string;
  currentClassId: string;
  needs: string[];
  observations: string[];
  strengths: string[];
  improvementAxes: string[];
}

export function StudentCrudForm({
  isOpen,
  onClose,
  onSubmit,
  editingStudent,
  classes,
  isLoading = false,
}: StudentCrudFormProps) {
  const [firstName, setFirstName] = useState(editingStudent?.firstName || "");
  const [lastName, setLastName] = useState(editingStudent?.lastName || "");
  const [currentClassId, setCurrentClassId] = useState(
    editingStudent?.currentClassId || "",
  );
  const [needs, setNeeds] = useState<string[]>(editingStudent?.needs || []);
  const [observations, setObservations] = useState<string[]>(
    editingStudent?.observations || [],
  );
  const [strengths, setStrengths] = useState<string[]>(
    editingStudent?.strengths || [],
  );
  const [improvementAxes, setImprovementAxes] = useState<string[]>(
    editingStudent?.improvementAxes || [],
  );

  // États pour les nouveaux éléments des listes
  const [newNeed, setNewNeed] = useState("");
  const [newObservation, setNewObservation] = useState("");
  const [newStrength, setNewStrength] = useState("");
  const [newImprovementAxis, setNewImprovementAxis] = useState("");

  const [errors, setErrors] = useState<Record<string, string>>({});

  const isEditing = !!editingStudent;
  const isValid = firstName.trim() && lastName.trim() && currentClassId;

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!firstName.trim()) {
      newErrors.firstName = "Le prénom est requis";
    }
    if (!lastName.trim()) {
      newErrors.lastName = "Le nom est requis";
    }
    if (!currentClassId) {
      newErrors.currentClassId = "La classe est requise";
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
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      currentClassId,
      needs,
      observations,
      strengths,
      improvementAxes,
    });
  };

  const handleClose = () => {
    if (!isLoading) {
      setFirstName("");
      setLastName("");
      setCurrentClassId("");
      setNeeds([]);
      setObservations([]);
      setStrengths([]);
      setImprovementAxes([]);
      setNewNeed("");
      setNewObservation("");
      setNewStrength("");
      setNewImprovementAxis("");
      setErrors({});
      onClose();
    }
  };

  // Fonctions pour gérer les listes
  const addNeed = () => {
    if (newNeed.trim() && !needs.includes(newNeed.trim())) {
      setNeeds([...needs, newNeed.trim()]);
      setNewNeed("");
    }
  };

  const removeNeed = (need: string) => {
    setNeeds(needs.filter((n) => n !== need));
  };

  const addObservation = () => {
    if (newObservation.trim() && !observations.includes(newObservation.trim())) {
      setObservations([...observations, newObservation.trim()]);
      setNewObservation("");
    }
  };

  const removeObservation = (observation: string) => {
    setObservations(observations.filter((o) => o !== observation));
  };

  const addStrength = () => {
    if (newStrength.trim() && !strengths.includes(newStrength.trim())) {
      setStrengths([...strengths, newStrength.trim()]);
      setNewStrength("");
    }
  };

  const removeStrength = (strength: string) => {
    setStrengths(strengths.filter((s) => s !== strength));
  };

  const addImprovementAxis = () => {
    if (
      newImprovementAxis.trim() &&
      !improvementAxes.includes(newImprovementAxis.trim())
    ) {
      setImprovementAxes([...improvementAxes, newImprovementAxis.trim()]);
      setNewImprovementAxis("");
    }
  };

  const removeImprovementAxis = (axis: string) => {
    setImprovementAxes(improvementAxes.filter((a) => a !== axis));
  };

  const selectedClass = classes.find((c) => c.id === currentClassId);

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="h-5 w-5 text-primary" />
            {isEditing ? "Modifier l'élève" : "Nouvel élève"}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Modifiez les informations de l'élève"
              : "Créez un nouveau profil élève avec ses caractéristiques"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Informations de base */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                Informations personnelles
              </h3>

              {/* Prénom */}
              <div className="space-y-2">
                <Label htmlFor="firstName" className="text-sm font-medium">
                  Prénom
                </Label>
                <Input
                  id="firstName"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="Ex: Jean, Marie..."
                  className={`h-11 ${errors.firstName ? "border-destructive" : ""}`}
                  disabled={isLoading}
                />
                {errors.firstName && (
                  <p className="text-sm text-destructive">{errors.firstName}</p>
                )}
              </div>

              {/* Nom */}
              <div className="space-y-2">
                <Label htmlFor="lastName" className="text-sm font-medium">
                  Nom de famille
                </Label>
                <Input
                  id="lastName"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Ex: Dupont, Martin..."
                  className={`h-11 ${errors.lastName ? "border-destructive" : ""}`}
                  disabled={isLoading}
                />
                {errors.lastName && (
                  <p className="text-sm text-destructive">{errors.lastName}</p>
                )}
              </div>

              {/* Classe */}
              <div className="space-y-2">
                <Label
                  htmlFor="currentClass"
                  className="text-sm font-medium flex items-center gap-2"
                >
                  <GraduationCap className="h-4 w-4 text-primary" />
                  Classe actuelle
                </Label>
                <Select value={currentClassId} onValueChange={setCurrentClassId}>
                  <SelectTrigger
                    className={`h-11 ${errors.currentClassId ? "border-destructive" : ""}`}
                  >
                    <SelectValue placeholder="Sélectionnez une classe..." />
                  </SelectTrigger>
                  <SelectContent>
                    {classes.map((classItem) => (
                      <SelectItem key={classItem.id} value={classItem.id}>
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-primary/60"></div>
                          {classItem.classCode} - {classItem.gradeLabel}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.currentClassId && (
                  <p className="text-sm text-destructive">
                    {errors.currentClassId}
                  </p>
                )}
              </div>

              {/* Aperçu de l'élève */}
              {isValid && (
                <div className="p-4 bg-muted/30 rounded-lg border border-border/50">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-sm font-medium text-primary">
                        {firstName.charAt(0)}
                        {lastName.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-sm">
                        {firstName} {lastName}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {selectedClass?.classCode} - {selectedClass?.gradeLabel}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Caractéristiques pédagogiques */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                Profil pédagogique
              </h3>

              {/* Besoins particuliers */}
              <div className="space-y-2">
                <Label className="text-sm font-medium flex items-center gap-2">
                  <Heart className="h-4 w-4 text-red-500" />
                  Besoins particuliers
                </Label>
                <div className="flex gap-2">
                  <Input
                    value={newNeed}
                    onChange={(e) => setNewNeed(e.target.value)}
                    placeholder="Ajouter un besoin..."
                    className="h-9 text-sm"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addNeed();
                      }
                    }}
                    disabled={isLoading}
                  />
                  <Button
                    type="button"
                    size="sm"
                    onClick={addNeed}
                    disabled={!newNeed.trim() || isLoading}
                    className="h-9"
                  >
                    Ajouter
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2 min-h-[2rem]">
                  {needs.map((need, index) => (
                    <Badge
                      key={index}
                      variant="secondary"
                      className="text-xs bg-red-100 text-red-800 hover:bg-red-200"
                    >
                      {need}
                      <button
                        type="button"
                        onClick={() => removeNeed(need)}
                        className="ml-1 text-red-600 hover:text-red-800"
                        disabled={isLoading}
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Points forts */}
              <div className="space-y-2">
                <Label className="text-sm font-medium flex items-center gap-2">
                  <Lightbulb className="h-4 w-4 text-yellow-500" />
                  Points forts
                </Label>
                <div className="flex gap-2">
                  <Input
                    value={newStrength}
                    onChange={(e) => setNewStrength(e.target.value)}
                    placeholder="Ajouter un point fort..."
                    className="h-9 text-sm"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addStrength();
                      }
                    }}
                    disabled={isLoading}
                  />
                  <Button
                    type="button"
                    size="sm"
                    onClick={addStrength}
                    disabled={!newStrength.trim() || isLoading}
                    className="h-9"
                  >
                    Ajouter
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2 min-h-[2rem]">
                  {strengths.map((strength, index) => (
                    <Badge
                      key={index}
                      variant="secondary"
                      className="text-xs bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
                    >
                      {strength}
                      <button
                        type="button"
                        onClick={() => removeStrength(strength)}
                        className="ml-1 text-yellow-600 hover:text-yellow-800"
                        disabled={isLoading}
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Axes d'amélioration */}
              <div className="space-y-2">
                <Label className="text-sm font-medium flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-blue-500" />
                  Axes d'amélioration
                </Label>
                <div className="flex gap-2">
                  <Input
                    value={newImprovementAxis}
                    onChange={(e) => setNewImprovementAxis(e.target.value)}
                    placeholder="Ajouter un axe d'amélioration..."
                    className="h-9 text-sm"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addImprovementAxis();
                      }
                    }}
                    disabled={isLoading}
                  />
                  <Button
                    type="button"
                    size="sm"
                    onClick={addImprovementAxis}
                    disabled={!newImprovementAxis.trim() || isLoading}
                    className="h-9"
                  >
                    Ajouter
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2 min-h-[2rem]">
                  {improvementAxes.map((axis, index) => (
                    <Badge
                      key={index}
                      variant="secondary"
                      className="text-xs bg-blue-100 text-blue-800 hover:bg-blue-200"
                    >
                      {axis}
                      <button
                        type="button"
                        onClick={() => removeImprovementAxis(axis)}
                        className="ml-1 text-blue-600 hover:text-blue-800"
                        disabled={isLoading}
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Observations générales */}
          <div className="space-y-2">
            <Label className="text-sm font-medium flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-green-500" />
              Observations générales
            </Label>
            <div className="flex gap-2 mb-2">
              <Input
                value={newObservation}
                onChange={(e) => setNewObservation(e.target.value)}
                placeholder="Ajouter une observation..."
                className="h-9 text-sm"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addObservation();
                  }
                }}
                disabled={isLoading}
              />
              <Button
                type="button"
                size="sm"
                onClick={addObservation}
                disabled={!newObservation.trim() || isLoading}
                className="h-9"
              >
                Ajouter
              </Button>
            </div>
            <div className="flex flex-wrap gap-2 min-h-[2rem]">
              {observations.map((observation, index) => (
                <Badge
                  key={index}
                  variant="secondary"
                  className="text-xs bg-green-100 text-green-800 hover:bg-green-200"
                >
                  {observation}
                  <button
                    type="button"
                    onClick={() => removeObservation(observation)}
                    className="ml-1 text-green-600 hover:text-green-800"
                    disabled={isLoading}
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t">
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