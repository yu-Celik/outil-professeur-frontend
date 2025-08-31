"use client";

import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/molecules/dropdown-menu";
import { Button } from "@/components/atoms/button";
import { SessionExceptionForm } from "./session-exception-form";
import {
  MoreHorizontal,
  Calendar,
  Clock,
  AlertCircle,
  Users,
  FileText,
} from "lucide-react";
import type { CourseSession } from "@/types/uml-entities";
import type { SessionException } from "@/services/session-generator";

interface SessionContextMenuProps {
  session: CourseSession;
  onExceptionCreate: (exception: Omit<SessionException, "id">) => void;
  onViewDetails: (sessionId: string) => void;
  onManageAttendance: (sessionId: string) => void;
}

/**
 * Menu contextuel pour les actions sur une session
 * Permet les ajustements ponctuels et navigation
 */
export function SessionContextMenu({
  session,
  onExceptionCreate,
  onViewDetails,
  onManageAttendance,
}: SessionContextMenuProps) {
  const [showExceptionForm, setShowExceptionForm] = useState(false);

  const handleExceptionSave = (exception: Omit<SessionException, "id">) => {
    onExceptionCreate(exception);
    setShowExceptionForm(false);
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuItem onClick={() => onViewDetails(session.id)}>
            <FileText className="mr-2 h-4 w-4" />
            Voir les détails
          </DropdownMenuItem>

          <DropdownMenuItem onClick={() => onManageAttendance(session.id)}>
            <Users className="mr-2 h-4 w-4" />
            Gérer les présences
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <DropdownMenuItem
            onClick={() => setShowExceptionForm(true)}
            className="text-chart-4 focus:text-chart-4"
          >
            <Clock className="mr-2 h-4 w-4" />
            Déplacer cette séance
          </DropdownMenuItem>

          <DropdownMenuItem
            onClick={() => setShowExceptionForm(true)}
            className="text-destructive focus:text-destructive"
          >
            <AlertCircle className="mr-2 h-4 w-4" />
            Annuler cette séance
          </DropdownMenuItem>

          <DropdownMenuItem
            onClick={() => setShowExceptionForm(true)}
            className="text-chart-1 focus:text-chart-1"
          >
            <Calendar className="mr-2 h-4 w-4" />
            Programmer un rattrapage
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Formulaire d'exception */}
      {showExceptionForm && (
        <SessionExceptionForm
          session={session}
          onClose={() => setShowExceptionForm(false)}
          onSave={handleExceptionSave}
        />
      )}
    </>
  );
}
