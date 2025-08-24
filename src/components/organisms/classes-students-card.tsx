"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/molecules/card";
import { Button } from "@/components/atoms/button";
import { Badge } from "@/components/atoms/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/atoms/avatar";
import {
  ChevronRight,
  ArrowLeft,
  CircleCheckBig,
  Clock,
  ChevronDown,
  Plus,
  Settings2,
} from "lucide-react";
import { Modal } from "@/components/molecules/modal";
import { AddClassForm } from "@/components/organisms/add-class-form";
import { AddStudentForm } from "@/components/organisms/add-student-form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/molecules/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/molecules/dropdown-menu";
import Link from "next/link";

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
  type,
  classes = [],
  students = [],
  onAdd,
  onSortChange,
  onClassClick,
  onAddClass,
  onAddStudent,
}: ClassesStudentsCardProps) {
  const [selectedClass, setSelectedClass] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isStudentModalOpen, setIsStudentModalOpen] = useState(false);

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

  const handleSubmitClass = (classData: {
    identifier: string;
    level: string;
    schoolYear: string;
  }) => {
    onAddClass?.(classData);
    setIsModalOpen(false);
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
    <Card className="h-full flex flex-col py-0 gap-0">
      <div className="flex items-center justify-between p-6 border-b flex-shrink-0">
        <div className="flex items-center gap-2">
          <h2 className="text-xl font-semibold">Classes</h2>
          <ChevronRight className="h-4 w-4 text-muted-foreground flex-shrink-0" />
          <span className="text-muted-foreground">Élèves</span>
        </div>
        <Button variant="outline" size="lg" onClick={handleAddClassClick}>
          <div className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            <span className="font-medium">Ajouter une classe</span>
          </div>
        </Button>
      </div>

      <div className="flex flex-1 min-h-0">
        {/* Sidebar des classes */}
        <div className="w-56 border-r bg-muted/20 flex flex-col">
          <div className="p-4 flex-shrink-0">
            <h3 className="font-medium mb-4 text-sm text-muted-foreground uppercase tracking-wider">
              Mes Classes
            </h3>
          </div>
          <div className="flex-1 px-4 pb-4 overflow-y-auto min-h-0">
            <div className="space-y-1">
              {classes.map((classItem) => (
                <Button
                  key={classItem.id}
                  variant={selectedClass === classItem.id ? "default" : "ghost"}
                  className="w-full justify-start text-left h-auto p-3"
                  onClick={() => handleClassClick(classItem.id)}
                >
                  <div className="flex items-center gap-3 w-full">
                    <div className="w-2 h-2 rounded-full bg-current opacity-60" />
                    <div className="flex-1">
                      <div className="font-medium">{classItem.name}</div>
                      <div className="text-xs opacity-70 mt-1">
                        {classItem.studentCount} élèves
                      </div>
                    </div>
                  </div>
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Zone d'affichage des élèves */}
        <div className="flex-1 flex flex-col min-w-0">
          <div className="p-4 border-b bg-background flex-shrink-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <h3 className="font-medium">
                  {selectedClass
                    ? `${classes.find((c) => c.id === selectedClass)?.name}`
                    : "Élèves"}
                </h3>
                {selectedClass && (
                  <Badge variant="secondary">
                    {filteredStudents.length} élève
                    {filteredStudents.length > 1 ? "s" : ""}
                  </Badge>
                )}
              </div>
              {selectedClass && (
                <div className="flex items-center gap-2">
                  {/* Version normale avec texte */}
                  <div className="hidden 2xl:flex lg:peer-data-[state=expanded]:hidden xl:peer-data-[state=collapsed]:flex items-center gap-2">
                    <Select onValueChange={onSortChange}>
                      <SelectTrigger className="w-40">
                        <SelectValue placeholder="Trier par" />
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
                    >
                      <Plus className="h-4 w-4 mr-1" />
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
              )}
            </div>
          </div>

          <div className="flex-1 overflow-y-auto min-h-0">
            {!selectedClass ? (
              <div className="flex flex-col items-center justify-center h-full text-muted-foreground p-6">
                <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                  <ChevronRight className="h-8 w-8" />
                </div>
                <div className="text-lg font-medium mb-2">
                  Aucune classe sélectionnée
                </div>
                <div className="text-sm text-center max-w-md">
                  Sélectionnez une classe dans la liste de gauche pour voir les
                  élèves qui y sont inscrits
                </div>
              </div>
            ) : filteredStudents.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                  <div className="text-2xl">👥</div>
                </div>
                <div className="text-lg font-medium mb-2">Aucun élève</div>
                <div className="text-sm text-center max-w-md">
                  Cette classe ne contient aucun élève pour le moment
                </div>
              </div>
            ) : (
              <div className="p-4">
                <div className="space-y-3">
                  {filteredStudents.map((student) => (
                    <div
                      key={student.id}
                      className="border rounded-lg p-3 hover:bg-muted/50 transition-colors"
                    >
                      <Link
                        href={`/dashboard/students/${student.id}`}
                        className="flex items-center justify-between w-full"
                      >
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={student.avatar} />
                            <AvatarFallback>
                              {student.name.slice(0, 2).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div className="text-left">
                            <div className="font-medium text-sm">
                              {student.name}
                            </div>
                          </div>
                        </div>
                        <ChevronRight className="h-4 w-4 text-muted-foreground" />
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title="Ajouter une classe"
        description="Remplissez les informations pour créer une nouvelle classe"
      >
        <AddClassForm
          onSubmit={handleSubmitClass}
          onCancel={handleCloseModal}
        />
      </Modal>

      <Modal
        isOpen={isStudentModalOpen}
        onClose={handleCloseStudentModal}
        title="Gestion des élèves"
        size="4xl"
        height="xl"
      >
        <AddStudentForm
          classes={classes}
          existingStudents={students}
          onSubmit={handleSubmitStudent}
          onCancel={handleCloseStudentModal}
        />
      </Modal>
    </Card>
  );
}
