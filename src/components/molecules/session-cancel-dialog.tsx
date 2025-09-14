"use client";

import { BookOpen, Calendar, Clock, Users, XCircle } from "lucide-react";
import { Button } from "@/components/atoms/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/atoms/dialog";
import type { CourseSession } from "@/types/uml-entities";

interface SessionCancelDialogProps {
  session: CourseSession | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (sessionId: string) => void;
  isLoading?: boolean;
}

/**
 * Dialog de confirmation pour l'annulation d'une séance
 * Affiche les détails de la séance pour confirmation
 */
export function SessionCancelDialog({
  session,
  open,
  onOpenChange,
  onConfirm,
  isLoading = false,
}: SessionCancelDialogProps) {
  const handleConfirm = () => {
    if (!session) return;
    onConfirm(session.id);
  };

  const handleCancel = () => {
    onOpenChange(false);
  };

  if (!session) return null;

  // Format date and time for display
  const sessionDate = new Date(session.sessionDate);
  const dateStr = sessionDate.toLocaleDateString("fr-FR", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <XCircle className="h-5 w-5 text-destructive" />
            Annuler la séance
          </DialogTitle>
          <DialogDescription>
            Voulez-vous vraiment annuler cette séance ? Le statut de la séance
            sera changé à "annulée".
          </DialogDescription>
        </DialogHeader>

        {/* Session Details */}
        <div className="space-y-4 py-4">
          <div className="rounded-lg border bg-muted/20 p-4">
            <h4 className="font-medium mb-3">Détails de la séance</h4>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span>{dateStr}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span>Créneaux : {session.timeSlotId}</span>
              </div>
              <div className="flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-muted-foreground" />
                <span>Matière : {session.subjectId}</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-muted-foreground" />
                <span>Classe : {session.classId}</span>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="flex gap-2">
          <Button variant="outline" onClick={handleCancel} disabled={isLoading}>
            Garder la séance
          </Button>
          <Button
            variant="destructive"
            onClick={handleConfirm}
            disabled={isLoading}
            className="flex items-center gap-2"
          >
            <XCircle className="h-4 w-4" />
            {isLoading ? "Annulation..." : "Annuler la séance"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
