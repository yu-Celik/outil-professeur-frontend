"use client";

import { useState } from "react";
import { Check, ChevronDown, X } from "lucide-react";
import { Button } from "@/components/atoms/button";
import { Input } from "@/components/atoms/input";
import { Label } from "@/components/atoms/label";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/molecules/dropdown-menu";
import { cn } from "@/lib/utils";
import {
  FRENCH_SUBJECTS,
  SUBJECT_CATEGORIES,
  EDUCATION_LEVELS,
} from "@/data/subjects";
import type {
  Subject,
  EducationLevel,
  SubjectCategory,
} from "@/types/subjects";

interface SubjectSelectorProps {
  selectedSubjects?: string[];
  onSelectionChange: (subjectIds: string[]) => void;
  className?: string;
  placeholder?: string;
}

export function SubjectSelector({
  selectedSubjects = [],
  onSelectionChange,
  className,
  placeholder = "Sélectionner des matières...",
}: SubjectSelectorProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<SubjectCategory | "all">(
    "all",
  );

  const filteredSubjects = FRENCH_SUBJECTS.filter((subject) => {
    const matchesSearch =
      subject.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      subject.code.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      categoryFilter === "all" || subject.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const toggleSubject = (subjectId: string) => {
    const newSelection = selectedSubjects.includes(subjectId)
      ? selectedSubjects.filter((id) => id !== subjectId)
      : [...selectedSubjects, subjectId];
    onSelectionChange(newSelection);
  };

  const removeSubject = (subjectId: string) => {
    onSelectionChange(selectedSubjects.filter((id) => id !== subjectId));
  };

  const getSelectedSubjectsDisplay = () => {
    return FRENCH_SUBJECTS.filter((s) => selectedSubjects.includes(s.id));
  };

  return (
    <div className={cn("space-y-2", className)}>
      <Label>Matières enseignées</Label>

      {/* Selected subjects display */}
      {selectedSubjects.length > 0 && (
        <div className="flex flex-wrap gap-2 p-2 border rounded-md bg-muted/30">
          {getSelectedSubjectsDisplay().map((subject) => (
            <div
              key={subject.id}
              className="flex items-center gap-1 px-2 py-1 bg-primary text-primary-foreground text-xs rounded-full"
            >
              <span>{subject.name}</span>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-4 w-4 hover:bg-primary-foreground/20"
                onClick={() => removeSubject(subject.id)}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          ))}
        </div>
      )}

      {/* Subject selector dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            type="button"
            variant="outline"
            className={cn(
              "w-full justify-between",
              selectedSubjects.length === 0 && "text-muted-foreground",
            )}
          >
            {selectedSubjects.length > 0
              ? `${selectedSubjects.length} matière(s) sélectionnée(s)`
              : placeholder}
            <ChevronDown className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent className="w-80 p-0" align="start">
          {/* Search input */}
          <div className="p-3 border-b">
            <Input
              placeholder="Rechercher une matière..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="h-8"
            />
          </div>

          {/* Category filter */}
          <div className="p-3 border-b">
            <div className="flex flex-wrap gap-1">
              <Button
                type="button"
                variant={categoryFilter === "all" ? "default" : "outline"}
                size="sm"
                className="h-6 px-2 text-xs"
                onClick={() => setCategoryFilter("all")}
              >
                Toutes
              </Button>
              {Object.entries(SUBJECT_CATEGORIES).map(([key, label]) => (
                <Button
                  key={key}
                  type="button"
                  variant={categoryFilter === key ? "default" : "outline"}
                  size="sm"
                  className="h-6 px-2 text-xs"
                  onClick={() => setCategoryFilter(key as SubjectCategory)}
                >
                  {label}
                </Button>
              ))}
            </div>
          </div>

          {/* Subject list */}
          <div className="max-h-60 overflow-auto">
            {filteredSubjects.map((subject) => (
              <DropdownMenuItem
                key={subject.id}
                className="flex items-center gap-2 p-3 cursor-pointer"
                onSelect={() => toggleSubject(subject.id)}
              >
                <div className="flex h-4 w-4 items-center justify-center border rounded">
                  {selectedSubjects.includes(subject.id) && (
                    <Check className="h-3 w-3" />
                  )}
                </div>
                <div className="flex-1">
                  <div className="font-medium">{subject.name}</div>
                  <div className="text-xs text-muted-foreground">
                    {subject.level
                      .map((level) => EDUCATION_LEVELS[level])
                      .join(", ")}
                  </div>
                </div>
              </DropdownMenuItem>
            ))}

            {filteredSubjects.length === 0 && (
              <div className="p-3 text-center text-muted-foreground text-sm">
                Aucune matière trouvée
              </div>
            )}
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
