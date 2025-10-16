"use client";

import { Calendar, Clock, Users, X } from "lucide-react";
import { Button } from "@/components/atoms/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/atoms/dialog";
import { SessionCard } from "@/components/molecules/session-card";
import type { CalendarEvent } from "@/features/calendar";

interface SessionDetailModalProps {
  date: Date | null;
  events: CalendarEvent[];
  isOpen: boolean;
  onClose: () => void;
  onCreateSession?: (date: Date) => void;
  onEditSession?: (event: CalendarEvent) => void;
  getStatusColor: (status: string) => string;
}

export function SessionDetailModal({
  date,
  events,
  isOpen,
  onClose,
  onCreateSession,
  onEditSession,
  getStatusColor,
}: SessionDetailModalProps) {
  if (!date) return null;

  const formattedDate = date.toLocaleDateString("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              {formattedDate}
            </DialogTitle>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          {events.length > 0 ? (
            <>
              <p className="text-sm text-muted-foreground">
                {events.length} session{events.length > 1 ? "s" : ""} prévue{events.length > 1 ? "s" : ""}
              </p>
              <div className="space-y-3">
                {events.map((event) => (
                  <SessionCard
                    key={event.id}
                    event={event}
                    getStatusColor={getStatusColor}
                    onEdit={onEditSession}
                  />
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-12">
              <Calendar className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">Aucune session prévue</h3>
              <p className="text-sm text-muted-foreground mb-6">
                Aucune session planifiée pour cette date
              </p>
              {onCreateSession && (
                <Button
                  variant="outline"
                  onClick={() => {
                    onCreateSession(date);
                    onClose();
                  }}
                >
                  <Clock className="h-4 w-4 mr-2" />
                  Créer une session
                </Button>
              )}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
