"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/atoms/dialog";
import { Button } from "@/components/atoms/button";
import { Label } from "@/components/atoms/label";
import { Checkbox } from "@/components/atoms/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/atoms/select";
import { 
  FileSpreadsheet,
  FileText, 
  Download,
  Settings,
  Users,
  BarChart,
} from "lucide-react";
import { useExamManagement } from "@/features/evaluations";
import { useNotationSystem } from "@/features/evaluations";
import type { Exam, Student } from "@/types/uml-entities";
import { MOCK_STUDENTS } from "@/features/students/mocks";

export interface ExamExportDialogProps {
  isOpen: boolean;
  onClose: () => void;
  exam: Exam;
}

interface ExportConfig {
  format: "csv" | "pdf" | "excel";
  includeStatistics: boolean;
  includeComments: boolean;
  includeAbsent: boolean;
  sortBy: "name" | "grade" | "id";
  showGradeScale: boolean;
  includeClassAverage: boolean;
}

export function ExamExportDialog({ isOpen, onClose, exam }: ExamExportDialogProps) {
  const [isExporting, setIsExporting] = useState(false);
  const [config, setConfig] = useState<ExportConfig>({
    format: "csv",
    includeStatistics: true,
    includeComments: true,
    includeAbsent: true,
    sortBy: "name",
    showGradeScale: true,
    includeClassAverage: true,
  });

  const { getResultsForExam, getExamStatistics } = useExamManagement();
  const { notationSystems, formatGrade } = useNotationSystem();

  const examResults = getResultsForExam(exam.id);
  const statistics = getExamStatistics(exam.id);
  const notationSystem = notationSystems.find(ns => ns.id === exam.notationSystemId);
  const classStudents = MOCK_STUDENTS.filter(student => student.currentClassId === exam.classId);

  const updateConfig = <K extends keyof ExportConfig>(
    key: K,
    value: ExportConfig[K]
  ) => {
    setConfig(prev => ({ ...prev, [key]: value }));
  };

  const generateCSVContent = (): string => {
    const headers = ["ID Élève", "Nom", "Prénom"];
    
    if (config.includeAbsent || examResults.some(r => !r.isAbsent)) {
      headers.push("Statut");
    }
    
    headers.push("Note brute", "Note formatée");
    
    if (config.showGradeScale && notationSystem) {
      headers.push(`Note sur ${notationSystem.maxValue}`);
    }
    
    headers.push("Pourcentage");
    
    if (config.includeComments) {
      headers.push("Commentaires");
    }

    let csvContent = headers.join(",") + "\n";

    // Trier les étudiants
    let sortedStudents = [...classStudents];
    switch (config.sortBy) {
      case "name":
        sortedStudents.sort((a, b) => `${a.lastName} ${a.firstName}`.localeCompare(`${b.lastName} ${b.firstName}`));
        break;
      case "grade":
        sortedStudents.sort((a, b) => {
          const gradeA = examResults.find(r => r.studentId === a.id)?.pointsObtained || 0;
          const gradeB = examResults.find(r => r.studentId === b.id)?.pointsObtained || 0;
          return gradeB - gradeA;
        });
        break;
      case "id":
        sortedStudents.sort((a, b) => a.id.localeCompare(b.id));
        break;
    }

    // Filtrer les absents si nécessaire
    if (!config.includeAbsent) {
      sortedStudents = sortedStudents.filter(student => {
        const result = examResults.find(r => r.studentId === student.id);
        return !result?.isAbsent;
      });
    }

    // Ajouter les données des étudiants
    sortedStudents.forEach(student => {
      const result = examResults.find(r => r.studentId === student.id);
      const row = [];

      row.push(`"${student.id}"`);
      row.push(`"${student.lastName}"`);
      row.push(`"${student.firstName}"`);
      
      if (config.includeAbsent || examResults.some(r => !r.isAbsent)) {
        row.push(result?.isAbsent ? "Absent" : result ? "Présent" : "Non évalué");
      }
      
      const points = result?.pointsObtained || 0;
      row.push(result?.isAbsent ? "ABS" : points.toString());
      
      const formattedGrade = result?.isAbsent ? "ABS" : 
        notationSystem ? formatGrade(points, notationSystem, "fr-FR") : points.toString();
      row.push(`"${formattedGrade}"`);
      
      if (config.showGradeScale && notationSystem) {
        const scaledGrade = result?.isAbsent ? "ABS" : 
          ((points / exam.totalPoints) * notationSystem.maxValue).toFixed(2);
        row.push(scaledGrade);
      }
      
      const percentage = result?.isAbsent ? "ABS" : 
        `${((points / exam.totalPoints) * 100).toFixed(1)}%`;
      row.push(`"${percentage}"`);
      
      if (config.includeComments) {
        const comments = result?.comments || "";
        row.push(`"${comments.replace(/"/g, '""')}"`);
      }

      csvContent += row.join(",") + "\n";
    });

    // Ajouter les statistiques
    if (config.includeStatistics) {
      csvContent += "\n--- STATISTIQUES ---\n";
      csvContent += `Nombre total d'élèves,${statistics.totalStudents}\n`;
      csvContent += `Copies rendues,${statistics.submittedCount}\n`;
      csvContent += `Absents,${statistics.absentCount}\n`;
      csvContent += `Moyenne générale,${statistics.averageGrade.toFixed(2)}\n`;
      csvContent += `Note médiane,${statistics.medianGrade.toFixed(2)}\n`;
      csvContent += `Note minimale,${statistics.minGrade}\n`;
      csvContent += `Note maximale,${statistics.maxGrade}\n`;
      csvContent += `Taux de réussite,${statistics.passRate}%\n`;
    }

    return csvContent;
  };

  const handleExport = async () => {
    setIsExporting(true);
    
    try {
      let content = "";
      let filename = "";
      let mimeType = "";

      switch (config.format) {
        case "csv":
          content = generateCSVContent();
          filename = `examen-${exam.title.toLowerCase().replace(/\s+/g, '-')}-${exam.examDate.toISOString().split('T')[0]}.csv`;
          mimeType = "text/csv;charset=utf-8";
          break;
        case "excel":
          // Pour l'instant, on génère du CSV compatible Excel
          content = generateCSVContent();
          filename = `examen-${exam.title.toLowerCase().replace(/\s+/g, '-')}-${exam.examDate.toISOString().split('T')[0]}.csv`;
          mimeType = "text/csv;charset=utf-8";
          break;
        case "pdf":
          // Pour l'implémentation future du PDF
          console.log("Export PDF non encore implémenté");
          return;
      }

      // Créer et télécharger le fichier
      const blob = new Blob([content], { type: mimeType });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      onClose();
    } catch (error) {
      console.error("Erreur lors de l'export:", error);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Download className="w-5 h-5" />
            Exporter les résultats - {exam.title}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {/* Format d'export */}
          <div className="space-y-3">
            <Label className="text-base font-medium flex items-center gap-2">
              <FileSpreadsheet className="w-4 h-4" />
              Format d'export
            </Label>
            <Select value={config.format} onValueChange={(value: any) => updateConfig("format", value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="csv">
                  <div className="flex items-center gap-2">
                    <FileSpreadsheet className="w-4 h-4" />
                    CSV (Excel compatible)
                  </div>
                </SelectItem>
                <SelectItem value="excel">
                  <div className="flex items-center gap-2">
                    <FileSpreadsheet className="w-4 h-4" />
                    Excel (.xlsx)
                  </div>
                </SelectItem>
                <SelectItem value="pdf" disabled>
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    PDF (bientôt disponible)
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Options de contenu */}
          <div className="space-y-3">
            <Label className="text-base font-medium flex items-center gap-2">
              <Settings className="w-4 h-4" />
              Options de contenu
            </Label>
            <div className="grid gap-3 md:grid-cols-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="includeStatistics"
                  checked={config.includeStatistics}
                  onCheckedChange={(checked) => updateConfig("includeStatistics", !!checked)}
                />
                <Label htmlFor="includeStatistics" className="text-sm">
                  Inclure les statistiques
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="includeComments"
                  checked={config.includeComments}
                  onCheckedChange={(checked) => updateConfig("includeComments", !!checked)}
                />
                <Label htmlFor="includeComments" className="text-sm">
                  Inclure les commentaires
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="includeAbsent"
                  checked={config.includeAbsent}
                  onCheckedChange={(checked) => updateConfig("includeAbsent", !!checked)}
                />
                <Label htmlFor="includeAbsent" className="text-sm">
                  Inclure les élèves absents
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="showGradeScale"
                  checked={config.showGradeScale}
                  onCheckedChange={(checked) => updateConfig("showGradeScale", !!checked)}
                />
                <Label htmlFor="showGradeScale" className="text-sm">
                  Afficher l'échelle de notation
                </Label>
              </div>
            </div>
          </div>

          {/* Options de tri */}
          <div className="space-y-3">
            <Label className="text-base font-medium flex items-center gap-2">
              <Users className="w-4 h-4" />
              Tri des élèves
            </Label>
            <Select value={config.sortBy} onValueChange={(value: any) => updateConfig("sortBy", value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name">Par nom (A-Z)</SelectItem>
                <SelectItem value="grade">Par note (décroissant)</SelectItem>
                <SelectItem value="id">Par ID élève</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Aperçu des données */}
          <div className="bg-muted/50 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-3">
              <BarChart className="w-4 h-4" />
              <span className="font-medium">Aperçu de l'export</span>
            </div>
            <div className="grid gap-2 text-sm">
              <div className="flex justify-between">
                <span>Total d'élèves:</span>
                <span className="font-medium">{statistics.totalStudents}</span>
              </div>
              <div className="flex justify-between">
                <span>Copies à inclure:</span>
                <span className="font-medium">
                  {config.includeAbsent 
                    ? statistics.totalStudents 
                    : statistics.submittedCount
                  }
                </span>
              </div>
              <div className="flex justify-between">
                <span>Format:</span>
                <span className="font-medium uppercase">{config.format}</span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button type="button" variant="outline" onClick={onClose}>
              Annuler
            </Button>
            <Button onClick={handleExport} disabled={isExporting}>
              <Download className="w-4 h-4 mr-2" />
              {isExporting ? "Export en cours..." : "Exporter"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}