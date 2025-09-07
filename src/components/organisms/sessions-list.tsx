"use client";

import { BookOpen, Calendar, ClipboardList, Clock, Users } from "lucide-react";
import { Badge } from "@/components/atoms/badge";
import { Card, CardContent } from "@/components/molecules/card";
import { StudentParticipationAccordion } from "@/components/molecules/student-participation-accordion";
import { getClassById } from "@/data/mock-classes";
import { getStudentsByClass } from "@/data/mock-students";
import { getSubjectById } from "@/data/mock-subjects";
import { getTimeSlotById } from "@/data/mock-time-slots";
import type { CourseSession, Student } from "@/types/uml-entities";

interface SessionsListProps {
  selectedSessionId: string;
  selectedSession: CourseSession | null;
  studentsForSession: Student[];
  openAccordions: Set<string>;
  onToggleAccordion: (studentId: string) => void;
}

export function SessionsList({
  selectedSessionId,
  selectedSession,
  studentsForSession,
  openAccordions,
  onToggleAccordion,
}: SessionsListProps) {
  if (selectedSessionId === "all") {
    return (
      <div className="relative">
        <div className="absolute inset-0 bg-muted/20 rounded-3xl opacity-60" />
        <Card className="relative shadow-xl bg-card/80 backdrop-blur-sm">
          <CardContent className="p-12 text-center">
            <div className="max-w-md mx-auto space-y-6">
              <div className="relative">
                <div className="relative p-4 rounded-full bg-primary/10 mx-auto w-fit">
                  <ClipboardList className="h-12 w-12 text-primary" />
                </div>
              </div>

              <div className="space-y-3">
                <h3 className="text-2xl font-bold text-card-foreground">
                  Sélectionnez une séance
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  Choisissez une séance spécifique dans les filtres ci-dessus
                  pour commencer l'évaluation de vos élèves
                </p>
              </div>

              <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                <div className="h-2 w-2 bg-primary rounded-full animate-bounce" />
                <div className="h-2 w-2 bg-primary/80 rounded-full animate-bounce delay-75" />
                <div className="h-2 w-2 bg-primary/60 rounded-full animate-bounce delay-150" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!selectedSession) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <ClipboardList className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-lg font-semibold mb-2 text-card-foreground">
            Séance non trouvée
          </h3>
          <p className="text-muted-foreground">
            La séance sélectionnée n'existe pas
          </p>
        </CardContent>
      </Card>
    );
  }

  if (studentsForSession.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <Users className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-lg font-semibold mb-2 text-card-foreground">
            Aucun élève trouvé
          </h3>
          <p className="text-muted-foreground">
            Aucun élève inscrit dans cette classe
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      {/* Informations sur la session sélectionnée */}
      <div className="relative mb-6">
        <div className="absolute inset-0 bg-primary/5 rounded-2xl opacity-50" />
        <Card className="relative shadow-lg bg-card/70 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-primary shadow-lg">
                  <BookOpen className="h-6 w-6 text-primary-foreground" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-card-foreground">
                    {getSubjectById(selectedSession.subjectId)?.name ||
                      selectedSession.subjectId}{" "}
                    -{" "}
                    {getClassById(selectedSession.classId)?.classCode ||
                      selectedSession.classId}
                  </h3>
                  <div className="flex items-center gap-2 text-muted-foreground mt-1">
                    <Calendar className="h-4 w-4" />
                    <span className="font-medium">
                      {new Date(selectedSession.sessionDate).toLocaleDateString(
                        "fr-FR",
                        {
                          weekday: "long",
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        },
                      )}
                    </span>
                    <div className="h-1 w-1 bg-muted-foreground/60 rounded-full" />
                    <Clock className="h-4 w-4" />
                    <span>
                      {getTimeSlotById(selectedSession.timeSlotId)?.startTime ||
                        "Horaire non défini"}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Badge
                  variant={
                    selectedSession.status === "done" ? "default" : "secondary"
                  }
                  className={`px-3 py-1 ${
                    selectedSession.status === "done"
                      ? "bg-success text-success-foreground shadow-md"
                      : "bg-warning/20 text-warning-foreground border-warning/30"
                  }`}
                >
                  {selectedSession.status === "done"
                    ? "✅ Terminée"
                    : "📅 Prévue"}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Accordéons par élève */}
      {studentsForSession.map((student) => (
        <StudentParticipationAccordion
          key={student.id}
          student={student}
          session={selectedSession}
          isOpen={openAccordions.has(student.id)}
          onToggle={() => onToggleAccordion(student.id)}
        />
      ))}

      {/* Actions globales */}
      <Card>
        <CardContent className="p-4">
          <div className="flex justify-between items-center">
            <div className="text-sm text-muted-foreground">
              {studentsForSession.length} élève
              {studentsForSession.length > 1 ? "s" : ""} dans cette séance
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
