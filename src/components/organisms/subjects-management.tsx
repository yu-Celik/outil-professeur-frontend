"use client";

import {
  BookOpen,
  Edit,
  Plus,
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
import { SubjectCrudForm } from "@/components/organisms/subject-crud-form";
import { useSubjectManagement } from "@/hooks/use-subject-management";
import type { Subject } from "@/types/uml-entities";

interface SubjectsManagementProps {
  teacherId?: string;
}

export function SubjectsManagement({ teacherId }: SubjectsManagementProps) {
  const {
    subjects,
    loading,
    error,
    createSubject,
    updateSubject,
    deleteSubject,
  } = useSubjectManagement();

  const [showForm, setShowForm] = useState(false);
  const [editingSubject, setEditingSubject] = useState<Subject | null>(null);

  const activeSubjects = subjects; // Tous les sujets sont considérés comme actifs
  const inactiveSubjects: Subject[] = []; // Pas de sujets inactifs dans le modèle UML

  const handleCreate = async (data: any) => {
    try {
      await createSubject(data);
      setShowForm(false);
      setEditingSubject(null);
    } catch (error) {
      console.error("Erreur lors de la création de la matière:", error);
      throw error;
    }
  };

  const handleUpdate = async (data: any) => {
    try {
      if (editingSubject) {
        await updateSubject(editingSubject.id, data);
        setShowForm(false);
        setEditingSubject(null);
      }
    } catch (error) {
      console.error("Erreur lors de la mise à jour de la matière:", error);
      throw error;
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer cette matière ?")) {
      await deleteSubject(id);
    }
  };

  const handleToggle = async (id: string) => {
    // La fonctionnalité de toggle n'est pas supportée par l'entité UML Subject
    console.log("Toggle non supporté pour les matières UML:", id);
  };

  const SubjectItem = ({ subject, index }: { subject: Subject; index: number }) => {
    return (
      <div
        key={subject.id}
        className="group p-4 border rounded-lg transition-all duration-200 bg-background border-border hover:border-primary/50"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-xs">
                #{index + 1}
              </Badge>
              <BookOpen className="h-4 w-4" />
            </div>

            <div>
              <div className="font-medium">
                {subject.name}
              </div>
              <div className="text-sm text-muted-foreground">
                Code: {subject.code}
                {subject.description && ` • ${subject.description}`}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setEditingSubject(subject);
                setShowForm(true);
              }}
            >
              <Edit className="h-4 w-4" />
            </Button>

            {/* Toggle désactivé - non supporté par l'entité UML Subject */}

            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleDelete(subject.id)}
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
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <BookOpen className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-semibold">Matières</h2>
              <p className="text-sm text-muted-foreground">
                Gérez les matières de votre établissement
              </p>
            </div>
          </div>
          <Button onClick={() => setShowForm(true)} className="gap-2">
            <Plus className="h-4 w-4" />
            Nouvelle matière
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Statistiques */}
        <div className="grid grid-cols-1 gap-4">
          <div className="p-3 bg-chart-1/10 border border-chart-1/20 rounded-lg">
            <div className="text-2xl font-bold text-chart-1">
              {subjects.length}
            </div>
            <div className="text-xs text-chart-1">Matières configurées</div>
          </div>
        </div>

        {/* Liste des matières */}
        {subjects.length > 0 && (
          <div>
            <h3 className="font-semibold mb-3 text-foreground">
              Matières configurées ({subjects.length})
            </h3>
            <div className="space-y-2">
              {subjects.map((subject, index) => (
                <SubjectItem key={subject.id} subject={subject} index={index} />
              ))}
            </div>
          </div>
        )}

        {/* État vide */}
        {subjects.length === 0 && (
          <div className="text-center py-12">
            <div className="w-20 h-20 rounded-2xl bg-muted/50 flex items-center justify-center mx-auto mb-4">
              <BookOpen className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="font-semibold text-lg mb-2">
              Aucune matière configurée
            </h3>
            <p className="text-muted-foreground mb-4 max-w-sm mx-auto">
              Créez votre première matière pour organiser vos enseignements
            </p>
            <Button onClick={() => setShowForm(true)} className="gap-2">
              <Plus className="h-4 w-4" />
              Créer une matière
            </Button>
          </div>
        )}
      </CardContent>

      {/* Modal de formulaire */}
      <Dialog
        open={showForm}
        onOpenChange={(open) => {
          if (!open) {
            setShowForm(false);
            setEditingSubject(null);
          }
        }}
      >
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingSubject ? "Modifier la matière" : "Nouvelle matière"}
            </DialogTitle>
          </DialogHeader>
          <SubjectCrudForm
            isOpen={showForm}
            onClose={() => {
              setShowForm(false);
              setEditingSubject(null);
            }}
            onSubmit={editingSubject ? handleUpdate : handleCreate}
            editingSubject={editingSubject}
            isLoading={loading}
          />
        </DialogContent>
      </Dialog>
    </Card>
  );
}