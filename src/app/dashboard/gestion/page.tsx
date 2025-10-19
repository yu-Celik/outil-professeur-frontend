"use client";

import { useState } from "react";
import { Plus, Pencil, Trash2, AlertCircle } from "lucide-react";
import { Button } from "@/components/atoms/button";
import { Card } from "@/components/molecules/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/atoms/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/atoms/alert-dialog";
import { Alert, AlertDescription } from "@/components/atoms/alert";
import { ClassCrudForm } from "@/components/organisms/class-crud-form";
import { useClassManagement, type ClassFormData } from "@/features/gestion";
import type { Class } from "@/types/uml-entities";

export default function GestionPage() {
  const {
    classes,
    schoolYears,
    loading,
    error,
    createClass,
    updateClass,
    deleteClass,
    refresh,
  } = useClassManagement();

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingClass, setEditingClass] = useState<Class | null>(null);
  const [deletingClassId, setDeletingClassId] = useState<string | null>(null);
  const [apiError, setApiError] = useState<string | null>(null);

  // Gestion de la création
  const handleCreateClick = () => {
    setEditingClass(null);
    setIsCreateModalOpen(true);
    setApiError(null);
  };

  const handleCreateSubmit = async (data: ClassFormData) => {
    try {
      setApiError(null);
      await createClass(data);
      setIsCreateModalOpen(false);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Erreur inconnue";
      setApiError(message);

      // Afficher l'erreur mais ne pas fermer la modale pour permettre correction
      if (message.includes("409") || message.includes("doublon")) {
        // Erreur de doublon - laisser la modale ouverte
        return;
      }
      // Autres erreurs - fermer après 3 secondes
      setTimeout(() => setIsCreateModalOpen(false), 3000);
    }
  };

  // Gestion de l'édition
  const handleEditClick = (classItem: Class) => {
    setEditingClass(classItem);
    setIsCreateModalOpen(true);
    setApiError(null);
  };

  const handleEditSubmit = async (data: ClassFormData) => {
    if (!editingClass) return;

    try {
      setApiError(null);
      // Note: ETag non implémenté dans ce premier jet - à ajouter dans la v2
      await updateClass(editingClass.id, data);
      setIsCreateModalOpen(false);
      setEditingClass(null);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Erreur inconnue";
      setApiError(message);

      // Gérer les erreurs de concurrence (412 Precondition Failed)
      if (message.includes("412") || message.includes("conflit")) {
        // ETag mismatch - recharger et laisser modale ouverte
        refresh();
        return;
      }

      if (message.includes("409") || message.includes("doublon")) {
        // Doublon - laisser modale ouverte
        return;
      }

      // Autres erreurs
      setTimeout(() => {
        setIsCreateModalOpen(false);
        setEditingClass(null);
      }, 3000);
    }
  };

  // Gestion de la suppression
  const handleDeleteClick = (classId: string) => {
    setDeletingClassId(classId);
    setApiError(null);
  };

  const handleDeleteConfirm = async () => {
    if (!deletingClassId) return;

    try {
      setApiError(null);
      await deleteClass(deletingClassId);
      setDeletingClassId(null);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Erreur inconnue";
      setApiError(message);
      setDeletingClassId(null);
    }
  };

  const handleModalClose = () => {
    setIsCreateModalOpen(false);
    setEditingClass(null);
    setApiError(null);
  };

  // Trouver le nom de l'année scolaire
  const getSchoolYearName = (schoolYearId: string) => {
    const year = schoolYears.find((y) => y.id === schoolYearId);
    return year?.name || schoolYearId;
  };

  const deletingClass = classes.find((c) => c.id === deletingClassId);

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Gestion des classes</h1>
          <p className="text-muted-foreground mt-1">
            Créez et gérez vos classes pour l'année scolaire
          </p>
        </div>
        <Button onClick={handleCreateClick} size="lg" className="gap-2">
          <Plus className="h-4 w-4" />
          Nouvelle classe
        </Button>
      </div>

      {/* Erreur globale */}
      {apiError && !isCreateModalOpen && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{apiError}</AlertDescription>
        </Alert>
      )}

      {/* Erreur de chargement */}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Table des classes */}
      <Card className="p-6">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Code classe</TableHead>
              <TableHead>Niveau</TableHead>
              <TableHead>Année scolaire</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading && (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-8">
                  <div className="flex items-center justify-center gap-2">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                    <span className="text-muted-foreground">
                      Chargement des classes...
                    </span>
                  </div>
                </TableCell>
              </TableRow>
            )}

            {!loading && classes.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-8">
                  <div className="text-muted-foreground">
                    <p className="font-medium mb-1">Aucune classe</p>
                    <p className="text-sm">
                      Commencez par créer votre première classe
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            )}

            {!loading &&
              classes.map((classItem) => (
                <TableRow key={classItem.id}>
                  <TableCell className="font-medium">
                    {classItem.classCode}
                  </TableCell>
                  <TableCell>{classItem.gradeLabel}</TableCell>
                  <TableCell>{getSchoolYearName(classItem.schoolYearId)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEditClick(classItem)}
                        className="gap-2"
                      >
                        <Pencil className="h-4 w-4" />
                        Modifier
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteClick(classItem.id)}
                        className="gap-2 text-destructive hover:text-destructive hover:bg-destructive/10"
                      >
                        <Trash2 className="h-4 w-4" />
                        Supprimer
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </Card>

      {/* Modal de création/édition */}
      <ClassCrudForm
        isOpen={isCreateModalOpen}
        onClose={handleModalClose}
        onSubmit={editingClass ? handleEditSubmit : handleCreateSubmit}
        editingClass={editingClass}
        schoolYears={schoolYears}
        isLoading={loading}
      />

      {/* Erreur dans la modale */}
      {apiError && isCreateModalOpen && (
        <Alert variant="destructive" className="fixed bottom-4 right-4 w-96 z-50">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{apiError}</AlertDescription>
        </Alert>
      )}

      {/* Dialog de confirmation de suppression */}
      <AlertDialog
        open={!!deletingClassId}
        onOpenChange={(open) => !open && setDeletingClassId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir supprimer la classe{" "}
              <strong>{deletingClass?.classCode}</strong> ?<br />
              Cette action est irréversible.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
