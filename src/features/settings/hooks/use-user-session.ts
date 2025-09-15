"use client";

import { useSession } from "@/lib/auth-client";
import type { User } from "@/types/auth";

export function useUserSession() {
  const { data: session, isPending } = useSession();

  const user = session?.user;
  const isAuthenticated = !!user;
  const isLoading = isPending;

  const userData: User | null = user
    ? {
        id: user.id,
        name: user.name || "User",
        email: user.email || "",
        avatar: user.image || "/avatars/default.jpg",
      }
    : null;

  return {
    user: userData,
    isAuthenticated,
    isLoading,
    session,
  };
}
