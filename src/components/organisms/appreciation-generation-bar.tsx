"use client";

import { useMemo } from "react";
import { Sparkles, Users, User, Settings } from "lucide-react";
import { Button } from "@/components/atoms/button";
import { Label } from "@/components/atoms/label";
import { Textarea } from "@/components/atoms/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/atoms/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/molecules/tabs";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/molecules/sheet";
import { Checkbox } from "@/components/atoms/checkbox";
import { cn } from "@/lib/utils";

export type GenerationMode = "individual" | "bulk";

export interface StudentOption {
  id: string;
  label: string;
  classLabel?: string;
}

export interface SubjectOption {
  id: string;
  label: string;
}

export interface PeriodOption {
  id: string;
  label: string;
}

export interface StyleOption {
  id: string;
  label: string;
  tone?: string;
}

export interface PhraseBankOption {
  id: string;
  label: string;
}

export interface AppreciationGenerationBarProps {
  mode: GenerationMode;
  onModeChange: (mode: GenerationMode) => void;
  studentId?: string;
  studentIds: string[];
  onSelectStudent: (studentId: string) => void;
  onToggleStudent: (studentId: string) => void;
  subjectId?: string;
  periodId?: string;
  styleId?: string;
  phraseBankId?: string;
  instructions: string;
  onSubjectChange: (subjectId?: string) => void;
  onPeriodChange: (periodId?: string) => void;
  onStyleChange: (styleId?: string) => void;
  onPhraseBankChange: (phraseBankId?: string) => void;
  onInstructionsChange: (instructions: string) => void;
  onGenerate: () => void;
  canGenerate: boolean;
  isGenerating: boolean;
  students: StudentOption[];
  subjects: SubjectOption[];
  periods: PeriodOption[];
  styles: StyleOption[];
  phraseBanks: PhraseBankOption[];
  onOpenStyleManager: () => void;
  onOpenPhraseBankManager: () => void;
}

export function AppreciationGenerationBar({
  mode,
  onModeChange,
  studentId,
  studentIds,
  onSelectStudent,
  onToggleStudent,
  subjectId,
  periodId,
  styleId,
  phraseBankId,
  instructions,
  onSubjectChange,
  onPeriodChange,
  onStyleChange,
  onPhraseBankChange,
  onInstructionsChange,
  onGenerate,
  canGenerate,
  isGenerating,
  students,
  subjects,
  periods,
  styles,
  phraseBanks,
  onOpenStyleManager,
  onOpenPhraseBankManager,
}: AppreciationGenerationBarProps) {
  const selectedCount = studentIds.length;

  const studentSummary = useMemo(() => {
    if (mode === "bulk") {
      return selectedCount > 0
        ? `${selectedCount} élève${selectedCount > 1 ? "s" : ""} sélectionné${selectedCount > 1 ? "s" : ""}`
        : "Sélectionner des élèves";
    }
    if (!studentId) return "Sélectionner un élève";
    const selected = students.find((student) => student.id === studentId);
    return selected?.label ?? "Sélectionner un élève";
  }, [mode, studentId, students, selectedCount]);

  const selectedStyle = useMemo(() => {
    if (!styleId) return undefined;
    return styles.find((style) => style.id === styleId);
  }, [styleId, styles]);

  const selectedPhraseBank = useMemo(() => {
    if (!phraseBankId) return undefined;
    return phraseBanks.find((bank) => bank.id === phraseBankId);
  }, [phraseBankId, phraseBanks]);

  return (
    <div className="sticky bottom-0 inset-x-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/75 z-30 border-t border-border/50">
      <div className="px-6 py-4 space-y-4">
        {/* En-tête avec mode et bouton */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Sparkles className="h-5 w-5 text-primary" />
            <span className="font-medium">Génération IA</span>
            <Tabs
              value={mode}
              onValueChange={(value) => onModeChange(value as GenerationMode)}
            >
              <TabsList className="h-8">
                <TabsTrigger value="individual" className="h-6 px-3 text-xs">
                  <User className="h-3 w-3 mr-1" />
                  Individuel
                </TabsTrigger>
                <TabsTrigger value="bulk" className="h-6 px-3 text-xs">
                  <Users className="h-3 w-3 mr-1" />
                  Lot
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          <Button
            onClick={onGenerate}
            disabled={!canGenerate || isGenerating}
            className="gap-2"
          >
            <Sparkles className="h-4 w-4" />
            {isGenerating ? "Génération..." : "Générer"}
          </Button>
        </div>

        {/* Contrôles de configuration */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Sélection élève(s) */}
          {mode === "individual" ? (
            <Select value={studentId} onValueChange={onSelectStudent}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Sélectionner un élève" />
              </SelectTrigger>
              <SelectContent>
                {students.map((student) => (
                  <SelectItem key={student.id} value={student.id}>
                    {student.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : (
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" className="w-48 justify-start">
                  <Users className="h-4 w-4 mr-2" />
                  {selectedCount > 0
                    ? `${selectedCount} élève${selectedCount > 1 ? "s" : ""}`
                    : "Sélectionner élèves"}
                </Button>
              </SheetTrigger>
              <SheetContent side="bottom" className="h-[70vh]">
                <SheetHeader>
                  <SheetTitle>Sélection des élèves</SheetTitle>
                  <SheetDescription>
                    Choisissez les élèves pour la génération en lot.
                  </SheetDescription>
                </SheetHeader>
                <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {students.map((student) => {
                    const checked = studentIds.includes(student.id);
                    return (
                      <button
                        key={student.id}
                        type="button"
                        onClick={() => onToggleStudent(student.id)}
                        className={cn(
                          "flex items-start gap-3 rounded-lg border p-4 text-left transition",
                          checked
                            ? "border-primary/60 bg-primary/5"
                            : "hover:bg-muted/60",
                        )}
                      >
                        <Checkbox
                          checked={checked}
                          className="pointer-events-none"
                        />
                        <div className="flex-1 space-y-1">
                          <div className="font-medium">{student.label}</div>
                          {student.classLabel && (
                            <div className="text-xs text-muted-foreground">
                              {student.classLabel}
                            </div>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </SheetContent>
            </Sheet>
          )}

          {/* Matière */}
          <Select
            value={subjectId || "__general"}
            onValueChange={(value) =>
              onSubjectChange(value === "__general" ? undefined : value)
            }
          >
            <SelectTrigger className="w-36">
              <SelectValue placeholder="Matière" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="__general">Général</SelectItem>
              {subjects.map((subject) => (
                <SelectItem key={subject.id} value={subject.id}>
                  {subject.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Période */}
          <Select
            value={periodId || "__year"}
            onValueChange={(value) =>
              onPeriodChange(value === "__year" ? undefined : value)
            }
          >
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Période" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="__year">Année</SelectItem>
              {periods.map((period) => (
                <SelectItem key={period.id} value={period.id}>
                  {period.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Style */}
          <div className="flex items-center gap-2">
            <Select value={styleId} onValueChange={onStyleChange}>
              <SelectTrigger className="w-36">
                <SelectValue placeholder="Style" />
              </SelectTrigger>
              <SelectContent>
                {styles.map((style) => (
                  <SelectItem key={style.id} value={style.id}>
                    {style.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              variant="ghost"
              size="sm"
              onClick={onOpenStyleManager}
              className="h-8 w-8 p-0"
            >
              <Settings className="h-4 w-4" />
            </Button>
          </div>

          {/* Banque de phrases */}
          <div className="flex items-center gap-2">
            <Select
              value={phraseBankId || "__none"}
              onValueChange={(value) =>
                onPhraseBankChange(value === "__none" ? undefined : value)
              }
            >
              <SelectTrigger className="w-36">
                <SelectValue placeholder="Banque" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="__none">Aucune</SelectItem>
                {phraseBanks.map((bank) => (
                  <SelectItem key={bank.id} value={bank.id}>
                    {bank.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              variant="ghost"
              size="sm"
              onClick={onOpenPhraseBankManager}
              className="h-8 w-8 p-0"
            >
              <Settings className="h-4 w-4" />
            </Button>
          </div>

          {/* Instructions */}
          <Textarea
            value={instructions}
            onChange={(e) => onInstructionsChange(e.target.value)}
            placeholder="Instructions personnalisées..."
            className="min-w-64 h-8 resize-none"
            rows={1}
          />
        </div>
      </div>
    </div>
  );
}
