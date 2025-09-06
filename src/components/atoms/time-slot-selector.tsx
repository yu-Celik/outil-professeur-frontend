"use client";

import * as React from "react";
import { ChevronDown } from "lucide-react";
import { Button } from "@/components/atoms/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/molecules/dropdown-menu";
import type { TimeSlot } from "@/types/uml-entities";

interface TimeSlotSelectorProps {
  value?: TimeSlot;
  onChange: (timeSlot: TimeSlot | undefined) => void;
  timeSlots: TimeSlot[];
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

export function TimeSlotSelector({
  value,
  onChange,
  timeSlots,
  placeholder = "Sélectionner un horaire",
  className,
  disabled,
}: TimeSlotSelectorProps) {
  const sortedTimeSlots = timeSlots
    .filter((slot) => !slot.isBreak)
    .sort((a, b) => a.displayOrder - b.displayOrder);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          disabled={disabled}
          className={`w-full justify-between ${!value ? "text-muted-foreground" : ""} ${className}`}
        >
          {value ? value.name : placeholder}
          <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-full p-0">
        {sortedTimeSlots.map((timeSlot) => (
          <DropdownMenuItem
            key={timeSlot.id}
            onClick={() => onChange(timeSlot)}
            className="flex flex-col items-start p-3"
          >
            <span className="font-medium">{timeSlot.name}</span>
            <span className="text-xs text-muted-foreground">
              Durée : {timeSlot.durationMinutes} minutes
            </span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
