"use client";

import { Suspense, useEffect, useState, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import {
  Calendar,
  ChevronDown,
  ChevronRight,
  ClipboardList,
  Download,
  Users,
} from "lucide-react";
import { Badge } from "@/components/atoms/badge";
import { Button } from "@/components/atoms/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/molecules/select";
import { Card, CardContent, CardHeader } from "@/components/molecules/card";
import { useUserSession } from "@/hooks/use-user-session";
import { useTeachingAssignments } from "@/hooks/use-teaching-assignments";
import { getStudentsByClass } from "@/data/mock-students";
import { getTimeSlotById } from "@/data/mock-time-slots";
import { getSubjectById } from "@/data/mock-subjects";
import { getClassById } from "@/data/mock-classes";
import { getCompletedSessionsForTeacher } from "@/data/mock-completed-sessions";
import { getWeeklyTemplatesForTeacher } from "@/data/mock-weekly-templates";
import type { CourseSession, Student } from "@/types/uml-entities";

interface StudentParticipationAccordionProps {
  student: Student;
  session: CourseSession;
  isOpen: boolean;
  onToggle: () => void;
}

function StudentParticipationAccordion({
  student,
  session,
  isOpen,
  onToggle,
}: StudentParticipationAccordionProps) {
  // Mock participation data - dans la vraie app, on récupérerait StudentParticipation
  const mockParticipation = {
    isPresent: Math.random() > 0.2, // 80% de chance d'être présent
    behavior: ["Attentif", "Participatif", "Concentré"][Math.floor(Math.random() * 3)],
    participationLevel: Math.floor(Math.random() * 10) + 1,
    homeworkDone: Math.random() > 0.3,
    specificRemarks: Math.random() > 0.5 ? "Excellent travail en groupe" : "",
    technicalIssues: Math.random() > 0.8 ? "Problème de connexion" : "",
    cameraEnabled: Math.random() > 0.4,
  };
  
  const getParticipationStatusBadge = () => {
    if (!mockParticipation.isPresent) {
      return (
        <Badge variant="secondary" className="bg-red-100 text-red-800 border-red-200">
          ❌ Absent
        </Badge>
      );
    }
    
    const isComplete = mockParticipation.isPresent && 
                      mockParticipation.behavior && 
                      mockParticipation.participationLevel > 0;
    
    return isComplete ? (
      <Badge className="bg-green-100 text-green-800 border-green-200">
        ✅ Évalué
      </Badge>
    ) : (
      <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 border-yellow-200">
        ⚠️ Incomplet
      </Badge>
    );
  };

  return (
    <Card className="mb-4">
      <CardHeader>
        <button
          onClick={onToggle}
          className="flex items-center justify-between w-full text-left hover:bg-muted/50 rounded-md p-2 transition-colors"
        >
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              {isOpen ? (
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
              ) : (
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              )}
              <Users className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-lg">
                {student.firstName} {student.lastName}
              </h3>
              <p className="text-sm text-muted-foreground">
                Participation • Niveau: {mockParticipation.participationLevel}/10
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {getParticipationStatusBadge()}
            <div className="text-sm text-muted-foreground">
              {mockParticipation.behavior}
            </div>
          </div>
        </button>
      </CardHeader>
      
      {isOpen && (
        <CardContent className="pt-0">
          <div className="border-t pt-4">
            <h4 className="font-medium mb-4">Détails de participation</h4>
            
            {/* Formulaire de participation pour cet élève */}
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Présence</label>
                  <div className="flex gap-2">
                    <button 
                      className={`px-3 py-2 rounded text-sm ${
                        mockParticipation.isPresent 
                          ? 'bg-green-100 text-green-800 border border-green-200' 
                          : 'border border-gray-200'
                      }`}
                    >
                      Présent
                    </button>
                    <button 
                      className={`px-3 py-2 rounded text-sm ${
                        !mockParticipation.isPresent 
                          ? 'bg-red-100 text-red-800 border border-red-200' 
                          : 'border border-gray-200'
                      }`}
                    >
                      Absent
                    </button>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Niveau de participation</label>
                  <div className="flex items-center gap-2">
                    <span className="text-sm">{mockParticipation.participationLevel}/10</span>
                    <input 
                      type="range" 
                      min="0" 
                      max="10" 
                      value={mockParticipation.participationLevel}
                      className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                      readOnly
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Devoirs faits</label>
                  <div className="flex items-center gap-2">
                    <input 
                      type="checkbox" 
                      checked={mockParticipation.homeworkDone} 
                      className="rounded"
                      readOnly
                    />
                    <span className="text-sm">
                      {mockParticipation.homeworkDone ? "Faits" : "Non faits"}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Comportement</label>
                  <div className="text-sm p-2 bg-blue-50 rounded border">
                    {mockParticipation.behavior}
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Caméra activée</label>
                  <div className="text-sm p-2 bg-gray-50 rounded border">
                    {mockParticipation.cameraEnabled ? "✅ Activée" : "❌ Désactivée"}
                  </div>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Remarques spécifiques</label>
                <textarea 
                  value={mockParticipation.specificRemarks}
                  className="w-full p-2 border rounded-md text-sm bg-gray-50"
                  rows={3}
                  placeholder="Aucune remarque particulière"
                  readOnly
                />
              </div>
              
              {mockParticipation.technicalIssues && (
                <div>
                  <label className="block text-sm font-medium mb-2">Problèmes techniques</label>
                  <div className="text-sm p-2 bg-yellow-50 text-yellow-800 rounded border border-yellow-200">
                    {mockParticipation.technicalIssues}
                  </div>
                </div>
              )}
              
              <div className="flex gap-2 justify-end pt-4 border-t">
                <Button size="sm" variant="outline">
                  Modifier
                </Button>
                <Button size="sm" variant="ghost">
                  Effacer
                </Button>
                <Button size="sm" className="bg-primary">
                  Sauvegarder
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      )}
    </Card>
  );
}

function SessionsPageContent() {
  const { user } = useUserSession();
  const teacherId = user?.id || "KsmNtVf4zwqO3VV3SQJqPrRlQBA1fFyR";
  const searchParams = useSearchParams();
  
  // Paramètres de route
  const sessionIdParam = searchParams.get('sessionId');
  const classIdParam = searchParams.get('classId');
  const dateParam = searchParams.get('date');
  
  // Get today's date consistently
  const todayDate = useMemo(() => {
    const now = new Date();
    return now.toISOString().split('T')[0];
  }, []);
  
  // États locaux
  const [selectedClassId, setSelectedClassId] = useState<string>(classIdParam || 'all');
  const [selectedDate, setSelectedDate] = useState<string>(dateParam || todayDate);
  const [selectedSessionId, setSelectedSessionId] = useState<string>(sessionIdParam || 'all');
  const [openAccordions, setOpenAccordions] = useState<Set<string>>(new Set());
  
  // Hooks
  const { assignments } = useTeachingAssignments(teacherId);
  
  // Générer les sessions directement depuis les mock data
  const allSessions = useMemo(() => {
    const sessions: CourseSession[] = [];
    
    // 1. Ajouter toutes les sessions complétées pour ce teacher
    sessions.push(...getCompletedSessionsForTeacher(teacherId));
    
    // 2. Générer quelques sessions futures depuis les templates
    const today = new Date();
    const futureWeeks = 4; // Générer 4 semaines futures
    
    const teacherTemplates = getWeeklyTemplatesForTeacher(teacherId);
    
    for (let week = 0; week < futureWeeks; week++) {
      teacherTemplates.forEach(template => {
          // Calculer la date de la session
          const sessionDate = new Date(today);
          sessionDate.setDate(today.getDate() + (week * 7) + (template.dayOfWeek - today.getDay()));
          
          const sessionId = `session-generated-${template.id}-${week}`;
          
          const session: CourseSession = {
            id: sessionId,
            createdBy: template.teacherId,
            classId: template.classId,
            subjectId: template.subjectId,
            timeSlotId: template.timeSlotId,
            sessionDate: sessionDate,
            status: sessionDate > today ? "planned" : "done",
            objectives: null,
            content: null,
            homeworkAssigned: null,
            room: template.room,
            isMakeup: false,
            isMoved: null,
            notes: null,
            createdAt: today,
            updatedAt: today,
            reschedule: () => {},
            takeAttendance: () => {},
            summary: () => `Session générée depuis template ${template.id}`,
          };
          
          sessions.push(session);
      });
    }
    
    // Trier par date
    const sortedSessions = sessions.sort((a, b) => 
      new Date(a.sessionDate).getTime() - new Date(b.sessionDate).getTime()
    );
    
    // Debug : afficher le nombre de sessions générées
    console.log(`Sessions générées pour ${teacherId}:`, sortedSessions.length);
    console.log('Sessions complétées:', getCompletedSessionsForTeacher(teacherId).length);
    console.log('Templates:', getWeeklyTemplatesForTeacher(teacherId).length);
    
    return sortedSessions;
  }, [teacherId]);
  
  // Get unique classes to avoid duplicate keys
  const uniqueClasses = useMemo(() => {
    if (!assignments) return [];
    
    const classMap = new Map();
    assignments.forEach((assignment) => {
      if (!classMap.has(assignment.classId)) {
        classMap.set(assignment.classId, assignment.class);
      }
    });
    
    return Array.from(classMap.entries()).map(([classId, classData]) => ({
      id: classId,
      ...classData
    }));
  }, [assignments]);
  
  // Réinitialiser les accordéons fermés quand la session change
  useEffect(() => {
    setOpenAccordions(new Set());
  }, [selectedSessionId]);
  
  // Récupérer la session sélectionnée si une session spécifique est choisie
  const selectedSession = selectedSessionId !== 'all' 
    ? allSessions.find(session => session.id === selectedSessionId)
    : null;
  
  // Récupérer les élèves de la session sélectionnée
  const studentsForSession = selectedSession 
    ? getStudentsByClass(selectedSession.classId)
    : [];
  
  
  const toggleAccordion = (studentId: string) => {
    const newOpenAccordions = new Set(openAccordions);
    if (newOpenAccordions.has(studentId)) {
      newOpenAccordions.delete(studentId);
    } else {
      newOpenAccordions.add(studentId);
    }
    setOpenAccordions(newOpenAccordions);
  };

  return (
    <div className="space-y-6">
      {/* En-tête avec sélecteurs */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Gestion des séances</h1>
          <p className="text-muted-foreground">
            Gérer la participation et les évaluations de vos élèves par séance
          </p>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            Export
          </Button>
        </div>
      </div>
      
      {/* Sélecteurs */}
      <div className="flex flex-wrap gap-4 items-end">
        <div className="min-w-48">
          <label className="block text-sm font-medium mb-2">Classe</label>
          <Select value={selectedClassId} onValueChange={setSelectedClassId}>
            <SelectTrigger>
              <SelectValue placeholder="Toutes les classes" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Toutes les classes</SelectItem>
              {uniqueClasses.map((classData) => (
                <SelectItem key={classData.id} value={classData.id}>
                  {classData.classCode} - {classData.gradeLabel}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="min-w-48">
          <label className="block text-sm font-medium mb-2">Date</label>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          />
        </div>
        
        <div className="min-w-48">
          <label className="block text-sm font-medium mb-2">Séance spécifique</label>
          <Select value={selectedSessionId} onValueChange={setSelectedSessionId}>
            <SelectTrigger>
              <SelectValue placeholder="Toutes les séances" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Toutes les séances</SelectItem>
              {allSessions
                .filter((session) => {
                  const sessionDate = new Date(session.sessionDate).toISOString().split('T')[0];
                  return (selectedClassId === 'all' || session.classId === selectedClassId) &&
                         (!selectedDate || sessionDate === selectedDate);
                })
                .map((session) => {
                  const subject = getSubjectById(session.subjectId);
                  const classData = getClassById(session.classId);
                  const timeSlot = getTimeSlotById(session.timeSlotId);
                  
                  return (
                    <SelectItem key={session.id} value={session.id}>
                      {subject?.name || session.subjectId} - {classData?.classCode || session.classId} ({timeSlot?.startTime || 'Non défini'})
                    </SelectItem>
                  );
                })}
            </SelectContent>
          </Select>
        </div>
      </div>
      
      {/* Liste des accordéons d'élèves pour la session sélectionnée */}
      <div>
        {selectedSessionId === 'all' ? (
          <Card>
            <CardContent className="p-8 text-center">
              <ClipboardList className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">Sélectionnez une séance spécifique</h3>
              <p className="text-muted-foreground">
                Choisissez une séance dans le sélecteur ci-dessus pour voir la participation des élèves
              </p>
            </CardContent>
          </Card>
        ) : selectedSession ? (
          studentsForSession.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <Users className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-semibold mb-2">Aucun élève trouvé</h3>
                <p className="text-muted-foreground">
                  Aucun élève inscrit dans cette classe
                </p>
              </CardContent>
            </Card>
          ) : (
            <>
              {/* Informations sur la session sélectionnée */}
              <Card className="mb-4">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-lg">
                        {getSubjectById(selectedSession.subjectId)?.name || selectedSession.subjectId} - {getClassById(selectedSession.classId)?.classCode || selectedSession.classId}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {new Date(selectedSession.sessionDate).toLocaleDateString('fr-FR', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })} • {getTimeSlotById(selectedSession.timeSlotId)?.startTime || 'Horaire non défini'}
                      </p>
                    </div>
                    <Badge variant={selectedSession.status === 'done' ? 'default' : 'secondary'}>
                      {selectedSession.status === 'done' ? 'Terminée' : 'Prévue'}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
              
              {/* Accordéons par élève */}
              {studentsForSession.map((student) => (
                <StudentParticipationAccordion
                  key={student.id}
                  student={student}
                  session={selectedSession}
                  isOpen={openAccordions.has(student.id)}
                  onToggle={() => toggleAccordion(student.id)}
                />
              ))}
            </>
          )
        ) : (
          <Card>
            <CardContent className="p-8 text-center">
              <ClipboardList className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">Séance non trouvée</h3>
              <p className="text-muted-foreground">
                La séance sélectionnée n'existe pas
              </p>
            </CardContent>
          </Card>
        )}
      </div>
      
      {/* Actions globales */}
      {selectedSession && studentsForSession.length > 0 && (
        <Card>
          <CardContent className="p-4">
            <div className="flex justify-between items-center">
              <div className="text-sm text-muted-foreground">
                {studentsForSession.length} élève{studentsForSession.length > 1 ? 's' : ''} dans cette séance
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  Statistiques de participation
                </Button>
                <Button variant="outline" size="sm">
                  Export des évaluations
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

export default function SessionsPage() {
  return (
    <Suspense fallback={
      <div className="space-y-6">
        <div className="h-8 bg-muted animate-pulse rounded"></div>
        <div className="h-32 bg-muted animate-pulse rounded"></div>
      </div>
    }>
      <SessionsPageContent />
    </Suspense>
  );
}