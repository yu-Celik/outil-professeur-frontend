import type { Exam, NotationSystem } from "@/types/uml-entities";

const roundToTwo = (value: number) => Math.round(value * 100) / 100;

export function calculateGradeFromPoints(
  points: number,
  exam: Exam,
  system: NotationSystem,
): number {
  const total = exam.totalPoints || 0;
  if (total <= 0) return roundToTwo(points);

  const clampedPoints = Math.max(0, Math.min(total, points));
  const range = system.maxValue - system.minValue;
  if (range <= 0) return roundToTwo(clampedPoints);

  const ratio = clampedPoints / total;
  const grade = system.minValue + ratio * range;
  return roundToTwo(grade);
}

export function calculatePointsFromGrade(
  grade: number,
  exam: Exam,
  system: NotationSystem,
): number {
  const range = system.maxValue - system.minValue;
  if (range <= 0 || exam.totalPoints <= 0) return roundToTwo(grade);

  const clampedGrade = Math.max(
    system.minValue,
    Math.min(system.maxValue, grade),
  );
  const ratio = (clampedGrade - system.minValue) / range;
  const points = ratio * exam.totalPoints;
  return roundToTwo(points);
}

export function formatGradeDisplay(
  grade: number,
  system: NotationSystem,
  locale: string,
): string {
  return system.formatDisplay(grade, locale);
}
