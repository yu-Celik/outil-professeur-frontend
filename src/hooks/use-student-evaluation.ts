"use client";

import { useUMLEvaluation } from "@/hooks/use-uml-evaluation";

interface SessionStudent {
  id: string;
  name: string;
  status: "current" | "pending" | "completed";
  completion: "not_started" | "in_progress" | "completed";
}

export function useStudentEvaluation(studentId: string, sessionId?: string) {
  const umlData = useUMLEvaluation(studentId, sessionId);
  
  // Données mock pour la liste des étudiants de la session
  const sessionStudents: SessionStudent[] = [
    { id: "1", name: "Pierre", status: "current", completion: "in_progress" },
    { id: "2", name: "Sacha", status: "pending", completion: "not_started" },
    { id: "3", name: "Paulette", status: "completed", completion: "completed" },
    { id: "4", name: "Roberto", status: "pending", completion: "not_started" },
    { id: "5", name: "Francis", status: "pending", completion: "not_started" },
    { id: "6", name: "Riko", status: "pending", completion: "not_started" },
    { id: "7", name: "Georges", status: "pending", completion: "not_started" },
  ];

  const handleSave = async () => {
    try {
      await umlData.saveParticipation();
      // Optionnel: notification de succès
    } catch (error) {
      console.error("Erreur lors de la sauvegarde:", error);
    }
  };

  const handleReset = () => {
    window.location.reload();
  };

  return {
    // UML data
    ...umlData,
    
    // Local data
    sessionStudents,
    
    // Actions
    handleSave,
    handleReset,
  };
}