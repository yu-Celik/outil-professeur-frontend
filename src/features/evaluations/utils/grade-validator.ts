"use client";

import type { NotationSystem } from "@/types/uml-entities";

export interface ValidationRule {
  name: string;
  message: string;
  validator: (value: number, system: NotationSystem) => boolean;
  severity: "error" | "warning" | "info";
}

export interface GradeFormatOptions {
  locale?: string;
  showSystemName?: boolean;
  showDescription?: boolean;
  compact?: boolean;
  colorCoded?: boolean;
}

export interface FormattedGrade {
  display: string;
  raw: number;
  system: NotationSystem;
  isValid: boolean;
  color?: string;
  description?: string;
  category?: string;
}

export class GradeValidator {
  private customRules: ValidationRule[] = [];

  constructor(private systems: NotationSystem[]) {
    this.initializeDefaultRules();
  }

  // Initialize default validation rules
  private initializeDefaultRules(): void {
    this.customRules = [
      {
        name: "range",
        message: "La note doit être dans la plage autorisée",
        validator: (value, system) =>
          value >= system.minValue && value <= system.maxValue,
        severity: "error",
      },
      {
        name: "precision",
        message: "La note ne respecte pas la précision requise",
        validator: (value, system) => {
          const rules = system.rules as any;
          if (!rules.precision) return true;
          return (value * (1 / rules.precision)) % 1 === 0;
        },
        severity: "error",
      },
      {
        name: "integer",
        message: "La note doit être un nombre entier",
        validator: (value, system) => {
          if (
            system.scaleType === "letter" ||
            system.scaleType === "competency"
          ) {
            return value % 1 === 0;
          }
          return true;
        },
        severity: "error",
      },
      {
        name: "passing_grade",
        message: "Note en dessous du seuil de réussite",
        validator: (value, system) => {
          const rules = system.rules as any;
          if (rules.passingGrade) {
            return value >= rules.passingGrade;
          }
          if (rules.passingLevel) {
            return value >= rules.passingLevel;
          }
          return true;
        },
        severity: "warning",
      },
      {
        name: "numeric_finite",
        message: "La note doit être un nombre valide",
        validator: (value) => Number.isFinite(value) && !Number.isNaN(value),
        severity: "error",
      },
    ];
  }

  // Add custom validation rule
  public addRule(rule: ValidationRule): void {
    this.customRules.push(rule);
  }

  // Remove custom validation rule
  public removeRule(ruleName: string): void {
    this.customRules = this.customRules.filter(
      (rule) => rule.name !== ruleName,
    );
  }

  // Validate grade with detailed results
  public validateDetailed(
    value: number,
    systemId: string,
  ): {
    isValid: boolean;
    errors: string[];
    warnings: string[];
    info: string[];
    passedRules: string[];
    failedRules: string[];
  } {
    const system = this.systems.find((s) => s.id === systemId);

    if (!system) {
      return {
        isValid: false,
        errors: ["Système de notation non trouvé"],
        warnings: [],
        info: [],
        passedRules: [],
        failedRules: ["system_not_found"],
      };
    }

    const errors: string[] = [];
    const warnings: string[] = [];
    const info: string[] = [];
    const passedRules: string[] = [];
    const failedRules: string[] = [];

    // Check built-in system validation first
    if (!system.validateGrade(value)) {
      errors.push("Note invalide selon les règles du système");
      failedRules.push("system_validation");
    } else {
      passedRules.push("system_validation");
    }

    // Apply custom rules
    for (const rule of this.customRules) {
      const passed = rule.validator(value, system);

      if (passed) {
        passedRules.push(rule.name);
      } else {
        failedRules.push(rule.name);

        switch (rule.severity) {
          case "error":
            errors.push(rule.message);
            break;
          case "warning":
            warnings.push(rule.message);
            break;
          case "info":
            info.push(rule.message);
            break;
        }
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
      info,
      passedRules,
      failedRules,
    };
  }

  // Simple validation (legacy compatibility)
  public validate(value: number, systemId: string): boolean {
    return this.validateDetailed(value, systemId).isValid;
  }

  // Batch validation
  public validateBatch(
    grades: Array<{ value: number; systemId: string }>,
  ): Array<{
    value: number;
    systemId: string;
    isValid: boolean;
    errors: string[];
  }> {
    return grades.map((grade) => ({
      ...grade,
      ...this.validateDetailed(grade.value, grade.systemId),
    }));
  }
}

export class GradeFormatter {
  constructor(private systems: NotationSystem[]) {}

  // Format grade with advanced options
  public format(
    value: number,
    systemId: string,
    options: GradeFormatOptions = {},
  ): FormattedGrade {
    const system = this.systems.find((s) => s.id === systemId);

    if (!system) {
      return {
        display: "N/A",
        raw: value,
        system: {} as NotationSystem,
        isValid: false,
      };
    }

    const isValid = system.validateGrade(value);
    const display = this.formatDisplay(value, system, options);
    const color = this.getGradeColor(value, system);
    const description = this.getGradeDescription(value, system);
    const category = this.getGradeCategory(value, system);

    return {
      display,
      raw: value,
      system,
      isValid,
      color: options.colorCoded ? color : undefined,
      description: options.showDescription ? description : undefined,
      category,
    };
  }

  // Create display string
  private formatDisplay(
    value: number,
    system: NotationSystem,
    options: GradeFormatOptions,
  ): string {
    if (!system.validateGrade(value)) {
      return "Non évalué";
    }

    let display = system.formatDisplay(value, options.locale || "fr-FR");

    if (options.showSystemName && !options.compact) {
      display += ` (${system.name})`;
    }

    return display;
  }

  // Get color for grade
  private getGradeColor(value: number, system: NotationSystem): string {
    const rules = system.rules as any;

    // Use system-defined colors if available
    if (rules.colorCoding && rules.colorCoding[Math.round(value)]) {
      return rules.colorCoding[Math.round(value)];
    }

    // Calculate based on percentage
    const percentage =
      ((value - system.minValue) / (system.maxValue - system.minValue)) * 100;

    if (percentage >= 85) return "#22c55e"; // green-500
    if (percentage >= 70) return "#3b82f6"; // blue-500
    if (percentage >= 50) return "#f59e0b"; // amber-500
    return "#ef4444"; // red-500
  }

  // Get grade description
  private getGradeDescription(value: number, system: NotationSystem): string {
    const rules = system.rules as any;
    const roundedValue = Math.round(value);

    // Check for level descriptions (competency systems)
    if (rules.levelDescriptions && rules.levelDescriptions[roundedValue]) {
      return rules.levelDescriptions[roundedValue];
    }

    // Check for grade labels
    if (rules.gradeLabels && rules.gradeLabels[roundedValue]) {
      return rules.gradeLabels[roundedValue];
    }

    // Check for competency levels
    if (rules.competencyLevels && rules.competencyLevels[roundedValue]) {
      return rules.competencyLevels[roundedValue];
    }

    // Fallback to percentage-based description
    const percentage =
      ((value - system.minValue) / (system.maxValue - system.minValue)) * 100;

    if (percentage >= 90) return "Excellent";
    if (percentage >= 80) return "Très bien";
    if (percentage >= 70) return "Bien";
    if (percentage >= 60) return "Assez bien";
    if (percentage >= 50) return "Passable";
    return "Insuffisant";
  }

  // Get grade category
  private getGradeCategory(value: number, system: NotationSystem): string {
    const rules = system.rules as any;

    // Check passing thresholds
    if (rules.passingGrade && value >= rules.passingGrade) {
      if (rules.excellentGrade && value >= rules.excellentGrade) {
        return "excellent";
      }
      return "passing";
    }

    if (rules.passingLevel && value >= rules.passingLevel) {
      return "acquired";
    }

    return "failing";
  }

  // Format multiple grades in a consistent way
  public formatBatch(
    grades: Array<{ value: number; systemId: string }>,
    options: GradeFormatOptions = {},
  ): FormattedGrade[] {
    return grades.map((grade) =>
      this.format(grade.value, grade.systemId, options),
    );
  }

  // Format grade for specific contexts
  public formatForContext(
    value: number,
    systemId: string,
    context: "display" | "export" | "print" | "comparison",
  ): string {
    const system = this.systems.find((s) => s.id === systemId);
    if (!system) return "N/A";

    switch (context) {
      case "display":
        return this.format(value, systemId, {
          colorCoded: true,
          showDescription: false,
        }).display;

      case "export":
        return `${value} (${system.name})`;

      case "print":
        return this.format(value, systemId, {
          showSystemName: true,
          showDescription: true,
        }).display;

      case "comparison":
        const percentage =
          ((value - system.minValue) / (system.maxValue - system.minValue)) *
          100;
        return `${system.formatDisplay(value, "fr-FR")} (${percentage.toFixed(1)}%)`;

      default:
        return system.formatDisplay(value, "fr-FR");
    }
  }

  // Get grade statistics formatting
  public formatStatistics(
    grades: number[],
    systemId: string,
  ): {
    average: string;
    median: string;
    min: string;
    max: string;
    distribution: Record<string, { count: number; label: string }>;
  } {
    const system = this.systems.find((s) => s.id === systemId);
    if (!system) {
      return {
        average: "N/A",
        median: "N/A",
        min: "N/A",
        max: "N/A",
        distribution: {},
      };
    }

    const validGrades = grades.filter((g) => system.validateGrade(g));
    if (validGrades.length === 0) {
      return {
        average: "Aucune note",
        median: "Aucune note",
        min: "Aucune note",
        max: "Aucune note",
        distribution: {},
      };
    }

    const sorted = [...validGrades].sort((a, b) => a - b);
    const average =
      validGrades.reduce((sum, g) => sum + g, 0) / validGrades.length;
    const median =
      sorted.length % 2 === 0
        ? (sorted[sorted.length / 2 - 1] + sorted[sorted.length / 2]) / 2
        : sorted[Math.floor(sorted.length / 2)];

    const distribution: Record<string, { count: number; label: string }> = {};

    // Create distribution based on system type
    validGrades.forEach((grade) => {
      const category = this.getGradeCategory(grade, system);
      if (!distribution[category]) {
        distribution[category] = { count: 0, label: category };
      }
      distribution[category].count++;
    });

    return {
      average: system.formatDisplay(average, "fr-FR"),
      median: system.formatDisplay(median, "fr-FR"),
      min: system.formatDisplay(sorted[0], "fr-FR"),
      max: system.formatDisplay(sorted[sorted.length - 1], "fr-FR"),
      distribution,
    };
  }
}
