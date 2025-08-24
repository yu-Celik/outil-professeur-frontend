"use client";

import { useState } from "react";
import { Button } from "@/components/atoms/button";
import { Input } from "@/components/atoms/input";
import { Label } from "@/components/atoms/label";

interface AddLevelFormProps {
  onSubmit: (level: { value: string; label: string }) => void;
  onCancel: () => void;
}

export function AddLevelForm({ onSubmit, onCancel }: AddLevelFormProps) {
  const [levelName, setLevelName] = useState("");
  const [levelCode, setLevelCode] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!levelName.trim() || !levelCode.trim()) {
      return;
    }

    onSubmit({
      value: levelCode.trim().toLowerCase(),
      label: levelName.trim(),
    });
  };

  const isValid = levelName.trim().length > 0 && levelCode.trim().length > 0;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="levelName">Nom du niveau</Label>
          <Input
            id="levelName"
            type="text"
            placeholder="Ex: 1ère S, BTS 1ère année..."
            value={levelName}
            onChange={(e) => setLevelName(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="levelCode">Code du niveau</Label>
          <Input
            id="levelCode"
            type="text"
            placeholder="Ex: 1ere-s, bts1..."
            value={levelCode}
            onChange={(e) => setLevelCode(e.target.value)}
            className="lowercase"
          />
          <p className="text-xs text-muted-foreground">
            Code technique utilisé en interne (lettres minuscules et tirets)
          </p>
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t">
        <Button type="button" variant="outline" onClick={onCancel}>
          Annuler
        </Button>
        <Button type="submit" disabled={!isValid}>
          Créer le niveau
        </Button>
      </div>
    </form>
  );
}
