"use client";

import { GraduationCap, Users } from "lucide-react";
import { Button } from "@/components/atoms/button";
import { getStudentsByClass } from "@/data/mock-students";
import type { Class } from "@/types/uml-entities";

interface ClassesSidebarProps {
  classes: Class[];
  selectedClassId: string | null;
  onClassSelect: (classId: string) => void;
  getClassColorWithText: (classId: string) => {
    backgroundColor: string;
    color: string;
  };
}

export function ClassesSidebar({
  classes,
  selectedClassId,
  onClassSelect,
  getClassColorWithText,
}: ClassesSidebarProps) {
  return (
    <div className="w-64 border-r border-border/50 bg-gradient-to-b from-muted/30 to-muted/10 flex flex-col">
      <div className="px-6 py-4 flex-shrink-0 border-b border-border/30">
        <div className="flex items-center gap-2 mb-1">
          <GraduationCap className="h-4 w-4 text-primary" />
          <h3 className="font-semibold text-sm text-foreground">Mes Classes</h3>
        </div>
        <p className="text-xs text-muted-foreground">
          {classes.length} classe{classes.length > 1 ? "s" : ""} au total
        </p>
      </div>
      
      <div className="flex-1 p-4 overflow-y-auto min-h-0">
        <div className="space-y-2">
          {classes.map((classData) => {
            const studentCount = getStudentsByClass(classData.id).length;
            const classColors = getClassColorWithText(classData.id);
            const isSelected = selectedClassId === classData.id;

            return (
              <Button
                key={classData.id}
                variant={isSelected ? "default" : "ghost"}
                className={`w-full justify-start text-left h-auto p-4 transition-all duration-200 ${
                  isSelected
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "hover:bg-background/60 hover:shadow-sm"
                }`}
                onClick={() => onClassSelect(classData.id)}
              >
                <div className="flex items-center gap-3 w-full">
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center"
                    style={{
                      backgroundColor: isSelected
                        ? classColors.backgroundColor
                        : `${classColors.backgroundColor}20`,
                    }}
                  >
                    <span
                      className="text-xs font-medium"
                      style={{
                        color: isSelected
                          ? classColors.color
                          : classColors.backgroundColor,
                      }}
                    >
                      {classData.classCode?.charAt(0) || "C"}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium truncate">
                      {classData.classCode} - {classData.gradeLabel}
                    </div>
                    <div
                      className={`text-xs mt-1 flex items-center gap-1 ${
                        isSelected
                          ? "text-primary-foreground/70"
                          : "text-muted-foreground"
                      }`}
                    >
                      <Users className="h-3 w-3" />
                      {studentCount} élève{studentCount > 1 ? "s" : ""}
                    </div>
                  </div>
                </div>
              </Button>
            );
          })}

          {classes.length === 0 && (
            <div className="text-center py-8">
              <div className="w-12 h-12 rounded-full bg-muted/50 flex items-center justify-center mx-auto mb-3">
                <GraduationCap className="h-5 w-5 text-muted-foreground" />
              </div>
              <p className="text-sm text-muted-foreground mb-1 font-medium">
                Aucune classe
              </p>
              <p className="text-xs text-muted-foreground">
                Classes non disponibles
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}