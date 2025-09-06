"use client";

import * as React from "react";
import { CalendarIcon } from "lucide-react";
import { Input } from "@/components/atoms/input";

interface DatePickerProps {
  value?: Date;
  onChange: (date: Date | undefined) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

export function DatePicker({
  value,
  onChange,
  placeholder = "Sélectionner une date",
  className,
  disabled,
}: DatePickerProps) {
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = event.target.value;
    if (inputValue) {
      const date = new Date(inputValue);
      if (!isNaN(date.getTime())) {
        onChange(date);
      }
    } else {
      onChange(undefined);
    }
  };

  const formatDateForInput = (date: Date): string => {
    return date.toISOString().split("T")[0];
  };

  const formatDateForDisplay = (date: Date): string => {
    return new Intl.DateTimeFormat("fr-FR", {
      weekday: "long",
      day: "numeric",
      month: "long",
    }).format(date);
  };

  return (
    <div className={`relative ${className}`}>
      <Input
        type="date"
        value={value ? formatDateForInput(value) : ""}
        onChange={handleInputChange}
        placeholder={placeholder}
        disabled={disabled}
        className="w-full pr-10"
      />
      <CalendarIcon className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      {value && (
        <div className="mt-1 text-xs text-muted-foreground">
          {formatDateForDisplay(value)}
        </div>
      )}
    </div>
  );
}
