"use client";

import { forwardRef, useState } from "react";
import { Input } from "@/components/atoms/input";
import { cn } from "@/lib/utils";
import type { NotationSystem } from "@/types/uml-entities";

interface GradeInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'value'> {
  value?: number | null;
  onChange?: (value: number | null) => void;
  notationSystem?: NotationSystem;
  isAbsent?: boolean;
  error?: string;
}

export const GradeInput = forwardRef<HTMLInputElement, GradeInputProps>(
  ({ value, onChange, notationSystem, isAbsent, error, className, ...props }, ref) => {
    const [stringValue, setStringValue] = useState(
      value !== null && value !== undefined ? value.toString() : ""
    );

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value;
      setStringValue(newValue);

      if (newValue === "" || newValue === null) {
        onChange?.(null);
        return;
      }

      const numericValue = parseFloat(newValue);
      if (!isNaN(numericValue)) {
        // Validate against notation system if provided
        if (notationSystem && !notationSystem.validateGrade(numericValue)) {
          return; // Don't update if invalid
        }
        onChange?.(numericValue);
      }
    };

    const getInputClassName = () => {
      let classes = "text-center font-medium";

      if (isAbsent) {
        classes += " bg-muted text-muted-foreground";
      } else if (error) {
        classes += " border-destructive text-destructive";
      } else if (value !== null && value !== undefined) {
        if (value >= 16) classes += " text-green-600";
        else if (value >= 14) classes += " text-blue-600";
        else if (value >= 12) classes += " text-orange-600";
        else if (value >= 10) classes += " text-yellow-600";
        else classes += " text-red-600";
      }

      return classes;
    };

    const placeholder = isAbsent
      ? "ABS"
      : notationSystem
        ? `0-${notationSystem.maxValue}`
        : "Note";

    return (
      <div className="relative">
        <Input
          ref={ref}
          type="number"
          value={stringValue}
          onChange={handleChange}
          disabled={isAbsent}
          placeholder={placeholder}
          className={cn(getInputClassName(), className)}
          min={notationSystem?.minValue}
          max={notationSystem?.maxValue}
          step="0.5"
          {...props}
        />
        {error && (
          <div className="absolute -bottom-5 left-0 text-xs text-destructive">
            {error}
          </div>
        )}
      </div>
    );
  }
);

GradeInput.displayName = "GradeInput";