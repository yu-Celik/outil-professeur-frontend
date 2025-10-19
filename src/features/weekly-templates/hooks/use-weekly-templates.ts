import { useCallback, useEffect, useState } from "react";
import type { WeeklyTemplate } from "@/types/uml-entities";
import { api } from "@/lib/api";

/**
 * Hook for managing weekly session templates
 * Provides CRUD operations for templates used to generate recurring sessions
 */
export function useWeeklyTemplates(teacherId: string) {
  const [templates, setTemplates] = useState<WeeklyTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [operationLoading, setOperationLoading] = useState(false);

  // Load templates for the teacher
  const loadTemplates = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.weeklyTemplates.list();

      // Map backend response to frontend WeeklyTemplate format
      const mappedTemplates: WeeklyTemplate[] = response.data.map(
        (template: any) => ({
          id: template.id,
          teacherId: teacherId, // Add teacherId from current user context
          schoolYearId: template.school_year_id,
          dayOfWeek: template.day_of_week,
          timeSlotId: template.time_slot_id,
          classId: template.class_id,
          subjectId: template.subject_id,
          isActive: template.is_active,
        }),
      );

      setTemplates(mappedTemplates);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to load templates";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [teacherId]);

  // Load templates on mount
  useEffect(() => {
    loadTemplates();
  }, [loadTemplates]);

  // Create a new weekly template
  const createTemplate = useCallback(
    async (templateData: Omit<WeeklyTemplate, "id">) => {
      setOperationLoading(true);
      setError(null);
      try {
        // Map frontend format to backend format
        const backendData = {
          school_year_id: templateData.schoolYearId,
          day_of_week: templateData.dayOfWeek,
          time_slot_id: templateData.timeSlotId,
          class_id: templateData.classId,
          subject_id: templateData.subjectId,
          is_active: templateData.isActive,
        };

        const createdTemplate = await api.weeklyTemplates.create(backendData);

        // Map response to frontend format
        const newTemplate: WeeklyTemplate = {
          id: createdTemplate.id,
          teacherId: teacherId,
          schoolYearId: createdTemplate.school_year_id,
          dayOfWeek: createdTemplate.day_of_week,
          timeSlotId: createdTemplate.time_slot_id,
          classId: createdTemplate.class_id,
          subjectId: createdTemplate.subject_id,
          isActive: createdTemplate.is_active,
        };

        setTemplates((prev) => [...prev, newTemplate]);
        return newTemplate;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to create template";
        setError(errorMessage);
        throw err;
      } finally {
        setOperationLoading(false);
      }
    },
    [teacherId],
  );

  // Update an existing template
  const updateTemplate = useCallback(
    async (id: string, updates: Partial<WeeklyTemplate>) => {
      setOperationLoading(true);
      setError(null);
      try {
        // TODO: Replace with API call when backend is ready
        // const updatedTemplate = await fetchAPI(`/weekly-templates/${id}`, {
        //   method: 'PATCH',
        //   body: JSON.stringify(updates),
        // })

        // For now, update locally
        setTemplates((prev) =>
          prev.map((t) => (t.id === id ? { ...t, ...updates } : t)),
        );

        const updated = templates.find((t) => t.id === id);
        if (!updated) throw new Error("Template not found");
        return { ...updated, ...updates };
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to update template";
        setError(errorMessage);
        throw err;
      } finally {
        setOperationLoading(false);
      }
    },
    [templates],
  );

  // Delete a template
  const deleteTemplate = useCallback(async (id: string) => {
    setOperationLoading(true);
    setError(null);
    try {
      await api.weeklyTemplates.delete(id);

      // Remove from local state after successful deletion
      setTemplates((prev) => prev.filter((t) => t.id !== id));
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to delete template";
      setError(errorMessage);
      throw err;
    } finally {
      setOperationLoading(false);
    }
  }, []);

  // Deactivate a template (soft delete)
  const deactivateTemplate = useCallback(
    async (id: string) => {
      return updateTemplate(id, { isActive: false });
    },
    [updateTemplate],
  );

  // Get templates for a specific day of week
  const getTemplatesForDay = useCallback(
    (dayOfWeek: number) => {
      return templates.filter((t) => t.dayOfWeek === dayOfWeek && t.isActive);
    },
    [templates],
  );

  // Get templates for a specific class
  const getTemplatesForClass = useCallback(
    (classId: string) => {
      return templates.filter((t) => t.classId === classId && t.isActive);
    },
    [templates],
  );

  return {
    templates,
    loading: loading || operationLoading,
    error,
    createTemplate,
    updateTemplate,
    deleteTemplate,
    deactivateTemplate,
    getTemplatesForDay,
    getTemplatesForClass,
    refresh: loadTemplates,
  };
}
