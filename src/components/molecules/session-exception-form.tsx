"use client";

import { useState } from "react";
import { Button } from "@/components/atoms/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/molecules/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/molecules/select";
import { Textarea } from "@/components/atoms/textarea";
import { MOCK_TIME_SLOTS, MOCK_CLASSES, MOCK_SUBJECTS } from "@/data";
import { X, Calendar, Clock, MapPin, AlertCircle } from "lucide-react";
import type { SessionException } from "@/services/session-generator";
import type { CourseSession } from "@/types/uml-entities";

interface SessionExceptionFormProps {
  session: CourseSession;
  onClose: () => void;
  onSave: (exception: Omit<SessionException, "id">) => void;
}

/**
 * Formulaire pour créer des exceptions ponctuelles sur une session
 * Permet d'annuler, déplacer ou programmer un rattrapage
 */
export function SessionExceptionForm({
  session,
  onClose,
  onSave,
}: SessionExceptionFormProps) {
  const [exceptionType, setExceptionType] = useState<
    "cancelled" | "moved" | "makeup"
  >("cancelled");
  const [reason, setReason] = useState("");
  const [newTimeSlotId, setNewTimeSlotId] = useState("");
  const [newRoom, setNewRoom] = useState("");
  const [makeupDate, setMakeupDate] = useState("");

  const classEntity = MOCK_CLASSES.find((c) => c.id === session.classId);
  const subject = MOCK_SUBJECTS.find((s) => s.id === session.subjectId);
  const timeSlot = MOCK_TIME_SLOTS.find((ts) => ts.id === session.timeSlotId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const baseException = {
      templateId: `template-${session.sessionDate.toISOString().slice(0, 10)}-${session.classId}`,
      exceptionDate: session.sessionDate,
      reason: reason.trim(),
    };

    let exception: Omit<SessionException, "id">;

    switch (exceptionType) {
      case "cancelled":
        exception = {
          ...baseException,
          type: "cancelled",
        };
        break;

      case "moved":
        if (!newTimeSlotId) {
          alert("Veuillez sélectionner un nouveau créneau");
          return;
        }
        exception = {
          ...baseException,
          type: "moved",
          newTimeSlotId,
          newRoom: newRoom.trim() || undefined,
        };
        break;

      case "makeup":
        if (!makeupDate || !newTimeSlotId) {
          alert(
            "Veuillez sélectionner une date et un créneau pour le rattrapage",
          );
          return;
        }
        exception = {
          ...baseException,
          type: "added",
          exceptionDate: new Date(makeupDate),
          newTimeSlotId,
          newRoom: newRoom.trim() || session.room,
          reason: `Rattrapage du ${session.sessionDate.toLocaleDateString("fr-FR")} - ${reason}`,
        };
        break;
    }

    onSave(exception);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg">Ajustement ponctuel</CardTitle>
              <div className="text-sm text-muted-foreground mt-1">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  {session.sessionDate.toLocaleDateString("fr-FR", {
                    weekday: "long",
                    day: "numeric",
                    month: "long",
                  })}
                  <Clock className="h-4 w-4 ml-2" />
                  {timeSlot?.startTime} - {timeSlot?.endTime}
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <span className="font-medium">{subject?.name}</span>
                  <span>•</span>
                  <span>{classEntity?.classCode}</span>
                  <MapPin className="h-4 w-4 ml-2" />
                  <span>{session.room}</span>
                </div>
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Type d'exception */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Type d'ajustement</label>
              <Select
                value={exceptionType}
                onValueChange={(value: any) => setExceptionType(value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cancelled">
                    <div className="flex items-center gap-2">
                      <AlertCircle className="h-4 w-4 text-destructive" />
                      Annuler cette séance
                    </div>
                  </SelectItem>
                  <SelectItem value="moved">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-chart-4" />
                      Déplacer à un autre créneau
                    </div>
                  </SelectItem>
                  <SelectItem value="makeup">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-chart-1" />
                      Programmer un rattrapage
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Déplacement - Nouveau créneau */}
            {exceptionType === "moved" && (
              <div className="space-y-4 p-4 bg-chart-4/10 rounded-lg border border-chart-4/20">
                <h3 className="font-medium text-chart-4">Déplacer la séance</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      Nouveau créneau
                    </label>
                    <Select
                      value={newTimeSlotId}
                      onValueChange={setNewTimeSlotId}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Choisir un créneau" />
                      </SelectTrigger>
                      <SelectContent>
                        {MOCK_TIME_SLOTS.map((slot) => (
                          <SelectItem key={slot.id} value={slot.id}>
                            {slot.startTime} - {slot.endTime}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      Nouvelle salle (optionnel)
                    </label>
                    <input
                      type="text"
                      value={newRoom}
                      onChange={(e) => setNewRoom(e.target.value)}
                      placeholder={session.room}
                      className="w-full px-3 py-2 border border-input rounded-md"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Rattrapage - Nouvelle date + créneau */}
            {exceptionType === "makeup" && (
              <div className="space-y-4 p-4 bg-chart-1/10 rounded-lg border border-chart-1/20">
                <h3 className="font-medium text-chart-1">
                  Programmer un rattrapage
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      Date du rattrapage
                    </label>
                    <input
                      type="date"
                      value={makeupDate}
                      onChange={(e) => setMakeupDate(e.target.value)}
                      className="w-full px-3 py-2 border border-input rounded-md"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Créneau</label>
                    <Select
                      value={newTimeSlotId}
                      onValueChange={setNewTimeSlotId}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Choisir un créneau" />
                      </SelectTrigger>
                      <SelectContent>
                        {MOCK_TIME_SLOTS.map((slot) => (
                          <SelectItem key={slot.id} value={slot.id}>
                            {slot.startTime} - {slot.endTime}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    Salle du rattrapage
                  </label>
                  <input
                    type="text"
                    value={newRoom}
                    onChange={(e) => setNewRoom(e.target.value)}
                    placeholder={session.room}
                    className="w-full px-3 py-2 border border-input rounded-md"
                  />
                </div>
              </div>
            )}

            {/* Raison */}
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Motif{" "}
                {exceptionType === "cancelled"
                  ? "de l'annulation"
                  : exceptionType === "moved"
                    ? "du déplacement"
                    : "du rattrapage"}
              </label>
              <Textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder={
                  exceptionType === "cancelled"
                    ? "Ex: Professeur en arrêt maladie"
                    : exceptionType === "moved"
                      ? "Ex: Réunion parents-professeurs"
                      : "Ex: Suite à l'annulation du 15 janvier"
                }
                className="min-h-20"
                required
              />
            </div>

            <div className="flex justify-end gap-2 pt-4 border-t">
              <Button type="button" variant="outline" onClick={onClose}>
                Annuler
              </Button>
              <Button type="submit">
                {exceptionType === "cancelled"
                  ? "Annuler la séance"
                  : exceptionType === "moved"
                    ? "Déplacer"
                    : "Programmer le rattrapage"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
