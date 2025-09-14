import type { AcademicStructure, AcademicPeriod, SchoolYear } from "@/types/uml-entities";

interface PeriodCalculationOptions {
  schoolYear: SchoolYear;
  academicStructure: AcademicStructure;
  teacherId: string;
}

interface GeneratedPeriod {
  name: string;
  order: number;
  startDate: Date;
  endDate: Date;
}

/**
 * Service pour calculer et générer automatiquement les périodes académiques
 * à partir d'une structure académique et d'une année scolaire
 */
export class PeriodCalculator {
  /**
   * Génère les périodes académiques automatiquement
   */
  static generatePeriods(options: PeriodCalculationOptions): AcademicPeriod[] {
    const { schoolYear, academicStructure, teacherId } = options;

    const periods = this.calculatePeriodDates(
      schoolYear.startDate,
      schoolYear.endDate,
      academicStructure.periodsPerYear
    );

    return periods.map((period, index) => {
      const order = index + 1;
      const periodName = (academicStructure.periodNames[order.toString()] as string) || `Période ${order}`;

      return {
        id: `period-${academicStructure.periodModel}-${order}-${schoolYear.id}`,
        createdBy: teacherId,
        schoolYearId: schoolYear.id,
        name: periodName,
        order,
        startDate: period.startDate,
        endDate: period.endDate,
        isActive: this.isCurrentPeriod(period.startDate, period.endDate),
        createdAt: new Date(),
        updatedAt: new Date(),
        contains: (date: Date) => date >= period.startDate && date <= period.endDate,
      };
    });
  }

  /**
   * Calcule les dates de début et fin pour chaque période
   */
  private static calculatePeriodDates(
    schoolYearStart: Date,
    schoolYearEnd: Date,
    periodsCount: number
  ): GeneratedPeriod[] {
    const periods: GeneratedPeriod[] = [];
    const totalDays = Math.floor((schoolYearEnd.getTime() - schoolYearStart.getTime()) / (1000 * 60 * 60 * 24));
    const baseDaysPerPeriod = Math.floor(totalDays / periodsCount);
    const remainingDays = totalDays % periodsCount;

    let currentStartDate = new Date(schoolYearStart);

    for (let i = 0; i < periodsCount; i++) {
      const order = i + 1;

      // Distribuer les jours restants sur les premières périodes
      const daysInThisPeriod = baseDaysPerPeriod + (i < remainingDays ? 1 : 0);

      const startDate = new Date(currentStartDate);
      const endDate = new Date(currentStartDate);
      endDate.setDate(endDate.getDate() + daysInThisPeriod - 1);

      // S'assurer que la dernière période se termine exactement à la fin de l'année scolaire
      if (i === periodsCount - 1) {
        endDate.setTime(schoolYearEnd.getTime());
      }

      periods.push({
        name: `Période ${order}`,
        order,
        startDate,
        endDate,
      });

      // Préparer la date de début de la période suivante
      currentStartDate = new Date(endDate);
      currentStartDate.setDate(currentStartDate.getDate() + 1);
    }

    return periods;
  }

  /**
   * Vérifie si une période est actuellement active
   */
  private static isCurrentPeriod(startDate: Date, endDate: Date): boolean {
    const now = new Date();
    return now >= startDate && now <= endDate;
  }

  /**
   * Génère des périodes avec des dates personnalisées (pour les templates prédéfinis)
   */
  static generatePeriodsWithCustomDates(
    options: PeriodCalculationOptions,
    customDates: Array<{ start: string; end: string }>
  ): AcademicPeriod[] {
    const { schoolYear, academicStructure, teacherId } = options;

    return customDates.map((dateRange, index) => {
      const order = index + 1;
      const periodName = (academicStructure.periodNames[order.toString()] as string) || `Période ${order}`;
      const startDate = new Date(dateRange.start);
      const endDate = new Date(dateRange.end);

      return {
        id: `period-${academicStructure.periodModel}-${order}-${schoolYear.id}`,
        createdBy: teacherId,
        schoolYearId: schoolYear.id,
        name: periodName,
        order,
        startDate,
        endDate,
        isActive: this.isCurrentPeriod(startDate, endDate),
        createdAt: new Date(),
        updatedAt: new Date(),
        contains: (date: Date) => date >= startDate && date <= endDate,
      };
    });
  }

  /**
   * Valide qu'une structure académique peut être appliquée à une année scolaire
   */
  static validateStructureForSchoolYear(
    academicStructure: AcademicStructure,
    schoolYear: SchoolYear
  ): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    // Vérifier que l'année scolaire est suffisamment longue
    const totalDays = Math.floor(
      (schoolYear.endDate.getTime() - schoolYear.startDate.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (totalDays < academicStructure.periodsPerYear * 7) {
      errors.push(
        `L'année scolaire (${totalDays} jours) est trop courte pour ${academicStructure.periodsPerYear} périodes`
      );
    }

    // Vérifier que tous les noms de périodes sont définis
    for (let i = 1; i <= academicStructure.periodsPerYear; i++) {
      if (!academicStructure.periodNames[i.toString()]) {
        errors.push(`Le nom de la période ${i} n'est pas défini`);
      }
    }

    return { isValid: errors.length === 0, errors };
  }

  /**
   * Calcule les statistiques d'une structure appliquée à une année scolaire
   */
  static calculateStructureStats(
    academicStructure: AcademicStructure,
    schoolYear: SchoolYear
  ): {
    totalDays: number;
    averageDaysPerPeriod: number;
    periodsInfo: Array<{
      name: string;
      days: number;
      percentage: number;
    }>;
  } {
    const totalDays = Math.floor(
      (schoolYear.endDate.getTime() - schoolYear.startDate.getTime()) / (1000 * 60 * 60 * 24)
    );

    const periods = this.calculatePeriodDates(
      schoolYear.startDate,
      schoolYear.endDate,
      academicStructure.periodsPerYear
    );

    const periodsInfo = periods.map((period, index) => {
      const days = Math.floor(
        (period.endDate.getTime() - period.startDate.getTime()) / (1000 * 60 * 60 * 24)
      ) + 1;

      const order = index + 1;
      const name = (academicStructure.periodNames[order.toString()] as string) || `Période ${order}`;

      return {
        name,
        days,
        percentage: Math.round((days / totalDays) * 100),
      };
    });

    return {
      totalDays,
      averageDaysPerPeriod: Math.round(totalDays / academicStructure.periodsPerYear),
      periodsInfo,
    };
  }

  /**
   * Trouve la période académique active pour une date donnée
   */
  static findActivePeriod(periods: AcademicPeriod[], date: Date = new Date()): AcademicPeriod | null {
    return periods.find(period => period.contains(date)) || null;
  }

  /**
   * Obtient la prochaine période académique
   */
  static getNextPeriod(periods: AcademicPeriod[], currentDate: Date = new Date()): AcademicPeriod | null {
    const sortedPeriods = periods.sort((a, b) => a.order - b.order);
    return sortedPeriods.find(period => period.startDate > currentDate) || null;
  }

  /**
   * Obtient la période académique précédente
   */
  static getPreviousPeriod(periods: AcademicPeriod[], currentDate: Date = new Date()): AcademicPeriod | null {
    const sortedPeriods = periods.sort((a, b) => b.order - a.order);
    return sortedPeriods.find(period => period.endDate < currentDate) || null;
  }
}