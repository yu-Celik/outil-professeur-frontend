"use client";

import { useState } from "react";
import { Button } from "@/components/atoms/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/molecules/card";
import { Badge } from "@/components/atoms/badge";
import { Input } from "@/components/atoms/input";
import { Label } from "@/components/atoms/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/atoms/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/molecules/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertTitle,
} from "@/components/molecules/alert";
import { Plus, Search, Settings, Edit, Trash2, Copy } from "lucide-react";
import { useStyleGuides } from "@/features/appreciations";
import type {
  CreateStyleGuideData,
  UpdateStyleGuideData,
} from "@/features/appreciations/hooks/use-style-guides";
import type { StyleGuide } from "@/types/uml-entities";

export interface StyleGuideManagementProps {
  teacherId?: string;
  className?: string;
  onStyleGuideSelect?: (styleGuide: StyleGuide) => void;
  showActions?: boolean;
}

export function StyleGuideManagement({
  teacherId = "KsmNtVf4zwqO3VV3SQJqPrRlQBA1fFyR",
  className = "",
  onStyleGuideSelect,
  showActions = true,
}: StyleGuideManagementProps) {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingGuide, setEditingGuide] = useState<StyleGuide | null>(null);
  const [deletingGuideId, setDeletingGuideId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterTone, setFilterTone] = useState<string>("");

  const {
    styleGuides,
    defaultGuide,
    loading,
    error,
    createStyleGuide,
    updateStyleGuide,
    deleteStyleGuide,
    duplicateStyleGuide,
    setDefaultStyleGuide,
    getAllTones,
    getAllRegisters,
    getAllLengths,
    searchGuides,
    applyFilters,
    getStats,
  } = useStyleGuides(teacherId);

  const stats = getStats();
  const availableTones = getAllTones();
  const availableRegisters = getAllRegisters();
  const availableLengths = getAllLengths();

  // Gestion de la recherche et du filtrage
  const handleSearch = (term: string) => {
    setSearchTerm(term);
    searchGuides(term);
  };

  const handleFilterChange = (tone: string) => {
    setFilterTone(tone);
    applyFilters({ tone: tone || undefined, search: searchTerm || undefined });
  };

  // Gestion CRUD
  const handleCreateGuide = async (data: CreateStyleGuideData) => {
    const result = await createStyleGuide(data);
    if (result) {
      setIsCreateDialogOpen(false);
    }
    return result !== null;
  };

  const handleUpdateGuide = async (data: UpdateStyleGuideData) => {
    const result = await updateStyleGuide(data);
    if (result) {
      setEditingGuide(null);
    }
    return result !== null;
  };

  const handleDeleteGuide = async (id: string) => {
    const result = await deleteStyleGuide(id);
    if (result) {
      setDeletingGuideId(null);
    }
  };

  const handleDuplicateGuide = async (guideId: string) => {
    await duplicateStyleGuide(guideId);
  };

  const handleSetDefault = async (guideId: string) => {
    await setDefaultStyleGuide(guideId);
  };

  if (loading) {
    return (
      <Card className={className}>
        <CardContent className="p-6">
          <div className="text-center py-8">
            <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-sm text-muted-foreground">
              Chargement des guides de style...
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className={className}>
        <CardContent className="p-6">
          <div className="text-center py-8 text-destructive">
            <Settings className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p className="font-medium">Erreur de chargement</p>
            <p className="text-sm">{error}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* En-tête avec statistiques */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Settings className="h-6 w-6" />
            Guides de style ({stats.total})
          </h2>
          <p className="text-sm text-muted-foreground">
            Gérez vos styles d'écriture pour personnaliser vos appréciations
          </p>
        </div>
        {showActions && (
          <Dialog
            open={isCreateDialogOpen}
            onOpenChange={setIsCreateDialogOpen}
          >
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Nouveau guide
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Créer un guide de style</DialogTitle>
              </DialogHeader>
              <StyleGuideForm
                onSubmit={handleCreateGuide}
                availableTones={availableTones}
                availableRegisters={availableRegisters}
                availableLengths={availableLengths}
              />
            </DialogContent>
          </Dialog>
        )}
      </div>

      {/* Statistiques rapides */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {Object.entries(stats.byTone).map(([tone, count]) => (
          <Card key={tone}>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold">{count}</div>
              <p className="text-xs text-muted-foreground capitalize">{tone}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filtres et recherche */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher dans les guides de style..."
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        <Select value={filterTone} onValueChange={handleFilterChange}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Filtrer par ton" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les tons</SelectItem>
            {availableTones.map((tone) => (
              <SelectItem key={tone} value={tone} className="capitalize">
                {tone}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Liste des guides */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {styleGuides.map((guide) => (
          <Card
            key={guide.id}
            className={`cursor-pointer transition-all hover:shadow-md ${
              onStyleGuideSelect ? "hover:border-primary" : ""
            }`}
            onClick={() => onStyleGuideSelect?.(guide)}
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <CardTitle className="text-lg">{guide.name}</CardTitle>
                    {defaultGuide?.id === guide.id && (
                      <Badge variant="default" className="text-xs">
                        Par défaut
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge variant="secondary" className="text-xs">
                      {guide.tone}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {guide.register}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {guide.length}
                    </Badge>
                  </div>
                </div>
                {showActions && (
                  <div className="flex items-center gap-1 ml-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={(e) => {
                        e.stopPropagation();
                        setEditingGuide(guide);
                      }}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDuplicateGuide(guide.id);
                      }}
                      title="Dupliquer"
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={(e) => {
                        e.stopPropagation();
                        setDeletingGuideId(guide.id);
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-3">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Variabilité
                  </p>
                  <p className="text-sm capitalize">{guide.variability}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Phrases préférées
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {guide.preferredPhrases.length} phrases configurées
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Dernière modification
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {guide.updatedAt.toLocaleDateString()}
                  </p>
                </div>
                {showActions && defaultGuide?.id !== guide.id && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full mt-2"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSetDefault(guide.id);
                    }}
                  >
                    Définir par défaut
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {styleGuides.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <Settings className="h-16 w-16 mx-auto mb-4 opacity-50" />
            <h3 className="text-lg font-medium mb-2">Aucun guide de style</h3>
            <p className="text-sm text-muted-foreground mb-4">
              {searchTerm || filterTone
                ? "Aucun guide ne correspond à vos critères de recherche."
                : "Créez votre premier guide de style pour personnaliser vos appréciations."}
            </p>
            {showActions && !searchTerm && !filterTone && (
              <Button onClick={() => setIsCreateDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Créer un guide de style
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      {/* Dialog d'édition */}
      {editingGuide && (
        <Dialog open={true} onOpenChange={() => setEditingGuide(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Modifier le guide de style</DialogTitle>
            </DialogHeader>
            <StyleGuideForm
              initialData={editingGuide}
              onSubmit={(data) =>
                handleUpdateGuide({ id: editingGuide.id, ...data })
              }
              availableTones={availableTones}
              availableRegisters={availableRegisters}
              availableLengths={availableLengths}
            />
          </DialogContent>
        </Dialog>
      )}

      {/* Dialog de confirmation de suppression */}
      <AlertDialog
        open={!!deletingGuideId}
        onOpenChange={() => setDeletingGuideId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertTitle>Supprimer le guide de style</AlertTitle>
            <AlertDialogDescription>
              Cette action est irréversible. Le guide de style sera
              définitivement supprimé.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction
              onClick={() =>
                deletingGuideId && handleDeleteGuide(deletingGuideId)
              }
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

// Composant formulaire pour créer/modifier un guide de style
interface StyleGuideFormProps {
  initialData?: StyleGuide;
  onSubmit: (data: CreateStyleGuideData) => Promise<boolean>;
  availableTones: string[];
  availableRegisters: string[];
  availableLengths: string[];
}

function StyleGuideForm({
  initialData,
  onSubmit,
  availableTones,
  availableRegisters,
  availableLengths,
}: StyleGuideFormProps) {
  const [formData, setFormData] = useState<CreateStyleGuideData>({
    name: initialData?.name || "",
    tone: initialData?.tone || "",
    register: initialData?.register || "",
    length: initialData?.length || "",
    person: initialData?.person || "troisieme",
    variability: initialData?.variability || "moyenne",
    bannedPhrases: initialData?.bannedPhrases || [],
    preferredPhrases: initialData?.preferredPhrases || [],
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await onSubmit(formData);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="name">Nom du guide</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, name: e.target.value }))
            }
            placeholder="Ex: Style professionnel"
            required
          />
        </div>
        <div>
          <Label htmlFor="tone">Ton</Label>
          <Select
            value={formData.tone}
            onValueChange={(value) =>
              setFormData((prev) => ({ ...prev, tone: value }))
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Choisir un ton" />
            </SelectTrigger>
            <SelectContent>
              {availableTones.map((tone) => (
                <SelectItem key={tone} value={tone} className="capitalize">
                  {tone}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <Label htmlFor="register">Registre</Label>
          <Select
            value={formData.register}
            onValueChange={(value) =>
              setFormData((prev) => ({ ...prev, register: value }))
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Registre" />
            </SelectTrigger>
            <SelectContent>
              {availableRegisters.map((register) => (
                <SelectItem
                  key={register}
                  value={register}
                  className="capitalize"
                >
                  {register}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="length">Longueur</Label>
          <Select
            value={formData.length}
            onValueChange={(value) =>
              setFormData((prev) => ({ ...prev, length: value }))
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Longueur" />
            </SelectTrigger>
            <SelectContent>
              {availableLengths.map((length) => (
                <SelectItem key={length} value={length} className="capitalize">
                  {length}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="person">Personne</Label>
          <Select
            value={formData.person}
            onValueChange={(value) =>
              setFormData((prev) => ({ ...prev, person: value }))
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="deuxieme">Deuxième (tu/vous)</SelectItem>
              <SelectItem value="troisieme">Troisième (il/elle)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <Label htmlFor="variability">Variabilité</Label>
        <Select
          value={formData.variability}
          onValueChange={(value) =>
            setFormData((prev) => ({ ...prev, variability: value }))
          }
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="faible">Faible</SelectItem>
            <SelectItem value="moyenne">Moyenne</SelectItem>
            <SelectItem value="elevee">Élevée</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex justify-end gap-3">
        <Button type="button" variant="outline" disabled={isSubmitting}>
          Annuler
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting
            ? "Enregistrement..."
            : initialData
              ? "Modifier"
              : "Créer"}
        </Button>
      </div>
    </form>
  );
}
