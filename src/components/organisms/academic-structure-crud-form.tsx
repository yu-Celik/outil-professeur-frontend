"use client";

import { useState, useEffect } from "react";
import { X, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/atoms/button";
import { Input } from "@/components/atoms/input";
import { Label } from "@/components/atoms/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/atoms/select";
import { ACADEMIC_STRUCTURE_TEMPLATES } from "@/features/gestion/mocks";
import type { AcademicStructure } from "@/types/uml-entities";

interface AcademicStructureCrudFormProps {
  academicStructure?: AcademicStructure | null;
  onSubmit: (data: AcademicStructureFormData) => void;
  onCancel: () => void;
  loading?: boolean;
}

export interface AcademicStructureFormData {
  name: string;
  periodModel: string;
  periodsPerYear: number;
  periodNames: Record<string, string>;
}

export function AcademicStructureCrudForm({
  academicStructure,
  onSubmit,
  onCancel,
  loading = false,
}: AcademicStructureCrudFormProps) {
  const [formData, setFormData] = useState<AcademicStructureFormData>({
    name: "",
    periodModel: "",
    periodsPerYear: 3,
    periodNames: {},
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [selectedTemplate, setSelectedTemplate] = useState<string>("");

  // Initialiser le formulaire avec les données existantes
  useEffect(() => {
    if (academicStructure) {
      setFormData({
        name: academicStructure.name,
        periodModel: academicStructure.periodModel,
        periodsPerYear: academicStructure.periodsPerYear,
        periodNames: { ...academicStructure.periodNames } as Record<
          string,
          string
        >,
      });
    }
  }, [academicStructure]);

  // Appliquer un template
  const applyTemplate = (templateKey: string) => {
    const template =
      ACADEMIC_STRUCTURE_TEMPLATES[
        templateKey as keyof typeof ACADEMIC_STRUCTURE_TEMPLATES
      ];
    if (template) {
      setFormData({
        name: template.name,
        periodModel: template.periodModel,
        periodsPerYear: template.periodsPerYear,
        periodNames: { ...template.periodNames } as Record<string, string>,
      });
      setSelectedTemplate(templateKey);
    }
  };

  // Mettre à jour le nombre de périodes
  const updatePeriodsPerYear = (count: number) => {
    const newPeriodNames: Record<string, string> = {};

    // Conserver les noms existants
    for (let i = 1; i <= count; i++) {
      newPeriodNames[i.toString()] =
        formData.periodNames[i.toString()] || `Période ${i}`;
    }

    setFormData((prev) => ({
      ...prev,
      periodsPerYear: count,
      periodNames: newPeriodNames,
    }));
  };

  // Mettre à jour le nom d'une période
  const updatePeriodName = (order: number, name: string) => {
    setFormData((prev) => ({
      ...prev,
      periodNames: {
        ...prev.periodNames,
        [order.toString()]: name,
      },
    }));
  };

  // Valider le formulaire
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Le nom de la structure est requis";
    }

    if (!formData.periodModel.trim()) {
      newErrors.periodModel = "Le modèle de période est requis";
    }

    if (formData.periodsPerYear < 1 || formData.periodsPerYear > 12) {
      newErrors.periodsPerYear =
        "Le nombre de périodes doit être entre 1 et 12";
    }

    // Vérifier que tous les noms de périodes sont définis
    for (let i = 1; i <= formData.periodsPerYear; i++) {
      if (!formData.periodNames[i.toString()]?.trim()) {
        newErrors[`period_${i}`] = `Le nom de la période ${i} est requis`;
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Soumettre le formulaire
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const isEditing = !!academicStructure;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">
          {isEditing
            ? "Modifier la structure académique"
            : "Créer une structure académique"}
        </h3>
        <Button variant="ghost" size="sm" onClick={onCancel}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Template selector (uniquement en création) */}
        {!isEditing && (
          <div className="space-y-2">
            <Label htmlFor="template">Template prédéfini (optionnel)</Label>
            <Select
              value={selectedTemplate}
              onValueChange={(value) => {
                setSelectedTemplate(value);
                if (value) applyTemplate(value);
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Choisir un template..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Aucun template</SelectItem>
                {Object.entries(ACADEMIC_STRUCTURE_TEMPLATES).map(
                  ([key, template]) => (
                    <SelectItem key={key} value={key}>
                      {template.name} ({template.periodsPerYear} périodes)
                    </SelectItem>
                  ),
                )}
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Nom de la structure */}
        <div className="space-y-2">
          <Label htmlFor="name">
            Nom de la structure <span className="text-red-500">*</span>
          </Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, name: e.target.value }))
            }
            placeholder="Ex: Système Trimestre (France)"
            className={errors.name ? "border-red-500" : ""}
          />
          {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
        </div>

        {/* Modèle de période */}
        <div className="space-y-2">
          <Label htmlFor="periodModel">
            Modèle de période <span className="text-red-500">*</span>
          </Label>
          <Input
            id="periodModel"
            value={formData.periodModel}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, periodModel: e.target.value }))
            }
            placeholder="Ex: trimestre, semestre, quartier"
            className={errors.periodModel ? "border-red-500" : ""}
          />
          {errors.periodModel && (
            <p className="text-sm text-red-500">{errors.periodModel}</p>
          )}
        </div>

        {/* Nombre de périodes par an */}
        <div className="space-y-2">
          <Label htmlFor="periodsPerYear">
            Nombre de périodes par an <span className="text-red-500">*</span>
          </Label>
          <Select
            value={formData.periodsPerYear.toString()}
            onValueChange={(value) => updatePeriodsPerYear(parseInt(value))}
          >
            <SelectTrigger
              className={errors.periodsPerYear ? "border-red-500" : ""}
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Array.from({ length: 12 }, (_, i) => i + 1).map((num) => (
                <SelectItem key={num} value={num.toString()}>
                  {num} période{num > 1 ? "s" : ""}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.periodsPerYear && (
            <p className="text-sm text-red-500">{errors.periodsPerYear}</p>
          )}
        </div>

        {/* Noms des périodes */}
        <div className="space-y-3">
          <Label>
            Noms des périodes <span className="text-red-500">*</span>
          </Label>
          <div className="space-y-2">
            {Array.from({ length: formData.periodsPerYear }, (_, i) => {
              const order = i + 1;
              const errorKey = `period_${order}`;

              return (
                <div key={order} className="flex items-center space-x-2">
                  <span className="text-sm font-medium min-w-[80px]">
                    Période {order}:
                  </span>
                  <Input
                    value={formData.periodNames[order.toString()] || ""}
                    onChange={(e) => updatePeriodName(order, e.target.value)}
                    placeholder={`Nom de la période ${order}`}
                    className={errors[errorKey] ? "border-red-500" : ""}
                  />
                  {errors[errorKey] && (
                    <p className="text-sm text-red-500">{errors[errorKey]}</p>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end space-x-2 pt-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            Annuler
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? "Enregistrement..." : isEditing ? "Modifier" : "Créer"}
          </Button>
        </div>
      </form>
    </div>
  );
}
