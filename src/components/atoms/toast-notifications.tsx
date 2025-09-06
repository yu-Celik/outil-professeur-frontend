"use client";

import { toast } from "sonner";
import { Undo2 } from "lucide-react";

interface SessionMoveToastProps {
  newDateTime: string;
  onUndo?: () => void;
}

export const showSessionMoveToast = ({
  newDateTime,
  onUndo,
}: SessionMoveToastProps) => {
  toast.success(
    <div className="flex items-center justify-between w-full">
      <span>Séance déplacée vers {newDateTime}</span>
      {onUndo && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onUndo();
            toast.dismiss();
          }}
          className="flex items-center gap-1 text-sm underline hover:no-underline"
        >
          <Undo2 className="h-3 w-3" />
          Annuler
        </button>
      )}
    </div>,
    {
      duration: 5000,
      closeButton: true,
    },
  );
};

export const showSessionMoveErrorToast = (error: string) => {
  toast.error(`Erreur lors du déplacement : ${error}`, {
    duration: 4000,
  });
};

export const showSessionUndoMoveToast = () => {
  toast.info("Déplacement annulé", {
    duration: 3000,
  });
};
