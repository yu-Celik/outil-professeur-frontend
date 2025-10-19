"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Button } from "@/components/atoms/button";
import { Textarea } from "@/components/atoms/textarea";
import { Badge } from "@/components/atoms/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/molecules/card";
import {
  CheckCircle,
  RotateCcw,
  Save,
  Edit3,
  FileText,
  Sparkles,
} from "lucide-react";

export interface AppreciationEditorCardProps {
  content: string;
  originalContent: string;
  studentName?: string;
  subjectLabel?: string;
  periodLabel?: string;
  isValidated: boolean;
  isModified: boolean;
  isSaving?: boolean;
  onContentChange: (content: string) => void;
  onValidate: () => Promise<void> | void;
  onReset: () => void;
  autoSaveDelay?: number;
}

function countWords(text: string): number {
  return text
    .trim()
    .split(/\s+/)
    .filter((word) => word.length > 0).length;
}

export function AppreciationEditorCard({
  content,
  originalContent,
  studentName,
  subjectLabel,
  periodLabel,
  isValidated,
  isModified,
  isSaving = false,
  onContentChange,
  onValidate,
  onReset,
  autoSaveDelay = 10000,
}: AppreciationEditorCardProps) {
  const [localContent, setLocalContent] = useState(content);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const autoSaveTimerRef = useRef<NodeJS.Timeout | null>(null);
  const hasUnsavedChanges = useRef(false);

  // Update local content when prop changes (e.g., after save or reset)
  useEffect(() => {
    setLocalContent(content);
    hasUnsavedChanges.current = false;
  }, [content]);

  // Auto-save logic
  useEffect(() => {
    if (hasUnsavedChanges.current && !isSaving) {
      // Clear existing timer
      if (autoSaveTimerRef.current) {
        clearTimeout(autoSaveTimerRef.current);
      }

      // Set new timer
      autoSaveTimerRef.current = setTimeout(() => {
        if (localContent !== content) {
          onContentChange(localContent);
          setLastSaved(new Date());
          hasUnsavedChanges.current = false;
        }
      }, autoSaveDelay);
    }

    return () => {
      if (autoSaveTimerRef.current) {
        clearTimeout(autoSaveTimerRef.current);
      }
    };
  }, [localContent, content, autoSaveDelay, onContentChange, isSaving]);

  const handleChange = useCallback(
    (event: React.ChangeEvent<HTMLTextAreaElement>) => {
      const newContent = event.target.value;
      setLocalContent(newContent);
      hasUnsavedChanges.current = true;
    },
    [],
  );

  const handleManualSave = useCallback(() => {
    if (localContent !== content) {
      onContentChange(localContent);
      setLastSaved(new Date());
      hasUnsavedChanges.current = false;
    }
  }, [localContent, content, onContentChange]);

  const handleReset = useCallback(() => {
    setLocalContent(originalContent);
    onReset();
    hasUnsavedChanges.current = false;
    if (autoSaveTimerRef.current) {
      clearTimeout(autoSaveTimerRef.current);
    }
  }, [originalContent, onReset]);

  const charCount = localContent.length;
  const wordCount = countWords(localContent);

  return (
    <Card className="shadow-sm border-t-none">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-primary" />
            <CardTitle className="text-sm">Rapport généré</CardTitle>
            {studentName && (
              <Badge variant="secondary" className="text-xs">
                {studentName}
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-2">
            {isValidated && (
              <Badge variant="default" className="gap-1">
                <CheckCircle className="h-3 w-3" />
                Validé
              </Badge>
            )}
            {isModified && !isValidated && (
              <Badge variant="outline" className="gap-1 text-amber-600">
                <Edit3 className="h-3 w-3" />
                Modifié
              </Badge>
            )}
          </div>
        </div>
        {(subjectLabel || periodLabel) && (
          <CardDescription className="text-xs">
            {subjectLabel && <span>{subjectLabel}</span>}
            {subjectLabel && periodLabel && <span> • </span>}
            {periodLabel && <span>{periodLabel}</span>}
          </CardDescription>
        )}
      </CardHeader>

      <CardContent className="space-y-3">
        <Textarea
          value={localContent}
          onChange={handleChange}
          rows={8}
          className="min-h-[200px] text-sm font-normal resize-y"
          disabled={isSaving}
          placeholder="Le contenu du rapport apparaîtra ici..."
        />

        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
              <FileText className="h-3 w-3" />
              <span>
                {charCount} caractères • {wordCount} mots
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {isSaving && (
              <span className="text-amber-600 flex items-center gap-1">
                <Save className="h-3 w-3 animate-pulse" />
                Sauvegarde...
              </span>
            )}
            {!isSaving && lastSaved && (
              <span>Sauvegardé à {lastSaved.toLocaleTimeString("fr-FR")}</span>
            )}
            {!isSaving && !lastSaved && hasUnsavedChanges.current && (
              <span className="text-amber-600">
                Modifications non sauvegardées
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            size="sm"
            onClick={onValidate}
            disabled={isSaving || isValidated}
            className="gap-1.5"
          >
            <CheckCircle className="h-3.5 w-3.5" />
            {isValidated ? "Validé" : "Valider"}
          </Button>

          {isModified && (
            <Button
              size="sm"
              variant="outline"
              onClick={handleReset}
              disabled={isSaving}
              className="gap-1.5"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              Réinitialiser
            </Button>
          )}

          {hasUnsavedChanges.current && (
            <Button
              size="sm"
              variant="outline"
              onClick={handleManualSave}
              disabled={isSaving}
              className="gap-1.5 ml-auto"
            >
              <Save className="h-3.5 w-3.5" />
              Sauvegarder maintenant
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
