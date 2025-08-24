"use client";

import { useState } from "react";
import { Button } from "@/components/atoms/button";
import { Label } from "@/components/atoms/label";
import { Input } from "@/components/atoms/input";

interface AddIdentifierFormProps {
  onSubmit: (identifier: string) => void;
  onCancel: () => void;
}

export function AddIdentifierForm({
  onSubmit,
  onCancel,
}: AddIdentifierFormProps) {
  const [identifier, setIdentifier] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!identifier.trim()) {
      return;
    }

    onSubmit(identifier.trim().toUpperCase());
  };

  const isValid = identifier.trim().length > 0;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="identifier">Nouvel identifiant</Label>
          <Input
            id="identifier"
            type="text"
            placeholder="Ex: E, F, G..."
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            maxLength={2}
            className="uppercase"
          />
          <p className="text-xs text-muted-foreground">
            Saisissez une ou deux lettres pour identifier la classe
          </p>
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t">
        <Button type="button" variant="outline" onClick={onCancel}>
          Annuler
        </Button>
        <Button type="submit" disabled={!isValid}>
          Créer l'identifiant
        </Button>
      </div>
    </form>
  );
}
