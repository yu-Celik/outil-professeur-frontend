"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../contexts/auth-context";

export function useRegister() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [validationError, setValidationError] = useState<string | null>(null);
  const { register, loading, error: authError } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    // Validation côté client
    if (password.length < 8) {
      setValidationError("Le mot de passe doit contenir au moins 8 caractères");
      return;
    }

    if (password !== confirmPassword) {
      setValidationError("Les mots de passe ne correspondent pas");
      return;
    }

    if (!displayName.trim()) {
      setValidationError("Le nom d'affichage est requis");
      return;
    }

    try {
      await register(email, password, displayName);
      router.push("/dashboard");
    } catch (err) {
      // Error is already handled by auth context
    }
  };

  return {
    email,
    setEmail,
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    displayName,
    setDisplayName,
    isLoading: loading,
    error: validationError || authError,
    handleSubmit,
  };
}
