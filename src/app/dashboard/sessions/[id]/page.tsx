"use client";

import {
  AlertCircle,
  BarChart3,
  BookOpen,
  Calendar,
  CheckCircle,
  Clock,
  FileText,
  Home,
  Play,
  Settings,
  Target,
  User,
  Users,
} from "lucide-react";
import Link from "next/link";
import { use, useState, useEffect } from "react";
import { Avatar, AvatarFallback } from "@/components/atoms/avatar";
import { Badge } from "@/components/atoms/badge";
import { Button } from "@/components/atoms/button";
import { GradeDisplay } from "@/components/atoms/grade-display";
import { AuthorizationGuard } from "@/components/molecules/authorization-guard";
import { Card, CardContent, CardHeader } from "@/components/molecules/card";
import { useTeachingAssignments } from "@/hooks/use-teaching-assignments";
import {
  resolveSessionById,
  isDynamicSessionId,
} from "@/utils/session-resolver";
import {
  getSubjectById,
  getClassById,
  getTimeSlotById,
  getStudentsByClass,
} from "@/data";
import type {
  CourseSession,
  Student,
  StudentParticipation,
} from "@/types/uml-entities";

interface SessionPageProps {
  params: Promise<{ id: string }>;
}

export default function SessionPage({ params }: SessionPageProps) {
  const { id } = use(params);
  const { rights, loading: rightsLoading } = useTeachingAssignments();

  // État pour la session dynamique
  const [courseSession, setCourseSession] = useState<CourseSession | null>(
    null,
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Résoudre la session dynamiquement au chargement
  useEffect(() => {
    const loadSession = async () => {
      setLoading(true);
      setError(null);

      try {
        if (isDynamicSessionId(id)) {
          // Résoudre depuis le système de génération dynamique
          const resolvedSession = resolveSessionById(id);
          if (resolvedSession) {
            setCourseSession(resolvedSession);
          } else {
            setError("Session non trouvée dans le système de génération");
          }
        } else {
          // Fallback pour les anciennes sessions mock (si nécessaire)
          setError("Format d'ID de session non reconnu");
        }
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Erreur lors du chargement de la session",
        );
      } finally {
        setLoading(false);
      }
    };

    loadSession();
  }, [id]);

  // État de chargement
  if (loading || rightsLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Chargement de la session...</p>
        </div>
      </div>
    );
  }

  // Gestion des erreurs
  if (error || !courseSession) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <Card className="w-96">
          <CardContent className="p-6 text-center">
            <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Session non trouvée</h3>
            <p className="text-muted-foreground mb-4">
              {error || "Cette session n'existe pas ou n'est plus disponible."}
            </p>
            <Button asChild variant="outline">
              <Link href="/dashboard/calendrier">Retour au calendrier</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Récupérer les données liées à la session
  const subject = getSubjectById(courseSession.subjectId);
  const timeSlot = getTimeSlotById(courseSession.timeSlotId);
  const classEntity = getClassById(courseSession.classId);
  const students = classEntity ? getStudentsByClass(classEntity.id) : [];

  // Vérifier que toutes les données sont disponibles
  if (!subject || !timeSlot || !classEntity) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <Card className="w-96">
          <CardContent className="p-6 text-center">
            <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Données manquantes</h3>
            <p className="text-muted-foreground mb-4">
              Les données liées à cette session (matière, créneau, classe) sont
              introuvables.
            </p>
            <Button asChild variant="outline">
              <Link href="/dashboard/calendrier">Retour au calendrier</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Note: timeSlot, classEntity, et students sont maintenant récupérés dynamiquement plus haut

  // Étudiants avec leurs participations (basé sur les données dynamiques)
  const sessionStudents = students.map((student) => ({
    ...student,
    participation: {
      id: `participation-${student.id}`,
      createdBy: courseSession.createdBy,
      courseSessionId: id,
      studentId: student.id,
      isPresent: true,
      behavior: "Attentif",
      participationLevel: 15,
      specificRemarks: "",
      technicalIssues: "",
      cameraEnabled: true,
      markedAt: new Date(),
      markAttendance: (_isPresent: boolean) => {},
      setParticipationLevel: (_level: number) => {},
      addRemarks: (_remarks: string) => {},
      updateBehavior: (_behavior: string) => {},
    } as StudentParticipation,
  }));

  // Les données sont maintenant récupérées dynamiquement

  /* TEMPORAIRE : Anciennes données commentées
      firstName: "Pierre",
      lastName: "Collin",
      currentClassId: "class-2nde-jaspe",
      needs: ["Améliorer la concentration"],
      observations: ["Élève attentif"],
      strengths: ["Bon en calcul"],
      improvementAxes: ["Participation orale"],
      createdAt: new Date("2025-09-01"),
      updatedAt: new Date(),
      fullName: () => "Pierre Collin",
      attendanceRate: (start, end) => 0.89,
      participationAverage: (start, end) => 16.8,
      participation: {
        id: "participation-1",
        createdBy: "KsmNtVf4zwqO3VV3SQJqPrRlQBA1fFyR",
        courseSessionId: id,
        studentId: "student-1",
        isPresent: true,
        behavior: "Attentif,Participatif",
        participationLevel: 18,
        specificRemarks: "Excellente compréhension",
        technicalIssues: "",
        cameraEnabled: true,
        markedAt: new Date("2025-02-18T16:45:00"),
        markAttendance: (isPresent: boolean) => {},
        setParticipationLevel: (level: number) => {},
        addRemarks: (remarks: string) => {},
        updateBehavior: (behavior: string) => {},
      },
    },
    {
      id: "student-2",
      createdBy: "KsmNtVf4zwqO3VV3SQJqPrRlQBA1fFyR",
      firstName: "Marie",
      lastName: "Vasseur",
      currentClassId: "class-2nde-jaspe",
      needs: ["Renforcer confiance"],
      observations: ["Travailleuse"],
      strengths: ["Méthodique"],
      improvementAxes: ["Expression orale"],
      createdAt: new Date("2025-09-01"),
      updatedAt: new Date(),
      fullName: () => "Marie Vasseur",
      attendanceRate: (start, end) => 0.92,
      participationAverage: (start, end) => 15.2,
      participation: {
        id: "participation-2",
        createdBy: "KsmNtVf4zwqO3VV3SQJqPrRlQBA1fFyR",
        courseSessionId: id,
        studentId: "student-2",
        isPresent: true,
        behavior: "Attentif,Timide",
        participationLevel: 15,
        specificRemarks: "Bonne méthode, manque de confiance",
        technicalIssues: "",
        cameraEnabled: true,
        markedAt: new Date("2025-02-18T16:40:00"),
        markAttendance: (isPresent: boolean) => {},
        setParticipationLevel: (level: number) => {},
        addRemarks: (remarks: string) => {},
        updateBehavior: (behavior: string) => {},
      },
    },
    {
      id: "student-3",
      createdBy: "KsmNtVf4zwqO3VV3SQJqPrRlQBA1fFyR",
      firstName: "Julien",
      lastName: "Hamon",
      currentClassId: "class-2nde-jaspe",
      needs: ["Canaliser énergie"],
      observations: ["Très actif"],
      strengths: ["Créatif", "Rapide"],
      improvementAxes: ["Patience", "Méthodologie"],
      createdAt: new Date("2025-09-01"),
      updatedAt: new Date(),
      fullName: () => "Julien Hamon",
      attendanceRate: (start, end) => 0.85,
      participationAverage: (start, end) => 17.5,
      participation: {
        id: "participation-3",
        createdBy: "KsmNtVf4zwqO3VV3SQJqPrRlQBA1fFyR",
        courseSessionId: id,
        studentId: "student-3",
        isPresent: true,
        behavior: "Participatif,Perturbateur",
        participationLevel: 20,
        specificRemarks: "Très impliqué mais parfois distrait les autres",
        technicalIssues: "",
        cameraEnabled: true,
        markedAt: new Date("2025-02-18T16:35:00"),
        markAttendance: (isPresent: boolean) => {},
        setParticipationLevel: (level: number) => {},
        addRemarks: (remarks: string) => {},
        updateBehavior: (behavior: string) => {},
      },
    },
    // Étudiants non encore évalués
    {
      id: "student-4",
      createdBy: "KsmNtVf4zwqO3VV3SQJqPrRlQBA1fFyR",
      firstName: "Aurélie",
      lastName: "Benoit",
      currentClassId: "class-2nde-jaspe",
      needs: [],
      observations: [],
      strengths: [],
      improvementAxes: [],
      createdAt: new Date("2025-09-01"),
      updatedAt: new Date(),
      fullName: () => "Aurélie Benoit",
      attendanceRate: (start, end) => 0.88,
      participationAverage: (start, end) => 14.2,
    },
    // Étudiant absent
    {
      id: "student-5",
      createdBy: "KsmNtVf4zwqO3VV3SQJqPrRlQBA1fFyR",
      firstName: "David",
      lastName: "Lefevre",
      currentClassId: "class-2nde-jaspe",
      needs: [],
      observations: [],
      strengths: [],
      improvementAxes: [],
      createdAt: new Date("2025-09-01"),
      updatedAt: new Date(),
      fullName: () => "David Lefevre",
      attendanceRate: (start, end) => 0.75,
      participationAverage: (start, end) => 13.8,
      participation: {
        id: "participation-5",
        createdBy: "KsmNtVf4zwqO3VV3SQJqPrRlQBA1fFyR",
        courseSessionId: id,
        studentId: "student-5",
        isPresent: false,
        behavior: "",
        participationLevel: 0,
        specificRemarks: "Absent non justifié",
        technicalIssues: "",
        cameraEnabled: false,
        markedAt: new Date("2025-02-18T16:00:00"),
        markAttendance: (isPresent: boolean) => {},
        setParticipationLevel: (level: number) => {},
        addRemarks: (remarks: string) => {},
        updateBehavior: (behavior: string) => {},
      },
    },
  ]; // FIN DU COMMENTAIRE */

  // Calculs basés sur les entités UML
  const presentStudents = sessionStudents.filter(
    (s) => s.participation?.isPresent !== false,
  );
  const evaluatedStudents = sessionStudents.filter(
    (s) => s.participation?.isPresent === true,
  );
  const averageParticipation =
    evaluatedStudents.length > 0
      ? evaluatedStudents.reduce(
          (sum, s) => sum + (s.participation?.participationLevel || 0),
          0,
        ) / evaluatedStudents.length
      : 0;

  const getStatusBadge = (
    student: Student & { participation?: StudentParticipation },
  ) => {
    if (student.participation?.isPresent === false) {
      return (
        <Badge variant="destructive" className="text-xs">
          Absent
        </Badge>
      );
    }
    if (student.participation?.isPresent === true) {
      return (
        <Badge className="text-xs bg-chart-3/10 text-chart-3 border-chart-3/20">
          Évalué
        </Badge>
      );
    }
    return (
      <Badge
        variant="outline"
        className="text-xs text-chart-4 bg-chart-4/10 border-chart-4/20"
      >
        À évaluer
      </Badge>
    );
  };

  const formatSessionDate = () => {
    return courseSession.sessionDate.toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "2-digit",
    });
  };

  const formatTimeRange = () => {
    return `${timeSlot.startTime} - ${timeSlot.endTime}`;
  };

  const getRemainingTime = () => {
    const now = new Date();
    const endTime = new Date(courseSession.sessionDate);
    const [endHour, endMinute] = timeSlot.endTime.split(":").map(Number);
    endTime.setHours(endHour, endMinute, 0);

    const diff = endTime.getTime() - now.getTime();
    if (diff <= 0) return "Terminé";

    const minutes = Math.floor(diff / (1000 * 60));
    return `${minutes} min restantes`;
  };

  if (rightsLoading) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="text-center">
          <div className="text-lg font-medium">
            Vérification des autorisations...
          </div>
          <div className="text-sm text-muted-foreground mt-2">
            Chargement en cours
          </div>
        </div>
      </div>
    );
  }

  return (
    <AuthorizationGuard
      hasPermission={
        rights.canAccessSubject(courseSession.subjectId) &&
        rights.canManageClass(courseSession.classId)
      }
      fallbackMessage="Accès non autorisé à cette session"
      requiredRole="Enseignant de la matière"
    >
      <div className="space-y-6">
        {/* Header de session basé sur CourseSession + Subject + TimeSlot */}
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-xl bg-primary/10 flex items-center justify-center">
              <BookOpen className="h-8 w-8 text-primary" />
            </div>

            <div>
              <div className="flex items-center gap-2 mb-1">
                <h1 className="text-3xl font-bold text-foreground">
                  {courseSession.objectives}
                </h1>
                <Badge
                  variant={
                    courseSession.status === "active" ? "default" : "secondary"
                  }
                  className={
                    courseSession.status === "active"
                      ? "bg-chart-3/10 text-chart-3 border-chart-3/20"
                      : ""
                  }
                >
                  {courseSession.status === "active"
                    ? "En cours"
                    : courseSession.status === "upcoming"
                      ? "À venir"
                      : "Terminé"}
                </Badge>
              </div>
              <p className="text-lg text-muted-foreground">
                {subject.name} • Classe {classEntity.classCode}
              </p>
              <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  {formatSessionDate()} • {formatTimeRange()}
                </span>
                <span className="flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  {sessionStudents.length} élèves
                </span>
                <span className="flex items-center gap-1">
                  <Home className="h-4 w-4" />
                  {courseSession.room}
                </span>
              </div>
            </div>
          </div>

          <div className="flex gap-2">
            <Button variant="outline" className="gap-2">
              <BarChart3 className="h-4 w-4" />
              Statistiques
            </Button>
            <Button variant="outline" className="gap-2">
              <Settings className="h-4 w-4" />
              Paramètres
            </Button>
            {courseSession.status === "upcoming" && (
              <Button
                className="gap-2 bg-chart-3 hover:bg-chart-3/90"
                onClick={() =>
                  setCourseSession((prev) =>
                    prev ? { ...prev, status: "active" } : null,
                  )
                }
              >
                <Play className="h-4 w-4" />
                Démarrer session
              </Button>
            )}
          </div>
        </div>

        {/* Métriques calculées à partir des entités UML */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <Users className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium">Présents</span>
              </div>
              <div className="text-2xl font-bold">
                {presentStudents.length}/{sessionStudents.length}
              </div>
              <p className="text-xs text-muted-foreground">
                {Math.round(
                  (presentStudents.length / sessionStudents.length) * 100,
                )}
                % de présence
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium">Évaluations</span>
              </div>
              <div className="text-2xl font-bold">
                {evaluatedStudents.length}/{presentStudents.length}
              </div>
              <p className="text-xs text-muted-foreground">
                {presentStudents.length > 0
                  ? Math.round(
                      (evaluatedStudents.length / presentStudents.length) * 100,
                    )
                  : 0}
                % terminées
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <BarChart3 className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium">Participation moy.</span>
              </div>
              <div className="text-2xl font-bold">
                {averageParticipation.toFixed(1)}/20
              </div>
              <p className="text-xs text-muted-foreground">
                Sur {evaluatedStudents.length} évalués
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium">Temps</span>
              </div>
              <div className="text-2xl font-bold">
                {timeSlot.durationMinutes}min
              </div>
              <p className="text-xs text-muted-foreground">
                {getRemainingTime()}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Objectifs et contenu de session (UML: CourseSession) */}
        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Target className="h-5 w-5 text-primary" />
                <h3 className="text-lg font-semibold">
                  Objectifs de la session
                </h3>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                {courseSession.objectives}
              </p>
              <div className="text-sm">
                <p>
                  <strong>Contenu :</strong> {courseSession.content}
                </p>
                {courseSession.homeworkAssigned && (
                  <p className="mt-2">
                    <strong>Devoirs assignés :</strong>{" "}
                    {courseSession.homeworkAssigned}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                <h3 className="text-lg font-semibold">Résumé</h3>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                {subject.name} - {courseSession.objectives}
              </p>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Matière :</span>
                  <span className="font-medium">
                    {subject.name} ({subject.code})
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Créneau :</span>
                  <span className="font-medium">{timeSlot.name}</span>
                </div>
                <div className="flex justify-between">
                  <span>Présences prises :</span>
                  <span className="font-medium">
                    {courseSession.attendanceTaken ? "Oui" : "Non"}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Liste des étudiants avec leurs participations UML */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold">
                  Étudiants de la session
                </h2>
                <p className="text-sm text-muted-foreground">
                  Cliquez sur un étudiant pour l'évaluer - Classe{" "}
                  {classEntity.classCode}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="gap-1">
                  <CheckCircle className="h-3 w-3 text-chart-3" />
                  {evaluatedStudents.length} évalués
                </Badge>
                <Badge variant="outline" className="gap-1">
                  <AlertCircle className="h-3 w-3 text-chart-4" />
                  {presentStudents.length - evaluatedStudents.length} en attente
                </Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3">
              {sessionStudents.map((student) => (
                <div
                  key={student.id}
                  className={`flex items-center justify-between p-4 border rounded-lg transition-colors hover:bg-muted/50 ${
                    !student.participation?.isPresent &&
                    student.participation?.isPresent !== undefined
                      ? "border-destructive/20 bg-destructive/10"
                      : student.participation?.isPresent === undefined
                        ? "border-chart-4/20 bg-chart-4/10"
                        : ""
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <Avatar className="h-10 w-10 ring-2 ring-primary/10">
                      <AvatarFallback className="bg-primary/10 text-primary font-medium">
                        {student.firstName[0]}
                        {student.lastName[0]}
                      </AvatarFallback>
                    </Avatar>

                    <div className="flex-1">
                      <div className="font-semibold">{student.fullName()}</div>
                      <div className="flex items-center gap-3 text-sm text-muted-foreground">
                        {student.participation?.isPresent && (
                          <>
                            <span>
                              Participation:{" "}
                              <GradeDisplay
                                value={student.participation.participationLevel}
                              />
                            </span>
                            <span>
                              Évalué le{" "}
                              {student.participation.markedAt.toLocaleTimeString(
                                "fr-FR",
                                {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                },
                              )}
                            </span>
                          </>
                        )}
                        {student.participation?.specificRemarks && (
                          <span className="italic">
                            "{student.participation.specificRemarks}"
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    {getStatusBadge(student)}

                    {student.participation?.isPresent !== false &&
                      rights.canEvaluateStudent(
                        student.id,
                        courseSession.subjectId,
                        courseSession.classId,
                      ) && (
                        <Link
                          href={`/dashboard/students/${student.id}?session=${courseSession.id}`}
                        >
                          <Button
                            variant={
                              !student.participation ? "default" : "ghost"
                            }
                            size="sm"
                            className="gap-2"
                          >
                            <User className="h-4 w-4" />
                            {!student.participation ? "Évaluer" : "Modifier"}
                          </Button>
                        </Link>
                      )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Actions de session basées sur les méthodes UML */}
        {courseSession.status === "active" && (
          <Card className="border-primary/20 bg-primary/5">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold mb-2">
                    Actions de session
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {presentStudents.length - evaluatedStudents.length === 0
                      ? "Tous les élèves présents ont été évalués. Vous pouvez finaliser la session."
                      : `Il reste ${presentStudents.length - evaluatedStudents.length} élève(s) à évaluer.`}
                  </p>
                </div>

                <div className="flex gap-2">
                  {!courseSession.attendanceTaken && (
                    <Button
                      variant="outline"
                      onClick={courseSession.takeAttendance}
                      className="gap-2"
                    >
                      <CheckCircle className="h-4 w-4" />
                      Finaliser présences
                    </Button>
                  )}

                  <Button
                    size="lg"
                    disabled={
                      presentStudents.length - evaluatedStudents.length > 0 ||
                      !rights.canCreateSession(
                        courseSession.classId,
                        courseSession.subjectId,
                      )
                    }
                    className="gap-2"
                    onClick={() =>
                      setCourseSession((prev) =>
                        prev ? { ...prev, status: "completed" } : null,
                      )
                    }
                  >
                    <CheckCircle className="h-5 w-5" />
                    Terminer la session
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </AuthorizationGuard>
  );
}
