"use client";

import { Card, CardContent } from "@/components/molecules/card";

interface StatCardProps {
  value: number;
  label: string;
  variant?: "blue" | "green" | "orange" | "purple";
}

export function StatCard({ value, label, variant = "blue" }: StatCardProps) {
  const variantClasses = {
    blue: "bg-gradient-to-br from-chart-1/10 to-chart-1/20 border-chart-1/30 text-chart-1",
    green:
      "bg-gradient-to-br from-chart-3/10 to-chart-3/20 border-chart-3/30 text-chart-3",
    orange:
      "bg-gradient-to-br from-chart-4/10 to-chart-4/20 border-chart-4/30 text-chart-4",
    purple:
      "bg-gradient-to-br from-chart-5/10 to-chart-5/20 border-chart-5/30 text-chart-5",
  };

  const textClasses = {
    blue: "text-chart-1",
    green: "text-chart-3",
    orange: "text-chart-4",
    purple: "text-chart-5",
  };

  return (
    <Card className={variantClasses[variant]}>
      <CardContent className="p-4 text-center">
        <div
          className={`text-2xl font-bold ${variantClasses[variant].split(" ")[4]}`}
        >
          {value}
        </div>
        <div className={`text-sm ${textClasses[variant]}`}>{label}</div>
      </CardContent>
    </Card>
  );
}
