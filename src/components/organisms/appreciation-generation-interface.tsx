"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/atoms/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/molecules/card";
import { Badge } from "@/components/atoms/badge";
import { Input } from "@/components/atoms/input";
import { Label } from "@/components/atoms/label";
import { Textarea } from "@/components/atoms/textarea";
import { Progress } from "@/components/atoms/progress";
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
} from "@/components/molecules/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/molecules/tabs";
import {
  Sparkles,
  User,
  Users,
  Settings,
  BookOpen,
  MessageSquare,
  Download,
  Star,
  RefreshCw,
  Copy,
  Eye,
  Clock,
  CheckCircle,
  AlertCircle
} from "lucide-react";
import { useAppreciationGeneration, useStyleGuides, usePhraseBank } from "@/features/appreciations";
import { MOCK_STUDENTS } from "@/features/students/mocks";
import { MOCK_SUBJECTS } from "@/features/gestion/mocks";
import { MOCK_ACADEMIC_PERIODS } from "@/features/gestion/mocks";
import type { GenerationRequest, BulkGenerationRequest } from "@/features/appreciations/hooks/use-appreciation-generation";

export interface AppreciationGenerationInterfaceProps {
  teacherId?: string;
  className?: string;
  defaultMode?: "individual" | "bulk";
  onGenerationComplete?: (appreciationIds: string[]) => void;
}

export function AppreciationGenerationInterface({
  teacherId = "KsmNtVf4zwqO3VV3SQJqPrRlQBA1fFyR",
  className = "",
  defaultMode = "individual",
  onGenerationComplete
}: AppreciationGenerationInterfaceProps) {
  const [mode, setMode] = useState<"individual" | "bulk">(defaultMode);
  const [selectedStudentId, setSelectedStudentId] = useState<string>("");
  const [selectedStudentIds, setSelectedStudentIds] = useState<string[]>([]);
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>("");
  const [selectedPeriodId, setSelectedPeriodId] = useState<string>("");
  const [selectedStyleGuideId, setSelectedStyleGuideId] = useState<string>("");
  const [selectedPhraseBankId, setSelectedPhraseBankId] = useState<string>("");
  const [contentKind, setContentKind] = useState<string>("bulletin");
  const [audience, setAudience] = useState<string>("parents");
  const [customInstructions, setCustomInstructions] = useState<string>("");
  const [generatedAppreciation, setGeneratedAppreciation] = useState<string>("");
  const [showPreview, setShowPreview] = useState<boolean>(false);

  const {
    generateAppreciation,
    generateBulkAppreciations,
    generationLoading,
    bulkGenerationProgress,
    updateAppreciationContent,
    toggleFavorite,
    validateAppreciation
  } = useAppreciationGeneration(teacherId);

  const { styleGuides } = useStyleGuides(teacherId);
  const { phraseBanks } = usePhraseBank(teacherId);

  // Génération individuelle
  const handleIndividualGeneration = async () => {
    if (!selectedStudentId || !selectedStyleGuideId) {
      return;
    }

    const student = MOCK_STUDENTS.find(s => s.id === selectedStudentId);
    if (!student) return;

    const request: GenerationRequest = {
      studentId: selectedStudentId,
      subjectId: selectedSubjectId || undefined,
      academicPeriodId: selectedPeriodId || undefined,
      schoolYearId: "year-2025",
      styleGuideId: selectedStyleGuideId,
      phraseBankId: selectedPhraseBankId || undefined,
      contentKind,
      scope: selectedSubjectId ? "subject" : "general",
      audience,
      generationTrigger: "manual",
      inputData: {
        studentName: student.fullName(),
        participationLevel: Math.random() * 10,
        averageGrade: Math.random() * 20,
        attendanceRate: 85 + Math.random() * 15,
        strengths: student.strengths,
        improvementAreas: student.improvementAxes,
        behaviorNotes: ["engaged", "collaborative"],
        customInstructions
      },
      generationParams: {
        includeStrengths: true,
        includeImprovements: true,
        includeEncouragement: true,
        focusAreas: ["participation", "comprehension", "expression"]
      },
      language: "fr"
    };

    const result = await generateAppreciation(request);
    if (result) {
      setGeneratedAppreciation(result.content);
      setShowPreview(true);
      onGenerationComplete?.([result.id]);
    }
  };

  // Génération en lot
  const handleBulkGeneration = async () => {
    if (selectedStudentIds.length === 0 || !selectedStyleGuideId) {
      return;
    }

    const request: BulkGenerationRequest = {
      studentIds: selectedStudentIds,
      baseRequest: {
        subjectId: selectedSubjectId || undefined,
        academicPeriodId: selectedPeriodId || undefined,
        schoolYearId: "year-2025",
        styleGuideId: selectedStyleGuideId,
        phraseBankId: selectedPhraseBankId || undefined,
        contentKind,
        scope: selectedSubjectId ? "subject" : "general",
        audience,
        generationTrigger: "bulk",
        inputData: {
          customInstructions
        },
        generationParams: {
          includeStrengths: true,
          includeImprovements: true,
          includeEncouragement: true,
          focusAreas: ["participation", "comprehension", "expression"]
        },
        language: "fr"
      }
    };

    const results = await generateBulkAppreciations(request);
    if (results.length > 0) {
      onGenerationComplete?.(results.map(r => r.id));
    }
  };

  const handleStudentSelection = (studentId: string, selected: boolean) => {
    if (selected) {
      setSelectedStudentIds(prev => [...prev, studentId]);
    } else {
      setSelectedStudentIds(prev => prev.filter(id => id !== studentId));
    }
  };

  const canGenerate = mode === "individual"
    ? selectedStudentId && selectedStyleGuideId
    : selectedStudentIds.length > 0 && selectedStyleGuideId;

  return (
    <div className={`space-y-6 ${className}`}>
      {/* En-tête */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-primary" />
            Génération d'appréciations IA
          </h2>
          <p className="text-sm text-muted-foreground">
            Créez des appréciations personnalisées avec l'intelligence artificielle
          </p>
        </div>
      </div>

      {/* Sélecteur de mode */}
      <Tabs value={mode} onValueChange={(value) => setMode(value as "individual" | "bulk")}>
        <TabsList className="grid grid-cols-2 w-fit">
          <TabsTrigger value="individual" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            Individuel
          </TabsTrigger>
          <TabsTrigger value="bulk" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            En lot
          </TabsTrigger>
        </TabsList>

        {/* Mode génération individuelle */}
        <TabsContent value="individual" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Configuration */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Configuration
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Sélection de l'élève */}
                <div>
                  <Label htmlFor="student">Élève</Label>
                  <Select value={selectedStudentId} onValueChange={setSelectedStudentId}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner un élève" />
                    </SelectTrigger>
                    <SelectContent>
                      {MOCK_STUDENTS.slice(0, 10).map(student => (
                        <SelectItem key={student.id} value={student.id}>
                          {student.fullName()}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Sélection de la matière */}
                <div>
                  <Label htmlFor="subject">Matière (optionnel)</Label>
                  <Select value={selectedSubjectId} onValueChange={setSelectedSubjectId}>
                    <SelectTrigger>
                      <SelectValue placeholder="Général ou par matière" />
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
                </div>

                {/* Période académique */}
                <div>
                  <Label htmlFor="period">Période</Label>
                  <Select value={selectedPeriodId} onValueChange={setSelectedPeriodId}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner une période" />
                    </SelectTrigger>
                    <SelectContent>
                      {MOCK_ACADEMIC_PERIODS.map(period => (
                        <SelectItem key={period.id} value={period.id}>
                          {period.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Guide de style */}
                <div>
                  <Label htmlFor="style">Guide de style</Label>
                  <Select value={selectedStyleGuideId} onValueChange={setSelectedStyleGuideId}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choisir un style" />
                    </SelectTrigger>
                    <SelectContent>
                      {styleGuides.map(guide => (
                        <SelectItem key={guide.id} value={guide.id}>
                          {guide.name}
                          <Badge variant="outline" className="ml-2 text-xs">
                            {guide.tone}
                          </Badge>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Banque de phrases */}
                <div>
                  <Label htmlFor="phrases">Banque de phrases (optionnel)</Label>
                  <Select value={selectedPhraseBankId} onValueChange={setSelectedPhraseBankId}>
                    <SelectTrigger>
                      <SelectValue placeholder="Utiliser une banque de phrases" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">Aucune banque spécifique</SelectItem>
                      {phraseBanks.map(bank => (
                        <SelectItem key={bank.id} value={bank.id}>
                          {bank.scope === 'general' ? 'Banque générale' :
                           MOCK_SUBJECTS.find(s => s.id === bank.subjectId)?.name || bank.subjectId}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Instructions personnalisées */}
                <div>
                  <Label htmlFor="instructions">Instructions personnalisées</Label>
                  <Textarea
                    id="instructions"
                    placeholder="Ajoutez des instructions spécifiques pour personnaliser l'appréciation..."
                    value={customInstructions}
                    onChange={(e) => setCustomInstructions(e.target.value)}
                    rows={3}
                  />
                </div>

                {/* Bouton de génération */}
                <Button
                  onClick={handleIndividualGeneration}
                  disabled={!canGenerate || generationLoading}
                  className="w-full"
                >
                  {generationLoading ? (
                    <>
                      <div className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full mr-2" />
                      Génération en cours...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4 mr-2" />
                      Générer l'appréciation
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* Prévisualisation */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="h-5 w-5" />
                  Prévisualisation
                </CardTitle>
              </CardHeader>
              <CardContent>
                {generatedAppreciation ? (
                  <div className="space-y-4">
                    <div className="p-4 bg-muted rounded-lg border-l-4 border-l-primary">
                      <p className="text-sm leading-relaxed">{generatedAppreciation}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">
                        <RefreshCw className="h-4 w-4 mr-1" />
                        Régénérer
                      </Button>
                      <Button size="sm" variant="outline">
                        <Copy className="h-4 w-4 mr-1" />
                        Copier
                      </Button>
                      <Button size="sm" variant="outline">
                        <Star className="h-4 w-4 mr-1" />
                        Favoris
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12 text-muted-foreground">
                    <MessageSquare className="h-16 w-16 mx-auto mb-4 opacity-50" />
                    <p>L'appréciation générée apparaîtra ici</p>
                    <p className="text-sm">Configurez les paramètres et lancez la génération</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Mode génération en lot */}
        <TabsContent value="bulk" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Configuration lot */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Génération en lot
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Sélection multiple d'élèves */}
                <div>
                  <Label>Élèves ({selectedStudentIds.length} sélectionnés)</Label>
                  <div className="mt-2 space-y-2 max-h-48 overflow-y-auto border rounded-lg p-3">
                    {MOCK_STUDENTS.slice(0, 10).map(student => (
                      <label key={student.id} className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={selectedStudentIds.includes(student.id)}
                          onChange={(e) => handleStudentSelection(student.id, e.target.checked)}
                          className="rounded"
                        />
                        <span className="text-sm">{student.fullName()}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Autres paramètres similaires au mode individuel */}
                <div>
                  <Label htmlFor="bulk-style">Guide de style</Label>
                  <Select value={selectedStyleGuideId} onValueChange={setSelectedStyleGuideId}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choisir un style commun" />
                    </SelectTrigger>
                    <SelectContent>
                      {styleGuides.map(guide => (
                        <SelectItem key={guide.id} value={guide.id}>
                          {guide.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Bouton de génération en lot */}
                <Button
                  onClick={handleBulkGeneration}
                  disabled={!canGenerate || generationLoading}
                  className="w-full"
                >
                  {generationLoading ? (
                    <>
                      <div className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full mr-2" />
                      Génération en cours...
                    </>
                  ) : (
                    <>
                      <Users className="h-4 w-4 mr-2" />
                      Générer pour {selectedStudentIds.length} élèves
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* Progression */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Progression
                </CardTitle>
              </CardHeader>
              <CardContent>
                {bulkGenerationProgress ? (
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>Élève en cours:</span>
                        <span>{bulkGenerationProgress.currentStudent}</span>
                      </div>
                      <Progress
                        value={(bulkGenerationProgress.current / bulkGenerationProgress.total) * 100}
                        className="mb-2"
                      />
                      <div className="text-xs text-muted-foreground text-center">
                        {bulkGenerationProgress.current} / {bulkGenerationProgress.total}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12 text-muted-foreground">
                    <Users className="h-16 w-16 mx-auto mb-4 opacity-50" />
                    <p>La progression apparaîtra ici</p>
                    <p className="text-sm">Lancez la génération en lot pour suivre l'avancement</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}