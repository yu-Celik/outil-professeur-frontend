"use client";

import { useEffect } from "react";
import { usePageTitle } from "./use-page-title";

export function useSetPageTitle(title: string) {
  const { setTitle } = usePageTitle();

  useEffect(() => {
    setTitle(title);

    // Cleanup pour réinitialiser le titre quand le composant est démonté
    return () => {
      setTitle("Tableau de bord");
    };
  }, [title, setTitle]);
}
