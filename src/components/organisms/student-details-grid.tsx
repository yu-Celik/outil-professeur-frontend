"use client";

import {
  AlertTriangle,
  CheckCircle,
  Eye,
  Target,
  TrendingUp,
} from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/molecules/card";
import type { Student } from "@/types/uml-entities";

interface StudentDetailsGridProps {
  student: Student;
}

export function StudentDetailsGrid({ student }: StudentDetailsGridProps) {
  return (
    <div className="grid md:grid-cols-2 gap-6">
      {/* Points forts */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Target className="h-5 w-5 text-chart-3" />
            <h3 className="text-lg font-semibold">Points forts</h3>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {student.strengths.map((strength) => (
              <div key={strength} className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-chart-3" />
                <span className="text-sm">{strength}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Axes d'amélioration */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-chart-1" />
            <h3 className="text-lg font-semibold">Axes d'amélioration</h3>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {student.improvementAxes.map((axis) => (
              <div key={axis} className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-chart-1" />
                <span className="text-sm">{axis}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Besoins identifiés */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-chart-4" />
            <h3 className="text-lg font-semibold">Besoins identifiés</h3>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {student.needs.map((need) => (
              <div key={need} className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-chart-4" />
                <span className="text-sm">{need}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Observations */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Eye className="h-5 w-5 text-purple-600" />
            <h3 className="text-lg font-semibold">Observations</h3>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {student.observations.map((observation) => (
              <div key={observation} className="flex items-center gap-2">
                <Eye className="h-4 w-4 text-purple-600" />
                <span className="text-sm">{observation}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
