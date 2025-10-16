"use client";

import { useMemo, useState, useEffect } from "react";
import type {
  Student,
  StudentProfile,
  SchoolYear,
  AcademicPeriod,
} from "@/types/uml-entities";

interface StudentParticipation {
  id: string;
  courseSessionId: string;
  subject: string;
  date: string;
  time: string;
  isPresent: boolean;
  participationLevel: number;
  behavior: string;
  specificRemarks: string;
  technicalIssues: string;
  markedAt: Date;
}

export function useStudentProfile(studentId: string) {
  // Mock data basé sur les entités UML - en production, ces données viendraient d'une API
  const [student] = useState<Student>({
    id: studentId,
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

  const [schoolYear] = useState<SchoolYear>({
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

  const [currentPeriod] = useState<AcademicPeriod>({
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

  // Mock participations récentes
  const recentParticipations: StudentParticipation[] = useMemo(
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

  const [currentProfile, setCurrentProfile] = useState<StudentProfile | null>(
    null,
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

  return {
    student,
    schoolYear,
    currentPeriod,
    currentProfile,
    recentParticipations,
  };
}
