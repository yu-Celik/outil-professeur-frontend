"use client";

import { Card } from "@/components/atoms/card";
import { Badge } from "@/components/atoms/badge";
import { ExamProgressRing } from "@/components/atoms/exam-progress-ring";
import { 
  FileText, 
  Clock, 
  CheckCircle, 
  TrendingUp,
  Users,
  UserCheck,
  UserX,
  Target,
} from "lucide-react";
import type { ExamStatistics } from "@/features/evaluations";

export interface ExamStatisticsCardsProps {
  statistics: ExamStatistics;
  className?: string;
}

export function ExamStatisticsCards({ statistics, className = "" }: ExamStatisticsCardsProps) {
  const {
    totalStudents,
    submittedCount,
    absentCount,
    averageGrade,
    medianGrade,
    minGrade,
    maxGrade,
    passRate,
  } = statistics;

  const participationRate = totalStudents > 0 ? (submittedCount / totalStudents) * 100 : 0;

  return (
    <div className={`grid gap-4 md:grid-cols-2 lg:grid-cols-4 ${className}`}>
      {/* Participation */}
      <Card className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Users className="w-4 h-4 text-chart-1" />
              <h3 className="text-sm font-medium">Participation</h3>
            </div>
            <div className="text-2xl font-bold">{submittedCount}</div>
            <p className="text-xs text-muted-foreground">
              sur {totalStudents} élèves
            </p>
          </div>
          <ExamProgressRing
            percentage={participationRate}
            size="sm"
            color={participationRate >= 80 ? "green" : participationRate >= 60 ? "orange" : "red"}
          />
        </div>
        
        <div className="flex gap-2 mt-3">
          <Badge variant="outline" className="text-xs">
            <UserCheck className="w-3 h-3 mr-1" />
            {submittedCount} rendus
          </Badge>
          {absentCount > 0 && (
            <Badge variant="outline" className="text-xs">
              <UserX className="w-3 h-3 mr-1" />
              {absentCount} absents
            </Badge>
          )}
        </div>
      </Card>

      {/* Moyenne générale */}
      <Card className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-4 h-4 text-chart-3" />
              <h3 className="text-sm font-medium">Moyenne</h3>
            </div>
            <div className="text-2xl font-bold">
              {submittedCount > 0 ? averageGrade.toFixed(1) : "-"}
            </div>
            <p className="text-xs text-muted-foreground">
              {submittedCount > 0 ? `Médiane: ${medianGrade.toFixed(1)}` : "Aucune note"}
            </p>
          </div>
          
          {submittedCount > 0 && (
            <div className="text-right text-xs text-muted-foreground">
              <div>Min: {minGrade}</div>
              <div>Max: {maxGrade}</div>
            </div>
          )}
        </div>
      </Card>

      {/* Taux de réussite */}
      <Card className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Target className="w-4 h-4 text-chart-2" />
              <h3 className="text-sm font-medium">Réussite</h3>
            </div>
            <div className="text-2xl font-bold">
              {submittedCount > 0 ? `${passRate}%` : "-"}
            </div>
            <p className="text-xs text-muted-foreground">
              élèves en réussite
            </p>
          </div>
          
          {submittedCount > 0 && (
            <ExamProgressRing
              percentage={passRate}
              size="sm"
              color={passRate >= 80 ? "green" : passRate >= 60 ? "blue" : passRate >= 40 ? "orange" : "red"}
            />
          )}
        </div>
        
        {submittedCount > 0 && (
          <div className="mt-3">
            <Badge 
              variant={passRate >= 80 ? "default" : passRate >= 60 ? "secondary" : "outline"}
              className="text-xs"
            >
              {Math.round((passRate / 100) * submittedCount)} / {submittedCount} réussis
            </Badge>
          </div>
        )}
      </Card>

      {/* Statut global */}
      <Card className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="w-4 h-4 text-chart-4" />
              <h3 className="text-sm font-medium">Statut</h3>
            </div>
            <div className="text-2xl font-bold">
              {submittedCount === 0 ? "En attente" : "Corrigé"}
            </div>
            <p className="text-xs text-muted-foreground">
              {submittedCount === 0 
                ? "Aucune copie corrigée" 
                : submittedCount === totalStudents 
                  ? "Correction terminée"
                  : "Correction en cours"
              }
            </p>
          </div>
        </div>
        
        <div className="mt-3">
          {submittedCount === 0 && (
            <Badge variant="outline" className="text-xs">
              <Clock className="w-3 h-3 mr-1" />
              À corriger
            </Badge>
          )}
          {submittedCount > 0 && submittedCount < totalStudents && (
            <Badge variant="secondary" className="text-xs">
              <Clock className="w-3 h-3 mr-1" />
              En cours
            </Badge>
          )}
          {submittedCount === totalStudents && totalStudents > 0 && (
            <Badge variant="default" className="text-xs">
              <CheckCircle className="w-3 h-3 mr-1" />
              Terminé
            </Badge>
          )}
        </div>
      </Card>
    </div>
  );
}