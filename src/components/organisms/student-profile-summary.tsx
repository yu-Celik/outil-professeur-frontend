"use client";

import { CheckCircle, FileText } from "lucide-react";
import { Badge } from "@/components/atoms/badge";
import { Button } from "@/components/atoms/button";
import { Card, CardContent, CardHeader } from "@/components/molecules/card";
import type { StudentProfile, AcademicPeriod } from "@/types/uml-entities";

interface StudentProfileSummaryProps {
  currentProfile: StudentProfile | null;
  currentPeriod: AcademicPeriod;
  canEditStudentData: boolean;
  onValidateProfile: () => void;
}

export function StudentProfileSummary({
  currentProfile,
  currentPeriod,
  canEditStudentData,
  onValidateProfile,
}: StudentProfileSummaryProps) {
  if (!currentProfile) return null;

  return (
    <Card className="border-primary/20 bg-primary/5">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold">Profil étudiant généré</h3>
            <p className="text-sm text-muted-foreground">
              Généré automatiquement le{" "}
              {currentProfile.generatedAt.toLocaleDateString("fr-FR")}
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="gap-2">
              <FileText className="h-4 w-4" />
              Exporter PDF
            </Button>
            <Button
              className="gap-2"
              disabled={!canEditStudentData}
              onClick={onValidateProfile}
            >
              <CheckCircle className="h-4 w-4" />
              Valider profil
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid md:grid-cols-3 gap-4 text-sm">
          <div>
            <span className="font-medium">Statut:</span>
            <Badge className="ml-2 bg-chart-3/10 text-chart-3 border-chart-3/20">
              {currentProfile.status}
            </Badge>
          </div>
          <div>
            <span className="font-medium">Période:</span>
            <span className="ml-2">{currentPeriod.name}</span>
          </div>
          <div>
            <span className="font-medium">Matières évaluées:</span>
            <span className="ml-2">
              {Array.isArray(currentProfile.evidenceRefs.subjects)
                ? (currentProfile.evidenceRefs.subjects as string[]).join(", ")
                : "Aucune matière"}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}