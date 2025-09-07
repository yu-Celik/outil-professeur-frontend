"use client";

import { CheckCircle } from "lucide-react";
import { Button } from "@/components/atoms/button";
import { Card, CardContent, CardHeader } from "@/components/molecules/card";
import type { CourseSession, TimeSlot } from "@/types/uml-entities";

interface SessionSummaryCardProps {
  courseSession: CourseSession | null;
  timeSlot: TimeSlot | null;
  getSessionSummary: () => string;
  takeAttendance: () => void;
}

export function SessionSummaryCard({
  courseSession,
  timeSlot,
  getSessionSummary,
  takeAttendance,
}: SessionSummaryCardProps) {
  return (
    <Card>
      <CardHeader>
        <h3 className="font-semibold">Résumé de la session</h3>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-3">
          {getSessionSummary()}
        </p>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span>Salle:</span>
            <span>-</span>
          </div>
          <div className="flex justify-between">
            <span>Durée:</span>
            <span>{timeSlot?.durationMinutes}min</span>
          </div>
          <div className="flex justify-between">
            <span>Présences prises:</span>
            <span>{courseSession?.status === "done" ? "Oui" : "Non"}</span>
          </div>
        </div>

        {courseSession?.status !== "done" && (
          <Button
            className="w-full mt-4 gap-2"
            onClick={takeAttendance}
            variant="outline"
          >
            <CheckCircle className="h-4 w-4" />
            Finaliser les présences
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
