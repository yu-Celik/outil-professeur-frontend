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
    <div className="max-h-[540px] overflow-y-auto rounded-t-none rounded-b-xl border border-t-0 bg-card/60 p-1">
      <div className="space-y-4 p-3">
        {items.map((item, index) => (
          <div key={item.data.id} className="relative">
            {index > 0 && <Separator className="mb-3" />}
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
      </div>
    </div>
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
    <Card className="shadow-sm border-0">
      <CardHeader className="space-y-2">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="outline" className="capitalize">
            {appreciation.scope === "subject" ? "Discipline" : "Général"}
          </Badge>
          {item.styleLabel && (
            <Badge variant="outline">{item.styleLabel}</Badge>
          )}
          {appreciation.status === "validated" && (
            <Badge variant="secondary" className="flex items-center gap-1">
              <CheckCircle className="h-3.5 w-3.5" />
              Validée
            </Badge>
          )}
          {appreciation.isFavorite && (
            <Badge variant="outline" className="flex items-center gap-1">
              <Star className="h-3.5 w-3.5 fill-primary text-primary" />
              Favori
            </Badge>
          )}
        </div>
        <CardTitle className="text-lg">Prévisualisation IA</CardTitle>
        <CardDescription>
          Ajustez le texte généré avant validation finale. Toutes les modifications sont enregistrées automatiquement.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Textarea
          value={value}
          onChange={(event) => {
            setValue(event.target.value);
            setIsSaved(false);
          }}
          onBlur={handleBlur}
          rows={8}
          className="min-h-[200px]"
          disabled={isProcessing}
        />

        <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground">
          <div className="flex flex-wrap items-center gap-2">
            {item.studentLabel && <Badge variant="secondary">{item.studentLabel}</Badge>}
            {item.subjectLabel && <Badge variant="outline">{item.subjectLabel}</Badge>}
            {item.periodLabel && <Badge variant="outline">{item.periodLabel}</Badge>}
          </div>
          <div className="flex items-center gap-1">
            {isSaved ? "Sauvegardé" : "Modifications non sauvegardées"}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button variant="default" onClick={handleValidate} disabled={isProcessing}>
            <CheckCircle className="mr-2 h-4 w-4" />
            Valider
          </Button>
          <Button variant="outline" onClick={handleRegenerate} disabled={isProcessing}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Régénérer
          </Button>
          <Button variant="outline" onClick={handleCopy} disabled={copyState === "copied"}>
            <Copy className="mr-2 h-4 w-4" />
            {copyState === "copied" ? "Copié" : "Copier"}
          </Button>
          <Button variant={appreciation.isFavorite ? "default" : "outline"} onClick={handleToggleFavorite}>
            <Star className={cn("mr-2 h-4 w-4", appreciation.isFavorite && "fill-current")}
            />
            {appreciation.isFavorite ? "Retirer des favoris" : "Ajouter aux favoris"}
          </Button>
          <Button variant="ghost" onClick={handleRemove} className="ml-auto text-destructive">
            <Trash2 className="mr-2 h-4 w-4" />
            Supprimer
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
