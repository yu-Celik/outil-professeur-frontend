"use client";

import { Calendar, Edit, Eye, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/atoms/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/molecules/card";
import type { StudentObservation } from "@/features/students/types/observation-types";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/molecules/alert-dialog";

interface StudentObservationsTimelineProps {
  observations: StudentObservation[];
  onAdd: () => void;
  onEdit: (observation: StudentObservation) => void;
  onDelete: (observationId: string) => void;
  isLoading?: boolean;
}

export function StudentObservationsTimeline({
  observations,
  onAdd,
  onEdit,
  onDelete,
  isLoading = false,
}: StudentObservationsTimelineProps) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [observationToDelete, setObservationToDelete] = useState<string | null>(
    null,
  );

  const handleDeleteClick = (observationId: string) => {
    setObservationToDelete(observationId);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (observationToDelete) {
      onDelete(observationToDelete);
      setObservationToDelete(null);
    }
    setDeleteDialogOpen(false);
  };

  // Sort observations by createdAt descending (most recent first)
  const sortedObservations = [...observations].sort(
    (a, b) => b.createdAt.getTime() - a.createdAt.getTime(),
  );

  return (
    <>
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Eye className="h-4 w-4 text-primary" />
              <CardTitle className="text-base font-semibold">
                Observations Enseignante
              </CardTitle>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={onAdd}
              disabled={isLoading}
              className="gap-2"
            >
              <Plus className="h-3 w-3" />
              Ajouter observation
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {sortedObservations.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Eye className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p className="text-sm font-medium mb-2">
                Aucune observation enregistrée
              </p>
              <p className="text-xs mb-4">
                Ajoutez des observations pour documenter le parcours de l'élève
              </p>
              <Button variant="outline" size="sm" onClick={onAdd}>
                <Plus className="h-3 w-3 mr-2" />
                Première observation
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Timeline */}
              <div className="relative space-y-4">
                {/* Timeline line */}
                <div className="absolute left-[15px] top-2 bottom-2 w-[2px] bg-border" />

                {sortedObservations.map((observation, index) => (
                  <div key={observation.id} className="relative pl-10">
                    {/* Timeline dot */}
                    <div
                      className={`absolute left-0 top-1 h-[30px] w-[30px] rounded-full border-2 flex items-center justify-center ${
                        index === 0
                          ? "bg-primary border-primary text-primary-foreground"
                          : "bg-background border-border"
                      }`}
                    >
                      <Eye className="h-4 w-4" />
                    </div>

                    {/* Observation card */}
                    <div className="group bg-muted/30 rounded-lg p-4 hover:bg-muted/50 transition-colors">
                      <div className="flex items-start justify-between gap-4 mb-2">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                            <Calendar className="h-3 w-3" />
                            <time
                              dateTime={observation.createdAt.toISOString()}
                            >
                              {format(observation.createdAt, "d MMMM yyyy", {
                                locale: fr,
                              })}
                            </time>
                            <span className="text-muted-foreground/60">•</span>
                            <span>{observation.author}</span>
                          </div>
                          <p className="text-sm text-foreground whitespace-pre-wrap">
                            {observation.content}
                          </p>
                        </div>
                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onEdit(observation)}
                            className="h-8 w-8 p-0"
                          >
                            <Edit className="h-3 w-3" />
                            <span className="sr-only">Modifier</span>
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteClick(observation.id)}
                            className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-3 w-3" />
                            <span className="sr-only">Supprimer</span>
                          </Button>
                        </div>
                      </div>
                      {observation.updatedAt.getTime() !==
                        observation.createdAt.getTime() && (
                        <div className="text-xs text-muted-foreground/60 italic mt-1">
                          Modifié le{" "}
                          {format(observation.updatedAt, "d MMM yyyy", {
                            locale: fr,
                          })}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Supprimer l'observation ?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action est irréversible. L'observation sera définitivement
              supprimée.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
