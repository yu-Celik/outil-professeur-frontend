"use client";

import { useState, useMemo } from "react";
import { Button } from "@/components/atoms/button";
import { Input } from "@/components/atoms/input";
import { Badge } from "@/components/atoms/badge";
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
} from "@/components/atoms/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/molecules/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/molecules/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/molecules/dialog";
import {
  Search,
  Filter,
  Calendar,
  User,
  BookOpen,
  Palette,
  Eye,
  RotateCcw,
  Download,
  Trash2,
  Star,
  Clock,
  TrendingUp,
  Users,
  MessageSquare,
} from "lucide-react";
import { MOCK_STUDENTS } from "@/features/students/mocks";
import { MOCK_SUBJECTS } from "@/features/gestion/mocks";
import { MOCK_ACADEMIC_PERIODS } from "@/features/gestion/mocks";
import { useStyleGuides } from "@/features/appreciations";

interface AppreciationHistoryItem {
  id: string;
  studentId: string;
  subjectId?: string;
  academicPeriodId?: string;
  styleGuideId: string;
  content: string;
  contentKind: string;
  scope: string;
  audience: string;
  generationTrigger: string;
  status: string;
  isFavorite: boolean;
  reuseCount: number;
  generatedAt: Date;
  updatedAt: Date;
}

interface AppreciationHistorySectionProps {
  selectedClassId: string;
  onRestoreAppreciation: (appreciation: AppreciationHistoryItem) => void;
}

export function AppreciationHistorySection({
  selectedClassId,
  onRestoreAppreciation,
}: AppreciationHistorySectionProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStudentFilter, setSelectedStudentFilter] = useState<string>("all");
  const [selectedSubjectFilter, setSelectedSubjectFilter] = useState<string>("all");
  const [selectedPeriodFilter, setSelectedPeriodFilter] = useState<string>("all");
  const [selectedStyleFilter, setSelectedStyleFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [dateRange, setDateRange] = useState<string>("");

  const { styleGuides } = useStyleGuides("teacher-1");

  // Mock history data - in real app this would come from API
  const mockHistoryData: AppreciationHistoryItem[] = [
    {
      id: "hist-1",
      studentId: "student-1",
      subjectId: "subject-math",
      academicPeriodId: "period-1",
      styleGuideId: "style-standard",
      content: "Sophie démontre une excellente compréhension des concepts mathématiques abordés ce trimestre. Ses résultats aux évaluations sont très satisfaisants et témoignent d'un travail régulier et appliqué. Elle participe activement en classe et n'hésite pas à poser des questions pertinentes. Je l'encourage à poursuivre dans cette voie.",
      contentKind: "bulletin",
      scope: "subject",
      audience: "parents",
      generationTrigger: "manual",
      status: "validated",
      isFavorite: true,
      reuseCount: 2,
      generatedAt: new Date("2024-03-15"),
      updatedAt: new Date("2024-03-15"),
    },
    {
      id: "hist-2",
      studentId: "student-2",
      subjectId: "",
      academicPeriodId: "period-1",
      styleGuideId: "style-encourageant",
      content: "Thomas fait preuve d'une grande motivation et d'un excellent esprit de collaboration. Son attitude positive en classe contribue à créer un environnement d'apprentissage agréable pour tous. Bien qu'il rencontre parfois des difficultés, il persévère et montre des progrès constants.",
      contentKind: "bulletin",
      scope: "general",
      audience: "parents",
      generationTrigger: "manual",
      status: "draft",
      isFavorite: false,
      reuseCount: 0,
      generatedAt: new Date("2024-03-14"),
      updatedAt: new Date("2024-03-14"),
    },
  ];

  const classStudents = MOCK_STUDENTS.filter(student =>
    student.currentClassId === selectedClassId
  );

  const filteredHistory = useMemo(() => {
    return mockHistoryData.filter(item => {
      const student = MOCK_STUDENTS.find(s => s.id === item.studentId);
      const subject = item.subjectId ? MOCK_SUBJECTS.find(s => s.id === item.subjectId) : null;
      const period = item.academicPeriodId ? MOCK_ACADEMIC_PERIODS.find(p => p.id === item.academicPeriodId) : null;

      // Search query filter
      if (searchQuery) {
        const searchLower = searchQuery.toLowerCase();
        const matchesStudent = student?.fullName().toLowerCase().includes(searchLower);
        const matchesSubject = subject?.name.toLowerCase().includes(searchLower);
        const matchesContent = item.content.toLowerCase().includes(searchLower);

        if (!matchesStudent && !matchesSubject && !matchesContent) {
          return false;
        }
      }

      // Student filter
      if (selectedStudentFilter && selectedStudentFilter !== "all" && item.studentId !== selectedStudentFilter) {
        return false;
      }

      // Subject filter
      if (selectedSubjectFilter && selectedSubjectFilter !== "all") {
        if (selectedSubjectFilter === "general" && item.subjectId) {
          return false;
        }
        if (selectedSubjectFilter !== "general" && item.subjectId !== selectedSubjectFilter) {
          return false;
        }
      }

      // Period filter
      if (selectedPeriodFilter && selectedPeriodFilter !== "all" && item.academicPeriodId !== selectedPeriodFilter) {
        return false;
      }

      // Style filter
      if (selectedStyleFilter && selectedStyleFilter !== "all" && item.styleGuideId !== selectedStyleFilter) {
        return false;
      }

      // Status filter
      if (statusFilter && statusFilter !== "all" && item.status !== statusFilter) {
        return false;
      }

      return true;
    });
  }, [mockHistoryData, searchQuery, selectedStudentFilter, selectedSubjectFilter, selectedPeriodFilter, selectedStyleFilter, statusFilter]);

  const statistics = useMemo(() => {
    const total = mockHistoryData.length;
    const validated = mockHistoryData.filter(item => item.status === 'validated').length;
    const studentsWithAppreciations = new Set(mockHistoryData.map(item => item.studentId)).size;
    const totalReuses = mockHistoryData.reduce((sum, item) => sum + item.reuseCount, 0);

    return {
      total,
      validated,
      studentsWithAppreciations,
      totalReuses,
    };
  }, [mockHistoryData]);

  const getStudent = (studentId: string) => MOCK_STUDENTS.find(s => s.id === studentId);
  const getSubject = (subjectId?: string) => subjectId ? MOCK_SUBJECTS.find(s => s.id === subjectId) : null;
  const getPeriod = (periodId?: string) => periodId ? MOCK_ACADEMIC_PERIODS.find(p => p.id === periodId) : null;
  const getStyle = (styleId: string) => styleGuides.find(s => s.id === styleId);

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedStudentFilter("all");
    setSelectedSubjectFilter("all");
    setSelectedPeriodFilter("all");
    setSelectedStyleFilter("all");
    setStatusFilter("all");
    setDateRange("");
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header with Statistics */}
      <div className="flex-shrink-0 p-6 border-b">
        <div className="space-y-4">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Clock className="h-6 w-6 text-primary" />
            Historique des appréciations
          </h2>

          {/* Quick Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Total générées</p>
                    <p className="text-2xl font-bold">{statistics.total}</p>
                  </div>
                  <MessageSquare className="h-5 w-5 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Validées</p>
                    <p className="text-2xl font-bold">{statistics.validated}</p>
                  </div>
                  <TrendingUp className="h-5 w-5 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Élèves traités</p>
                    <p className="text-2xl font-bold">{statistics.studentsWithAppreciations}</p>
                  </div>
                  <Users className="h-5 w-5 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Réutilisations</p>
                    <p className="text-2xl font-bold">{statistics.totalReuses}</p>
                  </div>
                  <RotateCcw className="h-5 w-5 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex-shrink-0 p-4 border-b bg-muted/20">
        <div className="flex flex-col gap-4">
          {/* Search and main filters */}
          <div className="flex flex-col lg:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher dans les appréciations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            <Select value={selectedStudentFilter} onValueChange={setSelectedStudentFilter}>
              <SelectTrigger className="w-full lg:w-[200px]">
                <SelectValue placeholder="Tous les élèves" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les élèves</SelectItem>
                {classStudents.map(student => (
                  <SelectItem key={student.id} value={student.id}>
                    {student.fullName()}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedSubjectFilter} onValueChange={setSelectedSubjectFilter}>
              <SelectTrigger className="w-full lg:w-[180px]">
                <SelectValue placeholder="Toutes matières" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes matières</SelectItem>
                <SelectItem value="general">Appréciation générale</SelectItem>
                {MOCK_SUBJECTS.map(subject => (
                  <SelectItem key={subject.id} value={subject.id}>
                    {subject.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full lg:w-[150px]">
                <SelectValue placeholder="Tous statuts" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous statuts</SelectItem>
                <SelectItem value="draft">Brouillon</SelectItem>
                <SelectItem value="validated">Validée</SelectItem>
                <SelectItem value="archived">Archivée</SelectItem>
              </SelectContent>
            </Select>

            <Button variant="outline" onClick={clearFilters}>
              <Filter className="h-4 w-4 mr-1" />
              Effacer
            </Button>
          </div>

          {/* Additional filters */}
          <div className="flex flex-wrap gap-2">
            <Select value={selectedPeriodFilter} onValueChange={setSelectedPeriodFilter}>
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="Période" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes périodes</SelectItem>
                {MOCK_ACADEMIC_PERIODS.map(period => (
                  <SelectItem key={period.id} value={period.id}>
                    {period.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedStyleFilter} onValueChange={setSelectedStyleFilter}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Style" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous styles</SelectItem>
                {styleGuides.map(style => (
                  <SelectItem key={style.id} value={style.id}>
                    {style.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* History Table */}
      <div className="flex-1 overflow-auto">
        {filteredHistory.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center p-8 text-muted-foreground">
            <Clock className="h-16 w-16 mb-4" />
            <h3 className="text-xl font-semibold text-foreground mb-2">
              {mockHistoryData.length === 0 ? "Aucune appréciation générée" : "Aucun résultat"}
            </h3>
            <p className="text-center max-w-md leading-relaxed">
              {mockHistoryData.length === 0
                ? "Commencez par générer des appréciations dans l'onglet Génération pour voir l'historique apparaître ici."
                : "Aucune appréciation ne correspond aux critères de recherche. Essayez de modifier les filtres."}
            </p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Élève</TableHead>
                <TableHead>Matière</TableHead>
                <TableHead>Période</TableHead>
                <TableHead>Style</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredHistory.map((item) => {
                const student = getStudent(item.studentId);
                const subject = getSubject(item.subjectId);
                const period = getPeriod(item.academicPeriodId);
                const style = getStyle(item.styleGuideId);

                return (
                  <TableRow key={item.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4" />
                        <span className="font-medium">{student?.fullName()}</span>
                        {item.isFavorite && (
                          <Star className="h-3 w-3 text-yellow-500 fill-current" />
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      {subject ? (
                        <Badge variant="secondary">
                          <BookOpen className="h-3 w-3 mr-1" />
                          {subject.name}
                        </Badge>
                      ) : (
                        <Badge variant="outline">Général</Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      {period && (
                        <Badge variant="secondary">
                          <Calendar className="h-3 w-3 mr-1" />
                          {period.name}
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      {style && (
                        <Badge variant="outline">
                          <Palette className="h-3 w-3 mr-1" />
                          {style.name}
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge variant={
                        item.status === 'validated' ? 'default' :
                        item.status === 'draft' ? 'secondary' : 'outline'
                      }>
                        {item.status === 'validated' ? 'Validée' :
                         item.status === 'draft' ? 'Brouillon' : 'Archivée'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm text-muted-foreground">
                        {item.generatedAt.toLocaleDateString()}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl">
                            <DialogHeader>
                              <DialogTitle>
                                Appréciation - {student?.fullName()}
                              </DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div className="flex flex-wrap gap-2">
                                {subject && (
                                  <Badge variant="secondary">
                                    <BookOpen className="h-3 w-3 mr-1" />
                                    {subject.name}
                                  </Badge>
                                )}
                                {period && (
                                  <Badge variant="secondary">
                                    <Calendar className="h-3 w-3 mr-1" />
                                    {period.name}
                                  </Badge>
                                )}
                                {style && (
                                  <Badge variant="outline">
                                    <Palette className="h-3 w-3 mr-1" />
                                    {style.name}
                                  </Badge>
                                )}
                              </div>
                              <div className="p-4 bg-muted/30 rounded-lg border-l-4 border-l-primary">
                                <p className="leading-relaxed whitespace-pre-wrap">
                                  {item.content}
                                </p>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>

                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onRestoreAppreciation(item)}
                        >
                          <RotateCcw className="h-4 w-4" />
                        </Button>

                        <Button variant="ghost" size="sm">
                          <Download className="h-4 w-4" />
                        </Button>

                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Supprimer l'appréciation</AlertDialogTitle>
                              <AlertDialogDescription>
                                Êtes-vous sûr de vouloir supprimer cette appréciation pour {student?.fullName()} ?
                                Cette action est irréversible.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Annuler</AlertDialogCancel>
                              <AlertDialogAction>Supprimer</AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  );
}