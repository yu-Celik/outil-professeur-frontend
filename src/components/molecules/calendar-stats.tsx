"use client";

import { StatCard } from "@/components/atoms/stat-card";

interface CalendarStatsProps {
  stats: {
    total: number;
    completed: number;
    upcoming: number;
    active: number;
  };
}

export function CalendarStats({ stats }: CalendarStatsProps) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard value={stats.total} label="Total" variant="blue" />
      <StatCard value={stats.completed} label="Terminées" variant="green" />
      <StatCard value={stats.upcoming} label="À venir" variant="orange" />
      <StatCard value={stats.active} label="En cours" variant="purple" />
    </div>
  );
}
