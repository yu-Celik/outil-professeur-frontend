"use client";

import { ClipboardList } from "lucide-react";

export function SessionHeader() {
  return (
    <div className="relative">
      <div className="flex justify-between items-start">
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-2xl bg-primary shadow-lg">
              <ClipboardList className="h-8 w-8 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-foreground">
                Gestion des séances
              </h1>
              <p className="text-muted-foreground text-lg mt-1">
                Évaluez la participation de vos élèves avec style et efficacité
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}