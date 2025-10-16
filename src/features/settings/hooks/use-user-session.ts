"use client";

import { useAuth } from "@/features/auth/contexts/auth-context";
import type { User } from "@/types/auth";

export function useUserSession() {
  const { user, loading } = useAuth();

  const isAuthenticated = !!user;
  const isLoading = loading;

  const userData: User | null = user
    ? {
        id: user.id,
        name: user.display_name || "User",
        email: user.email || "",
        avatar: "/avatars/default.jpg", // Default avatar for now
      }
    : null;

  return {
    user: userData,
    isAuthenticated,
    isLoading,
    session: user ? { user } : null, // Compatibility with old interface
  };
}
