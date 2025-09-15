"use client";

import {
  BookOpen,
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Clock,
  Eye,
  Grid3X3,
  List,
  Plus,
  Users,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Badge } from "@/components/atoms/badge";
import { Button } from "@/components/atoms/button";
import { Card, CardContent, CardHeader } from "@/components/molecules/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/atoms/dialog";
import { SessionForm } from "@/components/molecules/session-form";
import { type CalendarEvent, useCalendar } from "@/features/calendar";

interface CalendarProps {
  className?: string;
  teacherId?: string;
}

export function Calendar({
  className = "",
  teacherId = "KsmNtVf4zwqO3VV3SQJqPrRlQBA1fFyR",
}: CalendarProps) {
  const {
    currentDate,
    calendarWeeks,
    calendarEvents,
    loading,
    navigateMonth,
    navigateToToday,
    subjects,
    classes,
    timeSlots,
    addSession,
  } = useCalendar(teacherId);

  // Gestion du mode d'affichage local au composant
  const [viewMode, setViewMode] = useState<"month" | "week" | "day">("month");
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showSessionForm, setShowSessionForm] = useState(false);
  const [sessionFormDate, setSessionFormDate] = useState<Date | null>(null);

  // Fonction utilitaire pour obtenir les événements d'un jour donné
  const getEventsForDay = (date: Date | null): CalendarEvent[] => {
    if (!date) return [];
    return calendarEvents.filter(
      (event) => event.start.toDateString() === date.toDateString(),
    );
  };

  if (loading) {
    return (
      <Card className={className}>
        <CardContent className="p-8 text-center">
          <CalendarIcon className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <div className="text-lg font-medium mb-2">
            Chargement du calendrier...
          </div>
          <div className="text-sm text-muted-foreground">
            Récupération des sessions de cours
          </div>
        </CardContent>
      </Card>
    );
  }

  const monthYear = currentDate.toLocaleDateString("fr-FR", {
    month: "long",
    year: "numeric",
  });

  const weekDays = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];

  const getEventStatusColor = (event: CalendarEvent) => {
    switch (event.courseSession.status) {
      case "done":
        return "bg-chart-3/10 text-chart-3 border-chart-3/20";
      case "in_progress":
        return "bg-chart-1/10 text-chart-1 border-chart-1/20";
      case "planned":
        return "bg-chart-4/10 text-chart-4 border-chart-4/20";
      case "cancelled":
        return "bg-muted text-muted-foreground border-border";
      default:
        return "bg-muted text-muted-foreground border-border";
    }
  };

  const EventCard = ({ event }: { event: CalendarEvent }) => (
    <button
      type="button"
      className={`text-xs p-2 rounded mb-1 border cursor-pointer hover:opacity-80 transition-opacity w-full text-left ${getEventStatusColor(event)}`}
      onClick={() => setSelectedDate(event.start)}
    >
      <div className="font-medium truncate">{event.title}</div>
      <div className="flex items-center gap-1 mt-1">
        <Clock className="h-3 w-3" />
        <span>{event.timeSlot.startTime}</span>
      </div>
    </button>
  );

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h2 className="text-2xl font-bold capitalize">{monthYear}</h2>
            <div className="flex items-center gap-1">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigateMonth("prev")}
                className="p-2"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={navigateToToday}
                className="px-3"
              >
                Aujourd'hui
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigateMonth("next")}
                className="p-2"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center border rounded-md">
              <Button
                variant={viewMode === "month" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("month")}
                className="rounded-r-none border-r"
              >
                <Grid3X3 className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "week" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("week")}
                className="rounded-none border-r"
              >
                <List className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "day" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("day")}
                className="rounded-l-none"
              >
                <Eye className="h-4 w-4" />
              </Button>
            </div>

            <Button
              size="sm"
              className="gap-2"
              onClick={() => {
                setSessionFormDate(new Date());
                setShowSessionForm(true);
              }}
            >
              <Plus className="h-4 w-4" />
              Nouvelle session
            </Button>
          </div>
        </div>

        {/* Statistiques rapides + Indicateur professeur */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded bg-chart-3/10 border border-chart-3/20"></div>
              <span>
                {
                  calendarEvents.filter(
                    (e) => e.courseSession.status === "done",
                  ).length
                }{" "}
                Terminées
              </span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded bg-chart-1/10 border border-chart-1/20"></div>
              <span>
                {
                  calendarEvents.filter(
                    (e) => e.courseSession.status === "in_progress",
                  ).length
                }{" "}
                En cours
              </span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded bg-chart-4/10 border border-chart-4/20"></div>
              <span>
                {
                  calendarEvents.filter(
                    (e) => e.courseSession.status === "planned",
                  ).length
                }{" "}
                À venir
              </span>
            </div>
          </div>

          <div className="text-xs text-muted-foreground bg-muted/50 px-2 py-1 rounded">
            👨‍🏫 Mon calendrier personnel
          </div>
        </div>
      </CardHeader>

      <CardContent>
        {viewMode === "month" && (
          <div className="space-y-4">
            {/* En-têtes des jours */}
            <div className="grid grid-cols-7 gap-1">
              {weekDays.map((day) => (
                <div
                  key={day}
                  className="p-2 text-center text-sm font-medium text-muted-foreground"
                >
                  {day}
                </div>
              ))}
            </div>

            {/* Grille du calendrier */}
            <div className="space-y-1">
              {calendarWeeks.map((week) => (
                <div key={week.weekNumber} className="grid grid-cols-7 gap-1">
                  {week.days.map((day) => (
                    <button
                      type="button"
                      key={day.date.toISOString()}
                      className={`min-h-24 p-2 border rounded-md cursor-pointer hover:bg-muted/50 transition-colors text-left w-full ${
                        day.isToday
                          ? "border-primary bg-primary/5"
                          : day.isCurrentMonth
                            ? "border-border"
                            : "border-border/50 bg-muted/20"
                      }`}
                      onClick={() => setSelectedDate(day.date)}
                      onDoubleClick={() => {
                        setSessionFormDate(day.date);
                        setShowSessionForm(true);
                      }}
                    >
                      <div
                        className={`text-sm mb-1 ${
                          day.isToday
                            ? "font-bold text-primary"
                            : day.isCurrentMonth
                              ? "text-foreground"
                              : "text-muted-foreground"
                        }`}
                      >
                        {day.date.getDate()}
                      </div>

                      <div className="space-y-1">
                        {day.events.slice(0, 3).map((event) => (
                          <EventCard key={event.id} event={event} />
                        ))}
                        {day.events.length > 3 && (
                          <div className="text-xs text-muted-foreground text-center">
                            +{day.events.length - 3} autres
                          </div>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              ))}
            </div>
          </div>
        )}

        {viewMode === "week" && (
          <div className="space-y-4">
            <div className="text-sm text-muted-foreground text-center">
              Vue semaine - Fonctionnalité à venir
            </div>
          </div>
        )}

        {viewMode === "day" && (
          <div className="space-y-4">
            <div className="text-sm text-muted-foreground text-center">
              Vue jour - Fonctionnalité à venir
            </div>
          </div>
        )}
      </CardContent>

      {/* Modal/Sidebar pour les détails du jour sélectionné */}
      {selectedDate && (
        <Card className="mt-4 border-primary/20 bg-primary/5">
          <CardHeader>
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">
                {selectedDate.toLocaleDateString("fr-FR", {
                  weekday: "long",
                  day: "numeric",
                  month: "long",
                })}
              </h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedDate(null)}
              >
                ×
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {getEventsForDay(selectedDate).length > 0 ? (
              <div className="space-y-3">
                {getEventsForDay(selectedDate).map((event) => (
                  <Card key={event.id} className="border-l-4 border-l-primary">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h4 className="font-medium">{event.title}</h4>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {event.timeSlot.startTime} -{" "}
                              {event.timeSlot.endTime}
                            </span>
                            <span className="flex items-center gap-1">
                              <Users className="h-3 w-3" />
                              {event.class.classCode}
                            </span>
                          </div>
                        </div>
                        <Badge className={getEventStatusColor(event)}>
                          {event.courseSession.status === "done" &&
                            "Terminé"}
                          {event.courseSession.status === "in_progress" &&
                            "En cours"}
                          {event.courseSession.status === "planned" &&
                            "À venir"}
                        </Badge>
                      </div>

                      {event.courseSession.objectives && (
                        <p className="text-sm text-muted-foreground mb-3">
                          {event.courseSession.objectives}
                        </p>
                      )}

                      <div className="flex gap-2">
                        {event.canView && (
                          <Link
                            href={`/dashboard/sessions/${event.courseSession.id}`}
                          >
                            <Button
                              variant="outline"
                              size="sm"
                              className="gap-2"
                            >
                              <Eye className="h-3 w-3" />
                              Voir session
                            </Button>
                          </Link>
                        )}
                        {event.canEdit &&
                          event.courseSession.status === "planned" && (
                            <Button
                              variant="outline"
                              size="sm"
                              className="gap-2"
                            >
                              <CalendarIcon className="h-3 w-3" />
                              Modifier
                            </Button>
                          )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <CalendarIcon className="h-12 w-12 mx-auto mb-4" />
                <div className="mb-4">Aucune session prévue ce jour</div>
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-2"
                  onClick={() => {
                    setSessionFormDate(selectedDate);
                    setShowSessionForm(true);
                  }}
                >
                  <Plus className="h-3 w-3" />
                  Créer une session
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Formulaire de création de session */}
      <Dialog
        open={showSessionForm}
        onOpenChange={(open) => {
          if (!open) {
            setShowSessionForm(false);
            setSessionFormDate(null);
          }
        }}
      >
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Nouvelle session</DialogTitle>
          </DialogHeader>
          <SessionForm
            onClose={() => {
              setShowSessionForm(false);
              setSessionFormDate(null);
            }}
            onSave={(session) => {
              addSession(session);
              setShowSessionForm(false);
              setSessionFormDate(null);
            }}
            initialDate={sessionFormDate || undefined}
            subjects={subjects}
            classes={classes}
            timeSlots={timeSlots}
            teacherId={teacherId}
            schoolYearId="year-2025"
            standalone={false}
          />
        </DialogContent>
      </Dialog>
    </Card>
  );
}
