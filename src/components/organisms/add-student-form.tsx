"use client";

import {
  GraduationCap,
  Pencil,
  RotateCcw,
  Save,
  UserPlus,
  Users,
  X,
} from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/atoms/badge";
import { Button } from "@/components/atoms/button";
import { Input } from "@/components/atoms/input";
import { Label } from "@/components/atoms/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/molecules/select";

interface Student {
  id: string;
  name: string;
  firstName?: string;
  class: string;
}

interface AddStudentFormProps {
  classes: Array<{ id: string; name: string }>;
  existingStudents?: Student[];
  onSubmit: (studentData: {
    class: string;
    name: string;
    firstName: string;
  }) => void;
  onCancel: () => void;
}

export function AddStudentForm({
  classes,
  existingStudents = [],
  onSubmit,
  onCancel,
}: AddStudentFormProps) {
  const [selectedClass, setSelectedClass] = useState<string>("");
  const [name, setName] = useState("");
  const [firstName, setFirstName] = useState("");
  const [editingStudentInForm, setEditingStudentInForm] = useState<
    string | null
  >(null);

  const selectedClassName =
    classes.find((c) => c.id === selectedClass)?.name || "";
  const classStudents = existingStudents.filter(
    (student) => student.class === selectedClassName,
  );

  const handleSubmit = () => {
    if (selectedClass && name.trim() && firstName.trim()) {
      onSubmit({
        class: selectedClassName,
        name: name.trim(),
        firstName: firstName.trim(),
      });
      // Réinitialiser le formulaire
      setName("");
      setFirstName("");
      setEditingStudentInForm(null);
    }
  };

  const handleClearForm = () => {
    setSelectedClass("");
    setName("");
    setFirstName("");
    setEditingStudentInForm(null);
  };

  const handleEditInForm = (student: Student) => {
    // Trouver l'ID de la classe correspondant au nom de classe de l'élève
    const classId = classes.find((c) => c.name === student.class)?.id || "";

    // Peupler les champs du formulaire avec les données de l'élève
    setSelectedClass(classId);
    setName(student.name);
    setFirstName(student.firstName || "");
    setEditingStudentInForm(student.id);
  };

  return (
    <div className="flex h-[600px] gap-6">
      {/* Section de gauche - Liste des élèves */}
      <div className="w-80 bg-gradient-to-b from-muted/30 to-muted/10 rounded-xl border p-6 flex flex-col">
        {/* Header avec sélecteur de classe */}
        <div className="space-y-4 mb-6">
          <div className="flex items-center gap-2 mb-2">
            <GraduationCap className="h-5 w-5 text-primary" />
            <h3 className="font-semibold text-base">Consulter la classe :</h3>
          </div>
          <Select value={selectedClass} onValueChange={setSelectedClass}>
            <SelectTrigger className="w-full h-11 bg-background/80 border-2 hover:bg-background transition-colors">
              <SelectValue placeholder="Choisir une classe..." />
            </SelectTrigger>
            <SelectContent>
              {classes.map((classItem) => (
                <SelectItem key={classItem.id} value={classItem.id}>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-primary/60"></div>
                    {classItem.name}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {selectedClass ? (
          <>
            {/* Header de la liste des élèves */}
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-border/50">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium text-sm text-muted-foreground">
                  Élèves de {selectedClassName}
                </span>
              </div>
              <Badge variant="secondary" className="text-xs">
                {classStudents.length}
              </Badge>
            </div>

            {/* Liste des élèves */}
            <div className="flex-1 space-y-2 overflow-y-auto min-h-0 px-2 scrollbar-thin">
              {classStudents.map((student, index) => (
                <div
                  key={student.id}
                  onClick={() => handleEditInForm(student)}
                  className={`group relative p-3 bg-background/60 rounded-lg border transition-all duration-200 cursor-pointer hover:bg-background hover:shadow-sm ${
                    editingStudentInForm === student.id
                      ? "ring-2 ring-primary bg-primary/5 border-primary/30"
                      : "hover:border-border"
                  } ${index === 0 ? "mt-2" : ""}`}
                  title="Cliquer pour modifier cet élève"
                >
                  <div className="flex items-center gap-3">
                    {/* Avatar avec initiales */}
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <span className="text-xs font-medium text-primary">
                        {student.firstName?.charAt(0) || student.name.charAt(0)}
                        {student.name.charAt(0) !==
                        (student.firstName?.charAt(0) || student.name.charAt(0))
                          ? student.name.charAt(0)
                          : ""}
                      </span>
                    </div>

                    {/* Nom complet */}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">
                        {student.firstName
                          ? `${student.firstName} ${student.name}`
                          : student.name}
                      </p>
                      {editingStudentInForm === student.id && (
                        <p className="text-xs text-primary font-medium">
                          En cours de modification
                        </p>
                      )}
                    </div>

                    {/* Indicateur d'édition */}
                    {editingStudentInForm === student.id ? (
                      <div className="w-7 h-7 flex items-center justify-center">
                        <div className="w-2 h-2 rounded-full bg-primary animate-pulse"></div>
                      </div>
                    ) : (
                      <div className="w-7 h-7 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <Pencil className="h-3 w-3 text-muted-foreground" />
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {classStudents.length === 0 && (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="w-12 h-12 rounded-full bg-muted/50 flex items-center justify-center mb-3">
                    <Users className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">
                    Aucun élève
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Cette classe est vide
                  </p>
                </div>
              )}
            </div>

            {/* Footer avec statistiques */}
            <div className="mt-4 pt-4 border-t border-border/50">
              <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
                <span>Total: {classStudents.length} élèves</span>
                <span>{selectedClassName}</span>
              </div>
            </div>
          </>
        ) : (
          /* État vide - aucune classe sélectionnée */
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-muted/50 flex items-center justify-center mb-4 mx-auto">
                <GraduationCap className="h-7 w-7 text-muted-foreground" />
              </div>
              <p className="text-sm font-medium text-muted-foreground mb-2">
                Consultez une classe
              </p>
              <p className="text-xs text-muted-foreground max-w-48">
                Choisissez une classe ci-dessus pour consulter la liste des
                élèves
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Section de droite - Formulaire */}
      <div className="flex-1 bg-gradient-to-b from-background to-muted/5 rounded-xl border flex flex-col">
        {/* Header du formulaire */}
        <div className="px-6 py-4 border-b border-border/50">
          <div className="flex items-center gap-3">
            <div
              className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors ${
                editingStudentInForm
                  ? "bg-orange-100 dark:bg-orange-900/30"
                  : "bg-primary/10"
              }`}
            >
              {editingStudentInForm ? (
                <Pencil className="h-5 w-5 text-orange-600 dark:text-orange-400" />
              ) : (
                <UserPlus className="h-5 w-5 text-primary" />
              )}
            </div>
            <div>
              <h3 className="font-semibold text-lg">
                {editingStudentInForm ? "Modifier un élève" : "Nouvel élève"}
              </h3>
            </div>
          </div>
        </div>

        {/* Formulaire */}
        <div className="flex-1 p-6">
          <div className="space-y-6">
            {/* Champ Classe */}
            <div className="space-y-3">
              <Label
                htmlFor="student-class"
                className="text-sm font-semibold flex items-center gap-2"
              >
                <GraduationCap className="h-4 w-4 text-primary" />
                Classe
              </Label>
              <Select value={selectedClass} onValueChange={setSelectedClass}>
                <SelectTrigger
                  id="student-class"
                  className="w-full h-12 bg-background/60 border-2 hover:bg-background transition-colors focus:ring-2 focus:ring-primary/20"
                >
                  <SelectValue placeholder="Sélectionnez une classe..." />
                </SelectTrigger>
                <SelectContent>
                  {classes.map((classItem) => (
                    <SelectItem key={classItem.id} value={classItem.id}>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-primary/60"></div>
                        {classItem.name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Champ Nom */}
            <div className="space-y-3">
              <Label htmlFor="student-name" className="text-sm font-semibold">
                Nom de famille
              </Label>
              <Input
                id="student-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex: Dubois, Martin..."
                className="w-full h-12 bg-background/60 border-2 hover:bg-background transition-colors focus:ring-2 focus:ring-primary/20"
              />
            </div>

            {/* Champ Prénom */}
            <div className="space-y-3">
              <Label
                htmlFor="student-firstname"
                className="text-sm font-semibold"
              >
                Prénom
              </Label>
              <Input
                id="student-firstname"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="Ex: Jean, Marie..."
                className="w-full h-12 bg-background/60 border-2 hover:bg-background transition-colors focus:ring-2 focus:ring-primary/20"
              />
            </div>

            {/* Aperçu de l'élève */}
            {(name.trim() || firstName.trim()) && (
              <div className="mt-6 p-4 bg-muted/30 rounded-lg border border-border/50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-sm font-medium text-primary">
                      {firstName.trim().charAt(0) || name.trim().charAt(0)}
                      {name.trim().charAt(0) !==
                      (firstName.trim().charAt(0) || name.trim().charAt(0))
                        ? name.trim().charAt(0)
                        : ""}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-sm">
                      {firstName.trim() && name.trim()
                        ? `${firstName.trim()} ${name.trim()}`
                        : firstName.trim() || name.trim()}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {selectedClass
                        ? `Classe: ${selectedClassName}`
                        : "Classe non sélectionnée"}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer avec boutons */}
        <div className="p-6 pt-0">
          <div className="flex items-center justify-end gap-3 pt-6 border-t border-border/50">
            <Button
              type="button"
              variant="outline"
              onClick={handleClearForm}
              className="h-11 px-6 gap-2"
            >
              <RotateCcw className="h-4 w-4" />
              {editingStudentInForm ? "Annuler" : "Vider"}
            </Button>

            <Button
              type="button"
              onClick={handleSubmit}
              disabled={!selectedClass || !name.trim() || !firstName.trim()}
              className={`h-11 px-6 gap-2 transition-all ${
                editingStudentInForm
                  ? "bg-orange-600 hover:bg-orange-700 dark:bg-orange-700 dark:hover:bg-orange-800"
                  : ""
              }`}
            >
              {editingStudentInForm ? (
                <>
                  <Save className="h-4 w-4" />
                  Modifier l'élève
                </>
              ) : (
                <>
                  <UserPlus className="h-4 w-4" />
                  Ajouter l'élève
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
