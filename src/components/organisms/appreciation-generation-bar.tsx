"use client";

import { useState } from "react";
import { Button } from "@/components/atoms/button";
import { Input } from "@/components/atoms/input";
import { Badge } from "@/components/atoms/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/atoms/select";
import { Textarea } from "@/components/atoms/textarea";
import { Switch } from "@/components/atoms/switch";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/molecules/sheet";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/molecules/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/molecules/command";
import {
  ArrowUp,
  Settings,
  User,
  Users,
  BookOpen,
  Calendar,
  Palette,
  MessageSquare,
  Sparkles,
  Check,
  ChevronsUpDown,
} from "lucide-react";
import { useClassSelection } from "@/contexts/class-selection-context";
import { useStyleGuides, usePhraseBanks } from "@/features/appreciations";
import { MOCK_STUDENTS } from "@/features/students/mocks";
import { MOCK_SUBJECTS } from "@/features/gestion/mocks";
import { MOCK_ACADEMIC_PERIODS } from "@/features/gestion/mocks";

interface AppreciationGenerationBarProps {
  selectedStudentId: string;
  setSelectedStudentId: (id: string) => void;
  selectedSubjectId: string;
  setSelectedSubjectId: (id: string) => void;
  selectedPeriodId: string;
  setSelectedPeriodId: (id: string) => void;
  selectedStyleId: string;
  setSelectedStyleId: (id: string) => void;
  selectedPhraseBankId: string;
  setSelectedPhraseBankId: (id: string) => void;
  customInstructions: string;
  setCustomInstructions: (text: string) => void;
  batchMode: boolean;
  setBatchMode: (enabled: boolean) => void;
  selectedStudentIds: string[];
  setSelectedStudentIds: (ids: string[]) => void;
  isGenerating: boolean;
  onGenerate: (params: any) => Promise<void>;
}

export function AppreciationGenerationBar({
  selectedStudentId,
  setSelectedStudentId,
  selectedSubjectId,
  setSelectedSubjectId,
  selectedPeriodId,
  setSelectedPeriodId,
  selectedStyleId,
  setSelectedStyleId,
  selectedPhraseBankId,
  setSelectedPhraseBankId,
  customInstructions,
  setCustomInstructions,
  batchMode,
  setBatchMode,
  selectedStudentIds,
  setSelectedStudentIds,
  isGenerating,
  onGenerate,
}: AppreciationGenerationBarProps) {
  const [studentSelectorOpen, setStudentSelectorOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);

  const { selectedClassId } = useClassSelection();
  const { styleGuides } = useStyleGuides("teacher-1");
  const { phraseBanks } = usePhraseBanks("teacher-1");

  const classStudents = MOCK_STUDENTS.filter(student =>
    student.currentClassId === selectedClassId
  );

  const selectedStudent = MOCK_STUDENTS.find(s => s.id === selectedStudentId);
  const selectedSubject = MOCK_SUBJECTS.find(s => s.id === selectedSubjectId);
  const selectedPeriod = MOCK_ACADEMIC_PERIODS.find(p => p.id === selectedPeriodId);
  const selectedStyle = styleGuides.find(s => s.id === selectedStyleId);
  const selectedPhraseBank = phraseBanks.find(p => p.id === selectedPhraseBankId);

  const handleGenerate = async () => {
    if (batchMode && selectedStudentIds.length === 0) {
      return;
    }
    if (!batchMode && !selectedStudentId) {
      return;
    }

    const params = {
      studentId: batchMode ? undefined : selectedStudentId,
      studentIds: batchMode ? selectedStudentIds : undefined,
      subjectId: selectedSubjectId,
      periodId: selectedPeriodId,
      styleId: selectedStyleId,
      phraseBankId: selectedPhraseBankId,
      customInstructions,
      batchMode,
    };

    await onGenerate(params);
  };

  const handleStudentSelection = (studentId: string) => {
    if (batchMode) {
      // @ts-ignore
      setSelectedStudentIds(prev =>
        prev.includes(studentId)
          ? prev.filter((id: string) => id !== studentId)
          : [...prev, studentId]
      );
    } else {
      setSelectedStudentId(studentId);
      setStudentSelectorOpen(false);
    }
  };

  const canGenerate = batchMode
    ? selectedStudentIds.length > 0 && selectedStyleId
    : selectedStudentId && selectedStyleId;

  return (
    <div className="p-4 space-y-4 bg-background border-t">
      {/* Quick Selection Bar */}
      <div className="flex items-center gap-3 flex-wrap">
        {/* Student/Batch Selector */}
        <Popover open={studentSelectorOpen} onOpenChange={setStudentSelectorOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={studentSelectorOpen}
              className="justify-between min-w-[200px]"
            >
              {batchMode ? (
                selectedStudentIds.length > 0 ? (
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    {selectedStudentIds.length} élève(s)
                  </div>
                ) : (
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    Sélectionner des élèves
                  </div>
                )
              ) : selectedStudent ? (
                <div className="flex items-center gap-1">
                  <User className="h-4 w-4" />
                  {selectedStudent.fullName()}
                </div>
              ) : (
                <div className="flex items-center gap-1">
                  <User className="h-4 w-4" />
                  Sélectionner un élève
                </div>
              )}
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[300px] p-0">
            <Command>
              <CommandInput placeholder="Rechercher un élève..." />
              <CommandList>
                <CommandEmpty>Aucun élève trouvé.</CommandEmpty>
                <CommandGroup>
                  {classStudents.map((student) => (
                    <CommandItem
                      key={student.id}
                      value={student.fullName()}
                      onSelect={() => handleStudentSelection(student.id)}
                    >
                      <div className="flex items-center gap-2 flex-1">
                        {batchMode ? (
                          <div className="flex items-center gap-2">
                            <div className={`w-4 h-4 border rounded-sm flex items-center justify-center ${
                              selectedStudentIds.includes(student.id)
                                ? 'bg-primary border-primary'
                                : 'border-muted-foreground'
                            }`}>
                              {selectedStudentIds.includes(student.id) && (
                                <Check className="h-3 w-3 text-primary-foreground" />
                              )}
                            </div>
                            <span>{student.fullName()}</span>
                          </div>
                        ) : (
                          <>
                            <Check
                              className={`mr-2 h-4 w-4 ${
                                selectedStudentId === student.id ? "opacity-100" : "opacity-0"
                              }`}
                            />
                            <span>{student.fullName()}</span>
                          </>
                        )}
                      </div>
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>

        {/* Subject Selector */}
        <Select value={selectedSubjectId} onValueChange={setSelectedSubjectId}>
          <SelectTrigger className="w-[180px]">
            <div className="flex items-center gap-1">
              <BookOpen className="h-4 w-4" />
              <SelectValue placeholder="Matière" />
            </div>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="general">Appréciation générale</SelectItem>
            {MOCK_SUBJECTS.map(subject => (
              <SelectItem key={subject.id} value={subject.id}>
                {subject.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Period Selector */}
        <Select value={selectedPeriodId} onValueChange={setSelectedPeriodId}>
          <SelectTrigger className="w-[160px]">
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              <SelectValue placeholder="Période" />
            </div>
          </SelectTrigger>
          <SelectContent>
            {MOCK_ACADEMIC_PERIODS.map(period => (
              <SelectItem key={period.id} value={period.id}>
                {period.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Style Selector */}
        <Select value={selectedStyleId} onValueChange={setSelectedStyleId}>
          <SelectTrigger className="w-[140px]">
            <div className="flex items-center gap-1">
              <Palette className="h-4 w-4" />
              <SelectValue placeholder="Style" />
            </div>
          </SelectTrigger>
          <SelectContent>
            {styleGuides.map(guide => (
              <SelectItem key={guide.id} value={guide.id}>
                {guide.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Batch Mode Toggle */}
        <div className="flex items-center gap-2 px-3 py-2 border rounded-md">
          <Switch
            checked={batchMode}
            onCheckedChange={setBatchMode}
            id="batch-mode"
          />
          <label htmlFor="batch-mode" className="text-sm font-medium cursor-pointer">
            Mode lot
          </label>
        </div>

        {/* Settings Button */}
        <Sheet open={settingsOpen} onOpenChange={setSettingsOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon">
              <Settings className="h-4 w-4" />
            </Button>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Paramètres avancés</SheetTitle>
            </SheetHeader>
            <div className="space-y-6 mt-6">
              {/* Phrase Bank */}
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Banque de phrases (optionnel)
                </label>
                <Select value={selectedPhraseBankId} onValueChange={setSelectedPhraseBankId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Aucune banque sélectionnée" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Aucune banque</SelectItem>
                    {phraseBanks.map(bank => (
                      <SelectItem key={bank.id} value={bank.id}>
                        {bank.scope} ({Object.keys(bank.entries).length} entrées)
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Custom Instructions */}
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Instructions personnalisées
                </label>
                <Textarea
                  value={customInstructions}
                  onChange={(e) => setCustomInstructions(e.target.value)}
                  placeholder="Ajoutez des instructions spécifiques pour personnaliser la génération..."
                  rows={4}
                />
              </div>
            </div>
          </SheetContent>
        </Sheet>

        {/* Generate Button */}
        <Button
          onClick={handleGenerate}
          disabled={!canGenerate || isGenerating}
          className="ml-auto"
        >
          {isGenerating ? (
            <div className="flex items-center gap-2">
              <div className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full" />
              Génération...
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4" />
              Générer {batchMode && selectedStudentIds.length > 1 ? `(${selectedStudentIds.length})` : ''}
            </div>
          )}
        </Button>
      </div>

      {/* Active Parameters Display */}
      {(selectedStudent || selectedStudentIds.length > 0 || selectedSubject || selectedPeriod || selectedStyle) && (
        <div className="flex items-center gap-2 flex-wrap pt-2 border-t">
          <span className="text-sm text-muted-foreground">Paramètres actifs:</span>

          {batchMode && selectedStudentIds.length > 0 && (
            <Badge variant="secondary">
              <Users className="h-3 w-3 mr-1" />
              {selectedStudentIds.length} élève(s)
            </Badge>
          )}

          {!batchMode && selectedStudent && (
            <Badge variant="secondary">
              <User className="h-3 w-3 mr-1" />
              {selectedStudent.fullName()}
            </Badge>
          )}

          {selectedSubject && (
            <Badge variant="secondary">
              <BookOpen className="h-3 w-3 mr-1" />
              {selectedSubject.name}
            </Badge>
          )}

          {selectedPeriod && (
            <Badge variant="secondary">
              <Calendar className="h-3 w-3 mr-1" />
              {selectedPeriod.name}
            </Badge>
          )}

          {selectedStyle && (
            <Badge variant="outline">
              <Palette className="h-3 w-3 mr-1" />
              {selectedStyle.name}
            </Badge>
          )}

          {selectedPhraseBank && (
            <Badge variant="outline">
              <MessageSquare className="h-3 w-3 mr-1" />
              {selectedPhraseBank.scope}
            </Badge>
          )}

          {customInstructions && (
            <Badge variant="outline">
              <Sparkles className="h-3 w-3 mr-1" />
              Instructions personnalisées
            </Badge>
          )}
        </div>
      )}
    </div>
  );
}