"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../contexts/auth-context";

export function useLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login, loading, error } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await login(email, password);
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
    isLoading: loading,
    error,
    handleSubmit,
  };
}
