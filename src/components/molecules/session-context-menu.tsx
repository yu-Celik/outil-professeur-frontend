"use client";

import {
  ArrowRightLeft,
  FileText,
  MoreHorizontal,
  Users,
  XCircle,
} from "lucide-react";
import { Button } from "@/components/atoms/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/molecules/dropdown-menu";
import type { CourseSession } from "@/types/uml-entities";

interface SessionContextMenuProps {
  session: CourseSession;
  onViewDetails: (sessionId: string) => void;
  onManageAttendance: (sessionId: string) => void;
  onMove?: (session: CourseSession) => void;
  onCancel?: (session: CourseSession) => void;
  canMove?: boolean;
  canCancel?: boolean;
}

/**
 * Menu contextuel pour les actions sur une session
 * Permet la navigation vers les détails et gestion de la participation
 */
export function SessionContextMenu({
  session,
  onViewDetails,
  onManageAttendance,
  onMove,
  onCancel,
  canMove = true,
  canCancel = true,
}: SessionContextMenuProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem onClick={() => onViewDetails(session.id)}>
          <FileText className="mr-2 h-4 w-4" />
          Voir les détails
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem onClick={() => onManageAttendance(session.id)}>
          <Users className="mr-2 h-4 w-4" />
          Gérer la participation
        </DropdownMenuItem>

        {/* Show move option only if session can be moved */}
        {canMove && session.status !== "cancelled" && onMove && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => onMove(session)}>
              <ArrowRightLeft className="mr-2 h-4 w-4" />
              Déplacer la séance
            </DropdownMenuItem>
          </>
        )}

        {/* Show cancel option only if session is not already cancelled and can be cancelled */}
        {canCancel && session.status !== "cancelled" && onCancel && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => onCancel(session)}
              className="text-destructive focus:text-destructive"
            >
              <XCircle className="mr-2 h-4 w-4" />
              Annuler le cours
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
