"use client";

import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader } from "@/components/molecules/card";
import { Button } from "@/components/atoms/button";
import { Input } from "@/components/atoms/input";
import { Badge } from "@/components/atoms/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/atoms/avatar";
import {
  Bot,
  Send,
  Plus,
  MessageSquare,
  Sparkles,
  Loader2,
} from "lucide-react";

interface Message {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
  isLoading?: boolean;
}

interface Conversation {
  id: string;
  title: string;
  preview: string;
  timestamp: Date;
  messageCount: number;
}

const QUICK_PROMPTS = [
  "Comment préparer un cours ?",
  "Créer un quiz rapide",
  "Idées d'activités créatives",
  "Gérer les élèves difficiles",
];

export function ChatAI() {
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [activeConversation, setActiveConversation] = useState("1");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [conversations] = useState<Conversation[]>([
    {
      id: "1",
      title: "Préparation cours B1",
      preview: "Comment structurer mon prochain cours sur...",
      timestamp: new Date(Date.now() - 10 * 60 * 1000), // 10 min ago
      messageCount: 12,
    },
    {
      id: "2",
      title: "Évaluation A2",
      preview: "Peux-tu m'aider à créer une évaluation...",
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2h ago
      messageCount: 8,
    },
    {
      id: "3",
      title: "Motivation élèves",
      preview: "J'ai des difficultés avec certains élèves...",
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
      messageCount: 15,
    },
  ]);

  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content:
        "Bonjour ! Je suis votre assistant IA dédié à l'enseignement. Comment puis-je vous aider aujourd'hui ?",
      isUser: false,
      timestamp: new Date(Date.now() - 30 * 60 * 1000),
    },
    {
      id: "2",
      content: "J'aimerais des conseils pour rendre mes cours plus interactifs",
      isUser: true,
      timestamp: new Date(Date.now() - 25 * 60 * 1000),
    },
    {
      id: "3",
      content:
        "Excellente question ! Voici quelques stratégies éprouvées pour rendre vos cours plus interactifs :\n\n• **Questions fréquentes** : Posez des questions toutes les 5-10 minutes\n• **Activités en binômes** : Encouragez les discussions entre élèves\n• **Outils numériques** : Utilisez des quiz en ligne, sondages en temps réel\n• **Jeux éducatifs** : Gamifiez l'apprentissage avec des défis\n\nSouhaitez-vous que je détaille l'une de ces approches ?",
      isUser: false,
      timestamp: new Date(Date.now() - 24 * 60 * 1000),
    },
  ]);

  // With flex-col-reverse, we don't need auto-scroll since new messages appear at the "top" (which is visually bottom)
  // Remove auto-scroll effects as they're not needed with the reverse layout

  const handleSendMessage = async () => {
    if (!message.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: message,
      isUser: true,
      timestamp: new Date(),
    };

    const loadingMessage: Message = {
      id: (Date.now() + 1).toString(),
      content: "",
      isUser: false,
      timestamp: new Date(),
      isLoading: true,
    };

    setMessages((prev) => [...prev, userMessage, loadingMessage]);
    setMessage("");
    setIsLoading(true);

    // Simulate AI response
    setTimeout(() => {
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === loadingMessage.id
            ? {
                ...msg,
                content:
                  "Voici ma réponse à votre question. Je peux vous aider avec plus de détails si nécessaire.",
                isLoading: false,
              }
            : msg,
        ),
      );
      setIsLoading(false);
    }, 2000);
  };

  const handleQuickPrompt = (prompt: string) => {
    setMessage(prompt);
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return "à l'instant";
    if (minutes < 60) return `il y a ${minutes}min`;
    if (hours < 24) return `il y a ${hours}h`;
    return `il y a ${days}j`;
  };

  const startNewConversation = () => {
    setMessages([
      {
        id: "new-1",
        content:
          "Nouvelle conversation commencée ! Comment puis-je vous aider ?",
        isUser: false,
        timestamp: new Date(),
      },
    ]);
    setActiveConversation("new");
  };

  return (
    <Card className="h-full max-h-full flex flex-col overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 px-6 flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
            <Bot className="h-4 w-4 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-base">Assistant IA</h3>
            <p className="text-xs text-muted-foreground">
              Toujours là pour vous aider
            </p>
          </div>
        </div>
        <Button variant="outline" size="lg" onClick={startNewConversation}>
          <Plus className="h-4 w-4 mr-1" />
          Nouveau
        </Button>
      </CardHeader>

      {/* Historique des conversations */}
      {conversations.length > 0 && (
        <CardContent className="border-b pb-4 flex-shrink-0 max-h-52 overflow-y-auto">
          <div className="flex items-center gap-2 mb-3">
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">Conversations récentes</span>
          </div>
          <div className="space-y-2">
            {conversations.slice(0, 2).map((conv) => (
              <button
                key={conv.id}
                className="w-full text-left p-3 rounded-lg hover:bg-muted/50 transition-colors border"
                onClick={() => setActiveConversation(conv.id)}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium truncate">
                    {conv.title}
                  </span>
                  <Badge variant="secondary" className="text-xs">
                    {conv.messageCount}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground truncate">
                  {conv.preview}
                </p>
              </button>
            ))}
          </div>
        </CardContent>
      )}

      <CardContent className="flex-1 flex flex-col p-0 min-h-0 overflow-hidden">
        {/* Zone de messages */}
        <div className="flex-1 overflow-y-auto px-6 min-h-0 flex flex-col-reverse">
          <div className="space-y-4 py-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-3 ${msg.isUser ? "justify-end" : "justify-start"}`}
              >
                {!msg.isUser && (
                  <Avatar className="h-8 w-8 mt-1">
                    <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-xs">
                      IA
                    </AvatarFallback>
                  </Avatar>
                )}

                <div
                  className={`max-w-[85%] ${msg.isUser ? "order-first" : ""}`}
                >
                  <div
                    className={`rounded-2xl p-3 text-sm ${
                      msg.isUser
                        ? "bg-primary text-primary-foreground ml-auto"
                        : "bg-muted"
                    }`}
                  >
                    {msg.isLoading ? (
                      <div className="flex items-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span>Réflexion en cours...</span>
                      </div>
                    ) : (
                      <div className="whitespace-pre-wrap">{msg.content}</div>
                    )}
                  </div>
                  <div
                    className={`text-xs text-muted-foreground mt-1 ${msg.isUser ? "text-right" : ""}`}
                  >
                    {formatTime(msg.timestamp)}
                  </div>
                </div>

                {msg.isUser && (
                  <Avatar className="h-8 w-8 mt-1">
                    <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                      Moi
                    </AvatarFallback>
                  </Avatar>
                )}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Suggestions rapides */}
        {messages.length <= 1 && (
          <div className="px-6 pb-2 flex-shrink-0">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Suggestions</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {QUICK_PROMPTS.map((prompt, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  className="text-xs h-8"
                  onClick={() => handleQuickPrompt(prompt)}
                >
                  {prompt}
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* Zone de saisie */}
        <div className="border-t pt-4 px-4 flex-shrink-0">
          <div className="flex items-end gap-2">
            <div className="flex-1">
              <Input
                placeholder="Posez votre question..."
                className="min-h-[44px] resize-none border-2 focus:border-primary"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
                disabled={isLoading}
              />
            </div>
            <Button
              onClick={handleSendMessage}
              disabled={!message.trim() || isLoading}
              className="h-[44px] px-6"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-2 text-center">
            L'IA peut faire des erreurs. Vérifiez les informations importantes.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
