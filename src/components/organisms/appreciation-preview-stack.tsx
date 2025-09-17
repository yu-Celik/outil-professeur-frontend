"use client";

import { useState, useEffect } from "react";
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
import { Separator } from "@/components/atoms/separator";
import {
  CheckCircle,
  Copy,
  RefreshCw,
  Sparkles,
  Star,
  Trash2,
} from "lucide-react";
import type { AppreciationContent } from "@/types/uml-entities";
import { cn } from "@/lib/utils";

export interface AppreciationPreviewItem {
  data: AppreciationContent;
  studentLabel?: string;
  subjectLabel?: string;
  periodLabel?: string;
  styleLabel?: string;
}

export interface AppreciationPreviewStackProps {
  items: AppreciationPreviewItem[];
  isProcessing?: boolean;
  onContentChange: (id: string, content: string) => Promise<void> | void;
  onValidate: (id: string) => Promise<void> | void;
  onRegenerate: (id: string) => Promise<void> | void;
  onFavoriteToggle: (id: string) => Promise<void> | void;
  onRemove: (id: string) => Promise<void> | void;
}

export function AppreciationPreviewStack({
  items,
  isProcessing = false,
  onContentChange,
  onValidate,
  onRegenerate,
  onFavoriteToggle,
  onRemove,
}: AppreciationPreviewStackProps) {
  if (items.length === 0) {
    return (
      <Card className="border-0 rounded-t-none">
        <CardHeader className="text-center">
          <Sparkles className="mx-auto h-10 w-10 text-muted-foreground" />
          <CardTitle>Aucune appréciation à prévisualiser</CardTitle>
          <CardDescription>
            Configurez la génération ci-dessous pour afficher les propositions de l'IA.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <>
      {items.map((item, index) => (
        <div key={item.data.id} className={index > 0 ? "mt-4" : ""}>
          {index > 0 && <Separator className="mb-4" />}
          <EditableAppreciationCard
            item={item}
            isProcessing={isProcessing}
            onContentChange={onContentChange}
            onValidate={onValidate}
            onRegenerate={onRegenerate}
            onFavoriteToggle={onFavoriteToggle}
            onRemove={onRemove}
          />
        </div>
      ))}
    </>
  );
}

interface EditableCardProps {
  item: AppreciationPreviewItem;
  isProcessing: boolean;
  onContentChange: (id: string, content: string) => Promise<void> | void;
  onValidate: (id: string) => Promise<void> | void;
  onRegenerate: (id: string) => Promise<void> | void;
  onFavoriteToggle: (id: string) => Promise<void> | void;
  onRemove: (id: string) => Promise<void> | void;
}

function EditableAppreciationCard({
  item,
  isProcessing,
  onContentChange,
  onValidate,
  onRegenerate,
  onFavoriteToggle,
  onRemove,
}: EditableCardProps) {
  const appreciation = item.data;
  const [value, setValue] = useState(appreciation.content);
  const [isSaved, setIsSaved] = useState(true);
  const [copyState, setCopyState] = useState<"idle" | "copied">("idle");

  useEffect(() => {
    setValue(appreciation.content);
    setIsSaved(true);
  }, [appreciation.content, appreciation.id]);

  const handleBlur = async () => {
    if (!isSaved && value.trim() !== appreciation.content.trim()) {
      await onContentChange(appreciation.id, value);
      setIsSaved(true);
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopyState("copied");
      setTimeout(() => setCopyState("idle"), 1500);
    } catch (error) {
      console.error("Clipboard copy failed", error);
    }
  };

  const handleValidate = async () => {
    await onValidate(appreciation.id);
  };

  const handleRegenerate = async () => {
    await onRegenerate(appreciation.id);
  };

  const handleToggleFavorite = async () => {
    await onFavoriteToggle(appreciation.id);
  };

  const handleRemove = async () => {
    await onRemove(appreciation.id);
  };

  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CardTitle className="text-sm">Prévisualisation IA</CardTitle>
            {item.studentLabel && <Badge variant="secondary" className="text-xs">{item.studentLabel}</Badge>}
          </div>
          <div className="flex items-center gap-2">
            {appreciation.status === "validated" && (
              <CheckCircle className="h-4 w-4 text-emerald-500" />
            )}
            {appreciation.isFavorite && (
              <Star className="h-4 w-4 fill-amber-500 text-amber-500" />
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        <Textarea
          value={value}
          onChange={(event) => {
            setValue(event.target.value);
            setIsSaved(false);
          }}
          onBlur={handleBlur}
          rows={6}
          className="min-h-[150px] text-sm"
          disabled={isProcessing}
        />

        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            {item.styleLabel && <span>{item.styleLabel}</span>}
            {item.subjectLabel && <span>• {item.subjectLabel}</span>}
          </div>
          <span>{isSaved ? "Sauvegardé" : "Non sauvegardé"}</span>
        </div>

        <div className="flex items-center gap-2">
          <Button size="sm" onClick={handleValidate} disabled={isProcessing}>
            <CheckCircle className="mr-1.5 h-3.5 w-3.5" />
            Valider
          </Button>
          <Button size="sm" variant="outline" onClick={handleRegenerate} disabled={isProcessing}>
            <RefreshCw className="mr-1.5 h-3.5 w-3.5" />
            Régénérer
          </Button>
          <Button size="sm" variant="outline" onClick={handleCopy} disabled={copyState === "copied"}>
            <Copy className="mr-1.5 h-3.5 w-3.5" />
            {copyState === "copied" ? "Copié" : "Copier"}
          </Button>
          <Button size="sm" variant="outline" onClick={handleToggleFavorite}>
            <Star className={cn("mr-1.5 h-3.5 w-3.5", appreciation.isFavorite && "fill-current")} />
            Favori
          </Button>
          <Button size="sm" variant="ghost" onClick={handleRemove} className="ml-auto text-destructive">
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
