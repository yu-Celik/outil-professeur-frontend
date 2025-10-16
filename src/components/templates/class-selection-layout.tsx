"use client";

import { useEffect } from "react";
import { ClassesSidebar } from "@/components/organisms/classes-sidebar";
import { useClassSelection } from "@/contexts/class-selection-context";
import type { Class } from "@/types/uml-entities";

interface ClassSelectionLayoutProps {
  children: React.ReactNode;
  emptyStateIcon?: React.ReactNode;
  emptyStateTitle?: string;
  emptyStateDescription?: string;
  // Props optionnelles pour override du comportement par défaut
  customClasses?: Class[];
  customSelectedClassId?: string | null;
  customOnClassSelect?: (classId: string | null) => void;
  customGetClassColorWithText?: (classId: string) => {
    backgroundColor: string;
    color: string;
    borderColor: string;
  };
}

export function ClassSelectionLayout({
  children,
  emptyStateIcon,
  emptyStateTitle = "Sélectionnez une classe",
  emptyStateDescription = "Choisissez une classe dans la sidebar pour continuer",
  customClasses,
  customSelectedClassId,
  customOnClassSelect,
  customGetClassColorWithText,
}: ClassSelectionLayoutProps) {
  const {
    selectedClassId: contextSelectedClassId,
    classes: contextClasses,
    getClassColorWithText: contextGetClassColorWithText,
    handleClassSelect: contextHandleClassSelect,
    selectFirstClassIfAvailable,
  } = useClassSelection();

  // Utiliser les props custom ou les valeurs du context global
  const selectedClassId =
    customSelectedClassId !== undefined
      ? customSelectedClassId
      : contextSelectedClassId;
  const classes = customClasses || contextClasses;
  const getClassColorWithText =
    customGetClassColorWithText || contextGetClassColorWithText;
  const handleClassSelect = customOnClassSelect || contextHandleClassSelect;

  // Sélectionner automatiquement la première classe seulement si pas de props custom
  useEffect(() => {
    if (!customSelectedClassId && !customOnClassSelect) {
      selectFirstClassIfAvailable();
    }
  }, [selectFirstClassIfAvailable, customSelectedClassId, customOnClassSelect]);

  return (
    <div className="flex flex-col min-h-0 -m-4 md:-m-6 h-[calc(100vh-var(--header-height)-1rem)] overflow-hidden">
      <div className="flex flex-1 min-h-0">
        {/* Sidebar des classes */}
        <ClassesSidebar
          classes={classes}
          selectedClassId={selectedClassId}
          onClassSelect={handleClassSelect}
          getClassColorWithText={getClassColorWithText}
        />

        {/* Zone principale */}
        <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
          <div className="space-y-6 p-6">
            {!selectedClassId ? (
              <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-muted/50 to-muted/30 flex items-center justify-center mb-6">
                  {emptyStateIcon}
                </div>
                <div className="text-xl font-semibold mb-3 text-foreground">
                  {emptyStateTitle}
                </div>
                <div className="text-sm text-center max-w-sm leading-relaxed">
                  {emptyStateDescription}
                </div>
              </div>
            ) : (
              children
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
