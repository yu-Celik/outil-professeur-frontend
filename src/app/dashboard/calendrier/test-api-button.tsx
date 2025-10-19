"use client";

import { useState } from "react";
import { Button } from "@/components/atoms/button";
import { api } from "@/lib/api";

/**
 * Composant de test temporaire pour créer une session via l'API
 * À SUPPRIMER après les tests
 */
export function TestApiButton() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string>("");

  const createTestSession = async () => {
    setLoading(true);
    setResult("");

    try {
      // 1. Récupérer des classes
      console.log("🔍 Fetching classes...");
      const classesResponse = await api.classes.list({ limit: 1 });
      console.log("Classes:", classesResponse);

      if (!classesResponse.items || classesResponse.items.length === 0) {
        setResult("❌ Aucune classe trouvée dans la base de données");
        setLoading(false);
        return;
      }

      const firstClass = classesResponse.items[0];
      console.log("✅ Using class:", firstClass.id);

      // 2. Créer une session de test
      const sessionData = {
        class_id: firstClass.id,
        subject_id: firstClass.id, // Temporaire - utilisez un vrai subject_id
        time_slot_id: "00000000-0000-0000-0000-000000000001", // À adapter
        session_date: "2025-01-20",
        status: "planned",
        objectives: "Test API Integration from Frontend",
        content: "Cette session a été créée automatiquement pour tester l'API",
        is_makeup: false,
      };

      console.log("📤 Creating session with data:", sessionData);
      const createResponse = await api.courseSessions.create(sessionData);

      console.log("✅ Session created:", createResponse);
      setResult(`✅ Session créée avec succès ! ID: ${createResponse.id}`);

      // 3. Rafraîchir pour voir la session
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } catch (error: any) {
      console.error("❌ Error:", error);
      setResult(`❌ Erreur: ${error.message || "Erreur inconnue"}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 bg-white p-4 rounded-lg shadow-lg border">
      <p className="text-sm font-semibold">🧪 Test API</p>
      <Button
        onClick={createTestSession}
        disabled={loading}
        variant="default"
        size="sm"
      >
        {loading ? "Création..." : "Créer Session Test"}
      </Button>
      {result && <p className="text-xs max-w-xs break-words">{result}</p>}
    </div>
  );
}
