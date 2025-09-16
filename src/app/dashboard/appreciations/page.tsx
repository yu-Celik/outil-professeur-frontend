"use client";

import { useState } from "react";
import { Badge } from "@/components/atoms/badge";
import { Sparkles, Users } from "lucide-react";
import { useClassSelection } from "@/contexts/class-selection-context";
import { useSetPageTitle } from "@/shared/hooks";
import { AppreciationGenerationBar } from "@/components/organisms/appreciation-generation-bar";
import { AppreciationContextPanel } from "@/components/organisms/appreciation-context-panel";
import { AppreciationPreviewZone } from "@/components/organisms/appreciation-preview-zone";
import { AppreciationHistorySection } from "@/components/organisms/appreciation-history-section";

export default function AppreciationsPage() {
  useSetPageTitle("Appréciations IA");
  const { selectedClassId, classes, assignmentsLoading } = useClassSelection();

  // State for generation parameters
  const [selectedStudentId, setSelectedStudentId] = useState<string>("");
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>("");
  const [selectedPeriodId, setSelectedPeriodId] = useState<string>("");
  const [selectedStyleId, setSelectedStyleId] = useState<string>("standard");
  const [selectedPhraseBankId, setSelectedPhraseBankId] = useState<string>("none");
  const [customInstructions, setCustomInstructions] = useState<string>("");
  const [batchMode, setBatchMode] = useState<boolean>(false);
  const [selectedStudentIds, setSelectedStudentIds] = useState<string[]>([]);

  // State for generated appreciations
  const [generatedAppreciations, setGeneratedAppreciations] = useState<any[]>([]);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);

  // State for view mode
  const [viewMode, setViewMode] = useState<"generation" | "history">("generation");

  const selectedClass = classes.find((c) => c.id === selectedClassId);

  if (assignmentsLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-muted-foreground">Chargement...</div>
      </div>
    );
  }

  if (!selectedClassId) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-muted/50 to-muted/30 flex items-center justify-center mb-6">
          <Sparkles className="h-8 w-8" />
        </div>
        <div className="text-xl font-semibold mb-3 text-foreground">
          Sélectionnez une classe
        </div>
        <div className="text-sm text-center max-w-sm leading-relaxed">
          Choisissez une classe dans la barre latérale pour commencer la génération d'appréciations
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-0 h-[calc(100vh-var(--header-height)-1rem)] overflow-hidden">

      {/* View Mode Toggle */}
      <div className="flex-shrink-0 p-4 border-b bg-muted/20">
        <div className="flex items-center gap-2">
          <Badge
            variant={viewMode === "generation" ? "default" : "outline"}
            className="cursor-pointer"
            onClick={() => setViewMode("generation")}
          >
            Génération
          </Badge>
          <Badge
            variant={viewMode === "history" ? "default" : "outline"}
            className="cursor-pointer"
            onClick={() => setViewMode("history")}
          >
            Historique
          </Badge>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden min-h-0">
        {viewMode === "generation" ? (
          <>
            {/* Context Panel */}
            <div className="w-80 flex-shrink-0 border-r bg-muted/20">
              <AppreciationContextPanel
                selectedStudentId={selectedStudentId}
                selectedSubjectId={selectedSubjectId}
                selectedPeriodId={selectedPeriodId}
                batchMode={batchMode}
                selectedStudentIds={selectedStudentIds}
              />
            </div>

            {/* Preview Zone */}
            <div className="flex-1 flex flex-col min-w-0">
              <AppreciationPreviewZone
                appreciations={generatedAppreciations}
                isGenerating={isGenerating}
                onAppreciationUpdate={(id: string, content: string) => {
                  setGeneratedAppreciations(prev =>
                    prev.map(app => app.id === id ? { ...app, content } : app)
                  );
                }}
                onAppreciationValidate={(id: string) => {
                  // Handle validation logic
                  console.log("Validating appreciation:", id);
                }}
                onRegenerateAppreciation={(id: string) => {
                  // Handle regeneration logic
                  console.log("Regenerating appreciation:", id);
                }}
              />
            </div>
          </>
        ) : (
          /* History Section */
          <div className="flex-1 min-h-0">
            <AppreciationHistorySection
              selectedClassId={selectedClassId}
              onRestoreAppreciation={(appreciation: any) => {
                setViewMode("generation");
                setSelectedStudentId(appreciation.studentId);
                setSelectedSubjectId(appreciation.subjectId || "");
                setSelectedPeriodId(appreciation.academicPeriodId || "");
                setSelectedStyleId(appreciation.styleGuideId);
              }}
            />
          </div>
        )}
      </div>

      {/* Bottom Generation Bar */}
      {viewMode === "generation" && (
        <div className="flex-shrink-0 border-t bg-background">
          <AppreciationGenerationBar
            selectedStudentId={selectedStudentId}
            setSelectedStudentId={setSelectedStudentId}
            selectedSubjectId={selectedSubjectId}
            setSelectedSubjectId={setSelectedSubjectId}
            selectedPeriodId={selectedPeriodId}
            setSelectedPeriodId={setSelectedPeriodId}
            selectedStyleId={selectedStyleId}
            setSelectedStyleId={setSelectedStyleId}
            selectedPhraseBankId={selectedPhraseBankId}
            setSelectedPhraseBankId={setSelectedPhraseBankId}
            customInstructions={customInstructions}
            setCustomInstructions={setCustomInstructions}
            batchMode={batchMode}
            setBatchMode={setBatchMode}
            selectedStudentIds={selectedStudentIds}
            setSelectedStudentIds={setSelectedStudentIds}
            isGenerating={isGenerating}
            onGenerate={async (params) => {
              setIsGenerating(true);
              try {
                // Simulate generation process
                await new Promise(resolve => setTimeout(resolve, 2000));

                // Clean params
                const cleanParams = {
                  ...params,
                  subjectId: params.subjectId === "general" ? undefined : params.subjectId,
                  phraseBankId: params.phraseBankId === "none" ? undefined : params.phraseBankId,
                };

                // Mock generated appreciation
                const newAppreciation = {
                  id: `app-${Date.now()}`,
                  studentId: cleanParams.studentId || cleanParams.studentIds?.[0],
                  content: "Appréciation générée automatiquement...",
                  generatedAt: new Date(),
                  ...cleanParams
                };

                setGeneratedAppreciations(prev => [...prev, newAppreciation]);
              } finally {
                setIsGenerating(false);
              }
            }}
          />
        </div>
      )}
    </div>
  );
}
