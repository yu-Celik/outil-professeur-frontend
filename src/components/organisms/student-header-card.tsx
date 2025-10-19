"use client";

import { AlertCircle, FileText, MessageSquare } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/atoms/avatar";
import { Badge } from "@/components/atoms/badge";
import { Button } from "@/components/atoms/button";
import { Switch } from "@/components/atoms/switch";
import { Label } from "@/components/atoms/label";
import type { Student, SchoolYear, AcademicPeriod } from "@/types/uml-entities";

interface StudentHeaderCardProps {
  student: Student;
  schoolYear: SchoolYear;
  currentPeriod: AcademicPeriod;
  canContact: boolean;
  canGenerateReport: boolean;
  isWatchlisted?: boolean;
  onToggleWatchlist?: () => void;
}

export function StudentHeaderCard({
  student,
  schoolYear,
  currentPeriod,
  canContact,
  canGenerateReport,
  isWatchlisted = false,
  onToggleWatchlist,
}: StudentHeaderCardProps) {
  return (
    <div className="flex items-start gap-6">
      <Avatar className="w-24 h-24 border-4 border-primary/10">
        <AvatarImage src="" />
        <AvatarFallback className="bg-primary/10 text-primary text-2xl font-semibold">
          {student.firstName[0]}
          {student.lastName[0]}
        </AvatarFallback>
      </Avatar>

      <div className="flex-1">
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold text-foreground">
                {student.fullName()}
              </h1>
              {isWatchlisted && (
                <Badge
                  variant="destructive"
                  className="gap-1 bg-warning text-warning-foreground"
                >
                  <AlertCircle className="h-3 w-3" />À surveiller
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-4 text-muted-foreground">
              <p className="text-lg">Classe B1 • {schoolYear.name}</p>
              <Badge variant="outline">{currentPeriod.name}</Badge>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="gap-2" disabled={!canContact}>
              <MessageSquare className="h-4 w-4" />
              Contacter
            </Button>
            <Button
              variant="outline"
              className="gap-2"
              disabled={!canGenerateReport}
            >
              <FileText className="h-4 w-4" />
              Générer rapport
            </Button>
          </div>
        </div>

        {/* Watchlist Toggle */}
        {onToggleWatchlist && (
          <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
            <Switch
              id="watchlist-toggle"
              checked={isWatchlisted}
              onCheckedChange={onToggleWatchlist}
            />
            <Label
              htmlFor="watchlist-toggle"
              className="flex items-center gap-2 cursor-pointer text-sm"
            >
              <AlertCircle className="h-4 w-4" />
              Marquer cet élève à surveiller
            </Label>
          </div>
        )}
      </div>
    </div>
  );
}
