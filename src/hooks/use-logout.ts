"use client";

import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { useAsyncOperation } from "./shared/use-async-operation";

export function useLogout() {
  const router = useRouter();
  const { isLoading, error, execute } = useAsyncOperation();

  const handleLogout = async () => {
    await execute(async () => {
      await authClient.signOut();
      router.push("/login");
    });
  };

  return {
    handleLogout,
    isLoading,
    error,
  };
}
