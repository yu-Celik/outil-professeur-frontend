import type { UserPreferences } from "@/types/uml-entities";

// Palette par défaut - compatible daltonisme
const DEFAULT_PALETTE = [
  "#3B82F6", // Bleu
  "#10B981", // Vert
  "#F59E0B", // Orange
  "#EF4444", // Rouge
  "#8B5CF6", // Violet
  "#06B6D4", // Cyan
  "#84CC16", // Lime
  "#F472B6", // Rose
  "#A855F7", // Pourpre
  "#22C55E", // Vert émeraude
  "#EAB308", // Jaune
  "#0EA5E9", // Bleu ciel
] as const;

export const MOCK_USER_PREFERENCES: UserPreferences[] = [
  {
    id: "pref-teacher-main",
    userId: "KsmNtVf4zwqO3VV3SQJqPrRlQBA1fFyR", // ex-createdBy
    schoolYearId: "year-2025", // obligatoire maintenant
    preferences: {
      version: 1, // pour migrations futures
      classColors: {
        "class-2nde-jaspe": "#3B82F6", // Bleu
        "class-2nde-thulite": "#10B981", // Vert
        "class-2nde-zircon": "#F59E0B", // Orange
        "class-1e-onyx": "#8B5CF6", // Violet
        "class-term-tanzanite": "#EF4444", // Rouge
      },
      calendarDefaultView: "week",
      autoAssignColors: true,
      contrastMode: "auto",
      colorPalette: DEFAULT_PALETTE,
      notificationSettings: {
        sessionReminders: true,
        examDeadlines: true,
        absenceAlerts: true,
      },
      displaySettings: {
        compactMode: false,
        showWeekends: false,
        timeFormat24h: true,
      },
    },
    createdAt: new Date("2025-09-01"),
    updatedAt: new Date(),

    updateClassColor(classId: string, color: `#${string}`): void {
      this.preferences.classColors[classId] = color;
      this.updatedAt = new Date();
    },

    getClassColor(classId: string): `#${string}` | null {
      return this.preferences.classColors[classId] || null;
    },

    resetToDefaults(): void {
      this.preferences = {
        version: 1,
        classColors: {
          "class-2nde-jaspe": "#3B82F6",
          "class-2nde-thulite": "#10B981",
          "class-2nde-zircon": "#F59E0B",
          "class-1e-onyx": "#8B5CF6",
          "class-term-tanzanite": "#EF4444",
        },
        calendarDefaultView: "week",
        autoAssignColors: true,
        contrastMode: "auto",
        colorPalette: DEFAULT_PALETTE,
      };
      this.updatedAt = new Date();
    },

    exportPreferences(): Record<string, unknown> {
      return {
        classColors: this.preferences.classColors,
        calendarDefaultView: this.preferences.calendarDefaultView,
        autoAssignColors: this.preferences.autoAssignColors,
        contrastMode: this.preferences.contrastMode,
        exportedAt: new Date(),
      };
    },

    importPreferences(data: Record<string, unknown>): void {
      if (data.classColors && typeof data.classColors === "object") {
        this.preferences.classColors = data.classColors as Record<
          string,
          `#${string}`
        >;
      }
      if (data.calendarDefaultView) {
        this.preferences.calendarDefaultView = data.calendarDefaultView as
          | "month"
          | "week";
      }
      if (typeof data.autoAssignColors === "boolean") {
        this.preferences.autoAssignColors = data.autoAssignColors;
      }
      if (data.contrastMode) {
        this.preferences.contrastMode = data.contrastMode as
          | "auto"
          | "high"
          | "off";
      }
      this.updatedAt = new Date();
    },
  },
];

/**
 * Récupère les préférences d'un professeur pour une année scolaire
 */
export function getUserPreferences(
  userId: string,
  schoolYearId?: string,
): UserPreferences | null {
  return (
    MOCK_USER_PREFERENCES.find(
      (pref) =>
        pref.userId === userId &&
        (!schoolYearId || pref.schoolYearId === schoolYearId),
    ) || null
  );
}

/**
 * Met à jour les préférences utilisateur
 */
export function updateUserPreferences(
  userId: string,
  updates: Partial<UserPreferences["preferences"]>,
): void {
  const preferences = getUserPreferences(userId);
  if (preferences) {
    preferences.preferences = { ...preferences.preferences, ...updates };
    preferences.updatedAt = new Date();
  }
}

/**
 * Crée de nouvelles préférences pour un professeur
 */
export function createUserPreferences(
  userId: string,
  schoolYearId: string,
): UserPreferences {
  const newPreferences: UserPreferences = {
    id: `pref-${userId}-${Date.now()}`,
    userId,
    schoolYearId, // obligatoire maintenant
    preferences: {
      version: 1,
      classColors: {},
      calendarDefaultView: "week",
      autoAssignColors: true,
      contrastMode: "auto",
      colorPalette: DEFAULT_PALETTE,
    },
    createdAt: new Date(),
    updatedAt: new Date(),
    updateClassColor(classId: string, color: `#${string}`): void {
      this.preferences.classColors[classId] = color;
      this.updatedAt = new Date();
    },
    getClassColor(classId: string): `#${string}` | null {
      return this.preferences.classColors[classId] || null;
    },
    resetToDefaults(): void {
      this.preferences = {
        version: 1,
        classColors: {},
        calendarDefaultView: "week",
        autoAssignColors: true,
        contrastMode: "auto",
        colorPalette: DEFAULT_PALETTE,
      };
      this.updatedAt = new Date();
    },
    exportPreferences(): Record<string, unknown> {
      return {
        classColors: this.preferences.classColors,
        calendarDefaultView: this.preferences.calendarDefaultView,
        autoAssignColors: this.preferences.autoAssignColors,
        contrastMode: this.preferences.contrastMode,
        exportedAt: new Date(),
      };
    },
    importPreferences(data: Record<string, unknown>): void {
      if (data.classColors && typeof data.classColors === "object") {
        this.preferences.classColors = data.classColors as Record<
          string,
          `#${string}`
        >;
      }
      if (data.calendarDefaultView) {
        this.preferences.calendarDefaultView = data.calendarDefaultView as
          | "month"
          | "week";
      }
      if (typeof data.autoAssignColors === "boolean") {
        this.preferences.autoAssignColors = data.autoAssignColors;
      }
      if (data.contrastMode) {
        this.preferences.contrastMode = data.contrastMode as
          | "auto"
          | "high"
          | "off";
      }
      this.updatedAt = new Date();
    },
  };

  MOCK_USER_PREFERENCES.push(newPreferences);
  return newPreferences;
}
