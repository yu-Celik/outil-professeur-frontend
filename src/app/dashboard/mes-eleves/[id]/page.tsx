"use client";

import {
  AlertTriangle,
  BarChart3,
  BookOpen,
  Calendar,
  CheckCircle,
  Eye,
  FileText,
  MessageSquare,
  Target,
  TrendingUp,
} from "lucide-react";
import Link from "next/link";
import { use, useEffect, useMemo, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/atoms/avatar";
import { Badge } from "@/components/atoms/badge";
import { Button } from "@/components/atoms/button";
import { GradeDisplay } from "@/components/atoms/grade-display";
import { AuthorizationGuard } from "@/components/molecules/authorization-guard";
import { Card, CardContent, CardHeader } from "@/components/molecules/card";
import { useNotationSystem } from "@/hooks/use-notation-system";
import { useTeachingAssignments } from "@/hooks/use-teaching-assignments";
import type {
  AcademicPeriod,
  SchoolYear,
  Student,
  StudentProfile,
} from "@/types/uml-entities";

interface StudentProfilePageProps {
  params: Promise<{ id: string }>;
}

export default function StudentProfilePage({
  params,
}: StudentProfilePageProps) {
  const { id } = use(params);
  const { rights, loading: rightsLoading } = useTeachingAssignments();
  useNotationSystem();

  // Mock data basé sur les entités UML
  const [student, _setStudent] = useState<Student>({
    id,
    createdBy: "KsmNtVf4zwqO3VV3SQJqPrRlQBA1fFyR",
    firstName: "Pierre",
    lastName: "Collin",
    currentClassId: "class-b1",
    needs: ["Améliorer la concentration", "Renforcer la confiance en soi"],
    observations: [
      "Élève attentif mais timide",
      "Excellente compréhension des concepts",
    ],
    strengths: ["Bon en calcul mental", "Analyse logique", "Travail autonome"],
    improvementAxes: [
      "Participation orale",
      "Expression écrite",
      "Gestion du temps",
    ],
    createdAt: new Date("2025-09-01"),
    updatedAt: new Date(),
    fullName: () => "Pierre Collin",
    attendanceRate: (_start: Date, _end: Date) => 0.89,
    participationAverage: (_start: Date, _end: Date) => 16.8,
  });

  const [currentProfile, setCurrentProfile] = useState<StudentProfile | null>(
    null,
  );
  const [schoolYear, _setSchoolYear] = useState<SchoolYear>({
    id: "year-2025",
    createdBy: "admin-1",
    name: "2025-2025",
    startDate: new Date("2025-09-01"),
    endDate: new Date("2025-06-30"),
    isActive: true,
    createdAt: new Date("2025-08-15"),
    updatedAt: new Date(),
    createPeriod: (_name: string, _start: Date, _end: Date, _order: number) =>
      ({}) as AcademicPeriod,
  });

  const [currentPeriod, _setCurrentPeriod] = useState<AcademicPeriod>({
    id: "period-1",
    createdBy: "admin-1",
    schoolYearId: "year-2025",
    name: "Premier trimestre",
    order: 1,
    startDate: new Date("2025-09-01"),
    endDate: new Date("2025-12-20"),
    isActive: true,
    createdAt: new Date("2025-08-15"),
    updatedAt: new Date(),
    contains: (date: Date) =>
      date >= new Date("2025-09-01") && date <= new Date("2025-12-20"),
  });

  // Mock participations récentes basées sur StudentParticipation UML
  const recentParticipations = useMemo(
    () => [
      {
        id: "participation-1",
        courseSessionId: "session-1",
        subject: "Mathématiques",
        date: "18/02",
        time: "16h00 - 17h00",
        isPresent: true,
        participationLevel: 18,
        behavior: "Attentif,Participatif",
        specificRemarks: "Excellente compréhension des équations",
        technicalIssues: "",
        markedAt: new Date("2025-02-18T17:00:00"),
      },
      {
        id: "participation-2",
        courseSessionId: "session-2",
        subject: "Français",
        date: "16/02",
        time: "14h00 - 15h30",
        isPresent: true,
        participationLevel: 15,
        behavior: "Timide",
        specificRemarks: "A du mal à s'exprimer à l'oral",
        technicalIssues: "",
        markedAt: new Date("2025-02-16T15:30:00"),
      },
      {
        id: "participation-3",
        courseSessionId: "session-3",
        subject: "Sciences",
        date: "14/02",
        time: "10h00 - 11h30",
        isPresent: false,
        participationLevel: 0,
        behavior: "",
        specificRemarks: "Absent justifié",
        technicalIssues: "",
        markedAt: new Date("2025-02-14T10:00:00"),
      },
    ],
    [],
  );

  // Génération du profil étudiant (UML: StudentProfile.generate())
  useEffect(() => {
    const generateProfile = () => {
      const presentParticipations = recentParticipations.filter(
        (p) => p.isPresent,
      );
      const averageParticipation =
        presentParticipations.length > 0
          ? presentParticipations.reduce(
              (sum, p) => sum + p.participationLevel,
              0,
            ) / presentParticipations.length
          : 0;

      const attendanceRate =
        recentParticipations.length > 0
          ? (recentParticipations.filter((p) => p.isPresent).length /
              recentParticipations.length) *
            100
          : 0;

      const behaviorAnalysis = presentParticipations
        .flatMap((p) => p.behavior.split(",").filter((b) => b.trim()))
        .reduce(
          (acc, behavior) => {
            acc[behavior] = (acc[behavior] || 0) + 1;
            return acc;
          },
          {} as Record<string, number>,
        );

      const profile: StudentProfile = {
        id: `profile-${student.id}-${currentPeriod.id}`,
        createdBy: "KsmNtVf4zwqO3VV3SQJqPrRlQBA1fFyR",
        studentId: student.id,
        academicPeriodId: currentPeriod.id,
        features: {
          averageParticipation: averageParticipation.toFixed(1),
          attendanceRate: attendanceRate.toFixed(1),
          dominantBehaviors: Object.entries(behaviorAnalysis)
            .sort(([, a], [, b]) => b - a)
            .slice(0, 3)
            .map(([behavior]) => behavior),
          strengths: student.strengths,
          improvementAxes: student.improvementAxes,
          needs: student.needs,
          observations: student.observations,
        },
        evidenceRefs: {
          participations: recentParticipations.map((p) => p.id),
          sessions: recentParticipations.map((p) => p.courseSessionId),
          subjects: [...new Set(recentParticipations.map((p) => p.subject))],
        },
        status: "active",
        generatedAt: new Date(),
        updatedAt: new Date(),
        review: (notes: string) => console.log("Profile reviewed:", notes),
      };

      setCurrentProfile(profile);
    };

    generateProfile();
  }, [student, currentPeriod, recentParticipations]);

  const getBehaviorBadge = (behavior: string) => {
    const colorMap: Record<string, string> = {
      Attentif: "bg-chart-3/10 text-chart-3 border-chart-3/20",
      Participatif: "bg-chart-1/10 text-chart-1 border-chart-1/20",
      Timide: "bg-chart-5/10 text-chart-5 border-chart-5/20",
      Perturbateur: "bg-destructive/10 text-destructive border-destructive/20",
    };

    return (
      <Badge
        variant="outline"
        className={`text-xs ${colorMap[behavior] || "bg-muted/50 text-muted-foreground border-border"}`}
      >
        {behavior}
      </Badge>
    );
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
      hasPermission={rights.canViewStudentProfile(
        student.id,
        student.currentClassId,
      )}
      fallbackMessage="Accès non autorisé au profil étudiant"
      requiredRole="Enseignant de la classe"
    >
      <div className="space-y-6">
        {/* Header profil étudiant avec données UML */}
        <div className="flex items-start gap-6">
          <Avatar className="w-24 h-24 border-4 border-primary/10">
            <AvatarImage src="" />
            <AvatarFallback className="bg-primary/10 text-primary text-2xl font-semibold">
              {student.firstName[0]}
              {student.lastName[0]}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-3xl font-bold text-foreground">
                  {student.fullName()}
                </h1>
                <div className="flex items-center gap-4 text-muted-foreground">
                  <p className="text-lg">Classe B1 • {schoolYear.name}</p>
                  <Badge variant="outline">{currentPeriod.name}</Badge>
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="gap-2"
                  disabled={
                    !rights.canViewStudentProfile(
                      student.id,
                      student.currentClassId,
                    )
                  }
                >
                  <MessageSquare className="h-4 w-4" />
                  Contacter
                </Button>
                <Button
                  variant="outline"
                  className="gap-2"
                  disabled={
                    !rights.canEditStudentData(
                      student.id,
                      student.currentClassId,
                    )
                  }
                >
                  <FileText className="h-4 w-4" />
                  Générer rapport
                </Button>
              </div>
            </div>

            {/* Métriques calculées du profil UML */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="h-4 w-4 text-primary" />
                    <span className="text-sm font-medium">
                      Participation moyenne
                    </span>
                  </div>
                  <div className="text-2xl font-bold">
                    <GradeDisplay
                      value={parseFloat(
                        String(
                          currentProfile?.features.averageParticipation || "0",
                        ),
                      )}
                      variant="large"
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Basée sur{" "}
                    {recentParticipations.filter((p) => p.isPresent).length}{" "}
                    sessions
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Calendar className="h-4 w-4 text-primary" />
                    <span className="text-sm font-medium">Présence</span>
                  </div>
                  <div className="text-2xl font-bold">
                    {String(currentProfile?.features.attendanceRate || "0")}%
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {recentParticipations.filter((p) => p.isPresent).length}/
                    {recentParticipations.length} cours présent
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <BookOpen className="h-4 w-4 text-primary" />
                    <span className="text-sm font-medium">
                      Comportement dominant
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {Array.isArray(
                      currentProfile?.features.dominantBehaviors,
                    ) &&
                      (
                        currentProfile.features.dominantBehaviors as string[]
                      ).map((behavior: string) => (
                        <div key={behavior}>{getBehaviorBadge(behavior)}</div>
                      ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* Profil détaillé basé sur les entités UML Student */}
        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Target className="h-5 w-5 text-chart-3" />
                <h3 className="text-lg font-semibold">Points forts</h3>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {student.strengths.map((strength) => (
                  <div key={strength} className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-chart-3" />
                    <span className="text-sm">{strength}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-chart-1" />
                <h3 className="text-lg font-semibold">Axes d'amélioration</h3>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {student.improvementAxes.map((axis) => (
                  <div key={axis} className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-chart-1" />
                    <span className="text-sm">{axis}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-chart-4" />
                <h3 className="text-lg font-semibold">Besoins identifiés</h3>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {student.needs.map((need) => (
                  <div key={need} className="flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-chart-4" />
                    <span className="text-sm">{need}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Eye className="h-5 w-5 text-purple-600" />
                <h3 className="text-lg font-semibold">Observations</h3>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {student.observations.map((observation) => (
                  <div key={observation} className="flex items-center gap-2">
                    <Eye className="h-4 w-4 text-purple-600" />
                    <span className="text-sm">{observation}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Historique des participations (StudentParticipation UML) */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold">
                  Historique des participations
                </h2>
                <p className="text-sm text-muted-foreground">
                  Sessions avec évaluations détaillées - {currentPeriod.name}
                </p>
              </div>
              <Button variant="outline" className="gap-2">
                <BarChart3 className="h-4 w-4" />
                Voir tendances
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentParticipations.map((participation) => (
              <div
                key={participation.id}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="text-center min-w-16">
                    <div className="font-semibold text-sm">
                      {participation.date}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {participation.time}
                    </div>
                  </div>

                  <div className="flex-1">
                    <div className="font-medium mb-1">
                      {participation.subject}
                    </div>
                    <div className="flex items-center gap-2">
                      {participation.isPresent ? (
                        <>
                          <Badge variant="outline" className="text-xs">
                            Participation:{" "}
                            <GradeDisplay
                              value={participation.participationLevel}
                            />
                          </Badge>
                          {participation.behavior
                            .split(",")
                            .filter((b) => b.trim())
                            .map((behavior) => (
                              <div key={behavior.trim()}>
                                {getBehaviorBadge(behavior.trim())}
                              </div>
                            ))}
                          {participation.technicalIssues && (
                            <Badge variant="destructive" className="text-xs">
                              Problème technique
                            </Badge>
                          )}
                        </>
                      ) : (
                        <Badge variant="destructive" className="text-xs">
                          Absent
                        </Badge>
                      )}
                    </div>
                    {participation.specificRemarks && (
                      <p className="text-sm text-muted-foreground mt-1">
                        "{participation.specificRemarks}"
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Badge
                    variant="default"
                    className="text-xs bg-chart-3/10 text-chart-3 border-chart-3/20"
                  >
                    Évalué
                  </Badge>
                  <Link
                    href={`/dashboard/students/${id}?session=${participation.courseSessionId}`}
                  >
                    <Button variant="ghost" size="sm">
                      Voir détails
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Profil généré et actions */}
        <Card className="border-primary/20 bg-primary/5">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold">
                  Profil étudiant généré
                </h3>
                <p className="text-sm text-muted-foreground">
                  Généré automatiquement le{" "}
                  {currentProfile?.generatedAt.toLocaleDateString("fr-FR")}
                </p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" className="gap-2">
                  <FileText className="h-4 w-4" />
                  Exporter PDF
                </Button>
                <Button
                  className="gap-2"
                  disabled={
                    !rights.canEditStudentData(
                      student.id,
                      student.currentClassId,
                    )
                  }
                  onClick={() =>
                    currentProfile?.review("Profil validé par l'enseignant")
                  }
                >
                  <CheckCircle className="h-4 w-4" />
                  Valider profil
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4 text-sm">
              <div>
                <span className="font-medium">Statut:</span>
                <Badge className="ml-2 bg-chart-3/10 text-chart-3 border-chart-3/20">
                  {currentProfile?.status}
                </Badge>
              </div>
              <div>
                <span className="font-medium">Période:</span>
                <span className="ml-2">{currentPeriod.name}</span>
              </div>
              <div>
                <span className="font-medium">Matières évaluées:</span>
                <span className="ml-2">
                  {Array.isArray(currentProfile?.evidenceRefs.subjects)
                    ? (currentProfile.evidenceRefs.subjects as string[]).join(
                        ", ",
                      )
                    : "Aucune matière"}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AuthorizationGuard>
  );
}
