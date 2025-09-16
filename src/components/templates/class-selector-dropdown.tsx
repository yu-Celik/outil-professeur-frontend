"use client";

import { Plus, ChevronDown, GraduationCap, Users } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/molecules/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/organisms/sidebar";
import { ClassCrudForm } from "@/components/organisms/class-crud-form";
import { useClassSelection } from "@/contexts/class-selection-context";
import { useGestionManagement } from "@/features/gestion";
import { getStudentsByClass } from "@/features/students/mocks";
import { useSimpleModal } from "@/shared/hooks";
import type { Class } from "@/types/uml-entities";

export function ClassSelectorDropdown() {
  const {
    isOpen: isCreateModalOpen,
    open: openCreateModal,
    close: closeCreateModal
  } = useSimpleModal();

  const {
    classes,
    selectedClassId,
    handleClassSelect,
    getClassColorWithText
  } = useClassSelection();

  const {
    schoolYears,
    createClass,
    isCreatingClass
  } = useGestionManagement();

  const handleCreateClass = async (data: {
    classCode: string;
    gradeLabel: string;
    schoolYearId: string;
  }) => {
    try {
      await createClass(data);
      closeCreateModal();
    } catch (error) {
      console.error("Erreur lors de la création de la classe:", error);
    }
  };

  const getStudentCount = (classId: string) => {
    return getStudentsByClass(classId).length;
  };

  const selectedClass = selectedClassId
    ? classes.find(c => c.id === selectedClassId)
    : null;

  // S'il n'y a pas de classes, afficher directement le bouton de création
  if (classes.length === 0) {
    return (
      <>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton onClick={openCreateModal} className="w-full">
              <Plus className="h-4 w-4" />
              <span>Créer une classe</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>

        <ClassCrudForm
          isOpen={isCreateModalOpen}
          onClose={closeCreateModal}
          onSubmit={handleCreateClass}
          schoolYears={schoolYears}
          isLoading={isCreatingClass}
        />
      </>
    );
  }

  return (
    <>
      <SidebarMenu>
        <SidebarMenuItem>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <SidebarMenuButton className="w-full">
                {selectedClass ? (
                  <>
                    <div
                      className="w-4 h-4 rounded-sm flex items-center justify-center text-xs font-medium"
                      style={{
                        backgroundColor: getClassColorWithText(selectedClass.id).backgroundColor,
                      }}
                    >
                      <span
                        className="text-xs font-bold"
                        style={{
                          color: getClassColorWithText(selectedClass.id).color,
                        }}
                      >
                        {selectedClass.classCode?.charAt(0) || "C"}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0 text-left">
                      <div className="font-medium truncate">
                        {selectedClass.classCode} - {selectedClass.gradeLabel}
                      </div>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Users className="h-3 w-3" />
                      <span>{getStudentCount(selectedClass.id)}</span>
                    </div>
                  </>
                ) : (
                  <>
                    <GraduationCap className="h-4 w-4" />
                    <span>Sélectionner une classe</span>
                  </>
                )}
                <ChevronDown className="ml-auto h-4 w-4" />
              </SidebarMenuButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-[--radix-popper-anchor-width]" align="start">
              {classes.map((classData: Class) => {
                const studentCount = getStudentCount(classData.id);
                const classColors = getClassColorWithText(classData.id);
                const isSelected = selectedClassId === classData.id;

                return (
                  <DropdownMenuItem
                    key={classData.id}
                    onClick={() => handleClassSelect(classData.id)}
                    className={isSelected ? "bg-accent" : ""}
                  >
                    <div
                      className="w-4 h-4 rounded-sm flex items-center justify-center text-xs font-medium mr-2"
                      style={{
                        backgroundColor: `${classColors.backgroundColor}${isSelected ? '' : '20'}`,
                        color: isSelected ? classColors.color : classColors.backgroundColor,
                      }}
                    >
                      {classData.classCode?.charAt(0) || "C"}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm truncate">
                        {classData.classCode} - {classData.gradeLabel}
                      </div>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground ml-auto">
                      <Users className="h-3 w-3" />
                      <span>{studentCount}</span>
                    </div>
                  </DropdownMenuItem>
                );
              })}

              <DropdownMenuSeparator />

              <DropdownMenuItem onClick={openCreateModal} className="text-primary">
                <Plus className="h-4 w-4 mr-2" />
                <span>Nouvelle classe</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarMenuItem>
      </SidebarMenu>

      <ClassCrudForm
        isOpen={isCreateModalOpen}
        onClose={closeCreateModal}
        onSubmit={handleCreateClass}
        schoolYears={schoolYears}
        isLoading={isCreatingClass}
      />
    </>
  );
}