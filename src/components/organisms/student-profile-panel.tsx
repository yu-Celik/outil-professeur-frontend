"use client";

import {
  Activity,
  ArrowRight,
  Award,
  BookOpen,
  Calendar,
  Clock,
  Edit,
  Eye,
  GraduationCap,
  Lightbulb,
  MessageSquare,
  Save,
  Star,
  Target,
  Trophy,
  User,
  X,
} from "lucide-react";
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/atoms/avatar";
import { Badge } from "@/components/atoms/badge";
import { Button } from "@/components/atoms/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/atoms/tabs";
import { Card, CardContent, CardHeader } from "@/components/molecules/card";
import { getCompletedSessionsForTeacher } from "@/features/sessions/mocks";
import { getStudentParticipation } from "@/features/students/mocks";
import { getSubjectById } from "@/features/gestion/mocks";
import { getTimeSlotById } from "@/features/calendar/mocks";
import { useExamManagement } from "@/features/evaluations";
import { useTeachingAssignments } from "@/features/gestion";
import { EditableResultDisplay } from "@/components/molecules/editable-result-display";
import { getStudentExamResults, getExamById as getExamByIdMock } from "@/features/evaluations/mocks";
import { StudentAnalysisPanel } from "@/components/organisms/student-analysis-panel";
import type { Student } from "@/types/uml-entities";

interface StudentProfilePanelProps {
  student: Student;
  teacherId: string;
  academicPeriodId?: string;
  onClose: () => void;
  onSessionClick: (sessionId: string) => void;
}

export function StudentProfilePanel({
  student,
  teacherId,
  academicPeriodId = "period-1", // Période par défaut
  onClose,
  onSessionClick,
}: StudentProfilePanelProps) {
  const [isEditing, setIsEditing] = useState(false);
  
  // Hook pour gérer les examens
  const { getExamById } = useExamManagement(teacherId);

  // Hook pour les autorisations d'édition
  const { rights } = useTeachingAssignments();

  // Récupérer l'historique des sessions de cet élève
  const allSessions = getCompletedSessionsForTeacher(teacherId);
  const studentSessions = allSessions.filter(
    (session) => session.classId === student.currentClassId,
  );

  const getParticipationSummary = () => {
    let totalSessions = 0;
    let presentSessions = 0;
    let totalParticipation = 0;
    let evaluatedSessions = 0;

    studentSessions.forEach((session) => {
      const participation = getStudentParticipation(student.id, session.id);
      if (participation) {
        totalSessions++;
        if (participation.isPresent) {
          presentSessions++;
        }
        if (participation.participationLevel > 0) {
          totalParticipation += participation.participationLevel;
          evaluatedSessions++;
        }
      }
    });

    return {
      totalSessions,
      presentSessions,
      attendanceRate:
        totalSessions > 0
          ? Math.round((presentSessions / totalSessions) * 100)
          : 0,
      averageParticipation:
        evaluatedSessions > 0
          ? Math.round(totalParticipation / evaluatedSessions)
          : 0,
    };
  };

  const stats = getParticipationSummary();
  
  // Récupérer les résultats d'examens de cet élève
  const studentExamResults = getStudentExamResults(student.id);
  
  // Calculer les statistiques d'examens
  const getExamStatistics = () => {
    if (studentExamResults.length === 0) {
      return {
        totalExams: 0,
        completedExams: 0,
        averageGrade: 0,
        passRate: 0,
      };
    }
    
    const completedResults = studentExamResults.filter(result => !result.isAbsent);
    const totalGrade = completedResults.reduce((sum, result) => sum + result.grade, 0);
    const averageGrade = completedResults.length > 0 ? totalGrade / completedResults.length : 0;
    
    return {
      totalExams: studentExamResults.length,
      completedExams: completedResults.length,
      averageGrade: Math.round(averageGrade * 100) / 100,
      passRate: completedResults.length > 0 
        ? Math.round((completedResults.filter(result => result.grade >= 10).length / completedResults.length) * 100)
        : 0,
    };
  };
  
  const examStats = getExamStatistics();

  // Handler pour sauvegarder les modifications de notes
  const handleGradeSave = (resultData: any) => {
    // TODO: Implement actual save logic to backend
    console.log("Saving grade data:", resultData);
    // For now, just log the save operation
  };

  return (
    <div className="flex-1 border-l border-border bg-gradient-to-b from-background/95 to-muted/30 flex flex-col min-h-0">
      {/* En-tête du profil */}
      <div className="p-6 border-b border-border/50 bg-background/80 backdrop-blur-sm flex-shrink-0">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-4">
            <Avatar className="h-16 w-16 ring-4 ring-primary/20">
              <AvatarImage src="" />
              <AvatarFallback className="bg-primary/10 text-primary text-lg font-bold">
                {student.firstName.charAt(0)}
                {student.lastName.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="text-xl font-bold text-foreground">
                {student.firstName} {student.lastName}
              </h3>
              <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                <GraduationCap className="h-4 w-4" />
                <span>Classe actuelle</span>
              </div>
              <div className="flex items-center gap-2 mt-2">
                <Badge variant="outline" className="text-xs">
                  {stats.attendanceRate}% présence
                </Badge>
                <Badge variant="secondary" className="text-xs">
                  {stats.averageParticipation}/10 participation
                </Badge>
              </div>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Onglets et contenu */}
      <div className="flex-1 min-h-0 p-6">
        <Tabs defaultValue="profile" className="h-full flex flex-col">
          <TabsList className="flex-shrink-0 mb-4">
            <TabsTrigger value="profile" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              Profil
            </TabsTrigger>
            <TabsTrigger value="participations" className="flex items-center gap-2">
              <Activity className="h-4 w-4" />
              Participations
            </TabsTrigger>
            <TabsTrigger value="results" className="flex items-center gap-2">
              <Trophy className="h-4 w-4" />
              Résultats
            </TabsTrigger>
          </TabsList>

          {/* Onglet Profil */}
          <TabsContent value="profile" className="flex-1 min-h-0 overflow-y-auto space-y-6">

        {/* Profil pédagogique */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Target className="h-4 w-4 text-primary" />
                <h4 className="font-semibold">Profil pédagogique</h4>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsEditing(!isEditing)}
                className="text-xs"
              >
                {isEditing ? (
                  <Save className="h-3 w-3" />
                ) : (
                  <Edit className="h-3 w-3" />
                )}
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Besoins */}
            <div>
              <label className="text-sm font-medium text-foreground mb-2 flex items-center gap-2">
                <MessageSquare className="h-3 w-3" />
                Besoins spécifiques
              </label>
              {isEditing ? (
                <textarea
                  className="w-full p-2 text-xs border border-border rounded-md bg-background"
                  rows={3}
                  defaultValue={student.needs?.join(", ") || ""}
                  placeholder="Décrivez les besoins spécifiques..."
                />
              ) : (
                <div className="text-xs text-muted-foreground p-2 bg-muted/30 rounded-md">
                  {student.needs?.length
                    ? student.needs.join(", ")
                    : "Aucun besoin spécifique identifié"}
                </div>
              )}
            </div>

            {/* Points forts */}
            <div>
              <label className="text-sm font-medium text-foreground mb-2 flex items-center gap-2">
                <Award className="h-3 w-3 text-success" />
                Points forts
              </label>
              {isEditing ? (
                <textarea
                  className="w-full p-2 text-xs border border-border rounded-md bg-background"
                  rows={3}
                  defaultValue={student.strengths?.join(", ") || ""}
                  placeholder="Listez les points forts..."
                />
              ) : (
                <div className="text-xs text-muted-foreground p-2 bg-success/5 rounded-md">
                  {student.strengths?.length
                    ? student.strengths.join(", ")
                    : "Points forts à identifier"}
                </div>
              )}
            </div>

            {/* Observations */}
            <div>
              <label className="text-sm font-medium text-foreground mb-2 flex items-center gap-2">
                <Eye className="h-3 w-3" />
                Observations générales
              </label>
              {isEditing ? (
                <textarea
                  className="w-full p-2 text-xs border border-border rounded-md bg-background"
                  rows={4}
                  defaultValue={student.observations?.join("; ") || ""}
                  placeholder="Notez vos observations..."
                />
              ) : (
                <div className="text-xs text-muted-foreground p-2 bg-muted/30 rounded-md">
                  {student.observations?.length
                    ? student.observations.join("; ")
                    : "Aucune observation particulière"}
                </div>
              )}
            </div>

            {/* Axes d'amélioration */}
            <div>
              <label className="text-sm font-medium text-foreground mb-2 flex items-center gap-2">
                <Lightbulb className="h-3 w-3 text-warning" />
                Axes d'amélioration
              </label>
              {isEditing ? (
                <textarea
                  className="w-full p-2 text-xs border border-border rounded-md bg-background"
                  rows={3}
                  defaultValue={student.improvementAxes?.join(", ") || ""}
                  placeholder="Identifiez les axes d'amélioration..."
                />
              ) : (
                <div className="text-xs text-muted-foreground p-2 bg-warning/5 rounded-md">
                  {student.improvementAxes?.length
                    ? student.improvementAxes.join(", ")
                    : "Axes d'amélioration à définir"}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Section Analyse Automatique */}
        <StudentAnalysisPanel
          student={student}
          academicPeriodId={academicPeriodId}
          className="mt-6"
        />

          </TabsContent>

          {/* Onglet Participations */}
          <TabsContent value="participations" className="flex-1 min-h-0 overflow-y-auto space-y-6">
            {/* Statistiques rapides */}
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <Activity className="h-4 w-4 text-primary" />
                  <h4 className="font-semibold">Statistiques de participation</h4>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-primary/5 rounded-lg">
                    <div className="text-2xl font-bold text-primary">
                      {stats.totalSessions}
                    </div>
                    <div className="text-xs text-muted-foreground">Sessions</div>
                  </div>
                  <div className="text-center p-3 bg-success/10 rounded-lg">
                    <div className="text-2xl font-bold text-success">
                      {stats.presentSessions}
                    </div>
                    <div className="text-xs text-muted-foreground">Présences</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Historique des sessions */}
            <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-primary" />
              <h4 className="font-semibold">Historique des sessions</h4>
              <Badge variant="outline" className="text-xs">
                {studentSessions.length} session
                {studentSessions.length > 1 ? "s" : ""}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {studentSessions.slice(0, 10).map((session) => {
                const participation = getStudentParticipation(
                  student.id,
                  session.id,
                );
                const subject = getSubjectById(session.subjectId);
                const timeSlot = getTimeSlotById(session.timeSlotId);

                return (
                  <div
                    key={session.id}
                    className="group p-3 bg-muted/20 hover:bg-muted/40 rounded-lg transition-all duration-200 cursor-pointer"
                    onClick={() => onSessionClick(session.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <BookOpen className="h-3 w-3 text-primary" />
                          <span className="text-sm font-medium text-foreground truncate">
                            {subject?.name || "Matière"}
                          </span>
                          <ArrowRight className="h-3 w-3 text-muted-foreground group-hover:text-primary transition-colors" />
                        </div>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Calendar className="h-3 w-3" />
                          <span>
                            {new Date(session.sessionDate).toLocaleDateString(
                              "fr-FR",
                            )}
                          </span>
                          <Clock className="h-3 w-3" />
                          <span>{timeSlot?.startTime || "Horaire"}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {participation?.isPresent ? (
                          <Badge
                            variant="default"
                            className="text-xs bg-success text-success-foreground"
                          >
                            Présent
                          </Badge>
                        ) : (
                          <Badge variant="destructive" className="text-xs">
                            Absent
                          </Badge>
                        )}
                        {participation &&
                          participation.participationLevel > 0 && (
                            <div className="flex items-center gap-1">
                              <Star className="h-3 w-3 text-warning" />
                              <span className="text-xs font-medium">
                                {participation.participationLevel}/10
                              </span>
                            </div>
                          )}
                      </div>
                    </div>
                  </div>
                );
              })}

              {studentSessions.length === 0 && (
                <div className="text-center py-6 text-muted-foreground">
                  <Calendar className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">Aucune session enregistrée</p>
                </div>
              )}

              {studentSessions.length > 10 && (
                <div className="text-center pt-2">
                  <Button variant="ghost" size="sm" className="text-xs">
                    Voir plus...
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
          </TabsContent>

          {/* Onglet Résultats */}
          <TabsContent value="results" className="flex-1 min-h-0 overflow-y-auto space-y-6">
            {/* Statistiques d'examens */}
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <Trophy className="h-4 w-4 text-primary" />
                  <h4 className="font-semibold">Statistiques d'évaluations</h4>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-primary/5 rounded-lg">
                    <div className="text-2xl font-bold text-primary">
                      {examStats.totalExams}
                    </div>
                    <div className="text-xs text-muted-foreground">Évaluations</div>
                  </div>
                  <div className="text-center p-3 bg-success/10 rounded-lg">
                    <div className="text-2xl font-bold text-success">
                      {examStats.averageGrade}/20
                    </div>
                    <div className="text-xs text-muted-foreground">Moyenne</div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-warning/10 rounded-lg">
                    <div className="text-2xl font-bold text-warning">
                      {examStats.completedExams}
                    </div>
                    <div className="text-xs text-muted-foreground">Rendues</div>
                  </div>
                  <div className="text-center p-3 bg-success/10 rounded-lg">
                    <div className="text-2xl font-bold text-success">
                      {examStats.passRate}%
                    </div>
                    <div className="text-xs text-muted-foreground">Réussite</div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Liste des résultats */}
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4 text-primary" />
                  <h4 className="font-semibold">Historique des évaluations</h4>
                  <Badge variant="outline" className="text-xs">
                    {studentExamResults.length} évaluation{studentExamResults.length > 1 ? 's' : ''}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                {studentExamResults.length > 0 ? (
                  <div className="space-y-3 max-h-80 overflow-y-auto">
                    {studentExamResults.map((result) => {
                      const exam = getExamByIdMock(result.examId);
                      const subject = exam ? getSubjectById(exam.subjectId) : null;

                      if (!exam) return null;

                      return (
                        <EditableResultDisplay
                          key={result.id}
                          result={result}
                          exam={exam}
                          student={student}
                          subject={subject || undefined}
                          // TODO: Récupérer les évaluations détaillées par grille depuis les données sauvegardées
                          rubricEvaluations={{}}
                          className="mb-3"
                          canEdit={rights.canEditStudentData(student.id, student.currentClassId)}
                          onSave={handleGradeSave}
                        />
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <Trophy className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p className="text-sm font-medium mb-2">Aucune évaluation</p>
                    <p className="text-xs">
                      Aucun résultat d'évaluation pour cet élève
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}