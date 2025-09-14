"use client";

import {
  BookOpen,
  ChevronRight,
  GraduationCap,
  Plus,
  Settings2,
  Users,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/atoms/avatar";
import { Button } from "@/components/atoms/button";
import { Card } from "@/components/molecules/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/atoms/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/molecules/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/atoms/select";
import { ClassCrudForm } from "@/components/organisms/class-crud-form";
import { AddStudentForm } from "@/components/organisms/add-student-form";
import { useClassManagement } from "@/hooks/use-class-management";
import { useClassColors } from "@/hooks/use-class-colors";
import { MOCK_CLASSES } from "@/data/mock-classes";

interface Class {
  id: string;
  name: string;
  studentCount: number;
}

interface Student {
  id: string;
  name: string;
  firstName?: string;
  class: string;
  avatar?: string;
  level?: string;
  status?: "present" | "absent" | "late";
}

interface ClassesStudentsCardProps {
  type: "classes" | "students";
  classes?: Class[];
  students?: Student[];
  teacherId?: string; // Pour les couleurs de classe
  onAdd?: () => void;
  onSortChange?: (sortBy: string) => void;
  onClassClick?: (classId: string) => void;
  onAddClass?: (classData: {
    identifier: string;
    level: string;
    schoolYear: string;
  }) => void;
  onAddStudent?: (studentData: {
    class: string;
    name: string;
    firstName: string;
  }) => void;
}

export function ClassesStudentsCard({
  type: _type,
  classes = [],
  students = [],
  teacherId = "KsmNtVf4zwqO3VV3SQJqPrRlQBA1fFyR",
  onAdd: _onAdd,
  onSortChange,
  onClassClick,
  onAddClass,
  onAddStudent,
}: ClassesStudentsCardProps) {
  const [selectedClass, setSelectedClass] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isStudentModalOpen, setIsStudentModalOpen] = useState(false);
  const { getClassColorWithText } = useClassColors(teacherId, "year-2024");
  const { createClass, schoolYears, loading: classLoading } = useClassManagement();

  const handleClassClick = (classId: string) => {
    setSelectedClass(classId);
    onClassClick?.(classId);
  };

  const filteredStudents = selectedClass
    ? students.filter(
        (student) =>
          student.class === classes.find((c) => c.id === selectedClass)?.name,
      )
    : students;

  const handleAddClassClick = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleSubmitClass = async (classData: {
    classCode: string;
    gradeLabel: string;
    schoolYearId: string;
  }) => {
    try {
      await createClass(classData);
      setIsModalOpen(false);
      // Adapter pour l'ancienne interface si nécessaire
      onAddClass?.({
        identifier: classData.classCode,
        level: classData.gradeLabel,
        schoolYear: classData.schoolYearId,
      });
    } catch (error) {
      console.error("Erreur lors de la création de la classe:", error);
    }
  };

  const handleAddStudentClick = () => {
    setIsStudentModalOpen(true);
  };

  const handleCloseStudentModal = () => {
    setIsStudentModalOpen(false);
  };

  const handleSubmitStudent = (studentData: {
    class: string;
    name: string;
    firstName: string;
  }) => {
    onAddStudent?.(studentData);
    setIsStudentModalOpen(false);
  };

  return (
    <Card className="h-full flex flex-col py-0 gap-0 bg-gradient-to-br from-background via-background to-muted/20">
      <div className="flex items-center justify-between p-6 border-b border-border/50 flex-shrink-0 bg-background/80 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <BookOpen className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h2 className="text-xl font-semibold flex items-center gap-2">
              Classes
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground font-normal">Élèves</span>
            </h2>
            <p className="text-sm text-muted-foreground">
              Gérez vos classes et consultez les élèves
            </p>
          </div>
        </div>
        <Button
          variant="outline"
          size="lg"
          onClick={handleAddClassClick}
          className="h-11 px-6 gap-2 border-2 hover:bg-primary/5"
        >
          <Plus className="w-4 h-4" />
          <span className="font-medium">Ajouter une classe</span>
        </Button>
      </div>

      <div className="flex flex-1 min-h-0">
        {/* Sidebar des classes */}
        <div className="w-64 border-r border-border/50 bg-gradient-to-b from-muted/30 to-muted/10 flex flex-col">
          <div className="px-6 py-4 flex-shrink-0 border-b border-border/30">
            <div className="flex items-center gap-2 mb-1">
              <GraduationCap className="h-4 w-4 text-primary" />
              <h3 className="font-semibold text-sm text-foreground">
                Mes Classes
              </h3>
            </div>
            <p className="text-xs text-muted-foreground">
              {classes.length} classe{classes.length > 1 ? "s" : ""} au total
            </p>
          </div>
          <div className="flex-1 p-4 overflow-y-auto min-h-0">
            <div className="space-y-2">
              {classes.map((classItem) => (
                <Button
                  key={classItem.id}
                  variant={selectedClass === classItem.id ? "default" : "ghost"}
                  className={`w-full justify-start text-left h-auto p-4 transition-all duration-200 ${
                    selectedClass === classItem.id
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "hover:bg-background/60 hover:shadow-sm"
                  }`}
                  onClick={() => handleClassClick(classItem.id)}
                >
                  <div className="flex items-center gap-3 w-full">
                    {(() => {
                      // Trouve la classe UML correspondante par le nom
                      const umlClass = MOCK_CLASSES.find(
                        (c) => c.classCode === classItem.name,
                      );
                      const classColors = umlClass
                        ? getClassColorWithText(umlClass.id)
                        : {
                            backgroundColor: "hsl(var(--muted))",
                            color: "hsl(var(--muted-foreground))",
                            borderColor: "hsl(var(--border))",
                          };

                      return (
                        <div
                          className="w-8 h-8 rounded-lg flex items-center justify-center"
                          style={{
                            backgroundColor:
                              selectedClass === classItem.id
                                ? classColors.backgroundColor
                                : `${classColors.backgroundColor}20`,
                          }}
                        >
                          <span
                            className="text-xs font-medium"
                            style={{
                              color:
                                selectedClass === classItem.id
                                  ? classColors.color
                                  : classColors.backgroundColor,
                            }}
                          >
                            {classItem.name.charAt(0)}
                          </span>
                        </div>
                      );
                    })()}
                    <div className="flex-1 min-w-0">
                      <div className="font-medium truncate">
                        {classItem.name}
                      </div>
                      <div
                        className={`text-xs mt-1 flex items-center gap-1 ${
                          selectedClass === classItem.id
                            ? "text-primary-foreground/70"
                            : "text-muted-foreground"
                        }`}
                      >
                        <Users className="h-3 w-3" />
                        {classItem.studentCount} élève
                        {classItem.studentCount > 1 ? "s" : ""}
                      </div>
                    </div>
                  </div>
                </Button>
              ))}

              {classes.length === 0 && (
                <div className="text-center py-8">
                  <div className="w-12 h-12 rounded-full bg-muted/50 flex items-center justify-center mx-auto mb-3">
                    <GraduationCap className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <p className="text-sm text-muted-foreground mb-1 font-medium">
                    Aucune classe
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Ajoutez votre première classe
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Zone d'affichage des élèves */}
        <div className="flex-1 flex flex-col min-w-0 bg-gradient-to-b from-background/50 to-background">
          {selectedClass && (
            <div className="px-6 py-4 border-b border-border/50 bg-background/80 backdrop-blur-sm flex-shrink-0">
              <div className="flex items-center justify-between min-h-10">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Users className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-base">
                      {classes.find((c) => c.id === selectedClass)?.name}
                    </h3>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {/* Version normale avec texte */}
                  <div className="hidden 2xl:flex lg:peer-data-[state=expanded]:hidden xl:peer-data-[state=collapsed]:flex items-center gap-3">
                    <Select onValueChange={onSortChange}>
                      <SelectTrigger className="w-44 h-10 border-2 hover:bg-muted/50 transition-colors">
                        <SelectValue placeholder="Trier par..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="name">Nom (A-Z)</SelectItem>
                        <SelectItem value="name-desc">Nom (Z-A)</SelectItem>
                        <SelectItem value="status">Statut</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button
                      variant="outline"
                      onClick={handleAddStudentClick}
                      className="h-10 px-4 gap-2 border-2 hover:bg-primary/5"
                    >
                      <Plus className="h-4 w-4" />
                      Ajouter un élève
                    </Button>
                  </div>

                  {/* Version icônes */}
                  <div className="flex 2xl:hidden lg:peer-data-[state=expanded]:flex xl:peer-data-[state=collapsed]:hidden items-center gap-2">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-10 w-10 p-0"
                        >
                          <Settings2 className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => onSortChange?.("name")}
                        >
                          Nom (A-Z)
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => onSortChange?.("name-desc")}
                        >
                          Nom (Z-A)
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => onSortChange?.("status")}
                        >
                          Statut
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-10 w-10 p-0"
                      onClick={handleAddStudentClick}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="flex-1 overflow-y-auto min-h-0 p-4">
            {!selectedClass ? (
              <div className="flex flex-col items-center justify-center h-full text-muted-foreground p-8">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-muted/50 to-muted/30 flex items-center justify-center mb-6">
                  <ChevronRight className="h-8 w-8" />
                </div>
                <div className="text-xl font-semibold mb-3 text-foreground">
                  Aucune classe sélectionnée
                </div>
                <div className="text-sm text-center max-w-sm leading-relaxed">
                  Sélectionnez une classe dans la liste de gauche pour consulter
                  les élèves qui y sont inscrits
                </div>
              </div>
            ) : filteredStudents.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-muted-foreground p-8">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center mb-6">
                  <Users className="h-8 w-8 text-primary" />
                </div>
                <div className="text-xl font-semibold mb-3 text-foreground">
                  Classe vide
                </div>
                <div className="text-sm text-center max-w-sm leading-relaxed mb-4">
                  Cette classe ne contient aucun élève pour le moment
                </div>
                <Button onClick={handleAddStudentClick} className="gap-2">
                  <Plus className="h-4 w-4" />
                  Ajouter le premier élève
                </Button>
              </div>
            ) : (
              <div className="grid gap-3">
                {filteredStudents.map((student) => (
                  <div
                    key={student.id}
                    className="group relative bg-background/60 border border-border/50 rounded-xl p-4 hover:bg-background hover:shadow-md hover:border-border transition-all duration-200"
                  >
                    <Link
                      href={`/dashboard/mes-eleves/${student.id}`}
                      className="flex items-center justify-between w-full"
                    >
                      <div className="flex items-center gap-4">
                        <Avatar className="h-10 w-10 ring-2 ring-primary/10">
                          <AvatarImage src={student.avatar} />
                          <AvatarFallback className="bg-primary/10 text-primary font-medium">
                            {student.firstName?.charAt(0) ||
                              student.name.charAt(0)}
                            {student.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="font-semibold text-sm text-foreground">
                          {student.firstName
                            ? `${student.firstName} ${student.name}`
                            : student.name}
                        </div>
                      </div>
                      <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <ClassCrudForm
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleSubmitClass}
        schoolYears={schoolYears}
        isLoading={classLoading}
      />

      <Dialog
        open={isStudentModalOpen}
        onOpenChange={(open) => !open && handleCloseStudentModal()}
      >
        <DialogContent className="max-w-5xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Gestion des élèves</DialogTitle>
          </DialogHeader>
          <AddStudentForm
            classes={classes}
            existingStudents={students}
            onSubmit={handleSubmitStudent}
            onCancel={handleCloseStudentModal}
          />
        </DialogContent>
      </Dialog>
    </Card>
  );
}
