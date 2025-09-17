"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  BookOpen,
  ListChecks,
  Sparkles,
  Target,
  Users,
} from "lucide-react";
import { Badge } from "@/components/atoms/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/molecules/dialog";
import { Card, CardContent } from "@/components/molecules/card";
import {
  AppreciationContextPanel,
  type AppreciationContextSection,
} from "@/components/organisms/appreciation-context-panel";
import {
  AppreciationGenerationBar,
  type GenerationMode,
} from "@/components/organisms/appreciation-generation-bar";
import {
  AppreciationHistoryPanel,
  type AppreciationHistoryFilters,
} from "@/components/organisms/appreciation-history-panel";
import {
  AppreciationPreviewStack,
  type AppreciationPreviewItem,
} from "@/components/organisms/appreciation-preview-stack";
import { PhraseBankManagement } from "@/components/organisms/phrase-bank-management";
import { StyleGuideManagement } from "@/components/organisms/style-guide-management";
import { useClassSelection } from "@/contexts/class-selection-context";
import {
  useAppreciationGeneration,
  usePhraseBank,
  useStyleGuides,
} from "@/features/appreciations";
import {
  MOCK_ACADEMIC_PERIODS,
  MOCK_SUBJECTS,
} from "@/features/gestion/mocks";
import {
  getStudentById,
  getStudentsByClass,
} from "@/features/students/mocks";
import { getParticipationsForAnalysis } from "@/features/students/mocks/mock-student-participation";
import {
  getExamById,
  getStudentExamResults,
} from "@/features/evaluations/mocks";
import type { AppreciationContent } from "@/types/uml-entities";
import { useSetPageTitle } from "@/shared/hooks";

interface StudentOption {
  id: string;
  label: string;
  classLabel?: string;
}

interface SelectOption {
  id: string;
  label: string;
}

interface BulkProgressState {
  current: number;
  total: number;
  studentName: string;
}

export default function AppreciationsPage() {
  useSetPageTitle("Appréciations IA");

  const {
    selectedClassId,
    classes,
    assignmentsLoading,
  } = useClassSelection();

  const {
    appreciations,
    allAppreciations,
    filters,
    applyFilters,
    clearFilters,
    generateAppreciation,
    regenerateAppreciation,
    updateAppreciationContent,
    validateAppreciation,
    toggleFavorite,
    deleteAppreciation,
    getAppreciationsByStudent,
    generationLoading,
    getStats,
  } = useAppreciationGeneration();

  const { styleGuides, loading: styleLoading } = useStyleGuides();
  const { phraseBanks } = usePhraseBank();

  const [mode, setMode] = useState<GenerationMode>("individual");
  const [selectedStudentId, setSelectedStudentId] = useState<string | undefined>();
  const [selectedStudentIds, setSelectedStudentIds] = useState<string[]>([]);
  const [selectedSubjectId, setSelectedSubjectId] = useState<string | undefined>();
  const [selectedPeriodId, setSelectedPeriodId] = useState<string | undefined>();
  const [selectedStyleId, setSelectedStyleId] = useState<string | undefined>();
  const [selectedPhraseBankId, setSelectedPhraseBankId] = useState<string | undefined>();
  const [customInstructions, setCustomInstructions] = useState<string>("");
  const [previewIds, setPreviewIds] = useState<string[]>([]);
  const [sectionToggles, setSectionToggles] = useState<Record<string, boolean>>({
    overview: true,
    attendance: true,
    participation: true,
    exams: true,
    observations: true,
    history: true,
  });
  const [isStyleManagerOpen, setIsStyleManagerOpen] = useState(false);
  const [isPhraseManagerOpen, setIsPhraseManagerOpen] = useState(false);
  const [bulkProgress, setBulkProgress] = useState<BulkProgressState | null>(null);
  const [localGenerating, setLocalGenerating] = useState(false);

  const {
    studentsOptions,
    selectedStudent,
    subjectOptions,
    periodOptions,
    styleOptions,
    phraseBankOptions,
    subjectLabelMap,
    periodLabelMap,
    styleLabelMap,
    totalStudents,
  } = useMemo(() => {
    const classStudents = selectedClassId ? getStudentsByClass(selectedClassId) : [];
    const options: StudentOption[] = classStudents
      .map((student) => ({
        id: student.id,
        label: student.fullName(),
        classLabel: classes.find((cls) => cls.id === student.currentClassId)?.classCode,
      }))
      .sort((a, b) => a.label.localeCompare(b.label));

    const student = selectedStudentId ? getStudentById(selectedStudentId) : undefined;

    const subjects: SelectOption[] = MOCK_SUBJECTS.map((subject) => ({
      id: subject.id,
      label: subject.name,
    }));

    const periods: SelectOption[] = MOCK_ACADEMIC_PERIODS.map((period) => ({
      id: period.id,
      label: period.name,
    }));

    const styles: SelectOption[] = styleGuides.map((style) => ({
      id: style.id,
      label: style.name,
    }));

    const phraseOptions: SelectOption[] = phraseBanks.map((bank) => {
      const subjectLabel = subjects.find((subject) => subject.id === bank.subjectId)?.label;
      const label = bank.scope === "general"
        ? "Banque générale"
        : subjectLabel
          ? `Banque ${subjectLabel}`
          : bank.id;

      return {
        id: bank.id,
        label,
      };
    });

    return {
      studentsOptions: options,
      selectedStudent: student,
      subjectOptions: subjects,
      periodOptions: periods,
      styleOptions: styles,
      phraseBankOptions: phraseOptions,
      subjectLabelMap: new Map(subjects.map((subject) => [subject.id, subject.label] as const)),
      periodLabelMap: new Map(periods.map((period) => [period.id, period.label] as const)),
      styleLabelMap: new Map(styles.map((style) => [style.id, style.label] as const)),
      totalStudents: classStudents.length,
    };
  }, [classes, phraseBanks, selectedClassId, selectedStudentId, styleGuides]);

  const appreciationStats = useMemo(() => getStats(), [getStats]);

  useEffect(() => {
    if (!selectedStyleId && styleGuides.length > 0) {
      setSelectedStyleId(styleGuides[0].id);
    }
  }, [selectedStyleId, styleGuides]);

  useEffect(() => {
    if (mode === "bulk" && selectedStudentId) {
      setSelectedStudentIds((prev) =>
        prev.includes(selectedStudentId) ? prev : [...prev, selectedStudentId],
      );
    }
  }, [mode, selectedStudentId]);

  useEffect(() => {
    if (selectedStudentId && studentsOptions.every((student) => student.id !== selectedStudentId)) {
      setSelectedStudentId(undefined);
    }
  }, [studentsOptions, selectedStudentId]);

  useEffect(() => {
    setSelectedStudentIds((prev) => prev.filter((id) => studentsOptions.some((student) => student.id === id)));
  }, [studentsOptions]);

  const handleToggleSection = useCallback((sectionId: string, enabled: boolean) => {
    setSectionToggles((prev) => ({ ...prev, [sectionId]: enabled }));
  }, []);

  const buildContextSections = useCallback((studentId: string): AppreciationContextSection[] => {
    const student = getStudentById(studentId);
    if (!student) {
      return [];
    }

    const participations = getParticipationsForAnalysis(studentId);
    const exams = getStudentExamResults(studentId);

    const attendanceTotal = participations.length;
    const attendancePresent = participations.filter((p) => p.isPresent).length;
    const attendanceRate = attendanceTotal > 0
      ? Math.round((attendancePresent / attendanceTotal) * 100)
      : 0;
    const unjustifiedAbsences = Math.max(attendanceTotal - attendancePresent - 1, 0);
    const justifiedAbsences = Math.max((attendanceTotal - attendancePresent) - unjustifiedAbsences, 0);

    const participationAverage = participations.length > 0
      ? participations.reduce((sum, p) => sum + p.participationLevel, 0) / participations.length
      : 0;

    const participationTrend = (() => {
      if (participations.length < 4) return "steady" as const;
      const half = Math.floor(participations.length / 2);
      const firstHalfAvg = participations
        .slice(0, half)
        .reduce((sum, p) => sum + p.participationLevel, 0) / half;
      const secondHalfAvg = participations
        .slice(half)
        .reduce((sum, p) => sum + p.participationLevel, 0) / (participations.length - half);
      if (secondHalfAvg > firstHalfAvg + 0.5) return "up" as const;
      if (secondHalfAvg < firstHalfAvg - 0.5) return "down" as const;
      return "steady" as const;
    })();

    const filteredResults = exams.filter((result) => {
      const exam = getExamById(result.examId);
      if (!exam) return false;
      if (selectedSubjectId && exam.subjectId !== selectedSubjectId) return false;
      if (selectedPeriodId && exam.academicPeriodId !== selectedPeriodId) return false;
      return true;
    });

    const totalPoints = filteredResults.reduce((sum, result) => {
      const exam = getExamById(result.examId);
      return sum + (exam?.totalPoints ?? 20);
    }, 0);
    const totalAchieved = filteredResults.reduce((sum, result) => {
      const exam = getExamById(result.examId);
      if (!exam || result.isAbsent) return sum;
      return sum + result.pointsObtained;
    }, 0);
    const averageGrade = totalPoints > 0 ? (totalAchieved / totalPoints) * 20 : 0;

    const bestResult = filteredResults.reduce((best, current) => {
      if (!best) return current;
      const bestPoints = best.isAbsent ? 0 : best.pointsObtained;
      const currentPoints = current.isAbsent ? 0 : current.pointsObtained;
      return currentPoints > bestPoints ? current : best;
    }, filteredResults[0]);

    const homeworkDoneCount = participations.filter((p) => p.homeworkDone).length;
    const homeworkRate = attendanceTotal > 0
      ? Math.round((homeworkDoneCount / attendanceTotal) * 100)
      : 0;
    const notableInterventions = participations
      .slice(0, 10)
      .filter((p) => Boolean(p.specificRemarks)).length;

    const recentAppreciations = getAppreciationsByStudent(studentId).slice(0, 2);

    const contextSections: AppreciationContextSection[] = [
      {
        id: "overview",
        title: "Informations générales",
        description:
          "Classe actuelle, matière ciblée et période académique considérée pour la génération de l'appréciation.",
        enabled: sectionToggles.overview ?? true,
        metrics: [
          {
            label: "Classe",
            value: classes.find((cls) => cls.id === student.currentClassId)?.classCode ?? "-",
          },
          {
            label: "Matière",
            value: selectedSubjectId ? subjectLabelMap.get(selectedSubjectId) ?? selectedSubjectId : "Général",
          },
          {
            label: "Période",
            value: selectedPeriodId ? periodLabelMap.get(selectedPeriodId) ?? selectedPeriodId : "Année courante",
          },
        ],
      },
      {
        id: "attendance",
        title: "Assiduité",
        description:
          "Présence, absences justifiées ou non et engagement global pendant la période sélectionnée.",
        enabled: sectionToggles.attendance ?? true,
        metrics: [
          {
            label: "Taux de présence",
            value: `${attendanceRate}%`,
            helperText: `${attendancePresent}/${attendanceTotal} séances suivies`,
            trend: attendanceRate >= 95 ? "up" : attendanceRate < 80 ? "down" : "steady",
          },
          {
            label: "Absences justifiées",
            value: `${justifiedAbsences}`,
          },
          {
            label: "Absences non justifiées",
            value: `${unjustifiedAbsences}`,
          },
        ],
      },
      {
        id: "participation",
        title: "Participation & Comportement",
        description:
          "Niveau de participation observé en classe et évolution du comportement sur la période.",
        enabled: sectionToggles.participation ?? true,
        metrics: [
          {
            label: "Participation moyenne",
            value: `${participationAverage.toFixed(1)}/10`,
            trend: participationTrend,
            trendLabel:
              participationTrend === "up"
                ? "En progression"
                : participationTrend === "down"
                  ? "En baisse légère"
                  : "Stable",
          },
          {
            label: "Devoirs rendus",
            value: `${homeworkRate}%`,
            helperText: `${homeworkDoneCount}/${attendanceTotal} rendus`,
          },
          {
            label: "Interventions notables",
            value: `${notableInterventions}`,
            helperText: "Commentaires comportementaux disponibles",
          },
        ],
      },
      {
        id: "exams",
        title: "Résultats d'évaluations",
        description:
          "Moyennes, meilleures performances et éventuelles absences aux évaluations.",
        enabled: sectionToggles.exams ?? true,
        metrics: [
          {
            label: "Moyenne",
            value: filteredResults.length > 0 ? `${averageGrade.toFixed(1)}/20` : "N/A",
          },
          {
            label: "Meilleure note",
            value: bestResult && !bestResult.isAbsent ? `${bestResult.pointsObtained} pts` : bestResult && bestResult.isAbsent ? "Absent" : "-",
            helperText: bestResult
              ? getExamById(bestResult.examId)?.title ?? bestResult.examId
              : "Aucune note enregistrée",
          },
          {
            label: "Évaluations manquées",
            value: `${filteredResults.filter((result) => result.isAbsent).length}`,
          },
        ],
      },
      {
        id: "observations",
        title: "Observations enseignantes",
        description:
          "Forces, axes de progression et observations notées dans le profil de l'élève.",
        enabled: sectionToggles.observations ?? true,
        items: [
          ...student.strengths.slice(0, 3).map((strength) => ({
            label: strength,
            tone: "positive" as const,
          })),
          ...student.improvementAxes.slice(0, 2).map((axis) => ({
            label: axis,
            tone: "warning" as const,
          })),
          ...student.observations.slice(0, 2).map((observation) => ({
            label: observation,
          })),
        ],
      },
      {
        id: "history",
        title: "Dernières appréciations",
        description:
          "Historique récent pour comparer et garantir la cohérence des commentaires.",
        enabled: sectionToggles.history ?? true,
        items: recentAppreciations.map((appreciation) => ({
          label: `${appreciation.content.slice(0, 120)}${appreciation.content.length > 120 ? "…" : ""}`,
        })),
        footerNote:
          recentAppreciations.length === 0
            ? "Aucune appréciation validée précédente pour cet élève."
            : "Ces appréciations resteront disponibles dans l'historique complet.",
      },
    ];

    return contextSections;
  }, [
    classes,
    getAppreciationsByStudent,
    periodLabelMap,
    sectionToggles,
    selectedPeriodId,
    selectedSubjectId,
    subjectLabelMap,
  ]);

  const contextSections = useMemo(() => {
    if (!selectedStudentId) return [];
    return buildContextSections(selectedStudentId);
  }, [buildContextSections, selectedStudentId]);

  const canGenerate = useMemo(() => {
    if (!selectedStyleId) return false;
    if (mode === "individual") {
      return Boolean(selectedStudentId);
    }
    return selectedStudentIds.length > 0;
  }, [mode, selectedStudentId, selectedStudentIds.length, selectedStyleId]);

  const generationDisabled = localGenerating || generationLoading;

  const buildGenerationPayload = useCallback(
    (studentId: string) => {
      const student = getStudentById(studentId);
      if (!student || !selectedStyleId) {
        return null;
      }

      const sections = buildContextSections(studentId).filter((section) => section.enabled);
      const subjectLabel = selectedSubjectId ? subjectLabelMap.get(selectedSubjectId) ?? selectedSubjectId : undefined;
      const periodLabel = selectedPeriodId ? periodLabelMap.get(selectedPeriodId) ?? selectedPeriodId : undefined;

      return {
        studentName: student.fullName(),
        request: {
          studentId,
          subjectId: selectedSubjectId,
          academicPeriodId: selectedPeriodId,
          schoolYearId: "year-2025",
          styleGuideId: selectedStyleId,
          phraseBankId: selectedPhraseBankId,
          contentKind: "bulletin",
          scope: selectedSubjectId ? "subject" : "general",
          audience: "parents",
          generationTrigger: mode === "bulk" ? "bulk" : "manual",
          inputData: {
            studentName: student.fullName(),
            classCode: classes.find((cls) => cls.id === student.currentClassId)?.classCode,
            subjectLabel,
            periodLabel,
            sections,
            customInstructions,
          },
          generationParams: {
            includeOverview: sectionToggles.overview,
            includeAttendance: sectionToggles.attendance,
            includeParticipation: sectionToggles.participation,
            includeExams: sectionToggles.exams,
            includeObservations: sectionToggles.observations,
            includeHistory: sectionToggles.history,
            tone: styleGuides.find((style) => style.id === selectedStyleId)?.tone,
          },
          language: "fr",
        } as const,
      };
    },
    [
      buildContextSections,
      classes,
      customInstructions,
      mode,
      periodLabelMap,
      sectionToggles,
      selectedPeriodId,
      selectedPhraseBankId,
      selectedStyleId,
      selectedSubjectId,
      styleGuides,
      subjectLabelMap,
    ],
  );

  const handleIndividualGeneration = useCallback(async () => {
    if (!selectedStudentId) return;
    const payload = buildGenerationPayload(selectedStudentId);
    if (!payload) return;

    try {
      setLocalGenerating(true);
      const result = await generateAppreciation(payload.request);
      if (result) {
        setPreviewIds([result.id]);
      }
    } finally {
      setLocalGenerating(false);
    }
  }, [selectedStudentId, buildGenerationPayload, generateAppreciation]);

  const handleBulkGeneration = useCallback(async () => {
    if (selectedStudentIds.length === 0) return;

    const uniqueIds = Array.from(new Set(selectedStudentIds));
    const generated: string[] = [];

    try {
      setLocalGenerating(true);
      setBulkProgress({ current: 0, total: uniqueIds.length, studentName: "" });

      for (let index = 0; index < uniqueIds.length; index++) {
        const studentId = uniqueIds[index];
        const payload = buildGenerationPayload(studentId);
        if (!payload) continue;

        setBulkProgress({ current: index, total: uniqueIds.length, studentName: payload.studentName });
        const result = await generateAppreciation(payload.request);
        if (result) {
          generated.push(result.id);
        }
      }

      setPreviewIds(generated);
    } finally {
      setBulkProgress(null);
      setLocalGenerating(false);
    }
  }, [buildGenerationPayload, generateAppreciation, selectedStudentIds]);

  const handleGenerate = mode === "individual" ? handleIndividualGeneration : handleBulkGeneration;

  const previewItems: AppreciationPreviewItem[] = useMemo(() => {
    if (previewIds.length === 0) return [];
    return previewIds
      .map((id) => allAppreciations.find((appreciation) => appreciation.id === id))
      .filter((value): value is AppreciationContent => Boolean(value))
      .map((appreciation) => ({
        data: appreciation,
        studentLabel: (appreciation.inputData?.studentName as string) ?? undefined,
        subjectLabel: appreciation.subjectId ? subjectLabelMap.get(appreciation.subjectId) ?? appreciation.subjectId : undefined,
        periodLabel: appreciation.academicPeriodId ? periodLabelMap.get(appreciation.academicPeriodId) ?? appreciation.academicPeriodId : undefined,
        styleLabel: appreciation.styleGuideId ? styleLabelMap.get(appreciation.styleGuideId) ?? appreciation.styleGuideId : undefined,
      }));
  }, [allAppreciations, periodLabelMap, previewIds, styleLabelMap, subjectLabelMap]);

  const handleHistoryFiltersChange = useCallback((nextFilters: AppreciationHistoryFilters) => {
    applyFilters(nextFilters);
  }, [applyFilters]);

  const handleHistoryReset = useCallback(() => {
    clearFilters();
  }, [clearFilters]);

  const handleReuseAppreciation = useCallback((appreciation: AppreciationContent) => {
    setPreviewIds([appreciation.id]);
    setCustomInstructions(
      `Réutiliser l'appréciation validée du ${appreciation.generatedAt ? new Date(appreciation.generatedAt).toLocaleDateString("fr-FR") : "jour"} en l'adaptant au contexte actuel.`,
    );
    setMode("individual");
    setSelectedStudentId(appreciation.studentId);
  }, []);

  if (assignmentsLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-muted-foreground">Chargement...</div>
      </div>
    );
  }

  if (!selectedClassId) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
        <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-muted/50 to-muted/30">
          <Sparkles className="h-8 w-8" />
        </div>
        <div className="mb-3 text-xl font-semibold text-foreground">
          Sélectionnez une classe
        </div>
        <div className="max-w-sm text-center text-sm leading-relaxed">
          Choisissez une classe dans la barre latérale pour commencer la génération d'appréciations.
        </div>
      </div>
    );
  }

  const selectedClass = classes.find((cls) => cls.id === selectedClassId);

  return (
    <div className="flex flex-col min-h-0 -m-4 md:-m-6 h-[calc(100vh-var(--header-height)-1rem)] overflow-hidden">
      {/* Layout principal avec panel latéral */}
      <div className="flex flex-1 min-h-0">
        {/* Panel contexte à gauche - collé au border */}
        <div className="w-80 flex-shrink-0 border-r border-border bg-muted/30 flex flex-col">
          <AppreciationContextPanel
            studentName={selectedStudent?.fullName()}
            subjectLabel={selectedSubjectId ? subjectLabelMap.get(selectedSubjectId) ?? selectedSubjectId : undefined}
            periodLabel={selectedPeriodId ? periodLabelMap.get(selectedPeriodId) ?? selectedPeriodId : undefined}
            sections={contextSections}
            onToggleSection={handleToggleSection}
            loading={styleLoading}
          />
        </div>

        {/* Contenu principal avec sections à hauteur fixe */}
        <div className="flex-1 flex flex-col min-h-0 gap-4">
          {/* Progress bar si génération en cours */}
          {bulkProgress && (
            <Card className="border-primary/20 bg-primary/5 flex-shrink-0">
              <CardContent className="flex items-center justify-between py-4 text-sm">
                <div className="flex items-center gap-3 text-primary">
                  <Target className="h-4 w-4" />
                  Génération en lot – {bulkProgress.current + 1}/{bulkProgress.total} : {bulkProgress.studentName}
                </div>
                <div className="text-muted-foreground">Veuillez patienter…</div>
              </CardContent>
            </Card>
          )}

          {/* Zone de prévisualisation - prend la moitié de l'espace disponible */}
          <div className="flex-1 min-h-0">
            <AppreciationPreviewStack
              items={previewItems}
              isProcessing={generationDisabled}
              onContentChange={async (id, content) => {
                await updateAppreciationContent(id, content);
              }}
              onValidate={async (id) => {
                await validateAppreciation(id);
              }}
              onRegenerate={async (id) => {
                const regenerated = await regenerateAppreciation(id);
                if (regenerated) {
                  setPreviewIds((prev) => [regenerated.id, ...prev.filter((value) => value !== id)]);
                }
              }}
              onFavoriteToggle={async (id) => {
                await toggleFavorite(id);
              }}
              onRemove={async (id) => {
                await deleteAppreciation(id);
                setPreviewIds((prev) => prev.filter((value) => value !== id));
              }}
            />
          </div>

          {/* Zone d'historique - prend l'autre moitié de l'espace disponible */}
          <div className="flex-1 min-h-0">
            <AppreciationHistoryPanel
              items={appreciations}
              students={studentsOptions}
              subjects={subjectOptions}
              periods={periodOptions}
              styles={styleOptions}
              filters={filters}
              onFiltersChange={handleHistoryFiltersChange}
              onResetFilters={handleHistoryReset}
              onReuse={handleReuseAppreciation}
            />
          </div>
        </div>
      </div>

      <AppreciationGenerationBar
        mode={mode}
        onModeChange={setMode}
        studentId={selectedStudentId}
        studentIds={selectedStudentIds}
        onSelectStudent={setSelectedStudentId}
        onToggleStudent={(studentId) => {
          setSelectedStudentIds((prev) =>
            prev.includes(studentId)
              ? prev.filter((id) => id !== studentId)
              : [...prev, studentId],
          );
        }}
        subjectId={selectedSubjectId}
        periodId={selectedPeriodId}
        styleId={selectedStyleId}
        phraseBankId={selectedPhraseBankId}
        instructions={customInstructions}
        onSubjectChange={setSelectedSubjectId}
        onPeriodChange={setSelectedPeriodId}
        onStyleChange={setSelectedStyleId}
        onPhraseBankChange={setSelectedPhraseBankId}
        onInstructionsChange={setCustomInstructions}
        onGenerate={handleGenerate}
        canGenerate={canGenerate}
        isGenerating={generationDisabled}
        students={studentsOptions}
        subjects={subjectOptions}
        periods={periodOptions}
        styles={styleOptions}
        phraseBanks={phraseBankOptions}
        onOpenStyleManager={() => setIsStyleManagerOpen(true)}
        onOpenPhraseBankManager={() => setIsPhraseManagerOpen(true)}
      />

      <Dialog open={isStyleManagerOpen} onOpenChange={setIsStyleManagerOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Gestion des styles d'écriture</DialogTitle>
          </DialogHeader>
          <StyleGuideManagement />
        </DialogContent>
      </Dialog>

      <Dialog open={isPhraseManagerOpen} onOpenChange={setIsPhraseManagerOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Gestion des banques de phrases</DialogTitle>
          </DialogHeader>
          <PhraseBankManagement />
        </DialogContent>
      </Dialog>
    </div>
  );
}
