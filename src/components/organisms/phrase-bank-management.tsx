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
import { Textarea } from "@/components/atoms/textarea";
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
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/molecules/collapsible";
import {
  Plus,
  Search,
  Database,
  Edit,
  Trash2,
  Copy,
  ChevronDown,
  ChevronRight,
  MessageSquare,
  BookOpen,
} from "lucide-react";
import { usePhraseBank } from "@/features/appreciations";
import { MOCK_SUBJECTS } from "@/features/gestion/mocks";
import type {
  CreatePhraseBankData,
  UpdatePhraseBankData,
} from "@/features/appreciations/hooks/use-phrase-bank";
import type { PhraseBank } from "@/types/uml-entities";

export interface PhraseBankManagementProps {
  teacherId?: string;
  className?: string;
  onPhraseBankSelect?: (phraseBank: PhraseBank) => void;
  showActions?: boolean;
  selectedSubjectId?: string;
}

export function PhraseBankManagement({
  teacherId = "KsmNtVf4zwqO3VV3SQJqPrRlQBA1fFyR",
  className = "",
  onPhraseBankSelect,
  showActions = true,
  selectedSubjectId,
}: PhraseBankManagementProps) {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingBank, setEditingBank] = useState<PhraseBank | null>(null);
  const [deletingBankId, setDeletingBankId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterSubject, setFilterSubject] = useState<string>(
    selectedSubjectId || "",
  );
  const [expandedBanks, setExpandedBanks] = useState<Set<string>>(new Set());

  const {
    phraseBanks,
    loading,
    error,
    createPhraseBank,
    updatePhraseBank,
    deletePhraseBank,
    addPhraseToBank,
    removePhraseFromBank,
    searchBanks,
    applyFilters,
    getStats,
  } = usePhraseBank(teacherId);

  const stats = getStats();

  // Gestion de la recherche et du filtrage
  const handleSearch = (term: string) => {
    setSearchTerm(term);
    searchBanks(term);
  };

  const handleFilterChange = (subjectId: string) => {
    setFilterSubject(subjectId);
    applyFilters({
      subjectId: subjectId || undefined,
      search: searchTerm || undefined,
    });
  };

  // Gestion de l'expansion/réduction
  const toggleBankExpansion = (bankId: string) => {
    setExpandedBanks((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(bankId)) {
        newSet.delete(bankId);
      } else {
        newSet.add(bankId);
      }
      return newSet;
    });
  };

  // Gestion CRUD
  const handleCreateBank = async (data: CreatePhraseBankData) => {
    const result = await createPhraseBank(data);
    if (result) {
      setIsCreateDialogOpen(false);
    }
    return result !== null;
  };

  const handleUpdateBank = async (data: UpdatePhraseBankData) => {
    const result = await updatePhraseBank(data);
    if (result) {
      setEditingBank(null);
    }
    return result !== null;
  };

  const handleDeleteBank = async (id: string) => {
    const result = await deletePhraseBank(id);
    if (result) {
      setDeletingBankId(null);
    }
  };

  const handleDuplicateBank = async (bank: PhraseBank) => {
    const duplicateData: CreatePhraseBankData = {
      scope: bank.scope,
      subjectId: `${bank.subjectId}-copy`,
      entries: JSON.parse(JSON.stringify(bank.entries)), // Deep copy
    };
    await createPhraseBank(duplicateData);
  };

  if (loading) {
    return (
      <Card className={className}>
        <CardContent className="p-6">
          <div className="text-center py-8">
            <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-sm text-muted-foreground">
              Chargement des banques de phrases...
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
            <Database className="h-12 w-12 mx-auto mb-4 opacity-50" />
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
            <Database className="h-6 w-6" />
            Banques de phrases ({stats.totalBanks})
          </h2>
          <p className="text-sm text-muted-foreground">
            {stats.totalPhrases} phrases réparties par matières et contextes
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
                Nouvelle banque
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Créer une banque de phrases</DialogTitle>
              </DialogHeader>
              <PhraseBankForm onSubmit={handleCreateBank} />
            </DialogContent>
          </Dialog>
        )}
      </div>

      {/* Statistiques rapides */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {Object.entries(stats.byScope).map(([scope, count]) => (
          <Card key={scope}>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold">{count}</div>
              <p className="text-xs text-muted-foreground capitalize">
                {scope}
              </p>
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
              placeholder="Rechercher dans les banques de phrases..."
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        <Select value={filterSubject} onValueChange={handleFilterChange}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Filtrer par matière" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Toutes les matières</SelectItem>
            <SelectItem value="general">Général</SelectItem>
            {MOCK_SUBJECTS.map((subject) => (
              <SelectItem key={subject.id} value={subject.id}>
                {subject.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Liste des banques */}
      <div className="space-y-4">
        {phraseBanks.map((bank) => (
          <Card
            key={bank.id}
            className={`transition-all ${
              onPhraseBankSelect ? "hover:shadow-md cursor-pointer" : ""
            }`}
          >
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Collapsible>
                    <CollapsibleTrigger
                      onClick={() => toggleBankExpansion(bank.id)}
                      className="flex items-center gap-2"
                    >
                      {expandedBanks.has(bank.id) ? (
                        <ChevronDown className="h-4 w-4" />
                      ) : (
                        <ChevronRight className="h-4 w-4" />
                      )}
                    </CollapsibleTrigger>
                  </Collapsible>
                  <div>
                    <CardTitle className="flex items-center gap-3">
                      <Database className="h-5 w-5" />
                      {bank.scope === "general"
                        ? "Banque générale"
                        : MOCK_SUBJECTS.find((s) => s.id === bank.subjectId)
                            ?.name || bank.subjectId}
                    </CardTitle>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge
                        variant={
                          bank.scope === "general" ? "default" : "secondary"
                        }
                      >
                        {bank.scope}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {Object.keys(bank.entries).length} catégories
                      </Badge>
                    </div>
                  </div>
                </div>
                {showActions && (
                  <div className="flex items-center gap-1">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setEditingBank(bank)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleDuplicateBank(bank)}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setDeletingBankId(bank.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>
            </CardHeader>

            <Collapsible open={expandedBanks.has(bank.id)}>
              <CollapsibleContent>
                <CardContent className="pt-0">
                  <div className="space-y-4">
                    {Object.entries(bank.entries as Record<string, any>).map(
                      ([category, content]) => (
                        <div key={category} className="border rounded-lg p-4">
                          <h4 className="font-medium text-sm mb-3 flex items-center gap-2">
                            <MessageSquare className="h-4 w-4" />
                            {category}
                          </h4>

                          {Array.isArray(content) ? (
                            <div className="space-y-2">
                              {content.map((phrase: string, index: number) => (
                                <div
                                  key={index}
                                  className="text-sm p-2 bg-muted rounded border-l-4 border-l-primary/50"
                                >
                                  "{phrase}"
                                </div>
                              ))}
                            </div>
                          ) : typeof content === "object" &&
                            content !== null ? (
                            <div className="space-y-3">
                              {Object.entries(content).map(
                                ([subCategory, phrases]) => (
                                  <div
                                    key={subCategory}
                                    className="pl-4 border-l-2 border-muted"
                                  >
                                    <h5 className="font-medium text-xs mb-2 text-muted-foreground uppercase">
                                      {subCategory}
                                    </h5>
                                    <div className="space-y-1">
                                      {Array.isArray(phrases) &&
                                        phrases.map(
                                          (phrase: string, index: number) => (
                                            <div
                                              key={index}
                                              className="text-sm p-2 bg-muted rounded"
                                            >
                                              "{phrase}"
                                            </div>
                                          ),
                                        )}
                                    </div>
                                  </div>
                                ),
                              )}
                            </div>
                          ) : (
                            <div className="text-sm text-muted-foreground">
                              Contenu personnalisé
                            </div>
                          )}
                        </div>
                      ),
                    )}
                  </div>
                </CardContent>
              </CollapsibleContent>
            </Collapsible>
          </Card>
        ))}
      </div>

      {phraseBanks.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <Database className="h-16 w-16 mx-auto mb-4 opacity-50" />
            <h3 className="text-lg font-medium mb-2">
              Aucune banque de phrases
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              {searchTerm || filterSubject
                ? "Aucune banque ne correspond à vos critères de recherche."
                : "Créez votre première banque de phrases pour enrichir vos appréciations."}
            </p>
            {showActions && !searchTerm && !filterSubject && (
              <Button onClick={() => setIsCreateDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Créer une banque de phrases
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      {/* Dialog d'édition */}
      {editingBank && (
        <Dialog open={true} onOpenChange={() => setEditingBank(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Modifier la banque de phrases</DialogTitle>
            </DialogHeader>
            <PhraseBankForm
              initialData={editingBank}
              onSubmit={(data) =>
                handleUpdateBank({ id: editingBank.id, ...data })
              }
            />
          </DialogContent>
        </Dialog>
      )}

      {/* Dialog de confirmation de suppression */}
      <AlertDialog
        open={!!deletingBankId}
        onOpenChange={() => setDeletingBankId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertTitle>Supprimer la banque de phrases</AlertTitle>
            <AlertDialogDescription>
              Cette action est irréversible. Toutes les phrases de cette banque
              seront définitivement supprimées.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deletingBankId && handleDeleteBank(deletingBankId)}
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

// Composant formulaire pour créer/modifier une banque de phrases
interface PhraseBankFormProps {
  initialData?: PhraseBank;
  onSubmit: (data: CreatePhraseBankData) => Promise<boolean>;
}

function PhraseBankForm({ initialData, onSubmit }: PhraseBankFormProps) {
  const [formData, setFormData] = useState<CreatePhraseBankData>({
    scope: initialData?.scope || "subject",
    subjectId: initialData?.subjectId || "",
    entries: initialData?.entries || {
      positiveElements: {
        participation: [],
        comprehension: [],
        expression: [],
      },
      improvementAreas: [],
      encouragements: [],
    },
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
          <Label htmlFor="scope">Portée</Label>
          <Select
            value={formData.scope}
            onValueChange={(value) =>
              setFormData((prev) => ({ ...prev, scope: value }))
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Choisir la portée" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="general">Générale</SelectItem>
              <SelectItem value="subject">Par matière</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="subjectId">Matière</Label>
          <Select
            value={formData.subjectId}
            onValueChange={(value) =>
              setFormData((prev) => ({ ...prev, subjectId: value }))
            }
            disabled={formData.scope === "general"}
          >
            <SelectTrigger>
              <SelectValue placeholder="Choisir la matière" />
            </SelectTrigger>
            <SelectContent>
              {MOCK_SUBJECTS.map((subject) => (
                <SelectItem key={subject.id} value={subject.id}>
                  {subject.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <Label>Structure des phrases</Label>
        <div className="text-sm text-muted-foreground mt-1 mb-3">
          Les phrases seront organisées automatiquement par catégories (éléments
          positifs, axes d'amélioration, encouragements)
        </div>
        <Textarea
          placeholder="Configuration JSON des phrases (format avancé)..."
          value={JSON.stringify(formData.entries, null, 2)}
          onChange={(e) => {
            try {
              const parsed = JSON.parse(e.target.value);
              setFormData((prev) => ({ ...prev, entries: parsed }));
            } catch (error) {
              // Ignore invalid JSON during typing
            }
          }}
          rows={10}
          className="font-mono text-xs"
        />
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
