"use client";

import {
  AlertTriangle,
  CalendarRange,
  CheckCircle,
  Edit,
  Plus,
  Trash2,
} from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/atoms/badge";
import { Button } from "@/components/atoms/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/atoms/dialog";
import { Input } from "@/components/atoms/input";
import { Label } from "@/components/atoms/label";
import { useAcademicPeriods } from "@/features/gestion/hooks";
import type { AcademicPeriod, SchoolYear } from "@/types/uml-entities";

interface AcademicPeriodsDialogProps {
  schoolYear: SchoolYear;
  teacherId?: string;
  useMockData?: boolean;
  onClose: () => void;
}

export function AcademicPeriodsDialog({
  schoolYear,
  teacherId,
  useMockData = false,
  onClose,
}: AcademicPeriodsDialogProps) {
  const {
    periods,
    loading,
    createPeriod,
    updatePeriod,
    deletePeriod,
    setActivePeriod,
    getPeriodsBySchoolYear,
  } = useAcademicPeriods({
    teacherId,
    schoolYearId: schoolYear.id,
    useMockData,
  });

  const [showForm, setShowForm] = useState(false);
  const [editingPeriod, setEditingPeriod] = useState<AcademicPeriod | null>(
    null,
  );

  const schoolYearPeriods = getPeriodsBySchoolYear(schoolYear.id);
  const activePeriod = schoolYearPeriods.find((p) => p.isActive);

  const handleCreate = async (data: any) => {
    try {
      await createPeriod({
        schoolYearId: schoolYear.id,
        ...data,
      });
      setShowForm(false);
      setEditingPeriod(null);
    } catch (error) {
      console.error("Erreur lors de la création de la période:", error);
      throw error;
    }
  };

  const handleUpdate = async (data: any) => {
    try {
      if (!editingPeriod) return;
      await updatePeriod(editingPeriod.id, data);
      setShowForm(false);
      setEditingPeriod(null);
    } catch (error) {
      console.error("Erreur lors de la mise à jour de la période:", error);
      throw error;
    }
  };

  const handleDelete = async (id: string) => {
    if (
      confirm("Êtes-vous sûr de vouloir supprimer cette période académique ?")
    ) {
      await deletePeriod(id);
    }
  };

  const handleActivate = async (id: string) => {
    try {
      await setActivePeriod(id, schoolYear.id);
    } catch (error) {
      console.error("Erreur lors de l'activation de la période:", error);
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("fr-FR", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }).format(date);
  };

  const PeriodItem = ({ period }: { period: AcademicPeriod }) => {
    return (
      <div
        className={`group p-3 border rounded-lg transition-all ${
          period.isActive
            ? "bg-primary/5 border-primary"
            : "bg-background border-border hover:border-primary/50"
        }`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs">
              #{period.order}
            </Badge>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-medium">{period.name}</span>
                {period.isActive && (
                  <Badge variant="default" className="text-xs">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Actif
                  </Badge>
                )}
              </div>
              <div className="text-xs text-muted-foreground">
                {formatDate(period.startDate)} - {formatDate(period.endDate)}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1">
            {!period.isActive && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleActivate(period.id)}
              >
                Activer
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setEditingPeriod(period);
                setShowForm(true);
              }}
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleDelete(period.id)}
              className="text-destructive hover:text-destructive"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CalendarRange className="h-5 w-5" />
            Périodes académiques - {schoolYear.name}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Statistiques */}
          <div className="grid grid-cols-3 gap-3 p-4 bg-muted/30 rounded-lg">
            <div>
              <div className="text-lg font-bold">{schoolYearPeriods.length}</div>
              <div className="text-xs text-muted-foreground">Périodes</div>
            </div>
            <div>
              <div className="text-lg font-bold text-primary">
                {activePeriod ? 1 : 0}
              </div>
              <div className="text-xs text-muted-foreground">Active</div>
            </div>
            <div className="flex items-center justify-end">
              <Button onClick={() => setShowForm(true)} size="sm" className="gap-2">
                <Plus className="h-4 w-4" />
                Nouvelle période
              </Button>
            </div>
          </div>

          {/* Liste des périodes */}
          {schoolYearPeriods.length > 0 ? (
            <div className="space-y-2">
              {schoolYearPeriods
                .sort((a, b) => a.order - b.order)
                .map((period) => (
                  <PeriodItem key={period.id} period={period} />
                ))}
            </div>
          ) : (
            <div className="text-center py-8 border-2 border-dashed rounded-lg">
              <CalendarRange className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">
                Aucune période configurée pour cette année
              </p>
              <Button
                onClick={() => setShowForm(true)}
                variant="outline"
                size="sm"
                className="mt-3 gap-2"
              >
                <Plus className="h-4 w-4" />
                Créer une période
              </Button>
            </div>
          )}

          {/* Formulaire de création/édition */}
          {showForm && (
            <PeriodForm
              schoolYear={schoolYear}
              editingPeriod={editingPeriod}
              existingPeriods={schoolYearPeriods}
              onSubmit={editingPeriod ? handleUpdate : handleCreate}
              onCancel={() => {
                setShowForm(false);
                setEditingPeriod(null);
              }}
            />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ============================================================================
// Period Form Component
// ============================================================================

interface PeriodFormProps {
  schoolYear: SchoolYear;
  editingPeriod: AcademicPeriod | null;
  existingPeriods: AcademicPeriod[];
  onSubmit: (data: {
    name: string;
    order: number;
    startDate: Date;
    endDate: Date;
    isActive: boolean;
  }) => Promise<void>;
  onCancel: () => void;
}

function PeriodForm({
  schoolYear,
  editingPeriod,
  existingPeriods,
  onSubmit,
  onCancel,
}: PeriodFormProps) {
  const [name, setName] = useState(editingPeriod?.name ?? "");
  const [order, setOrder] = useState(
    editingPeriod?.order ?? existingPeriods.length + 1,
  );
  const [startDate, setStartDate] = useState(
    editingPeriod?.startDate.toISOString().split("T")[0] ??
      schoolYear.startDate.toISOString().split("T")[0],
  );
  const [endDate, setEndDate] = useState(
    editingPeriod?.endDate.toISOString().split("T")[0] ??
      schoolYear.endDate.toISOString().split("T")[0],
  );
  const [isActive, setIsActive] = useState(editingPeriod?.isActive ?? false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!name.trim()) {
      newErrors.name = "Le nom est requis";
    }

    if (!startDate) {
      newErrors.startDate = "La date de début est requise";
    }

    if (!endDate) {
      newErrors.endDate = "La date de fin est requise";
    }

    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);

      if (start >= end) {
        newErrors.endDate = "La date de fin doit être postérieure à la date de début";
      }

      // Check within school year bounds
      if (start < schoolYear.startDate) {
        newErrors.startDate = "La période doit commencer après le début de l'année scolaire";
      }

      if (end > schoolYear.endDate) {
        newErrors.endDate = "La période doit se terminer avant la fin de l'année scolaire";
      }

      // Check for overlaps
      const overlappingPeriod = existingPeriods.find((period) => {
        if (editingPeriod && period.id === editingPeriod.id) return false;

        return (
          (start >= period.startDate && start <= period.endDate) ||
          (end >= period.startDate && end <= period.endDate) ||
          (start <= period.startDate && end >= period.endDate)
        );
      });

      if (overlappingPeriod) {
        newErrors.startDate = `Chevauchement avec "${overlappingPeriod.name}"`;
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    setSubmitting(true);

    try {
      await onSubmit({
        name,
        order,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        isActive,
      });
    } catch (error) {
      console.error("Period form submission error:", error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 border rounded-lg bg-muted/30">
      <h3 className="font-semibold">
        {editingPeriod ? "Modifier la période" : "Nouvelle période"}
      </h3>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2 col-span-2">
          <Label htmlFor="name">Nom de la période</Label>
          <Input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="ex: Trimestre 1, Semestre 1"
            className={errors.name ? "border-destructive" : ""}
          />
          {errors.name && <p className="text-xs text-destructive">{errors.name}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="order">Ordre</Label>
          <Input
            id="order"
            type="number"
            min="1"
            value={order}
            onChange={(e) => setOrder(Number.parseInt(e.target.value))}
            className={errors.order ? "border-destructive" : ""}
          />
          {errors.order && <p className="text-xs text-destructive">{errors.order}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="isActive" className="flex items-center gap-2">
            <input
              id="isActive"
              type="checkbox"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
              className="h-4 w-4"
            />
            Période active
          </Label>
          {isActive && (
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <AlertTriangle className="h-3 w-3" />
              Les autres périodes seront désactivées
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="startDate">Date de début</Label>
          <Input
            id="startDate"
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className={errors.startDate ? "border-destructive" : ""}
          />
          {errors.startDate && (
            <p className="text-xs text-destructive">{errors.startDate}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="endDate">Date de fin</Label>
          <Input
            id="endDate"
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className={errors.endDate ? "border-destructive" : ""}
          />
          {errors.endDate && (
            <p className="text-xs text-destructive">{errors.endDate}</p>
          )}
        </div>
      </div>

      <div className="flex justify-end gap-2 pt-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Annuler
        </Button>
        <Button type="submit" disabled={submitting}>
          {submitting ? "Enregistrement..." : editingPeriod ? "Mettre à jour" : "Créer"}
        </Button>
      </div>
    </form>
  );
}
