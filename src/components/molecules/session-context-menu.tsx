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
} from "lucide-react";
import type { CourseSession } from "@/types/uml-entities";

interface SessionContextMenuProps {
  session: CourseSession;
  onViewDetails: (sessionId: string) => void;
  onManageAttendance: (sessionId: string) => void;
}

/**
 * Menu contextuel pour les actions sur une session
 * Permet la navigation vers les détails et gestion des présences
 */
export function SessionContextMenu({
  session,
  onViewDetails,
  onManageAttendance,
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
      </DropdownMenuContent>
    </DropdownMenu>
  );
}