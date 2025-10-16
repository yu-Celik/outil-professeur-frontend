"use client";

import { Calendar, Clock, Eye, Users } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/atoms/badge";
import { Button } from "@/components/atoms/button";
import { Card, CardContent } from "@/components/molecules/card";
import type { CalendarEvent } from "@/features/calendar";

interface SessionCardProps {
  event: CalendarEvent;
  getStatusColor: (status: string) => string;
  onEdit?: (event: CalendarEvent) => void;
}

const getStatusLabel = (status: string): string => {
  switch (status) {
    case "done":
      return "Terminé";
    case "in_progress":
      return "En cours";
    case "planned":
      return "À venir";
    case "cancelled":
      return "Annulé";
    default:
      return status;
  }
};

export function SessionCard({ event, getStatusColor, onEdit }: SessionCardProps) {
  return (
    <Card className="border-l-4 border-l-primary">
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-2">
          <div>
            <h4 className="font-medium">{event.title}</h4>
            <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {event.timeSlot.startTime} - {event.timeSlot.endTime}
              </span>
              <span className="flex items-center gap-1">
                <Users className="h-3 w-3" />
                {event.class.classCode}
              </span>
            </div>
          </div>
          <Badge className={getStatusColor(event.courseSession.status)}>
            {getStatusLabel(event.courseSession.status)}
          </Badge>
        </div>

        {event.courseSession.objectives && (
          <p className="text-sm text-muted-foreground mb-3">
            {event.courseSession.objectives}
          </p>
        )}

        <div className="flex gap-2">
          {event.canView && (
            <Link href={`/dashboard/sessions/${event.courseSession.id}`}>
              <Button variant="outline" size="sm" className="gap-2">
                <Eye className="h-3 w-3" />
                Voir session
              </Button>
            </Link>
          )}
          {event.canEdit && event.courseSession.status === "planned" && (
            <Button
              variant="outline"
              size="sm"
              className="gap-2"
              onClick={() => onEdit?.(event)}
            >
              <Calendar className="h-3 w-3" />
              Modifier
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
