import type { StudentParticipation } from "@/types/uml-entities";
import {
  studentAlertsClient,
  type AttendanceRateResponse,
  type ClassAnalyticsParams,
  type ClassStudentAnalyticsResponse,
  type ClassStudentSummary,
  type ParticipationAverageResponse,
  type StudentExamResultsListResponse,
  type StudentProfileResponse,
  type AtRiskStudentResponse,
  type DateRangeInfo,
} from "../api/student-alerts-client";
import { BehavioralAnalysisService } from "./behavioral-analysis-service";

export type StudentAlertType =
  | "attendance"
  | "grade_drop"
  | "participation"
  | "behavior";

export type StudentAlertSeverity = "low" | "medium" | "high";

export interface StudentAlertMetrics {
  attendance?: {
    rate: number | null;
    percentage: number | null;
    totalSessions: number | null;
    attendedSessions: number | null;
  };
  participation?: {
    average: number | null;
    sampleSize: number;
    coveragePercentage: number | null;
  };
  grades?: {
    recentAverage: number | null;
    periodAverage: number | null;
    delta: number | null;
    sampleSize: number;
  };
  behavior?: {
    incidents: number | null;
    windowDays: number;
    riskFactors: string[];
  };
  analyticsPeriod?: DateRangeInfo | null;
}

export interface StudentAlert {
  id: string;
  studentId: string;
  studentName: string;
  classId: string;
  className?: string;
  type: StudentAlertType;
  severity: StudentAlertSeverity;
  message: string;
  metrics: StudentAlertMetrics;
  detectedAt: string;
  sources: string[];
}

export interface StudentAlertsResult {
  classId: string;
  className?: string;
  alerts: StudentAlert[];
  evaluatedAt: string;
  studentIds: string[];
  analyticsPeriod?: DateRangeInfo | null;
  totalStudentsEvaluated: number;
}

const CACHE_TTL_MS = 60_000;
const LOW_ATTENDANCE_THRESHOLD = 0.75;
const ATTENDANCE_CRITICAL_THRESHOLD = 0.6;
const PARTICIPATION_LOW_THRESHOLD = 2.5;
const PARTICIPATION_CRITICAL_THRESHOLD = 1.5;
const MIN_PARTICIPATION_SAMPLE = 5;
const GRADE_DECLINE_GAP = 2;
const GRADE_CRITICAL_GAP = 4;
const BEHAVIOR_INCIDENT_THRESHOLD = 3;
const BEHAVIOR_CRITICAL_THRESHOLD = 5;
const BEHAVIOR_WINDOW_DAYS = 14;
const LOG_SCOPE = "[StudentAlertsService]";

interface CacheEntry {
  expiresAt: number;
  result: StudentAlertsResult;
}

const cache = new Map<string, CacheEntry>();

interface AlertEvaluationContext {
  classId: string;
  className?: string;
  analyticsPeriod?: DateRangeInfo | null;
  summary: ClassStudentSummary;
  riskEntry?: AtRiskStudentResponse;
  attendance?: AttendanceRateResponse | null;
  participation?: ParticipationAverageResponse | null;
  examResults?: StudentExamResultsListResponse | null;
  profile?: StudentProfileResponse | null;
  participations?: StudentParticipation[];
}

function toRatio(value: number | null | undefined): number | null {
  if (value == null) {
    return null;
  }

  if (value > 1) {
    return value / 100;
  }

  return value;
}

function average(values: number[]): number | null {
  if (!values.length) {
    return null;
  }

  const sum = values.reduce((acc, value) => acc + value, 0);
  return sum / values.length;
}

async function safeCall<T>(promise: Promise<T>): Promise<T | null> {
  try {
    return await promise;
  } catch (error) {
    console.warn(`${LOG_SCOPE} call failed`, error);
    return null;
  }
}

async function loadParticipations(
  studentId: string,
): Promise<StudentParticipation[]> {
  try {
    const module = await import(
      "@/features/students/mocks/mock-student-participation"
    );
    if (module?.getParticipationsForAnalysis) {
      return module.getParticipationsForAnalysis(studentId);
    }
  } catch (error) {
    console.warn(`${LOG_SCOPE} participation fallback failed`, error);
  }

  return [];
}

function buildCacheKey(
  classId: string,
  params?: Pick<ClassAnalyticsParams, "start_date" | "end_date">,
): string {
  const start = params?.start_date ?? "default";
  const end = params?.end_date ?? "default";
  return `${classId}|${start}|${end}`;
}

function parseBehaviorIncidents(riskFactors: string[]): number | null {
  let incidents: number | null = null;

  riskFactors.forEach((factor) => {
    const match = factor.match(/behavior.*?(\d+)/i);
    if (match) {
      const count = Number.parseInt(match[1], 10);
      if (!Number.isNaN(count)) {
        incidents = Math.max(incidents ?? 0, count);
      }
    } else if (factor.toLowerCase().includes("behavior")) {
      incidents = Math.max(incidents ?? 0, BEHAVIOR_INCIDENT_THRESHOLD);
    }
  });

  return incidents;
}

function createAlert(
  context: AlertEvaluationContext,
  partial: Omit<StudentAlert, "id" | "studentId" | "studentName" | "classId">,
): StudentAlert {
  const { summary, classId, className } = context;
  return {
    id: `${summary.student_id}-${partial.type}`,
    studentId: summary.student_id,
    studentName: summary.full_name,
    classId,
    className,
    ...partial,
  };
}

function evaluateAttendanceAlert(
  context: AlertEvaluationContext,
): StudentAlert | null {
  const attendancePercentage =
    context.attendance?.attendance_rate ?? context.summary.attendance_rate;

  if (attendancePercentage == null) {
    return null;
  }

  const ratio = toRatio(attendancePercentage);
  if (ratio == null) {
    return null;
  }

  if (ratio >= LOW_ATTENDANCE_THRESHOLD) {
    return null;
  }

  const severity: StudentAlertSeverity =
    ratio < ATTENDANCE_CRITICAL_THRESHOLD ? "high" : "medium";

  const alert = createAlert(context, {
    type: "attendance",
    severity,
    message: `Présence à ${Math.round(ratio * 100)} % (seuil 75 %)`,
    metrics: {
      attendance: {
        rate: ratio,
        percentage: Math.round(ratio * 100 * 100) / 100,
        totalSessions:
          context.attendance?.total_sessions ??
          context.summary.session_counts.total_sessions ??
          null,
        attendedSessions:
          context.attendance?.attended_sessions ??
          context.summary.session_counts.attended_sessions ??
          null,
      },
      analyticsPeriod: context.analyticsPeriod,
    },
    detectedAt: new Date().toISOString(),
    sources: ["attendance_rate"],
  });

  console.info(`${LOG_SCOPE} attendance alert detected`, {
    studentId: alert.studentId,
    rate: alert.metrics.attendance?.rate,
    severity: alert.severity,
  });

  return alert;
}

function evaluateParticipationAlert(
  context: AlertEvaluationContext,
): StudentAlert | null {
  const participationAverage =
    context.participation?.participation_average ??
    context.summary.participation_average;

  if (participationAverage == null) {
    return null;
  }

  const sampleSize =
    context.participation?.total_sessions_with_participation ??
    context.summary.session_counts.sessions_with_participation ??
    0;

  if (sampleSize < MIN_PARTICIPATION_SAMPLE) {
    return null;
  }

  if (participationAverage >= PARTICIPATION_LOW_THRESHOLD) {
    return null;
  }

  const severity: StudentAlertSeverity =
    participationAverage < PARTICIPATION_CRITICAL_THRESHOLD ? "high" : "medium";

  const alert = createAlert(context, {
    type: "participation",
    severity,
    message: `Participation moyenne ${participationAverage.toFixed(1)} (< ${PARTICIPATION_LOW_THRESHOLD})`,
    metrics: {
      participation: {
        average: participationAverage,
        sampleSize,
        coveragePercentage: context.participation?.coverage_percentage ?? null,
      },
      analyticsPeriod: context.analyticsPeriod,
    },
    detectedAt: new Date().toISOString(),
    sources: ["participation_average"],
  });

  console.info(`${LOG_SCOPE} participation alert detected`, {
    studentId: alert.studentId,
    average: alert.metrics.participation?.average,
    severity: alert.severity,
  });

  return alert;
}

function evaluateGradeAlert(
  context: AlertEvaluationContext,
): StudentAlert | null {
  const periodAverage = context.profile?.analytics.average_grade;
  const results = context.examResults?.items ?? [];

  if (periodAverage == null || !results.length) {
    return null;
  }

  const sorted = [...results].sort(
    (a, b) => new Date(b.exam_date).getTime() - new Date(a.exam_date).getTime(),
  );

  const recent = sorted
    .filter(
      (item) =>
        !item.is_absent &&
        item.points_obtained != null &&
        item.max_points != null &&
        item.max_points > 0,
    )
    .slice(0, 3);

  if (!recent.length) {
    return null;
  }

  const normalizedGrades = recent.map((item) => {
    const maxPoints = item.max_points ?? 20;
    const points = item.points_obtained ?? 0;
    return (points / maxPoints) * 20;
  });

  const recentAverage = average(normalizedGrades);

  if (recentAverage == null) {
    return null;
  }

  const delta = recentAverage - periodAverage;

  if (periodAverage - recentAverage < GRADE_DECLINE_GAP) {
    return null;
  }

  const severity: StudentAlertSeverity =
    periodAverage - recentAverage >= GRADE_CRITICAL_GAP ? "high" : "medium";

  const alert = createAlert(context, {
    type: "grade_drop",
    severity,
    message: `Moyenne récents examens ${recentAverage.toFixed(1)}/20 (Δ ${(delta).toFixed(1)} vs période)`,
    metrics: {
      grades: {
        recentAverage: Math.round(recentAverage * 100) / 100,
        periodAverage: Math.round(periodAverage * 100) / 100,
        delta: Math.round(delta * 100) / 100,
        sampleSize: recent.length,
      },
      analyticsPeriod: context.analyticsPeriod,
    },
    detectedAt: new Date().toISOString(),
    sources: ["exam_results", "student_profile"],
  });

  console.info(`${LOG_SCOPE} grade decline alert detected`, {
    studentId: alert.studentId,
    periodAverage,
    recentAverage,
    severity: alert.severity,
  });

  return alert;
}

function evaluateBehaviorAlert(
  context: AlertEvaluationContext,
): StudentAlert | null {
  const riskFactors = context.riskEntry?.risk_factors ?? [];
  const incidentsFromRisk = parseBehaviorIncidents(riskFactors);

  let incidentCount = incidentsFromRisk ?? 0;

  // Fallback: derive incidents from behavioral alerts if available
  if (!incidentsFromRisk && context.participations?.length) {
    const behavioralAlerts = BehavioralAnalysisService.detectBehavioralAlerts(
      context.participations,
    );

    const behaviorAlert = behavioralAlerts.find(
      (alert) => alert.type === "behavioral_change",
    );

    if (behaviorAlert) {
      incidentCount = BEHAVIOR_INCIDENT_THRESHOLD;
    }
  }

  if (incidentCount < BEHAVIOR_INCIDENT_THRESHOLD) {
    return null;
  }

  const severity: StudentAlertSeverity =
    incidentCount >= BEHAVIOR_CRITICAL_THRESHOLD ? "high" : "medium";

  const alert = createAlert(context, {
    type: "behavior",
    severity,
    message: `Comportements négatifs signalés (${incidentCount} sur ${BEHAVIOR_WINDOW_DAYS} jours)`,
    metrics: {
      behavior: {
        incidents: incidentCount,
        windowDays: BEHAVIOR_WINDOW_DAYS,
        riskFactors,
      },
      analyticsPeriod: context.analyticsPeriod,
    },
    detectedAt: new Date().toISOString(),
    sources: ["class_analytics"],
  });

  console.info(`${LOG_SCOPE} behavior alert detected`, {
    studentId: alert.studentId,
    incidents: incidentCount,
    severity: alert.severity,
  });

  return alert;
}

async function hydrateStudentContext(
  analytics: ClassStudentAnalyticsResponse,
  summary: ClassStudentSummary,
  params?: ClassAnalyticsParams,
): Promise<AlertEvaluationContext> {
  const { class_statistics: stats } = analytics;
  const riskEntry = stats.at_risk_students.find(
    (entry) => entry.student_id === summary.student_id,
  );

  const [attendance, participation, examResults, profile, participations] =
    await Promise.all([
      safeCall(
        studentAlertsClient.getAttendanceRate(summary.student_id, {
          start_date:
            params?.start_date ?? analytics.analytics_period.start_date,
          end_date: params?.end_date ?? analytics.analytics_period.end_date,
        }),
      ),
      safeCall(
        studentAlertsClient.getParticipationAverage(summary.student_id, {
          start_date:
            params?.start_date ?? analytics.analytics_period.start_date,
          end_date: params?.end_date ?? analytics.analytics_period.end_date,
        }),
      ),
      safeCall(
        studentAlertsClient.getStudentResults(summary.student_id, {
          date_from:
            params?.start_date ?? analytics.analytics_period.start_date,
          date_to: params?.end_date ?? analytics.analytics_period.end_date,
          limit: 10,
        }),
      ),
      safeCall(studentAlertsClient.getStudentProfile(summary.student_id)),
      loadParticipations(summary.student_id),
    ]);

  return {
    classId: analytics.class_id,
    analyticsPeriod: analytics.analytics_period,
    summary,
    riskEntry: riskEntry ?? undefined,
    attendance,
    participation,
    examResults,
    profile,
    participations,
  };
}

export class StudentAlertsService {
  static async getAlertsForClass(
    classId: string,
    options?: {
      className?: string;
      params?: ClassAnalyticsParams;
      forceRefresh?: boolean;
    },
  ): Promise<StudentAlertsResult> {
    const cacheKey = buildCacheKey(classId, options?.params);
    const cached = cache.get(cacheKey);
    const now = Date.now();

    if (
      cached &&
      cached.expiresAt > now &&
      !options?.forceRefresh &&
      cached.result.className === options?.className
    ) {
      return cached.result;
    }

    const analytics = await studentAlertsClient.getClassStudentAnalytics(
      classId,
      options?.params,
    );

    const contexts = await Promise.all(
      analytics.students.map((summary) =>
        hydrateStudentContext(analytics, summary, options?.params).then(
          (context) => ({
            ...context,
            className: options?.className,
          }),
        ),
      ),
    );

    const alerts = contexts
      .flatMap((context) => [
        evaluateAttendanceAlert(context),
        evaluateParticipationAlert(context),
        evaluateGradeAlert(context),
        evaluateBehaviorAlert(context),
      ])
      .filter((alert): alert is StudentAlert => Boolean(alert));

    const result: StudentAlertsResult = {
      classId,
      className: options?.className,
      alerts,
      evaluatedAt: new Date().toISOString(),
      analyticsPeriod: analytics.analytics_period,
      studentIds: analytics.students.map((student) => student.student_id),
      totalStudentsEvaluated: analytics.students.length,
    };

    cache.set(cacheKey, {
      expiresAt: now + CACHE_TTL_MS,
      result,
    });

    return result;
  }

  static async getAlertsForClasses(
    classIds: Array<{ id: string; name?: string }>,
    options?: { params?: ClassAnalyticsParams; forceRefresh?: boolean },
  ): Promise<StudentAlertsResult[]> {
    return Promise.all(
      classIds.map((item) =>
        this.getAlertsForClass(item.id, {
          className: item.name,
          params: options?.params,
          forceRefresh: options?.forceRefresh,
        }),
      ),
    );
  }

  static invalidateCache(): void {
    cache.clear();
  }

  static invalidateCacheForClass(
    classId: string,
    params?: Pick<ClassAnalyticsParams, "start_date" | "end_date">,
  ): void {
    if (params) {
      cache.delete(buildCacheKey(classId, params));
      return;
    }

    for (const key of cache.keys()) {
      if (key.startsWith(`${classId}|`)) {
        cache.delete(key);
      }
    }
  }

  static invalidateCacheForStudent(studentId: string): void {
    for (const [key, entry] of cache.entries()) {
      if (entry.result.studentIds.includes(studentId)) {
        cache.delete(key);
      }
    }
  }
}
