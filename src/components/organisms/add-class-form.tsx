"use client";

import {
  Calendar,
  Check,
  GraduationCap,
  Hash,
  Plus,
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

interface AddClassFormProps {
  onSubmit: (data: {
    identifier: string;
    level: string;
    schoolYear: string;
  }) => void;
  onCancel: () => void;
}

const DEFAULT_IDENTIFIERS = [
  { value: "a", label: "A" },
  { value: "b", label: "B" },
  { value: "c", label: "C" },
  { value: "d", label: "D" },
];

const DEFAULT_LEVELS = [
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

const SCHOOL_YEARS = [
  { value: "2023-2025", label: "2023-2025" },
  { value: "2025-2025", label: "2025-2025" },
  { value: "2025-2026", label: "2025-2026" },
];

export function AddClassForm({ onSubmit, onCancel }: AddClassFormProps) {
  const [identifier, setIdentifier] = useState("");
  const [level, setLevel] = useState("");
  const [schoolYear, setSchoolYear] = useState("");

  const [identifiers, setIdentifiers] = useState(DEFAULT_IDENTIFIERS);
  const [levels, setLevels] = useState(DEFAULT_LEVELS);

  const [isCreatingIdentifier, setIsCreatingIdentifier] = useState(false);
  const [isCreatingLevel, setIsCreatingLevel] = useState(false);
  const [newIdentifier, setNewIdentifier] = useState("");
  const [newLevel, setNewLevel] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!identifier || !level || !schoolYear) {
      return;
    }

    onSubmit({
      identifier,
      level,
      schoolYear,
    });
  };

  const isValid = identifier && level && schoolYear;

  const handleCreateIdentifier = () => {
    if (newIdentifier.trim()) {
      const newIdentifierObj = {
        value: newIdentifier.toLowerCase().trim(),
        label: newIdentifier.toUpperCase().trim(),
      };
      setIdentifiers((prev) => [...prev, newIdentifierObj]);
      setIdentifier(newIdentifierObj.value);
      setNewIdentifier("");
      setIsCreatingIdentifier(false);
    }
  };

  const handleCreateLevel = () => {
    if (newLevel.trim()) {
      const newLevelObj = {
        value: newLevel.toLowerCase().trim(),
        label: newLevel.trim(),
      };
      setLevels((prev) => [...prev, newLevelObj]);
      setLevel(newLevelObj.value);
      setNewLevel("");
      setIsCreatingLevel(false);
    }
  };

  const handleCancelCreateIdentifier = () => {
    setNewIdentifier("");
    setIsCreatingIdentifier(false);
  };

  const handleCancelCreateLevel = () => {
    setNewLevel("");
    setIsCreatingLevel(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="grid gap-8">
        {/* Identifiant Section */}
        <div className="space-y-4">
          <Label
            htmlFor="identifier"
            className="text-sm font-semibold flex items-center gap-2"
          >
            <Hash className="h-4 w-4 text-primary" />
            Identifiant de la classe
          </Label>
          {isCreatingIdentifier ? (
            <div className="flex items-center gap-2">
              <Input
                placeholder="Ex: E, F, G..."
                value={newIdentifier}
                onChange={(e) => setNewIdentifier(e.target.value)}
                className="flex-1 h-12 bg-background/60 border-2 hover:bg-background transition-colors focus:ring-2 focus:ring-primary/20"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleCreateIdentifier();
                  }
                  if (e.key === "Escape") {
                    handleCancelCreateIdentifier();
                  }
                }}
                autoFocus
              />
              <Button
                type="button"
                size="sm"
                onClick={handleCreateIdentifier}
                disabled={!newIdentifier.trim()}
                className="h-12 px-4"
              >
                <Check className="h-4 w-4" />
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleCancelCreateIdentifier}
                className="h-12 px-4"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <Select value={identifier} onValueChange={setIdentifier}>
              <SelectTrigger className="h-12 w-full bg-background/60 border-2 hover:bg-background transition-colors focus:ring-2 focus:ring-primary/20">
                <SelectValue placeholder="Choisir ou créer un identifiant..." />
              </SelectTrigger>
              <SelectContent>
                {identifiers.map((item) => (
                  <SelectItem key={item.value} value={item.value}>
                    {item.label}
                  </SelectItem>
                ))}
                <div className="border-t mt-1">
                  <Button
                    type="button"
                    variant="ghost"
                    className="w-full justify-start h-9 px-3 text-sm font-normal hover:bg-primary/10"
                    onClick={() => setIsCreatingIdentifier(true)}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Créer un nouvel identifiant
                  </Button>
                </div>
              </SelectContent>
            </Select>
          )}
        </div>

        {/* Niveau Section */}
        <div className="space-y-4">
          <Label
            htmlFor="level"
            className="text-sm font-semibold flex items-center gap-2"
          >
            <GraduationCap className="h-4 w-4 text-primary" />
            Niveau scolaire
          </Label>
          {isCreatingLevel ? (
            <div className="flex items-center gap-2">
              <Input
                placeholder="Ex: Grande section, 6ème Européenne..."
                value={newLevel}
                onChange={(e) => setNewLevel(e.target.value)}
                className="flex-1 h-12 bg-background/60 border-2 hover:bg-background transition-colors focus:ring-2 focus:ring-primary/20"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleCreateLevel();
                  }
                  if (e.key === "Escape") {
                    handleCancelCreateLevel();
                  }
                }}
                autoFocus
              />
              <Button
                type="button"
                size="sm"
                onClick={handleCreateLevel}
                disabled={!newLevel.trim()}
                className="h-12 px-4"
              >
                <Check className="h-4 w-4" />
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleCancelCreateLevel}
                className="h-12 px-4"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <Select value={level} onValueChange={setLevel}>
              <SelectTrigger className="h-12 w-full bg-background/60 border-2 hover:bg-background transition-colors focus:ring-2 focus:ring-primary/20">
                <SelectValue placeholder="Choisir ou créer un niveau..." />
              </SelectTrigger>
              <SelectContent>
                {levels.map((item) => (
                  <SelectItem key={item.value} value={item.value}>
                    {item.label}
                  </SelectItem>
                ))}
                <div className="border-t mt-1">
                  <Button
                    type="button"
                    variant="ghost"
                    className="w-full justify-start h-9 px-3 text-sm font-normal hover:bg-primary/10"
                    onClick={() => setIsCreatingLevel(true)}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Créer un nouveau niveau
                  </Button>
                </div>
              </SelectContent>
            </Select>
          )}
        </div>

        {/* Année scolaire Section */}
        <div className="space-y-4">
          <Label
            htmlFor="schoolYear"
            className="text-sm font-semibold flex items-center gap-2"
          >
            <Calendar className="h-4 w-4 text-primary" />
            Année scolaire
          </Label>
          <Select value={schoolYear} onValueChange={setSchoolYear}>
            <SelectTrigger className="h-12 w-full bg-background/60 border-2 hover:bg-background transition-colors focus:ring-2 focus:ring-primary/20">
              <SelectValue placeholder="Sélectionner une année scolaire..." />
            </SelectTrigger>
            <SelectContent>
              {SCHOOL_YEARS.map((item) => (
                <SelectItem key={item.value} value={item.value}>
                  {item.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
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
                Classe{" "}
                {identifiers.find((i) => i.value === identifier)?.label ||
                  identifier}{" "}
                - {levels.find((l) => l.value === level)?.label || level}
              </p>
              <p className="text-xs text-muted-foreground">
                Année scolaire:{" "}
                {SCHOOL_YEARS.find((y) => y.value === schoolYear)?.label ||
                  schoolYear}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Footer avec boutons */}
      <div className="flex justify-end gap-3 pt-8 border-t border-border/50">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          className="h-12 px-6"
        >
          Annuler
        </Button>
        <Button type="submit" disabled={!isValid} className="h-12 px-6 gap-2">
          <Save className="h-4 w-4" />
          Créer la classe
        </Button>
      </div>
    </form>
  );
}
