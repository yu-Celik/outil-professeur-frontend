"use client";

import { Palette, RotateCcw } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/atoms/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/atoms/dialog";
import { MOCK_CLASSES } from "@/data";
import { useClassColors } from "@/features/calendar";

interface ClassColorPickerProps {
  // Nouveau pattern standardisé (recommandé)
  open?: boolean;
  onOpenChange?: (open: boolean) => void;

  // Ancien pattern (rétrocompatibilité)
  isOpen?: boolean;
  onClose?: () => void;

  teacherId?: string;
}

/**
 * Composant pour gérer les couleurs des classes
 * Permet de choisir une couleur pour chaque classe
 */
export function ClassColorPicker({
  // Nouveau pattern
  open,
  onOpenChange,
  // Ancien pattern (rétrocompatibilité)
  isOpen,
  onClose,
  teacherId = "KsmNtVf4zwqO3VV3SQJqPrRlQBA1fFyR",
}: ClassColorPickerProps) {
  // Support des deux patterns
  const isDialogOpen = open !== undefined ? open : (isOpen ?? false);
  const handleOpenChange = (newOpen: boolean) => {
    if (onOpenChange) {
      onOpenChange(newOpen);
    } else if (onClose && !newOpen) {
      onClose();
    }
  };
  const {
    getClassBackgroundColor,
    updateClassColor,
    resetAllColors,
    getAllCurrentColors,
    getPreferences,
  } = useClassColors(teacherId, "year-2025");

  const [_selectedColor, setSelectedColor] = useState<string>("");

  // Removed early return - let Dialog handle its own open/close state

  const _currentColors = getAllCurrentColors();

  const handleColorChange = (classId: string, color: string) => {
    // S'assurer que la couleur est au format hexadécimal
    const hexColor = color.startsWith("#") ? color : `#${color}`;
    updateClassColor(classId, hexColor as `#${string}`);
  };

  const handleReset = () => {
    if (confirm("Réinitialiser toutes les couleurs aux valeurs par défaut ?")) {
      resetAllColors();
    }
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <Palette className="h-5 w-5" />
            <DialogTitle>Couleurs des classes</DialogTitle>
          </div>
          <DialogDescription>
            Choisissez une couleur pour chaque classe. Ces couleurs seront
            utilisées dans le calendrier et les autres vues.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex justify-end">
            <Button
              variant="outline"
              size="sm"
              onClick={handleReset}
              className="flex items-center gap-1"
            >
              <RotateCcw className="h-4 w-4" />
              Réinitialiser
            </Button>
          </div>

          <div className="grid gap-4">
            {MOCK_CLASSES.map((classEntity) => {
              const currentColor = getClassBackgroundColor(classEntity.id);

              return (
                <div
                  key={classEntity.id}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-6 h-6 rounded border"
                      style={{ backgroundColor: currentColor }}
                    />
                    <div>
                      <div className="font-medium">{classEntity.classCode}</div>
                      <div className="text-sm text-muted-foreground">
                        {classEntity.gradeLabel}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={currentColor}
                      onChange={(e) =>
                        handleColorChange(classEntity.id, e.target.value)
                      }
                      className="w-8 h-8 border rounded cursor-pointer"
                    />
                    <span className="text-sm font-mono text-muted-foreground min-w-[4rem]">
                      {currentColor.toUpperCase()}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="pt-4 border-t">
            <h3 className="font-medium mb-2">Palette suggérée</h3>
            <div className="grid grid-cols-12 gap-2">
              {getPreferences().colorPalette.map((color) => (
                <button
                  type="button"
                  key={color}
                  className="w-8 h-8 rounded border-2 border-transparent hover:border-gray-300 transition-colors"
                  style={{ backgroundColor: color }}
                  onClick={() => setSelectedColor(color)}
                  title={color}
                />
              ))}
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Cliquez sur une couleur puis sur une classe pour l'appliquer
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
