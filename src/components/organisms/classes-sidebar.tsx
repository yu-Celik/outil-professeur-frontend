"use client";

import { useState, useEffect, useCallback } from "react";
import { GraduationCap, Users, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/atoms/button";
import { getStudentsByClass } from "@/features/students/mocks";
import type { Class } from "@/types/uml-entities";

interface ClassesSidebarProps {
  classes: Class[];
  selectedClassId: string | null;
  onClassSelect: (classId: string) => void;
  getClassColorWithText: (classId: string) => {
    backgroundColor: string;
    color: string;
  };
  autoCollapse?: boolean;
}

export function ClassesSidebar({
  classes,
  selectedClassId,
  onClassSelect,
  getClassColorWithText,
  autoCollapse = true,
}: ClassesSidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [hoverOpenTimeoutId, setHoverOpenTimeoutId] = useState<NodeJS.Timeout | null>(null);
  const [hoverCloseTimeoutId, setHoverCloseTimeoutId] = useState<NodeJS.Timeout | null>(null);
  const [hoverDelay, setHoverDelay] = useState(1000);

  // Initialiser le délai depuis localStorage côté client
  useEffect(() => {
    const saved = localStorage.getItem('sidebar-hover-delay');
    if (saved) {
      setHoverDelay(parseInt(saved));
    }
  }, []);

  // Écouter les changements de préférences de délai
  useEffect(() => {
    const handleDelayChange = (event: CustomEvent) => {
      setHoverDelay(event.detail);
    };

    window.addEventListener('sidebar-hover-delay-change', handleDelayChange as EventListener);

    return () => {
      window.removeEventListener('sidebar-hover-delay-change', handleDelayChange as EventListener);
    };
  }, []);

  // Auto-collapse quand une classe est sélectionnée
  useEffect(() => {
    if (isInitialLoad) {
      setIsInitialLoad(false);
      return;
    }

    if (autoCollapse && selectedClassId && selectedClassId !== "all") {
      setIsCollapsed(true);
    }
  }, [selectedClassId, autoCollapse, isInitialLoad]);

  const handleToggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  // Gestionnaires d'événements hover
  const handleMouseEnter = useCallback(() => {
    if (isCollapsed) {
      // Annuler tout timeout de fermeture en cours
      if (hoverCloseTimeoutId) {
        clearTimeout(hoverCloseTimeoutId);
        setHoverCloseTimeoutId(null);
      }

      // Utiliser le délai personnalisable
      const openTimeoutId = setTimeout(() => {
        setIsCollapsed(false);
        setHoverOpenTimeoutId(null);
      }, hoverDelay);
      setHoverOpenTimeoutId(openTimeoutId);
    }
  }, [isCollapsed, hoverCloseTimeoutId, hoverDelay]);

  const handleMouseLeave = useCallback(() => {
    // Annuler l'ouverture en cours si on quitte avant la fin du délai
    if (hoverOpenTimeoutId) {
      clearTimeout(hoverOpenTimeoutId);
      setHoverOpenTimeoutId(null);
    }

    if (!isCollapsed && autoCollapse) {
      // Délai de fermeture pour éviter les fermetures accidentelles
      const closeTimeoutId = setTimeout(() => {
        setIsCollapsed(true);
        setHoverCloseTimeoutId(null);
      }, 300); // 300ms de délai
      setHoverCloseTimeoutId(closeTimeoutId);
    }
  }, [isCollapsed, autoCollapse, hoverOpenTimeoutId]);

  // Nettoyer les timeouts au démontage
  useEffect(() => {
    return () => {
      if (hoverOpenTimeoutId) {
        clearTimeout(hoverOpenTimeoutId);
      }
      if (hoverCloseTimeoutId) {
        clearTimeout(hoverCloseTimeoutId);
      }
    };
  }, [hoverOpenTimeoutId, hoverCloseTimeoutId]);

  const selectedClass = selectedClassId 
    ? classes.find(c => c.id === selectedClassId) 
    : null;
  return (
    <div
      className={`border-r border-border/50 bg-gradient-to-b from-muted/30 to-muted/10 flex flex-col transition-all duration-300 ease-in-out ${
        isCollapsed ? "w-16" : "w-64"
      }`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Mode rétracté - Classe sélectionnée + toggle */}
      {isCollapsed && selectedClass && (
        <div className="flex flex-col h-full">
          <div className="p-3 flex-shrink-0 border-b border-border/30">
            <div className="flex flex-col items-center gap-2">
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center"
                style={{
                  backgroundColor: getClassColorWithText(selectedClass.id).backgroundColor,
                }}
              >
                <span
                  className="text-sm font-bold"
                  style={{
                    color: getClassColorWithText(selectedClass.id).color,
                  }}
                >
                  {selectedClass.classCode?.charAt(0) || "C"}
                </span>
              </div>
              <Button
                size="sm"
                variant="ghost"
                onClick={handleToggleCollapse}
                className="w-8 h-8 p-0 hover:bg-background/60"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center space-y-3 px-2">
              <p className="text-xs font-medium text-foreground [writing-mode:vertical-lr] transform rotate-180">
                {selectedClass.classCode}
              </p>
              <div className="flex items-center justify-center">
                <Users className="h-3 w-3 text-muted-foreground" />
              </div>
              <p className="text-xs text-muted-foreground [writing-mode:vertical-lr] transform rotate-180">
                {getStudentsByClass(selectedClass.id).length}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Mode rétracté - Sans sélection */}
      {isCollapsed && !selectedClass && (
        <div className="flex flex-col h-full">
          <div className="p-3 flex-shrink-0 border-b border-border/30">
            <div className="flex flex-col items-center gap-2">
              <GraduationCap className="h-5 w-5 text-primary" />
              <Button
                size="sm"
                variant="ghost"
                onClick={handleToggleCollapse}
                className="w-8 h-8 p-0 hover:bg-background/60"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center px-2">
              <p className="text-xs font-medium text-muted-foreground [writing-mode:vertical-lr] transform rotate-180">
                Classes
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Mode étendu - Vue complète */}
      {!isCollapsed && (
        <>
          <div className="px-6 py-4 flex-shrink-0 border-b border-border/30">
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2">
                <GraduationCap className="h-4 w-4 text-primary" />
                <h3 className="font-semibold text-sm text-foreground">Mes Classes</h3>
              </div>
              <Button
                size="sm"
                variant="ghost"
                onClick={handleToggleCollapse}
                className="w-6 h-6 p-0 hover:bg-background/60"
              >
                <ChevronLeft className="h-3 w-3" />
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              {classes.length} classe{classes.length > 1 ? "s" : ""} au total
            </p>
          </div>
          
          <div className="flex-1 overflow-y-auto min-h-0 p-4">
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
        </>
      )}
    </div>
  );
}