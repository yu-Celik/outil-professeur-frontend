"use client";

import { ChevronRight, Plus, Users } from "lucide-react";
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/atoms/avatar";
import { Badge } from "@/components/atoms/badge";
import { Button } from "@/components/atoms/button";
import { StudentCrudForm } from "./student-crud-form";
import { useStudentManagement } from "@/hooks/use-student-management";
import type { Student, Class } from "@/types/uml-entities";

interface StudentsGridProps {
  students: Student[];
  selectedClassId: string | null;
  selectedStudent: Student | null;
  selectedClass: Class | undefined;
  onStudentClick: (student: Student) => void;
}

export function StudentsGrid({
  students,
  selectedClassId,
  selectedStudent,
  selectedClass,
  onStudentClick,
}: StudentsGridProps) {
  const [showStudentForm, setShowStudentForm] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const { classes, createStudent, updateStudent, loading, error } = useStudentManagement();

  const handleCreateStudent = async (data: any) => {
    try {
      await createStudent(data);
      setShowStudentForm(false);
      setEditingStudent(null);
      // Optionnel : callback pour rafraîchir les données du parent
    } catch (err) {
      console.error("Erreur lors de la création de l'élève:", err);
    }
  };

  const handleEditStudent = (student: Student) => {
    setEditingStudent(student);
    setShowStudentForm(true);
  };
  if (!selectedClassId) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-muted-foreground p-8">
        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-muted/50 to-muted/30 flex items-center justify-center mb-6">
          <ChevronRight className="h-8 w-8" />
        </div>
        <div className="text-xl font-semibold mb-3 text-foreground">
          Aucune classe sélectionnée
        </div>
        <div className="text-sm text-center max-w-sm leading-relaxed">
          Sélectionnez une classe dans la liste de gauche pour consulter les
          élèves
        </div>
      </div>
    );
  }

  if (students.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-muted-foreground p-8">
        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center mb-6">
          <Users className="h-8 w-8 text-primary" />
        </div>
        <div className="text-xl font-semibold mb-3 text-foreground">
          Classe vide
        </div>
        <div className="text-sm text-center max-w-sm leading-relaxed mb-6">
          Cette classe ne contient aucun élève pour le moment
        </div>
        <Button onClick={() => setShowStudentForm(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          Ajouter un élève
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* En-tête de la classe */}
      {selectedClass && (
        <div className="px-6 py-4 border-b border-border/50 bg-background/80 backdrop-blur-sm flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                <Users className="h-4 w-4 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-base">
                  {selectedClass.classCode} - {selectedClass.gradeLabel}
                </h3>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant="outline">
                {students.length} élève{students.length > 1 ? "s" : ""}
              </Badge>
              <Button 
                size="sm" 
                onClick={() => setShowStudentForm(true)} 
                className="gap-2"
              >
                <Plus className="h-4 w-4" />
                Ajouter
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Grille des élèves */}
      <div className="p-4">
        <div className="grid gap-3">
          {students.map((student) => (
            <div
              key={student.id}
              className={`group relative border rounded-xl p-4 transition-all duration-200 cursor-pointer ${
                selectedStudent?.id === student.id
                  ? "bg-primary/10 border-primary/30 shadow-md"
                  : "bg-background/60 border-border/50 hover:bg-background hover:shadow-md hover:border-border"
              }`}
              onClick={() => onStudentClick(student)}
            >
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-4">
                  <Avatar className="h-12 w-12 ring-2 ring-primary/10">
                    <AvatarImage src="" />
                    <AvatarFallback className="bg-primary/10 text-primary font-medium">
                      {student.firstName.charAt(0)}
                      {student.lastName.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-semibold text-foreground">
                      {student.firstName} {student.lastName}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      ID: {student.id}
                    </div>
                  </div>
                </div>
                <ChevronRight
                  className={`h-4 w-4 transition-colors ${
                    selectedStudent?.id === student.id
                      ? "text-primary"
                      : "text-muted-foreground group-hover:text-foreground"
                  }`}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Formulaire modal d'ajout/modification d'élève */}
      <StudentCrudForm
        isOpen={showStudentForm}
        onClose={() => {
          setShowStudentForm(false);
          setEditingStudent(null);
        }}
        onSubmit={handleCreateStudent}
        editingStudent={editingStudent}
        classes={classes}
        isLoading={loading}
      />
    </div>
  );
}