"use client";

import { Badge } from "@/components/atoms/badge";
import { CalendarDays, CheckCircle, Clock, XCircle } from "lucide-react";

export interface ExamStatusBadgeProps {
  isPublished: boolean;
  examDate: Date;
  className?: string;
}

export function ExamStatusBadge({ isPublished, examDate, className }: ExamStatusBadgeProps) {
  const now = new Date();
  const isPast = examDate < now;
  const isUpcoming = examDate >= now;

  if (!isPublished) {
    return (
      <Badge variant="outline" className={className}>
        <Clock className="w-3 h-3 mr-1" />
        Brouillon
      </Badge>
    );
  }

  if (isPast) {
    return (
      <Badge variant="secondary" className={className}>
        <CheckCircle className="w-3 h-3 mr-1" />
        Terminé
      </Badge>
    );
  }

  if (isUpcoming) {
    return (
      <Badge variant="default" className={className}>
        <CalendarDays className="w-3 h-3 mr-1" />
        Programmé
      </Badge>
    );
  }

  return (
    <Badge variant="outline" className={className}>
      <XCircle className="w-3 h-3 mr-1" />
      Inconnu
    </Badge>
  );
}