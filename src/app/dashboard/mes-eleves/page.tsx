"use client";

import {
  BookOpen,
  ChevronRight,
  GraduationCap,
  Users,
  X,
  Calendar,
  Clock,
  TrendingUp,
  Star,
  Eye,
  Edit,
  Save,
  MessageSquare,
  Award,
  Target,
  Activity,
  Lightbulb,
  ArrowRight,
} from "lucide-react";
import { useState, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/atoms/avatar";
import { Button } from "@/components/atoms/button";
import { Badge } from "@/components/atoms/badge";
import { Card, CardContent, CardHeader } from "@/components/molecules/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/molecules/select";
import { useUserSession } from "@/hooks/use-user-session";
import { useTeachingAssignments } from "@/hooks/use-teaching-assignments";
import { useClassColors } from "@/hooks/use-class-colors";
import { getStudentsByClass } from "@/data/mock-students";
import { getCompletedSessionsForTeacher } from "@/data/mock-completed-sessions";
import { getStudentParticipation } from "@/data/mock-student-participation";
import { getSubjectById } from "@/data/mock-subjects";
import { getTimeSlotById } from "@/data/mock-time-slots";
import type { Student, Class, CourseSession } from "@/types/uml-entities";

interface StudentProfilePanelProps {
  student: Student;
  onClose: () => void;
  onSessionClick: (sessionId: string) => void;
}

function StudentProfilePanel({ student, onClose, onSessionClick }: StudentProfilePanelProps) {
  const [isEditing, setIsEditing] = useState(false);

  // Récupérer l'historique des sessions de cet élève
  const allSessions = getCompletedSessionsForTeacher("KsmNtVf4zwqO3VV3SQJqPrRlQBA1fFyR");
  const studentSessions = allSessions.filter(session => session.classId === student.currentClassId);

  const getParticipationSummary = () => {
    let totalSessions = 0;
    let presentSessions = 0;
    let totalParticipation = 0;
    let evaluatedSessions = 0;

    studentSessions.forEach(session => {
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
      attendanceRate: totalSessions > 0 ? Math.round((presentSessions / totalSessions) * 100) : 0,
      averageParticipation: evaluatedSessions > 0 ? Math.round(totalParticipation / evaluatedSessions) : 0,
    };
  };

  const stats = getParticipationSummary();

  return (
    <div className="w-96 border-l border-border bg-gradient-to-b from-background/95 to-muted/30 flex flex-col h-full overflow-hidden">
      {/* En-tête du profil */}
      <div className="p-6 border-b border-border/50 bg-background/80 backdrop-blur-sm flex-shrink-0">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-4">
            <Avatar className="h-16 w-16 ring-4 ring-primary/20">
              <AvatarImage src="" />
              <AvatarFallback className="bg-primary/10 text-primary text-lg font-bold">
                {student.firstName.charAt(0)}{student.lastName.charAt(0)}
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

      {/* Contenu scrollable */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* Statistiques rapides */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <Activity className="h-4 w-4 text-primary" />
              <h4 className="font-semibold">Statistiques</h4>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-3 bg-primary/5 rounded-lg">
                <div className="text-2xl font-bold text-primary">{stats.totalSessions}</div>
                <div className="text-xs text-muted-foreground">Sessions</div>
              </div>
              <div className="text-center p-3 bg-success/10 rounded-lg">
                <div className="text-2xl font-bold text-success">{stats.presentSessions}</div>
                <div className="text-xs text-muted-foreground">Présences</div>
              </div>
            </div>
          </CardContent>
        </Card>

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
                {isEditing ? <Save className="h-3 w-3" /> : <Edit className="h-3 w-3" />}
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
                  {student.needs?.length ? student.needs.join(", ") : "Aucun besoin spécifique identifié"}
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
                  {student.strengths?.length ? student.strengths.join(", ") : "Points forts à identifier"}
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
                  {student.observations?.length ? student.observations.join("; ") : "Aucune observation particulière"}
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
                  {student.improvementAxes?.length ? student.improvementAxes.join(", ") : "Axes d'amélioration à définir"}
                </div>
              )}
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
                {studentSessions.length} session{studentSessions.length > 1 ? 's' : ''}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {studentSessions.slice(0, 10).map((session) => {
                const participation = getStudentParticipation(student.id, session.id);
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
                            {subject?.name || 'Matière'}
                          </span>
                          <ArrowRight className="h-3 w-3 text-muted-foreground group-hover:text-primary transition-colors" />
                        </div>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Calendar className="h-3 w-3" />
                          <span>
                            {new Date(session.sessionDate).toLocaleDateString('fr-FR')}
                          </span>
                          <Clock className="h-3 w-3" />
                          <span>{timeSlot?.startTime || 'Horaire'}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {participation?.isPresent ? (
                          <Badge variant="default" className="text-xs bg-success text-success-foreground">
                            Présent
                          </Badge>
                        ) : (
                          <Badge variant="destructive" className="text-xs">
                            Absent
                          </Badge>
                        )}
                        {participation && participation.participationLevel > 0 && (
                          <div className="flex items-center gap-1">
                            <Star className="h-3 w-3 text-warning" />
                            <span className="text-xs font-medium">{participation.participationLevel}/10</span>
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
      </div>
    </div>
  );
}

export default function MesElevesPage() {
  const { user } = useUserSession();
  const teacherId = user?.id || "KsmNtVf4zwqO3VV3SQJqPrRlQBA1fFyR";
  const { assignments } = useTeachingAssignments(teacherId);
  const { getClassColorWithText } = useClassColors(teacherId, "year-2025");

  const [selectedClassId, setSelectedClassId] = useState<string | null>(null);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

  // Récupérer les classes uniques depuis TeachingAssignments (respect UML)
  const uniqueClasses = assignments ? assignments.reduce<Array<{id: string} & any>>((acc, assignment) => {
    // Éviter les doublons basés sur classId
    if (!acc.some(cls => cls.id === assignment.classId)) {
      acc.push({
        id: assignment.classId,
        ...assignment.class
      });
    }
    return acc;
  }, []) : [];

  // Récupérer les étudiants de la classe sélectionnée
  const studentsForClass = selectedClassId 
    ? getStudentsByClass(selectedClassId) 
    : [];

  const handleClassClick = (classId: string) => {
    setSelectedClassId(classId);
    setSelectedStudent(null); // Fermer le panneau étudiant
  };

  const handleStudentClick = (student: Student) => {
    setSelectedStudent(student);
  };

  const handleCloseStudentProfile = () => {
    setSelectedStudent(null);
  };

  const handleSessionClick = (sessionId: string) => {
    // Navigation vers la page sessions unifiée avec accordéon auto-ouvert
    window.location.href = `/dashboard/sessions?sessionId=${sessionId}`;
  };

  return (
    <div className="flex flex-col min-h-0 -m-4 md:-m-6 h-[calc(100vh-var(--header-height)-1rem)] overflow-hidden">
      {/* En-tête optimisé */}
      <div className="p-4 border-b border-border/50 flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10">
            <Users className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground">Mes élèves</h1>
            <p className="text-muted-foreground text-sm">
              Profils et historique de vos élèves
            </p>
          </div>
        </div>
      </div>

      {/* Layout principal à 3 colonnes */}
      <div className="flex flex-1 min-h-0">
        {/* Sidebar des classes (colonne 1) */}
        <div className="w-64 border-r border-border/50 bg-gradient-to-b from-muted/30 to-muted/10 flex flex-col">
          <div className="px-6 py-4 flex-shrink-0 border-b border-border/30">
            <div className="flex items-center gap-2 mb-1">
              <GraduationCap className="h-4 w-4 text-primary" />
              <h3 className="font-semibold text-sm text-foreground">Mes Classes</h3>
            </div>
            <p className="text-xs text-muted-foreground">
              {uniqueClasses.length} classe{uniqueClasses.length > 1 ? "s" : ""} au total
            </p>
          </div>
          <div className="flex-1 p-4 overflow-y-auto min-h-0">
            <div className="space-y-2">
              {uniqueClasses.map((classData) => {
                const studentCount = getStudentsByClass(classData.id).length;
                const classColors = getClassColorWithText(classData.id);
                const isSelected = selectedClassId === classData.id;

                return (
                  <Button
                    key={classData.id}
                    variant={isSelected ? "default" : "ghost"}
                    className={`w-full justify-start text-left h-auto p-4 transition-all duration-200 ${
                      isSelected
                        ? "bg-primary text-primary-foreground shadow-sm"
                        : "hover:bg-background/60 hover:shadow-sm"
                    }`}
                    onClick={() => handleClassClick(classData.id)}
                  >
                    <div className="flex items-center gap-3 w-full">
                      <div
                        className="w-8 h-8 rounded-lg flex items-center justify-center"
                        style={{
                          backgroundColor: isSelected
                            ? classColors.backgroundColor
                            : `${classColors.backgroundColor}20`,
                        }}
                      >
                        <span
                          className="text-xs font-medium"
                          style={{
                            color: isSelected
                              ? classColors.color
                              : classColors.backgroundColor,
                          }}
                        >
                          {classData.classCode?.charAt(0) || 'C'}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium truncate">
                          {classData.classCode} - {classData.gradeLabel}
                        </div>
                        <div
                          className={`text-xs mt-1 flex items-center gap-1 ${
                            isSelected
                              ? "text-primary-foreground/70"
                              : "text-muted-foreground"
                          }`}
                        >
                          <Users className="h-3 w-3" />
                          {studentCount} élève{studentCount > 1 ? "s" : ""}
                        </div>
                      </div>
                    </div>
                  </Button>
                );
              })}

              {uniqueClasses.length === 0 && (
                <div className="text-center py-8">
                  <div className="w-12 h-12 rounded-full bg-muted/50 flex items-center justify-center mx-auto mb-3">
                    <GraduationCap className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <p className="text-sm text-muted-foreground mb-1 font-medium">
                    Aucune classe
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Classes non disponibles
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Zone d'affichage des élèves (colonne 2) */}
        <div className={`flex-1 flex flex-col min-w-0 bg-gradient-to-b from-background/50 to-background transition-all duration-300 ${
          selectedStudent ? 'max-w-md' : ''
        }`}>
          {selectedClassId && (
            <div className="px-6 py-4 border-b border-border/50 bg-background/80 backdrop-blur-sm flex-shrink-0">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Users className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-base">
                      {uniqueClasses.find((c) => c.id === selectedClassId)?.classCode} - {uniqueClasses.find((c) => c.id === selectedClassId)?.gradeLabel}
                    </h3>
                  </div>
                </div>
                <Badge variant="outline">
                  {studentsForClass.length} élève{studentsForClass.length > 1 ? 's' : ''}
                </Badge>
              </div>
            </div>
          )}

          <div className="flex-1 overflow-y-auto min-h-0 p-4">
            {!selectedClassId ? (
              <div className="flex flex-col items-center justify-center h-full text-muted-foreground p-8">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-muted/50 to-muted/30 flex items-center justify-center mb-6">
                  <ChevronRight className="h-8 w-8" />
                </div>
                <div className="text-xl font-semibold mb-3 text-foreground">
                  Aucune classe sélectionnée
                </div>
                <div className="text-sm text-center max-w-sm leading-relaxed">
                  Sélectionnez une classe dans la liste de gauche pour consulter les élèves
                </div>
              </div>
            ) : studentsForClass.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-muted-foreground p-8">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center mb-6">
                  <Users className="h-8 w-8 text-primary" />
                </div>
                <div className="text-xl font-semibold mb-3 text-foreground">
                  Classe vide
                </div>
                <div className="text-sm text-center max-w-sm leading-relaxed mb-4">
                  Cette classe ne contient aucun élève pour le moment
                </div>
              </div>
            ) : (
              <div className="grid gap-3">
                {studentsForClass.map((student) => (
                  <div
                    key={student.id}
                    className={`group relative border rounded-xl p-4 transition-all duration-200 cursor-pointer ${
                      selectedStudent?.id === student.id
                        ? "bg-primary/10 border-primary/30 shadow-md"
                        : "bg-background/60 border-border/50 hover:bg-background hover:shadow-md hover:border-border"
                    }`}
                    onClick={() => handleStudentClick(student)}
                  >
                    <div className="flex items-center justify-between w-full">
                      <div className="flex items-center gap-4">
                        <Avatar className="h-12 w-12 ring-2 ring-primary/10">
                          <AvatarImage src="" />
                          <AvatarFallback className="bg-primary/10 text-primary font-medium">
                            {student.firstName.charAt(0)}{student.lastName.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-semibold text-foreground">
                            {student.firstName} {student.lastName}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            ID: {student.id}
                          </div>
                        </div>
                      </div>
                      <ChevronRight className={`h-4 w-4 transition-colors ${
                        selectedStudent?.id === student.id 
                          ? "text-primary" 
                          : "text-muted-foreground group-hover:text-foreground"
                      }`} />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Panneau latéral de profil étudiant (colonne 3) */}
        {selectedStudent && (
          <StudentProfilePanel
            student={selectedStudent}
            onClose={handleCloseStudentProfile}
            onSessionClick={handleSessionClick}
          />
        )}
      </div>
    </div>
  );
}