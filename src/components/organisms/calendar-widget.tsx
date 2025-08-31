"use client";

import {
  ArrowRight,
  BookOpen,
  Calendar as CalendarIcon,
  ChevronRight,
  Clock,
  Users,
} from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/atoms/badge";
import { Button } from "@/components/atoms/button";
import { Card, CardContent, CardHeader } from "@/components/molecules/card";
import { type CalendarEvent, useCalendar } from "@/hooks/use-calendar";
import { useClassColors } from "@/hooks/use-class-colors";

interface CalendarWidgetProps {
  className?: string;
  teacherId?: string;
}

export function CalendarWidget({
  className = "",
  teacherId = "KsmNtVf4zwqO3VV3SQJqPrRlQBA1fFyR",
}: CalendarWidgetProps) {
  const { calendarEvents, loading } = useCalendar(teacherId);
  const { getClassColorWithText } = useClassColors(teacherId, "year-2024");

  if (loading) {
    return (
      <Card className={className}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Sessions à venir</h3>
            <CalendarIcon className="h-5 w-5 text-muted-foreground" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {Array.from({ length: 3 }, (_, i) => (
              <div
                key={`loading-skeleton-${Date.now()}-${i}`}
                className="flex items-center gap-3 p-3 bg-muted/50 rounded-md animate-pulse"
              >
                <div className="w-10 h-10 bg-muted rounded-md"></div>
                <div className="flex-1 space-y-1">
                  <div className="w-3/4 h-4 bg-muted rounded"></div>
                  <div className="w-1/2 h-3 bg-muted rounded"></div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  // Sessions des 7 prochains jours
  const upcomingSessions = calendarEvents
    .filter((event) => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const weekFromNow = new Date(today);
      weekFromNow.setDate(weekFromNow.getDate() + 7);

      return (
        event.start >= today &&
        event.start < weekFromNow &&
        event.courseSession.status !== "completed"
      );
    })
    .sort((a, b) => a.start.getTime() - b.start.getTime())
    .slice(0, 5);

  const todaySessions = upcomingSessions.filter((event) => {
    const today = new Date();
    return event.start.toDateString() === today.toDateString();
  });

  const getEventStatusColor = (event: CalendarEvent) => {
    switch (event.courseSession.status) {
      case "active":
        return "bg-chart-1/10 text-chart-1 border-chart-1/20";
      case "upcoming":
        return "bg-chart-4/10 text-chart-4 border-chart-4/20";
      default:
        return "bg-muted text-muted-foreground border-border";
    }
  };

  const formatEventTime = (date: Date) => {
    return date.toLocaleTimeString("fr-FR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatEventDate = (date: Date) => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (date.toDateString() === today.toDateString()) {
      return "Aujourd'hui";
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return "Demain";
    } else {
      return date.toLocaleDateString("fr-FR", {
        weekday: "long",
        day: "numeric",
        month: "short",
      });
    }
  };

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold">Mes sessions à venir</h3>
            <p className="text-sm text-muted-foreground">
              {todaySessions.length > 0
                ? `${todaySessions.length} session${todaySessions.length > 1 ? "s" : ""} aujourd'hui`
                : `${upcomingSessions.length} prochaine${upcomingSessions.length > 1 ? "s" : ""} session${upcomingSessions.length > 1 ? "s" : ""}`}
            </p>
          </div>
          <Link href="/dashboard/calendrier">
            <Button variant="ghost" size="sm" className="gap-1">
              <CalendarIcon className="h-4 w-4" />
              Calendrier
              <ArrowRight className="h-3 w-3" />
            </Button>
          </Link>
        </div>
      </CardHeader>

      <CardContent>
        {upcomingSessions.length > 0 ? (
          <div className="space-y-3">
            {upcomingSessions.map((event) => (
              <Link
                key={event.id}
                href={`/dashboard/sessions/${event.courseSession.id}`}
                className="block"
              >
                <div
                  className="flex items-center gap-3 p-3 rounded-md border-l-4 hover:bg-muted/50 transition-colors cursor-pointer"
                  style={{
                    borderLeftColor: getClassColorWithText(event.class.id)
                      .backgroundColor,
                  }}
                >
                  <div className="flex-shrink-0">
                    <div
                      className="w-10 h-10 rounded-md flex items-center justify-center"
                      style={{
                        backgroundColor: `${getClassColorWithText(event.class.id).backgroundColor}20`, // 20 = ~12% opacity
                      }}
                    >
                      <BookOpen
                        className="h-4 w-4"
                        style={{
                          color: getClassColorWithText(event.class.id)
                            .backgroundColor,
                        }}
                      />
                    </div>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium truncate">{event.title}</h4>
                      <Badge
                        variant="outline"
                        className={`text-xs ${getEventStatusColor(event)}`}
                      >
                        {event.courseSession.status === "active" && "En cours"}
                        {event.courseSession.status === "upcoming" && "À venir"}
                      </Badge>
                    </div>

                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <CalendarIcon className="h-3 w-3" />
                        {formatEventDate(event.start)}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {formatEventTime(event.start)} -{" "}
                        {formatEventTime(event.end)}
                      </span>
                      <span className="flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        {event.class.classCode}
                      </span>
                    </div>
                  </div>

                  <div className="flex-shrink-0">
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  </div>
                </div>
              </Link>
            ))}

            {upcomingSessions.length >= 5 && (
              <div className="pt-2 border-t">
                <Link href="/dashboard/calendrier">
                  <Button variant="outline" className="w-full gap-2">
                    <CalendarIcon className="h-4 w-4" />
                    Voir tout le calendrier
                  </Button>
                </Link>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-8">
            <CalendarIcon className="h-12 w-12 mx-auto mb-3 text-muted-foreground/50" />
            <div className="text-muted-foreground mb-4">
              <p className="font-medium">Aucune session prévue</p>
              <p className="text-sm">
                Vous pouvez créer de nouvelles sessions dans le calendrier
              </p>
            </div>
            <Link href="/dashboard/calendrier">
              <Button variant="outline" className="gap-2">
                <CalendarIcon className="h-4 w-4" />
                Ouvrir le calendrier
              </Button>
            </Link>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
