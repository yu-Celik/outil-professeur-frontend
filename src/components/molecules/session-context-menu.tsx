"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/molecules/dropdown-menu";
import { Button } from "@/components/atoms/button";
import {
  MoreHorizontal,
  Users,
  FileText,
  XCircle,
  ArrowRightLeft,
} from "lucide-react";
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
 * Permet la navigation vers les détails et gestion des présences
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
          Gérer les présences
        </DropdownMenuItem>

        {/* Show move option only if session can be moved */}
        {canMove && session.status !== "canceled" && onMove && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => onMove(session)}>
              <ArrowRightLeft className="mr-2 h-4 w-4" />
              Déplacer la séance
            </DropdownMenuItem>
          </>
        )}

        {/* Show cancel option only if session is not already canceled and can be canceled */}
        {canCancel && session.status !== "canceled" && onCancel && (
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
