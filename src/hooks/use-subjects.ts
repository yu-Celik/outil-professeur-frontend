"use client";

import { useEffect, useState } from "react";
import { useUserSession } from "./use-user-session";

export function useSubjects() {
  const { session } = useUserSession();
  const [subjects, setSubjects] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // Load subjects from user session when available
  useEffect(() => {
    if (session?.user?.subjects) {
      try {
        const parsedSubjects = JSON.parse(session.user.subjects as string);
        setSubjects(Array.isArray(parsedSubjects) ? parsedSubjects : []);
      } catch {
        setSubjects([]);
      }
    }
  }, [session]);

  // Update user subjects
  const updateSubjects = async (newSubjects: string[]) => {
    setIsLoading(true);
    setError("");

    try {
      // Note: This would require a custom API endpoint to update user profile
      // For now, we'll store in local state and show a placeholder
      setSubjects(newSubjects);
      console.log("Subjects updated:", newSubjects);
      // TODO: Implement actual API call to update user profile
    } catch (err) {
      setError("Failed to update subjects");
    } finally {
      setIsLoading(false);
    }
  };

  return {
    subjects,
    isLoading,
    error,
    updateSubjects,
    hasSubjects: subjects.length > 0,
  };
}
