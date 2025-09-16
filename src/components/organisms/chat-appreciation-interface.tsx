"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/atoms/button";
import { Input } from "@/components/atoms/input";
import { Badge } from "@/components/atoms/badge";
import { Card, CardContent } from "@/components/molecules/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/atoms/select";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/molecules/sheet";
import {
  MessageSquare,
  Send,
  User,
  BookOpen,
  Calendar,
  Settings,
  Sparkles,
  Copy,
  RefreshCw,
  Star,
  Download,
  Plus,
  ArrowUp
} from "lucide-react";
import { useAppreciationGeneration, useStyleGuides } from "@/features/appreciations";
import { MOCK_STUDENTS } from "@/features/students/mocks";
import { MOCK_SUBJECTS } from "@/features/gestion/mocks";
import { MOCK_ACADEMIC_PERIODS } from "@/features/gestion/mocks";
import type { GenerationRequest } from "@/features/appreciations/hooks/use-appreciation-generation";

interface ChatMessage {
  id: string;
  type: "user" | "assistant";
  content: string;
  timestamp: Date;
  appreciation?: {
    content: string;
    studentName: string;
    subject?: string;
    period?: string;
    style: string;
  };
}

export interface ChatAppreciationInterfaceProps {
  teacherId?: string;
  className?: string;
  onAppreciationGenerated?: (appreciation: string) => void;
}

export function ChatAppreciationInterface({
  teacherId = "KsmNtVf4zwqO3VV3SQJqPrRlQBA1fFyR",
  className = "",
  onAppreciationGenerated
}: ChatAppreciationInterfaceProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome-msg",
      type: "assistant",
      content: "Bonjour ! Je suis votre assistant IA pour la génération d'appréciations. Décrivez-moi ce que vous souhaitez créer ou utilisez les boutons rapides ci-dessous.",
      timestamp: new Date()
    }
  ]);
  const [currentMessage, setCurrentMessage] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  // Paramètres contextuels
  const [selectedStudentId, setSelectedStudentId] = useState<string>("");
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>("");
  const [selectedPeriodId, setSelectedPeriodId] = useState<string>("");
  const [selectedStyleId, setSelectedStyleId] = useState<string>("standard");
  const [customInstructions, setCustomInstructions] = useState<string>("");

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const { generateAppreciation } = useAppreciationGeneration(teacherId);
  const { styleGuides } = useStyleGuides(teacherId);

  // Auto-scroll to bottom when new messages are added
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Focus input on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSendMessage = async () => {
    if (!currentMessage.trim() || isGenerating) return;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      type: "user",
      content: currentMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setCurrentMessage("");
    setIsGenerating(true);

    try {
      // Parse message for context
      const parsedContext = parseUserMessage(currentMessage);

      // Generate appreciation based on parsed context or current settings
      const studentId = parsedContext.studentId || selectedStudentId;
      const styleId = parsedContext.styleId || selectedStyleId;

      if (studentId && styleId) {
        const student = MOCK_STUDENTS.find(s => s.id === studentId);
        const result = await generateAppreciationFromChat({
          studentId,
          styleId,
          subjectId: parsedContext.subjectId || selectedSubjectId,
          periodId: parsedContext.periodId || selectedPeriodId,
          customMessage: currentMessage,
          customInstructions: parsedContext.customInstructions || customInstructions
        });

        if (result && student) {
          const assistantMessage: ChatMessage = {
            id: `assistant-${Date.now()}`,
            type: "assistant",
            content: "Voici l'appréciation générée :",
            timestamp: new Date(),
            appreciation: {
              content: result.content,
              studentName: student.fullName(),
              subject: selectedSubjectId ? MOCK_SUBJECTS.find(s => s.id === selectedSubjectId)?.name : undefined,
              period: selectedPeriodId ? MOCK_ACADEMIC_PERIODS.find(p => p.id === selectedPeriodId)?.name : undefined,
              style: styleGuides.find(s => s.id === styleId)?.name || "Standard"
            }
          };

          setMessages(prev => [...prev, assistantMessage]);
          onAppreciationGenerated?.(result.content);
        } else {
          setMessages(prev => [...prev, {
            id: `assistant-error-${Date.now()}`,
            type: "assistant",
            content: "Je n'ai pas pu générer l'appréciation. Vérifiez que vous avez sélectionné un élève et un style.",
            timestamp: new Date()
          }]);
        }
      } else {
        // Provide guidance
        setMessages(prev => [...prev, {
          id: `assistant-guidance-${Date.now()}`,
          type: "assistant",
          content: "Pour générer une appréciation, j'ai besoin au minimum d'un élève et d'un style. Utilisez les paramètres dans le panneau latéral ou mentionnez-les dans votre message.",
          timestamp: new Date()
        }]);
      }
    } catch (error) {
      setMessages(prev => [...prev, {
        id: `assistant-error-${Date.now()}`,
        type: "assistant",
        content: "Une erreur s'est produite lors de la génération. Veuillez réessayer.",
        timestamp: new Date()
      }]);
    } finally {
      setIsGenerating(false);
    }
  };

  const generateAppreciationFromChat = async (params: {
    studentId: string;
    styleId: string;
    subjectId?: string;
    periodId?: string;
    customMessage: string;
    customInstructions?: string;
  }) => {
    const student = MOCK_STUDENTS.find(s => s.id === params.studentId);
    if (!student) return null;

    const request: GenerationRequest = {
      studentId: params.studentId,
      subjectId: params.subjectId,
      academicPeriodId: params.periodId,
      schoolYearId: "year-2025",
      styleGuideId: params.styleId,
      contentKind: "bulletin",
      scope: params.subjectId ? "subject" : "general",
      audience: "parents",
      generationTrigger: "manual",
      inputData: {
        studentName: student.fullName(),
        participationLevel: Math.random() * 10,
        averageGrade: Math.random() * 20,
        attendanceRate: 85 + Math.random() * 15,
        strengths: student.strengths,
        improvementAreas: student.improvementAxes,
        behaviorNotes: ["engaged", "collaborative"],
        customInstructions: `${params.customInstructions || ""}\n\nMessage de l'enseignant : ${params.customMessage}`
      },
      generationParams: {
        includeStrengths: true,
        includeImprovements: true,
        includeEncouragement: true,
        focusAreas: ["participation", "comprehension", "expression"]
      },
      language: "fr"
    };

    return generateAppreciation(request);
  };

  const parseUserMessage = (message: string) => {
    // Simple parsing logic - you could make this more sophisticated
    const context: any = {};

    // Look for student names
    const student = MOCK_STUDENTS.find(s =>
      message.toLowerCase().includes(s.firstName.toLowerCase()) ||
      message.toLowerCase().includes(s.lastName.toLowerCase()) ||
      message.toLowerCase().includes(s.fullName().toLowerCase())
    );
    if (student) context.studentId = student.id;

    // Look for subjects
    const subject = MOCK_SUBJECTS.find(s =>
      message.toLowerCase().includes(s.name.toLowerCase())
    );
    if (subject) context.subjectId = subject.id;

    // Look for periods
    const period = MOCK_ACADEMIC_PERIODS.find(p =>
      message.toLowerCase().includes(p.name.toLowerCase())
    );
    if (period) context.periodId = period.id;

    return context;
  };

  const handleQuickAction = (action: string) => {
    const quickMessages = {
      "add-student": "Ajouter un élève pour une appréciation",
      "add-subject": "Spécifier la matière",
      "add-period": "Choisir la période académique",
      "select-style": "Modifier le style d'écriture"
    };

    const message = quickMessages[action as keyof typeof quickMessages];
    if (message) {
      setCurrentMessage(message);
      inputRef.current?.focus();
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const selectedStudent = MOCK_STUDENTS.find(s => s.id === selectedStudentId);
  const selectedSubject = MOCK_SUBJECTS.find(s => s.id === selectedSubjectId);
  const selectedPeriod = MOCK_ACADEMIC_PERIODS.find(p => p.id === selectedPeriodId);
  const selectedStyle = styleGuides.find(s => s.id === selectedStyleId);

  return (
    <div className={`flex flex-col h-[600px] ${className}`}>
      {/* En-tête avec contexte */}
      <div className="flex items-center justify-between p-4 border-b bg-muted/30">
        <div className="flex items-center gap-3">
          <MessageSquare className="h-5 w-5 text-primary" />
          <div>
            <h3 className="font-semibold">Chat IA - Génération d'appréciations</h3>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              {selectedStudent && (
                <Badge variant="secondary" className="text-xs">
                  <User className="h-3 w-3 mr-1" />
                  {selectedStudent.fullName()}
                </Badge>
              )}
              {selectedSubject && (
                <Badge variant="secondary" className="text-xs">
                  <BookOpen className="h-3 w-3 mr-1" />
                  {selectedSubject.name}
                </Badge>
              )}
              {selectedPeriod && (
                <Badge variant="secondary" className="text-xs">
                  <Calendar className="h-3 w-3 mr-1" />
                  {selectedPeriod.name}
                </Badge>
              )}
              {selectedStyle && (
                <Badge variant="outline" className="text-xs">
                  <Sparkles className="h-3 w-3 mr-1" />
                  {selectedStyle.name}
                </Badge>
              )}
            </div>
          </div>
        </div>

        {/* Panneau de paramètres */}
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="sm">
              <Settings className="h-4 w-4" />
            </Button>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Paramètres contextuels</SheetTitle>
            </SheetHeader>
            <div className="space-y-4 mt-6">
              <div>
                <label className="text-sm font-medium">Élève</label>
                <Select value={selectedStudentId} onValueChange={setSelectedStudentId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un élève" />
                  </SelectTrigger>
                  <SelectContent>
                    {MOCK_STUDENTS.slice(0, 10).map(student => (
                      <SelectItem key={student.id} value={student.id}>
                        {student.fullName()}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium">Matière (optionnel)</label>
                <Select value={selectedSubjectId} onValueChange={setSelectedSubjectId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Général ou par matière" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Appréciation générale</SelectItem>
                    {MOCK_SUBJECTS.map(subject => (
                      <SelectItem key={subject.id} value={subject.id}>
                        {subject.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium">Période</label>
                <Select value={selectedPeriodId} onValueChange={setSelectedPeriodId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner une période" />
                  </SelectTrigger>
                  <SelectContent>
                    {MOCK_ACADEMIC_PERIODS.map(period => (
                      <SelectItem key={period.id} value={period.id}>
                        {period.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium">Style</label>
                <Select value={selectedStyleId} onValueChange={setSelectedStyleId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choisir un style" />
                  </SelectTrigger>
                  <SelectContent>
                    {styleGuides.map(guide => (
                      <SelectItem key={guide.id} value={guide.id}>
                        {guide.name}
                        <Badge variant="outline" className="ml-2 text-xs">
                          {guide.tone}
                        </Badge>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Zone de conversation */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[80%] rounded-lg p-3 ${
                message.type === "user"
                  ? "bg-primary text-primary-foreground ml-12"
                  : "bg-muted mr-12"
              }`}
            >
              <p className="text-sm">{message.content}</p>

              {/* Appréciation générée */}
              {message.appreciation && (
                <Card className="mt-3 bg-background border">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Sparkles className="h-4 w-4 text-primary" />
                        <span className="font-medium text-sm">Appréciation générée</span>
                      </div>
                      <div className="flex gap-1">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => copyToClipboard(message.appreciation!.content)}
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                        <Button size="sm" variant="ghost">
                          <RefreshCw className="h-3 w-3" />
                        </Button>
                        <Button size="sm" variant="ghost">
                          <Star className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex flex-wrap gap-2 text-xs">
                        <Badge variant="secondary">
                          <User className="h-3 w-3 mr-1" />
                          {message.appreciation.studentName}
                        </Badge>
                        {message.appreciation.subject && (
                          <Badge variant="secondary">
                            <BookOpen className="h-3 w-3 mr-1" />
                            {message.appreciation.subject}
                          </Badge>
                        )}
                        {message.appreciation.period && (
                          <Badge variant="secondary">
                            <Calendar className="h-3 w-3 mr-1" />
                            {message.appreciation.period}
                          </Badge>
                        )}
                        <Badge variant="outline">
                          {message.appreciation.style}
                        </Badge>
                      </div>

                      <div className="p-3 bg-muted/50 rounded border-l-4 border-l-primary">
                        <p className="text-sm leading-relaxed">
                          {message.appreciation.content}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              <p className="text-xs opacity-70 mt-1">
                {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </div>
        ))}

        {isGenerating && (
          <div className="flex justify-start">
            <div className="bg-muted rounded-lg p-3 mr-12">
              <div className="flex items-center gap-2">
                <div className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full" />
                <span className="text-sm">Génération en cours...</span>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Boutons rapides */}
      <div className="px-4 py-2 border-t bg-muted/20">
        <div className="flex gap-2 overflow-x-auto pb-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => handleQuickAction("add-student")}
            className="flex-shrink-0"
          >
            <Plus className="h-3 w-3 mr-1" />
            Ajouter un élève
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => handleQuickAction("add-subject")}
            className="flex-shrink-0"
          >
            <Plus className="h-3 w-3 mr-1" />
            Ajouter une matière
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => handleQuickAction("add-period")}
            className="flex-shrink-0"
          >
            <Plus className="h-3 w-3 mr-1" />
            Choisir la période
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => handleQuickAction("select-style")}
            className="flex-shrink-0"
          >
            <Plus className="h-3 w-3 mr-1" />
            Sélectionner le style
          </Button>
        </div>
      </div>

      {/* Zone de saisie */}
      <div className="p-4 border-t">
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <Input
              ref={inputRef}
              value={currentMessage}
              onChange={(e) => setCurrentMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Décrivez l'appréciation que vous souhaitez générer..."
              disabled={isGenerating}
              className="pr-10"
            />
            <Button
              size="sm"
              variant="ghost"
              onClick={handleSendMessage}
              disabled={!currentMessage.trim() || isGenerating}
              className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 p-0"
            >
              <ArrowUp className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}