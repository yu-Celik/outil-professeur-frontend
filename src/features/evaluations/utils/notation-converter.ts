"use client";

import type { NotationSystem } from "@/types/uml-entities";

export interface ConversionOptions {
  preservePrecision?: boolean;
  roundingMode?: "nearest" | "floor" | "ceil";
  allowPartialConversion?: boolean;
}

export interface ConversionResult {
  value: number;
  isExact: boolean;
  confidence: number;
  originalValue: number;
  fromSystem: string;
  toSystem: string;
  conversionPath?: string[];
}

export interface GradeValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  normalizedValue?: number;
}

export class NotationConverter {
  private conversionMatrix: Map<
    string,
    Map<string, (value: number) => number>
  > = new Map();

  constructor(private systems: NotationSystem[]) {
    this.buildConversionMatrix();
  }

  // Build optimized conversion matrix for all systems
  private buildConversionMatrix(): void {
    this.systems.forEach((fromSystem) => {
      const fromMap = new Map<string, (value: number) => number>();

      this.systems.forEach((toSystem) => {
        if (fromSystem.id !== toSystem.id) {
          fromMap.set(
            toSystem.id,
            this.createDirectConversion(fromSystem, toSystem),
          );
        }
      });

      this.conversionMatrix.set(fromSystem.id, fromMap);
    });
  }

  // Create direct conversion function between two systems
  private createDirectConversion(
    from: NotationSystem,
    to: NotationSystem,
  ): (value: number) => number {
    return (value: number): number => {
      // Handle special cases based on scale types
      if (from.scaleType === to.scaleType) {
        return this.convertSameType(value, from, to);
      }

      // Cross-type conversion
      return this.convertDifferentTypes(value, from, to);
    };
  }

  // Convert between systems of the same type
  private convertSameType(
    value: number,
    from: NotationSystem,
    to: NotationSystem,
  ): number {
    const ratio = (to.maxValue - to.minValue) / (from.maxValue - from.minValue);
    const converted = (value - from.minValue) * ratio + to.minValue;

    // Apply precision based on target system
    if (to.scaleType === "numeric") {
      const precision = (to.rules as any).precision || 1;
      return Math.round(converted / precision) * precision;
    }

    return Math.round(converted);
  }

  // Convert between systems of different types
  private convertDifferentTypes(
    value: number,
    from: NotationSystem,
    to: NotationSystem,
  ): number {
    // First normalize to percentage (0-100)
    const percentage = this.normalizeToPercentage(value, from);

    // Then convert from percentage to target system
    return this.percentageToSystem(percentage, to);
  }

  // Normalize any grade to percentage
  private normalizeToPercentage(value: number, system: NotationSystem): number {
    const range = system.maxValue - system.minValue;
    return ((value - system.minValue) / range) * 100;
  }

  // Convert percentage to specific system
  private percentageToSystem(
    percentage: number,
    system: NotationSystem,
  ): number {
    const range = system.maxValue - system.minValue;
    const converted = (percentage / 100) * range + system.minValue;

    switch (system.scaleType) {
      case "letter":
        return this.convertToLetter(percentage, system);
      case "competency":
        return this.convertToCompetency(percentage, system);
      case "custom":
        return this.convertToCustom(percentage, system);
      default:
        return Math.round(converted * 100) / 100;
    }
  }

  // Convert percentage to letter grade
  private convertToLetter(percentage: number, system: NotationSystem): number {
    const rules = system.rules as any;

    if (rules.letterMappings) {
      // Use threshold-based mapping
      const mappings = Object.entries(rules.letterMappings)
        .map(([letter, data]: [string, any]) => ({ letter, ...data }))
        .sort((a, b) => (b.threshold || 0) - (a.threshold || 0));

      for (const mapping of mappings) {
        if (percentage >= (mapping.threshold || 0)) {
          return mapping.value;
        }
      }
    }

    // Fallback to simple range-based conversion
    const range = system.maxValue - system.minValue;
    return Math.round((percentage / 100) * range + system.minValue);
  }

  // Convert percentage to competency level
  private convertToCompetency(
    percentage: number,
    system: NotationSystem,
  ): number {
    const rules = system.rules as any;
    const passingLevel = rules.passingLevel || 2;

    // Map percentage to competency levels
    if (percentage >= 85) return system.maxValue; // Expert
    if (percentage >= 70) return passingLevel; // Acquired
    if (percentage >= 50) return passingLevel - 1; // In progress
    return system.minValue; // Not acquired
  }

  // Convert percentage to custom system
  private convertToCustom(percentage: number, system: NotationSystem): number {
    const rules = system.rules as any;
    const range = system.maxValue - system.minValue;
    const converted = (percentage / 100) * range + system.minValue;

    if (rules.precision) {
      return Math.round(converted / rules.precision) * rules.precision;
    }

    return Math.round(converted);
  }

  // Main conversion method with advanced features
  public convert(
    value: number,
    fromSystemId: string,
    toSystemId: string,
    options: ConversionOptions = {},
  ): ConversionResult {
    const fromSystem = this.systems.find((s) => s.id === fromSystemId);
    const toSystem = this.systems.find((s) => s.id === toSystemId);

    if (!fromSystem || !toSystem) {
      throw new Error("Système de notation non trouvé");
    }

    const converter = this.conversionMatrix.get(fromSystemId)?.get(toSystemId);
    if (!converter) {
      throw new Error("Conversion impossible entre ces systèmes");
    }

    const convertedValue = converter(value);
    const confidence = this.calculateConfidence(value, fromSystem, toSystem);
    const isExact = this.isExactConversion(fromSystem, toSystem);

    return {
      value: convertedValue,
      isExact,
      confidence,
      originalValue: value,
      fromSystem: fromSystemId,
      toSystem: toSystemId,
    };
  }

  // Calculate conversion confidence
  private calculateConfidence(
    value: number,
    from: NotationSystem,
    to: NotationSystem,
  ): number {
    // Same type conversions are more reliable
    if (from.scaleType === to.scaleType) return 0.95;

    // Numeric to numeric is highly reliable
    if (from.scaleType === "numeric" && to.scaleType === "numeric") return 0.9;

    // Letter to competency or vice versa has moderate reliability
    if (
      (from.scaleType === "letter" && to.scaleType === "competency") ||
      (from.scaleType === "competency" && to.scaleType === "letter")
    )
      return 0.7;

    // Custom conversions are less reliable
    if (from.scaleType === "custom" || to.scaleType === "custom") return 0.6;

    return 0.8;
  }

  // Check if conversion is exact (no data loss)
  private isExactConversion(from: NotationSystem, to: NotationSystem): boolean {
    // Same type with compatible ranges
    if (from.scaleType === to.scaleType) {
      const fromRange = from.maxValue - from.minValue;
      const toRange = to.maxValue - to.minValue;
      return fromRange <= toRange;
    }

    return false;
  }

  // Comprehensive grade validation
  public validateGrade(value: number, systemId: string): GradeValidationResult {
    const system = this.systems.find((s) => s.id === systemId);

    if (!system) {
      return {
        isValid: false,
        errors: ["Système de notation non trouvé"],
        warnings: [],
      };
    }

    const errors: string[] = [];
    const warnings: string[] = [];

    // Basic range validation
    if (value < system.minValue || value > system.maxValue) {
      errors.push(
        `La note doit être entre ${system.minValue} et ${system.maxValue}`,
      );
    }

    // Type-specific validation
    switch (system.scaleType) {
      case "numeric":
        this.validateNumericGrade(value, system, errors, warnings);
        break;
      case "letter":
        this.validateLetterGrade(value, system, errors, warnings);
        break;
      case "competency":
        this.validateCompetencyGrade(value, system, errors, warnings);
        break;
      case "custom":
        this.validateCustomGrade(value, system, errors, warnings);
        break;
    }

    // Check if value is valid using system's built-in validation
    if (!system.validateGrade(value)) {
      errors.push("Note invalide selon les règles du système");
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
      normalizedValue: this.normalizeGrade(value, system),
    };
  }

  // Validate numeric grades
  private validateNumericGrade(
    value: number,
    system: NotationSystem,
    errors: string[],
    warnings: string[],
  ): void {
    const rules = system.rules as any;

    if (rules.precision) {
      const remainder = (value * (1 / rules.precision)) % 1;
      if (remainder !== 0) {
        errors.push(`La note doit être un multiple de ${rules.precision}`);
      }
    }

    if (rules.passingGrade && value < rules.passingGrade) {
      warnings.push("Note en dessous du seuil de réussite");
    }
  }

  // Validate letter grades
  private validateLetterGrade(
    value: number,
    system: NotationSystem,
    errors: string[],
    warnings: string[],
  ): void {
    if (value % 1 !== 0) {
      errors.push("Les notes par lettres doivent être des entiers");
    }

    const rules = system.rules as any;
    if (rules.gradeLabels && !rules.gradeLabels[value]) {
      warnings.push("Aucune lettre correspondante définie pour cette valeur");
    }
  }

  // Validate competency grades
  private validateCompetencyGrade(
    value: number,
    system: NotationSystem,
    errors: string[],
    warnings: string[],
  ): void {
    if (value % 1 !== 0) {
      errors.push("Les niveaux de compétence doivent être des entiers");
    }

    const rules = system.rules as any;
    if (rules.passingLevel && value < rules.passingLevel) {
      warnings.push("Niveau de compétence non acquis");
    }
  }

  // Validate custom grades
  private validateCustomGrade(
    value: number,
    system: NotationSystem,
    errors: string[],
    warnings: string[],
  ): void {
    const rules = system.rules as any;

    if (rules.precision && (value * (1 / rules.precision)) % 1 !== 0) {
      errors.push(`La note doit être un multiple de ${rules.precision}`);
    }

    if (rules.allowedValues && !rules.allowedValues.includes(value)) {
      errors.push("Valeur non autorisée pour ce système");
    }
  }

  // Normalize grade to standard format
  private normalizeGrade(value: number, system: NotationSystem): number {
    const rules = system.rules as any;

    if (rules.precision) {
      return Math.round(value / rules.precision) * rules.precision;
    }

    if (system.scaleType === "letter" || system.scaleType === "competency") {
      return Math.round(value);
    }

    return Math.round(value * 100) / 100;
  }

  // Batch conversion
  public convertBatch(
    values: number[],
    fromSystemId: string,
    toSystemId: string,
    options: ConversionOptions = {},
  ): ConversionResult[] {
    return values.map((value) =>
      this.convert(value, fromSystemId, toSystemId, options),
    );
  }

  // Get conversion preview/simulation
  public getConversionPreview(
    fromSystemId: string,
    toSystemId: string,
  ): {
    examples: Array<{ from: number; to: number; label: string }>;
    confidence: number;
    isExact: boolean;
  } {
    const fromSystem = this.systems.find((s) => s.id === fromSystemId);
    const toSystem = this.systems.find((s) => s.id === toSystemId);

    if (!fromSystem || !toSystem) {
      throw new Error("Système de notation non trouvé");
    }

    const examples = this.generateConversionExamples(fromSystem, toSystem);
    const confidence = this.calculateConfidence(0, fromSystem, toSystem);
    const isExact = this.isExactConversion(fromSystem, toSystem);

    return { examples, confidence, isExact };
  }

  // Generate example conversions for preview
  private generateConversionExamples(
    from: NotationSystem,
    to: NotationSystem,
  ): Array<{ from: number; to: number; label: string }> {
    const examples: Array<{ from: number; to: number; label: string }> = [];
    const range = from.maxValue - from.minValue;
    const steps = Math.min(5, range + 1);

    for (let i = 0; i < steps; i++) {
      const value = from.minValue + (range * i) / (steps - 1);
      const converted = this.convert(value, from.id, to.id).value;

      examples.push({
        from: value,
        to: converted,
        label: this.getGradeLabel(value, from),
      });
    }

    return examples;
  }

  // Get grade label for display
  private getGradeLabel(value: number, system: NotationSystem): string {
    const rules = system.rules as any;

    if (rules.gradeLabels) {
      return rules.gradeLabels[Math.round(value)] || "";
    }

    if (rules.competencyLevels) {
      return rules.competencyLevels[Math.round(value)] || "";
    }

    return system.formatDisplay(value, "fr-FR");
  }
}
