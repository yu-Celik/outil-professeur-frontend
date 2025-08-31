"use client";

import {
  BarChart3,
  BookOpen,
  Calendar,
  ChevronRight,
  Clock,
  Play,
  Plus,
  Settings,
  Users,
} from "lucide-react";
import Link from "next/link";
import { use } from "react";
import { Badge } from "@/components/atoms/badge";
import { Button } from "@/components/atoms/button";
import { Card, CardContent, CardHeader } from "@/components/molecules/card";

interface CourseDetailPageProps {
  params: Promise<{ id: string }>;
}

export default function CourseDetailPage({ params }: CourseDetailPageProps) {
  const { id } = use(params);

  // Mock data pour un cours
  const course = {
    id,
    name: "Mathématiques",
    description: "Cours de mathématiques niveau secondaire",
    status: "active",
    totalStudents: 67,
    totalSessions: 15,
    completedSessions: 8,
  };

  // Sessions prévues et récentes
  const sessions = [
    {
      id: "session-1",
      date: "Aujourd'hui",
      time: "16h00 - 17h00",
      className: "B1",
      status: "upcoming",
      studentsCount: 15,
      subject: "Algèbre linéaire",
    },
    {
      id: "session-2",
      date: "Demain",
      time: "14h00 - 15h30",
      className: "C1",
      status: "upcoming",
      studentsCount: 12,
      subject: "Géométrie",
    },
    {
      id: "session-3",
      date: "18/02",
      time: "16h00 - 17h00",
      className: "B1",
      status: "completed",
      studentsCount: 15,
      subject: "Équations du second degré",
      evaluatedStudents: 15,
    },
    {
      id: "session-4",
      date: "16/02",
      time: "14h00 - 15h30",
      className: "C1",
      status: "completed",
      studentsCount: 12,
      subject: "Fonctions",
      evaluatedStudents: 10,
    },
  ];

  const upcomingSessions = sessions.filter((s) => s.status === "upcoming");
  const completedSessions = sessions.filter((s) => s.status === "completed");

  return (
    <div className="space-y-6">
      {/* Header du cours */}
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-4">
          <div className="w-16 h-16 rounded-xl bg-primary/10 flex items-center justify-center">
            <BookOpen className="h-8 w-8 text-primary" />
          </div>

          <div>
            <h1 className="text-3xl font-bold text-foreground">
              {course.name}
            </h1>
            <p className="text-lg text-muted-foreground mb-2">
              {course.description}
            </p>
            <Badge className="bg-chart-3/10 text-chart-3 border-chart-3/20">
              {course.status === "active" ? "Actif" : "Inactif"}
            </Badge>
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
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Nouvelle session
          </Button>
        </div>
      </div>

      {/* Statistiques du cours */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Users className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">Élèves</span>
            </div>
            <div className="text-2xl font-bold">{course.totalStudents}</div>
            <p className="text-xs text-muted-foreground">Toutes classes</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">Sessions</span>
            </div>
            <div className="text-2xl font-bold">
              {course.completedSessions}/{course.totalSessions}
            </div>
            <p className="text-xs text-muted-foreground">Terminées</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <BarChart3 className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">Progression</span>
            </div>
            <div className="text-2xl font-bold">
              {Math.round(
                (course.completedSessions / course.totalSessions) * 100,
              )}
              %
            </div>
            <p className="text-xs text-muted-foreground">Du programme</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">Prochaine session</span>
            </div>
            <div className="text-lg font-bold">Aujourd'hui</div>
            <p className="text-xs text-muted-foreground">16h00 - B1</p>
          </CardContent>
        </Card>
      </div>

      {/* Sessions à venir */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold">Sessions à venir</h2>
              <p className="text-sm text-muted-foreground">
                Prochaines sessions planifiées - Cliquez pour démarrer
                l'évaluation
              </p>
            </div>
            <Button variant="outline" className="gap-2">
              <Plus className="h-4 w-4" />
              Planifier
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {upcomingSessions.map((session) => (
            <div
              key={session.id}
              className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors group"
            >
              <div className="flex items-center gap-4">
                <div className="text-center min-w-20">
                  <div className="font-semibold text-sm text-primary">
                    {session.date}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {session.time}
                  </div>
                </div>

                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium">{session.subject}</span>
                    <Badge variant="outline" className="text-xs">
                      Classe {session.className}
                    </Badge>
                  </div>
                  <div className="text-sm text-muted-foreground flex items-center gap-1">
                    <Users className="h-3 w-3" />
                    {session.studentsCount} élèves
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Badge
                  variant="secondary"
                  className="text-xs bg-chart-1/10 text-chart-1 border-chart-1/20"
                >
                  À venir
                </Badge>
                <Link href={`/dashboard/sessions/${session.id}`}>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="gap-2 group-hover:bg-primary group-hover:text-primary-foreground"
                  >
                    <Play className="h-4 w-4" />
                    Démarrer
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Sessions terminées */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold">Sessions récentes</h2>
              <p className="text-sm text-muted-foreground">
                Historique des sessions avec état d'évaluation
              </p>
            </div>
            <Button variant="outline" className="gap-2">
              <BarChart3 className="h-4 w-4" />
              Voir tout
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {completedSessions.map((session) => (
            <div
              key={session.id}
              className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className="text-center min-w-20">
                  <div className="font-semibold text-sm">{session.date}</div>
                  <div className="text-xs text-muted-foreground">
                    {session.time}
                  </div>
                </div>

                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium">{session.subject}</span>
                    <Badge variant="outline" className="text-xs">
                      Classe {session.className}
                    </Badge>
                  </div>
                  <div className="text-sm text-muted-foreground flex items-center gap-3">
                    <span className="flex items-center gap-1">
                      <Users className="h-3 w-3" />
                      {session.studentsCount} élèves
                    </span>
                    <span className="flex items-center gap-1">
                      <BarChart3 className="h-3 w-3" />
                      {session.evaluatedStudents}/{session.studentsCount}{" "}
                      évalués
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Badge
                  variant={
                    session.evaluatedStudents === session.studentsCount
                      ? "default"
                      : "secondary"
                  }
                  className="text-xs"
                >
                  {session.evaluatedStudents === session.studentsCount
                    ? "Terminée"
                    : "Incomplète"}
                </Badge>
                <Link href={`/dashboard/sessions/${session.id}`}>
                  <Button variant="ghost" size="sm" className="gap-2">
                    Voir détails
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
