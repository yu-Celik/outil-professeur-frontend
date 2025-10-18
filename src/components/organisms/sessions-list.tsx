"use client";

import { BookOpen, Calendar, ClipboardList, Clock, Users } from "lucide-react";
import { Badge } from "@/components/atoms/badge";
import { Card, CardContent } from "@/components/molecules/card";
import { StudentParticipationAccordion } from "@/components/molecules/student-participation-accordion";
import { SessionStatsSummary } from "@/components/molecules/session-stats-summary";
import { getClassById } from "@/features/gestion/mocks";
import { getStudentsByClass } from "@/features/students/mocks";
import { getSubjectById } from "@/features/gestion/mocks";
import { getTimeSlotById } from "@/features/calendar/mocks";
import type {
  CourseSession,
  Student,
  StudentParticipation,
} from "@/types/uml-entities";

interface SessionsListProps {
  selectedSessionId: string;
  selectedSession: CourseSession | null;
  studentsForSession: Student[];
  openAccordions: Set<string>;
  onToggleAccordion: (studentId: string) => void;
  attendanceData?: StudentParticipation[] | null;
  onSaveParticipation?: (
    participation: Partial<StudentParticipation>,
  ) => Promise<void>;
}

export function SessionsList({
  selectedSessionId,
  selectedSession,
  studentsForSession,
  openAccordions,
  onToggleAccordion,
  attendanceData,
  onSaveParticipation,
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
    <div className="flex flex-col flex-1 min-h-0">
      {/* Informations sur la session sélectionnée */}
      <div className="mb-3 flex-shrink-0 p-3 bg-muted/20 rounded-md border border-border/30">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-1.5 rounded-lg bg-primary">
              <BookOpen className="h-4 w-4 text-primary-foreground" />
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="text-sm font-semibold text-foreground truncate">
                {getSubjectById(selectedSession.subjectId)?.name ||
                  selectedSession.subjectId}{" "}
                -{" "}
                {getClassById(selectedSession.classId)?.classCode ||
                  selectedSession.classId}
              </h3>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Calendar className="h-3 w-3" />
                <span>
                  {new Date(selectedSession.sessionDate).toLocaleDateString(
                    "fr-FR",
                    {
                      weekday: "short",
                      day: "numeric",
                      month: "short",
                    },
                  )}
                </span>
                <div className="h-1 w-1 bg-muted-foreground/60 rounded-full" />
                <Clock className="h-3 w-3" />
                <span>
                  {getTimeSlotById(selectedSession.timeSlotId)?.startTime ||
                    "Non défini"}
                </span>
              </div>
            </div>
          </div>
          <Badge
            variant={
              selectedSession.status === "done" ? "default" : "secondary"
            }
            className={`text-xs ${
              selectedSession.status === "done"
                ? "bg-success text-success-foreground"
                : "bg-warning/20 text-warning-foreground border-warning/30"
            }`}
          >
            {selectedSession.status === "done" ? "✅ Terminée" : "📅 Prévue"}
          </Badge>
        </div>
      </div>

      {/* Session Statistics */}
      {attendanceData && attendanceData.length > 0 && (
        <div className="flex-shrink-0 mb-3">
          <SessionStatsSummary
            attendanceData={attendanceData}
            totalStudents={studentsForSession.length}
          />
        </div>
      )}

      {/* Zone scrollable avec accordéons */}
      <div className="flex-1 space-y-4 overflow-y-auto min-h-0">
        {/* Accordéons par élève */}
        {studentsForSession.map((student) => {
          const studentAttendance = attendanceData?.find(
            (a) => a.studentId === student.id,
          );

          return (
            <StudentParticipationAccordion
              key={student.id}
              student={student}
              session={selectedSession}
              isOpen={openAccordions.has(student.id)}
              onToggle={() => onToggleAccordion(student.id)}
              participation={studentAttendance}
              onSave={onSaveParticipation}
            />
          );
        })}
      </div>
    </div>
  );
}
