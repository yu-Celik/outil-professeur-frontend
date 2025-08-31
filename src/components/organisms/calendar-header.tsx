"use client";

import { CalendarDays } from "lucide-react";

export function CalendarHeader() {
  return (
    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
      <div className="space-y-1">
        <h1 className="text-4xl font-bold tracking-tight flex items-center gap-3">
          <CalendarDays className="h-10 w-10 text-primary" />
          Calendrier
        </h1>
        <p className="text-lg text-muted-foreground">
          Planifiez et gérez vos sessions de cours
        </p>
      </div>
    </div>
  );
}
