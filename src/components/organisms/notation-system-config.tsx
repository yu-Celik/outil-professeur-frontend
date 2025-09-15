"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/atoms/button";
import { Card } from "@/components/molecules/card";
import { Badge } from "@/components/atoms/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/molecules/dialog";
import { Input } from "@/components/atoms/input";
import { Label } from "@/components/atoms/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/molecules/select";
import { Textarea } from "@/components/atoms/textarea";
import { Switch } from "@/components/atoms/switch";
import { AlertCircle, Plus, Edit, Trash2, Copy, Download, Upload } from "lucide-react";
import { Alert, AlertDescription } from "@/components/molecules/alert";
import { useNotationSystem } from "@/features/evaluations/hooks/use-notation-system";
import type { NotationSystem, CreateNotationSystemData, UpdateNotationSystemData } from "@/features/evaluations/services/notation-system-service";

interface NotationSystemConfigProps {
  schoolYearId?: string;
  onSystemChange?: (systemId: string) => void;
}

export function NotationSystemConfig({ schoolYearId = "year-2025", onSystemChange }: NotationSystemConfigProps) {
  const {
    notationSystems,
    defaultSystem,
    loading,
    error,
    createNotationSystem,
    updateNotationSystem,
    deleteNotationSystem,
    getScaleConfigurations,
    refresh,
  } = useNotationSystem(schoolYearId);

  const [selectedSystem, setSelectedSystem] = useState<NotationSystem | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [scaleConfigs, setScaleConfigs] = useState<Record<string, any>>({});

  // Load scale configurations
  useEffect(() => {
    const loadConfigs = async () => {
      const configs = await getScaleConfigurations();
      setScaleConfigs(configs);
    };
    loadConfigs();
  }, [getScaleConfigurations]);


  const handleSystemSelect = (system: NotationSystem) => {
    setSelectedSystem(system);
    onSystemChange?.(system.id);
  };

  const handleDeleteSystem = async (systemId: string) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce système de notation ?")) {
      const success = await deleteNotationSystem(systemId);
      if (success) {
        setSelectedSystem(null);
      }
    }
  };

  if (loading) {
    return (
      <Card className="p-6">
        <div className="text-center">Chargement des systèmes de notation...</div>
      </Card>
    );
  }

  if (error) {
    return (
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Configuration des systèmes de notation</h2>
          <p className="text-muted-foreground">
            Gérez vos systèmes de notation et leurs conversions
          </p>
        </div>
        <div className="flex gap-2">
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Nouveau système
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Créer un nouveau système de notation</DialogTitle>
              </DialogHeader>
              <CreateSystemForm
                scaleConfigs={scaleConfigs}
                onSubmit={async (data) => {
                  const result = await createNotationSystem(data);
                  if (result) {
                    setIsCreateDialogOpen(false);
                  }
                }}
              />
            </DialogContent>
          </Dialog>

        </div>
      </div>

      <div className="space-y-4">
        <SystemsList
          systems={notationSystems}
          selectedSystem={selectedSystem}
          defaultSystem={defaultSystem}
          onSelect={handleSystemSelect}
          onEdit={(system) => {
            setSelectedSystem(system);
            setIsEditDialogOpen(true);
          }}
          onDelete={handleDeleteSystem}
        />
      </div>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Modifier le système de notation</DialogTitle>
          </DialogHeader>
          {selectedSystem && (
            <EditSystemForm
              system={selectedSystem}
              scaleConfigs={scaleConfigs}
              onSubmit={async (data) => {
                const result = await updateNotationSystem(data);
                if (result) {
                  setIsEditDialogOpen(false);
                  setSelectedSystem(result);
                }
              }}
            />
          )}
        </DialogContent>
      </Dialog>

    </div>
  );
}

// Systems List Component
function SystemsList({
  systems,
  selectedSystem,
  defaultSystem,
  onSelect,
  onEdit,
  onDelete,
}: {
  systems: NotationSystem[];
  selectedSystem: NotationSystem | null;
  defaultSystem: NotationSystem | null;
  onSelect: (system: NotationSystem) => void;
  onEdit: (system: NotationSystem) => void;
  onDelete: (systemId: string) => void;
}) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {systems.map((system) => (
        <Card
          key={system.id}
          className={`p-4 cursor-pointer transition-colors ${
            selectedSystem?.id === system.id
              ? "ring-2 ring-primary bg-primary/5"
              : "hover:bg-muted/50"
          }`}
          onClick={() => onSelect(system)}
        >
          <div className="flex items-start justify-between mb-3">
            <div>
              <h3 className="font-semibold">{system.name}</h3>
              <p className="text-sm text-muted-foreground">
                {system.minValue} - {system.maxValue}
              </p>
            </div>
            <div className="flex gap-1">
              {defaultSystem?.id === system.id && (
                <Badge variant="default" className="text-xs">Par défaut</Badge>
              )}
              <Badge variant="outline" className="text-xs">
                {system.scaleType}
              </Badge>
            </div>
          </div>

          <div className="text-xs text-muted-foreground mb-3">
            Exemple: {system.formatDisplay(system.maxValue * 0.8, "fr-FR")}
          </div>

          <div className="flex gap-2">
            <Button size="sm" variant="outline" onClick={(e) => {
              e.stopPropagation();
              onEdit(system);
            }}>
              <Edit className="w-3 h-3" />
            </Button>
            <Button size="sm" variant="outline" onClick={(e) => {
              e.stopPropagation();
              // Copy system
            }}>
              <Copy className="w-3 h-3" />
            </Button>
            <Button size="sm" variant="destructive" onClick={(e) => {
              e.stopPropagation();
              onDelete(system.id);
            }}>
              <Trash2 className="w-3 h-3" />
            </Button>
          </div>
        </Card>
      ))}
    </div>
  );
}

// Create System Form Component
function CreateSystemForm({
  scaleConfigs,
  onSubmit,
}: {
  scaleConfigs: Record<string, any>;
  onSubmit: (data: CreateNotationSystemData) => Promise<void>;
}) {
  const [formData, setFormData] = useState<Partial<CreateNotationSystemData>>({
    scaleType: "numeric",
    createdBy: "current-user",
  });

  const handleScaleTypeChange = (scaleType: string) => {
    const config = scaleConfigs[scaleType];
    if (config) {
      setFormData(prev => ({
        ...prev,
        scaleType: scaleType as any,
        minValue: config.defaultRange.min,
        maxValue: config.defaultRange.max,
        rules: { ...config.rulesTemplate },
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name && formData.scaleType &&
        formData.minValue !== undefined && formData.maxValue !== undefined) {
      onSubmit(formData as CreateNotationSystemData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="name">Nom du système</Label>
          <Input
            id="name"
            value={formData.name || ""}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            placeholder="ex: Notation sur 20"
            required
          />
        </div>

        <div>
          <Label htmlFor="scaleType">Type d'échelle</Label>
          <Select value={formData.scaleType} onValueChange={handleScaleTypeChange}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(scaleConfigs).map(([key, config]) => (
                <SelectItem key={key} value={key}>
                  {config.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="minValue">Valeur minimale</Label>
          <Input
            id="minValue"
            type="number"
            value={formData.minValue || 0}
            onChange={(e) => setFormData(prev => ({ ...prev, minValue: Number(e.target.value) }))}
            required
          />
        </div>

        <div>
          <Label htmlFor="maxValue">Valeur maximale</Label>
          <Input
            id="maxValue"
            type="number"
            value={formData.maxValue || 20}
            onChange={(e) => setFormData(prev => ({ ...prev, maxValue: Number(e.target.value) }))}
            required
          />
        </div>
      </div>

      {formData.scaleType && scaleConfigs[formData.scaleType] && (
        <div>
          <Label>Configuration avancée</Label>
          <div className="text-sm text-muted-foreground mb-2">
            {scaleConfigs[formData.scaleType].description}
          </div>
          <Textarea
            value={JSON.stringify(formData.rules || {}, null, 2)}
            onChange={(e) => {
              try {
                const rules = JSON.parse(e.target.value);
                setFormData(prev => ({ ...prev, rules }));
              } catch {
                // Invalid JSON, ignore
              }
            }}
            rows={6}
            className="font-mono text-sm"
          />
        </div>
      )}

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline">Annuler</Button>
        <Button type="submit">Créer</Button>
      </div>
    </form>
  );
}

// Edit System Form Component
function EditSystemForm({
  system,
  scaleConfigs,
  onSubmit,
}: {
  system: NotationSystem;
  scaleConfigs: Record<string, any>;
  onSubmit: (data: UpdateNotationSystemData) => Promise<void>;
}) {
  const [formData, setFormData] = useState<UpdateNotationSystemData>({
    id: system.id,
    name: system.name,
    scaleType: system.scaleType as any,
    minValue: system.minValue,
    maxValue: system.maxValue,
    rules: system.rules,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="edit-name">Nom du système</Label>
        <Input
          id="edit-name"
          value={formData.name || ""}
          onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="edit-minValue">Valeur minimale</Label>
          <Input
            id="edit-minValue"
            type="number"
            value={formData.minValue || 0}
            onChange={(e) => setFormData(prev => ({ ...prev, minValue: Number(e.target.value) }))}
            required
          />
        </div>

        <div>
          <Label htmlFor="edit-maxValue">Valeur maximale</Label>
          <Input
            id="edit-maxValue"
            type="number"
            value={formData.maxValue || 20}
            onChange={(e) => setFormData(prev => ({ ...prev, maxValue: Number(e.target.value) }))}
            required
          />
        </div>
      </div>

      <div>
        <Label>Configuration avancée</Label>
        <Textarea
          value={JSON.stringify(formData.rules || {}, null, 2)}
          onChange={(e) => {
            try {
              const rules = JSON.parse(e.target.value);
              setFormData(prev => ({ ...prev, rules }));
            } catch {
              // Invalid JSON, ignore
            }
          }}
          rows={8}
          className="font-mono text-sm"
        />
      </div>

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline">Annuler</Button>
        <Button type="submit">Sauvegarder</Button>
      </div>
    </form>
  );
}

