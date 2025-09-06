"use client";

import * as React from "react";
import { AlertTriangle, ArrowRightLeft } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/molecules/dialog";
import { Button } from "@/components/atoms/button";
import { DatePicker } from "@/components/atoms/date-picker";
import { TimeSlotSelector } from "@/components/atoms/time-slot-selector";
import { Badge } from "@/components/atoms/badge";
import type {
  CourseSession,
  TimeSlot,
  Class,
  Subject,
} from "@/types/uml-entities";

interface SessionMoveDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  session: CourseSession;
  sessionClass: Class;
  subject: Subject;
  timeSlots: TimeSlot[];
  onMove: (sessionId: string, newDate: Date, newTimeSlot: TimeSlot) => void;
  conflictingSessions?: CourseSession[];
}

/**
 * Modal pour déplacer une séance de cours
 * Affiche le contexte de la séance et permet de choisir une nouvelle date/heure
 */
export function SessionMoveDialog({
  open,
  onOpenChange,
  session,
  sessionClass,
  subject,
  timeSlots,
  onMove,
  conflictingSessions = [],
}: SessionMoveDialogProps) {
  const [newDate, setNewDate] = React.useState<Date | undefined>();
  const [newTimeSlot, setNewTimeSlot] = React.useState<TimeSlot | undefined>();
  const [forceMove, setForceMove] = React.useState(false);

  // Reset form when dialog opens/closes
  React.useEffect(() => {
    if (open) {
      setNewDate(undefined);
      setNewTimeSlot(undefined);
      setForceMove(false);
    }
  }, [open]);

  const formatOriginalDateTime = () => {
    const sessionDate = new Date(session.sessionDate);
    const timeSlot = timeSlots.find((ts) => ts.id === session.timeSlotId);

    const dateStr = new Intl.DateTimeFormat("fr-FR", {
      weekday: "long",
      day: "numeric",
      month: "long",
    }).format(sessionDate);

    return `${dateStr} — ${timeSlot?.name || "Horaire non défini"}`;
  };

  const formatNewDateTime = () => {
    if (!newDate || !newTimeSlot) return "";

    const dateStr = new Intl.DateTimeFormat("fr-FR", {
      weekday: "long",
      day: "numeric",
      month: "long",
    }).format(newDate);

    return `${dateStr} — ${newTimeSlot.name}`;
  };

  const hasConflict = () => {
    if (!newDate || !newTimeSlot) return false;

    return conflictingSessions.some((cs) => {
      const csDate = new Date(cs.sessionDate);
      return (
        csDate.toDateString() === newDate.toDateString() &&
        cs.timeSlotId === newTimeSlot.id &&
        cs.classId === session.classId &&
        cs.id !== session.id
      );
    });
  };

  const canMove = () => {
    return newDate && newTimeSlot && (!hasConflict() || forceMove);
  };

  const handleMove = () => {
    if (!newDate || !newTimeSlot) return;

    onMove(session.id, newDate, newTimeSlot);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent size="md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ArrowRightLeft className="h-5 w-5" />
            Déplacer la séance
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Contexte figé (lecture seule) */}
          <div className="rounded-lg border bg-muted/50 p-4 space-y-2">
            <h3 className="text-sm font-medium text-muted-foreground">
              Séance prévue
            </h3>
            <div className="space-y-1">
              <p className="font-medium">{formatOriginalDateTime()}</p>
              <p className="text-sm text-muted-foreground">
                Matière : {subject.name}
              </p>
              <p className="text-sm text-muted-foreground">
                Classe : {sessionClass.classCode}
              </p>
              {session.room && (
                <p className="text-sm text-muted-foreground">
                  Salle : {session.room}
                </p>
              )}
            </div>
          </div>

          {/* Sélection nouvelle date et heure */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium">Nouvelle date et heure</h3>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Date</label>
                <DatePicker
                  value={newDate}
                  onChange={setNewDate}
                  placeholder="Choisir une date"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Horaire</label>
                <TimeSlotSelector
                  value={newTimeSlot}
                  onChange={setNewTimeSlot}
                  timeSlots={timeSlots}
                  placeholder="Choisir un horaire"
                />
              </div>
            </div>
          </div>

          {/* Gestion des conflits */}
          {hasConflict() && (
            <div className="rounded-lg border border-orange-200 bg-orange-50 p-4 space-y-3">
              <div className="flex items-center gap-2 text-orange-700">
                <AlertTriangle className="h-4 w-4" />
                <span className="font-medium">Conflit détecté</span>
              </div>
              <p className="text-sm text-orange-700">
                La classe {sessionClass.classCode} a déjà une séance à{" "}
                {newTimeSlot?.name}.
              </p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setNewDate(undefined);
                    setNewTimeSlot(undefined);
                  }}
                >
                  Choisir un autre horaire
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setForceMove(true)}
                  className="text-orange-700 border-orange-300 hover:bg-orange-100"
                >
                  Forcer quand même
                </Button>
              </div>
            </div>
          )}

          {/* Aperçu du changement */}
          {newDate && newTimeSlot && (
            <div className="rounded-lg border bg-green-50 p-4">
              <h4 className="text-sm font-medium text-green-800 mb-2">
                Nouvelle séance programmée
              </h4>
              <p className="text-sm text-green-700">{formatNewDateTime()}</p>
            </div>
          )}
        </div>

        {/* Micro-copy */}
        <div className="text-xs text-muted-foreground">
          Ce déplacement n'affecte que cette date.
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Annuler
          </Button>
          <Button onClick={handleMove} disabled={!canMove()}>
            Enregistrer le déplacement
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
