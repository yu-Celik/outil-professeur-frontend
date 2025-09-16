"use client";

import { useState, useMemo } from "react";
import { Badge } from "@/components/atoms/badge";
import { Button } from "@/components/atoms/button";
import { Switch } from "@/components/atoms/switch";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/molecules/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/molecules/collapsible";
import {
  User,
  Users,
  Calendar,
  BookOpen,
  TrendingUp,
  TrendingDown,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  ChevronDown,
  ChevronRight,
  Eye,
  EyeOff,
} from "lucide-react";
import { MOCK_STUDENTS } from "@/features/students/mocks";
import { MOCK_SUBJECTS } from "@/features/gestion/mocks";
import { MOCK_ACADEMIC_PERIODS } from "@/features/gestion/mocks";
import { MOCK_EXAMS, MOCK_STUDENT_EXAM_RESULTS } from "@/features/evaluations/mocks";
import { MOCK_STUDENT_PARTICIPATION } from "@/features/students/mocks";

interface ContextItem {
  key: string;
  label: string;
  enabled: boolean;
  value: any;
  importance: "high" | "medium" | "low";
}

interface AppreciationContextPanelProps {
  selectedStudentId: string;
  selectedSubjectId: string;
  selectedPeriodId: string;
  batchMode: boolean;
  selectedStudentIds: string[];
}

export function AppreciationContextPanel({
  selectedStudentId,
  selectedSubjectId,
  selectedPeriodId,
  batchMode,
  selectedStudentIds,
}: AppreciationContextPanelProps) {
  const [contextSettings, setContextSettings] = useState<Record<string, boolean>>({
    attendance: true,
    participation: true,
    examResults: true,
    homework: true,
    behavior: true,
    strengths: true,
    improvements: true,
    previousAppreciations: false,
  });

  const [sectionsExpanded, setSectionsExpanded] = useState<Record<string, boolean>>({
    general: true,
    academic: true,
    behavioral: true,
    summary: true,
  });

  const students = batchMode
    ? MOCK_STUDENTS.filter(s => selectedStudentIds.includes(s.id))
    : selectedStudentId
    ? [MOCK_STUDENTS.find(s => s.id === selectedStudentId)].filter(Boolean)
    : [];

  const subject = MOCK_SUBJECTS.find(s => s.id === selectedSubjectId);
  const period = MOCK_ACADEMIC_PERIODS.find(p => p.id === selectedPeriodId);

  const contextData = useMemo(() => {
    if (students.length === 0) return null;

    if (batchMode) {
      return generateBatchContext(students, subject, period, contextSettings);
    } else {
      return generateIndividualContext(students[0], subject, period, contextSettings);
    }
  }, [students, subject, period, contextSettings, batchMode]);

  const toggleContextItem = (key: string) => {
    setContextSettings(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const toggleSection = (section: string) => {
    setSectionsExpanded(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  if (students.length === 0) {
    return (
      <div className="p-6 h-full flex flex-col items-center justify-center text-muted-foreground">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-muted/50 to-muted/30 flex items-center justify-center mb-4">
          <User className="h-8 w-8" />
        </div>
        <h3 className="font-semibold text-foreground mb-2">
          Contexte d'élève
        </h3>
        <p className="text-sm text-center max-w-sm leading-relaxed">
          Sélectionnez un élève dans la barre de génération pour voir les informations contextuelles qui seront utilisées par l'IA.
        </p>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b">
        <div className="flex items-center gap-2 mb-3">
          {batchMode ? (
            <Users className="h-5 w-5 text-primary" />
          ) : (
            <User className="h-5 w-5 text-primary" />
          )}
          <h3 className="font-semibold">
            Contexte {batchMode ? `(${students.length} élèves)` : 'élève'}
          </h3>
        </div>

        {/* Quick Context Controls */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span>Données utilisées par l'IA</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                const allEnabled = Object.values(contextSettings).every(Boolean);
                const newState = Object.keys(contextSettings).reduce((acc, key) => {
                  acc[key] = !allEnabled;
                  return acc;
                }, {} as Record<string, boolean>);
                setContextSettings(newState);
              }}
            >
              {Object.values(contextSettings).every(Boolean) ? "Tout désactiver" : "Tout activer"}
            </Button>
          </div>

          <div className="grid grid-cols-2 gap-1 text-xs">
            {Object.entries(contextSettings).map(([key, enabled]) => (
              <button
                key={key}
                onClick={() => toggleContextItem(key)}
                className={`flex items-center gap-1 p-1 rounded transition-colors ${
                  enabled
                    ? 'text-primary bg-primary/10'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {enabled ? <Eye className="h-3 w-3" /> : <EyeOff className="h-3 w-3" />}
                <span className="truncate">
                  {getContextItemLabel(key)}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Context Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {contextData && (
          <>
            {/* General Information */}
            <Collapsible
              open={sectionsExpanded.general}
              onOpenChange={() => toggleSection('general')}
            >
              <CollapsibleTrigger asChild>
                <Button variant="ghost" className="w-full justify-between p-2">
                  <span className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Informations générales
                  </span>
                  {sectionsExpanded.general ? (
                    <ChevronDown className="h-4 w-4" />
                  ) : (
                    <ChevronRight className="h-4 w-4" />
                  )}
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent className="space-y-2">
                <div className="pl-6 space-y-2 text-sm">
                  {batchMode ? (
                    <div>
                      <p><strong>Élèves:</strong> {students.map(s => s?.fullName()).join(', ')}</p>
                    </div>
                  ) : (
                    <div>
                      <p><strong>Élève:</strong> {students[0]?.fullName()}</p>
                      <p><strong>Classe:</strong> {students[0]?.currentClassId}</p>
                    </div>
                  )}
                  <p><strong>Matière:</strong> {subject ? subject.name : 'Appréciation générale'}</p>
                  <p><strong>Période:</strong> {period ? period.name : 'Non spécifiée'}</p>
                </div>
              </CollapsibleContent>
            </Collapsible>

            {/* Academic Performance */}
            <Collapsible
              open={sectionsExpanded.academic}
              onOpenChange={() => toggleSection('academic')}
            >
              <CollapsibleTrigger asChild>
                <Button variant="ghost" className="w-full justify-between p-2">
                  <span className="flex items-center gap-2">
                    <BookOpen className="h-4 w-4" />
                    Performance académique
                  </span>
                  {sectionsExpanded.academic ? (
                    <ChevronDown className="h-4 w-4" />
                  ) : (
                    <ChevronRight className="h-4 w-4" />
                  )}
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent className="space-y-3">
                <div className="pl-6 space-y-3">
                  {contextData.academic.map((item, index) => (
                    <ContextItemDisplay key={index} item={item} />
                  ))}
                </div>
              </CollapsibleContent>
            </Collapsible>

            {/* Behavioral Information */}
            <Collapsible
              open={sectionsExpanded.behavioral}
              onOpenChange={() => toggleSection('behavioral')}
            >
              <CollapsibleTrigger asChild>
                <Button variant="ghost" className="w-full justify-between p-2">
                  <span className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    Comportement et participation
                  </span>
                  {sectionsExpanded.behavioral ? (
                    <ChevronDown className="h-4 w-4" />
                  ) : (
                    <ChevronRight className="h-4 w-4" />
                  )}
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent className="space-y-3">
                <div className="pl-6 space-y-3">
                  {contextData.behavioral.map((item, index) => (
                    <ContextItemDisplay key={index} item={item} />
                  ))}
                </div>
              </CollapsibleContent>
            </Collapsible>

            {/* Summary */}
            <Collapsible
              open={sectionsExpanded.summary}
              onOpenChange={() => toggleSection('summary')}
            >
              <CollapsibleTrigger asChild>
                <Button variant="ghost" className="w-full justify-between p-2">
                  <span className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4" />
                    Résumé pour l'IA
                  </span>
                  {sectionsExpanded.summary ? (
                    <ChevronDown className="h-4 w-4" />
                  ) : (
                    <ChevronRight className="h-4 w-4" />
                  )}
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <div className="pl-6">
                  <Card className="bg-muted/30">
                    <CardContent className="p-3">
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {contextData.summary}
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </CollapsibleContent>
            </Collapsible>
          </>
        )}
      </div>
    </div>
  );
}

function ContextItemDisplay({ item }: { item: ContextItem }) {
  const getIcon = () => {
    switch (item.importance) {
      case "high":
        return <AlertCircle className="h-4 w-4 text-orange-500" />;
      case "medium":
        return <CheckCircle className="h-4 w-4 text-blue-500" />;
      case "low":
        return <Clock className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getBadgeVariant = () => {
    switch (item.importance) {
      case "high":
        return "destructive" as const;
      case "medium":
        return "default" as const;
      case "low":
        return "secondary" as const;
    }
  };

  return (
    <div className={`space-y-1 ${!item.enabled ? 'opacity-50' : ''}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {getIcon()}
          <span className="text-sm font-medium">{item.label}</span>
        </div>
        <Badge variant={getBadgeVariant()} className="text-xs">
          {item.importance}
        </Badge>
      </div>
      <div className="text-xs text-muted-foreground pl-6">
        {formatContextValue(item.value)}
      </div>
    </div>
  );
}

function generateIndividualContext(student: any, subject: any, period: any, settings: Record<string, boolean>) {
  const academic = [];
  const behavioral = [];

  if (settings.examResults) {
    const studentExams = MOCK_STUDENT_EXAM_RESULTS.filter(r => r.studentId === student.id);
    if (studentExams.length > 0) {
      const avgGrade = studentExams.reduce((sum, exam) => sum + exam.grade, 0) / studentExams.length;
      academic.push({
        key: 'examResults',
        label: 'Résultats aux examens',
        enabled: settings.examResults,
        value: `Moyenne: ${avgGrade.toFixed(1)}/20 (${studentExams.length} évaluations)`,
        importance: avgGrade >= 14 ? 'high' : avgGrade >= 10 ? 'medium' : 'low'
      } as ContextItem);
    }
  }

  if (settings.participation) {
    const participations = MOCK_STUDENT_PARTICIPATION.filter(p => p.studentId === student.id);
    if (participations.length > 0) {
      const avgParticipation = participations.reduce((sum, p) => sum + p.participationLevel, 0) / participations.length;
      behavioral.push({
        key: 'participation',
        label: 'Niveau de participation',
        enabled: settings.participation,
        value: `Moyenne: ${avgParticipation.toFixed(1)}/10`,
        importance: avgParticipation >= 7 ? 'high' : avgParticipation >= 4 ? 'medium' : 'low'
      } as ContextItem);
    }
  }

  if (settings.attendance) {
    behavioral.push({
      key: 'attendance',
      label: 'Assiduité',
      enabled: settings.attendance,
      value: 'Présent(e) à 95% des cours',
      importance: 'medium'
    } as ContextItem);
  }

  if (settings.strengths) {
    behavioral.push({
      key: 'strengths',
      label: 'Points forts',
      enabled: settings.strengths,
      value: student.strengths.join(', '),
      importance: 'high'
    } as ContextItem);
  }

  if (settings.improvements) {
    behavioral.push({
      key: 'improvements',
      label: 'Axes d\'amélioration',
      enabled: settings.improvements,
      value: student.improvementAxes.join(', '),
      importance: 'medium'
    } as ContextItem);
  }

  const summary = `${student?.fullName()} montre ${student?.strengths && student.strengths.length > 0 ? 'des points forts en ' + student.strengths[0] : 'un profil équilibré'}. ${student?.improvementAxes && student.improvementAxes.length > 0 ? 'Des améliorations sont possibles en ' + student.improvementAxes[0] + '.' : ''} L'IA utilisera ces informations pour générer une appréciation personnalisée.`;

  return {
    academic,
    behavioral,
    summary
  };
}

function generateBatchContext(students: any[], subject: any, period: any, settings: Record<string, boolean>) {
  const academic = [];
  const behavioral = [];

  // Aggregate data for all students
  if (settings.examResults) {
    const allExams = students.flatMap(student =>
      MOCK_STUDENT_EXAM_RESULTS.filter(r => r.studentId === student.id)
    );
    if (allExams.length > 0) {
      const avgGrade = allExams.reduce((sum, exam) => sum + exam.grade, 0) / allExams.length;
      academic.push({
        key: 'examResults',
        label: 'Résultats aux examens (groupe)',
        enabled: settings.examResults,
        value: `Moyenne du groupe: ${avgGrade.toFixed(1)}/20`,
        importance: 'medium'
      } as ContextItem);
    }
  }

  if (settings.strengths) {
    const allStrengths = students.flatMap(s => s.strengths);
    const strengthCounts = allStrengths.reduce((acc, strength) => {
      acc[strength] = (acc[strength] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    const topStrengths = Object.entries(strengthCounts)
      .sort(([,a], [,b]) => (b as number) - (a as number))
      .slice(0, 3)
      .map(([strength, count]) => `${strength} (${count} élèves)`);

    behavioral.push({
      key: 'strengths',
      label: 'Points forts du groupe',
      enabled: settings.strengths,
      value: topStrengths.join(', '),
      importance: 'high'
    } as ContextItem);
  }

  const summary = `Génération d'appréciations pour ${students.length} élèves. L'IA adaptera chaque appréciation aux spécificités individuelles tout en maintenant une cohérence de style et de format.`;

  return {
    academic,
    behavioral,
    summary
  };
}

function getContextItemLabel(key: string): string {
  const labels = {
    attendance: 'Assiduité',
    participation: 'Participation',
    examResults: 'Examens',
    homework: 'Devoirs',
    behavior: 'Comportement',
    strengths: 'Points forts',
    improvements: 'Améliorations',
    previousAppreciations: 'Historique'
  };
  return labels[key as keyof typeof labels] || key;
}

function formatContextValue(value: any): string {
  if (typeof value === 'string') return value;
  if (Array.isArray(value)) return value.join(', ');
  if (typeof value === 'object') return JSON.stringify(value);
  return String(value);
}