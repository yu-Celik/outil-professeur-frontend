"use client";

import { BookOpen, Calendar, Clock } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/atoms/select";
import { getClassById } from "@/features/gestion/mocks";
import { getSubjectById } from "@/features/gestion/mocks";
import { getTimeSlotById } from "@/features/calendar/mocks";
import type { CourseSession } from "@/types/uml-entities";

interface SessionFiltersProps {
  selectedClassId: string;
  selectedDate: string;
  selectedSessionId: string;
  allSessions: CourseSession[];
  onDateChange: (date: string) => void;
  onSessionChange: (sessionId: string) => void;
}

export function SessionFilters({
  selectedClassId,
  selectedDate,
  selectedSessionId,
  allSessions,
  onDateChange,
  onSessionChange,
}: SessionFiltersProps) {
  return (
    <div className="flex flex-wrap gap-6 items-end">
      <div className="min-w-48 space-y-2">
        <label className="block text-sm font-semibold text-foreground flex items-center gap-2">
          <Calendar className="h-4 w-4 text-primary" />
          Date
        </label>
        <div className="relative">
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => onDateChange(e.target.value)}
            className="flex h-10 w-full rounded-lg border border-border bg-background px-4 py-2 text-sm transition-all duration-200 focus:ring-2 focus:ring-primary/20 focus:border-primary hover:border-border"
          />
        </div>
      </div>

      <div className="min-w-64 space-y-2">
        <label className="block text-sm font-semibold text-foreground flex items-center gap-2">
          <Clock className="h-4 w-4 text-primary" />
          Séance spécifique
        </label>
        <Select value={selectedSessionId} onValueChange={onSessionChange}>
          <SelectTrigger className="bg-background">
            <SelectValue placeholder="Choisissez une séance..." />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">🔍 Toutes les séances</SelectItem>
            {allSessions
              .filter((session) => {
                const sessionDate = new Date(session.sessionDate)
                  .toISOString()
                  .split("T")[0];
                return (
                  (selectedClassId === "all" ||
                    session.classId === selectedClassId) &&
                  (!selectedDate || sessionDate === selectedDate)
                );
              })
              .map((session) => {
                const subject = getSubjectById(session.subjectId);
                const classData = getClassById(session.classId);
                const timeSlot = getTimeSlotById(session.timeSlotId);

                return (
                  <SelectItem
                    key={session.id}
                    value={session.id}
                    className="py-3"
                  >
                    <div className="flex items-center gap-2">
                      <BookOpen className="h-4 w-4 text-primary" />
                      <span className="font-medium">
                        {subject?.name || session.subjectId}
                      </span>
                      <span className="text-muted-foreground">•</span>
                      <span className="text-foreground">
                        {classData?.classCode || session.classId}
                      </span>
                      <span className="text-muted-foreground">
                        ({timeSlot?.startTime || "Non défini"})
                      </span>
                    </div>
                  </SelectItem>
                );
              })}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
