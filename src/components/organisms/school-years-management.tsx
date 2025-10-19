"use client";

import {
  Calendar,
  CalendarCheck,
  CalendarX,
  CheckCircle,
  Edit,
  Plus,
  Settings,
  Trash2,
} from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/atoms/badge";
import { Button } from "@/components/atoms/button";
import { Card, CardContent, CardHeader } from "@/components/molecules/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/atoms/dialog";
import { useSchoolYearManagement } from "@/features/gestion/hooks";
import type { SchoolYear } from "@/types/uml-entities";
import { SchoolYearCrudForm } from "@/components/organisms/school-year-crud-form";
import { AcademicPeriodsDialog } from "@/components/organisms/academic-periods-dialog";

interface SchoolYearsManagementProps {
  teacherId?: string;
  useMockData?: boolean;
}

export function SchoolYearsManagement({
  teacherId,
  useMockData = false,
}: SchoolYearsManagementProps) {
  const {
    schoolYears,
    loading,
    createSchoolYear,
    updateSchoolYear,
    deleteSchoolYear,
    activateSchoolYear,
    getActiveSchoolYear,
  } = useSchoolYearManagement({ teacherId, useMockData });

  const [showForm, setShowForm] = useState(false);
  const [editingYear, setEditingYear] = useState<SchoolYear | null>(null);
  const [managingPeriodsFor, setManagingPeriodsFor] =
    useState<SchoolYear | null>(null);

  const activeYear = getActiveSchoolYear();
  const inactiveYears = schoolYears.filter((y) => !y.isActive);

  const handleCreate = async (data: any) => {
    try {
      await createSchoolYear(data);
      setShowForm(false);
      setEditingYear(null);
    } catch (error) {
      console.error("Erreur lors de la création de l'année scolaire:", error);
      throw error;
    }
  };

  const handleUpdate = async (data: any) => {
    try {
      if (!editingYear) return;
      await updateSchoolYear(editingYear.id, data);
      setShowForm(false);
      setEditingYear(null);
    } catch (error) {
      console.error(
        "Erreur lors de la mise à jour de l'année scolaire:",
        error,
      );
      throw error;
    }
  };

  const handleDelete = async (id: string) => {
    if (
      confirm(
        "Êtes-vous sûr de vouloir supprimer cette année scolaire ? Cette action supprimera également toutes les périodes associées.",
      )
    ) {
      await deleteSchoolYear(id);
    }
  };

  const handleActivate = async (id: string) => {
    try {
      await activateSchoolYear(id);
    } catch (error) {
      console.error("Erreur lors de l'activation de l'année scolaire:", error);
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(date);
  };

  const SchoolYearItem = ({ year }: { year: SchoolYear }) => {
    return (
      <div
        className={`group p-4 border rounded-lg transition-all duration-200 ${
          year.isActive
            ? "bg-primary/5 border-primary"
            : "bg-background border-border hover:border-primary/50"
        }`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                year.isActive
                  ? "bg-primary/10 text-primary"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              <Calendar className="h-5 w-5" />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="font-medium">{year.name}</span>
                {year.isActive && (
                  <Badge variant="default" className="text-xs">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Actif
                  </Badge>
                )}
              </div>
              <div className="text-sm text-muted-foreground">
                {formatDate(year.startDate)} - {formatDate(year.endDate)}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setManagingPeriodsFor(year)}
              className="gap-2"
            >
              <Settings className="h-4 w-4" />
              Gérer les périodes
            </Button>

            {!year.isActive && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleActivate(year.id)}
                className="gap-2"
              >
                <CalendarCheck className="h-4 w-4" />
                Activer
              </Button>
            )}

            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setEditingYear(year);
                setShowForm(true);
              }}
            >
              <Edit className="h-4 w-4" />
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleDelete(year.id)}
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
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Calendar className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h2 className="text-xl font-semibold">Années scolaires</h2>
                <p className="text-sm text-muted-foreground">
                  Gérez les années scolaires et leurs périodes
                </p>
              </div>
            </div>
            <Button onClick={() => setShowForm(true)} className="gap-2">
              <Plus className="h-4 w-4" />
              Nouvelle année scolaire
            </Button>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Statistiques */}
          <div className="grid grid-cols-3 gap-4">
            <div className="p-3 bg-chart-1/10 border border-chart-1/20 rounded-lg">
              <div className="text-2xl font-bold text-chart-1">
                {schoolYears.length}
              </div>
              <div className="text-xs text-chart-1">Années scolaires</div>
            </div>
            <div className="p-3 bg-primary/10 border border-primary/20 rounded-lg">
              <div className="text-2xl font-bold text-primary">
                {activeYear ? 1 : 0}
              </div>
              <div className="text-xs text-primary">Année active</div>
            </div>
            <div className="p-3 bg-muted/50 border border-border rounded-lg">
              <div className="text-2xl font-bold text-muted-foreground">
                {inactiveYears.length}
              </div>
              <div className="text-xs text-muted-foreground">Archivées</div>
            </div>
          </div>

          {/* Année active */}
          {activeYear && (
            <div>
              <h3 className="font-semibold mb-3 text-foreground">
                Année active
              </h3>
              <SchoolYearItem year={activeYear} />
            </div>
          )}

          {/* Années archivées */}
          {inactiveYears.length > 0 && (
            <div>
              <h3 className="font-semibold mb-3 text-muted-foreground">
                Années archivées ({inactiveYears.length})
              </h3>
              <div className="space-y-2">
                {inactiveYears.map((year) => (
                  <SchoolYearItem key={year.id} year={year} />
                ))}
              </div>
            </div>
          )}

          {/* État vide */}
          {schoolYears.length === 0 && (
            <div className="text-center py-12">
              <div className="w-20 h-20 rounded-2xl bg-muted/50 flex items-center justify-center mx-auto mb-4">
                <CalendarX className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="font-semibold text-lg mb-2">
                Aucune année scolaire configurée
              </h3>
              <p className="text-muted-foreground mb-4 max-w-sm mx-auto">
                Créez votre première année scolaire pour commencer à gérer vos
                périodes et sessions
              </p>
              <Button onClick={() => setShowForm(true)} className="gap-2">
                <Plus className="h-4 w-4" />
                Créer une année scolaire
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modal de formulaire d'année scolaire */}
      <Dialog
        open={showForm}
        onOpenChange={(open) => {
          if (!open) {
            setShowForm(false);
            setEditingYear(null);
          }
        }}
      >
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {editingYear
                ? "Modifier l'année scolaire"
                : "Nouvelle année scolaire"}
            </DialogTitle>
          </DialogHeader>
          <SchoolYearCrudForm
            onSubmit={editingYear ? handleUpdate : handleCreate}
            onCancel={() => {
              setShowForm(false);
              setEditingYear(null);
            }}
            editingYear={editingYear}
            existingYears={schoolYears}
          />
        </DialogContent>
      </Dialog>

      {/* Modal de gestion des périodes */}
      {managingPeriodsFor && (
        <AcademicPeriodsDialog
          schoolYear={managingPeriodsFor}
          teacherId={teacherId}
          useMockData={useMockData}
          onClose={() => setManagingPeriodsFor(null)}
        />
      )}
    </>
  );
}
