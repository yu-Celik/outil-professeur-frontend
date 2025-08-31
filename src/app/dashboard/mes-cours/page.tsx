import { BookOpen, Calendar, ChevronRight, Plus } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/atoms/badge";

export default function MesCoursPage() {
  // Mock data pour les cours
  const courses = [
    {
      id: "math",
      name: "Mathématiques",
      description: "Cours de mathématiques niveau secondaire",
      status: "active",
      studentsCount: 67,
      nextSession: "Aujourd'hui 16h00 - B1",
      completedSessions: 8,
      totalSessions: 15,
    },
    {
      id: "french",
      name: "Français",
      description: "Littérature et expression écrite",
      status: "active",
      studentsCount: 45,
      nextSession: "Demain 14h00 - C1",
      completedSessions: 6,
      totalSessions: 12,
    },
    {
      id: "sciences",
      name: "Sciences",
      description: "Physique et chimie appliquées",
      status: "draft",
      studentsCount: 0,
      nextSession: null,
      completedSessions: 0,
      totalSessions: 0,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Mes cours</h1>
          <p className="text-muted-foreground">
            Gérez vos matières et contenus pédagogiques
          </p>
        </div>
        <div>
          {/* Version desktop */}
          <button
            type="button"
            className="hidden lg:flex bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Nouveau cours
          </button>
          {/* Version mobile */}
          <button
            type="button"
            className="flex lg:hidden bg-primary text-primary-foreground hover:bg-primary/90 w-10 h-10 rounded-md items-center justify-center"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {courses.map((course) => (
          <Link key={course.id} href={`/dashboard/mes-cours/${course.id}`}>
            <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6 hover:shadow-md transition-shadow cursor-pointer group">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-primary" />
                  <h3 className="text-lg font-semibold group-hover:text-primary transition-colors">
                    {course.name}
                  </h3>
                </div>
                <div className="flex items-center gap-2">
                  <Badge
                    variant={
                      course.status === "active" ? "default" : "secondary"
                    }
                    className={
                      course.status === "active"
                        ? "bg-chart-3/10 text-chart-3 border-chart-3/20"
                        : ""
                    }
                  >
                    {course.status === "active" ? "Actif" : "Brouillon"}
                  </Badge>
                  <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                {course.description}
              </p>

              {course.nextSession && (
                <div className="mb-4 p-3 bg-primary/5 rounded-lg border border-primary/20">
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="h-4 w-4 text-primary" />
                    <span className="font-medium text-primary">
                      Prochaine session:
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    {course.nextSession}
                  </p>
                </div>
              )}

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Élèves:</span>
                  <span className="font-medium">{course.studentsCount}</span>
                </div>
                <div className="flex justify-between">
                  <span>Sessions:</span>
                  <span className="font-medium">
                    {course.completedSessions}/{course.totalSessions}
                  </span>
                </div>
                {course.totalSessions > 0 && (
                  <div className="flex justify-between">
                    <span>Progression:</span>
                    <span className="font-medium">
                      {Math.round(
                        (course.completedSessions / course.totalSessions) * 100,
                      )}
                      %
                    </span>
                  </div>
                )}
              </div>
            </div>
          </Link>
        ))}

        <div className="rounded-lg border-2 border-dashed border-muted-foreground/25 p-6 flex flex-col items-center justify-center text-center">
          <div className="text-4xl mb-4">📚</div>
          <h3 className="text-lg font-medium mb-2">Ajouter un cours</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Créez un nouveau cours pour vos élèves
          </p>
          <div>
            {/* Version desktop */}
            <button
              type="button"
              className="hidden lg:flex text-primary hover:underline items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Créer un cours
            </button>
            {/* Version mobile */}
            <button
              type="button"
              className="flex lg:hidden text-primary hover:bg-primary/10 w-10 h-10 rounded-md items-center justify-center"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
        <div className="p-6">
          <h3 className="text-lg font-semibold mb-4">Activité récente</h3>
          <div className="space-y-4">
            <div className="flex items-start gap-3 p-4 bg-muted rounded-lg">
              <div className="text-2xl">📝</div>
              <div className="flex-1">
                <p className="font-medium">Aucune activité récente</p>
                <p className="text-sm text-muted-foreground">
                  Commencez par créer votre premier cours
                </p>
              </div>
              <span className="text-sm text-muted-foreground">-</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
