"use client";

import type { NotationSystem } from "@/types/uml-entities";
import { MOCK_NOTATION_SYSTEMS } from "@/features/evaluations/mocks/mock-notation-systems";

// Re-export the type for use in other modules
export type { NotationSystem };

export interface CreateNotationSystemData {
  name: string;
  scaleType: "numeric" | "letter" | "competency" | "custom";
  minValue: number;
  maxValue: number;
  rules: Record<string, unknown>;
  createdBy: string;
}

export interface UpdateNotationSystemData extends Partial<CreateNotationSystemData> {
  id: string;
}

export interface NotationSystemSearchOptions {
  scaleType?: string;
  createdBy?: string;
  isActive?: boolean;
  name?: string;
}

class NotationSystemService {
  private systems: NotationSystem[] = [...MOCK_NOTATION_SYSTEMS];

  // Create a new notation system
  async create(data: CreateNotationSystemData): Promise<NotationSystem> {
    const newSystem: NotationSystem = {
      id: crypto.randomUUID(),
      ...data,
      createdAt: new Date(),
      updatedAt: new Date(),
      validateGrade: this.createValidateFunction(data.minValue, data.maxValue),
      convert: this.createConvertFunction(),
      formatDisplay: this.createFormatFunction(data.scaleType, data.rules),
    };

    this.systems.push(newSystem);
    return newSystem;
  }

  // Read all notation systems
  async getAll(options?: NotationSystemSearchOptions): Promise<NotationSystem[]> {
    let filtered = [...this.systems];

    if (options?.scaleType) {
      filtered = filtered.filter(system => system.scaleType === options.scaleType);
    }

    if (options?.createdBy) {
      filtered = filtered.filter(system => system.createdBy === options.createdBy);
    }

    if (options?.name) {
      const searchTerm = options.name.toLowerCase();
      filtered = filtered.filter(system =>
        system.name.toLowerCase().includes(searchTerm)
      );
    }

    return filtered;
  }

  // Read single notation system
  async getById(id: string): Promise<NotationSystem | null> {
    return this.systems.find(system => system.id === id) || null;
  }

  // Update notation system
  async update(data: UpdateNotationSystemData): Promise<NotationSystem | null> {
    const index = this.systems.findIndex(system => system.id === data.id);

    if (index === -1) {
      return null;
    }

    const existing = this.systems[index];
    const updated: NotationSystem = {
      ...existing,
      ...data,
      updatedAt: new Date(),
      validateGrade: data.minValue !== undefined || data.maxValue !== undefined
        ? this.createValidateFunction(
            data.minValue ?? existing.minValue,
            data.maxValue ?? existing.maxValue
          )
        : existing.validateGrade,
      formatDisplay: data.scaleType || data.rules
        ? this.createFormatFunction(
            data.scaleType ?? existing.scaleType,
            data.rules ?? existing.rules
          )
        : existing.formatDisplay,
    };

    this.systems[index] = updated;
    return updated;
  }

  // Delete notation system
  async delete(id: string): Promise<boolean> {
    const index = this.systems.findIndex(system => system.id === id);

    if (index === -1) {
      return false;
    }

    // Check if system is in use (mock check)
    const isInUse = await this.isSystemInUse(id);
    if (isInUse) {
      throw new Error("Impossible de supprimer un système de notation en cours d'utilisation");
    }

    this.systems.splice(index, 1);
    return true;
  }

  // Check if system is in use
  private async isSystemInUse(id: string): Promise<boolean> {
    // In real implementation, check exams and results using this system
    // For now, protect default systems
    const defaultSystems = ["notation-numeric-20", "notation-letter-af", "notation-competencies"];
    return defaultSystems.includes(id);
  }

  // Convert grade between systems
  async convertGrade(
    value: number,
    fromSystemId: string,
    toSystemId: string
  ): Promise<number | null> {
    const fromSystem = await this.getById(fromSystemId);
    const toSystem = await this.getById(toSystemId);

    if (!fromSystem || !toSystem) {
      return null;
    }

    return toSystem.convert(value, fromSystem);
  }

  // Validate grade with specific system
  async validateGrade(value: number, systemId: string): Promise<boolean> {
    const system = await this.getById(systemId);
    return system ? system.validateGrade(value) : false;
  }

  // Format grade with specific system
  async formatGrade(
    value: number,
    systemId: string,
    locale: string = "fr-FR"
  ): Promise<string | null> {
    const system = await this.getById(systemId);
    return system ? system.formatDisplay(value, locale) : null;
  }

  // Get scale configurations by type
  async getScaleConfigurations(): Promise<Record<string, any>> {
    return {
      numeric: {
        name: "Notation numérique",
        description: "Notes numériques avec échelle personnalisable",
        defaultRange: { min: 0, max: 20 },
        validationRules: {
          minValue: { min: 0, max: 100 },
          maxValue: { min: 1, max: 100 },
        },
        rulesTemplate: {
          passingGrade: 10,
          excellentGrade: 16,
          gradeLabels: {},
        },
      },
      letter: {
        name: "Notation par lettres",
        description: "Système de lettres (A, B, C, D, F)",
        defaultRange: { min: 0, max: 4 },
        validationRules: {
          minValue: { min: 0, max: 0 },
          maxValue: { min: 4, max: 10 },
        },
        rulesTemplate: {
          gradeLabels: {
            0: "F - Échec",
            1: "D - Passable",
            2: "C - Satisfaisant",
            3: "B - Bien",
            4: "A - Excellent",
          },
        },
      },
      competency: {
        name: "Évaluation par compétences",
        description: "Niveaux de maîtrise des compétences",
        defaultRange: { min: 0, max: 3 },
        validationRules: {
          minValue: { min: 0, max: 0 },
          maxValue: { min: 3, max: 5 },
        },
        rulesTemplate: {
          competencyLevels: {
            0: "Non acquis",
            1: "En cours d'acquisition",
            2: "Acquis",
            3: "Expert",
          },
        },
      },
      custom: {
        name: "Système personnalisé",
        description: "Système entièrement configurable",
        defaultRange: { min: 0, max: 100 },
        validationRules: {
          minValue: { min: 0, max: 1000 },
          maxValue: { min: 1, max: 1000 },
        },
        rulesTemplate: {},
      },
    };
  }

  // Helper: Create validation function
  private createValidateFunction(minValue: number, maxValue: number) {
    return (grade: number): boolean => {
      return grade >= minValue && grade <= maxValue && !isNaN(grade);
    };
  }

  // Helper: Create conversion function
  private createConvertFunction() {
    return function(this: NotationSystem, value: number, fromSystem: NotationSystem): number {
      if (this.id === fromSystem.id) return value;

      const ratio = (this.maxValue - this.minValue) / (fromSystem.maxValue - fromSystem.minValue);
      const converted = (value - fromSystem.minValue) * ratio + this.minValue;

      return Math.round(converted * 100) / 100;
    };
  }

  // Helper: Create format function
  private createFormatFunction(scaleType: string, rules: Record<string, unknown>) {
    return (grade: number, locale: string = "fr-FR"): string => {
      const roundedGrade = Math.round(grade);

      switch (scaleType) {
        case "letter": {
          const labels = ["F", "D", "C", "B", "A"];
          return labels[roundedGrade] || "F";
        }
        case "competency": {
          const rulesTyped = rules as { competencyLevels?: Record<string, string> };
          if (rulesTyped.competencyLevels) {
            return rulesTyped.competencyLevels[roundedGrade] || "Non acquis";
          }
          return "Non acquis";
        }
        case "numeric": {
          const rulesTyped = rules as { gradeLabels?: Record<string, string> };
          if (rulesTyped.gradeLabels) {
            const max = Math.max(...Object.keys(rulesTyped.gradeLabels).map(Number));
            return `${grade}/${max}`;
          }
          return grade.toString();
        }
        case "custom": {
          const rulesTyped = rules as { format?: string; suffix?: string };
          if (rulesTyped.format) {
            return rulesTyped.format.replace("{value}", grade.toString());
          }
          return `${grade}${rulesTyped.suffix || ""}`;
        }
        default:
          return grade.toString();
      }
    };
  }

  // Import systems from JSON
  async importSystems(systemsData: Partial<NotationSystem>[]): Promise<NotationSystem[]> {
    const imported: NotationSystem[] = [];

    for (const data of systemsData) {
      if (!data.name || !data.scaleType || data.minValue === undefined || data.maxValue === undefined) {
        continue;
      }

      const newSystem = await this.create({
        name: data.name,
        scaleType: data.scaleType as any,
        minValue: data.minValue,
        maxValue: data.maxValue,
        rules: data.rules || {},
        createdBy: data.createdBy || "import",
      });

      imported.push(newSystem);
    }

    return imported;
  }

  // Export systems to JSON
  async exportSystems(systemIds?: string[]): Promise<Partial<NotationSystem>[]> {
    let systems = await this.getAll();

    if (systemIds) {
      systems = systems.filter(system => systemIds.includes(system.id));
    }

    return systems.map(system => ({
      name: system.name,
      scaleType: system.scaleType,
      minValue: system.minValue,
      maxValue: system.maxValue,
      rules: system.rules,
    }));
  }
}

// Singleton instance
export const notationSystemService = new NotationSystemService();