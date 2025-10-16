"use client";

import { useAuth } from "../contexts/auth-context";

export function useLogout() {
  const { logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    // Force full page refresh to clear all state and let middleware handle redirect
    window.location.href = "/login";
  };

  return {
    handleLogout,
  };
}
