"use client";

import { useState, useCallback } from "react";

/**
 * Hook standard pour la gestion des modales avec pattern élégant
 * Basé sur le pattern SessionContextMenu → SessionCancelDialog
 *
 * @template T Type des données de l'entité (CourseSession, Student, Class, etc.)
 */
export function useModal<T = undefined>() {
  const [isOpen, setIsOpen] = useState(false);
  const [data, setData] = useState<T | null>(null);

  /**
   * Ouvrir la modal avec des données (pattern élégant)
   * @param entity Données de l'entité à passer à la modal
   */
  const open = useCallback((entity: T) => {
    setData(entity);
    setIsOpen(true);
  }, []);

  /**
   * Ouvrir la modal sans données (pour les modales simples)
   */
  const openEmpty = useCallback(() => {
    setIsOpen(true);
  }, []);

  /**
   * Fermer la modal et nettoyer les données
   */
  const close = useCallback(() => {
    setIsOpen(false);
    setData(null);
  }, []);

  /**
   * Gestionnaire pour onOpenChange des composants Radix
   */
  const handleOpenChange = useCallback(
    (open: boolean) => {
      if (!open) {
        close();
      }
    },
    [close],
  );

  return {
    // État
    isOpen,
    data,

    // Actions
    open,
    openEmpty,
    close,
    handleOpenChange,

    // Props prêtes pour les composants
    modalProps: {
      open: isOpen,
      onOpenChange: handleOpenChange,
    },
  };
}

/**
 * Hook spécialisé pour les modales sans données
 * Pour les cas simples comme les formulaires de création
 */
export function useSimpleModal() {
  const [isOpen, setIsOpen] = useState(false);

  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);

  const handleOpenChange = useCallback((open: boolean) => {
    setIsOpen(open);
  }, []);

  return {
    isOpen,
    open,
    close,
    modalProps: {
      open: isOpen,
      onOpenChange: handleOpenChange,
    },
  };
}
