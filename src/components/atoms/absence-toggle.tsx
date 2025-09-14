"use client";

import { UserX, UserCheck } from "lucide-react";
import { Button } from "@/components/atoms/button";
import { cn } from "@/lib/utils";

interface AbsenceToggleProps {
  isAbsent: boolean;
  onChange: (isAbsent: boolean) => void;
  disabled?: boolean;
  size?: "sm" | "default";
  className?: string;
}

export function AbsenceToggle({
  isAbsent,
  onChange,
  disabled = false,
  size = "sm",
  className,
}: AbsenceToggleProps) {
  return (
    <Button
      variant={isAbsent ? "destructive" : "outline"}
      size={size}
      onClick={() => onChange(!isAbsent)}
      disabled={disabled}
      className={cn(
        "flex items-center gap-1.5",
        isAbsent && "bg-destructive/90 hover:bg-destructive",
        className
      )}
    >
      {isAbsent ? (
        <>
          <UserX className="h-3 w-3" />
          <span className="text-xs">ABS</span>
        </>
      ) : (
        <>
          <UserCheck className="h-3 w-3" />
          <span className="text-xs">Présent</span>
        </>
      )}
    </Button>
  );
}