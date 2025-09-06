"use client";

import { useState } from "react";
import {
  Clock,
  Plus,
  Edit,
  Trash2,
  EyeOff,
  Eye,
  GripVertical,
  AlertTriangle,
} from "lucide-react";
import { Button } from "@/components/atoms/button";
import { Badge } from "@/components/atoms/badge";
import { Card, CardContent, CardHeader } from "@/components/molecules/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/molecules/dialog";
import { TimeSlotForm } from "@/components/molecules/timeslot-form";
import { useTimeSlots } from "@/hooks/use-timeslots";
import type { TimeSlot } from "@/types/uml-entities";

interface TimeSlotsManagementProps {
  teacherId?: string;
}

export function TimeSlotsManagement({ teacherId }: TimeSlotsManagementProps) {
  const {
    timeSlots,
    loading,
    createTimeSlot,
    updateTimeSlot,
    deleteTimeSlot,
    toggleTimeSlot,
    reorderTimeSlots,
    checkConflicts,
    calculateDuration,
  } = useTimeSlots(teacherId);

  const [showForm, setShowForm] = useState(false);
  const [editingSlot, setEditingSlot] = useState<TimeSlot | null>(null);
  const [draggedSlot, setDraggedSlot] = useState<TimeSlot | null>(null);

  const activeSlots = timeSlots.filter((slot) => !slot.isBreak);
  const inactiveSlots = timeSlots.filter((slot) => slot.isBreak);

  const handleCreate = async (data: any) => {
    await createTimeSlot(data);
  };

  const handleUpdate = async (data: any) => {
    await updateTimeSlot(data);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer ce créneau ?")) {
      await deleteTimeSlot(id);
    }
  };

  const handleToggle = async (id: string) => {
    await toggleTimeSlot(id);
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h${mins > 0 ? ` ${mins}min` : ""}`;
    }
    return `${mins}min`;
  };

  const handleDragStart = (e: React.DragEvent, slot: TimeSlot) => {
    setDraggedSlot(slot);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = async (e: React.DragEvent, targetSlot: TimeSlot) => {
    e.preventDefault();

    if (!draggedSlot || draggedSlot.id === targetSlot.id) return;

    const reorderedSlots = [...activeSlots];
    const draggedIndex = reorderedSlots.findIndex(
      (slot) => slot.id === draggedSlot.id,
    );
    const targetIndex = reorderedSlots.findIndex(
      (slot) => slot.id === targetSlot.id,
    );

    reorderedSlots.splice(draggedIndex, 1);
    reorderedSlots.splice(targetIndex, 0, draggedSlot);

    await reorderTimeSlots([...reorderedSlots, ...inactiveSlots]);
    setDraggedSlot(null);
  };

  const TimeSlotItem = ({ slot, index }: { slot: TimeSlot; index: number }) => {
    const conflicts = checkConflicts(
      {
        startTime: slot.startTime,
        endTime: slot.endTime,
        name: slot.name,
      },
      slot.id,
    );

    return (
      <div
        key={slot.id}
        draggable={!slot.isBreak}
        onDragStart={(e) => handleDragStart(e, slot)}
        onDragOver={handleDragOver}
        onDrop={(e) => handleDrop(e, slot)}
        className={`group p-4 border rounded-lg transition-all duration-200 ${
          slot.isBreak
            ? "bg-muted/50 border-muted text-muted-foreground"
            : "bg-background border-border hover:border-primary/50"
        } ${draggedSlot?.id === slot.id ? "opacity-50" : ""}`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {!slot.isBreak && (
              <div className="cursor-grab hover:cursor-grabbing">
                <GripVertical className="h-4 w-4 text-muted-foreground" />
              </div>
            )}

            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-xs">
                #{index + 1}
              </Badge>
              <Clock className="h-4 w-4" />
            </div>

            <div>
              <div className="font-medium">
                {slot.name}
                {slot.isBreak && (
                  <Badge variant="secondary" className="ml-2 text-xs">
                    Désactivé
                  </Badge>
                )}
              </div>
              <div className="text-sm text-muted-foreground">
                {slot.startTime} - {slot.endTime} (
                {formatDuration(slot.durationMinutes)})
              </div>
              {conflicts.length > 0 && (
                <div className="flex items-center gap-1 text-xs text-destructive mt-1">
                  <AlertTriangle className="h-3 w-3" />
                  Conflit avec {conflicts.length} autre
                  {conflicts.length > 1 ? "s" : ""} créneau
                  {conflicts.length > 1 ? "x" : ""}
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setEditingSlot(slot);
                setShowForm(true);
              }}
            >
              <Edit className="h-4 w-4" />
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleToggle(slot.id)}
            >
              {slot.isBreak ? (
                <Eye className="h-4 w-4" />
              ) : (
                <EyeOff className="h-4 w-4" />
              )}
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleDelete(slot.id)}
              className="text-destructive hover:text-destructive"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Clock className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-semibold">Créneaux horaires</h2>
              <p className="text-sm text-muted-foreground">
                Gérez les créneaux de votre établissement
              </p>
            </div>
          </div>
          <Button onClick={() => setShowForm(true)} className="gap-2">
            <Plus className="h-4 w-4" />
            Nouveau créneau
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Statistiques */}
        <div className="grid grid-cols-3 gap-4">
          <div className="p-3 bg-chart-1/10 border border-chart-1/20 rounded-lg">
            <div className="text-2xl font-bold text-chart-1">
              {activeSlots.length}
            </div>
            <div className="text-xs text-chart-1">Créneaux actifs</div>
          </div>
          <div className="p-3 bg-muted/50 border border-border rounded-lg">
            <div className="text-2xl font-bold text-muted-foreground">
              {inactiveSlots.length}
            </div>
            <div className="text-xs text-muted-foreground">Désactivés</div>
          </div>
          <div className="p-3 bg-chart-3/10 border border-chart-3/20 rounded-lg">
            <div className="text-2xl font-bold text-chart-3">
              {activeSlots.reduce((acc, slot) => acc + slot.durationMinutes, 0)}
              min
            </div>
            <div className="text-xs text-chart-3">Durée totale</div>
          </div>
        </div>

        {/* Liste des créneaux actifs */}
        {activeSlots.length > 0 && (
          <div>
            <h3 className="font-semibold mb-3 text-foreground">
              Créneaux actifs ({activeSlots.length})
            </h3>
            <div className="space-y-2">
              {activeSlots.map((slot, index) => (
                <TimeSlotItem key={slot.id} slot={slot} index={index} />
              ))}
            </div>
          </div>
        )}

        {/* Liste des créneaux désactivés */}
        {inactiveSlots.length > 0 && (
          <div>
            <h3 className="font-semibold mb-3 text-muted-foreground">
              Créneaux désactivés ({inactiveSlots.length})
            </h3>
            <div className="space-y-2">
              {inactiveSlots.map((slot, index) => (
                <TimeSlotItem
                  key={slot.id}
                  slot={slot}
                  index={activeSlots.length + index}
                />
              ))}
            </div>
          </div>
        )}

        {/* État vide */}
        {timeSlots.length === 0 && (
          <div className="text-center py-12">
            <div className="w-20 h-20 rounded-2xl bg-muted/50 flex items-center justify-center mx-auto mb-4">
              <Clock className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="font-semibold text-lg mb-2">
              Aucun créneau configuré
            </h3>
            <p className="text-muted-foreground mb-4 max-w-sm mx-auto">
              Créez votre premier créneau horaire pour structurer votre
              calendrier
            </p>
            <Button onClick={() => setShowForm(true)} className="gap-2">
              <Plus className="h-4 w-4" />
              Créer un créneau
            </Button>
          </div>
        )}
      </CardContent>

      {/* Modal de formulaire */}
      <Dialog
        open={showForm}
        onOpenChange={(open) => {
          if (!open) {
            setShowForm(false);
            setEditingSlot(null);
          }
        }}
      >
        <DialogContent size="lg" className="max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingSlot ? "Modifier le créneau" : "Nouveau créneau"}
            </DialogTitle>
          </DialogHeader>
          <TimeSlotForm
            onClose={() => {
              setShowForm(false);
              setEditingSlot(null);
            }}
            onSave={handleCreate}
            onUpdate={editingSlot ? handleUpdate : undefined}
            initialData={editingSlot || undefined}
            calculateDuration={calculateDuration}
            checkConflicts={checkConflicts}
            standalone={false}
          />
        </DialogContent>
      </Dialog>
    </Card>
  );
}
