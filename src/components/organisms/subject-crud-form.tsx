"use client";

import { BookOpen, Hash, Save, X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/atoms/button";
import { Input } from "@/components/atoms/input";
import { Label } from "@/components/atoms/label";
import { Textarea } from "@/components/atoms/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/atoms/dialog";
import type { Subject } from "@/types/uml-entities";

interface SubjectCrudFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: SubjectFormData) => void;
  editingSubject?: Subject | null;
  isLoading?: boolean;
}

interface SubjectFormData {
  name: string;
  code: string;
  description: string;
}

const PREDEFINED_SUBJECTS = [
  {
    name: "Mathématiques",
    code: "MATH",
    description: "Mathématiques générales et spécialisées",
  },
  {
    name: "Français",
    code: "FR",
    description: "Langue et littérature françaises",
  },
  {
    name: "Histoire-Géographie",
    code: "HG",
    description: "Histoire et géographie",
  },
  {
    name: "Sciences de la Vie et de la Terre",
    code: "SVT",
    description: "Biologie et géologie",
  },
  {
    name: "Physique-Chimie",
    code: "PC",
    description: "Sciences physiques et chimiques",
  },
  { name: "Anglais", code: "ANG", description: "Langue vivante anglaise" },
  { name: "Espagnol", code: "ESP", description: "Langue vivante espagnole" },
  { name: "Allemand", code: "ALL", description: "Langue vivante allemande" },
  {
    name: "Éducation Physique et Sportive",
    code: "EPS",
    description: "Activités physiques et sportives",
  },
  {
    name: "Arts Plastiques",
    code: "AP",
    description: "Arts visuels et plastiques",
  },
  { name: "Musique", code: "MUS", description: "Éducation musicale" },
  {
    name: "Technologie",
    code: "TECH",
    description: "Sciences et technologies",
  },
  {
    name: "Sciences Économiques et Sociales",
    code: "SES",
    description: "Économie et sociologie",
  },
  {
    name: "Philosophie",
    code: "PHILO",
    description: "Philosophie et pensée critique",
  },
  { name: "Latin", code: "LAT", description: "Langue et culture latines" },
  { name: "Grec", code: "GREC", description: "Langue et culture grecques" },
];

export function SubjectCrudForm({
  isOpen,
  onClose,
  onSubmit,
  editingSubject,
  isLoading = false,
}: SubjectCrudFormProps) {
  const [name, setName] = useState(editingSubject?.name || "");
  const [code, setCode] = useState(editingSubject?.code || "");
  const [description, setDescription] = useState(
    editingSubject?.description || "",
  );
  const [errors, setErrors] = useState<Record<string, string>>({});

  const isEditing = !!editingSubject;
  const isValid = name.trim() && code.trim() && description.trim();

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!name.trim()) {
      newErrors.name = "Le nom de la matière est requis";
    }
    if (!code.trim()) {
      newErrors.code = "Le code de la matière est requis";
    } else if (code.trim().length > 10) {
      newErrors.code = "Le code ne peut pas dépasser 10 caractères";
    }
    if (!description.trim()) {
      newErrors.description = "La description est requise";
    } else if (description.trim().length > 500) {
      newErrors.description =
        "La description ne peut pas dépasser 500 caractères";
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
      name: name.trim(),
      code: code.trim().toUpperCase(),
      description: description.trim(),
    });
  };

  const handleClose = () => {
    if (!isLoading) {
      setName("");
      setCode("");
      setDescription("");
      setErrors({});
      onClose();
    }
  };

  const handlePredefinedSelect = (subject: (typeof PREDEFINED_SUBJECTS)[0]) => {
    setName(subject.name);
    setCode(subject.code);
    setDescription(subject.description);
  };

  const generateCodeFromName = (subjectName: string) => {
    // Génère un code automatiquement à partir du nom
    const words = subjectName.trim().split(/\s+/);
    if (words.length === 1) {
      return words[0].substring(0, 4).toUpperCase();
    } else {
      return words
        .map((word) => word.charAt(0))
        .join("")
        .substring(0, 4)
        .toUpperCase();
    }
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newName = e.target.value;
    setName(newName);

    // Auto-générer le code si ce n'est pas en mode édition et si le code est vide
    if (!isEditing && !code.trim()) {
      const generatedCode = generateCodeFromName(newName);
      setCode(generatedCode);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-primary" />
            {isEditing ? "Modifier la matière" : "Nouvelle matière"}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Modifiez les informations de la matière"
              : "Créez une nouvelle matière d'enseignement"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Matières prédéfinies */}
          {!isEditing && (
            <div className="space-y-3">
              <Label className="text-sm font-medium">
                Matières prédéfinies (optionnel)
              </Label>
              <div className="grid grid-cols-2 gap-2 max-h-32 overflow-y-auto">
                {PREDEFINED_SUBJECTS.map((subject) => (
                  <Button
                    key={subject.code}
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => handlePredefinedSelect(subject)}
                    className="text-left justify-start h-auto p-2"
                    disabled={isLoading}
                  >
                    <div>
                      <div className="font-medium text-xs">{subject.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {subject.code}
                      </div>
                    </div>
                  </Button>
                ))}
              </div>
              <div className="text-center">
                <div className="text-xs text-muted-foreground">
                  ou créez une matière personnalisée ci-dessous
                </div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Nom de la matière */}
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-medium">
                Nom de la matière
              </Label>
              <Input
                id="name"
                value={name}
                onChange={handleNameChange}
                placeholder="Ex: Mathématiques, Histoire..."
                className={`h-11 ${errors.name ? "border-destructive" : ""}`}
                disabled={isLoading}
              />
              {errors.name && (
                <p className="text-sm text-destructive">{errors.name}</p>
              )}
            </div>

            {/* Code de la matière */}
            <div className="space-y-2">
              <Label
                htmlFor="code"
                className="text-sm font-medium flex items-center gap-2"
              >
                <Hash className="h-4 w-4 text-primary" />
                Code de la matière
              </Label>
              <Input
                id="code"
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                placeholder="Ex: MATH, HIST..."
                maxLength={10}
                className={`h-11 ${errors.code ? "border-destructive" : ""}`}
                disabled={isLoading}
              />
              {errors.code && (
                <p className="text-sm text-destructive">{errors.code}</p>
              )}
              <p className="text-xs text-muted-foreground">
                Maximum 10 caractères, converti automatiquement en majuscules
              </p>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description" className="text-sm font-medium">
              Description
            </Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Décrivez le contenu et les objectifs de cette matière..."
              rows={4}
              maxLength={500}
              className={`resize-none ${errors.description ? "border-destructive" : ""}`}
              disabled={isLoading}
            />
            {errors.description && (
              <p className="text-sm text-destructive">{errors.description}</p>
            )}
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Décrivez le contenu de la matière</span>
              <span>{description.length}/500</span>
            </div>
          </div>

          {/* Aperçu de la matière */}
          {isValid && (
            <div className="p-4 bg-muted/30 rounded-lg border border-border/50">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <span className="text-sm font-bold text-primary">
                    {code.substring(0, 3)}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-medium text-sm">{name}</p>
                    <span className="px-2 py-1 bg-primary/20 text-primary text-xs rounded-full font-mono">
                      {code}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground line-clamp-2">
                    {description}
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
