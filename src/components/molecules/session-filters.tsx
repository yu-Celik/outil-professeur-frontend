"use client";

import { Calendar, Users, Clock, BookOpen } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/molecules/select";
import { Card, CardContent } from "@/components/molecules/card";
import { getSubjectById } from "@/data/mock-subjects";
import { getClassById } from "@/data/mock-classes";
import { getTimeSlotById } from "@/data/mock-time-slots";
import type { CourseSession, Class } from "@/types/uml-entities";

interface SessionFiltersProps {
  selectedClassId: string;
  selectedDate: string;
  selectedSessionId: string;
  uniqueClasses: Class[];
  allSessions: CourseSession[];
  onClassChange: (classId: string) => void;
  onDateChange: (date: string) => void;
  onSessionChange: (sessionId: string) => void;
}

export function SessionFilters({
  selectedClassId,
  selectedDate,
  selectedSessionId,
  uniqueClasses,
  allSessions,
  onClassChange,
  onDateChange,
  onSessionChange,
}: SessionFiltersProps) {
  return (
    <Card className="bg-card p-6 rounded-2xl shadow-lg border border-border backdrop-blur-sm">
      <div className="flex items-center gap-2 mb-4">
        <div className="p-1.5 rounded-lg bg-muted">
          <Calendar className="h-4 w-4 text-muted-foreground" />
        </div>
        <h3 className="font-semibold text-card-foreground">Filtres de recherche</h3>
      </div>

      <div className="flex flex-wrap gap-6 items-end">
        <div className="min-w-48 space-y-2">
          <label className="block text-sm font-semibold text-foreground flex items-center gap-2">
            <Users className="h-4 w-4 text-primary" />
            Classe
          </label>
          <Select value={selectedClassId} onValueChange={onClassChange}>
            <SelectTrigger className="bg-background">
              <SelectValue placeholder="Toutes les classes" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">🏫 Toutes les classes</SelectItem>
              {uniqueClasses.map((classData) => (
                <SelectItem key={classData.id} value={classData.id}>
                  📚 {classData.classCode} - {classData.gradeLabel}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

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
                  const sessionDate = new Date(session.sessionDate).toISOString().split('T')[0];
                  return (selectedClassId === 'all' || session.classId === selectedClassId) &&
                    (!selectedDate || sessionDate === selectedDate);
                })
                .map((session) => {
                  const subject = getSubjectById(session.subjectId);
                  const classData = getClassById(session.classId);
                  const timeSlot = getTimeSlotById(session.timeSlotId);

                  return (
                    <SelectItem key={session.id} value={session.id} className="py-3">
                      <div className="flex items-center gap-2">
                        <BookOpen className="h-4 w-4 text-primary" />
                        <span className="font-medium">{subject?.name || session.subjectId}</span>
                        <span className="text-muted-foreground">•</span>
                        <span className="text-foreground">{classData?.classCode || session.classId}</span>
                        <span className="text-muted-foreground">({timeSlot?.startTime || 'Non défini'})</span>
                      </div>
                    </SelectItem>
                  );
                })}
            </SelectContent>
          </Select>
        </div>
      </div>
    </Card>
  );
}