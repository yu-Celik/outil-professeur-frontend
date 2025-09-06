"use client";

import { ChevronDown, Users } from "lucide-react";
import { Badge } from "@/components/atoms/badge";
import { Card, CardContent, CardHeader } from "@/components/molecules/card";
import type { Class, Subject, TimeSlot } from "@/types/uml-entities";

interface SessionStudent {
  id: string;
  name: string;
  status: "current" | "pending" | "completed";
  completion: "not_started" | "in_progress" | "completed";
}

interface SessionStudentsListProps {
  classEntity: Class | null;
  subject: Subject | null;
  timeSlot: TimeSlot | null;
  students: SessionStudent[];
}

const getCompletionBadge = (completion: string) => {
  switch (completion) {
    case "completed":
      return (
        <Badge className="bg-chart-3/10 text-chart-3 border-chart-3/20">
          Terminé
        </Badge>
      );
    case "in_progress":
      return (
        <Badge className="bg-chart-1/10 text-chart-1 border-chart-1/20">
          En cours
        </Badge>
      );
    default:
      return (
        <Badge
          variant="outline"
          className="text-chart-4 bg-chart-4/10 border-chart-4/20"
        >
          À faire
        </Badge>
      );
  }
};

export function SessionStudentsList({
  classEntity,
  subject,
  timeSlot,
  students,
}: SessionStudentsListProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Users className="h-4 w-4 text-primary" />
          <h3 className="font-semibold">
            Session {classEntity?.classCode}
          </h3>
        </div>
        <p className="text-sm text-muted-foreground">
          {subject?.name} • {timeSlot?.name}
        </p>
      </CardHeader>
      <CardContent className="space-y-2">
        {students.map((student) => (
          <div
            key={student.id}
            className={`flex items-center justify-between p-3 rounded-lg border transition-colors cursor-pointer ${
              student.status === "current"
                ? "bg-primary/5 border-primary/20"
                : "hover:bg-muted/50"
            }`}
          >
            <span className="font-medium">{student.name}</span>
            <div className="flex items-center gap-2">
              {getCompletionBadge(student.completion)}
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}