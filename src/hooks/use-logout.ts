"use client";

import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

export function useLogout() {
  const router = useRouter();

  const handleLogout = async () => {
    await authClient.signOut();
    router.push("/login");
  };

  return { handleLogout };
}
