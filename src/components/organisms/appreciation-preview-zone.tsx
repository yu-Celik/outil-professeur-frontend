"use client";

import { useState } from "react";
import { Button } from "@/components/atoms/button";
import { Badge } from "@/components/atoms/badge";
import { Textarea } from "@/components/atoms/textarea";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/molecules/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/molecules/alert-dialog";
import {
  User,
  BookOpen,
  Calendar,
  Palette,
  Edit3,
  Check,
  RefreshCw,
  Copy,
  Star,
  Download,
  Trash2,
  Sparkles,
  Save,
  X,
} from "lucide-react";
import { MOCK_STUDENTS } from "@/features/students/mocks";
import { MOCK_SUBJECTS } from "@/features/gestion/mocks";
import { MOCK_ACADEMIC_PERIODS } from "@/features/gestion/mocks";
import { useStyleGuides } from "@/features/appreciations";

interface AppreciationCard {
  id: string;
  studentId: string;
  subjectId?: string;
  periodId?: string;
  styleId: string;
  content: string;
  generatedAt: Date;
  isEditing?: boolean;
  isFavorite?: boolean;
  isValidated?: boolean;
}

interface AppreciationPreviewZoneProps {
  appreciations: AppreciationCard[];
  isGenerating: boolean;
  onAppreciationUpdate: (id: string, content: string) => void;
  onAppreciationValidate: (id: string) => void;
  onRegenerateAppreciation: (id: string) => void;
}

export function AppreciationPreviewZone({
  appreciations,
  isGenerating,
  onAppreciationUpdate,
  onAppreciationValidate,
  onRegenerateAppreciation,
}: AppreciationPreviewZoneProps) {
  const [editingAppreciations, setEditingAppreciations] = useState<Record<string, string>>({});
  const [favorites, setFavorites] = useState<Set<string>>(new Set());

  const { styleGuides } = useStyleGuides("teacher-1");

  const startEditing = (appreciation: AppreciationCard) => {
    setEditingAppreciations(prev => ({
      ...prev,
      [appreciation.id]: appreciation.content
    }));
  };

  const cancelEditing = (appreciationId: string) => {
    setEditingAppreciations(prev => {
      const updated = { ...prev };
      delete updated[appreciationId];
      return updated;
    });
  };

  const saveEditing = (appreciationId: string) => {
    const newContent = editingAppreciations[appreciationId];
    if (newContent) {
      onAppreciationUpdate(appreciationId, newContent);
      cancelEditing(appreciationId);
    }
  };

  const toggleFavorite = (appreciationId: string) => {
    setFavorites(prev => {
      const updated = new Set(prev);
      if (updated.has(appreciationId)) {
        updated.delete(appreciationId);
      } else {
        updated.add(appreciationId);
      }
      return updated;
    });
  };

  const copyToClipboard = (content: string) => {
    navigator.clipboard.writeText(content);
  };

  const getStudent = (studentId: string) => MOCK_STUDENTS.find(s => s.id === studentId);
  const getSubject = (subjectId?: string) => subjectId ? MOCK_SUBJECTS.find(s => s.id === subjectId) : null;
  const getPeriod = (periodId?: string) => periodId ? MOCK_ACADEMIC_PERIODS.find(p => p.id === periodId) : null;
  const getStyle = (styleId: string) => styleGuides.find(s => s.id === styleId);

  if (appreciations.length === 0 && !isGenerating) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-8 text-muted-foreground">
        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-muted/50 to-muted/30 flex items-center justify-center mb-6">
          <Sparkles className="h-10 w-10" />
        </div>
        <h3 className="text-xl font-semibold text-foreground mb-3">
          Prêt pour la génération
        </h3>
        <p className="text-center max-w-md leading-relaxed mb-6">
          Configurez les paramètres dans la barre de génération en bas et cliquez sur "Générer" pour créer des appréciations personnalisées.
        </p>
        <div className="flex flex-col gap-2 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-primary"></div>
            <span>Sélectionnez un ou plusieurs élèves</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-primary"></div>
            <span>Choisissez une matière (optionnel)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-primary"></div>
            <span>Définissez le style d'écriture</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex-shrink-0 p-4 border-b">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            <h3 className="font-semibold">
              Appréciations générées
              {appreciations.length > 0 && (
                <Badge variant="secondary" className="ml-2">
                  {appreciations.length}
                </Badge>
              )}
            </h3>
          </div>

          {appreciations.length > 0 && (
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-1" />
                Exporter tout
              </Button>
              <Button variant="outline" size="sm">
                <Check className="h-4 w-4 mr-1" />
                Valider tout
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {isGenerating && (
          <Card className="mb-4 border-dashed">
            <CardContent className="p-6">
              <div className="flex items-center justify-center gap-3">
                <div className="animate-spin h-6 w-6 border-2 border-primary border-t-transparent rounded-full" />
                <span className="text-lg">Génération en cours...</span>
              </div>
              <p className="text-center text-muted-foreground mt-2">
                L'IA analyse le contexte et génère des appréciations personnalisées
              </p>
            </CardContent>
          </Card>
        )}

        <div className="space-y-4">
          {appreciations.map((appreciation) => {
            const student = getStudent(appreciation.studentId);
            const subject = getSubject(appreciation.subjectId);
            const period = getPeriod(appreciation.periodId);
            const style = getStyle(appreciation.styleId);
            const isEditing = appreciation.id in editingAppreciations;
            const isFavorite = favorites.has(appreciation.id);

            if (!student) return null;

            return (
              <Card key={appreciation.id} className={`transition-all ${
                appreciation.isValidated ? 'border-green-200 bg-green-50/50' : ''
              }`}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      <CardTitle className="text-lg">{student.fullName()}</CardTitle>
                      {appreciation.isValidated && (
                        <Badge variant="default" className="bg-green-600">
                          <Check className="h-3 w-3 mr-1" />
                          Validée
                        </Badge>
                      )}
                    </div>

                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleFavorite(appreciation.id)}
                        className={isFavorite ? 'text-yellow-500' : ''}
                      >
                        <Star className={`h-4 w-4 ${isFavorite ? 'fill-current' : ''}`} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(appreciation.content)}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onRegenerateAppreciation(appreciation.id)}
                      >
                        <RefreshCw className="h-4 w-4" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Supprimer l'appréciation</AlertDialogTitle>
                            <AlertDialogDescription>
                              Êtes-vous sûr de vouloir supprimer cette appréciation pour {student.fullName()} ?
                              Cette action est irréversible.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Annuler</AlertDialogCancel>
                            <AlertDialogAction>Supprimer</AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>

                  {/* Metadata */}
                  <div className="flex flex-wrap gap-2 mt-2">
                    {subject && (
                      <Badge variant="secondary">
                        <BookOpen className="h-3 w-3 mr-1" />
                        {subject.name}
                      </Badge>
                    )}
                    {period && (
                      <Badge variant="secondary">
                        <Calendar className="h-3 w-3 mr-1" />
                        {period.name}
                      </Badge>
                    )}
                    {style && (
                      <Badge variant="outline">
                        <Palette className="h-3 w-3 mr-1" />
                        {style.name}
                      </Badge>
                    )}
                    <Badge variant="outline" className="text-xs">
                      {new Date(appreciation.generatedAt).toLocaleString()}
                    </Badge>
                  </div>
                </CardHeader>

                <CardContent>
                  {isEditing ? (
                    <div className="space-y-3">
                      <Textarea
                        value={editingAppreciations[appreciation.id]}
                        onChange={(e) => setEditingAppreciations(prev => ({
                          ...prev,
                          [appreciation.id]: e.target.value
                        }))}
                        rows={6}
                        className="resize-none"
                      />
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          onClick={() => saveEditing(appreciation.id)}
                        >
                          <Save className="h-4 w-4 mr-1" />
                          Sauvegarder
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => cancelEditing(appreciation.id)}
                        >
                          <X className="h-4 w-4 mr-1" />
                          Annuler
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div className="p-4 bg-muted/30 rounded-lg border-l-4 border-l-primary">
                        <p className="leading-relaxed whitespace-pre-wrap">
                          {appreciation.content}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => startEditing(appreciation)}
                        >
                          <Edit3 className="h-4 w-4 mr-1" />
                          Modifier
                        </Button>
                        {!appreciation.isValidated && (
                          <Button
                            size="sm"
                            onClick={() => onAppreciationValidate(appreciation.id)}
                          >
                            <Check className="h-4 w-4 mr-1" />
                            Valider
                          </Button>
                        )}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}